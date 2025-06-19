import React, { useState, useEffect, useCallback } from "react";
import {
  Settings,
  User,
  Shield,
  Bell,
  Calendar,
  Scissors,
  Users,
  DollarSign,
  MessageCircle,
  Link,
  Lock,
  Database,
  Monitor,
  MoreHorizontal,
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
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Camera,
  Palette,
  Zap,
  Target,
  Activity,
  FileText,
  CreditCard,
  Smartphone,
  Wifi,
  HardDrive,
  Server,
  Key,
  UserCheck,
  ShieldCheck,
  Timer,
  Package,
  Star,
  Heart,
  Briefcase,
  Home,
  Building,
  Image,
  Video,
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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { PageType } from "@/lib/types";

interface BeautifulSettingsAdvancedProps {
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
  banner: string;
  socialMedia: {
    instagram: string;
    facebook: string;
    whatsapp: string;
    linkedin: string;
  };
}

interface AppointmentSettings {
  allowOnlineBooking: boolean;
  requireConfirmation: boolean;
  enableWaitingList: boolean;
  overbookingLimit: number;
  cancellationPolicy: string;
  reschedulePolicy: string;
  reminderHours: number[];
  customFields: Array<{ name: string; type: string; required: boolean }>;
  paymentMethods: string[];
  autoConfirmation: boolean;
}

interface WorkingHours {
  [key: string]: {
    isOpen: boolean;
    openTime: string;
    closeTime: string;
    breakStart?: string;
    breakEnd?: string;
  };
}

interface SecuritySettings {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
    maxAge: number;
  };
  loginAttempts: {
    maxAttempts: number;
    lockoutDuration: number;
  };
  ipWhitelist: string[];
  twoFactorAuth: boolean;
  sessionTimeout: number;
  auditLog: boolean;
}

