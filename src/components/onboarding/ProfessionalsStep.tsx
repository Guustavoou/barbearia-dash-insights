import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, User, Camera } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingProfessional, WorkingHours } from '@/lib/onboardingTypes';

export const ProfessionalsStep: React.FC = () => {
  const { data, addProfessional, updateProfessional, removeProfessional, nextStep, prevStep } = useOnboarding();
  
  const [newProfessional, setNewProfessional] = useState<OnboardingProfessional>({
    name: '',
    email: '',
    phone: '',
    bio: '',
    isActive: true,
    workingHours: {
      monday: { isOpen: true, start: '09:00', end: '18:00', breaks: [] },
      tuesday: { isOpen: true, start: '09:00', end: '18:00', breaks: [] },
      wednesday: { isOpen: true, start: '09:00', end: '18:00', breaks: [] },
      thursday: { isOpen: true, start: '09:00', end: '18:00', breaks: [] },
      friday: { isOpen: true, start: '09:00', end: '18:00', breaks: [] },
      saturday: { isOpen: true, start: '09:00', end: '18:00', breaks: [] },
      sunday: { isOpen: false, start: '09:00', end: '18:00', breaks: [] }
    }
  });

  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editingProfessional, setEditingProfessional] = useState<OnboardingProfessional | null>(null);

  const handleAddProfessional = () => {
    if (newProfessional.name && newProfessional.email) {
      addProfessional({
        ...newProfessional,
        id: Date.now().toString(),
        role: newProfessional.role || 'professional',
        type: newProfessional.type || 'employee',
        calendarColor: newProfessional.calendarColor || '#3B82F6',
        services: newProfessional.services || [],
        workDays: newProfessional.workDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
      });
      
      setNewProfessional({
        name: '',
        email: '',
        phone: '',
        bio: '',
        isActive: true,
        workingHours: {
          monday: { isOpen: true, start: '09:00', end: '18:00', breaks: [] },
          tuesday: { isOpen: true, start: '09:00', end: '18:00', breaks: [] },
          wednesday: { isOpen: true, start: '09:00', end: '18:00', breaks: [] },
          thursday: { isOpen: true, start: '09:00', end: '18:00', breaks: [] },
          friday: { isOpen: true, start: '09:00', end: '18:00', breaks: [] },
          saturday: { isOpen: true, start: '09:00', end: '18:00', breaks: [] },
          sunday: { isOpen: false, start: '09:00', end: '18:00', breaks: [] }
        }
      });
    }
  };

  const handleUpdateProfessional = (index: number, updates: Partial<OnboardingProfessional>) => {
    updateProfessional(index, updates);
  };

  const handleEditProfessional = (index: number) => {
    setIsEditing(index);
    setEditingProfessional(data.professionals[index]);
  };

  const handleSaveEdit = () => {
    if (isEditing !== null && editingProfessional) {
      updateProfessional(isEditing, editingProfessional);
      setIsEditing(null);
      setEditingProfessional(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditingProfessional(null);
  };

  const updateEditingProfessional = (updates: Partial<OnboardingProfessional>) => {
    if (editingProfessional) {
      setEditingProfessional({ ...editingProfessional, ...updates });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Adicionar Profissionais</h2>
        <p className="text-gray-600">
          Configure os profissionais que trabalham no seu estabelecimento.
        </p>
      </div>

      {/* Add new professional form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Novo Profissional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={newProfessional.name}
                onChange={(e) => setNewProfessional({ ...newProfessional, name: e.target.value })}
                placeholder="Nome do profissional"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newProfessional.email}
                onChange={(e) => setNewProfessional({ ...newProfessional, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={newProfessional.phone}
                onChange={(e) => setNewProfessional({ ...newProfessional, phone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="bio">Biografia</Label>
            <Textarea
              id="bio"
              value={newProfessional.bio}
              onChange={(e) => setNewProfessional({ ...newProfessional, bio: e.target.value })}
              placeholder="Breve descrição sobre o profissional..."
            />
          </div>

          <Button onClick={handleAddProfessional} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Profissional
          </Button>
        </CardContent>
      </Card>

      {/* List of professionals */}
      {data.professionals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Profissionais Adicionados ({data.professionals.length})</h3>
          
          {data.professionals.map((professional, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                {isEditing === index ? (
                  // Edit mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nome</Label>
                        <Input
                          value={editingProfessional?.name || ''}
                          onChange={(e) => updateEditingProfessional({ name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          value={editingProfessional?.email || ''}
                          onChange={(e) => updateEditingProfessional({ email: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={handleSaveEdit} size="sm">Salvar</Button>
                      <Button onClick={handleCancelEdit} variant="outline" size="sm">Cancelar</Button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{professional.name}</p>
                        <p className="text-sm text-gray-500">{professional.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={professional.isActive ? 'default' : 'secondary'}>
                        {professional.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <Button
                        onClick={() => handleEditProfessional(index)}
                        variant="outline"
                        size="sm"
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => removeProfessional(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between pt-6">
        <Button onClick={prevStep} variant="outline">
          Voltar
        </Button>
        <Button onClick={nextStep} disabled={data.professionals.length === 0}>
          Continuar
        </Button>
      </div>
    </div>
  );
};
