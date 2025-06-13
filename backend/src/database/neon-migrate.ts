import { sql } from "./neon-config";

async function createTables() {
  console.log("🚀 Creating Neon PostgreSQL tables...");

  try {
    // Enable UUID extension
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Clients table
    await sql`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(50) NOT NULL,
        city VARCHAR(100),
        cpf VARCHAR(20),
        profession VARCHAR(100),
        status VARCHAR(20) CHECK(status IN ('ativo', 'inativo')) DEFAULT 'ativo',
        notes TEXT,
        join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_visit TIMESTAMP,
        total_spent DECIMAL(10,2) DEFAULT 0,
        visits INTEGER DEFAULT 0,
        birthday DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Professionals table
    await sql`
      CREATE TABLE IF NOT EXISTS professionals (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(50) NOT NULL,
        avatar TEXT,
        status VARCHAR(20) CHECK(status IN ('ativo', 'inativo', 'ferias')) DEFAULT 'ativo',
        commission DECIMAL(5,2) DEFAULT 0,
        work_days JSONB, -- JSON array
        work_hours JSONB, -- JSON object {start, end}
        hired_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        rating DECIMAL(3,2) DEFAULT 0,
        total_services INTEGER DEFAULT 0,
        total_revenue DECIMAL(10,2) DEFAULT 0,
        completed_services INTEGER DEFAULT 0,
        cancelled_services INTEGER DEFAULT 0,
        bio TEXT,
        experience INTEGER DEFAULT 0,
        certifications JSONB, -- JSON array
        specialties JSONB, -- JSON array
        is_owner BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Services table
    await sql`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        duration INTEGER NOT NULL, -- minutes
        commission DECIMAL(5,2) DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        rating DECIMAL(3,2) DEFAULT 0,
        total_bookings INTEGER DEFAULT 0,
        popularity INTEGER DEFAULT 0,
        average_rating DECIMAL(3,2) DEFAULT 0,
        professionals JSONB, -- JSON array of professional IDs
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Service-Professional relationship
    await sql`
      CREATE TABLE IF NOT EXISTS service_professionals (
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        professional_id INTEGER REFERENCES professionals(id) ON DELETE CASCADE,
        PRIMARY KEY (service_id, professional_id)
      );
    `;

    // Appointments table
    await sql`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
        service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
        professional_id INTEGER REFERENCES professionals(id) ON DELETE SET NULL,
        date DATE NOT NULL,
        time TIME NOT NULL,
        duration INTEGER NOT NULL,
        status VARCHAR(20) CHECK(status IN ('agendado', 'confirmado', 'concluido', 'cancelado', 'faltou')) DEFAULT 'agendado',
        price DECIMAL(10,2) NOT NULL,
        notes TEXT,
        client_name VARCHAR(255), -- Denormalized for performance
        service_name VARCHAR(255), -- Denormalized for performance
        professional_name VARCHAR(255), -- Denormalized for performance
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Products table (for stock management)
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        brand VARCHAR(100),
        price DECIMAL(10,2),
        cost_price DECIMAL(10,2),
        stock_quantity INTEGER DEFAULT 0,
        min_stock INTEGER DEFAULT 0,
        max_stock INTEGER DEFAULT 100,
        unit VARCHAR(20) DEFAULT 'un',
        status VARCHAR(20) CHECK(status IN ('ativo', 'inativo', 'descontinuado')) DEFAULT 'ativo',
        supplier VARCHAR(255),
        location VARCHAR(100),
        barcode VARCHAR(50),
        expiry_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Stock movements table
    await sql`
      CREATE TABLE IF NOT EXISTS stock_movements (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        type VARCHAR(20) CHECK(type IN ('entrada', 'saida', 'ajuste')) NOT NULL,
        quantity INTEGER NOT NULL,
        reason TEXT,
        reference_id INTEGER, -- appointment_id if sale
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Financial transactions table
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        type VARCHAR(20) CHECK(type IN ('receita', 'despesa')) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(50),
        reference_id INTEGER, -- appointment_id or other reference
        reference_type VARCHAR(50), -- 'appointment', 'sale', 'expense', etc.
        date DATE NOT NULL,
        status VARCHAR(20) CHECK(status IN ('pendente', 'concluido', 'cancelado')) DEFAULT 'concluido',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Documents table
    await sql`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER,
        file_type VARCHAR(50),
        tags JSONB, -- JSON array
        is_folder BOOLEAN DEFAULT FALSE,
        parent_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Marketing campaigns table
    await sql`
      CREATE TABLE IF NOT EXISTS campaigns (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(20) CHECK(type IN ('email', 'sms', 'whatsapp', 'promotion')) NOT NULL,
        status VARCHAR(20) CHECK(status IN ('draft', 'active', 'paused', 'completed')) DEFAULT 'draft',
        description TEXT,
        target_audience JSONB, -- JSON criteria
        content TEXT, -- campaign content/template
        start_date DATE,
        end_date DATE,
        budget DECIMAL(10,2) DEFAULT 0,
        reach INTEGER DEFAULT 0,
        opens INTEGER DEFAULT 0,
        clicks INTEGER DEFAULT 0,
        conversions INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Settings table
    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        key VARCHAR(100) NOT NULL,
        value TEXT,
        type VARCHAR(20) DEFAULT 'string', -- string, number, boolean, json
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(category, key)
      );
    `;

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_appointments_professional ON appointments(professional_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_products_status ON products(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_documents_parent ON documents(parent_id)`;

    // Create updated_at trigger function
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `;

    // Apply updated_at triggers to all tables
    const tables = [
      "clients",
      "professionals",
      "services",
      "appointments",
      "products",
      "transactions",
      "documents",
      "campaigns",
      "settings",
    ];

    for (const table of tables) {
      await sql`
        DROP TRIGGER IF EXISTS ${sql(table + "_updated_at")} ON ${sql(table)}
      `;
      await sql`
        CREATE TRIGGER ${sql(table + "_updated_at")}
        BEFORE UPDATE ON ${sql(table)}
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
      `;
    }

    console.log("✅ Neon PostgreSQL tables created successfully!");
    return true;
  } catch (error) {
    console.error("❌ Failed to create Neon PostgreSQL tables:", error);
    throw error;
  }
}

// Execute migration if run directly
if (require.main === module) {
  createTables()
    .then(() => {
      console.log("🎉 Migration completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Migration failed:", error);
      process.exit(1);
    });
}

export { createTables };
