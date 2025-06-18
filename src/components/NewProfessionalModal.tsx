
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/unclicUtils';

interface NewProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (professionalData: any) => void;
  darkMode: boolean;
}

export const NewProfessionalModal: React.FC<NewProfessionalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  darkMode
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    status: 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      bio: '',
      status: 'active'
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
          <h2 className="text-xl font-semibold">Novo Profissional</h2>
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
            <label className="block text-sm font-medium mb-1">Nome</label>
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
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={cn(
                "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Telefone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className={cn(
                "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              className={cn(
                "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
              )}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className={cn(
                "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
              )}
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
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