export default function BeautifulSettingsAdvanced({
  darkMode,
  onPageChange,
}: BeautifulSettingsAdvancedProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());

  // Business Profile State
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    name: "Salão Premium",
    cnpj: "12.345.678/0001-90",
    email: "contato@salaopremium.com",
    phone: "(11) 99999-9999",
    website: "www.salaopremium.com",
    address: "Rua das Flores, 123",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
    description: "Salão de beleza premium com os melhores profissionais",
    logo: "",
    banner: "",
    socialMedia: {
      instagram: "@salaopremium",
      facebook: "salaopremium",
      whatsapp: "5511999999999",
      linkedin: "salaopremium",
    },
  });

  // Appointment Settings State
  const [appointmentSettings, setAppointmentSettings] =
    useState<AppointmentSettings>({
      allowOnlineBooking: true,
      requireConfirmation: true,
      enableWaitingList: true,
      overbookingLimit: 2,
      cancellationPolicy: "24h",
      reschedulePolicy: "12h",
      reminderHours: [24, 2],
      customFields: [
        { name: "Observações", type: "text", required: false },
        { name: "Primeira vez?", type: "boolean", required: true },
      ],
      paymentMethods: ["pix", "card", "cash"],
      autoConfirmation: false,
    });

  // Working Hours State
  const [workingHours, setWorkingHours] = useState<WorkingHours>({
    monday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
    tuesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
    wednesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
    thursday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
    friday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
    saturday: { isOpen: true, openTime: "09:00", closeTime: "16:00" },
    sunday: { isOpen: false, openTime: "09:00", closeTime: "16:00" },
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: false,
      maxAge: 90,
    },
    loginAttempts: {
      maxAttempts: 5,
      lockoutDuration: 30,
    },
    ipWhitelist: [],
    twoFactorAuth: false,
    sessionTimeout: 30,
    auditLog: true,
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      enabled: true,
      newAppointment: true,
      cancellation: true,
      reminder: true,
      marketing: false,
    },
    sms: {
      enabled: false,
      newAppointment: false,
      cancellation: true,
      reminder: true,
      marketing: false,
    },
    whatsapp: {
      enabled: true,
      newAppointment: true,
      cancellation: true,
      reminder: true,
      marketing: true,
    },
    push: {
      enabled: true,
      newAppointment: true,
      cancellation: true,
      reminder: true,
    },
  });

  // Financial Settings State
  const [financialSettings, setFinancialSettings] = useState({
    currency: "BRL",
    taxRate: 18.5,
    commission: {
      type: "percentage",
      value: 30,
      tiers: [
        { min: 0, max: 1000, rate: 25 },
        { min: 1001, max: 5000, rate: 30 },
        { min: 5001, max: -1, rate: 35 },
      ],
    },
    paymentMethods: {
      pix: { enabled: true, fee: 0 },
      credit: { enabled: true, fee: 3.5 },
      debit: { enabled: true, fee: 1.5 },
      cash: { enabled: true, fee: 0 },
    },
    budgetAlerts: true,
    monthlyBudget: 50000,
  });

  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: 365,
    maintenanceMode: false,
    debugMode: false,
    systemAlerts: true,
    performanceMonitoring: true,
    errorTracking: true,
  });

  const tabsConfig = [
    {
      id: "profile",
      label: "Perfil do Negócio",
      icon: Building,
      color: "from-[#00112F] to-blue-600",
    },
    {
      id: "appointments",
      label: "Agendamentos",
      icon: Calendar,
      color: "from-blue-600 to-blue-800",
    },
    {
      id: "hours",
      label: "Horários",
      icon: Clock,
      color: "from-blue-700 to-blue-900",
    },
    {
      id: "services",
      label: "Serviços",
      icon: Scissors,
      color: "from-blue-500 to-blue-700",
    },
    {
      id: "staff",
      label: "Funcionários",
      icon: Users,
      color: "from-blue-800 to-[#00112F]",
    },
    {
      id: "financial",
      label: "Financeiro",
      icon: DollarSign,
      color: "from-[#00112F] to-blue-600",
    },
    {
      id: "notifications",
      label: "Notificações",
      icon: Bell,
      color: "from-blue-600 to-blue-800",
    },
    {
      id: "integrations",
      label: "Integrações",
      icon: Link,
      color: "from-blue-700 to-blue-900",
    },
    {
      id: "permissions",
      label: "Permissões",
      icon: UserCheck,
      color: "from-blue-500 to-blue-700",
    },
    {
      id: "security",
      label: "Segurança",
      icon: Shield,
      color: "from-blue-800 to-[#00112F]",
    },
    {
      id: "backup",
      label: "Backup",
      icon: Database,
      color: "from-[#00112F] to-blue-600",
    },
    {
      id: "system",
      label: "Sistema",
      icon: Monitor,
      color: "from-blue-600 to-blue-800",
    },
    {
      id: "others",
      label: "Outros",
      icon: MoreHorizontal,
      color: "from-blue-700 to-blue-900",
    },
  ];

  const handleSaveSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setLastSaved(new Date());
      setHasChanges(false);

      toast({
        title: "✅ Configurações Salvas",
        description: "Todas as alterações foram aplicadas com sucesso",
      });
    } catch (error) {
      toast({
        title: "❌ Erro ao Salvar",
        description:
          "Não foi possível salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleResetToDefaults = () => {
    toast({
      title: "⚠️ Restaurar Padrões",
      description: "Esta ação irá restaurar todas as configurações padrão",
    });
  };

  const handleExportSettings = () => {
    const settings = {
      businessProfile,
      appointmentSettings,
      workingHours,
      securitySettings,
      notificationSettings,
      financialSettings,
      systemSettings,
    };

    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `settings_${new Date().toISOString().split("T")[0]}.json`;
    link.click();

    toast({
      title: "📥 Configurações Exportadas",
      description: "Arquivo JSON baixado com sucesso",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-blue-50/30 dark:from-[#0D1117] dark:via-[#0D1117] dark:to-blue-950/20 space-y-6 p-6">
      {/* Beautiful Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00112F] via-blue-900 to-blue-800 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-800/20" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />

        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Settings className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                    Configurações Avançadas
                  </h1>
                  <p className="text-blue-100">
                    Personalize completamente sua experiência
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {hasChanges && (
                <Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Alterações não salvas
                </Badge>
              )}

              <div className="text-sm text-blue-200">
                Última atualização: {lastSaved.toLocaleTimeString()}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportSettings}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>

                <Button
                  onClick={handleSaveSettings}
                  disabled={isLoading || !hasChanges}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isLoading ? "Salvando..." : "Salvar Configurações"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Card className="shadow-lg border-0 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-6 pb-0">
            <TabsList className="grid grid-cols-7 lg:grid-cols-13 gap-2 bg-transparent h-auto p-0">
              {tabsConfig.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex flex-col items-center justify-center p-3 h-auto data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 rounded-xl transition-all"
                  >
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-br ${tab.color} text-white shadow-sm mb-1`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-center leading-tight">
                      {tab.label}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Card className="p-6 bg-white/50 dark:bg-[#0D1117]/50 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <Building className="w-5 h-5 text-[#00112F] mr-2" />
                    <h3 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                      Informações Básicas
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="business-name">Nome da Empresa</Label>
                        <Input
                          id="business-name"
                          value={businessProfile.name}
                          onChange={(e) => {
                            setBusinessProfile((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }));
                            setHasChanges(true);
                          }}
                          placeholder="Nome do negócio"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input
                          id="cnpj"
                          value={businessProfile.cnpj}
                          onChange={(e) => {
                            setBusinessProfile((prev) => ({
                              ...prev,
                              cnpj: e.target.value,
                            }));
                            setHasChanges(true);
                          }}
                          placeholder="00.000.000/0000-00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={businessProfile.email}
                          onChange={(e) => {
                            setBusinessProfile((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }));
                            setHasChanges(true);
                          }}
                          placeholder="contato@empresa.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          value={businessProfile.phone}
                          onChange={(e) => {
                            setBusinessProfile((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }));
                            setHasChanges(true);
                          }}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={businessProfile.website}
                        onChange={(e) => {
                          setBusinessProfile((prev) => ({
                            ...prev,
                            website: e.target.value,
                          }));
                          setHasChanges(true);
                        }}
                        placeholder="www.empresa.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={businessProfile.description}
                        onChange={(e) => {
                          setBusinessProfile((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }));
                          setHasChanges(true);
                        }}
                        placeholder="Descreva seu negócio..."
                        rows={3}
                      />
                    </div>
                  </div>
                </Card>

                {/* Address Information */}
                <Card className="p-6 bg-white/50 dark:bg-[#0D1117]/50 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-5 h-5 text-[#00112F] mr-2" />
                    <h3 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                      Endereço
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        value={businessProfile.address}
                        onChange={(e) => {
                          setBusinessProfile((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }));
                          setHasChanges(true);
                        }}
                        placeholder="Rua, número"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          value={businessProfile.city}
                          onChange={(e) => {
                            setBusinessProfile((prev) => ({
                              ...prev,
                              city: e.target.value,
                            }));
                            setHasChanges(true);
                          }}
                          placeholder="Cidade"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">Estado</Label>
                        <Select
                          value={businessProfile.state}
                          onValueChange={(value) => {
                            setBusinessProfile((prev) => ({
                              ...prev,
                              state: value,
                            }));
                            setHasChanges(true);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SP">São Paulo</SelectItem>
                            <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                            <SelectItem value="MG">Minas Gerais</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="zipCode">CEP</Label>
                      <Input
                        id="zipCode"
                        value={businessProfile.zipCode}
                        onChange={(e) => {
                          setBusinessProfile((prev) => ({
                            ...prev,
                            zipCode: e.target.value,
                          }));
                          setHasChanges(true);
                        }}
                        placeholder="00000-000"
                      />
                    </div>
                  </div>
                </Card>

                {/* Logo and Banner */}
                <Card className="p-6 bg-white/50 dark:bg-[#0D1117]/50 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <Image className="w-5 h-5 text-[#00112F] mr-2" />
                    <h3 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                      Imagens
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Logo da Empresa</Label>
                      <div className="mt-2 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#00112F] transition-colors cursor-pointer">
                        <div className="text-center">
                          <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            Clique para fazer upload do logo
                          </p>
                          <p className="text-xs text-gray-400">
                            PNG, JPG até 2MB
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Banner/Capa</Label>
                      <div className="mt-2 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#00112F] transition-colors cursor-pointer">
                        <div className="text-center">
                          <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            Clique para fazer upload do banner
                          </p>
                          <p className="text-xs text-gray-400">
                            PNG, JPG até 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Social Media */}
                <Card className="p-6 bg-white/50 dark:bg-[#0D1117]/50 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <Globe className="w-5 h-5 text-[#00112F] mr-2" />
                    <h3 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                      Redes Sociais
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={businessProfile.socialMedia.instagram}
                        onChange={(e) => {
                          setBusinessProfile((prev) => ({
                            ...prev,
                            socialMedia: {
                              ...prev.socialMedia,
                              instagram: e.target.value,
                            },
                          }));
                          setHasChanges(true);
                        }}
                        placeholder="@usuario"
                      />
                    </div>

                    <div>
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        value={businessProfile.socialMedia.facebook}
                        onChange={(e) => {
                          setBusinessProfile((prev) => ({
                            ...prev,
                            socialMedia: {
                              ...prev.socialMedia,
                              facebook: e.target.value,
                            },
                          }));
                          setHasChanges(true);
                        }}
                        placeholder="usuario"
                      />
                    </div>

                    <div>
                      <Label htmlFor="whatsapp">WhatsApp Business</Label>
                      <Input
                        id="whatsapp"
                        value={businessProfile.socialMedia.whatsapp}
                        onChange={(e) => {
                          setBusinessProfile((prev) => ({
                            ...prev,
                            socialMedia: {
                              ...prev.socialMedia,
                              whatsapp: e.target.value,
                            },
                          }));
                          setHasChanges(true);
                        }}
                        placeholder="5511999999999"
                      />
                    </div>

                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={businessProfile.socialMedia.linkedin}
                        onChange={(e) => {
                          setBusinessProfile((prev) => ({
                            ...prev,
                            socialMedia: {
                              ...prev.socialMedia,
                              linkedin: e.target.value,
                            },
                          }));
                          setHasChanges(true);
                        }}
                        placeholder="empresa"
                      />
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Appointments Tab */}
            <TabsContent value="appointments" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Booking Policies */}
                <Card className="p-6 bg-white/50 dark:bg-[#0D1117]/50 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <Calendar className="w-5 h-5 text-[#00112F] mr-2" />
                    <h3 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                      Políticas de Agendamento
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Agendamento Online</Label>
                        <p className="text-sm text-gray-600">
                          Permitir agendamentos pelo site
                        </p>
                      </div>
                      <Switch
                        checked={appointmentSettings.allowOnlineBooking}
                        onCheckedChange={(checked) => {
                          setAppointmentSettings((prev) => ({
                            ...prev,
                            allowOnlineBooking: checked,
                          }));
                          setHasChanges(true);
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Confirmação Obrigatória</Label>
                        <p className="text-sm text-gray-600">
                          Requer confirmação do cliente
                        </p>
                      </div>
                      <Switch
                        checked={appointmentSettings.requireConfirmation}
                        onCheckedChange={(checked) => {
                          setAppointmentSettings((prev) => ({
                            ...prev,
                            requireConfirmation: checked,
                          }));
                          setHasChanges(true);
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Lista de Espera</Label>
                        <p className="text-sm text-gray-600">
                          Ativar sistema de lista de espera
                        </p>
                      </div>
                      <Switch
                        checked={appointmentSettings.enableWaitingList}
                        onCheckedChange={(checked) => {
                          setAppointmentSettings((prev) => ({
                            ...prev,
                            enableWaitingList: checked,
                          }));
                          setHasChanges(true);
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Confirmação Automática</Label>
                        <p className="text-sm text-gray-600">
                          Confirmar automaticamente agendamentos
                        </p>
                      </div>
                      <Switch
                        checked={appointmentSettings.autoConfirmation}
                        onCheckedChange={(checked) => {
                          setAppointmentSettings((prev) => ({
                            ...prev,
                            autoConfirmation: checked,
                          }));
                          setHasChanges(true);
                        }}
                      />
                    </div>

                    <div>
                      <Label htmlFor="overbooking">Limite de Overbooking</Label>
                      <Select
                        value={appointmentSettings.overbookingLimit.toString()}
                        onValueChange={(value) => {
                          setAppointmentSettings((prev) => ({
                            ...prev,
                            overbookingLimit: parseInt(value),
                          }));
                          setHasChanges(true);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Desabilitado</SelectItem>
                          <SelectItem value="1">1 agendamento</SelectItem>
                          <SelectItem value="2">2 agendamentos</SelectItem>
                          <SelectItem value="3">3 agendamentos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>

                {/* Cancellation & Reschedule Policies */}
                <Card className="p-6 bg-white/50 dark:bg-[#0D1117]/50 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="w-5 h-5 text-[#00112F] mr-2" />
                    <h3 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                      Políticas de Cancelamento
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cancellation-policy">
                        Política de Cancelamento
                      </Label>
                      <Select
                        value={appointmentSettings.cancellationPolicy}
                        onValueChange={(value) => {
                          setAppointmentSettings((prev) => ({
                            ...prev,
                            cancellationPolicy: value,
                          }));
                          setHasChanges(true);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2h">Até 2 horas antes</SelectItem>
                          <SelectItem value="6h">Até 6 horas antes</SelectItem>
                          <SelectItem value="12h">
                            Até 12 horas antes
                          </SelectItem>
                          <SelectItem value="24h">
                            Até 24 horas antes
                          </SelectItem>
                          <SelectItem value="48h">
                            Até 48 horas antes
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="reschedule-policy">
                        Política de Reagendamento
                      </Label>
                      <Select
                        value={appointmentSettings.reschedulePolicy}
                        onValueChange={(value) => {
                          setAppointmentSettings((prev) => ({
                            ...prev,
                            reschedulePolicy: value,
                          }));
                          setHasChanges(true);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2h">Até 2 horas antes</SelectItem>
                          <SelectItem value="6h">Até 6 horas antes</SelectItem>
                          <SelectItem value="12h">
                            Até 12 horas antes
                          </SelectItem>
                          <SelectItem value="24h">
                            Até 24 horas antes
                          </SelectItem>
                          <SelectItem value="48h">
                            Até 48 horas antes
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Lembretes Automáticos</Label>
                      <div className="mt-2 space-y-2">
                        {[24, 2, 1].map((hours) => (
                          <div
                            key={hours}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              id={`reminder-${hours}`}
                              checked={appointmentSettings.reminderHours.includes(
                                hours,
                              )}
                              onChange={(e) => {
                                const newReminders = e.target.checked
                                  ? [
                                      ...appointmentSettings.reminderHours,
                                      hours,
                                    ]
                                  : appointmentSettings.reminderHours.filter(
                                      (h) => h !== hours,
                                    );
                                setAppointmentSettings((prev) => ({
                                  ...prev,
                                  reminderHours: newReminders,
                                }));
                                setHasChanges(true);
                              }}
                              className="rounded border-gray-300"
                            />
                            <Label htmlFor={`reminder-${hours}`}>
                              {hours === 1
                                ? "1 hora antes"
                                : `${hours} horas antes`}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Payment Methods */}
                <Card className="p-6 bg-white/50 dark:bg-[#0D1117]/50 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <CreditCard className="w-5 h-5 text-[#00112F] mr-2" />
                    <h3 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                      Métodos de Pagamento
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: "pix", label: "PIX", icon: Zap },
                      { id: "card", label: "Cartão", icon: CreditCard },
                      { id: "cash", label: "Dinheiro", icon: DollarSign },
                    ].map(({ id, label, icon: Icon }) => (
                      <div key={id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`payment-${id}`}
                          checked={appointmentSettings.paymentMethods.includes(
                            id,
                          )}
                          onChange={(e) => {
                            const newMethods = e.target.checked
                              ? [...appointmentSettings.paymentMethods, id]
                              : appointmentSettings.paymentMethods.filter(
                                  (m) => m !== id,
                                );
                            setAppointmentSettings((prev) => ({
                              ...prev,
                              paymentMethods: newMethods,
                            }));
                            setHasChanges(true);
                          }}
                          className="rounded border-gray-300"
                        />
                        <Icon className="w-4 h-4 text-[#00112F]" />
                        <Label htmlFor={`payment-${id}`}>{label}</Label>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Custom Fields */}
                <Card className="p-6 bg-white/50 dark:bg-[#0D1117]/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-[#00112F] mr-2" />
                      <h3 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                        Campos Personalizados
                      </h3>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setAppointmentSettings((prev) => ({
                          ...prev,
                          customFields: [
                            ...prev.customFields,
                            {
                              name: "Novo Campo",
                              type: "text",
                              required: false,
                            },
                          ],
                        }));
                        setHasChanges(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {appointmentSettings.customFields.map((field, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <Input
                          value={field.name}
                          onChange={(e) => {
                            const newFields = [
                              ...appointmentSettings.customFields,
                            ];
                            newFields[index].name = e.target.value;
                            setAppointmentSettings((prev) => ({
                              ...prev,
                              customFields: newFields,
                            }));
                            setHasChanges(true);
                          }}
                          placeholder="Nome do campo"
                          className="flex-1"
                        />
                        <Select
                          value={field.type}
                          onValueChange={(value) => {
                            const newFields = [
                              ...appointmentSettings.customFields,
                            ];
                            newFields[index].type = value;
                            setAppointmentSettings((prev) => ({
                              ...prev,
                              customFields: newFields,
                            }));
                            setHasChanges(true);
                          }}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Texto</SelectItem>
                            <SelectItem value="number">Número</SelectItem>
                            <SelectItem value="boolean">Sim/Não</SelectItem>
                            <SelectItem value="select">Seleção</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex items-center space-x-1">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => {
                              const newFields = [
                                ...appointmentSettings.customFields,
                              ];
                              newFields[index].required = e.target.checked;
                              setAppointmentSettings((prev) => ({
                                ...prev,
                                customFields: newFields,
                              }));
                              setHasChanges(true);
                            }}
                            className="rounded border-gray-300"
                          />
                          <Label className="text-xs">Obrigatório</Label>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newFields =
                              appointmentSettings.customFields.filter(
                                (_, i) => i !== index,
                              );
                            setAppointmentSettings((prev) => ({
                              ...prev,
                              customFields: newFields,
                            }));
                            setHasChanges(true);
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Working Hours Tab */}
            <TabsContent value="hours" className="space-y-6 mt-0">
              <Card className="p-6 bg-white/50 dark:bg-[#0D1117]/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-[#00112F] mr-2" />
                    <h3 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                      Horários de Funcionamento
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const mondaySettings = workingHours.monday;
                        const newHours = { ...workingHours };
                        Object.keys(newHours).forEach((day) => {
                          if (day !== "sunday") {
                            newHours[day] = { ...mondaySettings };
                          }
                        });
                        setWorkingHours(newHours);
                        setHasChanges(true);
                        toast({
                          title: "Horários Copiados",
                          description:
                            "Configuração de segunda aplicada aos dias úteis",
                        });
                      }}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copiar Seg-Sex
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {Object.entries(workingHours).map(([day, settings]) => {
                    const dayNames = {
                      monday: "Segunda-feira",
                      tuesday: "Terça-feira",
                      wednesday: "Quarta-feira",
                      thursday: "Quinta-feira",
                      friday: "Sexta-feira",
                      saturday: "Sábado",
                      sunday: "Domingo",
                    };

                    return (
                      <div
                        key={day}
                        className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="w-32">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={settings.isOpen}
                              onCheckedChange={(checked) => {
                                setWorkingHours((prev) => ({
                                  ...prev,
                                  [day]: { ...prev[day], isOpen: checked },
                                }));
                                setHasChanges(true);
                              }}
                            />
                            <Label className="font-medium">
                              {dayNames[day as keyof typeof dayNames]}
                            </Label>
                          </div>
                        </div>

                        {settings.isOpen && (
                          <>
                            <div className="flex items-center space-x-2">
                              <Label>Abertura:</Label>
                              <Input
                                type="time"
                                value={settings.openTime}
                                onChange={(e) => {
                                  setWorkingHours((prev) => ({
                                    ...prev,
                                    [day]: {
                                      ...prev[day],
                                      openTime: e.target.value,
                                    },
                                  }));
                                  setHasChanges(true);
                                }}
                                className="w-32"
                              />
                            </div>

                            <div className="flex items-center space-x-2">
                              <Label>Fechamento:</Label>
                              <Input
                                type="time"
                                value={settings.closeTime}
                                onChange={(e) => {
                                  setWorkingHours((prev) => ({
                                    ...prev,
                                    [day]: {
                                      ...prev[day],
                                      closeTime: e.target.value,
                                    },
                                  }));
                                  setHasChanges(true);
                                }}
                                className="w-32"
                              />
                            </div>

                            <div className="flex items-center space-x-2">
                              <Label>Almoço:</Label>
                              <Input
                                type="time"
                                value={settings.breakStart || ""}
                                onChange={(e) => {
                                  setWorkingHours((prev) => ({
                                    ...prev,
                                    [day]: {
                                      ...prev[day],
                                      breakStart: e.target.value,
                                    },
                                  }));
                                  setHasChanges(true);
                                }}
                                placeholder="Início"
                                className="w-28"
                              />
                              <span>-</span>
                              <Input
                                type="time"
                                value={settings.breakEnd || ""}
                                onChange={(e) => {
                                  setWorkingHours((prev) => ({
                                    ...prev,
                                    [day]: {
                                      ...prev[day],
                                      breakEnd: e.target.value,
                                    },
                                  }));
                                  setHasChanges(true);
                                }}
                                placeholder="Fim"
                                className="w-28"
                              />
                            </div>
                          </>
                        )}

                        {!settings.isOpen && (
                          <div className="text-gray-500 italic">Fechado</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Password Policy */}
                <Card className="p-6 bg-white/50 dark:bg-[#0D1117]/50 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <Lock className="w-5 h-5 text-[#00112F] mr-2" />
                    <h3 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                      Política de Senhas
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="min-length">Comprimento Mínimo</Label>
                      <Input
                        id="min-length"
                        type="number"
                        min="6"
                        max="32"
                        value={securitySettings.passwordPolicy.minLength}
                        onChange={(e) => {
                          setSecuritySettings((prev) => ({
                            ...prev,
                            passwordPolicy: {
                              ...prev.passwordPolicy,
                              minLength: parseInt(e.target.value),
                            },
                          }));
                          setHasChanges(true);
                        }}
                      />
                    </div>

                    <div className="space-y-3">
                      {[
                        { key: "requireUppercase", label: "Letras Maiúsculas" },
                        { key: "requireNumbers", label: "Números" },
                        { key: "requireSymbols", label: "Símbolos" },
                      ].map(({ key, label }) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <Label>{label}</Label>
                          <Switch
                            checked={
                              securitySettings.passwordPolicy[
                                key as keyof typeof securitySettings.passwordPolicy
                              ] as boolean
                            }
                            onCheckedChange={(checked) => {
                              setSecuritySettings((prev) => ({
                                ...prev,
                                passwordPolicy: {
                                  ...prev.passwordPolicy,
                                  [key]: checked,
                                },
                              }));
                              setHasChanges(true);
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <Label htmlFor="max-age">Validade da Senha (dias)</Label>
                      <Select
                        value={securitySettings.passwordPolicy.maxAge.toString()}
                        onValueChange={(value) => {
                          setSecuritySettings((prev) => ({
                            ...prev,
                            passwordPolicy: {
                              ...prev.passwordPolicy,
                              maxAge: parseInt(value),
                            },
                          }));
                          setHasChanges(true);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 dias</SelectItem>
                          <SelectItem value="60">60 dias</SelectItem>
                          <SelectItem value="90">90 dias</SelectItem>
                          <SelectItem value="180">180 dias</SelectItem>
                          <SelectItem value="365">1 ano</SelectItem>
                          <SelectItem value="0">Nunca</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>

                {/* Login Security */}
                <Card className="p-6 bg-white/50 dark:bg-[#0D1117]/50 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <ShieldCheck className="w-5 h-5 text-[#00112F] mr-2" />
                    <h3 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                      Segurança de Login
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="max-attempts">Máximo de Tentativas</Label>
                      <Input
                        id="max-attempts"
                        type="number"
                        min="3"
                        max="10"
                        value={securitySettings.loginAttempts.maxAttempts}
                        onChange={(e) => {
                          setSecuritySettings((prev) => ({
                            ...prev,
                            loginAttempts: {
                              ...prev.loginAttempts,
                              maxAttempts: parseInt(e.target.value),
                            },
                          }));
                          setHasChanges(true);
                        }}
                      />
                    </div>

                    <div>
                      <Label htmlFor="lockout-duration">
                        Bloqueio (minutos)
                      </Label>
                      <Input
                        id="lockout-duration"
                        type="number"
                        min="5"
                        max="1440"
                        value={securitySettings.loginAttempts.lockoutDuration}
                        onChange={(e) => {
                          setSecuritySettings((prev) => ({
                            ...prev,
                            loginAttempts: {
                              ...prev.loginAttempts,
                              lockoutDuration: parseInt(e.target.value),
                            },
                          }));
                          setHasChanges(true);
                        }}
                      />
                    </div>

                    <div>
                      <Label htmlFor="session-timeout">
                        Timeout de Sessão (minutos)
                      </Label>
                      <Select
                        value={securitySettings.sessionTimeout.toString()}
                        onValueChange={(value) => {
                          setSecuritySettings((prev) => ({
                            ...prev,
                            sessionTimeout: parseInt(value),
                          }));
                          setHasChanges(true);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="60">1 hora</SelectItem>
                          <SelectItem value="120">2 horas</SelectItem>
                          <SelectItem value="480">8 horas</SelectItem>
                          <SelectItem value="0">Nunca</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Autenticação em 2 Fatores</Label>
                        <p className="text-sm text-gray-600">
                          Ativar 2FA para maior segurança
                        </p>
                      </div>
                      <Switch
                        checked={securitySettings.twoFactorAuth}
                        onCheckedChange={(checked) => {
                          setSecuritySettings((prev) => ({
                            ...prev,
                            twoFactorAuth: checked,
                          }));
                          setHasChanges(true);
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Log de Auditoria</Label>
                        <p className="text-sm text-gray-600">
                          Registrar todas as ações
                        </p>
                      </div>
                      <Switch
                        checked={securitySettings.auditLog}
                        onCheckedChange={(checked) => {
                          setSecuritySettings((prev) => ({
                            ...prev,
                            auditLog: checked,
                          }));
                          setHasChanges(true);
                        }}
                      />
                    </div>
                  </div>
                </Card>

                {/* IP Whitelist */}
                <Card className="p-6 bg-white/50 dark:bg-[#0D1117]/50 backdrop-blur-sm lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Wifi className="w-5 h-5 text-[#00112F] mr-2" />
                      <h3 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                        Lista de IPs Permitidos
                      </h3>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSecuritySettings((prev) => ({
                          ...prev,
                          ipWhitelist: [...prev.ipWhitelist, "0.0.0.0"],
                        }));
                        setHasChanges(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar IP
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {securitySettings.ipWhitelist.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">
                        Nenhum IP restrito. Todos os IPs são permitidos.
                      </p>
                    ) : (
                      securitySettings.ipWhitelist.map((ip, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <Input
                            value={ip}
                            onChange={(e) => {
                              const newList = [...securitySettings.ipWhitelist];
                              newList[index] = e.target.value;
                              setSecuritySettings((prev) => ({
                                ...prev,
                                ipWhitelist: newList,
                              }));
                              setHasChanges(true);
                            }}
                            placeholder="192.168.1.1"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newList =
                                securitySettings.ipWhitelist.filter(
                                  (_, i) => i !== index,
                                );
                              setSecuritySettings((prev) => ({
                                ...prev,
                                ipWhitelist: newList,
                              }));
                              setHasChanges(true);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Add other tabs here following the same pattern... */}
            {/* For brevity, I'll add a few more key tabs */}

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(notificationSettings).map(
                  ([channel, settings]) => {
                    const channelIcons = {
                      email: Mail,
                      sms: Smartphone,
                      whatsapp: MessageCircle,
                      push: Bell,
                    };

                    const channelNames = {
                      email: "Email",
                      sms: "SMS",
                      whatsapp: "WhatsApp",
                      push: "Push",
                    };

                    const Icon =
                      channelIcons[channel as keyof typeof channelIcons];

                    return (
                      <Card
                        key={channel}
                        className="p-6 bg-white/50 dark:bg-[#0D1117]/50 backdrop-blur-sm"
                      >
                        <div className="flex items-center mb-4">
                          <Icon className="w-5 h-5 text-[#00112F] mr-2" />
                          <h3 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                            {channelNames[channel as keyof typeof channelNames]}
                          </h3>
                          <Switch
                            checked={settings.enabled}
                            onCheckedChange={(checked) => {
                              setNotificationSettings((prev) => ({
                                ...prev,
                                [channel]: {
                                  ...prev[channel as keyof typeof prev],
                                  enabled: checked,
                                },
                              }));
                              setHasChanges(true);
                            }}
                            className="ml-auto"
                          />
                        </div>

                        {settings.enabled && (
                          <div className="space-y-3">
                            {Object.entries(settings)
                              .filter(([key]) => key !== "enabled")
                              .map(([type, enabled]) => (
                                <div
                                  key={type}
                                  className="flex items-center justify-between"
                                >
                                  <Label className="capitalize">
                                    {type.replace(/([A-Z])/g, " $1").trim()}
                                  </Label>
                                  <Switch
                                    checked={enabled as boolean}
                                    onCheckedChange={(checked) => {
                                      setNotificationSettings((prev) => ({
                                        ...prev,
                                        [channel]: {
                                          ...prev[channel as keyof typeof prev],
                                          [type]: checked,
                                        },
                                      }));
                                      setHasChanges(true);
                                    }}
                                  />
                                </div>
                              ))}
                          </div>
                        )}
                      </Card>
                    );
                  },
                )}
              </div>
            </TabsContent>

            {/* System Tab */}
            <TabsContent value="system" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* System Monitoring */}
                <Card className="p-6 bg-white/50 dark:bg-[#0D1117]/50 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <Activity className="w-5 h-5 text-[#00112F] mr-2" />
                    <h3 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                      Monitoramento
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Alertas do Sistema</Label>
                        <p className="text-sm text-gray-600">
                          Notificações de problemas
                        </p>
                      </div>
                      <Switch
                        checked={systemSettings.systemAlerts}
                        onCheckedChange={(checked) => {
                          setSystemSettings((prev) => ({
                            ...prev,
                            systemAlerts: checked,
                          }));
                          setHasChanges(true);
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Monitoramento de Performance</Label>
                        <p className="text-sm text-gray-600">
                          Acompanhar performance do sistema
                        </p>
                      </div>
                      <Switch
                        checked={systemSettings.performanceMonitoring}
                        onCheckedChange={(checked) => {
                          setSystemSettings((prev) => ({
                            ...prev,
                            performanceMonitoring: checked,
                          }));
                          setHasChanges(true);
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Rastreamento de Erros</Label>
                        <p className="text-sm text-gray-600">
                          Capturar e reportar erros
                        </p>
                      </div>
                      <Switch
                        checked={systemSettings.errorTracking}
                        onCheckedChange={(checked) => {
                          setSystemSettings((prev) => ({
                            ...prev,
                            errorTracking: checked,
                          }));
                          setHasChanges(true);
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Modo Debug</Label>
                        <p className="text-sm text-gray-600">
                          Ativar logs detalhados
                        </p>
                      </div>
                      <Switch
                        checked={systemSettings.debugMode}
                        onCheckedChange={(checked) => {
                          setSystemSettings((prev) => ({
                            ...prev,
                            debugMode: checked,
                          }));
                          setHasChanges(true);
                        }}
                      />
                    </div>
                  </div>
                </Card>

                {/* Maintenance */}
                <Card className="p-6 bg-white/50 dark:bg-[#0D1117]/50 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <Settings className="w-5 h-5 text-[#00112F] mr-2" />
                    <h3 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                      Manutenção
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Modo de Manutenção</Label>
                        <p className="text-sm text-gray-600">
                          Sistema inacessível para usuários
                        </p>
                      </div>
                      <Switch
                        checked={systemSettings.maintenanceMode}
                        onCheckedChange={(checked) => {
                          setSystemSettings((prev) => ({
                            ...prev,
                            maintenanceMode: checked,
                          }));
                          setHasChanges(true);
                        }}
                      />
                    </div>

                    <div>
                      <Label htmlFor="data-retention">
                        Retenção de Dados (dias)
                      </Label>
                      <Select
                        value={systemSettings.dataRetention.toString()}
                        onValueChange={(value) => {
                          setSystemSettings((prev) => ({
                            ...prev,
                            dataRetention: parseInt(value),
                          }));
                          setHasChanges(true);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 dias</SelectItem>
                          <SelectItem value="90">90 dias</SelectItem>
                          <SelectItem value="180">180 dias</SelectItem>
                          <SelectItem value="365">1 ano</SelectItem>
                          <SelectItem value="730">2 anos</SelectItem>
                          <SelectItem value="1825">5 anos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-3">
                        <Label>Status do Sistema</Label>
                        <Badge className="bg-blue-100 text-blue-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Online
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Uptime:</span>
                          <span className="font-medium">99.9%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Último backup:</span>
                          <span className="font-medium">Hoje às 03:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Usuários ativos:</span>
                          <span className="font-medium">12</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Backup Tab */}
            <TabsContent value="backup" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Backup Settings */}
                <Card className="p-6 bg-white/50 dark:bg-[#0D1117]/50 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <Database className="w-5 h-5 text-[#00112F] mr-2" />
                    <h3 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                      Configurações de Backup
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Backup Automático</Label>
                        <p className="text-sm text-gray-600">
                          Realizar backups automaticamente
                        </p>
                      </div>
                      <Switch
                        checked={systemSettings.autoBackup}
                        onCheckedChange={(checked) => {
                          setSystemSettings((prev) => ({
                            ...prev,
                            autoBackup: checked,
                          }));
                          setHasChanges(true);
                        }}
                      />
                    </div>

                    {systemSettings.autoBackup && (
                      <div>
                        <Label htmlFor="backup-frequency">Frequência</Label>
                        <Select
                          value={systemSettings.backupFrequency}
                          onValueChange={(value) => {
                            setSystemSettings((prev) => ({
                              ...prev,
                              backupFrequency: value,
                            }));
                            setHasChanges(true);
                          }}
                        >
                          <SelectTrigger>
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
                    )}

                    <div className="space-y-3 pt-4 border-t">
                      <Button
                        className="w-full"
                        onClick={() => {
                          toast({
                            title: "🔄 Backup Iniciado",
                            description: "Backup manual em andamento...",
                          });
                        }}
                      >
                        <Database className="w-4 h-4 mr-2" />
                        Fazer Backup Agora
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          toast({
                            title: "📥 Download Iniciado",
                            description:
                              "Backup sendo preparado para download...",
                          });
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Baixar Último Backup
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Backup History */}
                <Card className="p-6 bg-white/50 dark:bg-[#0D1117]/50 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <Clock className="w-5 h-5 text-[#00112F] mr-2" />
                    <h3 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                      Histórico de Backups
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        date: "Hoje às 03:00",
                        size: "2.3 MB",
                        status: "success",
                      },
                      {
                        date: "Ontem às 03:00",
                        size: "2.1 MB",
                        status: "success",
                      },
                      {
                        date: "2 dias atrás",
                        size: "2.0 MB",
                        status: "success",
                      },
                      { date: "3 dias atrás", size: "1.9 MB", status: "error" },
                      {
                        date: "4 dias atrás",
                        size: "2.2 MB",
                        status: "success",
                      },
                    ].map((backup, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {backup.status === "success" ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium">{backup.date}</p>
                            <p className="text-xs text-gray-600">
                              {backup.size}
                            </p>
                          </div>
                        </div>

                        {backup.status === "success" && (
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <RefreshCw className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Add placeholder for other tabs */}
            <TabsContent value="services" className="space-y-6 mt-0">
              <Card className="p-6 bg-white/50 dark:bg-[#0D1117]/50 backdrop-blur-sm text-center">
                <Scissors className="w-12 h-12 text-[#00112F] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB] mb-2">
                  Configurações de Serviços
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Gerencie categorias, preços e configurações avançadas dos
                  serviços.
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="staff" className="space-y-6 mt-0">
              <Card className="p-6 bg-white/50 dark:bg-[#0D1117]/50 backdrop-blur-sm text-center">
                <Users className="w-12 h-12 text-[#00112F] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB] mb-2">
                  Gestão de Funcionários
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Configure permissões, comissões e horários da equipe.
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="financial" className="space-y-6 mt-0">
              <Card className="p-6 bg-white/50 dark:bg-[#0D1117]/50 backdrop-blur-sm text-center">
                <DollarSign className="w-12 h-12 text-[#00112F] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB] mb-2">
                  Configurações Financeiras
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Gerencie impostos, comissões e métodos de pagamento.
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6 mt-0">
              <Card className="p-6 bg-white/50 dark:bg-[#0D1117]/50 backdrop-blur-sm text-center">
                <Link className="w-12 h-12 text-[#00112F] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB] mb-2">
                  Integrações Externas
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Configure APIs, webhooks e sincronizações com sistemas
                  externos.
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-6 mt-0">
              <Card className="p-6 bg-white/50 dark:bg-[#0D1117]/50 backdrop-blur-sm text-center">
                <UserCheck className="w-12 h-12 text-[#00112F] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB] mb-2">
                  Controle de Permissões
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Defina papéis de usuário e controle de acesso às
                  funcionalidades.
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="others" className="space-y-6 mt-0">
              <Card className="p-6 bg-white/50 dark:bg-[#0D1117]/50 backdrop-blur-sm text-center">
                <MoreHorizontal className="w-12 h-12 text-[#00112F] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB] mb-2">
                  Outras Configurações
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Configurações adicionais e personalizações específicas.
                </p>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </Card>

      {/* Bottom Action Bar */}
      {hasChanges && (
        <Card className="fixed bottom-6 left-1/2 transform -translate-x-1/2 shadow-2xl border-0 bg-white/95 dark:bg-[#0D1117]/95 backdrop-blur-xl z-50">
          <div className="flex items-center justify-between p-4 min-w-[400px]">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-sm font-medium">
                Você tem alterações não salvas
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetToDefaults}
              >
                Descartar
              </Button>
              <Button
                size="sm"
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="bg-[#00112F] hover:bg-[#00112F]/80 text-white"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Salvar Tudo
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
