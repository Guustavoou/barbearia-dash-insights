
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Phone, Mail, MapPin, Edit3, Save, X } from 'lucide-react';
import { Client } from '@/lib/types';

interface ClientDetailsModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
}

const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({
  client,
  isOpen,
  onClose,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState<Client | null>(null);

  React.useEffect(() => {
    if (client) {
      setEditedClient({ ...client });
    }
  }, [client]);

  if (!client) return null;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedClient({ ...client });
  };

  const handleSave = () => {
    if (editedClient) {
      onSave(editedClient);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedClient({ ...client });
  };

  const handleChange = (field: keyof Client, value: string | number) => {
    if (editedClient) {
      setEditedClient({
        ...editedClient,
        [field]: value,
      });
    }
  };

  const formatCurrency = (value: number | undefined) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Não informado';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  const currentClient = isEditing ? editedClient : client;
  if (!currentClient) return null;

  // Use the new camelCase properties or fallback to snake_case for compatibility
  const joinDate = currentClient.joinDate || currentClient.join_date || currentClient.createdAt;
  const totalSpent = currentClient.totalSpent || currentClient.total_spent || 0;
  const lastVisit = currentClient.lastVisit || currentClient.last_visit;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            {isEditing ? 'Editar Cliente' : 'Detalhes do Cliente'}
          </DialogTitle>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Salvar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancelar
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={handleEdit}
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Editar
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Pessoais */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-gray-900">
              Informações Pessoais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={currentClient.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{currentClient.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={currentClient.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <div className="mt-1 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-900">{currentClient.email}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={currentClient.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <div className="mt-1 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-900">{currentClient.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="city">Cidade</Label>
                {isEditing ? (
                  <Input
                    id="city"
                    value={currentClient.city || ''}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <div className="mt-1 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-900">{currentClient.city || 'Não informado'}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="birthday">Data de Nascimento</Label>
                {isEditing ? (
                  <Input
                    id="birthday"
                    type="date"
                    value={currentClient.birthday || ''}
                    onChange={(e) => handleChange('birthday', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <div className="mt-1 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {currentClient.birthday ? formatDate(currentClient.birthday) : 'Não informado'}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <Label>Status</Label>
                {isEditing ? (
                  <select
                    value={currentClient.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                ) : (
                  <div className="mt-1">
                    <Badge variant={currentClient.status === 'ativo' ? 'default' : 'secondary'}>
                      {currentClient.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-gray-900">
              Estatísticas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalSpent)}
                </div>
                <div className="text-sm text-gray-600">Total Gasto</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {currentClient.visits || 0}
                </div>
                <div className="text-sm text-gray-600">Visitas</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {lastVisit ? formatDate(lastVisit) : 'Nunca'}
                </div>
                <div className="text-sm text-gray-600">Última Visita</div>
              </div>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-gray-900">
              Informações Adicionais
            </h3>
            <div className="space-y-4">
              <div>
                <Label>Data de Cadastro</Label>
                <div className="mt-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    {formatDate(joinDate)}
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Observações</Label>
                {isEditing ? (
                  <Textarea
                    id="notes"
                    value={currentClient.notes || ''}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Adicione observações sobre o cliente..."
                    className="mt-1"
                    rows={3}
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                    {currentClient.notes || 'Nenhuma observação registrada.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailsModal;
