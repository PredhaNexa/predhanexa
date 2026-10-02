import React, { useEffect, useState } from 'react';
import { ArrowRight, Play, ShieldCheck, Phone, Mail } from 'lucide-react';
import { CompanyConfig } from '../../types';
import { Hero3DCanvas } from '../three/Hero3DCanvas';

interface HeroSectionProps {
  company: CompanyConfig;
  onExploreServices: () => void;
  onContact: () => void;
  onReplayIntro: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  company,
  onExploreServices,
  onContact,
  onReplayIntro,
}) => {
  const [introVisible, setIntroVisible] = useState(false);

  useEffect(() => {
    // Trigger the entrance after the HeroSection mounts.
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIntroVisible(true));
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden border-b border-slate-800/80 bg-[#02040a]">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-20 left-10 w-[400px] h-[300px] bg-violet-600/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Cybernetic grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d408_1px,transparent_1px),linear-gradient(to_bottom,#06b6d408_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_45%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* LEFT: PredhaNexa cinematic entrance */}
          <div
            className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left"
            style={{
              opacity: introVisible ? 1 : 0,
              transform: introVisible ? 'translateX(0)' : 'translateX(-90px)',
              transition: 'opacity 900ms ease-out, transform 1100ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono text-cyan-300"
              style={{
                opacity: introVisible ? 1 : 0,
                transform: introVisible ? 'translateY(0)' : 'translateY(18px)',
                transition: 'opacity 650ms ease-out 150ms, transform 650ms ease-out 150ms',
              }}
            >
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>{company.legalType}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">Enterprise Solutions</span>
            </div>

            <div className="space-y-3">
              <h1
                className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-display text-white text-balance leading-[1.08]"
                style={{
                  opacity: introVisible ? 1 : 0,
                  transform: introVisible ? 'translateX(0)' : 'translateX(-70px)',
                  transition: 'opacity 800ms ease-out 250ms, transform 1000ms cubic-bezier(0.16, 1, 0.3, 1) 250ms',
                }}
              >
                {company.name}
              </h1>

              <p
                className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-200 font-display"
                style={{
                  opacity: introVisible ? 1 : 0,
                  transform: introVisible ? 'translateY(0)' : 'translateY(35px)',
                  transition: 'opacity 800ms ease-out 550ms, transform 850ms ease-out 550ms',
                }}
              >
                {company.tagline || 'Building Software. Supporting Growth.'}
              </p>
            </div>

            <p
              className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal"
              style={{
                opacity: introVisible ? 1 : 0,
                transform: introVisible ? 'translateY(0)' : 'translateY(25px)',
                transition: 'opacity 800ms ease-out 750ms, transform 800ms ease-out 750ms',
              }}
            >
              {company.description ||
                'We design, develop and maintain reliable software solutions for businesses and organizations.'}
            </p>

            <div
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2"
              style={{
                opacity: introVisible ? 1 : 0,
                transform: introVisible ? 'translateY(0)' : 'translateY(25px)',
                transition: 'opacity 700ms ease-out 900ms, transform 700ms ease-out 900ms',
              }}
            >
              <button
                onClick={onExploreServices}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all whitespace-nowrap shadow-lg shadow-cyan-950/40 hover:shadow-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onContact}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-slate-500 cursor-pointer"
              >
                <span>Contact Leadership</span>
              </button>

              <button
                onClick={onReplayIntro}
                className="inline-flex items-center gap-2 px-4 py-3 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                title="Replay cinematic 3D entrance animation"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Replay 3D Intro</span>
              </button>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-mono text-slate-400">
              {company.phone && (
                <a href={`tel:${company.phone}`} className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>+91 {company.phone}</span>
                </a>
              )}
              {company.email && (
                <a href={`mailto:${company.email}`} className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{company.email}</span>
                </a>
              )}
            </div>

            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Production-Grade Architecture</span>
              </span>
              <span className="text-slate-700">/</span>
              <span>Full Lifecycle Maintenance</span>
              <span className="text-slate-700">/</span>
              <span>Cloud & API Integration</span>
            </div>
          </div>

          {/* RIGHT: Orbital 3D entrance */}
          <div
            className="lg:col-span-5 relative flex items-center justify-center"
            style={{
              opacity: introVisible ? 1 : 0,
              transform: introVisible
                ? 'translateX(0) scale(1)'
                : 'translateX(90px) scale(0.72)',
              transition: 'opacity 1200ms ease-out 300ms, transform 1400ms cubic-bezier(0.16, 1, 0.3, 1) 300ms',
            }}
          >
            <div className="w-full relative">
              <Hero3DCanvas />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
