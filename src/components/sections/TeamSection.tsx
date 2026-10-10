import React from 'react';
import { Users, MapPin, ChevronRight, Award, Crown, Shield, ArrowRight } from 'lucide-react';
import { PROFESSORS_DATA, getGymsForProfessor } from '../../data/gymsAndTeamData';

interface TeamSectionProps {
  onSelectGym?: (gymId: string) => void;
  onViewProfessor?: (professorId: string) => void;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ onSelectGym, onViewProfessor }) => {
  const handleGymClick = (e: React.MouseEvent, gymId: string) => {
    e.preventDefault();
    if (onSelectGym) {
      onSelectGym(gymId);
    }
    const targetElement = document.getElementById(`gym-card-${gymId}`) || document.getElementById('onde-treinar');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetElement.classList.add('ring-2', 'ring-red-500', 'ring-offset-2', 'ring-offset-black');
      setTimeout(() => {
        targetElement.classList.remove('ring-2', 'ring-red-500', 'ring-offset-2', 'ring-offset-black');
      }, 2500);
    }
  };

  return (
    <section
      id="nossa-equipe"
      className="scroll-mt-24 relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#080809] border-t border-zinc-900 overflow-hidden"
      aria-labelledby="team-heading"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[650px] h-96 sm:h-[650px] bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <Users size={14} />
            <span>Instrutores & Formadores Pride</span>
          </div>

          <h2 id="team-heading" className="font-fight text-4xl sm:text-5xl lg:text-6xl text-white uppercase leading-none">
            NOSSA EQUIPE — <span className="text-red-500 text-glow-red">QUEM ENSINA, TAMBÉM INSPIRA.</span>
          </h2>

          <div className="mt-5 space-y-3 text-zinc-300 text-sm sm:text-base leading-relaxed text-balance">
            <p>
              Por trás de cada treino existe dedicação, conhecimento e compromisso com a evolução de cada aluno.
            </p>
            <p className="text-zinc-400">
              Nossa equipe acredita que o Muay Thai vai muito além dos golpes. É uma jornada de disciplina, respeito, superação e confiança.
              Com atenção à técnica, à segurança e ao desenvolvimento individual, nossos professores acompanham cada etapa dessa jornada, acolhendo tanto quem está dando os primeiros passos quanto quem já vive a paixão pelo esporte.
            </p>
            <p className="text-zinc-300 font-medium italic">
              Mais do que ensinar a lutar, buscamos transmitir os valores e a tradição do Muay Thai.
            </p>
          </div>
        </div>

        {/* Standardized Professors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7 items-stretch">
          {PROFESSORS_DATA.map((prof) => {
            const gyms = getGymsForProfessor(prof.gymIds);

            return (
              <article
                key={prof.id}
                id={`professor-${prof.id}`}
                className={`flex flex-col h-full rounded-2xl bg-gradient-to-b from-[#131318] via-[#0f0f13] to-[#0a0a0d] border ${
                  prof.isLeader
                    ? 'border-red-900/80 shadow-red-950/40 ring-1 ring-red-500/30 hover:border-red-500'
                    : 'border-zinc-800 hover:border-red-600/60'
                } shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden focus-within:ring-2 focus-within:ring-red-500`}
              >
                {/* Photo container with strictly standardized aspect ratio */}
                <div className="relative w-full aspect-[4/5] bg-zinc-950 overflow-hidden flex-shrink-0">
                  <img
                    src={prof.photoUrl}
                    alt={`Foto do professor ${prof.name}${prof.nickname ? ` (${prof.nickname})` : ''}`}
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: prof.photoPosition || 'center 15%' }}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* Gradient overlays for contrast and elegance */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f13] via-transparent to-black/30 pointer-events-none" />

                  {/* Thai decorative border line on image base */}
                  <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-600/70 to-transparent" />

                  {/* Nickname pill on image */}
                  {prof.nickname && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-white font-fight text-xs tracking-wider uppercase shadow-lg border backdrop-blur-sm ${
                        prof.isLeader
                          ? 'bg-gradient-to-r from-red-600 to-red-700 border-red-400/60 shadow-red-600/30'
                          : 'bg-red-600/90 border-red-400/40'
                      }`}>
                        {prof.isLeader ? <Crown size={12} className="text-yellow-400" /> : <Award size={12} />}
                        {prof.isLeader ? `LÍDER • ${prof.nickname}` : prof.nickname}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content - standardized flex distribution */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Professor name & title */}
                    <div className="mb-2">
                      <h3 className="font-fight text-2xl sm:text-3xl text-white uppercase tracking-wide group-hover:text-red-400 transition-colors leading-tight">
                        {prof.name}
                        {prof.nickname && (
                          <span className="text-red-500 ml-1.5 text-xl font-normal">
                            ({prof.nickname})
                          </span>
                        )}
                      </h3>
                      <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-semibold block mt-0.5">
                        {prof.roleTitle}
                      </span>
                    </div>

                    {/* Bio snippet */}
                    {prof.bio && (
                      <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                        {prof.bio}
                      </p>
                    )}
                  </div>

                  {/* Associated Academies / Leadership Scope */}
                  <div className="pt-3 border-t border-zinc-800/80 mt-auto">
                    {prof.isLeader ? (
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-widest text-red-400 font-semibold flex items-center gap-1.5 mb-2">
                          <Shield size={12} className="text-red-500" />
                          Liderança & Coordenação:
                        </span>
                        <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-900/40 text-xs text-zinc-300 mb-2">
                          <p className="text-[11px] text-zinc-400 leading-snug">
                            Supervisão técnica, formação de professores e graduação em todas as unidades do Vale do Paraíba.
                          </p>
                        </div>
                        <a
                          href="#onde-treinar"
                          className="w-full inline-flex items-center justify-between px-2.5 py-1.5 rounded-md bg-zinc-900/90 border border-zinc-800/80 hover:border-red-600/70 hover:bg-red-950/30 text-zinc-300 hover:text-white text-xs transition-colors group/gym"
                        >
                          <span className="truncate font-medium">Ver unidades da equipe</span>
                          <ChevronRight size={13} className="text-zinc-500 group-hover/gym:text-red-400 group-hover/gym:translate-x-0.5 transition-all flex-shrink-0 ml-1" />
                        </a>
                      </div>
                    ) : (
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-semibold flex items-center gap-1.5 mb-2.5">
                          <MapPin size={12} className="text-red-500" />
                          Onde ministra aulas:
                        </span>

                        <ul className="flex flex-col gap-1.5" aria-label={`Academias onde ${prof.name} dá aula`}>
                          {gyms.map((gym) => (
                            <li key={gym.id}>
                              <a
                                href={`#gym-card-${gym.id}`}
                                onClick={(e) => handleGymClick(e, gym.id)}
                                className="w-full inline-flex items-center justify-between px-2.5 py-1.5 rounded-md bg-zinc-900/90 border border-zinc-800/80 hover:border-red-600/70 hover:bg-red-950/30 text-zinc-300 hover:text-white text-xs transition-colors group/gym"
                                title={`Ver horários e contato de ${gym.name}`}
                              >
                                <span className="truncate font-medium">{gym.name}</span>
                                <ChevronRight size={13} className="text-zinc-500 group-hover/gym:text-red-400 group-hover/gym:translate-x-0.5 transition-all flex-shrink-0 ml-1" />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Botão Ver mais... para a página do professor */}
                  <div className="pt-3 border-t border-zinc-800/80 mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (onViewProfessor) {
                          onViewProfessor(prof.id);
                        } else {
                          window.location.hash = `#/professores/${prof.id}`;
                        }
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-zinc-900/90 hover:bg-red-600 text-zinc-300 hover:text-white border border-zinc-800 hover:border-red-500 text-xs font-semibold tracking-wider uppercase transition-all duration-200 group/btn shadow-sm"
                      aria-label={`Ver mais sobre o professor ${prof.name}`}
                    >
                      <span>Ver mais...</span>
                      <ArrowRight size={13} className="text-red-400 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>

                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
};
