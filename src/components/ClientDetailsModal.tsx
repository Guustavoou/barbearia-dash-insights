import React, { useState } from "react";
import { X, Edit3, Calendar, Phone, Mail, Trash2, Save } from "lucide-react";
import {
  cn,
  formatCurrency,
  formatDate,
  getClientStatusColor,
} from "@/lib/unclicUtils";
import { Client } from "@/lib/types";

interface ClientDetailsModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateClient: (id: string, updates: any) => Promise<void>;
  onDeleteClient: (id: string) => Promise<void>;
  darkMode: boolean;
}

export const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({
  client,
  isOpen,
  onClose,
  onUpdateClient,
  onDeleteClient,
  darkMode,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Client>>({});

  if (!isOpen || !client) return null;

  const handleEdit = () => {
    setEditData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      city: client.city,
      cpf: client.cpf,
      profession: client.profession,
      status: client.status,
      notes: client.notes,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    await onUpdateClient(client.id, editData);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await onDeleteClient(client.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={cn(
          "w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl",
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
            {isEditing ? "Editar Cliente" : "Detalhes do Cliente"}
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Client Avatar and Basic Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {(isEditing ? editData.name || client.name : client.name)
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name || ""}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className={cn(
                    "text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none",
                    darkMode ? "text-white border-gray-600" : "text-gray-900"
                  )}
                />
              ) : (
                <h3
                  className={cn(
                    "text-lg font-semibold",
                    darkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {client.name}
                </h3>
              )}
              <div className="flex items-center gap-2 mt-1">
                {isEditing ? (
                  <select
                    value={editData.status || client.status}
                    onChange={(e) => setEditData({...editData, status: e.target.value as "ativo" | "inativo"})}
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium border",
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                    )}
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                ) : (
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      getClientStatusColor(client.status),
                    )}
                  >
                    {client.status}
                  </span>
                )}
                <span
                  className={cn(
                    "text-sm",
                    darkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  Cliente desde {client.join_date ? formatDate(new Date(client.join_date)) : 'Data não informada'}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div
            className={cn(
              "rounded-xl p-4 border",
              darkMode
                ? "bg-gray-700 border-gray-600"
                : "bg-gray-50 border-gray-200",
            )}
          >
            <h4
              className={cn(
                "font-semibold mb-3",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              Informações Pessoais
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone
                    className={cn(
                      "h-4 w-4",
                      darkMode ? "text-gray-400" : "text-gray-500",
                    )}
                  />
                  <div className="flex-1">
                    <span
                      className={cn(
                        "text-xs",
                        darkMode ? "text-gray-400" : "text-gray-500",
                      )}
                    >
                      Telefone
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.phone || ""}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        className={cn(
                          "w-full text-sm font-medium bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none",
                          darkMode ? "text-white border-gray-600" : "text-gray-900"
                        )}
                      />
                    ) : (
                      <p
                        className={cn(
                          "text-sm font-medium",
                          darkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {client.phone || 'Não informado'}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail
                    className={cn(
                      "h-4 w-4",
                      darkMode ? "text-gray-400" : "text-gray-500",
                    )}
                  />
                  <div className="flex-1">
                    <span
                      className={cn(
                        "text-xs",
                        darkMode ? "text-gray-400" : "text-gray-500",
                      )}
                    >
                      E-mail
                    </span>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.email || ""}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        className={cn(
                          "w-full text-sm font-medium bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none",
                          darkMode ? "text-white border-gray-600" : "text-gray-900"
                        )}
                      />
                    ) : (
                      <p
                        className={cn(
                          "text-sm font-medium",
                          darkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {client.email || 'Não informado'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span
                    className={cn(
                      "text-xs",
                      darkMode ? "text-gray-400" : "text-gray-500",
                    )}
                  >
                    CPF
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.cpf || ""}
                      onChange={(e) => setEditData({...editData, cpf: e.target.value})}
                      className={cn(
                        "w-full text-sm font-medium bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none",
                        darkMode ? "text-white border-gray-600" : "text-gray-900"
                      )}
                    />
                  ) : (
                    <p
                      className={cn(
                        "text-sm font-medium",
                        darkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {client.cpf || 'Não informado'}
                    </p>
                  )}
                </div>
                <div>
                  <span
                    className={cn(
                      "text-xs",
                      darkMode ? "text-gray-400" : "text-gray-500",
                    )}
                  >
                    Profissão
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.profession || ""}
                      onChange={(e) => setEditData({...editData, profession: e.target.value})}
                      className={cn(
                        "w-full text-sm font-medium bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none",
                        darkMode ? "text-white border-gray-600" : "text-gray-900"
                      )}
                    />
                  ) : (
                    <p
                      className={cn(
                        "text-sm font-medium",
                        darkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {client.profession || 'Não informada'}
                    </p>
                  )}
                </div>
                <div>
                  <span
                    className={cn(
                      "text-xs",
                      darkMode ? "text-gray-400" : "text-gray-500",
                    )}
                  >
                    Cidade
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.city || ""}
                      onChange={(e) => setEditData({...editData, city: e.target.value})}
                      className={cn(
                        "w-full text-sm font-medium bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none",
                        darkMode ? "text-white border-gray-600" : "text-gray-900"
                      )}
                    />
                  ) : (
                    <p
                      className={cn(
                        "text-sm font-medium",
                        darkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {client.city || 'Não informada'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div
            className={cn(
              "rounded-xl p-4 border",
              darkMode
                ? "bg-gray-700 border-gray-600"
                : "bg-gray-50 border-gray-200",
            )}
          >
            <h4
              className={cn(
                "font-semibold mb-3",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              Histórico
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p
                  className={cn(
                    "text-2xl font-bold",
                    darkMode ? "text-blue-400" : "text-blue-600",
                  )}
                >
                  {client.visits || 0}
                </p>
                <span
                  className={cn(
                    "text-xs",
                    darkMode ? "text-gray-400" : "text-gray-500",
                  )}
                >
                  Total de visitas
                </span>
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-2xl font-bold",
                    darkMode ? "text-green-400" : "text-green-600",
                  )}
                >
                  {formatCurrency(client.total_spent || 0)}
                </p>
                <span
                  className={cn(
                    "text-xs",
                    darkMode ? "text-gray-400" : "text-gray-500",
                  )}
                >
                  Total gasto
                </span>
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-2xl font-bold",
                    darkMode ? "text-purple-400" : "text-purple-600",
                  )}
                >
                  {client.last_visit ? formatDate(new Date(client.last_visit)) : 'Nunca'}
                </p>
                <span
                  className={cn(
                    "text-xs",
                    darkMode ? "text-gray-400" : "text-gray-500",
                  )}
                >
                  Última visita
                </span>
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-2xl font-bold",
                    darkMode ? "text-orange-400" : "text-orange-600",
                  )}
                >
                  {client.visits && client.total_spent ? Math.round((client.total_spent || 0) / (client.visits || 1)) : 0}
                </p>
                <span
                  className={cn(
                    "text-xs",
                    darkMode ? "text-gray-400" : "text-gray-500",
                  )}
                >
                  Ticket médio
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div
            className={cn(
              "rounded-xl p-4 border",
              darkMode
                ? "bg-gray-700 border-gray-600"
                : "bg-gray-50 border-gray-200",
            )}
          >
            <h4
              className={cn(
                "font-semibold mb-2",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              Observações
            </h4>
            {isEditing ? (
              <textarea
                value={editData.notes || ""}
                onChange={(e) => setEditData({...editData, notes: e.target.value})}
                rows={3}
                className={cn(
                  "w-full text-sm leading-relaxed bg-transparent border border-gray-300 rounded p-2 focus:border-blue-500 outline-none resize-none",
                  darkMode ? "text-gray-300 border-gray-600" : "text-gray-700"
                )}
                placeholder="Adicione observações sobre o cliente..."
              />
            ) : (
              <p
                className={cn(
                  "text-sm leading-relaxed",
                  darkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                {client.notes || 'Nenhuma observação'}
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className={cn(
            "sticky bottom-0 flex gap-3 p-6 border-t",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                  darkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50",
                )}
              >
                <X className="h-4 w-4" />
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                Salvar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEdit}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                  darkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50",
                )}
              >
                <Edit3 className="h-4 w-4" />
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Calendar className="h-4 w-4" />
                Agendar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
