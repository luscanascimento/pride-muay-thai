import React, { useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  MessageCircle, 
  ExternalLink, 
  Shield, 
  Award, 
  Crown, 
  Quote, 
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import type { Professor } from '../../types/gymsAndTeam';
import { 
  getGymsForProfessor, 
  getGymWhatsAppUrl, 
  getGymExternalMapsUrl, 
  getAdjacentProfessors,
  getKhanRank
} from '../../data/gymsAndTeamData';
import { PrajiedBadge, PrajiedRope } from '../ui/PrajiedBadge';
import { getWhatsAppUrl } from '../../constants/brand';

interface ProfessorDetailPageProps {
  professor: Professor;
  onBack: () => void;
  onNavigateToProfessor?: (professorId: string) => void;
}

export const ProfessorDetailPage: React.FC<ProfessorDetailPageProps> = ({
  professor,
  onBack,
  onNavigateToProfessor,
}) => {
  const gyms = getGymsForProfessor(professor.gymIds);
  const adjacent = getAdjacentProfessors(professor.id);
  const rank = getKhanRank(professor.khan);

  // Scroll to top on mount or when professor changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [professor.id]);

  const handlePrev = () => {
    if (adjacent && onNavigateToProfessor) {
      onNavigateToProfessor(adjacent.prev.id);
    } else if (adjacent) {
      window.location.hash = `#/professores/${adjacent.prev.id}`;
    }
  };

  const handleNext = () => {
    if (adjacent && onNavigateToProfessor) {
      onNavigateToProfessor(adjacent.next.id);
    } else if (adjacent) {
      window.location.hash = `#/professores/${adjacent.next.id}`;
    }
  };

  return (
    <article className="min-h-screen bg-[#080809] text-zinc-100 pt-28 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 sm:w-[700px] h-96 sm:h-[700px] bg-red-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Navigation & Breadcrumbs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-10 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900/90 hover:bg-red-600 border border-zinc-800 hover:border-red-500 text-zinc-300 hover:text-white text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all duration-200 group shadow-md"
              aria-label="Voltar para a seção da nossa equipe"
            >
              <ArrowLeft size={16} className="text-red-400 group-hover:text-white group-hover:-translate-x-1 transition-transform" />
              <span>Voltar para a Equipe</span>
            </button>

            <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-2 text-xs text-zinc-400">
              <span>/</span>
              <button onClick={onBack} className="hover:text-zinc-200 transition-colors">
                Nossa Equipe
              </button>
              <span>/</span>
              <span className="text-zinc-300 font-medium">{professor.name}</span>
            </nav>
          </div>

          {/* Adjacent professors quick navigation */}
          {adjacent && (
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-xs transition-colors"
                title={`Ver professor anterior: ${adjacent.prev.name}`}
              >
                <ChevronLeft size={14} className="text-red-400" />
                <span className="hidden sm:inline">Anterior:</span>
                <span className="truncate max-w-[100px]">{adjacent.prev.name}</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-xs transition-colors"
                title={`Ver próximo professor: ${adjacent.next.name}`}
              >
                <span className="hidden sm:inline">Próximo:</span>
                <span className="truncate max-w-[100px]">{adjacent.next.name}</span>
                <ChevronRight size={14} className="text-red-400" />
              </button>
            </div>
          )}
        </div>

        {/* Hero Section of Professor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-14">
          
          {/* Photo & Badges Column */}
          <div className="lg:col-span-5 flex flex-col items-center sm:items-start">
            <div className="relative w-full max-w-md mx-auto aspect-[4/5] rounded-2xl overflow-hidden border-2 border-zinc-800/90 shadow-2xl bg-zinc-950 group">
              <img
                src={professor.photoUrl}
                alt={`Fotografia de ${professor.name}${professor.nickname ? ` (${professor.nickname})` : ''}`}
                style={{ objectPosition: professor.photoPosition || 'center 15%' }}
                className="w-full h-full object-cover"
              />
              
              {/* Vignette gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090c] via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-700" />

              {/* Khan Prajied badge on top-left of photo */}
              <div className="absolute top-4 left-4 z-10">
                <PrajiedBadge level={professor.khan} size="sm" />
              </div>

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-fight tracking-wider uppercase shadow-xl border backdrop-blur-md ${
                  professor.isLeader
                    ? 'bg-gradient-to-r from-red-600 to-red-700 border-red-400/80 text-white'
                    : 'bg-zinc-900/90 border-red-500/50 text-white'
                }`}>
                  {professor.isLeader ? <Crown size={14} className="text-yellow-400" /> : <Award size={14} className="text-red-400" />}
                  <span>{professor.isLeader ? 'Líder da Equipe' : 'Professor Pride'}</span>
                </span>
              </div>
            </div>

            {/* Highlight Badges / Tags */}
            {professor.highlightBadges && professor.highlightBadges.length > 0 && (
              <div className="w-full max-w-md mx-auto mt-5 flex flex-wrap gap-2">
                {professor.highlightBadges.map((badge: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide bg-zinc-900/90 text-zinc-300 border border-zinc-800/90"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quick Info & Header Column */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-semibold tracking-wider uppercase mb-3">
                <Shield size={13} />
                <span>Instrutores & Formadores Pride Muay Thai</span>
              </div>

              <h1 className="font-fight text-4xl sm:text-5xl lg:text-6xl text-white uppercase tracking-wide leading-none mb-3">
                {professor.name}
                {professor.nickname && (
                  <span className="text-red-500 ml-2 font-normal">
                    ({professor.nickname})
                  </span>
                )}
              </h1>

              <div className="text-sm sm:text-base font-mono uppercase tracking-wider text-red-400 font-semibold mb-4">
                {professor.roleTitle}
              </div>

              {/* Khan Graduation Banner */}
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#14141a] via-[#101015] to-[#0c0c10] border border-zinc-800/90 shadow-xl flex items-center gap-4">
                <PrajiedRope level={professor.khan} size="md" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-fight text-xl sm:text-2xl text-white uppercase tracking-wider leading-none">
                      {rank.level}º KHAN • {rank.colorName}
                    </span>
                  </div>
                  <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-semibold block mt-0.5">
                    {rank.title} • Graduação Marcial Tradicional
                  </span>
                  <p className="text-xs text-zinc-400 mt-1 leading-snug">
                    {rank.description}
                  </p>
                </div>
              </div>

              {professor.bio && (
                <p className="text-zinc-300 text-base sm:text-lg leading-relaxed mb-8 border-l-2 border-red-600 pl-4 py-1 italic bg-red-950/10 rounded-r-lg">
                  "{professor.bio}"
                </p>
              )}
            </div>

            {/* Gyms where this professor teaches */}
            <div className="w-full pt-6 border-t border-zinc-800/80">
              {professor.isLeader ? (
                <div className="p-5 rounded-xl bg-gradient-to-r from-red-950/30 to-zinc-900/60 border border-red-900/40">
                  <span className="text-xs font-mono uppercase tracking-widest text-red-400 font-semibold flex items-center gap-1.5 mb-2">
                    <Shield size={14} className="text-red-500" />
                    Liderança Geral da Equipe:
                  </span>
                  <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                    Renan Hulkinho supervisiona os treinamentos, a graduação técnica e o desenvolvimento pedagógico em todas as academias parceiras da Pride no Vale do Paraíba.
                  </p>
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold tracking-wide uppercase transition-colors shadow-md"
                  >
                    <MessageCircle size={16} />
                    <span>Falar diretamente com o Mestre Renan</span>
                  </a>
                </div>
              ) : gyms.length > 0 ? (
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-semibold flex items-center gap-1.5 mb-3">
                    <MapPin size={14} className="text-red-500" />
                    Onde ministra aulas ({gyms.length} {gyms.length > 1 ? 'unidades' : 'unidade'}):
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {gyms.map((gym) => (
                      <div
                        key={gym.id}
                        className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between hover:border-red-600/60 transition-colors"
                      >
                        <div>
                          <div className="font-fight text-lg text-white uppercase tracking-wide mb-1">
                            {gym.name}
                          </div>
                          {gym.address && (
                            <p className="text-xs text-zinc-400 line-clamp-2 mb-2">
                              {gym.address}
                            </p>
                          )}
                          {gym.schedules.length > 0 && (
                            <div className="flex items-start gap-1.5 text-[11px] text-zinc-400 mb-3">
                              <Clock size={12} className="text-red-400 mt-0.5 flex-shrink-0" />
                              <span>{gym.schedules.map((s) => `${s.days}: ${s.hours}`).join(' • ')}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
                          {gym.phoneRaw && (
                            <a
                              href={getGymWhatsAppUrl(gym)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-950/40 hover:bg-emerald-600 border border-emerald-800/50 hover:border-emerald-500 text-emerald-300 hover:text-white text-xs font-medium transition-all"
                            >
                              <MessageCircle size={13} />
                              <span>Falar com a unidade</span>
                            </a>
                          )}
                          {gym.coordinates && (
                            <a
                              href={getGymExternalMapsUrl(gym)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs transition-colors"
                              title="Abrir no Google Maps"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

          </div>

        </div>

        {/* Detailed Story / Biography Section */}
        <div className="p-6 sm:p-10 lg:p-12 rounded-3xl bg-gradient-to-b from-[#101015] via-[#0c0c10] to-[#08080a] border border-zinc-800/90 shadow-2xl relative overflow-hidden">
          
          <div className="flex items-center gap-2 mb-6">
            <span className="w-8 h-[2px] bg-red-600" />
            <span className="text-xs font-mono uppercase tracking-widest text-red-500 font-semibold">
              Trajetória & Filosofia Marcial
            </span>
          </div>

          <h2 className="font-fight text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-wide leading-none mb-8">
            {professor.storyTitle || `${professor.name} | História na Arte das 8 Armas`}
          </h2>

          {/* Paragraphs rendered cleanly */}
          <div className="space-y-5 text-zinc-300 text-base sm:text-lg leading-relaxed font-sans">
            {professor.storyParagraphs && professor.storyParagraphs.length > 0 ? (
              professor.storyParagraphs.map((paragraph: string, index: number) => (
                <p key={index} className="text-pretty">
                  {paragraph}
                </p>
              ))
            ) : (
              <p>{professor.bio}</p>
            )}
          </div>

          {/* Highlight Quote Box */}
          {professor.quote && (
            <div className="my-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-red-950/40 via-zinc-900/60 to-zinc-950 border-l-4 border-red-600 border-t border-r border-b border-zinc-800/80 shadow-xl relative">
              <Quote size={32} className="text-red-500/30 absolute top-4 right-4 pointer-events-none" />
              <blockquote className="text-lg sm:text-xl md:text-2xl font-serif italic text-zinc-200 leading-snug mb-3">
                "{professor.quote}"
              </blockquote>
              <div className="text-xs sm:text-sm font-fight uppercase tracking-wider text-red-400">
                — {professor.name} {professor.nickname ? `(${professor.nickname})` : ''} • Pride Muay Thai
              </div>
            </div>
          )}

          {/* Bottom Back Button & Actions */}
          <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 mt-10">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-red-600 border border-zinc-800 hover:border-red-500 text-zinc-200 hover:text-white text-sm font-semibold tracking-wider uppercase transition-all shadow-md group"
            >
              <ArrowLeft size={16} className="text-red-400 group-hover:text-white group-hover:-translate-x-1 transition-transform" />
              <span>Voltar para a Equipe</span>
            </button>

            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold tracking-wider uppercase transition-colors shadow-lg shadow-red-950/50"
            >
              <MessageCircle size={17} />
              <span>Agendar Aula Experimental</span>
            </a>
          </div>

        </div>

      </div>
    </article>
  );
};
