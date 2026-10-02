import React from 'react';
import {
  Code2,
  Globe,
  Smartphone,
  Server,
  Database,
  Cpu,
  ShieldCheck,
  Wrench,
  Cloud,
  RefreshCw,
  Layers,
  ArrowUpRight,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { ServiceItem } from '../../types';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectServiceForInquiry?: (serviceTitle: string) => void;
  onNavigateToAdmin?: () => void;
}

// Icon mapping helper
const getServiceIcon = (iconName: string) => {
  switch (iconName?.toLowerCase()) {
    case 'code2':
    case 'code':
      return Code2;
    case 'globe':
    case 'web':
      return Globe;
    case 'smartphone':
    case 'mobile':
      return Smartphone;
    case 'server':
    case 'backend':
      return Server;
    case 'database':
    case 'data':
      return Database;
    case 'cpu':
    case 'automation':
      return Cpu;
    case 'shieldcheck':
    case 'security':
      return ShieldCheck;
    case 'wrench':
    case 'support':
      return Wrench;
    case 'cloud':
    case 'devops':
      return Cloud;
    case 'refreshcw':
    case 'modernization':
      return RefreshCw;
    default:
      return Layers;
  }
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectServiceForInquiry,
  onNavigateToAdmin,
}) => {
  const activeServices = services.filter((s) => s.enabled);

  return (
    <section id="services" className="py-20 lg:py-28 bg-[#02050e] border-b border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl space-y-4">
            <div className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">
              Engineering Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white text-balance">
              Services & Technical Solutions
            </h2>
            <p className="text-base text-slate-300">
              From greenfield software architecture to ongoing technical maintenance and upgrades.
            </p>
          </div>

          {activeServices.length > 0 && onSelectServiceForInquiry && (
            <button
              onClick={() => onSelectServiceForInquiry('Custom Software Consultation')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap self-start md:self-auto cursor-pointer"
            >
              <span>Request Custom Scope</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Empty State when no services have been configured yet by the administrator */}
        {activeServices.length === 0 ? (
          <div className="p-10 sm:p-14 rounded-2xl bg-slate-900/30 border border-slate-800 text-center max-w-3xl mx-auto space-y-5">
            <div className="w-14 h-14 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mx-auto text-cyan-400">
              <Layers className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white font-display">
                Service Catalog Awaiting Administrator Configuration
              </h3>
              <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
                Predhanexa Private Limited designs, develops, deploys, and maintains software applications and digital solutions. In accordance with governance standards, services will appear here once finalized by company administration.
              </p>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              {onNavigateToAdmin && (
                <button
                  onClick={onNavigateToAdmin}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configure Services in Admin</span>
                </button>
              )}

              {onSelectServiceForInquiry && (
                <button
                  onClick={() => onSelectServiceForInquiry('General Software Engineering Inquiry')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Submit Custom Project Inquiry</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Active Services Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {activeServices.map((service, idx) => {
              const Icon = getServiceIcon(service.icon);
              return (
                <div
                  key={service.id || idx}
                  className="p-6 sm:p-8 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-cyan-400 group-hover:text-cyan-300 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-slate-500 font-medium tracking-wide">
                        {service.category || 'Engineering'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white tracking-tight">
                        {service.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {onSelectServiceForInquiry && (
                    <div className="pt-6 mt-6 border-t border-slate-800/80">
                      <button
                        onClick={() => onSelectServiceForInquiry(service.title)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group-hover:translate-x-1 duration-200 cursor-pointer"
                      >
                        <span>Inquire About This Service</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
