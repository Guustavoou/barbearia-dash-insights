import { Request, Response } from "express";
import db from "../database/config";
import {
  successResponse,
  errorResponse,
  parsePagination,
  calculateOffset,
  createPaginationInfo,
} from "../utils";
import {
  Client,
  CreateClientDto,
  UpdateClientDto,
  ApiResponse,
} from "../types";

/**
 * Get all clients with pagination and filtering
 */
export async function getClients(req: Request, res: Response) {
  try {
    const { page, limit, sort, order, search } = parsePagination(req.query);
    const offset = calculateOffset(page, limit);

    let whereClause = "WHERE 1=1";
    const params: any[] = [];

    // Search functionality
    if (search) {
      whereClause += " AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Status filter
    if (req.query.status && req.query.status !== "todos") {
      whereClause += " AND status = ?";
      params.push(req.query.status);
    }

    // Count total records
    const countStmt = db.prepare(
      `SELECT COUNT(*) as total FROM clients ${whereClause}`,
    );
    const { total } = countStmt.get(...params) as { total: number };

    // Get clients with pagination
    const validSortFields = [
      "name",
      "last_visit",
      "total_spent",
      "join_date",
      "visits",
    ];
    const sortField = validSortFields.includes(sort) ? sort : "name";
    const orderBy = `ORDER BY ${sortField} ${order}`;

    const stmt = db.prepare(`
      SELECT 
        id, name, email, phone, city, cpf, profession, status, notes,
        join_date, last_visit, total_spent, visits, created_at, updated_at
      FROM clients 
      ${whereClause} 
      ${orderBy}
      LIMIT ? OFFSET ?
    `);

    const clients = stmt.all(...params, limit, offset) as Client[];

    // Transform dates for frontend compatibility
    const transformedClients = clients.map((client) => ({
      ...client,
      lastVisit: client.last_visit ? new Date(client.last_visit) : null,
      joinDate: new Date(client.join_date),
      totalSpent: client.total_spent,
    }));

    const pagination = createPaginationInfo(page, limit, total);

    res.json(
      successResponse(
        transformedClients,
        "Clients retrieved successfully",
        pagination,
      ),
    );
  } catch (error) {
    console.error("Error getting clients:", error);
    res.status(500).json(errorResponse("Failed to get clients"));
  }
}

/**
 * Get a single client by ID
 */
export async function getClientById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const stmt = db.prepare(`
      SELECT 
        id, name, email, phone, city, cpf, profession, status, notes,
        join_date, last_visit, total_spent, visits, created_at, updated_at
      FROM clients 
      WHERE id = ?
    `);

    const client = stmt.get(id) as Client | undefined;

    if (!client) {
      return res.status(404).json(errorResponse("Client not found"));
    }

    // Transform dates for frontend compatibility
    const transformedClient = {
      ...client,
      lastVisit: client.last_visit ? new Date(client.last_visit) : null,
      joinDate: new Date(client.join_date),
      totalSpent: client.total_spent,
    };

    res.json(
      successResponse(transformedClient, "Client retrieved successfully"),
    );
  } catch (error) {
    console.error("Error getting client:", error);
    res.status(500).json(errorResponse("Failed to get client"));
  }
}

/**
 * Create a new client
 */
