import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  as?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  as = 'button',
  href,
  target,
  rel,
  className = '',
  children,
  ...props
}) => {
  const baseClasses =
    'relative inline-flex items-center justify-center font-fight uppercase tracking-wider font-semibold transition-all duration-300 select-none min-h-[44px] min-w-[44px] group focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080809] active:scale-[0.98]';

  const sizeClasses = {
    sm: 'text-xs sm:text-sm px-3.5 py-1.5 sm:px-4 sm:py-2 text-[14px]',
    md: 'text-sm sm:text-base px-5 py-2.5 sm:px-6 sm:py-3 text-[16px]',
    lg: 'text-base sm:text-lg px-5 py-3 sm:px-8 sm:py-3.5 text-[17px] sm:text-[20px]',
  }[size];

  const variantClasses = {
    primary:
      'bg-red-600 hover:bg-red-500 text-white shadow-red-glow hover:shadow-red-glow-lg border border-red-500/50 hover:border-red-400',
    secondary:
      'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 border border-zinc-700/80 hover:border-red-500/50 hover:text-white',
    outline:
      'bg-transparent hover:bg-red-600/10 text-red-500 hover:text-red-400 border border-red-600/70 hover:border-red-500 shadow-sm',
    ghost:
      'bg-transparent hover:bg-zinc-800/60 text-zinc-300 hover:text-white',
  }[variant];

  const combinedClasses = `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`;

  if (as === 'a' && href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
        className={combinedClasses}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </a>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};
