
import React, { useState } from "react";
import { X, Briefcase, DollarSign, Clock, FileText, Tag } from "lucide-react";
import { cn } from "@/lib/unclicUtils";

interface NewServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddService: (serviceData: any) => void;
  darkMode: boolean;
}

interface FormData {
  name: string;
  description: string;
  category: string;
  price: string;
  duration: string;
  commission: string;
}

export const NewServiceModal: React.FC<NewServiceModalProps> = ({
  isOpen,
  onClose,
  onAddService,
  darkMode,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    category: "",
    price: "",
    duration: "",
    commission: "",
  });

  const [loading, setLoading] = useState(false);

  const serviceCategories = [
    "Corte",
    "Barba",
    "Cabelo + Barba",
    "Tratamento",
    "Coloração",
    "Penteado",
    "Outros"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onAddService({
        name: formData.name,
        description: formData.description || null,
        category: formData.category,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        commission: parseFloat(formData.commission) || 0,
        is_active: true,
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        price: "",
        duration: "",
        commission: "",
      });
    } catch (error) {
      console.error('Error adding service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
            Novo Serviço
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
              <Briefcase className="inline h-4 w-4 mr-2" />
              Nome do Serviço *
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
              placeholder="Ex: Corte Masculino, Barba Completa"
            />
          </div>

          {/* Category - Required */}
          <div>
            <label
              htmlFor="category"
              className={cn(
                "block text-sm font-medium mb-2",
                darkMode ? "text-gray-300" : "text-gray-700",
              )}
            >
              <Tag className="inline h-4 w-4 mr-2" />
              Categoria *
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleInputChange}
              className={cn(
                "w-full px-3 py-2 rounded-lg border transition-colors",
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              )}
            >
              <option value="">Selecione uma categoria</option>
              {serviceCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Price and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="price"
                className={cn(
                  "block text-sm font-medium mb-2",
                  darkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                <DollarSign className="inline h-4 w-4 mr-2" />
                Preço *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                className={cn(
                  "w-full px-3 py-2 rounded-lg border transition-colors",
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                )}
                placeholder="0,00"
              />
            </div>
            <div>
              <label
                htmlFor="duration"
                className={cn(
                  "block text-sm font-medium mb-2",
                  darkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                <Clock className="inline h-4 w-4 mr-2" />
                Duração (min) *
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                required
                min="1"
                value={formData.duration}
                onChange={handleInputChange}
                className={cn(
                  "w-full px-3 py-2 rounded-lg border transition-colors",
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                )}
                placeholder="30"
              />
            </div>
          </div>

          {/* Commission */}
          <div>
            <label
              htmlFor="commission"
              className={cn(
                "block text-sm font-medium mb-2",
                darkMode ? "text-gray-300" : "text-gray-700",
              )}
            >
              <DollarSign className="inline h-4 w-4 mr-2" />
              Comissão (%)
            </label>
            <input
              type="number"
              id="commission"
              name="commission"
              min="0"
              max="100"
              step="0.01"
              value={formData.commission}
              onChange={handleInputChange}
              className={cn(
                "w-full px-3 py-2 rounded-lg border transition-colors",
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              )}
              placeholder="0,00"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className={cn(
                "block text-sm font-medium mb-2",
                darkMode ? "text-gray-300" : "text-gray-700",
              )}
            >
              <FileText className="inline h-4 w-4 mr-2" />
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className={cn(
                "w-full px-3 py-2 rounded-lg border transition-colors resize-none",
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              )}
              placeholder="Descreva os detalhes do serviço..."
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
              disabled={loading || !formData.name.trim() || !formData.category || !formData.price || !formData.duration}
              className={cn(
                "flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",
                (loading || !formData.name.trim() || !formData.category || !formData.price || !formData.duration) && "opacity-50 cursor-not-allowed",
              )}
            >
              {loading ? "Salvando..." : "Salvar Serviço"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
