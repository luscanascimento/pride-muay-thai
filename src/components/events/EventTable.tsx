import React from 'react';
import { Calendar, MapPin, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';
import { DbEvent } from '../../types/database';
import { EventStatusBadge } from './EventStatusBadge';
import { EventCard } from './EventCard';
import { formatDateTime } from '../../utils/date';
import { navigateTo } from '../../utils/routes';
import { getGoogleMapsSearchUrl } from '../../utils/maps';

interface EventTableProps {
  events: DbEvent[];
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  onNavigateToDetail?: (slug: string) => void;
}

export const EventTable: React.FC<EventTableProps> = ({
  events,
  isLoading,
  error,
  onRetry,
  onNavigateToDetail,
}) => {
  const handleDetail = (slug: string) => {
    if (onNavigateToDetail) {
      onNavigateToDetail(slug);
    } else {
      navigateTo(`/eventos/${slug}`);
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center text-center">
        <RefreshCw size={32} className="animate-spin text-red-500 mb-4" />
        <p className="text-zinc-400 font-mono text-sm">Carregando eventos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 px-6 rounded-2xl bg-red-950/20 border border-red-900/50 text-center max-w-lg mx-auto">
        <AlertCircle size={36} className="text-red-500 mx-auto mb-3" />
        <h3 className="font-fight text-xl text-white uppercase">Não foi possível carregar os eventos</h3>
        <p className="text-zinc-400 text-sm mt-2 mb-6">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase font-semibold rounded-sm transition-colors"
          >
            <RefreshCw size={14} />
            <span>Tentar novamente</span>
          </button>
        )}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="py-16 px-4 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800">
        <p className="text-zinc-400 font-fight text-xl uppercase">Nenhum evento encontrado</p>
        <p className="text-zinc-500 text-xs sm:text-sm mt-1">
          Não há eventos disponíveis para os filtros selecionados no momento.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Mobile view: Cards list */}
      <div className="grid grid-cols-1 md:hidden gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} onNavigate={handleDetail} />
        ))}
      </div>

      {/* Desktop view: Table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-zinc-800 bg-[#0c0c10]/80 shadow-2xl backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/60 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              <th scope="col" className="py-3.5 px-4">Categoria</th>
              <th scope="col" className="py-3.5 px-4">Título & Resumo</th>
              <th scope="col" className="py-3.5 px-4 whitespace-nowrap">Data</th>
              <th scope="col" className="py-3.5 px-4">Local</th>
              <th scope="col" className="py-3.5 px-4">Situação</th>
              <th scope="col" className="py-3.5 px-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-sm">
            {events.map((event) => {
              return (
                <tr
                  key={event.id}
                  className="hover:bg-zinc-800/30 transition-colors group"
                >
                  <td className="py-4 px-4 align-top whitespace-nowrap">
                    <EventStatusBadge category={event.category} />
                  </td>
                  <td className="py-4 px-4 align-top max-w-md">
                    <a
                      href={`#/eventos/${event.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleDetail(event.slug);
                      }}
                      className="font-fight text-lg text-white uppercase group-hover:text-red-500 transition-colors block leading-snug"
                    >
                      {event.title}
                    </a>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {event.summary}
                    </p>
                  </td>
                  <td className="py-4 px-4 align-top whitespace-nowrap text-xs text-zinc-300">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Calendar size={13} className="text-red-500" />
                      <span>{formatDateTime(event.event_date)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 align-top text-xs text-zinc-300">
                    <div className="flex items-center gap-1.5 max-w-[200px] truncate">
                      <MapPin size={13} className="text-red-500 flex-shrink-0" />
                      <a
                        href={getGoogleMapsSearchUrl(event.location)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate hover:text-red-400 hover:underline transition-colors"
                        title="Abrir localização no Google Maps"
                        aria-label={`Abrir ${event.location} no Google Maps`}
                      >
                        {event.location}
                      </a>
                    </div>
                  </td>
                  <td className="py-4 px-4 align-top whitespace-nowrap">
                    <EventStatusBadge status={event.status} />
                  </td>
                  <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                    <a
                      href={`#/eventos/${event.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleDetail(event.slug);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-sm bg-zinc-900 border border-zinc-800 hover:border-red-500/60 text-zinc-300 hover:text-white font-mono text-xs uppercase transition-colors"
                    >
                      <span>Ver detalhes</span>
                      <ChevronRight size={13} className="text-red-500" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
