import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCategories,
  getLowStockProducts,
  updateStock,
  getStockMovements,
} from "../../controllers/neon/productsController";

const router = Router();

// GET /api/products - Get all products with pagination and filters
router.get("/", getProducts);

// GET /api/products/categories - Get product categories
router.get("/categories", getProductCategories);

// GET /api/products/low-stock - Get low stock alerts
router.get("/low-stock", getLowStockProducts);

// GET /api/products/movements - Get stock movements
router.get("/movements", getStockMovements);

// GET /api/products/:id - Get product by ID
router.get("/:id", getProductById);

// POST /api/products - Create new product
router.post("/", createProduct);

// PUT /api/products/:id - Update product
router.put("/:id", updateProduct);

// PUT /api/products/:id/stock - Update stock
router.put("/:id/stock", updateStock);

// DELETE /api/products/:id - Delete product
router.delete("/:id", deleteProduct);

export default router;
