import { Request, Response } from "express";
import { sql } from "../../database/neon-config";

// Get comprehensive business reports
export const getBusinessReports = async (req: Request, res: Response) => {
  try {
    const { period = "month" } = req.query;

    let dateFilter = "";
    let previousDateFilter = "";
    let interval = "";

    switch (period) {
      case "week":
        dateFilter = "AND date >= CURRENT_DATE - INTERVAL '7 days'";
        previousDateFilter =
          "AND date >= CURRENT_DATE - INTERVAL '14 days' AND date < CURRENT_DATE - INTERVAL '7 days'";
        interval = "7 days";
        break;
      case "year":
        dateFilter = "AND date >= DATE_TRUNC('year', CURRENT_DATE)";
        previousDateFilter =
          "AND date >= DATE_TRUNC('year', CURRENT_DATE - INTERVAL '1 year') AND date < DATE_TRUNC('year', CURRENT_DATE)";
        interval = "1 year";
        break;
      default: // month
        dateFilter = "AND date >= DATE_TRUNC('month', CURRENT_DATE)";
        previousDateFilter =
          "AND date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') AND date < DATE_TRUNC('month', CURRENT_DATE)";
        interval = "1 month";
    }

    // Revenue and appointments overview
    const overview = await sql`
      WITH current_period AS (
        SELECT 
          COALESCE(SUM(CASE WHEN t.type = 'receita' THEN t.amount ELSE 0 END), 0) as revenue,
          COUNT(a.id) as appointments,
          COUNT(DISTINCT a.client_id) as unique_clients
        FROM transactions t
        LEFT JOIN appointments a ON t.appointment_id = a.id
        WHERE t.status = 'confirmado' ${sql.unsafe(dateFilter)}
      ),
      previous_period AS (
        SELECT 
          COALESCE(SUM(CASE WHEN t.type = 'receita' THEN t.amount ELSE 0 END), 0) as revenue,
          COUNT(a.id) as appointments,
          COUNT(DISTINCT a.client_id) as unique_clients
        FROM transactions t
        LEFT JOIN appointments a ON t.appointment_id = a.id
        WHERE t.status = 'confirmado' ${sql.unsafe(previousDateFilter)}
      )
      SELECT 
        cp.revenue as current_revenue,
        cp.appointments as current_appointments,
        cp.unique_clients as current_unique_clients,
        pp.revenue as previous_revenue,
        pp.appointments as previous_appointments,
        pp.unique_clients as previous_unique_clients,
        CASE 
          WHEN pp.revenue > 0 THEN ROUND(((cp.revenue - pp.revenue) / pp.revenue * 100), 1)
          ELSE 0 
        END as revenue_growth,
        CASE 
          WHEN pp.appointments > 0 THEN ROUND(((cp.appointments - pp.appointments) / pp.appointments * 100), 1)
          ELSE 0 
        END as appointment_growth
      FROM current_period cp, previous_period pp
    `;

    res.json({
      success: true,
      data: {
        overview: overview[0],
        period,
        interval,
      },
    });
  } catch (error) {
    console.error("Error fetching business reports:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch business reports",
    });
  }
};

// Get sales performance by service
export const getSalesPerformance = async (req: Request, res: Response) => {
  try {
    const { period = "month", limit = 10 } = req.query;

    let dateFilter = "";
    if (period === "week") {
      dateFilter = "AND a.date >= CURRENT_DATE - INTERVAL '7 days'";
    } else if (period === "month") {
      dateFilter = "AND a.date >= DATE_TRUNC('month', CURRENT_DATE)";
    } else if (period === "year") {
      dateFilter = "AND a.date >= DATE_TRUNC('year', CURRENT_DATE)";
    }

    const salesByService = await sql`
      SELECT 
        s.name as service_name,
        s.category,
        COUNT(a.id) as total_appointments,
        COALESCE(SUM(a.price), 0) as total_revenue,
        ROUND(AVG(a.price), 2) as average_price,
        COUNT(DISTINCT a.client_id) as unique_clients,
        ROUND(
          (COUNT(a.id) * 100.0 / SUM(COUNT(a.id)) OVER ()), 2
        ) as appointment_percentage,
        ROUND(
          (SUM(a.price) * 100.0 / SUM(SUM(a.price)) OVER ()), 2
        ) as revenue_percentage
      FROM services s
      LEFT JOIN appointments a ON s.id = a.service_id 
        AND a.status IN ('concluido', 'confirmado')
        ${sql.unsafe(dateFilter)}
      WHERE s.is_active = true
      GROUP BY s.id, s.name, s.category
      HAVING COUNT(a.id) > 0
      ORDER BY total_revenue DESC, total_appointments DESC
      LIMIT ${limit}
    `;

    res.json({
      success: true,
      data: salesByService,
    });
  } catch (error) {
    console.error("Error fetching sales performance:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch sales performance",
    });
  }
};

