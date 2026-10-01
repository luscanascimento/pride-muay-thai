import React from 'react';
import { Shield, MessageCircle } from 'lucide-react';
import { InstagramIcon } from '../ui/Icons';
import { BRAND, getWhatsAppUrl } from '../../constants/brand';
import { TigerEmblem } from '../brand/TigerEmblem';
import { Button } from '../ui/Button';

export const TeamPrideSection: React.FC = () => {
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#080809] overflow-hidden">
      
      {/* Background ambient red glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[600px] h-72 sm:h-[600px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none max-w-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="p-8 sm:p-12 lg:p-16 rounded-2xl bg-gradient-to-b from-[#121218] via-[#0d0d12] to-[#0a0a0d] border border-zinc-800 shadow-2xl relative overflow-hidden">
          
          {/* Subtle decorative Thai border line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left: Living Brand Tiger Emblem */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <TigerEmblem size="lg" showEyesGlow={true} interactive={true} />
              <div className="mt-4 text-center">
                <span className="font-fight text-2xl text-white uppercase tracking-wider block">
                  {BRAND.name}
                </span>
                <span className="text-xs uppercase font-mono tracking-widest text-red-500 font-semibold">
                  {BRAND.coach}
                </span>
              </div>
            </div>

            {/* Right: Team Philosophy & Authenticity */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-semibold tracking-wider uppercase mb-3">
                <Shield size={14} />
                <span>Nossa Identidade</span>
              </div>

              <h2 className="font-fight text-4xl sm:text-5xl lg:text-6xl text-white uppercase leading-none">
                A FORÇA DA EQUIPE <br />
                <span className="text-red-500 text-glow-red">PRIDE MUAY THAI</span>
              </h2>

              <p className="mt-5 text-zinc-300 text-base sm:text-lg leading-relaxed">
                Sob a liderança do treinador <strong>{BRAND.coach}</strong>, o Pride Muay Thai nasceu para levar a arte marcial tailandesa com autenticidade, seriedade e dedicação técnica às cidades de <strong>Jacareí</strong> e <strong>Santa Branca</strong>.
              </p>

              <p className="mt-3 text-zinc-400 text-sm sm:text-base leading-relaxed">
                O símbolo dos dois tigres (<em>Suea Koo</em>) carrega a tradição dos antigos guerreiros: determinação inabalável para avançar diante dos obstáculos, agilidade para reagir com inteligência e a lealdade inegociável entre os irmãos de tatame.
              </p>

              {/* Pillars list */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-center">
                  <span className="font-fight text-lg text-white uppercase block">Técnica</span>
                  <span className="text-[11px] text-zinc-400">Biomecânica precisa</span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-center">
                  <span className="font-fight text-lg text-white uppercase block">Disciplina</span>
                  <span className="text-[11px] text-zinc-400">Constância diária</span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-center">
                  <span className="font-fight text-lg text-white uppercase block">Respeito</span>
                  <span className="text-[11px] text-zinc-400">Conduta e honra</span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-center">
                  <span className="font-fight text-lg text-white uppercase block">Evolução</span>
                  <span className="text-[11px] text-zinc-400">Crescimento contínuo</span>
                </div>
              </div>

              {/* Quick links */}
              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Button
                  as="a"
                  href={getWhatsAppUrl()}
                  target="_blank"
                  variant="primary"
                  size="md"
                >
                  <MessageCircle size={18} />
                  Falar com {BRAND.coach}
                </Button>

                <Button
                  as="a"
                  href={BRAND.instagramUrl}
                  target="_blank"
                  variant="secondary"
                  size="md"
                >
                  <InstagramIcon size={18} className="text-red-500" />
                  Instagram Oficial
                </Button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
