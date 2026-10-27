import React from 'react';
import { MapPin, ArrowUpRight, Flame } from 'lucide-react';
import { InstagramIcon, YoutubeIcon } from '../ui/Icons';
import { BRAND } from '../../constants/brand';
import { Button } from '../ui/Button';
import { TigerEmblem } from '../brand/TigerEmblem';

export const ContactCtaSection: React.FC = () => {
  return (
    <section id="contato" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#080809] overflow-hidden">
      
      {/* Intense red background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[500px] lg:w-[800px] h-72 sm:h-[500px] lg:h-[800px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none max-w-full" />

      {/* Decorative Thai ceremonial line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-red-600/60 to-transparent" />

      <div className="max-w-5xl mx-auto relative z-10 text-center flex flex-col items-center">
        
        {/* Tiger emblem revival */}
        <div className="mb-8">
          <TigerEmblem size="lg" showEyesGlow={true} interactive={true} />
        </div>

        {/* Powerful Martial Quote */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-800/60 text-red-400 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-6 backdrop-blur-sm">
          <Flame size={16} className="text-red-500 fill-red-500/40" />
          <span>A Decisão é Sua</span>
        </div>

        <h2 className="font-fight text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white uppercase tracking-tight leading-[0.95] max-w-4xl">
          VOCÊ NÃO PRECISA ESTAR PRONTO <br className="hidden sm:inline" />
          PARA COMEÇAR. <br />
          <span className="text-red-600 text-glow-red">
            VOCÊ PRECISA COMEÇAR PARA EVOLUIR.
          </span>
        </h2>

        <p className="mt-6 text-zinc-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
          Dê o primeiro passo no tatame. Escolha a academia mais próxima de você e entre em contato direto com a unidade para agendar sua aula experimental.
        </p>

        {/* Primary Contact CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Button
            as="a"
            href="#onde-treinar"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto text-xl px-10 py-4 shadow-red-glow hover:shadow-red-glow-lg"
          >
            <MapPin size={24} />
            Escolher Academia Mais Próxima
          </Button>

          <Button
            as="a"
            href={BRAND.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Acessar o perfil oficial do Instagram: ${BRAND.instagramHandle} (abre em nova aba)`}
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto text-lg px-8 py-4"
          >
            <InstagramIcon size={20} className="text-red-500" />
            Instagram Oficial
            <ArrowUpRight size={18} className="text-zinc-500" />
          </Button>

          <Button
            as="a"
            href={BRAND.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Canal oficial da Pride Muay Thai no YouTube: ${BRAND.youtubeHandle} (abre em nova aba)`}
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto text-lg px-8 py-4 border-red-600/30 hover:border-red-600/80"
          >
            <YoutubeIcon size={20} className="text-red-500" />
            Canal no YouTube
            <ArrowUpRight size={18} className="text-zinc-500" />
          </Button>
        </div>

        {/* Contact information cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl w-full">
          
          {/* Gym Locator Direct Card */}
          <a
            href="#onde-treinar"
            className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-red-600/60 transition-all duration-300 flex items-center justify-center gap-3 text-zinc-200 hover:text-white group"
          >
            <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform">
              <MapPin size={18} />
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block">Academias Parceiras</span>
              <span className="font-fight text-xl tracking-wider text-white group-hover:text-red-400 transition-colors">
                Encontre Sua Unidade
              </span>
            </div>
          </a>

          {/* Instagram Direct Card */}
          <a
            href={BRAND.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Acessar o perfil oficial do Instagram: ${BRAND.instagramHandle} (abre em nova aba)`}
            className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-red-600/60 transition-all duration-300 flex items-center justify-center gap-3 text-zinc-200 hover:text-white group"
          >
            <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform">
              <InstagramIcon size={18} />
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block">Siga no Instagram</span>
              <span className="font-fight text-xl tracking-wider text-white group-hover:text-red-400 transition-colors">
                {BRAND.instagramHandle}
              </span>
            </div>
          </a>

          {/* YouTube Direct Card */}
          <a
            href={BRAND.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Canal oficial da Pride Muay Thai no YouTube: ${BRAND.youtubeHandle} (abre em nova aba)`}
            className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-red-600/60 transition-all duration-300 flex items-center justify-center gap-3 text-zinc-200 hover:text-white group"
          >
            <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform">
              <YoutubeIcon size={18} />
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block">Canal no YouTube</span>
              <span className="font-fight text-xl tracking-wider text-white group-hover:text-red-400 transition-colors">
                {BRAND.youtubeHandle}
              </span>
            </div>
          </a>

        </div>

      </div>
    </section>
  );
};
