
import React, { useState } from "react";
import { X, User, Mail, Phone, MapPin, FileText, Briefcase } from "lucide-react";
import { cn } from "@/lib/unclicUtils";

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (clientData: any) => void;
  darkMode: boolean;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  cpf: string;
  profession: string;
  notes: string;
}

export const NewClientModal: React.FC<NewClientModalProps> = ({
  isOpen,
  onClose,
  onAddClient,
  darkMode,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    city: "",
    cpf: "",
    profession: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onAddClient({
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        city: formData.city || null,
        cpf: formData.cpf || null,
        profession: formData.profession || null,
        notes: formData.notes || null,
        status: 'ativo',
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        city: "",
        cpf: "",
        profession: "",
        notes: "",
      });
    } catch (error) {
      console.error('Error adding client:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={cn(
          "w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl",
          darkMode ? "bg-gray-800" : "bg-white",
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "sticky top-0 flex items-center justify-between p-6 border-b",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <h2
            className={cn(
              "text-xl font-semibold",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            Novo Cliente
          </h2>
          <button
            onClick={onClose}
            className={cn(
              "p-2 rounded-lg transition-colors",
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100",
            )}
          >
            <X
              className={cn(
                "h-5 w-5",
                darkMode ? "text-gray-400" : "text-gray-500",
              )}
            />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name - Required */}
          <div>
            <label
              htmlFor="name"
              className={cn(
                "block text-sm font-medium mb-2",
                darkMode ? "text-gray-300" : "text-gray-700",
              )}
            >
              <User className="inline h-4 w-4 mr-2" />
              Nome *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className={cn(
                "w-full px-3 py-2 rounded-lg border transition-colors",
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              )}
              placeholder="Nome completo do cliente"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className={cn(
                "block text-sm font-medium mb-2",
                darkMode ? "text-gray-300" : "text-gray-700",
              )}
            >
              <Mail className="inline h-4 w-4 mr-2" />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={cn(
                "w-full px-3 py-2 rounded-lg border transition-colors",
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              )}
              placeholder="email@exemplo.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className={cn(
                "block text-sm font-medium mb-2",
                darkMode ? "text-gray-300" : "text-gray-700",
              )}
            >
              <Phone className="inline h-4 w-4 mr-2" />
              Telefone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={cn(
                "w-full px-3 py-2 rounded-lg border transition-colors",
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              )}
              placeholder="(11) 99999-9999"
            />
          </div>

          {/* City and CPF */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="city"
                className={cn(
                  "block text-sm font-medium mb-2",
                  darkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                <MapPin className="inline h-4 w-4 mr-2" />
                Cidade
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={cn(
                  "w-full px-3 py-2 rounded-lg border transition-colors",
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                )}
                placeholder="São Paulo"
              />
            </div>
            <div>
              <label
                htmlFor="cpf"
                className={cn(
                  "block text-sm font-medium mb-2",
                  darkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                <FileText className="inline h-4 w-4 mr-2" />
                CPF
              </label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                className={cn(
                  "w-full px-3 py-2 rounded-lg border transition-colors",
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                )}
                placeholder="000.000.000-00"
              />
            </div>
          </div>

          {/* Profession */}
          <div>
            <label
              htmlFor="profession"
              className={cn(
                "block text-sm font-medium mb-2",
                darkMode ? "text-gray-300" : "text-gray-700",
              )}
            >
              <Briefcase className="inline h-4 w-4 mr-2" />
              Profissão
            </label>
            <input
              type="text"
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleInputChange}
              className={cn(
                "w-full px-3 py-2 rounded-lg border transition-colors",
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              )}
              placeholder="Ex: Engenheiro, Professor, etc."
            />
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className={cn(
                "block text-sm font-medium mb-2",
                darkMode ? "text-gray-300" : "text-gray-700",
              )}
            >
              Observações
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleInputChange}
              className={cn(
                "w-full px-3 py-2 rounded-lg border transition-colors resize-none",
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              )}
              placeholder="Informações adicionais sobre o cliente..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={cn(
                "flex-1 px-4 py-2 rounded-lg border transition-colors",
                darkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50",
                loading && "opacity-50 cursor-not-allowed",
              )}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className={cn(
                "flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",
                (loading || !formData.name.trim()) && "opacity-50 cursor-not-allowed",
              )}
            >
              {loading ? "Salvando..." : "Salvar Cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
