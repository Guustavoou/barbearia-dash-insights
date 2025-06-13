import { Router } from "express";
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getClientStats,
  getBirthdaysThisMonth,
} from "../controllers/clientsController";
import { asyncHandler } from "../middleware";

const router = Router();

// GET /api/clients - Get all clients with pagination
router.get("/", asyncHandler(getClients));

// GET /api/clients/stats - Get client statistics
router.get("/stats", asyncHandler(getClientStats));

// GET /api/clients/birthdays - Get birthdays this month
router.get("/birthdays", asyncHandler(getBirthdaysThisMonth));

// GET /api/clients/:id - Get client by ID
router.get("/:id", asyncHandler(getClientById));

// POST /api/clients - Create new client
router.post("/", asyncHandler(createClient));

// PUT /api/clients/:id - Update client
router.put("/:id", asyncHandler(updateClient));

// DELETE /api/clients/:id - Delete client
router.delete("/:id", asyncHandler(deleteClient));

export default router;
