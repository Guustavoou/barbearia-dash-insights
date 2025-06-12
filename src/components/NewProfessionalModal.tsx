import React, { useState } from "react";
import { X, User, Mail, Phone, Clock, Percent, Award } from "lucide-react";
import { cn } from "@/lib/unclicUtils";
import {
  workDaysOptions,
  availableSpecialties,
} from "@/lib/professionalsMockData";
import { ProfessionalFormData } from "@/lib/professionalsTypes";

interface NewProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export const NewProfessionalModal: React.FC<NewProfessionalModalProps> = ({
  isOpen,
  onClose,
  darkMode,
}) => {
  const [formData, setFormData] = useState<ProfessionalFormData>({
    name: "",
    email: "",
    phone: "",
    specialties: [],
    commission: 40,
    workDays: [],
    workHours: {
      start: "09:00",
      end: "18:00",
    },
    bio: "",
    experience: 1,
    certifications: [],
  });

  const [newCertification, setNewCertification] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New professional data:", formData);
    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "commission" || name === "experience"
            ? Number(value)
            : value,
      }));
    }
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const handleWorkDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter((d) => d !== day)
        : [...prev.workDays, day],
    }));
  };

  const handleAddCertification = () => {
    if (newCertification.trim()) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()],
      }));
      setNewCertification("");
    }
  };

  const handleRemoveCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={cn(
          "w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl",
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
            Novo Profissional
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
          {/* Personal Information */}
          <div className="space-y-4">
            <h3
              className={cn(
                "text-lg font-medium",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              <User className="inline h-5 w-5 mr-2" />
              Informações Pessoais
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className={cn(
                    "block text-sm font-medium mb-2",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  Nome Completo *
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
                  placeholder="Digite o nome completo"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className={cn(
                    "block text-sm font-medium mb-2",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  <Mail className="inline h-4 w-4 mr-1" />
                  E-mail *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
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
                  <Phone className="inline h-4 w-4 mr-1" />
                  Telefone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="experience"
                  className={cn(
                    "block text-sm font-medium mb-2",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  Anos de Experiência *
                </label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  required
                  min="0"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border transition-colors",
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                  )}
                  placeholder="0"
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
                  placeholder="40"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="bio"
                className={cn(
                  "block text-sm font-medium mb-2",
                  darkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                Biografia
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleInputChange}
                className={cn(
                  "w-full px-3 py-2 rounded-lg border transition-colors resize-none",
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                )}
                placeholder="Conte um pouco sobre a experiência e especialidades..."
              />
            </div>
          </div>

          {/* Specialties */}
          <div className="space-y-4">
            <h3
              className={cn(
                "text-lg font-medium",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              Especialidades
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableSpecialties.map((specialty) => (
                <label
                  key={specialty}
                  className={cn(
                    "flex items-center p-3 rounded-lg border cursor-pointer transition-colors",
                    formData.specialties.includes(specialty)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : darkMode
                        ? "border-gray-600 hover:bg-gray-700"
                        : "border-gray-300 hover:bg-gray-50",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={formData.specialties.includes(specialty)}
                    onChange={() => handleSpecialtyToggle(specialty)}
                    className="mr-3 rounded"
                  />
                  <span
                    className={cn(
                      "text-sm",
                      darkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {specialty}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Work Schedule */}
          <div className="space-y-4">
            <h3
              className={cn(
                "text-lg font-medium",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              <Clock className="inline h-5 w-5 mr-2" />
              Horário de Trabalho
            </h3>

            <div>
              <label
                className={cn(
                  "block text-sm font-medium mb-2",
                  darkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                Dias de Trabalho
              </label>
              <div className="grid grid-cols-7 gap-2">
                {workDaysOptions.map((day) => (
                  <label
                    key={day.id}
                    className={cn(
                      "flex flex-col items-center p-2 rounded-lg border cursor-pointer transition-colors",
                      formData.workDays.includes(day.id)
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : darkMode
                          ? "border-gray-600 hover:bg-gray-700"
                          : "border-gray-300 hover:bg-gray-50",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={formData.workDays.includes(day.id)}
                      onChange={() => handleWorkDayToggle(day.id)}
                      className="mb-1 rounded"
                    />
                    <span
                      className={cn(
                        "text-xs font-medium",
                        darkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {day.short}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="workHours.start"
                  className={cn(
                    "block text-sm font-medium mb-2",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  Início do Expediente
                </label>
                <input
                  type="time"
                  id="workHours.start"
                  name="workHours.start"
                  value={formData.workHours.start}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border transition-colors",
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-500",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                  )}
                />
              </div>

              <div>
                <label
                  htmlFor="workHours.end"
                  className={cn(
                    "block text-sm font-medium mb-2",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  Fim do Expediente
                </label>
                <input
                  type="time"
                  id="workHours.end"
                  name="workHours.end"
                  value={formData.workHours.end}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border transition-colors",
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-500",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                  )}
                />
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-4">
            <h3
              className={cn(
                "text-lg font-medium",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              <Award className="inline h-5 w-5 mr-2" />
              Certificações
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                className={cn(
                  "flex-1 px-3 py-2 rounded-lg border transition-colors",
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                )}
                placeholder="Digite uma certificação..."
                onKeyPress={(e) =>
                  e.key === "Enter" && handleAddCertification()
                }
              />
              <button
                type="button"
                onClick={handleAddCertification}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Adicionar
              </button>
            </div>

            {formData.certifications.length > 0 && (
              <div className="space-y-2">
                {formData.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border",
                      darkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-gray-50 border-gray-200",
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm",
                        darkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {cert}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCertification(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              Cadastrar Profissional
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
