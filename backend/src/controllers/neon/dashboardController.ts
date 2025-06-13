import { Request, Response } from "express";
import { sql } from "../../database/neon-config";

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Get basic counts
    const stats = await sql`
      SELECT 
        (SELECT COUNT(*) FROM clients WHERE status = 'ativo') as total_clients,
        (SELECT COUNT(*) FROM professionals WHERE status = 'ativo') as total_professionals,
        (SELECT COUNT(*) FROM services WHERE is_active = true) as total_services,
        (SELECT COUNT(*) FROM appointments WHERE date >= CURRENT_DATE) as upcoming_appointments,
        (SELECT COUNT(*) FROM appointments WHERE date = CURRENT_DATE) as today_appointments,
        (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'receita' AND date >= DATE_TRUNC('month', CURRENT_DATE)) as month_revenue,
        (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'despesa' AND date >= DATE_TRUNC('month', CURRENT_DATE)) as month_expenses
    `;

    const result = stats[0];

    // Calculate additional metrics
    const netIncome = result.month_revenue - result.month_expenses;
    const profitMargin =
      result.month_revenue > 0
        ? ((netIncome / result.month_revenue) * 100).toFixed(1)
        : 0;

    res.json({
      success: true,
      data: {
        ...result,
        net_income: netIncome,
        profit_margin: parseFloat(profitMargin as string),
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch dashboard statistics",
    });
  }
};

// Get revenue data for charts
export const getRevenueData = async (req: Request, res: Response) => {
  try {
    const { period = "month" } = req.query;

    let dateFilter;
    let groupBy;
    let dateFormat;

    switch (period) {
      case "week":
        dateFilter = "date >= CURRENT_DATE - INTERVAL '7 days'";
        groupBy = "date";
        dateFormat = "TO_CHAR(date, 'DD/MM')";
        break;
      case "year":
        dateFilter = "date >= CURRENT_DATE - INTERVAL '12 months'";
        groupBy = "DATE_TRUNC('month', date)";
        dateFormat = "TO_CHAR(DATE_TRUNC('month', date), 'MM/YYYY')";
        break;
      default: // month
        dateFilter = "date >= CURRENT_DATE - INTERVAL '30 days'";
        groupBy = "date";
        dateFormat = "TO_CHAR(date, 'DD/MM')";
    }

    const revenueData = await sql`
      SELECT 
        ${sql.unsafe(dateFormat)} as period,
        COALESCE(SUM(CASE WHEN type = 'receita' THEN amount ELSE 0 END), 0) as revenue,
        COALESCE(SUM(CASE WHEN type = 'despesa' THEN amount ELSE 0 END), 0) as expenses,
        COUNT(CASE WHEN type = 'receita' THEN 1 END) as transaction_count
      FROM transactions 
      WHERE ${sql.unsafe(dateFilter)}
      GROUP BY ${sql.unsafe(groupBy)}
      ORDER BY ${sql.unsafe(groupBy)}
    `;

    res.json({
      success: true,
      data: revenueData,
    });
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch revenue data",
    });
  }
};

// Get top services
export const getTopServices = async (req: Request, res: Response) => {
  try {
    const { limit = 5 } = req.query;

    const topServices = await sql`
      SELECT 
        s.id,
        s.name,
        s.category,
        s.price,
        s.duration,
        s.popularity,
        s.average_rating,
        COUNT(a.id) as recent_bookings,
        COALESCE(SUM(a.price), 0) as recent_revenue
      FROM services s
      LEFT JOIN appointments a ON s.id = a.service_id 
        AND a.date >= CURRENT_DATE - INTERVAL '30 days'
        AND a.status IN ('concluido', 'confirmado')
      WHERE s.is_active = true
      GROUP BY s.id, s.name, s.category, s.price, s.duration, s.popularity, s.average_rating
      ORDER BY s.popularity DESC, recent_bookings DESC
      LIMIT ${limit}
    `;

    res.json({
      success: true,
      data: topServices,
    });
  } catch (error) {
    console.error("Error fetching top services:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch top services",
    });
  }
};

