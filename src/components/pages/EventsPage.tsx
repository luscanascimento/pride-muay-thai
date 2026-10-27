import React, { useState, useEffect, useCallback } from 'react';
import { Search, Calendar, Filter } from 'lucide-react';
import { eventsService, PublicEventsFilter } from '../../services/eventsService';
import { DbEvent, EventCategory } from '../../types/database';
import { EventTable } from '../events/EventTable';
import { Pagination } from '../ui/Pagination';
import { buildHashUrl, navigateTo } from '../../utils/routes';

interface EventsPageProps {
  initialSearchParams?: URLSearchParams;
}

export const EventsPage: React.FC<EventsPageProps> = ({ initialSearchParams }) => {
  const getParam = (key: string, fallback: string = '') =>
    initialSearchParams?.get(key) || fallback;

  const [timeframe, setTimeframe] = useState<'upcoming' | 'past' | 'all'>(
    (getParam('timeframe', 'upcoming') as 'upcoming' | 'past' | 'all') || 'upcoming'
  );
  const [category, setCategory] = useState<EventCategory | 'all'>(
    (getParam('category', 'all') as EventCategory | 'all') || 'all'
  );
  const [search, setSearch] = useState<string>(getParam('busca', ''));
  const [page, setPage] = useState<number>(parseInt(getParam('page', '1'), 10) || 1);

  const [events, setEvents] = useState<DbEvent[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync state to URL hash query params
  const updateUrl = useCallback(
    (newParams: { timeframe?: string; category?: string; page?: number; busca?: string }) => {
      const merged = {
        timeframe: newParams.timeframe ?? timeframe,
        category: (newParams.category ?? category) === 'all' ? undefined : (newParams.category ?? category),
        page: (newParams.page ?? page) > 1 ? (newParams.page ?? page) : undefined,
        busca: (newParams.busca ?? search).trim() || undefined,
      };

      const newHash = buildHashUrl('/eventos', merged);
      navigateTo(newHash, { replace: true, smoothScroll: false });
    },
    [timeframe, category, page, search]
  );

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filter: PublicEventsFilter = {
        page,
        pageSize: 10,
        timeframe,
        category,
        search,
      };

      const result = await eventsService.getPublicEvents(filter);
      setEvents(result.data);
      setTotalPages(result.totalPages);
      setTotalCount(result.count);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao carregar eventos.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [page, timeframe, category, search]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleTimeframeChange = (newTimeframe: 'upcoming' | 'past' | 'all') => {
    setTimeframe(newTimeframe);
    setPage(1);
    updateUrl({ timeframe: newTimeframe, page: 1 });
  };

  const handleCategoryChange = (newCategory: EventCategory | 'all') => {
    setCategory(newCategory);
    setPage(1);
    updateUrl({ category: newCategory, page: 1 });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    updateUrl({ busca: search, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateUrl({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[70vh]">
      {/* Editorial Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-mono uppercase tracking-wider mb-3 font-semibold">
          <Calendar size={13} />
          <span>Agenda & Publicações Oficiais</span>
        </div>
        <h1 className="font-fight text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-wider">
          EVENTOS & <span className="text-red-500">COMPETIÇÕES</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
          Acompanhe competições, cerimônias de graduação, seminários técnicos e treinos especiais da equipe Pride Muay Thai. Informações oficiais, inscrições e trajetória.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-8 p-4 sm:p-6 rounded-2xl bg-[#0c0c10] border border-zinc-800 shadow-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Timeframe tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-zinc-950 border border-zinc-800 overflow-x-auto">
          <button
            type="button"
            onClick={() => handleTimeframeChange('upcoming')}
            className={`px-3 sm:px-4 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-colors whitespace-nowrap ${
              timeframe === 'upcoming'
                ? 'bg-red-600 text-white font-semibold shadow-red-glow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Próximos
          </button>
          <button
            type="button"
            onClick={() => handleTimeframeChange('past')}
            className={`px-3 sm:px-4 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-colors whitespace-nowrap ${
              timeframe === 'past'
                ? 'bg-red-600 text-white font-semibold shadow-red-glow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Anteriores
          </button>
          <button
            type="button"
            onClick={() => handleTimeframeChange('all')}
            className={`px-3 sm:px-4 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-colors whitespace-nowrap ${
              timeframe === 'all'
                ? 'bg-red-600 text-white font-semibold shadow-red-glow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Todos
          </button>
        </div>

        {/* Category selector & Search form */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value as EventCategory | 'all')}
              aria-label="Filtrar por categoria"
              className="w-full sm:w-auto appearance-none bg-zinc-950 border border-zinc-800 rounded-sm text-xs font-mono uppercase tracking-wider text-zinc-300 py-2.5 pl-3.5 pr-8 hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
            >
              <option value="all">Todas as Categorias</option>
              <option value="competition">Competições</option>
              <option value="graduation">Graduações</option>
              <option value="seminar">Seminários</option>
              <option value="special_training">Treinos Especiais</option>
              <option value="other">Geral / Outros</option>
            </select>
            <Filter size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-grow sm:flex-grow-0 sm:min-w-[240px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-xs text-zinc-200 py-2.5 pl-9 pr-3 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </form>
        </div>
      </div>

      {/* Events Table / Card list */}
      <EventTable
        events={events}
        isLoading={isLoading}
        error={error}
        onRetry={fetchEvents}
      />

      {/* Pagination */}
      {!isLoading && !error && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Results count note */}
      {!isLoading && !error && events.length > 0 && (
        <p className="text-center text-xs font-mono text-zinc-500 mt-2">
          Exibindo {events.length} de {totalCount} {totalCount === 1 ? 'evento' : 'eventos'}
        </p>
      )}
    </div>
  );
};
