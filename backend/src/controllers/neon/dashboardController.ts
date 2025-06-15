import { Request, Response } from "express";
import { sql } from "../../database/neon-config";

// Get comprehensive dashboard statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Basic counts and current month data
    const basicStats = await sql`
      SELECT 
        (SELECT COUNT(*) FROM clients WHERE status = 'ativo') as total_clients,
        (SELECT COUNT(*) FROM professionals WHERE status = 'ativo') as total_professionals,
        (SELECT COUNT(*) FROM services WHERE is_active = true) as total_services,
        (SELECT COUNT(*) FROM appointments WHERE date >= CURRENT_DATE) as upcoming_appointments,
        (SELECT COUNT(*) FROM appointments WHERE date = CURRENT_DATE) as today_appointments,
        (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'receita' AND date >= DATE_TRUNC('month', CURRENT_DATE)) as month_revenue,
        (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'despesa' AND date >= DATE_TRUNC('month', CURRENT_DATE)) as month_expenses
    `;

    // Pending receivables (scheduled appointments not yet paid)
    const pendingReceivables = await sql`
      SELECT COALESCE(SUM(a.price), 0) as pending_amount
      FROM appointments a
      LEFT JOIN transactions t ON t.reference_id = a.id AND t.reference_type = 'appointment'
      WHERE a.status IN ('agendado', 'confirmado') 
        AND a.date >= CURRENT_DATE
        AND t.id IS NULL
    `;

    // Payment methods distribution (current month)
    const paymentMethods = await sql`
      SELECT 
        payment_method,
        COUNT(*) as count,
        COALESCE(SUM(amount), 0) as total_amount,
        ROUND((COUNT(*) * 100.0 / NULLIF(SUM(COUNT(*)) OVER(), 0)), 1) as percentage
      FROM transactions 
      WHERE type = 'receita' 
        AND date >= DATE_TRUNC('month', CURRENT_DATE)
        AND payment_method IS NOT NULL
      GROUP BY payment_method
      ORDER BY total_amount DESC
    `;

    // Commission paid this month
    const commissionPaid = await sql`
      SELECT COALESCE(SUM(commission_amount), 0) as total_commission
      FROM commission_payments 
      WHERE status = 'paid' 
        AND payment_date >= DATE_TRUNC('month', CURRENT_DATE)
    `;

    // Cancellation rate (last 30 days)
    const cancellationRate = await sql`
      WITH appointment_stats AS (
        SELECT 
          COUNT(*) as total_appointments,
          COUNT(*) FILTER (WHERE status = 'cancelado') as cancelled_appointments
        FROM appointments 
        WHERE date >= CURRENT_DATE - INTERVAL '30 days'
      )
      SELECT 
        total_appointments,
        cancelled_appointments,
        CASE 
          WHEN total_appointments > 0 THEN 
            ROUND((cancelled_appointments * 100.0 / total_appointments), 1)
          ELSE 0 
        END as cancellation_rate
      FROM appointment_stats
    `;

    // Peak hours (last 7 days)
    const peakHours = await sql`
      SELECT 
        EXTRACT(HOUR FROM time) as hour,
        COUNT(*) as appointment_count,
        COALESCE(SUM(price), 0) as revenue
      FROM appointments 
      WHERE date >= CURRENT_DATE - INTERVAL '7 days'
        AND status IN ('concluido', 'confirmado', 'agendado')
      GROUP BY EXTRACT(HOUR FROM time)
      ORDER BY appointment_count DESC
      LIMIT 3
    `;

    // Inactive clients (no appointments in last 90 days)
    const inactiveClients = await sql`
      SELECT COUNT(*) as inactive_count
      FROM clients c
      WHERE c.status = 'ativo'
        AND NOT EXISTS (
          SELECT 1 FROM appointments a 
          WHERE a.client_id = c.id 
            AND a.date >= CURRENT_DATE - INTERVAL '90 days'
        )
    `;

    // New client conversion rate (clients with more than 1 appointment vs total new clients last 30 days)
    const newClientConversion = await sql`
      WITH new_clients AS (
        SELECT id
        FROM clients 
        WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      ),
      returning_new_clients AS (
        SELECT nc.id
        FROM new_clients nc
        WHERE (
          SELECT COUNT(*) 
          FROM appointments a 
          WHERE a.client_id = nc.id
        ) > 1
      )
      SELECT 
        COUNT(DISTINCT nc.id) as new_clients_count,
        COUNT(DISTINCT rnc.id) as returning_new_clients,
        CASE 
          WHEN COUNT(DISTINCT nc.id) > 0 THEN 
            ROUND((COUNT(DISTINCT rnc.id) * 100.0 / COUNT(DISTINCT nc.id)), 1)
          ELSE 0 
        END as conversion_rate
      FROM new_clients nc
      LEFT JOIN returning_new_clients rnc ON nc.id = rnc.id
    `;

    // Average rating from client feedback
    const averageRating = await sql`
      SELECT 
        COALESCE(ROUND(AVG(rating), 1), 0) as average_rating,
        COUNT(*) as total_ratings
      FROM client_ratings 
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    `;

    // Professional occupancy rates
    const professionalOccupancy = await sql`
      WITH professional_schedule AS (
        SELECT 
          p.id,
          p.name,
          -- Calculate available hours per day (assuming 8 hours workday)
          8 * array_length(string_to_array(replace(replace(p.work_days::text, '[', ''), ']', ''), ','), 1) as weekly_available_hours
        FROM professionals p 
        WHERE p.status = 'ativo'
      ),
      professional_worked_hours AS (
        SELECT 
          a.professional_id,
          COUNT(*) * AVG(duration) / 60.0 as worked_hours_week
        FROM appointments a
        WHERE a.date >= CURRENT_DATE - INTERVAL '7 days'
          AND a.status IN ('concluido', 'confirmado')
          AND a.professional_id IS NOT NULL
        GROUP BY a.professional_id
      )
      SELECT 
        ps.id,
        ps.name,
        COALESCE(pwh.worked_hours_week, 0) as worked_hours,
        ps.weekly_available_hours,
        CASE 
          WHEN ps.weekly_available_hours > 0 THEN 
            ROUND((COALESCE(pwh.worked_hours_week, 0) * 100.0 / ps.weekly_available_hours), 1)
          ELSE 0 
        END as occupancy_rate
      FROM professional_schedule ps
      LEFT JOIN professional_worked_hours pwh ON ps.id = pwh.professional_id
      ORDER BY occupancy_rate DESC
    `;

    // Messages sent (last 30 days)
    const messagesSent = await sql`
      SELECT 
        COUNT(*) as total_messages,
        COUNT(*) FILTER (WHERE status = 'sent') as sent_messages,
        COUNT(*) FILTER (WHERE status = 'delivered') as delivered_messages,
        COUNT(*) FILTER (WHERE channel = 'whatsapp') as whatsapp_messages,
        COUNT(*) FILTER (WHERE channel = 'sms') as sms_messages,
        COUNT(*) FILTER (WHERE channel = 'email') as email_messages
      FROM notifications 
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
        AND channel IN ('whatsapp', 'sms', 'email')
    `;

    // Campaign clicks and performance
    const campaignPerformance = await sql`
      SELECT 
        COUNT(*) as total_campaigns,
        COALESCE(SUM(reach), 0) as total_reach,
        COALESCE(SUM(clicks), 0) as total_clicks,
        COALESCE(SUM(conversions), 0) as total_conversions,
        CASE 
          WHEN SUM(reach) > 0 THEN 
            ROUND((SUM(clicks) * 100.0 / SUM(reach)), 1)
          ELSE 0 
        END as click_rate,
        CASE 
          WHEN SUM(clicks) > 0 THEN 
            ROUND((SUM(conversions) * 100.0 / SUM(clicks)), 1)
          ELSE 0 
        END as conversion_rate
      FROM campaigns 
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
        AND status = 'active'
    `;

    // Online users (sessions active in last 30 minutes)
    const onlineUsers = await sql`
      SELECT 
        COUNT(*) as total_online,
        COUNT(*) FILTER (WHERE user_type = 'client') as clients_online,
        COUNT(*) FILTER (WHERE user_type = 'professional') as professionals_online,
        COUNT(*) FILTER (WHERE user_type = 'admin') as admins_online
      FROM user_sessions 
      WHERE last_activity >= CURRENT_TIMESTAMP - INTERVAL '30 minutes'
        AND expires_at > CURRENT_TIMESTAMP
    `;

    const result = basicStats[0];
    const netIncome = result.month_revenue - result.month_expenses;
    const profitMargin =
      result.month_revenue > 0
        ? ((netIncome / result.month_revenue) * 100).toFixed(1)
        : 0;

    // Compile all data
    const dashboardData = {
      // Basic metrics
      ...result,
      net_income: netIncome,
      profit_margin: parseFloat(profitMargin as string),

      // New advanced metrics
      pending_receivables: pendingReceivables[0]?.pending_amount || 0,
      payment_methods: paymentMethods,
      commission_paid: commissionPaid[0]?.total_commission || 0,
      cancellation_rate: cancellationRate[0]?.cancellation_rate || 0,
      peak_hours: peakHours,
      inactive_clients: inactiveClients[0]?.inactive_count || 0,
      new_client_conversion: newClientConversion[0]?.conversion_rate || 0,
      average_rating: averageRating[0]?.average_rating || 0,
      total_ratings: averageRating[0]?.total_ratings || 0,
      professional_occupancy: professionalOccupancy,
      messages_sent: messagesSent[0] || {},
      campaign_performance: campaignPerformance[0] || {},
      online_users: onlineUsers[0] || {},
    };

    res.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch dashboard statistics",
    });
  }
};

