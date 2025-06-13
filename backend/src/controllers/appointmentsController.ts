import { Request, Response } from "express";
import db from "../database/config";
import {
  successResponse,
  errorResponse,
  parsePagination,
  calculateOffset,
  createPaginationInfo,
  getDateRange,
} from "../utils";
import {
  Appointment,
  AppointmentWithDetails,
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from "../types";

/**
 * Get all appointments with pagination and filtering
 */
export async function getAppointments(req: Request, res: Response) {
  try {
    const { page, limit, sort, order, search } = parsePagination(req.query);
    const offset = calculateOffset(page, limit);

    let whereClause = "WHERE 1=1";
    const params: any[] = [];

    // Date range filter
    if (req.query.start_date && req.query.end_date) {
      whereClause += " AND a.date BETWEEN ? AND ?";
      params.push(req.query.start_date, req.query.end_date);
    }

    // Status filter
    if (req.query.status && req.query.status !== "todos") {
      whereClause += " AND a.status = ?";
      params.push(req.query.status);
    }

    // Professional filter
    if (req.query.professional_id) {
      whereClause += " AND a.professional_id = ?";
      params.push(req.query.professional_id);
    }

    // Search functionality
    if (search) {
      whereClause += " AND (c.name LIKE ? OR s.name LIKE ? OR p.name LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Count total records
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM appointments a
      LEFT JOIN clients c ON a.client_id = c.id
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN professionals p ON a.professional_id = p.id
      ${whereClause}
    `;
    const { total } = db.prepare(countQuery).get(...params) as {
      total: number;
    };

    // Get appointments with details
    const validSortFields = ["date", "time", "status", "price"];
    const sortField = validSortFields.includes(sort) ? `a.${sort}` : "a.date";
    const orderBy = `ORDER BY ${sortField} ${order}, a.time ${order}`;

    const query = `
      SELECT 
        a.id, a.client_id, a.service_id, a.professional_id,
        a.date, a.time, a.duration, a.status, a.price, a.notes,
        a.created_at, a.updated_at,
        c.name as client_name, c.phone as client_phone,
        s.name as service_name, s.category as service_category,
        p.name as professional_name
      FROM appointments a
      LEFT JOIN clients c ON a.client_id = c.id
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN professionals p ON a.professional_id = p.id
      ${whereClause}
      ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const appointments = db
      .prepare(query)
      .all(...params, limit, offset) as AppointmentWithDetails[];

    // Transform for frontend compatibility
    const transformedAppointments = appointments.map((appointment) => ({
      id: appointment.id,
      client: appointment.client_name,
      clientId: appointment.client_id,
      service: appointment.service_name,
      date: new Date(appointment.date),
      time: appointment.time,
      duration: appointment.duration,
      status: appointment.status,
      price: appointment.price,
      notes: appointment.notes,
      professional: appointment.professional_name,
    }));

    const pagination = createPaginationInfo(page, limit, total);

    res.json(
      successResponse(
        transformedAppointments,
        "Appointments retrieved successfully",
        pagination,
      ),
    );
  } catch (error) {
    console.error("Error getting appointments:", error);
    res.status(500).json(errorResponse("Failed to get appointments"));
  }
}

/**
 * Get a single appointment by ID
 */
export async function getAppointmentById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        a.id, a.client_id, a.service_id, a.professional_id,
        a.date, a.time, a.duration, a.status, a.price, a.notes,
        a.created_at, a.updated_at,
        c.name as client_name, c.phone as client_phone,
        s.name as service_name, s.category as service_category,
        p.name as professional_name
      FROM appointments a
      LEFT JOIN clients c ON a.client_id = c.id
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN professionals p ON a.professional_id = p.id
      WHERE a.id = ?
    `;

    const appointment = db.prepare(query).get(id) as
      | AppointmentWithDetails
      | undefined;

    if (!appointment) {
      return res.status(404).json(errorResponse("Appointment not found"));
    }

    const transformedAppointment = {
      id: appointment.id,
      client: appointment.client_name,
      clientId: appointment.client_id,
      service: appointment.service_name,
      date: new Date(appointment.date),
      time: appointment.time,
      duration: appointment.duration,
      status: appointment.status,
      price: appointment.price,
      notes: appointment.notes,
      professional: appointment.professional_name,
    };

    res.json(
      successResponse(
        transformedAppointment,
        "Appointment retrieved successfully",
      ),
    );
  } catch (error) {
    console.error("Error getting appointment:", error);
    res.status(500).json(errorResponse("Failed to get appointment"));
  }
}

/**
 * Create a new appointment
 */
export async function createAppointment(req: Request, res: Response) {
  try {
    const appointmentData: CreateAppointmentDto = req.body;

    // Validate client exists
    const client = db
      .prepare("SELECT id FROM clients WHERE id = ?")
      .get(appointmentData.client_id);
    if (!client) {
      return res.status(400).json(errorResponse("Client not found"));
    }

    // Validate service exists and get details
    const service = db
      .prepare("SELECT id, price, duration FROM services WHERE id = ?")
      .get(appointmentData.service_id);
    if (!service) {
      return res.status(400).json(errorResponse("Service not found"));
    }

    // Validate professional exists (if provided)
    if (appointmentData.professional_id) {
      const professional = db
        .prepare("SELECT id FROM professionals WHERE id = ?")
        .get(appointmentData.professional_id);
      if (!professional) {
        return res.status(400).json(errorResponse("Professional not found"));
      }
    }

    // Check for scheduling conflicts
    const conflictCheck = db.prepare(`
      SELECT id FROM appointments 
      WHERE professional_id = ? 
      AND date = ? 
      AND status NOT IN ('cancelado', 'faltou')
      AND (
        (time <= ? AND time(time, '+' || duration || ' minutes') > ?) OR
        (time < time(?, '+' || ? || ' minutes') AND time >= ?)
      )
    `);

    if (appointmentData.professional_id) {
      const conflict = conflictCheck.get(
        appointmentData.professional_id,
        appointmentData.date,
        appointmentData.time,
        appointmentData.time,
        appointmentData.time,
        service.duration,
        appointmentData.time,
      );

      if (conflict) {
        return res
          .status(400)
          .json(
            errorResponse(
              "Time slot conflicts with existing appointment",
              "SCHEDULE_CONFLICT",
            ),
          );
      }
    }

    const stmt = db.prepare(`
      INSERT INTO appointments (
        client_id, service_id, professional_id, date, time, 
        duration, price, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    const result = stmt.run(
      appointmentData.client_id,
      appointmentData.service_id,
      appointmentData.professional_id || null,
      appointmentData.date,
      appointmentData.time,
      service.duration,
      service.price,
      appointmentData.notes || null,
    );

    // Get the created appointment with details
    const newAppointment = db
      .prepare(
        `
      SELECT 
        a.id, a.client_id, a.service_id, a.professional_id,
        a.date, a.time, a.duration, a.status, a.price, a.notes,
        a.created_at, a.updated_at,
        c.name as client_name, c.phone as client_phone,
        s.name as service_name, s.category as service_category,
        p.name as professional_name
      FROM appointments a
      LEFT JOIN clients c ON a.client_id = c.id
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN professionals p ON a.professional_id = p.id
      WHERE a.id = ?
    `,
      )
      .get(result.lastInsertRowid) as AppointmentWithDetails;

    const transformedAppointment = {
      id: newAppointment.id,
      client: newAppointment.client_name,
      clientId: newAppointment.client_id,
      service: newAppointment.service_name,
      date: new Date(newAppointment.date),
      time: newAppointment.time,
      duration: newAppointment.duration,
      status: newAppointment.status,
      price: newAppointment.price,
      notes: newAppointment.notes,
      professional: newAppointment.professional_name,
    };

    res
      .status(201)
      .json(
        successResponse(
          transformedAppointment,
          "Appointment created successfully",
        ),
      );
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json(errorResponse("Failed to create appointment"));
  }
}

/**
 * Update an appointment
 */
export async function updateAppointment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData: UpdateAppointmentDto = req.body;

    // Check if appointment exists
    const existingAppointment = db
      .prepare("SELECT id, status FROM appointments WHERE id = ?")
      .get(id);
    if (!existingAppointment) {
      return res.status(404).json(errorResponse("Appointment not found"));
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
      UPDATE appointments 
      SET ${updateFields.join(", ")}
      WHERE id = ?
    `);

    stmt.run(...updateValues);

    // Update client stats if appointment is completed
    if (updateData.status === "concluido") {
      const appointment = db
        .prepare("SELECT client_id, price FROM appointments WHERE id = ?")
        .get(id) as { client_id: number; price: number };

      db.prepare(
        `
        UPDATE clients 
        SET 
          total_spent = total_spent + ?,
          visits = visits + 1,
          last_visit = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      ).run(appointment.price, appointment.client_id);
    }

    // Get updated appointment
    const updatedAppointment = db
      .prepare(
        `
      SELECT 
        a.id, a.client_id, a.service_id, a.professional_id,
        a.date, a.time, a.duration, a.status, a.price, a.notes,
        a.created_at, a.updated_at,
        c.name as client_name, c.phone as client_phone,
        s.name as service_name, s.category as service_category,
        p.name as professional_name
      FROM appointments a
      LEFT JOIN clients c ON a.client_id = c.id
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN professionals p ON a.professional_id = p.id
      WHERE a.id = ?
    `,
      )
      .get(id) as AppointmentWithDetails;

    const transformedAppointment = {
      id: updatedAppointment.id,
      client: updatedAppointment.client_name,
      clientId: updatedAppointment.client_id,
      service: updatedAppointment.service_name,
      date: new Date(updatedAppointment.date),
      time: updatedAppointment.time,
      duration: updatedAppointment.duration,
      status: updatedAppointment.status,
      price: updatedAppointment.price,
      notes: updatedAppointment.notes,
      professional: updatedAppointment.professional_name,
    };

    res.json(
      successResponse(
        transformedAppointment,
        "Appointment updated successfully",
      ),
    );
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json(errorResponse("Failed to update appointment"));
  }
}

