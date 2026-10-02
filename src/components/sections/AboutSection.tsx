import React from 'react';
import { Layers, Terminal, LifeBuoy, CloudCheck, CheckCircle2 } from 'lucide-react';
import { CompanyConfig } from '../../types';

interface AboutSectionProps {
  company: CompanyConfig;
  onExploreMore?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ company, onExploreMore }) => {
  const capabilities = [
    {
      title: 'Full-Lifecycle Software Development',
      desc: 'Architecting custom software, responsive web applications, and mobile solutions engineered for security, reliability, and scale.',
      icon: Layers,
    },
    {
      title: 'Ongoing Maintenance & Support',
      desc: 'Systematic bug fixing, scheduled framework upgrades, vulnerability patching, and structured technical support to guarantee uptime.',
      icon: LifeBuoy,
    },
    {
      title: 'Backend, API & Database Systems',
      desc: 'Engineering resilient APIs, optimized relational databases, and microservices built to withstand organizational data demands.',
      icon: Terminal,
    },
    {
      title: 'Cloud Deployment & Modernization',
      desc: 'Automating continuous deployment pipelines and modernizing legacy applications into secure, cloud-native digital infrastructure.',
      icon: CloudCheck,
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-[#030712] border-b border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <div className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">
            About {company.name}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white text-balance">
            Software Built to Scale. Supported to Endure.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed pt-2">
            {company.description}
          </p>
        </div>

        {/* 4 Architectural Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {capabilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-cyan-950/50 border border-cyan-800/40 text-cyan-400 group-hover:text-cyan-300 transition-colors shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Operational Commitment Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-xl bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-base font-semibold text-white">
              Institutional Quality & Strict Confidentiality
            </h4>
            <p className="text-xs sm:text-sm text-slate-400">
              Every project is protected under comprehensive Non-Disclosure Agreements, transparent source-code ownership, and documented engineering milestones.
            </p>
          </div>
          {onExploreMore && (
            <button
              onClick={onExploreMore}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Learn More About Our Team
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
