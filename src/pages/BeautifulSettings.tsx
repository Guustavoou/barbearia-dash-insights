import React, { useState } from "react";
import {
  Settings,
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  Database,
  Key,
  RefreshCw,
  Download,
  Save,
  Eye,
  EyeOff,
  Sparkles,
  Activity,
  MoreVertical,
  ExternalLink,
  Target,
  CheckCircle,
  AlertCircle,
  Clock,
  Monitor,
  Smartphone,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { PageType } from "@/lib/types";

interface BeautifulSettingsProps {
  darkMode: boolean;
  onPageChange?: (page: PageType) => void;
}

export const BeautifulSettings: React.FC<BeautifulSettingsProps> = ({
  darkMode,
  onPageChange,
}) => {
  const { toast } = useToast();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      appointments: true,
      payments: true,
      marketing: false,
    },
    appearance: {
      darkMode: darkMode,
      language: "pt-BR",
      timezone: "America/Sao_Paulo",
    },
    business: {
      name: "Salão Premium",
      email: "contato@salaopremium.com",
      phone: "(11) 99999-9999",
      address: "Rua das Flores, 123",
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      autoLogout: true,
    },
  });

  const handleNavigate = (page: PageType) => {
    if (onPageChange) {
      onPageChange(page);
      toast({
        title: "Navegando",
        description: `Direcionando para ${page}`,
      });
    }
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsLoading(false);
      toast({
        title: "✨ Configurações Atualizadas",
        description: "Sistema atualizado com sucesso",
      });
    }, 1000);
  };

  const handleSaveSettings = () => {
    toast({
      title: "✅ Configurações Salvas",
      description: "Suas preferências foram atualizadas",
    });
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-blue-50/30 dark:from-[#0D1117] dark:via-[#0D1117] dark:to-blue-950/20">
      <div className="space-y-6 p-6">
        {/* Beautiful Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00112F] via-blue-900 to-blue-800 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_70%)]" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse" />

          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Settings className="w-8 h-8 text-blue-200 animate-pulse" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Configurações Premium
                </h1>
              </div>
              <p className="text-blue-200 text-lg">
                Personalize sua experiência • Última atualização:{" "}
                {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRefreshData}
                disabled={isLoading}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <RefreshCw
                  className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")}
                />
                {isLoading ? "Atualizando..." : "Atualizar"}
              </Button>
              <Button
                onClick={handleSaveSettings}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="business" className="space-y-6">
          <TabsList className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
            <TabsTrigger value="business">Negócio</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
          </TabsList>

          {/* Business Settings */}
          <TabsContent value="business" className="space-y-6">
            <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                  <User className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
                  Informações do Negócio
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#00112F] dark:text-[#F9FAFB] mb-2">
                      Nome do Estabelecimento
                    </label>
                    <input
                      type="text"
                      value={settings.business.name}
                      onChange={(e) =>
                        updateSetting("business", "name", e.target.value)
                      }
                      className="w-full px-4 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00112F]/50 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 text-[#00112F] dark:text-[#F9FAFB]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#00112F] dark:text-[#F9FAFB] mb-2 flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={settings.business.email}
                      onChange={(e) =>
                        updateSetting("business", "email", e.target.value)
                      }
                      className="w-full px-4 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00112F]/50 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 text-[#00112F] dark:text-[#F9FAFB]"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#00112F] dark:text-[#F9FAFB] mb-2 flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={settings.business.phone}
                      onChange={(e) =>
                        updateSetting("business", "phone", e.target.value)
                      }
                      className="w-full px-4 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00112F]/50 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 text-[#00112F] dark:text-[#F9FAFB]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#00112F] dark:text-[#F9FAFB] mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Endereço
                    </label>
                    <input
                      type="text"
                      value={settings.business.address}
                      onChange={(e) =>
                        updateSetting("business", "address", e.target.value)
                      }
                      className="w-full px-4 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00112F]/50 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 text-[#00112F] dark:text-[#F9FAFB]"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
                  Preferências de Notificação
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                  <div>
                    <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                      Notificações por Email
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receber emails sobre atividades importantes
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) =>
                      updateSetting("notifications", "email", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                  <div>
                    <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                      Notificações de Agendamentos
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Alertas sobre novos agendamentos e cancelamentos
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.appointments}
                    onCheckedChange={(checked) =>
                      updateSetting("notifications", "appointments", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                  <div>
                    <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                      Notificações de Pagamentos
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receber alertas sobre pagamentos recebidos
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.payments}
                    onCheckedChange={(checked) =>
                      updateSetting("notifications", "payments", checked)
                    }
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                  <Palette className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
                  Aparência e Idioma
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#00112F] dark:text-[#F9FAFB] mb-2">
                      Modo de Exibição
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() =>
                          updateSetting("appearance", "darkMode", false)
                        }
                        className={cn(
                          "p-3 rounded-lg border-2 transition-colors flex items-center justify-center space-x-2",
                          !settings.appearance.darkMode
                            ? "border-[#00112F] bg-[#00112F] text-white"
                            : "border-gray-300 dark:border-gray-600 text-[#00112F] dark:text-[#F9FAFB]",
                        )}
                      >
                        <Monitor className="w-4 h-4" />
                        <span>Claro</span>
                      </button>
                      <button
                        onClick={() =>
                          updateSetting("appearance", "darkMode", true)
                        }
                        className={cn(
                          "p-3 rounded-lg border-2 transition-colors flex items-center justify-center space-x-2",
                          settings.appearance.darkMode
                            ? "border-[#00112F] bg-[#00112F] text-white"
                            : "border-gray-300 dark:border-gray-600 text-[#00112F] dark:text-[#F9FAFB]",
                        )}
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>Escuro</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#00112F] dark:text-[#F9FAFB] mb-2">
                      Idioma
                    </label>
                    <select
                      value={settings.appearance.language}
                      onChange={(e) =>
                        updateSetting("appearance", "language", e.target.value)
                      }
                      className="w-full px-4 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00112F]/50 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 text-[#00112F] dark:text-[#F9FAFB]"
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">English (US)</option>
                      <option value="es-ES">Español</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
                  Segurança e Privacidade
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                  <div>
                    <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                      Autenticação de Dois Fatores
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Adicionar uma camada extra de segurança
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactor}
                    onCheckedChange={(checked) =>
                      updateSetting("security", "twoFactor", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                  <div>
                    <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                      Logout Automático
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Sair automaticamente após período de inatividade
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.autoLogout}
                    onCheckedChange={(checked) =>
                      updateSetting("security", "autoLogout", checked)
                    }
                  />
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                  <label className="block text-sm font-medium text-[#00112F] dark:text-[#F9FAFB] mb-2">
                    Tempo Limite da Sessão (minutos)
                  </label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) =>
                      updateSetting(
                        "security",
                        "sessionTimeout",
                        parseInt(e.target.value),
                      )
                    }
                    className="w-full px-4 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00112F]/50 bg-white dark:bg-[#0D1117] text-[#00112F] dark:text-[#F9FAFB]"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-6">
            <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                  <Database className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
                  Integrações e APIs
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00112F] to-blue-700 flex items-center justify-center">
                      <Key className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                        API Key
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Chave para integrações
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      value="sk_live_xxxxxxxxxxxxx"
                      readOnly
                      className="flex-1 px-3 py-2 text-sm border-0 rounded bg-white dark:bg-[#0D1117] text-[#00112F] dark:text-[#F9FAFB]"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </Card>

                <Card className="p-4 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                        Webhook URL
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Endpoint para notificações
                      </p>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="https://sua-app.com/webhook"
                    className="w-full px-3 py-2 text-sm border-0 rounded bg-white dark:bg-[#0D1117] text-[#00112F] dark:text-[#F9FAFB]"
                  />
                </Card>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
