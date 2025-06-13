import { Request, Response } from "express";
import db from "../database/config";
import {
  successResponse,
  errorResponse,
  parsePagination,
  calculateOffset,
  createPaginationInfo,
} from "../utils";
import {
  Product,
  ProductWithMovements,
  StockMovement,
  CreateProductDto,
  UpdateProductDto,
} from "../types";

/**
 * Get all products with pagination and filtering
 */
export async function getProducts(req: Request, res: Response) {
  try {
    const { page, limit, sort, order, search } = parsePagination(req.query);
    const offset = calculateOffset(page, limit);

    let whereClause = "WHERE 1=1";
    const params: any[] = [];

    // Search functionality
    if (search) {
      whereClause +=
        " AND (name LIKE ? OR description LIKE ? OR brand LIKE ? OR supplier LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Category filter
    if (req.query.category && req.query.category !== "todos") {
      whereClause += " AND category = ?";
      params.push(req.query.category);
    }

    // Status filter
    if (req.query.status && req.query.status !== "todos") {
      whereClause += " AND status = ?";
      params.push(req.query.status);
    }

    // Low stock filter
    if (req.query.low_stock === "true") {
      whereClause += " AND stock_quantity <= min_stock";
    }

    // Count total records
    const countStmt = db.prepare(
      `SELECT COUNT(*) as total FROM products ${whereClause}`,
    );
    const { total } = countStmt.get(...params) as { total: number };

    // Get products with pagination
    const validSortFields = [
      "name",
      "category",
      "price",
      "stock_quantity",
      "min_stock",
      "created_at",
    ];
    const sortField = validSortFields.includes(sort) ? sort : "name";
    const orderBy = `ORDER BY ${sortField} ${order}`;

    const stmt = db.prepare(`
      SELECT 
        id, name, description, category, brand, price, cost_price, stock_quantity,
        min_stock, max_stock, unit, status, supplier, location, barcode,
        expiry_date, created_at, updated_at
      FROM products 
      ${whereClause} 
      ${orderBy}
      LIMIT ? OFFSET ?
    `);

    const products = stmt.all(...params, limit, offset) as Product[];

    const pagination = createPaginationInfo(page, limit, total);

    res.json(
      successResponse(products, "Products retrieved successfully", pagination),
    );
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json(errorResponse("Failed to get products"));
  }
}

/**
 * Get a single product by ID with recent movements
 */
export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const productStmt = db.prepare(`
      SELECT 
        id, name, description, category, brand, price, cost_price, stock_quantity,
        min_stock, max_stock, unit, status, supplier, location, barcode,
        expiry_date, created_at, updated_at
      FROM products 
      WHERE id = ?
    `);

    const product = productStmt.get(id) as Product | undefined;

    if (!product) {
      return res.status(404).json(errorResponse("Product not found"));
    }

    // Get recent stock movements
    const movementsStmt = db.prepare(`
      SELECT 
        id, type, quantity, reason, reference_id, created_at
      FROM stock_movements 
      WHERE product_id = ?
      ORDER BY created_at DESC
      LIMIT 10
    `);

    const movements = movementsStmt.all(id) as StockMovement[];

    const productWithMovements: ProductWithMovements = {
      ...product,
      recent_movements: movements,
    };

    res.json(
      successResponse(productWithMovements, "Product retrieved successfully"),
    );
  } catch (error) {
    console.error("Error getting product:", error);
    res.status(500).json(errorResponse("Failed to get product"));
  }
}

/**
 * Create a new product
 */
