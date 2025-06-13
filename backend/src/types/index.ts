// Database entity types
export interface Client {
  id: number;
  name: string;
  email?: string;
  phone: string;
  city?: string;
  cpf?: string;
  profession?: string;
  status: "ativo" | "inativo";
  notes?: string;
  join_date: string;
  last_visit?: string;
  total_spent: number;
  visits: number;
  created_at: string;
  updated_at: string;
}

export interface Professional {
  id: number;
  name: string;
  email?: string;
  phone: string;
  avatar?: string;
  status: "ativo" | "inativo" | "ferias";
  commission: number;
  work_days: string; // JSON array
  work_hours: string; // JSON object {start, end}
  hired_date: string;
  rating: number;
  total_services: number;
  total_revenue: number;
  completed_services: number;
  cancelled_services: number;
  bio?: string;
  experience: number;
  certifications: string; // JSON array
  is_owner: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  name: string;
  description?: string;
  category: string;
  price: number;
  duration: number;
  commission: number;
  is_active: boolean;
  rating: number;
  total_bookings: number;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: number;
  client_id: number;
  service_id: number;
  professional_id?: number;
  date: string;
  time: string;
  duration: number;
  status: "agendado" | "confirmado" | "concluido" | "cancelado" | "faltou";
  price: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  category: string;
  brand?: string;
  price?: number;
  cost_price?: number;
  stock_quantity: number;
  min_stock: number;
  max_stock: number;
  unit: string;
  status: "ativo" | "inativo" | "descontinuado";
  supplier?: string;
  location?: string;
  barcode?: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: number;
  product_id: number;
  type: "entrada" | "saida" | "ajuste";
  quantity: number;
  reason?: string;
  reference_id?: number;
  created_at: string;
}

export interface Transaction {
  id: number;
  type: "receita" | "despesa";
  category: string;
  description: string;
  amount: number;
  payment_method?: string;
  reference_id?: number;
  reference_type?: string;
  date: string;
  status: "pendente" | "concluido" | "cancelado";
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: number;
  name: string;
  description?: string;
  category: string;
  file_path: string;
  file_size?: number;
  file_type?: string;
  tags: string; // JSON array
  is_folder: boolean;
  parent_id?: number;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: number;
  name: string;
  type: "email" | "sms" | "whatsapp" | "promotion";
  status: "draft" | "active" | "paused" | "completed";
  description?: string;
  target_audience?: string; // JSON criteria
  content?: string;
  start_date?: string;
  end_date?: string;
  budget: number;
  reach: number;
  opens: number;
  clicks: number;
  conversions: number;
  created_at: string;
  updated_at: string;
}

export interface Setting {
  id: number;
  category: string;
  key: string;
  value?: string;
  type: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// API Request/Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
  search?: string;
}

// DTOs (Data Transfer Objects)
export interface CreateClientDto {
  name: string;
  email?: string;
  phone: string;
  city?: string;
  cpf?: string;
  profession?: string;
  notes?: string;
}

export interface UpdateClientDto extends Partial<CreateClientDto> {
  status?: "ativo" | "inativo";
}

export interface CreateProfessionalDto {
  name: string;
  email?: string;
  phone: string;
  commission: number;
  work_days: string[];
  work_hours: { start: string; end: string };
  bio?: string;
  experience: number;
  certifications: string[];
}

export interface UpdateProfessionalDto extends Partial<CreateProfessionalDto> {
  status?: "ativo" | "inativo" | "ferias";
}

export interface CreateServiceDto {
  name: string;
  description?: string;
  category: string;
  price: number;
  duration: number;
  commission: number;
}

export interface UpdateServiceDto extends Partial<CreateServiceDto> {
  is_active?: boolean;
}

export interface CreateAppointmentDto {
  client_id: number;
  service_id: number;
  professional_id?: number;
  date: string;
  time: string;
  notes?: string;
}

export interface UpdateAppointmentDto extends Partial<CreateAppointmentDto> {
  status?: "agendado" | "confirmado" | "concluido" | "cancelado" | "faltou";
}

export interface CreateProductDto {
  name: string;
  description?: string;
  category: string;
  brand?: string;
  price?: number;
  cost_price?: number;
  stock_quantity: number;
  min_stock: number;
  max_stock?: number;
  unit: string;
  supplier?: string;
  location?: string;
  barcode?: string;
  expiry_date?: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  status?: "ativo" | "inativo" | "descontinuado";
}

export interface CreateTransactionDto {
  type: "receita" | "despesa";
  category: string;
  description: string;
  amount: number;
  payment_method?: string;
  reference_id?: number;
  reference_type?: string;
  date: string;
  notes?: string;
}

export interface UpdateTransactionDto extends Partial<CreateTransactionDto> {
  status?: "pendente" | "concluido" | "cancelado";
}

// Dashboard stats types
export interface DashboardStats {
  revenue: {
    current: number;
    growth: number;
    accumulated: number;
    best: number;
  };
  appointments: {
    total: number;
    variation: number;
  };
  clients: {
    active: number;
    new: number;
    retention: number;
  };
  satisfaction: number;
  services: {
    completed: number;
    completion: number;
  };
  insights: {
    peakHour: string;
    cancellations: number;
    revenueStatus: string;
  };
}

export interface RevenueData {
  month: string;
  value: number;
}

export interface ServiceStats {
  name: string;
  count: number;
  revenue: number;
}

export interface Birthday {
  name: string;
  date: string;
}

// Extended types with joins
export interface AppointmentWithDetails extends Appointment {
  client_name: string;
  client_phone: string;
  service_name: string;
  service_category: string;
  professional_name?: string;
}

export interface ServiceWithProfessionals extends Service {
  professionals: Professional[];
}

export interface ProductWithMovements extends Product {
  recent_movements: StockMovement[];
}

// Error types
export interface ApiError extends Error {
  statusCode: number;
  code?: string;
}

// File upload types
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}
