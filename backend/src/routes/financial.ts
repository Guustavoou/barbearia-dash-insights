import { Router } from "express";
import {
  getTransactions,
  getFinancialStats,
  getMonthlyRevenue,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/financialController";

const router = Router();

// GET /api/financial/transactions - Get all transactions with pagination and filters
router.get("/transactions", getTransactions);

// GET /api/financial/stats - Get financial statistics
router.get("/stats", getFinancialStats);

// GET /api/financial/monthly-revenue - Get monthly revenue data
router.get("/monthly-revenue", getMonthlyRevenue);

// POST /api/financial/transactions - Create new transaction
router.post("/transactions", createTransaction);

// PUT /api/financial/transactions/:id - Update transaction
router.put("/transactions/:id", updateTransaction);

// DELETE /api/financial/transactions/:id - Delete transaction
router.delete("/transactions/:id", deleteTransaction);

export default router;