// Get upcoming appointments
export const getUpcomingAppointments = async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;

    const appointments = await sql`
      SELECT 
        a.id,
        a.date,
        a.time,
        a.status,
        a.price,
        a.client_name,
        a.service_name,
        a.professional_name,
        c.phone as client_phone,
        s.duration
      FROM appointments a
      LEFT JOIN clients c ON a.client_id = c.id
      LEFT JOIN services s ON a.service_id = s.id
      WHERE a.date >= CURRENT_DATE
        AND a.status IN ('agendado', 'confirmado')
      ORDER BY a.date, a.time
      LIMIT ${limit}
    `;

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch upcoming appointments",
    });
  }
};

// Get clients with birthdays this month
export const getBirthdaysThisMonth = async (req: Request, res: Response) => {
  try {
    const birthdays = await sql`
      SELECT 
        id, name, phone, birthday,
        EXTRACT(DAY FROM birthday) as birthday_day,
        CASE 
          WHEN EXTRACT(DAY FROM birthday) = EXTRACT(DAY FROM CURRENT_DATE) THEN true
          ELSE false
        END as is_today
      FROM clients 
      WHERE 
        EXTRACT(MONTH FROM birthday) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND status = 'ativo'
        AND birthday IS NOT NULL
      ORDER BY EXTRACT(DAY FROM birthday)
    `;

    res.json({
      success: true,
      data: birthdays,
    });
  } catch (error) {
    console.error("Error fetching birthdays:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch birthdays",
    });
  }
};

// Get business insights
export const getQuickInsights = async (req: Request, res: Response) => {
  try {
    // Get various insights
    const insights = await sql`
      WITH monthly_stats AS (
        SELECT 
          COALESCE(SUM(CASE WHEN type = 'receita' THEN amount ELSE 0 END), 0) as current_month_revenue,
          COALESCE(SUM(CASE WHEN type = 'receita' AND date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') AND date < DATE_TRUNC('month', CURRENT_DATE) THEN amount ELSE 0 END), 0) as last_month_revenue
        FROM transactions
        WHERE date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
      ),
      appointment_stats AS (
        SELECT 
          COUNT(*) FILTER (WHERE date >= DATE_TRUNC('month', CURRENT_DATE)) as current_month_appointments,
          COUNT(*) FILTER (WHERE date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') AND date < DATE_TRUNC('month', CURRENT_DATE)) as last_month_appointments,
          COUNT(*) FILTER (WHERE date = CURRENT_DATE) as today_appointments,
          COUNT(*) FILTER (WHERE date = CURRENT_DATE AND status = 'concluido') as today_completed
        FROM appointments
      ),
      client_stats AS (
        SELECT 
          COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)) as new_clients_month
        FROM clients
      )
      SELECT 
        ms.current_month_revenue,
        ms.last_month_revenue,
        CASE 
          WHEN ms.last_month_revenue > 0 THEN 
            ROUND(((ms.current_month_revenue - ms.last_month_revenue) / ms.last_month_revenue * 100), 1)
          ELSE 0 
        END as revenue_growth,
        ast.current_month_appointments,
        ast.last_month_appointments,
        CASE 
          WHEN ast.last_month_appointments > 0 THEN 
            ROUND(((ast.current_month_appointments - ast.last_month_appointments) / ast.last_month_appointments * 100), 1)
          ELSE 0 
        END as appointment_growth,
        ast.today_appointments,
        ast.today_completed,
        cs.new_clients_month
      FROM monthly_stats ms, appointment_stats ast, client_stats cs
    `;

    const result = insights[0];

    // Get most popular payment method
    const paymentMethods = await sql`
      SELECT 
        payment_method,
        COUNT(*) as count,
        COALESCE(SUM(amount), 0) as total_amount
      FROM transactions 
      WHERE type = 'receita' 
        AND date >= DATE_TRUNC('month', CURRENT_DATE)
        AND payment_method IS NOT NULL
      GROUP BY payment_method
      ORDER BY count DESC
      LIMIT 1
    `;

    const mostUsedPaymentMethod = paymentMethods[0]?.payment_method || "PIX";

    res.json({
      success: true,
      data: {
        ...result,
        most_used_payment_method: mostUsedPaymentMethod,
        revenue_trend: result.revenue_growth >= 0 ? "increasing" : "decreasing",
        appointment_trend:
          result.appointment_growth >= 0 ? "increasing" : "decreasing",
      },
    });
  } catch (error) {
    console.error("Error fetching insights:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch business insights",
    });
  }
};
