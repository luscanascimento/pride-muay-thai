import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Calendar,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { canUserEditEvent } from '../../utils/superAdmins';
import { eventsService, AdminEventsFilter } from '../../services/eventsService';
import { DbEvent, EventCategory, EventStatus } from '../../types/database';
import { EventStatusBadge } from '../events/EventStatusBadge';
import { Pagination } from '../ui/Pagination';
import { formatDateTime } from '../../utils/date';
import { navigateTo } from '../../utils/routes';

export const EventsAdmin: React.FC = () => {
  const { session } = useAuth();
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal de confirmação de exclusão
  const [eventToDelete, setEventToDelete] = useState<DbEvent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal de confirmação de cancelamento
  const [eventToCancel, setEventToCancel] = useState<DbEvent | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filter: AdminEventsFilter = {
        page,
        pageSize: 10,
        status: statusFilter,
        category: categoryFilter,
        search,
      };
      const res = await eventsService.getAdminEvents(filter);
      setEvents(res.data);
      setTotalPages(res.totalPages);
      setTotalCount(res.count);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao listar eventos.');
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, categoryFilter, search]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleTogglePublish = async (event: DbEvent) => {
    if (!canUserEditEvent(session?.user?.id, event)) {
      alert('Permissão negada. Você só pode gerenciar os eventos criados por você.');
      return;
    }
    try {
      const nextStatus: EventStatus = event.status === 'published' ? 'draft' : 'published';
      await eventsService.updateEvent({
        id: event.id,
        status: nextStatus,
      });
      await fetchEvents();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao alterar status de publicação.');
    }
  };

  const handleConfirmCancel = async () => {
    if (!eventToCancel) return;
    if (!canUserEditEvent(session?.user?.id, eventToCancel)) {
      alert('Permissão negada. Você só pode gerenciar os eventos criados por você.');
      setEventToCancel(null);
      return;
    }
    setIsCancelling(true);
    try {
      await eventsService.updateEvent({
        id: eventToCancel.id,
        status: 'cancelled',
      });
      setEventToCancel(null);
      await fetchEvents();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao cancelar evento.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    if (!canUserEditEvent(session?.user?.id, eventToDelete)) {
      alert('Permissão negada. Você só pode gerenciar os eventos criados por você.');
      setEventToDelete(null);
      return;
    }
    setIsDeleting(true);
    try {
      await eventsService.deleteEvent(eventToDelete.id);
      setEventToDelete(null);
      await fetchEvents();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir evento.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {/* Header and New Event button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-fight text-3xl text-white uppercase tracking-wider">
            Gestão de <span className="text-red-500">Eventos</span>
          </h1>
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-400 mt-1">
            Mini-CMS Editorial para Competições e Atividades
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('/admin/eventos/novo')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-sm bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase font-semibold transition-colors shadow-red-glow"
        >
          <Plus size={16} />
          <span>Novo Evento</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as EventStatus | 'all');
                setPage(1);
              }}
              aria-label="Filtrar por status"
              className="appearance-none bg-zinc-900 border border-zinc-800 rounded-sm text-xs font-mono uppercase text-zinc-300 py-2 pl-3 pr-8 hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
            >
              <option value="all">Todos os Status</option>
              <option value="draft">Rascunhos</option>
              <option value="published">Publicados</option>
              <option value="cancelled">Cancelados</option>
            </select>
            <Filter size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>

          {/* Category filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value as EventCategory | 'all');
                setPage(1);
              }}
              aria-label="Filtrar por categoria"
              className="appearance-none bg-zinc-900 border border-zinc-800 rounded-sm text-xs font-mono uppercase text-zinc-300 py-2 pl-3 pr-8 hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
            >
              <option value="all">Todas Categorias</option>
              <option value="competition">Competição</option>
              <option value="graduation">Graduação</option>
              <option value="seminar">Seminário</option>
              <option value="special_training">Treino Especial</option>
              <option value="other">Outros</option>
            </select>
            <Filter size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>
        </div>

        {/* Search by title */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            fetchEvents();
          }}
          className="relative flex-grow md:max-w-xs"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-sm text-xs text-zinc-200 py-2 pl-8 pr-3 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
        </form>
      </div>

      {/* Admin Events Table */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <RefreshCw size={32} className="animate-spin text-red-500 mb-4" />
          <p className="text-zinc-400 font-mono text-sm">Carregando publicações...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center rounded-2xl bg-red-950/20 border border-red-900/50">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            type="button"
            onClick={fetchEvents}
            className="mt-4 px-4 py-2 bg-red-600 text-white font-mono text-xs uppercase font-semibold rounded-sm"
          >
            Tentar novamente
          </button>
        </div>
      ) : events.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800">
          <p className="font-fight text-xl text-zinc-400 uppercase">Nenhum evento cadastrado</p>
          <p className="text-zinc-500 text-xs mt-1">Crie seu primeiro evento clicando no botão acima.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-[#0c0c10] shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                <th scope="col" className="py-3 px-4">Título</th>
                <th scope="col" className="py-3 px-4">Categoria</th>
                <th scope="col" className="py-3 px-4 whitespace-nowrap">Data</th>
                <th scope="col" className="py-3 px-4">Local</th>
                <th scope="col" className="py-3 px-4">Status</th>
                <th scope="col" className="py-3 px-4 whitespace-nowrap">Última Atualização</th>
                <th scope="col" className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-sm">
              {events.map((event) => {
                const canEdit = canUserEditEvent(session?.user?.id, event);
                return (
                  <tr key={event.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs font-semibold text-white">
                      <span className="line-clamp-2">{event.title}</span>
                      <span className="text-[11px] font-mono text-zinc-500 block truncate">/{event.slug}</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <EventStatusBadge category={event.category} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs font-mono text-zinc-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-red-500" />
                        <span>{formatDateTime(event.event_date)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-zinc-300 max-w-[150px] truncate">
                      {event.location}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <EventStatusBadge status={event.status} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs font-mono text-zinc-400">
                      {formatDateTime(event.updated_at)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {/* View public */}
                        <a
                          href={`#/eventos/${event.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
                          title="Ver página pública"
                        >
                          <Eye size={15} />
                        </a>

                        {canEdit ? (
                          <>
                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => navigateTo(`/admin/eventos/${event.id}/editar`)}
                              className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
                              title="Editar evento"
                            >
                              <Edit size={15} />
                            </button>

                            {/* Toggle Publish / Draft */}
                            <button
                              type="button"
                              onClick={() => handleTogglePublish(event)}
                              className={`p-1.5 rounded transition-colors ${
                                event.status === 'published'
                                  ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40'
                                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                              }`}
                              title={event.status === 'published' ? 'Despublicar (voltar para rascunho)' : 'Publicar no site'}
                            >
                              {event.status === 'published' ? <CheckCircle size={15} /> : <XCircle size={15} />}
                            </button>

                            {/* Cancel event button */}
                            {event.status !== 'cancelled' && (
                              <button
                                type="button"
                                onClick={() => setEventToCancel(event)}
                                className="p-1.5 text-amber-500 hover:text-amber-400 rounded hover:bg-amber-950/40 transition-colors"
                                title="Cancelar evento (mantém a publicação e exibe cancelamento)"
                              >
                                <AlertTriangle size={15} />
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => setEventToDelete(event)}
                              className="p-1.5 text-red-500 hover:text-red-400 rounded hover:bg-red-950/40 transition-colors"
                              title="Excluir evento"
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500 bg-zinc-900/60 px-2 py-1 rounded border border-zinc-800"
                            title="Apenas o autor deste evento ou fundadores podem editá-lo"
                          >
                            <Lock size={12} className="text-zinc-500" />
                            <span>Bloqueado</span>
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      )}

      {/* Total count note */}
      {!isLoading && !error && events.length > 0 && (
        <p className="text-center text-xs font-mono text-zinc-500 mt-3">
          Exibindo {events.length} de {totalCount} {totalCount === 1 ? 'publicação' : 'publicações'}
        </p>
      )}

      {/* Modal de confirmação de cancelamento */}
      {eventToCancel && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="w-full max-w-md p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-500 mb-3">
              <AlertTriangle size={24} />
              <h3 className="font-fight text-xl uppercase tracking-wider text-white">Cancelar Evento</h3>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Deseja marcar o evento <strong>"{eventToCancel.title}"</strong> como cancelado? O evento permanecerá visível publicamente com o selo e aviso de cancelamento.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEventToCancel(null)}
                className="px-4 py-2 rounded-sm bg-zinc-800 text-zinc-300 hover:text-white font-mono text-xs uppercase"
              >
                Voltar
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs uppercase font-semibold transition-colors"
              >
                {isCancelling ? 'Cancelando...' : 'Confirmar Cancelamento'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {eventToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="w-full max-w-md p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500 mb-3">
              <Trash2 size={24} />
              <h3 className="font-fight text-xl uppercase tracking-wider text-white">Excluir Evento</h3>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Tem certeza de que deseja excluir permanentemente o evento <strong>"{eventToDelete.title}"</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                className="px-4 py-2 rounded-sm bg-zinc-800 text-zinc-300 hover:text-white font-mono text-xs uppercase"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-sm bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase font-semibold transition-colors shadow-red-glow"
              >
                {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
