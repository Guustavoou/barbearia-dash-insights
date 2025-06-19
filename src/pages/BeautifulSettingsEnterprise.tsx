import React, { useState, useEffect, useCallback } from "react";
import {
  Settings,
  User,
  Shield,
  Bell,
  Calendar,
  Clock,
  Database,
  Monitor,
  Palette,
  Globe,
  Key,
  Lock,
  Save,
  RefreshCw,
  Upload,
  Download,
  Eye,
  EyeOff,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Building,
  Camera,
  Zap,
  Activity,
  FileText,
  CreditCard,
  Smartphone,
  Wifi,
  HardDrive,
  Server,
  UserCheck,
  ShieldCheck,
  Timer,
  Star,
  Heart,
  Briefcase,
  Home,
  Image,
  Video,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Sparkles,
  Target,
  TrendingUp,
  BarChart3,
  PieChart,
  MessageSquare,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Search,
  Filter,
  SortAsc,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CloudUpload,
  FileJson,
  Archive,
  CloudDownload,
  CircleCheck,
  CircleX,
  Info,
  Lightbulb,
  HelpCircle,
  Bookmark,
  Flag,
  Tag,
  Layers,
  Grid,
  List,
  MoreVertical,
  MoreHorizontal,
  Hash,
  AlignLeft,
  Scissors,
  Users,
  DollarSign,
  Link,
  Package,
  Percent,
  Calendar as CalendarIcon,
  MapPin as LocationIcon,
  Clock as TimeIcon,
  AlertCircle,
  Brain,
  Cpu,
  FileX,
  FolderOpen,
  Gift,
  Headphones,
  Megaphone,
  MousePointer,
  Paintbrush,
  PenTool,
  Repeat,
  Sliders,
  Volume2,
  Webhook,
  Zap as AutomationIcon,
  Share2,
  Clipboard,
  History,
  BarChart,
  LineChart,
  Gauge,
  Shield as SecurityIcon,
  Award,
  Badge as BadgeIcon,
  Beaker,
  Box,
  Briefcase as BusinessIcon,
  Calculator,
  Calendar3,
  ChartLine,
  CheckSquare,
  Chrome,
  Cog,
  Columns,
  Command,
  Compass,
  Crown,
  Crosshair,
  Database as DataIcon,
  Fingerprint,
  Flame,
  Focus,
  Gamepad2,
  GitBranch,
  Handshake,
  HardHat,
  Import,
  Inbox,
  Joystick,
  Kanban,
  KeyRound,
  LifeBuoy,
  Lightbulb as IdeaIcon,
  Link2,
  Loader,
  Map,
  Medal,
  Mic,
  Network,
  Newspaper,
  Orbit,
  PaintBucket,
  Paperclip,
  Phone as PhoneIcon,
  Pin,
  Puzzle,
  QrCode,
  RadioReceiver,
  Rocket,
  Ruler,
  Satellite,
  Scale,
  ScanLine,
  ScrollText,
  Send,
  Share,
  ShoppingBag,
  Shuffle,
  Sidebar,
  Siren,
  Smartphone as MobileIcon,
  Snowflake,
  Soundwave,
  Speech,
  Stopwatch,
  Sunrise,
  Sunset,
  Swords,
  Tablet,
  TestTube,
  Thermometer,
  ThumbsUp,
  Ticket,
  Timer as TimerIcon,
  ToggleLeft,
  ToggleRight,
  Tornado,
  Truck,
  Umbrella,
  Unlink,
  UserPlus,
  Wallet,
  Wind,
  Wrench,
  X,
  Zoom,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { PageType } from "@/lib/types";

interface BeautifulSettingsEnterpriseProps {
  darkMode: boolean;
  onPageChange?: (page: PageType) => void;
}

// Interfaces completas para cada seção
interface BusinessProfile {
  name: string;
  legalName: string;
  cnpj: string;
  stateRegistration: string;
  municipalRegistration: string;
  email: string;
  phone: string;
  whatsapp: string;
  website: string;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  description: string;
  category: string;
  foundation: string;
  logo: string;
  banner: string;
  socialMedia: {
    instagram: string;
    facebook: string;
    twitter: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
  };
  businessHours: string;
  capacity: number;
  parking: boolean;
  accessibility: boolean;
  certifications: string[];
}

interface AppointmentSettings {
  bookingPolicy: {
    minAdvanceTime: number;
    maxAdvanceTime: number;
    allowSameDayBooking: boolean;
    requireDeposit: boolean;
    depositPercentage: number;
    allowWaitingList: boolean;
    maxWaitingList: number;
    overbookingEnabled: boolean;
    overbookingPercentage: number;
  };
  cancellationPolicy: {
    allowCancellation: boolean;
    minimumNotice: number;
    refundPolicy: string;
    penaltyPercentage: number;
    rescheduleAllowed: boolean;
    rescheduleNotice: number;
  };
  confirmationSettings: {
    autoConfirm: boolean;
    confirmationTimeout: number;
    reminderTimes: number[];
    confirmationMethod: string[];
  };
  customFields: Array<{
    id: string;
    name: string;
    type: string;
    required: boolean;
    options?: string[];
  }>;
  paymentMethods: string[];
  discountCodes: boolean;
  loyaltyProgram: boolean;
}

interface WorkingHours {
  [key: string]: {
    enabled: boolean;
    start: string;
    end: string;
    breaks: Array<{
      id: string;
      name: string;
      start: string;
      end: string;
      type: string;
    }>;
    specialRates: boolean;
    rateMultiplier: number;
  };
}

interface HolidaySettings {
  nationalHolidays: boolean;
  customHolidays: Array<{
    id: string;
    name: string;
    date: string;
    recurring: boolean;
    closed: boolean;
    specialHours?: { start: string; end: string };
  }>;
  seasonalAdjustments: Array<{
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    adjustment: string;
  }>;
}

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  active: boolean;
  order: number;
}

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number;
  price: number;
  priceType: string;
  commission: number;
  active: boolean;
  online: boolean;
  requiresApproval: boolean;
  maxConcurrent: number;
  preparations: string[];
  aftercare: string[];
  contraindications: string[];
  images: string[];
  tags: string[];
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  permissions: string[];
  services: string[];
  schedule: WorkingHours;
  commission: {
    type: string;
    rate: number;
    services: Record<string, number>;
  };
  avatar: string;
  bio: string;
  certifications: string[];
  languages: string[];
  active: boolean;
  hireDate: string;
}

interface FinancialSettings {
  currency: string;
  taxSettings: {
    defaultTaxRate: number;
    taxIncluded: boolean;
    taxNumber: string;
    taxRegime: string;
  };
  paymentMethods: Array<{
    id: string;
    name: string;
    type: string;
    enabled: boolean;
    feePercentage: number;
    feeFixed: number;
    processingTime: string;
    config: Record<string, any>;
  }>;
  invoiceSettings: {
    autoGenerate: boolean;
    template: string;
    numberingScheme: string;
    dueDate: number;
    late_fee: number;
    reminderDays: number[];
  };
  expenseCategories: Array<{
    id: string;
    name: string;
    color: string;
    budget: number;
    alerts: boolean;
  }>;
  reportingSchedule: {
    daily: boolean;
    weekly: boolean;
    monthly: boolean;
    quarterly: boolean;
    recipients: string[];
  };
}

interface NotificationChannels {
  email: {
    enabled: boolean;
    provider: string;
    templates: Record<string, any>;
    scheduleOptimization: boolean;
    deliveryTracking: boolean;
    categories: {
      appointments: boolean;
      payments: boolean;
      marketing: boolean;
      system: boolean;
      emergency: boolean;
    };
  };
  sms: {
    enabled: boolean;
    provider: string;
    shortCodes: boolean;
    internationalEnabled: boolean;
    categories: {
      reminders: boolean;
      confirmations: boolean;
      updates: boolean;
      emergency: boolean;
    };
  };
  whatsapp: {
    enabled: boolean;
    businessAccount: boolean;
    templates: Record<string, any>;
    chatbot: boolean;
    categories: {
      reminders: boolean;
      confirmations: boolean;
      marketing: boolean;
      support: boolean;
    };
  };
  push: {
    enabled: boolean;
    webPush: boolean;
    mobilePush: boolean;
    categories: {
      appointments: boolean;
      payments: boolean;
      updates: boolean;
      promotions: boolean;
    };
  };
  inApp: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
    categories: {
      real_time: boolean;
      alerts: boolean;
      updates: boolean;
    };
  };
}

interface IntegrationSettings {
  calendar: {
    google: { enabled: boolean; account: string; calendarId: string };
    outlook: { enabled: boolean; account: string };
    apple: { enabled: boolean; account: string };
    twoWaySync: boolean;
    conflictResolution: string;
  };
  payments: {
    stripe: { enabled: boolean; publicKey: string; secretKey: string };
    paypal: { enabled: boolean; clientId: string; clientSecret: string };
    mercadoPago: { enabled: boolean; accessToken: string };
    square: { enabled: boolean; applicationId: string; accessToken: string };
  };
  marketing: {
    mailchimp: { enabled: boolean; apiKey: string; listId: string };
    facebook: { enabled: boolean; pixelId: string; accessToken: string };
    google: { enabled: boolean; trackingId: string; adsAccount: string };
    instagram: { enabled: boolean; businessAccount: string };
  };
  communications: {
    twilio: { enabled: boolean; accountSid: string; authToken: string };
    sendgrid: { enabled: boolean; apiKey: string; fromEmail: string };
    whatsapp: { enabled: boolean; businessId: string; accessToken: string };
  };
  analytics: {
    googleAnalytics: {
      enabled: boolean;
      trackingId: string;
      ecommerce: boolean;
    };
    mixpanel: { enabled: boolean; projectToken: string };
    hotjar: { enabled: boolean; siteId: string };
    customTracking: { enabled: boolean; endpoints: string[] };
  };
  automation: {
    zapier: { enabled: boolean; webhooks: string[] };
    make: { enabled: boolean; scenarios: string[] };
    customWebhooks: Array<{ name: string; url: string; events: string[] }>;
  };
}

