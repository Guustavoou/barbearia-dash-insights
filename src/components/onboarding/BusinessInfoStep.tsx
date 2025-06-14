import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Upload,
  Check,
  X,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Instagram,
  Facebook,
} from "lucide-react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useOnboardingHelpers } from "@/hooks/useOnboarding";

export const BusinessInfoStep: React.FC = () => {
  const { data, updateBusinessInfo, nextStep, previousStep } = useOnboarding();
  const { validateBusinessInfo, formatCEP, formatPhone, formatCNPJ } =
    useOnboardingHelpers();

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;

    if (field === "cep") {
      formattedValue = formatCEP(value);
    } else if (field === "phone") {
      formattedValue = formatPhone(value);
    } else if (field === "cnpj") {
      formattedValue = formatCNPJ(value);
    }

    updateBusinessInfo({ [field]: formattedValue });

    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleImageUpload = (type: "logo" | "banner", file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === "logo") {
        setLogoPreview(result);
        updateBusinessInfo({ logo: file });
      } else {
        setBannerPreview(result);
        updateBusinessInfo({ banner: file });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    const validation = validateBusinessInfo(data.businessInfo);
    if (validation.isValid) {
      nextStep();
    } else {
      setErrors(validation.errors);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Informações do Negócio
        </h2>
        <p className="text-gray-600">
          Vamos começar com as informações básicas do seu estabelecimento
        </p>
      </div>

      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-2">
            <X className="w-5 h-5 text-red-500 mr-2" />
            <h4 className="text-red-800 font-medium">
              Corrija os seguintes erros:
            </h4>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-red-700 text-sm">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Basic Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Estabelecimento *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Salão da Maria"
                  value={data.businessInfo.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contato@salao.com"
                    value={data.businessInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    placeholder="(11) 99999-9999"
                    value={data.businessInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cnpj">CNPJ (opcional)</Label>
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0000-00"
                  value={data.businessInfo.cnpj}
                  onChange={(e) => handleInputChange("cnpj", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Endereço completo *</Label>
                <Textarea
                  id="address"
                  placeholder="Rua das Flores, 123 - Centro"
                  value={data.businessInfo.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="cep">CEP *</Label>
                <Input
                  id="cep"
                  placeholder="00000-000"
                  value={data.businessInfo.cep}
                  onChange={(e) => handleInputChange("cep", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Redes Sociais (opcional)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="website">Site</Label>
                <Input
                  id="website"
                  placeholder="https://www.seusalao.com"
                  value={data.businessInfo.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="instagram"
                      placeholder="@seusalao"
                      className="pl-10"
                      value={data.businessInfo.instagram}
                      onChange={(e) =>
                        handleInputChange("instagram", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <div className="relative">
                    <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="facebook"
                      placeholder="Salão da Maria"
                      className="pl-10"
                      value={data.businessInfo.facebook}
                      onChange={(e) =>
                        handleInputChange("facebook", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Images */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                onClick={() => logoInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
              >
                {logoPreview ? (
                  <div className="space-y-3">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-24 h-24 object-cover rounded-lg mx-auto"
                    />
                    <p className="text-sm text-green-600 flex items-center justify-center">
                      <Check className="w-4 h-4 mr-1" />
                      Logo carregado
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Clique para carregar
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG até 5MB</p>
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload("logo", file);
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Banner (opcional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                onClick={() => bannerInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
              >
                {bannerPreview ? (
                  <div className="space-y-3">
                    <img
                      src={bannerPreview}
                      alt="Banner preview"
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <p className="text-sm text-green-600 flex items-center justify-center">
                      <Check className="w-4 h-4 mr-1" />
                      Banner carregado
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Clique para carregar
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG até 5MB</p>
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload("banner", file);
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={previousStep}>
          Voltar
        </Button>
        <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
          Próximo: Serviços
        </Button>
      </div>
    </div>
  );
};
