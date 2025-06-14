import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Scissors,
  Clock,
  DollarSign,
  Star,
  Edit,
  Trash2,
} from "lucide-react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useOnboardingHelpers } from "@/hooks/useOnboarding";
import {
  OnboardingService,
  serviceTemplates,
  ServiceTemplate,
} from "@/lib/onboardingTypes";

export const ServicesStep: React.FC = () => {
  const {
    data,
    addService,
    updateService,
    removeService,
    nextStep,
    previousStep,
  } = useOnboarding();
  const { validateServices, getServiceTemplatesByCategory } =
    useOnboardingHelpers();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] =
    useState<OnboardingService | null>(null);
  const [newService, setNewService] = useState<Partial<OnboardingService>>({
    name: "",
    duration: 30,
    price: 0,
    description: "",
    category: "",
    active: true,
  });
  const [errors, setErrors] = useState<string[]>([]);

  const categories = getServiceTemplatesByCategory();

  const handleAddTemplate = (template: ServiceTemplate) => {
    addService({
      ...template,
      id: Date.now().toString(),
      active: true,
    });
  };

  const handleAddCustomService = () => {
    if (
      newService.name &&
      newService.duration &&
      newService.price &&
      newService.category
    ) {
      addService({
        id: Date.now().toString(),
        name: newService.name,
        duration: newService.duration,
        price: newService.price,
        description: newService.description || "",
        category: newService.category,
        active: true,
      });
      setNewService({
        name: "",
        duration: 30,
        price: 0,
        description: "",
        category: "",
        active: true,
      });
      setShowAddForm(false);
    }
  };

  const handleUpdateService = () => {
    if (editingService && editingService.id) {
      updateService(editingService.id, editingService);
      setEditingService(null);
    }
  };

  const handleNext = () => {
    const validation = validateServices(data.services);
    if (validation.isValid) {
      nextStep();
    } else {
      setErrors(validation.errors);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Serviços</h2>
        <p className="text-gray-600">
          Configure o catálogo de serviços do seu estabelecimento
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

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="templates">Modelos Prontos</TabsTrigger>
          <TabsTrigger value="custom">Personalizado</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">
              Escolha dos nossos modelos prontos
            </h3>
            <p className="text-gray-600 mb-6">
              Selecione os serviços mais comuns para seu tipo de estabelecimento
            </p>
          </div>

          {Object.entries(categories).map(([category, templates]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scissors className="w-5 h-5 mr-2" />
                  {category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => {
                    const isAdded = data.services.some(
                      (service) => service.name === template.name,
                    );
                    return (
                      <div
                        key={template.id}
                        className={`p-4 border rounded-lg ${
                          isAdded
                            ? "border-green-300 bg-green-50"
                            : "border-gray-200 hover:border-blue-300 cursor-pointer"
                        } transition-colors`}
                        onClick={() => !isAdded && handleAddTemplate(template)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">
                            {template.name}
                          </h4>
                          {isAdded && (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-700"
                            >
                              Adicionado
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {template.duration} min
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {formatPrice(template.price)}
                          </div>
                        </div>
                        {template.description && (
                          <p className="text-xs text-gray-500 mt-2">
                            {template.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Serviços Personalizados</h3>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Serviço
            </Button>
          </div>

          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>Novo Serviço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="serviceName">Nome do Serviço</Label>
                    <Input
                      id="serviceName"
                      placeholder="Ex: Corte Especial"
                      value={newService.name}
                      onChange={(e) =>
                        setNewService({ ...newService, name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="serviceCategory">Categoria</Label>
                    <Select
                      value={newService.category}
                      onValueChange={(value) =>
                        setNewService({ ...newService, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(categories).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="serviceDuration">Duração (minutos)</Label>
                    <Input
                      id="serviceDuration"
                      type="number"
                      value={newService.duration}
                      onChange={(e) =>
                        setNewService({
                          ...newService,
                          duration: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="servicePrice">Preço (R$)</Label>
                    <Input
                      id="servicePrice"
                      type="number"
                      step="0.01"
                      value={newService.price}
                      onChange={(e) =>
                        setNewService({
                          ...newService,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="serviceDescription">
                    Descrição (opcional)
                  </Label>
                  <Textarea
                    id="serviceDescription"
                    placeholder="Descrição do serviço"
                    value={newService.description}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleAddCustomService}>Adicionar</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Services List */}
      {data.services.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Serviços Cadastrados ({data.services.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900">
                        {service.name}
                      </h4>
                      <Badge variant="outline">{service.category}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {service.duration} min
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {formatPrice(service.price)}
                      </div>
                    </div>
                    {service.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {service.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingService(service)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => service.id && removeService(service.id)}
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
      {editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>Editar Serviço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editName">Nome do Serviço</Label>
                  <Input
                    id="editName"
                    value={editingService.name}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="editCategory">Categoria</Label>
                  <Select
                    value={editingService.category}
                    onValueChange={(value) =>
                      setEditingService({
                        ...editingService,
                        category: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(categories).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="editDuration">Duração (minutos)</Label>
                  <Input
                    id="editDuration"
                    type="number"
                    value={editingService.duration}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        duration: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="editPrice">Preço (R$)</Label>
                  <Input
                    id="editPrice"
                    type="number"
                    step="0.01"
                    value={editingService.price}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="editDescription">Descrição</Label>
                <Textarea
                  id="editDescription"
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingService(null)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleUpdateService}>Salvar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={previousStep}>
          Voltar
        </Button>
        <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
          Próximo: Profissionais
        </Button>
      </div>
    </div>
  );
};
