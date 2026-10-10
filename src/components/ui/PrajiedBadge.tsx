import React from 'react';
import { getKhanRank } from '../../data/gymsAndTeamData';

interface PrajiedRopeProps {
  level: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Authentic Muay Thai Prajied (sacred braided armband) SVG representation.
 * Accurately displays the primary cord color and the white tip ("ponta branca") when applicable.
 */
export const PrajiedRope: React.FC<PrajiedRopeProps> = ({ level, size = 'sm', className = '' }) => {
  const rank = getKhanRank(level);
  const isWhiteTip = Boolean(rank.tipColor);

  const sizeMap = {
    xs: { width: 18, height: 26 },
    sm: { width: 24, height: 34 },
    md: { width: 36, height: 50 },
    lg: { width: 54, height: 76 },
  };

  const { width, height } = sizeMap[size];
  const primary = rank.primaryColor;
  const tip = rank.tipColor || primary;

  // Unique gradient IDs per level
  const cordGradId = `cord-grad-${level}-${size}`;
  const knotGradId = `knot-grad-${level}-${size}`;

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
      <defs>
        {/* Main braided cord gradient */}
        <linearGradient id={cordGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary === '#18181b' ? '#3f3f46' : primary} />
          <stop offset="50%" stopColor={primary} />
          <stop offset="100%" stopColor={primary === '#18181b' ? '#09090b' : primary} stopOpacity="0.85" />
        </linearGradient>

        {/* Sacred metallic knot binding */}
        <linearGradient id={knotGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        {/* Braided texture pattern */}
        <pattern id={`braid-pat-${level}`} width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M0 4L4 0M0 0L4 4" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
        </pattern>
      </defs>

      {/* Armband Loop (top circular curve) */}
      <path
        d="M6 14 C6 5, 30 5, 30 14 C30 20, 6 20, 6 14 Z"
        stroke={`url(#${cordGradId})`}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      {/* Texture overlay on loop */}
      <path
        d="M6 14 C6 5, 30 5, 30 14 C30 20, 6 20, 6 14 Z"
        stroke={`url(#braid-pat-${level})`}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Sacred Binding Knot */}
      <rect
        x="13"
        y="16"
        width="10"
        height="5"
        rx="2"
        fill={`url(#${knotGradId})`}
        stroke="#78350f"
        strokeWidth="0.5"
      />

      {/* Left Tassel / Cord end */}
      {/* Upper part of tassel (Primary color) */}
      <path
        d="M15 21 L13 34"
        stroke={`url(#${cordGradId})`}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Tip of left tassel (White if ponta branca, otherwise primary) */}
      <path
        d="M13 34 L12 44"
        stroke={isWhiteTip ? tip : `url(#${cordGradId})`}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Right Tassel / Cord end */}
      {/* Upper part of tassel (Primary color) */}
      <path
        d="M21 21 L23 34"
        stroke={`url(#${cordGradId})`}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Tip of right tassel (White if ponta branca, otherwise primary) */}
      <path
        d="M23 34 L24 44"
        stroke={isWhiteTip ? tip : `url(#${cordGradId})`}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Fringe / tassel small threads at the very end */}
      <circle cx="12" cy="45" r="1.2" fill={isWhiteTip ? '#ffffff' : primary} />
      <circle cx="24" cy="45" r="1.2" fill={isWhiteTip ? '#ffffff' : primary} />
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
      case 13:
        return 'border-zinc-500/80 bg-zinc-950/90 shadow-zinc-700/20';
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
