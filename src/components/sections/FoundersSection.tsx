import React, { useState } from 'react';
import {
  MessageSquare,
  Mail,
  Phone,
  FileCheck2,
  ExternalLink,
  Shield,
  User,
  Settings,
  Sparkles,
  Award,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { FounderProfile } from '../../types';

interface FoundersSectionProps {
  founder: FounderProfile;
  coFounder: FounderProfile;
  onNavigateToAdmin?: () => void;
}

interface ProfileCardProps {
  profile: FounderProfile;
  isPrimary?: boolean;
  onNavigateToAdmin?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, isPrimary = false, onNavigateToAdmin }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left;
    const y = e.clientY - card.top;
    const centerX = card.width / 2;
    const centerY = card.height / 2;

    setRotate({
      x: -((y - centerY) / card.height) * 12,
      y: ((x - centerX) / card.width) * 12,
    });

    setLightPos({
      x: (x / card.width) * 100,
      y: (y / card.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const initials = profile.name
    .split(' ')
    .filter((n) => n.length > 0)
    .map((n) => n[0])
    .join('')
    .substring(0, 3)
    .toUpperCase();

  const hasConfiguredContact = profile.whatsapp || profile.email || profile.phone;
  const isDinValid =
    profile.din &&
    profile.din.trim() !== '' &&
    profile.din.trim().toLowerCase() !== 'not configured' &&
    profile.din.trim().toLowerCase() !== 'not provided';

  return (
    <div
      style={{ perspective: 1200 }}
      className="w-full flex justify-center select-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsTapped(!isTapped)}
    >
      <div
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) ${
            isHovered || isTapped ? 'translateZ(18px)' : 'translateZ(0px)'
          }`,
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`w-full max-w-lg rounded-2xl p-7 sm:p-9 bg-slate-900/80 border ${
          isPrimary
            ? 'border-cyan-500/40 shadow-2xl shadow-cyan-950/30'
            : 'border-slate-800 shadow-xl'
        } transition-shadow duration-300 relative overflow-hidden backdrop-blur-xl cursor-pointer`}
      >
        {/* Dynamic 3D Cursor Spotlight */}
        <div
          style={{
            background: `radial-gradient(circle 320px at ${lightPos.x}% ${lightPos.y}%, rgba(6, 182, 212, 0.16), transparent 70%)`,
          }}
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        />

        {/* Top Accent Gradient Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

        <div className="relative z-10 space-y-6">
          {/* Top Profile Header */}
          <div className="flex items-start gap-5">
            {/* Avatar Photo Slot or Official Monogram Seal */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700/80 flex items-center justify-center shrink-0 shadow-inner group-hover:border-cyan-400 transition-colors">
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-2">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center mb-1 shadow-md shadow-cyan-950/50">
                    <span className="font-display font-extrabold text-lg text-cyan-300 tracking-wider">
                      {initials}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono tracking-tight">
                    Official Monogram
                  </span>
                </div>
              )}

              {/* Verified badge icon */}
              <div className="absolute bottom-1.5 right-1.5 p-1 rounded-full bg-cyan-950 border border-cyan-500 text-cyan-400">
                <Shield className="w-3 h-3" />
              </div>
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono">
                  {profile.designation}
                </span>
                {isPrimary && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight truncate">
                {profile.name}
              </h3>

              {/* DIN - Only displayed if validly entered by admin */}
              {isDinValid ? (
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-emerald-950/40 px-2.5 py-0.5 rounded-md border border-emerald-800/60 mt-1">
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>DIN: {profile.din} (Verified)</span>
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Corporate Director · Predhanexa Private Limited
                </div>
              )}
            </div>
          </div>

          {/* Biography Block */}
          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {isPrimary
              ? "DIN: 11967839"
              : "DIN: 11967838"}
          </p>

          {/* Technical Competencies (if configured) */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Technical Focus & Competencies
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-2.5 py-1 rounded-md bg-slate-800/90 border border-slate-700/80 text-xs text-slate-200 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Links (if configured) */}
          {(profile.socialLinks?.linkedin || profile.socialLinks?.github || profile.socialLinks?.twitter) && (
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs text-slate-500">Profiles:</span>
              {profile.socialLinks?.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  LinkedIn
                </a>
              )}
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  GitHub
                </a>
              )}
              {profile.socialLinks?.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  Twitter
                </a>
              )}
            </div>
          )}

          {/* Direct Communication Channels */}
          {hasConfiguredContact || !isPrimary ? (
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
              {(profile.whatsapp || !isPrimary) && (
                <a
                  href={`https://wa.me/91${isPrimary ? profile.whatsapp : "9493413469"}?text=${encodeURIComponent(
                    `Hello ${profile.name}, I would like to inquire about software development solutions with PredhaNexa.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer shadow-md shadow-emerald-950/40"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp (+91 {isPrimary ? profile.whatsapp : "9493413469"})</span>
                </a>
              )}

              {(profile.email || !isPrimary) && (
                <a
                  href={`mailto:${isPrimary ? profile.email : "prudhvi@predhanexa.in"}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Email</span>
                </a>
              )}

              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Call</span>
                </a>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export const FoundersSection: React.FC<FoundersSectionProps> = ({
  founder,
  coFounder,
  onNavigateToAdmin,
}) => {
  return (
    <section id="team" className="py-20 lg:py-28 bg-[#02040a] border-b border-slate-800/60 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16 text-center sm:text-left">
          <div className="text-xs font-semibold text-cyan-400 tracking-wider uppercase font-mono">
            Corporate Governance & Leadership
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white text-balance">
            Executive Leadership & Founders
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Dedicated software engineering leadership directing custom software architecture, digital products, and SLA-backed maintenance.
          </p>
        </div>

        {/* 3D Founder Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <ProfileCard
            profile={founder}
            isPrimary={true}
            onNavigateToAdmin={onNavigateToAdmin}
          />
          <ProfileCard
            profile={coFounder}
            isPrimary={false}
            onNavigateToAdmin={onNavigateToAdmin}
          />
        </div>
      </div>
    </section>
  );
};
