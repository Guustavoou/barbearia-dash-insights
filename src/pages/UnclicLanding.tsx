import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Calendar,
  BarChart3,
  MessageCircle,
  Smartphone,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  Award,
  Play,
  ChevronDown,
  Menu,
  X,
  Globe,
  HeadphonesIcon,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Sparkles,
  Rocket,
  Target,
  Heart,
  Building,
  PieChart,
  DollarSign,
  Scissors,
  Palette,
  Crown,
  Gem,
  Infinity,
  MousePointer,
  Eye,
  Lightbulb,
  Code,
  Laptop,
  TabletSmartphone,
  Activity,
  Send,
  Settings,
  UserCheck,
  Bot,
  CreditCard,
  TrendingDown,
  Briefcase,
  ChevronRight,
  Gauge,
  Timer,
  Workflow,
  Brain,
  Megaphone,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface UnclicLandingProps {
  onNavigateToLogin?: () => void;
}

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
}

interface Benefit {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  result: string;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  result: string;
}

export const UnclicLanding: React.FC<UnclicLandingProps> = ({
  onNavigateToLogin,
}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const howItWorksSteps = [
    {
      number: "1",
      title: "Configure em minutos",
      description:
        "Cadastre seus horários, profissionais e serviços com rapidez e sem complexidade.",
      icon: Settings,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      number: "2",
      title: "Agendamento direto no WhatsApp",
      description:
        "Seu cliente agenda sozinho, sem app, sem ligação. Simples e automático.",
      icon: MessageCircle,
      gradient: "from-blue-600 to-blue-400",
    },
    {
      number: "3",
      title: "Controle total na palma da sua mão",
      description:
        "Visualize agendamentos, estoque e vendas em tempo real, em um painel único e intuitivo.",
      icon: Smartphone,
      gradient: "from-blue-700 to-purple-500",
    },
  ];

  const benefits: Benefit[] = [
    {
      icon: Calendar,
      title: "Agendamentos ilimitados",
      result: "+40% no faturamento médio",
    },
    {
      icon: Users,
      title: "Clientes e estoque organizados",
      result: "–70% nos no-shows",
    },
    {
      icon: PieChart,
      title: "Controle financeiro completo",
      result: "+80% de produtividade",
    },
    {
      icon: CreditCard,
      title: "Pagamentos integrados",
      result: "Pagamentos automáticos",
    },
    {
      icon: MessageCircle,
      title: "Notificações automáticas via WhatsApp",
      result: "Comunicação direta",
    },
  ];

  const testimonials: Testimonial[] = [
    {
      name: "Maria Silva",
      role: "Proprietária",
      company: "Salão Bella Vista",
      avatar: "MS",
      content:
        "Aumentei 40% do faturamento em 3 meses e nunca mais fiquei no prejuízo com faltas.",
      rating: 5,
      result: "+40% faturamento",
    },
    {
      name: "João Santos",
      role: "Gerente",
      company: "Barbearia Premium",
      avatar: "JS",
      content:
        "Nossa produtividade triplicou com agendamento automático e controle de estoque.",
      rating: 5,
      result: "3x produtividade",
    },
    {
      name: "Ana Oliveira",
      role: "CEO",
      company: "Rede Beauty Care",
      avatar: "AO",
      content:
        "Gerencio 5 unidades com total controle, sem gastar 1 real de mensalidade.",
      rating: 5,
      result: "5 unidades controladas",
    },
  ];

  const aiFeatures = [
    {
      icon: Brain,
      title: "Agendamentos com lembretes automáticos",
      description: "IA inteligente que nunca esquece de seus clientes",
    },
    {
      icon: TrendingDown,
      title: "Redução de faltas com notificações inteligentes",
      description: "Algoritmos que diminuem no-shows em até 70%",
    },
    {
      icon: BarChart3,
      title: "Relatórios em tempo real com insights acionáveis",
      description: "Dados que geram crescimento imediato",
    },
    {
      icon: Workflow,
      title: "Reagendamentos e histórico de visitas",
      description: "Gestão completa do relacionamento com clientes",
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* HERO 1 — Impacto & Proposta de Valor */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with 3D animated elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100">
          <div className="absolute inset-0 overflow-hidden">
            {/* 3D Floating Elements */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float" />
            <div
              className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/15 to-purple-500/15 rounded-full blur-3xl animate-float"
              style={{ animationDelay: "2s" }}
            />
            <div
              className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-cyan-400/25 to-blue-400/25 rounded-full blur-3xl animate-float"
              style={{ animationDelay: "4s" }}
            />

            {/* 3D Grid Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgb(37, 99, 235) 1px, transparent 0)`,
                  backgroundSize: "40px 40px",
                }}
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Revolutionary Badge */}
          <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
            <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200 mb-4 px-6 py-2 text-sm font-semibold shadow-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              💡 UNCLIC — A revolução da gestão para barbearias começou
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-8 leading-none tracking-tight">
            Automatize agendamentos,{" "}
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent animate-gradient-x">
              organize seu estoque
            </span>
          </h1>

          <p className="text-2xl md:text-3xl text-gray-700 mb-6 max-w-5xl mx-auto leading-relaxed font-medium">
            controle seu financeiro e{" "}
            <strong className="text-blue-600">aumente sua receita</strong> —
            tudo a partir do WhatsApp.
          </p>

          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Sem mensalidade. Sem burocracia.{" "}
            <strong className="text-green-600">
              100% gratuito para começar agora.
            </strong>
          </p>

          {/* Social Proof */}
          <div className="mb-12">
            <p className="text-lg text-blue-700 font-semibold mb-6">
              👉 Já são mais de{" "}
              <span className="text-2xl font-black text-blue-600">
                15 mil estabelecimentos
              </span>{" "}
              confiando na nossa tecnologia.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              size="lg"
              onClick={onNavigateToLogin}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <Rocket className="w-6 h-6 mr-3" />
              Começar Agora – É 100% Gratuito
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onNavigateToLogin}
              className="border-2 border-blue-300 hover:border-blue-400 text-blue-700 hover:text-blue-800 px-12 py-6 text-xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
            >
              <Play className="w-6 h-6 mr-3" />
              Ver Demonstração
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
              <span className="font-semibold text-gray-700">
                ✔ Sem mensalidade
              </span>
            </div>
            <div className="flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <Clock className="w-6 h-6 text-blue-500 mr-3" />
              <span className="font-semibold text-gray-700">
                ✔ Configuração em até 24h
              </span>
            </div>
            <div className="flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <HeadphonesIcon className="w-6 h-6 text-purple-500 mr-3" />
              <span className="font-semibold text-gray-700">
                ✔ Suporte humano 24/7
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* HERO 2 — Como Funciona */}
      <section className="py-24 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full bg-gradient-to-r from-blue-600 to-cyan-600"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200 mb-6 px-6 py-2 text-lg font-semibold">
              <Settings className="w-5 h-5 mr-2" />
              🛠️ Como funciona?
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8">
              A gestão que cabe na sua{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                rotina
              </span>{" "}
              — e no seu bolso.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card
                  key={index}
                  className="relative p-10 border-0 bg-white shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group overflow-hidden"
                >
                  {/* 3D Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 transform group-hover:scale-110 transition-transform duration-500" />

                  <div className="relative z-10">
                    {/* Step Number */}
                    <div className="flex items-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black mr-4 shadow-lg transform group-hover:rotate-6 transition-transform duration-300">
                        {step.number}
                      </div>
                      <div
                        className={cn(
                          "w-16 h-16 rounded-2xl bg-gradient-to-r flex items-center justify-center transform group-hover:-rotate-6 transition-transform duration-300",
                          step.gradient,
                        )}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-16">
            <Button
              size="lg"
              onClick={onNavigateToLogin}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <Zap className="w-6 h-6 mr-3" />
              Quero Automatizar Minha Barbearia
            </Button>
          </div>
        </div>
      </section>

      {/* HERO 3 — Benefícios Reais, Resultados Reais */}
      <section className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-800 text-white relative overflow-hidden">
        {/* 3D Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <Badge className="bg-white/10 text-white border-white/20 mb-6 px-6 py-2 text-lg font-semibold backdrop-blur-sm">
              <BarChart3 className="w-5 h-5 mr-2" />
              📊 Transforme rotina em resultado — sem pagar mensalidade
            </Badge>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card
                  key={index}
                  className="bg-white/10 backdrop-blur-md border-white/20 p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-r from-white/20 to-white/10 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-cyan-200 font-semibold">
                    {benefit.result}
                  </p>
                </Card>
              );
            })}
          </div>

          {/* Results Statistics */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-12 mb-16 border border-white/10">
            <h3 className="text-3xl font-bold text-center mb-12 text-white">
              📈 Resultados comprovados:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="transform hover:scale-110 transition-transform duration-300">
                <div className="text-5xl font-black text-green-400 mb-2">
                  +40%
                </div>
                <p className="text-xl text-white">no faturamento médio</p>
              </div>
              <div className="transform hover:scale-110 transition-transform duration-300">
                <div className="text-5xl font-black text-red-400 mb-2">
                  –70%
                </div>
                <p className="text-xl text-white">nos no-shows</p>
              </div>
              <div className="transform hover:scale-110 transition-transform duration-300">
                <div className="text-5xl font-black text-blue-400 mb-2">
                  +80%
                </div>
                <p className="text-xl text-white">de produtividade</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              onClick={onNavigateToLogin}
              className="bg-white text-blue-800 hover:bg-blue-50 px-12 py-6 text-xl font-bold shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Rocket className="w-6 h-6 mr-3" />
              Comece Gratuitamente
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onNavigateToLogin}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-800 px-12 py-6 text-xl font-bold transition-all duration-300 transform hover:scale-105"
            >
              <Eye className="w-6 h-6 mr-3" />
              Veja o Painel na Prática
            </Button>
          </div>
        </div>
      </section>

      {/* HERO 4 — Depoimentos Reais */}
      <section className="py-24 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgb(37, 99, 235) 1px, transparent 0)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200 mb-6 px-6 py-2 text-lg font-semibold">
              <Megaphone className="w-5 h-5 mr-2" />
              📣 Histórias que inspiram — resultados que convencem
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="p-8 border-0 bg-white shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group relative overflow-hidden"
              >
                {/* 3D Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-cyan-50/30 transform group-hover:scale-110 transition-transform duration-500" />

                <div className="relative z-10">
                  {/* Result Badge */}
                  <div className="absolute -top-4 -right-4">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-3 py-1">
                      {testimonial.result}
                    </Badge>
                  </div>

                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        {testimonial.name}
                      </h4>
                      <p className="text-blue-600 text-sm font-semibold">
                        {testimonial.role} • {testimonial.company}
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  <blockquote className="text-gray-700 leading-relaxed text-lg italic">
                    "{testimonial.content}"
                  </blockquote>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                onClick={onNavigateToLogin}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <Users className="w-6 h-6 mr-3" />
                Ver Mais Depoimentos
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onNavigateToLogin}
                className="border-2 border-blue-300 hover:border-blue-400 text-blue-700 hover:text-blue-800 px-12 py-6 text-xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
              >
                <UserCheck className="w-6 h-6 mr-3" />
                Criar Conta Gratuita
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* HERO 5 — Modelo de Cobrança Transparente */}
      <section className="py-24 bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50 relative overflow-hidden">
        {/* 3D Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-green-400/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700 border-green-200 mb-6 px-6 py-2 text-lg font-semibold">
              <DollarSign className="w-5 h-5 mr-2" />
              💸 Plano único. Totalmente transparente. Sem mensalidade.
            </Badge>
          </div>

          <Card className="p-16 border-2 border-green-200 bg-white shadow-2xl hover:shadow-green-500/20 transition-all duration-500 transform hover:scale-105 relative overflow-hidden">
            {/* 3D Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="h-full w-full bg-gradient-to-br from-green-600 to-blue-600"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)",
                }}
              />
            </div>

            <div className="relative z-10">
              {/* No Monthly Fee Section */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center bg-red-100 text-red-700 px-6 py-3 rounded-full font-bold text-xl mb-6">
                  <X className="w-6 h-6 mr-2" />
                  🚫 Nada de mensalidade, taxa de adesão ou letra miúda.
                </div>
              </div>

              {/* Pricing Display */}
              <div className="text-center mb-12">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl p-8 text-white mb-8 transform hover:scale-105 transition-transform duration-300">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                  <div className="text-6xl font-black mb-4">R$ 0</div>
                  <p className="text-2xl mb-4">mensalidade para sempre</p>
                  <div className="text-3xl font-bold">
                    ✅ Você só paga{" "}
                    <span className="text-yellow-300">
                      R$ 2,58 por agendamento concluído
                    </span>
                  </div>
                  <p className="text-lg mt-4 opacity-90">
                    Já incluso: uso completo da plataforma + taxa de pagamento +
                    suporte 24h
                  </p>
                </div>
              </div>

              {/* Features Included */}
              <div className="bg-blue-50 rounded-2xl p-8 mb-12">
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
                  📦 Todos os recursos liberados desde o primeiro login. Nenhum
                  bloqueio. Nenhum truque.
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "✅ Agendamentos ilimitados",
                    "✅ WhatsApp integração completa",
                    "✅ Gestão de clientes e estoque",
                    "✅ Relatórios financeiros avançados",
                    "✅ App mobile nativo",
                    "✅ Suporte 24/7 especializado",
                    "✅ Backup automático",
                    "✅ Segurança empresarial",
                    "✅ Múltiplos usuários",
                    "✅ API personalizada",
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center text-gray-700 font-medium"
                    >
                      <span className="text-green-600 mr-3 text-xl">✅</span>
                      {feature.replace("✅ ", "")}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <Button
                  size="lg"
                  onClick={onNavigateToLogin}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-16 py-8 text-2xl font-bold shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  <Rocket className="w-8 h-8 mr-4" />
                  Começar Gratuitamente Agora
                </Button>
                <p className="text-gray-500 mt-4 text-lg">
                  Sem cartão de crédito • Configuração imediata • Suporte
                  incluído
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* HERO 6 — Inteligência Artificial */}
      <section className="py-24 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        {/* 3D AI Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <Badge className="bg-white/10 text-white border-white/20 mb-6 px-6 py-2 text-lg font-semibold backdrop-blur-sm">
              <Bot className="w-5 h-5 mr-2" />
              🤖 Eficiência orientada por IA — e você no controle
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            {aiFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="bg-white/5 backdrop-blur-md border-white/10 p-8 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 group"
                >
                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">
                        🧠 {feature.title}
                      </h3>
                      <p className="text-purple-200 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* AI Benefits Highlight */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-12 border border-white/10 mb-16">
            <div className="text-center">
              <h3 className="text-4xl font-bold mb-8">
                🔐 Tudo seguro e integrado ao seu WhatsApp
              </h3>
              <p className="text-2xl text-purple-200 mb-8">
                Inteligência artificial que trabalha para você 24 horas por dia,
                7 dias por semana
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              onClick={onNavigateToLogin}
              className="bg-white text-purple-800 hover:bg-purple-50 px-12 py-6 text-xl font-bold shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Brain className="w-6 h-6 mr-3" />
              Quero Conhecer os Recursos
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onNavigateToLogin}
              className="border-2 border-white text-white hover:bg-white hover:text-purple-800 px-12 py-6 text-xl font-bold transition-all duration-300 transform hover:scale-105"
            >
              <UserCheck className="w-6 h-6 mr-3" />
              Criar Conta
            </Button>
          </div>
        </div>
      </section>

      {/* HERO 7 — Chamada Final */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 text-white relative overflow-hidden">
        {/* Final 3D Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-12">
            <Badge className="bg-white/10 text-white border-white/20 mb-6 px-6 py-2 text-lg font-semibold backdrop-blur-sm">
              <Phone className="w-5 h-5 mr-2" />
              📲 Está pronto para crescer sem se preocupar com mensalidade?
            </Badge>
          </div>

          <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
            A Unclic é a plataforma que{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              entende seu negócio
            </span>
          </h2>

          <p className="text-2xl mb-12 text-cyan-100 max-w-4xl mx-auto leading-relaxed">
            Ative sua conta agora, sem cartão de crédito e com todos os recursos
            liberados desde o início.
          </p>

          {/* Final CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              size="lg"
              onClick={onNavigateToLogin}
              className="bg-white text-blue-700 hover:bg-blue-50 px-16 py-8 text-2xl font-bold shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
            >
              <Rocket className="w-8 h-8 mr-4" />
              Criar Conta Gratuita
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onNavigateToLogin}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-16 py-8 text-2xl font-bold transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
            >
              <MessageCircle className="w-8 h-8 mr-4" />
              Fale com a Gente no WhatsApp
            </Button>
          </div>

          {/* Final Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: CheckCircle, text: "✔ Sem mensalidade" },
              { icon: X, text: "✔ Sem contrato" },
              { icon: HeadphonesIcon, text: "✔ Suporte humano 24/7" },
              { icon: Zap, text: "✔ Liberação imediata" },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-transform duration-300"
                >
                  <Icon className="w-8 h-8 mb-3" />
                  <span className="font-semibold text-center">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <span className="text-3xl font-bold">UNCLIC</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md text-lg">
                A revolução da gestão para barbearias. Automatize, gerencie e
                cresça seu negócio com tecnologia de ponta, sem mensalidade.
              </p>
              <div className="flex space-x-4">
                {[Facebook, Instagram, Twitter, Linkedin].map(
                  (Social, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer transform hover:scale-110 duration-300"
                    >
                      <Social className="w-6 h-6" />
                    </div>
                  ),
                )}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-xl">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">
                  Funcionalidades
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  WhatsApp
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Segurança
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  API
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-xl">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">
                  Sobre nós
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Carreiras
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Blog
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Contato
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2024 UNCLIC. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                Termos de Uso
              </span>
              <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                Política de Privacidade
              </span>
              <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                LGPD
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UnclicLanding;
