import React from 'react';
import { X, ArrowRight, ShieldCheck, Check, Layers, Code2, Globe, Smartphone, Server, Database, Cpu, Wrench, Cloud, RefreshCw } from 'lucide-react';
import { ServiceItem } from '../../types';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onInquire: (serviceTitle: string) => void;
}

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

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onInquire,
}) => {
  if (!service) return null;

  const Icon = getServiceIcon(service.icon);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
    >
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6 relative z-10">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 shrink-0">
              <Icon className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">
                {service.category || 'Software Solution'}
              </span>
              <h3 id="service-modal-title" className="text-2xl font-bold text-white font-display">
                {service.title}
              </h3>
            </div>
          </div>

          {/* Service Image if uploaded by administrator */}
          {service.image && (
            <div className="w-full h-48 sm:h-56 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Scope of Engineering
            </h4>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Standard SLA & Quality Guarantee */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Predhanexa Service Standards</span>
            </div>
            <ul className="space-y-1.5 pl-6 list-disc">
              <li>Comprehensive source-code documentation and IP transfer</li>
              <li>Unit and integration test suites accompanying deliverables</li>
              <li>Structured technical handover and dedicated maintenance window</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onInquire(service.title);
                onClose();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer"
            >
              <span>Inquire About This Service</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
