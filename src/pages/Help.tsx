import React, { useState } from "react";
import {
  Search,
  MessageCircle,
  Phone,
  Mail,
  Book,
  Video,
  HelpCircle,
  CheckCircle,
  Clock,
  User,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";

interface HelpProps {
  darkMode: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

interface SupportTicket {
  id: string;
  subject: string;
  status: "open" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  createdAt: string;
  lastUpdate: string;
}

const faqs: FAQ[] = [
  {
    id: "1",
    question: "Como faço para cancelar um agendamento?",
    answer:
      "Para cancelar um agendamento, vá até a página de Agendamentos, encontre o agendamento desejado e clique no botão 'Cancelar'. Você também pode ligar diretamente para o cliente para informar sobre o cancelamento.",
    category: "Agendamentos",
    helpful: 15,
  },
  {
    id: "2",
    question: "Como adicionar um novo cliente?",
    answer:
      "Na página de Clientes, clique no botão '+ Novo Cliente' no canto superior direito. Preencha as informações necessárias como nome, telefone, email e clique em 'Salvar'.",
    category: "Clientes",
    helpful: 12,
  },
  {
    id: "3",
    question: "Como visualizar o relatório financeiro?",
    answer:
      "Acesse a página 'Financeiro' no menu lateral. Lá você encontrará gráficos de receita, despesas e pode filtrar por período específico para análise detalhada.",
    category: "Financeiro",
    helpful: 18,
  },
  {
    id: "4",
    question: "Posso alterar o horário de funcionamento?",
    answer:
      "Sim! Vá em Configurações > Negócio e você poderá alterar os horários de funcionamento, dias da semana e intervalos de atendimento.",
    category: "Configurações",
    helpful: 8,
  },
  {
    id: "5",
    question: "Como criar um novo serviço?",
    answer:
      "Na página de Serviços, clique em '+ Novo Serviço'. Defina o nome, duração, preço, categoria e selecione quais profissionais podem realizar esse serviço.",
    category: "Serviços",
    helpful: 10,
  },
];

const tickets: SupportTicket[] = [
  {
    id: "TK001",
    subject: "Problema com sincronização de dados",
    status: "in-progress",
    priority: "high",
    createdAt: "2024-01-15",
    lastUpdate: "2024-01-16",
  },
  {
    id: "TK002",
    subject: "Dúvida sobre relatórios financeiros",
    status: "resolved",
    priority: "medium",
    createdAt: "2024-01-14",
    lastUpdate: "2024-01-15",
  },
  {
    id: "TK003",
    subject: "Solicitação de nova funcionalidade",
    status: "open",
    priority: "low",
    createdAt: "2024-01-13",
    lastUpdate: "2024-01-13",
  },
];

export const Help: React.FC<HelpProps> = ({ darkMode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [activeTab, setActiveTab] = useState<
    "faq" | "contact" | "tutorials" | "tickets"
  >("faq");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const categories = [
    "Todos",
    "Agendamentos",
    "Clientes",
    "Financeiro",
    "Configurações",
    "Serviços",
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todos" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: SupportTicket["status"]) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: SupportTicket["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const renderFAQ = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className={cn(
              "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4",
              darkMode ? "text-gray-400" : "text-gray-500",
            )}
          />
          <input
            type="text"
            placeholder="Buscar nas perguntas frequentes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "pl-10 pr-4 py-3 w-full rounded-lg border",
              darkMode
                ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 placeholder-gray-500",
            )}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={cn(
            "px-4 py-3 rounded-lg border min-w-[150px]",
            darkMode
              ? "bg-gray-800 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900",
          )}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFaqs.map((faq) => (
          <div
            key={faq.id}
            className={cn(
              "border rounded-lg overflow-hidden transition-all",
              darkMode
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white",
            )}
          >
            <button
              onClick={() =>
                setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
              }
              className={cn(
                "w-full p-4 text-left hover:bg-opacity-50 transition-colors",
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3
                    className={cn(
                      "font-medium",
                      darkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {faq.question}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        darkMode
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-600",
                      )}
                    >
                      {faq.category}
                    </span>
                    <span
                      className={cn(
                        "text-xs",
                        darkMode ? "text-gray-400" : "text-gray-500",
                      )}
                    >
                      {faq.helpful} pessoas acharam útil
                    </span>
                  </div>
                </div>
                <HelpCircle
                  className={cn(
                    "h-5 w-5 ml-4 transition-transform",
                    expandedFaq === faq.id && "rotate-180",
                    darkMode ? "text-gray-400" : "text-gray-500",
                  )}
                />
              </div>
            </button>

            {expandedFaq === faq.id && (
              <div
                className={cn(
                  "p-4 border-t",
                  darkMode
                    ? "border-gray-700 bg-gray-900"
                    : "border-gray-200 bg-gray-50",
                )}
              >
                <p
                  className={cn(
                    "text-sm leading-relaxed",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  {faq.answer}
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <span
                    className={cn(
                      "text-sm",
                      darkMode ? "text-gray-400" : "text-gray-600",
                    )}
                  >
                    Esta resposta foi útil?
                  </span>
                  <button className="text-sm text-green-600 hover:text-green-700">
                    👍 Sim
                  </button>
                  <button className="text-sm text-red-600 hover:text-red-700">
                    👎 Não
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Phone Support */}
        <div
          className={cn(
            "p-6 rounded-lg border text-center",
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white",
          )}
        >
          <Phone className="h-12 w-12 mx-auto mb-4 text-blue-500" />
          <h3
            className={cn(
              "font-semibold mb-2",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            Suporte por Telefone
          </h3>
          <p
            className={cn(
              "text-sm mb-4",
              darkMode ? "text-gray-300" : "text-gray-600",
            )}
          >
            Fale diretamente com nossa equipe
          </p>
          <p className="text-blue-500 font-medium">(11) 9999-9999</p>
          <p
            className={cn(
              "text-xs mt-2",
              darkMode ? "text-gray-400" : "text-gray-500",
            )}
          >
            Seg-Sex: 8h às 18h
          </p>
        </div>

        {/* Email Support */}
        <div
          className={cn(
            "p-6 rounded-lg border text-center",
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white",
          )}
        >
          <Mail className="h-12 w-12 mx-auto mb-4 text-green-500" />
          <h3
            className={cn(
              "font-semibold mb-2",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            Suporte por Email
          </h3>
          <p
            className={cn(
              "text-sm mb-4",
              darkMode ? "text-gray-300" : "text-gray-600",
            )}
          >
            Envie sua dúvida detalhada
          </p>
          <p className="text-green-500 font-medium">suporte@unclic.com</p>
          <p
            className={cn(
              "text-xs mt-2",
              darkMode ? "text-gray-400" : "text-gray-500",
            )}
          >
            Resposta em até 24h
          </p>
        </div>

        {/* Chat Support */}
        <div
          className={cn(
            "p-6 rounded-lg border text-center",
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white",
          )}
        >
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-purple-500" />
          <h3
            className={cn(
              "font-semibold mb-2",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            Chat Online
          </h3>
          <p
            className={cn(
              "text-sm mb-4",
              darkMode ? "text-gray-300" : "text-gray-600",
            )}
          >
            Atendimento instantâneo
          </p>
          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
            Iniciar Chat
          </button>
          <p
            className={cn(
              "text-xs mt-2",
              darkMode ? "text-gray-400" : "text-gray-500",
            )}
          >
            Online agora
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div
        className={cn(
          "p-6 rounded-lg border",
          darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white",
        )}
      >
        <h3
          className={cn(
            "text-lg font-semibold mb-4",
            darkMode ? "text-white" : "text-gray-900",
          )}
        >
          Formulário de Contato
        </h3>
        <form className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                className={cn(
                  "block text-sm font-medium mb-2",
                  darkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                Nome
              </label>
              <input
                type="text"
                className={cn(
                  "w-full px-3 py-2 rounded-lg border",
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300",
                )}
              />
            </div>
            <div>
              <label
                className={cn(
                  "block text-sm font-medium mb-2",
                  darkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                Email
              </label>
              <input
                type="email"
                className={cn(
                  "w-full px-3 py-2 rounded-lg border",
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300",
                )}
              />
            </div>
          </div>
          <div>
            <label
              className={cn(
                "block text-sm font-medium mb-2",
                darkMode ? "text-gray-300" : "text-gray-700",
              )}
            >
              Assunto
            </label>
            <input
              type="text"
              className={cn(
                "w-full px-3 py-2 rounded-lg border",
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300",
              )}
            />
          </div>
          <div>
            <label
              className={cn(
                "block text-sm font-medium mb-2",
                darkMode ? "text-gray-300" : "text-gray-700",
              )}
            >
              Mensagem
            </label>
            <textarea
              rows={4}
              className={cn(
                "w-full px-3 py-2 rounded-lg border",
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300",
              )}
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Enviar Mensagem
          </button>
        </form>
      </div>
    </div>
  );

  const renderTickets = () => (
    <div className="space-y-6">
      {/* Create Ticket Button */}
      <div className="flex justify-between items-center">
        <h3
          className={cn(
            "text-lg font-semibold",
            darkMode ? "text-white" : "text-gray-900",
          )}
        >
          Meus Tickets de Suporte
        </h3>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          + Novo Ticket
        </button>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className={cn(
              "p-4 rounded-lg border",
              darkMode
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white",
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4
                    className={cn(
                      "font-medium",
                      darkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {ticket.subject}
                  </h4>
                  <span
                    className={cn(
                      "px-2 py-1 text-xs rounded-full border",
                      getStatusColor(ticket.status),
                    )}
                  >
                    {ticket.status === "open"
                      ? "Aberto"
                      : ticket.status === "in-progress"
                        ? "Em Andamento"
                        : "Resolvido"}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className={cn("text-gray-500 dark:text-gray-400")}>
                    ID: {ticket.id}
                  </span>
                  <span className={getPriorityColor(ticket.priority)}>
                    Prioridade:{" "}
                    {ticket.priority === "high"
                      ? "Alta"
                      : ticket.priority === "medium"
                        ? "Média"
                        : "Baixa"}
                  </span>
                  <span className={cn("text-gray-500 dark:text-gray-400")}>
                    Criado:{" "}
                    {new Date(ticket.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                  <span className={cn("text-gray-500 dark:text-gray-400")}>
                    Atualizado:{" "}
                    {new Date(ticket.lastUpdate).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
              <button
                className={cn(
                  "text-sm px-3 py-1 rounded-lg",
                  darkMode
                    ? "text-blue-400 hover:bg-gray-700"
                    : "text-blue-600 hover:bg-blue-50",
                )}
              >
                Ver Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1
          className={cn(
            "text-3xl font-bold mb-2",
            darkMode ? "text-white" : "text-gray-900",
          )}
        >
          Central de Ajuda
        </h1>
        <p
          className={cn(
            "text-lg",
            darkMode ? "text-gray-400" : "text-gray-600",
          )}
        >
          Encontre respostas rápidas e obtenha suporte para o Unclic
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center">
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
              { key: "faq", label: "Perguntas Frequentes", icon: HelpCircle },
              { key: "contact", label: "Contato", icon: MessageCircle },
              { key: "tutorials", label: "Tutoriais", icon: Video },
              { key: "tickets", label: "Meus Tickets", icon: User },
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
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto">
        {activeTab === "faq" && renderFAQ()}
        {activeTab === "contact" && renderContact()}
        {activeTab === "tickets" && renderTickets()}
        {activeTab === "tutorials" && (
          <div className="text-center py-12">
            <Video className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3
              className={cn(
                "text-xl font-semibold mb-2",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              Tutoriais em Vídeo
            </h3>
            <p className={cn("text-gray-500 dark:text-gray-400 mb-6")}>
              Aprenda a usar todas as funcionalidades do Unclic
            </p>
            <p
              className={cn(
                "text-sm",
                darkMode ? "text-gray-400" : "text-gray-500",
              )}
            >
              Seção de tutoriais em desenvolvimento. Em breve você terá acesso a
              vídeos explicativos completos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
