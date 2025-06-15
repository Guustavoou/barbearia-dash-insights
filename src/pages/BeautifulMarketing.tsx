import React, { useState } from "react";
import {
  Megaphone,
  Mail,
  MessageCircle,
  Users,
  TrendingUp,
  Download,
  RefreshCw,
  Target,
  Activity,
  Sparkles,
  Send,
  Eye,
  Heart,
  Share2,
  Calendar,
  Gift,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { PageType } from "@/lib/types";

interface BeautifulMarketingProps {
  darkMode: boolean;
  onPageChange?: (page: PageType) => void;
}

export const BeautifulMarketing: React.FC<BeautifulMarketingProps> = ({
  darkMode,
  onPageChange,
}) => {
  const { toast } = useToast();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const campaigns = [
    {
      id: 1,
      name: "Promoção de Verão",
      type: "email",
      status: "ativa",
      reach: 1250,
      engagement: 8.5,
      conversion: 3.2,
    },
    {
      id: 2,
      name: "Clientes VIP",
      type: "sms",
      status: "agendada",
      reach: 450,
      engagement: 12.3,
      conversion: 5.8,
    },
  ];

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsLoading(false);
      toast({
        title: "✨ Dados Atualizados",
        description: "Campanhas atualizadas com sucesso",
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
                <Megaphone className="w-8 h-8 text-blue-200 animate-pulse" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Marketing Premium
                </h1>
              </div>
              <p className="text-blue-200 text-lg">
                Campanhas e engajamento • Última atualização:{" "}
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
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg">
                <Send className="w-4 h-4 mr-2" />
                Nova Campanha
              </Button>
            </div>
          </div>
        </div>

        {/* Marketing KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Alcance Total",
              value: "2.4K",
              change: 15,
              icon: Users,
              variant: "primary" as const,
            },
            {
              title: "Taxa Engajamento",
              value: "8.5%",
              change: 5,
              icon: Heart,
              variant: "success" as const,
            },
            {
              title: "Conversões",
              value: "142",
              change: 12,
              icon: Target,
              variant: "premium" as const,
            },
            {
              title: "ROI Marketing",
              value: "3.2x",
              change: 8,
              icon: TrendingUp,
              variant: "info" as const,
            },
          ].map((kpi, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden transition-all duration-500 border-0 shadow-lg hover:shadow-xl bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl hover:-translate-y-1 hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00112F]/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00112F] to-blue-700 shadow-lg">
                    <kpi.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      {kpi.title}
                    </h3>
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB]">
                  {kpi.value}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {kpi.change}%
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Campaign List */}
        <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
              <Activity className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
              Campanhas Ativas
            </h3>
          </div>

          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className="group relative overflow-hidden transition-all duration-300 border-0 shadow-md hover:shadow-lg cursor-pointer bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-sm hover:bg-white dark:hover:bg-[#0D1117] hover:-translate-y-1 hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#00112F]/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00112F] to-blue-700 flex items-center justify-center text-white shadow-lg">
                        {campaign.type === "email" ? (
                          <Mail className="w-6 h-6" />
                        ) : (
                          <MessageCircle className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                          {campaign.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {campaign.type === "email" ? "Email" : "SMS"} •{" "}
                          {campaign.reach} contatos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs border-0 mb-2",
                          campaign.status === "ativa"
                            ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-400"
                            : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 dark:from-gray-900/30 dark:to-gray-800/30 dark:text-gray-400",
                        )}
                      >
                        {campaign.status === "ativa" ? "Ativa" : "Agendada"}
                      </Badge>
                      <div className="flex space-x-4 text-sm">
                        <div className="text-center">
                          <div className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                            {campaign.engagement}%
                          </div>
                          <div className="text-xs text-gray-500">
                            Engajamento
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                            {campaign.conversion}%
                          </div>
                          <div className="text-xs text-gray-500">Conversão</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
