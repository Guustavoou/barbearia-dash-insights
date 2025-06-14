import { Request, Response } from "express";
import { sql } from "../../database/neon-config";

// Get all professionals with pagination and filters
export const getProfessionals = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "name",
      order = "ASC",
      search,
      status,
      specialty,
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

    if (search) {
      whereConditions.push(
        `(name ILIKE '%${search}%' OR email ILIKE '%${search}%' OR phone ILIKE '%${search}%' OR specialty ILIKE '%${search}%')`,
      );
    }

    if (status && status !== "all") {
      whereConditions.push(`status = '${status}'`);
    }

    if (specialty && specialty !== "all") {
      whereConditions.push(`specialty ILIKE '%${specialty}%'`);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Validate sort field
    const validSortFields = [
      "name",
      "email",
      "status",
      "hire_date",
      "commission_rate",
      "rating",
      "created_at",
    ];
    const sortField = validSortFields.includes(sort as string) ? sort : "name";
    const sortOrder = order === "ASC" ? "ASC" : "DESC";

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM professionals ${whereClause}`;
    const countResult = await sql.unsafe(countQuery);
    const total = parseInt(countResult[0].total);

    // Get professionals with pagination
    const professionalsQuery = `
      SELECT
        id, name, email, phone, specialty, status, hire_date, 
        commission_rate, rating, total_services, avatar_url,
        created_at, updated_at
      FROM professionals
      ${whereClause}
      ORDER BY ${sortField} ${sortOrder}
      LIMIT ${limitNum} OFFSET ${offset}
    `;
    const professionals = await sql.unsafe(professionalsQuery);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: professionals.rows,
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
    console.error("Error fetching professionals:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch professionals",
    });
  }
};

// Get professional by ID
export const getProfessionalById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const professionals = await sql`
      SELECT * FROM professionals WHERE id = ${id}
    `;

    if (professionals.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Professional not found",
      });
    }

    res.json({
      success: true,
      data: professionals[0],
    });
  } catch (error) {
    console.error("Error fetching professional:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch professional",
    });
  }
};

// Create new professional
export const createProfessional = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      specialty,
      hire_date,
      commission_rate,
      avatar_url,
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !specialty) {
      return res.status(400).json({
        success: false,
        error: "Name, email, phone, and specialty are required",
      });
    }

    // Check if email already exists
    const existingProfessional = await sql`
      SELECT id FROM professionals WHERE email = ${email}
    `;

    if (existingProfessional.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Email already exists",
      });
    }

    const newProfessionals = await sql`
      INSERT INTO professionals (
        name, email, phone, specialty, hire_date, commission_rate, avatar_url
      )
      VALUES (
        ${name}, ${email}, ${phone}, ${specialty}, 
        ${hire_date || null}, ${commission_rate || 50}, ${avatar_url || null}
      )
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      data: newProfessionals[0],
    });
  } catch (error) {
    console.error("Error creating professional:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create professional",
    });
  }
};