// Get professional performance report
export const getProfessionalPerformance = async (
  req: Request,
  res: Response,
) => {
  try {
    const { period = "month" } = req.query;

    let dateFilter = "";
    if (period === "week") {
      dateFilter = "AND a.date >= CURRENT_DATE - INTERVAL '7 days'";
    } else if (period === "month") {
      dateFilter = "AND a.date >= DATE_TRUNC('month', CURRENT_DATE)";
    } else if (period === "year") {
      dateFilter = "AND a.date >= DATE_TRUNC('year', CURRENT_DATE)";
    }

    const professionalStats = await sql`
      SELECT 
        p.id,
        p.name,
        p.specialty,
        p.commission_rate,
        COUNT(a.id) as total_appointments,
        COUNT(a.id) FILTER (WHERE a.status = 'concluido') as completed_appointments,
        COUNT(a.id) FILTER (WHERE a.status = 'cancelado') as cancelled_appointments,
        COUNT(a.id) FILTER (WHERE a.status = 'faltou') as no_show_appointments,
        COALESCE(SUM(a.price), 0) as total_revenue,
        COALESCE(SUM(a.price * p.commission_rate / 100), 0) as commission_earned,
        ROUND(AVG(a.price), 2) as average_service_price,
        COUNT(DISTINCT a.client_id) as unique_clients_served,
        ROUND(
          (COUNT(a.id) FILTER (WHERE a.status = 'concluido') * 100.0 / NULLIF(COUNT(a.id), 0)), 2
        ) as completion_rate,
        ROUND(
          (COUNT(a.id) FILTER (WHERE a.status = 'cancelado') * 100.0 / NULLIF(COUNT(a.id), 0)), 2
        ) as cancellation_rate
      FROM professionals p
      LEFT JOIN appointments a ON p.id = a.professional_id 
        ${sql.unsafe(dateFilter)}
      WHERE p.status = 'ativo'
      GROUP BY p.id, p.name, p.specialty, p.commission_rate
      ORDER BY total_revenue DESC, completed_appointments DESC
    `;

    res.json({
      success: true,
      data: professionalStats,
    });
  } catch (error) {
    console.error("Error fetching professional performance:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch professional performance",
    });
  }
};

// Get client analysis report
export const getClientAnalysis = async (req: Request, res: Response) => {
  try {
    const { period = "month" } = req.query;

    let dateFilter = "";
    if (period === "week") {
      dateFilter = "AND c.created_at >= CURRENT_DATE - INTERVAL '7 days'";
    } else if (period === "month") {
      dateFilter = "AND c.created_at >= DATE_TRUNC('month', CURRENT_DATE)";
    } else if (period === "year") {
      dateFilter = "AND c.created_at >= DATE_TRUNC('year', CURRENT_DATE)";
    }

    // Client acquisition and retention stats
    const clientStats = await sql`
      WITH client_metrics AS (
        SELECT 
          c.id,
          c.name,
          c.created_at,
          COUNT(a.id) as total_appointments,
          COALESCE(SUM(a.price), 0) as total_spent,
          ROUND(AVG(a.price), 2) as average_appointment_value,
          MIN(a.date) as first_appointment_date,
          MAX(a.date) as last_appointment_date,
          CASE 
            WHEN MAX(a.date) >= CURRENT_DATE - INTERVAL '30 days' THEN 'Ativo'
            WHEN MAX(a.date) >= CURRENT_DATE - INTERVAL '90 days' THEN 'Inativo Recente'
            ELSE 'Inativo'
          END as status
        FROM clients c
        LEFT JOIN appointments a ON c.id = a.client_id 
          AND a.status IN ('concluido', 'confirmado')
        WHERE c.status = 'ativo' ${sql.unsafe(dateFilter)}
        GROUP BY c.id, c.name, c.created_at
      )
      SELECT 
        COUNT(*) as total_clients,
        COUNT(*) FILTER (WHERE status = 'Ativo') as active_clients,
        COUNT(*) FILTER (WHERE status = 'Inativo Recente') as inactive_recent_clients,
        COUNT(*) FILTER (WHERE status = 'Inativo') as inactive_clients,
        ROUND(AVG(total_spent), 2) as average_client_value,
        ROUND(AVG(total_appointments), 2) as average_appointments_per_client,
        COUNT(*) FILTER (WHERE total_appointments = 1) as one_time_clients,
        COUNT(*) FILTER (WHERE total_appointments > 1) as repeat_clients
      FROM client_metrics
    `;

    // Top spending clients
    const topClients = await sql`
      SELECT 
        c.name,
        c.phone,
        COUNT(a.id) as total_appointments,
        COALESCE(SUM(a.price), 0) as total_spent,
        ROUND(AVG(a.price), 2) as average_appointment_value,
        MAX(a.date) as last_visit
      FROM clients c
      LEFT JOIN appointments a ON c.id = a.client_id 
        AND a.status IN ('concluido', 'confirmado')
        AND a.date >= CURRENT_DATE - INTERVAL '12 months'
      WHERE c.status = 'ativo'
      GROUP BY c.id, c.name, c.phone
      HAVING COUNT(a.id) > 0
      ORDER BY total_spent DESC
      LIMIT 10
    `;

    res.json({
      success: true,
      data: {
        overview: clientStats[0],
        top_clients: topClients,
      },
    });
  } catch (error) {
    console.error("Error fetching client analysis:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch client analysis",
    });
  }
};

