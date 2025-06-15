import React, { useState, useMemo } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  Phone,
  MessageCircle,
  DollarSign,
  Edit3,
  X,
  Search,
  Filter,
  MoreHorizontal,
  Trash2,
  Check,
  AlertCircle,
  ChevronDown,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { NewAppointmentModal } from "@/components/NewAppointmentModal";

interface SmartAppointmentsProps {
  darkMode: boolean;
}

interface Professional {
  id: string;
  name: string;
  avatar: string;
  color: string;
  initials: string;
}

interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  professionalId: string;
  service: string;
  startTime: string;
  endTime: string;
  duration: number;
  price: number;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  notes?: string;
  products?: Product[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image?: string;
}

interface TimeSlot {
  time: string;
  hour: number;
}

const timeSlots: TimeSlot[] = [
  { time: "8:00", hour: 8 },
  { time: "9:00", hour: 9 },
  { time: "10:00", hour: 10 },
  { time: "11:00", hour: 11 },
  { time: "12:00", hour: 12 },
  { time: "13:00", hour: 13 },
  { time: "14:00", hour: 14 },
  { time: "15:00", hour: 15 },
  { time: "16:00", hour: 16 },
  { time: "17:00", hour: 17 },
  { time: "18:00", hour: 18 },
  { time: "19:00", hour: 19 },
  { time: "20:00", hour: 20 },
];

const professionals: Professional[] = [
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
  {
    id: "jake",
    name: "Jake M.",
    avatar: "/api/placeholder/40/40",
    color: "bg-orange-500",
    initials: "JM",
  },
  {
    id: "fred",
    name: "Fred M.",
    avatar: "/api/placeholder/40/40",
    color: "bg-red-500",
    initials: "FM",
  },
  {
    id: "gurpreet",
    name: "Gurpreet S.",
    avatar: "/api/placeholder/40/40",
    color: "bg-indigo-500",
    initials: "GS",
  },
];

const mockAppointments: Appointment[] = [
  {
    id: "1",
    clientName: "Lincoln Steffes",
    clientPhone: "(11) 99999-1234",
    professionalId: "james",
    service: "Barba",
    startTime: "10:00",
    endTime: "10:45",
    duration: 45,
    price: 120,
    status: "confirmed",
  },
  {
    id: "2",
    clientName: "Cameron Williamson",
    clientPhone: "(11) 99999-5678",
    professionalId: "jack",
    service: "Corte + Barba",
    startTime: "10:00",
    endTime: "11:30",
    duration: 90,
    price: 150,
    status: "pending",
  },
  {
    id: "3",
    clientName: "Andrea McCoy",
    clientPhone: "(11) 99999-9012",
    professionalId: "mike",
    service: "Corte Masculino",
    startTime: "10:00",
    endTime: "10:45",
    duration: 45,
    price: 80,
    status: "confirmed",
  },
  {
    id: "4",
    clientName: "Zain Dias",
    clientPhone: "(11) 99999-3456",
    professionalId: "jake",
    service: "Degradê",
    startTime: "10:30",
    endTime: "11:15",
    duration: 45,
    price: 90,
    status: "confirmed",
  },
  {
    id: "5",
    clientName: "Marvin McKinney",
    clientPhone: "(11) 99999-7890",
    professionalId: "fred",
    service: "Barba",
    startTime: "13:00",
    endTime: "13:30",
    duration: 30,
    price: 60,
    status: "confirmed",
  },
];

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Strong Hold Hair Gel",
    price: 75,
    quantity: 1,
    category: "Hair Care",
    image: "/api/placeholder/60/60",
  },
  {
    id: "2",
    name: "Beard Smoothening",
    price: 25,
    quantity: 1,
    category: "Beard Care",
    image: "/api/placeholder/60/60",
  },
  {
    id: "3",
    name: "Beard Wax",
    price: 30,
    quantity: 2,
    category: "Beard Care",
    image: "/api/placeholder/60/60",
  },
  {
    id: "4",
    name: "Shaver",
    price: 25,
    quantity: 1,
    category: "Tools",
    image: "/api/placeholder/60/60",
  },
];