// Update professional
export const updateProfessional = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      specialty,
      status,
      hire_date,
      commission_rate,
      avatar_url,
    } = req.body;

    // Check if professional exists
    const existingProfessional = await sql`
      SELECT id FROM professionals WHERE id = ${id}
    `;

    if (existingProfessional.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Professional not found",
      });
    }

    // Check if email already exists (excluding current professional)
    if (email) {
      const emailExists = await sql`
        SELECT id FROM professionals WHERE email = ${email} AND id != ${id}
      `;

      if (emailExists.length > 0) {
        return res.status(400).json({
          success: false,
          error: "Email already exists",
        });
      }
    }

    const updatedProfessionals = await sql`
      UPDATE professionals
      SET
        name = COALESCE(${name}, name),
        email = COALESCE(${email}, email),
        phone = COALESCE(${phone}, phone),
        specialty = COALESCE(${specialty}, specialty),
        status = COALESCE(${status}, status),
        hire_date = COALESCE(${hire_date}, hire_date),
        commission_rate = COALESCE(${commission_rate}, commission_rate),
        avatar_url = COALESCE(${avatar_url}, avatar_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    res.json({
      success: true,
      data: updatedProfessionals[0],
    });
  } catch (error) {
    console.error("Error updating professional:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update professional",
    });
  }
};

// Delete professional
export const deleteProfessional = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if professional exists
    const existingProfessional = await sql`
      SELECT id FROM professionals WHERE id = ${id}
    `;

    if (existingProfessional.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Professional not found",
      });
    }

    // Check if professional has appointments
    const appointments = await sql`
      SELECT COUNT(*) as count FROM appointments WHERE professional_id = ${id}
    `;

    if (appointments[0].count > 0) {
      // Soft delete by setting status to inactive
      await sql`
        UPDATE professionals SET status = 'inativo' WHERE id = ${id}
      `;

      return res.json({
        success: true,
        message: "Professional deactivated (has associated appointments)",
      });
    }

    // Hard delete if no appointments
    await sql`
      DELETE FROM professionals WHERE id = ${id}
    `;

    res.json({
      success: true,
      message: "Professional deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting professional:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete professional",
    });
  }
};

// Get professional statistics
export const getProfessionalStats = async (req: Request, res: Response) => {
  try {
    const stats = await sql`
      SELECT
        COUNT(*) as total_professionals,
        COUNT(*) FILTER (WHERE status = 'ativo') as active_professionals,
        COUNT(*) FILTER (WHERE status = 'inativo') as inactive_professionals,
        COUNT(*) FILTER (WHERE status = 'licenca') as on_leave_professionals,
        ROUND(AVG(commission_rate), 2) as average_commission_rate,
        ROUND(AVG(rating), 2) as average_rating
      FROM professionals
    `;

    // Get top performing professionals
    const topProfessionals = await sql`
      SELECT 
        p.id,
        p.name,
        p.specialty,
        p.rating,
        COALESCE(COUNT(a.id), 0) as total_appointments_month,
        COALESCE(SUM(a.price), 0) as total_revenue_month
      FROM professionals p
      LEFT JOIN appointments a ON p.id = a.professional_id 
        AND a.date >= DATE_TRUNC('month', CURRENT_DATE)
        AND a.status = 'concluido'
      WHERE p.status = 'ativo'
      GROUP BY p.id, p.name, p.specialty, p.rating
      ORDER BY total_revenue_month DESC, total_appointments_month DESC
      LIMIT 5
    `;

    res.json({
      success: true,
      data: {
        overview: stats[0],
        top_performers: topProfessionals,
      },
    });
  } catch (error) {
    console.error("Error fetching professional stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch professional statistics",
    });
  }
};

// Get professional performance
export const getProfessionalPerformance = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { period = "month" } = req.query;

    let dateFilter = "";
    if (period === "week") {
      dateFilter = "AND a.date >= CURRENT_DATE - INTERVAL '7 days'";
    } else if (period === "month") {
      dateFilter = "AND a.date >= DATE_TRUNC('month', CURRENT_DATE)";
    } else if (period === "year") {
      dateFilter = "AND a.date >= DATE_TRUNC('year', CURRENT_DATE)";
    }

    const performance = await sql`
      SELECT 
        p.name,
        p.specialty,
        p.rating,
        p.commission_rate,
        COUNT(a.id) as total_appointments,
        COUNT(a.id) FILTER (WHERE a.status = 'concluido') as completed_appointments,
        COUNT(a.id) FILTER (WHERE a.status = 'cancelado') as cancelled_appointments,
        COUNT(a.id) FILTER (WHERE a.status = 'faltou') as no_show_appointments,
        COALESCE(SUM(a.price), 0) as total_revenue,
        COALESCE(SUM(a.price * p.commission_rate / 100), 0) as commission_earned,
        ROUND(AVG(a.price), 2) as average_service_price,
        COUNT(DISTINCT a.client_id) as unique_clients_served
      FROM professionals p
      LEFT JOIN appointments a ON p.id = a.professional_id ${sql.unsafe(
        dateFilter,
      )}
      WHERE p.id = ${id}
      GROUP BY p.id, p.name, p.specialty, p.rating, p.commission_rate
    `;

    if (performance.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Professional not found",
      });
    }

    res.json({
      success: true,
      data: performance[0],
    });
  } catch (error) {
    console.error("Error fetching professional performance:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch professional performance",
    });
  }
};

// Get professional schedule
export const getProfessionalSchedule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    let dateFilter = "";
    if (date) {
      dateFilter = `AND date = '${date}'`;
    } else {
      dateFilter =
        "AND date >= CURRENT_DATE AND date <= CURRENT_DATE + INTERVAL '7 days'";
    }

    const schedule = await sql`
      SELECT 
        a.id,
        a.date,
        a.time,
        a.duration,
        a.status,
        a.price,
        a.client_name,
        a.service_name,
        c.phone as client_phone
      FROM appointments a
      LEFT JOIN clients c ON a.client_id = c.id
      WHERE a.professional_id = ${id} ${sql.unsafe(dateFilter)}
      ORDER BY a.date, a.time
    `;

    res.json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    console.error("Error fetching professional schedule:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch professional schedule",
    });
  }
};

// Get specialties
export const getSpecialties = async (req: Request, res: Response) => {
  try {
    const specialties = await sql`
      SELECT 
        specialty,
        COUNT(*) as professional_count,
        ROUND(AVG(rating), 2) as average_rating
      FROM professionals
      WHERE status = 'ativo'
      GROUP BY specialty
      ORDER BY professional_count DESC
    `;

    res.json({
      success: true,
      data: specialties,
    });
  } catch (error) {
    console.error("Error fetching specialties:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch specialties",
    });
  }
};