// Get appointment patterns and trends
export const getAppointmentTrends = async (req: Request, res: Response) => {
  try {
    const { period = "month" } = req.query;

    let dateFilter = "";
    let groupByClause = "";
    let dateFormat = "";

    switch (period) {
      case "week":
        dateFilter = "AND date >= CURRENT_DATE - INTERVAL '7 days'";
        groupByClause = "date";
        dateFormat = "TO_CHAR(date, 'DD/MM')";
        break;
      case "year":
        dateFilter = "AND date >= CURRENT_DATE - INTERVAL '12 months'";
        groupByClause = "DATE_TRUNC('month', date)";
        dateFormat = "TO_CHAR(DATE_TRUNC('month', date), 'MM/YYYY')";
        break;
      default: // month
        dateFilter = "AND date >= CURRENT_DATE - INTERVAL '30 days'";
        groupByClause = "date";
        dateFormat = "TO_CHAR(date, 'DD/MM')";
    }

    // Daily/Monthly appointment trends
    const appointmentTrends = await sql`
      SELECT 
        ${sql.unsafe(dateFormat)} as period,
        COUNT(*) as total_appointments,
        COUNT(*) FILTER (WHERE status = 'concluido') as completed,
        COUNT(*) FILTER (WHERE status = 'cancelado') as cancelled,
        COUNT(*) FILTER (WHERE status = 'faltou') as no_show,
        COALESCE(SUM(price), 0) as revenue
      FROM appointments
      WHERE 1=1 ${sql.unsafe(dateFilter)}
      GROUP BY ${sql.unsafe(groupByClause)}
      ORDER BY ${sql.unsafe(groupByClause)}
    `;

    // Hourly distribution
    const hourlyDistribution = await sql`
      SELECT 
        EXTRACT(HOUR FROM time::time) as hour,
        COUNT(*) as appointment_count,
        ROUND(AVG(price), 2) as average_price
      FROM appointments
      WHERE status IN ('concluido', 'confirmado')
        ${sql.unsafe(dateFilter)}
      GROUP BY EXTRACT(HOUR FROM time::time)
      ORDER BY hour
    `;

    // Day of week distribution
    const weeklyDistribution = await sql`
      SELECT 
        EXTRACT(DOW FROM date) as day_of_week,
        TO_CHAR(date, 'Day') as day_name,
        COUNT(*) as appointment_count,
        COALESCE(SUM(price), 0) as revenue
      FROM appointments
      WHERE status IN ('concluido', 'confirmado')
        ${sql.unsafe(dateFilter)}
      GROUP BY EXTRACT(DOW FROM date), TO_CHAR(date, 'Day')
      ORDER BY day_of_week
    `;

    res.json({
      success: true,
      data: {
        trends: appointmentTrends,
        hourly_distribution: hourlyDistribution,
        weekly_distribution: weeklyDistribution,
      },
    });
  } catch (error) {
    console.error("Error fetching appointment trends:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch appointment trends",
    });
  }
};

