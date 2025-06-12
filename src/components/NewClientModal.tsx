
import React, { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/unclicUtils";
import { cities } from "@/lib/mockData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  onClientCreated?: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  city: string;
  profession: string;
  notes: string;
}

export const NewClientModal: React.FC<NewClientModalProps> = ({
  isOpen,
  onClose,
  darkMode,
  onClientCreated,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    city: "São Paulo",
    profession: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get the current user's barbershop
      const { data: barbershop, error: barbershopError } = await supabase
        .from("barbershops")
        .select("id")
        .eq("owner_id", (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (barbershopError || !barbershop) {
        toast({
          title: "Erro",
          description: "Não foi possível encontrar sua barbearia. Faça login novamente.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("clients").insert({
        barbershop_id: barbershop.id,
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        cpf: formData.cpf || null,
        city: formData.city || null,
        profession: formData.profession || null,
        notes: formData.notes || null,
      });

      if (error) {
        console.error("Erro ao criar cliente:", error);
        toast({
          title: "Erro",
          description: "Não foi possível criar o cliente. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Cliente criado com sucesso!",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        cpf: "",
        city: "São Paulo",
        profession: "",
        notes: "",
      });

      onClientCreated?.();
      onClose();
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast({
        title: "Erro",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
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
            disabled={isLoading}
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
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className={cn(
                "block text-sm font-medium mb-2",
                darkMode ? "text-gray-300" : "text-gray-700",
              )}
            >
              Nome completo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              disabled={isLoading}
              className={cn(
                "w-full px-3 py-2 rounded-lg border transition-colors",
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              )}
              placeholder="Digite o nome completo"
            />
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="email"
                className={cn(
                  "block text-sm font-medium mb-2",
                  darkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                className={cn(
                  "w-full px-3 py-2 rounded-lg border transition-colors",
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                )}
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className={cn(
                  "block text-sm font-medium mb-2",
                  darkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                Telefone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isLoading}
                className={cn(
                  "w-full px-3 py-2 rounded-lg border transition-colors",
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                )}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          {/* CPF and Profession */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="cpf"
                className={cn(
                  "block text-sm font-medium mb-2",
                  darkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                CPF
              </label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                disabled={isLoading}
                className={cn(
                  "w-full px-3 py-2 rounded-lg border transition-colors",
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                )}
                placeholder="000.000.000-00"
              />
            </div>
            <div>
              <label
                htmlFor="profession"
                className={cn(
                  "block text-sm font-medium mb-2",
                  darkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                Profissão
              </label>
              <input
                type="text"
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleInputChange}
                disabled={isLoading}
                className={cn(
                  "w-full px-3 py-2 rounded-lg border transition-colors",
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                )}
                placeholder="Digite a profissão"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className={cn(
                "block text-sm font-medium mb-2",
                darkMode ? "text-gray-300" : "text-gray-700",
              )}
            >
              Cidade
            </label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              disabled={isLoading}
              className={cn(
                "w-full px-3 py-2 rounded-lg border transition-colors",
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              )}
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
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
              disabled={isLoading}
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
              disabled={isLoading}
              className={cn(
                "flex-1 px-4 py-2 rounded-lg border transition-colors",
                darkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50",
              )}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "flex-1 px-4 py-2 rounded-lg transition-colors",
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700",
                "text-white",
              )}
            >
              {isLoading ? "Salvando..." : "Salvar Cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
