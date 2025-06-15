import { Router } from "express";
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentStats,
  getAvailableSlots,
} from "../../controllers/neon/appointmentsController";

const router = Router();

// GET /api/appointments - Get all appointments with pagination and filters
router.get("/", getAppointments);

// GET /api/appointments/stats - Get appointment statistics
router.get("/stats", getAppointmentStats);

// GET /api/appointments/available-slots - Get available time slots
router.get("/available-slots", getAvailableSlots);

// GET /api/appointments/:id - Get appointment by ID
router.get("/:id", getAppointmentById);

// POST /api/appointments - Create new appointment
router.post("/", createAppointment);

// PUT /api/appointments/:id - Update appointment
router.put("/:id", updateAppointment);

// DELETE /api/appointments/:id - Delete appointment
router.delete("/:id", deleteAppointment);

export default router;
