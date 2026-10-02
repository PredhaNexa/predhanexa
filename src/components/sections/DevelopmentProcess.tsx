import React, { useState } from 'react';
import {
  FileText,
  MapPin,
  Palette,
  Code,
  CheckCircle,
  Rocket,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

interface ProcessStep {
  number: string;
  name: string;
  shortDesc: string;
  deliverables: string[];
  focus: string;
  icon: React.ElementType;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    name: 'Requirement',
    shortDesc: 'Deep-dive discovery to formalize functional requirements, technical constraints, and organizational objectives.',
    deliverables: ['Functional Requirement Specification (FRS)', 'System Architecture Roadmap', 'Milestone Schedule'],
    focus: 'Alignment & Scope Definition',
    icon: FileText,
  },
  {
    number: '02',
    name: 'Planning',
    shortDesc: 'Database schema modeling, API contract definition, tech-stack evaluation, and risk mitigation strategies.',
    deliverables: ['Data Entity Models', 'API Protocol Contracts', 'Security & Infrastructure Plan'],
    focus: 'Architectural Blueprinting',
    icon: MapPin,
  },
  {
    number: '03',
    name: 'UI/UX Design',
    shortDesc: 'Wireframing, design system establishment, user journey mapping, and interactive component prototyping.',
    deliverables: ['Design System Tokens', 'Interactive Prototypes', 'Responsive Layout Guidelines'],
    focus: 'User Experience & Ergonomics',
    icon: Palette,
  },
  {
    number: '04',
    name: 'Development',
    shortDesc: 'Modular, clean-code engineering implementing frontend views, backend business logic, and third-party integrations.',
    deliverables: ['Production TypeScript Codebase', 'Modular Service Endpoints', 'Containerized Services'],
    focus: 'Reliable Implementation',
    icon: Code,
  },
  {
    number: '05',
    name: 'Testing',
    shortDesc: 'Comprehensive unit testing, integration verification, security vulnerability scans, and performance load profiling.',
    deliverables: ['Test Coverage Reports', 'Vulnerability Assessment', 'End-to-End Test Suite'],
    focus: 'Rigorous Verification',
    icon: CheckCircle,
  },
  {
    number: '06',
    name: 'Deployment',
    shortDesc: 'Zero-downtime deployment pipelines, cloud provisioning, SSL/TLS configuration, and DNS propagation.',
    deliverables: ['Automated CI/CD Pipeline', 'Production Cloud Hosting', 'Health Monitoring Dashboards'],
    focus: 'Smooth Production Launch',
    icon: Rocket,
  },
  {
    number: '07',
    name: 'Maintenance',
    shortDesc: 'Proactive patch updates, database backups, dependency upgrades, bug remediation, and SLA-backed support.',
    deliverables: ['Scheduled Maintenance Reports', '24/7 Monitoring Alerts', 'Direct Engineering Hotline'],
    focus: 'Sustained Reliability',
    icon: ShieldCheck,
  },
  {
    number: '08',
    name: 'Continuous Improvement',
    shortDesc: 'Performance telemetry analysis, user feedback synthesis, architecture modernization, and feature enhancements.',
    deliverables: ['Quarterly Performance Audits', 'Refactoring Recommendations', 'Feature Expansion Roadmap'],
    focus: 'Ongoing Organizational Value',
    icon: TrendingUp,
  },
];

export const DevelopmentProcess: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const current = PROCESS_STEPS[activeStep];
  const CurrentIcon = current.icon;

  return (
    <section className="py-20 lg:py-28 bg-[#030712] border-b border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <div className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">
            Engineering Methodology
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white text-balance">
            The 8-Stage Development Lifecycle
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            A disciplined, verifiable software delivery lifecycle designed to eliminate uncertainty and ensure long-term software maintainability.
          </p>
        </div>

        {/* Desktop & Tablet Step Track */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 p-1.5 bg-slate-900/60 border border-slate-800 rounded-xl mb-10 overflow-x-auto">
          {PROCESS_STEPS.map((step, idx) => {
            const isSelected = activeStep === idx;
            return (
              <button
                key={step.number}
                onClick={() => setActiveStep(idx)}
                className={`py-3 px-2 rounded-lg text-center transition-all text-xs font-medium cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <div className="text-[10px] font-mono text-slate-500 font-semibold mb-0.5">
                  {step.number}
                </div>
                <div className="truncate font-semibold">{step.name}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Panel */}
        <div className="p-8 sm:p-10 rounded-2xl bg-slate-900/40 border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            {/* Left Column: Stage Info */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
                  <CurrentIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono font-semibold text-cyan-400">
                    STAGE {current.number} OF 08
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                    {current.name}
                  </h3>
                </div>
              </div>

              <p className="text-base text-slate-300 leading-relaxed max-w-xl">
                {current.shortDesc}
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
                <span className="font-semibold text-slate-200">Engineering Objective:</span>
                <span>{current.focus}</span>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer"
                >
                  Previous Stage
                </button>
                <button
                  disabled={activeStep === PROCESS_STEPS.length - 1}
                  onClick={() => setActiveStep((prev) => Math.min(PROCESS_STEPS.length - 1, prev + 1))}
                  className="px-4 py-2 text-xs font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer"
                >
                  Next Stage
                </button>
              </div>
            </div>

            {/* Right Column: Key Deliverables & Verifications */}
            <div className="lg:col-span-5 p-6 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-4">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Stage Deliverables & Verification
              </div>
              <ul className="space-y-3">
                {current.deliverables.map((item, dIdx) => (
                  <li key={dIdx} className="flex items-start gap-3 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
                Code review gates and continuous integration tests must pass before phase transition.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
