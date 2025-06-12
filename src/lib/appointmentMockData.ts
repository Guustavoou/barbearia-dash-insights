import { AppointmentItem } from "./appointmentTypes";

export const appointmentsMockData: AppointmentItem[] = [
  {
    id: 1,
    client: "Ana Silva Santos",
    clientId: 1,
    service: "Corte + Escova",
    date: new Date(2025, 5, 15, 9, 0), // 15 de junho de 2025, 09:00
    time: "09:00",
    duration: 120,
    status: "agendado",
    price: 85.0,
    professional: "Maria Silva",
    notes: "Cliente preferencial, sempre pontual",
  },
  {
    id: 2,
    client: "Carlos Roberto Lima",
    clientId: 2,
    service: "Barba",
    date: new Date(2025, 5, 15, 10, 30), // 15 de junho de 2025, 10:30
    time: "10:30",
    duration: 45,
    status: "confirmado",
    price: 35.0,
    professional: "João Santos",
  },
  {
    id: 3,
    client: "Mariana Costa Oliveira",
    clientId: 3,
    service: "Manicure",
    date: new Date(2025, 5, 20, 14, 0), // 20 de junho de 2025, 14:00
    time: "14:00",
    duration: 60,
    status: "confirmado",
    price: 45.0,
    professional: "Ana Costa",
  },
  {
    id: 4,
    client: "Pedro Santos",
    clientId: 4,
    service: "Corte",
    date: new Date(2025, 5, 22, 15, 30), // 22 de junho de 2025, 15:30
    time: "15:30",
    duration: 60,
    status: "agendado",
    price: 40.0,
    professional: "Maria Silva",
  },
  {
    id: 5,
    client: "Julia Fernandes",
    clientId: 5,
    service: "Hidratação",
    date: new Date(2025, 5, 25, 16, 0), // 25 de junho de 2025, 16:00
    time: "16:00",
    duration: 90,
    status: "concluido",
    price: 65.0,
    professional: "Ana Costa",
  },
  {
    id: 6,
    client: "Roberto Almeida",
    clientId: 6,
    service: "Corte + Barba",
    date: new Date(2025, 5, 10, 11, 0), // 10 de junho de 2025, 11:00
    time: "11:00",
    duration: 90,
    status: "cancelado",
    price: 75.0,
    professional: "João Santos",
    notes: "Cliente cancelou por motivos pessoais",
  },
  {
    id: 7,
    client: "Fernanda Lima",
    clientId: 7,
    service: "Escova",
    date: new Date(2025, 5, 8, 13, 0), // 8 de junho de 2025, 13:00
    time: "13:00",
    duration: 45,
    status: "faltou",
    price: 30.0,
    professional: "Maria Silva",
  },
];

export const professionals = [
  {
    id: 1,
    name: "Maria Silva",
    specialties: ["Corte", "Escova", "Hidratação"],
  },
  { id: 2, name: "João Santos", specialties: ["Barba", "Corte Masculino"] },
  {
    id: 3,
    name: "Ana Costa",
    specialties: ["Manicure", "Pedicure", "Hidratação"],
  },
];

export const services = [
  { id: 1, name: "Corte", duration: 60, price: 40.0 },
  { id: 2, name: "Escova", duration: 45, price: 30.0 },
  { id: 3, name: "Corte + Escova", duration: 120, price: 85.0 },
  { id: 4, name: "Barba", duration: 45, price: 35.0 },
  { id: 5, name: "Corte + Barba", duration: 90, price: 75.0 },
  { id: 6, name: "Manicure", duration: 60, price: 45.0 },
  { id: 7, name: "Pedicure", duration: 60, price: 50.0 },
  { id: 8, name: "Hidratação", duration: 90, price: 65.0 },
];
