import React, { useState } from "react";
import { X, Clock, DollarSign, Users, Percent } from "lucide-react";
import { cn, formatCurrency } from "@/lib/unclicUtils";
import { serviceCategories, professionals } from "@/lib/servicesMockData";
import { ServiceFormData } from "@/lib/servicesTypes";

interface NewServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export const NewServiceModal: React.FC<NewServiceModalProps> = ({
  isOpen,
  onClose,
  darkMode,
}) => {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    description: "",
    category: "",
    price: 0,
    duration: 30,
    commission: 30,
    professionals: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New service data:", formData);
    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "duration" || name === "commission"
          ? Number(value)
          : value,
    }));
  };

  const handleProfessionalToggle = (professionalName: string) => {
    setFormData((prev) => ({
      ...prev,
      professionals: prev.professionals.includes(professionalName)
        ? prev.professionals.filter((p) => p !== professionalName)
        : [...prev.professionals, professionalName],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={cn(
          "w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl",
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3
              className={cn(
                "text-lg font-medium",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              Informações Básicas
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className={cn(
                    "block text-sm font-medium mb-2",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
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
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                  )}
                  placeholder="Ex: Corte Feminino"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className={cn(
                    "block text-sm font-medium mb-2",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
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
                  {serviceCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className={cn(
                  "block text-sm font-medium mb-2",
                  darkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
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
                placeholder="Descreva o serviço oferecido..."
              />
            </div>
          </div>

          {/* Pricing and Duration */}
          <div className="space-y-4">
            <h3
              className={cn(
                "text-lg font-medium",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              Preço e Duração
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="price"
                  className={cn(
                    "block text-sm font-medium mb-2",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Preço (R$) *
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
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                  )}
                  placeholder="0.00"
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
                  <Clock className="inline h-4 w-4 mr-1" />
                  Duração (min) *
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  required
                  min="15"
                  step="15"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border transition-colors",
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                  )}
                  placeholder="30"
                />
              </div>

              <div>
                <label
                  htmlFor="commission"
                  className={cn(
                    "block text-sm font-medium mb-2",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  <Percent className="inline h-4 w-4 mr-1" />
                  Comissão (%) *
                </label>
                <input
                  type="number"
                  id="commission"
                  name="commission"
                  required
                  min="0"
                  max="100"
                  value={formData.commission}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border transition-colors",
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                  )}
                  placeholder="30"
                />
              </div>
            </div>

            {/* Preview */}
            {formData.price > 0 && (
              <div
                className={cn(
                  "p-4 rounded-lg border",
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-blue-50 border-blue-200",
                )}
              >
                <h4
                  className={cn(
                    "font-medium mb-2",
                    darkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  Resumo do Serviço
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span
                      className={cn(
                        darkMode ? "text-gray-400" : "text-gray-600",
                      )}
                    >
                      Preço:
                    </span>
                    <span
                      className={cn(
                        "ml-2 font-semibold",
                        darkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {formatCurrency(formData.price)}
                    </span>
                  </div>
                  <div>
                    <span
                      className={cn(
                        darkMode ? "text-gray-400" : "text-gray-600",
                      )}
                    >
                      Comissão:
                    </span>
                    <span
                      className={cn(
                        "ml-2 font-semibold",
                        darkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {formatCurrency(
                        (formData.price * formData.commission) / 100,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Professionals */}
          <div className="space-y-4">
            <h3
              className={cn(
                "text-lg font-medium",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              <Users className="inline h-5 w-5 mr-2" />
              Profissionais
            </h3>
            <p
              className={cn(
                "text-sm",
                darkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              Selecione os profissionais que podem executar este serviço:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {professionals.map((professional) => (
                <label
                  key={professional.id}
                  className={cn(
                    "flex items-center p-3 rounded-lg border cursor-pointer transition-colors",
                    formData.professionals.includes(professional.name)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : darkMode
                        ? "border-gray-600 hover:bg-gray-700"
                        : "border-gray-300 hover:bg-gray-50",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={formData.professionals.includes(professional.name)}
                    onChange={() => handleProfessionalToggle(professional.name)}
                    className="mr-3 rounded"
                  />
                  <span
                    className={cn(
                      "font-medium",
                      darkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {professional.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
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
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar Serviço
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
