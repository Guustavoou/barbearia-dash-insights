import { sql } from "./neon-config";
import { createTables } from "./neon-migrate";

async function seedDatabase() {
  console.log("🌱 Seeding Neon PostgreSQL database...");

  try {
    // Ensure tables exist
    await createTables();

    // Clear existing data (for development)
    await sql`TRUNCATE TABLE stock_movements, service_professionals, appointments, transactions, products, services, professionals, clients, documents, campaigns, settings RESTART IDENTITY CASCADE`;

    // Seed Clients
    console.log("👥 Seeding clients...");
    const clients = await sql`
      INSERT INTO clients (name, email, phone, city, cpf, profession, birthday, total_spent, visits, last_visit)
      VALUES
        ('Maria Silva', 'maria.silva@email.com', '(11) 99999-0001', 'São Paulo', '123.456.789-01', 'Advogada', '1985-03-15', 850.00, 12, '2024-11-20'),
        ('Ana Costa', 'ana.costa@email.com', '(11) 99999-0002', 'São Paulo', '123.456.789-02', 'Médica', '1990-07-22', 1200.00, 8, '2024-11-18'),
        ('Juliana Santos', 'juliana.santos@email.com', '(11) 99999-0003', 'Campinas', '123.456.789-03', 'Professora', '1988-12-08', 650.00, 15, '2024-11-22'),
        ('Carla Oliveira', 'carla.oliveira@email.com', '(11) 99999-0004', 'Guarulhos', '123.456.789-04', 'Engenheira', '1992-05-30', 920.00, 10, '2024-11-19'),
        ('Fernanda Lima', 'fernanda.lima@email.com', '(11) 99999-0005', 'São Bernardo', '123.456.789-05', 'Designer', '1987-11-12', 780.00, 18, '2024-11-21'),
        ('Patricia Rocha', 'patricia.rocha@email.com', '(11) 99999-0006', 'Santo André', '123.456.789-06', 'Arquiteta', '1983-09-25', 1100.00, 7, '2024-11-17'),
        ('Luciana Mendes', 'luciana.mendes@email.com', '(11) 99999-0007', 'Osasco', '123.456.789-07', 'Psicóloga', '1991-04-18', 540.00, 22, '2024-11-23'),
        ('Gabriela Dias', 'gabriela.dias@email.com', '(11) 99999-0008', 'Diadema', '123.456.789-08', 'Jornalista', '1989-08-03', 670.00, 13, '2024-11-16'),
        ('Renata Alves', 'renata.alves@email.com', '(11) 99999-0009', 'Mauá', '123.456.789-09', 'Nutricionista', '1986-01-14', 890.00, 16, '2024-11-24'),
        ('Camila Torres', 'camila.torres@email.com', '(11) 99999-0010', 'São Caetano', '123.456.789-10', 'Fisioterapeuta', '1993-06-27', 720.00, 9, '2024-11-15')
      RETURNING id, name
    `;

    // Seed Professionals
    console.log("💼 Seeding professionals...");
    const professionals = await sql`
      INSERT INTO professionals (name, email, phone, status, commission, work_days, work_hours, rating, total_services, total_revenue, completed_services, experience, specialties, is_owner)
      VALUES
        ('Isabella Martins', 'isabella@unclic.com', '(11) 98888-0001', 'ativo', 40.00,
         '["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]'::jsonb,
         '{"start": "08:00", "end": "18:00"}'::jsonb, 4.8, 245, 12250.00, 230, 8,
         '["Corte", "Coloração", "Tratamento"]'::jsonb, true),
        ('Sofia Rodrigues', 'sofia@unclic.com', '(11) 98888-0002', 'ativo', 35.00,
         '["tuesday", "wednesday", "thursday", "friday", "saturday"]'::jsonb,
         '{"start": "09:00", "end": "17:00"}'::jsonb, 4.7, 189, 9450.00, 175, 5,
         '["Manicure", "Pedicure", "Nail Art"]'::jsonb, false),
        ('Valentina Costa', 'valentina@unclic.com', '(11) 98888-0003', 'ativo', 38.00,
         '["monday", "wednesday", "thursday", "friday", "saturday"]'::jsonb,
         '{"start": "08:30", "end": "17:30"}'::jsonb, 4.9, 156, 9360.00, 145, 6,
         '["Sobrancelha", "Cílios", "Design"]'::jsonb, false),
        ('Helena Santos', 'helena@unclic.com', '(11) 98888-0004', 'ativo', 42.00,
         '["monday", "tuesday", "thursday", "friday", "saturday"]'::jsonb,
         '{"start": "08:00", "end": "16:00"}'::jsonb, 4.6, 198, 11880.00, 185, 7,
         '["Massagem", "Drenagem", "Relaxamento"]'::jsonb, false),
        ('Aurora Lima', 'aurora@unclic.com', '(11) 98888-0005', 'ativo', 36.00,
         '["tuesday", "wednesday", "friday", "saturday"]'::jsonb,
         '{"start": "10:00", "end": "18:00"}'::jsonb, 4.5, 123, 6150.00, 115, 4,
         '["Depilação", "Limpeza de Pele"]'::jsonb, false),
        ('Luna Oliveira', 'luna@unclic.com', '(11) 98888-0006', 'ferias', 37.00,
         '["monday", "tuesday", "wednesday", "thursday", "friday"]'::jsonb,
         '{"start": "09:00", "end": "17:00"}'::jsonb, 4.4, 87, 4350.00, 80, 3,
         '["Maquiagem", "Penteado"]'::jsonb, false)
      RETURNING id, name
    `;

    // Seed Services
    console.log("✂️ Seeding services...");
    const services = await sql`
      INSERT INTO services (name, description, category, price, duration, is_active, rating, total_bookings, popularity, average_rating)
      VALUES
        ('Corte Feminino', 'Corte personalizado de acordo com o rosto e estilo', 'Cabelo', 80.00, 60, true, 4.8, 245, 89, 4.8),
        ('Coloração Completa', 'Mudança de cor completa com produtos premium', 'Cabelo', 180.00, 180, true, 4.7, 156, 76, 4.7),
        ('Luzes e Mechas', 'Técnicas de iluminação para realçar o cabelo', 'Cabelo', 220.00, 240, true, 4.9, 98, 65, 4.9),
        ('Escova Progressiva', 'Alisamento e redução de volume', 'Cabelo', 350.00, 300, true, 4.6, 67, 54, 4.6),
        ('Hidratação Profunda', 'Tratamento intensivo para cabelos ressecados', 'Cabelo', 120.00, 90, true, 4.8, 189, 82, 4.8),
        ('Manicure Simples', 'Cuidado básico para as unhas das mãos', 'Unhas', 35.00, 45, true, 4.7, 298, 95, 4.7),
        ('Pedicure Completa', 'Cuidado completo para os pés', 'Unhas', 45.00, 60, true, 4.8, 234, 88, 4.8),
        ('Nail Art', 'Decoração artística nas unhas', 'Unhas', 25.00, 30, true, 4.6, 145, 67, 4.6),
        ('Design de Sobrancelha', 'Modelagem e design personalizado', 'Sobrancelha', 60.00, 45, true, 4.9, 267, 93, 4.9),
        ('Extensão de Cílios', 'Aplicação de cílios postiços fio a fio', 'Cílios', 150.00, 120, true, 4.7, 123, 71, 4.7),
        ('Massagem Relaxante', 'Massagem corporal para relaxamento', 'Corpo', 180.00, 60, true, 4.8, 98, 58, 4.8),
        ('Limpeza de Pele', 'Limpeza profunda facial', 'Facial', 120.00, 90, true, 4.7, 167, 79, 4.7)
      RETURNING id, name, category
    `;

    // Seed Products
    console.log("📦 Seeding products...");

    // Insert products individually to avoid character encoding issues
    const products = [
      [
        "Shampoo Hidratante 500ml",
        "Shampoo para cabelos ressecados",
        "Shampoo",
        "L'Oréal",
        85.0,
        42.5,
        25,
        5,
        "un",
        "ativo",
      ],
      [
        "Condicionador Reparador 500ml",
        "Condicionador para cabelos danificados",
        "Condicionador",
        "L'Oréal",
        89.0,
        44.5,
        30,
        5,
        "un",
        "ativo",
      ],
      [
        "Tinta Loiro Dourado",
        "Coloração permanente tom 7.3",
        "Coloração",
        "Wella",
        45.0,
        22.5,
        15,
        3,
        "un",
        "ativo",
      ],
      [
        "Água Oxigenada 30vol",
        "Oxidante para coloração",
        "Coloração",
        "Wella",
        25.0,
        12.5,
        20,
        5,
        "un",
        "ativo",
      ],
      [
        "Esmalte Vermelho",
        "Esmalte cremoso longa duração",
        "Esmalte",
        "Risqué",
        12.0,
        6.0,
        50,
        10,
        "un",
        "ativo",
      ],
      [
        "Base Coat",
        "Base protetora para esmalte",
        "Esmalte",
        "Risqué",
        15.0,
        7.5,
        35,
        8,
        "un",
        "ativo",
      ],
      [
        "Acetona",
        "Removedor de esmalte",
        "Removedor",
        "Impala",
        8.0,
        4.0,
        40,
        10,
        "un",
        "ativo",
      ],
      [
        "Algodão",
        "Algodão para procedimentos",
        "Descartável",
        "Cremer",
        18.0,
        9.0,
        60,
        15,
        "pct",
        "ativo",
      ],
      [
        "Luvas Descartáveis",
        "Luvas de procedimento",
        "Descartável",
        "Descarpack",
        35.0,
        17.5,
        45,
        10,
        "cx",
        "ativo",
      ],
      [
        "Touca Descartável",
        "Touca para proteção",
        "Descartável",
        "Descarpack",
        22.0,
        11.0,
        80,
        20,
        "pct",
        "ativo",
      ],
    ];

    for (const product of products) {
      await sql`
        INSERT INTO products (name, description, category, brand, price, cost_price, stock_quantity, min_stock, unit, status)
        VALUES (${product[0]}, ${product[1]}, ${product[2]}, ${product[3]}, ${product[4]}, ${product[5]}, ${product[6]}, ${product[7]}, ${product[8]}, ${product[9]})
      `;
    }

    // Seed Appointments
    console.log("📅 Seeding appointments...");
    await sql`
      INSERT INTO appointments (client_id, service_id, professional_id, date, time, duration, status, price, client_name, service_name, professional_name)
      VALUES
        (1, 1, 1, '2024-12-15', '09:00', 60, 'agendado', 80.00, 'Maria Silva', 'Corte Feminino', 'Isabella Martins'),
        (2, 9, 3, '2024-12-15', '10:00', 45, 'confirmado', 60.00, 'Ana Costa', 'Design de Sobrancelha', 'Valentina Costa'),
        (3, 6, 2, '2024-12-15', '14:00', 45, 'agendado', 35.00, 'Juliana Santos', 'Manicure Simples', 'Sofia Rodrigues'),
        (4, 2, 1, '2024-12-16', '09:00', 180, 'agendado', 180.00, 'Carla Oliveira', 'Coloração Completa', 'Isabella Martins'),
        (5, 10, 3, '2024-12-16', '15:00', 120, 'confirmado', 150.00, 'Fernanda Lima', 'Extensão de Cílios', 'Valentina Costa'),
        (6, 11, 4, '2024-12-17', '10:00', 60, 'agendado', 180.00, 'Patricia Rocha', 'Massagem Relaxante', 'Helena Santos'),
        (7, 7, 2, '2024-12-17', '16:00', 60, 'agendado', 45.00, 'Luciana Mendes', 'Pedicure Completa', 'Sofia Rodrigues'),
        (8, 5, 1, '2024-12-18', '13:00', 90, 'confirmado', 120.00, 'Gabriela Dias', 'Hidratação Profunda', 'Isabella Martins'),
        (9, 12, 5, '2024-12-18', '11:00', 90, 'agendado', 120.00, 'Renata Alves', 'Limpeza de Pele', 'Aurora Lima'),
        (10, 3, 1, '2024-12-19', '09:00', 240, 'agendado', 220.00, 'Camila Torres', 'Luzes e Mechas', 'Isabella Martins')
    `;

    // Seed Transactions
    console.log("💰 Seeding transactions...");
    await sql`
      INSERT INTO transactions (type, category, description, amount, payment_method, reference_type, date, status)
      VALUES
        ('receita', 'Serviços', 'Corte Feminino - Maria Silva', 80.00, 'PIX', 'appointment', '2024-11-20', 'concluido'),
        ('receita', 'Serviços', 'Design de Sobrancelha - Ana Costa', 60.00, 'Cartão de Crédito', 'appointment', '2024-11-18', 'concluido'),
        ('receita', 'Produtos', 'Venda de Shampoo', 85.00, 'Dinheiro', 'sale', '2024-11-22', 'concluido'),
        ('despesa', 'Fornecedores', 'Compra de produtos L Oreal', 850.00, 'PIX', 'purchase', '2024-11-15', 'concluido'),
        ('receita', 'Serviços', 'Coloração Completa - Carla Oliveira', 180.00, 'Cartão de Débito', 'appointment', '2024-11-19', 'concluido'),
        ('despesa', 'Operacional', 'Energia elétrica', 320.00, 'Boleto', 'expense', '2024-11-10', 'concluido'),
        ('receita', 'Serviços', 'Extensão de Cílios - Fernanda Lima', 150.00, 'PIX', 'appointment', '2024-11-21', 'concluido'),
        ('despesa', 'Pessoal', 'Comissão profissionais', 1200.00, 'PIX', 'salary', '2024-11-25', 'concluido'),
        ('receita', 'Serviços', 'Massagem Relaxante - Patricia Rocha', 180.00, 'Cartão de Crédito', 'appointment', '2024-11-17', 'concluido'),
        ('receita', 'Produtos', 'Venda de esmaltes', 45.00, 'Dinheiro', 'sale', '2024-11-23', 'concluido')
    `;

    // Seed Settings
    console.log("⚙️ Seeding settings...");
    await sql`
      INSERT INTO settings (category, key, value, type, description)
      VALUES
        ('business', 'name', 'Salão Unclic', 'string', 'Nome do estabelecimento'),
        ('business', 'phone', '(11) 3333-4444', 'string', 'Telefone principal'),
        ('business', 'email', 'contato@unclic.com', 'string', 'Email de contato'),
        ('business', 'address', 'Rua das Flores, 123 - São Paulo, SP', 'string', 'Endereço completo'),
        ('schedule', 'opening_time', '08:00', 'string', 'Horário de abertura'),
        ('schedule', 'closing_time', '18:00', 'string', 'Horário de fechamento'),
        ('schedule', 'work_days', '["monday","tuesday","wednesday","thursday","friday","saturday"]', 'json', 'Dias de funcionamento'),
        ('notifications', 'email_enabled', 'true', 'boolean', 'Notificações por email'),
        ('notifications', 'sms_enabled', 'false', 'boolean', 'Notificações por SMS'),
        ('payments', 'default_payment_method', 'PIX', 'string', 'Método de pagamento padrão')
    `;

    console.log("✅ Neon PostgreSQL database seeded successfully!");
    return true;
  } catch (error) {
    console.error("❌ Failed to seed Neon PostgreSQL database:", error);
    throw error;
  }
}

// Execute seeding if run directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("🎉 Seeding completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}

export { seedDatabase };
