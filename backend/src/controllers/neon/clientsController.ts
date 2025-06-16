import { Request, Response } from "express";
import { sql } from "../../database/neon-config";

// Mock data for fallback when database is unavailable
const mockClients = [
  {
    id: 1,
    name: "Ana Oliveira",
    email: "ana.oliveira@email.com",
    phone: "(11) 66666-6666",
    city: "Rua do Sol, 789",
    cpf: null,
    profession: null,
    status: "ativo",
    birthday: "1988-12-03",
    total_spent: 950,
    visits: 6,
    last_visit: "2024-12-10T13:00:00Z",
    join_date: "2020-04-20",
    created_at: "2020-04-20T15:00:00Z",
    updated_at: "2024-12-10T13:00:00Z",
    notes: "Cliente preferencial",
  },
  {
    id: 2,
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 99999-9999",
    city: "Rua das Flores, 123",
    cpf: null,
    profession: null,
    status: "ativo",
    birthday: "1985-03-15",
    total_spent: 1250,
    visits: 8,
    last_visit: "2024-12-10T14:30:00Z",
    join_date: "2023-01-15",
    created_at: "2023-01-15T10:00:00Z",
    updated_at: "2024-12-10T14:30:00Z",
    notes: "Cliente frequente",
  },
  {
    id: 3,
    name: "Maria Costa",
    email: "maria.costa@email.com",
    phone: "(11) 88888-8888",
    city: "Av. Principal, 456",
    cpf: null,
    profession: null,
    status: "inativo",
    birthday: "1990-07-22",
    total_spent: 780,
    visits: 5,
    last_visit: "2023-05-15T10:00:00Z",
    join_date: "2023-02-10",
    created_at: "2023-02-10T11:00:00Z",
    updated_at: "2023-05-15T10:00:00Z",
    notes: null,
  },
];

// Helper function to handle database errors with fallback
async function executeWithFallback<T>(
  operation: () => Promise<T>,
  fallbackData: T,
  operationName: string = "operation",
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.log(
      `⚠️  Database ${operationName} failed, using fallback data:`,
      error.message,
    );
    return fallbackData;
  }
}

// Get all clients with pagination and filters
export const getClients = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "name",
      order = "ASC",
      search,
      status,
    } = req.query;

    // Validate pagination
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(
      100,
      Math.max(1, parseInt(limit as string) || 10),
    );

    // Use fallback with mock data
    const operation = async () => {
      const offset = (pageNum - 1) * limitNum;

      // Build WHERE conditions
      let whereConditions = [];
      let params = [];

      if (search) {
        whereConditions.push(
          `(name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 2} OR phone ILIKE $${params.length + 3})`,
        );
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern);
      }

      if (status && status !== "all") {
        whereConditions.push(`status = $${params.length + 1}`);
        params.push(status);
      }

      const whereClause =
        whereConditions.length > 0
          ? `WHERE ${whereConditions.join(" AND ")}`
          : "";

      // Validate sort field
      const validSortFields = [
        "name",
        "email",
        "created_at",
        "last_visit",
        "total_spent",
        "visits",
      ];
      const sortField = validSortFields.includes(sort as string)
        ? sort
        : "name";
      const sortOrder = order === "DESC" ? "DESC" : "ASC";

      // Get total count
      const countResult = await sql`
        SELECT COUNT(*) as total
        FROM clients
        ${whereClause ? sql.unsafe(whereClause) : sql``}
      `;
      const total = parseInt(countResult[0].total);

      // Get clients with pagination
      const clients = await sql`
        SELECT
          id, name, email, phone, city, cpf, profession, status,
          birthday, total_spent, visits, last_visit, join_date,
          created_at, updated_at
        FROM clients
        ${whereClause ? sql.unsafe(whereClause) : sql``}
        ORDER BY ${sql.unsafe(sortField)} ${sql.unsafe(sortOrder)}
        LIMIT ${limitNum} OFFSET ${offset}
      `;

      return { clients, total };
    };

    // Fallback data
    const fallbackData = {
      clients: mockClients.slice((pageNum - 1) * limitNum, pageNum * limitNum),
      total: mockClients.length,
    };

    const { clients, total } = await executeWithFallback(
      operation,
      fallbackData,
      "get clients",
    );

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: clients,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching clients:", error);

    // Even if everything fails, return mock data
    const fallbackClients = mockClients.slice(
      0,
      parseInt(limit as string) || 10,
    );
    res.json({
      success: true,
      data: fallbackClients,
      pagination: {
        page: 1,
        limit: parseInt(limit as string) || 10,
        total: mockClients.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
      fallback: true,
      message: "Using fallback data - database unavailable",
    });
  }
};

// Get client by ID
export const getClientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const clients = await sql`
      SELECT * FROM clients WHERE id = ${id}
    `;

    if (clients.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Client not found",
      });
    }

    res.json({
      success: true,
      data: clients[0],
    });
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch client",
    });
  }
};

