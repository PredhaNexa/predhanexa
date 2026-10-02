import React from 'react';
import { AppConfig } from '../types';
import { SeoHead } from '../components/seo/SeoHead';

interface TermsPageProps {
  config: AppConfig;
}

export const TermsPage: React.FC<TermsPageProps> = ({ config }) => {
  const { company } = config;

  return (
    <>
      <SeoHead
        seo={config.seo}
        company={company}
        pageTitle="Terms of Service & SLAs"
        pageDescription={`Terms of service, engineering deliverables, intellectual property transfer, and software maintenance commitments of ${company.name}.`}
      />

      <div className="py-16 sm:py-24 bg-[#030712] min-h-screen text-slate-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2 border-b border-slate-800 pb-6">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Commercial Terms
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white font-display">
              Terms of Service & Engineering SLAs
            </h1>
            <p className="text-xs text-slate-500">
              Effective: September 2026 · {company.name}
            </p>
          </div>

          <div className="space-y-6 text-sm leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-white font-display">1. Engagement Framework</h2>
              <p>
                All software design, web application development, mobile application programming, custom automation, API creation, database services, and technical support conducted by {company.name} are governed by project-specific Statements of Work (SOW) and Master Service Agreements (MSA).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-white font-display">2. Intellectual Property Transfer</h2>
              <p>
                Unless explicitly agreed otherwise in a client-specific agreement, all custom source code, documentation, and digital assets produced specifically for the client become the exclusive property of the client upon receipt of full contracted payment.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-white font-display">3. Maintenance & Warranty</h2>
              <p>
                Deliverables are backed by standard warranty windows covering defect resolution and bug fixing for identified scope deviations. Extended maintenance, infrastructure upgrades, and SLA guarantees are provided under active support subscriptions.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-white font-display">4. Governing Law</h2>
              <p>
                These terms and all commercial agreements are construed and enforced under the applicable laws governing registered Private Limited companies in India.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};
