import React, { useState } from "react";
import {
  Megaphone,
  Plus,
  TrendingUp,
  Users,
  Eye,
  Mail,
  MessageSquare,
  Calendar,
  Gift,
  Target,
  Star,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";

interface MarketingProps {
  darkMode: boolean;
}

interface Campaign {
  id: string;
  name: string;
  type: "email" | "sms" | "whatsapp" | "promotion";
  status: "active" | "draft" | "completed" | "paused";
  reach: number;
  opens: number;
  clicks: number;
  conversions: number;
  startDate: string;
  endDate?: string;
  budget: number;
  description: string;
}

interface Promotion {
  id: string;
  title: string;
  type: "discount" | "fidelity" | "referral" | "birthday";
  value: number;
  isActive: boolean;
  validUntil: string;
  usageCount: number;
  maxUsage?: number;
  description: string;
}

const campaigns: Campaign[] = [
  {
    id: "1",
    name: "Campanha de Verão 2024",
    type: "email",
    status: "active",
    reach: 1250,
    opens: 845,
    clicks: 234,
    conversions: 67,
    startDate: "2024-01-01",
    endDate: "2024-02-29",
    budget: 500,
    description: "Promoção especial para serviços de verão",
  },
  {
    id: "2",
    name: "WhatsApp - Novos Clientes",
    type: "whatsapp",
    status: "active",
    reach: 85,
    opens: 78,
    clicks: 45,
    conversions: 23,
    startDate: "2024-01-10",
    budget: 150,
    description: "Mensagem de boas-vindas para novos clientes",
  },
  {
    id: "3",
    name: "SMS - Lembrete de Agendamento",
    type: "sms",
    status: "completed",
    reach: 2100,
    opens: 1980,
    clicks: 890,
    conversions: 456,
    startDate: "2023-12-01",
    endDate: "2023-12-31",
    budget: 300,
    description: "Lembretes automáticos de agendamento",
  },
  {
    id: "4",
    name: "Promoção Dia das Mães",
    type: "promotion",
    status: "draft",
    reach: 0,
    opens: 0,
    clicks: 0,
    conversions: 0,
    startDate: "2024-05-01",
    endDate: "2024-05-12",
    budget: 800,
    description: "Campanha especial para o Dia das Mães",
  },
];

const promotions: Promotion[] = [
  {
    id: "1",
    title: "15% OFF em Coloração",
    type: "discount",
    value: 15,
    isActive: true,
    validUntil: "2024-03-31",
    usageCount: 23,
    maxUsage: 100,
    description: "Desconto especial em todos os serviços de coloração",
  },
  {
    id: "2",
    title: "Programa Fidelidade",
    type: "fidelity",
    value: 10,
    isActive: true,
    validUntil: "2024-12-31",
    usageCount: 156,
    description: "A cada 10 visitas, ganhe 1 serviço grátis",
  },
  {
    id: "3",
    title: "Indique um Amigo",
    type: "referral",
    value: 20,
    isActive: true,
    validUntil: "2024-06-30",
    usageCount: 34,
    description: "Ganhe 20% de desconto ao indicar um novo cliente",
  },
  {
    id: "4",
    title: "Aniversariante do Mês",
    type: "birthday",
    value: 25,
    isActive: true,
    validUntil: "2024-12-31",
    usageCount: 12,
    description: "Desconto especial para aniversariantes",
  },
];

export const Marketing: React.FC<MarketingProps> = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "campaigns" | "promotions" | "analytics"
  >("dashboard");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusColor = (status: Campaign["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCampaignIcon = (type: Campaign["type"]) => {
    switch (type) {
      case "email":
        return <Mail className="h-5 w-5" />;
      case "sms":
        return <MessageSquare className="h-5 w-5" />;
      case "whatsapp":
        return <MessageSquare className="h-5 w-5 text-green-600" />;
      case "promotion":
        return <Gift className="h-5 w-5" />;
      default:
        return <Megaphone className="h-5 w-5" />;
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div
          className={cn(
            "p-6 rounded-lg border",
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white",
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Campanhas Ativas
              </p>
              <p
                className={cn(
                  "text-2xl font-bold mt-1",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                3
              </p>
            </div>
            <Megaphone className="h-10 w-10 text-blue-500" />
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500 text-sm font-medium">+2</span>
            <span
              className={cn(
                "text-sm ml-2",
                darkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              este mês
            </span>
          </div>
        </div>

        <div
          className={cn(
            "p-6 rounded-lg border",
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white",
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Total Alcance
              </p>
              <p
                className={cn(
                  "text-2xl font-bold mt-1",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                3,435
              </p>
            </div>
            <Users className="h-10 w-10 text-green-500" />
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500 text-sm font-medium">+18.2%</span>
            <span
              className={cn(
                "text-sm ml-2",
                darkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              vs mês anterior
            </span>
          </div>
        </div>

        <div
          className={cn(
            "p-6 rounded-lg border",
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white",
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Taxa de Conversão
              </p>
              <p
                className={cn(
                  "text-2xl font-bold mt-1",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                12.8%
              </p>
            </div>
            <Target className="h-10 w-10 text-purple-500" />
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500 text-sm font-medium">+2.1%</span>
            <span
              className={cn(
                "text-sm ml-2",
                darkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              vs mês anterior
            </span>
          </div>
        </div>

        <div
          className={cn(
            "p-6 rounded-lg border",
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white",
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                ROI Médio
              </p>
              <p
                className={cn(
                  "text-2xl font-bold mt-1",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                340%
              </p>
            </div>
            <BarChart3 className="h-10 w-10 text-orange-500" />
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500 text-sm font-medium">+25%</span>
            <span
              className={cn(
                "text-sm ml-2",
                darkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              vs mês anterior
            </span>
          </div>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div
        className={cn(
          "p-6 rounded-lg border",
          darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white",
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className={cn(
              "text-lg font-semibold",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            Campanhas Recentes
          </h3>
          <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
            Ver todas
          </button>
        </div>
        <div className="space-y-4">
          {campaigns.slice(0, 3).map((campaign) => (
            <div
              key={campaign.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="text-blue-500">
                  {getCampaignIcon(campaign.type)}
                </div>
                <div>
                  <p
                    className={cn(
                      "font-medium",
                      darkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {campaign.name}
                  </p>
                  <p
                    className={cn(
                      "text-sm",
                      darkMode ? "text-gray-400" : "text-gray-600",
                    )}
                  >
                    {campaign.reach} pessoas alcançadas
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "px-2 py-1 text-xs rounded-full border",
                    getStatusColor(campaign.status),
                  )}
                >
                  {campaign.status === "active"
                    ? "Ativa"
                    : campaign.status === "draft"
                      ? "Rascunho"
                      : campaign.status === "completed"
                        ? "Concluída"
                        : "Pausada"}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    darkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {((campaign.conversions / campaign.reach) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Promotions */}
      <div
        className={cn(
          "p-6 rounded-lg border",
          darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white",
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className={cn(
              "text-lg font-semibold",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            Promoções Ativas
          </h3>
          <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
            Gerenciar
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {promotions
            .filter((promo) => promo.isActive)
            .slice(0, 4)
            .map((promo) => (
              <div
                key={promo.id}
                className={cn(
                  "p-4 rounded-lg border",
                  darkMode
                    ? "border-gray-600 bg-gray-700"
                    : "border-gray-300 bg-gray-50",
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4
                    className={cn(
                      "font-medium",
                      darkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {promo.title}
                  </h4>
                  <Gift className="h-5 w-5 text-purple-500" />
                </div>
                <p
                  className={cn(
                    "text-sm mb-3",
                    darkMode ? "text-gray-300" : "text-gray-600",
                  )}
                >
                  {promo.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span
                    className={cn(darkMode ? "text-gray-400" : "text-gray-500")}
                  >
                    {promo.usageCount} usos
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      darkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    Válido até{" "}
                    {new Date(promo.validUntil).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderCampaigns = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3
          className={cn(
            "text-lg font-semibold",
            darkMode ? "text-white" : "text-gray-900",
          )}
        >
          Todas as Campanhas
        </h3>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Nova Campanha
        </button>
      </div>

      <div className="grid gap-6">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className={cn(
              "p-6 rounded-lg border",
              darkMode
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white",
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-blue-500">
                  {getCampaignIcon(campaign.type)}
                </div>
                <div>
                  <h4
                    className={cn(
                      "text-lg font-semibold",
                      darkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {campaign.name}
                  </h4>
                  <p
                    className={cn(
                      "text-sm mt-1",
                      darkMode ? "text-gray-400" : "text-gray-600",
                    )}
                  >
                    {campaign.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "px-3 py-1 text-sm rounded-full border font-medium",
                    getStatusColor(campaign.status),
                  )}
                >
                  {campaign.status === "active"
                    ? "Ativa"
                    : campaign.status === "draft"
                      ? "Rascunho"
                      : campaign.status === "completed"
                        ? "Concluída"
                        : "Pausada"}
                </span>
                <button
                  className={cn(
                    "p-2 rounded-lg",
                    darkMode
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-gray-100 text-gray-600",
                  )}
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div className="text-center">
                <p
                  className={cn(
                    "text-2xl font-bold",
                    darkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {campaign.reach.toLocaleString()}
                </p>
                <p
                  className={cn(
                    "text-sm",
                    darkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  Alcance
                </p>
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-2xl font-bold",
                    darkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {campaign.opens.toLocaleString()}
                </p>
                <p
                  className={cn(
                    "text-sm",
                    darkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  Aberturas
                </p>
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-2xl font-bold",
                    darkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {campaign.clicks.toLocaleString()}
                </p>
                <p
                  className={cn(
                    "text-sm",
                    darkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  Cliques
                </p>
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-2xl font-bold",
                    darkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {campaign.conversions.toLocaleString()}
                </p>
                <p
                  className={cn(
                    "text-sm",
                    darkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  Conversões
                </p>
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-2xl font-bold",
                    darkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {formatCurrency(campaign.budget)}
                </p>
                <p
                  className={cn(
                    "text-sm",
                    darkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  Orçamento
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span
                  className={cn(darkMode ? "text-gray-400" : "text-gray-600")}
                >
                  Período:{" "}
                  {new Date(campaign.startDate).toLocaleDateString("pt-BR")}
                  {campaign.endDate &&
                    ` - ${new Date(campaign.endDate).toLocaleDateString("pt-BR")}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "font-medium",
                    darkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  CTR:{" "}
                  {campaign.reach > 0
                    ? ((campaign.clicks / campaign.reach) * 100).toFixed(1)
                    : "0"}
                  %
                </span>
                <span
                  className={cn(
                    "font-medium",
                    darkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  Conversão:{" "}
                  {campaign.reach > 0
                    ? ((campaign.conversions / campaign.reach) * 100).toFixed(1)
                    : "0"}
                  %
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPromotions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3
          className={cn(
            "text-lg font-semibold",
            darkMode ? "text-white" : "text-gray-900",
          )}
        >
          Promoções e Ofertas
        </h3>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Nova Promoção
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className={cn(
              "p-6 rounded-lg border",
              darkMode
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white",
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Gift className="h-8 w-8 text-purple-500" />
                <div>
                  <h4
                    className={cn(
                      "text-lg font-semibold",
                      darkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {promo.title}
                  </h4>
                  <p
                    className={cn(
                      "text-sm mt-1",
                      darkMode ? "text-gray-400" : "text-gray-600",
                    )}
                  >
                    {promo.description}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  "px-3 py-1 text-sm rounded-full font-medium",
                  promo.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800",
                )}
              >
                {promo.isActive ? "Ativa" : "Inativa"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p
                  className={cn(
                    "text-sm",
                    darkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  Valor do Desconto
                </p>
                <p
                  className={cn(
                    "text-xl font-bold",
                    darkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {promo.value}%
                </p>
              </div>
              <div>
                <p
                  className={cn(
                    "text-sm",
                    darkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  Usos
                </p>
                <p
                  className={cn(
                    "text-xl font-bold",
                    darkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {promo.usageCount}
                  {promo.maxUsage && `/${promo.maxUsage}`}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span
                className={cn(darkMode ? "text-gray-400" : "text-gray-600")}
              >
                Válido até:{" "}
                {new Date(promo.validUntil).toLocaleDateString("pt-BR")}
              </span>
              <div className="flex items-center gap-2">
                <button
                  className={cn(
                    "px-3 py-1 text-xs rounded-lg",
                    darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                  )}
                >
                  Editar
                </button>
                <button
                  className={cn(
                    "px-3 py-1 text-xs rounded-lg",
                    promo.isActive
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200",
                  )}
                >
                  {promo.isActive ? "Pausar" : "Ativar"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className={cn(
            "text-2xl font-bold",
            darkMode ? "text-white" : "text-gray-900",
          )}
        >
          Marketing e Campanhas
        </h1>
        <p
          className={cn(
            "text-sm mt-1",
            darkMode ? "text-gray-400" : "text-gray-600",
          )}
        >
          Gerencie campanhas, promoções e aumente o engajamento com seus
          clientes
        </p>
      </div>

      {/* Navigation Tabs */}
      <div
        className={cn(
          "flex items-center p-1 rounded-lg border",
          darkMode
            ? "border-gray-700 bg-gray-800"
            : "border-gray-300 bg-gray-100",
        )}
      >
        {(
          [
            { key: "dashboard", label: "Visão Geral", icon: BarChart3 },
            { key: "campaigns", label: "Campanhas", icon: Megaphone },
            { key: "promotions", label: "Promoções", icon: Gift },
            { key: "analytics", label: "Analytics", icon: TrendingUp },
          ] as const
        ).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
              activeTab === key
                ? "bg-blue-500 text-white"
                : darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-200",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "dashboard" && renderDashboard()}
      {activeTab === "campaigns" && renderCampaigns()}
      {activeTab === "promotions" && renderPromotions()}
      {activeTab === "analytics" && (
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3
            className={cn(
              "text-xl font-semibold mb-2",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            Analytics Avançado
          </h3>
          <p className={cn("text-gray-500 dark:text-gray-400")}>
            Análises detalhadas de performance e ROI das campanhas de marketing
          </p>
        </div>
      )}
    </div>
  );
};
