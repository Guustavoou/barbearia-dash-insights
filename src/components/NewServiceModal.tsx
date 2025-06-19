
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/unclicUtils';
import { ServiceCategory } from '@/lib/servicesTypes';

interface NewServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (serviceData: any) => void;
  darkMode: boolean;
}

export const NewServiceModal: React.FC<NewServiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  darkMode
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'cabelo' as ServiceCategory,
    price: '',
    duration: '',
    is_active: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseFloat(formData.price) || 0,
      duration: parseInt(formData.duration) || 60
    });
    setFormData({
      name: '',
      description: '',
      category: 'cabelo',
      price: '',
      duration: '',
      is_active: true
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={cn(
        "bg-white rounded-lg p-6 w-full max-w-md mx-4",
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      )}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Novo Serviço</h2>
          <button
            onClick={onClose}
            className={cn(
              "p-2 rounded-lg hover:bg-gray-100",
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome do Serviço</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={cn(
                "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
              )}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className={cn(
                "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
              )}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Categoria</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ServiceCategory }))}
              className={cn(
                "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
              )}
            >
              <option value="cabelo">Cabelo</option>
              <option value="barba">Barba</option>
              <option value="manicure">Manicure</option>
              <option value="pedicure">Pedicure</option>
              <option value="estetica">Estética</option>
              <option value="massagem">Massagem</option>
              <option value="outros">Outros</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className={cn(
                  "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                  darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                )}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Duração (min)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className={cn(
                  "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                  darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                )}
                required
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="mr-2"
            />
            <label htmlFor="is_active" className="text-sm">Serviço ativo</label>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "flex-1 px-4 py-2 border rounded-lg font-medium",
                darkMode 
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700" 
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              )}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
