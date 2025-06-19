import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Upload,
  Edit,
  Trash2,
  UserCheck,
} from "lucide-react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useOnboardingHelpers } from "@/hooks/useOnboarding";
import { OnboardingProfessional } from "@/lib/onboardingTypes";

export const ProfessionalsStep: React.FC = () => {
  const {
    data,
    addProfessional,
    updateProfessional,
    removeProfessional,
    nextStep,
    previousStep,
  } = useOnboarding();
  const { validateProfessionals, generateCalendarColors, formatPhone } =
    useOnboardingHelpers();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProfessional, setEditingProfessional] =
    useState<OnboardingProfessional | null>(null);
  const [newProfessional, setNewProfessional] = useState<
    Partial<OnboardingProfessional>
  >({
    name: "",
    role: "",
    type: "employee",
    email: "",
    phone: "",
    calendarColor: "#3B82F6",
    services: [],
    workDays: [],
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const colors = generateCalendarColors();
  const weekDays = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo",
  ];

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPhotoPreview(result);
      setNewProfessional({ ...newProfessional, photo: file });
    };
    reader.readAsDataURL(file);
  };

  const handleAddProfessional = () => {
    if (
      newProfessional.name &&
      newProfessional.email &&
      newProfessional.phone &&
      newProfessional.role &&
      newProfessional.workDays &&
      newProfessional.workDays.length > 0
    ) {
      addProfessional({
        id: Date.now().toString(),
        name: newProfessional.name,
        role: newProfessional.role,
        type: newProfessional.type || "employee",
        email: newProfessional.email,
        phone: newProfessional.phone,
        photo: newProfessional.photo,
        calendarColor: newProfessional.calendarColor || colors[0],
        services: newProfessional.services || [],
        workDays: newProfessional.workDays,
      });

      setNewProfessional({
        name: "",
        role: "",
        type: "employee",
        email: "",
        phone: "",
        calendarColor: colors[data.professionals.length % colors.length],
        services: [],
        workDays: [],
      });
      setPhotoPreview(null);
      setShowAddForm(false);
    }
  };

  const handleUpdateProfessional = () => {
    if (editingProfessional && editingProfessional.id) {
      updateProfessional(editingProfessional.id, editingProfessional);
      setEditingProfessional(null);
    }
  };

  const handleServiceToggle = (
    serviceId: string,
    professional: Partial<OnboardingProfessional>,
    setProfessional: (p: Partial<OnboardingProfessional>) => void,
  ) => {
    const services = professional.services || [];
    const updatedServices = services.includes(serviceId)
      ? services.filter((id) => id !== serviceId)
      : [...services, serviceId];
    setProfessional({ ...professional, services: updatedServices });
  };

  const handleWorkDayToggle = (
    day: string,
    professional: Partial<OnboardingProfessional>,
    setProfessional: (p: Partial<OnboardingProfessional>) => void,
  ) => {
    const workDays = professional.workDays || [];
    const updatedDays = workDays.includes(day)
      ? workDays.filter((d) => d !== day)
      : [...workDays, day];
    setProfessional({ ...professional, workDays: updatedDays });
  };

  const handleNext = () => {
    const validation = validateProfessionals(data.professionals);
    if (validation.isValid) {
      nextStep();
    } else {
      setErrors(validation.errors);
    }
  };

  const ProfessionalForm = ({
    professional,
    setProfessional,
    onSave,
    onCancel,
    title,
  }: {
    professional: Partial<OnboardingProfessional>;
    setProfessional: (p: Partial<OnboardingProfessional>) => void;
    onSave: () => void;
    onCancel: () => void;
    title: string;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              placeholder="Ex: Maria Silva"
              value={professional.name}
              onChange={(e) =>
                setProfessional({ ...professional, name: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="role">Função *</Label>
            <Input
              id="role"
              placeholder="Ex: Cabeleireira, Manicure"
              value={professional.role}
              onChange={(e) =>
                setProfessional({ ...professional, role: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              placeholder="maria@exemplo.com"
              value={professional.email}
              onChange={(e) =>
                setProfessional({ ...professional, email: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone *</Label>
            <Input
              id="phone"
              placeholder="(11) 99999-9999"
              value={professional.phone}
              onChange={(e) =>
                setProfessional({
                  ...professional,
                  phone: formatPhone(e.target.value),
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="type">Tipo de Vínculo</Label>
            <Select
              value={professional.type}
              onValueChange={(value: "employee" | "freelancer") =>
                setProfessional({ ...professional, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employee">Funcionário</SelectItem>
                <SelectItem value="freelancer">Autônomo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="color">Cor do Calendário</Label>
            <div className="flex space-x-2 mt-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    professional.calendarColor === color
                      ? "border-gray-900"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() =>
                    setProfessional({ ...professional, calendarColor: color })
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <Label>Foto (opcional)</Label>
          <div
            onClick={() => photoInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors mt-2"
          >
            {photoPreview ? (
              <div className="space-y-2">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-full mx-auto"
                />
                <p className="text-sm text-green-600">Foto carregada</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                <p className="text-sm text-gray-600">
                  Clique para carregar uma foto
                </p>
              </div>
            )}
          </div>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
          />
        </div>

        {/* Services */}
        {data.services.length > 0 && (
          <div>
            <Label>Serviços que realiza</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {data.services.map((service) => (
                <div key={service.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`service-${service.id}`}
                    checked={professional.services?.includes(service.id || "")}
                    onCheckedChange={() =>
                      handleServiceToggle(
                        service.id || "",
                        professional,
                        setProfessional,
                      )
                    }
                  />
                  <Label
                    htmlFor={`service-${service.id}`}
                    className="text-sm font-normal"
                  >
                    {service.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work Days */}
        <div>
          <Label>Dias de Trabalho *</Label>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mt-2">
            {weekDays.map((day) => (
              <div key={day} className="flex items-center space-x-2">
                <Checkbox
                  id={`day-${day}`}
                  checked={professional.workDays?.includes(day)}
                  onCheckedChange={() =>
                    handleWorkDayToggle(day, professional, setProfessional)
                  }
                />
                <Label htmlFor={`day-${day}`} className="text-sm font-normal">
                  {day.substring(0, 3)}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={onSave}>
            {title.includes("Novo") ? "Adicionar" : "Salvar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Profissionais</h2>
        <p className="text-gray-600">
          Configure sua equipe de profissionais e suas especialidades
        </p>
      </div>

      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-2">
            <X className="w-5 h-5 text-red-500 mr-2" />
            <h4 className="text-red-800 font-medium">
              Corrija os seguintes erros:
            </h4>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-red-700 text-sm">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-6">
        {/* Add Professional Button */}
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Equipe de Profissionais</h3>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Profissional
          </Button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <ProfessionalForm
            professional={newProfessional}
            setProfessional={setNewProfessional}
            onSave={handleAddProfessional}
            onCancel={() => {
              setShowAddForm(false);
              setPhotoPreview(null);
            }}
            title="Novo Profissional"
          />
        )}

        {/* Professionals List */}
        {data.professionals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                Profissionais Cadastrados ({data.professionals.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.professionals.map((professional) => (
                  <div
                    key={professional.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                        style={{
                          backgroundColor: professional.calendarColor,
                        }}
                      >
                        {professional.photo ? (
                          <img
                            src={
                              typeof professional.photo === "string"
                                ? professional.photo
                                : URL.createObjectURL(professional.photo)
                            }
                            alt={professional.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          professional.name.charAt(0).toUpperCase()
                        )}
                      </div>

                      <div>
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium text-gray-900">
                            {professional.name}
                          </h4>
                          <Badge variant="outline">{professional.role}</Badge>
                          <Badge
                            variant={
                              professional.type === "employee"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {professional.type === "employee"
                              ? "Funcionário"
                              : "Autônomo"}
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {professional.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {professional.phone}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-3 h-3 mr-1" />
                            {professional.workDays.join(", ")}
                          </div>
                        </div>

                        {professional.services.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {professional.services.map((serviceId) => {
                              const service = data.services.find(
                                (s) => s.id === serviceId,
                              );
                              return service ? (
                                <Badge
                                  key={serviceId}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {service.name}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingProfessional(professional)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          professional.id && removeProfessional(professional.id)
                        }
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Modal */}
        {editingProfessional && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <ProfessionalForm
                professional={editingProfessional}
                setProfessional={setEditingProfessional}
                onSave={handleUpdateProfessional}
                onCancel={() => setEditingProfessional(null)}
                title="Editar Profissional"
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={previousStep}>
          Voltar
        </Button>
        <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
          Próximo: Horários
        </Button>
      </div>
    </div>
  );
};
