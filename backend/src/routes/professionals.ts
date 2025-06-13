import { Router } from "express";
import {
  getProfessionals,
  getProfessionalById,
  createProfessional,
  updateProfessional,
  deleteProfessional,
  getProfessionalStats,
  getProfessionalSchedule,
  getTopProfessionals,
} from "../controllers/professionalsController";
import { asyncHandler } from "../middleware";

const router = Router();

// GET /api/professionals - Get all professionals with pagination
router.get("/", asyncHandler(getProfessionals));

// GET /api/professionals/stats - Get professional statistics
router.get("/stats", asyncHandler(getProfessionalStats));

// GET /api/professionals/top - Get top performing professionals
router.get("/top", asyncHandler(getTopProfessionals));

// GET /api/professionals/:id - Get professional by ID
router.get("/:id", asyncHandler(getProfessionalById));

// GET /api/professionals/:id/schedule - Get professional schedule
router.get("/:id/schedule", asyncHandler(getProfessionalSchedule));

// POST /api/professionals - Create new professional
router.post("/", asyncHandler(createProfessional));

// PUT /api/professionals/:id - Update professional
router.put("/:id", asyncHandler(updateProfessional));

// DELETE /api/professionals/:id - Delete professional
router.delete("/:id", asyncHandler(deleteProfessional));

export default router;
