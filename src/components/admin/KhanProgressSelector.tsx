import React, { useState } from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { ALL_KHANS_SYSTEM, getKhanRank } from '../../constants/khans';
import { PrajiedRope } from '../ui/PrajiedBadge';

interface KhanProgressSelectorProps {
  selectedKhan: number;
  initialKhan?: number;
  onSelectKhan: (targetKhan: number, isCorrection: boolean) => void;
  disabled?: boolean;
}

export const KhanProgressSelector: React.FC<KhanProgressSelectorProps> = ({
  selectedKhan,
  initialKhan = 1,
  onSelectKhan,
  disabled = false,
}) => {
  const [pendingRegression, setPendingRegression] = useState<number | null>(null);

  const handleLevelClick = (level: number) => {
    if (disabled) return;

    // Se estiver reduzindo o nível em relação ao original do aluno, exige confirmação explícita
    if (level < initialKhan) {
      setPendingRegression(level);
      return;
    }

    onSelectKhan(level, false);
  };

  const handleConfirmRegression = () => {
    if (pendingRegression !== null) {
      onSelectKhan(pendingRegression, true);
      setPendingRegression(null);
    }
  };

  const currentRank = getKhanRank(selectedKhan);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
            Progressão Cumulativa de Khans
          </span>
          <span className="font-fight text-xl text-white uppercase mt-0.5 block">
            {selectedKhan}º KHAN — <span className="text-red-500">{currentRank.colorName}</span> ({currentRank.title})
          </span>
        </div>
        <span className="text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-sm">
          Níveis 1 a {selectedKhan} ativos
        </span>
      </div>

      {/* Grid with 16 khans in exact official sequence */}
      <div
        role="group"
        aria-label="Seletor cumulativo dos 16 Khans"
        className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2"
      >
        {ALL_KHANS_SYSTEM.map((khan) => {
          const isActive = khan.level <= selectedKhan;
          const isCurrent = khan.level === selectedKhan;

          return (
            <button
              key={`khan-btn-${khan.level}`}
              type="button"
              disabled={disabled}
              onClick={() => handleLevelClick(khan.level)}
              aria-pressed={isActive}
              aria-label={`${khan.level}º Khan: ${khan.colorName} (${khan.title})${isActive ? ' - Conquistado' : ''}`}
              className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-between gap-2 transition-all relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                isCurrent
                  ? 'bg-gradient-to-b from-red-950/70 to-zinc-900 border-red-500 shadow-red-glow/30 shadow-lg scale-[1.03] z-10'
                  : isActive
                  ? 'bg-zinc-900/90 border-zinc-700/80 hover:border-zinc-600'
                  : 'bg-zinc-950/50 border-zinc-900/80 opacity-40 hover:opacity-75 hover:border-zinc-800'
              }`}
            >
              {/* Check indicator */}
              <div className="absolute top-1.5 right-1.5">
                {isActive ? (
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                    isCurrent ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    <Check size={9} strokeWidth={3} />
                  </div>
                ) : null}
              </div>

              <PrajiedRope level={khan.level} size="xs" />

              <div className="text-center w-full">
                <span className={`block font-fight text-xs uppercase tracking-tight ${
                  isCurrent ? 'text-white font-bold' : isActive ? 'text-zinc-200' : 'text-zinc-500'
                }`}>
                  {khan.level}º Khan
                </span>
                <span className="block text-[9px] font-mono text-zinc-400 truncate w-full" title={khan.colorName}>
                  {khan.colorName}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">
        * Selecionar um Khan ativa automaticamente todos os níveis anteriores do 1º até o selecionado, garantindo a integridade cumulativa da graduação.
      </p>

      {/* Regression Confirmation Modal */}
      {pendingRegression !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="w-full max-w-md p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-500 mb-3">
              <AlertTriangle size={24} />
              <h3 className="font-fight text-xl uppercase tracking-wider text-white">
                Confirmar Correção de Graduação
              </h3>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Você está reduzindo o Khan do aluno de <strong>{initialKhan}º Khan</strong> para <strong>{pendingRegression}º Khan</strong>.
            </p>
            <p className="text-xs text-amber-400/90 mt-2 p-3 rounded bg-amber-950/40 border border-amber-900/50">
              Esta ação removerá do histórico os registros de graduação superiores ao {pendingRegression}º Khan. Use esta opção apenas para correções de cadastro.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingRegression(null)}
                className="px-4 py-2 rounded-sm bg-zinc-800 text-zinc-300 hover:text-white font-mono text-xs uppercase"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmRegression}
                className="px-4 py-2 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs uppercase font-semibold transition-colors"
              >
                Confirmar Correção
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
