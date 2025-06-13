import { Request, Response } from "express";
import { sql } from "../../database/neon-config";

// Get all clients with pagination and filters
export const getClients = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "name",
      order = "ASC",
      search,
      status,
    } = req.query;

    // Validate pagination
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(
      100,
      Math.max(1, parseInt(limit as string) || 10),
    );
    const offset = (pageNum - 1) * limitNum;

    // Build WHERE conditions
    let whereConditions = [];
    let params = [];

    if (search) {
      whereConditions.push(
        `(name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 2} OR phone ILIKE $${params.length + 3})`,
      );
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (status && status !== "all") {
      whereConditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Validate sort field
    const validSortFields = [
      "name",
      "email",
      "created_at",
      "last_visit",
      "total_spent",
      "visits",
    ];
    const sortField = validSortFields.includes(sort as string) ? sort : "name";
    const sortOrder = order === "DESC" ? "DESC" : "ASC";

    // Get total count
    const countResult = await sql`
      SELECT COUNT(*) as total 
      FROM clients 
      ${whereClause ? sql.unsafe(whereClause) : sql``}
    `;
    const total = parseInt(countResult[0].total);

    // Get clients with pagination
    const clients = await sql`
      SELECT 
        id, name, email, phone, city, cpf, profession, status, 
        birthday, total_spent, visits, last_visit, join_date, 
        created_at, updated_at
      FROM clients 
      ${whereClause ? sql.unsafe(whereClause) : sql``}
      ORDER BY ${sql.unsafe(sortField)} ${sql.unsafe(sortOrder)}
      LIMIT ${limitNum} OFFSET ${offset}
    `;

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: clients,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch clients",
    });
  }
};

// Get client by ID
export const getClientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const clients = await sql`
      SELECT * FROM clients WHERE id = ${id}
    `;

    if (clients.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Client not found",
      });
    }

    res.json({
      success: true,
      data: clients[0],
    });
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch client",
    });
  }
};

// Create new client
export const createClient = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, city, cpf, profession, birthday, notes } =
      req.body;

    // Validate required fields
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: "Name and phone are required",
      });
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingClient = await sql`
        SELECT id FROM clients WHERE email = ${email}
      `;

      if (existingClient.length > 0) {
        return res.status(400).json({
          success: false,
          error: "Email already exists",
        });
      }
    }

    const newClients = await sql`
      INSERT INTO clients (
        name, email, phone, city, cpf, profession, birthday, notes
      )
      VALUES (
        ${name}, ${email || null}, ${phone}, ${city || null}, 
        ${cpf || null}, ${profession || null}, ${birthday || null}, ${notes || null}
      )
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      data: newClients[0],
    });
  } catch (error) {
    console.error("Error creating client:", error);

    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return res.status(400).json({
        success: false,
        error: "Email already exists",
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to create client",
    });
  }
};

// Update client
export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      city,
      cpf,
      profession,
      birthday,
      notes,
      status,
    } = req.body;

    // Check if client exists
    const existingClient = await sql`
      SELECT id FROM clients WHERE id = ${id}
    `;

    if (existingClient.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Client not found",
      });
    }

    // Check if email already exists (if changing email)
    if (email) {
      const emailCheck = await sql`
        SELECT id FROM clients WHERE email = ${email} AND id != ${id}
      `;

      if (emailCheck.length > 0) {
        return res.status(400).json({
          success: false,
          error: "Email already exists",
        });
      }
    }

    const updatedClients = await sql`
      UPDATE clients 
      SET 
        name = COALESCE(${name}, name),
        email = COALESCE(${email}, email),
        phone = COALESCE(${phone}, phone),
        city = COALESCE(${city}, city),
        cpf = COALESCE(${cpf}, cpf),
        profession = COALESCE(${profession}, profession),
        birthday = COALESCE(${birthday}, birthday),
        notes = COALESCE(${notes}, notes),
        status = COALESCE(${status}, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    res.json({
      success: true,
      data: updatedClients[0],
    });
  } catch (error) {
    console.error("Error updating client:", error);

    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return res.status(400).json({
        success: false,
        error: "Email already exists",
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to update client",
    });
  }
};

// Delete client
export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if client exists
    const existingClient = await sql`
      SELECT id FROM clients WHERE id = ${id}
    `;

    if (existingClient.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Client not found",
      });
    }

    // Check if client has appointments
    const appointments = await sql`
      SELECT id FROM appointments WHERE client_id = ${id} LIMIT 1
    `;

    if (appointments.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete client with existing appointments",
      });
    }

    await sql`
      DELETE FROM clients WHERE id = ${id}
    `;

    res.json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete client",
    });
  }
};

// Get client statistics
export const getClientStats = async (req: Request, res: Response) => {
  try {
    const stats = await sql`
      SELECT 
        COUNT(*) as total_clients,
        COUNT(*) FILTER (WHERE status = 'ativo') as active_clients,
        COUNT(*) FILTER (WHERE status = 'inativo') as inactive_clients,
        ROUND(AVG(total_spent), 2) as average_spent,
        ROUND(AVG(visits), 2) as average_visits,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_clients_month
      FROM clients
    `;

    res.json({
      success: true,
      data: stats[0],
    });
  } catch (error) {
    console.error("Error fetching client stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch client statistics",
    });
  }
};

// Get clients with birthdays this month
export const getClientBirthdays = async (req: Request, res: Response) => {
  try {
    const birthdays = await sql`
      SELECT 
        id, name, email, phone, birthday,
        EXTRACT(DAY FROM birthday) as birthday_day,
        CASE 
          WHEN EXTRACT(DAY FROM birthday) = EXTRACT(DAY FROM CURRENT_DATE) THEN true
          ELSE false
        END as is_today
      FROM clients 
      WHERE 
        EXTRACT(MONTH FROM birthday) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND status = 'ativo'
        AND birthday IS NOT NULL
      ORDER BY EXTRACT(DAY FROM birthday)
    `;

    res.json({
      success: true,
      data: birthdays,
    });
  } catch (error) {
    console.error("Error fetching client birthdays:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch client birthdays",
    });
  }
};
