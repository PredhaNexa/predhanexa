import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#030712] px-4 py-16">
      <div className="max-w-md text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-400 flex items-center justify-center mx-auto font-mono text-2xl font-bold">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-400">
            The requested technical route does not exist or has been relocated within the architecture.
          </p>
        </div>
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </button>
      </div>
    </div>
  );
};
