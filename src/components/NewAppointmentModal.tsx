
import React, { useState } from "react";
import { X, Calendar, Clock, User, Briefcase } from "lucide-react";
import { cn, formatCurrency } from "@/lib/unclicUtils";
import { useClients } from "@/hooks/useClients";
import { useServices } from "@/hooks/useServices";
import { useProfessionals } from "@/hooks/useProfessionals";
import { useAppointments } from "@/hooks/useAppointments";
import { toast } from "sonner";

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  darkMode: boolean;
}

interface FormData {
  clientId: string;
  serviceId: string;
  professionalId: string;
  date: string;
  time: string;
  notes: string;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  darkMode,
}) => {
  const [formData, setFormData] = useState<FormData>({
    clientId: "",
    serviceId: "",
    professionalId: "",
    date: selectedDate
      ? selectedDate.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    time: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const { clients } = useClients();
  const { services } = useServices();
  const { professionals } = useProfessionals();
  const { addAppointment } = useAppointments();

  const selectedService = services.find(
    (s) => s.id === formData.serviceId,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const appointmentData = {
        client_id: formData.clientId,
        service_id: formData.serviceId,
        professional_id: formData.professionalId || null,
        appointment_date: formData.date,
        appointment_time: formData.time,
        duration: selectedService?.duration || 30,
        price: selectedService?.price || 0,
        notes: formData.notes || null,
        status: 'agendado' as const,
      };

      const result = await addAppointment(appointmentData);
      
      if (result) {
        toast.success("Agendamento criado com sucesso!");
        
        // Reset form
        setFormData({
          clientId: "",
          serviceId: "",
          professionalId: "",
          date: selectedDate
            ? selectedDate.toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          time: "",
          notes: "",
        });
        
        onClose();
      } else {
        toast.error("Erro ao criar agendamento");
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error("Erro ao criar agendamento");
    } finally {
      setLoading(false);
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
            Novo Agendamento
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
          {/* Client Selection */}
          <div>
            <label
              htmlFor="clientId"
              className={cn(
                "block text-sm font-medium mb-2",
                darkMode ? "text-gray-300" : "text-gray-700",
              )}
            >
              <User className="inline h-4 w-4 mr-2" />
              Cliente *
            </label>
            <select
              id="clientId"
              name="clientId"
              required
              value={formData.clientId}
              onChange={handleInputChange}
              className={cn(
                "w-full px-3 py-2 rounded-lg border transition-colors",
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              )}
            >
              <option value="">Selecione um cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          {/* Service Selection */}
          <div>
            <label
              htmlFor="serviceId"
              className={cn(
                "block text-sm font-medium mb-2",
                darkMode ? "text-gray-300" : "text-gray-700",
              )}
            >
              <Briefcase className="inline h-4 w-4 mr-2" />
              Serviço *
            </label>
            <select
              id="serviceId"
              name="serviceId"
              required
              value={formData.serviceId}
              onChange={handleInputChange}
              className={cn(
                "w-full px-3 py-2 rounded-lg border transition-colors",
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              )}
            >
              <option value="">Selecione um serviço</option>
              {services.filter(s => s.is_active).map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - {formatCurrency(service.price)} (
                  {service.duration}min)
                </option>
              ))}
            </select>
          </div>

          {/* Professional Selection */}
          <div>
            <label
              htmlFor="professionalId"
              className={cn(
                "block text-sm font-medium mb-2",
                darkMode ? "text-gray-300" : "text-gray-700",
              )}
            >
              Profissional
            </label>
            <select
              id="professionalId"
              name="professionalId"
              value={formData.professionalId}
              onChange={handleInputChange}
              className={cn(
                "w-full px-3 py-2 rounded-lg border transition-colors",
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              )}
            >
              <option value="">Selecione um profissional (opcional)</option>
              {professionals.filter(p => p.status === 'ativo').map((professional) => (
                <option
                  key={professional.id}
                  value={professional.id}
                >
                  {professional.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="date"
                className={cn(
                  "block text-sm font-medium mb-2",
                  darkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                <Calendar className="inline h-4 w-4 mr-2" />
                Data *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={formData.date}
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
                htmlFor="time"
                className={cn(
                  "block text-sm font-medium mb-2",
                  darkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                <Clock className="inline h-4 w-4 mr-2" />
                Horário *
              </label>
              <input
                type="time"
                id="time"
                name="time"
                required
                value={formData.time}
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

          {/* Service Details */}
          {selectedService && (
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
                Detalhes do Serviço
              </h4>
              <div className="space-y-1">
                <p
                  className={cn(
                    "text-sm",
                    darkMode ? "text-gray-300" : "text-gray-600",
                  )}
                >
                  Duração: {selectedService.duration} minutos
                </p>
                <p
                  className={cn(
                    "text-sm",
                    darkMode ? "text-gray-300" : "text-gray-600",
                  )}
                >
                  Valor: {formatCurrency(selectedService.price)}
                </p>
                {selectedService.description && (
                  <p
                    className={cn(
                      "text-sm",
                      darkMode ? "text-gray-300" : "text-gray-600",
                    )}
                  >
                    {selectedService.description}
                  </p>
                )}
              </div>
            </div>
          )}

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
              placeholder="Informações adicionais sobre o agendamento..."
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
              disabled={loading || !formData.clientId || !formData.serviceId || !formData.date || !formData.time}
              className={cn(
                "flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",
                (loading || !formData.clientId || !formData.serviceId || !formData.date || !formData.time) && "opacity-50 cursor-not-allowed",
              )}
            >
              {loading ? "Agendando..." : "Agendar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
