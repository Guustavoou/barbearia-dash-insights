import { Router } from "express";
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentStats,
  getAvailableSlots,
} from "../controllers/appointmentsController";
import { asyncHandler } from "../middleware";

const router = Router();

// GET /api/appointments - Get all appointments with pagination
router.get("/", asyncHandler(getAppointments));

// GET /api/appointments/stats - Get appointment statistics
router.get("/stats", asyncHandler(getAppointmentStats));

// GET /api/appointments/available-slots - Get available time slots
router.get("/available-slots", asyncHandler(getAvailableSlots));

// GET /api/appointments/:id - Get appointment by ID
router.get("/:id", asyncHandler(getAppointmentById));

// POST /api/appointments - Create new appointment
router.post("/", asyncHandler(createAppointment));

// PUT /api/appointments/:id - Update appointment
router.put("/:id", asyncHandler(updateAppointment));

// DELETE /api/appointments/:id - Delete appointment
router.delete("/:id", asyncHandler(deleteAppointment));

export default router;
