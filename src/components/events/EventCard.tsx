import React from 'react';
import { Calendar, MapPin, ChevronRight, AlertTriangle, Tag } from 'lucide-react';
import { DbEvent } from '../../types/database';
import { EventStatusBadge } from './EventStatusBadge';
import { formatDateTime } from '../../utils/date';
import { navigateTo } from '../../utils/routes';
import { getGoogleMapsSearchUrl } from '../../utils/maps';

interface EventCardProps {
  event: DbEvent;
  onNavigate?: (slug: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onNavigate }) => {
  const isCancelled = event.status === 'cancelled';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(event.slug);
    } else {
      navigateTo(`/eventos/${event.slug}`);
    }
  };

  return (
    <div
      className={`group relative p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border transition-all duration-300 hover:border-red-500/50 hover:shadow-xl ${
        isCancelled ? 'border-red-900/60 opacity-90' : 'border-zinc-800/80'
      }`}
    >
      {/* Badges bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <EventStatusBadge category={event.category} />
        {isCancelled && <EventStatusBadge status="cancelled" />}
      </div>

      {/* Cancellation alert */}
      {isCancelled && (
        <div className="mb-3 flex items-center gap-2 p-2 rounded bg-red-950/40 border border-red-800/50 text-red-400 text-xs">
          <AlertTriangle size={14} className="flex-shrink-0" />
          <span>Evento cancelado pela organização</span>
        </div>
      )}

      {/* Title */}
      <h3 className="font-fight text-xl sm:text-2xl text-white uppercase tracking-wide group-hover:text-red-500 transition-colors line-clamp-2">
        <a href={`#/eventos/${event.slug}`} onClick={handleClick}>
          {event.title}
        </a>
      </h3>

      {/* Summary */}
      {(event.summary || event.description) && (
        <p className="text-zinc-400 text-sm mt-2 line-clamp-3 leading-relaxed">
          {event.summary || event.description}
        </p>
      )}

      {/* Details metadata */}
      <div className="mt-4 pt-4 border-t border-zinc-800/80 flex flex-col gap-2 text-xs text-zinc-300">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-red-500 flex-shrink-0" />
          <span>{formatDateTime(event.event_date)}</span>
        </div>
        {event.price && (
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-emerald-500 flex-shrink-0" />
            <span className="font-semibold text-emerald-400">{event.price}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-red-500 flex-shrink-0" />
          <a
            href={getGoogleMapsSearchUrl(event.location)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="truncate hover:text-red-400 hover:underline transition-colors"
            title="Abrir localização no Google Maps"
            aria-label={`Abrir ${event.location} no Google Maps`}
          >
            {event.location}
          </a>
        </div>
      </div>

      {/* Action */}
      <div className="mt-4 pt-3 flex justify-end">
        <a
          href={`#/eventos/${event.slug}`}
          onClick={handleClick}
          className="inline-flex items-center gap-1 text-xs font-mono font-semibold uppercase text-red-500 group-hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 rounded p-1"
        >
          <span>Ver detalhes</span>
          <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
};
