import { Request, Response } from "express";
import { sql } from "../../database/neon-config";

// Get all services with pagination and filters
export const getServices = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "name",
      order = "ASC",
      search,
      category,
      is_active,
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
        `(name ILIKE '%${search}%' OR description ILIKE '%${search}%' OR category ILIKE '%${search}%')`,
      );
    }

    if (category && category !== "all") {
      whereConditions.push(`category = '${category}'`);
    }

    if (is_active !== undefined) {
      whereConditions.push(`is_active = ${is_active === "true"}`);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Validate sort field
    const validSortFields = [
      "name",
      "category",
      "price",
      "duration",
      "popularity",
      "average_rating",
      "created_at",
    ];
    const sortField = validSortFields.includes(sort as string) ? sort : "name";
    const sortOrder = order === "ASC" ? "ASC" : "DESC";

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM services ${whereClause}`;
    const countResult = await sql.query(countQuery);
    const total = parseInt(countResult.rows[0].total);

    // Get services with pagination
    const servicesQuery = `
      SELECT
        id, name, description, category, price, duration, commission_rate,
        is_active, popularity, average_rating, total_bookings, image_url,
        created_at, updated_at
      FROM services
      ${whereClause}
      ORDER BY ${sortField} ${sortOrder}
      LIMIT ${limitNum} OFFSET ${offset}
    `;
    const services = await sql.query(servicesQuery);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: services.rows,
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
    console.error("Error fetching services:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch services",
    });
  }
};

// Get service by ID
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const services = await sql`
      SELECT * FROM services WHERE id = ${id}
    `;

    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Service not found",
      });
    }

    res.json({
      success: true,
      data: services[0],
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch service",
    });
  }
};

// Create new service
export const createService = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      category,
      price,
      duration,
      commission_rate,
      image_url,
    } = req.body;

    // Validate required fields
    if (!name || !category || !price || !duration) {
      return res.status(400).json({
        success: false,
        error: "Name, category, price, and duration are required",
      });
    }

    const newServices = await sql`
      INSERT INTO services (
        name, description, category, price, duration, commission_rate, image_url
      )
      VALUES (
        ${name}, ${description || null}, ${category}, ${price}, ${duration},
        ${commission_rate || 0}, ${image_url || null}
      )
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      data: newServices[0],
    });
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create service",
    });
  }
};

// Update service
export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      category,
      price,
      duration,
      commission_rate,
      is_active,
      image_url,
    } = req.body;

    // Check if service exists
    const existingService = await sql`
      SELECT id FROM services WHERE id = ${id}
    `;

    if (existingService.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Service not found",
      });
    }

    const updatedServices = await sql`
      UPDATE services
      SET
        name = COALESCE(${name}, name),
        description = COALESCE(${description}, description),
        category = COALESCE(${category}, category),
        price = COALESCE(${price}, price),
        duration = COALESCE(${duration}, duration),
        commission_rate = COALESCE(${commission_rate}, commission_rate),
        is_active = COALESCE(${is_active}, is_active),
        image_url = COALESCE(${image_url}, image_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    res.json({
      success: true,
      data: updatedServices[0],
    });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update service",
    });
  }
};

// Delete service
export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if service exists
    const existingService = await sql`
      SELECT id FROM services WHERE id = ${id}
    `;

    if (existingService.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Service not found",
      });
    }

    // Check if service has appointments
    const appointments = await sql`
      SELECT COUNT(*) as count FROM appointments WHERE service_id = ${id}
    `;

    if (appointments[0].count > 0) {
      // Soft delete by setting is_active to false
      await sql`
        UPDATE services SET is_active = false WHERE id = ${id}
      `;

      return res.json({
        success: true,
        message: "Service deactivated (has associated appointments)",
      });
    }

    // Hard delete if no appointments
    await sql`
      DELETE FROM services WHERE id = ${id}
    `;

    res.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete service",
    });
  }
};

// Get service statistics
export const getServiceStats = async (req: Request, res: Response) => {
  try {
    const stats = await sql`
      SELECT
        COUNT(*) as total_services,
        COUNT(*) FILTER (WHERE is_active = true) as active_services,
        COUNT(*) FILTER (WHERE is_active = false) as inactive_services,
        COUNT(DISTINCT category) as total_categories,
        ROUND(AVG(price), 2) as average_price,
        ROUND(AVG(duration), 2) as average_duration,
        MAX(price) as highest_price,
        MIN(price) as lowest_price
      FROM services
    `;

    // Get top categories
    const topCategories = await sql`
      SELECT 
        category,
        COUNT(*) as service_count,
        ROUND(AVG(price), 2) as avg_price,
        COALESCE(SUM(total_bookings), 0) as total_bookings
      FROM services
      WHERE is_active = true
      GROUP BY category
      ORDER BY service_count DESC, total_bookings DESC
      LIMIT 5
    `;

    res.json({
      success: true,
      data: {
        overview: stats[0],
        top_categories: topCategories,
      },
    });
  } catch (error) {
    console.error("Error fetching service stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch service statistics",
    });
  }
};

// Get popular services
export const getPopularServices = async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;

    const popularServices = await sql`
      SELECT 
        s.*,
        COUNT(a.id) as recent_bookings,
        COALESCE(SUM(a.price), 0) as recent_revenue
      FROM services s
      LEFT JOIN appointments a ON s.id = a.service_id 
        AND a.date >= CURRENT_DATE - INTERVAL '30 days'
        AND a.status IN ('concluido', 'confirmado')
      WHERE s.is_active = true
      GROUP BY s.id
      ORDER BY s.popularity DESC, recent_bookings DESC, s.average_rating DESC
      LIMIT ${limit}
    `;

    res.json({
      success: true,
      data: popularServices,
    });
  } catch (error) {
    console.error("Error fetching popular services:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch popular services",
    });
  }
};

// Get service categories
export const getServiceCategories = async (req: Request, res: Response) => {
  try {
    const categories = await sql`
      SELECT 
        category,
        COUNT(*) as service_count,
        ROUND(AVG(price), 2) as average_price,
        ROUND(AVG(duration), 2) as average_duration,
        COALESCE(SUM(total_bookings), 0) as total_bookings
      FROM services
      WHERE is_active = true
      GROUP BY category
      ORDER BY category
    `;

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching service categories:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch service categories",
    });
  }
};
