import React from "react";
import { cn } from "@/lib/unclicUtils";
import { PageType } from "@/lib/types";

interface PlaceholderPageProps {
  pageType: PageType;
  darkMode: boolean;
}

const getPageInfo = (pageType: PageType) => {
  const pageMap = {
    calendar: {
      title: "Calendário",
      description: "Visualize sua agenda em formato de calendário",
      icon: "📅",
    },
    help: {
      title: "Ajuda",
      description: "Encontre respostas para suas dúvidas e suporte técnico",
      icon: "❓",
    },
    payments: {
      title: "Pagamentos",
      description: "Gerencie métodos de pagamento e transações",
      icon: "💳",
    },
    marketing: {
      title: "Marketing",
      description: "Ferramentas de marketing e promoções",
      icon: "📢",
    },
    documents: {
      title: "Documentos",
      description: "Gerencie documentos e arquivos do negócio",
      icon: "📄",
    },
  };

  return (
    pageMap[pageType] || {
      title: "Página",
      description: "Esta página está sendo desenvolvida",
      icon: "🚧",
    }
  );
};

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  pageType,
  darkMode,
}) => {
  const pageInfo = getPageInfo(pageType);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md mx-auto">
        <div className="text-6xl mb-4">{pageInfo.icon}</div>
        <h1
          className={cn(
            "text-2xl font-bold mb-4",
            darkMode ? "text-white" : "text-gray-900",
          )}
        >
          {pageInfo.title}
        </h1>
        <p
          className={cn(
            "text-lg mb-6",
            darkMode ? "text-gray-300" : "text-gray-600",
          )}
        >
          {pageInfo.description}
        </p>
        <div
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
            darkMode
              ? "bg-gray-800 border border-gray-700 text-gray-300"
              : "bg-gray-100 border border-gray-200 text-gray-600",
          )}
        >
          <span className="text-sm">🚧</span>
          <span className="text-sm font-medium">Em desenvolvimento</span>
        </div>
        <div className="mt-8">
          <p
            className={cn(
              "text-sm",
              darkMode ? "text-gray-400" : "text-gray-500",
            )}
          >
            Esta funcionalidade estará disponível em breve.
            <br />
            Agradecemos pela paciência!
          </p>
        </div>
      </div>
    </div>
  );
};