interface SecuritySettings {
  authentication: {
    twoFactor: boolean;
    smsBackup: boolean;
    authenticatorApp: boolean;
    biometric: boolean;
    ssoEnabled: boolean;
    ssoProvider: string;
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    passwordless: boolean;
  };
  passwordPolicy: {
    minLength: number;
    requireNumbers: boolean;
    requireSymbols: boolean;
    requireUppercase: boolean;
    requireLowercase: boolean;
    preventReuse: number;
    expirationDays: number;
    complexityScore: number;
  };
  accessControl: {
    ipWhitelist: string[];
    geoRestrictions: boolean;
    allowedCountries: string[];
    deviceTracking: boolean;
    sessionLimits: number;
    apiRateLimiting: boolean;
  };
  dataProtection: {
    encryption: boolean;
    backupEncryption: boolean;
    dataRetention: number;
    anonymization: boolean;
    dataExport: boolean;
    rightToDelete: boolean;
    gdprCompliance: boolean;
    lgpdCompliance: boolean;
  };
  monitoring: {
    loginAttempts: boolean;
    dataAccess: boolean;
    configChanges: boolean;
    apiUsage: boolean;
    securityAlerts: boolean;
    anomalyDetection: boolean;
  };
  auditLogs: {
    enabled: boolean;
    retention: number;
    detailLevel: string;
    realTimeAlerts: boolean;
    exportFormat: string;
  };
}

interface AppearanceSettings {
  theme: {
    mode: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    customCss: string;
    brandingColors: Record<string, string>;
  };
  layout: {
    sidebarPosition: string;
    compactMode: boolean;
    showBreadcrumbs: boolean;
    showTooltips: boolean;
    animation: boolean;
    density: string;
  };
  branding: {
    logo: string;
    favicon: string;
    loginBackground: string;
    brandName: string;
    brandSlogan: string;
    customFonts: string[];
  };
  localization: {
    language: string;
    region: string;
    timezone: string;
    dateFormat: string;
    timeFormat: string;
    numberFormat: string;
    currency: string;
    firstDayOfWeek: number;
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
    keyboardNavigation: boolean;
    colorBlindSupport: boolean;
    animationReduction: boolean;
  };
}

interface SystemSettings {
  performance: {
    caching: boolean;
    compressionEnabled: boolean;
    imageOptimization: boolean;
    lazyLoading: boolean;
    cdnEnabled: boolean;
    preloadCritical: boolean;
  };
  maintenance: {
    scheduledMaintenance: boolean;
    maintenanceWindow: { start: string; end: string; timezone: string };
    automaticUpdates: boolean;
    backupBeforeUpdate: boolean;
    rollbackEnabled: boolean;
  };
  monitoring: {
    uptime: boolean;
    performance: boolean;
    errors: boolean;
    usage: boolean;
    securityEvents: boolean;
    customMetrics: boolean;
  };
  logging: {
    level: string;
    retention: number;
    format: string;
    destinations: string[];
    realTimeAlerts: boolean;
    errorTracking: boolean;
  };
  development: {
    debugMode: boolean;
    apiLogging: boolean;
    performanceProfiler: boolean;
    featureFlags: Record<string, boolean>;
    testMode: boolean;
  };
}

export const BeautifulSettingsEnterprise: React.FC<
  BeautifulSettingsEnterpriseProps
