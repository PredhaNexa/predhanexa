import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { AppConfig } from '../../types';
import { configService } from '../../services/configService';

interface ContactSectionProps {
  config: AppConfig;
  initialSubject?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ config, initialSubject = '' }) => {
  const { company, founder } = config;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: initialSubject || '',
    message: '',
    honeypot: '', // anti-bot spam trap
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client validation
    if (!formData.name.trim()) {
      setStatus('error');
      setErrorMessage('Please provide your name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setStatus('error');
      setErrorMessage('Please provide a valid corporate or personal email address.');
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 5) {
      setStatus('error');
      setErrorMessage('Please provide a descriptive message regarding your software inquiry.');
      return;
    }

    // Honeypot spam check
    if (formData.honeypot) {
      setStatus('success');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      // 1. Dispatch to serverless / API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // Always save locally in admin database so directors can review inquiry immediately
      configService.addMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        subject: formData.subject.trim() || 'Software Development Inquiry',
        message: formData.message.trim(),
      });

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        honeypot: '',
      });
    } catch {
      // Even if network route to external server is unavailable in sandbox, save in message store
      configService.addMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        subject: formData.subject.trim() || 'Software Development Inquiry',
        message: formData.message.trim(),
      });

      setStatus('success');
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#030712] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Communication Channels */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">
                Initiate Project Discussion
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white text-balance">
                Connect with Our Technical Leadership
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                Whether you need greenfield application development, dedicated software maintenance, or architectural modernization, our leadership team is directly reachable.
              </p>
            </div>

            {/* Direct Channel Buttons as requested */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Direct Channels
              </span>

              {/* Founder WhatsApp */}
              {founder.whatsapp && (
                <a
                  href={`https://wa.me/91${founder.whatsapp}?text=${encodeURIComponent(
                    'Hello Predhanexa team, I would like to inquire about software development services.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 hover:border-emerald-500/60 transition-colors text-white group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-lg bg-emerald-900/60 text-emerald-400">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-emerald-400 font-medium">Founder WhatsApp</div>
                      <div className="text-sm font-semibold text-slate-100 font-mono">
                        +91 {founder.whatsapp}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              )}

              {/* Company Mobile Call */}
              {company.phone && (
                <a
                  href={`tel:${company.phone}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors text-white group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-lg bg-slate-800 text-cyan-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Company Direct Line</div>
                      <div className="text-sm font-semibold text-slate-100 font-mono">
                        +91 {company.phone}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              )}

              {/* Company Email */}
              {company.email && (
                <a
                  href={`mailto:${company.email}?subject=Software%20Development%20Inquiry`}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors text-white group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-lg bg-slate-800 text-cyan-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Company Inquiries</div>
                      <div className="text-sm font-semibold text-slate-100 font-mono">
                        {company.email}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              )}

              {/* Founder Email */}
              {founder.email && founder.email !== company.email && (
                <a
                  href={`mailto:${founder.email}?subject=Executive%20Software%20Inquiry`}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors text-white group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-lg bg-slate-800 text-cyan-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Founder Executive Email</div>
                      <div className="text-sm font-semibold text-slate-100 font-mono">
                        {founder.email}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/80 flex items-center gap-3 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Standard response window: Within 24 business hours.</span>
            </div>
          </div>

          {/* Right Column: Structured Project Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-slate-900/50 border border-slate-800/90 shadow-2xl relative">
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display mb-2">
                Send Project Specification
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                All client conversations and project details are held strictly under mutual non-disclosure.
              </p>

              {status === 'success' ? (
                <div className="p-8 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-center space-y-4 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white font-display">
                    Inquiry Received Successfully
                  </h4>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    Thank you for contacting Predhanexa Private Limited. Our engineering directors will evaluate your requirements and contact you via email or phone.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="px-5 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Spam honeypot */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="hp_field">Do not fill this</label>
                    <input
                      id="hp_field"
                      type="text"
                      name="honeypot"
                      value={formData.honeypot}
                      onChange={handleChange}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300" htmlFor="name">
                        Full Name <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300" htmlFor="email">
                        Work / Personal Email <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. name@organization.com"
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300" htmlFor="phone">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +91 9876543210"
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300" htmlFor="company">
                        Company / Organization
                      </label>
                      <input
                        id="company"
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. Acme Tech Corp"
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300" htmlFor="subject">
                      Subject / Service Area
                    </label>
                    <input
                      id="subject"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Custom Web App & Backend Engineering"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300" htmlFor="message">
                      Project Details / Technical Requirements <span className="text-cyan-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe your software objectives, current architecture, timeline, or support needs..."
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all resize-y"
                    />
                  </div>

                  {status === 'error' && (
                    <div className="p-3 rounded-lg bg-red-950/40 border border-red-700/50 flex items-center gap-2.5 text-xs text-red-300">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 rounded-lg transition-colors shadow-lg shadow-cyan-950/40 cursor-pointer"
                  >
                    {status === 'submitting' ? (
                      <span>Transmitting Inquiry...</span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
