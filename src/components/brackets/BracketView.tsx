import React, { useState } from 'react';
import { Download, Trophy, RefreshCw } from 'lucide-react';
import { DbEventBracket, BracketMatch } from '../../types/brackets';
import { downloadBracketAsImage } from '../../utils/bracketCanvasExport';

interface BracketViewProps {
  bracket: DbEventBracket;
  eventTitle: string;
  eventDate?: string;
  onEdit?: (bracket: DbEventBracket) => void;
  canEdit?: boolean;
}

export const BracketView: React.FC<BracketViewProps> = ({
  bracket,
  eventTitle,
  eventDate,
  onEdit,
  canEdit = false,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      await downloadBracketAsImage(bracket, {
        eventTitle,
        eventDate,
      });
    } catch (err: unknown) {
      setExportError(err instanceof Error ? err.message : 'Falha ao gerar imagem.');
    } finally {
      setIsExporting(false);
    }
  };

  const rounds = bracket.rounds || [];

  // Localizar o campeão (vencedor da última luta da última rodada)
  const lastRound = rounds[rounds.length - 1];
  const finalMatch = lastRound?.matches[lastRound.matches.length - 1];
  const championName =
    finalMatch?.winner === 'a'
      ? finalMatch.fighter_a
      : finalMatch?.winner === 'b'
      ? finalMatch.fighter_b
      : null;
  const championGym =
    finalMatch?.winner === 'a'
      ? finalMatch.fighter_a_gym
      : finalMatch?.winner === 'b'
      ? finalMatch.fighter_b_gym
      : null;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#0b0b0f] overflow-hidden shadow-2xl">
      {/* Top action bar */}
      <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <h3 className="font-fight text-xl sm:text-2xl text-white uppercase tracking-wider">
              {bracket.title}
            </h3>
          </div>
          {bracket.category_name && (
            <p className="text-xs font-mono text-red-400 uppercase tracking-wider mt-0.5">
              Categoria: {bracket.category_name}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {canEdit && onEdit && (
            <button
              type="button"
              onClick={() => onEdit(bracket)}
              className="px-3.5 py-1.5 rounded-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono uppercase font-semibold transition-colors"
            >
              Editar Chaveamento
            </button>
          )}

          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-mono text-xs uppercase font-semibold transition-all shadow-red-glow hover:shadow-red-glow-lg"
          >
            {isExporting ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Gerando Imagem...</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>Baixar Imagem (PNG)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {exportError && (
        <div className="px-5 py-2.5 bg-red-950/40 border-b border-red-900 text-red-400 text-xs font-mono">
          {exportError}
        </div>
      )}

      {/* Visual Bracket Arena */}
      <div className="p-5 sm:p-8 overflow-x-auto">
        <div className="inline-flex items-start gap-8 min-w-full justify-start lg:justify-center py-2">
          {rounds.map((round) => (
            <div key={round.round_index} className="flex flex-col min-w-[260px] max-w-[300px] flex-shrink-0">
              {/* Round title */}
              <div className="mb-4 pb-2 border-b-2 border-red-600">
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-red-500">
                  {round.round_name}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 block">
                  {round.matches.length} {round.matches.length === 1 ? 'luta' : 'lutas'}
                </span>
              </div>

              {/* Match cards */}
              <div className="flex flex-col gap-4 justify-around flex-grow">
                {round.matches.map((match: BracketMatch) => {
                  const isWinnerA = match.winner === 'a';
                  const isWinnerB = match.winner === 'b';

                  return (
                    <div
                      key={match.id}
                      className="rounded-xl border border-zinc-800 bg-[#121217] overflow-hidden shadow-lg hover:border-zinc-700 transition-colors"
                    >
                      {/* Corner A (Vermelho) */}
                      <div
                        className={`p-2.5 flex items-center justify-between border-l-4 transition-colors ${
                          isWinnerA
                            ? 'border-red-500 bg-red-950/30'
                            : 'border-red-600/60 bg-transparent'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <span
                            className={`font-semibold text-xs sm:text-sm block truncate ${
                              isWinnerA ? 'text-white font-bold' : 'text-zinc-300'
                            }`}
                          >
                            {match.fighter_a || 'A definir'}
                          </span>
                          {match.fighter_a_gym && (
                            <span className="text-[10px] font-mono text-zinc-500 block truncate">
                              {match.fighter_a_gym}
                            </span>
                          )}
                        </div>
                        {isWinnerA && (
                          <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded flex-shrink-0">
                            ★ VENCEDOR
                          </span>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="border-t border-zinc-800/80 px-3 py-0.5 bg-zinc-950/40 text-[9px] font-mono uppercase text-zinc-500 flex items-center justify-between">
                        <span>Luta {match.match_number}</span>
                        {match.win_method && (
                          <span className="text-zinc-400 font-semibold">{match.win_method}</span>
                        )}
                      </div>

                      {/* Corner B (Azul) */}
                      <div
                        className={`p-2.5 flex items-center justify-between border-l-4 transition-colors ${
                          isWinnerB
                            ? 'border-blue-500 bg-blue-950/30'
                            : 'border-blue-600/60 bg-transparent'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <span
                            className={`font-semibold text-xs sm:text-sm block truncate ${
                              isWinnerB ? 'text-white font-bold' : 'text-zinc-300'
                            }`}
                          >
                            {match.fighter_b || 'A definir'}
                          </span>
                          {match.fighter_b_gym && (
                            <span className="text-[10px] font-mono text-zinc-500 block truncate">
                              {match.fighter_b_gym}
                            </span>
                          )}
                        </div>
                        {isWinnerB && (
                          <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded flex-shrink-0">
                            ★ VENCEDOR
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Champion Box */}
          {championName && (
            <div className="flex flex-col justify-center min-w-[220px] self-center">
              <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/10 via-zinc-900 to-zinc-950 border-2 border-amber-500/60 shadow-2xl text-center">
                <Trophy size={36} className="text-amber-400 mx-auto mb-2 drop-shadow" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                  Campeão do Torneio
                </span>
                <span className="font-fight text-xl sm:text-2xl text-white uppercase block mt-1">
                  {championName}
                </span>
                {championGym && (
                  <span className="text-xs font-mono text-zinc-400 block mt-0.5">
                    {championGym}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
