import React, { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Search,
  X,
  Phone,
  Mail,
  MapPin,
  Plus,
  Check,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointmentData: any) => void;
  darkMode?: boolean;
}

interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  initials: string;
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  category: string;
}

interface Professional {
  id: string;
  name: string;
  avatar: string;
  color: string;
  initials: string;
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "Lincoln Steffes",
    phone: "(11) 99999-1234",
    email: "lincoln@email.com",
    initials: "LS",
  },
  {
    id: "2",
    name: "Cameron Williamson",
    phone: "(11) 99999-5678",
    email: "cameron@email.com",
    initials: "CW",
  },
  {
    id: "3",
    name: "Andrea McCoy",
    phone: "(11) 99999-9012",
    email: "andrea@email.com",
    initials: "AM",
  },
];

const mockServices: Service[] = [
  {
    id: "1",
    name: "Corte Masculino",
    duration: 45,
    price: 80,
    category: "Corte",
  },
  {
    id: "2",
    name: "Barba",
    duration: 30,
    price: 60,
    category: "Barba",
  },
  {
    id: "3",
    name: "Corte + Barba",
    duration: 90,
    price: 150,
    category: "Combo",
  },
  {
    id: "4",
    name: "Degradê",
    duration: 45,
    price: 90,
    category: "Corte",
  },
];

const mockProfessionals: Professional[] = [
  {
    id: "james",
    name: "James F.",
    avatar: "/api/placeholder/40/40",
    color: "bg-blue-500",
    initials: "JF",
  },
  {
    id: "jack",
    name: "Jack C.",
    avatar: "/api/placeholder/40/40",
    color: "bg-purple-500",
    initials: "JC",
  },
  {
    id: "mike",
    name: "Mike D.",
    avatar: "/api/placeholder/40/40",
    color: "bg-green-500",
    initials: "MD",
  },
];