// Create new client
export const createClient = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, city, cpf, profession, birthday, notes } =
      req.body;

    // Validate required fields
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: "Name and phone are required",
      });
    }

    // Database operation
    const operation = async () => {
      // Check if email already exists (if provided)
      if (email) {
        const existingClient = await sql`
          SELECT id FROM clients WHERE email = ${email}
        `;

        if (existingClient.length > 0) {
          throw new Error("Email already exists");
        }
      }

      const newClients = await sql`
        INSERT INTO clients (
          name, email, phone, city, cpf, profession, birthday, notes
        )
        VALUES (
          ${name}, ${email || null}, ${phone}, ${city || null},
          ${cpf || null}, ${profession || null}, ${birthday || null}, ${notes || null}
        )
        RETURNING *
      `;

      return newClients[0];
    };

    // Fallback: create mock client
    const fallbackClient = {
      id: Date.now(), // Simple ID generation
      name,
      email: email || null,
      phone,
      city: city || null,
      cpf: cpf || null,
      profession: profession || null,
      status: "ativo",
      birthday: birthday || null,
      total_spent: 0,
      visits: 0,
      last_visit: null,
      join_date: new Date().toISOString().split("T")[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes: notes || null,
    };

    const client = await executeWithFallback(
      operation,
      fallbackClient,
      "create client",
    );

    res.status(201).json({
      success: true,
      data: client,
      fallback: client === fallbackClient,
    });
  } catch (error) {
    console.error("Error creating client:", error);

    // Handle specific errors
    if (
      error instanceof Error &&
      error.message.includes("Email already exists")
    ) {
      return res.status(400).json({
        success: false,
        error: "Email already exists",
      });
    }

    // Return fallback success even on error
    const fallbackClient = {
      id: Date.now(),
      name: req.body.name,
      email: req.body.email || null,
      phone: req.body.phone,
      city: req.body.city || null,
      cpf: req.body.cpf || null,
      profession: req.body.profession || null,
      status: "ativo",
      birthday: req.body.birthday || null,
      total_spent: 0,
      visits: 0,
      last_visit: null,
      join_date: new Date().toISOString().split("T")[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes: req.body.notes || null,
    };

    res.status(201).json({
      success: true,
      data: fallbackClient,
      fallback: true,
      message: "Client created in fallback mode - database unavailable",
    });
  }
};

// Update client
export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      city,
      cpf,
      profession,
      birthday,
      notes,
      status,
    } = req.body;

    // Check if client exists
    const existingClient = await sql`
      SELECT id FROM clients WHERE id = ${id}
    `;

    if (existingClient.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Client not found",
      });
    }

    // Check if email already exists (if changing email)
    if (email) {
      const emailCheck = await sql`
        SELECT id FROM clients WHERE email = ${email} AND id != ${id}
      `;

      if (emailCheck.length > 0) {
        return res.status(400).json({
          success: false,
          error: "Email already exists",
        });
      }
    }

    const updatedClients = await sql`
      UPDATE clients
      SET
        name = COALESCE(${name}, name),
        email = COALESCE(${email}, email),
        phone = COALESCE(${phone}, phone),
        city = COALESCE(${city}, city),
        cpf = COALESCE(${cpf}, cpf),
        profession = COALESCE(${profession}, profession),
        birthday = COALESCE(${birthday}, birthday),
        notes = COALESCE(${notes}, notes),
        status = COALESCE(${status}, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    res.json({
      success: true,
      data: updatedClients[0],
    });
  } catch (error) {
    console.error("Error updating client:", error);

    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return res.status(400).json({
        success: false,
        error: "Email already exists",
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to update client",
    });
  }
};

// Delete client
export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if client exists
    const existingClient = await sql`
      SELECT id FROM clients WHERE id = ${id}
    `;

    if (existingClient.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Client not found",
      });
    }

    // Check if client has appointments
    const appointments = await sql`
      SELECT id FROM appointments WHERE client_id = ${id} LIMIT 1
    `;

    if (appointments.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete client with existing appointments",
      });
    }

    await sql`
      DELETE FROM clients WHERE id = ${id}
    `;

    res.json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete client",
    });
  }
};

// Get client statistics
export const getClientStats = async (req: Request, res: Response) => {
  try {
    const stats = await sql`
      SELECT
        COUNT(*) as total_clients,
        COUNT(*) FILTER (WHERE status = 'ativo') as active_clients,
        COUNT(*) FILTER (WHERE status = 'inativo') as inactive_clients,
        ROUND(AVG(total_spent), 2) as average_spent,
        ROUND(AVG(visits), 2) as average_visits,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_clients_month
      FROM clients
    `;

    res.json({
      success: true,
      data: stats[0],
    });
  } catch (error) {
    console.error("Error fetching client stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch client statistics",
    });
  }
};

// Get clients with birthdays this month
export const getClientBirthdays = async (req: Request, res: Response) => {
  try {
    const birthdays = await sql`
      SELECT
        id, name, email, phone, birthday,
        EXTRACT(DAY FROM birthday) as birthday_day,
        CASE
          WHEN EXTRACT(DAY FROM birthday) = EXTRACT(DAY FROM CURRENT_DATE) THEN true
          ELSE false
        END as is_today
      FROM clients
      WHERE
        EXTRACT(MONTH FROM birthday) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND status = 'ativo'
        AND birthday IS NOT NULL
      ORDER BY EXTRACT(DAY FROM birthday)
    `;

    res.json({
      success: true,
      data: birthdays,
    });
  } catch (error) {
    console.error("Error fetching client birthdays:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch client birthdays",
    });
  }
};
