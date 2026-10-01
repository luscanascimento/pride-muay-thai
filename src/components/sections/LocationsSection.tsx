import React from 'react';
import { MapPin, Navigation, MessageCircle, Route } from 'lucide-react';
import { BRAND, getWhatsAppUrl } from '../../constants/brand';
import { Button } from '../ui/Button';

export const LocationsSection: React.FC = () => {
  return (
    <section id="unidades" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#0a0a0d] border-t border-zinc-900 overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <MapPin size={14} />
            <span>Vale do Paraíba — SP</span>
          </div>
          <h2 className="font-fight text-4xl sm:text-5xl lg:text-6xl text-white uppercase leading-none">
            ONDE <span className="text-red-500 text-glow-red">TREINAR?</span>
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
            O Pride Muay Thai atende alunos em duas cidades do Vale do Paraíba. Encontre o ponto ideal para o seu dia a dia.
          </p>
        </div>

        {/* Abstract Stylized Route & Map Visualization */}
        <div className="p-8 sm:p-10 rounded-2xl bg-[#111116] border border-zinc-800 shadow-2xl relative overflow-hidden">
          
          {/* Stylized Geographic Route Diagram */}
          <div className="relative py-6 sm:py-10">
            
            {/* SVG Connecting Route Vector */}
            <div className="hidden md:block relative w-full h-32">
              <svg viewBox="0 0 800 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background dashed route */}
                <path
                  d="M 200 60 C 350 20, 450 100, 600 60"
                  stroke="#27272a"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />
                {/* Glowing red active line */}
                <path
                  d="M 200 60 C 350 20, 450 100, 600 60"
                  stroke="#dc2626"
                  strokeWidth="2"
                  strokeOpacity="0.8"
                />
                
                {/* Midpoint route radar pulse */}
                <circle cx="400" cy="60" r="14" fill="#18181b" stroke="#71717a" strokeWidth="1.5" />
                <circle cx="400" cy="60" r="4" fill="#dc2626" />

                {/* Jacareí Node */}
                <circle cx="200" cy="60" r="20" fill="#260e11" stroke="#dc2626" strokeWidth="2.5" />
                <circle cx="200" cy="60" r="8" fill="#ff1e27" className="animate-pulse" />

                {/* Santa Branca Node */}
                <circle cx="600" cy="60" r="20" fill="#260e11" stroke="#dc2626" strokeWidth="2.5" />
                <circle cx="600" cy="60" r="8" fill="#ff1e27" className="animate-pulse" />
              </svg>
            </div>

            {/* City Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 relative z-10">
              
              {/* Jacareí Card */}
              <div className="p-6 sm:p-7 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-red-600/60 transition-all duration-300 flex flex-col justify-between group shadow-xl">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-red-400 font-semibold flex items-center gap-1.5">
                      <Navigation size={13} />
                      Cidade Polo
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-950/80 text-red-300 border border-red-800/40">
                      SP
                    </span>
                  </div>
                  <h3 className="font-fight text-3xl sm:text-4xl text-white uppercase tracking-wide group-hover:text-red-400 transition-colors">
                    Jacareí
                  </h3>
                  <p className="mt-2 text-zinc-300 text-sm leading-relaxed">
                    Atividades com acompanhamento técnico contínuo para turmas iniciantes e intermediárias.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/80">
                  <a
                    href={getWhatsAppUrl("Olá, Renan! Gostaria de saber sobre as unidades e horários em Jacareí - SP.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs uppercase font-mono tracking-wider text-red-400 hover:text-red-300 font-semibold"
                  >
                    <span>Ver horários em Jacareí</span>
                    <Navigation size={13} className="rotate-45" />
                  </a>
                </div>
              </div>

              {/* Santa Branca Card */}
              <div className="p-6 sm:p-7 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-red-600/60 transition-all duration-300 flex flex-col justify-between group shadow-xl">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-red-400 font-semibold flex items-center gap-1.5">
                      <Navigation size={13} />
                      Cidade Polo
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-950/80 text-red-300 border border-red-800/40">
                      SP
                    </span>
                  </div>
                  <h3 className="font-fight text-3xl sm:text-4xl text-white uppercase tracking-wide group-hover:text-red-400 transition-colors">
                    Santa Branca
                  </h3>
                  <p className="mt-2 text-zinc-300 text-sm leading-relaxed">
                    Treinos dinâmicos com foco em disciplina, biomecânica e desenvolvimento atlético no município.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/80">
                  <a
                    href={getWhatsAppUrl("Olá, Renan! Gostaria de saber sobre as unidades e horários em Santa Branca - SP.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs uppercase font-mono tracking-wider text-red-400 hover:text-red-300 font-semibold"
                  >
                    <span>Ver horários em Santa Branca</span>
                    <Navigation size={13} className="rotate-45" />
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* Central guidance note (REQUIRED IN PROMPT) */}
          <div className="mt-8 p-5 sm:p-6 rounded-xl bg-gradient-to-r from-red-950/50 via-zinc-900 to-red-950/30 border border-red-900/50 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-600/50 flex items-center justify-center text-red-500 flex-shrink-0">
                <Route size={20} />
              </div>
              <p className="text-sm sm:text-base text-zinc-200 font-medium">
                <strong>{BRAND.unitsNote}</strong>
              </p>
            </div>

            <Button
              as="a"
              href={getWhatsAppUrl("Olá, Renan! Gostaria de saber qual é a unidade mais próxima de mim para treinar.")}
              target="_blank"
              variant="primary"
              size="md"
              className="flex-shrink-0 w-full sm:w-auto"
            >
              <MessageCircle size={18} />
              Consultar Unidade Próxima
            </Button>
          </div>

        </div>

      </div>
    </section>
  );
};
