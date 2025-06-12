import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Clock,
  User,
  Calendar,
  FileText,
  Scissors,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";

interface GlobalSearchProps {
  darkMode: boolean;
  onNavigate: (page: string, item?: any) => void;
}

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: "client" | "appointment" | "service" | "document" | "page";
  icon: React.ReactNode;
  page: string;
  data?: any;
}

const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    title: "Maria Silva",
    subtitle: "Cliente • Última visita: 15/01/2024",
    type: "client",
    icon: <User className="h-4 w-4" />,
    page: "clients",
  },
  {
    id: "2",
    title: "Corte + Escova - Ana Costa",
    subtitle: "Hoje 14:30 • Confirmado",
    type: "appointment",
    icon: <Calendar className="h-4 w-4" />,
    page: "appointments",
  },
  {
    id: "3",
    title: "Coloração Completa",
    subtitle: "Serviço • R$ 120,00 • 2h duração",
    type: "service",
    icon: <Scissors className="h-4 w-4" />,
    page: "services",
  },
  {
    id: "4",
    title: "João Santos",
    subtitle: "Cliente • 15 visitas • Último: Corte + Barba",
    type: "client",
    icon: <User className="h-4 w-4" />,
    page: "clients",
  },
  {
    id: "5",
    title: "Relatório Financeiro Janeiro",
    subtitle: "Documento • PDF • 2.4 MB",
    type: "document",
    icon: <FileText className="h-4 w-4" />,
    page: "documents",
  },
  {
    id: "6",
    title: "Manicure",
    subtitle: "Serviço • R$ 35,00 • 1h duração",
    type: "service",
    icon: <Scissors className="h-4 w-4" />,
    page: "services",
  },
];

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  darkMode,
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter results based on query
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const filtered = mockSearchResults.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()),
    );
    setResults(filtered);
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search with Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
        return;
      }

      // Close search with Escape
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
        return;
      }

      // Navigate results with arrow keys
      if (isOpen && results.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex(
            (prev) => (prev - 1 + results.length) % results.length,
          );
        } else if (e.key === "Enter") {
          e.preventDefault();
          handleSelectResult(results[selectedIndex]);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectResult = (result: SearchResult) => {
    onNavigate(result.page, result.data);
    setIsOpen(false);
    setQuery("");
  };

  const getTypeColor = (type: SearchResult["type"]) => {
    switch (type) {
      case "client":
        return "text-blue-500";
      case "appointment":
        return "text-green-500";
      case "service":
        return "text-purple-500";
      case "document":
        return "text-orange-500";
      default:
        return "text-gray-500";
    }
  };

  const getTypeLabel = (type: SearchResult["type"]) => {
    switch (type) {
      case "client":
        return "Cliente";
      case "appointment":
        return "Agendamento";
      case "service":
        return "Serviço";
      case "document":
        return "Documento";
      default:
        return "";
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors w-64",
          darkMode
            ? "border-gray-600 bg-gray-800 text-gray-400 hover:bg-gray-700"
            : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50",
        )}
      >
        <Search className="h-4 w-4" />
        <span className="text-sm">Buscar...</span>
        <div className="ml-auto flex items-center gap-1">
          <kbd
            className={cn(
              "px-1.5 py-0.5 text-xs rounded border",
              darkMode
                ? "border-gray-600 bg-gray-700 text-gray-300"
                : "border-gray-300 bg-gray-100 text-gray-600",
            )}
          >
            ⌘
          </kbd>
          <kbd
            className={cn(
              "px-1.5 py-0.5 text-xs rounded border",
              darkMode
                ? "border-gray-600 bg-gray-700 text-gray-300"
                : "border-gray-300 bg-gray-100 text-gray-600",
            )}
          >
            K
          </kbd>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Search Modal */}
      <div
        ref={searchRef}
        className={cn(
          "relative w-full max-w-2xl rounded-lg border shadow-xl",
          darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white",
        )}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar clientes, agendamentos, serviços..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={cn(
              "flex-1 text-lg bg-transparent outline-none",
              darkMode
                ? "text-white placeholder-gray-400"
                : "text-gray-900 placeholder-gray-500",
            )}
            autoFocus
          />
          <button
            onClick={() => setIsOpen(false)}
            className={cn(
              "px-2 py-1 text-xs rounded border",
              darkMode
                ? "border-gray-600 bg-gray-700 text-gray-300"
                : "border-gray-300 bg-gray-100 text-gray-600",
            )}
          >
            ESC
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {query === "" ? (
            <div className="p-8 text-center">
              <Search className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p
                className={cn(
                  "text-lg font-medium mb-2",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                Busca Global
              </p>
              <p className={cn(darkMode ? "text-gray-400" : "text-gray-600")}>
                Digite para buscar clientes, agendamentos, serviços e muito mais
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Use</span>
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 border rounded">
                  ↑
                </kbd>
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 border rounded">
                  ↓
                </kbd>
                <span>para navegar</span>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <p
                className={cn(
                  "text-lg font-medium mb-2",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                Nenhum resultado encontrado
              </p>
              <p className={cn(darkMode ? "text-gray-400" : "text-gray-600")}>
                Tente buscar por outros termos
              </p>
            </div>
          ) : (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectResult(result)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                    index === selectedIndex
                      ? darkMode
                        ? "bg-gray-700"
                        : "bg-gray-100"
                      : darkMode
                        ? "hover:bg-gray-750"
                        : "hover:bg-gray-50",
                  )}
                >
                  <div
                    className={cn("flex-shrink-0", getTypeColor(result.type))}
                  >
                    {result.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "font-medium truncate",
                        darkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {result.title}
                    </p>
                    <p
                      className={cn(
                        "text-sm truncate",
                        darkMode ? "text-gray-400" : "text-gray-600",
                      )}
                    >
                      {result.subtitle}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "flex-shrink-0 text-xs px-2 py-1 rounded-full",
                      darkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-600",
                    )}
                  >
                    {getTypeLabel(result.type)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div
            className={cn(
              "flex items-center justify-between px-4 py-3 border-t text-xs",
              darkMode
                ? "border-gray-700 text-gray-400"
                : "border-gray-200 text-gray-600",
            )}
          >
            <span>
              {results.length} resultado{results.length !== 1 ? "s" : ""}{" "}
              encontrado{results.length !== 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-2">
              <span>Pressione</span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 border rounded">
                ↵
              </kbd>
              <span>para selecionar</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
