import React from 'react';
import { Flame, Shield, Award, Compass } from 'lucide-react';
import traditionImg from '../../assets/images/thailand-tradition.jpg';
import wrapsImg from '../../assets/images/gloves-wraps.jpg';

export const AboutMuayThai: React.FC = () => {
  return (
    <section id="sobre-muay-thai" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#0b0b0e] overflow-hidden">
      {/* Decorative Thai border line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Storytelling & Imagery */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main image: Hand wraps / ritual preparation */}
              <div className="relative rounded-lg overflow-hidden border border-zinc-800 shadow-2xl group">
                <img
                  src={wrapsImg}
                  alt="Bandagens e luvas de Muay Thai tradicional"
                  className="w-full h-80 sm:h-96 object-cover filter contrast-125 brightness-90 transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0e] via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-xs uppercase tracking-widest text-red-400 font-semibold">Ritual & Preparação</span>
                  <p className="text-sm font-bold text-white uppercase">A disciplina nasce antes de subir no ringue</p>
                </div>
              </div>

              {/* Inset image: Thailand heritage */}
              <div className="absolute -bottom-8 -right-4 sm:-right-8 w-44 sm:w-56 rounded-lg overflow-hidden border-2 border-red-900/60 shadow-2xl hidden sm:block">
                <img
                  src={traditionImg}
                  alt="Tradição e templos da Tailândia"
                  className="w-full h-32 sm:h-40 object-cover filter contrast-110 brightness-80"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2.5">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-300">Origens em Sião (Tailândia)</span>
                </div>
              </div>

              {/* Accent element */}
              <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-red-600/70 pointer-events-none" />
            </div>
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-semibold tracking-wider uppercase mb-4 self-start">
              <Compass size={14} />
              <span>A Essência Marcial</span>
            </div>

            <h2 className="font-fight text-4xl sm:text-5xl lg:text-6xl text-white uppercase leading-[0.95]">
              MUITO ALÉM DE UMA LUTA: <br />
              <span className="text-red-500">UMA FILOSOFIA DE VIDA</span>
            </h2>

            <p className="mt-6 text-zinc-300 text-base sm:text-lg leading-relaxed">
              Nascido nos campos de batalha do antigo Reino de Sião como sistema de defesa militar (<em>Muay Boran</em>), o Muay Thai evoluiu ao longo de séculos para se tornar um dos esportes de combate mais respeitados e eficientes do planeta.
            </p>

            <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
              No <strong className="text-white">Pride Muay Thai</strong>, honramos essa linhagem. Cada golpe, cada deslocamento e cada saudação carregam valores que transcendem o tatame: <strong>respeito incondicional</strong> aos parceiros de treino, <strong>disciplina</strong> para superar os próprios limites e <strong>foco inabalável</strong>.
            </p>

            {/* Core Pillars */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-800/80">
              <div className="flex flex-col gap-1.5 p-3.5 rounded-md bg-zinc-900/60 border border-zinc-800/60">
                <Flame size={20} className="text-red-500" />
                <h3 className="font-fight text-xl text-white uppercase tracking-wide">Força Mental</h3>
                <p className="text-xs text-zinc-400">Autocontrole emocional e determinação diante de qualquer desafio diário.</p>
              </div>

              <div className="flex flex-col gap-1.5 p-3.5 rounded-md bg-zinc-900/60 border border-zinc-800/60">
                <Shield size={20} className="text-red-500" />
                <h3 className="font-fight text-xl text-white uppercase tracking-wide">Técnica Limpa</h3>
                <p className="text-xs text-zinc-400">Biomecânica refinada, guarda sólida e movimentos fluidos sem esforço desperdiçado.</p>
              </div>

              <div className="flex flex-col gap-1.5 p-3.5 rounded-md bg-zinc-900/60 border border-zinc-800/60">
                <Award size={20} className="text-red-500" />
                <h3 className="font-fight text-xl text-white uppercase tracking-wide">Respeito Mútuo</h3>
                <p className="text-xs text-zinc-400">O respeito mútuo e a irmandade marcial (Wai) são a base inegociável de nossa equipe.</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
