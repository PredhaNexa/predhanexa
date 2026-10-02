import { supabase } from "../lib/supabase";
import { AppConfig, ContactMessage, ServiceItem } from '../types';

const STORAGE_KEY = 'predhanexa_config_v1';
const MESSAGES_KEY = 'predhanexa_messages_v1';
const AUTH_KEY = 'predhanexa_admin_token_v1';

// Default configuration strictly grounded in user-provided actual information
export const DEFAULT_CONFIG: AppConfig = {
  company: {
    name: 'Predhanexa Private Limited',
    legalType: 'Private Limited Software Development Company',
    tagline: 'Building Software. Supporting Growth.',
    description:
      'We design, develop, deploy, maintain, and provide technical support for software applications and digital solutions to help organizations improve their digital operations.',
    email: 'predhanexa@gmail.com',
    phone: '9494408539',
    address: '', // Unset until entered by administrator
    copyright: `© ${new Date().getFullYear()} Predhanexa Private Limited. All rights reserved.`,
    logo: '',
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
    },
  },
  founder: {
    name: 'N. Dhanush Kumar',
    designation: 'Founder & Director',
    photo: '', // To be uploaded by admin
    biography: '', // Initially empty
    email: 'naragantiumadevi@gmail.com',
    whatsapp: '6302836330',
    phone: '',
    din: '', // Director Identification Number: initially empty / not configured
    skills: [],
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
    },
  },
  coFounder: {
    name: 'N. Prudhvi Vilas',
    designation: 'Co-Founder',
    photo: '', // To be uploaded by admin
    biography: '', // Initially empty
    email: '',
    whatsapp: '',
    phone: '',
    skills: [],
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
    },
  },
  // Zero seed data as requested: services start empty; admin can enable/create
  services: [],
  seo: {
    pageTitle: 'Predhanexa Private Limited | Software Development & Digital Solutions',
    metaDescription:
      'Professional software development, web & mobile applications, custom solutions, cloud deployment, and ongoing technical support for modern organizations.',
    keywords:
      'Software Development, Web Applications, Mobile Apps, Custom Software, API Development, Software Maintenance, Cloud Deployment, Digital Solutions',
    canonicalUrl: 'https://predhanexa.com',
    ogTitle: 'Predhanexa Private Limited | Software Development & Digital Solutions',
    ogDescription:
      'We design, develop and maintain reliable software solutions for businesses and organizations.',
    ogImage: '',
    robotsIndex: true,
    robotsFollow: true,
    googleSiteVerification: '',
    googleAnalyticsId: '',
  },
};

// Official suggested services list according to the company's stated scope
export const SUGGESTED_SERVICE_TEMPLATES = [
  {
    title: 'Custom Software Development',
    category: 'Engineering',
    icon: 'Code2',
    description:
      'Bespoke software systems engineered to solve precise organizational workflows, automate processes, and scale with operational growth.',
  },
  {
    title: 'Web Application Development',
    category: 'Frontend & Full-Stack',
    icon: 'Globe',
    description:
      'High-performance, responsive web applications built with modern frameworks, high reliability, and clean architectural principles.',
  },
  {
    title: 'Mobile App Development',
    category: 'Mobile',
    icon: 'Smartphone',
    description:
      'Native and cross-platform mobile solutions for iOS and Android, focusing on intuitive user experience and secure offline-first functionality.',
  },
  {
    title: 'Backend & API Engineering',
    category: 'Architecture',
    icon: 'Server',
    description:
      'Resilient REST and GraphQL APIs, microservices, and serverless backend infrastructure designed for high concurrency and secure data flow.',
  },
  {
    title: 'Database Solutions',
    category: 'Data',
    icon: 'Database',
    description:
      'Relational and distributed database architecture, schema optimization, data migration, and high-availability backup systems.',
  },
  {
    title: 'Business Automation',
    category: 'Operations',
    icon: 'Cpu',
    description:
      'Automated pipeline engineering, ERP integrations, and workflow automation tools to reduce manual overhead and improve organizational velocity.',
  },
  {
    title: 'Software Maintenance & Upgrades',
    category: 'Support',
    icon: 'ShieldCheck',
    description:
      'Proactive codebase maintenance, dependency security updates, performance monitoring, and framework upgrades for continuous uptime.',
  },
  {
    title: 'Bug Fixing & Technical Support',
    category: 'Support',
    icon: 'Wrench',
    description:
      'Rigorous root-cause analysis, emergency patch deployment, and structured SLA-backed technical assistance for mission-critical software.',
  },
  {
    title: 'Cloud Deployment & DevOps',
    category: 'Cloud',
    icon: 'Cloud',
    description:
      'Automated CI/CD pipelines, container orchestration, infrastructure-as-code, and multi-region cloud deployment configurations.',
  },
  {
    title: 'Software Modernization',
    category: 'Engineering',
    icon: 'RefreshCw',
    description:
      'Transform legacy monoliths and technical debt into modular, cloud-ready architectures with zero business disruption.',
  },
];

type Listener = (config: AppConfig) => void;
const listeners: Set<Listener> = new Set();

