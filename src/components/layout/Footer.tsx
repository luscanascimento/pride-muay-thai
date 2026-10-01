import React from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { InstagramIcon } from '../ui/Icons';
import { BRAND, getWhatsAppUrl } from '../../constants/brand';
import prideLogoCutout from '../../assets/pride-muay-thai-cutout.png';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#050507] border-t border-zinc-900 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-zinc-400 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-zinc-800/80 items-start">
          
          {/* Brand Column */}
          <div className="md:col-span-6 flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex-shrink-0">
                <img
                  src={prideLogoCutout}
                  alt="Pride Muay Thai"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-fight text-2xl font-bold tracking-wider leading-none text-white">
                  PRIDE <span className="text-red-500">MUAY THAI</span>
                </span>
                <span className="text-xs uppercase font-mono tracking-widest text-zinc-400 mt-0.5">
                  {BRAND.coach}
                </span>
              </div>
            </div>

            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed mt-1">
              Tradição, técnica, disciplina e respeito. Treinos de Muay Thai autêntico no Vale do Paraíba.
            </p>
          </div>

          {/* Locations */}
          <div className="md:col-span-3 flex flex-col gap-2">
            <span className="font-fight text-lg text-white uppercase tracking-wider mb-2">
              Atividades
            </span>
            <span className="text-sm text-zinc-300">Jacareí — SP</span>
            <span className="text-sm text-zinc-300">Santa Branca — SP</span>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Consulte com o Renan a unidade e os horários mais convenientes.
            </p>
          </div>

          {/* Direct Channels */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="font-fight text-lg text-white uppercase tracking-wider mb-1">
              Contato Oficial
            </span>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors"
            >
              <MessageCircle size={16} className="text-emerald-400" />
              <span>WhatsApp: {BRAND.phoneDisplay}</span>
            </a>
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors"
            >
              <InstagramIcon size={16} className="text-red-500" />
              <span>Instagram: {BRAND.instagramHandle}</span>
            </a>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} {BRAND.name} • {BRAND.coach}. Todos os direitos reservados.</p>
          
          <button
            onClick={scrollToTop}
            aria-label="Voltar ao topo da página"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors p-2"
          >
            <span>Voltar ao topo</span>
            <ArrowUp size={14} className="text-red-500" />
          </button>
        </div>
      </div>
    </footer>
  );
};
