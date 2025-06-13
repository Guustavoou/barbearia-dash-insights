import { Router } from "express";
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getClientStats,
  getClientBirthdays,
} from "../../controllers/neon/clientsController";

const router = Router();

// GET /api/clients - Get all clients with pagination and filters
router.get("/", getClients);

// GET /api/clients/stats - Get client statistics
router.get("/stats", getClientStats);

// GET /api/clients/birthdays - Get clients with birthdays this month
router.get("/birthdays", getClientBirthdays);

// GET /api/clients/:id - Get client by ID
router.get("/:id", getClientById);

// POST /api/clients - Create new client
router.post("/", createClient);

// PUT /api/clients/:id - Update client
router.put("/:id", updateClient);

// DELETE /api/clients/:id - Delete client
router.delete("/:id", deleteClient);

export default router;
