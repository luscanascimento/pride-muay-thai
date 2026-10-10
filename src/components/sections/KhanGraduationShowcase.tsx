import React from 'react';
import { Award, Shield, Check } from 'lucide-react';
import { PrajiedRope } from '../ui/PrajiedBadge';
import { KHAN_RANKS_DATA } from '../../data/gymsAndTeamData';

interface KhanGraduationShowcaseProps {
  selectedKhan: number | null;
  onSelectKhan: (khan: number | null) => void;
  memberCountsByKhan: Record<number, number>;
}

export const KhanGraduationShowcase: React.FC<KhanGraduationShowcaseProps> = ({
  selectedKhan,
  onSelectKhan,
  memberCountsByKhan,
}) => {
  // Ordered from highest Khan to foundation Khan
  const activeKhans = [13, 11, 10, 9, 8, 7];

  return (
    <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#121217] via-[#0d0d12] to-[#09090c] border border-zinc-800/90 shadow-2xl relative overflow-hidden">
      {/* Decorative Thai-inspired subtle glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header of the Showcase */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/40 border border-red-800/40 text-red-400 text-[11px] font-mono uppercase tracking-wider mb-2.5 font-semibold">
            <Award size={13} />
            <span>Graduação Tradicional de Muay Thai</span>
          </div>
          <h3 className="font-fight text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-wide leading-none">
            HIERARQUIA MARCIAL & <span className="text-red-500">OS KHANS DA PRIDE</span>
          </h3>
          <p className="text-zinc-400 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
            No Muay Thai autêntico, a evolução técnica e a maturidade de cada praticante são simbolizadas pelas cores sagradas do <strong>Prajied</strong> (bracelete trançado).
          </p>
        </div>

        {/* Filter Reset */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => onSelectKhan(null)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              selectedKhan === null
                ? 'bg-red-600 text-white shadow-md shadow-red-950/60 ring-2 ring-red-500/50'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            Ver Toda a Equipe (10)
          </button>
        </div>
      </div>

      {/* Grid / Scale of Khans */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {activeKhans.map((khanLevel) => {
          const rank = KHAN_RANKS_DATA[khanLevel];
          if (!rank) return null;
          const count = memberCountsByKhan[khanLevel] || 0;
          const isSelected = selectedKhan === khanLevel;

          return (
            <button
              key={khanLevel}
              type="button"
              onClick={() => onSelectKhan(isSelected ? null : khanLevel)}
              className={`p-3.5 sm:p-4 rounded-2xl flex flex-col items-center text-center transition-all duration-300 relative group overflow-hidden border ${
                isSelected
                  ? 'bg-gradient-to-b from-red-950/60 via-zinc-900 to-black border-red-500 shadow-xl shadow-red-950/40 ring-2 ring-red-500/60 -translate-y-1'
                  : 'bg-zinc-900/80 hover:bg-zinc-900 border-zinc-800/90 hover:border-zinc-700 hover:-translate-y-0.5'
              }`}
              title={`Filtrar instrutores do ${rank.level}º Khan (${rank.colorName})`}
            >
              {/* Active selection checkmark */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}

              {/* Prajied Sacred Cord Illustration */}
              <div className="my-1 py-1 transition-transform group-hover:scale-110 duration-300">
                <PrajiedRope level={khanLevel} size="md" />
              </div>

              {/* Khan Number */}
              <div className="font-fight text-xl sm:text-2xl text-white uppercase tracking-wide leading-none mt-2">
                {rank.level}º KHAN
              </div>

              {/* Color Name */}
              <div className="text-[11px] font-mono font-bold tracking-tight text-red-400 uppercase mt-1 leading-snug">
                {rank.colorName}
              </div>

              {/* Title / Rank */}
              <div className="text-[10px] font-sans text-zinc-400 mt-0.5 leading-tight line-clamp-1">
                {rank.title}
              </div>

              {/* Member count pill */}
              <div className="mt-2.5 pt-2 border-t border-zinc-800/80 w-full flex items-center justify-center">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  isSelected 
                    ? 'bg-red-600 text-white font-semibold' 
                    : 'bg-zinc-800/90 text-zinc-400 group-hover:text-zinc-200'
                }`}>
                  {count} {count === 1 ? 'membro' : 'membros'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanatory footnote */}
      <div className="mt-6 pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-400">
        <div className="flex items-center gap-2">
          <Shield size={13} className="text-red-500" />
          <span>
            Clique em qualquer graduação acima para filtrar e visualizar os instrutores correspondentes.
          </span>
        </div>
        <div className="italic text-zinc-400">
          Tradição reconhecida de graduação em Muay Thai
        </div>
      </div>
    </div>
  );
};
