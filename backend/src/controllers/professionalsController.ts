import { Request, Response } from "express";
import db from "../database/config";
import {
  successResponse,
  errorResponse,
  parsePagination,
  calculateOffset,
  createPaginationInfo,
  safeJsonParse,
} from "../utils";
import {
  Professional,
  ProfessionalStats,
  CreateProfessionalDto,
  UpdateProfessionalDto,
} from "../types";

/**
 * Get all professionals with pagination and filtering
 */
export async function getProfessionals(req: Request, res: Response) {
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
      `SELECT COUNT(*) as total FROM professionals ${whereClause}`,
    );
    const { total } = countStmt.get(...params) as { total: number };

    // Get professionals with pagination
    const validSortFields = [
      "name",
      "rating",
      "total_services",
      "total_revenue",
      "hired_date",
    ];
    const sortField = validSortFields.includes(sort) ? sort : "name";
    const orderBy = `ORDER BY ${sortField} ${order}`;

    const stmt = db.prepare(`
      SELECT 
        id, name, email, phone, avatar, status, commission, work_days, work_hours,
        hired_date, rating, total_services, total_revenue, completed_services,
        cancelled_services, bio, experience, certifications, is_owner,
        created_at, updated_at
      FROM professionals 
      ${whereClause} 
      ${orderBy}
      LIMIT ? OFFSET ?
    `);

    const professionals = stmt.all(...params, limit, offset) as Professional[];

    // Transform data for frontend compatibility
    const transformedProfessionals = professionals.map((professional) => ({
      ...professional,
      workDays: safeJsonParse(professional.work_days, []),
      workHours: safeJsonParse(professional.work_hours, {
        start: "08:00",
        end: "18:00",
      }),
      specialties: [], // Will be populated from services
      certifications: safeJsonParse(professional.certifications, []),
      hiredDate: new Date(professional.hired_date),
    }));

    const pagination = createPaginationInfo(page, limit, total);

    res.json(
      successResponse(
        transformedProfessionals,
        "Professionals retrieved successfully",
        pagination,
      ),
    );
  } catch (error) {
    console.error("Error getting professionals:", error);
    res.status(500).json(errorResponse("Failed to get professionals"));
  }
}

/**
 * Get a single professional by ID
 */
export async function getProfessionalById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const stmt = db.prepare(`
      SELECT 
        id, name, email, phone, avatar, status, commission, work_days, work_hours,
        hired_date, rating, total_services, total_revenue, completed_services,
        cancelled_services, bio, experience, certifications, is_owner,
        created_at, updated_at
      FROM professionals 
      WHERE id = ?
    `);

    const professional = stmt.get(id) as Professional | undefined;

    if (!professional) {
      return res.status(404).json(errorResponse("Professional not found"));
    }

    // Get associated services
    const servicesStmt = db.prepare(`
      SELECT s.name, s.category
      FROM services s
      JOIN service_professionals sp ON s.id = sp.service_id
      WHERE sp.professional_id = ?
    `);

    const services = servicesStmt.all(id);
    const specialties = services.map((s: any) => s.name);

    // Transform data for frontend compatibility
    const transformedProfessional = {
      ...professional,
      workDays: safeJsonParse(professional.work_days, []),
      workHours: safeJsonParse(professional.work_hours, {
        start: "08:00",
        end: "18:00",
      }),
      specialties,
      certifications: safeJsonParse(professional.certifications, []),
      hiredDate: new Date(professional.hired_date),
    };

    res.json(
      successResponse(
        transformedProfessional,
        "Professional retrieved successfully",
      ),
    );
  } catch (error) {
    console.error("Error getting professional:", error);
    res.status(500).json(errorResponse("Failed to get professional"));
  }
}

/**
 * Create a new professional
 */
