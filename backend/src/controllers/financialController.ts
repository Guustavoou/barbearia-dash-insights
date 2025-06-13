import { Request, Response } from "express";
import Database from "better-sqlite3";
import { paginate, validatePagination } from "../utils";

// Get database instance
const db = new Database("database.sqlite");

// Get financial transactions
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "created_at",
      order = "DESC",
      search,
      type,
      category,
      payment_method,
      start_date,
      end_date,
    } = req.query;

    // Validate pagination
    const { pageNum, limitNum, offset } = validatePagination(
      Number(page),
      Number(limit),
    );

    let query = `
      SELECT
        t.*,
        t.category as category_name
      FROM transactions t
      WHERE 1=1
    `;

    const params: any[] = [];

    // Add search filter
    if (search) {
      query += ` AND (t.description LIKE ? OR t.reference LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    // Add type filter
    if (type && type !== "all") {
      query += ` AND t.type = ?`;
      params.push(type);
    }

    // Add payment method filter
    if (payment_method && payment_method !== "all") {
      query += ` AND t.payment_method = ?`;
      params.push(payment_method);
    }

    // Add date range filter
    if (start_date) {
      query += ` AND DATE(t.created_at) >= ?`;
      params.push(start_date);
    }

    if (end_date) {
      query += ` AND DATE(t.created_at) <= ?`;
      params.push(end_date);
    }

    // Add sorting
    const validSortFields = ["created_at", "amount", "type", "payment_method"];
    const sortField = validSortFields.includes(sort as string)
      ? sort
      : "created_at";
    const sortOrder = order === "ASC" ? "ASC" : "DESC";

    query += ` ORDER BY ${sortField} ${sortOrder}`;

    // Get total count
    const countQuery = query.replace(
      /SELECT[\s\S]*?FROM/,
      "SELECT COUNT(*) as total FROM",
    );
    const countStmt = db.prepare(countQuery.split("ORDER BY")[0]);
    const { total } = countStmt.get(...params) as { total: number };

    // Add pagination
    query += ` LIMIT ? OFFSET ?`;
    params.push(limitNum, offset);

    // Execute query
    const stmt = db.prepare(query);
    const transactions = stmt.all(...params);

    // Calculate pagination info
    const pagination = paginate(total, pageNum, limitNum);

    res.json({
      success: true,
      data: transactions,
      pagination,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch transactions",
    });
  }
};

// Get financial statistics
export const getFinancialStats = async (req: Request, res: Response) => {
  try {
    const { period = "month" } = req.query;

    let dateFilter = "";
    if (period === "week") {
      dateFilter = "AND DATE(created_at) >= DATE('now', '-7 days')";
    } else if (period === "month") {
      dateFilter = "AND DATE(created_at) >= DATE('now', '-30 days')";
    } else if (period === "year") {
      dateFilter = "AND DATE(created_at) >= DATE('now', '-365 days')";
    }

    // Get revenue and expenses
    const revenueStmt = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total_revenue
      FROM transactions
      WHERE type = 'receita' ${dateFilter}
    `);
    const { total_revenue } = revenueStmt.get() as { total_revenue: number };

    const expenseStmt = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total_expenses
      FROM transactions
      WHERE type = 'despesa' ${dateFilter}
    `);
    const { total_expenses } = expenseStmt.get() as { total_expenses: number };

    // Get transaction count
    const countStmt = db.prepare(`
      SELECT COUNT(*) as total_transactions
      FROM transactions
      WHERE 1=1 ${dateFilter}
    `);
    const { total_transactions } = countStmt.get() as {
      total_transactions: number;
    };

    // Get payment method distribution
    const paymentMethodsStmt = db.prepare(`
      SELECT
        payment_method,
        COUNT(*) as count,
        SUM(amount) as total_amount
      FROM transactions
      WHERE type = 'receita' ${dateFilter}
      GROUP BY payment_method
      ORDER BY total_amount DESC
    `);
    const paymentMethods = paymentMethodsStmt.all();

    res.json({
      success: true,
      data: {
        total_revenue,
        total_expenses,
        net_profit: total_revenue - total_expenses,
        total_transactions,
        profit_margin:
          total_revenue > 0
            ? ((total_revenue - total_expenses) / total_revenue) * 100
            : 0,
        payment_methods: paymentMethods,
      },
    });
  } catch (error) {
    console.error("Error fetching financial stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch financial statistics",
    });
  }
};

// Get monthly revenue data
export const getMonthlyRevenue = async (req: Request, res: Response) => {
  try {
    const { months = 12 } = req.query;

    const stmt = db.prepare(`
      SELECT
        strftime('%Y-%m', created_at) as month,
        SUM(CASE WHEN type = 'receita' THEN amount ELSE 0 END) as revenue,
        SUM(CASE WHEN type = 'despesa' THEN amount ELSE 0 END) as expenses
      FROM transactions
      WHERE created_at >= DATE('now', '-${months} months')
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month ASC
    `);

    const monthlyData = stmt.all();

    res.json({
      success: true,
      data: monthlyData,
    });
  } catch (error) {
    console.error("Error fetching monthly revenue:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch monthly revenue data",
    });
  }
};

// Create transaction
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const {
      type,
      amount,
      description,
      payment_method,
      category,
      reference_id,
      reference_type,
      date,
    } = req.body;

    // Validate required fields
    if (!type || !amount || !description || !category) {
      return res.status(400).json({
        success: false,
        error: "Type, amount, description, and category are required",
      });
    }

    // Validate type
    if (!["receita", "despesa"].includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Type must be 'receita' or 'despesa'",
      });
    }

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Amount must be a positive number",
      });
    }

    const stmt = db.prepare(`
      INSERT INTO transactions (
        type, amount, description, payment_method,
        category, reference_id, reference_type, date, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `);

    const result = stmt.run(
      type,
      amount,
      description,
      payment_method || null,
      category,
      reference_id || null,
      reference_type || null,
      date || new Date().toISOString().split("T")[0],
    );

    // Get the created transaction
    const getStmt = db.prepare("SELECT * FROM transactions WHERE id = ?");
    const transaction = getStmt.get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create transaction",
    });
  }
};

// Update transaction
export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      type,
      amount,
      description,
      payment_method,
      appointment_id,
      product_id,
      reference,
    } = req.body;

    // Check if transaction exists
    const checkStmt = db.prepare("SELECT id FROM transactions WHERE id = ?");
    const existingTransaction = checkStmt.get(id);

    if (!existingTransaction) {
      return res.status(404).json({
        success: false,
        error: "Transaction not found",
      });
    }

    // Validate type if provided
    if (type && !["entrada", "saida"].includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Type must be 'entrada' or 'saida'",
      });
    }

    // Validate amount if provided
    if (amount && (isNaN(amount) || amount <= 0)) {
      return res.status(400).json({
        success: false,
        error: "Amount must be a positive number",
      });
    }

    const stmt = db.prepare(`
      UPDATE transactions
      SET
        type = COALESCE(?, type),
        amount = COALESCE(?, amount),
        description = COALESCE(?, description),
        payment_method = COALESCE(?, payment_method),
        appointment_id = COALESCE(?, appointment_id),
        product_id = COALESCE(?, product_id),
        reference = COALESCE(?, reference),
        updated_at = datetime('now')
      WHERE id = ?
    `);

    stmt.run(
      type || null,
      amount || null,
      description || null,
      payment_method || null,
      appointment_id || null,
      product_id || null,
      reference || null,
      id,
    );

    // Get the updated transaction
    const getStmt = db.prepare("SELECT * FROM transactions WHERE id = ?");
    const transaction = getStmt.get(id);

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update transaction",
    });
  }
};

// Delete transaction
export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if transaction exists
    const checkStmt = db.prepare("SELECT id FROM transactions WHERE id = ?");
    const existingTransaction = checkStmt.get(id);

    if (!existingTransaction) {
      return res.status(404).json({
        success: false,
        error: "Transaction not found",
      });
    }

    const stmt = db.prepare("DELETE FROM transactions WHERE id = ?");
    stmt.run(id);

    res.json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete transaction",
    });
  }
};
