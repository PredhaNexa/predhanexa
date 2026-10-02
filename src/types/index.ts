export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
}

export interface CompanyConfig {
  name: string;
  legalType: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  address?: string;
  copyright: string;
  logo?: string;
  favicon?: string;
  socialLinks: SocialLinks;
}

export interface FounderProfile {
  name: string;
  designation: string;
  photo?: string;
  biography?: string;
  email: string;
  whatsapp: string;
  phone?: string;
  din?: string; // Director Identification Number (DIN)
  skills: string[];
  professionalInfo?: string;
  socialLinks: SocialLinks;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  image?: string;
  enabled: boolean;
  order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface SeoConfig {
  pageTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  googleSiteVerification?: string;
  googleAnalyticsId?: string;
}

export interface AppConfig {
  company: CompanyConfig;
  founder: FounderProfile;
  coFounder: FounderProfile;
  services: ServiceItem[];
  seo: SeoConfig;
  smtpConfigured?: boolean;
}
