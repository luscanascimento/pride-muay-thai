import React, { useState, useEffect, useCallback } from 'react';
import {
  Trophy,
  Plus,
  Edit,
  Trash2,
  Download,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { DbEventBracket } from '../../types/brackets';
import { bracketsService } from '../../services/bracketsService';
import { BracketModal } from './BracketModal';
import { BracketView } from '../brackets/BracketView';
import { downloadBracketAsImage } from '../../utils/bracketCanvasExport';

interface EventBracketsManagerProps {
  eventId: string;
  eventTitle: string;
  eventDate?: string;
  category?: string;
}

export const EventBracketsManager: React.FC<EventBracketsManagerProps> = ({
  eventId,
  eventTitle,
  eventDate,
}) => {
  const [brackets, setBrackets] = useState<DbEventBracket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeModalBracket, setActiveModalBracket] = useState<DbEventBracket | null | 'new'>(
    null
  );
  const [viewingBracket, setViewingBracket] = useState<DbEventBracket | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);

  const fetchBrackets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bracketsService.getBracketsByEventId(eventId);
      setBrackets(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar chaveamentos.');
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchBrackets();
  }, [fetchBrackets]);

  const handleDelete = async (bracket: DbEventBracket) => {
    const confirm = window.confirm(
      `Deseja realmente excluir o chaveamento "${bracket.title}"? Esta ação não pode ser desfeita.`
    );
    if (!confirm) return;

    try {
      await bracketsService.deleteBracket(bracket.id);
      await fetchBrackets();
      if (viewingBracket?.id === bracket.id) {
        setViewingBracket(null);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir chaveamento.');
    }
  };

  const handleDownloadDirect = async (bracket: DbEventBracket) => {
    setExportingId(bracket.id);
    try {
      await downloadBracketAsImage(bracket, {
        eventTitle,
        eventDate,
      });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Falha ao baixar imagem.');
    } finally {
      setExportingId(null);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-[#0c0c10] border border-zinc-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-red-500" />
            <h3 className="font-fight text-xl text-white uppercase tracking-wider">
              Chaveamentos de Lutas <span className="text-zinc-500 text-xs font-mono lowercase">(opcional)</span>
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Crie chaves de torneio, defina lutadores por categoria, registre os vencedores e baixe em imagem PNG em alta resolução.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveModalBracket('new')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase font-semibold transition-all shadow-red-glow"
        >
          <Plus size={16} />
          <span>Novo Chaveamento</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-10 flex flex-col items-center justify-center text-center">
          <RefreshCw size={24} className="animate-spin text-red-500 mb-2" />
          <p className="text-zinc-400 font-mono text-xs">Carregando chaveamentos do evento...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-900 text-red-400 text-xs font-mono flex items-center justify-between gap-2">
          <span>{error}</span>
          <button
            type="button"
            onClick={fetchBrackets}
            className="underline hover:text-white"
          >
            Tentar novamente
          </button>
        </div>
      ) : brackets.length === 0 ? (
        <div className="py-10 px-4 text-center rounded-xl bg-zinc-950/60 border border-dashed border-zinc-800">
          <Trophy size={32} className="text-zinc-600 mx-auto mb-2" />
          <p className="font-fight text-base text-zinc-300 uppercase">Nenhum chaveamento cadastrado</p>
          <p className="text-zinc-500 text-xs mt-1 max-w-md mx-auto">
            Este evento ainda não possui chaveamento de lutas. Para competições ou superlutas, clique no botão acima para montar o chaveamento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {brackets.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-fight text-lg text-white uppercase tracking-wider line-clamp-1">
                    {b.title}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                    {b.rounds?.length || 0} rodadas
                  </span>
                </div>
                {b.category_name && (
                  <p className="text-xs font-mono text-red-400 mt-0.5">
                    {b.category_name}
                  </p>
                )}
                <p className="text-[11px] font-mono text-zinc-500 mt-2">
                  Total de lutas: {b.rounds?.reduce((acc, r) => acc + (r.matches?.length || 0), 0) || 0}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setViewingBracket(b)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono uppercase transition-colors"
                >
                  <Eye size={13} />
                  <span>Visualizar</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDownloadDirect(b)}
                    disabled={exportingId === b.id}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 text-xs font-mono uppercase transition-colors"
                    title="Baixar imagem PNG do chaveamento"
                  >
                    {exportingId === b.id ? (
                      <RefreshCw size={13} className="animate-spin" />
                    ) : (
                      <Download size={13} />
                    )}
                    <span>PNG</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveModalBracket(b)}
                    className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    title="Editar chaveamento"
                  >
                    <Edit size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(b)}
                    className="p-1.5 rounded text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                    title="Excluir chaveamento"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Visualização Expandida Direta */}
      {viewingBracket && (
        <div className="mt-6 pt-6 border-t border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400 font-semibold">
              Pré-visualização do Chaveamento Selecionado:
            </span>
            <button
              type="button"
              onClick={() => setViewingBracket(null)}
              className="text-xs font-mono text-zinc-500 hover:text-white"
            >
              Fechar Pré-visualização
            </button>
          </div>
          <BracketView
            bracket={viewingBracket}
            eventTitle={eventTitle}
            eventDate={eventDate}
            canEdit={true}
            onEdit={(b) => setActiveModalBracket(b)}
          />
        </div>
      )}

      {/* Modal de Criação / Edição */}
      {activeModalBracket && (
        <BracketModal
          eventId={eventId}
          eventTitle={eventTitle}
          bracket={activeModalBracket === 'new' ? null : activeModalBracket}
          onClose={() => setActiveModalBracket(null)}
          onSaved={fetchBrackets}
        />
      )}
    </div>
  );
};
