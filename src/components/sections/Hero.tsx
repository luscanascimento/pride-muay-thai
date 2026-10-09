import React from 'react';
import { MessageCircle, ArrowRight, MapPin, ShieldCheck, Flame } from 'lucide-react';
import { BRAND, getWhatsAppUrl } from '../../constants/brand';
import { Button } from '../ui/Button';
import { TigerEmblem } from '../brand/TigerEmblem';
import { ThreeAtmosphere } from '../motion/ThreeAtmosphere';
import heroFighterImg from '../../assets/images/hero-fighter.jpg';

export const Hero: React.FC = () => {
  return (
    <section
      id="inicio"
      className="relative min-h-[100svh] lg:min-h-[720px] lg:max-h-[1000px] flex flex-col items-center justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#080809] w-full min-w-0"
    >
      {/* Three.js Background particles and embers */}
      <ThreeAtmosphere />

      {/* Atmospheric lighting layers */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[600px] lg:w-[850px] h-72 sm:h-[600px] lg:h-[850px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none max-w-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080809] via-transparent to-transparent pointer-events-none z-10" />

      {/* Hero content container */}
      <div className="relative z-20 max-w-7xl mx-auto w-full min-w-0 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Storytelling, Brand & CTAs */}
        <div className="lg:col-span-7 min-w-0 w-full flex flex-col items-center lg:items-start text-center lg:text-left">
          
          {/* Top Thai martial badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/50 border border-red-800/60 text-red-400 text-[11px] sm:text-xs font-semibold tracking-wider uppercase mb-4 sm:mb-5 backdrop-blur-sm max-w-full">
            <Flame size={13} className="text-red-500 fill-red-500/30 animate-pulse flex-shrink-0" />
            <span>Uma das maiores equipes do Vale do Paraíba</span>
          </div>

          {/* Main Title */}
          <h1 className="font-fight text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] tracking-tight leading-[0.95] text-white uppercase drop-shadow-md">
            PRIDE <span className="text-red-600 text-glow-red block sm:inline">MUAY THAI</span>
          </h1>

          {/* Coach & Subtitle */}
          <div className="mt-2 sm:mt-3 flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3">
            <span className="font-condensed text-lg sm:text-2xl font-bold uppercase tracking-widest text-zinc-300">
              {BRAND.coach}
            </span>
            <span className="h-4 w-[1px] bg-zinc-700 hidden sm:inline-block" />
            <span className="text-xs sm:text-sm font-medium uppercase tracking-wider text-red-400/90 hidden sm:inline-block">
              {BRAND.tagline}
            </span>
          </div>

          {/* Description */}
          <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-zinc-300 max-w-xl font-normal leading-relaxed">
            Hoje reconhecida como <strong>uma das maiores equipes do Vale do Paraíba de Muay Thai</strong>. A Arte das Oito Armas ensinada com técnica autêntica, condicionamento físico de alta performance e respeito mútuo. Do iniciante ao atleta, construa força, foco e disciplina.
          </p>

          {/* Location Badges */}
          <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm font-medium text-zinc-300 w-full sm:w-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-900/90 border border-zinc-800/80">
              <MapPin size={13} className="text-red-500 flex-shrink-0" />
              <span>Jacareí — SP</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-900/90 border border-zinc-800/80">
              <MapPin size={13} className="text-red-500 flex-shrink-0" />
              <span>São José dos Campos — SP</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-900/90 border border-zinc-800/80">
              <MapPin size={13} className="text-red-500 flex-shrink-0" />
              <span>Santa Branca — SP</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 sm:gap-4 w-full max-w-sm sm:max-w-none">
            <Button
              as="a"
              href={getWhatsAppUrl("Olá, Renan! Gostaria de agendar uma aula experimental e começar a treinar no Pride Muay Thai.")}
              target="_blank"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto shadow-red-glow hover:shadow-red-glow-lg text-center"
            >
              <MessageCircle size={20} />
              Comece a Treinar
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              as="a"
              href={getWhatsAppUrl("Olá, Renan! Gostaria de tirar dúvidas sobre as turmas e horários do Pride Muay Thai.")}
              target="_blank"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Fale com o Renan
            </Button>
          </div>

          {/* Confidence checkmarks */}
          <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-6 text-xs sm:text-sm text-zinc-400">
            <div className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-red-500 flex-shrink-0" />
              <span>Iniciantes & Avançados</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-red-500 flex-shrink-0" />
              <span>Técnica & Defesa Pessoal</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-red-500 flex-shrink-0" />
              <span>Ambiente de Respeito</span>
            </div>
          </div>
        </div>

        {/* Right Column: Living Tiger Emblem + Fighter Silhouette Composition */}
        <div className="lg:col-span-5 min-w-0 w-full flex flex-col items-center justify-center relative mt-4 lg:mt-0">
          
          {/* Background Fighter Visual Accent */}
          <div className="relative w-full max-w-[280px] sm:max-w-[380px] lg:max-w-[460px] flex items-center justify-center">
            
            {/* Subtle background photo card with dramatic lighting */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-25 filter grayscale contrast-125 mix-blend-luminosity pointer-events-none transform -rotate-1">
              <img
                src={heroFighterImg}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080809] via-[#080809]/40 to-transparent" />
            </div>

            {/* Living Tiger Emblem with eyes glow and roar interaction */}
            <div className="relative z-10 py-4">
              <TigerEmblem size="hero" showEyesGlow={true} interactive={true} />
            </div>
          </div>

        </div>

      </div>

      {/* Downward Scroll indicator */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors pointer-events-none">
        <span className="text-[10px] tracking-widest uppercase font-mono">Role para explorar</span>
        <div className="w-5 h-8 rounded-full border border-zinc-700/80 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-red-500 animate-bounce" />
        </div>
      </div>
    </section>
  );
};
