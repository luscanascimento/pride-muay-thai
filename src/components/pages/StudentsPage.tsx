import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Users, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { studentsService, PublicStudentsFilter } from '../../services/studentsService';
import { DbStudent } from '../../types/database';
import { StudentTable } from '../students/StudentTable';
import { Pagination } from '../ui/Pagination';
import { ALL_KHANS_SYSTEM } from '../../constants/khans';
import { buildHashUrl, navigateTo } from '../../utils/routes';
import { exportStudentsToExcel } from '../../utils/studentExcelExport';

interface StudentsPageProps {
  initialSearchParams?: URLSearchParams;
}

export const StudentsPage: React.FC<StudentsPageProps> = ({ initialSearchParams }) => {
  const getParam = (key: string, fallback: string = '') =>
    initialSearchParams?.get(key) || fallback;

  const [khanFilter, setKhanFilter] = useState<number | undefined>(() => {
    const k = parseInt(getParam('khan', ''), 10);
    return !isNaN(k) && k >= 1 && k <= 16 ? k : undefined;
  });
  const [search, setSearch] = useState<string>(getParam('busca', ''));
  const [page, setPage] = useState<number>(parseInt(getParam('page', '1'), 10) || 1);

  const [students, setStudents] = useState<DbStudent[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateUrl = useCallback(
    (newParams: { khan?: number; page?: number; busca?: string }) => {
      const merged = {
        khan: (newParams.khan !== undefined ? newParams.khan : khanFilter) || undefined,
        page: (newParams.page ?? page) > 1 ? (newParams.page ?? page) : undefined,
        busca: (newParams.busca ?? search).trim() || undefined,
      };

      const newHash = buildHashUrl('/alunos', merged);
      navigateTo(newHash, { replace: true, smoothScroll: false });
    },
    [khanFilter, page, search]
  );

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filter: PublicStudentsFilter = {
        page,
        pageSize: 12,
        search,
        khan: khanFilter,
      };

      const result = await studentsService.getPublicStudents(filter);
      setStudents(result.data);
      setTotalPages(result.totalPages);
      setTotalCount(result.count);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao carregar alunos.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [page, khanFilter, search]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleKhanChange = (newKhan: number | undefined) => {
    setKhanFilter(newKhan);
    setPage(1);
    updateUrl({ khan: newKhan, page: 1 });
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

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const allStudents = await studentsService.getAllStudentsForExport(true);
      exportStudentsToExcel(allStudents, 'pride-muay-thai-alunos');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao exportar alunos para Excel.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[70vh]">
      {/* Editorial Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-mono uppercase tracking-wider mb-3 font-semibold">
          <Users size={13} />
          <span>Quadro Oficial de Alunos</span>
        </div>
        <h1 className="font-fight text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-wider">
          ALUNOS & <span className="text-red-500">GRADUAÇÕES</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
          Consulte o registro oficial e a progressão marcial de alunos da Pride Muay Thai. Cada Khan conquistado reflete dedicação, técnica, honra e disciplina.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-8 p-4 sm:p-6 rounded-2xl bg-[#0c0c10] border border-zinc-800 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Khan Level Selector */}
        <div className="flex items-center gap-3">
          <div className="relative flex-grow sm:flex-grow-0">
            <select
              value={khanFilter ?? ''}
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                handleKhanChange(val);
              }}
              aria-label="Filtrar por Khan"
              className="w-full sm:w-auto appearance-none bg-zinc-950 border border-zinc-800 rounded-sm text-xs font-mono uppercase tracking-wider text-zinc-300 py-2.5 pl-3.5 pr-8 hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
            >
              <option value="">Todos os 16 Khans</option>
              {ALL_KHANS_SYSTEM.map((k) => (
                <option key={k.level} value={k.level}>
                  {k.level}º Khan — {k.colorName} ({k.title})
                </option>
              ))}
            </select>
            <Filter size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>

          {khanFilter !== undefined && (
            <button
              type="button"
              onClick={() => handleKhanChange(undefined)}
              className="text-xs font-mono uppercase text-red-500 hover:text-red-400 underline decoration-zinc-800 underline-offset-4 whitespace-nowrap"
            >
              Limpar filtro
            </button>
          )}
        </div>

        {/* Search by student name and Export button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-grow sm:flex-grow-0 sm:min-w-[260px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar aluno por nome..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-xs text-zinc-200 py-2.5 pl-9 pr-3 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </form>

          <button
            type="button"
            onClick={handleExportExcel}
            disabled={isExporting}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-sm bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-mono text-xs uppercase font-semibold transition-colors disabled:opacity-50"
            title="Exportar alunos para planilha Excel (.csv)"
          >
            {isExporting ? (
              <RefreshCw size={14} className="animate-spin text-emerald-500" />
            ) : (
              <FileSpreadsheet size={14} className="text-emerald-500" />
            )}
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Student Table / Cards */}
      <StudentTable
        students={students}
        isLoading={isLoading}
        error={error}
        onRetry={fetchStudents}
      />

      {/* Pagination */}
      {!isLoading && !error && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Results count */}
      {!isLoading && !error && students.length > 0 && (
        <p className="text-center text-xs font-mono text-zinc-500 mt-2">
          Exibindo {students.length} de {totalCount} {totalCount === 1 ? 'aluno' : 'alunos'}
        </p>
      )}
    </div>
  );
};
