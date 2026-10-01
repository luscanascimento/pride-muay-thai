import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'red' | 'graphite' | 'gold' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'red',
  className = '',
}) => {
  const variantStyles = {
    red: 'bg-red-950/40 text-red-400 border border-red-800/50 shadow-sm',
    graphite: 'bg-zinc-900/80 text-zinc-300 border border-zinc-700/60',
    gold: 'bg-amber-950/40 text-amber-400 border border-amber-800/40',
    outline: 'border border-zinc-700 text-zinc-400',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-sm ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
};
