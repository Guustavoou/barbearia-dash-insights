
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const Login: React.FC = () => {
  const { signIn, signUp, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [establishmentName, setEstablishmentName] = useState("");
  const [establishmentPhone, setEstablishmentPhone] = useState("");
  const [establishmentAddress, setEstablishmentAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError("As senhas não coincidem");
          return;
        }

        if (
          !name ||
          !establishmentName ||
          !establishmentPhone ||
          !establishmentAddress
        ) {
          setError("Todos os campos são obrigatórios para criar uma conta");
          return;
        }

        const result = await signUp(email, password);
        if (result.error) {
          setError(result.error);
        }
      } else {
        const result = await signIn(email, password);
        if (result.error) {
          setError(result.error);
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro desconhecido");
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    // Implement Google login logic here
    console.log("Google login not implemented yet");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Brand and benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white flex-col justify-center px-12">
        <div className="max-w-md">
          <div className="flex items-center mb-8">
            {/* Unclic Logo */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-green-400 flex items-center justify-center mr-4">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold">Unclic Manager</h1>
          </div>

          <h2 className="text-4xl font-bold mb-6">
            Gerencie seu negócio com{" "}
            <span className="text-cyan-300">inteligência</span>
          </h2>

          <p className="text-xl text-blue-100 mb-8">
            A plataforma completa para gestão de agendamentos, clientes e
            finanças. Simplifique sua rotina e acelere seu crescimento.
          </p>

          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center mr-3">
                <div className="w-2 h-2 bg-blue-900 rounded-full"></div>
              </div>
              <span>Multi-estabelecimentos</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center mr-3">
                <div className="w-2 h-2 bg-blue-900 rounded-full"></div>
              </div>
              <span>Dados isolados e seguros</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center mr-3">
                <div className="w-2 h-2 bg-blue-900 rounded-full"></div>
              </div>
              <span>Gestão Completa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Unclic Manager
              </h2>
              <p className="text-gray-600 mt-2">
                {isSignUp
                  ? "Crie sua conta e estabelecimento"
                  : "Faça login para acessar seu estabelecimento"}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Tabs */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setError(null);
                  }}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    !isSignUp
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setError(null);
                  }}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    isSignUp
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Criar Conta
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Sign up fields */}
                {isSignUp && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Seu nome completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="establishmentName">
                        Nome do Estabelecimento
                      </Label>
                      <Input
                        id="establishmentName"
                        type="text"
                        placeholder="Nome do seu salão/barbearia"
                        value={establishmentName}
                        onChange={(e) => setEstablishmentName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="establishmentPhone">
                        Telefone do Estabelecimento
                      </Label>
                      <Input
                        id="establishmentPhone"
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={establishmentPhone}
                        onChange={(e) => setEstablishmentPhone(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="establishmentAddress">
                        Endereço do Estabelecimento
                      </Label>
                      <Input
                        id="establishmentAddress"
                        type="text"
                        placeholder="Rua, número, bairro - Cidade/Estado"
                        value={establishmentAddress}
                        onChange={(e) =>
                          setEstablishmentAddress(e.target.value)
                        }
                        required
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirme sua senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading
                    ? "Carregando..."
                    : isSignUp
                      ? "Criar Estabelecimento"
                      : "Entrar"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Ou continue com
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar com Google
              </Button>

              <div className="text-center text-xs text-gray-500">
                {isSignUp ? (
                  <p>
                    Ao criar uma conta, você aceita nossos{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Termos de Serviço
                    </a>{" "}
                    e{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Política de Privacidade
                    </a>
                  </p>
                ) : (
                  <p>© 2024 Unclic Manager. Todos os direitos reservados.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
