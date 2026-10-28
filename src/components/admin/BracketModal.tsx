import React, { useState } from 'react';
import { X, Trophy, Save, RefreshCw, Download, AlertCircle } from 'lucide-react';
import {
  DbEventBracket,
  BracketRound,
  BracketMatch,
  BracketType,
  BracketWinner,
} from '../../types/brackets';
import { bracketsService } from '../../services/bracketsService';
import { downloadBracketAsImage } from '../../utils/bracketCanvasExport';

interface BracketModalProps {
  eventId: string;
  eventTitle: string;
  bracket?: DbEventBracket | null; // se presente, edição; se não, novo
  onClose: () => void;
  onSaved: () => void;
}

export const BracketModal: React.FC<BracketModalProps> = ({
  eventId,
  eventTitle,
  bracket,
  onClose,
  onSaved,
}) => {
  const isEditing = Boolean(bracket?.id);

  const [title, setTitle] = useState(bracket?.title || 'Torneio GP');
  const [categoryName, setCategoryName] = useState(bracket?.category_name || '');
  const [bracketType] = useState<BracketType>(
    bracket?.bracket_type || 'single_elimination'
  );
  const [rounds, setRounds] = useState<BracketRound[]>(() => {
    if (bracket?.rounds && bracket.rounds.length > 0) {
      return bracket.rounds;
    }
    return bracketsService.generateTemplateRounds('4_fighters');
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApplyTemplate = (type: '2_fighters' | '4_fighters' | '8_fighters' | 'super_fights') => {
    const templ = bracketsService.generateTemplateRounds(type);
    setRounds(templ);
  };

  const handleUpdateMatch = (
    roundIndex: number,
    matchId: string,
    field: keyof BracketMatch,
    val: unknown
  ) => {
    setRounds((prev) =>
      prev.map((r) => {
        if (r.round_index !== roundIndex) return r;
        return {
          ...r,
          matches: r.matches.map((m) => {
            if (m.id !== matchId) return m;
            return { ...m, [field]: val };
          }),
        };
      })
    );
  };

  const handleSetWinner = (roundIndex: number, matchId: string, winner: BracketWinner) => {
    setRounds((prev) => {
      const updated = prev.map((r) => {
        if (r.round_index !== roundIndex) return r;
        return {
          ...r,
          matches: r.matches.map((m) => {
            if (m.id !== matchId) return m;
            return { ...m, winner };
          }),
        };
      });

      // Se houver próximo round e a luta tiver next_match_id, podemos opcionalmente avançar o nome do atleta
      const currentRound = updated.find((r) => r.round_index === roundIndex);
      const match = currentRound?.matches.find((m) => m.id === matchId);
      const nextRound = updated.find((r) => r.round_index === roundIndex + 1);

      if (match && nextRound) {
        const winningFighter =
          winner === 'a' ? match.fighter_a : winner === 'b' ? match.fighter_b : '';
        const winningGym =
          winner === 'a' ? match.fighter_a_gym : winner === 'b' ? match.fighter_b_gym : '';

        if (winningFighter && match.next_match_id) {
          const targetMatch = nextRound.matches.find((m) => m.id === match.next_match_id);
          if (targetMatch) {
            // Se o match_number for ímpar, entra no fighter_a; se par, no fighter_b
            const isSlotA = match.match_number % 2 === 1;
            nextRound.matches = nextRound.matches.map((m) => {
              if (m.id !== match.next_match_id) return m;
              return {
                ...m,
                ...(isSlotA
                  ? { fighter_a: winningFighter, fighter_a_gym: winningGym }
                  : { fighter_b: winningFighter, fighter_b_gym: winningGym }),
              };
            });
          }
        }
      }

      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('O título do chaveamento é obrigatório.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && bracket?.id) {
        await bracketsService.updateBracket({
          id: bracket.id,
          title: title.trim(),
          category_name: categoryName.trim() || null,
          bracket_type: bracketType,
          rounds,
        });
      } else {
        await bracketsService.createBracket({
          event_id: eventId,
          title: title.trim(),
          category_name: categoryName.trim() || null,
          bracket_type: bracketType,
          rounds,
        });
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar chaveamento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPreview = async () => {
    setIsExporting(true);
    try {
      const tempBracket: DbEventBracket = {
        id: bracket?.id || 'temp',
        event_id: eventId,
        title,
        category_name: categoryName || null,
        bracket_type: bracketType,
        rounds,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: null,
        updated_by: null,
      };
      await downloadBracketAsImage(tempBracket, {
        eventTitle,
      });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Falha ao baixar imagem.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-5xl my-auto rounded-3xl bg-[#0e0e13] border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-fight text-2xl text-white uppercase tracking-wider">
              {isEditing ? 'Editar Chaveamento' : 'Criar Novo Chaveamento'}
            </h2>
            <p className="text-xs font-mono text-zinc-400 mt-0.5">
              Evento: <span className="text-red-400">{eventTitle}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            aria-label="Fechar modal"
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-grow">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-900 text-red-400 text-xs font-mono flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Meta: Title, Category, Fast Templates */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <label className="block text-xs font-mono uppercase text-zinc-300 mb-1.5">
                Título do Chaveamento *
              </label>
              <input
                type="text"
                required
                maxLength={150}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Torneio GP até 70kg, Card Principal..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="md:col-span-6">
              <label className="block text-xs font-mono uppercase text-zinc-300 mb-1.5">
                Categoria / Peso <span className="text-zinc-500 font-normal lowercase">(opcional)</span>
              </label>
              <input
                type="text"
                maxLength={100}
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Ex: Adulto Masculino (até 71kg)"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Templates rápidos */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <span className="block text-xs font-mono uppercase text-zinc-400 mb-2 font-semibold">
              Modelos Rápidos de Torneio:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleApplyTemplate('2_fighters')}
                className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-red-500/50 text-xs font-mono transition-colors"
              >
                2 Lutadores (Final Direta)
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate('4_fighters')}
                className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-red-500/50 text-xs font-mono transition-colors"
              >
                4 Lutadores (Semifinal + Final)
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate('8_fighters')}
                className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-red-500/50 text-xs font-mono transition-colors"
              >
                8 Lutadores (Quartas + Semis + Final)
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate('super_fights')}
                className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-red-500/50 text-xs font-mono transition-colors"
              >
                Card de Superlutas (3 Lutas Casadas)
              </button>
            </div>
          </div>

          {/* Rodadas e Lutas */}
          <div className="space-y-6">
            {rounds.map((round) => (
              <div
                key={round.round_index}
                className="p-4 sm:p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800"
              >
                <div className="flex items-center justify-between gap-4 mb-4 pb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Trophy size={16} className="text-red-500" />
                    <input
                      type="text"
                      value={round.round_name}
                      onChange={(e) => {
                        const newName = e.target.value;
                        setRounds((prev) =>
                          prev.map((r) =>
                            r.round_index === round.round_index
                              ? { ...r, round_name: newName }
                              : r
                          )
                        );
                      }}
                      className="bg-transparent font-fight text-lg text-white uppercase border-b border-transparent focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <span className="text-xs font-mono text-zinc-500">
                    {round.matches.length} {round.matches.length === 1 ? 'Luta' : 'Lutas'}
                  </span>
                </div>

                {/* Grid de lutas da rodada */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {round.matches.map((match) => (
                    <div
                      key={match.id}
                      className="p-3.5 rounded-xl bg-[#0f0f14] border border-zinc-800 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                        <span className="font-bold text-red-500">Luta #{match.match_number}</span>
                        <input
                          type="text"
                          value={match.win_method || ''}
                          onChange={(e) =>
                            handleUpdateMatch(round.round_index, match.id, 'win_method', e.target.value)
                          }
                          placeholder="Método: KO, Decisão..."
                          className="bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-[11px] text-zinc-300 w-36 text-right focus:outline-none focus:ring-1 focus:ring-red-500"
                        />
                      </div>

                      {/* Atleta A (Vermelho) */}
                      <div
                        className={`p-2.5 rounded-lg border transition-all ${
                          match.winner === 'a'
                            ? 'bg-red-950/40 border-red-500 ring-1 ring-red-500/50'
                            : 'bg-zinc-900/60 border-zinc-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-mono uppercase font-bold text-red-400">
                            Corner Vermelho
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleSetWinner(
                                round.round_index,
                                match.id,
                                match.winner === 'a' ? null : 'a'
                              )
                            }
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition-colors ${
                              match.winner === 'a'
                                ? 'bg-amber-400 text-black font-extrabold shadow'
                                : 'bg-zinc-800 text-zinc-400 hover:text-white'
                            }`}
                          >
                            {match.winner === 'a' ? '★ Vencedor' : 'Marcar Vitória'}
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={match.fighter_a}
                            onChange={(e) =>
                              handleUpdateMatch(round.round_index, match.id, 'fighter_a', e.target.value)
                            }
                            placeholder="Nome do Lutador A"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-red-500"
                          />
                          <input
                            type="text"
                            value={match.fighter_a_gym || ''}
                            onChange={(e) =>
                              handleUpdateMatch(round.round_index, match.id, 'fighter_a_gym', e.target.value)
                            }
                            placeholder="Academia / Cidade"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-400 focus:outline-none focus:ring-1 focus:ring-red-500"
                          />
                        </div>
                      </div>

                      {/* Atleta B (Azul) */}
                      <div
                        className={`p-2.5 rounded-lg border transition-all ${
                          match.winner === 'b'
                            ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500/50'
                            : 'bg-zinc-900/60 border-zinc-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-mono uppercase font-bold text-blue-400">
                            Corner Azul
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleSetWinner(
                                round.round_index,
                                match.id,
                                match.winner === 'b' ? null : 'b'
                              )
                            }
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition-colors ${
                              match.winner === 'b'
                                ? 'bg-amber-400 text-black font-extrabold shadow'
                                : 'bg-zinc-800 text-zinc-400 hover:text-white'
                            }`}
                          >
                            {match.winner === 'b' ? '★ Vencedor' : 'Marcar Vitória'}
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={match.fighter_b}
                            onChange={(e) =>
                              handleUpdateMatch(round.round_index, match.id, 'fighter_b', e.target.value)
                            }
                            placeholder="Nome do Lutador B"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={match.fighter_b_gym || ''}
                            onChange={(e) =>
                              handleUpdateMatch(round.round_index, match.id, 'fighter_b_gym', e.target.value)
                            }
                            placeholder="Academia / Cidade"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleDownloadPreview}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono uppercase font-semibold transition-colors"
            >
              {isExporting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Gerando...</span>
                </>
              ) : (
                <>
                  <Download size={14} />
                  <span>Baixar Imagem PNG</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-sm bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-xs font-mono uppercase transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-mono text-xs uppercase font-semibold transition-all shadow-red-glow"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Salvar Chaveamento</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
