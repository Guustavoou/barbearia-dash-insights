import { Router } from "express";
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getFinancialStats,
  getMonthlyRevenue,
  getCashFlow,
  getExpensesByCategory,
} from "../../controllers/neon/financialController";

const router = Router();

// GET /api/financial/transactions - Get all transactions with pagination and filters
router.get("/transactions", getTransactions);

// GET /api/financial/stats - Get financial statistics
router.get("/stats", getFinancialStats);

// GET /api/financial/monthly-revenue - Get monthly revenue data
router.get("/monthly-revenue", getMonthlyRevenue);

// GET /api/financial/cash-flow - Get cash flow data
router.get("/cash-flow", getCashFlow);

// GET /api/financial/expenses-by-category - Get expenses by category
router.get("/expenses-by-category", getExpensesByCategory);

// GET /api/financial/transactions/:id - Get transaction by ID
router.get("/transactions/:id", getTransactionById);

// POST /api/financial/transactions - Create new transaction
router.post("/transactions", createTransaction);

// PUT /api/financial/transactions/:id - Update transaction
router.put("/transactions/:id", updateTransaction);

// DELETE /api/financial/transactions/:id - Delete transaction
router.delete("/transactions/:id", deleteTransaction);

export default router;
