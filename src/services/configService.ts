import { supabase } from "../lib/supabase";
import { AppConfig, ContactMessage, ServiceItem } from "../types";

// Default configuration
export const DEFAULT_CONFIG: AppConfig = {
  company: {
    name: "Predhanexa Private Limited",
    legalType: "Private Limited Software Development Company",
    tagline: "Building Software. Supporting Growth.",
    description:
      "We design, develop, deploy, maintain, and provide technical support for software applications and digital solutions to help organizations improve their digital operations.",
    email: "predhanexa@gmail.com",
    phone: "9494408539",
    address: "",
    copyright: `© ${new Date().getFullYear()} Predhanexa Private Limited. All rights reserved.`,
    logo: "",
    socialLinks: {
      linkedin: "",
      github: "",
      twitter: "",
    },
  },

  founder: {
    name: "N. Dhanush Kumar",
    designation: "Founder & Director",
    photo: "",
    biography: "",
    email: "naragantiumadevi@gmail.com",
    whatsapp: "6302836330",
    phone: "",
    din: "",
    skills: [],
    socialLinks: {
      linkedin: "",
      github: "",
      twitter: "",
    },
  },

  coFounder: {
    name: "N. Prudhvi Vilas",
    designation: "Co-Founder",
    photo: "",
    biography: "",
    email: "",
    whatsapp: "",
    phone: "",
    skills: [],
    socialLinks: {
      linkedin: "",
      github: "",
      twitter: "",
    },
  },

  services: [],

  seo: {
    pageTitle:
      "Predhanexa Private Limited | Software Development & Digital Solutions",
    metaDescription:
      "Professional software development, web & mobile applications, custom solutions, cloud deployment, and ongoing technical support for modern organizations.",
    keywords:
      "Software Development, Web Applications, Mobile Apps, Custom Software, API Development, Software Maintenance, Cloud Deployment, Digital Solutions",
    canonicalUrl: "https://predhanexa.com",
    ogTitle:
      "Predhanexa Private Limited | Software Development & Digital Solutions",
    ogDescription:
      "We design, develop and maintain reliable software solutions for businesses and organizations.",
    ogImage: "",
    robotsIndex: true,
    robotsFollow: true,
    googleSiteVerification: "",
    googleAnalyticsId: "",
  },
};

// Suggested services
export const SUGGESTED_SERVICE_TEMPLATES = [
  {
    title: "Custom Software Development",
    category: "Engineering",
    icon: "Code2",
    description:
      "Bespoke software systems engineered to solve precise organizational workflows, automate processes, and scale with operational growth.",
  },
  {
    title: "Web Application Development",
    category: "Frontend & Full-Stack",
    icon: "Globe",
    description:
      "High-performance, responsive web applications built with modern frameworks, high reliability, and clean architectural principles.",
  },
  {
    title: "Mobile App Development",
    category: "Mobile",
    icon: "Smartphone",
    description:
      "Native and cross-platform mobile solutions for iOS and Android, focusing on intuitive user experience and secure offline-first functionality.",
  },
  {
    title: "Backend & API Engineering",
    category: "Architecture",
    icon: "Server",
    description:
      "Resilient REST and GraphQL APIs, microservices, and serverless backend infrastructure designed for high concurrency and secure data flow.",
  },
  {
    title: "Database Solutions",
    category: "Data",
    icon: "Database",
    description:
      "Relational and distributed database architecture, schema optimization, data migration, and high-availability backup systems.",
  },
  {
    title: "Business Automation",
    category: "Operations",
    icon: "Cpu",
    description:
      "Automated pipeline engineering, ERP integrations, and workflow automation tools to reduce manual overhead and improve organizational velocity.",
  },
  {
    title: "Software Maintenance & Upgrades",
    category: "Support",
    icon: "ShieldCheck",
    description:
      "Proactive codebase maintenance, dependency security updates, performance monitoring, and framework upgrades for continuous uptime.",
  },
  {
    title: "Bug Fixing & Technical Support",
    category: "Support",
    icon: "Wrench",
    description:
      "Rigorous root-cause analysis, emergency patch deployment, and structured SLA-backed technical assistance for mission-critical software.",
  },
  {
    title: "Cloud Deployment & DevOps",
    category: "Cloud",
    icon: "Cloud",
    description:
      "Automated CI/CD pipelines, container orchestration, infrastructure-as-code, and multi-region cloud deployment configurations.",
  },
  {
    title: "Software Modernization",
    category: "Engineering",
    icon: "RefreshCw",
    description:
      "Transform legacy monoliths and technical debt into modular, cloud-ready architectures with zero business disruption.",
  },
];

type Listener = (config: AppConfig) => void;

const listeners: Set<Listener> = new Set();

class ConfigService {
  private config: AppConfig;

