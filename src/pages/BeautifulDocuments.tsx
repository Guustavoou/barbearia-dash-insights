import React, { useState } from "react";
import {
  FileText,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  RefreshCw,
  FolderOpen,
  Lock,
  Unlock,
  Calendar,
  User,
  File,
  Image,
  FileVideo,
  Share2,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Target,
  Activity,
} from "lucide-react";
import { cn, formatDate, formatCurrency } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { PageType } from "@/lib/types";

interface BeautifulDocumentsProps {
  darkMode: boolean;
  onPageChange?: (page: PageType) => void;
}

interface Document {
  id: string;
  name: string;
  type: "contract" | "receipt" | "report" | "image" | "video" | "other";
  size: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  status: "active" | "archived" | "draft";
  category: string;
  isPrivate: boolean;
  tags: string[];
}

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  period: string;
  icon: React.ElementType;
  color?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  period,
  icon: Icon,
  color = "from-[#00112F] to-blue-700",
}) => (
  <Card className="group relative overflow-hidden bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
    <div
      className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
    />
    <div className="relative p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change !== undefined && (
          <Badge
            variant={change >= 0 ? "default" : "destructive"}
            className={cn(
              "text-xs font-medium px-2 py-1",
              change >= 0
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            )}
          >
            {change >= 0 ? "+" : ""}
            {change}%
          </Badge>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-2xl text-[#00112F] dark:text-[#F9FAFB] group-hover:scale-105 transition-transform duration-300">
          {value}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 font-medium">{title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-500">{period}</p>
      </div>
    </div>
  </Card>
);

export const BeautifulDocuments: React.FC<BeautifulDocumentsProps> = ({
  darkMode,
  onPageChange,
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for documents
  const documents: Document[] = [
    {
      id: "1",
      name: "Contrato de Serviços - João Silva",
      type: "contract",
      size: "2.3 MB",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
      created_by: "Maria Santos",
      status: "active",
      category: "Contratos",
      isPrivate: false,
      tags: ["contrato", "cliente", "serviços"],
    },
    {
      id: "2",
      name: "Recibo Pagamento - Ana Costa",
      type: "receipt",
      size: "1.2 MB",
      created_at: "2024-01-14T14:30:00Z",
      updated_at: "2024-01-14T14:30:00Z",
      created_by: "Carlos Oliveira",
      status: "active",
      category: "Financeiro",
      isPrivate: true,
      tags: ["recibo", "pagamento", "cliente"],
    },
    {
      id: "3",
      name: "Relatório Mensal Janeiro",
      type: "report",
      size: "5.7 MB",
      created_at: "2024-01-31T18:00:00Z",
      updated_at: "2024-01-31T18:00:00Z",
      created_by: "Admin",
      status: "active",
      category: "Relatórios",
      isPrivate: false,
      tags: ["relatório", "mensal", "janeiro"],
    },
    {
      id: "4",
      name: "Fotos do Salão",
      type: "image",
      size: "8.1 MB",
      created_at: "2024-01-10T09:15:00Z",
      updated_at: "2024-01-10T09:15:00Z",
      created_by: "Maria Santos",
      status: "active",
      category: "Marketing",
      isPrivate: false,
      tags: ["fotos", "salão", "marketing"],
    },
    {
      id: "5",
      name: "Documentos Fiscais",
      type: "other",
      size: "3.4 MB",
      created_at: "2024-01-05T16:20:00Z",
      updated_at: "2024-01-05T16:20:00Z",
      created_by: "Admin",
      status: "archived",
      category: "Fiscal",
      isPrivate: true,
      tags: ["fiscal", "documentos", "arquivo"],
    },
  ];

  const categories = [
    "todos",
    ...Array.from(new Set(documents.map((doc) => doc.category))),
  ];

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesCategory =
      selectedCategory === "todos" || doc.category === selectedCategory;
    const matchesStatus =
      statusFilter === "todos" || doc.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getFileIcon = (type: Document["type"]) => {
    switch (type) {
      case "contract":
        return FileText;
      case "receipt":
        return FileText;
      case "report":
        return File;
      case "image":
        return Image;
      case "video":
        return FileVideo;
      default:
        return File;
    }
  };

  const getStatusColor = (status: Document["status"]) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "archived":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
      case "draft":
        return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsLoading(false);
      toast({
        title: "✨ Dados Atualizados",
        description: "Lista de documentos atualizada com sucesso",
      });
    }, 1000);
  };

  const handleUpload = () => {
    toast({
      title: "📄 Upload de Documento",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const handleDownload = (docName: string) => {
    toast({
      title: "⬇️ Download Iniciado",
      description: `Baixando ${docName}...`,
    });
  };

  const handleEdit = (docName: string) => {
    toast({
      title: "✏️ Editar Documento",
      description: `Editando ${docName}...`,
    });
  };

  const handleDelete = (docName: string) => {
    toast({
      title: "🗑️ Documento Removido",
      description: `${docName} foi removido com sucesso`,
    });
  };

  // KPI calculations
  const totalDocuments = documents.length;
  const activeDocuments = documents.filter(
    (doc) => doc.status === "active",
  ).length;
  const privateDocuments = documents.filter((doc) => doc.isPrivate).length;
  const totalSize = documents.reduce((sum, doc) => {
    const size = parseFloat(doc.size.replace(" MB", ""));
    return sum + size;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-blue-50/30 dark:from-[#0D1117] dark:via-[#0D1117] dark:to-blue-950/20 space-y-6 p-6">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-[#00112F]/10 to-blue-600/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/3 right-10 w-24 h-24 bg-gradient-to-br from-blue-600/10 to-[#00112F]/10 rounded-full blur-lg animate-pulse delay-1000" />
        <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-gradient-to-br from-[#00112F]/5 to-blue-700/5 rounded-full blur-2xl animate-pulse delay-2000" />

        {/* Sparkle Elements */}
        {[...Array(6)].map((_, i) => (
          <Sparkles
            key={i}
            className={cn(
              "absolute w-6 h-6 text-[#00112F]/20 dark:text-blue-400/20 animate-pulse",
              i === 0 && "top-1/4 left-1/4 delay-0",
              i === 1 && "top-3/4 right-1/4 delay-1000",
              i === 2 && "top-1/2 left-3/4 delay-2000",
              i === 3 && "bottom-1/4 left-1/2 delay-3000",
              i === 4 && "top-1/3 right-1/3 delay-4000",
              i === 5 && "bottom-1/3 left-1/5 delay-5000",
            )}
          />
        ))}
      </div>

      <div className="relative z-10 p-6 md:p-8 lg:p-12">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl rounded-2xl border-0 shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00112F] via-blue-900 to-blue-800 opacity-95" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      Documentos
                    </h1>
                    <p className="text-blue-100">
                      Gerencie todos os documentos do seu negócio
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={handleRefreshData}
                    disabled={isLoading}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm transition-all duration-300"
                  >
                    <RefreshCw
                      className={cn(
                        "w-4 h-4 mr-2",
                        isLoading && "animate-spin",
                      )}
                    />
                    Atualizar
                  </Button>
                  <Button
                    onClick={handleUpload}
                    className="bg-white hover:bg-blue-50 text-[#00112F] shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
              <div className="text-sm text-blue-100">
                Última atualização: {formatDate(lastUpdate)} às{" "}
                {lastUpdate.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total de Documentos"
            value={totalDocuments}
            change={12}
            period="Este mês"
            icon={FileText}
            color="from-[#00112F] to-blue-700"
          />
          <KPICard
            title="Documentos Ativos"
            value={activeDocuments}
            change={8}
            period="Este mês"
            icon={CheckCircle}
            color="from-blue-600 to-blue-800"
          />
          <KPICard
            title="Documentos Privados"
            value={privateDocuments}
            period="Total"
            icon={Lock}
            color="from-slate-600 to-slate-700"
          />
          <KPICard
            title="Espaço Utilizado"
            value={`${totalSize.toFixed(1)} MB`}
            period="Total"
            icon={Activity}
            color="from-gray-600 to-gray-700"
          />
        </div>

        {/* Filters and Search */}
        <Card className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl mb-8">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Buscar documentos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 dark:bg-[#0D1117]/50 border-gray-200 dark:border-gray-700 focus:border-[#00112F] dark:focus:border-blue-400"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/50 dark:bg-[#0D1117]/50 border border-gray-200 dark:border-gray-700 text-[#00112F] dark:text-[#F9FAFB] focus:outline-none focus:border-[#00112F] dark:focus:border-blue-400"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "todos" ? "Todas as categorias" : category}
                    </option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/50 dark:bg-[#0D1117]/50 border border-gray-200 dark:border-gray-700 text-[#00112F] dark:text-[#F9FAFB] focus:outline-none focus:border-[#00112F] dark:focus:border-blue-400"
                >
                  <option value="todos">Todos os status</option>
                  <option value="active">Ativo</option>
                  <option value="archived">Arquivado</option>
                  <option value="draft">Rascunho</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => {
            const FileIcon = getFileIcon(document.type);
            return (
              <Card
                key={document.id}
                className="group bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-gradient-to-br from-[#00112F] to-blue-700 rounded-xl shadow-lg">
                        <FileIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <Badge className={getStatusColor(document.status)}>
                          {document.status === "active"
                            ? "Ativo"
                            : document.status === "archived"
                              ? "Arquivado"
                              : "Rascunho"}
                        </Badge>
                        {document.isPrivate && (
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Lock className="w-3 h-3 mr-1" />
                            Privado
                          </div>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Filter className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDownload(document.name)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEdit(document.name)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="w-4 h-4 mr-2" />
                          Compartilhar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(document.name)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#00112F] dark:text-[#F9FAFB] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {document.name}
                    </h3>

                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{document.size}</span>
                      <span>{document.category}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <User className="w-3 h-3 mr-1" />
                        {document.created_by}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        {document.created_at
                          ? formatDate(document.created_at)
                          : "Data não informada"}
                      </div>
                    </div>

                    {document.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {document.tags.slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {document.tags.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-1 bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700"
                          >
                            +{document.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredDocuments.length === 0 && (
          <Card className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl">
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB] mb-2">
                Nenhum documento encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Ajuste os filtros ou faça upload de novos documentos
              </p>
              <Button
                onClick={handleUpload}
                className="bg-gradient-to-r from-[#00112F] to-blue-700 hover:from-blue-700 hover:to-[#00112F] text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Upload className="w-4 h-4 mr-2" />
                Fazer Upload
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