// Get revenue data for charts with advanced filtering
export const getRevenueData = async (req: Request, res: Response) => {
  try {
    const { period = "month", compare = false } = req.query;

    let dateFilter;
    let groupBy;
    let dateFormat;
    let previousPeriodFilter;

    switch (period) {
      case "week":
        dateFilter = "date >= CURRENT_DATE - INTERVAL '7 days'";
        groupBy = "date";
        dateFormat = "TO_CHAR(date, 'DD/MM')";
        previousPeriodFilter =
          "date >= CURRENT_DATE - INTERVAL '14 days' AND date < CURRENT_DATE - INTERVAL '7 days'";
        break;
      case "year":
        dateFilter = "date >= CURRENT_DATE - INTERVAL '12 months'";
        groupBy = "DATE_TRUNC('month', date)";
        dateFormat = "TO_CHAR(DATE_TRUNC('month', date), 'MM/YYYY')";
        previousPeriodFilter =
          "date >= CURRENT_DATE - INTERVAL '24 months' AND date < CURRENT_DATE - INTERVAL '12 months'";
        break;
      default: // month
        dateFilter = "date >= CURRENT_DATE - INTERVAL '30 days'";
        groupBy = "date";
        dateFormat = "TO_CHAR(date, 'DD/MM')";
        previousPeriodFilter =
          "date >= CURRENT_DATE - INTERVAL '60 days' AND date < CURRENT_DATE - INTERVAL '30 days'";
    }

    // Current period data
    const currentData = await sql`
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

    // Previous period data for comparison (if requested)
    let previousData = [];
    if (compare) {
      previousData = await sql`
        SELECT 
          ${sql.unsafe(dateFormat)} as period,
          COALESCE(SUM(CASE WHEN type = 'receita' THEN amount ELSE 0 END), 0) as revenue,
          COALESCE(SUM(CASE WHEN type = 'despesa' THEN amount ELSE 0 END), 0) as expenses,
          COUNT(CASE WHEN type = 'receita' THEN 1 END) as transaction_count
        FROM transactions 
        WHERE ${sql.unsafe(previousPeriodFilter)}
        GROUP BY ${sql.unsafe(groupBy)}
        ORDER BY ${sql.unsafe(groupBy)}
      `;
    }

    // Calculate profit for each period
    const processedData = currentData.map((item) => ({
      ...item,
      profit: item.revenue - item.expenses,
      profit_margin:
        item.revenue > 0
          ? (((item.revenue - item.expenses) / item.revenue) * 100).toFixed(1)
          : 0,
    }));

    res.json({
      success: true,
      data: {
        current: processedData,
        previous: previousData,
        summary: {
          total_revenue: currentData.reduce(
            (sum, item) => sum + item.revenue,
            0,
          ),
          total_expenses: currentData.reduce(
            (sum, item) => sum + item.expenses,
            0,
          ),
          total_profit: currentData.reduce(
            (sum, item) => sum + (item.revenue - item.expenses),
            0,
          ),
          total_transactions: currentData.reduce(
            (sum, item) => sum + item.transaction_count,
            0,
          ),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch revenue data",
    });
  }
};

// Get detailed financial metrics
export const getFinancialMetrics = async (req: Request, res: Response) => {
  try {
    const { period = "month" } = req.query;

    const periodFilter =
      period === "week"
        ? "date >= CURRENT_DATE - INTERVAL '7 days'"
        : period === "year"
          ? "date >= CURRENT_DATE - INTERVAL '12 months'"
          : "date >= DATE_TRUNC('month', CURRENT_DATE)";

    // Detailed revenue breakdown
    const revenueBreakdown = await sql`
      SELECT 
        category,
        COALESCE(SUM(amount), 0) as total,
        COUNT(*) as count,
        ROUND(AVG(amount), 2) as average_transaction
      FROM transactions 
      WHERE type = 'receita' 
        AND ${sql.unsafe(periodFilter)}
      GROUP BY category
      ORDER BY total DESC
    `;

    // Expense breakdown
    const expenseBreakdown = await sql`
      SELECT 
        category,
        COALESCE(SUM(amount), 0) as total,
        COUNT(*) as count,
        ROUND(AVG(amount), 2) as average_transaction
      FROM transactions 
      WHERE type = 'despesa' 
        AND ${sql.unsafe(periodFilter)}
      GROUP BY category
      ORDER BY total DESC
    `;

    // Payment method performance
    const paymentMethodPerformance = await sql`
      SELECT 
        payment_method,
        COUNT(*) as transactions,
        COALESCE(SUM(amount), 0) as total_amount,
        ROUND(AVG(amount), 2) as average_amount,
        ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()), 1) as usage_percentage
      FROM transactions 
      WHERE type = 'receita' 
        AND ${sql.unsafe(periodFilter)}
        AND payment_method IS NOT NULL
      GROUP BY payment_method
      ORDER BY total_amount DESC
    `;

    res.json({
      success: true,
      data: {
        revenue_breakdown: revenueBreakdown,
        expense_breakdown: expenseBreakdown,
        payment_methods: paymentMethodPerformance,
      },
    });
  } catch (error) {
    console.error("Error fetching financial metrics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch financial metrics",
    });
  }
};

// Get operational metrics
export const getOperationalMetrics = async (req: Request, res: Response) => {
  try {
    // Service performance metrics
    const serviceMetrics = await sql`
      WITH service_stats AS (
        SELECT 
          s.id,
          s.name,
          s.category,
          s.price,
          COUNT(a.id) as bookings_30_days,
          COALESCE(SUM(a.price), 0) as revenue_30_days,
          COALESCE(AVG(cr.rating), 0) as avg_rating,
          COUNT(cr.id) as rating_count
        FROM services s
        LEFT JOIN appointments a ON s.id = a.service_id 
          AND a.date >= CURRENT_DATE - INTERVAL '30 days'
          AND a.status IN ('concluido', 'confirmado')
        LEFT JOIN client_ratings cr ON s.id = cr.service_id
          AND cr.created_at >= CURRENT_DATE - INTERVAL '30 days'
        WHERE s.is_active = true
        GROUP BY s.id, s.name, s.category, s.price
      )
      SELECT *,
        CASE 
          WHEN bookings_30_days > 0 THEN ROUND(revenue_30_days / bookings_30_days, 2)
          ELSE 0 
        END as avg_transaction_value
      FROM service_stats
      ORDER BY revenue_30_days DESC
      LIMIT 10
    `;

    // Client behavior metrics
    const clientMetrics = await sql`
      WITH client_behavior AS (
        SELECT 
          COUNT(*) as total_active_clients,
          ROUND(AVG(total_spent), 2) as avg_lifetime_value,
          ROUND(AVG(visits), 1) as avg_visits_per_client,
          COUNT(*) FILTER (WHERE last_visit >= CURRENT_DATE - INTERVAL '30 days') as active_last_30_days,
          COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_clients_30_days
        FROM clients 
        WHERE status = 'ativo'
      )
      SELECT *,
        ROUND((active_last_30_days * 100.0 / NULLIF(total_active_clients, 0)), 1) as activity_rate
      FROM client_behavior
    `;

    // Professional performance
    const professionalMetrics = await sql`
      SELECT 
        p.id,
        p.name,
        p.commission,
        COUNT(a.id) as appointments_30_days,
        COALESCE(SUM(a.price), 0) as revenue_30_days,
        COALESCE(AVG(cr.rating), 0) as avg_rating,
        COUNT(cr.id) as rating_count,
        ROUND((p.commission / 100.0) * COALESCE(SUM(a.price), 0), 2) as commission_earned
      FROM professionals p
      LEFT JOIN appointments a ON p.id = a.professional_id 
        AND a.date >= CURRENT_DATE - INTERVAL '30 days'
        AND a.status IN ('concluido', 'confirmado')
      LEFT JOIN client_ratings cr ON p.id = cr.professional_id
        AND cr.created_at >= CURRENT_DATE - INTERVAL '30 days'
      WHERE p.status = 'ativo'
      GROUP BY p.id, p.name, p.commission
      ORDER BY revenue_30_days DESC
    `;

    res.json({
      success: true,
      data: {
        services: serviceMetrics,
        clients: clientMetrics[0] || {},
        professionals: professionalMetrics,
      },
    });
  } catch (error) {
    console.error("Error fetching operational metrics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch operational metrics",
    });
  }
};

// Legacy endpoints for backward compatibility
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

export const getQuickInsights = async (req: Request, res: Response) => {
  try {
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
