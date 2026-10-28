import React from 'react';
import { ChevronRight, AlertCircle, RefreshCw, Award, MapPin } from 'lucide-react';
import { DbStudent } from '../../types/database';
import { PrajiedBadge } from '../ui/PrajiedBadge';
import { StudentCard } from './StudentCard';
import { getKhanRank } from '../../constants/khans';
import { navigateTo } from '../../utils/routes';
import { getGymNames } from '../../utils/gyms';
import { getGoogleMapsSearchUrl } from '../../utils/maps';

interface StudentTableProps {
  students: DbStudent[];
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  onNavigateToDetail?: (slug: string) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  isLoading,
  error,
  onRetry,
  onNavigateToDetail,
}) => {
  const handleDetail = (slug: string) => {
    if (onNavigateToDetail) {
      onNavigateToDetail(slug);
    } else {
      navigateTo(`/alunos/${slug}`);
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center text-center">
        <RefreshCw size={32} className="animate-spin text-red-500 mb-4" />
        <p className="text-zinc-400 font-mono text-sm">Carregando quadro de alunos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 px-6 rounded-2xl bg-red-950/20 border border-red-900/50 text-center max-w-lg mx-auto">
        <AlertCircle size={36} className="text-red-500 mx-auto mb-3" />
        <h3 className="font-fight text-xl text-white uppercase">Erro ao carregar alunos</h3>
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

  if (students.length === 0) {
    return (
      <div className="py-16 px-4 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800">
        <p className="text-zinc-400 font-fight text-xl uppercase">Nenhum aluno encontrado</p>
        <p className="text-zinc-500 text-xs sm:text-sm mt-1">
          Nenhum aluno cadastrado corresponde aos critérios ou filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Mobile view: Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-4">
        {students.map((student) => (
          <StudentCard key={student.id} student={student} onNavigate={handleDetail} />
        ))}
      </div>

      {/* Desktop view: Table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-zinc-800 bg-[#0c0c10]/80 shadow-2xl backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/60 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              <th scope="col" className="py-3.5 px-6">Nome do Aluno</th>
              <th scope="col" className="py-3.5 px-6">Nível Atual</th>
              <th scope="col" className="py-3.5 px-6">Prajied Oficial</th>
              <th scope="col" className="py-3.5 px-6">Academia(s)</th>
              <th scope="col" className="py-3.5 px-6 text-right">Trajetória</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-sm">
            {students.map((student) => {
              const rank = getKhanRank(student.current_khan);
              const gymNames = getGymNames(student.gym_ids);
              return (
                <tr
                  key={student.id}
                  className="hover:bg-zinc-800/30 transition-colors group"
                >
                  <td className="py-4 px-6 align-middle">
                    <a
                      href={`#/alunos/${student.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleDetail(student.slug);
                      }}
                      className="font-fight text-lg text-white uppercase group-hover:text-red-500 transition-colors block"
                    >
                      {student.name}
                    </a>
                    <span className="text-xs font-mono text-zinc-400">
                      {rank.title}
                    </span>
                  </td>
                  <td className="py-4 px-6 align-middle whitespace-nowrap text-xs text-zinc-300 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Award size={14} className="text-red-500" />
                      <span>{student.current_khan}º Khan ({rank.colorName})</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 align-middle whitespace-nowrap">
                    <PrajiedBadge level={student.current_khan} size="sm" showRankTitle={false} />
                  </td>
                  <td className="py-4 px-6 align-middle text-xs text-zinc-400">
                    {gymNames.length > 0 ? (
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {gymNames.map((name) => (
                          <a
                            key={name}
                            href={getGoogleMapsSearchUrl(name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-[11px] transition-colors"
                            title={`Abrir localização de ${name} no Google Maps`}
                            aria-label={`Abrir ${name} no Google Maps`}
                          >
                            <MapPin size={11} className="text-red-500" />
                            {name}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <span className="text-zinc-600 font-mono">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6 align-middle text-right whitespace-nowrap">
                    <a
                      href={`#/alunos/${student.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleDetail(student.slug);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-sm bg-zinc-900 border border-zinc-800 hover:border-red-500/60 text-zinc-300 hover:text-white font-mono text-xs uppercase transition-colors"
                    >
                      <span>Ver trajetória</span>
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
