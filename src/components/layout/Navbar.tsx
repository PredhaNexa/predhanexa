import React, { useState } from 'react';
import { Menu, X, Shield, ArrowUpRight, Play, Phone, MessageSquare } from 'lucide-react';
import { CompanyConfig } from '../../types';

interface NavbarProps {
  company: CompanyConfig;
  currentPath: string;
  onNavigate: (path: string) => void;
  onReplayIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  company,
  currentPath,
  onNavigate,
  onReplayIntro,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Team', path: '/team' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#02040a]/90 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Wordmark & Entity Subtitle */}
        <button
          onClick={() => handleLinkClick('/')}
          className="text-left flex items-center gap-2.5 group focus:outline-none cursor-pointer"
        >
          {company.logo ? (
            <img
              src={company.logo}
              alt={company.name}
              className="h-8 sm:h-9 w-auto object-contain"
            />
          ) : (
            <div className="flex flex-col">
 		 <span className="font-display font-extrabold text-xl sm:text-2xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-cyan-300 group-hover:to-cyan-200 transition-colors">
   			 PredhaNexa
  		</span>

 		 <span className="text-[9px] font-mono text-cyan-400 tracking-wider uppercase -mt-0.5">
  			  PRIVATE LIMITED
  		</span>
		<span className="text-[9px] font-mono text-cyan-400 tracking-wider  -mt-0.5">
  			 CIN: U62013AP2026PTC12482
  		</span>
	   </div>
          )}
        </button>

        {/* Clean Nav Links */}
        <nav
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`relative py-1 text-xs uppercase tracking-wider font-semibold transition-colors whitespace-nowrap focus:outline-none cursor-pointer ${
                  isActive
                    ? 'text-cyan-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions Zone */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              title="Replay 3D Cinematic Intro"
              className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 rounded-lg transition-colors focus:outline-none cursor-pointer hidden lg:inline-flex items-center gap-1.5 text-xs font-mono"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400" />
              <span>3D Intro</span>
            </button>
          )}

          <button
            onClick={() => handleLinkClick('/contact')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-all whitespace-nowrap shadow-md shadow-cyan-950/60 hover:shadow-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
          >
            <span>Contact Us</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => handleLinkClick('/admin')}
            title="Administrator Portal"
            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 rounded-lg transition-colors focus:outline-none cursor-pointer"
            aria-label="Admin Portal"
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#02040a]/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`w-full text-left px-4 py-3 text-sm rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            {onReplayIntro && (
              <button
                onClick={() => {
                  onReplayIntro();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700 rounded-lg cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-cyan-400" />
                <span>Play 3D Intro Animation</span>
              </button>
            )}

            <button
              onClick={() => handleLinkClick('/contact')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer"
            >
              <span>Contact Engineering Team</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
