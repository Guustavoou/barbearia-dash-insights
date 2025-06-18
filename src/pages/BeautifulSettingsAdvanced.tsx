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
  Settings, 
  Shield, 
  Database, 
  Zap, 
  Globe, 
  Lock, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  AlertTriangle, 
  Trash2, 
  Download, 
  Upload,
  Plus,
  X
} from 'lucide-react';

interface BeautifulSettingsAdvancedProps {
  darkMode: boolean;
}

const BeautifulSettingsAdvanced: React.FC<BeautifulSettingsAdvancedProps> = ({ darkMode }) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [backupEnabled, setBackupEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText('sk_test_51234567890abcdef...');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Settings className="mr-3 h-8 w-8" />
            Configurações Avançadas
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Configurações técnicas e de sistema para usuários avançados
          </p>
        </div>

        <Tabs defaultValue="api" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
          </TabsList>

          {/* API Tab */}
          <TabsContent value="api">
            <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Configurações de API
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Chave da API</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Input
                      type={showApiKey ? 'text' : 'password'}
                      value="sk_test_51234567890abcdef..."
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
                    Use esta chave para autenticar requisições à API
                  </p>
                </div>

                <div>
                  <Label>Webhook URL</Label>
                  <Input
                    type="url"
                    placeholder="https://exemplo.com/webhook"
                    className="mt-2"
                  />
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    URL para receber notificações de eventos
                  </p>
                </div>

                <div>
                  <Label>Rate Limiting</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label className="text-sm">Requisições por minuto</Label>
                      <Input type="number" defaultValue="100" />
                    </div>
                    <div>
                      <Label className="text-sm">Burst limit</Label>
                      <Input type="number" defaultValue="20" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="grid gap-6">
              <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Configurações de Segurança
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Autenticação de dois fatores</Label>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Adiciona uma camada extra de segurança
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Log de auditoria</Label>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Registra todas as ações dos usuários
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Criptografia de dados</Label>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Criptografa dados sensíveis no banco
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div>
                    <Label>IPs permitidos</Label>
                    <Textarea
                      placeholder="192.168.1.1&#10;10.0.0.1/24"
                      className="mt-2"
                      rows={3}
                    />
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Lista de IPs ou ranges permitidos (um por linha)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className={`border-orange-200 ${darkMode ? 'bg-orange-900/20 border-orange-700' : 'bg-orange-50'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-600">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Zona de Perigo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-orange-600">Resetar chaves de API</Label>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                      Isso invalidará todas as integrações existentes
                    </p>
                    <Button variant="destructive" className="mt-2">
                      Resetar Chaves
                    </Button>
                  </div>

                  <div>
                    <Label className="text-orange-600">Limpar logs de auditoria</Label>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                      Remove todos os registros de auditoria
                    </p>
                    <Button variant="destructive" className="mt-2">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Limpar Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database">
            <div className="grid gap-6">
              <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="mr-2 h-5 w-5" />
                    Configurações de Banco de Dados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Backup automático</Label>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Faz backup diário dos dados
                      </p>
                    </div>
                    <Switch 
                      checked={backupEnabled}
                      onCheckedChange={setBackupEnabled}
                    />
                  </div>

                  <div>
                    <Label>Frequência do backup</Label>
                    <select className={`w-full mt-2 px-3 py-2 border rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}>
                      <option>Diário</option>
                      <option>Semanal</option>
                      <option>Mensal</option>
                    </select>
                  </div>

                  <div>
                    <Label>Retenção de backups</Label>
                    <Input 
                      type="number" 
                      defaultValue="30" 
                      className="mt-2"
                    />
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Número de dias para manter os backups
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Backup
                    </Button>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Restaurar Backup
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle>Estatísticas do Banco</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">2.5GB</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tamanho</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">1,234</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tabelas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">99.9%</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Uptime</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">15ms</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Latência</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Configurações de Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cache de dados</Label>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Armazena dados frequentemente acessados
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div>
                  <Label>TTL do cache (segundos)</Label>
                  <Input 
                    type="number" 
                    defaultValue="3600" 
                    className="mt-2"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Compressão de dados</Label>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Reduz o tamanho das respostas da API
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div>
                  <Label>Limite de paginação</Label>
                  <Input 
                    type="number" 
                    defaultValue="50" 
                    className="mt-2"
                  />
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Número máximo de itens por página
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  Integrações Ativas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">WhatsApp Business</h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Envio de mensagens automáticas
                      </p>
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
                    <div>
                      <h4 className="font-medium">Google Calendar</h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Sincronização de agendamentos
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        Inativo
                      </Badge>
                      <Button variant="outline" size="sm">
                        Conectar
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Stripe</h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Processamento de pagamentos
                      </p>
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

                  <Button className="w-full" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Integração
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system">
            <div className="grid gap-6">
              <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle>Configurações do Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Modo de manutenção</Label>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Bloqueia acesso para manutenção
                      </p>
                    </div>
                    <Switch 
                      checked={maintenanceMode}
                      onCheckedChange={setMaintenanceMode}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Modo debug</Label>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Exibe informações técnicas detalhadas
                      </p>
                    </div>
                    <Switch 
                      checked={debugMode}
                      onCheckedChange={setDebugMode}
                    />
                  </div>

                  <div>
                    <Label>Timezone do sistema</Label>
                    <select className={`w-full mt-2 px-3 py-2 border rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}>
                      <option>America/Sao_Paulo</option>
                      <option>America/New_York</option>
                      <option>Europe/London</option>
                      <option>Asia/Tokyo</option>
                    </select>
                  </div>

                  <div>
                    <Label>Mensagem de manutenção</Label>
                    <Textarea
                      placeholder="Sistema em manutenção. Voltamos em breve!"
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle>Informações do Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Versão</Label>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>v2.1.0</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Build</Label>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>#1234</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Servidor</Label>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>AWS us-east-1</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Última atualização</Label>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>15/01/2024</p>
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

export default BeautifulSettingsAdvanced;