export const SmartAppointments: React.FC<SmartAppointmentsProps> = ({
  darkMode,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<
    string | null
  >(null);
  const [appointments, setAppointments] =
    useState<Appointment[]>(mockAppointments);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileProfessionals, setShowMobileProfessionals] = useState(false);

  // Check for mobile screen
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  const getAppointmentForSlot = (professionalId: string, hour: number) => {
    return appointments.find((apt) => {
      const startHour = parseInt(apt.startTime.split(":")[0]);
      const endHour = parseInt(apt.endTime.split(":")[0]);
      return (
        apt.professionalId === professionalId &&
        hour >= startHour &&
        hour < endHour
      );
    });
  };

  const getAppointmentHeight = (appointment: Appointment) => {
    return (appointment.duration / 60) * 64; // 64px per hour
  };

  const getProfessionalColor = (professionalId: string) => {
    const professional = professionals.find((p) => p.id === professionalId);
    return professional?.color || "bg-gray-500";
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowSidebar(true);
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, "_self");
  };

  const handleMessage = (phone: string, clientName: string) => {
    const message = `Olá ${clientName}! Este é um lembrete do seu agendamento. Nos vemos em breve!`;
    const whatsappURL = `https://wa.me/55${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  };

  const handleNewAppointment = (appointmentData: any) => {
    const newAppointment: Appointment = {
      id: (appointments.length + 1).toString(),
      clientName: appointmentData.client.name,
      clientPhone: appointmentData.client.phone,
      professionalId: appointmentData.professional.id,
      service: appointmentData.service.name,
      startTime: appointmentData.time,
      endTime: appointmentData.time, // Calculate end time based on service duration
      duration: appointmentData.service.duration,
      price: appointmentData.service.price,
      status: "pending",
    };

    setAppointments([...appointments, newAppointment]);
    setShowNewAppointment(false);
  };

  const calculateTotal = () => {
    if (!selectedAppointment) return 0;
    const serviceTotal = selectedAppointment.price;
    const productsTotal =
      selectedAppointment.products?.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0,
      ) || 0;
    return serviceTotal + productsTotal;
  };

  const AppointmentCard: React.FC<{ appointment: Appointment }> = ({
    appointment,
  }) => {
    const professional = professionals.find(
      (p) => p.id === appointment.professionalId,
    );
    const height = getAppointmentHeight(appointment);

    return (
      <div
        className={cn(
          "absolute left-1 right-1 rounded-lg border-l-4 cursor-pointer transition-all hover:shadow-md",
          "bg-white border-gray-200 shadow-sm",
          getProfessionalColor(appointment.professionalId),
        )}
        style={{ height: `${height}px`, minHeight: "60px" }}
        onClick={() => handleAppointmentClick(appointment)}
      >
        <div className="p-2 h-full flex flex-col justify-between">
          <div>
            <div className="font-medium text-sm text-gray-900 truncate">
              {appointment.clientName}
            </div>
            <div className="text-xs text-gray-600 truncate">
              {appointment.service}
            </div>
            <div className="text-xs text-gray-500">
              {appointment.startTime} - {appointment.endTime}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Badge
              variant={
                appointment.status === "confirmed"
                  ? "default"
                  : appointment.status === "pending"
                    ? "secondary"
                    : "outline"
              }
              className="text-xs"
            >
              {appointment.status === "confirmed"
                ? "Confirmado"
                : appointment.status === "pending"
                  ? "Pendente"
                  : appointment.status === "completed"
                    ? "Concluído"
                    : "Cancelado"}
            </Badge>
            <span className="text-xs font-medium text-gray-900">
              R$ {appointment.price}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const Sidebar: React.FC = () => {
    if (!selectedAppointment) return null;

    const professional = professionals.find(
      (p) => p.id === selectedAppointment.professionalId,
    );

    return (
      <div className="fixed top-0 right-0 h-full w-96 bg-white border-l border-gray-200 z-50 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Detalhes do Agendamento
            </h2>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Appointments Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                AGENDAMENTOS
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium",
                        getProfessionalColor(
                          selectedAppointment.professionalId,
                        ),
                      )}
                    >
                      {professional?.initials}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {selectedAppointment.clientName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {selectedAppointment.service} às{" "}
                        {selectedAppointment.startTime}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      R$ {selectedAppointment.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      R$ {selectedAppointment.price.toFixed(2)}
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowNewAppointment(true)}
                >
                  Adicionar outro agendamento
                </Button>
              </div>
            </div>

            {/* Products Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                PRODUTOS
              </h3>
              <div className="space-y-3">
                {selectedAppointment.products?.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <div className="w-6 h-6 bg-gray-400 rounded"></div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Por {professional?.name}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-900">
                        R$ {(product.price * product.quantity).toFixed(2)}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          -
                        </Button>
                        <span className="w-8 text-center">
                          {product.quantity}
                        </span>
                        <Button variant="outline" size="sm">
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      Nenhum produto adicionado
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowProductModal(true)}
                >
                  Adicionar produtos
                </Button>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="flex space-x-2">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => handleCall(selectedAppointment.clientPhone)}
              >
                <Phone className="w-4 h-4 mr-2" />
                Ligar
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() =>
                  handleMessage(
                    selectedAppointment.clientPhone,
                    selectedAppointment.clientName,
                  )
                }
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Mensagem
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button className="w-full bg-black hover:bg-gray-800 text-white">
              Cobrar R$ {calculateTotal().toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const ProductModal: React.FC = () => (
    <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Adicionar produtos</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Filtrar por nome, preço ou duração"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Todas as categorias</option>
              <option>Cuidados com Cabelo</option>
              <option>Cuidados com Barba</option>
              <option>Ferramentas</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-4 gap-4">
            {mockProducts.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-lg mb-3 mx-auto"></div>
                <div className="text-center">
                  <div className="font-medium text-sm text-gray-900 mb-1">
                    {product.name}
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    R$ {product.price}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button className="bg-black hover:bg-gray-800 text-white px-8">
              Salvar produtos
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Date Navigation */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="flex items-center space-x-1 md:space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateDate("prev")}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-sm md:text-lg font-semibold text-gray-900 min-w-0">
                {isMobile
                  ? currentDate.toLocaleDateString("pt-BR")
                  : formatDate(currentDate)}
              </h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateDate("next")}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Calendar className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {!isMobile && <Button variant="outline">Bloquear horário</Button>}
            <Button
              className="bg-black hover:bg-gray-800 text-white text-xs md:text-sm px-2 md:px-4"
              onClick={() => setShowNewAppointment(true)}
            >
              {isMobile ? <Plus className="w-4 h-4" /> : "Novo agendamento"}
            </Button>
          </div>
        </div>
      </div>

      {/* Professionals Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        {isMobile ? (
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setShowMobileProfessionals(true)}
              className="flex items-center space-x-2"
            >
              <Menu className="w-4 h-4" />
              <span>Profissionais</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
            {selectedProfessional && (
              <div className="flex items-center space-x-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium",
                    professionals.find((p) => p.id === selectedProfessional)
                      ?.color,
                  )}
                >
                  {
                    professionals.find((p) => p.id === selectedProfessional)
                      ?.initials
                  }
                </div>
                <span className="text-sm font-medium">
                  {
                    professionals.find((p) => p.id === selectedProfessional)
                      ?.name
                  }
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-6">
            <div className="w-16"></div> {/* Time column spacer */}
            {professionals.map((professional) => (
              <div
                key={professional.id}
                className="flex-1 flex items-center space-x-3 min-w-0"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium",
                    professional.color,
                  )}
                >
                  {professional.initials}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {professional.name}
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Grid */}
      <div className="flex-1 overflow-auto">
        <div className="px-2 md:px-6">
          <div className="flex">
            {/* Time Column */}
            <div className="w-12 md:w-16 flex-shrink-0">
              {timeSlots.map((slot) => (
                <div
                  key={slot.time}
                  className="h-12 md:h-16 flex items-start justify-end pr-1 md:pr-2 pt-1 md:pt-2 text-xs md:text-sm text-gray-500 border-b border-gray-100"
                >
                  {slot.time}
                </div>
              ))}
            </div>

            {/* Professional Columns */}
            {(isMobile && selectedProfessional
              ? professionals.filter((p) => p.id === selectedProfessional)
              : professionals
            ).map((professional) => (
              <div key={professional.id} className="flex-1 min-w-0 relative">
                {timeSlots.map((slot) => (
                  <div
                    key={`${professional.id}-${slot.time}`}
                    className="h-12 md:h-16 border-b border-r border-gray-100 relative"
                  >
                    {/* Render appointment if it starts at this hour */}
                    {(() => {
                      const appointment = appointments.find((apt) => {
                        const startHour = parseInt(apt.startTime.split(":")[0]);
                        return (
                          apt.professionalId === professional.id &&
                          startHour === slot.hour
                        );
                      });

                      return appointment ? (
                        <AppointmentCard appointment={appointment} />
                      ) : null;
                    })()}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {showSidebar && <Sidebar />}

      {/* Product Modal */}
      <ProductModal />

      {/* New Appointment Modal */}
      <NewAppointmentModal
        isOpen={showNewAppointment}
        onClose={() => setShowNewAppointment(false)}
        onSave={handleNewAppointment}
        darkMode={darkMode}
      />

      {/* Mobile Professional Selector */}
      {isMobile && (
        <Dialog
          open={showMobileProfessionals}
          onOpenChange={setShowMobileProfessionals}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Selecionar Profissional</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Button
                variant={!selectedProfessional ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => {
                  setSelectedProfessional(null);
                  setShowMobileProfessionals(false);
                }}
              >
                Todos os Profissionais
              </Button>
              {professionals.map((professional) => (
                <Button
                  key={professional.id}
                  variant={
                    selectedProfessional === professional.id
                      ? "default"
                      : "outline"
                  }
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedProfessional(professional.id);
                    setShowMobileProfessionals(false);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium",
                        professional.color,
                      )}
                    >
                      {professional.initials}
                    </div>
                    <span>{professional.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Backdrop for sidebar on mobile */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
};
