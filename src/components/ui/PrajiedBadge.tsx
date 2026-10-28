import React from 'react';
import { getKhanRank } from '../../data/gymsAndTeamData';

interface PrajiedRopeProps {
  level?: number;
  customPrimary?: string;
  customTip?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Authentic Muay Thai Prajied (sacred braided armband) SVG representation.
 * Accurately displays the primary cord color and the white tip ("ponta branca") when applicable.
 */
export const PrajiedRope: React.FC<PrajiedRopeProps> = ({ 
  level = 1, 
  customPrimary,
  customTip,
  size = 'sm', 
  className = '' 
}) => {
  const rank = getKhanRank(level);
  const rawPrimary = customPrimary || rank.primaryColor;
  // Para graduação preta (Khan 12 e 13), usamos #3f3f46 para garantir excelente contraste no fundo escuro
  const primary = rawPrimary === '#18181b' ? '#3f3f46' : rawPrimary;
  const tip = customTip !== undefined ? customTip : (rank.tipColor || primary);
  const isWhiteTip = Boolean(customTip || rank.tipColor);

  const sizeMap = {
    xs: { width: 18, height: 26 },
    sm: { width: 24, height: 34 },
    md: { width: 36, height: 50 },
    lg: { width: 54, height: 76 },
  };

  const { width, height } = sizeMap[size];

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block flex-shrink-0 drop-shadow-md ${className}`}
      aria-label={`Prajied ${rank.level}º Khan (${rank.colorName})`}
    >
      {/* Armband Loop (top circular curve com cor primária direta sem dependência frágil de gradient ID) */}
      <path
        d="M6 14 C6 5, 30 5, 30 14 C30 20, 6 20, 6 14 Z"
        stroke={primary}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      {/* Braided highlight accent no loop superior */}
      <path
        d="M8 13 C8 7, 28 7, 28 13"
        stroke="rgba(255, 255, 255, 0.35)"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Sacred Binding Knot (Nó sagrado dourado) */}
      <rect
        x="13"
        y="16"
        width="10"
        height="5"
        rx="2"
        fill="#f59e0b"
        stroke="#78350f"
        strokeWidth="0.5"
      />
      <rect
        x="15"
        y="17"
        width="6"
        height="2"
        rx="1"
        fill="#fef08a"
      />

      {/* Left Tassel / Cord end */}
      {/* Upper part of tassel (Cor primária) */}
      <path
        d="M15 21 L13 34"
        stroke={primary}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Tip of left tassel (Branca se ponta branca, ou primária) */}
      <path
        d="M13 34 L12 44"
        stroke={isWhiteTip ? tip : primary}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Right Tassel / Cord end */}
      {/* Upper part of tassel (Cor primária) */}
      <path
        d="M21 21 L23 34"
        stroke={primary}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Tip of right tassel (Branca se ponta branca, ou primária) */}
      <path
        d="M23 34 L24 44"
        stroke={isWhiteTip ? tip : primary}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Fringe / tassel small threads at the very end */}
      <circle cx="12" cy="45" r="1.3" fill={isWhiteTip ? '#ffffff' : primary} />
      <circle cx="24" cy="45" r="1.3" fill={isWhiteTip ? '#ffffff' : primary} />
    </svg>
  );
};

interface PrajiedBadgeProps {
  level: number;
  showRankTitle?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Visual badge for cards showing the Prajied rope, Khan number and color name.
 */
export const PrajiedBadge: React.FC<PrajiedBadgeProps> = ({
  level,
  showRankTitle = true,
  size = 'sm',
  className = '',
}) => {
  const rank = getKhanRank(level);

  // Border and accent styling depending on Khan color
  const getGlowBorder = () => {
    switch (rank.level) {
      case 16:
      case 15:
        return 'border-amber-400/80 bg-amber-950/70 shadow-amber-950/40';
      case 14:
        return 'border-slate-400/80 bg-slate-950/70 shadow-slate-900/30';
      case 13:
        return 'border-zinc-500/80 bg-zinc-950/90 shadow-zinc-700/20';
      case 12:
        return 'border-zinc-600/80 bg-zinc-950/90 shadow-zinc-800/30';
      case 11:
        return 'border-red-500/80 bg-gradient-to-r from-red-950/80 to-zinc-950/90 shadow-red-950/40';
      case 10:
        return 'border-red-600/70 bg-red-950/60 shadow-red-950/30';
      case 9:
        return 'border-amber-700/80 bg-gradient-to-r from-amber-950/80 to-zinc-950/90 shadow-amber-950/30';
      case 8:
        return 'border-amber-800/70 bg-amber-950/60 shadow-amber-950/30';
      case 7:
        return 'border-blue-500/80 bg-gradient-to-r from-blue-950/80 to-zinc-950/90 shadow-blue-950/30';
      case 6:
        return 'border-blue-600/70 bg-blue-950/50 shadow-blue-950/20';
      case 5:
      case 4:
        return 'border-emerald-600/70 bg-emerald-950/50 shadow-emerald-950/20';
      case 3:
      case 2:
        return 'border-yellow-500/70 bg-yellow-950/40 shadow-yellow-950/20';
      case 1:
        return 'border-slate-400/60 bg-slate-900/50';
      default:
        return 'border-zinc-700 bg-zinc-900';
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border shadow-lg backdrop-blur-md transition-transform hover:scale-[1.02] ${getGlowBorder()} ${className}`}
      title={`${rank.level}º Khan • ${rank.colorName} (${rank.title})`}
    >
      <PrajiedRope level={level} size={size === 'md' ? 'sm' : 'xs'} />

      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className="font-fight text-xs sm:text-sm font-bold tracking-wider text-white uppercase">
            {rank.level}º KHAN
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-tight text-zinc-300 font-medium">
            {rank.colorName}
          </span>
        </div>
        {showRankTitle && (
          <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">
            {rank.title}
          </span>
        )}
      </div>
    </div>
  );
};
