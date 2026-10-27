import React from 'react';
import { EventCategory, EventStatus } from '../../types/database';
import { EVENT_CATEGORY_LABELS, EVENT_STATUS_LABELS } from '../../constants/events';

interface EventStatusBadgeProps {
  status?: EventStatus;
  category?: EventCategory;
  className?: string;
}

export const EventStatusBadge: React.FC<EventStatusBadgeProps> = ({
  status,
  category,
  className = '',
}) => {
  if (category) {
    const label = EVENT_CATEGORY_LABELS[category] || category;
    const colorMap: Record<EventCategory, string> = {
      competition: 'bg-red-950/60 text-red-400 border-red-800/60',
      graduation: 'bg-blue-950/60 text-blue-400 border-blue-800/60',
      seminar: 'bg-amber-950/60 text-amber-400 border-amber-800/60',
      special_training: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
      other: 'bg-zinc-900 text-zinc-300 border-zinc-700',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider font-semibold border ${colorMap[category] || colorMap.other} ${className}`}
      >
        {label}
      </span>
    );
  }

  if (status) {
    const label = EVENT_STATUS_LABELS[status] || status;
    const statusMap: Record<EventStatus, string> = {
      published: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
      draft: 'bg-zinc-900/80 text-zinc-400 border-zinc-700/80',
      cancelled: 'bg-red-950/80 text-red-400 border-red-800',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider font-semibold border ${statusMap[status] || statusMap.draft} ${className}`}
      >
        {label}
      </span>
    );
  }

  return null;
};
