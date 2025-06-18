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

interface Solution {
  number: string;
  title: string;
  description: string;
  buttonText: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
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
      icon: Settings,
      title: "Configuração Inicial",
      description: "Configure horários, funcionários e serviços rapidamente.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: MessageCircle,
      title: "Agendamentos Automatizados",
      description:
        "Seus clientes agendam diretamente pelo WhatsApp, sem complicações.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: BarChart3,
      title: "Gestão Completa",
      description:
        "Acompanhe agendamentos, estoque e finanças em uma plataforma centralizada.",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  const solutions: Solution[] = [
    {
      number: "1",
      title: "Agendamentos Inteligentes",
      description:
        "Automatize agendamentos e reduza a carga de trabalho com IA integrada ao WhatsApp.",
      buttonText: "Teste gratis agora mesmo",
      icon: Calendar,
    },
    {
      number: "2",
      title: "Gestão Centralizada",
      description:
        "Controle tudo, desde estoque até relatórios financeiros, em um só lugar.",
      buttonText: "Teste gratis agora mesmo",
      icon: Building,
    },
    {
      number: "3",
      title: "Ferramentas de Comunicação",
      description:
        "Respostas automáticas e comunicação eficiente para facilitar o atendimento ao cliente.",
      buttonText: "Teste gratis agora mesmo",
      icon: MessageCircle,
    },
    {
      number: "4",
      title: "Pagamentos e Relatórios",
      description:
        "Processamento de pagamentos e relatórios financeiros que oferecem clareza e controle.",
      buttonText: "Teste gratis agora mesmo",
      icon: CreditCard,
    },
  ];

