import React from 'react';
import { AppConfig } from '../types';
import { SeoHead } from '../components/seo/SeoHead';
import { FoundersSection } from '../components/sections/FoundersSection';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface TeamPageProps {
  config: AppConfig;
  onNavigate: (path: string) => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({ config, onNavigate }) => {
  return (
    <>
      <SeoHead
        seo={config.seo}
        company={config.company}
        pageTitle="Executive Leadership & Founders"
        pageDescription={`Meet the corporate leadership of ${config.company.name}. Founder N. Dhanush Kumar and Co-Founder N. Prudhvi Vilas.`}
      />

      <div className="py-16 sm:py-24 bg-[#030712] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <div className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">
              Corporate Governance
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display text-white text-balance">
              Leadership & Board
            </h1>
            <p className="text-base sm:text-lg text-slate-300">
              Guiding Predhanexa Private Limited with high engineering standards, operational transparency, and dedication to software reliability.
            </p>
          </div>

          {/* Interactive 3D Cards */}
          <FoundersSection
            founder={config.founder}
            coFounder={config.coFounder}
            onNavigateToAdmin={() => onNavigate('/admin')}
          />

          {/* Governance Notice */}
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3 max-w-4xl mx-auto">
            <div className="flex items-center gap-2.5 text-white font-semibold text-sm">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Institutional Governance & Direct Communication</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              As a Private Limited entity, our executive leadership takes direct fiduciary and engineering responsibility for client software deliverables. You can reach out directly via official email and verified WhatsApp channels for strategic software initiatives.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