/**
 * Delete an appointment
 */
export async function deleteAppointment(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Check if appointment exists
    const existingAppointment = db
      .prepare("SELECT id FROM appointments WHERE id = ?")
      .get(id);
    if (!existingAppointment) {
      return res.status(404).json(errorResponse("Appointment not found"));
    }

    const stmt = db.prepare("DELETE FROM appointments WHERE id = ?");
    stmt.run(id);

    res.json(successResponse(null, "Appointment deleted successfully"));
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json(errorResponse("Failed to delete appointment"));
  }
}

/**
 * Get appointment statistics
 */
export async function getAppointmentStats(req: Request, res: Response) {
  try {
    const { period = "today" } = req.query;
    const { start, end } = getDateRange(period as string);

    const statsQuery = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'agendado' THEN 1 ELSE 0 END) as agendados,
        SUM(CASE WHEN status = 'confirmado' THEN 1 ELSE 0 END) as confirmados,
        SUM(CASE WHEN status = 'concluido' THEN 1 ELSE 0 END) as concluidos,
        SUM(CASE WHEN status = 'cancelado' THEN 1 ELSE 0 END) as cancelados,
        SUM(CASE WHEN status = 'faltou' THEN 1 ELSE 0 END) as faltou,
        SUM(CASE WHEN status = 'concluido' THEN price ELSE 0 END) as revenue
      FROM appointments 
      WHERE date BETWEEN ? AND ?
    `;

    const stats = db
      .prepare(statsQuery)
      .get(start.toISOString().split("T")[0], end.toISOString().split("T")[0]);

    // Get upcoming appointments for today
    const today = new Date().toISOString().split("T")[0];
    const upcomingQuery = `
      SELECT 
        a.time, c.name as client_name, s.name as service_name, a.status
      FROM appointments a
      LEFT JOIN clients c ON a.client_id = c.id
      LEFT JOIN services s ON a.service_id = s.id
      WHERE a.date = ? AND a.status NOT IN ('cancelado', 'faltou', 'concluido')
      ORDER BY a.time
      LIMIT 5
    `;

    const upcoming = db.prepare(upcomingQuery).all(today);

    const appointmentStats = {
      ...stats,
      upcoming: upcoming.map((apt: any) => ({
        time: apt.time,
        client: apt.client_name,
        service: apt.service_name,
        status: apt.status,
      })),
    };

    res.json(
      successResponse(
        appointmentStats,
        "Appointment statistics retrieved successfully",
      ),
    );
  } catch (error) {
    console.error("Error getting appointment stats:", error);
    res.status(500).json(errorResponse("Failed to get appointment statistics"));
  }
}

/**
 * Get available time slots for scheduling
 */
export async function getAvailableSlots(req: Request, res: Response) {
  try {
    const { date, professional_id, service_id } = req.query;

    if (!date || !service_id) {
      return res
        .status(400)
        .json(errorResponse("Date and service_id are required"));
    }

    // Get service duration
    const service = db
      .prepare("SELECT duration FROM services WHERE id = ?")
      .get(service_id as string);
    if (!service) {
      return res.status(400).json(errorResponse("Service not found"));
    }

    // Get professional working hours (simplified - using default 8AM-6PM)
    const workingHours = { start: "08:00", end: "18:00" };
    const slotDuration = 30; // 30-minute slots

    // Generate all possible slots
    const slots: string[] = [];
    let currentTime = workingHours.start;

    while (currentTime < workingHours.end) {
      slots.push(currentTime);
      const [hours, minutes] = currentTime.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes + slotDuration;
      const newHours = Math.floor(totalMinutes / 60);
      const newMinutes = totalMinutes % 60;
      currentTime = `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
    }

    // Get booked slots
    let bookedQuery = `
      SELECT time, duration FROM appointments 
      WHERE date = ? AND status NOT IN ('cancelado', 'faltou')
    `;
    const params: any[] = [date];

    if (professional_id) {
      bookedQuery += " AND professional_id = ?";
      params.push(professional_id);
    }

    const bookedAppointments = db.prepare(bookedQuery).all(...params);

    // Filter out unavailable slots
    const availableSlots = slots.filter((slot) => {
      return !bookedAppointments.some((appointment: any) => {
        const appointmentStart = appointment.time;
        const appointmentEnd = addMinutesToTime(
          appointmentStart,
          appointment.duration,
        );
        const slotEnd = addMinutesToTime(slot, service.duration);

        return (
          (slot >= appointmentStart && slot < appointmentEnd) ||
          (slotEnd > appointmentStart && slotEnd <= appointmentEnd) ||
          (slot <= appointmentStart && slotEnd >= appointmentEnd)
        );
      });
    });

    res.json(
      successResponse(availableSlots, "Available slots retrieved successfully"),
    );
  } catch (error) {
    console.error("Error getting available slots:", error);
    res.status(500).json(errorResponse("Failed to get available slots"));
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
