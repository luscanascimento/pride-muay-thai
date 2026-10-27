import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DbEvent, EventCategory, EventStatus } from '../types/database';

export interface PaginatedResult<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PublicEventsFilter {
  page?: number;
  pageSize?: number;
  timeframe?: 'upcoming' | 'past' | 'all';
  category?: EventCategory | 'all';
  search?: string;
}

export interface AdminEventsFilter {
  page?: number;
  pageSize?: number;
  status?: EventStatus | 'all';
  category?: EventCategory | 'all';
  search?: string;
}

export interface CreateEventInput {
  slug: string;
  category: EventCategory;
  title: string;
  summary: string;
  description: string;
  event_date: string;
  end_date?: string | null;
  location: string;
  requirements?: string | null;
  registration_info?: string | null;
  registration_url?: string | null;
  contact?: string | null;
  status?: EventStatus;
  published_at?: string | null;
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  id: string;
}

export const eventsService = {
  /**
   * Lista eventos para visualização pública com paginação server-side
   */
  async getPublicEvents(filter: PublicEventsFilter = {}): Promise<PaginatedResult<DbEvent>> {
    if (!isSupabaseConfigured) {
      return { data: [], count: 0, page: 1, pageSize: 10, totalPages: 1 };
    }

    const page = Math.max(1, filter.page || 1);
    const pageSize = filter.pageSize || 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('events')
      .select('*', { count: 'exact' });

    // Filtragem temporal (próximos vs passados)
    const nowIso = new Date().toISOString();
    if (filter.timeframe === 'upcoming') {
      query = query
        .gte('event_date', nowIso)
        .eq('status', 'published')
        .order('event_date', { ascending: true });
    } else if (filter.timeframe === 'past') {
      query = query
        .lt('event_date', nowIso)
        .eq('status', 'published')
        .order('event_date', { ascending: false });
    } else {
      // 'all': exibe publicados ou cancelados
      query = query.order('event_date', { ascending: false });
    }

    if (filter.category && filter.category !== 'all') {
      query = query.eq('category', filter.category);
    }

    if (filter.search?.trim()) {
      query = query.ilike('title', `%${filter.search.trim()}%`);
    }

    const { data, count, error } = await query.range(from, to);

    if (error) {
      throw new Error(`Erro ao buscar eventos: ${error.message}`);
    }

    const totalCount = count || 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return {
      data: data || [],
      count: totalCount,
      page,
      pageSize,
      totalPages,
    };
  },

  /**
   * Obtém detalhes de um evento público pelo slug
   */
  async getPublicEventBySlug(slug: string): Promise<DbEvent | null> {
    if (!isSupabaseConfigured) return null;

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      throw new Error(`Erro ao buscar detalhe do evento: ${error.message}`);
    }

    return data;
  },

  /**
   * Lista eventos para o painel administrativo (inclui rascunhos, cancelados e publicados)
   */
  async getAdminEvents(filter: AdminEventsFilter = {}): Promise<PaginatedResult<DbEvent>> {
    if (!isSupabaseConfigured) {
      return { data: [], count: 0, page: 1, pageSize: 10, totalPages: 1 };
    }

    const page = Math.max(1, filter.page || 1);
    const pageSize = filter.pageSize || 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('events')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (filter.status && filter.status !== 'all') {
      query = query.eq('status', filter.status);
    }

    if (filter.category && filter.category !== 'all') {
      query = query.eq('category', filter.category);
    }

    if (filter.search?.trim()) {
      query = query.ilike('title', `%${filter.search.trim()}%`);
    }

    const { data, count, error } = await query.range(from, to);

    if (error) {
      throw new Error(`Erro ao buscar eventos administrativos: ${error.message}`);
    }

    const totalCount = count || 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return {
      data: data || [],
      count: totalCount,
      page,
      pageSize,
      totalPages,
    };
  },

  /**
   * Busca um evento por ID para edição
   */
  async getEventById(id: string): Promise<DbEvent | null> {
    if (!isSupabaseConfigured) return null;

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Erro ao obter evento: ${error.message}`);
    }

    return data;
  },

  /**
   * Cria um novo evento
   */
  async createEvent(input: CreateEventInput): Promise<DbEvent> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase não configurado.');
    }

    const status = input.status || 'draft';
    const published_at = status === 'published' ? new Date().toISOString() : null;

    const { data, error } = await supabase
      .from('events')
      .insert({
        ...input,
        status,
        published_at,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar evento: ${error.message}`);
    }

    return data;
  },

  /**
   * Atualiza um evento existente
   */
  async updateEvent(input: UpdateEventInput): Promise<DbEvent> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase não configurado.');
    }

    const { id, ...updates } = input;

    // Se o evento está sendo publicado pela primeira vez, definir published_at
    let published_at = updates.published_at;
    if (updates.status === 'published' && !published_at) {
      const existing = await this.getEventById(id);
      published_at = existing?.published_at || new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('events')
      .update({
        ...updates,
        ...(published_at !== undefined ? { published_at } : {}),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar evento: ${error.message}`);
    }

    return data;
  },

  /**
   * Exclui um evento
   */
  async deleteEvent(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase não configurado.');
    }

    const { error } = await supabase.from('events').delete().eq('id', id);

    if (error) {
      throw new Error(`Erro ao excluir evento: ${error.message}`);
    }
  },
};
