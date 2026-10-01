import React from 'react';

export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-red-600 focus:text-white focus:font-bold focus:shadow-xl focus:rounded-sm focus:outline-none"
    >
      Pular para o conteúdo principal
    </a>
  );
};
