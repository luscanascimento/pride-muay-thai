import React, { useState } from 'react';
import { MapPin, X } from 'lucide-react';

export const WhatsAppFloat: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (window.location.hash.startsWith('#/')) {
      window.location.hash = '#onde-treinar';
    } else {
      const el = document.getElementById('onde-treinar');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = '#onde-treinar';
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end gap-3 group">
      {/* Tooltip bubble on desktop */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-zinc-900 border border-zinc-700/80 px-3.5 py-2 rounded-lg shadow-2xl text-xs text-zinc-200 animate-fade-in backdrop-blur-md">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>Encontre a <strong>academia mais próxima</strong></span>
          <button
            onClick={() => setShowTooltip(false)}
            aria-label="Fechar dica"
            className="text-zinc-400 hover:text-white p-0.5 ml-1 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Floating button directing to nearest gym */}
      <a
        href="#onde-treinar"
        onClick={handleClick}
        aria-label="Escolher academia mais próxima para treinar Muay Thai"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-xl hover:shadow-red-600/30 transition-transform hover:scale-105 active:scale-95 focus-visible:ring-4 focus-visible:ring-red-400/50"
      >
        <MapPin size={26} className="text-white drop-shadow" />
      </a>
    </div>
  );
};
