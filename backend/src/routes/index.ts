import { Router } from "express";
import clientsRoutes from "./clients";
import appointmentsRoutes from "./appointments";
import servicesRoutes from "./services";
import professionalsRoutes from "./professionals";
import productsRoutes from "./products";
import dashboardRoutes from "./dashboard";
import financialRoutes from "./financial";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// API routes
router.use("/clients", clientsRoutes);
router.use("/appointments", appointmentsRoutes);
router.use("/services", servicesRoutes);
router.use("/professionals", professionalsRoutes);
router.use("/products", productsRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/financial", financialRoutes);

export default router;
