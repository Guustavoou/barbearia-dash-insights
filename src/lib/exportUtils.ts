import { toast } from "@/hooks/use-toast";

export interface ExportData {
  filename: string;
  data: any[];
  type: "excel" | "csv" | "pdf" | "json";
  columns?: string[];
}

export const exportToCSV = (data: any[], filename: string = "export") => {
  if (!data || data.length === 0) {
    toast({
      title: "❌ Erro na Exportação",
      description: "Nenhum dado disponível para exportar.",
    });
    return;
  }

  try {
    // Get headers from the first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
      headers.join(","), // Header row
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Handle values that might contain commas or quotes
            if (
              typeof value === "string" &&
              (value.includes(",") || value.includes('"'))
            ) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || "";
          })
          .join(","),
      ),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "✅ Exportação Concluída",
      description: `Arquivo ${filename}.csv baixado com sucesso!`,
    });
  } catch (error) {
    toast({
      title: "❌ Erro na Exportação",
      description: "Falha ao gerar arquivo CSV.",
    });
  }
};

export const exportToJSON = (data: any[], filename: string = "export") => {
  if (!data || data.length === 0) {
    toast({
      title: "❌ Erro na Exportação",
      description: "Nenhum dado disponível para exportar.",
    });
    return;
  }

  try {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.json`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "✅ Exportação Concluída",
      description: `Arquivo ${filename}.json baixado com sucesso!`,
    });
  } catch (error) {
    toast({
      title: "❌ Erro na Exportação",
      description: "Falha ao gerar arquivo JSON.",
    });
  }
};

export const exportDashboardData = () => {
  const mockDashboardData = [
    {
      date: new Date().toLocaleDateString("pt-BR"),
      agendamentos: 25,
      faturamento: "R$ 2.850,00",
      clientes: 18,
      servicos: "Corte, Barba, Sobrancelha",
      status: "Ativo",
    },
    {
      date: new Date(Date.now() - 86400000).toLocaleDateString("pt-BR"),
      agendamentos: 22,
      faturamento: "R$ 2.420,00",
      clientes: 16,
      servicos: "Corte, Barba, Relaxamento",
      status: "Ativo",
    },
    {
      date: new Date(Date.now() - 172800000).toLocaleDateString("pt-BR"),
      agendamentos: 30,
      faturamento: "R$ 3.200,00",
      clientes: 24,
      servicos: "Corte, Barba, Manicure",
      status: "Ativo",
    },
  ];

  exportToCSV(mockDashboardData, "dashboard-dados");
};

export const exportClientsData = () => {
  const mockClientsData = [
    {
      nome: "Maria Silva",
      email: "maria@email.com",
      telefone: "(11) 99999-9999",
      ultimaVisita: "2024-01-15",
      totalGasto: "R$ 450,00",
      status: "Ativo",
      categoria: "VIP",
    },
    {
      nome: "João Santos",
      email: "joao@email.com",
      telefone: "(11) 88888-8888",
      ultimaVisita: "2024-01-14",
      totalGasto: "R$ 280,00",
      status: "Ativo",
      categoria: "Regular",
    },
    {
      nome: "Ana Oliveira",
      email: "ana@email.com",
      telefone: "(11) 77777-7777",
      ultimaVisita: "2024-01-13",
      totalGasto: "R$ 890,00",
      status: "Ativo",
      categoria: "Premium",
    },
  ];

  exportToCSV(mockClientsData, "clientes-dados");
};

export const exportAppointmentsData = () => {
  const mockAppointmentsData = [
    {
      data: "2024-01-15",
      horario: "09:00",
      cliente: "Maria Silva",
      servico: "Corte + Escova",
      profissional: "Ana Costa",
      valor: "R$ 85,00",
      status: "Concluído",
      pagamento: "Cartão",
    },
    {
      data: "2024-01-15",
      horario: "10:30",
      cliente: "João Santos",
      servico: "Corte + Barba",
      profissional: "Carlos Lima",
      valor: "R$ 65,00",
      status: "Concluído",
      pagamento: "Dinheiro",
    },
    {
      data: "2024-01-15",
      horario: "14:00",
      cliente: "Ana Oliveira",
      servico: "Química + Corte",
      profissional: "Ana Costa",
      valor: "R$ 180,00",
      status: "Agendado",
      pagamento: "PIX",
    },
  ];

  exportToCSV(mockAppointmentsData, "agendamentos-dados");
};

export const exportFinancialData = () => {
  const mockFinancialData = [
    {
      data: "2024-01-15",
      receita: "R$ 2.850,00",
      despesas: "R$ 450,00",
      lucro: "R$ 2.400,00",
      agendamentos: 25,
      ticketMedio: "R$ 114,00",
      formaPagamento: "PIX (60%), Cartão (30%), Dinheiro (10%)",
    },
    {
      data: "2024-01-14",
      receita: "R$ 2.420,00",
      despesas: "R$ 380,00",
      lucro: "R$ 2.040,00",
      agendamentos: 22,
      ticketMedio: "R$ 110,00",
      formaPagamento: "PIX (55%), Cartão (35%), Dinheiro (10%)",
    },
    {
      data: "2024-01-13",
      receita: "R$ 3.200,00",
      despesas: "R$ 520,00",
      lucro: "R$ 2.680,00",
      agendamentos: 30,
      ticketMedio: "R$ 106,67",
      formaPagamento: "PIX (65%), Cartão (25%), Dinheiro (10%)",
    },
  ];

  exportToCSV(mockFinancialData, "financeiro-dados");
};

export const exportServicesData = () => {
  const mockServicesData = [
    {
      nome: "Corte Masculino",
      preco: "R$ 35,00",
      duracao: "30 min",
      categoria: "Cabelo",
      profissionais: "Ana Costa, Carlos Lima",
      agendamentosUltimos30Dias: 45,
      receitaUltimos30Dias: "R$ 1.575,00",
    },
    {
      nome: "Escova",
      preco: "R$ 25,00",
      duracao: "40 min",
      categoria: "Cabelo",
      profissionais: "Ana Costa",
      agendamentosUltimos30Dias: 32,
      receitaUltimos30Dias: "R$ 800,00",
    },
    {
      nome: "Barba",
      preco: "R$ 25,00",
      duracao: "20 min",
      categoria: "Barba",
      profissionais: "Carlos Lima",
      agendamentosUltimos30Dias: 28,
      receitaUltimos30Dias: "R$ 700,00",
    },
  ];

  exportToCSV(mockServicesData, "servicos-dados");
};

export const exportProfessionalsData = () => {
  const mockProfessionalsData = [
    {
      nome: "Ana Costa",
      email: "ana.costa@salao.com",
      telefone: "(11) 99999-1111",
      especialidades: "Corte, Escova, Química",
      agendamentosUltimos30Dias: 78,
      receitaUltimos30Dias: "R$ 3.900,00",
      avaliacaoMedia: "4.9",
      status: "Ativo",
    },
    {
      nome: "Carlos Lima",
      email: "carlos.lima@salao.com",
      telefone: "(11) 99999-2222",
      especialidades: "Corte Masculino, Barba",
      agendamentosUltimos30Dias: 65,
      receitaUltimos30Dias: "R$ 2.600,00",
      avaliacaoMedia: "4.8",
      status: "Ativo",
    },
  ];

  exportToCSV(mockProfessionalsData, "profissionais-dados");
};

// Universal export function
export const universalExport = (type: string, customData?: any[]) => {
  toast({
    title: "📊 Iniciando Exportação",
    description: `Preparando dados de ${type}...`,
  });

  setTimeout(() => {
    switch (type.toLowerCase()) {
      case "dashboard":
        exportDashboardData();
        break;
      case "clientes":
      case "clients":
        exportClientsData();
        break;
      case "agendamentos":
      case "appointments":
        exportAppointmentsData();
        break;
      case "financeiro":
      case "financial":
        exportFinancialData();
        break;
      case "servicos":
      case "services":
        exportServicesData();
        break;
      case "profissionais":
      case "professionals":
        exportProfessionalsData();
        break;
      default:
        if (customData) {
          exportToCSV(customData, `${type}-dados`);
        } else {
          exportDashboardData();
        }
    }
  }, 1000);
};
