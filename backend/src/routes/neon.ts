import { Router } from "express";
import { sql } from "../database/neon-config";

// Import Neon controllers
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getClientStats,
  getClientBirthdays,
} from "../controllers/neon/clientsController";

import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentStats,
  getAvailableSlots,
} from "../controllers/neon/appointmentsController";

import {
  getDashboardStats,
  getRevenueData,
  getTopServices,
  getUpcomingAppointments,
  getBirthdaysThisMonth,
  getQuickInsights,
} from "../controllers/neon/dashboardController";

import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServiceStats,
  getPopularServices,
  getServiceCategories,
} from "../controllers/neon/servicesController";

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
} from "../controllers/neon/professionalsController";

import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getFinancialStats,
  getMonthlyRevenue,
  getPaymentMethodStats,
  getCategoryStats,
  getFinancialSummary,
} from "../controllers/neon/financialController";

import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServiceStats,
  getPopularServices,
  getServiceCategories,
} from "../controllers/neon/servicesController";
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
} from "../controllers/neon/professionalsController";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  getLowStockProducts,
  updateProductStock,
  getProductCategories,
  getProductBrands,
} from "../controllers/neon/productsController";
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getFinancialStats,
  getMonthlyRevenue,
  getPaymentMethodStats,
  getCategoryStats,
  getFinancialSummary,
} from "../controllers/neon/financialController";
import {
  getBusinessReports,
  getSalesPerformance,
  getProfessionalReports,
  getClientAnalysis,
  getAppointmentTrends,
  getFinancialAnalysis,
  getInventoryReport,
  exportReportData,
} from "../controllers/neon/reportsController";
import {
  createBusiness,
  createServices,
  createProfessionals,
  createWorkingHours,
  completeOnboarding,
  getOnboardingStatus,
} from "../controllers/neon/onboardingController";

const router = Router();

// Health check endpoint with Neon database test
router.get("/health", async (req, res) => {
  try {
    // Test database connection
    const result =
      await sql`SELECT NOW() as timestamp, 'Neon PostgreSQL' as database`;

    res.json({
      success: true,
      message: "Server is healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: {
        type: "Neon PostgreSQL",
        status: "connected",
        server_time: result[0].timestamp,
      },
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Client routes
router.get("/clients", getClients);
router.get("/clients/stats", getClientStats);
router.get("/clients/birthdays", getClientBirthdays);
router.get("/clients/:id", getClientById);
router.post("/clients", createClient);
router.put("/clients/:id", updateClient);
router.delete("/clients/:id", deleteClient);

// Dashboard routes
router.get("/dashboard/stats", getDashboardStats);
router.get("/dashboard/revenue", getRevenueData);
router.get("/dashboard/top-services", getTopServices);
router.get("/dashboard/upcoming-appointments", getUpcomingAppointments);
router.get("/dashboard/birthdays", getBirthdaysThisMonth);
router.get("/dashboard/insights", getQuickInsights);

// Appointment routes
router.get("/appointments", getAppointments);
router.get("/appointments/stats", getAppointmentStats);
router.get("/appointments/available-slots", getAvailableSlots);
router.get("/appointments/:id", getAppointmentById);
router.post("/appointments", createAppointment);
router.put("/appointments/:id", updateAppointment);
router.delete("/appointments/:id", deleteAppointment);

// Services routes
router.get("/services", getServices);
router.get("/services/stats", getServiceStats);
router.get("/services/popular", getPopularServices);
router.get("/services/categories", getServiceCategories);
router.get("/services/:id", getServiceById);
router.post("/services", createService);
router.put("/services/:id", updateService);
router.delete("/services/:id", deleteService);

// Professionals routes
router.get("/professionals", getProfessionals);
router.get("/professionals/stats", getProfessionalStats);
router.get("/professionals/specialties", getSpecialties);
router.get("/professionals/:id", getProfessionalById);
router.get("/professionals/:id/performance", getProfessionalPerformance);
router.get("/professionals/:id/schedule", getProfessionalSchedule);
router.post("/professionals", createProfessional);
router.put("/professionals/:id", updateProfessional);
router.delete("/professionals/:id", deleteProfessional);

// Products routes
router.get("/products", getProducts);
router.get("/products/stats", getProductStats);
router.get("/products/low-stock", getLowStockProducts);
router.get("/products/categories", getProductCategories);
router.get("/products/brands", getProductBrands);
router.get("/products/:id", getProductById);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.put("/products/:id/stock", updateProductStock);
router.delete("/products/:id", deleteProduct);

// Financial routes
router.get("/transactions", getTransactions);
router.get("/transactions/stats", getFinancialStats);
router.get("/transactions/monthly-revenue", getMonthlyRevenue);
router.get("/transactions/payment-methods", getPaymentMethodStats);
router.get("/transactions/categories", getCategoryStats);
router.get("/transactions/summary", getFinancialSummary);
router.get("/transactions/:id", getTransactionById);
router.post("/transactions", createTransaction);
router.put("/transactions/:id", updateTransaction);
router.delete("/transactions/:id", deleteTransaction);

// Reports routes
router.get("/reports/business", getBusinessReports);
router.get("/reports/sales", getSalesPerformance);
router.get("/reports/professionals", getProfessionalReports);
router.get("/reports/clients", getClientAnalysis);
router.get("/reports/appointments", getAppointmentTrends);
router.get("/reports/financial", getFinancialAnalysis);
router.get("/reports/inventory", getInventoryReport);
router.get("/reports/export", exportReportData);

// Onboarding routes
router.post("/onboarding/business", createBusiness);
router.post("/onboarding/services", createServices);
router.post("/onboarding/professionals", createProfessionals);
router.post("/onboarding/working-hours", createWorkingHours);
router.post("/onboarding/complete", completeOnboarding);
router.get("/onboarding/status", getOnboardingStatus);

export default router;
