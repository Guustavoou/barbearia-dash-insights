import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Calendar,
  DollarSign,
  Mail,
  Smartphone,
  Save,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";

interface SettingsProps {
  darkMode: boolean;
}

export const Settings: React.FC<SettingsProps> = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Profile Settings
    businessName: "Studio Bella",
    ownerName: "Maria Silva",
    email: "maria@studiobella.com",
    phone: "(11) 99999-1111",
    address: "Rua das Flores, 123 - São Paulo, SP",
    cnpj: "12.345.678/0001-90",
    bio: "Salão de beleza especializado em cuidados capilares e estética.",

    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    marketingEmails: false,
    systemUpdates: true,

    // Appearance
    theme: "system",
    language: "pt-BR",
    timeFormat: "24h",
    currency: "BRL",

    // Business Settings
    workingDays: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ],
    workingHours: { start: "08:00", end: "18:00" },
    timeSlotDuration: 30,
    allowOnlineBooking: true,
    requirePaymentUpfront: false,
    autoConfirmAppointments: false,

    // Security
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: false,
  });

  const settingsTabs = [
    { id: "profile", name: "Perfil", icon: User },
    { id: "notifications", name: "Notificações", icon: Bell },
    { id: "appearance", name: "Aparência", icon: Palette },
    { id: "business", name: "Negócio", icon: Calendar },
    { id: "security", name: "Segurança", icon: Shield },
  ];

  const handleInputChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleWorkingDayToggle = (day: string) => {
    setSettings((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const workDaysOptions = [
    { id: "monday", name: "Segunda-feira" },
    { id: "tuesday", name: "Terça-feira" },
    { id: "wednesday", name: "Quarta-feira" },
    { id: "thursday", name: "Quinta-feira" },
    { id: "friday", name: "Sexta-feira" },
    { id: "saturday", name: "Sábado" },
    { id: "sunday", name: "Domingo" },
  ];

  const SettingCard: React.FC<{
    title: string;
    description: string;
    children: React.ReactNode;
  }> = ({ title, description, children }) => (
    <div
      className={cn(
        "rounded-xl p-6 border",
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
      )}
    >
      <div className="mb-4">
        <h3
          className={cn(
            "text-lg font-semibold",
            darkMode ? "text-white" : "text-gray-900",
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "text-sm mt-1",
            darkMode ? "text-gray-400" : "text-gray-600",
          )}
        >
          {description}
        </p>
      </div>
      {children}
    </div>
  );

  const InputField: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
  }> = ({ label, value, onChange, type = "text", placeholder, required }) => (
    <div>
      <label
        className={cn(
          "block text-sm font-medium mb-2",
          darkMode ? "text-gray-300" : "text-gray-700",
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full px-3 py-2 rounded-lg border transition-colors",
          darkMode
            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
        )}
      />
    </div>
  );

  const ToggleSwitch: React.FC<{
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }> = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-600">
      <div>
        <div
          className={cn(
            "font-medium",
            darkMode ? "text-white" : "text-gray-900",
          )}
        >
          {label}
        </div>
        {description && (
          <div
            className={cn(
              "text-sm",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            {description}
          </div>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
          checked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600",
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-6" : "translate-x-1",
          )}
        />
      </button>
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
          Configurações
        </h1>
        <p
          className={cn(
            "text-sm mt-1",
            darkMode ? "text-gray-400" : "text-gray-600",
          )}
        >
          Personalize o sistema de acordo com suas necessidades
        </p>
      </div>

      {/* Settings Navigation */}
      <div
        className={cn(
          "rounded-xl border p-6",
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
        )}
      >
        <div className="flex flex-wrap gap-2">
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : darkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100",
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Settings */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <SettingCard
            title="Informações do Negócio"
            description="Configure as informações básicas do seu salão"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Nome do Negócio"
                value={settings.businessName}
                onChange={(value) => handleInputChange("businessName", value)}
                required
              />
              <InputField
                label="Nome do Proprietário"
                value={settings.ownerName}
                onChange={(value) => handleInputChange("ownerName", value)}
                required
              />
              <InputField
                label="E-mail"
                value={settings.email}
                onChange={(value) => handleInputChange("email", value)}
                type="email"
                required
              />
              <InputField
                label="Telefone"
                value={settings.phone}
                onChange={(value) => handleInputChange("phone", value)}
                type="tel"
                required
              />
              <div className="md:col-span-2">
                <InputField
                  label="Endereço"
                  value={settings.address}
                  onChange={(value) => handleInputChange("address", value)}
                />
              </div>
              <InputField
                label="CNPJ"
                value={settings.cnpj}
                onChange={(value) => handleInputChange("cnpj", value)}
              />
            </div>
            <div className="mt-4">
              <label
                className={cn(
                  "block text-sm font-medium mb-2",
                  darkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                Descrição do Negócio
              </label>
              <textarea
                value={settings.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={3}
                className={cn(
                  "w-full px-3 py-2 rounded-lg border transition-colors resize-none",
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                )}
                placeholder="Descreva seu negócio..."
              />
            </div>
          </SettingCard>
        </div>
      )}

      {/* Notifications Settings */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <SettingCard
            title="Preferências de Notificação"
            description="Configure como você quer receber notificações"
          >
            <div className="space-y-4">
              <ToggleSwitch
                label="Notificações por E-mail"
                description="Receba atualizações importantes por e-mail"
                checked={settings.emailNotifications}
                onChange={(value) =>
                  handleInputChange("emailNotifications", value)
                }
              />
              <ToggleSwitch
                label="Notificações por SMS"
                description="Receba lembretes via mensagem de texto"
                checked={settings.smsNotifications}
                onChange={(value) =>
                  handleInputChange("smsNotifications", value)
                }
              />
              <ToggleSwitch
                label="Lembretes de Agendamento"
                description="Notificações sobre próximos agendamentos"
                checked={settings.appointmentReminders}
                onChange={(value) =>
                  handleInputChange("appointmentReminders", value)
                }
              />
              <ToggleSwitch
                label="E-mails de Marketing"
                description="Receba dicas e novidades sobre o sistema"
                checked={settings.marketingEmails}
                onChange={(value) =>
                  handleInputChange("marketingEmails", value)
                }
              />
              <ToggleSwitch
                label="Atualizações do Sistema"
                description="Seja notificado sobre novas funcionalidades"
                checked={settings.systemUpdates}
                onChange={(value) => handleInputChange("systemUpdates", value)}
              />
            </div>
          </SettingCard>
        </div>
      )}

      {/* Appearance Settings */}
      {activeTab === "appearance" && (
        <div className="space-y-6">
          <SettingCard
            title="Aparência do Sistema"
            description="Personalize a aparência e idioma do sistema"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className={cn(
                    "block text-sm font-medium mb-2",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  Tema
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleInputChange("theme", e.target.value)}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border transition-colors",
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                  )}
                >
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                  <option value="system">Sistema</option>
                </select>
              </div>
              <div>
                <label
                  className={cn(
                    "block text-sm font-medium mb-2",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  Idioma
                </label>
                <select
                  value={settings.language}
                  onChange={(e) =>
                    handleInputChange("language", e.target.value)
                  }
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border transition-colors",
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                  )}
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>
              <div>
                <label
                  className={cn(
                    "block text-sm font-medium mb-2",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  Formato de Hora
                </label>
                <select
                  value={settings.timeFormat}
                  onChange={(e) =>
                    handleInputChange("timeFormat", e.target.value)
                  }
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border transition-colors",
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                  )}
                >
                  <option value="12h">12 horas (AM/PM)</option>
                  <option value="24h">24 horas</option>
                </select>
              </div>
              <div>
                <label
                  className={cn(
                    "block text-sm font-medium mb-2",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  Moeda
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) =>
                    handleInputChange("currency", e.target.value)
                  }
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border transition-colors",
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                  )}
                >
                  <option value="BRL">Real (R$)</option>
                  <option value="USD">Dólar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
            </div>
          </SettingCard>
        </div>
      )}

      {/* Business Settings */}
      {activeTab === "business" && (
        <div className="space-y-6">
          <SettingCard
            title="Configurações do Negócio"
            description="Configure horários de funcionamento e regras de agendamento"
          >
            <div className="space-y-6">
              {/* Working Days */}
              <div>
                <label
                  className={cn(
                    "block text-sm font-medium mb-3",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  Dias de Funcionamento
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {workDaysOptions.map((day) => (
                    <label
                      key={day.id}
                      className={cn(
                        "flex items-center p-3 rounded-lg border cursor-pointer transition-colors",
                        settings.workingDays.includes(day.id)
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : darkMode
                            ? "border-gray-600 hover:bg-gray-700"
                            : "border-gray-300 hover:bg-gray-50",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={settings.workingDays.includes(day.id)}
                        onChange={() => handleWorkingDayToggle(day.id)}
                        className="mr-3 rounded"
                      />
                      <span
                        className={cn(
                          "text-sm",
                          darkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {day.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Working Hours */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    className={cn(
                      "block text-sm font-medium mb-2",
                      darkMode ? "text-gray-300" : "text-gray-700",
                    )}
                  >
                    Horário de Abertura
                  </label>
                  <input
                    type="time"
                    value={settings.workingHours.start}
                    onChange={(e) =>
                      handleInputChange("workingHours", {
                        ...settings.workingHours,
                        start: e.target.value,
                      })
                    }
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border transition-colors",
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
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
                    Horário de Fechamento
                  </label>
                  <input
                    type="time"
                    value={settings.workingHours.end}
                    onChange={(e) =>
                      handleInputChange("workingHours", {
                        ...settings.workingHours,
                        end: e.target.value,
                      })
                    }
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border transition-colors",
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
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
                    Duração do Slot (min)
                  </label>
                  <select
                    value={settings.timeSlotDuration}
                    onChange={(e) =>
                      handleInputChange(
                        "timeSlotDuration",
                        Number(e.target.value),
                      )
                    }
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border transition-colors",
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                    )}
                  >
                    <option value={15}>15 minutos</option>
                    <option value={30}>30 minutos</option>
                    <option value={60}>60 minutos</option>
                  </select>
                </div>
              </div>

              {/* Business Rules */}
              <div className="space-y-4">
                <ToggleSwitch
                  label="Permitir Agendamento Online"
                  description="Clientes podem agendar serviços pelo sistema"
                  checked={settings.allowOnlineBooking}
                  onChange={(value) =>
                    handleInputChange("allowOnlineBooking", value)
                  }
                />
                <ToggleSwitch
                  label="Exigir Pagamento Antecipado"
                  description="Solicitar pagamento no momento do agendamento"
                  checked={settings.requirePaymentUpfront}
                  onChange={(value) =>
                    handleInputChange("requirePaymentUpfront", value)
                  }
                />
                <ToggleSwitch
                  label="Confirmar Agendamentos Automaticamente"
                  description="Novos agendamentos são confirmados automaticamente"
                  checked={settings.autoConfirmAppointments}
                  onChange={(value) =>
                    handleInputChange("autoConfirmAppointments", value)
                  }
                />
              </div>
            </div>
          </SettingCard>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <SettingCard
            title="Segurança da Conta"
            description="Mantenha sua conta segura com essas configurações"
          >
            <div className="space-y-6">
              {/* Change Password */}
              <div>
                <h4
                  className={cn(
                    "font-medium mb-4",
                    darkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  Alterar Senha
                </h4>
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Senha atual"
                      value={settings.currentPassword}
                      onChange={(e) =>
                        handleInputChange("currentPassword", e.target.value)
                      }
                      className={cn(
                        "w-full px-3 py-2 pr-10 rounded-lg border transition-colors",
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 placeholder-gray-500",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <input
                    type="password"
                    placeholder="Nova senha"
                    value={settings.newPassword}
                    onChange={(e) =>
                      handleInputChange("newPassword", e.target.value)
                    }
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border transition-colors",
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 placeholder-gray-500",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                    )}
                  />
                  <input
                    type="password"
                    placeholder="Confirmar nova senha"
                    value={settings.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border transition-colors",
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 placeholder-gray-500",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                    )}
                  />
                </div>
              </div>

              {/* Two Factor Authentication */}
              <ToggleSwitch
                label="Autenticação de Dois Fatores"
                description="Adicione uma camada extra de segurança à sua conta"
                checked={settings.twoFactorAuth}
                onChange={(value) => handleInputChange("twoFactorAuth", value)}
              />
            </div>
          </SettingCard>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Save className="h-4 w-4" />
          Salvar Configurações
        </button>
      </div>
    </div>
  );
};
