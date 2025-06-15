import { Router } from "express";
import {
  getProfessionals,
  getProfessionalById,
  createProfessional,
  updateProfessional,
  deleteProfessional,
  getProfessionalStats,
  getProfessionalPerformance,
  getProfessionalSchedule,
  getSpecialties,
} from "../../controllers/neon/professionalsController";

const router = Router();

// GET /api/professionals - Get all professionals with pagination and filters
router.get("/", getProfessionals);

// GET /api/professionals/stats - Get professional statistics
router.get("/stats", getProfessionalStats);

// GET /api/professionals/specialties - Get available specialties
router.get("/specialties", getSpecialties);

// GET /api/professionals/:id - Get professional by ID
router.get("/:id", getProfessionalById);

// GET /api/professionals/:id/performance - Get professional performance
router.get("/:id/performance", getProfessionalPerformance);

// GET /api/professionals/:id/schedule - Get professional schedule
router.get("/:id/schedule", getProfessionalSchedule);

// POST /api/professionals - Create new professional
router.post("/", createProfessional);

// PUT /api/professionals/:id - Update professional
router.put("/:id", updateProfessional);

// DELETE /api/professionals/:id - Delete professional
router.delete("/:id", deleteProfessional);

export default router;
