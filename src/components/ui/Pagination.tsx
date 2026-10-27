import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) {
      pages.push('ellipsis');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push('ellipsis');
    }

    pages.push(totalPages);
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      role="navigation"
      aria-label="Navegação entre páginas"
      className={`flex items-center justify-center gap-1 sm:gap-2 my-8 ${className}`}
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Ir para página anterior"
        className="inline-flex items-center justify-center min-w-[38px] h-[38px] px-2.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline text-xs font-mono uppercase ml-1">Anterior</span>
      </button>

      {pages.map((p, idx) => {
        if (p === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 text-zinc-600 font-mono select-none"
              aria-hidden="true"
            >
              …
            </span>
          );
        }

        const isCurrent = p === currentPage;
        return (
          <button
            key={`page-${p}`}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={isCurrent ? 'page' : undefined}
            aria-label={`Página ${p}`}
            className={`min-w-[38px] h-[38px] px-3 font-mono text-xs font-semibold rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
              isCurrent
                ? 'bg-red-600 text-white border border-red-500 shadow-red-glow'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            {p}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Ir para próxima página"
        className="inline-flex items-center justify-center min-w-[38px] h-[38px] px-2.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        <span className="hidden sm:inline text-xs font-mono uppercase mr-1">Próxima</span>
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};
