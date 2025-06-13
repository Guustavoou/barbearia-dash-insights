import db from "./config";

function createTables() {
  console.log("Creating database tables...");

  // Clients table
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      phone TEXT NOT NULL,
      city TEXT,
      cpf TEXT,
      profession TEXT,
      status TEXT CHECK(status IN ('ativo', 'inativo')) DEFAULT 'ativo',
      notes TEXT,
      join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_visit DATETIME,
      total_spent DECIMAL(10,2) DEFAULT 0,
      visits INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Professionals table
  db.exec(`
    CREATE TABLE IF NOT EXISTS professionals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      phone TEXT NOT NULL,
      avatar TEXT,
      status TEXT CHECK(status IN ('ativo', 'inativo', 'ferias')) DEFAULT 'ativo',
      commission DECIMAL(5,2) DEFAULT 0,
      work_days TEXT, -- JSON array
      work_hours TEXT, -- JSON object {start, end}
      hired_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      rating DECIMAL(3,2) DEFAULT 0,
      total_services INTEGER DEFAULT 0,
      total_revenue DECIMAL(10,2) DEFAULT 0,
      completed_services INTEGER DEFAULT 0,
      cancelled_services INTEGER DEFAULT 0,
      bio TEXT,
      experience INTEGER DEFAULT 0,
      certifications TEXT, -- JSON array
      is_owner BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Services table
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      duration INTEGER NOT NULL, -- minutes
      commission DECIMAL(5,2) DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      rating DECIMAL(3,2) DEFAULT 0,
      total_bookings INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Service-Professional relationship
  db.exec(`
    CREATE TABLE IF NOT EXISTS service_professionals (
      service_id INTEGER,
      professional_id INTEGER,
      PRIMARY KEY (service_id, professional_id),
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
      FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE CASCADE
    );
  `);

  // Appointments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      service_id INTEGER NOT NULL,
      professional_id INTEGER,
      date DATE NOT NULL,
      time TIME NOT NULL,
      duration INTEGER NOT NULL,
      status TEXT CHECK(status IN ('agendado', 'confirmado', 'concluido', 'cancelado', 'faltou')) DEFAULT 'agendado',
      price DECIMAL(10,2) NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
      FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE SET NULL
    );
  `);

  // Products table (for stock management)
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      brand TEXT,
      price DECIMAL(10,2),
      cost_price DECIMAL(10,2),
      stock_quantity INTEGER DEFAULT 0,
      min_stock INTEGER DEFAULT 0,
      max_stock INTEGER DEFAULT 100,
      unit TEXT DEFAULT 'un',
      status TEXT CHECK(status IN ('ativo', 'inativo', 'descontinuado')) DEFAULT 'ativo',
      supplier TEXT,
      location TEXT,
      barcode TEXT,
      expiry_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Stock movements table
  db.exec(`
    CREATE TABLE IF NOT EXISTS stock_movements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      type TEXT CHECK(type IN ('entrada', 'saida', 'ajuste')) NOT NULL,
      quantity INTEGER NOT NULL,
      reason TEXT,
      reference_id INTEGER, -- appointment_id if sale
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);

  // Financial transactions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT CHECK(type IN ('receita', 'despesa')) NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      payment_method TEXT,
      reference_id INTEGER, -- appointment_id or other reference
      reference_type TEXT, -- 'appointment', 'sale', 'expense', etc.
      date DATE NOT NULL,
      status TEXT CHECK(status IN ('pendente', 'concluido', 'cancelado')) DEFAULT 'concluido',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Documents table
  db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_size INTEGER,
      file_type TEXT,
      tags TEXT, -- JSON array
      is_folder BOOLEAN DEFAULT FALSE,
      parent_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES documents(id) ON DELETE CASCADE
    );
  `);

  // Marketing campaigns table
  db.exec(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT CHECK(type IN ('email', 'sms', 'whatsapp', 'promotion')) NOT NULL,
      status TEXT CHECK(status IN ('draft', 'active', 'paused', 'completed')) DEFAULT 'draft',
      description TEXT,
      target_audience TEXT, -- JSON criteria
      content TEXT, -- campaign content/template
      start_date DATE,
      end_date DATE,
      budget DECIMAL(10,2) DEFAULT 0,
      reach INTEGER DEFAULT 0,
      opens INTEGER DEFAULT 0,
      clicks INTEGER DEFAULT 0,
      conversions INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT,
      type TEXT DEFAULT 'string', -- string, number, boolean, json
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(category, key)
    );
  `);

  // Create indexes for better performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
    CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
    CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
    CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);
    CREATE INDEX IF NOT EXISTS idx_appointments_professional ON appointments(professional_id);
    CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
    CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
    CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
    CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
    CREATE INDEX IF NOT EXISTS idx_documents_parent ON documents(parent_id);
  `);

  console.log("Database tables created successfully!");
}

// Execute migration
if (require.main === module) {
  createTables();
  db.close();
}

export { createTables };
