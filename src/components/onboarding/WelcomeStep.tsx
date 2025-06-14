import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText, Edit3 } from "lucide-react";

interface WelcomeStepProps {
  onSelectOption: (option: "import" | "upload" | "scratch") => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onSelectOption }) => {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bem-vindo ao Unclic Manager!
        </h1>
        <p className="text-xl text-gray-600">
          Vamos configurar seu estabelecimento em poucos minutos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {/* Import from other system */}
        <Card className="border-2 border-gray-200 hover:border-orange-400 transition-colors cursor-pointer group">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-orange-200 transition-colors">
                <Download className="w-8 h-8 text-orange-600" />
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Já uso outro sistema
            </h3>
            <p className="text-gray-600 mb-6 text-sm">
              Importe dados automaticamente do Trinks, Booksy, Meethub e outros
              sistemas
            </p>

            <div className="bg-orange-50 text-orange-600 text-xs font-medium px-3 py-1 rounded-full inline-block mb-4">
              Em breve
            </div>

            <Button
              variant="outline"
              className="w-full"
              disabled
              onClick={() => onSelectOption("import")}
            >
              Importar
            </Button>
          </CardContent>
        </Card>

        {/* Upload files */}
        <Card className="border-2 border-gray-200 hover:border-orange-400 transition-colors cursor-pointer group">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-orange-200 transition-colors">
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Tenho minhas informações em arquivo
            </h3>
            <p className="text-gray-600 mb-6 text-sm">
              Faça upload de planilha, PDFs ou imagens com seus dados
            </p>

            <div className="bg-orange-50 text-orange-600 text-xs font-medium px-3 py-1 rounded-full inline-block mb-4">
              Em breve
            </div>

            <Button
              variant="outline"
              className="w-full"
              disabled
              onClick={() => onSelectOption("upload")}
            >
              Upload
            </Button>
          </CardContent>
        </Card>

        {/* Start from scratch */}
        <Card className="border-2 border-blue-500 hover:border-blue-600 transition-colors cursor-pointer group shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-200 transition-colors">
                <Edit3 className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Quero começar do zero
            </h3>
            <p className="text-gray-600 mb-6 text-sm">
              Configure manualmente com a ajuda de nossos modelos
            </p>

            <div className="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full inline-block mb-4">
              Recomendado
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => onSelectOption("scratch")}
            >
              Começar
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 p-6 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-sm font-bold">ℹ</span>
          </div>
          <h4 className="text-lg font-semibold text-blue-900">
            Mini-tutorial: O que você fará nas próximas etapas
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold">
              1
            </div>
            <p className="text-blue-800 font-medium">Informações do Negócio</p>
            <p className="text-blue-600">Nome, contato, endereço</p>
          </div>

          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold">
              2
            </div>
            <p className="text-blue-800 font-medium">Serviços</p>
            <p className="text-blue-600">Catálogo de serviços</p>
          </div>

          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold">
              3
            </div>
            <p className="text-blue-800 font-medium">Profissionais</p>
            <p className="text-blue-600">Equipe e especialidades</p>
          </div>

          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold">
              4
            </div>
            <p className="text-blue-800 font-medium">Horários</p>
            <p className="text-blue-600">Funcionamento</p>
          </div>
        </div>
      </div>
    </div>
  );
};
