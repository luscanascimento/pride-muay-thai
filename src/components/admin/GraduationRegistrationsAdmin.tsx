import React, { useState, useEffect, useCallback } from 'react';
import {
  GraduationCap,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  FileDown,
  Calendar,
  AlertCircle,
  RotateCcw,
  User,
  UserCheck,
  Check,
  Pencil,
} from 'lucide-react';
import {
  graduationRegistrationsService,
  GraduationRegistrationWithEvent,
  GraduationStats,
} from '../../services/graduationRegistrationsService';
import { eventsService } from '../../services/eventsService';
import { DbEvent, GraduationPaymentStatus } from '../../types/database';
import { ALL_KHANS_SYSTEM, getKhanRank } from '../../constants/khans';
import {
  formatGraduationPrice,
  getGraduationPriceForKhan,
} from '../../constants/graduation';
import { formatDateTime } from '../../utils/date';
import { Pagination } from '../ui/Pagination';
import {
  exportGraduationToExcel,
  exportGraduationToPdf,
  exportGraduationToWord,
} from '../../utils/graduationExports';

interface GraduationRegistrationsAdminProps {
  initialSearchParams?: URLSearchParams;
}

export const GraduationRegistrationsAdmin: React.FC<GraduationRegistrationsAdminProps> = ({
  initialSearchParams,
}) => {
  // Lista de eventos de graduação para o select
  const [graduationEvents, setGraduationEvents] = useState<DbEvent[]>([]);

  // Filtros
  const [selectedEventId, setSelectedEventId] = useState<string>(
    initialSearchParams?.get('event_id') || 'all'
  );
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<GraduationPaymentStatus | 'all'>('all');
  const [targetKhanFilter, setTargetKhanFilter] = useState<number | 'all'>('all');
  const [search, setSearch] = useState<string>('');

  // Paginação e dados
  const [registrations, setRegistrations] = useState<GraduationRegistrationWithEvent[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);

  // Estatísticas filtradas
  const [stats, setStats] = useState<GraduationStats>({ total: 0, paid: 0, pending: 0 });

  // Estados de carregamento e feedback
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportType, setExportType] = useState<'excel' | 'pdf' | 'word' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

  // Estados para edição de candidatura por administradores
  const [editingRegistration, setEditingRegistration] = useState<GraduationRegistrationWithEvent | null>(null);
  const [editFullName, setEditFullName] = useState<string>('');
  const [editTargetKhan, setEditTargetKhan] = useState<number>(1);
  const [editCurrentKhan, setEditCurrentKhan] = useState<number | ''>('');
  const [editPaymentStatus, setEditPaymentStatus] = useState<GraduationPaymentStatus>('pending');
  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Carrega lista de eventos da categoria 'graduation'
  useEffect(() => {
    let isMounted = true;
    eventsService
      .getGraduationEvents()
      .then((evts) => {
        if (isMounted) setGraduationEvents(evts);
      })
      .catch((err) => {
        console.error('Erro ao buscar eventos de graduação:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Busca registros com os filtros atuais
  const fetchRegistrations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filter = {
        page,
        pageSize: 15,
        eventId: selectedEventId !== 'all' ? selectedEventId : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        paymentStatus: paymentStatusFilter !== 'all' ? paymentStatusFilter : undefined,
        targetKhan: targetKhanFilter !== 'all' ? Number(targetKhanFilter) : undefined,
        search: search.trim() || undefined,
      };

      const [res, calculatedStats] = await Promise.all([
        graduationRegistrationsService.getRegistrations(filter),
        graduationRegistrationsService.getStats(filter),
      ]);

      setRegistrations(res.data);
      setTotalPages(res.totalPages);
      setTotalCount(res.count);
      setStats(calculatedStats);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao listar inscrições de graduação.');
    } finally {
      setIsLoading(false);
    }
  }, [page, selectedEventId, startDate, endDate, paymentStatusFilter, targetKhanFilter, search]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Limpar todos os filtros
  const handleClearFilters = () => {
    setSelectedEventId('all');
    setStartDate('');
    setEndDate('');
    setPaymentStatusFilter('all');
    setTargetKhanFilter('all');
    setSearch('');
    setPage(1);
  };

  // Alternar pagamento via RPC
  const handleTogglePayment = async (reg: GraduationRegistrationWithEvent) => {
    const nextPaid = reg.payment_status !== 'paid';
    try {
      await graduationRegistrationsService.setPaymentStatus(reg.id, nextPaid);
      setSuccessFeedback(
        nextPaid
          ? `Pagamento de "${reg.full_name}" confirmado!`
          : `Pagamento de "${reg.full_name}" alterado para pendente.`
      );
      setTimeout(() => setSuccessFeedback(null), 3000);
      await fetchRegistrations();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao atualizar pagamento.');
    }
  };

  // Abrir modal de edição para corrigir dados da candidatura
  const handleOpenEditModal = (reg: GraduationRegistrationWithEvent) => {
    setEditingRegistration(reg);
    setEditFullName(reg.full_name);
    setEditTargetKhan(reg.target_khan);
    setEditCurrentKhan(reg.current_khan_at_registration ?? '');
    setEditPaymentStatus(reg.payment_status);
    setEditError(null);
  };

  const handleCloseEditModal = () => {
    if (isSavingEdit) return;
    setEditingRegistration(null);
    setEditError(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRegistration) return;

    if (!editFullName.trim()) {
      setEditError('O nome do candidato é obrigatório.');
      return;
    }

    if (editTargetKhan < 1 || editTargetKhan > 16) {
      setEditError('O Khan pretendido deve estar entre 1 e 16.');
      return;
    }

    setIsSavingEdit(true);
    setEditError(null);

    try {
      await graduationRegistrationsService.updateRegistration({
        id: editingRegistration.id,
        full_name: editFullName.trim(),
        target_khan: Number(editTargetKhan),
        current_khan_at_registration: editCurrentKhan === '' ? null : Number(editCurrentKhan),
        payment_status: editPaymentStatus,
      });

      setSuccessFeedback(`Inscrição de "${editFullName.trim()}" atualizada com sucesso!`);
      setTimeout(() => setSuccessFeedback(null), 3000);
      setEditingRegistration(null);
      await fetchRegistrations();
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : 'Erro ao salvar alterações da inscrição.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Prepara opções de exportação
  const getExportOptions = () => {
    const selectedEvt = graduationEvents.find((e) => e.id === selectedEventId);
    const filterParts: string[] = [];

    if (selectedEvt) {
      filterParts.push(`Evento: ${selectedEvt.title}`);
    } else {
      filterParts.push('Todos os eventos de graduação');
    }

    if (startDate) filterParts.push(`A partir de: ${startDate}`);
    if (endDate) filterParts.push(`Até: ${endDate}`);
    if (paymentStatusFilter === 'paid') filterParts.push('Status: Pagos');
    if (paymentStatusFilter === 'pending') filterParts.push('Status: Pendentes');
    if (targetKhanFilter !== 'all') filterParts.push(`Khan pretendido: ${targetKhanFilter}º Khan`);
    if (search.trim()) filterParts.push(`Busca: "${search.trim()}"`);

    return {
      options: {
        eventName: selectedEvt?.title,
        eventDate: selectedEvt ? formatDateTime(selectedEvt.event_date) : undefined,
        filterSummary: filterParts.join(' | '),
      },
      slug: selectedEvt?.slug,
    };
  };

  // Exportadores reais
  const handleExport = async (type: 'excel' | 'pdf' | 'word') => {
    if (isExporting) return;
    setIsExporting(true);
    setExportType(type);

    try {
      const filter = {
        eventId: selectedEventId !== 'all' ? selectedEventId : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        paymentStatus: paymentStatusFilter !== 'all' ? paymentStatusFilter : undefined,
        targetKhan: targetKhanFilter !== 'all' ? Number(targetKhanFilter) : undefined,
        search: search.trim() || undefined,
      };

      const allRecords = await graduationRegistrationsService.getAllFilteredRegistrations(filter);

      if (allRecords.length === 0) {
        alert('Não há registros filtrados para exportar.');
        return;
      }

      const { options, slug } = getExportOptions();

      if (type === 'excel') {
        await exportGraduationToExcel(allRecords, options, slug);
      } else if (type === 'pdf') {
        await exportGraduationToPdf(allRecords, options, slug);
      } else if (type === 'word') {
        await exportGraduationToWord(allRecords, options, slug);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao gerar exportação.');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-fight text-3xl text-white uppercase tracking-wider flex items-center gap-2.5">
            <GraduationCap className="text-red-500" size={32} />
            <span>Inscrições de <span className="text-red-500">Graduação</span></span>
          </h1>
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-400 mt-1">
            Gestão de Candidatos, Controle Manual de Pagamentos e Exportações
          </p>
        </div>

        {/* Botões de Exportação */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={isExporting}
            onClick={() => handleExport('word')}
            aria-label="Exportar para documento Word"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm bg-blue-950/60 border border-blue-800/80 hover:bg-blue-900/60 text-blue-200 text-xs font-mono uppercase font-semibold transition-colors disabled:opacity-50"
          >
            {isExporting && exportType === 'word' ? (
              <RefreshCw size={14} className="animate-spin text-blue-400" />
            ) : (
              <FileText size={14} className="text-blue-400" />
            )}
            <span>Word (.docx)</span>
          </button>

          <button
            type="button"
            disabled={isExporting}
            onClick={() => handleExport('pdf')}
            aria-label="Exportar para documento PDF"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm bg-red-950/60 border border-red-800/80 hover:bg-red-900/60 text-red-200 text-xs font-mono uppercase font-semibold transition-colors disabled:opacity-50"
          >
            {isExporting && exportType === 'pdf' ? (
              <RefreshCw size={14} className="animate-spin text-red-400" />
            ) : (
              <FileDown size={14} className="text-red-400" />
            )}
            <span>PDF (.pdf)</span>
          </button>

          <button
            type="button"
            disabled={isExporting}
            onClick={() => handleExport('excel')}
            aria-label="Exportar para planilha Excel"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm bg-emerald-950/60 border border-emerald-800/80 hover:bg-emerald-900/60 text-emerald-200 text-xs font-mono uppercase font-semibold transition-colors disabled:opacity-50"
          >
            {isExporting && exportType === 'excel' ? (
              <RefreshCw size={14} className="animate-spin text-emerald-400" />
            ) : (
              <FileSpreadsheet size={14} className="text-emerald-400" />
            )}
            <span>Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Feedback de sucesso */}
      {successFeedback && (
        <div
          role="status"
          aria-live="polite"
          className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs font-mono flex items-center gap-2"
        >
          <Check size={16} className="text-emerald-400" />
          <span>{successFeedback}</span>
        </div>
      )}

      {/* Cards de Contadores Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
              Total Filtrado
            </span>
            <span className="font-fight text-2xl text-white mt-0.5 block">
              {stats.total}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-400 font-mono font-bold">
            Σ
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-900/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 block">
              Pagamentos Confirmados
            </span>
            <span className="font-fight text-2xl text-emerald-300 mt-0.5 block">
              {stats.paid}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
            <CheckCircle size={20} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-900/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 block">
              Pagamentos Pendentes
            </span>
            <span className="font-fight text-2xl text-amber-300 mt-0.5 block">
              {stats.pending}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-950 border border-amber-800/60 flex items-center justify-center text-amber-400">
            <Clock size={20} />
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-zinc-900 pb-3">
          <span className="text-xs font-mono uppercase text-red-500 font-semibold flex items-center gap-1.5">
            <Filter size={14} />
            <span>Filtros de Graduação</span>
          </span>

          <button
            type="button"
            onClick={handleClearFilters}
            className="inline-flex items-center gap-1 text-[11px] font-mono uppercase text-zinc-400 hover:text-white transition-colors"
          >
            <RotateCcw size={12} />
            <span>Limpar Filtros</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Filtro por Evento de Graduação */}
          <div>
            <label htmlFor="filter-event" className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
              Evento de Graduação
            </label>
            <select
              id="filter-event"
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value);
                setPage(1);
              }}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-sm text-xs font-mono text-zinc-200 py-2 px-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Todos os Eventos de Graduação</option>
              {graduationEvents.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Pagamento */}
          <div>
            <label htmlFor="filter-payment" className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
              Status do Pagamento
            </label>
            <select
              id="filter-payment"
              value={paymentStatusFilter}
              onChange={(e) => {
                setPaymentStatusFilter(e.target.value as GraduationPaymentStatus | 'all');
                setPage(1);
              }}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-sm text-xs font-mono text-zinc-200 py-2 px-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Todos os Status</option>
              <option value="paid">Confirmados (Pagos)</option>
              <option value="pending">Pendentes</option>
            </select>
          </div>

          {/* Filtro por Khan Pretendido */}
          <div>
            <label htmlFor="filter-khan" className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
              Khan Pretendido
            </label>
            <select
              id="filter-khan"
              value={targetKhanFilter}
              onChange={(e) => {
                const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
                setTargetKhanFilter(val);
                setPage(1);
              }}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-sm text-xs font-mono text-zinc-200 py-2 px-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Todos os Khans</option>
              {ALL_KHANS_SYSTEM.map((k) => (
                <option key={k.level} value={k.level}>
                  {k.level}º Khan — {k.colorName}
                </option>
              ))}
            </select>
          </div>

          {/* Busca por Nome */}
          <div>
            <label htmlFor="filter-search" className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
              Buscar por Nome
            </label>
            <div className="relative">
              <input
                id="filter-search"
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Nome do candidato..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-sm text-xs text-zinc-200 py-2 pl-8 pr-3 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filtro por Período de Realização do Evento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-900">
          <div>
            <label htmlFor="filter-start-date" className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
              Data Inicial da Graduação
            </label>
            <input
              id="filter-start-date"
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-sm text-xs font-mono text-zinc-200 py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label htmlFor="filter-end-date" className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
              Data Final da Graduação
            </label>
            <input
              id="filter-end-date"
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-sm text-xs font-mono text-zinc-200 py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Tabela de Inscrições */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <RefreshCw size={32} className="animate-spin text-red-500 mb-4" />
          <p className="text-zinc-400 font-mono text-sm">Carregando inscrições...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center rounded-2xl bg-red-950/20 border border-red-900/50">
          <AlertCircle size={32} className="text-red-400 mx-auto mb-2" />
          <p className="text-red-300 text-sm">{error}</p>
          <button
            type="button"
            onClick={fetchRegistrations}
            className="mt-4 px-4 py-2 bg-red-600 text-white font-mono text-xs uppercase font-semibold rounded-sm"
          >
            Tentar novamente
          </button>
        </div>
      ) : registrations.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800">
          <GraduationCap size={36} className="text-zinc-600 mx-auto mb-2" />
          <p className="font-fight text-xl text-zinc-400 uppercase">Nenhuma inscrição encontrada</p>
          <p className="text-zinc-500 text-xs mt-1">
            Não há registros correspondentes aos filtros aplicados.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-[#0c0c10] shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                <th scope="col" className="py-3 px-4">Candidato</th>
                <th scope="col" className="py-3 px-4">Origem</th>
                <th scope="col" className="py-3 px-4">Khan Atual</th>
                <th scope="col" className="py-3 px-4">Khan Pretendido</th>
                <th scope="col" className="py-3 px-4">Evento</th>
                <th scope="col" className="py-3 px-4 whitespace-nowrap">Data do Evento</th>
                <th scope="col" className="py-3 px-4 whitespace-nowrap">Data Inscrição</th>
                <th scope="col" className="py-3 px-4">Status Pagamento</th>
                <th scope="col" className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-sm">
              {registrations.map((reg) => {
                const targetRank = getKhanRank(reg.target_khan);
                const currentRank = reg.current_khan_at_registration
                  ? getKhanRank(reg.current_khan_at_registration)
                  : null;
                const isPaid = reg.payment_status === 'paid';

                return (
                  <tr key={reg.id} className="hover:bg-zinc-800/20 transition-colors">
                    {/* Nome do Candidato */}
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <span>{reg.full_name}</span>
                    </td>

                    {/* Origem: Aluno cadastrado vs Manual */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {reg.student_id ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/60 text-[10px] font-mono uppercase text-blue-300">
                          <UserCheck size={11} />
                          <span>Aluno Cadastrado</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono uppercase text-zinc-400">
                          <User size={11} />
                          <span>Nome Manual</span>
                        </span>
                      )}
                    </td>

                    {/* Khan Atual */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs font-mono text-zinc-300">
                      {currentRank ? (
                        <span>
                          {currentRank.level}º Khan ({currentRank.colorName})
                        </span>
                      ) : (
                        <span className="text-zinc-500">—</span>
                      )}
                    </td>

                    {/* Khan Pretendido */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs font-mono text-white font-medium">
                      <span>
                        {targetRank.level}º Khan ({targetRank.colorName})
                      </span>
                    </td>

                    {/* Evento */}
                    <td className="py-3.5 px-4 text-xs text-zinc-300 max-w-[180px] truncate">
                      {reg.event?.title || 'Graduação'}
                    </td>

                    {/* Data do Evento */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs font-mono text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-red-500" />
                        <span>{reg.event?.event_date ? formatDateTime(reg.event.event_date) : '—'}</span>
                      </div>
                    </td>

                    {/* Data da Inscrição */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs font-mono text-zinc-500">
                      {formatDateTime(reg.created_at)}
                    </td>

                    {/* Status de Pagamento */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-mono uppercase font-semibold">
                          <CheckCircle size={13} />
                          <span>Pago</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-950/80 border border-amber-800/80 text-amber-300 text-xs font-mono uppercase font-semibold">
                          <Clock size={13} />
                          <span>Pendente</span>
                        </span>
                      )}
                    </td>

                    {/* Ação: Editar e Alternar Pagamento */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(reg)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-mono uppercase font-semibold border border-zinc-700/80 bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 hover:border-zinc-600 transition-colors"
                          title="Editar candidatura (corrigir Khan, nome ou status)"
                        >
                          <Pencil size={12} className="text-zinc-400" />
                          <span>Editar</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTogglePayment(reg)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-mono uppercase font-semibold border transition-colors ${
                            isPaid
                              ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                              : 'bg-emerald-900/40 border-emerald-700/80 text-emerald-300 hover:bg-emerald-800/60'
                          }`}
                          title={
                            isPaid
                              ? 'Desmarcar pagamento (voltar para pendente)'
                              : 'Confirmar pagamento manualmente'
                          }
                        >
                          {isPaid ? (
                            <>
                              <XCircle size={13} />
                              <span>Desmarcar</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle size={13} />
                              <span>Marcar Pago</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginação */}
      {!isLoading && !error && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      )}

      {/* Nota com total filtrado */}
      {!isLoading && !error && registrations.length > 0 && (
        <p className="text-center text-xs font-mono text-zinc-500">
          Exibindo {registrations.length} de {totalCount} {totalCount === 1 ? 'inscrição' : 'inscrições'}
        </p>
      )}

      {/* Modal de Edição de Candidatura (Acesso Administrativo) */}
      {editingRegistration && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-edit-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="w-full max-w-lg bg-[#0e0e14] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 relative">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400">
                  <Pencil size={18} />
                </div>
                <div>
                  <h3 id="modal-edit-title" className="font-fight text-lg text-white uppercase tracking-wider">
                    Editar Candidatura
                  </h3>
                  <span className="text-xs text-zinc-400 font-mono">
                    {editingRegistration.event?.title || 'Graduação'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseEditModal}
                disabled={isSavingEdit}
                className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Fechar modal"
              >
                <XCircle size={20} />
              </button>
            </div>

            {editError && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Nome do Candidato */}
              <div>
                <label htmlFor="edit-name" className="block text-xs font-mono uppercase text-zinc-300 mb-1">
                  Nome do Aluno / Candidato *
                </label>
                <input
                  id="edit-name"
                  type="text"
                  required
                  maxLength={150}
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Khan Pretendido (Campo prioritário para correção) */}
              <div>
                <label htmlFor="edit-target-khan" className="block text-xs font-mono uppercase text-zinc-300 mb-1">
                  Khan Pretendido no Exame *
                </label>
                <select
                  id="edit-target-khan"
                  value={editTargetKhan}
                  onChange={(e) => setEditTargetKhan(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                >
                  {ALL_KHANS_SYSTEM.map((k) => {
                    const price = getGraduationPriceForKhan(k.level);
                    return (
                      <option key={k.level} value={k.level}>
                        {k.level}º Khan — {k.colorName} {price !== null ? `(${formatGraduationPrice(price)})` : ''}
                      </option>
                    );
                  })}
                </select>
                <p className="text-[11px] text-zinc-500 font-mono mt-1">
                  Altere caso o aluno tenha selecionado o Khan errado no formulário público.
                </p>
              </div>

              {/* Khan Atual no momento da inscrição */}
              <div>
                <label htmlFor="edit-current-khan" className="block text-xs font-mono uppercase text-zinc-300 mb-1">
                  Khan Atual (Snapshot da Inscrição)
                </label>
                <select
                  id="edit-current-khan"
                  value={editCurrentKhan}
                  onChange={(e) => setEditCurrentKhan(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                >
                  <option value="">Não informado / Em branco</option>
                  {ALL_KHANS_SYSTEM.map((k) => (
                    <option key={k.level} value={k.level}>
                      {k.level}º Khan — {k.colorName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status do Pagamento */}
              <div>
                <label htmlFor="edit-payment" className="block text-xs font-mono uppercase text-zinc-300 mb-1">
                  Status do Pagamento
                </label>
                <select
                  id="edit-payment"
                  value={editPaymentStatus}
                  onChange={(e) => setEditPaymentStatus(e.target.value as GraduationPaymentStatus)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                >
                  <option value="pending">Pendente</option>
                  <option value="paid">Confirmado (Pago)</option>
                </select>
              </div>

              {/* Ações */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  disabled={isSavingEdit}
                  className="px-4 py-2 rounded-sm border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white font-mono text-xs uppercase transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-sm bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase font-semibold transition-colors disabled:opacity-50"
                >
                  {isSavingEdit ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>Salvar Alterações</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
