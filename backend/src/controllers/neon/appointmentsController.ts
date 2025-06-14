import { Request, Response } from "express";
import { sql } from "../../database/neon-config";

// Get all appointments with pagination and filters
export const getAppointments = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "date",
      order = "DESC",
      search,
      status,
      professional_id,
      start_date,
      end_date,
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
        `(client_name ILIKE '%${search}%' OR service_name ILIKE '%${search}%' OR professional_name ILIKE '%${search}%')`,
      );
    }

    if (status && status !== "all") {
      whereConditions.push(`status = '${status}'`);
    }

    if (professional_id) {
      whereConditions.push(`professional_id = ${professional_id}`);
    }

    if (start_date) {
      whereConditions.push(`date >= '${start_date}'`);
    }

    if (end_date) {
      whereConditions.push(`date <= '${end_date}'`);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Validate sort field
    const validSortFields = [
      "date",
      "time",
      "status",
      "price",
      "client_name",
      "created_at",
    ];
    const sortField = validSortFields.includes(sort as string) ? sort : "date";
    const sortOrder = order === "ASC" ? "ASC" : "DESC";

    // Get total count using raw SQL since we have dynamic WHERE clause
    const countQuery = `SELECT COUNT(*) as total FROM appointments ${whereClause}`;
    const countResult = await sql.query(countQuery);
    const total = parseInt(countResult.rows[0].total);

    // Get appointments with pagination using raw SQL
    const appointmentsQuery = `
      SELECT
        id, client_id, service_id, professional_id, date, time, duration,
        status, price, notes, client_name, service_name, professional_name,
        created_at, updated_at
      FROM appointments
      ${whereClause}
      ORDER BY ${sortField} ${sortOrder}, time ${sortOrder}
      LIMIT ${limitNum} OFFSET ${offset}
    `;
    const appointments = await sql.query(appointmentsQuery);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: appointments.rows,
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
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch appointments",
    });
  }
};

// Get appointment by ID
export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const appointments = await sql`
      SELECT * FROM appointments WHERE id = ${id}
    `;

    if (appointments.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      });
    }

    res.json({
      success: true,
      data: appointments[0],
    });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch appointment",
    });
  }
};

// Create new appointment
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const {
      client_id,
      service_id,
      professional_id,
      date,
      time,
      duration,
      price,
      notes,
    } = req.body;

    // Validate required fields
    if (!client_id || !service_id || !date || !time || !duration || !price) {
      return res.status(400).json({
        success: false,
        error:
          "Client ID, service ID, date, time, duration, and price are required",
      });
    }

    // Get client, service, and professional names for denormalization
    const clientResult =
      await sql`SELECT name FROM clients WHERE id = ${client_id}`;
    const serviceResult =
      await sql`SELECT name FROM services WHERE id = ${service_id}`;
    const professionalResult = professional_id
      ? await sql`SELECT name FROM professionals WHERE id = ${professional_id}`
      : null;

    if (clientResult.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Client not found",
      });
    }

    if (serviceResult.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Service not found",
      });
    }

    const newAppointments = await sql`
      INSERT INTO appointments (
        client_id, service_id, professional_id, date, time, duration,
        price, notes, client_name, service_name, professional_name
      )
      VALUES (
        ${client_id}, ${service_id}, ${professional_id || null}, ${date}, ${time}, ${duration},
        ${price}, ${notes || null}, ${clientResult[0].name}, ${serviceResult[0].name},
        ${professionalResult ? professionalResult[0].name : null}
      )
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      data: newAppointments[0],
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create appointment",
    });
  }
};

// Update appointment
export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, time, duration, status, price, notes } = req.body;

    // Check if appointment exists
    const existingAppointment = await sql`
      SELECT id FROM appointments WHERE id = ${id}
    `;

    if (existingAppointment.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      });
    }

    const updatedAppointments = await sql`
      UPDATE appointments
      SET
        date = COALESCE(${date}, date),
        time = COALESCE(${time}, time),
        duration = COALESCE(${duration}, duration),
        status = COALESCE(${status}, status),
        price = COALESCE(${price}, price),
        notes = COALESCE(${notes}, notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    res.json({
      success: true,
      data: updatedAppointments[0],
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update appointment",
    });
  }
};