// Get financial analysis report
export const getFinancialAnalysis = async (req: Request, res: Response) => {
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

    // Revenue breakdown by category
    const revenueBreakdown = await sql`
      SELECT 
        category,
        COUNT(*) as transaction_count,
        COALESCE(SUM(amount), 0) as total_amount,
        ROUND(AVG(amount), 2) as average_amount,
        ROUND(
          (SUM(amount) * 100.0 / SUM(SUM(amount)) OVER ()), 2
        ) as percentage
      FROM transactions
      WHERE type = 'receita' 
        AND status = 'confirmado'
        ${sql.unsafe(dateFilter)}
      GROUP BY category
      ORDER BY total_amount DESC
    `;

    // Expense breakdown by category
    const expenseBreakdown = await sql`
      SELECT 
        category,
        COUNT(*) as transaction_count,
        COALESCE(SUM(amount), 0) as total_amount,
        ROUND(AVG(amount), 2) as average_amount,
        ROUND(
          (SUM(amount) * 100.0 / SUM(SUM(amount)) OVER ()), 2
        ) as percentage
      FROM transactions
      WHERE type = 'despesa' 
        AND status = 'confirmado'
        ${sql.unsafe(dateFilter)}
      GROUP BY category
      ORDER BY total_amount DESC
    `;

    // Payment method analysis
    const paymentMethods = await sql`
      SELECT 
        payment_method,
        COUNT(*) as transaction_count,
        COALESCE(SUM(amount), 0) as total_amount,
        ROUND(AVG(amount), 2) as average_amount
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
      data: {
        revenue_breakdown: revenueBreakdown,
        expense_breakdown: expenseBreakdown,
        payment_methods: paymentMethods,
      },
    });
  } catch (error) {
    console.error("Error fetching financial analysis:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch financial analysis",
    });
  }
};

// Get inventory report
export const getInventoryReport = async (req: Request, res: Response) => {
  try {
    // Inventory overview
    const overview = await sql`
      SELECT
        COUNT(*) as total_products,
        COUNT(*) FILTER (WHERE status = 'ativo') as active_products,
        COUNT(*) FILTER (WHERE current_stock <= min_stock) as low_stock_count,
        COUNT(*) FILTER (WHERE current_stock = 0) as out_of_stock_count,
        COALESCE(SUM(current_stock * cost_price), 0) as total_inventory_value,
        COALESCE(SUM(current_stock * price), 0) as total_retail_value
      FROM products
    `;

    // Low stock products
    const lowStockProducts = await sql`
      SELECT 
        name, sku, category, brand, current_stock, min_stock,
        (min_stock - current_stock) as stock_deficit,
        cost_price, price
      FROM products
      WHERE current_stock <= min_stock
        AND status = 'ativo'
      ORDER BY 
        CASE WHEN current_stock = 0 THEN 0 ELSE 1 END,
        (current_stock / NULLIF(min_stock, 0))
      LIMIT 20
    `;

    // Category breakdown
    const categoryBreakdown = await sql`
      SELECT 
        category,
        COUNT(*) as product_count,
        COALESCE(SUM(current_stock), 0) as total_stock,
        COALESCE(SUM(current_stock * cost_price), 0) as category_value,
        COUNT(*) FILTER (WHERE current_stock <= min_stock) as low_stock_items
      FROM products
      WHERE status = 'ativo'
      GROUP BY category
      ORDER BY category_value DESC
    `;

    res.json({
      success: true,
      data: {
        overview: overview[0],
        low_stock_products: lowStockProducts,
        category_breakdown: categoryBreakdown,
      },
    });
  } catch (error) {
    console.error("Error fetching inventory report:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch inventory report",
    });
  }
};

// Export comprehensive report data
export const exportReportData = async (req: Request, res: Response) => {
  try {
    const { reportType, period = "month" } = req.query;

    let reportData: any = {};

    switch (reportType) {
      case "business":
        const businessResponse = await getBusinessReports(
          { query: { period } } as Request,
          {} as Response,
        );
        reportData = businessResponse;
        break;
      case "sales":
        const salesResponse = await getSalesPerformance(
          { query: { period } } as Request,
          {} as Response,
        );
        reportData = salesResponse;
        break;
      case "professionals":
        const professionalsResponse = await getProfessionalPerformance(
          { query: { period } } as Request,
          {} as Response,
        );
        reportData = professionalsResponse;
        break;
      case "clients":
        const clientsResponse = await getClientAnalysis(
          { query: { period } } as Request,
          {} as Response,
        );
        reportData = clientsResponse;
        break;
      case "financial":
        const financialResponse = await getFinancialAnalysis(
          { query: { period } } as Request,
          {} as Response,
        );
        reportData = financialResponse;
        break;
      case "inventory":
        const inventoryResponse = await getInventoryReport(
          {} as Request,
          {} as Response,
        );
        reportData = inventoryResponse;
        break;
      default:
        return res.status(400).json({
          success: false,
          error: "Invalid report type",
        });
    }

    res.json({
      success: true,
      data: reportData,
      export_metadata: {
        generated_at: new Date().toISOString(),
        report_type: reportType,
        period,
        format: "JSON",
      },
    });
  } catch (error) {
    console.error("Error exporting report data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to export report data",
    });
  }
};
