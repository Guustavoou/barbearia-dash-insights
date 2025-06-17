import {
  SUPABASE_CONFIG,
  logSupabaseDebug,
  logSupabaseError,
  logSupabaseSuccess,
} from "./supabaseConfig";

/**
 * API que funciona 100% com dados mock quando o Supabase não tem o esquema necessário
 * Esta é a camada final de fallback que sempre funciona
 */
class NoSchemaSupabaseApi {
  // Mock data para clientes
  private mockClients = [
    {
      id: "1",
      name: "Ana Silva",
      email: "ana@email.com",
      phone: "(11) 99999-1111",
      address: "São Paulo, SP",
      status: "ativo",
      totalSpent: 850,
      visitCount: 8,
      createdAt: "2024-01-15T10:00:00Z",
      lastVisit: "2024-12-15T14:30:00Z",
      notes: "Cliente VIP",
    },
    {
      id: "2",
      name: "Carlos Santos",
      email: "carlos@email.com",
      phone: "(11) 88888-2222",
      address: "Rio de Janeiro, RJ",
      status: "ativo",
      totalSpent: 420,
      visitCount: 5,
      createdAt: "2024-02-10T11:00:00Z",
      lastVisit: "2024-12-10T16:00:00Z",
      notes: "Cliente regular",
    },
    {
      id: "3",
      name: "Maria Costa",
      email: "maria@email.com",
      phone: "(11) 77777-3333",
      address: "Belo Horizonte, MG",
      status: "inativo",
      totalSpent: 780,
      visitCount: 3,
      createdAt: "2024-03-05T09:00:00Z",
      lastVisit: "2024-10-15T10:00:00Z",
      notes: "Última visita há 2 meses",
    },
  ];

  // Mock data para agendamentos
  private mockAppointments = [
    {
      id: "1",
      clientName: "Ana Silva",
      service: "Corte + Escova",
      date: "2024-12-20",
      time: "09:00",
      professional: "Maria",
      status: "confirmado",
      price: 120,
    },
    {
      id: "2",
      clientName: "Carlos Santos",
      service: "Barba",
      date: "2024-12-20",
      time: "10:30",
      professional: "João",
      status: "pendente",
      price: 50,
    },
    {
      id: "3",
      clientName: "Beatriz Lima",
      service: "Manicure",
      date: "2024-12-20",
      time: "14:00",
      professional: "Ana",
      status: "concluido",
      price: 80,
    },
  ];

  // Mock data para serviços
  private mockServices = [
    {
      id: "1",
      name: "Corte Masculino",
      category: "Cabelo",
      price: 60,
      duration: 30,
      is_active: true,
    },
    {
      id: "2",
      name: "Escova",
      category: "Cabelo",
      price: 80,
      duration: 45,
      is_active: true,
    },
    {
      id: "3",
      name: "Barba",
      category: "Cabelo",
      price: 50,
      duration: 20,
      is_active: true,
    },
    {
      id: "4",
      name: "Manicure",
      category: "Unhas",
      price: 40,
      duration: 60,
      is_active: true,
    },
    {
      id: "5",
      name: "Pedicure",
      category: "Unhas",
      price: 50,
      duration: 75,
      is_active: true,
    },
  ];

  // Mock data para profissionais
  private mockProfessionals = [
    {
      id: "1",
      name: "Maria Silva",
      email: "maria.prof@salon.com",
      phone: "(11) 99999-0001",
      specialties: "Corte, Escova, Coloração",
      is_active: true,
      commission_rate: 0.4,
    },
    {
      id: "2",
      name: "João Santos",
      email: "joao.prof@salon.com",
      phone: "(11) 99999-0002",
      specialties: "Barba, Corte Masculino",
      is_active: true,
      commission_rate: 0.35,
    },
    {
      id: "3",
      name: "Ana Costa",
      email: "ana.prof@salon.com",
      phone: "(11) 99999-0003",
      specialties: "Manicure, Pedicure",
      is_active: true,
      commission_rate: 0.3,
    },
  ];

