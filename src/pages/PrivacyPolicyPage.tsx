import React from 'react';
import { AppConfig } from '../types';
import { SeoHead } from '../components/seo/SeoHead';

interface PrivacyPolicyPageProps {
  config: AppConfig;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ config }) => {
  const { company } = config;

  return (
    <>
      <SeoHead
        seo={config.seo}
        company={company}
        pageTitle="Privacy Policy"
        pageDescription={`Official Privacy Policy of ${company.name}, outlining data protection, NDA protocols, and proprietary code confidentiality.`}
      />

      <div className="py-16 sm:py-24 bg-[#030712] min-h-screen text-slate-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2 border-b border-slate-800 pb-6">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Legal & Compliance
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white font-display">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-500">
              Last updated: September 2026 · {company.name}
            </p>
          </div>

          <div className="space-y-6 text-sm leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-white font-display">1. Information Collection & Usage</h2>
              <p>
                {company.name} collects only the technical and corporate information necessary to evaluate project specifications, deliver contracted software development services, and provide ongoing technical support. We do not sell, rent, or monetize client or prospect data.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-white font-display">2. Proprietary Code & Non-Disclosure (NDA)</h2>
              <p>
                All source code, technical specifications, database schemas, and intellectual property developed for clients or shared with us during project discovery are treated under strict confidentiality. Code repositories are maintained on secure, access-controlled infrastructure.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-white font-display">3. Communications & Inquiries</h2>
              <p>
                Information submitted through our contact forms or direct messaging channels (including email to <span className="text-cyan-400 font-mono">{company.email}</span> and WhatsApp inquiries) is utilized solely for customer communication, technical scope formulation, and support dispatch.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-white font-display">4. Data Retention & Security Controls</h2>
              <p>
                We employ industry-standard encryption, SSL/TLS protocols, and secure administrative controls to protect information from unauthorized access, modification, or disclosure.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-white font-display">5. Contact Information</h2>
              <p>
                For questions regarding this policy, contact our compliance officers at:
                <br />
                <span className="font-semibold text-white">{company.name}</span>
                <br />
                Email: <a href={`mailto:${company.email}`} className="text-cyan-400 hover:underline">{company.email}</a>
                <br />
                Direct Telephone: <a href={`tel:${company.phone}`} className="text-cyan-400 hover:underline">+91 {company.phone}</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};
