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

    // Client ratings table (for service ratings and feedback)
    await sql`
      CREATE TABLE IF NOT EXISTS client_ratings (
        id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
        appointment_id INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
        service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
        professional_id INTEGER NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
        rating INTEGER CHECK(rating >= 1 AND rating <= 5) NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // User sessions table (for tracking online users)
    await sql`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL, -- can be client_id, professional_id, or admin_id
        user_type VARCHAR(20) CHECK(user_type IN ('client', 'professional', 'admin')) NOT NULL,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        ip_address INET,
        user_agent TEXT,
        last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP
      );
    `;

    // Notifications/Messages table
    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        recipient_id INTEGER NOT NULL,
        recipient_type VARCHAR(20) CHECK(recipient_type IN ('client', 'professional', 'admin')) NOT NULL,
        type VARCHAR(50) NOT NULL, -- 'appointment_reminder', 'birthday', 'promotion', etc.
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        channel VARCHAR(20) CHECK(channel IN ('email', 'sms', 'whatsapp', 'push', 'system')) NOT NULL,
        status VARCHAR(20) CHECK(status IN ('pending', 'sent', 'delivered', 'read', 'failed')) DEFAULT 'pending',
        sent_at TIMESTAMP,
        read_at TIMESTAMP,
        data JSONB, -- Additional data for the notification
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Commission payments table
    await sql`
      CREATE TABLE IF NOT EXISTS commission_payments (
        id SERIAL PRIMARY KEY,
        professional_id INTEGER NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
        period_start DATE NOT NULL,
        period_end DATE NOT NULL,
        total_services INTEGER DEFAULT 0,
        total_revenue DECIMAL(10,2) DEFAULT 0,
        commission_rate DECIMAL(5,2) NOT NULL,
        commission_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) CHECK(status IN ('calculated', 'paid', 'cancelled')) DEFAULT 'calculated',
        payment_date DATE,
        payment_method VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Peak hours analytics table
    await sql`
      CREATE TABLE IF NOT EXISTS peak_hours_analytics (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        hour INTEGER CHECK(hour >= 0 AND hour <= 23) NOT NULL,
        appointment_count INTEGER DEFAULT 0,
        revenue DECIMAL(10,2) DEFAULT 0,
        occupancy_rate DECIMAL(5,2) DEFAULT 0, -- percentage
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(date, hour)
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

    // Indexes for new tables
    await sql`CREATE INDEX IF NOT EXISTS idx_client_ratings_service ON client_ratings(service_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_client_ratings_professional ON client_ratings(professional_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id, user_type)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON user_sessions(last_activity)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id, recipient_type)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_commission_payments_professional ON commission_payments(professional_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_commission_payments_period ON commission_payments(period_start, period_end)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_peak_hours_date ON peak_hours_analytics(date)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_peak_hours_hour ON peak_hours_analytics(hour)`;

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
      const triggerName = `${table}_updated_at`;

      await sql.query(`DROP TRIGGER IF EXISTS ${triggerName} ON ${table}`);

      await sql.query(`
        CREATE TRIGGER ${triggerName}
        BEFORE UPDATE ON ${table}
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
      `);
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
