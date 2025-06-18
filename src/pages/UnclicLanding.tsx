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
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

interface Plan {
  name: string;
  price: string;
  originalPrice?: string;
  description: string;
  features: string[];
  badge?: string;
  badgeColor?: string;
  buttonText: string;
  buttonVariant: "default" | "secondary" | "outline";
  popular?: boolean;
}

export const UnclicLanding: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features: Feature[] = [
    {
      icon: Calendar,
      title: "Agendamentos Inteligentes",
      description:
        "Sistema automatizado que integra WhatsApp, lembretes automáticos e gestão completa de agenda em tempo real.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: BarChart3,
      title: "Relatórios Avançados",
      description:
        "Dashboards intuitivos com métricas de performance, análise de faturamento e insights estratégicos para crescimento.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Users,
      title: "Gestão de Clientes",
      description:
        "CRM completo com histórico detalhado, preferências, programa de fidelidade e comunicação personalizada.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: PieChart,
      title: "Controle Financeiro",
      description:
        "Gestão completa de receitas, despesas, comissões e relatórios fiscais com integração bancária.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Smartphone,
      title: "App Mobile Nativo",
      description:
        "Aplicativo completo para iOS e Android com sincronização em tempo real e funcionalidades offline.",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      icon: Shield,
      title: "Segurança Máxima",
      description:
        "Proteção de dados com criptografia, backup automático e conformidade com LGPD e regulamentações.",
      gradient: "from-teal-500 to-green-500",
    },
  ];

  const testimonials: Testimonial[] = [
    {
      name: "Maria Silva",
      role: "Proprietária",
      company: "Salão Bella Vista",
      avatar: "MS",
      content:
        "A UNCLIC revolucionou meu salão! Em 3 meses aumentei 40% no faturamento e reduzi 70% dos no-shows. O sistema é intuitivo e o suporte é excepcional.",
      rating: 5,
    },
    {
      name: "João Santos",
      role: "Gerente",
      company: "Barbearia Premium",
      avatar: "JS",
      content:
        "Automatizamos tudo com a UNCLIC. Os agendamentos pelo WhatsApp, relatórios em tempo real e gestão de estoque. Nossa produtividade triplicou!",
      rating: 5,
    },
    {
      name: "Ana Oliveira",
      role: "CEO",
      company: "Rede Beauty Care",
      avatar: "AO",
      content:
        "Gerencio 5 unidades com a UNCLIC. Visão consolidada, controle total e ROI positivo em 2 meses. Indispensável para crescer com qualidade.",
      rating: 5,
    },
  ];

  const plans: Plan[] = [
    {
      name: "Starter",
      price: "R$ 97",
      originalPrice: "R$ 197",
      description: "Perfeito para salões e barbearias iniciantes",
      features: [
        "Até 500 agendamentos/mês",
        "Integração WhatsApp",
        "Relatórios básicos",
        "App mobile",
        "Suporte por email",
        "1 usuário",
      ],
      buttonText: "Começar Grátis",
      buttonVariant: "outline",
    },
    {
      name: "Professional",
      price: "R$ 197",
      originalPrice: "R$ 397",
      description: "Para estabelecimentos em crescimento",
      features: [
        "Agendamentos ilimitados",
        "WhatsApp + SMS + Email",
        "Relatórios avançados",
        "App mobile premium",
        "Suporte prioritário",
        "Até 5 usuários",
        "Programa de fidelidade",
        "Integração fiscal",
      ],
      badge: "Mais Popular",
      badgeColor: "bg-gradient-to-r from-blue-500 to-purple-500",
      buttonText: "Experimentar 30 Dias Grátis",
      buttonVariant: "default",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "R$ 397",
      originalPrice: "R$ 797",
      description: "Solução completa para redes e franquias",
      features: [
        "Tudo do Professional",
        "Multi-unidades ilimitadas",
        "API personalizada",
        "Relatórios corporativos",
        "Suporte 24/7",
        "Usuários ilimitados",
        "Integrações avançadas",
        "Consultoria especializada",
      ],
      badge: "Enterprise",
      badgeColor: "bg-gradient-to-r from-amber-500 to-orange-500",
      buttonText: "Falar com Especialista",
      buttonVariant: "secondary",
    },
  ];

  const stats = [
    { number: "15,000+", label: "Estabelecimentos Ativos", icon: Building },
    { number: "2.5M+", label: "Agendamentos Processados", icon: Calendar },
    { number: "98%", label: "Satisfação dos Clientes", icon: Heart },
    { number: "35%", label: "Aumento Médio de Faturamento", icon: TrendingUp },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrollY > 50
            ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100"
            : "bg-transparent",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  UNCLIC
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Beauty Tech</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { id: "hero", label: "Início" },
                { id: "features", label: "Recursos" },
                { id: "testimonials", label: "Clientes" },
                { id: "pricing", label: "Preços" },
                { id: "contact", label: "Contato" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "text-sm font-medium transition-colors duration-200 hover:text-blue-600",
                    activeSection === item.id
                      ? "text-blue-600"
                      : "text-gray-700",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              >
                Teste Grátis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {[
                { id: "hero", label: "Início" },
                { id: "features", label: "Recursos" },
                { id: "testimonials", label: "Clientes" },
                { id: "pricing", label: "Preços" },
                { id: "contact", label: "Contato" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.id);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 py-2"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 space-y-3">
                <Button variant="ghost" className="w-full justify-start">
                  Entrar
                </Button>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  Teste Grátis
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0 px-4 py-2 mb-6">
              <Rocket className="w-4 h-4 mr-2" />
              #1 em Gestão para Salões de Beleza
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Transforme Seu
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block">
              Salão em uma
            </span>
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Máquina de Vendas
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            A única plataforma que você precisa para{" "}
            <span className="font-semibold text-blue-600">automatizar</span>,{" "}
            <span className="font-semibold text-purple-600">gerenciar</span> e{" "}
            <span className="font-semibold text-pink-600">escalar</span> seu
            negócio de beleza. Aumente seu faturamento em até{" "}
            <span className="font-bold text-green-600">40%</span> nos primeiros
            90 dias.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl px-8 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-200"
            >
              <Play className="w-5 h-5 mr-2" />
              Começar Teste Grátis de 30 Dias
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-gray-300 hover:border-blue-500 px-8 py-4 text-lg rounded-xl"
            >
              <Eye className="w-5 h-5 mr-2" />
              Ver Demonstração
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Sem fidelidade
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Suporte 24/7
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Configuração em 24h
            </div>
          </div>
        </div>

        {/* Floating Dashboard Preview */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 hidden lg:block">
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">
                  Dashboard Preview
                </h3>
                <Badge className="bg-green-100 text-green-700">
                  <Activity className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">247</div>
                  <div className="text-xs text-blue-700">Agendamentos hoje</div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    R$ 8,5K
                  </div>
                  <div className="text-xs text-green-700">Receita mensal</div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl -z-10 scale-110" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-blue-50 text-blue-600 border-blue-200 mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Recursos Poderosos
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tudo que você precisa para
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                dominar o mercado
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Uma suíte completa de ferramentas profissionais desenvolvidas
              especificamente para estabelecimentos de beleza modernos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="relative p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div
                      className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-r",
                        feature.gradient,
                      )}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 rounded-full blur-2xl transform translate-x-16 -translate-y-16",
                      feature.gradient,
                    )}
                  />
                </Card>
              );
            })}
          </div>

          {/* Integration Section */}
          <div className="mt-20 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Integração Total com suas Ferramentas Favoritas
              </h3>
              <p className="text-gray-600 text-lg">
                Conecte-se facilmente com mais de 50+ aplicações essenciais
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
              {[
                "WhatsApp",
                "Instagram",
                "Google",
                "Mercado Pago",
                "PagSeguro",
                "Stripe",
              ].map((integration, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-200 w-24 h-24 flex items-center justify-center"
                >
                  <span className="font-semibold text-gray-600 text-sm text-center">
                    {integration}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-green-50 text-green-600 border-green-200 mb-4">
              <Award className="w-4 h-4 mr-2" />
              Depoimentos Reais
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Mais de{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                15 mil estabelecimentos
              </span>{" "}
              confiam na UNCLIC
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Veja como nossos clientes transformaram seus negócios e alcançaram
              resultados extraordinários
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
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

                <p className="text-gray-700 leading-relaxed">
                  "{testimonial.content}"
                </p>
              </Card>
            ))}
          </div>

          {/* Social Proof */}
          <div className="mt-16 text-center">
            <p className="text-gray-500 mb-8">
              Avaliação média de 4.9/5 baseada em mais de 2,500 reviews
            </p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold">4.9</span>
                <span className="text-sm">Google</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold">4.8</span>
                <span className="text-sm">Trustpilot</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold">4.9</span>
                <span className="text-sm">App Store</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-purple-50 text-purple-600 border-purple-200 mb-4">
              <Crown className="w-4 h-4 mr-2" />
              Planos e Preços
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Escolha o plano perfeito
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}
                para seu negócio
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sem surpresas, sem taxas ocultas. Todos os planos incluem suporte
              especializado e atualizações gratuitas
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={cn(
                  "relative p-8 border-2 transition-all duration-300 hover:shadow-2xl",
                  plan.popular
                    ? "border-purple-200 shadow-xl scale-105"
                    : "border-gray-200 hover:border-purple-200",
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge
                      className={cn(
                        "text-white border-0 px-4 py-1",
                        plan.badgeColor,
                      )}
                    >
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  <div className="mb-4">
                    {plan.originalPrice && (
                      <span className="text-lg text-gray-400 line-through mr-2">
                        {plan.originalPrice}
                      </span>
                    )}
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600">/mês</span>
                  </div>

                  {plan.originalPrice && (
                    <Badge className="bg-red-100 text-red-600 border-red-200">
                      50% OFF - Oferta Limitada
                    </Badge>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className={cn(
                    "w-full py-3",
                    plan.buttonVariant === "default" &&
                      "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white",
                    plan.buttonVariant === "outline" &&
                      "border-2 border-purple-600 text-purple-600 hover:bg-purple-50",
                    plan.buttonVariant === "secondary" &&
                      "bg-gray-100 text-gray-900 hover:bg-gray-200",
                  )}
                >
                  {plan.buttonText}
                </Button>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Precisa de algo personalizado para sua rede ou franquia?
            </p>
            <Button variant="outline" size="lg">
              <HeadphonesIcon className="w-5 h-5 mr-2" />
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para revolucionar
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {" "}
              seu negócio?
            </span>
          </h2>

          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de proprietários que já transformaram seus
            salões em máquinas de vendas automatizadas
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button
              size="lg"
              className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-200 shadow-2xl"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Começar Agora - 30 Dias Grátis
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-900 px-8 py-4 text-lg rounded-xl"
            >
              <Phone className="w-5 h-5 mr-2" />
              (11) 9 9999-9999
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-gray-300">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              Configuração em 24h
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              Migração gratuita
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              Suporte especializado
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Badge className="bg-blue-50 text-blue-600 border-blue-200 mb-4">
                <MessageCircle className="w-4 h-4 mr-2" />
                Fale Conosco
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Vamos conversar sobre
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  seu sucesso
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Nossa equipe de especialistas está pronta para ajudar você a
                transformar seu negócio. Entre em contato e descubra como
                podemos acelerar seus resultados.
              </p>

              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Telefone</p>
                    <p className="text-gray-600">(11) 9 9999-9999</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">contato@unclic.com.br</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Endereço</p>
                    <p className="text-gray-600">
                      São Paulo, SP - Brasil
                      <br />
                      Atendimento em todo território nacional
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-8 border-0 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Envie sua mensagem
              </h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome
                    </label>
                    <Input
                      placeholder="Seu nome completo"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <Input
                      placeholder="(11) 9 9999-9999"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de estabelecimento
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Selecione...</option>
                    <option>Salão de Beleza</option>
                    <option>Barbearia</option>
                    <option>Clínica de Estética</option>
                    <option>Spa</option>
                    <option>Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem
                  </label>
                  <Textarea
                    placeholder="Conte-nos sobre seu negócio e como podemos ajudar..."
                    rows={4}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3">
                  <Send className="w-5 h-5 mr-2" />
                  Enviar Mensagem
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">UNCLIC</h1>
                  <p className="text-sm text-gray-400 -mt-1">Beauty Tech</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                A plataforma mais completa para gestão de salões de beleza,
                barbearias e clínicas de estética. Transformamos negócios em
                máquinas de vendas automatizadas.
              </p>
              <div className="flex space-x-4">
                {[Instagram, Facebook, Twitter, Linkedin, Youtube].map(
                  (Icon, index) => (
                    <a
                      key={index}
                      href="#"
                      className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ),
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Recursos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Preços
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrações
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Central de Ajuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentação
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contato
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 UNCLIC. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacidade
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Termos
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white rounded-full w-16 h-16 shadow-2xl animate-pulse"
        >
          <MessageCircle className="w-8 h-8" />
        </Button>
      </div>
    </div>
  );
};
