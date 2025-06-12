import React, { useState } from "react";
import {
  FileText,
  Upload,
  Download,
  Search,
  Filter,
  Folder,
  File,
  Image,
  FileSpreadsheet,
  Eye,
  Trash2,
  Plus,
  FolderPlus,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";

interface DocumentsProps {
  darkMode: boolean;
}

interface Document {
  id: string;
  name: string;
  type: "pdf" | "image" | "spreadsheet" | "document" | "folder";
  size: number;
  createdAt: string;
  modifiedAt: string;
  category: string;
  isFolder: boolean;
  parentId?: string;
  description?: string;
  tags: string[];
}

const documents: Document[] = [
  {
    id: "1",
    name: "Contratos de Trabalho",
    type: "folder",
    size: 0,
    createdAt: "2024-01-01",
    modifiedAt: "2024-01-15",
    category: "Recursos Humanos",
    isFolder: true,
    description: "Contratos de todos os funcionários",
    tags: ["RH", "Contratos"],
  },
  {
    id: "2",
    name: "Relatório Financeiro Janeiro 2024.pdf",
    type: "pdf",
    size: 2.4,
    createdAt: "2024-01-31",
    modifiedAt: "2024-01-31",
    category: "Financeiro",
    isFolder: false,
    description: "Relatório mensal de receitas e despesas",
    tags: ["Financeiro", "Relatório", "2024"],
  },
  {
    id: "3",
    name: "Fotos do Salão",
    type: "folder",
    size: 0,
    createdAt: "2023-12-01",
    modifiedAt: "2024-01-10",
    category: "Marketing",
    isFolder: true,
    description: "Fotos promocionais e do ambiente",
    tags: ["Marketing", "Fotos"],
  },
  {
    id: "4",
    name: "Logo Unclic.png",
    type: "image",
    size: 0.8,
    createdAt: "2024-01-05",
    modifiedAt: "2024-01-05",
    category: "Marketing",
    isFolder: false,
    description: "Logo oficial da empresa",
    tags: ["Logo", "Branding"],
  },
  {
    id: "5",
    name: "Planilha de Comissões.xlsx",
    type: "spreadsheet",
    size: 1.2,
    createdAt: "2024-01-20",
    modifiedAt: "2024-01-25",
    category: "Recursos Humanos",
    isFolder: false,
    description: "Cálculo de comissões dos profissionais",
    tags: ["RH", "Comissões", "Planilha"],
  },
  {
    id: "6",
    name: "Certificados Sanitários",
    type: "folder",
    size: 0,
    createdAt: "2023-11-15",
    modifiedAt: "2024-01-12",
    category: "Documentação",
    isFolder: true,
    description: "Licenças e certificados obrigatórios",
    tags: ["Documentação", "Licenças"],
  },
  {
    id: "7",
    name: "Manual de Procedimentos.docx",
    type: "document",
    size: 3.1,
    createdAt: "2023-12-20",
    modifiedAt: "2024-01-08",
    category: "Operacional",
    isFolder: false,
    description: "Procedimentos padrão do salão",
    tags: ["Manual", "Procedimentos"],
  },
  {
    id: "8",
    name: "Nota Fiscal Janeiro.pdf",
    type: "pdf",
    size: 0.9,
    createdAt: "2024-01-25",
    modifiedAt: "2024-01-25",
    category: "Financeiro",
    isFolder: false,
    description: "Notas fiscais do mês de janeiro",
    tags: ["Fiscal", "Janeiro", "2024"],
  },
];

export const Documents: React.FC<DocumentsProps> = ({ darkMode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  const categories = [
    "Todos",
    "Financeiro",
    "Recursos Humanos",
    "Marketing",
    "Documentação",
    "Operacional",
  ];

  const getFileIcon = (type: Document["type"]) => {
    switch (type) {
      case "folder":
        return <Folder className="h-8 w-8 text-yellow-500" />;
      case "pdf":
        return <FileText className="h-8 w-8 text-red-500" />;
      case "image":
        return <Image className="h-8 w-8 text-green-500" />;
      case "spreadsheet":
        return <FileSpreadsheet className="h-8 w-8 text-blue-500" />;
      case "document":
        return <File className="h-8 w-8 text-purple-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB === 0) return "-";
    if (sizeInMB < 1) return `${(sizeInMB * 1024).toFixed(0)} KB`;
    return `${sizeInMB.toFixed(1)} MB`;
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesCategory =
      selectedCategory === "Todos" || doc.category === selectedCategory;
    const matchesFolder = currentFolder ? doc.parentId === currentFolder : true;
    return matchesSearch && matchesCategory && matchesFolder;
  });

  const renderGridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {filteredDocuments.map((doc) => (
        <div
          key={doc.id}
          className={cn(
            "p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md",
            darkMode
              ? "border-gray-700 bg-gray-800 hover:bg-gray-750"
              : "border-gray-200 bg-white hover:bg-gray-50",
          )}
          onDoubleClick={() => {
            if (doc.isFolder) {
              setCurrentFolder(doc.id);
            }
          }}
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-3">{getFileIcon(doc.type)}</div>
            <h4
              className={cn(
                "font-medium text-sm mb-1 line-clamp-2",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              {doc.name}
            </h4>
            <p
              className={cn(
                "text-xs",
                darkMode ? "text-gray-400" : "text-gray-500",
              )}
            >
              {formatFileSize(doc.size)}
            </p>
            <p
              className={cn(
                "text-xs mt-1",
                darkMode ? "text-gray-400" : "text-gray-500",
              )}
            >
              {new Date(doc.modifiedAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div className="flex justify-center mt-3 gap-1">
            <button
              className={cn(
                "p-1 rounded",
                darkMode
                  ? "hover:bg-gray-700 text-gray-300"
                  : "hover:bg-gray-200 text-gray-600",
              )}
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              className={cn(
                "p-1 rounded",
                darkMode
                  ? "hover:bg-gray-700 text-gray-300"
                  : "hover:bg-gray-200 text-gray-600",
              )}
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              className={cn(
                "p-1 rounded",
                darkMode
                  ? "hover:bg-gray-700 text-red-400"
                  : "hover:bg-gray-200 text-red-600",
              )}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div
      className={cn(
        "rounded-lg border overflow-hidden",
        darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white",
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead
            className={cn(
              "border-b",
              darkMode
                ? "border-gray-700 bg-gray-900"
                : "border-gray-200 bg-gray-50",
            )}
          >
            <tr>
              <th
                className={cn(
                  "text-left p-4 font-medium",
                  darkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                Nome
              </th>
              <th
                className={cn(
                  "text-left p-4 font-medium",
                  darkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                Tipo
              </th>
              <th
                className={cn(
                  "text-left p-4 font-medium",
                  darkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                Tamanho
              </th>
              <th
                className={cn(
                  "text-left p-4 font-medium",
                  darkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                Modificado
              </th>
              <th
                className={cn(
                  "text-left p-4 font-medium",
                  darkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                Categoria
              </th>
              <th
                className={cn(
                  "text-left p-4 font-medium",
                  darkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((doc) => (
              <tr
                key={doc.id}
                className={cn(
                  "border-b transition-colors cursor-pointer",
                  darkMode
                    ? "border-gray-700 hover:bg-gray-750"
                    : "border-gray-200 hover:bg-gray-50",
                )}
                onDoubleClick={() => {
                  if (doc.isFolder) {
                    setCurrentFolder(doc.id);
                  }
                }}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {getFileIcon(doc.type)}
                    <div>
                      <p
                        className={cn(
                          "font-medium",
                          darkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {doc.name}
                      </p>
                      {doc.description && (
                        <p
                          className={cn(
                            "text-sm",
                            darkMode ? "text-gray-400" : "text-gray-600",
                          )}
                        >
                          {doc.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td
                  className={cn(
                    "p-4 capitalize",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  {doc.isFolder ? "Pasta" : doc.type}
                </td>
                <td
                  className={cn(
                    "p-4",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  {formatFileSize(doc.size)}
                </td>
                <td
                  className={cn(
                    "p-4",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  {new Date(doc.modifiedAt).toLocaleDateString("pt-BR")}
                </td>
                <td
                  className={cn(
                    "p-4",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  <span
                    className={cn(
                      "px-2 py-1 text-xs rounded-full",
                      darkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-600",
                    )}
                  >
                    {doc.category}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      className={cn(
                        "p-2 rounded-lg",
                        darkMode
                          ? "hover:bg-gray-700 text-gray-300"
                          : "hover:bg-gray-100 text-gray-600",
                      )}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className={cn(
                        "p-2 rounded-lg",
                        darkMode
                          ? "hover:bg-gray-700 text-gray-300"
                          : "hover:bg-gray-100 text-gray-600",
                      )}
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      className={cn(
                        "p-2 rounded-lg",
                        darkMode
                          ? "hover:bg-gray-700 text-red-400"
                          : "hover:bg-gray-100 text-red-600",
                      )}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={cn(
              "text-2xl font-bold",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            Documentos
          </h1>
          <p
            className={cn(
              "text-sm mt-1",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            Gerencie todos os documentos e arquivos do seu negócio
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            className={cn(
              "px-4 py-2 rounded-lg border transition-colors",
              darkMode
                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50",
            )}
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            Nova Pasta
          </button>

          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </button>
        </div>
      </div>

      {/* Breadcrumb and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentFolder(null)}
            className={cn(
              "text-sm px-3 py-1 rounded-lg transition-colors",
              !currentFolder
                ? "bg-blue-500 text-white"
                : darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100",
            )}
          >
            📁 Raiz
          </button>
          {currentFolder && (
            <>
              <span
                className={cn(darkMode ? "text-gray-400" : "text-gray-500")}
              >
                /
              </span>
              <span
                className={cn(
                  "text-sm px-3 py-1 rounded-lg bg-blue-500 text-white",
                )}
              >
                {documents.find((d) => d.id === currentFolder)?.name}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4",
                darkMode ? "text-gray-400" : "text-gray-500",
              )}
            />
            <input
              type="text"
              placeholder="Buscar documentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "pl-10 pr-4 py-2 w-64 rounded-lg border",
                darkMode
                  ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 placeholder-gray-500",
              )}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={cn(
              "px-3 py-2 rounded-lg border",
              darkMode
                ? "bg-gray-800 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900",
            )}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <div
            className={cn(
              "flex items-center rounded-lg border",
              darkMode
                ? "border-gray-600 bg-gray-800"
                : "border-gray-300 bg-white",
            )}
          >
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "grid"
                  ? "bg-blue-500 text-white"
                  : darkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-100",
              )}
            >
              <div className="grid grid-cols-2 gap-1 w-4 h-4">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "list"
                  ? "bg-blue-500 text-white"
                  : darkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-100",
              )}
            >
              <div className="flex flex-col gap-1 w-4 h-4">
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Document Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div
          className={cn(
            "p-6 rounded-lg border",
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white",
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Total de Arquivos
              </p>
              <p
                className={cn(
                  "text-2xl font-bold mt-1",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {documents.filter((d) => !d.isFolder).length}
              </p>
            </div>
            <FileText className="h-10 w-10 text-blue-500" />
          </div>
        </div>

        <div
          className={cn(
            "p-6 rounded-lg border",
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white",
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Pastas
              </p>
              <p
                className={cn(
                  "text-2xl font-bold mt-1",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {documents.filter((d) => d.isFolder).length}
              </p>
            </div>
            <Folder className="h-10 w-10 text-yellow-500" />
          </div>
        </div>

        <div
          className={cn(
            "p-6 rounded-lg border",
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white",
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Espaço Usado
              </p>
              <p
                className={cn(
                  "text-2xl font-bold mt-1",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {formatFileSize(
                  documents
                    .filter((d) => !d.isFolder)
                    .reduce((total, doc) => total + doc.size, 0),
                )}
              </p>
            </div>
            <Upload className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <div
          className={cn(
            "p-6 rounded-lg border",
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white",
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Últimos 7 dias
              </p>
              <p
                className={cn(
                  "text-2xl font-bold mt-1",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                12
              </p>
            </div>
            <Plus className="h-10 w-10 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Document Content */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3
            className={cn(
              "text-xl font-semibold mb-2",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            Nenhum documento encontrado
          </h3>
          <p className={cn("text-gray-500 dark:text-gray-400 mb-6")}>
            Não encontramos documentos com os filtros aplicados
          </p>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Upload className="h-4 w-4 mr-2" />
            Fazer Upload
          </button>
        </div>
      ) : viewMode === "grid" ? (
        renderGridView()
      ) : (
        renderListView()
      )}
    </div>
  );
};
