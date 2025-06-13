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
  Service,
  ServiceWithProfessionals,
  CreateServiceDto,
  UpdateServiceDto,
} from "../types";

/**
 * Get all services with pagination and filtering
 */
export async function getServices(req: Request, res: Response) {
  try {
    const { page, limit, sort, order, search } = parsePagination(req.query);
    const offset = calculateOffset(page, limit);

    let whereClause = "WHERE 1=1";
    const params: any[] = [];

    // Search functionality
    if (search) {
      whereClause +=
        " AND (s.name LIKE ? OR s.description LIKE ? OR s.category LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Category filter
    if (req.query.category && req.query.category !== "todos") {
      whereClause += " AND s.category = ?";
      params.push(req.query.category);
    }

    // Active filter
    if (req.query.is_active !== undefined) {
      whereClause += " AND s.is_active = ?";
      params.push(req.query.is_active === "true" ? 1 : 0);
    }

    // Count total records
    const countStmt = db.prepare(
      `SELECT COUNT(*) as total FROM services s ${whereClause}`,
    );
    const { total } = countStmt.get(...params) as { total: number };

    // Get services with pagination
    const validSortFields = [
      "name",
      "category",
      "price",
      "duration",
      "rating",
      "total_bookings",
    ];
    const sortField = validSortFields.includes(sort) ? sort : "name";
    const orderBy = `ORDER BY ${sortField} ${order}`;

    const stmt = db.prepare(`
      SELECT 
        id, name, description, category, price, duration, commission,
        is_active, rating, total_bookings, created_at, updated_at
      FROM services s
      ${whereClause} 
      ${orderBy}
      LIMIT ? OFFSET ?
    `);

    const services = stmt.all(...params, limit, offset) as Service[];

    const pagination = createPaginationInfo(page, limit, total);

    res.json(
      successResponse(services, "Services retrieved successfully", pagination),
    );
  } catch (error) {
    console.error("Error getting services:", error);
    res.status(500).json(errorResponse("Failed to get services"));
  }
}

/**
 * Get a single service by ID with professionals
 */
export async function getServiceById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const serviceStmt = db.prepare(`
      SELECT 
        id, name, description, category, price, duration, commission,
        is_active, rating, total_bookings, created_at, updated_at
      FROM services 
      WHERE id = ?
    `);

    const service = serviceStmt.get(id) as Service | undefined;

    if (!service) {
      return res.status(404).json(errorResponse("Service not found"));
    }

    // Get associated professionals
    const professionalsStmt = db.prepare(`
      SELECT p.id, p.name, p.rating
      FROM professionals p
      JOIN service_professionals sp ON p.id = sp.professional_id
      WHERE sp.service_id = ? AND p.status = 'ativo'
    `);

    const professionals = professionalsStmt.all(id);

    const serviceWithProfessionals: ServiceWithProfessionals = {
      ...service,
      professionals: professionals as any[],
    };

    res.json(
      successResponse(
        serviceWithProfessionals,
        "Service retrieved successfully",
      ),
    );
  } catch (error) {
    console.error("Error getting service:", error);
    res.status(500).json(errorResponse("Failed to get service"));
  }
}

/**
 * Create a new service
 */
export async function createService(req: Request, res: Response) {
  try {
    const serviceData: CreateServiceDto = req.body;

    // Check if service name already exists
    const existingService = db
      .prepare("SELECT id FROM services WHERE name = ?")
      .get(serviceData.name);
    if (existingService) {
      return res.status(400).json(errorResponse("Service name already exists"));
    }

    const stmt = db.prepare(`
      INSERT INTO services (name, description, category, price, duration, commission)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      serviceData.name,
      serviceData.description || null,
      serviceData.category,
      serviceData.price,
      serviceData.duration,
      serviceData.commission || 0,
    );

    const newService = db
      .prepare(
        `
        SELECT 
          id, name, description, category, price, duration, commission,
          is_active, rating, total_bookings, created_at, updated_at
        FROM services 
        WHERE id = ?
      `,
      )
      .get(result.lastInsertRowid) as Service;

    res
      .status(201)
      .json(successResponse(newService, "Service created successfully"));
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json(errorResponse("Failed to create service"));
  }
}

/**
 * Update a service
 */
export async function updateService(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData: UpdateServiceDto = req.body;

    // Check if service exists
    const existingService = db
      .prepare("SELECT id FROM services WHERE id = ?")
      .get(id);
    if (!existingService) {
      return res.status(404).json(errorResponse("Service not found"));
    }

    // Check if service name already exists (if being updated)
    if (updateData.name) {
      const nameCheck = db
        .prepare("SELECT id FROM services WHERE name = ? AND id != ?")
        .get(updateData.name, id);
      if (nameCheck) {
        return res
          .status(400)
          .json(errorResponse("Service name already exists"));
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
      UPDATE services 
      SET ${updateFields.join(", ")}
      WHERE id = ?
    `);

    stmt.run(...updateValues);

    // Get updated service
    const updatedService = db
      .prepare(
        `
        SELECT 
          id, name, description, category, price, duration, commission,
          is_active, rating, total_bookings, created_at, updated_at
        FROM services 
        WHERE id = ?
      `,
      )
      .get(id) as Service;

    res.json(successResponse(updatedService, "Service updated successfully"));
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json(errorResponse("Failed to update service"));
  }
}

/**
 * Delete a service
 */
