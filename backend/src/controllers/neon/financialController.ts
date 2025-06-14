import { Request, Response } from "express";
import { sql } from "../../database/neon-config";

// Get all transactions with pagination and filters
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "date",
      order = "DESC",
      search,
      type,
      category,
      payment_method,
      start_date,
      end_date,
    } = req.query;

    // Validate pagination
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(
      100,
      Math.max(1, parseInt(limit as string) || 10),
    );
    const offset = (pageNum - 1) * limitNum;

    // Build WHERE conditions
    let whereConditions = [];

    if (search) {
      whereConditions.push(
        `(description ILIKE '%${search}%' OR category ILIKE '%${search}%')`,
      );
    }

    if (type && type !== "all") {
      whereConditions.push(`type = '${type}'`);
    }

    if (category && category !== "all") {
      whereConditions.push(`category = '${category}'`);
    }

    if (payment_method && payment_method !== "all") {
      whereConditions.push(`payment_method = '${payment_method}'`);
    }

    if (start_date) {
      whereConditions.push(`date >= '${start_date}'`);
    }

    if (end_date) {
      whereConditions.push(`date <= '${end_date}'`);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Validate sort field
    const validSortFields = [
      "date",
      "amount",
      "type",
      "category",
      "status",
      "created_at",
    ];
    const sortField = validSortFields.includes(sort as string) ? sort : "date";
    const sortOrder = order === "ASC" ? "ASC" : "DESC";

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM transactions ${whereClause}`;
    const countResult = await sql.unsafe(countQuery);
    const total = parseInt(countResult[0].total);

    // Get transactions with pagination
    const transactionsQuery = `
      SELECT
        id, type, amount, description, category, payment_method,
        date, status, appointment_id, client_id, created_at, updated_at
      FROM transactions
      ${whereClause}
      ORDER BY ${sortField} ${sortOrder}
      LIMIT ${limitNum} OFFSET ${offset}
    `;
    const transactions = await sql.unsafe(transactionsQuery);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: transactions.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch transactions",
    });
  }
};

// Get transaction by ID
export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const transactions = await sql`
      SELECT * FROM transactions WHERE id = ${id}
    `;

    if (transactions.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Transaction not found",
      });
    }

    res.json({
      success: true,
      data: transactions[0],
    });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch transaction",
    });
  }
};

// Create new transaction
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const {
      type,
      amount,
      description,
      category,
      payment_method,
      date,
      appointment_id,
      client_id,
    } = req.body;

    // Validate required fields
    if (!type || !amount || !description || !category || !date) {
      return res.status(400).json({
        success: false,
        error: "Type, amount, description, category, and date are required",
      });
    }

    // Validate type
    if (!["receita", "despesa"].includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Type must be 'receita' or 'despesa'",
      });
    }

    const newTransactions = await sql`
      INSERT INTO transactions (
        type, amount, description, category, payment_method, date,
        appointment_id, client_id
      )
      VALUES (
        ${type}, ${amount}, ${description}, ${category}, 
        ${payment_method || null}, ${date}, ${appointment_id || null}, ${client_id || null}
      )
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      data: newTransactions[0],
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
      category,
      payment_method,
      date,
      status,
    } = req.body;

    // Check if transaction exists
    const existingTransaction = await sql`
      SELECT id FROM transactions WHERE id = ${id}
    `;

    if (existingTransaction.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Transaction not found",
      });
    }

    const updatedTransactions = await sql`
      UPDATE transactions
      SET
        type = COALESCE(${type}, type),
        amount = COALESCE(${amount}, amount),
        description = COALESCE(${description}, description),
        category = COALESCE(${category}, category),
        payment_method = COALESCE(${payment_method}, payment_method),
        date = COALESCE(${date}, date),
        status = COALESCE(${status}, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    res.json({
      success: true,
      data: updatedTransactions[0],
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
    const existingTransaction = await sql`
      SELECT id FROM transactions WHERE id = ${id}
    `;

    if (existingTransaction.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Transaction not found",
      });
    }

    await sql`
      DELETE FROM transactions WHERE id = ${id}
    `;

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

// Get financial statistics
export const getFinancialStats = async (req: Request, res: Response) => {
  try {
    const { period = "month" } = req.query;

    let dateFilter = "";
    if (period === "week") {
      dateFilter = "AND date >= CURRENT_DATE - INTERVAL '7 days'";
    } else if (period === "month") {
      dateFilter = "AND date >= DATE_TRUNC('month', CURRENT_DATE)";
    } else if (period === "year") {
      dateFilter = "AND date >= DATE_TRUNC('year', CURRENT_DATE)";
    }

    const stats = await sql`
      SELECT
        COALESCE(SUM(CASE WHEN type = 'receita' THEN amount ELSE 0 END), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN type = 'despesa' THEN amount ELSE 0 END), 0) as total_expenses,
        COALESCE(SUM(CASE WHEN type = 'receita' THEN amount ELSE -amount END), 0) as net_profit,
        COUNT(*) as total_transactions,
        COUNT(*) FILTER (WHERE type = 'receita') as revenue_transactions,
        COUNT(*) FILTER (WHERE type = 'despesa') as expense_transactions,
        ROUND(AVG(CASE WHEN type = 'receita' THEN amount END), 2) as avg_revenue_amount,
        ROUND(AVG(CASE WHEN type = 'despesa' THEN amount END), 2) as avg_expense_amount
      FROM transactions
      WHERE status = 'confirmado' ${sql.unsafe(dateFilter)}
    `;

    const result = stats[0];

    // Calculate profit margin
    const profitMargin =
      result.total_revenue > 0
        ? (result.net_profit / result.total_revenue) * 100
        : 0;

    res.json({
      success: true,
      data: {
        ...result,
        profit_margin: Math.round(profitMargin * 100) / 100,
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

    const monthlyData = await sql`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', date), 'MM/YYYY') as month,
        EXTRACT(YEAR FROM date) as year,
        EXTRACT(MONTH FROM date) as month_num,
        COALESCE(SUM(CASE WHEN type = 'receita' THEN amount ELSE 0 END), 0) as revenue,
        COALESCE(SUM(CASE WHEN type = 'despesa' THEN amount ELSE 0 END), 0) as expenses,
        COALESCE(SUM(CASE WHEN type = 'receita' THEN amount ELSE -amount END), 0) as profit,
        COUNT(*) as transactions
      FROM transactions
      WHERE date >= CURRENT_DATE - INTERVAL '${months} months'
        AND status = 'confirmado'
      GROUP BY DATE_TRUNC('month', date), EXTRACT(YEAR FROM date), EXTRACT(MONTH FROM date)
      ORDER BY DATE_TRUNC('month', date)
    `;

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

// Get payment method statistics
export const getPaymentMethodStats = async (req: Request, res: Response) => {
  try {
    const { period = "month" } = req.query;

    let dateFilter = "";
    if (period === "week") {
      dateFilter = "AND date >= CURRENT_DATE - INTERVAL '7 days'";
    } else if (period === "month") {
      dateFilter = "AND date >= DATE_TRUNC('month', CURRENT_DATE)";
    } else if (period === "year") {
      dateFilter = "AND date >= DATE_TRUNC('year', CURRENT_DATE)";
    }

    const paymentStats = await sql`
      SELECT 
        payment_method,
        COUNT(*) as transaction_count,
        COALESCE(SUM(amount), 0) as total_amount,
        ROUND(AVG(amount), 2) as average_amount,
        ROUND(
          (COUNT(*) * 100.0 / SUM(COUNT(*)) OVER ()), 2
        ) as percentage
      FROM transactions
      WHERE type = 'receita' 
        AND status = 'confirmado'
        AND payment_method IS NOT NULL
        ${sql.unsafe(dateFilter)}
      GROUP BY payment_method
      ORDER BY total_amount DESC
    `;

    res.json({
      success: true,
      data: paymentStats,
    });
  } catch (error) {
    console.error("Error fetching payment method stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch payment method statistics",
    });
  }
};

// Get category statistics
export const getCategoryStats = async (req: Request, res: Response) => {
  try {
    const { type = "receita", period = "month" } = req.query;

    let dateFilter = "";
    if (period === "week") {
      dateFilter = "AND date >= CURRENT_DATE - INTERVAL '7 days'";
    } else if (period === "month") {
      dateFilter = "AND date >= DATE_TRUNC('month', CURRENT_DATE)";
    } else if (period === "year") {
      dateFilter = "AND date >= DATE_TRUNC('year', CURRENT_DATE)";
    }

    const categoryStats = await sql`
      SELECT 
        category,
        COUNT(*) as transaction_count,
        COALESCE(SUM(amount), 0) as total_amount,
        ROUND(AVG(amount), 2) as average_amount,
        ROUND(
          (SUM(amount) * 100.0 / SUM(SUM(amount)) OVER ()), 2
        ) as percentage
      FROM transactions
      WHERE type = ${type}
        AND status = 'confirmado'
        ${sql.unsafe(dateFilter)}
      GROUP BY category
      ORDER BY total_amount DESC
    `;

    res.json({
      success: true,
      data: categoryStats,
    });
  } catch (error) {
    console.error("Error fetching category stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch category statistics",
    });
  }
};

// Get financial summary
export const getFinancialSummary = async (req: Request, res: Response) => {
  try {
    // Current month vs previous month comparison
    const comparison = await sql`
      WITH current_month AS (
        SELECT 
          COALESCE(SUM(CASE WHEN type = 'receita' THEN amount ELSE 0 END), 0) as revenue,
          COALESCE(SUM(CASE WHEN type = 'despesa' THEN amount ELSE 0 END), 0) as expenses
        FROM transactions
        WHERE date >= DATE_TRUNC('month', CURRENT_DATE)
          AND status = 'confirmado'
      ),
      previous_month AS (
        SELECT 
          COALESCE(SUM(CASE WHEN type = 'receita' THEN amount ELSE 0 END), 0) as revenue,
          COALESCE(SUM(CASE WHEN type = 'despesa' THEN amount ELSE 0 END), 0) as expenses
        FROM transactions
        WHERE date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
          AND date < DATE_TRUNC('month', CURRENT_DATE)
          AND status = 'confirmado'
      )
      SELECT 
        cm.revenue as current_revenue,
        cm.expenses as current_expenses,
        (cm.revenue - cm.expenses) as current_profit,
        pm.revenue as previous_revenue,
        pm.expenses as previous_expenses,
        (pm.revenue - pm.expenses) as previous_profit,
        CASE 
          WHEN pm.revenue > 0 THEN ROUND(((cm.revenue - pm.revenue) / pm.revenue * 100), 1)
          ELSE 0 
        END as revenue_growth,
        CASE 
          WHEN pm.expenses > 0 THEN ROUND(((cm.expenses - pm.expenses) / pm.expenses * 100), 1)
          ELSE 0 
        END as expense_growth
      FROM current_month cm, previous_month pm
    `;

    res.json({
      success: true,
      data: comparison[0],
    });
  } catch (error) {
    console.error("Error fetching financial summary:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch financial summary",
    });
  }
};
