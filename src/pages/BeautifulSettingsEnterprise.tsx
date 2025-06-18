import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  Users, 
  Shield, 
  Crown, 
  Calendar, 
  BarChart3, 
  Globe, 
  Lock, 
  Zap, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  Settings,
  UserPlus,
  FileText,
  Download,
  Upload,
  Eye,
  EyeOff,
  Copy,
  Check,
  Plus,
  X,
  Star,
  Camera,
  Truck
} from 'lucide-react';

interface BeautifulSettingsEnterpriseProps {
  darkMode: boolean;
}

const BeautifulSettingsEnterprise: React.FC<BeautifulSettingsEnterpriseProps> = ({ darkMode }) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ssoEnabled, setSsoEnabled] = useState(false);
  const [auditEnabled, setAuditEnabled] = useState(true);
  const [backupEnabled, setBackupEnabled] = useState(true);

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText('ent_sk_live_51234567890abcdef...');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Crown className="mr-3 h-8 w-8 text-yellow-500" />
                Configurações Enterprise
              </h1>
              <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Recursos avançados para empresas e organizações
              </p>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800 px-4 py-2">
              <Crown className="mr-2 h-4 w-4" />
              Enterprise
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="organization" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="organization">Organização</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="support">Suporte</TabsTrigger>
          </TabsList>

          {/* Organization Tab */}
          <TabsContent value="organization">
            <div className="grid gap-6">
              <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="mr-2 h-5 w-5" />
                    Informações da Organização
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Nome da Empresa</Label>
                      <Input defaultValue="Empresa LTDA" className="mt-2" />
                    </div>
                    <div>
                      <Label>CNPJ</Label>
                      <Input defaultValue="12.345.678/0001-90" className="mt-2" />
                    </div>
                    <div>
                      <Label>Razão Social</Label>
                      <Input defaultValue="Empresa de Tecnologia LTDA" className="mt-2" />
                    </div>
                    <div>
                      <Label>Inscrição Estadual</Label>
                      <Input defaultValue="123.456.789.012" className="mt-2" />
                    </div>
                  </div>

                  <div>
                    <Label>Endereço Comercial</Label>
                    <Textarea
                      defaultValue="Rua das Empresas, 123&#10;Centro - São Paulo/SP&#10;CEP: 01234-567"
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Telefone Principal</Label>
                      <Input defaultValue="(11) 3333-4444" className="mt-2" />
                    </div>
                    <div>
                      <Label>Email Corporativo</Label>
                      <Input defaultValue="contato@empresa.com.br" className="mt-2" />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Building className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <Label>Logo da Empresa</Label>
                      <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Recomendado: 200x200px, formato PNG ou JPG
                      </p>
                      <Button variant="outline" className="mt-2">
                        <Camera className="h-4 w-4 mr-2" />
                        Alterar Logo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle>Configurações de Empresa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Fuso Horário Corporativo</Label>
                    <select className={`w-full mt-2 px-3 py-2 border rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}>
                      <option>America/Sao_Paulo (UTC-3)</option>
                      <option>America/New_York (UTC-5)</option>
                      <option>Europe/London (UTC+0)</option>
                      <option>Asia/Tokyo (UTC+9)</option>
                    </select>
                  </div>

                  <div>
                    <Label>Moeda Padrão</Label>
                    <select className={`w-full mt-2 px-3 py-2 border rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}>
                      <option>Real Brasileiro (BRL)</option>
                      <option>Dólar Americano (USD)</option>
                      <option>Euro (EUR)</option>
                    </select>
                  </div>

                  <div>
                    <Label>Idioma do Sistema</Label>
                    <select className={`w-full mt-2 px-3 py-2 border rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}>
                      <option>Português (Brasil)</option>
                      <option>English (US)</option>
                      <option>Español (ES)</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="grid gap-6">
              <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="mr-2 h-5 w-5" />
                      Gerenciamento de Usuários
                    </div>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Convidar Usuário
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">JD</span>
                        </div>
                        <div>
                          <h4 className="font-medium">João da Silva</h4>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            joao@empresa.com.br
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-purple-100 text-purple-700">
                          Administrador
                        </Badge>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Ativo
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-medium">MS</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Maria Santos</h4>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            maria@empresa.com.br
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          Gerente
                        </Badge>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Ativo
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-medium">PC</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Pedro Costa</h4>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            pedro@empresa.com.br
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          Funcionário
                        </Badge>
                        <Badge variant="outline">
                          Inativo
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle>Configurações de Acesso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Single Sign-On (SSO)</Label>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Permite login único com provedores externos
                      </p>
                    </div>
                    <Switch 
                      checked={ssoEnabled}
                      onCheckedChange={setSsoEnabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Autenticação de dois fatores obrigatória</Label>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Força 2FA para todos os usuários
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div>
                    <Label>Provedor SSO</Label>
                    <select className={`w-full mt-2 px-3 py-2 border rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}>
                      <option>Azure Active Directory</option>
                      <option>Google Workspace</option>
                      <option>Okta</option>
                      <option>SAML 2.0</option>
                    </select>
                  </div>

                  <div>
                    <Label>Domínios permitidos</Label>
                    <Textarea
                      placeholder="empresa.com.br&#10;subsidiaria.com"
                      className="mt-2"
                      rows={3}
                    />
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Lista de domínios de email permitidos (um por linha)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="grid gap-6">
              <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Segurança Enterprise
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Log de auditoria avançado</Label>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Registra todas as ações com detalhes forenses
                      </p>
                    </div>
                    <Switch 
                      checked={auditEnabled}
                      onCheckedChange={setAuditEnabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Criptografia em repouso</Label>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        AES-256 para dados armazenados
                      </p>
                    </div>
                    <Switch defaultChecked disabled />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Backup automático criptografado</Label>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Backups diários com criptografia end-to-end
                      </p>
                    </div>
                    <Switch 
                      checked={backupEnabled}
                      onCheckedChange={setBackupEnabled}
                    />
                  </div>

                  <div>
                    <Label>Chave API Enterprise</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Input
                        type={showApiKey ? 'text' : 'password'}
                        value="ent_sk_live_51234567890abcdef..."
                        readOnly
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyApiKey}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Chave com privilégios Enterprise - Rate limit: 10.000 req/min
                    </p>
                  </div>

                  <div>
                    <Label>Whitelist de IPs</Label>
                    <Textarea
                      placeholder="203.0.113.0/24&#10;198.51.100.1&#10;192.0.2.0/28"
                      className="mt-2"
                      rows={4}
                    />
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Apenas IPs desta lista podem acessar a API
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className={`border-red-200 ${darkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center text-red-600">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Zona de Perigo - Enterprise
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-red-600">Revogar todas as sessões ativas</Label>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                      Força logout de todos os usuários em todos os dispositivos
                    </p>
                    <Button variant="destructive" className="mt-2">
                      Revogar Sessões
                    </Button>
                  </div>

                  <div>
                    <Label className="text-red-600">Reset completo da organização</Label>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                      Remove todos os dados e configurações (irreversível)
                    </p>
                    <Button variant="destructive" className="mt-2">
                      Reset Organização
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance">
            <div className="grid gap-6">
              <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Compliance e Relatórios
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-2" />
                      <h4 className="font-medium">LGPD</h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Conforme
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-2" />
                      <h4 className="font-medium">SOC 2</h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Certificado
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-2" />
                      <h4 className="font-medium">ISO 27001</h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Conforme
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label>Retenção de dados</Label>
                    <select className={`w-full mt-2 px-3 py-2 border rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}>
                      <option>7 anos (conforme legislação)</option>
                      <option>5 anos</option>
                      <option>3 anos</option>
                      <option>Indefinido</option>
                    </select>
                  </div>

                  <div>
                    <Label>Política de privacidade</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Input value="https://empresa.com/privacidade" readOnly />
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Relatórios de Compliance</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Relatório LGPD
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Auditoria de Acesso
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Log de Atividades
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Backup Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle>Data Protection Officer (DPO)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nome do DPO</Label>
                      <Input defaultValue="Dr. Ana Carolina Silva" className="mt-2" />
                    </div>
                    <div>
                      <Label>Email do DPO</Label>
                      <Input defaultValue="dpo@empresa.com.br" className="mt-2" />
                    </div>
                  </div>
                  <div>
                    <Label>Telefone do DPO</Label>
                    <Input defaultValue="(11) 3333-4444 ramal 123" className="mt-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  Integrações Enterprise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Microsoft Teams</h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Notificações e agendamentos via Teams
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Ativo
                      </Badge>
                      <Button variant="outline" size="sm">
                        Configurar
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Globe className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Salesforce CRM</h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Sincronização bidirecional de clientes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Ativo
                      </Badge>
                      <Button variant="outline" size="sm">
                        Configurar
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Power BI</h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Dashboards e relatórios avançados
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        Disponível
                      </Badge>
                      <Button variant="outline" size="sm">
                        Conectar
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Truck className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">SAP ERP</h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Integração com sistemas empresariais
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        Disponível
                      </Badge>
                      <Button variant="outline" size="sm">
                        Conectar
                      </Button>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Solicitar Nova Integração
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid gap-6">
              <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Analytics Enterprise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">95%</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Uptime
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-green-600">1.2M</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Requisições/mês
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">45ms</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Latência média
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-orange-600">99.9%</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Disponibilidade
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Relatórios Personalizados</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Relatório Executivo
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Análise de Performance
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Métricas de Usuário
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Relatório de ROI
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle>Configurações de Monitoramento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Alertas em tempo real</Label>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Notificações instantâneas de eventos críticos
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div>
                    <Label>Threshold de CPU (%)</Label>
                    <Input type="number" defaultValue="80" className="mt-2" />
                  </div>

                  <div>
                    <Label>Threshold de memória (%)</Label>
                    <Input type="number" defaultValue="85" className="mt-2" />
                  </div>

                  <div>
                    <Label>Email para alertas</Label>
                    <Input defaultValue="ops@empresa.com.br" className="mt-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support">
            <div className="grid gap-6">
              <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="mr-2 h-5 w-5 text-yellow-500" />
                    Suporte Premium Enterprise
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Phone className="mx-auto h-8 w-8 text-blue-500 mb-2" />
                      <h4 className="font-medium">Suporte 24/7</h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Telefone dedicado
                      </p>
                      <p className="text-lg font-medium mt-2">+55 11 3333-9999</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Mail className="mx-auto h-8 w-8 text-green-500 mb-2" />
                      <h4 className="font-medium">Email Premium</h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Resposta em 1h
                      </p>
                      <p className="text-lg font-medium mt-2">enterprise@suporte.com</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Users className="mx-auto h-8 w-8 text-purple-500 mb-2" />
                      <h4 className="font-medium">Account Manager</h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Gerente dedicado
                      </p>
                      <p className="text-lg font-medium mt-2">Roberto Silva</p>
                    </div>
                  </div>

                  <div>
                    <Label>Status do suporte</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Todos os sistemas operacionais</span>
                    </div>
                  </div>

                  <div>
                    <Label>Tickets ativos</Label>
                    <p className="text-2xl font-bold mt-2">2</p>
                    <Button variant="outline" className="mt-2">
                      Ver todos os tickets
                    </Button>
                  </div>

                  <div>
                    <Label>Treinamento e Onboarding</Label>
                    <div className="space-y-2 mt-2">
                      <Button variant="outline" className="w-full justify-start">
                        📚 Material de Treinamento
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        🎥 Webinars Exclusivos
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        👥 Sessão de Onboarding
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`border-yellow-200 ${darkMode ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center text-yellow-600">
                    <Crown className="mr-2 h-5 w-5" />
                    Benefícios Enterprise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>SLA 99.9% de uptime</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Backup diário automático</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Suporte prioritário 24/7</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Account Manager dedicado</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Relatórios personalizados</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Integrações ilimitadas</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BeautifulSettingsEnterprise;
