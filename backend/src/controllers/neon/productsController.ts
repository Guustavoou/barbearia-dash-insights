import { Request, Response } from "express";
import { sql } from "../../database/neon-config";

// Get all products with pagination and filters
export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "name",
      order = "ASC",
      search,
      category,
      brand,
      status,
      low_stock,
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
        `(name ILIKE '%${search}%' OR description ILIKE '%${search}%' OR sku ILIKE '%${search}%' OR brand ILIKE '%${search}%')`,
      );
    }

    if (category && category !== "all") {
      whereConditions.push(`category = '${category}'`);
    }

    if (brand && brand !== "all") {
      whereConditions.push(`brand = '${brand}'`);
    }

    if (status && status !== "all") {
      whereConditions.push(`status = '${status}'`);
    }

    if (low_stock === "true") {
      whereConditions.push(`current_stock <= min_stock`);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Validate sort field
    const validSortFields = [
      "name",
      "category",
      "brand",
      "price",
      "current_stock",
      "created_at",
    ];
    const sortField = validSortFields.includes(sort as string) ? sort : "name";
    const sortOrder = order === "ASC" ? "ASC" : "DESC";

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM products ${whereClause}`;
    const countResult = await sql.unsafe(countQuery);
    const total = parseInt(countResult[0].total);

    // Get products with pagination
    const productsQuery = `
      SELECT
        id, name, description, sku, category, brand, price, cost_price,
        current_stock, min_stock, max_stock, status, supplier, image_url,
        created_at, updated_at
      FROM products
      ${whereClause}
      ORDER BY ${sortField} ${sortOrder}
      LIMIT ${limitNum} OFFSET ${offset}
    `;
    const products = await sql.unsafe(productsQuery);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: products.rows,
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
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch products",
    });
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const products = await sql`
      SELECT * FROM products WHERE id = ${id}
    `;

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.json({
      success: true,
      data: products[0],
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch product",
    });
  }
};

// Create new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      sku,
      category,
      brand,
      price,
      cost_price,
      current_stock,
      min_stock,
      max_stock,
      supplier,
      image_url,
    } = req.body;

    // Validate required fields
    if (!name || !category || !price || current_stock === undefined) {
      return res.status(400).json({
        success: false,
        error: "Name, category, price, and current stock are required",
      });
    }

    // Check if SKU already exists
    if (sku) {
      const existingProduct = await sql`
        SELECT id FROM products WHERE sku = ${sku}
      `;

      if (existingProduct.length > 0) {
        return res.status(400).json({
          success: false,
          error: "SKU already exists",
        });
      }
    }

    const newProducts = await sql`
      INSERT INTO products (
        name, description, sku, category, brand, price, cost_price,
        current_stock, min_stock, max_stock, supplier, image_url
      )
      VALUES (
        ${name}, ${description || null}, ${sku || null}, ${category}, ${brand || null},
        ${price}, ${cost_price || null}, ${current_stock}, ${min_stock || 5},
        ${max_stock || null}, ${supplier || null}, ${image_url || null}
      )
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      data: newProducts[0],
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create product",
    });
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      sku,
      category,
      brand,
      price,
      cost_price,
      current_stock,
      min_stock,
      max_stock,
      status,
      supplier,
      image_url,
    } = req.body;

    // Check if product exists
    const existingProduct = await sql`
      SELECT id FROM products WHERE id = ${id}
    `;

    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    // Check if SKU already exists (excluding current product)
    if (sku) {
      const skuExists = await sql`
        SELECT id FROM products WHERE sku = ${sku} AND id != ${id}
      `;

      if (skuExists.length > 0) {
        return res.status(400).json({
          success: false,
          error: "SKU already exists",
        });
      }
    }

    const updatedProducts = await sql`
      UPDATE products
      SET
        name = COALESCE(${name}, name),
        description = COALESCE(${description}, description),
        sku = COALESCE(${sku}, sku),
        category = COALESCE(${category}, category),
        brand = COALESCE(${brand}, brand),
        price = COALESCE(${price}, price),
        cost_price = COALESCE(${cost_price}, cost_price),
        current_stock = COALESCE(${current_stock}, current_stock),
        min_stock = COALESCE(${min_stock}, min_stock),
        max_stock = COALESCE(${max_stock}, max_stock),
        status = COALESCE(${status}, status),
        supplier = COALESCE(${supplier}, supplier),
        image_url = COALESCE(${image_url}, image_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    res.json({
      success: true,
      data: updatedProducts[0],
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update product",
    });
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const existingProduct = await sql`
      SELECT id FROM products WHERE id = ${id}
    `;

    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    // Soft delete by setting status to inactive
    await sql`
      UPDATE products SET status = 'inativo' WHERE id = ${id}
    `;

    res.json({
      success: true,
      message: "Product deactivated successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete product",
    });
  }
};

// Get product statistics
export const getProductStats = async (req: Request, res: Response) => {
  try {
    const stats = await sql`
      SELECT
        COUNT(*) as total_products,
        COUNT(*) FILTER (WHERE status = 'ativo') as active_products,
        COUNT(*) FILTER (WHERE status = 'inativo') as inactive_products,
        COUNT(*) FILTER (WHERE current_stock <= min_stock) as low_stock_products,
        COUNT(*) FILTER (WHERE current_stock = 0) as out_of_stock_products,
        COUNT(DISTINCT category) as total_categories,
        COUNT(DISTINCT brand) as total_brands,
        COALESCE(SUM(current_stock * cost_price), 0) as total_inventory_value,
        ROUND(AVG(price), 2) as average_price
      FROM products
    `;

    // Get top categories by product count
    const topCategories = await sql`
      SELECT 
        category,
        COUNT(*) as product_count,
        COALESCE(SUM(current_stock), 0) as total_stock,
        ROUND(AVG(price), 2) as avg_price
      FROM products
      WHERE status = 'ativo'
      GROUP BY category
      ORDER BY product_count DESC
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
    console.error("Error fetching product stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch product statistics",
    });
  }
};