  constructor() {
    this.config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));

    // Load shared configuration from Supabase
    this.loadConfigFromSupabase();
  }

  // ============================================================
  // CONFIGURATION
  // ============================================================

  private async loadConfigFromSupabase(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from("site_config")
        .select("config")
        .eq("id", 1)
        .single();

      if (error) {
        console.error(
          "Failed to load configuration from Supabase:",
          error
        );
        return;
      }

      if (!data?.config) {
        console.warn("No configuration found in site_config.");
        return;
      }

      const parsed = data.config as Partial<AppConfig>;

      this.config = {
        ...DEFAULT_CONFIG,
        ...parsed,

        company: {
          ...DEFAULT_CONFIG.company,
          ...(parsed.company || {}),
        },

        founder: {
          ...DEFAULT_CONFIG.founder,
          ...(parsed.founder || {}),
        },

        coFounder: {
          ...DEFAULT_CONFIG.coFounder,
          ...(parsed.coFounder || {}),
        },

        seo: {
          ...DEFAULT_CONFIG.seo,
          ...(parsed.seo || {}),
        },

        services: Array.isArray(parsed.services)
          ? parsed.services
          : [],
      };

      this.notify();
    } catch (error) {
      console.error(
        "Unexpected error loading configuration:",
        error
      );
    }
  }

  private async saveConfig(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("site_config")
        .update({
          config: this.config,

          company_name: this.config.company.name,
          legal_type: this.config.company.legalType,
          tagline: this.config.company.tagline,
          description: this.config.company.description,
          email: this.config.company.email,
          phone: this.config.company.phone,
          address: this.config.company.address,

          updated_at: new Date().toISOString(),
        })
        .eq("id", 1);

      if (error) {
        console.error(
          "Failed to save configuration to Supabase:",
          error
        );
        return false;
      }

      this.notify();

      return true;
    } catch (error) {
      console.error(
        "Unexpected error saving configuration:",
        error
      );

      return false;
    }
  }

  private notify(): void {
    listeners.forEach((listener) => listener(this.config));
  }

  public subscribe(listener: Listener): () => void {
    listeners.add(listener);

    // Immediately provide current config
    listener(this.config);

    return () => {
      listeners.delete(listener);
    };
  }

  public getConfig(): AppConfig {
    return {
      ...this.config,
      company: {
        ...this.config.company,
      },
      founder: {
        ...this.config.founder,
      },
      coFounder: {
        ...this.config.coFounder,
      },
      seo: {
        ...this.config.seo,
      },
      services: [...this.config.services],
    };
  }

  // ============================================================
  // COMPANY
  // ============================================================

  public async updateCompany(
    companyUpdates: Partial<AppConfig["company"]>
  ): Promise<boolean> {
    this.config = {
      ...this.config,

      company: {
        ...this.config.company,
        ...companyUpdates,
      },
    };

    return await this.saveConfig();
  }

  // ============================================================
  // FOUNDER
  // ============================================================

  public async updateFounder(
    founderUpdates: Partial<AppConfig["founder"]>
  ): Promise<boolean> {
    this.config = {
      ...this.config,

      founder: {
        ...this.config.founder,
        ...founderUpdates,
      },
    };

    return await this.saveConfig();
  }

  // ============================================================
  // CO-FOUNDER
  // ============================================================

  public async updateCoFounder(
    coFounderUpdates: Partial<AppConfig["coFounder"]>
  ): Promise<boolean> {
    this.config = {
      ...this.config,

      coFounder: {
        ...this.config.coFounder,
        ...coFounderUpdates,
      },
    };

    return await this.saveConfig();
  }

  // ============================================================
  // SEO
  // ============================================================

  public async updateSeo(
    seoUpdates: Partial<AppConfig["seo"]>
  ): Promise<boolean> {
    this.config = {
      ...this.config,

      seo: {
        ...this.config.seo,
        ...seoUpdates,
      },
    };

    return await this.saveConfig();
  }

  // ============================================================
  // SERVICES
  // ============================================================

  public getServices(): ServiceItem[] {
    return [...this.config.services].sort(
      (a, b) => a.order - b.order
    );
  }

  public async addService(
    service: Omit<ServiceItem, "id" | "order">
  ): Promise<ServiceItem | null> {
    const newService: ServiceItem = {
      ...service,

      id:
        "srv_" +
        Date.now() +
        "_" +
        Math.random()
          .toString(36)
          .substring(2, 7),

      order: this.config.services.length + 1,
    };

    this.config = {
      ...this.config,

      services: [
        ...this.config.services,
        newService,
      ],
    };

    const success = await this.saveConfig();

    if (!success) {
      return null;
    }

    return newService;
  }

  public async updateService(
    id: string,
    updates: Partial<ServiceItem>
  ): Promise<boolean> {
    this.config = {
      ...this.config,

      services: this.config.services.map((service) =>
        service.id === id
          ? {
              ...service,
              ...updates,
            }
          : service
      ),
    };

    return await this.saveConfig();
  }

  public async deleteService(
    id: string
  ): Promise<boolean> {
    this.config = {
      ...this.config,

      services: this.config.services.filter(
        (service) => service.id !== id
      ),
    };

    return await this.saveConfig();
  }

  public async toggleService(
    id: string
  ): Promise<boolean> {
    this.config = {
      ...this.config,

      services: this.config.services.map((service) =>
        service.id === id
          ? {
              ...service,
              enabled: !service.enabled,
            }
          : service
      ),
    };

    return await this.saveConfig();
  }

  public async reorderServices(
    newOrderIds: string[]
  ): Promise<boolean> {
    const serviceMap = new Map(
      this.config.services.map((service) => [
        service.id,
        service,
      ])
    );

    const reordered: ServiceItem[] = [];

    newOrderIds.forEach((id, index) => {
      const service = serviceMap.get(id);

      if (service) {
        reordered.push({
          ...service,
          order: index + 1,
        });
      }
    });

    this.config = {
      ...this.config,
      services: reordered,
    };

    return await this.saveConfig();
  }

  // ============================================================
  // CONTACT MESSAGES
  // ============================================================

  public async getMessages(): Promise<ContactMessage[]> {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(
          "Failed to load messages from Supabase:",
          error
        );

        return [];
      }

      return (data || []).map((row) => ({
        id: String(row.id),
        name: row.name,
        email: row.email,
        phone: row.phone || "",
        company: row.company || "",
        subject: row.subject || "",
        message: row.message,
        read: Boolean(row.is_read),
        createdAt: row.created_at,
      }));
    } catch (error) {
      console.error(
        "Failed to load messages:",
        error
      );

      return [];
    }
  }

  public async addMessage(
    message: Omit<
      ContactMessage,
      "id" | "createdAt" | "read"
    >
  ): Promise<ContactMessage | null> {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .insert({
          name: message.name,
          email: message.email,
          phone: message.phone || "",
          company: message.company || "",
          subject: message.subject || "",
          message: message.message,
          is_read: false,
        })
        .select()
        .single();

      if (error) {
        console.error(
          "Failed to save message to Supabase:",
          error
        );

        return null;
      }

      return {
        id: String(data.id),
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        company: data.company || "",
        subject: data.subject || "",
        message: data.message,
        read: Boolean(data.is_read),
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error(
        "Failed to add message:",
        error
      );

      return null;
    }
  }

  public async markMessageRead(
    id: string,
    read = true
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({
          is_read: read,
        })
        .eq("id", Number(id));

      if (error) {
        console.error(
          "Failed to update message:",
          error
        );
      }
    } catch (error) {
      console.error(
        "Failed to mark message:",
        error
      );
    }
  }

  public async deleteMessage(
    id: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", Number(id));

      if (error) {
        console.error(
          "Failed to delete message:",
          error
        );
      }
    } catch (error) {
      console.error(
        "Failed to delete message:",
        error
      );
    }
  }

  // ============================================================
  // BACKUP & RESTORE
  // ============================================================

  public async resetToDefaults(): Promise<boolean> {
    this.config = JSON.parse(
      JSON.stringify(DEFAULT_CONFIG)
    );

    return await this.saveConfig();
  }

  public exportJson(): string {
    return JSON.stringify(
      this.config,
      null,
      2
    );
  }

  public async importJson(
    jsonStr: string
  ): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonStr);

      if (
        parsed &&
        parsed.company &&
        parsed.founder
      ) {
        this.config = {
          ...DEFAULT_CONFIG,

          ...parsed,

          company: {
            ...DEFAULT_CONFIG.company,
            ...(parsed.company || {}),
          },

          founder: {
            ...DEFAULT_CONFIG.founder,
            ...(parsed.founder || {}),
          },

          coFounder: {
            ...DEFAULT_CONFIG.coFounder,
            ...(parsed.coFounder || {}),
          },

          seo: {
            ...DEFAULT_CONFIG.seo,
            ...(parsed.seo || {}),
          },

          services: Array.isArray(
            parsed.services
          )
            ? parsed.services
            : [],
        };

        return await this.saveConfig();
      }
    } catch (error) {
      console.error(
        "Failed to parse import JSON:",
        error
      );
    }

    return false;
  }

  // ============================================================
  // SUPABASE ADMIN AUTHENTICATION
  // ============================================================

  public async isAuthenticated(): Promise<boolean> {
    try {
      const {
        data,
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error(
          "Failed to get authentication session:",
          error
        );

        return false;
      }

      return !!data.session;
    } catch (error) {
      console.error(
        "Authentication check failed:",
        error
      );

      return false;
    }
  }

  public async login(
    email: string,
    password: string
  ): Promise<boolean> {
    try {
      const {
        data,
        error,
      } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error(
          "Supabase login failed:",
          error.message
        );

        return false;
      }

      return !!data.session;
    } catch (error) {
      console.error(
        "Login failed:",
        error
      );

      return false;
    }
  }

  public async setAdminPassword(
    newPassword: string
  ): Promise<boolean> {
    try {
      const { error } =
        await supabase.auth.updateUser({
          password: newPassword,
        });

      if (error) {
        console.error(
          "Failed to update admin password:",
          error.message
        );

        return false;
      }

      return true;
    } catch (error) {
      console.error(
        "Failed to update admin password:",
        error
      );

      return false;
    }
  }

  public async logout(): Promise<void> {
    try {
      const { error } =
        await supabase.auth.signOut();

      if (error) {
        console.error(
          "Supabase logout failed:",
          error
        );
      }
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  }
}

export const configService =
  new ConfigService();