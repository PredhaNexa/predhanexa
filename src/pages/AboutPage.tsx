import React from 'react';
import { AppConfig } from '../types';
import { SeoHead } from '../components/seo/SeoHead';
import { ShieldCheck, Cpu, Code2, Server, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  config: AppConfig;
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ config, onNavigate }) => {
  const { company } = config;

  return (
    <>
      <SeoHead
        seo={config.seo}
        company={company}
        pageTitle="About Organization"
        pageDescription={`${company.name} is a ${company.legalType} specializing in software development, web & mobile applications, custom solutions, and ongoing technical maintenance.`}
      />

      <div className="py-16 sm:py-24 bg-[#030712] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <div className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">
              Company Overview
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display text-white text-balance">
              About {company.name}
            </h1>
            <p className="text-sm font-semibold text-cyan-400/90 uppercase tracking-wide">
              {company.legalType}
            </p>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed pt-2">
              {company.description}
            </p>
          </div>

          {/* Core Institutional Principles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                Engineered for Maintainability
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                We believe that software should be written with modularity and clean architectural discipline so that client codebases can be extended, inspected, and maintained over years without compounding technical debt.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                Confidentiality & IP Integrity
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                As a registered Private Limited company, all client engagements operate under strict non-disclosure obligations. Full intellectual property, git repositories, and deployment configurations belong 100% to our clients.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                Long-Term Technical Support
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Software deployment is merely step one. We provide proactive bug fixing, operating system and framework upgrades, and continuous technical support to maintain steady operational uptime.
              </p>
            </div>
          </div>

          {/* Scope of Practice */}
          <div className="p-8 sm:p-12 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-6">
            <h2 className="text-2xl font-bold text-white font-display">
              Primary Scope of Operations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="font-semibold text-white mb-1">Custom Development</div>
                <p className="text-slate-400">Web applications, mobile apps, and dedicated enterprise tools.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="font-semibold text-white mb-1">Backend & API</div>
                <p className="text-slate-400">Microservices, database modeling, and secure third-party integrations.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="font-semibold text-white mb-1">Maintenance & Bug Fixing</div>
                <p className="text-slate-400">Scheduled patch releases, security audits, and urgent defect resolution.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="font-semibold text-white mb-1">Cloud Deployment</div>
                <p className="text-slate-400">DevOps pipelines, serverless deployment, and containerization.</p>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="flex flex-wrap items-center justify-between gap-6 p-8 rounded-2xl bg-cyan-950/20 border border-cyan-800/40">
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Have a software requirement to discuss?
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Reach out directly to our leadership team for a confidential engineering consultation.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/contact')}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer"
            >
              <span>Contact Our Leadership</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
