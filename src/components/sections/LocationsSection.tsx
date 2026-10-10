import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  MessageCircle,
  Map as MapIcon,
  ExternalLink,
  Users,
  Navigation,
  Info,
} from 'lucide-react';
import { GYMS_DATA, getProfessorsForGym, getGymWhatsAppUrl, getGymExternalMapsUrl } from '../../data/gymsAndTeamData';
import { Gym } from '../../types/gymsAndTeam';
import { GymsMap } from '../maps/GymsMap';

interface LocationsSectionProps {
  selectedGymId?: string | null;
  onSelectGym?: (gymId: string | null) => void;
}

export const LocationsSection: React.FC<LocationsSectionProps> = ({
  selectedGymId: externalSelectedGymId,
  onSelectGym,
}) => {
  const [internalSelectedGymId, setInternalSelectedGymId] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('todas');

  const activeGymId = externalSelectedGymId ?? internalSelectedGymId;

  const handleSelectGym = (gymId: string | null) => {
    setInternalSelectedGymId(gymId);
    if (onSelectGym) {
      onSelectGym(gymId);
    }
  };

  const handleViewOnMap = (gym: Gym) => {
    handleSelectGym(gym.id);
    const mapElement = document.getElementById('mapa-unidades');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleTeacherClick = (e: React.MouseEvent, teacherId: string) => {
    e.preventDefault();
    const element = document.getElementById(`professor-${teacherId}`) || document.getElementById('nossa-equipe');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-red-500', 'ring-offset-2', 'ring-offset-black');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-red-500', 'ring-offset-2', 'ring-offset-black');
      }, 2500);
    }
  };

  // Filter gyms based on selected city tab
  const filteredGyms = GYMS_DATA.filter((gym) => {
    if (selectedCity === 'todas') return true;
    return gym.city === selectedCity;
  });

  const cityCounts = {
    todas: GYMS_DATA.length,
    jacarei: GYMS_DATA.filter((g) => g.city === 'Jacareí').length,
    sjc: GYMS_DATA.filter((g) => g.city === 'São José dos Campos').length,
    santaBranca: GYMS_DATA.filter((g) => g.city === 'Santa Branca').length,
  };

  return (
    <section
      id="onde-treinar"
      className="scroll-mt-24 relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#0a0a0d] border-t border-zinc-900 overflow-hidden"
      aria-labelledby="where-to-train-heading"
    >
      {/* Anchor alias to support legacy #unidades link */}
      <div id="unidades" className="scroll-mt-24 pointer-events-none -mt-24 absolute" aria-hidden="true" />

      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[650px] h-96 sm:h-[650px] bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <MapPin size={14} />
            <span>Rede de Polos & Academias Parceiras</span>
          </div>

          <h2 id="where-to-train-heading" className="font-fight text-4xl sm:text-5xl lg:text-6xl text-white uppercase leading-none">
            ENCONTRE SEU DOJO. <br className="hidden sm:inline" />
            <span className="text-red-500 text-glow-red">COMECE SUA JORNADA.</span>
          </h2>

          <p className="mt-4 text-zinc-300 text-sm sm:text-base leading-relaxed text-balance">
            Existe um lugar para você começar ou continuar sua jornada no Muay Thai. Conheça nossas unidades parceiras, encontre os horários que combinam com sua rotina e venha treinar com a nossa equipe no Vale do Paraíba.
          </p>
        </div>

        {/* Geographic Route Overview (Preserved authentic visual) */}
        <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-[#111116] border border-zinc-800/90 shadow-xl relative overflow-hidden">
          {/* Subtle Thai decorative header */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-600/60 to-transparent" />

          {/* SVG Connecting Route Vector */}
          <div className="hidden md:block relative w-full h-24 mb-4">
            <svg viewBox="0 0 800 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Background dashed route */}
              <path
                d="M 140 50 Q 270 15, 400 35 T 660 50"
                stroke="#27272a"
                strokeWidth="3"
                strokeDasharray="6 6"
              />
              {/* Glowing red active line */}
              <path
                d="M 140 50 Q 270 15, 400 35 T 660 50"
                stroke="#dc2626"
                strokeWidth="2"
                strokeOpacity="0.8"
              />

              {/* Jacareí Node */}
              <circle cx="140" cy="50" r="16" fill="#260e11" stroke="#dc2626" strokeWidth="2.5" />
              <circle cx="140" cy="50" r="6" fill="#ff1e27" className="animate-pulse" />
              <text x="140" y="80" textAnchor="middle" fill="#d4d4d8" fontSize="12" fontFamily="monospace" fontWeight="bold">JACAREÍ</text>

              {/* São José dos Campos Node */}
              <circle cx="400" cy="35" r="16" fill="#260e11" stroke="#dc2626" strokeWidth="2.5" />
              <circle cx="400" cy="35" r="6" fill="#ff1e27" className="animate-pulse" />
              <text x="400" y="65" textAnchor="middle" fill="#d4d4d8" fontSize="12" fontFamily="monospace" fontWeight="bold">SÃO JOSÉ DOS CAMPOS</text>

              {/* Santa Branca Node */}
              <circle cx="660" cy="50" r="16" fill="#260e11" stroke="#dc2626" strokeWidth="2.5" />
              <circle cx="660" cy="50" r="6" fill="#ff1e27" className="animate-pulse" />
              <text x="660" y="80" textAnchor="middle" fill="#d4d4d8" fontSize="12" fontFamily="monospace" fontWeight="bold">SANTA BRANCA</text>
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="font-fight text-xl text-white block">JACAREÍ</span>
              <span className="text-xs text-zinc-400">7 unidades ativas</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="font-fight text-xl text-white block">SÃO JOSÉ DOS CAMPOS</span>
              <span className="text-xs text-zinc-400">2 unidades ativas</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="font-fight text-xl text-white block">SANTA BRANCA</span>
              <span className="text-xs text-zinc-400">1 unidade ativa</span>
            </div>
          </div>
        </div>

        {/* City Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            type="button"
            onClick={() => setSelectedCity('todas')}
            className={`px-4 py-2 rounded-lg font-fight text-base sm:text-lg uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              selectedCity === 'todas'
                ? 'bg-red-600 text-white shadow-red-glow border border-red-500'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Todas as Unidades ({cityCounts.todas})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCity('Jacareí')}
            className={`px-4 py-2 rounded-lg font-fight text-base sm:text-lg uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              selectedCity === 'Jacareí'
                ? 'bg-red-600 text-white shadow-red-glow border border-red-500'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Jacareí ({cityCounts.jacarei})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCity('São José dos Campos')}
            className={`px-4 py-2 rounded-lg font-fight text-base sm:text-lg uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              selectedCity === 'São José dos Campos'
                ? 'bg-red-600 text-white shadow-red-glow border border-red-500'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            São José dos Campos ({cityCounts.sjc})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCity('Santa Branca')}
            className={`px-4 py-2 rounded-lg font-fight text-base sm:text-lg uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              selectedCity === 'Santa Branca'
                ? 'bg-red-600 text-white shadow-red-glow border border-red-500'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Santa Branca ({cityCounts.santaBranca})
          </button>
        </div>

        {/* Standardized Gym Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch mb-16">
          {filteredGyms.map((gym) => {
            const professors = getProfessorsForGym(gym.id);
            const whatsappUrl = getGymWhatsAppUrl(gym);
            const isSelected = activeGymId === gym.id;

            return (
              <article
                key={gym.id}
                id={`gym-card-${gym.id}`}
                className={`flex flex-col h-full rounded-2xl bg-gradient-to-b from-[#131318] via-[#0f0f13] to-[#0a0a0d] border ${
                  isSelected ? 'border-red-500 shadow-red-glow ring-2 ring-red-500' : 'border-zinc-800 hover:border-red-600/60'
                } p-6 sm:p-7 shadow-xl transition-all duration-300 relative group overflow-hidden`}
              >
                {/* Subtle decorative top line */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-600/40 to-transparent group-hover:via-red-600 transition-colors" />

                {/* Card Top: City Tag & Title */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-red-400 font-semibold flex items-center gap-1.5">
                      <Navigation size={13} />
                      {gym.city}
                    </span>

                    {gym.coordinates ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                        <MapPin size={10} />
                        No Mapa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
                        Endereço no WhatsApp
                      </span>
                    )}
                  </div>

                  <h3 className="font-fight text-2xl sm:text-3xl text-white uppercase tracking-wide group-hover:text-red-400 transition-colors leading-tight">
                    {gym.name}
                  </h3>

                  {gym.alias && (
                    <span className="text-xs text-zinc-400 block mt-0.5 font-medium">
                      {gym.alias}
                    </span>
                  )}

                  {/* Associated Teachers */}
                  {professors.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1 mr-1">
                        <Users size={12} className="text-red-500" />
                        Prof.:
                      </span>
                      {professors.map((p) => (
                        <a
                          key={p.id}
                          href={`#professor-${p.id}`}
                          onClick={(e) => handleTeacherClick(e, p.id)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 hover:border-red-600/80 hover:bg-red-950/40 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
                          title={`Ver perfil do professor ${p.name}`}
                        >
                          <span>{p.name}</span>
                          {p.nickname && <span className="text-red-400">({p.nickname})</span>}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Address info */}
                  <div className="mt-4 pt-3 border-t border-zinc-800/80">
                    {gym.address ? (
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs sm:text-sm text-zinc-300 flex items-start gap-2 leading-relaxed">
                          <MapPin size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                          <span>{gym.address}</span>
                        </p>
                        <a
                          href={getGymExternalMapsUrl(gym)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-500 hover:text-red-400 p-1 flex-shrink-0 transition-colors"
                          title="Abrir localização no Google Maps"
                          aria-label={`Abrir ${gym.name} no Google Maps`}
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-400 flex items-start gap-2 italic">
                        <Info size={14} className="text-zinc-500 flex-shrink-0 mt-0.5" />
                        <span>Endereço e orientações de acesso fornecidos diretamente no WhatsApp.</span>
                      </p>
                    )}
                  </div>

                  {/* Schedules Block */}
                  <div className="mt-4 p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-1.5">
                      <Clock size={13} />
                      Horários de Treino:
                    </span>

                    {gym.schedules.length > 0 ? (
                      <ul className="space-y-1">
                        {gym.schedules.map((sched, idx) => (
                          <li key={idx} className="text-xs text-zinc-200 flex items-center justify-between gap-2">
                            <span className="font-medium text-zinc-300">{sched.days}:</span>
                            <span className="text-zinc-100 font-semibold">{sched.hours}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-zinc-400 italic">
                        Horários em confirmação com a unidade.
                      </p>
                    )}
                  </div>

                  {/* Optional Note (e.g. consolidated hours, CT03 alias) */}
                  {gym.notes && (
                    <div className="mt-3 p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/50 flex items-start gap-2 text-[11px] text-zinc-400">
                      <Info size={13} className="text-zinc-500 flex-shrink-0 mt-0.5" />
                      <span>{gym.notes}</span>
                    </div>
                  )}
                </div>

                {/* Card Bottom: Standardized CTAs */}
                <div className="mt-6 pt-4 border-t border-zinc-800 flex flex-col gap-2.5">
                  {/* WhatsApp button - SPECIFIC TO THIS GYM */}
                  {whatsappUrl ? (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-fight text-base tracking-wider uppercase shadow-md transition-all duration-200 group/btn"
                    >
                      <MessageCircle size={18} className="transition-transform group-hover/btn:scale-110" />
                      <span>Falar com a Academia</span>
                    </a>
                  ) : (
                    <div className="w-full py-2.5 px-4 rounded-lg bg-zinc-800/60 text-zinc-400 font-fight text-base tracking-wider uppercase text-center cursor-not-allowed">
                      Contato em Confirmação
                    </div>
                  )}

                  {/* Secondary Map / Navigation buttons */}
                  {gym.coordinates && (
                    <button
                      type="button"
                      onClick={() => handleViewOnMap(gym)}
                      className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <MapIcon size={14} className="text-red-500" />
                      <span>Ver no Mapa Interativo</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Section Interactive Map */}
        <div id="mapa-unidades" className="scroll-mt-24 pt-4">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h3 className="font-fight text-3xl sm:text-4xl text-white uppercase tracking-wide">
              MAPA INTERATIVO <span className="text-red-500">DAS UNIDADES</span>
            </h3>
            <p className="mt-1 text-zinc-400 text-xs sm:text-sm">
              Navegue pelas unidades confirmadas no Vale do Paraíba. Clique nos marcadores para ver horários e entrar em contato direto.
            </p>
          </div>

          <GymsMap
            gyms={GYMS_DATA}
            selectedGymId={activeGymId}
            onMarkerSelect={handleSelectGym}
          />
        </div>

      </div>
    </section>
  );
};