// Get low stock products
export const getLowStockProducts = async (req: Request, res: Response) => {
  try {
    const { limit = 20 } = req.query;

    const lowStockProducts = await sql`
      SELECT 
        id, name, sku, category, brand, current_stock, min_stock,
        price, status
      FROM products
      WHERE current_stock <= min_stock
        AND status = 'ativo'
      ORDER BY 
        CASE WHEN current_stock = 0 THEN 0 ELSE 1 END,
        (current_stock / NULLIF(min_stock, 0))
      LIMIT ${limit}
    `;

    res.json({
      success: true,
      data: lowStockProducts,
    });
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch low stock products",
    });
  }
};

// Update product stock
export const updateProductStock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity, operation, reason } = req.body;

    // Validate required fields
    if (!quantity || !operation) {
      return res.status(400).json({
        success: false,
        error: "Quantity and operation are required",
      });
    }

    // Validate operation
    if (!["add", "remove", "set"].includes(operation)) {
      return res.status(400).json({
        success: false,
        error: "Operation must be 'add', 'remove', or 'set'",
      });
    }

    // Get current product
    const product = await sql`
      SELECT current_stock FROM products WHERE id = ${id}
    `;

    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    let newStock;
    const currentStock = product[0].current_stock;

    switch (operation) {
      case "add":
        newStock = currentStock + quantity;
        break;
      case "remove":
        newStock = Math.max(0, currentStock - quantity);
        break;
      case "set":
        newStock = Math.max(0, quantity);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: "Invalid operation",
        });
    }

    // Update stock
    const updatedProduct = await sql`
      UPDATE products
      SET 
        current_stock = ${newStock},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    // Log stock movement (if you have a stock_movements table)
    // await sql`
    //   INSERT INTO stock_movements (product_id, operation, quantity, previous_stock, new_stock, reason)
    //   VALUES (${id}, ${operation}, ${quantity}, ${currentStock}, ${newStock}, ${reason || null})
    // `;

    res.json({
      success: true,
      data: updatedProduct[0],
      message: `Stock ${operation === "set" ? "set to" : operation === "add" ? "increased by" : "decreased by"} ${quantity}`,
    });
  } catch (error) {
    console.error("Error updating product stock:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update product stock",
    });
  }
};

// Get product categories
export const getProductCategories = async (req: Request, res: Response) => {
  try {
    const categories = await sql`
      SELECT 
        category,
        COUNT(*) as product_count,
        COALESCE(SUM(current_stock), 0) as total_stock,
        ROUND(AVG(price), 2) as average_price,
        COALESCE(SUM(current_stock * cost_price), 0) as category_value
      FROM products
      WHERE status = 'ativo'
      GROUP BY category
      ORDER BY category
    `;

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching product categories:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch product categories",
    });
  }
};

// Get product brands
export const getProductBrands = async (req: Request, res: Response) => {
  try {
    const brands = await sql`
      SELECT 
        brand,
        COUNT(*) as product_count,
        COALESCE(SUM(current_stock), 0) as total_stock,
        ROUND(AVG(price), 2) as average_price
      FROM products
      WHERE status = 'ativo' AND brand IS NOT NULL
      GROUP BY brand
      ORDER BY product_count DESC
    `;

    res.json({
      success: true,
      data: brands,
    });
  } catch (error) {
    console.error("Error fetching product brands:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch product brands",
    });
  }
};
