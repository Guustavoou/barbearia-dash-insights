import db from "./config";
import { createTables } from "./migrate";

function seedDatabase() {
  console.log("Seeding database...");

  // Create tables first
  createTables();

  // Clear existing data
  db.exec(`DELETE FROM appointments;`);
  db.exec(`DELETE FROM service_professionals;`);
  db.exec(`DELETE FROM transactions;`);
  db.exec(`DELETE FROM stock_movements;`);
  db.exec(`DELETE FROM clients;`);
  db.exec(`DELETE FROM professionals;`);
  db.exec(`DELETE FROM services;`);
  db.exec(`DELETE FROM products;`);
  db.exec(`DELETE FROM documents;`);
  db.exec(`DELETE FROM campaigns;`);
  db.exec(`DELETE FROM settings;`);

  // Reset autoincrement
  db.exec(`DELETE FROM sqlite_sequence;`);

  // Insert professionals
  const professionalStmt = db.prepare(`
    INSERT INTO professionals (
      name, email, phone, status, commission, work_days, work_hours,
      hired_date, rating, total_services, total_revenue, completed_services,
      bio, experience, certifications, is_owner
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const professionals = [
    [
      "Carlos Santos",
      "carlos@unclic.com",
      "(11) 99999-0001",
      "ativo",
      50,
      '["monday","tuesday","wednesday","thursday","friday","saturday"]',
      '{"start":"08:00","end":"18:00"}',
      "2020-01-15",
      4.8,
      1250,
      62500,
      1180,
      "Especialista em cortes masculinos e barbas",
      15,
      '["Barbeiro Profissional","Curso de Barbas"]',
      true,
    ],
    [
      "Ana Costa",
      "ana@unclic.com",
      "(11) 99999-0002",
      "ativo",
      45,
      '["tuesday","wednesday","thursday","friday","saturday"]',
      '{"start":"09:00","end":"19:00"}',
      "2021-03-10",
      4.9,
      980,
      58800,
      945,
      "Especialista em manicure, pedicure e nail art",
      8,
      '["Manicure Profissional","Nail Art Avançado"]',
      false,
    ],
    [
      "Beatriz Lima",
      "beatriz@unclic.com",
      "(11) 99999-0003",
      "ativo",
      55,
      '["monday","wednesday","thursday","friday","saturday"]',
      '{"start":"08:30","end":"17:30"}',
      "2019-08-20",
      4.7,
      856,
      85600,
      820,
      "Colorista especializada em técnicas modernas",
      12,
      '["Colorimetria Avançada","Técnicas de Mechas"]',
      false,
    ],
    [
      "Roberto Silva",
      "roberto@unclic.com",
      "(11) 99999-0004",
      "ativo",
      40,
      '["monday","tuesday","thursday","friday","saturday"]',
      '{"start":"09:00","end":"18:00"}',
      "2022-01-05",
      4.6,
      445,
      26700,
      420,
      "Especialista em cortes femininos e escova",
      6,
      '["Cabeleireiro Profissional"]',
      false,
    ],
    [
      "Carla Mendes",
      "carla@unclic.com",
      "(11) 99999-0005",
      "ferias",
      48,
      '["tuesday","wednesday","thursday","friday","saturday"]',
      '{"start":"08:00","end":"17:00"}',
      "2020-11-12",
      4.8,
      678,
      47460,
      650,
      "Especialista em tratamentos capilares e hidratação",
      10,
      '["Terapia Capilar","Tratamentos Químicos"]',
      false,
    ],
    [
      "Diego Oliveira",
      "diego@unclic.com",
      "(11) 99999-0006",
      "ativo",
      42,
      '["monday","tuesday","wednesday","friday","saturday"]',
      '{"start":"10:00","end":"19:00"}',
      "2023-02-15",
      4.5,
      234,
      14040,
      225,
      "Barbeiro especializado em cortes modernos",
      4,
      '["Barbeiro Moderno"]',
      false,
    ],
  ];

  professionals.forEach((prof) => professionalStmt.run(...prof));

  // Insert services
  const serviceStmt = db.prepare(`
    INSERT INTO services (name, description, category, price, duration, commission, rating, total_bookings)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const services = [
    [
      "Corte Masculino",
      "Corte tradicional ou moderno",
      "Corte",
      35.0,
      30,
      15,
      4.8,
      456,
    ],
    [
      "Corte + Barba",
      "Corte + barba completa",
      "Corte",
      50.0,
      45,
      20,
      4.9,
      342,
    ],
    [
      "Corte Feminino",
      "Corte feminino personalizado",
      "Corte",
      45.0,
      40,
      18,
      4.7,
      278,
    ],
    ["Escova", "Escova modeladora", "Penteado", 25.0, 25, 10, 4.6, 234],
    [
      "Coloração Completa",
      "Coloração de todo o cabelo",
      "Coloração",
      120.0,
      120,
      50,
      4.8,
      156,
    ],
    [
      "Mechas",
      "Mechas tradicionais ou babyliss",
      "Coloração",
      80.0,
      90,
      35,
      4.7,
      189,
    ],
    ["Manicure", "Manicure tradicional", "Unhas", 25.0, 45, 12, 4.8, 567],
    ["Pedicure", "Pedicure completo", "Unhas", 30.0, 50, 15, 4.7, 445],
    ["Manicure + Pedicure", "Combo completo", "Unhas", 50.0, 90, 25, 4.9, 323],
    [
      "Hidratação",
      "Tratamento hidratante",
      "Tratamento",
      40.0,
      60,
      20,
      4.6,
      167,
    ],
    [
      "Progressiva",
      "Alisamento progressivo",
      "Tratamento",
      150.0,
      180,
      60,
      4.5,
      89,
    ],
    [
      "Sobrancelha",
      "Design de sobrancelhas",
      "Estética",
      20.0,
      20,
      8,
      4.7,
      678,
    ],
  ];

  services.forEach((service) => serviceStmt.run(...service));

  // Insert service-professional relationships
  const serviceProfStmt = db.prepare(`
    INSERT INTO service_professionals (service_id, professional_id) VALUES (?, ?)
  `);

  // Carlos Santos (barbeiro) - serviços masculinos
  [1, 2].forEach((serviceId) => serviceProfStmt.run(serviceId, 1));

  // Ana Costa (manicure)
  [7, 8, 9, 12].forEach((serviceId) => serviceProfStmt.run(serviceId, 2));

  // Beatriz Lima (colorista)
  [3, 4, 5, 6, 10, 11].forEach((serviceId) =>
    serviceProfStmt.run(serviceId, 3),
  );

  // Roberto Silva (cabeleireiro)
  [3, 4, 10].forEach((serviceId) => serviceProfStmt.run(serviceId, 4));

  // Carla Mendes (tratamentos)
  [3, 4, 10, 11].forEach((serviceId) => serviceProfStmt.run(serviceId, 5));

  // Diego Oliveira (barbeiro)
  [1, 2].forEach((serviceId) => serviceProfStmt.run(serviceId, 6));

  // Insert clients
  const clientStmt = db.prepare(`
    INSERT INTO clients (
      name, email, phone, city, cpf, profession, status, notes,
      join_date, last_visit, total_spent, visits
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const clients = [
    [
      "Maria Silva",
      "maria.silva@email.com",
      "(11) 99999-1001",
      "São Paulo",
      "123.456.789-01",
      "Advogada",
      "ativo",
      "Cliente VIP, prefere Ana para manicure",
      "2023-01-15",
      "2024-01-15",
      856.5,
      15,
    ],
    [
      "João Santos",
      "joao.santos@email.com",
      "(11) 99999-1002",
      "São Paulo",
      "987.654.321-01",
      "Engenheiro",
      "ativo",
      "Corte quinzenal, sempre Carlos",
      "2023-02-20",
      "2024-01-10",
      420.0,
      12,
    ],
    [
      "Ana Costa",
      "ana.costa@email.com",
      "(11) 99999-1003",
      "Santo André",
      "456.789.123-01",
      "Professora",
      "ativo",
      "Coloração a cada 2 meses",
      "2023-03-10",
      "2024-01-08",
      1240.0,
      18,
    ],
    [
      "Carlos Oliveira",
      "carlos.oliveira@email.com",
      "(11) 99999-1004",
      "São Bernardo",
      "321.654.987-01",
      "Contador",
      "ativo",
      "",
      "2023-04-05",
      "2024-01-12",
      280.0,
      8,
    ],
    [
      "Beatriz Lima",
      "beatriz.lima@email.com",
      "(11) 99999-1005",
      "Diadema",
      "789.123.456-01",
      "Designer",
      "ativo",
      "Sempre testa cores novas",
      "2023-05-12",
      "2024-01-14",
      980.5,
      14,
    ],
    [
      "Roberto Silva",
      "roberto.silva@email.com",
      "(11) 99999-1006",
      "São Caetano",
      "654.321.789-01",
      "Médico",
      "ativo",
      "Agenda sempre no sábado",
      "2023-06-18",
      "2024-01-13",
      175.0,
      5,
    ],
    [
      "Laura Santos",
      "laura.santos@email.com",
      "(11) 99999-1007",
      "São Paulo",
      "147.258.369-01",
      "Arquiteta",
      "ativo",
      "Coloração especial",
      "2023-07-22",
      "2024-01-09",
      1560.0,
      22,
    ],
    [
      "Fernando Costa",
      "fernando.costa@email.com",
      "(11) 99999-1008",
      "São Paulo",
      "369.258.147-01",
      "Empresário",
      "ativo",
      "Cliente premium",
      "2023-08-30",
      "2024-01-11",
      890.0,
      16,
    ],
    [
      "Carla Mendes",
      "carla.mendes@email.com",
      "(11) 99999-1009",
      "São Paulo",
      "258.147.369-01",
      "Jornalista",
      "inativo",
      "Mudou de cidade",
      "2023-09-15",
      "2023-12-10",
      340.0,
      6,
    ],
    [
      "Diego Oliveira",
      "diego.oliveira@email.com",
      "(11) 99999-1010",
      "São Paulo",
      "741.852.963-01",
      "Publicitário",
      "ativo",
      "Corte criativo",
      "2023-10-08",
      "2024-01-07",
      245.0,
      7,
    ],
  ];

  clients.forEach((client) => clientStmt.run(...client));

  // Insert products
  const productStmt = db.prepare(`
    INSERT INTO products (
      name, description, category, brand, price, cost_price, stock_quantity,
      min_stock, unit, status, supplier, location
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const products = [
    [
      "Shampoo Hidratante",
      "Shampoo para cabelos ressecados",
      "Shampoo",
      "L'Oréal",
      28.9,
      18.5,
      45,
      10,
      "un",
      "ativo",
      "Distribuidora Beleza",
      "Estoque A1",
    ],
    [
      "Condicionador Reparador",
      "Condicionador para cabelos danificados",
      "Condicionador",
      "L'Oréal",
      32.5,
      21.0,
      38,
      10,
      "un",
      "ativo",
      "Distribuidora Beleza",
      "Estoque A1",
    ],
    [
      "Tintura Castanho",
      "Coloração permanente",
      "Coloração",
      "Wella",
      45.0,
      28.0,
      25,
      5,
      "un",
      "ativo",
      "Wella Professional",
      "Estoque B2",
    ],
    [
      "Creme Alisante",
      "Alisamento progressivo",
      "Tratamento",
      "Matrix",
      89.9,
      65.0,
      12,
      3,
      "un",
      "ativo",
      "Matrix Brasil",
      "Estoque B1",
    ],
    [
      "Óleo Argan",
      "Óleo hidratante para cabelos",
      "Tratamento",
      "Moroccanoil",
      156.0,
      98.0,
      8,
      2,
      "un",
      "ativo",
      "Importadora Beauty",
      "Estoque C1",
    ],
    [
      "Esmalte Vermelho",
      "Esmalte cremoso duradouro",
      "Esmalte",
      "Risqué",
      12.9,
      7.5,
      67,
      20,
      "un",
      "ativo",
      "Risqué",
      "Estoque D1",
    ],
    [
      "Base Coat",
      "Base protetora para unhas",
      "Esmalte",
      "Risqué",
      15.9,
      9.2,
      23,
      10,
      "un",
      "ativo",
      "Risqué",
      "Estoque D1",
    ],
    [
      "Top Coat",
      "Finalizador extra brilho",
      "Esmalte",
      "Risqué",
      15.9,
      9.2,
      19,
      10,
      "un",
      "ativo",
      "Risqué",
      "Estoque D1",
    ],
    [
      "Acetona",
      "Removedor de esmalte",
      "Removedor",
      "Colorama",
      8.5,
      4.8,
      34,
      15,
      "un",
      "ativo",
      "Colorama",
      "Estoque D2",
    ],
    [
      "Algodão",
      "Algodão hidrófilo",
      "Consumível",
      "Johnson's",
      6.9,
      3.5,
      89,
      30,
      "pct",
      "ativo",
      "Farmácia Central",
      "Estoque E1",
    ],
  ];

  products.forEach((product) => productStmt.run(...product));

  // Insert sample appointments
  const appointmentStmt = db.prepare(`
    INSERT INTO appointments (
      client_id, service_id, professional_id, date, time, duration, status, price, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const appointments = [
    [
      1,
      7,
      2,
      today.toISOString().split("T")[0],
      "09:00",
      45,
      "confirmado",
      25.0,
      "Cliente preferencial",
    ],
    [
      2,
      1,
      1,
      today.toISOString().split("T")[0],
      "10:30",
      30,
      "agendado",
      35.0,
      "",
    ],
    [
      3,
      5,
      3,
      tomorrow.toISOString().split("T")[0],
      "14:00",
      120,
      "confirmado",
      120.0,
      "Retoque de raiz",
    ],
    [
      4,
      2,
      1,
      tomorrow.toISOString().split("T")[0],
      "16:00",
      45,
      "agendado",
      50.0,
      "Barba por fazer",
    ],
    [
      5,
      9,
      2,
      tomorrow.toISOString().split("T")[0],
      "11:00",
      90,
      "confirmado",
      50.0,
      "Combo completo",
    ],
  ];

  appointments.forEach((appointment) => appointmentStmt.run(...appointment));

  // Insert sample transactions
  const transactionStmt = db.prepare(`
    INSERT INTO transactions (
      type, category, description, amount, payment_method, reference_type, date, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const transactions = [
    [
      "receita",
      "Serviços",
      "Manicure - Maria Silva",
      25.0,
      "PIX",
      "appointment",
      today.toISOString().split("T")[0],
      "concluido",
    ],
    [
      "receita",
      "Serviços",
      "Corte Masculino - João Santos",
      35.0,
      "Cartão de Crédito",
      "appointment",
      today.toISOString().split("T")[0],
      "concluido",
    ],
    [
      "despesa",
      "Produtos",
      "Compra de shampoos",
      185.0,
      "Transferência",
      "purchase",
      today.toISOString().split("T")[0],
      "concluido",
    ],
    [
      "despesa",
      "Operacional",
      "Conta de luz",
      245.6,
      "Débito Automático",
      "bill",
      today.toISOString().split("T")[0],
      "concluido",
    ],
    [
      "receita",
      "Produtos",
      "Venda de produtos",
      67.8,
      "Dinheiro",
      "sale",
      today.toISOString().split("T")[0],
      "concluido",
    ],
  ];

  transactions.forEach((transaction) => transactionStmt.run(...transaction));

  // Insert default settings
  const settingStmt = db.prepare(`
    INSERT INTO settings (category, key, value, type, description) VALUES (?, ?, ?, ?, ?)
  `);

  const settings = [
    ["business", "name", "Unclic Salon", "string", "Nome do salão"],
    [
      "business",
      "address",
      "Rua das Flores, 123",
      "string",
      "Endereço do salão",
    ],
    ["business", "phone", "(11) 3333-4444", "string", "Telefone do salão"],
    ["business", "email", "contato@unclic.com", "string", "Email do salão"],
    [
      "business",
      "working_hours",
      '{"monday":{"start":"08:00","end":"18:00"},"tuesday":{"start":"08:00","end":"18:00"},"wednesday":{"start":"08:00","end":"18:00"},"thursday":{"start":"08:00","end":"18:00"},"friday":{"start":"08:00","end":"18:00"},"saturday":{"start":"08:00","end":"17:00"},"sunday":{"closed":true}}',
      "json",
      "Horários de funcionamento",
    ],
    [
      "appointments",
      "default_duration",
      "30",
      "number",
      "Duração padrão dos agendamentos (minutos)",
    ],
    [
      "appointments",
      "booking_advance_days",
      "30",
      "number",
      "Dias de antecedência para agendamento",
    ],
    [
      "notifications",
      "email_enabled",
      "true",
      "boolean",
      "Notificações por email",
    ],
    [
      "notifications",
      "sms_enabled",
      "false",
      "boolean",
      "Notificações por SMS",
    ],
    ["financial", "currency", "BRL", "string", "Moeda padrão"],
    ["theme", "default_theme", "light", "string", "Tema padrão da aplicação"],
  ];

  settings.forEach((setting) => settingStmt.run(...setting));

  console.log("Database seeded successfully!");
}

// Execute seed
if (require.main === module) {
  seedDatabase();
  db.close();
}

export { seedDatabase };