  async getClients(params?: any) {
    logSupabaseDebug("🎭 [NoSchema] Retornando clientes mock");

    let filteredClients = [...this.mockClients];

    // Aplicar filtros se fornecidos
    if (params?.status && params.status !== "all") {
      filteredClients = filteredClients.filter(
        (c) => c.status === params.status,
      );
    }

    if (params?.search) {
      const search = params.search.toLowerCase();
      filteredClients = filteredClients.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search) ||
          c.phone.includes(search),
      );
    }

    // Aplicar paginação
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const paginatedClients = filteredClients.slice(start, start + limit);

    logSupabaseSuccess(
      `🎭 [NoSchema] Retornando ${paginatedClients.length} clientes`,
    );

    return {
      success: true,
      data: paginatedClients,
      pagination: {
        page,
        limit,
        total: filteredClients.length,
        totalPages: Math.ceil(filteredClients.length / limit),
      },
    };
  }

  async getAppointments(params?: any) {
    logSupabaseDebug("🎭 [NoSchema] Retornando agendamentos mock");

    let filteredAppointments = [...this.mockAppointments];

    // Aplicar filtros
    if (params?.status && params.status !== "all") {
      filteredAppointments = filteredAppointments.filter(
        (a) => a.status === params.status,
      );
    }

    if (params?.date) {
      filteredAppointments = filteredAppointments.filter(
        (a) => a.date === params.date,
      );
    }

    // Aplicar paginação
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const paginatedAppointments = filteredAppointments.slice(
      start,
      start + limit,
    );

    logSupabaseSuccess(
      `🎭 [NoSchema] Retornando ${paginatedAppointments.length} agendamentos`,
    );

    return {
      success: true,
      data: paginatedAppointments,
      pagination: {
        page,
        limit,
        total: filteredAppointments.length,
        totalPages: Math.ceil(filteredAppointments.length / limit),
      },
    };
  }

  async getServices(params?: any) {
    logSupabaseDebug("🎭 [NoSchema] Retornando serviços mock");

    let filteredServices = [...this.mockServices];

    // Aplicar filtros
    if (params?.category && params.category !== "all") {
      filteredServices = filteredServices.filter(
        (s) => s.category === params.category,
      );
    }

    if (params?.isActive !== undefined) {
      filteredServices = filteredServices.filter(
        (s) => s.is_active === params.isActive,
      );
    }

    // Aplicar paginação
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const paginatedServices = filteredServices.slice(start, start + limit);

    logSupabaseSuccess(
      `🎭 [NoSchema] Retornando ${paginatedServices.length} serviços`,
    );

    return {
      success: true,
      data: paginatedServices,
      pagination: {
        page,
        limit,
        total: filteredServices.length,
        totalPages: Math.ceil(filteredServices.length / limit),
      },
    };
  }

  async getProfessionals(params?: any) {
    logSupabaseDebug("🎭 [NoSchema] Retornando profissionais mock");

    let filteredProfessionals = [...this.mockProfessionals];

    // Aplicar filtros
    if (params?.isActive !== undefined) {
      filteredProfessionals = filteredProfessionals.filter(
        (p) => p.is_active === params.isActive,
      );
    }

    if (params?.search) {
      const search = params.search.toLowerCase();
      filteredProfessionals = filteredProfessionals.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.specialties.toLowerCase().includes(search),
      );
    }

    // Aplicar paginação
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const paginatedProfessionals = filteredProfessionals.slice(
      start,
      start + limit,
    );

    logSupabaseSuccess(
      `🎭 [NoSchema] Retornando ${paginatedProfessionals.length} profissionais`,
    );

    return {
      success: true,
      data: paginatedProfessionals,
      pagination: {
        page,
        limit,
        total: filteredProfessionals.length,
        totalPages: Math.ceil(filteredProfessionals.length / limit),
      },
    };
  }

  async getDashboardStats() {
    logSupabaseDebug("🎭 [NoSchema] Calculando estatísticas mock");

    const stats = {
      total_clients: this.mockClients.length,
      total_appointments: this.mockAppointments.length,
      total_services: this.mockServices.length,
      total_professionals: this.mockProfessionals.length,
      total_revenue: this.mockClients.reduce((sum, c) => sum + c.totalSpent, 0),
      active_clients: this.mockClients.filter((c) => c.status === "ativo")
        .length,
      confirmed_appointments: this.mockAppointments.filter(
        (a) => a.status === "confirmado",
      ).length,
    };

    logSupabaseSuccess(
      "🎭 [NoSchema] Estatísticas calculadas:",
      JSON.stringify(stats, null, 2),
    );

    return {
      success: true,
      data: stats,
    };
  }

  async getSalesPerformance(period?: string, limit?: number) {
    logSupabaseDebug("🎭 [NoSchema] Calculando performance de vendas mock");

    const salesData = this.mockServices
      .slice(0, limit || 5)
      .map((service, index) => ({
        service_name: service.name,
        category: service.category,
        total_appointments: Math.floor(Math.random() * 20) + 5, // Mock
        total_revenue: service.price * (Math.floor(Math.random() * 20) + 5),
        average_price: service.price,
      }));

    logSupabaseSuccess(
      `🎭 [NoSchema] Performance calculada para ${salesData.length} serviços`,
    );

    return {
      success: true,
      data: salesData,
    };
  }

  // Método para simular criação (sempre bem-sucedida)
  async createClient(clientData: any) {
    logSupabaseDebug("🎭 [NoSchema] Simulando criação de cliente");

    const newClient = {
      id: String(Date.now()),
      ...clientData,
      totalSpent: 0,
      visitCount: 0,
      createdAt: new Date().toISOString(),
    };

    this.mockClients.unshift(newClient);

    logSupabaseSuccess("🎭 [NoSchema] Cliente criado com sucesso");

    return {
      success: true,
      data: newClient,
    };
  }

  async updateClient(id: string, clientData: any) {
    logSupabaseDebug(`🎭 [NoSchema] Simulando atualização de cliente ${id}`);

    const clientIndex = this.mockClients.findIndex((c) => c.id === id);
    if (clientIndex !== -1) {
      this.mockClients[clientIndex] = {
        ...this.mockClients[clientIndex],
        ...clientData,
      };
      logSupabaseSuccess("🎭 [NoSchema] Cliente atualizado com sucesso");
      return {
        success: true,
        data: this.mockClients[clientIndex],
      };
    }

    return {
      success: false,
      error: "Cliente não encontrado",
    };
  }

  async deleteClient(id: string) {
    logSupabaseDebug(`🎭 [NoSchema] Simulando exclusão de cliente ${id}`);

    const clientIndex = this.mockClients.findIndex((c) => c.id === id);
    if (clientIndex !== -1) {
      this.mockClients.splice(clientIndex, 1);
      logSupabaseSuccess("🎭 [NoSchema] Cliente excluído com sucesso");
      return {
        success: true,
        message: "Cliente excluído com sucesso",
      };
    }

    return {
      success: false,
      error: "Cliente não encontrado",
    };
  }
}

export const noSchemaSupabaseApi = new NoSchemaSupabaseApi();
