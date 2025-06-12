export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  minQuantity: number;
  status: "em-estoque" | "estoque-baixo" | "sem-estoque";
  lastSale?: Date;
  salesCount: number;
  totalValue: number;
  supplier?: string;
  barcode?: string;
}

export interface StockStats {
  totalProducts: number;
  lowStockCount: number;
  totalValue: number;
  outOfStockCount: number;
}

export interface TopSellingProduct {
  name: string;
  salesCount: number;
  maxSales: number; // for calculating progress bar
}

export interface LowRotationProduct {
  name: string;
  lastSale: Date;
}

export interface StockAlert {
  productName: string;
  currentQuantity: number;
  minQuantity: number;
}
