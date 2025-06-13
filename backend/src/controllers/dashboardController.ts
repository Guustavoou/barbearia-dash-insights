import { Request, Response } from "express";
import db from "../database/config";
import { successResponse, errorResponse, getDateRange } from "../utils";
import { DashboardStats, RevenueData, ServiceStats, Birthday } from "../types";

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(req: Request, res: Response) {
  try {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Current month revenue
    const currentMonthRevenue = db
      .prepare(
        `
      SELECT COALESCE(SUM(amount), 0) as revenue
      FROM transactions 
      WHERE type = 'receita' 
      AND status = 'concluido'
      AND strftime('%Y-%m', date) = ?
    `,
      )
      .get(
        `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}`,
      ) as { revenue: number };

    // Previous month revenue
    const previousMonthRevenue = db
      .prepare(
        `
      SELECT COALESCE(SUM(amount), 0) as revenue
      FROM transactions 
      WHERE type = 'receita' 
      AND status = 'concluido'
      AND strftime('%Y-%m', date) = ?
    `,
      )
      .get(
        `${previousYear}-${(previousMonth + 1).toString().padStart(2, "0")}`,
      ) as { revenue: number };

    // Revenue growth calculation
    const revenueGrowth =
      previousMonthRevenue.revenue > 0
        ? ((currentMonthRevenue.revenue - previousMonthRevenue.revenue) /
            previousMonthRevenue.revenue) *
          100
        : 0;

    // Accumulated revenue this year
    const accumulatedRevenue = db
      .prepare(
        `
      SELECT COALESCE(SUM(amount), 0) as revenue
      FROM transactions 
      WHERE type = 'receita' 
      AND status = 'concluido'
      AND strftime('%Y', date) = ?
    `,
      )
      .get(currentYear.toString()) as { revenue: number };

    // Best month revenue this year
    const bestMonthRevenue = db
      .prepare(
        `
      SELECT MAX(monthly_revenue) as best
      FROM (
        SELECT SUM(amount) as monthly_revenue
        FROM transactions 
        WHERE type = 'receita' 
        AND status = 'concluido'
        AND strftime('%Y', date) = ?
        GROUP BY strftime('%Y-%m', date)
      )
    `,
      )
      .get(currentYear.toString()) as { best: number };

    // Appointments statistics
    const currentMonthAppointments = db
      .prepare(
        `
      SELECT COUNT(*) as total
      FROM appointments 
      WHERE strftime('%Y-%m', date) = ?
    `,
      )
      .get(
        `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}`,
      ) as { total: number };

    const previousMonthAppointments = db
      .prepare(
        `
      SELECT COUNT(*) as total
      FROM appointments 
      WHERE strftime('%Y-%m', date) = ?
    `,
      )
      .get(
        `${previousYear}-${(previousMonth + 1).toString().padStart(2, "0")}`,
      ) as { total: number };

    const appointmentVariation =
      previousMonthAppointments.total > 0
        ? ((currentMonthAppointments.total - previousMonthAppointments.total) /
            previousMonthAppointments.total) *
          100
        : 0;

    // Client statistics
    const activeClients = db
      .prepare(
        `
      SELECT COUNT(*) as active
      FROM clients 
      WHERE status = 'ativo'
    `,
      )
      .get() as { active: number };

    const newClientsThisMonth = db
      .prepare(
        `
      SELECT COUNT(*) as new_clients
      FROM clients 
      WHERE strftime('%Y-%m', join_date) = ?
    `,
      )
      .get(
        `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}`,
      ) as { new_clients: number };

    // Retention rate (clients with visits in last 60 days)
    const clientsWithRecentVisits = db
      .prepare(
        `
      SELECT COUNT(*) as retained
      FROM clients 
      WHERE status = 'ativo' 
      AND last_visit >= date('now', '-60 days')
    `,
      )
      .get() as { retained: number };

    const retentionRate =
      activeClients.active > 0
        ? (clientsWithRecentVisits.retained / activeClients.active) * 100
        : 0;

    // Services statistics
    const completedServicesThisMonth = db
      .prepare(
        `
      SELECT COUNT(*) as completed
      FROM appointments 
      WHERE status = 'concluido'
      AND strftime('%Y-%m', date) = ?
    `,
      )
      .get(
        `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}`,
      ) as { completed: number };

    const totalServicesThisMonth = db
      .prepare(
        `
      SELECT COUNT(*) as total
      FROM appointments 
      WHERE strftime('%Y-%m', date) = ?
    `,
      )
      .get(
        `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}`,
      ) as { total: number };

    const completionRate =
      totalServicesThisMonth.total > 0
        ? (completedServicesThisMonth.completed /
            totalServicesThisMonth.total) *
          100
        : 0;

    // Peak hour analysis
    const peakHourData = db
      .prepare(
        `
      SELECT strftime('%H', time) as hour, COUNT(*) as count
      FROM appointments 
      WHERE date >= date('now', '-30 days')
      AND status = 'concluido'
      GROUP BY hour
      ORDER BY count DESC
      LIMIT 1
    `,
      )
      .get() as { hour: string; count: number } | undefined;

    const peakHour = peakHourData ? `${peakHourData.hour}:00` : "14:00";

    // Cancellations today
    const cancellationsToday = db
      .prepare(
        `
      SELECT COUNT(*) as cancellations
      FROM appointments 
      WHERE date = date('now')
      AND status = 'cancelado'
    `,
      )
      .get() as { cancellations: number };

    // Revenue status compared to average
    const avgMonthlyRevenue = db
      .prepare(
        `
      SELECT AVG(monthly_revenue) as avg_revenue
      FROM (
        SELECT SUM(amount) as monthly_revenue
        FROM transactions 
        WHERE type = 'receita' 
        AND status = 'concluido'
        AND date >= date('now', '-12 months')
        GROUP BY strftime('%Y-%m', date)
      )
    `,
      )
      .get() as { avg_revenue: number };

    const revenueStatus =
      currentMonthRevenue.revenue > avgMonthlyRevenue.avg_revenue
        ? "acima"
        : "abaixo";

    // Mock satisfaction rating (would come from customer feedback in real app)
    const satisfaction = 4.8;

    const dashboardStats: DashboardStats = {
      revenue: {
        current: currentMonthRevenue.revenue,
        growth: Math.round(revenueGrowth * 100) / 100,
        accumulated: accumulatedRevenue.revenue,
        best: bestMonthRevenue.best || 0,
      },
      appointments: {
        total: currentMonthAppointments.total,
        variation: Math.round(appointmentVariation * 100) / 100,
      },
      clients: {
        active: activeClients.active,
        new: newClientsThisMonth.new_clients,
        retention: Math.round(retentionRate * 100) / 100,
      },
      satisfaction,
      services: {
        completed: completedServicesThisMonth.completed,
        completion: Math.round(completionRate * 100) / 100,
      },
      insights: {
        peakHour,
        cancellations: cancellationsToday.cancellations,
        revenueStatus,
      },
    };

    res.json(
      successResponse(
        dashboardStats,
        "Dashboard statistics retrieved successfully",
      ),
    );
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    res.status(500).json(errorResponse("Failed to get dashboard statistics"));
  }
}