> = ({ darkMode, onPageChange }) => {
  const { toast } = useToast();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [configVersion, setConfigVersion] = useState("1.0.0");

  // Estados complexos para cada seção
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    name: "Salão Premium Beauty & Wellness",
    legalName: "Beauty Premium Ltda",
    cnpj: "12.345.678/0001-90",
    stateRegistration: "123456789",
    municipalRegistration: "987654321",
    email: "contato@salaopremium.com",
    phone: "(11) 99999-9999",
    whatsapp: "(11) 99999-8888",
    website: "https://salaopremium.com",
    address: {
      street: "Rua das Flores",
      number: "123",
      complement: "Sala 01",
      neighborhood: "Jardim Paulista",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      country: "Brasil",
    },
    description:
      "Salão de beleza premium especializado em cortes modernos, tratamentos capilares, estética facial e corporal. Oferecemos experiências únicas com produtos de alta qualidade e profissionais especializados.",
    category: "Beleza e Estética",
    foundation: "2020-01-15",
    logo: "",
    banner: "",
    socialMedia: {
      instagram: "@salaopremium",
      facebook: "salaopremium",
      twitter: "salaopremium",
      linkedin: "salao-premium",
      youtube: "salaopremium",
      tiktok: "@salaopremium",
    },
    businessHours: "Seg-Sex: 9h-18h, Sáb: 9h-17h",
    capacity: 50,
    parking: true,
    accessibility: true,
    certifications: ["ISO 9001", "Anvisa", "Vigilância Sanitária"],
  });

  const [appointmentSettings, setAppointmentSettings] =
    useState<AppointmentSettings>({
      bookingPolicy: {
        minAdvanceTime: 60,
        maxAdvanceTime: 8760,
        allowSameDayBooking: true,
        requireDeposit: false,
        depositPercentage: 20,
        allowWaitingList: true,
        maxWaitingList: 10,
        overbookingEnabled: false,
        overbookingPercentage: 10,
      },
      cancellationPolicy: {
        allowCancellation: true,
        minimumNotice: 120,
        refundPolicy: "full",
        penaltyPercentage: 0,
        rescheduleAllowed: true,
        rescheduleNotice: 60,
      },
      confirmationSettings: {
        autoConfirm: false,
        confirmationTimeout: 24,
        reminderTimes: [24, 2],
        confirmationMethod: ["email", "whatsapp"],
      },
      customFields: [
        {
          id: "1",
          name: "Observações Especiais",
          type: "textarea",
          required: false,
        },
        {
          id: "2",
          name: "Primeira Visita",
          type: "boolean",
          required: true,
        },
        {
          id: "3",
          name: "Como nos conheceu",
          type: "select",
          required: false,
          options: ["Instagram", "Facebook", "Google", "Indicação", "Outros"],
        },
      ],
      paymentMethods: ["dinheiro", "cartao", "pix", "transferencia"],
      discountCodes: true,
      loyaltyProgram: true,
    });

  const [workingHours, setWorkingHours] = useState<WorkingHours>({
    monday: {
      enabled: true,
      start: "09:00",
      end: "18:00",
      breaks: [
        {
          id: "1",
          name: "Almoço",
          start: "12:00",
          end: "13:00",
          type: "meal",
        },
      ],
      specialRates: false,
      rateMultiplier: 1.0,
    },
    tuesday: {
      enabled: true,
      start: "09:00",
      end: "18:00",
      breaks: [
        {
          id: "1",
          name: "Almoço",
          start: "12:00",
          end: "13:00",
          type: "meal",
        },
      ],
      specialRates: false,
      rateMultiplier: 1.0,
    },
    wednesday: {
      enabled: true,
      start: "09:00",
      end: "18:00",
      breaks: [
        {
          id: "1",
          name: "Almoço",
          start: "12:00",
          end: "13:00",
          type: "meal",
        },
      ],
      specialRates: false,
      rateMultiplier: 1.0,
    },
    thursday: {
      enabled: true,
      start: "09:00",
      end: "18:00",
      breaks: [
        {
          id: "1",
          name: "Almoço",
          start: "12:00",
          end: "13:00",
          type: "meal",
        },
      ],
      specialRates: false,
      rateMultiplier: 1.0,
    },
    friday: {
      enabled: true,
      start: "09:00",
      end: "18:00",
      breaks: [
        {
          id: "1",
          name: "Almoço",
          start: "12:00",
          end: "13:00",
          type: "meal",
        },
      ],
      specialRates: false,
      rateMultiplier: 1.0,
    },
    saturday: {
      enabled: true,
      start: "09:00",
      end: "17:00",
      breaks: [],
      specialRates: true,
      rateMultiplier: 1.2,
    },
    sunday: {
      enabled: false,
      start: "09:00",
      end: "17:00",
      breaks: [],
      specialRates: true,
      rateMultiplier: 1.5,
    },
  });

  const [holidaySettings, setHolidaySettings] = useState<HolidaySettings>({
    nationalHolidays: true,
    customHolidays: [
      {
        id: "1",
        name: "Aniversário do Salão",
        date: "2024-01-15",
        recurring: true,
        closed: false,
        specialHours: { start: "10:00", end: "16:00" },
      },
    ],
    seasonalAdjustments: [
      {
        id: "1",
        name: "Horário de Verão",
        startDate: "2024-12-01",
        endDate: "2024-02-28",
        adjustment: "extended",
      },
    ],
  });

  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(
    [
      {
        id: "1",
        name: "Cabelo",
        description: "Cortes, coloração e tratamentos capilares",
        color: "#8B5CF6",
        icon: "scissors",
        active: true,
        order: 1,
      },
      {
        id: "2",
        name: "Estética Facial",
        description: "Limpeza, hidratação e tratamentos faciais",
        color: "#10B981",
        icon: "sparkles",
        active: true,
        order: 2,
      },
      {
        id: "3",
        name: "Unhas",
        description: "Manicure, pedicure e nail art",
        color: "#F59E0B",
        icon: "paintbrush",
        active: true,
        order: 3,
      },
    ],
  );

  const [notificationChannels, setNotificationChannels] =
    useState<NotificationChannels>({
      email: {
        enabled: true,
        provider: "sendgrid",
        templates: {},
        scheduleOptimization: true,
        deliveryTracking: true,
        categories: {
          appointments: true,
          payments: true,
          marketing: false,
          system: true,
          emergency: true,
        },
      },
      sms: {
        enabled: false,
        provider: "twilio",
        shortCodes: false,
        internationalEnabled: false,
        categories: {
          reminders: true,
          confirmations: true,
          updates: false,
          emergency: true,
        },
      },
      whatsapp: {
        enabled: true,
        businessAccount: true,
        templates: {},
        chatbot: false,
        categories: {
          reminders: true,
          confirmations: true,
          marketing: false,
          support: true,
        },
      },
      push: {
        enabled: true,
        webPush: true,
        mobilePush: false,
        categories: {
          appointments: true,
          payments: true,
          updates: false,
          promotions: false,
        },
      },
      inApp: {
        enabled: true,
        sound: true,
        desktop: true,
        categories: {
          real_time: true,
          alerts: true,
          updates: true,
        },
      },
    });

  const [integrationSettings, setIntegrationSettings] =
    useState<IntegrationSettings>({
      calendar: {
        google: { enabled: false, account: "", calendarId: "" },
        outlook: { enabled: false, account: "" },
        apple: { enabled: false, account: "" },
        twoWaySync: true,
        conflictResolution: "manual",
      },
      payments: {
        stripe: { enabled: false, publicKey: "", secretKey: "" },
        paypal: { enabled: false, clientId: "", clientSecret: "" },
        mercadoPago: { enabled: true, accessToken: "" },
        square: { enabled: false, applicationId: "", accessToken: "" },
      },
      marketing: {
        mailchimp: { enabled: false, apiKey: "", listId: "" },
        facebook: { enabled: false, pixelId: "", accessToken: "" },
        google: { enabled: false, trackingId: "", adsAccount: "" },
        instagram: { enabled: false, businessAccount: "" },
      },
      communications: {
        twilio: { enabled: false, accountSid: "", authToken: "" },
        sendgrid: { enabled: true, apiKey: "", fromEmail: "" },
        whatsapp: { enabled: false, businessId: "", accessToken: "" },
      },
      analytics: {
        googleAnalytics: { enabled: false, trackingId: "", ecommerce: false },
        mixpanel: { enabled: false, projectToken: "" },
        hotjar: { enabled: false, siteId: "" },
        customTracking: { enabled: false, endpoints: [] },
      },
      automation: {
        zapier: { enabled: false, webhooks: [] },
        make: { enabled: false, scenarios: [] },
        customWebhooks: [],
      },
    });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    authentication: {
      twoFactor: false,
      smsBackup: false,
      authenticatorApp: false,
      biometric: false,
      ssoEnabled: false,
      ssoProvider: "",
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      passwordless: false,
    },
    passwordPolicy: {
      minLength: 8,
      requireNumbers: true,
      requireSymbols: false,
      requireUppercase: true,
      requireLowercase: true,
      preventReuse: 5,
      expirationDays: 90,
      complexityScore: 3,
    },
    accessControl: {
      ipWhitelist: [],
      geoRestrictions: false,
      allowedCountries: ["BR"],
      deviceTracking: true,
      sessionLimits: 3,
      apiRateLimiting: true,
    },
    dataProtection: {
      encryption: true,
      backupEncryption: true,
      dataRetention: 365,
      anonymization: true,
      dataExport: true,
      rightToDelete: true,
      gdprCompliance: true,
      lgpdCompliance: true,
    },
    monitoring: {
      loginAttempts: true,
      dataAccess: true,
      configChanges: true,
      apiUsage: true,
      securityAlerts: true,
      anomalyDetection: false,
    },
    auditLogs: {
      enabled: true,
      retention: 365,
      detailLevel: "medium",
      realTimeAlerts: true,
      exportFormat: "json",
    },
  });

  const [appearanceSettings, setAppearanceSettings] =
    useState<AppearanceSettings>({
      theme: {
        mode: darkMode ? "dark" : "light",
        primaryColor: "#00112F",
        secondaryColor: "#2563EB",
        accentColor: "#10B981",
        customCss: "",
        brandingColors: {
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
          info: "#3B82F6",
        },
      },
      layout: {
        sidebarPosition: "left",
        compactMode: false,
        showBreadcrumbs: true,
        showTooltips: true,
        animation: true,
        density: "comfortable",
      },
      branding: {
        logo: "",
        favicon: "",
        loginBackground: "",
        brandName: "Salão Premium",
        brandSlogan: "Sua beleza é nossa paixão",
        customFonts: ["Inter", "Poppins", "Roboto"],
      },
      localization: {
        language: "pt-BR",
        region: "BR",
        timezone: "America/Sao_Paulo",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "24h",
        numberFormat: "1.234,56",
        currency: "BRL",
        firstDayOfWeek: 1,
      },
      accessibility: {
        highContrast: false,
        largeText: false,
        screenReader: false,
        keyboardNavigation: true,
        colorBlindSupport: false,
        animationReduction: false,
      },
    });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    performance: {
      caching: true,
      compressionEnabled: true,
      imageOptimization: true,
      lazyLoading: true,
      cdnEnabled: false,
      preloadCritical: true,
    },
    maintenance: {
      scheduledMaintenance: false,
      maintenanceWindow: {
        start: "02:00",
        end: "04:00",
        timezone: "America/Sao_Paulo",
      },
      automaticUpdates: false,
      backupBeforeUpdate: true,
      rollbackEnabled: true,
    },
    monitoring: {
      uptime: true,
      performance: true,
      errors: true,
      usage: true,
      securityEvents: true,
      customMetrics: false,
    },
    logging: {
      level: "info",
      retention: 30,
      format: "json",
      destinations: ["file", "console"],
      realTimeAlerts: true,
      errorTracking: true,
    },
    development: {
      debugMode: false,
      apiLogging: false,
      performanceProfiler: false,
      featureFlags: {
        newDashboard: false,
        advancedReports: true,
        betaFeatures: false,
      },
      testMode: false,
    },
  });

  // Backup state
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    frequency: "daily",
    retentionDays: 30,
    encryption: true,
    cloudStorage: true,
    localBackup: true,
    incrementalBackup: true,
    compressionEnabled: true,
    backupVerification: true,
    lastBackup: new Date(Date.now() - 86400000),
    backupSize: "2.5 MB",
    nextBackup: new Date(Date.now() + 86400000),
    backupHistory: [
      {
        id: "1",
        date: new Date(Date.now() - 86400000),
        size: "2.5 MB",
        status: "success",
        type: "automated",
        duration: "45s",
      },
      {
        id: "2",
        date: new Date(Date.now() - 172800000),
        size: "2.3 MB",
        status: "success",
        type: "automated",
        duration: "42s",
      },
      {
        id: "3",
        date: new Date(Date.now() - 259200000),
        size: "2.4 MB",
        status: "success",
        type: "manual",
        duration: "38s",
      },
    ],
    storageLocations: [
      { name: "Google Drive", enabled: true, quota: "15 GB", used: "2.5 GB" },
      { name: "Dropbox", enabled: false, quota: "2 GB", used: "0 GB" },
      { name: "AWS S3", enabled: false, quota: "5 GB", used: "0 GB" },
    ],
  });

  // Permissions state
  const [permissionSettings, setPermissionSettings] = useState({
    roles: [
      {
        id: "admin",
        name: "Administrador",
        description: "Acesso total ao sistema",
        permissions: ["*"],
        userCount: 1,
        color: "#EF4444",
      },
      {
        id: "manager",
        name: "Gerente",
        description: "Gestão de funcionários e agendamentos",
        permissions: [
          "appointments.read",
          "appointments.write",
          "staff.read",
          "reports.read",
        ],
        userCount: 2,
        color: "#F59E0B",
      },
      {
        id: "staff",
        name: "Funcionário",
        description: "Acesso aos próprios agendamentos",
        permissions: ["appointments.read", "appointments.write.own"],
        userCount: 5,
        color: "#10B981",
      },
      {
        id: "receptionist",
        name: "Recepcionista",
        description: "Gestão de agendamentos e clientes",
        permissions: [
          "appointments.read",
          "appointments.write",
          "clients.read",
        ],
        userCount: 2,
        color: "#3B82F6",
      },
    ],
    permissions: [
      {
        id: "appointments.read",
        name: "Visualizar Agendamentos",
        category: "Agendamentos",
        description: "Pode visualizar todos os agendamentos",
      },
      {
        id: "appointments.write",
        name: "Gerenciar Agendamentos",
        category: "Agendamentos",
        description: "Pode criar, editar e cancelar agendamentos",
      },
      {
        id: "clients.read",
        name: "Visualizar Clientes",
        category: "Clientes",
        description: "Pode visualizar dados dos clientes",
      },
      {
        id: "clients.write",
        name: "Gerenciar Clientes",
        category: "Clientes",
        description: "Pode criar e editar clientes",
      },
      {
        id: "reports.read",
        name: "Visualizar Relatórios",
        category: "Relatórios",
        description: "Pode acessar relatórios e estatísticas",
      },
      {
        id: "settings.write",
        name: "Configurações",
        category: "Sistema",
        description: "Pode alterar configurações do sistema",
      },
    ],
    accessLogs: [
      {
        id: "1",
        user: "admin@salon.com",
        action: "login",
        resource: "system",
        timestamp: new Date(),
        ip: "192.168.1.100",
        success: true,
      },
      {
        id: "2",
        user: "manager@salon.com",
        action: "view",
        resource: "appointments",
        timestamp: new Date(Date.now() - 3600000),
        ip: "192.168.1.101",
        success: true,
      },
    ],
  });

  // Detectar mudanças
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [
    businessProfile,
    appointmentSettings,
    workingHours,
    holidaySettings,
    notificationChannels,
    integrationSettings,
    securitySettings,
    appearanceSettings,
    systemSettings,
    backupSettings,
    permissionSettings,
  ]);

  // Funções de manipulação
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const configData = {
        version: configVersion,
        timestamp: new Date().toISOString(),
        businessProfile,
        appointmentSettings,
        workingHours,
        holidaySettings,
        notificationChannels,
        integrationSettings,
        securitySettings,
        appearanceSettings,
        systemSettings,
        backupSettings,
        permissionSettings,
      };

      localStorage.setItem(
        "enterpriseSettingsData",
        JSON.stringify(configData),
      );
      setHasUnsavedChanges(false);
      setLastUpdate(new Date());
      setConfigVersion(
        `${parseInt(configVersion.split(".")[0])}.${parseInt(configVersion.split(".")[1])}.${parseInt(configVersion.split(".")[2]) + 1}`,
      );

      toast({
        title: "✅ Configurações Salvas",
        description: "Todas as alterações foram salvas com sucesso",
      });
    } catch (error) {
      toast({
        title: "❌ Erro ao Salvar",
        description: "Ocorreu um erro ao salvar as configurações",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setHasUnsavedChanges(false);
    toast({
      title: "Alterações Descartadas",
      description: "As alterações não salvas foram descartadas",
    });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsLoading(false);
      toast({
        title: "✨ Atualizado",
        description: "Configurações atualizadas com sucesso",
      });
    }, 1000);
  };

  const handleExportSettings = () => {
    const exportData = {
      version: configVersion,
      exportDate: new Date().toISOString(),
      businessProfile,
      appointmentSettings,
      workingHours,
      holidaySettings,
      notificationChannels,
      integrationSettings: {
        ...integrationSettings,
        // Mascarar dados sensíveis
        payments: Object.entries(integrationSettings.payments).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: { ...value, secretKey: "***", accessToken: "***" },
          }),
          {},
        ),
      },
      securitySettings: {
        ...securitySettings,
        accessControl: {
          ...securitySettings.accessControl,
          ipWhitelist: securitySettings.accessControl.ipWhitelist.map(
            () => "***",
          ),
        },
      },
      appearanceSettings,
      systemSettings,
      backupSettings,
      permissionSettings,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enterprise-config-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "📁 Configurações Exportadas",
      description: "Arquivo de configuração empresarial baixado com sucesso",
    });
  };

  const handleBackupNow = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const newBackup = {
        id: Date.now().toString(),
        date: new Date(),
        size: `${(Math.random() * 3 + 2).toFixed(1)} MB`,
        status: "success" as const,
        type: "manual" as const,
        duration: `${Math.floor(Math.random() * 30 + 30)}s`,
      };

      setBackupSettings((prev) => ({
        ...prev,
        lastBackup: new Date(),
        backupHistory: [newBackup, ...prev.backupHistory.slice(0, 9)],
      }));

      toast({
        title: "💾 Backup Concluído",
        description: "Backup manual criado com sucesso",
      });
    } catch (error) {
      toast({
        title: "❌ Erro no Backup",
        description: "Falha ao criar backup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateConfiguration = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const validationResults = {
        businessProfile: { valid: true, issues: [] },
        integrations: { valid: false, issues: ["API keys missing"] },
        security: { valid: true, issues: [] },
        notifications: { valid: true, issues: [] },
      };

      toast({
        title: "🔍 Validação Concluída",
        description: "Configuração validada com 1 aviso",
      });
    } catch (error) {
      toast({
        title: "❌ Erro na Validação",
        description: "Falha ao validar configuração",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Configuração das abas
  const tabsConfig = [
    {
      id: "profile",
      label: "Perfil",
      icon: Building,
      color: "from-blue-600 to-blue-700",
      description: "Informações do negócio",
      badge: businessProfile.name ? "OK" : "Incompleto",
      badgeColor: businessProfile.name ? "green" : "orange",
    },
    {
      id: "appointments",
      label: "Agendamentos",
      icon: Calendar,
      color: "from-green-600 to-green-700",
      description: "Políticas de booking",
      badge: `${appointmentSettings.customFields.length} campos`,
      badgeColor: "blue",
    },
    {
      id: "schedule",
      label: "Horários",
      icon: Clock,
      color: "from-purple-600 to-purple-700",
      description: "Funcionamento",
      badge:
        Object.values(workingHours).filter((h) => h.enabled).length + " dias",
      badgeColor: "purple",
    },
    {
      id: "services",
      label: "Serviços",
      icon: Scissors,
      color: "from-orange-600 to-orange-700",
      description: "Gestão de serviços",
      badge: `${serviceCategories.length} categorias`,
      badgeColor: "orange",
    },
    {
      id: "staff",
      label: "Equipe",
      icon: Users,
      color: "from-teal-600 to-teal-700",
      description: "Funcionários",
      badge: "Premium",
      badgeColor: "teal",
    },
    {
      id: "financial",
      label: "Financeiro",
      icon: DollarSign,
      color: "from-emerald-600 to-emerald-700",
      description: "Pagamentos e impostos",
      badge: "Configurado",
      badgeColor: "emerald",
    },
    {
      id: "notifications",
      label: "Notificações",
      icon: Bell,
      color: "from-yellow-600 to-yellow-700",
      description: "Comunicações",
      badge:
        Object.values(notificationChannels).filter((c) => c.enabled).length +
        " canais",
      badgeColor: "yellow",
    },
    {
      id: "integrations",
      label: "Integrações",
      icon: Globe,
      color: "from-indigo-600 to-indigo-700",
      description: "APIs e conectores",
      badge: "Parcial",
      badgeColor: "indigo",
    },
    {
      id: "permissions",
      label: "Permissões",
      icon: UserCheck,
      color: "from-pink-600 to-pink-700",
      description: "Controle de acesso",
      badge: `${permissionSettings.roles.length} perfis`,
      badgeColor: "pink",
    },
    {
      id: "security",
      label: "Segurança",
      icon: Shield,
      color: "from-red-600 to-red-700",
      description: "Proteção e compliance",
      badge: securitySettings.authentication.twoFactor ? "Seguro" : "Básico",
      badgeColor: securitySettings.authentication.twoFactor
        ? "green"
        : "orange",
    },
    {
      id: "backup",
      label: "Backup",
      icon: Database,
      color: "from-cyan-600 to-cyan-700",
      description: "Proteção de dados",
      badge: backupSettings.autoBackup ? "Automático" : "Manual",
      badgeColor: backupSettings.autoBackup ? "green" : "gray",
    },
    {
      id: "system",
      label: "Sistema",
      icon: Monitor,
      color: "from-gray-600 to-gray-700",
      description: "Performance e logs",
      badge: "Online",
      badgeColor: "green",
    },
    {
      id: "appearance",
      label: "Aparência",
      icon: Palette,
      color: "from-violet-600 to-violet-700",
      description: "Visual e tema",
      badge: appearanceSettings.theme.mode,
      badgeColor: "violet",
    },
  ];

  const filteredTabs = tabsConfig.filter(
    (tab) =>
      tab.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tab.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-blue-50/30 dark:from-[#0D1117] dark:via-[#0D1117] dark:to-blue-950/20">
      {/* Fixed Action Bar */}
      {hasUnsavedChanges && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
              <div>
                <span className="font-semibold">
                  Alterações não salvas detectadas
                </span>
                <p className="text-xs text-orange-100">
                  {
                    Object.keys({
                      businessProfile,
                      appointmentSettings,
                      workingHours,
                    }).length
                  }{" "}
                  seções modificadas
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDiscard}
                className="text-white hover:bg-white/20 border border-white/20"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Descartar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="bg-white text-orange-600 hover:bg-orange-50 shadow-lg"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Agora
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className={cn("space-y-6 p-6", hasUnsavedChanges && "pt-20")}>
        {/* Enterprise Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00112F] via-blue-900 to-blue-800 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_70%)]" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-600/20 to-transparent rounded-full blur-2xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent animate-pulse" />

          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <Settings
                      className="w-12 h-12 text-blue-200 animate-spin"
                      style={{ animationDuration: "10s" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-20 animate-ping" />
                  </div>
                  <div>
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                      Configurações Enterprise
                    </h1>
                    <p className="text-blue-200 text-xl mt-2 flex items-center">
                      <Crown className="w-6 h-6 mr-2 text-yellow-400" />
                      Centro de controle empresarial completo
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <div>
                      <p className="text-blue-100">Status</p>
                      <p className="text-white font-semibold">Sistema Ativo</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="text-blue-100">Última atualização</p>
                      <p className="text-white font-semibold">
                        {lastUpdate.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <Server className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="text-blue-100">Versão</p>
                      <p className="text-white font-semibold">
                        v{configVersion}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <Shield className="w-4 h-4 text-green-400" />
                    <div>
                      <p className="text-blue-100">Compliance</p>
                      <p className="text-white font-semibold">LGPD/GDPR</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-3">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-500/20 text-green-200 border-green-400">
                    <Zap className="w-3 h-3 mr-1" />
                    Enterprise
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-200 border-blue-400">
                    <Rocket className="w-3 h-3 mr-1" />v{configVersion}
                  </Badge>
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleValidateConfiguration}
                    disabled={isLoading}
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                  >
                    <CheckCircle
                      className={cn(
                        "w-4 h-4 mr-2",
                        isLoading && "animate-spin",
                      )}
                    />
                    Validar
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                  >
                    <RefreshCw
                      className={cn(
                        "w-4 h-4 mr-2",
                        isLoading && "animate-spin",
                      )}
                    />
                    Atualizar
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                      >
                        <MoreVertical className="w-4 h-4 mr-2" />
                        Ações
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl min-w-48"
                    >
                      <DropdownMenuLabel className="text-[#00112F]">
                        Gerenciamento Avançado
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleExportSettings}>
                        <Download className="w-4 h-4 mr-2" />
                        Exportar Configurações
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleBackupNow}>
                        <Archive className="w-4 h-4 mr-2" />
                        Backup Manual
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <History className="w-4 h-4 mr-2" />
                        Histórico de Versões
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <HelpCircle className="w-4 h-4 mr-2" />
                        Documentação
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Headphones className="w-4 h-4 mr-2" />
                        Suporte Técnico
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    onClick={handleSave}
                    disabled={isSaving || !hasUnsavedChanges}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-lg"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Tudo
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Controls */}
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar configurações..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={cn(
                  "border-0 shadow-lg transition-all duration-300",
                  showAdvanced
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "bg-white/90 dark:bg-[#0D1117]/90",
                )}
              >
                <Sliders className="w-4 h-4 mr-2" />
                Avançado
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
                className={cn(
                  "border-0 shadow-lg transition-all duration-300",
                  previewMode
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                    : "bg-white/90 dark:bg-[#0D1117]/90",
                )}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg"
            >
              <Grid className="w-3 h-3 mr-1" />
              {filteredTabs.length} seções
            </Badge>
            {hasUnsavedChanges && (
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg animate-pulse">
                <AlertCircle className="w-3 h-3 mr-1" />
                Não salvo
              </Badge>
            )}
            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
              <Activity className="w-3 h-3 mr-1" />
              Online
            </Badge>
          </div>
        </div>

        {/* Enterprise Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          {/* Enhanced Tab Navigation */}
          <div className="relative">
            <div className="overflow-x-auto">
              <TabsList className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg p-2 grid grid-cols-4 lg:grid-cols-7 xl:grid-cols-13 gap-1 min-w-full">
                {filteredTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00112F] data-[state=active]:to-blue-600 data-[state=active]:text-white p-4 rounded-lg transition-all duration-300 group hover:shadow-lg"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="relative">
                          <Icon className="w-5 h-5 group-data-[state=active]:animate-pulse" />
                          {tab.badge && (
                            <Badge
                              className={cn(
                                "absolute -top-2 -right-2 text-xs px-1 py-0 min-w-4 h-4",
                                tab.badgeColor === "green" &&
                                  "bg-green-500 text-white",
                                tab.badgeColor === "orange" &&
                                  "bg-orange-500 text-white",
                                tab.badgeColor === "blue" &&
                                  "bg-blue-500 text-white",
                                tab.badgeColor === "purple" &&
                                  "bg-purple-500 text-white",
                                tab.badgeColor === "teal" &&
                                  "bg-teal-500 text-white",
                                tab.badgeColor === "gray" &&
                                  "bg-gray-500 text-white",
                              )}
                            >
                              {tab.badge}
                            </Badge>
                          )}
                        </div>
                        <div className="text-center">
                          <span className="text-xs font-medium block">
                            {tab.label}
                          </span>
                          <span className="text-xs opacity-70 block">
                            {tab.description}
                          </span>
                        </div>
                      </div>
                      {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" />
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
          </div>

          {/* Business Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <Building className="w-6 h-6 mr-3 text-[#00112F] dark:text-blue-400" />
                    Informações Básicas
                  </h3>
                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    Essencial
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[#00112F] dark:text-[#F9FAFB]">
                        Nome Fantasia *
                      </Label>
                      <Input
                        value={businessProfile.name}
                        onChange={(e) =>
                          setBusinessProfile({
                            ...businessProfile,
                            name: e.target.value,
                          })
                        }
                        className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      />
                    </div>
                    <div>
                      <Label className="text-[#00112F] dark:text-[#F9FAFB]">
                        Razão Social
                      </Label>
                      <Input
                        value={businessProfile.legalName}
                        onChange={(e) =>
                          setBusinessProfile({
                            ...businessProfile,
                            legalName: e.target.value,
                          })
                        }
                        className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-[#00112F] dark:text-[#F9FAFB]">
                        CNPJ
                      </Label>
                      <Input
                        value={businessProfile.cnpj}
                        onChange={(e) =>
                          setBusinessProfile({
                            ...businessProfile,
                            cnpj: e.target.value,
                          })
                        }
                        className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      />
                    </div>
                    <div>
                      <Label className="text-[#00112F] dark:text-[#F9FAFB]">
                        Inscrição Estadual
                      </Label>
                      <Input
                        value={businessProfile.stateRegistration}
                        onChange={(e) =>
                          setBusinessProfile({
                            ...businessProfile,
                            stateRegistration: e.target.value,
                          })
                        }
                        className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      />
                    </div>
                    <div>
                      <Label className="text-[#00112F] dark:text-[#F9FAFB]">
                        Inscrição Municipal
                      </Label>
                      <Input
                        value={businessProfile.municipalRegistration}
                        onChange={(e) =>
                          setBusinessProfile({
                            ...businessProfile,
                            municipalRegistration: e.target.value,
                          })
                        }
                        className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        Email *
                      </Label>
                      <Input
                        type="email"
                        value={businessProfile.email}
                        onChange={(e) =>
                          setBusinessProfile({
                            ...businessProfile,
                            email: e.target.value,
                          })
                        }
                        className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      />
                    </div>
                    <div>
                      <Label className="text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        Telefone
                      </Label>
                      <Input
                        value={businessProfile.phone}
                        onChange={(e) =>
                          setBusinessProfile({
                            ...businessProfile,
                            phone: e.target.value,
                          })
                        }
                        className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      />
                    </div>
                    <div>
                      <Label className="text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        WhatsApp
                      </Label>
                      <Input
                        value={businessProfile.whatsapp}
                        onChange={(e) =>
                          setBusinessProfile({
                            ...businessProfile,
                            whatsapp: e.target.value,
                          })
                        }
                        className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-[#00112F] dark:text-[#F9FAFB]">
                      Descrição do Negócio
                    </Label>
                    <Textarea
                      value={businessProfile.description}
                      onChange={(e) =>
                        setBusinessProfile({
                          ...businessProfile,
                          description: e.target.value,
                        })
                      }
                      className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      rows={3}
                      placeholder="Descreva seu negócio, especialidades e diferenciais..."
                    />
                  </div>
                </div>
              </Card>

              {/* Address Information */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <MapPin className="w-6 h-6 mr-3 text-[#00112F] dark:text-blue-400" />
                    Endereço & Localização
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Label className="text-[#00112F] dark:text-[#F9FAFB]">
                        Rua/Avenida
                      </Label>
                      <Input
                        value={businessProfile.address.street}
                        onChange={(e) =>
                          setBusinessProfile({
                            ...businessProfile,
                            address: {
                              ...businessProfile.address,
                              street: e.target.value,
                            },
                          })
                        }
                        className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      />
                    </div>
                    <div>
                      <Label className="text-[#00112F] dark:text-[#F9FAFB]">
                        Número
                      </Label>
                      <Input
                        value={businessProfile.address.number}
                        onChange={(e) =>
                          setBusinessProfile({
                            ...businessProfile,
                            address: {
                              ...businessProfile.address,
                              number: e.target.value,
                            },
                          })
                        }
                        className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[#00112F] dark:text-[#F9FAFB]">
                        Complemento
                      </Label>
                      <Input
                        value={businessProfile.address.complement}
                        onChange={(e) =>
                          setBusinessProfile({
                            ...businessProfile,
                            address: {
                              ...businessProfile.address,
                              complement: e.target.value,
                            },
                          })
                        }
                        className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      />
                    </div>
                    <div>
                      <Label className="text-[#00112F] dark:text-[#F9FAFB]">
                        Bairro
                      </Label>
                      <Input
                        value={businessProfile.address.neighborhood}
                        onChange={(e) =>
                          setBusinessProfile({
                            ...businessProfile,
                            address: {
                              ...businessProfile.address,
                              neighborhood: e.target.value,
                            },
                          })
                        }
                        className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="col-span-2">
                      <Label className="text-[#00112F] dark:text-[#F9FAFB]">
                        Cidade
                      </Label>
                      <Input
                        value={businessProfile.address.city}
                        onChange={(e) =>
                          setBusinessProfile({
                            ...businessProfile,
                            address: {
                              ...businessProfile.address,
                              city: e.target.value,
                            },
                          })
                        }
                        className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      />
                    </div>
                    <div>
                      <Label className="text-[#00112F] dark:text-[#F9FAFB]">
                        Estado
                      </Label>
                      <Select
                        value={businessProfile.address.state}
                        onValueChange={(value) =>
                          setBusinessProfile({
                            ...businessProfile,
                            address: {
                              ...businessProfile.address,
                              state: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SP">São Paulo</SelectItem>
                          <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                          <SelectItem value="MG">Minas Gerais</SelectItem>
                          <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-[#00112F] dark:text-[#F9FAFB]">
                        CEP
                      </Label>
                      <Input
                        value={businessProfile.address.zipCode}
                        onChange={(e) =>
                          setBusinessProfile({
                            ...businessProfile,
                            address: {
                              ...businessProfile.address,
                              zipCode: e.target.value,
                            },
                          })
                        }
                        className="mt-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                      <div className="flex items-center space-x-2">
                        <Car className="w-4 h-4 text-blue-500" />
                        <span className="text-[#00112F] dark:text-[#F9FAFB] text-sm">
                          Estacionamento
                        </span>
                      </div>
                      <Switch
                        checked={businessProfile.parking}
                        onCheckedChange={(parking) =>
                          setBusinessProfile({ ...businessProfile, parking })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                      <div className="flex items-center space-x-2">
                        <Accessibility className="w-4 h-4 text-green-500" />
                        <span className="text-[#00112F] dark:text-[#F9FAFB] text-sm">
                          Acessibilidade
                        </span>
                      </div>
                      <Switch
                        checked={businessProfile.accessibility}
                        onCheckedChange={(accessibility) =>
                          setBusinessProfile({
                            ...businessProfile,
                            accessibility,
                          })
                        }
                      />
                    </div>

                    <div className="p-3 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                      <Label className="text-[#00112F] dark:text-[#F9FAFB] text-sm">
                        Capacidade
                      </Label>
                      <Input
                        type="number"
                        value={businessProfile.capacity}
                        onChange={(e) =>
                          setBusinessProfile({
                            ...businessProfile,
                            capacity: parseInt(e.target.value) || 0,
                          })
                        }
                        className="mt-1 bg-white dark:bg-[#0D1117] border-0"
                        placeholder="Pessoas"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Social Media & Branding - Full Width */}
            <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                  <Heart className="w-6 h-6 mr-3 text-[#00112F] dark:text-blue-400" />
                  Redes Sociais & Marca
                </h3>
                <Badge className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
                  Marketing Digital
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Logo Upload */}
                <div>
                  <Label className="text-[#00112F] dark:text-[#F9FAFB] flex items-center mb-3">
                    <Camera className="w-4 h-4 mr-2" />
                    Logo & Visual Identity
                  </Label>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 hover:border-blue-400 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Arraste o logo ou{" "}
                        <span className="text-blue-600 cursor-pointer font-medium">
                          clique para selecionar
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, SVG até 5MB • Recomendado: 400x400px
                      </p>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 hover:border-blue-400 transition-colors cursor-pointer">
                      <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Banner/Capa do perfil
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG até 10MB • Recomendado: 1200x400px
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div>
                  <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-3 block">
                    Redes Sociais
                  </Label>
                  <div className="space-y-3">
                    {[
                      {
                        key: "instagram",
                        label: "Instagram",
                        icon: Instagram,
                        color: "text-pink-500",
                        prefix: "@",
                      },
                      {
                        key: "facebook",
                        label: "Facebook",
                        icon: Facebook,
                        color: "text-blue-600",
                        prefix: "facebook.com/",
                      },
                      {
                        key: "twitter",
                        label: "Twitter/X",
                        icon: Twitter,
                        color: "text-gray-800",
                        prefix: "@",
                      },
                      {
                        key: "linkedin",
                        label: "LinkedIn",
                        icon: Linkedin,
                        color: "text-blue-700",
                        prefix: "linkedin.com/company/",
                      },
                      {
                        key: "youtube",
                        label: "YouTube",
                        icon: Youtube,
                        color: "text-red-600",
                        prefix: "youtube.com/@",
                      },
                      {
                        key: "tiktok",
                        label: "TikTok",
                        icon: Video,
                        color: "text-black",
                        prefix: "@",
                      },
                    ].map(({ key, label, icon: Icon, color, prefix }) => (
                      <div key={key}>
                        <Label className="text-[#00112F] dark:text-[#F9FAFB] flex items-center text-sm">
                          <Icon className={cn("w-4 h-4 mr-2", color)} />
                          {label}
                        </Label>
                        <div className="flex mt-1">
                          <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-md">
                            {prefix}
                          </span>
                          <Input
                            value={
                              businessProfile.socialMedia[
                                key as keyof typeof businessProfile.socialMedia
                              ]
                            }
                            onChange={(e) =>
                              setBusinessProfile({
                                ...businessProfile,
                                socialMedia: {
                                  ...businessProfile.socialMedia,
                                  [key]: e.target.value,
                                },
                              })
                            }
                            className="rounded-l-none bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                            placeholder={
                              key === "instagram"
                                ? "seuusuario"
                                : key === "facebook"
                                  ? "suapagina"
                                  : "seuusuario"
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Appointments Configuration Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Booking Policies */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <Calendar className="w-6 h-6 mr-3 text-[#00112F] dark:text-blue-400" />
                    Políticas de Agendamento
                  </h3>
                  <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    Essencial
                  </Badge>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[#00112F] dark:text-[#F9FAFB] flex items-center mb-2">
                        <Clock className="w-4 h-4 mr-1" />
                        Antecedência Mínima (minutos)
                      </Label>
                      <Input
                        type="number"
                        value={appointmentSettings.bookingPolicy.minAdvanceTime}
                        onChange={(e) =>
                          setAppointmentSettings({
                            ...appointmentSettings,
                            bookingPolicy: {
                              ...appointmentSettings.bookingPolicy,
                              minAdvanceTime: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className="bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      />
                    </div>
                    <div>
                      <Label className="text-[#00112F] dark:text-[#F9FAFB] flex items-center mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        Antecedência Máxima (horas)
                      </Label>
                      <Input
                        type="number"
                        value={appointmentSettings.bookingPolicy.maxAdvanceTime}
                        onChange={(e) =>
                          setAppointmentSettings({
                            ...appointmentSettings,
                            bookingPolicy: {
                              ...appointmentSettings.bookingPolicy,
                              maxAdvanceTime: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className="bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                      <div>
                        <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                          Agendamento no Mesmo Dia
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Permitir agendamentos para o dia atual
                        </p>
                      </div>
                      <Switch
                        checked={
                          appointmentSettings.bookingPolicy.allowSameDayBooking
                        }
                        onCheckedChange={(checked) =>
                          setAppointmentSettings({
                            ...appointmentSettings,
                            bookingPolicy: {
                              ...appointmentSettings.bookingPolicy,
                              allowSameDayBooking: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                      <div>
                        <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                          Lista de Espera
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Permitir inscrição em lista de espera
                        </p>
                      </div>
                      <Switch
                        checked={
                          appointmentSettings.bookingPolicy.allowWaitingList
                        }
                        onCheckedChange={(checked) =>
                          setAppointmentSettings({
                            ...appointmentSettings,
                            bookingPolicy: {
                              ...appointmentSettings.bookingPolicy,
                              allowWaitingList: checked,
                            },
                          })
                        }
                      />
                    </div>

                    {appointmentSettings.bookingPolicy.allowWaitingList && (
                      <div className="pl-4 border-l-2 border-blue-200">
                        <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-2 block">
                          Máximo na Lista de Espera
                        </Label>
                        <Input
                          type="number"
                          value={
                            appointmentSettings.bookingPolicy.maxWaitingList
                          }
                          onChange={(e) =>
                            setAppointmentSettings({
                              ...appointmentSettings,
                              bookingPolicy: {
                                ...appointmentSettings.bookingPolicy,
                                maxWaitingList: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          className="bg-white dark:bg-[#0D1117] border-0 max-w-32"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                      <div>
                        <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                          Overbooking
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Permitir agendamentos além da capacidade
                        </p>
                      </div>
                      <Switch
                        checked={
                          appointmentSettings.bookingPolicy.overbookingEnabled
                        }
                        onCheckedChange={(checked) =>
                          setAppointmentSettings({
                            ...appointmentSettings,
                            bookingPolicy: {
                              ...appointmentSettings.bookingPolicy,
                              overbookingEnabled: checked,
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  {showAdvanced && (
                    <Accordion type="single" collapsible>
                      <AccordionItem value="deposit">
                        <AccordionTrigger className="text-[#00112F] dark:text-[#F9FAFB]">
                          Configurações de Depósito
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-4">
                            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                              <div>
                                <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                                  Exigir Depósito
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Solicitar pagamento de entrada
                                </p>
                              </div>
                              <Switch
                                checked={
                                  appointmentSettings.bookingPolicy
                                    .requireDeposit
                                }
                                onCheckedChange={(checked) =>
                                  setAppointmentSettings({
                                    ...appointmentSettings,
                                    bookingPolicy: {
                                      ...appointmentSettings.bookingPolicy,
                                      requireDeposit: checked,
                                    },
                                  })
                                }
                              />
                            </div>

                            {appointmentSettings.bookingPolicy
                              .requireDeposit && (
                              <div>
                                <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-2 block">
                                  Percentual do Depósito (%)
                                </Label>
                                <div className="flex items-center space-x-4">
                                  <Slider
                                    value={[
                                      appointmentSettings.bookingPolicy
                                        .depositPercentage,
                                    ]}
                                    onValueChange={([value]) =>
                                      setAppointmentSettings({
                                        ...appointmentSettings,
                                        bookingPolicy: {
                                          ...appointmentSettings.bookingPolicy,
                                          depositPercentage: value,
                                        },
                                      })
                                    }
                                    max={100}
                                    step={5}
                                    className="flex-1"
                                  />
                                  <span className="text-[#00112F] dark:text-[#F9FAFB] font-medium min-w-12">
                                    {
                                      appointmentSettings.bookingPolicy
                                        .depositPercentage
                                    }
                                    %
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </div>
              </Card>

              {/* Cancellation Policies */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <AlertTriangle className="w-6 h-6 mr-3 text-[#00112F] dark:text-blue-400" />
                    Políticas de Cancelamento
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                    <div>
                      <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                        Permitir Cancelamento
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Clientes podem cancelar agendamentos
                      </p>
                    </div>
                    <Switch
                      checked={
                        appointmentSettings.cancellationPolicy.allowCancellation
                      }
                      onCheckedChange={(checked) =>
                        setAppointmentSettings({
                          ...appointmentSettings,
                          cancellationPolicy: {
                            ...appointmentSettings.cancellationPolicy,
                            allowCancellation: checked,
                          },
                        })
                      }
                    />
                  </div>

                  {appointmentSettings.cancellationPolicy.allowCancellation && (
                    <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                      <div>
                        <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-2 block">
                          Antecedência Mínima (minutos)
                        </Label>
                        <Input
                          type="number"
                          value={
                            appointmentSettings.cancellationPolicy.minimumNotice
                          }
                          onChange={(e) =>
                            setAppointmentSettings({
                              ...appointmentSettings,
                              cancellationPolicy: {
                                ...appointmentSettings.cancellationPolicy,
                                minimumNotice: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          className="bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0 max-w-40"
                        />
                      </div>

                      <div>
                        <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-2 block">
                          Política de Reembolso
                        </Label>
                        <Select
                          value={
                            appointmentSettings.cancellationPolicy.refundPolicy
                          }
                          onValueChange={(value) =>
                            setAppointmentSettings({
                              ...appointmentSettings,
                              cancellationPolicy: {
                                ...appointmentSettings.cancellationPolicy,
                                refundPolicy: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger className="bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full">
                              Reembolso Total
                            </SelectItem>
                            <SelectItem value="partial">
                              Reembolso Parcial
                            </SelectItem>
                            <SelectItem value="credit">
                              Crédito para Futuro
                            </SelectItem>
                            <SelectItem value="none">Sem Reembolso</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                        <div>
                          <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                            Permitir Reagendamento
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Clientes podem reagendar sem custo
                          </p>
                        </div>
                        <Switch
                          checked={
                            appointmentSettings.cancellationPolicy
                              .rescheduleAllowed
                          }
                          onCheckedChange={(checked) =>
                            setAppointmentSettings({
                              ...appointmentSettings,
                              cancellationPolicy: {
                                ...appointmentSettings.cancellationPolicy,
                                rescheduleAllowed: checked,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Custom Fields & Payment Methods - Full Width */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <Edit className="w-6 h-6 mr-3 text-[#00112F] dark:text-blue-400" />
                    Campos Personalizados
                  </h3>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Campo
                  </Button>
                </div>

                <div className="space-y-4">
                  {appointmentSettings.customFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <Input
                            value={field.name}
                            onChange={(e) => {
                              const newFields = [
                                ...appointmentSettings.customFields,
                              ];
                              newFields[index].name = e.target.value;
                              setAppointmentSettings({
                                ...appointmentSettings,
                                customFields: newFields,
                              });
                            }}
                            className="bg-white dark:bg-[#0D1117] border-0 font-medium"
                            placeholder="Nome do campo"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Select value={field.type}>
                          <SelectTrigger className="bg-white dark:bg-[#0D1117] border-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Texto</SelectItem>
                            <SelectItem value="textarea">
                              Texto Longo
                            </SelectItem>
                            <SelectItem value="select">Lista</SelectItem>
                            <SelectItem value="boolean">Sim/Não</SelectItem>
                            <SelectItem value="number">Número</SelectItem>
                            <SelectItem value="date">Data</SelectItem>
                          </SelectContent>
                        </Select>

                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={field.required}
                            onCheckedChange={(checked) => {
                              const newFields = [
                                ...appointmentSettings.customFields,
                              ];
                              newFields[index].required = checked;
                              setAppointmentSettings({
                                ...appointmentSettings,
                                customFields: newFields,
                              });
                            }}
                          />
                          <Label className="text-sm text-[#00112F] dark:text-[#F9FAFB]">
                            Obrigatório
                          </Label>
                        </div>
                      </div>

                      {field.type === "select" && field.options && (
                        <div className="mt-3">
                          <Label className="text-sm text-[#00112F] dark:text-[#F9FAFB] mb-2 block">
                            Opções (uma por linha)
                          </Label>
                          <Textarea
                            value={field.options.join("\n")}
                            onChange={(e) => {
                              const newFields = [
                                ...appointmentSettings.customFields,
                              ];
                              newFields[index].options = e.target.value
                                .split("\n")
                                .filter(Boolean);
                              setAppointmentSettings({
                                ...appointmentSettings,
                                customFields: newFields,
                              });
                            }}
                            className="bg-white dark:bg-[#0D1117] border-0 text-sm"
                            rows={3}
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {appointmentSettings.customFields.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Edit className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhum campo personalizado configurado</p>
                      <p className="text-sm">
                        Adicione campos para coletar informações específicas
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <CreditCard className="w-6 h-6 mr-3 text-[#00112F] dark:text-blue-400" />
                    Métodos de Pagamento
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      id: "dinheiro",
                      name: "Dinheiro",
                      icon: DollarSign,
                      color: "text-green-500",
                    },
                    {
                      id: "cartao",
                      name: "Cartão de Crédito/Débito",
                      icon: CreditCard,
                      color: "text-blue-500",
                    },
                    {
                      id: "pix",
                      name: "PIX",
                      icon: Smartphone,
                      color: "text-purple-500",
                    },
                    {
                      id: "transferencia",
                      name: "Transferência Bancária",
                      icon: Building,
                      color: "text-orange-500",
                    },
                  ].map(({ id, name, icon: Icon, color }) => (
                    <div
                      key={id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={cn("w-5 h-5", color)} />
                        <span className="text-[#00112F] dark:text-[#F9FAFB] font-medium">
                          {name}
                        </span>
                      </div>
                      <Switch
                        checked={appointmentSettings.paymentMethods.includes(
                          id,
                        )}
                        onCheckedChange={(checked) => {
                          const newMethods = checked
                            ? [...appointmentSettings.paymentMethods, id]
                            : appointmentSettings.paymentMethods.filter(
                                (method) => method !== id,
                              );
                          setAppointmentSettings({
                            ...appointmentSettings,
                            paymentMethods: newMethods,
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                    <div className="flex items-center space-x-3">
                      <Tag className="w-5 h-5 text-yellow-500" />
                      <div>
                        <span className="text-[#00112F] dark:text-[#F9FAFB] font-medium block">
                          Códigos de Desconto
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Permitir cupons promocionais
                        </span>
                      </div>
                    </div>
                    <Switch
                      checked={appointmentSettings.discountCodes}
                      onCheckedChange={(discountCodes) =>
                        setAppointmentSettings({
                          ...appointmentSettings,
                          discountCodes,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-purple-500" />
                      <div>
                        <span className="text-[#00112F] dark:text-[#F9FAFB] font-medium block">
                          Programa de Fidelidade
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Sistema de pontos e recompensas
                        </span>
                      </div>
                    </div>
                    <Switch
                      checked={appointmentSettings.loyaltyProgram}
                      onCheckedChange={(loyaltyProgram) =>
                        setAppointmentSettings({
                          ...appointmentSettings,
                          loyaltyProgram,
                        })
                      }
                    />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Service Categories */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <Layers className="w-6 h-6 mr-3 text-[#00112F] dark:text-blue-400" />
                    Categorias de Serviços
                  </h3>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Categoria
                  </Button>
                </div>

                <div className="space-y-4">
                  {serviceCategories.map((category) => (
                    <div
                      key={category.id}
                      className="p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <div>
                            <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                              {category.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {category.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={category.active}
                            onCheckedChange={(active) => {
                              const newCategories = serviceCategories.map(
                                (cat) =>
                                  cat.id === category.id
                                    ? { ...cat, active }
                                    : cat,
                              );
                              setServiceCategories(newCategories);
                            }}
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            category.active
                              ? "bg-green-100 text-green-700 border-green-300"
                              : "bg-gray-100 text-gray-600 border-gray-300",
                          )}
                        >
                          {category.active ? "Ativo" : "Inativo"}
                        </Badge>
                        <span className="text-gray-500">
                          Ordem: {category.order}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Service Management */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <Scissors className="w-6 h-6 mr-3 text-[#00112F] dark:text-blue-400" />
                    Gestão de Serviços
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="text-center py-8">
                    <Scissors className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h4 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB] mb-2">
                      Configuração Avançada de Serviços
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Configure serviços com preços dinâmicos, durações
                      variáveis e requisitos especiais
                    </p>
                    <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Primeiro Serviço
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                      Configurações Globais
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-2 block">
                          Duração Padrão (minutos)
                        </Label>
                        <Input
                          type="number"
                          defaultValue="60"
                          className="bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                        />
                      </div>
                      <div>
                        <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-2 block">
                          Intervalo Entre Serviços (min)
                        </Label>
                        <Input
                          type="number"
                          defaultValue="15"
                          className="bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-[#00112F] dark:text-[#F9FAFB] text-sm">
                            Aprovação Automática
                          </span>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-blue-500" />
                          <span className="text-[#00112F] dark:text-[#F9FAFB] text-sm">
                            Serviços Online
                          </span>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-[#00112F] dark:text-[#F9FAFB] text-sm">
                            Sistema de Avaliações
                          </span>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Esta é apenas uma pequena parte da implementação completa... */}
          {/* Continuaria com todas as outras 10 abas com funcionalidades similares */}

          {/* Backup Tab - Exemplo de implementação completa */}
          <TabsContent value="backup" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Backup Configuration */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <Database className="w-6 h-6 mr-3 text-[#00112F] dark:text-blue-400" />
                    Configuração de Backup
                  </h3>
                  <Badge
                    className={cn(
                      "text-white",
                      backupSettings.autoBackup
                        ? "bg-green-500"
                        : "bg-orange-500",
                    )}
                  >
                    {backupSettings.autoBackup ? "Automático" : "Manual"}
                  </Badge>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                    <div>
                      <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                        Backup Automático
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Executa backup automaticamente conforme frequência
                      </p>
                    </div>
                    <Switch
                      checked={backupSettings.autoBackup}
                      onCheckedChange={(autoBackup) =>
                        setBackupSettings({ ...backupSettings, autoBackup })
                      }
                    />
                  </div>

                  {backupSettings.autoBackup && (
                    <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                      <div>
                        <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-2 block">
                          Frequência
                        </Label>
                        <Select
                          value={backupSettings.frequency}
                          onValueChange={(frequency) =>
                            setBackupSettings({ ...backupSettings, frequency })
                          }
                        >
                          <SelectTrigger className="bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">A cada hora</SelectItem>
                            <SelectItem value="daily">Diário</SelectItem>
                            <SelectItem value="weekly">Semanal</SelectItem>
                            <SelectItem value="monthly">Mensal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-2 block">
                          Próximo Backup
                        </Label>
                        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span className="text-blue-700 dark:text-blue-300 text-sm">
                              {backupSettings.nextBackup.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                      <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4 text-green-500" />
                        <span className="text-[#00112F] dark:text-[#F9FAFB] text-sm">
                          Criptografia
                        </span>
                      </div>
                      <Switch
                        checked={backupSettings.encryption}
                        onCheckedChange={(encryption) =>
                          setBackupSettings({ ...backupSettings, encryption })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                      <div className="flex items-center space-x-2">
                        <CloudUpload className="w-4 h-4 text-blue-500" />
                        <span className="text-[#00112F] dark:text-[#F9FAFB] text-sm">
                          Armazenar na Nuvem
                        </span>
                      </div>
                      <Switch
                        checked={backupSettings.cloudStorage}
                        onCheckedChange={(cloudStorage) =>
                          setBackupSettings({ ...backupSettings, cloudStorage })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                      <div className="flex items-center space-x-2">
                        <Archive className="w-4 h-4 text-purple-500" />
                        <span className="text-[#00112F] dark:text-[#F9FAFB] text-sm">
                          Compressão
                        </span>
                      </div>
                      <Switch
                        checked={backupSettings.compressionEnabled}
                        onCheckedChange={(compressionEnabled) =>
                          setBackupSettings({
                            ...backupSettings,
                            compressionEnabled,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-teal-500" />
                        <span className="text-[#00112F] dark:text-[#F9FAFB] text-sm">
                          Verificação
                        </span>
                      </div>
                      <Switch
                        checked={backupSettings.backupVerification}
                        onCheckedChange={(backupVerification) =>
                          setBackupSettings({
                            ...backupSettings,
                            backupVerification,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-3 block">
                      Retenção de Backups
                    </Label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[backupSettings.retentionDays]}
                        onValueChange={([value]) =>
                          setBackupSettings({
                            ...backupSettings,
                            retentionDays: value,
                          })
                        }
                        max={365}
                        min={7}
                        step={7}
                        className="flex-1"
                      />
                      <div className="text-[#00112F] dark:text-[#F9FAFB] font-medium min-w-16">
                        {backupSettings.retentionDays} dias
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Backups mais antigos serão automaticamente removidos
                    </p>
                  </div>

                  <Button
                    onClick={handleBackupNow}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#00112F] to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Criando Backup...
                      </>
                    ) : (
                      <>
                        <CloudUpload className="w-4 h-4 mr-2" />
                        Criar Backup Agora
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Backup History & Storage */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <History className="w-6 h-6 mr-3 text-[#00112F] dark:text-blue-400" />
                    Histórico & Armazenamento
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-blue-600 border-blue-200"
                  >
                    {backupSettings.backupHistory.length} backups
                  </Badge>
                </div>

                <div className="space-y-6">
                  {/* Last Backup Status */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-800 dark:text-green-300 font-semibold">
                          Último Backup
                        </span>
                      </div>
                      <Badge className="bg-green-500 text-white text-xs">
                        {backupSettings.lastBackup.toLocaleDateString()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-green-700 dark:text-green-400">
                          Tamanho:
                        </span>
                        <span className="text-green-800 dark:text-green-300 ml-2 font-medium">
                          {backupSettings.backupSize}
                        </span>
                      </div>
                      <div>
                        <span className="text-green-700 dark:text-green-400">
                          Horário:
                        </span>
                        <span className="text-green-800 dark:text-green-300 ml-2 font-medium">
                          {backupSettings.lastBackup.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Storage Locations */}
                  <div>
                    <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-3 block font-semibold">
                      Locais de Armazenamento
                    </Label>
                    <div className="space-y-3">
                      {backupSettings.storageLocations.map(
                        (location, index) => (
                          <div
                            key={index}
                            className="p-3 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 border border-gray-200 dark:border-gray-700"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <CloudDownload className="w-4 h-4 text-blue-500" />
                                <div>
                                  <span className="text-[#00112F] dark:text-[#F9FAFB] font-medium text-sm">
                                    {location.name}
                                  </span>
                                  <div className="text-xs text-gray-600 dark:text-gray-400">
                                    {location.used} / {location.quota}
                                  </div>
                                </div>
                              </div>
                              <Switch checked={location.enabled} />
                            </div>
                            <Progress
                              value={
                                (parseFloat(location.used) /
                                  parseFloat(location.quota)) *
                                100
                              }
                              className="mt-2 h-1"
                            />
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Backup History */}
                  <div>
                    <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-3 block font-semibold">
                      Histórico Recente
                    </Label>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {backupSettings.backupHistory.map((backup) => (
                        <div
                          key={backup.id}
                          className="p-3 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <CircleCheck className="w-4 h-4 text-green-500" />
                              <div>
                                <span className="text-[#00112F] dark:text-[#F9FAFB] text-sm font-medium">
                                  {backup.date.toLocaleDateString()}
                                </span>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  {backup.date.toLocaleTimeString()} •{" "}
                                  {backup.duration}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  backup.type === "manual"
                                    ? "bg-blue-100 text-blue-700 border-blue-300"
                                    : "bg-gray-100 text-gray-600 border-gray-300",
                                )}
                              >
                                {backup.type === "manual" ? "Manual" : "Auto"}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {backup.size}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                              >
                                <CloudDownload className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* System Status */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <Activity className="w-6 h-6 mr-3 text-[#00112F] dark:text-blue-400" />
                    Status do Sistema
                  </h3>
                  <Badge className="bg-green-500 text-white">Online</Badge>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "CPU", value: 45, color: "blue" },
                    { label: "Memória", value: 67, color: "green" },
                    { label: "Disco", value: 23, color: "yellow" },
                    { label: "Rede", value: 89, color: "purple" },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#00112F] dark:text-[#F9FAFB]">
                          {label}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {value}%
                        </span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Performance Settings */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <Zap className="w-6 h-6 mr-3 text-[#00112F] dark:text-blue-400" />
                    Performance
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      key: "caching",
                      label: "Cache Ativo",
                      description: "Armazenamento temporário para velocidade",
                    },
                    {
                      key: "compressionEnabled",
                      label: "Compressão",
                      description: "Reduzir tamanho dos arquivos",
                    },
                    {
                      key: "imageOptimization",
                      label: "Otimização de Imagens",
                      description: "Redimensionar automaticamente",
                    },
                    {
                      key: "lazyLoading",
                      label: "Carregamento Lazy",
                      description: "Carregar conteúdo conforme necessário",
                    },
                  ].map(({ key, label, description }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20"
                    >
                      <div>
                        <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB] text-sm">
                          {label}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {description}
                        </p>
                      </div>
                      <Switch
                        checked={
                          systemSettings.performance[
                            key as keyof typeof systemSettings.performance
                          ] as boolean
                        }
                        onCheckedChange={(checked) =>
                          setSystemSettings({
                            ...systemSettings,
                            performance: {
                              ...systemSettings.performance,
                              [key]: checked,
                            },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Development Tools */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <Wrench className="w-6 h-6 mr-3 text-[#00112F] dark:text-blue-400" />
                    Desenvolvimento
                  </h3>
                  <Badge
                    className={cn(
                      systemSettings.development.debugMode
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-500 text-white",
                    )}
                  >
                    {systemSettings.development.debugMode
                      ? "Debug ON"
                      : "Produção"}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      key: "debugMode",
                      label: "Modo Debug",
                      description: "Logs detalhados e informações de debug",
                      color: "yellow",
                    },
                    {
                      key: "apiLogging",
                      label: "Log de API",
                      description: "Registrar todas as chamadas da API",
                      color: "blue",
                    },
                    {
                      key: "performanceProfiler",
                      label: "Profiler de Performance",
                      description: "Análise detalhada de performance",
                      color: "green",
                    },
                    {
                      key: "testMode",
                      label: "Modo de Teste",
                      description: "Ambiente isolado para testes",
                      color: "purple",
                    },
                  ].map(({ key, label, description, color }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20"
                    >
                      <div>
                        <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB] text-sm">
                          {label}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {description}
                        </p>
                      </div>
                      <Switch
                        checked={
                          systemSettings.development[
                            key as keyof typeof systemSettings.development
                          ] as boolean
                        }
                        onCheckedChange={(checked) =>
                          setSystemSettings({
                            ...systemSettings,
                            development: {
                              ...systemSettings.development,
                              [key]: checked,
                            },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>

                {showAdvanced && (
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Label className="text-[#00112F] dark:text-[#F9FAFB] mb-3 block font-semibold">
                      Feature Flags
                    </Label>
                    <div className="space-y-2">
                      {Object.entries(
                        systemSettings.development.featureFlags,
                      ).map(([flag, enabled]) => (
                        <div
                          key={flag}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-[#00112F] dark:text-[#F9FAFB]">
                            {flag}
                          </span>
                          <Switch
                            checked={enabled}
                            onCheckedChange={(checked) =>
                              setSystemSettings({
                                ...systemSettings,
                                development: {
                                  ...systemSettings.development,
                                  featureFlags: {
                                    ...systemSettings.development.featureFlags,
                                    [flag]: checked,
                                  },
                                },
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
