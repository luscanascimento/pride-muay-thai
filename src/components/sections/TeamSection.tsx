import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  MapPin,
  ChevronRight,
  Award,
  Crown,
  Shield,
  ArrowRight,
  X,
  Flame,
  MessageCircle,
  Phone,
  Clock,
} from 'lucide-react';
import {
  PROFESSORS_DATA,
  PERSONAL_FIGHTERS_DATA,
  getGymsForProfessor,
  getKhanRank,
  getPersonalFighterWhatsAppUrl,
  getProfessorWhatsAppUrl,
} from '../../data/gymsAndTeamData';
import { PrajiedBadge } from '../ui/PrajiedBadge';
import { KhanGraduationShowcase } from './KhanGraduationShowcase';

interface TeamSectionProps {
  onSelectGym?: (gymId: string) => void;
  onViewProfessor?: (professorId: string) => void;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ onSelectGym, onViewProfessor }) => {
  const [activeTab, setActiveTab] = useState<'professores' | 'personais'>('professores');
  const [selectedKhan, setSelectedKhan] = useState<number | null>(null);
  const [selectedPersonalCity, setSelectedPersonalCity] = useState<string>('todas');

  // Listen to hash to switch tab to personal-fighters if linked directly
  useEffect(() => {
    const handleHashCheck = () => {
      const hash = window.location.hash;
      if (hash === '#personal-fighters' || hash.includes('personal-fighter')) {
        setActiveTab('personais');
      }
    };

    handleHashCheck();
    window.addEventListener('hashchange', handleHashCheck);
    return () => window.removeEventListener('hashchange', handleHashCheck);
  }, []);

  const memberCountsByKhan = useMemo(() => {
    const counts: Record<number, number> = {};
    PROFESSORS_DATA.forEach((p) => {
      counts[p.khan] = (counts[p.khan] || 0) + 1;
    });
    return counts;
  }, []);

  const leaderProfessor = useMemo(() => PROFESSORS_DATA.find((p) => p.isLeader), []);
  const otherProfessors = useMemo(() => PROFESSORS_DATA.filter((p) => !p.isLeader), []);

  const displayedProfessors = useMemo(() => {
    if (selectedKhan === null) return PROFESSORS_DATA;
    return PROFESSORS_DATA.filter((p) => p.khan === selectedKhan);
  }, [selectedKhan]);

  const filteredPersonalFighters = useMemo(() => {
    if (selectedPersonalCity === 'todas') return PERSONAL_FIGHTERS_DATA;
    return PERSONAL_FIGHTERS_DATA.filter((p) => p.city === selectedPersonalCity);
  }, [selectedPersonalCity]);

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

  const renderProfessorCard = (prof: typeof PROFESSORS_DATA[0], isSpotlight = false) => {
    const gyms = getGymsForProfessor(prof.gymIds);
    const rank = getKhanRank(prof.khan);
    const isSpecialHighlight = isSpotlight || prof.isLeader;

    return (
      <article
        key={prof.id}
        id={`professor-${prof.id}`}
        className={`flex flex-col h-full rounded-2xl bg-gradient-to-b from-[#131318] via-[#0f0f13] to-[#0a0a0d] border ${
          isSpecialHighlight
            ? 'border-red-600/70 shadow-[0_0_30px_rgba(220,38,38,0.22)] ring-1 ring-red-500/40 hover:border-red-400'
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f13] via-transparent to-black/40 pointer-events-none" />

          {/* Thai decorative border line on image base */}
          <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-600/70 to-transparent" />

          {/* Khan Prajied badge on top-left of photo */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <PrajiedBadge level={prof.khan} showRankTitle={false} size="sm" />
          </div>

          {/* Nickname or Leader pill on bottom-right of photo */}
          {prof.isLeader ? (
            <div className="absolute bottom-2.5 right-2.5 z-10">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-white font-fight text-[11px] sm:text-xs tracking-wider uppercase shadow-lg border border-red-400/60 bg-gradient-to-r from-red-600 to-red-700 shadow-red-600/30 backdrop-blur-sm">
                <Crown size={11} className="text-yellow-400" />
                LÍDER • {prof.nickname || prof.name}
              </span>
            </div>
          ) : prof.nickname ? (
            <div className="absolute bottom-2.5 right-2.5 z-10">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-white font-fight text-[11px] sm:text-xs tracking-wider uppercase shadow-lg border border-red-400/40 bg-red-600/90 backdrop-blur-sm">
                <Award size={11} />
                {prof.nickname}
              </span>
            </div>
          ) : null}
        </div>

        {/* Card Content - standardized flex distribution */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Professor name & title */}
            <div className="mb-3">
              <h3 className="font-fight text-xl sm:text-2xl text-white uppercase tracking-wide group-hover:text-red-400 transition-colors leading-tight">
                {prof.name}
                {prof.nickname && (
                  <span className="text-red-500 ml-1.5 text-lg sm:text-xl font-normal">
                    ({prof.nickname})
                  </span>
                )}
              </h3>

              <div className="mt-1 flex items-center justify-between gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-semibold block">
                  {prof.roleTitle}
                </span>
              </div>

              {/* Khan subtle rank subtitle */}
              <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                <span 
                  className="w-2 h-2 rounded-full inline-block flex-shrink-0" 
                  style={{ backgroundColor: rank.primaryColor === '#18181b' ? '#71717a' : rank.primaryColor }} 
                />
                <span>{rank.level}º Khan • {rank.colorName}</span>
              </div>
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
            ) : gyms.length > 0 ? (
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
            ) : (
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-semibold flex items-center gap-1.5 mb-1.5">
                  <Shield size={12} className="text-red-500" />
                  Corpo Docente Pride:
                </span>
                <div className="p-2 rounded-md bg-zinc-900/60 border border-zinc-800/80 text-[11px] text-zinc-400 leading-snug">
                  Instrutor atuante na preparação física e técnica da equipe.
                </div>
              </div>
            )}
          </div>

          {/* Ações do Professor: Contato Direto & Ver mais... */}
          <div className="pt-3 border-t border-zinc-800/80 mt-3 space-y-2">
            {prof.phoneRaw && (
              <a
                href={getProfessorWhatsAppUrl(prof)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 border border-emerald-500/60 hover:border-emerald-400 text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-sm group/wpp"
                aria-label={`Conversar no WhatsApp com o professor ${prof.name}`}
              >
                <MessageCircle size={14} className="text-white group-hover/wpp:scale-110 transition-transform" />
                <span>WhatsApp: {prof.phoneDisplay}</span>
              </a>
            )}

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
  };

  return (
    <section
      id="nossa-equipe"
      className="scroll-mt-24 relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#080809] border-t border-zinc-900 overflow-hidden"
      aria-labelledby="team-heading"
    >
      {/* Anchor for personal-fighters hash navigation */}
      <div id="personal-fighters" className="scroll-mt-28 -mt-28 absolute pointer-events-none" aria-hidden="true" />

      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[650px] h-96 sm:h-[650px] bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <Users size={14} />
            <span>Corpo Docente & Especialistas Pride</span>
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
              Com atenção à técnica, à segurança e ao desenvolvimento individual, nossos professores acompanham cada etapa dessa jornada.
            </p>
          </div>
        </div>

        {/* Navigation Tabs between Team and Personal Fighters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <button
            type="button"
            onClick={() => setActiveTab('professores')}
            className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-fight text-base sm:text-lg uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === 'professores'
                ? 'bg-red-600 text-white shadow-red-glow border border-red-500'
                : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Users size={18} />
            <span>Professores & Instrutores ({PROFESSORS_DATA.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('personais')}
            className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-fight text-base sm:text-lg uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === 'personais'
                ? 'bg-red-600 text-white shadow-red-glow border border-red-500'
                : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Flame size={18} />
            <span>Personal Fighters ({PERSONAL_FIGHTERS_DATA.length})</span>
          </button>
        </div>

        {/* TAB 1: PROFESSORES & INSTRUTORES */}
        {activeTab === 'professores' && (
          <div className="animate-in fade-in duration-300">
            {/* Interactive Khan Graduation Showcase (Prajied Scale) */}
            <KhanGraduationShowcase
              selectedKhan={selectedKhan}
              onSelectKhan={setSelectedKhan}
              memberCountsByKhan={memberCountsByKhan}
            />

            {/* Active Filter Notification Bar */}
            {selectedKhan !== null && (
              <div className="mb-8 p-3 sm:p-4 rounded-xl bg-red-950/40 border border-red-800/60 flex items-center justify-between gap-3 text-xs sm:text-sm text-zinc-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span>
                    Exibindo <strong>{displayedProfessors.length} {displayedProfessors.length === 1 ? 'membro' : 'membros'}</strong> com graduação <strong>{selectedKhan}º Khan ({getKhanRank(selectedKhan).colorName})</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedKhan(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs transition-colors"
                >
                  <X size={13} />
                  <span>Limpar filtro</span>
                </button>
              </div>
            )}

            {/* Filtered View: When a specific Khan is selected */}
            {selectedKhan !== null ? (
              displayedProfessors.length === 1 ? (
                <div className="flex justify-center max-w-sm sm:max-w-md mx-auto">
                  {renderProfessorCard(displayedProfessors[0])}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
                  {displayedProfessors.map((prof) => renderProfessorCard(prof))}
                </div>
              )
            ) : (
              /* Default View: Leader Spotlight (Renan) centered at top, followed by 12 instructors in perfect 4-column grid */
              <div className="space-y-12">
                {/* 1. Leader Spotlight (Renan Hulkinho) */}
                {leaderProfessor && (
                  <div className="flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-950/80 via-red-900/60 to-red-950/80 border border-red-500/50 text-red-300 text-xs font-mono uppercase tracking-widest mb-4 font-bold shadow-lg shadow-red-950/50">
                      <Crown size={15} className="text-yellow-400" />
                      <span>Liderança Técnica & Fundador da Pride</span>
                    </div>

                    <div className="w-full max-w-sm sm:max-w-md">
                      {renderProfessorCard(leaderProfessor, true)}
                    </div>
                  </div>
                )}

                {/* 2. Section Subtitle for Team Instructors (Exact 12 members = 3 complete rows of 4) */}
                <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-red-400 font-bold block mb-1">
                      Corpo Docente & Graduados
                    </span>
                    <h3 className="font-fight text-2xl sm:text-3xl text-white uppercase tracking-wide">
                      Professores & Instrutores da Equipe
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-zinc-400 bg-zinc-900/90 px-3.5 py-1.5 rounded-lg border border-zinc-800">
                    {otherProfessors.length} Instrutores no Vale do Paraíba
                  </span>
                </div>

                {/* 3. The 12 Professors in a perfectly balanced 4-column grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
                  {otherProfessors.map((prof) => renderProfessorCard(prof))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PERSONAL FIGHTERS */}
        {activeTab === 'personais' && (
          <div className="animate-in fade-in duration-300">
            {/* Personal Fighters Header Banner */}
            <div className="mb-10 p-6 sm:p-8 rounded-2xl bg-[#111116] border border-zinc-800/90 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-600/60 to-transparent" />
              
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-mono uppercase tracking-wider mb-2.5 font-semibold">
                  <Flame size={13} />
                  <span>Aulas Particulares & Treinamento Individual</span>
                </div>
                <h3 className="font-fight text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-wide leading-none">
                  TREINE COM UM <span className="text-red-500">PERSONAL FIGHTER DA PRIDE</span>
                </h3>
                <p className="text-zinc-300 text-xs sm:text-sm mt-3 leading-relaxed">
                  Treinos 100% personalizados focados nos seus objetivos individuais: evolução técnica acelerada, condicionamento de alta performance, queima calórica e autodefesa. Escolha o instrutor da sua cidade e entre em contato direto pelo WhatsApp.
                </p>
              </div>

              {/* City filter tabs */}
              <div className="mt-6 pt-5 border-t border-zinc-800/80 flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono uppercase text-zinc-400 mr-2">Filtrar por cidade:</span>
                {['todas', 'Jacareí', 'São José dos Campos'].map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setSelectedPersonalCity(city)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                      selectedPersonalCity === city
                        ? 'bg-red-600 text-white shadow-md shadow-red-950/60 ring-2 ring-red-500/50'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {city === 'todas' ? 'Todas as Cidades' : city}
                  </button>
                ))}
              </div>
            </div>

            {/* Personal Fighters Cards Grid: Exact same card design as professors, with city, price, khan, etc. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
              {filteredPersonalFighters.map((fighter) => {
                const rank = getKhanRank(fighter.khan);
                const whatsappUrl = getPersonalFighterWhatsAppUrl(fighter);

                return (
                  <article
                    key={fighter.id}
                    id={`personal-${fighter.id}`}
                    className="flex flex-col h-full rounded-2xl bg-gradient-to-b from-[#131318] via-[#0f0f13] to-[#0a0a0d] border border-zinc-800 hover:border-red-600/60 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden focus-within:ring-2 focus-within:ring-red-500"
                  >
                    {/* Photo container with identical aspect ratio and badges */}
                    <div className="relative w-full aspect-[4/5] bg-zinc-950 overflow-hidden flex-shrink-0">
                      <img
                        src={fighter.photoUrl}
                        alt={`Foto do personal fighter ${fighter.name}`}
                        loading="lazy"
                        decoding="async"
                        style={{ objectPosition: fighter.photoPosition || 'center 15%' }}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />

                      {/* Gradient overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f13] via-transparent to-black/40 pointer-events-none" />

                      {/* Thai decorative border line */}
                      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-600/70 to-transparent" />

                      {/* Khan Prajied badge on top-left of photo */}
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <PrajiedBadge level={fighter.khan} showRankTitle={false} size="sm" />
                      </div>

                      {/* Personal Fighter tag on bottom-right of photo */}
                      <div className="absolute bottom-2.5 right-2.5 z-10">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-white font-fight text-xs tracking-wider uppercase shadow-lg border border-red-400/40 bg-red-600/90 backdrop-blur-sm">
                          <Flame size={12} className="text-yellow-300" />
                          PERSONAL FIGHTER
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Name & Role */}
                        <div className="mb-3">
                          <h3 className="font-fight text-2xl text-white uppercase tracking-wide group-hover:text-red-400 transition-colors leading-tight">
                            {fighter.name}
                            {fighter.nickname && (
                              <span className="text-red-500 ml-1.5 font-normal">
                                ({fighter.nickname})
                              </span>
                            )}
                          </h3>

                          <div className="mt-1 flex items-center justify-between gap-2">
                            <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-semibold block">
                              {fighter.roleTitle || 'Personal Fighter'}
                            </span>
                          </div>

                          {/* Khan rank subtitle */}
                          <div className="mt-1 flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                            <span 
                              className="w-2 h-2 rounded-full inline-block flex-shrink-0" 
                              style={{ backgroundColor: rank.primaryColor === '#18181b' ? '#71717a' : rank.primaryColor }} 
                            />
                            <span>{rank.level}º Khan • {rank.colorName}</span>
                          </div>
                        </div>

                        {/* City / Location */}
                        <div className="flex items-center gap-1.5 text-xs text-zinc-300 mb-2.5">
                          <MapPin size={13} className="text-red-500 flex-shrink-0" />
                          <span className="font-medium">{fighter.city}</span>
                        </div>

                        {/* WhatsApp Direct Contact Box */}
                        {fighter.phoneDisplay && (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 mb-3.5">
                            <Phone size={13} className="text-emerald-400 flex-shrink-0" />
                            <span className="font-mono text-xs font-semibold text-zinc-200">{fighter.phoneDisplay}</span>
                            <span className="text-[10px] text-emerald-400 font-semibold ml-auto uppercase tracking-wide">WhatsApp Direto</span>
                          </div>
                        )}

                        {/* Price box with clear breakdown */}
                        <div className="p-3.5 rounded-xl bg-gradient-to-b from-emerald-950/25 via-zinc-900/40 to-zinc-950/60 border border-emerald-800/40 mb-4">
                          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-emerald-900/40">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
                                <Flame size={12} className="text-yellow-400" />
                                Investimento Personal
                              </span>
                              {fighter.priceNote && (
                                <span className="text-[10px] text-zinc-400">
                                  {fighter.priceNote}
                                </span>
                              )}
                            </div>
                            <span className="font-fight text-lg sm:text-xl text-emerald-300 tracking-wide">
                              {fighter.price}
                            </span>
                          </div>

                          {fighter.pricingPlan && (
                            <div className="space-y-2 pt-1 text-xs">
                              {/* Planos Semanais */}
                              <div className="grid grid-cols-3 gap-1.5 text-center">
                                <div className="p-1.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80">
                                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">1x / sem</span>
                                  <span className="font-fight text-sm text-zinc-100">{fighter.pricingPlan.frequency1x}</span>
                                </div>
                                <div className="p-1.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80">
                                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">2x / sem</span>
                                  <span className="font-fight text-sm text-zinc-100">{fighter.pricingPlan.frequency2x}</span>
                                </div>
                                <div className="p-1.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80">
                                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">3x / sem</span>
                                  <span className="font-fight text-sm text-zinc-100">{fighter.pricingPlan.frequency3x}</span>
                                </div>
                              </div>

                              {/* Aulas Avulsas & Experimentais */}
                              <div className="grid grid-cols-2 gap-1.5 text-center">
                                <div className="p-1.5 rounded-lg bg-zinc-950/50 border border-zinc-800/60 flex items-center justify-between px-2.5">
                                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Avulsa:</span>
                                  <span className="font-fight text-xs text-white">{fighter.pricingPlan.singleClass}</span>
                                </div>
                                <div className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 flex items-center justify-between px-2.5">
                                  <span className="text-[10px] font-mono text-emerald-400 uppercase">Experimental:</span>
                                  <span className="font-fight text-xs text-emerald-300">{fighter.pricingPlan.trialClass}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Schedule Warning note (Renan) */}
                          {fighter.scheduleNote && (
                            <div className="mt-2.5 pt-2 border-t border-emerald-900/40 flex items-center gap-1.5 text-[11px] text-amber-300 font-medium bg-amber-950/30 px-2 py-1.5 rounded-lg border border-amber-800/40">
                              <Clock size={12} className="text-amber-400 flex-shrink-0" />
                              <span>{fighter.scheduleNote}</span>
                            </div>
                          )}
                        </div>

                        {/* Bio description */}
                        {fighter.bio && (
                          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-4">
                            {fighter.bio}
                          </p>
                        )}

                        {/* Highlight badges */}
                        {fighter.highlightBadges && fighter.highlightBadges.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {fighter.highlightBadges.map((badge, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300"
                              >
                                {badge}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action CTA: Direct contact button */}
                      <div className="pt-4 border-t border-zinc-800/80 mt-auto">
                        {whatsappUrl ? (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-fight text-sm tracking-wider uppercase transition-all shadow-md group/btn"
                          >
                            <MessageCircle size={16} className="transition-transform group-hover/btn:scale-110" />
                            <span>Agendar no WhatsApp ({fighter.nickname || fighter.name})</span>
                          </a>
                        ) : (
                          <a
                            href="#onde-treinar"
                            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold tracking-wider uppercase transition-colors"
                          >
                            <MapPin size={14} className="text-red-500" />
                            <span>Consultar na Unidade</span>
                          </a>
                        )}
                      </div>

                    </div>
                  </article>
                );
              })}
            </div>

            {/* Note to Add New Personals */}
            <div className="mt-10 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-center text-xs text-zinc-400">
              <span className="text-red-400 font-semibold uppercase tracking-wider mr-1">Nota:</span>
              Os dados dos personal fighters podem ser facilmente gerenciados e expandidos diretamente no arquivo de dados da equipe (<code className="text-zinc-300 font-mono">gymsAndTeamData.ts</code>).
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