const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
];

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  darkMode = false,
}) => {
  const [step, setStep] = useState<
    "client" | "service" | "datetime" | "payment"
  >("client");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [isNewClient, setIsNewClient] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProfessional, setSelectedProfessional] =
    useState<Professional | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<
    "pix" | "dinheiro" | "cartao"
  >("pix");
  const [notes, setNotes] = useState("");
  const [clientSearch, setClientSearch] = useState("");

  const filteredClients = mockClients.filter((client) =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()),
  );

  const handleSave = () => {
    const appointmentData = {
      client: isNewClient ? newClient : selectedClient,
      service: selectedService,
      professional: selectedProfessional,
      date: selectedDate,
      time: selectedTime,
      paymentMethod,
      notes,
    };

    onSave(appointmentData);
    handleClose();
  };

  const handleClose = () => {
    setStep("client");
    setSelectedClient(null);
    setNewClient({ name: "", phone: "", email: "" });
    setIsNewClient(false);
    setSelectedService(null);
    setSelectedProfessional(null);
    setSelectedTime("");
    setPaymentMethod("pix");
    setNotes("");
    setClientSearch("");
    onClose();
  };

  const canProceed = () => {
    switch (step) {
      case "client":
        return isNewClient ? newClient.name && newClient.phone : selectedClient;
      case "service":
        return selectedService && selectedProfessional;
      case "datetime":
        return selectedDate && selectedTime;
      case "payment":
        return paymentMethod;
      default:
        return false;
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {["client", "service", "datetime", "payment"].map((stepName, index) => (
        <div key={stepName} className="flex items-center">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
              step === stepName
                ? "bg-blue-600 text-white"
                : index <
                    ["client", "service", "datetime", "payment"].indexOf(step)
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-500",
            )}
          >
            {index <
            ["client", "service", "datetime", "payment"].indexOf(step) ? (
              <Check className="w-4 h-4" />
            ) : (
              index + 1
            )}
          </div>
          {index < 3 && (
            <div
              className={cn(
                "w-8 h-0.5 mx-2",
                index <
                  ["client", "service", "datetime", "payment"].indexOf(step)
                  ? "bg-green-600"
                  : "bg-gray-200",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );

  const ClientStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Selecionar Cliente
        </h3>

        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant={!isNewClient ? "default" : "outline"}
            onClick={() => setIsNewClient(false)}
            className="flex-1"
          >
            Cliente Existente
          </Button>
          <Button
            variant={isNewClient ? "default" : "outline"}
            onClick={() => setIsNewClient(true)}
            className="flex-1"
          >
            Novo Cliente
          </Button>
        </div>

        {!isNewClient ? (
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Buscar cliente..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-colors",
                    selectedClient?.id === client.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                  onClick={() => setSelectedClient(client)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-600">
                      {client.initials}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {client.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {client.phone}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={newClient.name}
                onChange={(e) =>
                  setNewClient({ ...newClient, name: e.target.value })
                }
                placeholder="Digite o nome do cliente"
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={newClient.phone}
                onChange={(e) =>
                  setNewClient({ ...newClient, phone: e.target.value })
                }
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={newClient.email}
                onChange={(e) =>
                  setNewClient({ ...newClient, email: e.target.value })
                }
                placeholder="cliente@email.com"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const ServiceStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Selecionar Serviço
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {mockServices.map((service) => (
            <div
              key={service.id}
              className={cn(
                "p-4 rounded-lg border cursor-pointer transition-colors",
                selectedService?.id === service.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300",
              )}
              onClick={() => setSelectedService(service)}
            >
              <div className="font-medium text-gray-900">{service.name}</div>
              <div className="text-sm text-gray-500 mt-1">
                {service.duration}min • R$ {service.price}
              </div>
              <Badge variant="secondary" className="mt-2">
                {service.category}
              </Badge>
            </div>
          ))}
        </div>

        <h4 className="font-semibold text-gray-900 mb-3">
          Selecionar Profissional
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {mockProfessionals.map((professional) => (
            <div
              key={professional.id}
              className={cn(
                "p-3 rounded-lg border cursor-pointer transition-colors",
                selectedProfessional?.id === professional.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300",
              )}
              onClick={() => setSelectedProfessional(professional)}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium",
                    professional.color,
                  )}
                >
                  {professional.initials}
                </div>
                <div className="font-medium text-gray-900">
                  {professional.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DateTimeStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Selecionar Data e Horário
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Data</Label>
            <Input
              type="date"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            />
          </div>

          <div>
            <Label>Horário</Label>
            <div className="grid grid-cols-3 gap-2 mt-2 max-h-48 overflow-y-auto">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                  className="text-xs"
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Observações</Label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Adicione observações sobre o agendamento..."
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg resize-none h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const PaymentStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Forma de Pagamento
        </h3>

        <div className="space-y-3">
          {[
            { id: "pix", label: "PIX", icon: "💳" },
            { id: "dinheiro", label: "Dinheiro", icon: "💵" },
            { id: "cartao", label: "Cartão", icon: "💳" },
          ].map((method) => (
            <div
              key={method.id}
              className={cn(
                "p-4 rounded-lg border cursor-pointer transition-colors",
                paymentMethod === method.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300",
              )}
              onClick={() => setPaymentMethod(method.id as any)}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{method.icon}</span>
                <span className="font-medium text-gray-900">
                  {method.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mt-6">
          <h4 className="font-semibold text-gray-900 mb-3">
            Resumo do Agendamento
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Cliente:</span>
              <span className="font-medium">
                {isNewClient ? newClient.name : selectedClient?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Serviço:</span>
              <span className="font-medium">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Profissional:</span>
              <span className="font-medium">{selectedProfessional?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Data/Hora:</span>
              <span className="font-medium">
                {selectedDate.toLocaleDateString()} às {selectedTime}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold">
                R$ {selectedService?.price || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Novo Agendamento</span>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <StepIndicator />

          {step === "client" && <ClientStep />}
          {step === "service" && <ServiceStep />}
          {step === "datetime" && <DateTimeStep />}
          {step === "payment" && <PaymentStep />}

          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => {
                const steps = ["client", "service", "datetime", "payment"];
                const currentIndex = steps.indexOf(step);
                if (currentIndex > 0) {
                  setStep(steps[currentIndex - 1] as any);
                }
              }}
              disabled={step === "client"}
            >
              Voltar
            </Button>

            <Button
              onClick={() => {
                const steps = ["client", "service", "datetime", "payment"];
                const currentIndex = steps.indexOf(step);
                if (currentIndex < steps.length - 1) {
                  setStep(steps[currentIndex + 1] as any);
                } else {
                  handleSave();
                }
              }}
              disabled={!canProceed()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {step === "payment" ? "Agendar" : "Continuar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
