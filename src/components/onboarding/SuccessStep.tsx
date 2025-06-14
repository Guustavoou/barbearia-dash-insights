import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Calendar,
  MessageCircle,
  Smartphone,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface SuccessStepProps {
  onGoToDashboard: () => void;
}

export const SuccessStep: React.FC<SuccessStepProps> = ({
  onGoToDashboard,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Success Animation */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 relative">
            <CheckCircle className="w-12 h-12 text-green-600" />
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              🎉 Configuração Concluída com Sucesso!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Parabéns! Seu estabelecimento está configurado e pronto para
              funcionar. Agora você pode começar a gerenciar seus agendamentos,
              clientes e muito mais.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Sugestões para começar:
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Test Booking */}
            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  🔔 Testar agendamento
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Faça um agendamento de teste para ver como funciona
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="group-hover:bg-blue-50"
                >
                  Começar
                </Button>
              </CardContent>
            </Card>

            {/* WhatsApp Integration */}
            <Card className="border-2 border-green-200 hover:border-green-400 transition-colors cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  💬 Ativar WhatsApp
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Configure o atendimento via WhatsApp para seus clientes
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="group-hover:bg-green-50"
                >
                  Configurar
                </Button>
              </CardContent>
            </Card>

            {/* Mobile App */}
            <Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <Smartphone className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  📲 Baixar o app
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Gerencie seu negócio pelo celular com nosso aplicativo
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="group-hover:bg-purple-50"
                  disabled
                >
                  Em breve
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Next Steps */}
        <Card className="border-2 border-indigo-200 bg-indigo-50 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-indigo-900">
                Próximos passos recomendados
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <h4 className="font-medium text-indigo-900">
                  📊 Configure seu dashboard
                </h4>
                <p className="text-sm text-indigo-700">
                  Personalize as métricas e relatórios que deseja acompanhar
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-indigo-900">
                  👥 Convide sua equipe
                </h4>
                <p className="text-sm text-indigo-700">
                  Adicione outros usuários para gerenciar o estabelecimento
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-indigo-900">
                  🎨 Personalize a aparência
                </h4>
                <p className="text-sm text-indigo-700">
                  Ajuste cores, logos e aparência do sistema
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-indigo-900">
                  📈 Configure relatórios
                </h4>
                <p className="text-sm text-indigo-700">
                  Defina relatórios automáticos para acompanhar seu negócio
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="space-y-4">
          <Button
            onClick={onGoToDashboard}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
          >
            Ir para o Painel Principal
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <a href="#" className="hover:text-blue-600">
              Centro de Ajuda
            </a>
            <span>•</span>
            <a href="#" className="hover:text-blue-600">
              Tutoriais em Vídeo
            </a>
            <span>•</span>
            <a href="#" className="hover:text-blue-600">
              Suporte Técnico
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Obrigado por escolher o Unclic Manager! Estamos aqui para ajudar seu
            negócio a crescer.
          </p>
        </div>
      </div>
    </div>
  );
};