export async function createProfessional(req: Request, res: Response) {
  try {
    const professionalData: CreateProfessionalDto = req.body;

    // Check if email already exists (if provided)
    if (professionalData.email) {
      const existingProfessional = db
        .prepare("SELECT id FROM professionals WHERE email = ?")
        .get(professionalData.email);
      if (existingProfessional) {
        return res.status(400).json(errorResponse("Email already exists"));
      }
    }

    const stmt = db.prepare(`
      INSERT INTO professionals (
        name, email, phone, commission, work_days, work_hours, bio, 
        experience, certifications, hired_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    const result = stmt.run(
      professionalData.name,
      professionalData.email || null,
      professionalData.phone,
      professionalData.commission,
      JSON.stringify(professionalData.work_days),
      JSON.stringify(professionalData.work_hours),
      professionalData.bio || null,
      professionalData.experience || 0,
      JSON.stringify(professionalData.certifications || []),
    );

    const newProfessional = db
      .prepare(
        `
        SELECT 
          id, name, email, phone, avatar, status, commission, work_days, work_hours,
          hired_date, rating, total_services, total_revenue, completed_services,
          cancelled_services, bio, experience, certifications, is_owner,
          created_at, updated_at
        FROM professionals 
        WHERE id = ?
      `,
      )
      .get(result.lastInsertRowid) as Professional;

    // Transform data for frontend compatibility
    const transformedProfessional = {
      ...newProfessional,
      workDays: safeJsonParse(newProfessional.work_days, []),
      workHours: safeJsonParse(newProfessional.work_hours, {
        start: "08:00",
        end: "18:00",
      }),
      specialties: [],
      certifications: safeJsonParse(newProfessional.certifications, []),
      hiredDate: new Date(newProfessional.hired_date),
    };

    res
      .status(201)
      .json(
        successResponse(
          transformedProfessional,
          "Professional created successfully",
        ),
      );
  } catch (error) {
    console.error("Error creating professional:", error);
    res.status(500).json(errorResponse("Failed to create professional"));
  }
}

/**
 * Update a professional
 */
export async function updateProfessional(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData: UpdateProfessionalDto = req.body;

    // Check if professional exists
    const existingProfessional = db
      .prepare("SELECT id FROM professionals WHERE id = ?")
      .get(id);
    if (!existingProfessional) {
      return res.status(404).json(errorResponse("Professional not found"));
    }

    // Check if email already exists (if being updated)
    if (updateData.email) {
      const emailCheck = db
        .prepare("SELECT id FROM professionals WHERE email = ? AND id != ?")
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
        if (
          key === "work_days" ||
          key === "work_hours" ||
          key === "certifications"
        ) {
          updateFields.push(`${key} = ?`);
          updateValues.push(JSON.stringify(value));
        } else {
          updateFields.push(`${key} = ?`);
          updateValues.push(value);
        }
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json(errorResponse("No valid fields to update"));
    }

    updateFields.push("updated_at = CURRENT_TIMESTAMP");
    updateValues.push(id);

    const stmt = db.prepare(`
      UPDATE professionals 
      SET ${updateFields.join(", ")}
      WHERE id = ?
    `);

    stmt.run(...updateValues);

    // Get updated professional
    const updatedProfessional = db
      .prepare(
        `
        SELECT 
          id, name, email, phone, avatar, status, commission, work_days, work_hours,
          hired_date, rating, total_services, total_revenue, completed_services,
          cancelled_services, bio, experience, certifications, is_owner,
          created_at, updated_at
        FROM professionals 
        WHERE id = ?
      `,
      )
      .get(id) as Professional;

    // Get specialties
    const servicesStmt = db.prepare(`
      SELECT s.name
      FROM services s
      JOIN service_professionals sp ON s.id = sp.service_id
      WHERE sp.professional_id = ?
    `);

    const services = servicesStmt.all(id);
    const specialties = services.map((s: any) => s.name);

    // Transform data for frontend compatibility
    const transformedProfessional = {
      ...updatedProfessional,
      workDays: safeJsonParse(updatedProfessional.work_days, []),
      workHours: safeJsonParse(updatedProfessional.work_hours, {
        start: "08:00",
        end: "18:00",
      }),
      specialties,
      certifications: safeJsonParse(updatedProfessional.certifications, []),
      hiredDate: new Date(updatedProfessional.hired_date),
    };

    res.json(
      successResponse(
        transformedProfessional,
        "Professional updated successfully",
      ),
    );
  } catch (error) {
    console.error("Error updating professional:", error);
    res.status(500).json(errorResponse("Failed to update professional"));
  }
}

/**
 * Delete a professional
 */
export async function deleteProfessional(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Check if professional exists
    const existingProfessional = db
      .prepare("SELECT id, is_owner FROM professionals WHERE id = ?")
      .get(id) as { id: number; is_owner: boolean } | undefined;

    if (!existingProfessional) {
      return res.status(404).json(errorResponse("Professional not found"));
    }

    // Don't allow deleting the owner
    if (existingProfessional.is_owner) {
      return res
        .status(400)
        .json(errorResponse("Cannot delete the salon owner"));
    }

    // Check if professional has appointments
    const appointmentCheck = db
      .prepare("SELECT id FROM appointments WHERE professional_id = ? LIMIT 1")
      .get(id);
    if (appointmentCheck) {
      return res
        .status(400)
        .json(
          errorResponse(
            "Cannot delete professional with existing appointments",
          ),
        );
    }

    // Delete service-professional relationships first
    db.prepare(
      "DELETE FROM service_professionals WHERE professional_id = ?",
    ).run(id);

    // Delete the professional
    const stmt = db.prepare("DELETE FROM professionals WHERE id = ?");
    stmt.run(id);

    res.json(successResponse(null, "Professional deleted successfully"));
  } catch (error) {
    console.error("Error deleting professional:", error);
    res.status(500).json(errorResponse("Failed to delete professional"));
  }
}

/**
 * Get professional statistics
 */
export async function getProfessionalStats(req: Request, res: Response) {
  try {
    const statsStmt = db.prepare(`
      SELECT 
        COUNT(*) as total_professionals,
        SUM(CASE WHEN status = 'ativo' THEN 1 ELSE 0 END) as active_professionals,
        SUM(total_revenue) as total_revenue,
        AVG(rating) as average_rating,
        SUM(total_services) as total_services,
        AVG(commission) as average_commission
      FROM professionals
    `);

    const stats = statsStmt.get() as any;

    const professionalStats: ProfessionalStats = {
      totalProfessionals: stats.total_professionals,
      activeProfessionals: stats.active_professionals,
      totalRevenue: stats.total_revenue || 0,
      averageRating: Math.round(stats.average_rating * 100) / 100 || 0,
      totalServices: stats.total_services || 0,
      averageCommission: Math.round(stats.average_commission * 100) / 100 || 0,
    };

    res.json(
      successResponse(
        professionalStats,
        "Professional statistics retrieved successfully",
      ),
    );
  } catch (error) {
    console.error("Error getting professional stats:", error);
    res
      .status(500)
      .json(errorResponse("Failed to get professional statistics"));
  }
}

/**
 * Get professional schedule
 */
export async function getProfessionalSchedule(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json(errorResponse("Date is required"));
    }

    // Get professional
    const professional = db
      .prepare("SELECT work_hours FROM professionals WHERE id = ?")
      .get(id) as { work_hours: string } | undefined;

    if (!professional) {
      return res.status(404).json(errorResponse("Professional not found"));
    }

    const workHours = safeJsonParse(professional.work_hours, {
      start: "08:00",
      end: "18:00",
    });

    // Get appointments for the date
    const appointmentsStmt = db.prepare(`
      SELECT 
        a.time, a.duration, s.name as service_name, c.name as client_name
      FROM appointments a
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN clients c ON a.client_id = c.id
      WHERE a.professional_id = ? AND a.date = ?
      AND a.status NOT IN ('cancelado', 'faltou')
      ORDER BY a.time
    `);

    const appointments = appointmentsStmt.all(id, date);

    // Generate time slots (30-minute intervals)
    const timeSlots: any[] = [];
    let currentTime = workHours.start;

    while (currentTime < workHours.end) {
      const appointment = appointments.find((a: any) => a.time === currentTime);

      timeSlots.push({
        start: currentTime,
        end: addMinutesToTime(currentTime, 30),
        isAvailable: !appointment,
        serviceId: appointment?.service_id,
        clientName: appointment?.client_name,
        serviceName: appointment?.service_name,
      });

      currentTime = addMinutesToTime(currentTime, 30);
    }

    const schedule = {
      professionalId: parseInt(id),
      date: new Date(date as string),
      timeSlots,
    };

    res.json(
      successResponse(schedule, "Professional schedule retrieved successfully"),
    );
  } catch (error) {
    console.error("Error getting professional schedule:", error);
    res.status(500).json(errorResponse("Failed to get professional schedule"));
  }
}

/**
 * Get top performing professionals
 */
export async function getTopProfessionals(req: Request, res: Response) {
  try {
    const { limit = 5, metric = "revenue" } = req.query;

    let orderBy = "total_revenue DESC";
    if (metric === "rating") {
      orderBy = "rating DESC";
    } else if (metric === "services") {
      orderBy = "total_services DESC";
    }

    const stmt = db.prepare(`
      SELECT 
        id, name, total_revenue, rating, total_services, completed_services
      FROM professionals 
      WHERE status = 'ativo'
      ORDER BY ${orderBy}
      LIMIT ?
    `);

    const professionals = stmt.all(parseInt(limit as string));

    res.json(
      successResponse(
        professionals,
        "Top professionals retrieved successfully",
      ),
    );
  } catch (error) {
    console.error("Error getting top professionals:", error);
    res.status(500).json(errorResponse("Failed to get top professionals"));
  }
}

// Helper function to add minutes to time string
function addMinutesToTime(time: string, minutes: number): string {
  const [hours, mins] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;
  return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
}
