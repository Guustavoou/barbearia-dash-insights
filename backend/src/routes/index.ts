import { Router } from "express";
import clientsRoutes from "./clients";
import appointmentsRoutes from "./appointments";
import servicesRoutes from "./services";
import professionalsRoutes from "./professionals";
import productsRoutes from "./products";
import dashboardRoutes from "./dashboard";
import { healthCheck } from "../middleware";

const router = Router();

// Health check endpoint
router.get("/health", healthCheck);

// API routes
router.use("/clients", clientsRoutes);
router.use("/appointments", appointmentsRoutes);
router.use("/services", servicesRoutes);
router.use("/professionals", professionalsRoutes);
router.use("/products", productsRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