/**
 * Get revenue data for charts
 */
export async function getRevenueData(req: Request, res: Response) {
  try {
    const { period = "year" } = req.query;
    const currentYear = new Date().getFullYear();

    let query: string;
    let params: any[];

    if (period === "year") {
      // Last 12 months
      query = `
        SELECT 
          strftime('%Y-%m', date) as period,
          SUM(amount) as value
        FROM transactions 
        WHERE type = 'receita' 
        AND status = 'concluido'
        AND date >= date('now', '-12 months')
        GROUP BY period
        ORDER BY period
      `;
      params = [];
    } else {
      // Current year by month
      query = `
        SELECT 
          strftime('%m', date) as period,
          SUM(amount) as value
        FROM transactions 
        WHERE type = 'receita' 
        AND status = 'concluido'
        AND strftime('%Y', date) = ?
        GROUP BY period
        ORDER BY period
      `;
      params = [currentYear.toString()];
    }

    const data = db.prepare(query).all(...params);

    // Transform data for frontend
    const revenueData: RevenueData[] = data.map((item: any) => {
      let month: string;

      if (period === "year") {
        const [year, monthNum] = item.period.split("-");
        const monthNames = [
          "Jan",
          "Fev",
          "Mar",
          "Abr",
          "Mai",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Out",
          "Nov",
          "Dez",
        ];
        month = monthNames[parseInt(monthNum) - 1];
      } else {
        const monthNames = [
          "Jan",
          "Fev",
          "Mar",
          "Abr",
          "Mai",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Out",
          "Nov",
          "Dez",
        ];
        month = monthNames[parseInt(item.period) - 1];
      }

      return {
        month,
        value: item.value || 0,
      };
    });

    res.json(
      successResponse(revenueData, "Revenue data retrieved successfully"),
    );
  } catch (error) {
    console.error("Error getting revenue data:", error);
    res.status(500).json(errorResponse("Failed to get revenue data"));
  }
}

/**
 * Get top services data
 */
