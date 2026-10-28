import React from 'react';
import { Award, ChevronRight, MapPin } from 'lucide-react';
import { DbStudent } from '../../types/database';
import { PrajiedBadge, PrajiedRope } from '../ui/PrajiedBadge';
import { getKhanRank } from '../../constants/khans';
import { navigateTo } from '../../utils/routes';
import { getGymNames } from '../../utils/gyms';

interface StudentCardProps {
  student: DbStudent;
  onNavigate?: (slug: string) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onNavigate }) => {
  const rank = getKhanRank(student.current_khan);
  const gymNames = getGymNames(student.gym_ids);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(student.slug);
    } else {
      navigateTo(`/alunos/${student.slug}`);
    }
  };

  return (
    <div className="group relative p-5 rounded-2xl bg-gradient-to-b from-[#111116] to-[#0a0a0d] border border-zinc-800/90 shadow-xl transition-all duration-300 hover:border-red-500/50 hover:shadow-2xl flex flex-col justify-between">
      {/* Top ambient rope indicator */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:border-zinc-700 transition-colors">
            <PrajiedRope level={student.current_khan} size="sm" />
          </div>

          <PrajiedBadge level={student.current_khan} size="sm" showRankTitle={false} />
        </div>

        <h3 className="font-fight text-xl sm:text-2xl text-white uppercase tracking-wide group-hover:text-red-500 transition-colors line-clamp-1">
          <a href={`#/alunos/${student.slug}`} onClick={handleClick}>
            {student.name}
          </a>
        </h3>

        <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-zinc-400">
          <Award size={13} className="text-red-500 flex-shrink-0" />
          <span className="font-semibold text-zinc-300">{rank.title}</span>
        </div>

        {gymNames.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-400 line-clamp-1">
            <MapPin size={12} className="text-red-500/80 flex-shrink-0" />
            <span className="truncate">{gymNames.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase text-zinc-500">
          {student.current_khan}º Khan • {rank.colorName}
        </span>
        <a
          href={`#/alunos/${student.slug}`}
          onClick={handleClick}
          className="inline-flex items-center gap-1 text-xs font-mono font-semibold uppercase text-red-500 group-hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 rounded p-1"
        >
          <span>Trajetória</span>
          <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
};
