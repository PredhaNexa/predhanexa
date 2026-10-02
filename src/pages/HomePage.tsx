import React, { useState } from 'react';
import { AppConfig, ServiceItem } from '../types';
import { HeroSection } from '../components/sections/HeroSection';
import { AboutSection } from '../components/sections/AboutSection';
import { ServicesSection } from '../components/sections/ServicesSection';
import { DevelopmentProcess } from '../components/sections/DevelopmentProcess';
import { FoundersSection } from '../components/sections/FoundersSection';
import { ContactSection } from '../components/sections/ContactSection';
import { ServiceDetailModal } from '../components/modals/ServiceDetailModal';
import { SeoHead } from '../components/seo/SeoHead';

interface HomePageProps {
  config: AppConfig;
  onNavigate: (path: string) => void;
  onReplayIntro: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ config, onNavigate, onReplayIntro }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [initialContactSubject, setInitialContactSubject] = useState<string>('');

  const handleExploreServices = () => {
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('/services');
    }
  };

  const handleContactClick = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('/contact');
    }
  };

  const handleSelectServiceForInquiry = (serviceTitle: string) => {
    setInitialContactSubject(`Inquiry: ${serviceTitle}`);
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <SeoHead seo={config.seo} company={config.company} />

      {/* Main Homepage Flow */}
      <main className="w-full">
        {/* Hero Section with Interactive 3D Canvas */}
        <HeroSection
          company={config.company}
          onExploreServices={handleExploreServices}
          onContact={handleContactClick}
          onReplayIntro={onReplayIntro}
        />

        {/* About Company */}
        <AboutSection
          company={config.company}
          onExploreMore={() => onNavigate('/about')}
        />

        {/* Dynamic Services Section */}
        <ServicesSection
          services={config.services}
          onSelectServiceForInquiry={handleSelectServiceForInquiry}
          onNavigateToAdmin={() => onNavigate('/admin')}
        />

        {/* 8-Stage Development Lifecycle */}
        <DevelopmentProcess />

        {/* 3D Founder & Leadership Section */}
        <FoundersSection
          founder={config.founder}
          coFounder={config.coFounder}
          onNavigateToAdmin={() => onNavigate('/admin')}
        />

        {/* Contact Section */}
        <ContactSection
          config={config}
          initialSubject={initialContactSubject}
        />
      </main>

      {/* Service Detail Modal */}
      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onInquire={handleSelectServiceForInquiry}
        />
      )}
    </>
  );
};
