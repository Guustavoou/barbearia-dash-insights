import React from "react";
import {
  Users,
  Target,
  Award,
  TrendingUp,
  Heart,
  Lightbulb,
  Shield,
  Rocket,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Globe,
  Zap,
  Building,
  Calendar,
  BarChart3,
  Smartphone,
  MessageCircle,
  Sparkles,
  Eye,
  Brain,
  Infinity,
  Code,
  Laptop,
  Crown,
  Gem,
  Trophy,
  Medal,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  expertise: string[];
  gradient: string;
}

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  achievement: string;
}

interface Value {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
}

export const UnclicAbout: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "Carlos Silva",
      role: "CEO & Founder",
      bio: "Visionário com mais de 15 anos no setor de beleza. Transformou sua paixão por tecnologia em soluções que revolucionam negócios.",
      avatar: "CS",
      expertise: ["Estratégia", "Liderança", "Inovação"],
      gradient: "from-blue-500 to-purple-500",
    },
    {
      name: "Ana Rodrigues",
      role: "CTO",
      bio: "Especialista em arquitetura de software e IA. Lidera o desenvolvimento das soluções mais avançadas do mercado de beleza.",
      avatar: "AR",
      expertise: ["Tecnologia", "IA", "Arquitetura"],
      gradient: "from-green-500 to-emerald-500",
    },
    {
      name: "Marco Antonio",
      role: "CPO",
      bio: "Designer de produtos com foco em UX/UI. Responsável por criar experiências que encantam milhares de usuários diariamente.",
      avatar: "MA",
      expertise: ["UX/UI", "Design", "Produto"],
      gradient: "from-orange-500 to-red-500",
    },
    {
      name: "Juliana Santos",
      role: "Head of Success",
      bio: "Especialista em customer success no setor de beleza. Garante que cada cliente alcance o máximo potencial com nossas soluções.",
      avatar: "JS",
      expertise: ["Customer Success", "Consultoria", "Beleza"],
      gradient: "from-pink-500 to-purple-500",
    },
  ];

  const milestones: Milestone[] = [
    {
      year: "2020",
      title: "Fundação da UNCLIC",
      description:
        "Início da jornada com o objetivo de revolucionar a gestão de salões de beleza no Brasil.",
      icon: Rocket,
      achievement: "Primeiros 100 clientes",
    },
    {
      year: "2021",
      title: "Expansão Nacional",
      description:
        "Atingimos todas as regiões do Brasil com nossa plataforma de gestão inteligente.",
      icon: Globe,
      achievement: "5,000+ estabelecimentos",
    },
    {
      year: "2022",
      title: "Inteligência Artificial",
      description:
        "Lançamento de recursos de IA para otimização de agendamentos e predição de demanda.",
      icon: Brain,
      achievement: "IA implementada",
    },
    {
      year: "2023",
      title: "Líder de Mercado",
      description:
        "Reconhecidos como a plataforma #1 para gestão de salões de beleza no Brasil.",
      icon: Trophy,
      achievement: "15,000+ clientes ativos",
    },
    {
      year: "2024",
      title: "Inovação Contínua",
      description:
        "Lançamento de novas funcionalidades baseadas em feedback dos clientes e tendências do mercado.",
      icon: Infinity,
      achievement: "2.5M+ agendamentos processados",
    },
  ];

  const values: Value[] = [
    {
      icon: Heart,
      title: "Paixão pelo Cliente",
      description:
        "Cada decisão que tomamos tem o cliente no centro. Seu sucesso é nossa maior motivação.",
      gradient: "from-red-500 to-pink-500",
    },
    {
      icon: Lightbulb,
      title: "Inovação Constante",
      description:
        "Estamos sempre buscando formas de melhorar e inovar para oferecer as melhores soluções.",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Shield,
      title: "Confiança e Segurança",
      description:
        "Protegemos seus dados com os mais altos padrões de segurança e privacidade.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Target,
      title: "Foco em Resultados",
      description:
        "Medimos nosso sucesso pelo crescimento e prosperidade dos nossos clientes.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Colaboração",
      description:
        "Acreditamos que grandes conquistas nascem do trabalho em equipe e parcerias sólidas.",
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      icon: Zap,
      title: "Agilidade",
      description:
        "Nos adaptamos rapidamente às mudanças do mercado para sempre entregar valor.",
      gradient: "from-indigo-500 to-purple-500",
    },
  ];

  const stats = [
    { number: "15,000+", label: "Estabelecimentos Ativos", icon: Building },
    { number: "2.5M+", label: "Agendamentos Processados", icon: Calendar },
    { number: "98.5%", label: "Satisfação dos Clientes", icon: Heart },
    { number: "40%", label: "Aumento Médio de Faturamento", icon: TrendingUp },
    { number: "85%", label: "Redução de No-Shows", icon: Clock },
    { number: "24/7", label: "Suporte Especializado", icon: MessageCircle },
  ];

  const achievements = [
    {
      title: "Melhor Plataforma de Gestão 2023",
      organization: "Feira Nacional de Beleza",
      icon: Award,
    },
    {
      title: "Startup do Ano - Beauty Tech",
      organization: "Prêmio Innovate Brazil",
      icon: Trophy,
    },
    {
      title: "Certificação ISO 27001",
      organization: "Segurança da Informação",
      icon: Shield,
    },
    {
      title: "Google Partner Premium",
      organization: "Google Cloud Platform",
      icon: Star,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0 px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Nossa História
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Transformando o
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block">
              futuro da beleza
            </span>
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              através da tecnologia
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Desde 2020, nossa missão é{" "}
            <span className="font-semibold text-blue-600">democratizar</span> o
            acesso à tecnologia de ponta para{" "}
            <span className="font-semibold text-purple-600">
              profissionais de beleza
            </span>
            , transformando negócios e criando{" "}
            <span className="font-semibold text-pink-600">
              histórias de sucesso
            </span>{" "}
            em todo o Brasil.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="p-8 text-center border-0 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Visão</h3>
              <p className="text-gray-700 leading-relaxed">
                Ser a plataforma de tecnologia mais confiável e inovadora para o
                setor de beleza, capacitando milhões de profissionais a
                alcançarem seu máximo potencial.
              </p>
            </Card>

            <Card className="p-8 text-center border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-100">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Missão</h3>
              <p className="text-gray-700 leading-relaxed">
                Democratizar o acesso à tecnologia avançada para
                estabelecimentos de beleza, oferecendo soluções que simplificam,
                automatizam e potencializam resultados.
              </p>
            </Card>

            <Card className="p-8 text-center border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-100">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Valores</h3>
              <p className="text-gray-700 leading-relaxed">
                Paixão pelo cliente, inovação constante, confiança,
                transparência e comprometimento com o sucesso de cada parceiro
                que confia em nós.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Números que comprovam
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                nossa excelência
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Cada métrica representa vidas transformadas e negócios que
              alcançaram novos patamares de sucesso
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
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

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-green-50 text-green-600 border-green-200 mb-4">
              <Clock className="w-4 h-4 mr-2" />
              Nossa Jornada
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Uma trajetória de
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {" "}
                conquistas e inovação
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desde nossa fundação, cada ano representa um marco importante em
              nossa missão de transformar o setor de beleza
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 to-purple-500 h-full rounded-full" />

            <div className="space-y-16">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={index}
                    className={cn(
                      "relative flex items-center",
                      isEven ? "justify-start" : "justify-end",
                    )}
                  >
                    {/* Timeline Node */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center z-10 shadow-2xl">
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <div
                      className={cn(
                        "w-5/12",
                        isEven ? "pr-16" : "pl-16 text-right",
                      )}
                    >
                      <Card className="p-6 border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {milestone.year}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-200 bg-green-50"
                          >
                            {milestone.achievement}
                          </Badge>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {milestone.description}
                        </p>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-purple-50 text-purple-600 border-purple-200 mb-4">
              <Crown className="w-4 h-4 mr-2" />
              Nossos Valores
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Os princípios que
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}
                nos guiam
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cada decisão, cada produto e cada interação é fundamentada em
              valores sólidos que nos conectam com nosso propósito
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
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
                        value.gradient,
                      )}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 rounded-full blur-2xl transform translate-x-16 -translate-y-16",
                      value.gradient,
                    )}
                  />
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-blue-50 text-blue-600 border-blue-200 mb-4">
              <Users className="w-4 h-4 mr-2" />
              Nossa Equipe
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Mentes brilhantes que
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                fazem a diferença
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Um time apaixonado por tecnologia e especialistas no setor de
              beleza, unidos pela missão de transformar negócios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="p-6 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white"
              >
                <div className="text-center mb-6">
                  <div
                    className={cn(
                      "w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 bg-gradient-to-r",
                      member.gradient,
                    )}
                  >
                    {member.avatar}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium">{member.role}</p>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {member.bio}
                </p>

                <div className="flex flex-wrap gap-2">
                  {member.expertise.map((skill, skillIndex) => (
                    <Badge
                      key={skillIndex}
                      variant="outline"
                      className="text-xs text-gray-600 border-gray-300"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-yellow-50 text-yellow-600 border-yellow-200 mb-4">
              <Medal className="w-4 h-4 mr-2" />
              Reconhecimento
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Prêmios e
              <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                {" "}
                certificações
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nosso compromisso com a excelência é reconhecido por organizações
              renomadas e pelos próprios clientes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <Card
                  key={index}
                  className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {achievement.organization}
                  </p>
                </Card>
              );
            })}
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
            Faça parte da
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {" "}
              nossa história
            </span>
          </h2>

          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Junte-se aos milhares de empreendedores que já escolheram a UNCLIC
            para transformar seus negócios de beleza
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-200 shadow-2xl"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Começar Minha Jornada
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-900 px-8 py-4 text-lg rounded-xl"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
