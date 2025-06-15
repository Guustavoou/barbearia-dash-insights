import { Router } from "express";
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServiceCategories,
  getServiceStats,
} from "../../controllers/neon/servicesController";

const router = Router();

// GET /api/services - Get all services with pagination and filters
router.get("/", getServices);

// GET /api/services/stats - Get service statistics
router.get("/stats", getServiceStats);

// GET /api/services/categories - Get service categories
router.get("/categories", getServiceCategories);

// GET /api/services/:id - Get service by ID
router.get("/:id", getServiceById);

// POST /api/services - Create new service
router.post("/", createService);

// PUT /api/services/:id - Update service
router.put("/:id", updateService);

// DELETE /api/services/:id - Delete service
router.delete("/:id", deleteService);

export default router;
