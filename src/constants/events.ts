import { EventCategory, EventStatus } from '../types/database';

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  competition: 'Competição',
  graduation: 'Graduação',
  seminar: 'Seminário',
  special_training: 'Treino Especial',
  other: 'Geral',
};

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  published: 'Publicado',
  draft: 'Rascunho',
  cancelled: 'Cancelado',
};
