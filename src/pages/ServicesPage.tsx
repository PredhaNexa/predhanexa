import React, { useState } from 'react';
import { AppConfig, ServiceItem } from '../types';
import { SeoHead } from '../components/seo/SeoHead';
import { ServiceDetailModal } from '../components/modals/ServiceDetailModal';
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
  Search,
} from 'lucide-react';

interface ServicesPageProps {
  config: AppConfig;
  onNavigate: (path: string) => void;
  onSelectServiceForInquiry: (serviceTitle: string) => void;
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

export const ServicesPage: React.FC<ServicesPageProps> = ({
  config,
  onNavigate,
  onSelectServiceForInquiry,
}) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const activeServices = config.services.filter((s) => s.enabled);

  const categories = ['All', ...Array.from(new Set(activeServices.map((s) => s.category).filter(Boolean)))];

  const filteredServices = activeServices.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <SeoHead
        seo={config.seo}
        company={config.company}
        pageTitle="Software Development & Technical Services"
        pageDescription="Comprehensive software engineering, application modernization, database architecture, and technical support services by Predhanexa Private Limited."
      />

      <div className="py-16 sm:py-24 bg-[#030712] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <div className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">
              Solutions & Technical Scope
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display text-white text-balance">
              Services & Technical Solutions
            </h1>
            <p className="text-base sm:text-lg text-slate-300">
              End-to-end software application lifecycle services tailored for modern enterprises, startups, and operational systems.
            </p>
          </div>

          {/* Filtering & Search Controls (if services exist) */}
          {activeServices.length > 0 && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              {/* Category Segmented Control */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>
          )}

          {/* Empty State */}
          {activeServices.length === 0 ? (
            <div className="p-12 sm:p-16 rounded-2xl bg-slate-900/40 border border-slate-800 text-center max-w-3xl mx-auto space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-cyan-400">
                <Layers className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white font-display">
                  Service Catalog Currently in Configuration
                </h3>
                <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                  The administrator has not yet populated active public services in this catalog. Predhanexa Private Limited designs, develops, deploys, and maintains software applications and digital solutions.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('/admin')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configure Services in Admin</span>
                </button>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Inquire Directly</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Services Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredServices.map((service) => {
                const Icon = getServiceIcon(service.icon);
                return (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className="p-7 sm:p-8 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all flex flex-col justify-between group cursor-pointer shadow-lg"
                  >
                    <div className="space-y-4">
                      {service.image && (
                        <div className="w-full h-40 rounded-xl overflow-hidden mb-2 bg-slate-950 border border-slate-800">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-cyan-400 group-hover:text-cyan-300 group-hover:border-cyan-500/40 transition-colors">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          {service.category || 'Engineering'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white font-display tracking-tight group-hover:text-cyan-300 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs font-semibold text-cyan-400 group-hover:underline">
                        View Detailed Scope
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onInquire={(title) => {
            onSelectServiceForInquiry(title);
            onNavigate('/contact');
          }}
        />
      )}
    </>
  );
};
