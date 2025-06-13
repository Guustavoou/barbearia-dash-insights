import { Router } from "express";
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServiceCategories,
  getServiceStats,
  assignProfessionals,
  getServicesByProfessional,
} from "../controllers/servicesController";
import { asyncHandler } from "../middleware";

const router = Router();

// GET /api/services - Get all services with pagination
router.get("/", asyncHandler(getServices));

// GET /api/services/categories - Get service categories
router.get("/categories", asyncHandler(getServiceCategories));

// GET /api/services/stats - Get service statistics
router.get("/stats", asyncHandler(getServiceStats));

// GET /api/services/professional/:professional_id - Get services by professional
router.get(
  "/professional/:professional_id",
  asyncHandler(getServicesByProfessional),
);

// GET /api/services/:id - Get service by ID
router.get("/:id", asyncHandler(getServiceById));

// POST /api/services - Create new service
router.post("/", asyncHandler(createService));

// PUT /api/services/:id - Update service
router.put("/:id", asyncHandler(updateService));

// PUT /api/services/:id/professionals - Assign professionals to service
router.put("/:id/professionals", asyncHandler(assignProfessionals));

// DELETE /api/services/:id - Delete service
router.delete("/:id", asyncHandler(deleteService));

export default router;
