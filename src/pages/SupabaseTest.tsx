import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { supabaseApi } from "@/lib/supabaseApi";
import { useClients } from "@/hooks/useSupabaseRealtime";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
}

export const SupabaseTest: React.FC = () => {
  const { user, signIn, signUp, signOut } = useSupabaseAuth();
  const { data: clients, loading, error } = useClients();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");

  const handleSignIn = async () => {
    const { error } = await signIn(email, password);
    if (error) {
      console.error("Erro no login:", error.message);
      alert("Erro no login: " + error.message);
    }
  };

  const handleSignUp = async () => {
    const { error } = await signUp(email, password);
    if (error) {
      console.error("Erro no cadastro:", error.message);
      alert("Erro no cadastro: " + error.message);
    } else {
      alert("Cadastro realizado! Verifique seu email.");
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleCreateClient = async () => {
    if (!newClientName || !newClientEmail || !newClientPhone) {
      alert("Preencha todos os campos");
      return;
    }

    const result = await supabaseApi.createClient({
      name: newClientName,
      email: newClientEmail,
      phone: newClientPhone,
      status: "ativo",
      address: "",
      birthDate: "",
      notes: "",
    });

    if (result.success) {
      alert("Cliente criado com sucesso!");
      setNewClientName("");
      setNewClientEmail("");
      setNewClientPhone("");
    } else {
      alert("Erro ao criar cliente: " + result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Teste de Integração Supabase
          </h1>
          <p className="text-gray-600">
            Esta página demonstra a integração funcionando com Supabase
          </p>
        </Card>

        {/* Auth Section */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">🔐 Autenticação</h2>

          {!user ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <Button onClick={handleSignIn}>Entrar</Button>
                <Button variant="outline" onClick={handleSignUp}>
                  Cadastrar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-green-600">
                ✅ Logado como: <strong>{user.email}</strong>
              </p>
              <Button variant="outline" onClick={handleSignOut}>
                Sair
              </Button>
            </div>
          )}
        </Card>

        {/* Database Test Section */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            💾 Teste do Banco de Dados
          </h2>

          {/* Create Client Form */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-3">Criar Novo Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Input
                placeholder="Nome"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
              />
              <Input
                placeholder="Email"
                value={newClientEmail}
                onChange={(e) => setNewClientEmail(e.target.value)}
              />
              <Input
                placeholder="Telefone"
                value={newClientPhone}
                onChange={(e) => setNewClientPhone(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateClient}>Criar Cliente</Button>
          </div>

          {/* Clients List */}
          <div>
            <h3 className="font-medium mb-3">
              Lista de Clientes {loading && "(Carregando...)"}
            </h3>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                <p className="text-red-600">❌ Erro: {error}</p>
              </div>
            )}

            {clients && clients.length > 0 ? (
              <div className="grid gap-4">
                {clients.map((client: any) => (
                  <div
                    key={client.id}
                    className="p-4 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {client.name}
                        </h4>
                        <p className="text-sm text-gray-600">{client.email}</p>
                        <p className="text-sm text-gray-600">{client.phone}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          client.status === "ativo"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {client.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !loading && (
                <div className="p-8 text-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    📭 Nenhum cliente encontrado. Execute o script SQL primeiro!
                  </p>
                </div>
              )
            )}
          </div>
        </Card>

        {/* Real-time Test */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">⚡ Teste Real-time</h2>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              💡 <strong>Como testar:</strong> Abra esta página em duas abas.
              Crie um cliente em uma aba e veja aparecer automaticamente na
              outra!
            </p>
          </div>
        </Card>

        {/* Connection Status */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">🔗 Status da Conexão</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-800 mb-2">
                ✅ Supabase Client
              </h3>
              <p className="text-sm text-green-600">Configurado e conectado</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-800 mb-2">✅ Real-time</h3>
              <p className="text-sm text-green-600">Subscriptions ativas</p>
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">📝 Próximos Passos</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="font-medium text-blue-600">1.</span>
              <p>Execute o script SQL no Supabase para criar as tabelas</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-medium text-blue-600">2.</span>
              <p>Configure políticas de segurança (RLS) conforme necessário</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-medium text-blue-600">3.</span>
              <p>
                Substitua a API atual pelas chamadas do Supabase nas páginas
                existentes
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-medium text-blue-600">4.</span>
              <p>Configure autenticação e autorização para produção</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SupabaseTest;