class ConfigService {
  private config: AppConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): AppConfig {
    if (typeof window === 'undefined') {
      return DEFAULT_CONFIG;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Deep merge with defaults to ensure all required fields exist
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          company: { ...DEFAULT_CONFIG.company, ...(parsed.company || {}) },
          founder: { ...DEFAULT_CONFIG.founder, ...(parsed.founder || {}) },
          coFounder: { ...DEFAULT_CONFIG.coFounder, ...(parsed.coFounder || {}) },
          seo: { ...DEFAULT_CONFIG.seo, ...(parsed.seo || {}) },
          services: Array.isArray(parsed.services) ? parsed.services : [],
        };
      }
    } catch (err) {
      console.error('Failed to load configuration from localStorage:', err);
    }
    return DEFAULT_CONFIG;
  }

  private saveConfig(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
      } catch (err) {
        console.error('Failed to save configuration to localStorage:', err);
      }
    }
    this.notify();
  }

  private notify(): void {
    listeners.forEach((listener) => listener(this.config));
  }

  public subscribe(listener: Listener): () => void {
    listeners.add(listener);
    listener(this.config);
    return () => {
      listeners.delete(listener);
    };
  }

  public getConfig(): AppConfig {
    return { ...this.config };
  }

  public updateCompany(companyUpdates: Partial<AppConfig['company']>): void {
    this.config = {
      ...this.config,
      company: { ...this.config.company, ...companyUpdates },
    };
    this.saveConfig();
  }

  public updateFounder(founderUpdates: Partial<AppConfig['founder']>): void {
    this.config = {
      ...this.config,
      founder: { ...this.config.founder, ...founderUpdates },
    };
    this.saveConfig();
  }

  public updateCoFounder(coFounderUpdates: Partial<AppConfig['coFounder']>): void {
    this.config = {
      ...this.config,
      coFounder: { ...this.config.coFounder, ...coFounderUpdates },
    };
    this.saveConfig();
  }

  public updateSeo(seoUpdates: Partial<AppConfig['seo']>): void {
    this.config = {
      ...this.config,
      seo: { ...this.config.seo, ...seoUpdates },
    };
    this.saveConfig();
  }

  // Service Management
  public getServices(): ServiceItem[] {
    return [...this.config.services].sort((a, b) => a.order - b.order);
  }

  public addService(service: Omit<ServiceItem, 'id' | 'order'>): ServiceItem {
    const newService: ServiceItem = {
      ...service,
      id: 'srv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      order: this.config.services.length + 1,
    };
    this.config = {
      ...this.config,
      services: [...this.config.services, newService],
    };
    this.saveConfig();
    return newService;
  }

  public updateService(id: string, updates: Partial<ServiceItem>): void {
    this.config = {
      ...this.config,
      services: this.config.services.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    };
    this.saveConfig();
  }

  public deleteService(id: string): void {
    this.config = {
      ...this.config,
      services: this.config.services.filter((s) => s.id !== id),
    };
    this.saveConfig();
  }

  public toggleService(id: string): void {
    this.config = {
      ...this.config,
      services: this.config.services.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    };
    this.saveConfig();
  }

  public reorderServices(newOrderIds: string[]): void {
    const serviceMap = new Map(this.config.services.map((s) => [s.id, s]));
    const reordered: ServiceItem[] = [];
    newOrderIds.forEach((id, index) => {
      const s = serviceMap.get(id);
      if (s) {
        reordered.push({ ...s, order: index + 1 });
      }
    });
    this.config = {
      ...this.config,
      services: reordered,
    };
    this.saveConfig();
  }

  // Contact Inquiries Management
  public getMessages(): ContactMessage[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(MESSAGES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public addMessage(message: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): ContactMessage {
    const messages = this.getMessages();
    const newMessage: ContactMessage = {
      ...message,
      id: 'msg_' + Date.now(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    const updated = [newMessage, ...messages];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to store contact message:', err);
      }
    }
    return newMessage;
  }

  public markMessageRead(id: string, read = true): void {
    const messages = this.getMessages();
    const updated = messages.map((m) => (m.id === id ? { ...m, read } : m));
    if (typeof window !== 'undefined') {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
    }
  }

  public deleteMessage(id: string): void {
    const messages = this.getMessages();
    const updated = messages.filter((m) => m.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
    }
  }

  // Backup & Restore
  public resetToDefaults(): void {
    this.config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    this.saveConfig();
  }

  public exportJson(): string {
    return JSON.stringify(this.config, null, 2);
  }

  public importJson(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.company && parsed.founder) {
        this.config = {
          ...DEFAULT_CONFIG,
          ...parsed,
          services: Array.isArray(parsed.services) ? parsed.services : [],
        };
        this.saveConfig();
        return true;
      }
    } catch (e) {
      console.error('Failed to parse import JSON', e);
    }
    return false;
  }

// Admin Authentication using Supabase Auth
public async isAuthenticated(): Promise<boolean> {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Failed to get authentication session:', error);
    return false;
  }

  return !!data.session;
}

public async login(email: string, password: string): Promise<boolean> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    console.error('Supabase login failed:', error.message);
    return false;
  }

  return !!data.session;
}

public async setAdminPassword(newPassword: string): Promise<boolean> {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error('Failed to update admin password:', error.message);
    return false;
  }

  return true;
}

public async logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Supabase logout failed:', error.message);
  }
}
}

export const configService = new ConfigService();