export async function createClient(req: Request, res: Response) {
  try {
    const clientData: CreateClientDto = req.body;

    // Check if email already exists (if provided)
    if (clientData.email) {
      const existingClient = db
        .prepare("SELECT id FROM clients WHERE email = ?")
        .get(clientData.email);
      if (existingClient) {
        return res.status(400).json(errorResponse("Email already exists"));
      }
    }

    const stmt = db.prepare(`
      INSERT INTO clients (name, email, phone, city, cpf, profession, notes, join_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    const result = stmt.run(
      clientData.name,
      clientData.email || null,
      clientData.phone,
      clientData.city || null,
      clientData.cpf || null,
      clientData.profession || null,
      clientData.notes || null,
    );

    const newClient = db
      .prepare(
        `
      SELECT 
        id, name, email, phone, city, cpf, profession, status, notes,
        join_date, last_visit, total_spent, visits, created_at, updated_at
      FROM clients 
      WHERE id = ?
    `,
      )
      .get(result.lastInsertRowid) as Client;

    // Transform dates for frontend compatibility
    const transformedClient = {
      ...newClient,
      lastVisit: newClient.last_visit ? new Date(newClient.last_visit) : null,
      joinDate: new Date(newClient.join_date),
      totalSpent: newClient.total_spent,
    };

    res
      .status(201)
      .json(successResponse(transformedClient, "Client created successfully"));
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json(errorResponse("Failed to create client"));
  }
}

/**
 * Update a client
 */
export async function updateClient(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData: UpdateClientDto = req.body;

    // Check if client exists
    const existingClient = db
      .prepare("SELECT id FROM clients WHERE id = ?")
      .get(id);
    if (!existingClient) {
      return res.status(404).json(errorResponse("Client not found"));
    }

    // Check if email already exists (if being updated and different from current)
    if (updateData.email) {
      const emailCheck = db
        .prepare("SELECT id FROM clients WHERE email = ? AND id != ?")
        .get(updateData.email, id);
      if (emailCheck) {
        return res.status(400).json(errorResponse("Email already exists"));
      }
    }

    // Build dynamic update query
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(value);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json(errorResponse("No valid fields to update"));
    }

    updateFields.push("updated_at = CURRENT_TIMESTAMP");
    updateValues.push(id);

    const stmt = db.prepare(`
      UPDATE clients 
      SET ${updateFields.join(", ")}
      WHERE id = ?
    `);

    stmt.run(...updateValues);

    // Get updated client
    const updatedClient = db
      .prepare(
        `
      SELECT 
        id, name, email, phone, city, cpf, profession, status, notes,
        join_date, last_visit, total_spent, visits, created_at, updated_at
      FROM clients 
      WHERE id = ?
    `,
      )
      .get(id) as Client;

    // Transform dates for frontend compatibility
    const transformedClient = {
      ...updatedClient,
      lastVisit: updatedClient.last_visit
        ? new Date(updatedClient.last_visit)
        : null,
      joinDate: new Date(updatedClient.join_date),
      totalSpent: updatedClient.total_spent,
    };

    res.json(successResponse(transformedClient, "Client updated successfully"));
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json(errorResponse("Failed to update client"));
  }
}

/**
 * Delete a client
 */
export async function deleteClient(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Check if client exists
    const existingClient = db
      .prepare("SELECT id FROM clients WHERE id = ?")
      .get(id);
    if (!existingClient) {
      return res.status(404).json(errorResponse("Client not found"));
    }

    // Check if client has appointments
    const appointmentCheck = db
      .prepare("SELECT id FROM appointments WHERE client_id = ? LIMIT 1")
      .get(id);
    if (appointmentCheck) {
      return res
        .status(400)
        .json(errorResponse("Cannot delete client with existing appointments"));
    }

    const stmt = db.prepare("DELETE FROM clients WHERE id = ?");
    stmt.run(id);

    res.json(successResponse(null, "Client deleted successfully"));
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json(errorResponse("Failed to delete client"));
  }
}

/**
 * Get client statistics
 */
export async function getClientStats(req: Request, res: Response) {
  try {
    const statsStmt = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'ativo' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN date(join_date) >= date('now', '-30 days') THEN 1 ELSE 0 END) as new_this_month,
        AVG(total_spent) as average_spent,
        SUM(total_spent) as total_revenue,
        AVG(visits) as average_visits
      FROM clients
    `);

    const stats = statsStmt.get() as any;

    // Calculate retention rate (clients with visits in last 60 days)
    const retentionStmt = db.prepare(`
      SELECT COUNT(*) as retained
      FROM clients 
      WHERE status = 'ativo' 
      AND last_visit >= date('now', '-60 days')
    `);

    const { retained } = retentionStmt.get() as { retained: number };
    const retentionRate =
      stats.active > 0 ? (retained / stats.active) * 100 : 0;

    const clientStats = {
      total: stats.total,
      active: stats.active,
      inactive: stats.total - stats.active,
      newThisMonth: stats.new_this_month,
      averageSpent: Math.round(stats.average_spent * 100) / 100,
      totalRevenue: stats.total_revenue,
      averageVisits: Math.round(stats.average_visits * 100) / 100,
      retentionRate: Math.round(retentionRate * 100) / 100,
    };

    res.json(
      successResponse(clientStats, "Client statistics retrieved successfully"),
    );
  } catch (error) {
    console.error("Error getting client stats:", error);
    res.status(500).json(errorResponse("Failed to get client statistics"));
  }
}

/**
 * Get clients with birthdays this month
 */
export async function getBirthdaysThisMonth(req: Request, res: Response) {
  try {
    // For this demo, we'll use join_date as birthday
    const stmt = db.prepare(`
      SELECT id, name, join_date as birthday
      FROM clients 
      WHERE status = 'ativo'
      AND strftime('%m', join_date) = strftime('%m', 'now')
      ORDER BY strftime('%d', join_date)
    `);

    const birthdays = stmt.all() as Array<{
      id: number;
      name: string;
      birthday: string;
    }>;

    const transformedBirthdays = birthdays.map((b) => ({
      name: b.name,
      date: new Date(b.birthday).toLocaleDateString("pt-BR"),
    }));

    res.json(
      successResponse(transformedBirthdays, "Birthdays retrieved successfully"),
    );
  } catch (error) {
    console.error("Error getting birthdays:", error);
    res.status(500).json(errorResponse("Failed to get birthdays"));
  }
}
