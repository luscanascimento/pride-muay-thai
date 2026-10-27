import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  Archive,
  RefreshCw,
  Award,
} from 'lucide-react';
import { studentsService, AdminStudentsFilter } from '../../services/studentsService';
import { DbStudent } from '../../types/database';
import { PrajiedBadge } from '../ui/PrajiedBadge';
import { Pagination } from '../ui/Pagination';
import { ALL_KHANS_SYSTEM, getKhanRank } from '../../constants/khans';
import { formatDateTime } from '../../utils/date';
import { navigateTo } from '../../utils/routes';

export const StudentsAdmin: React.FC = () => {
  const [students, setStudents] = useState<DbStudent[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [khanFilter, setKhanFilter] = useState<number | undefined>(undefined);
  const [publishedFilter, setPublishedFilter] = useState<'all' | 'published' | 'hidden'>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filter: AdminStudentsFilter = {
        page,
        pageSize: 12,
        khan: khanFilter,
        isPublished:
          publishedFilter === 'all' ? undefined : publishedFilter === 'published',
        isActive:
          activeFilter === 'all' ? undefined : activeFilter === 'active',
        search,
      };

      const res = await studentsService.getAdminStudents(filter);
      setStudents(res.data);
      setTotalPages(res.totalPages);
      setTotalCount(res.count);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao listar alunos.');
    } finally {
      setIsLoading(false);
    }
  }, [page, khanFilter, publishedFilter, activeFilter, search]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleTogglePublished = async (student: DbStudent) => {
    try {
      await studentsService.updateStudent({
        id: student.id,
        is_published: !student.is_published,
      });
      await fetchStudents();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao alterar visibilidade do aluno.');
    }
  };

  const handleToggleActive = async (student: DbStudent) => {
    try {
      await studentsService.updateStudent({
        id: student.id,
        is_active: !student.is_active,
      });
      await fetchStudents();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao alterar status de atividade.');
    }
  };

  return (
    <div>
      {/* Header and New Student button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-fight text-3xl text-white uppercase tracking-wider">
            Gestão de <span className="text-red-500">Alunos</span>
          </h1>
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-400 mt-1">
            Controle de Matrículas e Progressão dos 16 Khans
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('/admin/alunos/novo')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-sm bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase font-semibold transition-colors shadow-red-glow"
        >
          <Plus size={16} />
          <span>Novo Aluno</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Khan filter */}
          <div className="relative">
            <select
              value={khanFilter ?? ''}
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                setKhanFilter(val);
                setPage(1);
              }}
              aria-label="Filtrar por Khan"
              className="appearance-none bg-zinc-900 border border-zinc-800 rounded-sm text-xs font-mono uppercase text-zinc-300 py-2 pl-3 pr-8 hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
            >
              <option value="">Todos os Khans</option>
              {ALL_KHANS_SYSTEM.map((k) => (
                <option key={k.level} value={k.level}>
                  {k.level}º Khan — {k.colorName}
                </option>
              ))}
            </select>
            <Filter size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>

          {/* Published filter */}
          <div className="relative">
            <select
              value={publishedFilter}
              onChange={(e) => {
                setPublishedFilter(e.target.value as 'all' | 'published' | 'hidden');
                setPage(1);
              }}
              aria-label="Filtrar por publicação"
              className="appearance-none bg-zinc-900 border border-zinc-800 rounded-sm text-xs font-mono uppercase text-zinc-300 py-2 pl-3 pr-8 hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
            >
              <option value="all">Visibilidade: Todas</option>
              <option value="published">Publicados</option>
              <option value="hidden">Ocultos</option>
            </select>
            <Filter size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>

          {/* Active filter */}
          <div className="relative">
            <select
              value={activeFilter}
              onChange={(e) => {
                setActiveFilter(e.target.value as 'all' | 'active' | 'archived');
                setPage(1);
              }}
              aria-label="Filtrar por atividade"
              className="appearance-none bg-zinc-900 border border-zinc-800 rounded-sm text-xs font-mono uppercase text-zinc-300 py-2 pl-3 pr-8 hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
            >
              <option value="all">Status: Todos</option>
              <option value="active">Ativos</option>
              <option value="archived">Arquivados</option>
            </select>
            <Filter size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>
        </div>

        {/* Search by name */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            fetchStudents();
          }}
          className="relative flex-grow md:max-w-xs"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-sm text-xs text-zinc-200 py-2 pl-8 pr-3 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
        </form>
      </div>

      {/* Admin Students Table */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <RefreshCw size={32} className="animate-spin text-red-500 mb-4" />
          <p className="text-zinc-400 font-mono text-sm">Carregando quadro de alunos...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center rounded-2xl bg-red-950/20 border border-red-900/50">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            type="button"
            onClick={fetchStudents}
            className="mt-4 px-4 py-2 bg-red-600 text-white font-mono text-xs uppercase font-semibold rounded-sm"
          >
            Tentar novamente
          </button>
        </div>
      ) : students.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800">
          <p className="font-fight text-xl text-zinc-400 uppercase">Nenhum aluno encontrado</p>
          <p className="text-zinc-500 text-xs mt-1">Cadastre o primeiro aluno clicando no botão acima.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-[#0c0c10] shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                <th scope="col" className="py-3 px-4">Nome do Aluno</th>
                <th scope="col" className="py-3 px-4">Khan Atual</th>
                <th scope="col" className="py-3 px-4">Prajied</th>
                <th scope="col" className="py-3 px-4">Publicado</th>
                <th scope="col" className="py-3 px-4">Ativo</th>
                <th scope="col" className="py-3 px-4 whitespace-nowrap">Última Atualização</th>
                <th scope="col" className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-sm">
              {students.map((student) => {
                const rank = getKhanRank(student.current_khan);
                return (
                  <tr key={student.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <span>{student.name}</span>
                      <span className="text-[11px] font-mono text-zinc-500 block truncate">/{student.slug}</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs font-mono text-zinc-300">
                      <div className="flex items-center gap-1.5">
                        <Award size={13} className="text-red-500" />
                        <span>{student.current_khan}º Khan ({rank.colorName})</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PrajiedBadge level={student.current_khan} size="sm" showRankTitle={false} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(student)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono uppercase font-semibold border transition-colors ${
                          student.is_published
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60 hover:bg-emerald-900/60'
                            : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300'
                        }`}
                        title="Clique para alternar publicação"
                      >
                        {student.is_published ? (
                          <>
                            <CheckCircle size={11} />
                            <span>Publicado</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={11} />
                            <span>Oculto</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(student)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono uppercase font-semibold border transition-colors ${
                          student.is_active
                            ? 'bg-blue-950/60 text-blue-400 border-blue-800/60 hover:bg-blue-900/60'
                            : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300'
                        }`}
                        title="Clique para alternar status ativo/arquivado"
                      >
                        {student.is_active ? (
                          <span>Ativo</span>
                        ) : (
                          <>
                            <Archive size={11} />
                            <span>Arquivado</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs font-mono text-zinc-400">
                      {formatDateTime(student.updated_at)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {/* Ver página pública de trajetória */}
                        <a
                          href={`#/alunos/${student.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
                          title="Ver trajetória pública"
                        >
                          <Eye size={15} />
                        </a>

                        {/* Editar aluno e gerenciar khans */}
                        <button
                          type="button"
                          onClick={() => navigateTo(`/admin/alunos/${student.id}/editar`)}
                          className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
                          title="Editar aluno e graduações"
                        >
                          <Edit size={15} />
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

      {/* Pagination */}
      {!isLoading && !error && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      )}

      {/* Total count note */}
      {!isLoading && !error && students.length > 0 && (
        <p className="text-center text-xs font-mono text-zinc-500 mt-3">
          Exibindo {students.length} de {totalCount} {totalCount === 1 ? 'aluno' : 'alunos'}
        </p>
      )}
    </div>
  );
};
