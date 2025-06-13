
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Scissors, Mail, Lock, User, Phone, MapPin, Building, AlertCircle, CheckCircle } from 'lucide-react';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [barbershopName, setBarbershopName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResendOption, setShowResendOption] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const { signIn, signUp, resendConfirmation } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowResendOption(false);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Email ou senha incorretos. Verifique suas credenciais.');
          } else if (error.message.includes('Email not confirmed')) {
            toast.error('Email não confirmado. Verifique sua caixa de entrada.');
            setShowResendOption(true);
            setPendingEmail(email);
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Login realizado com sucesso!');
        }
      } else {
        const userData = {
          name,
          phone,
          city,
          barbershop_name: barbershopName
        };
        
        const { error, data } = await signUp(email, password, userData);
        
        if (error) {
          console.log('Signup error details:', error);
          if (error.message.includes('User already registered')) {
            toast.error('Este email já está cadastrado. Tente fazer login ou use outro email.');
            setShowResendOption(true);
            setPendingEmail(email);
          } else if (error.message.includes('Password should be at least')) {
            toast.error('A senha deve ter pelo menos 6 caracteres.');
          } else {
            toast.error(`Erro no cadastro: ${error.message}`);
          }
        } else {
          console.log('Signup successful:', data);
          if (data?.user && !data.user.email_confirmed_at) {
            toast.success('Conta criada com sucesso! Verifique seu email para confirmar.');
            setShowResendOption(true);
            setPendingEmail(email);
          } else {
            toast.success('Conta criada e confirmada com sucesso!');
          }
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!pendingEmail) return;
    
    setLoading(true);
    try {
      const { error } = await resendConfirmation(pendingEmail);
      if (error) {
        toast.error(`Erro ao reenviar email: ${error.message}`);
      } else {
        toast.success('Email de confirmação reenviado! Verifique sua caixa de entrada.');
      }
    } catch (error) {
      toast.error('Erro ao reenviar email de confirmação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Scissors className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? 'Entre na sua conta para gerenciar sua barbearia' 
              : 'Crie sua conta e comece a gerenciar sua barbearia'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showResendOption && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex flex-col gap-2">
                Email de confirmação necessário para: {pendingEmail}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleResendConfirmation}
                  disabled={loading}
                >
                  Reenviar email de confirmação
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Nome da barbearia"
                    value={barbershopName}
                    onChange={(e) => setBarbershopName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="Telefone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cidade"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={() => {
                setIsLogin(!isLogin);
                setShowResendOption(false);
                setPendingEmail('');
              }}
              className="text-sm"
            >
              {isLogin 
                ? 'Não tem uma conta? Criar conta' 
                : 'Já tem uma conta? Entrar'}
            </Button>
          </div>

          <div className="mt-4 text-xs text-gray-500 text-center">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Se não receber o email de confirmação, verifique sua caixa de spam ou use o botão "Reenviar email de confirmação" acima.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
