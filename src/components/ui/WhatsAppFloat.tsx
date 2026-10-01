import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { BRAND, getWhatsAppUrl } from '../../constants/brand';

export const WhatsAppFloat: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end gap-3 group">
      {/* Tooltip bubble on desktop */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-zinc-900 border border-zinc-700/80 px-3.5 py-2 rounded-lg shadow-2xl text-xs text-zinc-200 animate-fade-in backdrop-blur-md">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Fale direto com o <strong>{BRAND.coach}</strong></span>
          <button
            onClick={() => setShowTooltip(false)}
            aria-label="Fechar dica do WhatsApp"
            className="text-zinc-400 hover:text-white p-0.5 ml-1 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Floating button */}
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar com Renan Hulkinho no WhatsApp sobre treinos de Muay Thai"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl hover:shadow-2xl transition-transform hover:scale-105 active:scale-95 focus-visible:ring-4 focus-visible:ring-emerald-400/50"
      >
        <MessageCircle size={28} className="fill-white/20" />
      </a>
    </div>
  );
};