export async function createProduct(req: Request, res: Response) {
  try {
    const productData: CreateProductDto = req.body;

    // Check if product name already exists
    const existingProduct = db
      .prepare("SELECT id FROM products WHERE name = ?")
      .get(productData.name);
    if (existingProduct) {
      return res.status(400).json(errorResponse("Product name already exists"));
    }

    const stmt = db.prepare(`
      INSERT INTO products (
        name, description, category, brand, price, cost_price, stock_quantity,
        min_stock, max_stock, unit, supplier, location, barcode, expiry_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      productData.name,
      productData.description || null,
      productData.category,
      productData.brand || null,
      productData.price || null,
      productData.cost_price || null,
      productData.stock_quantity,
      productData.min_stock,
      productData.max_stock || 100,
      productData.unit,
      productData.supplier || null,
      productData.location || null,
      productData.barcode || null,
      productData.expiry_date || null,
    );

    // Create initial stock movement if quantity > 0
    if (productData.stock_quantity > 0) {
      db.prepare(
        `
        INSERT INTO stock_movements (product_id, type, quantity, reason)
        VALUES (?, 'entrada', ?, 'Estoque inicial')
      `,
      ).run(result.lastInsertRowid, productData.stock_quantity);
    }

    const newProduct = db
      .prepare(
        `
        SELECT 
          id, name, description, category, brand, price, cost_price, stock_quantity,
          min_stock, max_stock, unit, status, supplier, location, barcode,
          expiry_date, created_at, updated_at
        FROM products 
        WHERE id = ?
      `,
      )
      .get(result.lastInsertRowid) as Product;

    res
      .status(201)
      .json(successResponse(newProduct, "Product created successfully"));
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json(errorResponse("Failed to create product"));
  }
}

/**
 * Update a product
 */
export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData: UpdateProductDto = req.body;

    // Check if product exists
    const existingProduct = db
      .prepare("SELECT id, stock_quantity FROM products WHERE id = ?")
      .get(id) as { id: number; stock_quantity: number } | undefined;

    if (!existingProduct) {
      return res.status(404).json(errorResponse("Product not found"));
    }

    // Check if product name already exists (if being updated)
    if (updateData.name) {
      const nameCheck = db
        .prepare("SELECT id FROM products WHERE name = ? AND id != ?")
        .get(updateData.name, id);
      if (nameCheck) {
        return res
          .status(400)
          .json(errorResponse("Product name already exists"));
      }
    }

    // Handle stock quantity changes
    if (
      updateData.stock_quantity !== undefined &&
      updateData.stock_quantity !== existingProduct.stock_quantity
    ) {
      const difference =
        updateData.stock_quantity - existingProduct.stock_quantity;
      const movementType = difference > 0 ? "entrada" : "saida";
      const quantity = Math.abs(difference);

      // Create stock movement record
      db.prepare(
        `
        INSERT INTO stock_movements (product_id, type, quantity, reason)
        VALUES (?, ?, ?, 'Ajuste de estoque')
      `,
      ).run(id, movementType, quantity);
    }

    // Build dynamic update query
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(value);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json(errorResponse("No valid fields to update"));
    }

    updateFields.push("updated_at = CURRENT_TIMESTAMP");
    updateValues.push(id);

    const stmt = db.prepare(`
      UPDATE products 
      SET ${updateFields.join(", ")}
      WHERE id = ?
    `);

    stmt.run(...updateValues);

    // Get updated product
    const updatedProduct = db
      .prepare(
        `
        SELECT 
          id, name, description, category, brand, price, cost_price, stock_quantity,
          min_stock, max_stock, unit, status, supplier, location, barcode,
          expiry_date, created_at, updated_at
        FROM products 
        WHERE id = ?
      `,
      )
      .get(id) as Product;

    res.json(successResponse(updatedProduct, "Product updated successfully"));
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json(errorResponse("Failed to update product"));
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Check if product exists
    const existingProduct = db
      .prepare("SELECT id FROM products WHERE id = ?")
      .get(id);
    if (!existingProduct) {
      return res.status(404).json(errorResponse("Product not found"));
    }

    // Delete stock movements first (cascade)
    db.prepare("DELETE FROM stock_movements WHERE product_id = ?").run(id);

    // Delete the product
    const stmt = db.prepare("DELETE FROM products WHERE id = ?");
    stmt.run(id);

    res.json(successResponse(null, "Product deleted successfully"));
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json(errorResponse("Failed to delete product"));
  }
}

/**
 * Get product categories
 */
export async function getProductCategories(req: Request, res: Response) {
  try {
    const stmt = db.prepare(`
      SELECT DISTINCT category, COUNT(*) as count
      FROM products 
      WHERE status = 'ativo'
      GROUP BY category
      ORDER BY category
    `);

    const categories = stmt.all();

    res.json(
      successResponse(categories, "Product categories retrieved successfully"),
    );
  } catch (error) {
    console.error("Error getting product categories:", error);
    res.status(500).json(errorResponse("Failed to get product categories"));
  }
}

/**
 * Get stock statistics
 */
export async function getStockStats(req: Request, res: Response) {
  try {
    const statsStmt = db.prepare(`
      SELECT 
        COUNT(*) as total_products,
        SUM(CASE WHEN status = 'ativo' THEN 1 ELSE 0 END) as active_products,
        SUM(CASE WHEN stock_quantity <= min_stock THEN 1 ELSE 0 END) as low_stock_products,
        SUM(CASE WHEN stock_quantity = 0 THEN 1 ELSE 0 END) as out_of_stock_products,
        SUM(stock_quantity * COALESCE(cost_price, 0)) as total_stock_value,
        AVG(stock_quantity) as average_stock
      FROM products
    `);

    const stats = statsStmt.get() as any;

    // Get top selling products (based on stock movements)
    const topSellingStmt = db.prepare(`
      SELECT 
        p.name,
        SUM(CASE WHEN sm.type = 'saida' THEN sm.quantity ELSE 0 END) as total_sold
      FROM products p
      LEFT JOIN stock_movements sm ON p.id = sm.product_id
      WHERE sm.created_at >= date('now', '-30 days') OR sm.created_at IS NULL
      GROUP BY p.id, p.name
      ORDER BY total_sold DESC
      LIMIT 5
    `);

    const topSelling = topSellingStmt.all();

    // Get low rotation products
    const lowRotationStmt = db.prepare(`
      SELECT 
        p.name,
        p.stock_quantity,
        COALESCE(
          (SELECT MAX(sm.created_at) FROM stock_movements sm WHERE sm.product_id = p.id AND sm.type = 'saida'),
          p.created_at
        ) as last_sold
      FROM products p
      WHERE p.status = 'ativo'
      AND p.stock_quantity > 0
      HAVING last_sold <= date('now', '-60 days')
      ORDER BY last_sold
      LIMIT 5
    `);

    const lowRotation = lowRotationStmt.all();

    const stockStats = {
      totalProducts: stats.total_products,
      activeProducts: stats.active_products,
      lowStockProducts: stats.low_stock_products,
      outOfStockProducts: stats.out_of_stock_products,
      totalStockValue: stats.total_stock_value || 0,
      averageStock: Math.round(stats.average_stock * 100) / 100 || 0,
      topSellingProducts: topSelling,
      lowRotationProducts: lowRotation,
    };

    res.json(
      successResponse(stockStats, "Stock statistics retrieved successfully"),
    );
  } catch (error) {
    console.error("Error getting stock stats:", error);
    res.status(500).json(errorResponse("Failed to get stock statistics"));
  }
}

/**
 * Get low stock alerts
 */
export async function getLowStockAlerts(req: Request, res: Response) {
  try {
    const stmt = db.prepare(`
      SELECT 
        id, name, stock_quantity, min_stock, category, unit
      FROM products 
      WHERE stock_quantity <= min_stock AND status = 'ativo'
      ORDER BY (stock_quantity - min_stock), stock_quantity
    `);

    const alerts = stmt.all();

    res.json(
      successResponse(alerts, "Low stock alerts retrieved successfully"),
    );
  } catch (error) {
    console.error("Error getting low stock alerts:", error);
    res.status(500).json(errorResponse("Failed to get low stock alerts"));
  }
}

/**
 * Update stock quantity (for stock movements)
 */
export async function updateStock(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { type, quantity, reason } = req.body;

    if (!["entrada", "saida", "ajuste"].includes(type)) {
      return res
        .status(400)
        .json(
          errorResponse("Invalid movement type. Use: entrada, saida, ajuste"),
        );
    }

    if (!quantity || quantity <= 0) {
      return res
        .status(400)
        .json(errorResponse("Quantity must be greater than 0"));
    }

    // Get current stock
    const product = db
      .prepare("SELECT stock_quantity FROM products WHERE id = ?")
      .get(id) as { stock_quantity: number } | undefined;

    if (!product) {
      return res.status(404).json(errorResponse("Product not found"));
    }

    let newQuantity = product.stock_quantity;

    switch (type) {
      case "entrada":
        newQuantity += quantity;
        break;
      case "saida":
        if (product.stock_quantity < quantity) {
          return res
            .status(400)
            .json(errorResponse("Insufficient stock quantity"));
        }
        newQuantity -= quantity;
        break;
      case "ajuste":
        newQuantity = quantity;
        break;
    }

    // Update product stock
    db.prepare("UPDATE products SET stock_quantity = ? WHERE id = ?").run(
      newQuantity,
      id,
    );

    // Create stock movement record
    db.prepare(
      `
      INSERT INTO stock_movements (product_id, type, quantity, reason)
      VALUES (?, ?, ?, ?)
    `,
    ).run(id, type, quantity, reason || `${type} manual`);

    // Get updated product
    const updatedProduct = db
      .prepare(
        `
        SELECT 
          id, name, stock_quantity, min_stock, max_stock
        FROM products 
        WHERE id = ?
      `,
      )
      .get(id);

    res.json(successResponse(updatedProduct, "Stock updated successfully"));
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json(errorResponse("Failed to update stock"));
  }
}

/**
 * Get stock movements history
 */
export async function getStockMovements(req: Request, res: Response) {
  try {
    const { page, limit } = parsePagination(req.query);
    const offset = calculateOffset(page, limit);

    let whereClause = "WHERE 1=1";
    const params: any[] = [];

    // Product filter
    if (req.query.product_id) {
      whereClause += " AND sm.product_id = ?";
      params.push(req.query.product_id);
    }

    // Type filter
    if (req.query.type) {
      whereClause += " AND sm.type = ?";
      params.push(req.query.type);
    }

    // Date range filter
    if (req.query.start_date && req.query.end_date) {
      whereClause += " AND date(sm.created_at) BETWEEN ? AND ?";
      params.push(req.query.start_date, req.query.end_date);
    }

    // Count total records
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM stock_movements sm
      ${whereClause}
    `;
    const { total } = db.prepare(countQuery).get(...params) as {
      total: number;
    };

    // Get movements with product details
    const query = `
      SELECT 
        sm.id, sm.type, sm.quantity, sm.reason, sm.reference_id, sm.created_at,
        p.name as product_name, p.unit
      FROM stock_movements sm
      LEFT JOIN products p ON sm.product_id = p.id
      ${whereClause}
      ORDER BY sm.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const movements = db.prepare(query).all(...params, limit, offset);

    const pagination = createPaginationInfo(page, limit, total);

    res.json(
      successResponse(
        movements,
        "Stock movements retrieved successfully",
        pagination,
      ),
    );
  } catch (error) {
    console.error("Error getting stock movements:", error);
    res.status(500).json(errorResponse("Failed to get stock movements"));
  }
}
