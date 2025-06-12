import {
  Product,
  StockStats,
  TopSellingProduct,
  LowRotationProduct,
  StockAlert,
} from "./stockTypes";

export const productsMockData: Product[] = [
  {
    id: 1,
    name: "Shampoo Premium",
    category: "hair",
    price: 45.9,
    quantity: 20,
    minQuantity: 15,
    status: "em-estoque",
    lastSale: new Date(2023, 11, 14), // 14/12/2023
    salesCount: 128,
    totalValue: 918.0,
    supplier: "Fornecedor A",
    barcode: "7891234567890",
  },
  {
    id: 2,
    name: "Condicionador Hidratante",
    category: "hair",
    price: 39.9,
    quantity: 15,
    minQuantity: 12,
    status: "em-estoque",
    lastSale: new Date(2023, 11, 9), // 09/12/2023
    salesCount: 89,
    totalValue: 598.5,
    supplier: "Fornecedor A",
    barcode: "7891234567891",
  },
  {
    id: 3,
    name: "Batom Líquido",
    category: "maquiagem",
    price: 35.0,
    quantity: 4,
    minQuantity: 10,
    status: "estoque-baixo",
    lastSale: new Date(2024, 0, 15),
    salesCount: 210,
    totalValue: 140.0,
    supplier: "Fornecedor B",
    barcode: "7891234567892",
  },
  {
    id: 4,
    name: "Máscara Capilar",
    category: "hair",
    price: 55.0,
    quantity: 8,
    minQuantity: 10,
    status: "estoque-baixo",
    lastSale: new Date(2024, 0, 10),
    salesCount: 95,
    totalValue: 440.0,
    supplier: "Fornecedor A",
    barcode: "7891234567893",
  },
  {
    id: 5,
    name: "Esmalte Vermelho",
    category: "unhas",
    price: 18.5,
    quantity: 25,
    minQuantity: 20,
    status: "em-estoque",
    lastSale: new Date(2024, 0, 20),
    salesCount: 156,
    totalValue: 462.5,
    supplier: "Fornecedor C",
    barcode: "7891234567894",
  },
  {
    id: 6,
    name: "Base Líquida",
    category: "maquiagem",
    price: 89.9,
    quantity: 12,
    minQuantity: 8,
    status: "em-estoque",
    lastSale: new Date(2024, 0, 18),
    salesCount: 78,
    totalValue: 1078.8,
    supplier: "Fornecedor B",
    barcode: "7891234567895",
  },
  {
    id: 7,
    name: "Removedor de Esmalte",
    category: "unhas",
    price: 12.9,
    quantity: 30,
    minQuantity: 25,
    status: "em-estoque",
    lastSale: new Date(2024, 0, 12),
    salesCount: 134,
    totalValue: 387.0,
    supplier: "Fornecedor C",
    barcode: "7891234567896",
  },
  {
    id: 8,
    name: "Creme Hidratante",
    category: "cuidados",
    price: 42.0,
    quantity: 18,
    minQuantity: 15,
    status: "em-estoque",
    lastSale: new Date(2024, 0, 22),
    salesCount: 67,
    totalValue: 756.0,
    supplier: "Fornecedor D",
    barcode: "7891234567897",
  },
  {
    id: 9,
    name: "Protetor Solar",
    category: "cuidados",
    price: 65.0,
    quantity: 6,
    minQuantity: 10,
    status: "estoque-baixo",
    lastSale: new Date(2023, 11, 28),
    salesCount: 89,
    totalValue: 390.0,
    supplier: "Fornecedor D",
    barcode: "7891234567898",
  },
  {
    id: 10,
    name: "Óleo Capilar",
    category: "hair",
    price: 38.5,
    quantity: 22,
    minQuantity: 18,
    status: "em-estoque",
    lastSale: new Date(2024, 0, 25),
    salesCount: 98,
    totalValue: 847.0,
    supplier: "Fornecedor A",
    barcode: "7891234567899",
  },
];

export const stockStats: StockStats = {
  totalProducts: 10,
  lowStockCount: 3,
  totalValue: 9070.1,
  outOfStockCount: 0,
};

export const topSellingProducts: TopSellingProduct[] = [
  {
    name: "Batom Líquido",
    salesCount: 210,
    maxSales: 210,
  },
  {
    name: "Shampoo Premium",
    salesCount: 128,
    maxSales: 210,
  },
  {
    name: "Esmalte Vermelho",
    salesCount: 156,
    maxSales: 210,
  },
  {
    name: "Removedor de Esmalte",
    salesCount: 134,
    maxSales: 210,
  },
  {
    name: "Óleo Capilar",
    salesCount: 98,
    maxSales: 210,
  },
];

export const stockAlerts: StockAlert[] = [
  {
    productName: "Máscara Capilar",
    currentQuantity: 8,
    minQuantity: 10,
  },
  {
    productName: "Batom Líquido",
    currentQuantity: 4,
    minQuantity: 10,
  },
  {
    productName: "Protetor Solar",
    currentQuantity: 6,
    minQuantity: 10,
  },
];

export const lowRotationProducts: LowRotationProduct[] = [
  {
    name: "Shampoo Premium",
    lastSale: new Date(2023, 11, 14), // 14/12/2023
  },
  {
    name: "Condicionador Hidratante",
    lastSale: new Date(2023, 11, 9), // 09/12/2023
  },
  {
    name: "Protetor Solar",
    lastSale: new Date(2023, 11, 28), // 28/12/2023
  },
  {
    name: "Base Líquida",
    lastSale: new Date(2023, 10, 15), // 15/11/2023
  },
  {
    name: "Creme Hidratante",
    lastSale: new Date(2023, 10, 20), // 20/11/2023
  },
  {
    name: "Máscara Capilar",
    lastSale: new Date(2023, 10, 25), // 25/11/2023
  },
  {
    name: "Esmalte Vermelho",
    lastSale: new Date(2023, 10, 30), // 30/11/2023
  },
  {
    name: "Removedor de Esmalte",
    lastSale: new Date(2023, 9, 12), // 12/10/2023
  },
  {
    name: "Óleo Capilar",
    lastSale: new Date(2023, 9, 18), // 18/10/2023
  },
  {
    name: "Batom Líquido",
    lastSale: new Date(2023, 9, 22), // 22/10/2023
  },
];

export const categories = [
  { id: "hair", name: "Cabelo", count: 4 },
  { id: "maquiagem", name: "Maquiagem", count: 2 },
  { id: "unhas", name: "Unhas", count: 2 },
  { id: "cuidados", name: "Cuidados", count: 2 },
];
