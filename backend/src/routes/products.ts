import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCategories,
  getStockStats,
  getLowStockAlerts,
  updateStock,
  getStockMovements,
} from "../controllers/productsController";
import { asyncHandler } from "../middleware";

const router = Router();

// GET /api/products - Get all products with pagination
router.get("/", asyncHandler(getProducts));

// GET /api/products/categories - Get product categories
router.get("/categories", asyncHandler(getProductCategories));

// GET /api/products/stats - Get stock statistics
router.get("/stats", asyncHandler(getStockStats));

// GET /api/products/low-stock - Get low stock alerts
router.get("/low-stock", asyncHandler(getLowStockAlerts));

// GET /api/products/movements - Get stock movements history
router.get("/movements", asyncHandler(getStockMovements));

// GET /api/products/:id - Get product by ID
router.get("/:id", asyncHandler(getProductById));

// POST /api/products - Create new product
router.post("/", asyncHandler(createProduct));

// PUT /api/products/:id - Update product
router.put("/:id", asyncHandler(updateProduct));

// PUT /api/products/:id/stock - Update stock quantity
router.put("/:id/stock", asyncHandler(updateStock));

// DELETE /api/products/:id - Delete product
router.delete("/:id", asyncHandler(deleteProduct));

export default router;
