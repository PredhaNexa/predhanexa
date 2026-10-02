import React from 'react';
import { AppConfig } from '../types';
import { SeoHead } from '../components/seo/SeoHead';
import { ContactSection } from '../components/sections/ContactSection';

interface ContactPageProps {
  config: AppConfig;
}

export const ContactPage: React.FC<ContactPageProps> = ({ config }) => {
  return (
    <>
      <SeoHead
        seo={config.seo}
        company={config.company}
        pageTitle="Contact & Technical Inquiries"
        pageDescription={`Contact Predhanexa Private Limited. Company email: ${config.company.email}, Phone: ${config.company.phone}, Founder WhatsApp: ${config.founder.whatsapp}.`}
      />

      <div className="py-12 bg-[#030712] min-h-screen">
        <ContactSection config={config} />
      </div>
    </>
  );
};
