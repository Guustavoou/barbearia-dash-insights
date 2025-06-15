import React, { useState } from "react";
import {
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  Download,
  RefreshCw,
  Calendar,
  Filter,
  FileText,
  Users,
  DollarSign,
  Clock,
  Activity,
  Target,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { PageType } from "@/lib/types";

interface BeautifulReportsProps {
  darkMode: boolean;
  onPageChange?: (page: PageType) => void;
}

export const BeautifulReports: React.FC<BeautifulReportsProps> = ({
  darkMode,
  onPageChange,
}) => {
  const { toast } = useToast();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsLoading(false);
      toast({
        title: "✨ Dados Atualizados",
        description: "Relatórios atualizados com sucesso",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-blue-50/30 dark:from-[#0D1117] dark:via-[#0D1117] dark:to-blue-950/20">
      <div className="space-y-6 p-6">
        {/* Beautiful Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00112F] via-blue-900 to-blue-800 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_70%)]" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse" />

          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <BarChart3 className="w-8 h-8 text-blue-200 animate-pulse" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Relatórios Premium
                </h1>
              </div>
              <p className="text-blue-200 text-lg">
                Análises completas do seu negócio • Última atualização:{" "}
                {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRefreshData}
                disabled={isLoading}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <RefreshCw
                  className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")}
                />
                {isLoading ? "Atualizando..." : "Atualizar"}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Relatório Financeiro",
              description: "Receitas, despesas e lucro",
              icon: DollarSign,
              period: "Mensal",
            },
            {
              title: "Relatório de Clientes",
              description: "Análise da base de clientes",
              icon: Users,
              period: "Trimestral",
            },
            {
              title: "Relatório de Serviços",
              description: "Performance dos serviços",
              icon: Activity,
              period: "Semanal",
            },
            {
              title: "Relatório de Profissionais",
              description: "Performance da equipe",
              icon: Target,
              period: "Mensal",
            },
          ].map((report, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden transition-all duration-300 border-0 shadow-lg hover:shadow-xl cursor-pointer bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl hover:-translate-y-1 hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00112F]/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#00112F] to-blue-700 shadow-lg">
                    <report.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#00112F] dark:text-[#F9FAFB]">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {report.description}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-0 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-400"
                >
                  {report.period}
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
          <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] mb-6 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
            Análises Visuais
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="text-center p-8 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
              <LineChart className="w-12 h-12 mx-auto mb-4 text-[#00112F] dark:text-blue-400" />
              <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB] mb-2">
                Tendências
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Análise temporal
              </p>
            </div>
            <div className="text-center p-8 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-[#00112F] dark:text-blue-400" />
              <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB] mb-2">
                Comparações
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Análise comparativa
              </p>
            </div>
            <div className="text-center p-8 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
              <PieChart className="w-12 h-12 mx-auto mb-4 text-[#00112F] dark:text-blue-400" />
              <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB] mb-2">
                Distribuição
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Análise de proporções
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
