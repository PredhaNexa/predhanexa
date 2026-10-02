import React, { useState, useEffect } from 'react';
import { AppConfig } from './types';
import { configService } from './services/configService';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { TeamPage } from './pages/TeamPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { Intro3DAnimation } from './components/three/Intro3DAnimation';

export default function App() {
  const [config, setConfig] = useState<AppConfig>(configService.getConfig());
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('predhanexa_intro_seen');
    }
    return true;
  });

  useEffect(() => {
    const unsubscribe = configService.subscribe((updated) => {
      setConfig(updated);
    });

    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      unsubscribe();
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('predhanexa_intro_seen', 'true');
    }
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  const handleSelectServiceForInquiry = (serviceTitle: string) => {
    navigate('/contact');
  };

  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/':
        return (
          <HomePage
            config={config}
            onNavigate={navigate}
            onReplayIntro={handleReplayIntro}
          />
        );
      case '/about':
        return <AboutPage config={config} onNavigate={navigate} />;
      case '/services':
        return (
          <ServicesPage
            config={config}
            onNavigate={navigate}
            onSelectServiceForInquiry={handleSelectServiceForInquiry}
          />
        );
      case '/team':
        return <TeamPage config={config} onNavigate={navigate} />;
      case '/contact':
        return <ContactPage config={config} />;
      case '/privacy-policy':
        return <PrivacyPolicyPage config={config} />;
      case '/terms':
        return <TermsPage config={config} />;
      case '/admin':
        return <AdminPage config={config} onNavigate={navigate} />;
      default:
        return <NotFoundPage onNavigate={navigate} />;
    }
  };

  const isAdminView = currentPath === '/admin';

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Global 3D Cinematic Intro Animation */}
      {showIntro && (
        <Intro3DAnimation
          companyName={config.company.name.split(' ')[0] || 'PREDHANEXA'}
          tagline={config.company.tagline}
          onComplete={handleIntroComplete}
        />
      )}

      {/* Navbar rendered on all public pages */}
      {!isAdminView && (
        <Navbar
          company={config.company}
          currentPath={currentPath}
          onNavigate={navigate}
          onReplayIntro={handleReplayIntro}
        />
      )}

      {/* Main Page Content */}
      <div className="flex-1">{renderCurrentPage()}</div>

      {/* Footer rendered on all public pages */}
      {!isAdminView && <Footer config={config} onNavigate={navigate} />}
    </div>
  );
}
