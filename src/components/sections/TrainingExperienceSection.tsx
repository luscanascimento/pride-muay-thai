import React from 'react';
import { Layers, ArrowDown, CheckCircle2 } from 'lucide-react';
import { BRAND } from '../../constants/brand';

export const TrainingExperienceSection: React.FC = () => {
  return (
    <section id="treino" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#080809] overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <Layers size={14} />
            <span>Passo a Passo da Aula</span>
          </div>
          <h2 className="font-fight text-4xl sm:text-5xl lg:text-6xl text-white uppercase leading-none">
            COMO É UMA AULA NO <br />
            <span className="text-red-500 text-glow-red">PRIDE MUAY THAI?</span>
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
            Se você nunca treinou antes, fique tranquilo: nossa metodologia é progressiva, segura e acolhedora. Veja como se desenvolve a estrutura de cada sessão.
          </p>
        </div>

        {/* Steps Flow Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {BRAND.trainingSteps.map((step, idx) => (
            <div
              key={step.step}
              className="p-6 sm:p-7 rounded-xl bg-[#111116] border border-zinc-800/80 hover:border-red-600/60 transition-all duration-300 flex flex-col justify-between group shadow-xl relative"
            >
              {/* Step indicator header */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-fight text-4xl text-red-500/80 font-bold group-hover:text-red-500 transition-colors">
                  {step.step}
                </span>
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                  {step.thai}
                </span>
              </div>

              {/* Title & Description */}
              <div className="flex-1">
                <h3 className="font-fight text-2xl text-white uppercase tracking-wide group-hover:text-red-400 transition-colors mb-2">
                  {step.name}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Bottom check */}
              <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <CheckCircle2 size={14} className="text-red-500" />
                  Etapa guiada
                </span>
                {idx < BRAND.trainingSteps.length - 1 && (
                  <span className="hidden lg:flex items-center gap-1 text-[11px] font-mono text-zinc-600">
                    Próximo <ArrowDown size={12} className="rotate-[-90deg]" />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* First time reassurance banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-xl bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-900/60 border border-red-900/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col text-center sm:text-left">
            <span className="text-xs uppercase font-mono tracking-widest text-red-400 font-semibold mb-1">
              Primeira vez calçando as luvas?
            </span>
            <h4 className="font-fight text-2xl sm:text-3xl text-white uppercase">
              Você não precisa estar em forma para começar
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              Nossa equipe adapta a intensidade para o seu ritmo atual. Todos os novos alunos recebem atenção para aprender com paciência e segurança.
            </p>
          </div>
          <div className="flex-shrink-0">
            <a
              href="#contato"
              className="inline-flex items-center justify-center font-fight text-lg uppercase tracking-wider px-6 py-3 rounded-md bg-red-600 hover:bg-red-500 text-white shadow-red-glow transition-all active:scale-95"
            >
              Agendar Primeira Aula
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
