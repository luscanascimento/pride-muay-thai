import React from 'react';
import { Calendar } from 'lucide-react';
import { DbStudentGraduation } from '../../types/database';
import { getKhanRank } from '../../constants/khans';
import { PrajiedRope } from '../ui/PrajiedBadge';
import { formatDate } from '../../utils/date';

interface GraduationHistoryProps {
  graduations: DbStudentGraduation[];
}

export const GraduationHistory: React.FC<GraduationHistoryProps> = ({ graduations }) => {
  if (graduations.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 text-center text-xs text-zinc-500 font-mono">
        Nenhum registro de graduação cadastrado até o momento.
      </div>
    );
  }

  // Sort ascending by level
  const sorted = [...graduations].sort((a, b) => a.khan_level - b.khan_level);

  return (
    <div className="space-y-2">
      <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-2">
        Histórico Registrado no Banco ({sorted.length} {sorted.length === 1 ? 'nível' : 'níveis'})
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {sorted.map((g) => {
          const rank = getKhanRank(g.khan_level);
          return (
            <div
              key={`grad-${g.id || g.khan_level}`}
              className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <PrajiedRope level={g.khan_level} size="xs" />
                <div>
                  <span className="font-fight text-sm uppercase text-white block leading-tight">
                    {g.khan_level}º Khan
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 block truncate max-w-[130px]">
                    {rank.colorName}
                  </span>
                </div>
              </div>

              <div className="text-right flex-shrink-0 font-mono text-[11px] text-zinc-400">
                {g.achieved_at ? (
                  <div className="flex items-center gap-1 text-zinc-300">
                    <Calendar size={11} className="text-red-500" />
                    <span>{formatDate(g.achieved_at)}</span>
                  </div>
                ) : (
                  <span className="text-zinc-600">Sem data</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