  const features2: Feature[] = [
    {
      icon: Building,
      title: "Gestão Integrada",
      description: "Controle total das operações com um dashboard intuitivo.",
      gradient: "from-blue-500 to-purple-500",
    },
    {
      icon: Bot,
      title: "Automação Personalizada",
      description: "Processos otimizados para aumentar a produtividade.",
      gradient: "from-green-500 to-blue-500",
    },
    {
      icon: HeadphonesIcon,
      title: "Suporte Especializado",
      description:
        "Equipe pronta para ajudar em todas as etapas do seu negócio.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Activity,
      title: "Insights em tempo real",
      description:
        "Fique à frente com monitoramento de desempenho preciso e em tempo real",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: TrendingUp,
      title: "Crescimento mensurável",
      description:
        "Monitore seu progresso e alcance um crescimento sustentável",
      gradient: "from-teal-500 to-green-500",
    },
    {
      icon: Users,
      title: "Colaboração perfeita",
      description:
        "simplifique seu fluxo de trabalho, tudo em um só lugar com facilidade",
      gradient: "from-indigo-500 to-blue-500",
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

  const scrollingFeatures = [
    "Instant Savings",
    "Flexible Payments",
    "Smart Spending",
    "Customizable Plans",
    "Smart Insights",
    "Automatic Adjustments",
    "Real-Time Reports",
    "Secure Transactions",
    "Dedicated Support",
    "Growth With AI",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="blob absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="blob absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/30 to-pink-400/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="blob absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-green-400/30 to-blue-400/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              UNCLIC.TECH
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Transforme a gestão do{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              seu estabelecimento
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Automação de agendamentos, controle de estoque e gestão completa do
            seu estabelecimento em uma única plataforma integrada ao WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Cadastra-se
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-purple-200 hover:border-purple-300 px-8 py-4 text-lg hover:bg-purple-50 transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              Ver Demonstração
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-sm text-gray-600">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Sistema 100% Gratuito
            </div>
            <div className="flex items-center justify-center">
              <HeadphonesIcon className="w-5 h-5 text-blue-500 mr-2" />
              Suporte 24/7
            </div>
            <div className="flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-500 mr-2" />
              Configuração em 24h
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-blue-50 text-blue-600 border-blue-200 mb-4">
              <Lightbulb className="w-4 h-4 mr-2" />
              Como Funciona
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Conheça a simplicidade e eficiência da{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Unclic
              </span>{" "}
              para gerenciar seu negócio
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
                >
                  <div
                    className={cn(
                      "w-16 h-16 rounded-2xl bg-gradient-to-r flex items-center justify-center mb-6",
                      feature.gradient,
                    )}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Scrolling Features Section */}
      <section className="py-12 bg-white overflow-hidden">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Explore o Universo de Soluções da unclic!
          </h3>
          <p className="text-gray-600">
            Não importa qual seja o seu segmento, aqui você encontra a
            ferramenta perfeita para impulsionar o seu negócio.
          </p>
        </div>

        <div className="relative">
          <div className="flex animate-scroll space-x-8">
            {[...Array(4)].map((_, setIndex) => (
              <div key={setIndex} className="flex space-x-8 flex-shrink-0">
                {scrollingFeatures.map((feature, index) => (
                  <div
                    key={`${setIndex}-${index}`}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-6 py-3 border border-blue-100 flex-shrink-0"
                  >
                    <span className="text-blue-700 font-medium whitespace-nowrap">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-purple-50 text-purple-600 border-purple-200 mb-4">
              <Target className="w-4 h-4 mr-2" />
              Nossas Soluções
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Descubra as ferramentas que vão{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                transformar a gestão
              </span>{" "}
              da sua empresa
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => {
              const Icon = solution.icon;
              return (
                <Card
                  key={index}
                  className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
                >
                  <div className="flex items-start mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-4 flex-shrink-0">
                      {solution.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {solution.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {solution.description}
                      </p>
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                        {solution.buttonText}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI & Efficiency Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-green-50 text-green-600 border-green-200 mb-4">
              <Zap className="w-4 h-4 mr-2" />
              EFICIÊNCIA ORIENTADA POR IA
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nunca perca uma oportunidade
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Capture leads, analise tendências e centralize insights críticos
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-purple-50">
              <Globe className="w-12 h-12 text-blue-600 mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Integração sem esforço
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Seus dados são sincronizados em tempo real em todos os
                dispositivos, garantindo que você permaneça conectado e
                informado, on-line ou off-line.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-blue-50">
              <Shield className="w-12 h-12 text-green-600 mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Seguro e escalável
              </h3>
              <p className="text-gray-600 leading-relaxed">
                A criptografia de nível empresarial protege suas informações,
                enquanto ferramentas flexíveis se adaptam às necessidades do seu
                negócio.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50">
              <BarChart3 className="w-12 h-12 text-purple-600 mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Insights acionáveis
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Aproveite a análise com tecnologia de IA para identificar
                tendências, prever resultados e otimizar seu fluxo de trabalho
                sem esforço.
              </p>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Análise Inteligente & Colaboração em tempo real
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <TrendingUp className="w-6 h-6 text-green-500 mr-3" />
                    <span className="text-gray-700">
                      <strong className="text-green-600">35% aumento</strong> no
                      faturamento
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="w-64 h-64 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full mx-auto flex items-center justify-center">
                  <BarChart3 className="w-32 h-32 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-blue-50 text-blue-600 border-blue-200 mb-4">
              <Globe className="w-4 h-4 mr-2" />
              Integrations
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Conexões perfeitas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Integre-se sem esforço com suas ferramentas e plataformas
              favoritas.
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
      </section>

      {/* Features Grid Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-purple-50 text-purple-600 border-purple-200 mb-4">
              <Star className="w-4 h-4 mr-2" />
              FEATURES
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Todos os recursos em uma ferramenta
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tudo o que você precisa para colaborar, criar e escalar, tudo em
              um só lugar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features2.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
                >
                  <div
                    className={cn(
                      "w-16 h-16 rounded-2xl bg-gradient-to-r flex items-center justify-center mb-6",
                      feature.gradient,
                    )}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Company Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-blue-50 text-blue-600 border-blue-200 mb-4">
              <Building className="w-4 h-4 mr-2" />
              INTRODUCING UNCLIC
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              A Plataforma Completa para{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Gerenciar Seu Negócio!
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-8">
              Transformando Desafios em Oportunidades
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
            >
              Teste Gratuitamente
            </Button>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  A Unclic foi desenvolvida para simplificar e potencializar a
                  gestão de negócios de diversos segmentos. Com uma plataforma
                  intuitiva e funcionalidades robustas, oferecemos soluções sob
                  medida para que você se concentre no crescimento e na
                  satisfação dos seus clientes.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Nossa missão é conectar inovação com a realidade de cada
                  empreendimento, garantindo eficiência, automação e análises
                  precisas para uma tomada de decisão assertiva.
                </p>
              </div>
              <div className="text-center">
                <div className="w-48 h-48 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl font-bold text-blue-600">UC</span>
                </div>
                <p className="text-gray-600">Co-founder & ex google designer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
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
        </div>
      </section>

      {/* Pricing Section - NEW FREE MODEL */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-green-50 text-green-600 border-green-200 mb-4">
              <DollarSign className="w-4 h-4 mr-2" />
              Modelo Gratuito
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sistema{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                100% Gratuito
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              O sistema é gratuito, sem taxa de implantação, mensalidade,
              manutenção, e etc. Cobramos apenas uma taxa de serviço de{" "}
              <strong className="text-green-600">
                R$ 2,58 por agendamento
              </strong>{" "}
              já incluído taxa de processamento de pagamentos.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-12 border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Plano Único - Gratuito
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  Todas as funcionalidades incluídas, sem limitações
                </p>

                <div className="mb-6">
                  <span className="text-5xl font-bold text-green-600">
                    R$ 0
                  </span>
                  <span className="text-gray-600 text-xl">/mês</span>
                </div>

                <Badge className="bg-green-100 text-green-700 text-lg px-4 py-2">
                  Apenas R$ 2,58 por agendamento realizado
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {[
                  "✓ Agendamentos ilimitados",
                  "✓ Integração WhatsApp completa",
                  "✓ Gestão de clientes e estoque",
                  "✓ Relatórios financeiros avançados",
                  "✓ App mobile nativo",
                  "✓ Suporte 24/7 especializado",
                  "✓ Backup automático",
                  "✓ Segurança empresarial",
                  "✓ Múltiplos usuários",
                  "✓ API personalizada",
                  "✓ Programa de fidelidade",
                  "✓ Configuração em 24h",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-green-600 text-lg mr-3">✓</span>
                    <span className="text-gray-700">
                      {feature.replace("✓ ", "")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-4 text-lg"
                >
                  Começar Gratuitamente Agora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  Sem cartão de crédito • Configuração imediata • Suporte
                  incluído
                </p>
              </div>
            </Card>
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Perguntas Frequentes
            </h3>
            <div className="max-w-3xl mx-auto space-y-4">
              <Card className="p-6 text-left">
                <h4 className="font-bold text-gray-900 mb-2">
                  Como funciona a cobrança por agendamento?
                </h4>
                <p className="text-gray-600">
                  Você só paga quando um agendamento é efetivado no sistema. A
                  taxa de R$ 2,58 já inclui todos os custos de processamento de
                  pagamentos e uso da plataforma.
                </p>
              </Card>
              <Card className="p-6 text-left">
                <h4 className="font-bold text-gray-900 mb-2">
                  Existe alguma taxa de setup ou mensalidade?
                </h4>
                <p className="text-gray-600">
                  Não! O sistema é 100% gratuito para usar. Não cobramos taxa de
                  implantação, mensalidade, manutenção ou qualquer outro custo
                  fixo.
                </p>
              </Card>
              <Card className="p-6 text-left">
                <h4 className="font-bold text-gray-900 mb-2">
                  Posso cancelar a qualquer momento?
                </h4>
                <p className="text-gray-600">
                  Sim! Como não há contratos ou mensalidades, você pode parar de
                  usar a qualquer momento sem nenhum custo adicional.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="text-white">
              <Badge className="bg-white/10 text-white border-white/20 mb-4">
                <Mail className="w-4 h-4 mr-2" />
                Entre em Contato
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Pronto para{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  transformar
                </span>{" "}
                seu negócio?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Nossa equipe está pronta para ajudar você a começar sua jornada
                digital
              </p>

              <div className="space-y-6">
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-blue-400 mr-4" />
                  <span className="text-blue-100">+55 (11) 99999-9999</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-blue-400 mr-4" />
                  <span className="text-blue-100">contato@unclic.tech</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-blue-400 mr-4" />
                  <span className="text-blue-100">São Paulo, SP - Brasil</span>
                </div>
              </div>
            </div>

            <Card className="p-8 bg-white/10 backdrop-blur-sm border-white/20">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Nome"
                    className="bg-white/10 border-white/20 text-white placeholder-white/60"
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    className="bg-white/10 border-white/20 text-white placeholder-white/60"
                  />
                </div>
                <Input
                  placeholder="Empresa"
                  className="bg-white/10 border-white/20 text-white placeholder-white/60"
                />
                <Textarea
                  placeholder="Como podemos ajudar?"
                  rows={4}
                  className="bg-white/10 border-white/20 text-white placeholder-white/60"
                />
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
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold">UC</span>
                </div>
                <span className="text-2xl font-bold">UNCLIC</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                A plataforma completa para gestão de estabelecimentos.
                Automatize, gerencie e cresça seu negócio com tecnologia de
                ponta.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Facebook className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Instagram className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Twitter className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Linkedin className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">
                  Funcionalidades
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Integrações
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
              <h4 className="font-bold mb-4">Empresa</h4>
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
            <p className="text-gray-400 text-sm">
              © 2024 UNCLIC. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer">
                Termos de Uso
              </span>
              <span className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer">
                Política de Privacidade
              </span>
              <span className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer">
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