export async function getTopServices(req: Request, res: Response) {
  try {
    const { limit = 4 } = req.query;

    const query = `
      SELECT 
        s.name,
        COUNT(a.id) as count,
        SUM(CASE WHEN a.status = 'concluido' THEN a.price ELSE 0 END) as revenue
      FROM services s
      LEFT JOIN appointments a ON s.id = a.service_id
      WHERE a.date >= date('now', '-30 days') OR a.date IS NULL
      GROUP BY s.id, s.name
      ORDER BY revenue DESC, count DESC
      LIMIT ?
    `;

    const data = db.prepare(query).all(parseInt(limit as string));

    const topServices: ServiceStats[] = data.map((item: any) => ({
      name: item.name,
      count: item.count || 0,
      revenue: item.revenue || 0,
    }));

    res.json(
      successResponse(topServices, "Top services retrieved successfully"),
    );
  } catch (error) {
    console.error("Error getting top services:", error);
    res.status(500).json(errorResponse("Failed to get top services"));
  }
}

/**
 * Get upcoming appointments
 */
export async function getUpcomingAppointments(req: Request, res: Response) {
  try {
    const { limit = 5 } = req.query;

    const query = `
      SELECT 
        a.id, a.time, a.status,
        c.name as client,
        s.name as service
      FROM appointments a
      LEFT JOIN clients c ON a.client_id = c.id
      LEFT JOIN services s ON a.service_id = s.id
      WHERE a.date >= date('now')
      AND a.status NOT IN ('cancelado', 'faltou', 'concluido')
      ORDER BY a.date, a.time
      LIMIT ?
    `;

    const appointments = db.prepare(query).all(parseInt(limit as string));

    const upcomingAppointments = appointments.map((apt: any) => ({
      id: apt.id,
      client: apt.client,
      service: apt.service,
      time: apt.time,
      status: apt.status,
    }));

    res.json(
      successResponse(
        upcomingAppointments,
        "Upcoming appointments retrieved successfully",
      ),
    );
  } catch (error) {
    console.error("Error getting upcoming appointments:", error);
    res.status(500).json(errorResponse("Failed to get upcoming appointments"));
  }
}

/**
 * Get birthdays this month
 */
export async function getBirthdaysThisMonth(req: Request, res: Response) {
  try {
    // Using join_date as birthday for demo purposes
    const query = `
      SELECT name, join_date as birthday
      FROM clients 
      WHERE status = 'ativo'
      AND strftime('%m', join_date) = strftime('%m', 'now')
      ORDER BY strftime('%d', join_date)
      LIMIT 10
    `;

    const data = db.prepare(query).all();

    const birthdays: Birthday[] = data.map((item: any) => ({
      name: item.name,
      date: new Date(item.birthday).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
    }));

    res.json(successResponse(birthdays, "Birthdays retrieved successfully"));
  } catch (error) {
    console.error("Error getting birthdays:", error);
    res.status(500).json(errorResponse("Failed to get birthdays"));
  }
}

/**
 * Get quick insights for dashboard
 */
export async function getQuickInsights(req: Request, res: Response) {
  try {
    // Today's appointments
    const todayAppointments = db
      .prepare(
        `
      SELECT COUNT(*) as count
      FROM appointments 
      WHERE date = date('now')
      AND status NOT IN ('cancelado', 'faltou')
    `,
      )
      .get() as { count: number };

    // Today's revenue
    const todayRevenue = db
      .prepare(
        `
      SELECT COALESCE(SUM(amount), 0) as revenue
      FROM transactions 
      WHERE type = 'receita' 
      AND status = 'concluido'
      AND date = date('now')
    `,
      )
      .get() as { revenue: number };

    // This week's new clients
    const weeklyNewClients = db
      .prepare(
        `
      SELECT COUNT(*) as count
      FROM clients 
      WHERE join_date >= date('now', '-7 days')
    `,
      )
      .get() as { count: number };

    // Low stock products
    const lowStockProducts = db
      .prepare(
        `
      SELECT COUNT(*) as count
      FROM products 
      WHERE stock_quantity <= min_stock
      AND status = 'ativo'
    `,
      )
      .get() as { count: number };

    const insights = {
      todayAppointments: todayAppointments.count,
      todayRevenue: todayRevenue.revenue,
      weeklyNewClients: weeklyNewClients.count,
      lowStockProducts: lowStockProducts.count,
    };

    res.json(
      successResponse(insights, "Quick insights retrieved successfully"),
    );
  } catch (error) {
    console.error("Error getting quick insights:", error);
    res.status(500).json(errorResponse("Failed to get quick insights"));
  }
}
