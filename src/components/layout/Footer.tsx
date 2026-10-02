import React from 'react';
import { Mail, Phone, MessageSquare, ArrowUpRight, ShieldCheck, Lock } from 'lucide-react';
import { AppConfig } from '../../types';

interface FooterProps {
  config: AppConfig;
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onNavigate }) => {
  const { company, founder } = config;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#02050e] border-t border-slate-800/80 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: Company Profile */}
          <div className="space-y-4">
            <button
              onClick={() => onNavigate('/')}
              className="text-left font-display text-xl font-bold tracking-tight text-white hover:text-cyan-400 transition-colors focus:outline-none"
            >
              {company.name}
            </button>
            <p className="text-xs text-cyan-400/90 font-medium tracking-wide uppercase">
              {company.legalType}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {company.description}
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider block">
              Navigation
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-white transition-colors focus:outline-none"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-white transition-colors focus:outline-none"
                >
                  About Organization
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services')}
                  className="hover:text-white transition-colors focus:outline-none"
                >
                  Services & Solutions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/team')}
                  className="hover:text-white transition-colors focus:outline-none"
                >
                  Leadership & Team
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-white transition-colors focus:outline-none"
                >
                  Contact & Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Configured Direct Contact */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider block">
              Contact Channels
            </span>
            <ul className="space-y-2.5 text-xs">
              {company.email && (
                <li>
                  <a
                    href={`mailto:${company.email}`}
                    className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{company.email}</span>
                  </a>
                </li>
              )}
              {company.phone && (
                <li>
                  <a
                    href={`tel:${company.phone}`}
                    className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>+91 {company.phone}</span>
                  </a>
                </li>
              )}
              {founder.whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/91${founder.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>Founder WhatsApp (+91 {founder.whatsapp})</span>
                  </a>
                </li>
              )}
              {founder.email && founder.email !== company.email && (
                <li>
                  <a
                    href={`mailto:${founder.email}`}
                    className="flex items-center gap-2 hover:text-cyan-400 transition-colors text-slate-400"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>Founder: {founder.email}</span>
                  </a>
                </li>
              )}
              {company.address && (
                <li className="text-slate-400 text-xs pt-1 border-t border-slate-800/60">
                  {company.address}
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Legal & Governance */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider block">
              Legal & Compliance
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('/privacy-policy')}
                  className="hover:text-white transition-colors focus:outline-none"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/terms')}
                  className="hover:text-white transition-colors focus:outline-none"
                >
                  Terms of Service & SLAs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin')}
                  className="inline-flex items-center gap-1.5 text-slate-500 hover:text-cyan-400 transition-colors focus:outline-none mt-2"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Console</span>
                </button>
              </li>
            </ul>

            {/* Social links (only render if configured by administrator) */}
            {(company.socialLinks.linkedin || company.socialLinks.github || company.socialLinks.twitter) && (
              <div className="pt-2 flex items-center gap-3">
                {company.socialLinks.linkedin && (
                  <a
                    href={company.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    LinkedIn
                  </a>
                )}
                {company.socialLinks.github && (
                  <a
                    href={company.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                )}
                {company.socialLinks.twitter && (
                  <a
                    href={company.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Twitter / X
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            {company.copyright || `© ${currentYear} ${company.name}. All rights reserved.`}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-600">Enterprise Standards</span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-600">Confidentiality Assured</span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-600">SLA Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