export async function deleteService(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Check if service exists
    const existingService = db
      .prepare("SELECT id FROM services WHERE id = ?")
      .get(id);
    if (!existingService) {
      return res.status(404).json(errorResponse("Service not found"));
    }

    // Check if service has appointments
    const appointmentCheck = db
      .prepare("SELECT id FROM appointments WHERE service_id = ? LIMIT 1")
      .get(id);
    if (appointmentCheck) {
      return res
        .status(400)
        .json(
          errorResponse("Cannot delete service with existing appointments"),
        );
    }

    // Delete service-professional relationships first
    db.prepare("DELETE FROM service_professionals WHERE service_id = ?").run(
      id,
    );

    // Delete the service
    const stmt = db.prepare("DELETE FROM services WHERE id = ?");
    stmt.run(id);

    res.json(successResponse(null, "Service deleted successfully"));
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json(errorResponse("Failed to delete service"));
  }
}

/**
 * Get service categories
 */
export async function getServiceCategories(req: Request, res: Response) {
  try {
    const stmt = db.prepare(`
      SELECT DISTINCT category, COUNT(*) as count
      FROM services 
      WHERE is_active = 1
      GROUP BY category
      ORDER BY category
    `);

    const categories = stmt.all();

    res.json(
      successResponse(categories, "Service categories retrieved successfully"),
    );
  } catch (error) {
    console.error("Error getting service categories:", error);
    res.status(500).json(errorResponse("Failed to get service categories"));
  }
}

/**
 * Get service statistics
 */
export async function getServiceStats(req: Request, res: Response) {
  try {
    const statsStmt = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
        AVG(price) as average_price,
        AVG(duration) as average_duration,
        AVG(rating) as average_rating,
        SUM(total_bookings) as total_bookings
      FROM services
    `);

    const stats = statsStmt.get() as any;

    // Get most popular service
    const popularServiceStmt = db.prepare(`
      SELECT name, total_bookings
      FROM services
      WHERE total_bookings > 0
      ORDER BY total_bookings DESC
      LIMIT 1
    `);

    const popularService = popularServiceStmt.get() as any;

    // Get revenue by category this month
    const categoryRevenueStmt = db.prepare(`
      SELECT 
        s.category,
        SUM(CASE WHEN a.status = 'concluido' THEN a.price ELSE 0 END) as revenue,
        COUNT(CASE WHEN a.status = 'concluido' THEN 1 END) as bookings
      FROM services s
      LEFT JOIN appointments a ON s.id = a.service_id
      WHERE a.date >= date('now', 'start of month') OR a.date IS NULL
      GROUP BY s.category
      ORDER BY revenue DESC
    `);

    const categoryRevenue = categoryRevenueStmt.all();

    const serviceStats = {
      total: stats.total,
      active: stats.active,
      inactive: stats.total - stats.active,
      averagePrice: Math.round(stats.average_price * 100) / 100,
      averageDuration: Math.round(stats.average_duration),
      averageRating: Math.round(stats.average_rating * 100) / 100,
      totalBookings: stats.total_bookings,
      popularService: popularService?.name || "N/A",
      categoryRevenue: categoryRevenue,
    };

    res.json(
      successResponse(
        serviceStats,
        "Service statistics retrieved successfully",
      ),
    );
  } catch (error) {
    console.error("Error getting service stats:", error);
    res.status(500).json(errorResponse("Failed to get service statistics"));
  }
}

/**
 * Assign professionals to a service
 */
export async function assignProfessionals(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { professional_ids } = req.body;

    // Validate service exists
    const service = db.prepare("SELECT id FROM services WHERE id = ?").get(id);
    if (!service) {
      return res.status(404).json(errorResponse("Service not found"));
    }

    // Validate all professionals exist
    for (const professionalId of professional_ids) {
      const professional = db
        .prepare("SELECT id FROM professionals WHERE id = ?")
        .get(professionalId);
      if (!professional) {
        return res
          .status(400)
          .json(errorResponse(`Professional ${professionalId} not found`));
      }
    }

    // Remove existing assignments
    db.prepare("DELETE FROM service_professionals WHERE service_id = ?").run(
      id,
    );

    // Add new assignments
    const insertStmt = db.prepare(
      "INSERT INTO service_professionals (service_id, professional_id) VALUES (?, ?)",
    );

    for (const professionalId of professional_ids) {
      insertStmt.run(id, professionalId);
    }

    res.json(successResponse(null, "Professionals assigned successfully"));
  } catch (error) {
    console.error("Error assigning professionals:", error);
    res.status(500).json(errorResponse("Failed to assign professionals"));
  }
}

/**
 * Get services by professional
 */
export async function getServicesByProfessional(req: Request, res: Response) {
  try {
    const { professional_id } = req.params;

    const stmt = db.prepare(`
      SELECT 
        s.id, s.name, s.description, s.category, s.price, s.duration, s.commission,
        s.is_active, s.rating, s.total_bookings
      FROM services s
      JOIN service_professionals sp ON s.id = sp.service_id
      WHERE sp.professional_id = ? AND s.is_active = 1
      ORDER BY s.name
    `);

    const services = stmt.all(professional_id);

    res.json(successResponse(services, "Services retrieved successfully"));
  } catch (error) {
    console.error("Error getting services by professional:", error);
    res.status(500).json(errorResponse("Failed to get services"));
  }
}