// Delete appointment
export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if appointment exists
    const existingAppointment = await sql`
      SELECT id FROM appointments WHERE id = ${id}
    `;

    if (existingAppointment.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      });
    }

    await sql`
      DELETE FROM appointments WHERE id = ${id}
    `;

    res.json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete appointment",
    });
  }
};

// Get appointment statistics
export const getAppointmentStats = async (req: Request, res: Response) => {
  try {
    const { period = "month" } = req.query;

    let dateFilter = "";
    if (period === "week") {
      dateFilter = "AND date >= CURRENT_DATE - INTERVAL '7 days'";
    } else if (period === "month") {
      dateFilter = "AND date >= CURRENT_DATE - INTERVAL '30 days'";
    } else if (period === "year") {
      dateFilter = "AND date >= CURRENT_DATE - INTERVAL '365 days'";
    }

    const stats = await sql.query(`
      SELECT
        COUNT(*) as total_appointments,
        COUNT(*) FILTER (WHERE status = 'agendado') as scheduled,
        COUNT(*) FILTER (WHERE status = 'confirmado') as confirmed,
        COUNT(*) FILTER (WHERE status = 'concluido') as completed,
        COUNT(*) FILTER (WHERE status = 'cancelado') as cancelled,
        COUNT(*) FILTER (WHERE status = 'faltou') as no_show,
        ROUND(AVG(price), 2) as average_price,
        COALESCE(SUM(CASE WHEN status = 'concluido' THEN price ELSE 0 END), 0) as total_revenue
      FROM appointments
      WHERE 1=1 ${dateFilter}
    `);

    res.json({
      success: true,
      data: stats.rows[0],
    });
  } catch (error) {
    console.error("Error fetching appointment stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch appointment statistics",
    });
  }
};

// Get available time slots
export const getAvailableSlots = async (req: Request, res: Response) => {
  try {
    const { date, service_id, professional_id } = req.query;

    if (!date || !service_id) {
      return res.status(400).json({
        success: false,
        error: "Date and service ID are required",
      });
    }

    // Get service duration
    const serviceResult = await sql`
      SELECT duration FROM services WHERE id = ${service_id}
    `;

    if (serviceResult.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Service not found",
      });
    }

    const serviceDuration = serviceResult[0].duration;

    // Get existing appointments for the date
    const existingAppointments = professional_id
      ? await sql`
          SELECT time, duration FROM appointments
          WHERE date = ${date}
          AND professional_id = ${professional_id}
          AND status NOT IN ('cancelado')
        `
      : await sql`
          SELECT time, duration FROM appointments
          WHERE date = ${date}
          AND status NOT IN ('cancelado')
        `;

    // Generate available slots (example: 8 AM to 6 PM, 30-minute intervals)
    const workingHours = {
      start: "08:00",
      end: "18:00",
    };

    const slots = [];
    const startTime = new Date(`2000-01-01 ${workingHours.start}`);
    const endTime = new Date(`2000-01-01 ${workingHours.end}`);

    for (
      let time = new Date(startTime);
      time < endTime;
      time.setMinutes(time.getMinutes() + 30)
    ) {
      const timeStr = time.toTimeString().slice(0, 5);

      // Check if slot conflicts with existing appointments
      const hasConflict = existingAppointments.some((apt: any) => {
        const aptStart = new Date(`2000-01-01 ${apt.time}`);
        const aptEnd = new Date(aptStart.getTime() + apt.duration * 60000);
        const slotStart = new Date(`2000-01-01 ${timeStr}`);
        const slotEnd = new Date(slotStart.getTime() + serviceDuration * 60000);

        return slotStart < aptEnd && slotEnd > aptStart;
      });

      if (!hasConflict) {
        slots.push({
          time: timeStr,
          available: true,
        });
      }
    }

    res.json({
      success: true,
      data: slots,
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch available slots",
    });
  }
};
