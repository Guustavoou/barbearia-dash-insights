import React, { useState, useEffect } from "react";
import {
  Settings,
  User,
  Shield,
  Bell,
  Calendar,
  Clock,
  Database,
  Monitor,
  Palette,
  Globe,
  Key,
  Lock,
  Save,
  RefreshCw,
  Upload,
  Download,
  Eye,
  EyeOff,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Building,
  Camera,
  Zap,
  Activity,
  FileText,
  CreditCard,
  Smartphone,
  Wifi,
  HardDrive,
  Server,
  UserCheck,
  ShieldCheck,
  Timer,
  Star,
  Heart,
  Briefcase,
  Home,
  Image,
  Video,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Sparkles,
  Target,
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar as CalendarIcon,
  MessageSquare,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Search,
  Filter,
  SortAsc,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CloudUpload,
  FileJson,
  Archive,
  CloudDownload,
  CircleCheck,
  CircleX,
  Info,
  Lightbulb,
  HelpCircle,
  Bookmark,
  Flag,
  Tag,
  Layers,
  Grid,
  List,
  MoreVertical,
  MoreHorizontal,
  Hash,
  AlignLeft,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { PageType } from "@/lib/types";

interface BeautifulSettingsImprovedProps {
  darkMode: boolean;
  onPageChange?: (page: PageType) => void;
}

interface BusinessProfile {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  description: string;
  logo: string;
  socialMedia: {
    instagram: string;
    facebook: string;
    whatsapp: string;
    website: string;
  };
}

interface WorkingHours {
  [key: string]: {
    enabled: boolean;
    start: string;
    end: string;
    breaks: Array<{ start: string; end: string; name: string }>;
  };
}

interface NotificationSettings {
  email: {
    enabled: boolean;
    newAppointments: boolean;
    cancellations: boolean;
    reminders: boolean;
    payments: boolean;
    marketing: boolean;
  };
  sms: {
    enabled: boolean;
    reminders: boolean;
    confirmations: boolean;
  };
  whatsapp: {
    enabled: boolean;
    reminders: boolean;
    confirmations: boolean;
    marketing: boolean;
  };
  push: {
    enabled: boolean;
    appointments: boolean;
    payments: boolean;
    updates: boolean;
  };
}

interface SecuritySettings {
  twoFactor: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordPolicy: {
    minLength: number;
    requireNumbers: boolean;
    requireSymbols: boolean;
    requireUppercase: boolean;
  };
  ipWhitelist: string[];
}

export const BeautifulSettingsImproved: React.FC<
  BeautifulSettingsImprovedProps
> = ({ darkMode, onPageChange }) => {
  const { toast } = useToast();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("business");
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "business-info",
  ]);

  // Estado das configurações
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    name: "Salão Premium Beauty",
    cnpj: "12.345.678/0001-90",
    email: "contato@salaopremium.com",
    phone: "(11) 99999-9999",
    website: "https://salaopremium.com",
    address: "Rua das Flores, 123",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
    description:
      "Salão de beleza premium especializado em cortes modernos e tratamentos de alta qualidade.",
    logo: "",
    socialMedia: {
      instagram: "@salaopremium",
      facebook: "salaopremium",
      whatsapp: "11999999999",
      website: "https://salaopremium.com",
    },
  });

  const [workingHours, setWorkingHours] = useState<WorkingHours>({
    monday: {
      enabled: true,
      start: "09:00",
      end: "18:00",
      breaks: [{ start: "12:00", end: "13:00", name: "Almoço" }],
    },
    tuesday: {
      enabled: true,
      start: "09:00",
      end: "18:00",
      breaks: [{ start: "12:00", end: "13:00", name: "Almoço" }],
    },
    wednesday: {
      enabled: true,
      start: "09:00",
      end: "18:00",
      breaks: [{ start: "12:00", end: "13:00", name: "Almoço" }],
    },
    thursday: {
      enabled: true,
      start: "09:00",
      end: "18:00",
      breaks: [{ start: "12:00", end: "13:00", name: "Almoço" }],
    },
    friday: {
      enabled: true,
      start: "09:00",
      end: "18:00",
      breaks: [{ start: "12:00", end: "13:00", name: "Almoço" }],
    },
    saturday: {
      enabled: true,
      start: "09:00",
      end: "17:00",
      breaks: [],
    },
    sunday: {
      enabled: false,
      start: "09:00",
      end: "17:00",
      breaks: [],
    },
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: {
      enabled: true,
      newAppointments: true,
      cancellations: true,
      reminders: true,
      payments: true,
      marketing: false,
    },
    sms: {
      enabled: false,
      reminders: true,
      confirmations: true,
    },
    whatsapp: {
      enabled: true,
      reminders: true,
      confirmations: true,
      marketing: false,
    },
    push: {
      enabled: true,
      appointments: true,
      payments: true,
      updates: false,
    },
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactor: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordPolicy: {
      minLength: 8,
      requireNumbers: true,
      requireSymbols: false,
      requireUppercase: true,
    },
    ipWhitelist: [],
  });

  const [appearance, setAppearance] = useState({
    theme: darkMode ? "dark" : "light",
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    currency: "BRL",
  });

  const [integrations, setIntegrations] = useState({
    apiKey: "sk_live_xxxxxxxxxxxxx",
    webhookUrl: "",
    googleCalendar: false,
    whatsappApi: false,
    paymentGateway: "stripe",
    analytics: true,
  });

  const [backup, setBackup] = useState({
    autoBackup: true,
    frequency: "daily",
    retentionDays: 30,
    lastBackup: new Date(Date.now() - 86400000), // 1 day ago
    backupHistory: [
      {
        date: new Date(Date.now() - 86400000),
        size: "2.5 MB",
        status: "success",
      },
      {
        date: new Date(Date.now() - 172800000),
        size: "2.3 MB",
        status: "success",
      },
      {
        date: new Date(Date.now() - 259200000),
        size: "2.4 MB",
        status: "success",
      },
    ],
  });

  const [system, setSystem] = useState({
    monitoring: true,
    debugMode: false,
    maintenanceMode: false,
    logLevel: "info",
    maxFileSize: 10,
    sessionTracking: true,
  });

  // Detectar mudanças
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [
    businessProfile,
    workingHours,
    notifications,
    security,
    appearance,
    integrations,
    backup,
    system,
  ]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simular salvamento
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Aqui seria feita a persistência real
      localStorage.setItem(
        "settingsData",
        JSON.stringify({
          businessProfile,
          workingHours,
          notifications,
          security,
          appearance,
          integrations,
          backup,
          system,
        }),
      );

      setHasUnsavedChanges(false);
      setLastUpdate(new Date());

      toast({
        title: "✅ Configurações Salvas",
        description: "Todas as alterações foram salvas com sucesso",
      });
    } catch (error) {
      toast({
        title: "❌ Erro ao Salvar",
        description: "Ocorreu um erro ao salvar as configurações",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    // Recarregar configurações do localStorage ou valores padrão
    setHasUnsavedChanges(false);
    toast({
      title: "Alterações Descartadas",
      description: "As alterações não salvas foram descartadas",
    });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsLoading(false);
      toast({
        title: "✨ Atualizado",
        description: "Configurações atualizadas com sucesso",
      });
    }, 1000);
  };

  const handleExportSettings = () => {
    const settingsData = {
      businessProfile,
      workingHours,
      notifications,
      security: { ...security, ipWhitelist: security.ipWhitelist },
      appearance,
      integrations: { ...integrations, apiKey: "***" }, // Mascarar dados sensíveis
      backup,
      system,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(settingsData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `configuracoes-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "📁 Configurações Exportadas",
      description: "Arquivo de configuração baixado com sucesso",
    });
  };

  const handleCopyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(integrations.apiKey);
      toast({
        title: "📋 API Key Copiada",
        description: "Chave da API copiada para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "❌ Erro ao Copiar",
        description: "Não foi possível copiar a API Key",
        variant: "destructive",
      });
    }
  };

  const handleBackupNow = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const newBackup = {
        date: new Date(),
        size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
        status: "success" as const,
      };

      setBackup((prev) => ({
        ...prev,
        lastBackup: new Date(),
        backupHistory: [newBackup, ...prev.backupHistory.slice(0, 4)],
      }));

      toast({
        title: "💾 Backup Concluído",
        description: "Backup manual criado com sucesso",
      });
    } catch (error) {
      toast({
        title: "❌ Erro no Backup",
        description: "Falha ao criar backup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  const dayNames = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo",
  };

  const tabConfig = [
    {
      id: "business",
      label: "Negócio",
      icon: Building,
      color: "from-blue-600 to-blue-700",
      description: "Informações do estabelecimento",
    },
    {
      id: "schedule",
      label: "Horários",
      icon: Clock,
      color: "from-blue-500 to-blue-600",
      description: "Funcionamento e agenda",
    },
    {
      id: "notifications",
      label: "Notificações",
      icon: Bell,
      color: "from-blue-700 to-blue-800",
      description: "Alertas e comunicações",
    },
    {
      id: "security",
      label: "Segurança",
      icon: Shield,
      color: "from-blue-800 to-[#00112F]",
      description: "Proteção e acesso",
    },
    {
      id: "appearance",
      label: "Aparência",
      icon: Palette,
      color: "from-[#00112F] to-blue-600",
      description: "Visual e idioma",
    },
    {
      id: "integrations",
      label: "Integrações",
      icon: Globe,
      color: "from-blue-600 to-blue-800",
      description: "APIs e conectores",
    },
    {
      id: "backup",
      label: "Backup",
      icon: Database,
      color: "from-blue-500 to-blue-700",
      description: "Proteção de dados",
    },
    {
      id: "system",
      label: "Sistema",
      icon: Monitor,
      color: "from-blue-700 to-blue-900",
      description: "Performance e logs",
    },
  ];

  const filteredTabs = tabConfig.filter(
    (tab) =>
      tab.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tab.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-blue-50/30 dark:from-[#0D1117] dark:via-[#0D1117] dark:to-blue-950/20">
      {/* Fixed Action Bar */}
      {hasUnsavedChanges && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 shadow-lg">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">
                Você tem alterações não salvas
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDiscard}
                className="text-white hover:bg-white/20"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Descartar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="bg-white text-orange-600 hover:bg-gray-100"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Agora
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className={cn("space-y-6 p-6", hasUnsavedChanges && "pt-20")}>
        {/* Premium Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00112F] via-blue-900 to-blue-800 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_70%)]" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-600/20 to-transparent rounded-full blur-2xl" />

          <div className="relative flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <Settings
                    className="w-10 h-10 text-blue-200 animate-spin"
                    style={{ animationDuration: "8s" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-20 animate-ping" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                    Configurações
                  </h1>
                  <p className="text-blue-200 text-lg mt-2 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Centro de controle completo do seu negócio
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-blue-200">Sistema Ativo</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-200">
                    Última atualização: {lastUpdate.toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Server className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-200">Versão 2.1.0</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <RefreshCw
                  className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")}
                />
                {isLoading ? "Atualizando..." : "Atualizar"}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                  >
                    <MoreVertical className="w-4 h-4 mr-2" />
                    Ações
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl"
                >
                  <DropdownMenuLabel>Gerenciamento</DropdownMenuLabel>
                  <DropdownMenuItem onClick={handleExportSettings}>
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Configurações
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleBackupNow}>
                    <Archive className="w-4 h-4 mr-2" />
                    Backup Manual
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Documentação
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={handleSave}
                disabled={isSaving || !hasUnsavedChanges}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-lg"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Tudo
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Quick Actions */}
        <div className="flex items-center justify-between space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar configurações..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0"
            >
              {filteredTabs.length} seções
            </Badge>
            {hasUnsavedChanges && (
              <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                Não salvo
              </Badge>
            )}
            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              Online
            </Badge>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          {/* Enhanced Tab List */}
          <div className="relative overflow-x-auto">
            <TabsList className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg p-2 pb-16 grid grid-cols-4 lg:grid-cols-8 gap-1 min-w-full">
              {filteredTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00112F] data-[state=active]:to-blue-600 data-[state=active]:text-white p-3 rounded-lg transition-all duration-300 group"
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <Icon className="w-5 h-5 group-data-[state=active]:animate-pulse" />
                      <span className="text-xs font-medium">{tab.label}</span>
                    </div>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" />
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Business Profile Tab */}
          <TabsContent value="business" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Business Information */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <Building className="w-6 h-6 mr-3 text-[#00112F] dark:text-blue-400" />
                    Informações do Negócio
                  </h3>
                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    Essencial
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="businessName"
                        className="text-[#00112F] dark:text-[#F9FAFB]"
                      >
                        Nome do Estabelecimento *
                      </Label>
                      <Input
                        id="businessName"
                        value={businessProfile.name}
                        onChange={(e) =>
                          setBusinessProfile({
                            ...businessProfile,
                            name: e.target.value,
                          })
                        }
                        className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="cnpj"
                        className="text-[#00112F] dark:text-[#F9FAFB]"
                      >
                        CNPJ
                      </Label>
                      <Input
                        id="cnpj"
                        value={businessProfile.cnpj}
                        onChange={(e) =>
                          setBusinessProfile({
                            ...businessProfile,
                            cnpj: e.target.value,
                          })
                        }
                        className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="email"
                        className="text-[#00112F] dark:text-[#F9FAFB] flex items-center"
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={businessProfile.email}
                        onChange={(e) =>
                          setBusinessProfile({
                            ...businessProfile,
                            email: e.target.value,
                          })
                        }
                        className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="phone"
                        className="text-[#00112F] dark:text-[#F9FAFB] flex items-center"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Telefone *
                      </Label>
                      <Input
                        id="phone"
                        value={businessProfile.phone}
                        onChange={(e) =>
                          setBusinessProfile({
                            ...businessProfile,
                            phone: e.target.value,
                          })
                        }
                        className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="address"
                      className="text-[#00112F] dark:text-[#F9FAFB] flex items-center"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      Endereço Completo
                    </Label>
                    <Input
                      id="address"
                      value={businessProfile.address}
                      onChange={(e) =>
                        setBusinessProfile({
                          ...businessProfile,
                          address: e.target.value,
                        })
                      }
                      className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label
                        htmlFor="city"
                        className="text-[#00112F] dark:text-[#F9FAFB]"
                      >
                        Cidade
                      </Label>
                      <Input
                        id="city"
                        value={businessProfile.city}
                        onChange={(e) =>
                          setBusinessProfile({
                            ...businessProfile,
                            city: e.target.value,
                          })
                        }
                        className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="state"
                        className="text-[#00112F] dark:text-[#F9FAFB]"
                      >
                        Estado
                      </Label>
                      <Input
                        id="state"
                        value={businessProfile.state}
                        onChange={(e) =>
                          setBusinessProfile({
                            ...businessProfile,
                            state: e.target.value,
                          })
                        }
                        className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="zipCode"
                        className="text-[#00112F] dark:text-[#F9FAFB]"
                      >
                        CEP
                      </Label>
                      <Input
                        id="zipCode"
                        value={businessProfile.zipCode}
                        onChange={(e) =>
                          setBusinessProfile({
                            ...businessProfile,
                            zipCode: e.target.value,
                          })
                        }
                        className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="description"
                      className="text-[#00112F] dark:text-[#F9FAFB]"
                    >
                      Descrição do Negócio
                    </Label>
                    <Textarea
                      id="description"
                      value={businessProfile.description}
                      onChange={(e) =>
                        setBusinessProfile({
                          ...businessProfile,
                          description: e.target.value,
                        })
                      }
                      className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      rows={3}
                    />
                  </div>
                </div>
              </Card>

              {/* Social Media & Branding */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <Heart className="w-6 h-6 mr-3 text-[#00112F] dark:text-blue-400" />
                    Redes Sociais & Marca
                  </h3>
                </div>

                <div className="space-y-6">
                  {/* Logo Upload */}
                  <div>
                    <Label className="text-[#00112F] dark:text-[#F9FAFB] flex items-center mb-3">
                      <Camera className="w-4 h-4 mr-2" />
                      Logo do Estabelecimento
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Arraste uma imagem ou{" "}
                        <span className="text-blue-600 cursor-pointer">
                          clique para selecionar
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG até 5MB
                      </p>
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                      Redes Sociais
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <Label
                          htmlFor="instagram"
                          className="text-[#00112F] dark:text-[#F9FAFB] flex items-center"
                        >
                          <Instagram className="w-4 h-4 mr-2 text-pink-500" />
                          Instagram
                        </Label>
                        <div className="flex mt-2">
                          <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-md">
                            @
                          </span>
                          <Input
                            id="instagram"
                            value={businessProfile.socialMedia.instagram}
                            onChange={(e) =>
                              setBusinessProfile({
                                ...businessProfile,
                                socialMedia: {
                                  ...businessProfile.socialMedia,
                                  instagram: e.target.value,
                                },
                              })
                            }
                            className="rounded-l-none bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                          />
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="facebook"
                          className="text-[#00112F] dark:text-[#F9FAFB] flex items-center"
                        >
                          <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                          Facebook
                        </Label>
                        <Input
                          id="facebook"
                          value={businessProfile.socialMedia.facebook}
                          onChange={(e) =>
                            setBusinessProfile({
                              ...businessProfile,
                              socialMedia: {
                                ...businessProfile.socialMedia,
                                facebook: e.target.value,
                              },
                            })
                          }
                          className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="whatsapp"
                          className="text-[#00112F] dark:text-[#F9FAFB] flex items-center"
                        >
                          <MessageSquare className="w-4 h-4 mr-2 text-green-500" />
                          WhatsApp Business
                        </Label>
                        <Input
                          id="whatsapp"
                          value={businessProfile.socialMedia.whatsapp}
                          onChange={(e) =>
                            setBusinessProfile({
                              ...businessProfile,
                              socialMedia: {
                                ...businessProfile.socialMedia,
                                whatsapp: e.target.value,
                              },
                            })
                          }
                          className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                          placeholder="5511999999999"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="website"
                          className="text-[#00112F] dark:text-[#F9FAFB] flex items-center"
                        >
                          <Globe className="w-4 h-4 mr-2 text-blue-500" />
                          Website
                        </Label>
                        <Input
                          id="website"
                          value={businessProfile.socialMedia.website}
                          onChange={(e) =>
                            setBusinessProfile({
                              ...businessProfile,
                              socialMedia: {
                                ...businessProfile.socialMedia,
                                website: e.target.value,
                              },
                            })
                          }
                          className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                          placeholder="https://seusite.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                  <Clock className="w-6 h-6 mr-3 text-[#00112F] dark:text-blue-400" />
                  Horários de Funcionamento
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-200 text-[#00112F] hover:bg-blue-50"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar para Todos
                </Button>
              </div>

              <div className="space-y-4">
                {Object.entries(workingHours).map(([day, schedule]) => (
                  <div
                    key={day}
                    className="p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={schedule.enabled}
                          onCheckedChange={(enabled) =>
                            setWorkingHours({
                              ...workingHours,
                              [day]: { ...schedule, enabled },
                            })
                          }
                        />
                        <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                          {dayNames[day as keyof typeof dayNames]}
                        </h4>
                      </div>
                      {schedule.enabled && (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-200"
                        >
                          Aberto
                        </Badge>
                      )}
                    </div>

                    {schedule.enabled && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <Label className="text-sm text-[#00112F] dark:text-[#F9FAFB]">
                            Abertura
                          </Label>
                          <Input
                            type="time"
                            value={schedule.start}
                            onChange={(e) =>
                              setWorkingHours({
                                ...workingHours,
                                [day]: { ...schedule, start: e.target.value },
                              })
                            }
                            className="mt-1 bg-white dark:bg-[#0D1117] border-0"
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-[#00112F] dark:text-[#F9FAFB]">
                            Fechamento
                          </Label>
                          <Input
                            type="time"
                            value={schedule.end}
                            onChange={(e) =>
                              setWorkingHours({
                                ...workingHours,
                                [day]: { ...schedule, end: e.target.value },
                              })
                            }
                            className="mt-1 bg-white dark:bg-[#0D1117] border-0"
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-[#00112F] dark:text-[#F9FAFB]">
                            Pausa Início
                          </Label>
                          <Input
                            type="time"
                            value={schedule.breaks[0]?.start || "12:00"}
                            onChange={(e) => {
                              const breaks = [...schedule.breaks];
                              if (breaks[0]) {
                                breaks[0].start = e.target.value;
                              } else {
                                breaks[0] = {
                                  start: e.target.value,
                                  end: "13:00",
                                  name: "Almoço",
                                };
                              }
                              setWorkingHours({
                                ...workingHours,
                                [day]: { ...schedule, breaks },
                              });
                            }}
                            className="mt-1 bg-white dark:bg-[#0D1117] border-0"
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-[#00112F] dark:text-[#F9FAFB]">
                            Pausa Fim
                          </Label>
                          <Input
                            type="time"
                            value={schedule.breaks[0]?.end || "13:00"}
                            onChange={(e) => {
                              const breaks = [...schedule.breaks];
                              if (breaks[0]) {
                                breaks[0].end = e.target.value;
                              } else {
                                breaks[0] = {
                                  start: "12:00",
                                  end: e.target.value,
                                  name: "Almoço",
                                };
                              }
                              setWorkingHours({
                                ...workingHours,
                                [day]: { ...schedule, breaks },
                              });
                            }}
                            className="mt-1 bg-white dark:bg-[#0D1117] border-0"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Email Notifications */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
                    Email
                  </h3>
                  <Switch
                    checked={notifications.email.enabled}
                    onCheckedChange={(enabled) =>
                      setNotifications({
                        ...notifications,
                        email: { ...notifications.email, enabled },
                      })
                    }
                  />
                </div>

                {notifications.email.enabled && (
                  <div className="space-y-4">
                    {[
                      {
                        key: "newAppointments",
                        label: "Novos Agendamentos",
                        icon: Calendar,
                      },
                      {
                        key: "cancellations",
                        label: "Cancelamentos",
                        icon: AlertTriangle,
                      },
                      { key: "reminders", label: "Lembretes", icon: Bell },
                      {
                        key: "payments",
                        label: "Pagamentos",
                        icon: CreditCard,
                      },
                      { key: "marketing", label: "Marketing", icon: Target },
                    ].map(({ key, label, icon: Icon }) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-4 h-4 text-blue-500" />
                          <span className="text-[#00112F] dark:text-[#F9FAFB]">
                            {label}
                          </span>
                        </div>
                        <Switch
                          checked={
                            notifications.email[
                              key as keyof typeof notifications.email
                            ] as boolean
                          }
                          onCheckedChange={(checked) =>
                            setNotifications({
                              ...notifications,
                              email: { ...notifications.email, [key]: checked },
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* WhatsApp Notifications */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-green-500" />
                    WhatsApp
                  </h3>
                  <Switch
                    checked={notifications.whatsapp.enabled}
                    onCheckedChange={(enabled) =>
                      setNotifications({
                        ...notifications,
                        whatsapp: { ...notifications.whatsapp, enabled },
                      })
                    }
                  />
                </div>

                {notifications.whatsapp.enabled && (
                  <div className="space-y-4">
                    {[
                      {
                        key: "reminders",
                        label: "Lembretes de Agendamento",
                        icon: Bell,
                      },
                      {
                        key: "confirmations",
                        label: "Confirmações",
                        icon: CheckCircle,
                      },
                      {
                        key: "marketing",
                        label: "Campanhas de Marketing",
                        icon: Target,
                      },
                    ].map(({ key, label, icon: Icon }) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-4 h-4 text-green-500" />
                          <span className="text-[#00112F] dark:text-[#F9FAFB]">
                            {label}
                          </span>
                        </div>
                        <Switch
                          checked={
                            notifications.whatsapp[
                              key as keyof typeof notifications.whatsapp
                            ] as boolean
                          }
                          onCheckedChange={(checked) =>
                            setNotifications({
                              ...notifications,
                              whatsapp: {
                                ...notifications.whatsapp,
                                [key]: checked,
                              },
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* SMS Notifications */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <Smartphone className="w-5 h-5 mr-2 text-blue-500" />
                    SMS
                  </h3>
                  <Switch
                    checked={notifications.sms.enabled}
                    onCheckedChange={(enabled) =>
                      setNotifications({
                        ...notifications,
                        sms: { ...notifications.sms, enabled },
                      })
                    }
                  />
                </div>

                {notifications.sms.enabled && (
                  <div className="space-y-4">
                    {[
                      { key: "reminders", label: "Lembretes", icon: Bell },
                      {
                        key: "confirmations",
                        label: "Confirmações",
                        icon: CheckCircle,
                      },
                    ].map(({ key, label, icon: Icon }) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-4 h-4 text-blue-500" />
                          <span className="text-[#00112F] dark:text-[#F9FAFB]">
                            {label}
                          </span>
                        </div>
                        <Switch
                          checked={
                            notifications.sms[
                              key as keyof typeof notifications.sms
                            ] as boolean
                          }
                          onCheckedChange={(checked) =>
                            setNotifications({
                              ...notifications,
                              sms: { ...notifications.sms, [key]: checked },
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Push Notifications */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-orange-500" />
                    Push
                  </h3>
                  <Switch
                    checked={notifications.push.enabled}
                    onCheckedChange={(enabled) =>
                      setNotifications({
                        ...notifications,
                        push: { ...notifications.push, enabled },
                      })
                    }
                  />
                </div>

                {notifications.push.enabled && (
                  <div className="space-y-4">
                    {[
                      {
                        key: "appointments",
                        label: "Agendamentos",
                        icon: Calendar,
                      },
                      {
                        key: "payments",
                        label: "Pagamentos",
                        icon: CreditCard,
                      },
                      {
                        key: "updates",
                        label: "Atualizações do Sistema",
                        icon: Download,
                      },
                    ].map(({ key, label, icon: Icon }) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-4 h-4 text-orange-500" />
                          <span className="text-[#00112F] dark:text-[#F9FAFB]">
                            {label}
                          </span>
                        </div>
                        <Switch
                          checked={
                            notifications.push[
                              key as keyof typeof notifications.push
                            ] as boolean
                          }
                          onCheckedChange={(checked) =>
                            setNotifications({
                              ...notifications,
                              push: { ...notifications.push, [key]: checked },
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Authentication */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <ShieldCheck className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
                    Autenticação
                  </h3>
                  <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    Seguro
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                    <div>
                      <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                        Autenticação de Dois Fatores
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Camada extra de proteção para sua conta
                      </p>
                    </div>
                    <Switch
                      checked={security.twoFactor}
                      onCheckedChange={(twoFactor) =>
                        setSecurity({ ...security, twoFactor })
                      }
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                    <Label className="text-[#00112F] dark:text-[#F9FAFB] flex items-center mb-2">
                      <Timer className="w-4 h-4 mr-2" />
                      Tempo Limite da Sessão (minutos)
                    </Label>
                    <Input
                      type="number"
                      value={security.sessionTimeout}
                      onChange={(e) =>
                        setSecurity({
                          ...security,
                          sessionTimeout: parseInt(e.target.value) || 30,
                        })
                      }
                      className="bg-white dark:bg-[#0D1117] border-0"
                      min="5"
                      max="240"
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                    <Label className="text-[#00112F] dark:text-[#F9FAFB] flex items-center mb-2">
                      <Lock className="w-4 h-4 mr-2" />
                      Máximo de Tentativas de Login
                    </Label>
                    <Input
                      type="number"
                      value={security.maxLoginAttempts}
                      onChange={(e) =>
                        setSecurity({
                          ...security,
                          maxLoginAttempts: parseInt(e.target.value) || 5,
                        })
                      }
                      className="bg-white dark:bg-[#0D1117] border-0"
                      min="3"
                      max="10"
                    />
                  </div>
                </div>
              </Card>

              {/* Password Policy */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <Key className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
                    Política de Senhas
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                    <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-2 block">
                      Comprimento Mínimo
                    </Label>
                    <Input
                      type="number"
                      value={security.passwordPolicy.minLength}
                      onChange={(e) =>
                        setSecurity({
                          ...security,
                          passwordPolicy: {
                            ...security.passwordPolicy,
                            minLength: parseInt(e.target.value) || 8,
                          },
                        })
                      }
                      className="bg-white dark:bg-[#0D1117] border-0"
                      min="6"
                      max="32"
                    />
                  </div>

                  {[
                    {
                      key: "requireNumbers",
                      label: "Exigir Números",
                      icon: Hash,
                    },
                    {
                      key: "requireSymbols",
                      label: "Exigir Símbolos",
                      icon: Star,
                    },
                    {
                      key: "requireUppercase",
                      label: "Exigir Maiúsculas",
                      icon: AlignLeft,
                    },
                  ].map(({ key, label, icon: Icon }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-[#00112F] dark:text-[#F9FAFB]">
                          {label}
                        </span>
                      </div>
                      <Switch
                        checked={
                          security.passwordPolicy[
                            key as keyof typeof security.passwordPolicy
                          ] as boolean
                        }
                        onCheckedChange={(checked) =>
                          setSecurity({
                            ...security,
                            passwordPolicy: {
                              ...security.passwordPolicy,
                              [key]: checked,
                            },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Theme Settings */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <Palette className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
                    Tema Visual
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-3 block">
                      Modo de Exibição
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() =>
                          setAppearance({ ...appearance, theme: "light" })
                        }
                        className={cn(
                          "p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center space-y-2",
                          appearance.theme === "light"
                            ? "border-[#00112F] bg-[#00112F] text-white"
                            : "border-gray-300 dark:border-gray-600 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 text-[#00112F] dark:text-[#F9FAFB] hover:border-blue-300",
                        )}
                      >
                        <Monitor className="w-6 h-6" />
                        <span className="font-medium">Claro</span>
                        <span className="text-xs opacity-70">Modo diurno</span>
                      </button>
                      <button
                        onClick={() =>
                          setAppearance({ ...appearance, theme: "dark" })
                        }
                        className={cn(
                          "p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center space-y-2",
                          appearance.theme === "dark"
                            ? "border-[#00112F] bg-[#00112F] text-white"
                            : "border-gray-300 dark:border-gray-600 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 text-[#00112F] dark:text-[#F9FAFB] hover:border-blue-300",
                        )}
                      >
                        <Smartphone className="w-6 h-6" />
                        <span className="font-medium">Escuro</span>
                        <span className="text-xs opacity-70">Modo noturno</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Regional Settings */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
                    Regionalização
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-2 block">
                      Idioma
                    </Label>
                    <Select
                      value={appearance.language}
                      onValueChange={(language) =>
                        setAppearance({ ...appearance, language })
                      }
                    >
                      <SelectTrigger className="bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">
                          🇧🇷 Português (Brasil)
                        </SelectItem>
                        <SelectItem value="en-US">🇺🇸 English (US)</SelectItem>
                        <SelectItem value="es-ES">🇪🇸 Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-2 block">
                      Fuso Horário
                    </Label>
                    <Select
                      value={appearance.timezone}
                      onValueChange={(timezone) =>
                        setAppearance({ ...appearance, timezone })
                      }
                    >
                      <SelectTrigger className="bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Sao_Paulo">
                          São Paulo (GMT-3)
                        </SelectItem>
                        <SelectItem value="America/New_York">
                          New York (GMT-5)
                        </SelectItem>
                        <SelectItem value="Europe/London">
                          London (GMT+0)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-2 block">
                      Formato de Data
                    </Label>
                    <Select
                      value={appearance.dateFormat}
                      onValueChange={(dateFormat) =>
                        setAppearance({ ...appearance, dateFormat })
                      }
                    >
                      <SelectTrigger className="bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/AAAA</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/AAAA</SelectItem>
                        <SelectItem value="YYYY-MM-DD">AAAA-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-2 block">
                      Formato de Hora
                    </Label>
                    <Select
                      value={appearance.timeFormat}
                      onValueChange={(timeFormat) =>
                        setAppearance({ ...appearance, timeFormat })
                      }
                    >
                      <SelectTrigger className="bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">24 horas (15:30)</SelectItem>
                        <SelectItem value="12h">12 horas (3:30 PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-2 block">
                      Moeda
                    </Label>
                    <Select
                      value={appearance.currency}
                      onValueChange={(currency) =>
                        setAppearance({ ...appearance, currency })
                      }
                    >
                      <SelectTrigger className="bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRL">Real (R$)</SelectItem>
                        <SelectItem value="USD">Dólar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* API Configuration */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <Key className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
                    Configuração da API
                  </h3>
                  <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    Ativo
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-2 block">
                      API Key
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={integrations.apiKey}
                        onChange={(e) =>
                          setIntegrations({
                            ...integrations,
                            apiKey: e.target.value,
                          })
                        }
                        className="flex-1 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 hover:text-[#00112F]"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyApiKey}
                        className="text-gray-500 hover:text-[#00112F]"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-2 block">
                      Webhook URL
                    </Label>
                    <Input
                      value={integrations.webhookUrl}
                      onChange={(e) =>
                        setIntegrations({
                          ...integrations,
                          webhookUrl: e.target.value,
                        })
                      }
                      placeholder="https://sua-api.com/webhook"
                      className="bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                    />
                  </div>

                  <div>
                    <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-2 block">
                      Gateway de Pagamento
                    </Label>
                    <Select
                      value={integrations.paymentGateway}
                      onValueChange={(paymentGateway) =>
                        setIntegrations({ ...integrations, paymentGateway })
                      }
                    >
                      <SelectTrigger className="bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="mercadopago">
                          Mercado Pago
                        </SelectItem>
                        <SelectItem value="pagseguro">PagSeguro</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              {/* External Services */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
                    Serviços Externos
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      key: "googleCalendar",
                      label: "Google Calendar",
                      description: "Sincronizar agendamentos",
                      icon: Calendar,
                      color: "text-red-500",
                    },
                    {
                      key: "whatsappApi",
                      label: "WhatsApp Business API",
                      description: "Envio automático de mensagens",
                      icon: MessageSquare,
                      color: "text-green-500",
                    },
                    {
                      key: "analytics",
                      label: "Google Analytics",
                      description: "Tracking de performance",
                      icon: BarChart3,
                      color: "text-blue-500",
                    },
                  ].map(({ key, label, description, icon: Icon, color }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={cn("w-5 h-5", color)} />
                        <div>
                          <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                            {label}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {description}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={
                          integrations[
                            key as keyof typeof integrations
                          ] as boolean
                        }
                        onCheckedChange={(checked) =>
                          setIntegrations({ ...integrations, [key]: checked })
                        }
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Backup Tab */}
          <TabsContent value="backup" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Backup Configuration */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <Database className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
                    Configuração de Backup
                  </h3>
                  <Switch
                    checked={backup.autoBackup}
                    onCheckedChange={(autoBackup) =>
                      setBackup({ ...backup, autoBackup })
                    }
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                    <div>
                      <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                        Backup Automático
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Executa backup automaticamente conforme frequência
                      </p>
                    </div>
                    <Switch
                      checked={backup.autoBackup}
                      onCheckedChange={(autoBackup) =>
                        setBackup({ ...backup, autoBackup })
                      }
                    />
                  </div>

                  {backup.autoBackup && (
                    <>
                      <div>
                        <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-2 block">
                          Frequência
                        </Label>
                        <Select
                          value={backup.frequency}
                          onValueChange={(frequency) =>
                            setBackup({ ...backup, frequency })
                          }
                        >
                          <SelectTrigger className="bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">A cada hora</SelectItem>
                            <SelectItem value="daily">Diário</SelectItem>
                            <SelectItem value="weekly">Semanal</SelectItem>
                            <SelectItem value="monthly">Mensal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-2 block">
                          Retenção (dias)
                        </Label>
                        <Input
                          type="number"
                          value={backup.retentionDays}
                          onChange={(e) =>
                            setBackup({
                              ...backup,
                              retentionDays: parseInt(e.target.value) || 30,
                            })
                          }
                          className="bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                          min="1"
                          max="365"
                        />
                      </div>
                    </>
                  )}

                  <div className="pt-4">
                    <Button
                      onClick={handleBackupNow}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#00112F] to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Criando Backup...
                        </>
                      ) : (
                        <>
                          <CloudUpload className="w-4 h-4 mr-2" />
                          Criar Backup Agora
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Backup History */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
                    Histórico de Backups
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-blue-600 border-blue-200"
                  >
                    {backup.backupHistory.length} backups
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800 dark:text-green-300">
                          Último Backup
                        </span>
                      </div>
                      <Badge className="bg-green-500 text-white text-xs">
                        {backup.lastBackup.toLocaleDateString()}
                      </Badge>
                    </div>
                    <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                      {backup.lastBackup.toLocaleString()}
                    </p>
                  </div>

                  {backup.backupHistory.map((backupItem, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CircleCheck className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-[#00112F] dark:text-[#F9FAFB]">
                            {backupItem.date.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {backupItem.size}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <CloudDownload className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {backupItem.date.toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Monitoring */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
                    Monitoramento
                  </h3>
                  <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    Online
                  </Badge>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      key: "monitoring",
                      label: "Monitoramento Ativo",
                      description: "Monitorar performance do sistema",
                    },
                    {
                      key: "sessionTracking",
                      label: "Tracking de Sessões",
                      description: "Rastrear sessões de usuários",
                    },
                  ].map(({ key, label, description }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20"
                    >
                      <div>
                        <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                          {label}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {description}
                        </p>
                      </div>
                      <Switch
                        checked={system[key as keyof typeof system] as boolean}
                        onCheckedChange={(checked) =>
                          setSystem({ ...system, [key]: checked })
                        }
                      />
                    </div>
                  ))}

                  <div className="p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                    <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-2 block">
                      Nível de Log
                    </Label>
                    <Select
                      value={system.logLevel}
                      onValueChange={(logLevel) =>
                        setSystem({ ...system, logLevel })
                      }
                    >
                      <SelectTrigger className="bg-white dark:bg-[#0D1117] border-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="warn">Warning</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                    <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-2 block">
                      Tamanho Máximo de Arquivo (MB)
                    </Label>
                    <Input
                      type="number"
                      value={system.maxFileSize}
                      onChange={(e) =>
                        setSystem({
                          ...system,
                          maxFileSize: parseInt(e.target.value) || 10,
                        })
                      }
                      className="bg-white dark:bg-[#0D1117] border-0"
                      min="1"
                      max="100"
                    />
                  </div>
                </div>
              </Card>

              {/* System Tools */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <Server className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
                    Ferramentas do Sistema
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-700">
                    <div>
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-300">
                        Modo de Manutenção
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-400">
                        Bloquear acesso temporariamente
                      </p>
                    </div>
                    <Switch
                      checked={system.maintenanceMode}
                      onCheckedChange={(maintenanceMode) =>
                        setSystem({ ...system, maintenanceMode })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                    <div>
                      <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                        Modo Debug
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Habilitar logs detalhados
                      </p>
                    </div>
                    <Switch
                      checked={system.debugMode}
                      onCheckedChange={(debugMode) =>
                        setSystem({ ...system, debugMode })
                      }
                    />
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-blue-200 text-[#00112F] hover:bg-blue-50"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Visualizar Logs do Sistema
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start border-blue-200 text-[#00112F] hover:bg-blue-50"
                    >
                      <HardDrive className="w-4 h-4 mr-2" />
                      Verificar Integridade dos Dados
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start border-blue-200 text-[#00112F] hover:bg-blue-50"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Limpar Cache do Sistema
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
