import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  ArrowLeft,
  AlertTriangle,
  ExternalLink,
  Phone,
  FileText,
  CheckCircle,
  RefreshCw,
  Trophy,
  Edit,
  Tag,
  Copy,
  Check,
  QrCode,
} from 'lucide-react';
import { eventsService } from '../../services/eventsService';
import { bracketsService } from '../../services/bracketsService';
import { useAuth } from '../../hooks/useAuth';
import { DbEvent } from '../../types/database';
import { DbEventBracket } from '../../types/brackets';
import { EventStatusBadge } from '../events/EventStatusBadge';
import { BracketView } from '../brackets/BracketView';
import { Button } from '../ui/Button';
import { InstagramIcon, YoutubeIcon } from '../ui/Icons';
import { BRAND } from '../../constants/brand';
import { formatDateTime } from '../../utils/date';
import { navigateTo } from '../../utils/routes';
import { getGoogleMapsSearchUrl } from '../../utils/maps';
import { formatDisplayPrice } from '../../utils/currency';

interface EventDetailPageProps {
  slug: string;
  onBack?: () => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({ slug, onBack }) => {
  const { isAdmin } = useAuth();
  const [event, setEvent] = useState<DbEvent | null>(null);
  const [brackets, setBrackets] = useState<DbEventBracket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedPix, setCopiedPix] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    eventsService
      .getPublicEventBySlug(slug)
      .then(async (data) => {
        if (!isMounted) return;
        if (!data) {
          setError('Evento não encontrado ou indisponível.');
        } else {
          setEvent(data);
          try {
            const bData = await bracketsService.getBracketsByEventId(data.id);
            if (isMounted) {
              setBrackets(bData);
            }
          } catch {
            // Chaveamento é opcional; falha silenciosa para não travar a página de detalhes
          }
        }
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'Erro ao carregar detalhes do evento.';
        setError(msg);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigateTo('/eventos');
    }
  };

  const handleCopyPix = async () => {
    const key = event?.pix_key || '12991746964';
    try {
      await navigator.clipboard.writeText(key);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2500);
    } catch {
      alert(`Chave PIX: ${key}`);
    }
  };

  const visibleBrackets = brackets.filter((b) => isAdmin || Boolean(b.is_published));

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 px-4 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <RefreshCw size={36} className="animate-spin text-red-500 mb-4" />
        <p className="text-zinc-400 font-mono text-sm">Carregando detalhes do evento...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="pt-32 pb-24 px-4 max-w-xl mx-auto text-center min-h-[60vh] flex flex-col items-center justify-center">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h1 className="font-fight text-2xl sm:text-3xl text-white uppercase mb-2">Evento Não Encontrado</h1>
        <p className="text-zinc-400 text-sm mb-6">{error || 'O evento solicitado não existe ou foi removido.'}</p>
        <Button variant="secondary" size="md" onClick={handleBack}>
          <ArrowLeft size={16} />
          Voltar para Eventos
        </Button>
      </div>
    );
  }

  const isCancelled = event.status === 'cancelled';

  return (
    <article className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-[75vh]">
      {/* Top action bar: Return button + Admin Edit button */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 p-1 rounded"
        >
          <ArrowLeft size={16} className="text-red-500" />
          <span>Voltar para lista de eventos</span>
        </button>

        {isAdmin && (
          <button
            type="button"
            onClick={() => navigateTo(`/admin/eventos/${event.id}/editar`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-zinc-900 border border-zinc-700/80 hover:border-red-500/80 text-zinc-200 hover:text-white text-xs font-mono uppercase font-semibold transition-all shadow-sm group"
          >
            <Edit size={14} className="text-red-500 group-hover:scale-110 transition-transform" />
            <span>Editar Evento</span>
          </button>
        )}
      </div>

      {/* Prominent Cancellation Banner if Cancelled */}
      {isCancelled && (
        <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-red-950/60 border border-red-700 text-red-200 flex items-start gap-4 shadow-xl">
          <AlertTriangle size={28} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-fight text-xl uppercase tracking-wider text-white">Evento Cancelado</h2>
            <p className="text-sm text-red-300 mt-1 leading-relaxed">
              Este evento foi oficialmente cancelado pela diretoria da Pride Muay Thai. Em caso de dúvidas sobre inscrições ou remarcações, entre em contato diretamente com nossos canais oficiais.
            </p>
          </div>
        </div>
      )}

      {/* Header section */}
      <header className="mb-8 pb-8 border-b border-zinc-800">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <EventStatusBadge category={event.category} />
          <EventStatusBadge status={event.status} />
        </div>

        <h1 className="font-fight text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-wider leading-tight">
          {event.title}
        </h1>

        {event.summary && (
          <p className="text-zinc-300 text-base sm:text-lg mt-4 leading-relaxed font-normal">
            {event.summary}
          </p>
        )}

        {/* Highlight metadata cards */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${event.price ? 'lg:grid-cols-3' : ''} gap-4 mt-8 pt-6 border-t border-zinc-800/80`}>
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-start gap-3">
            <Calendar size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">Data e Horário</span>
              <span className="text-sm sm:text-base font-semibold text-white mt-0.5 block">
                {formatDateTime(event.event_date)}
              </span>
              {event.end_date && (
                <span className="text-xs text-zinc-400 block mt-0.5">
                  Término previsto: {formatDateTime(event.end_date)}
                </span>
              )}
            </div>
          </div>

          <a
            href={getGoogleMapsSearchUrl(event.location)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-red-500/60 hover:bg-zinc-900/90 transition-all flex items-start justify-between gap-3 group"
            title="Abrir localização no Google Maps"
            aria-label={`Abrir ${event.location} no Google Maps`}
          >
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-red-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <span className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 group-hover:text-zinc-300">
                  Localização
                </span>
                <span className="text-sm sm:text-base font-semibold text-white group-hover:text-red-400 transition-colors mt-0.5 block">
                  {event.location}
                </span>
                <span className="text-[11px] font-mono text-zinc-500 group-hover:text-zinc-400 flex items-center gap-1 mt-1">
                  Ver no Google Maps
                </span>
              </div>
            </div>
            <ExternalLink size={16} className="text-zinc-500 group-hover:text-red-400 transition-colors flex-shrink-0 mt-0.5" />
          </a>

          {event.price && (
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-start gap-3 sm:col-span-2 lg:col-span-1">
              <Tag size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">Valor / Inscrição</span>
                <span className="text-sm sm:text-base font-semibold text-white mt-0.5 block font-mono">
                  {formatDisplayPrice(event.price)}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Editorial Content / Description */}
      <section className="mb-10">
        <h2 className="font-fight text-2xl text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <FileText size={20} className="text-red-500" />
          <span>Sobre o Evento</span>
        </h2>
        <div className="p-6 rounded-2xl bg-[#0d0d12] border border-zinc-800/90 shadow-xl text-zinc-300 text-base leading-relaxed whitespace-pre-line font-sans">
          {event.description}
        </div>
      </section>

      {/* Requirements section */}
      {event.requirements && (
        <section className="mb-10">
          <h2 className="font-fight text-2xl text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle size={20} className="text-red-500" />
            <span>Requisitos & Participação</span>
          </h2>
          <div className="p-6 rounded-2xl bg-[#0d0d12] border border-zinc-800/90 shadow-xl text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {event.requirements}
          </div>
        </section>
      )}

      {/* Pagamento & Inscrição via PIX (Opcional) */}
      {event.show_pix && !isCancelled && (
        <section className="mb-10 p-6 sm:p-7 rounded-2xl bg-[#0b100d] border border-emerald-900/60 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-emerald-950">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <QrCode size={20} />
              </div>
              <div>
                <h2 className="font-fight text-xl sm:text-2xl text-white uppercase tracking-wider">
                  Pagamento & Inscrição via PIX
                </h2>
                <span className="text-xs text-zinc-400 font-mono">
                  {event.price ? `Valor: ${formatDisplayPrice(event.price)}` : 'Chave PIX Oficial da Organização'}
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 font-mono text-xs uppercase font-semibold">
              <CheckCircle size={13} />
              <span>Chave Verificada</span>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                Chave PIX
              </span>
              <span className="text-base sm:text-xl font-mono font-bold text-emerald-400 tracking-wider block select-all">
                {event.pix_key || '12991746964'}
              </span>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                {event.price && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 font-mono text-xs font-semibold">
                    Valor: {formatDisplayPrice(event.price)}
                  </span>
                )}
                <span className="text-xs text-zinc-400">
                  Beneficiário: Renan Fernandes (Hulkinho) — Pride Muay Thai
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyPix}
              className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm font-mono text-xs uppercase font-semibold transition-all ${
                copiedPix
                  ? 'bg-emerald-600 text-white shadow-emerald-glow'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {copiedPix ? (
                <>
                  <Check size={15} />
                  <span>Chave Copiada!</span>
                </>
              ) : (
                <>
                  <Copy size={15} />
                  <span>Copiar Chave PIX</span>
                </>
              )}
            </button>
          </div>
        </section>
      )}

      {/* Registration details, Social Channels & Actions */}
      {(event.registration_info || event.registration_url || event.show_instagram || event.show_youtube) && !isCancelled && (
        <section className="mb-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-red-950/30 to-zinc-900/60 border border-red-900/50 shadow-2xl">
          <h2 className="font-fight text-2xl sm:text-3xl text-white uppercase tracking-wider mb-3">
            Como Participar & Acompanhar
          </h2>

          {event.registration_info && (
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-6">
              {event.registration_info}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {event.registration_url && (
              <Button
                as="a"
                href={event.registration_url}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="lg"
              >
                <span>Inscrever-se no Evento</span>
                <ExternalLink size={18} />
              </Button>
            )}

            {event.show_instagram && (
              <Button
                as="a"
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="lg"
                className="border-pink-900/40 hover:border-pink-600/70 text-zinc-200 hover:text-white"
              >
                <InstagramIcon size={18} className="text-pink-500" />
                <span>Instagram Oficial</span>
                <ExternalLink size={14} className="text-zinc-500" />
              </Button>
            )}

            {event.show_youtube && (
              <Button
                as="a"
                href={BRAND.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="lg"
                className="border-red-900/40 hover:border-red-600/70 text-zinc-200 hover:text-white"
              >
                <YoutubeIcon size={18} className="text-red-500" />
                <span>Canal no YouTube</span>
                <ExternalLink size={14} className="text-zinc-500" />
              </Button>
            )}
          </div>
        </section>
      )}

      {/* Chaveamentos de Competição / Lutas (Opcional - visível se publicado ou para admin logado) */}
      {visibleBrackets.length > 0 && (
        <section className="mb-12 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Trophy size={24} className="text-red-500" />
              <h2 className="font-fight text-2xl sm:text-3xl text-white uppercase tracking-wider">
                Chaveamentos & Lutas Oficiais
              </h2>
            </div>
            {isAdmin && (
              <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                Visualização de Administrador
              </span>
            )}
          </div>
          {visibleBrackets.map((b) => (
            <div key={b.id} className="space-y-2">
              {isAdmin && (
                <div className="flex items-center justify-between px-2 text-xs font-mono">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      b.is_published
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                        : 'bg-amber-950/40 text-amber-400 border border-amber-800/50'
                    }`}
                  >
                    {b.is_published
                      ? '● Chaveamento Público'
                      : '○ Chaveamento Privado (Oculto para o Público)'}
                  </span>
                </div>
              )}
              <BracketView
                bracket={b}
                eventTitle={event.title}
                eventDate={formatDateTime(event.event_date)}
              />
            </div>
          ))}
        </section>
      )}

      {/* Contact section */}
      {event.contact && (
        <section className="mb-12 p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center gap-3 text-sm text-zinc-300">
          <Phone size={18} className="text-red-500 flex-shrink-0" />
          <div>
            <strong className="text-white uppercase font-mono text-xs block">Contato & Informações:</strong>
            <span>{event.contact}</span>
          </div>
        </section>
      )}

      {/* Bottom return button */}
      <div className="pt-6 border-t border-zinc-800 flex justify-between items-center">
        <Button variant="secondary" size="md" onClick={handleBack}>
          <ArrowLeft size={16} />
          <span>Voltar para Eventos</span>
        </Button>
      </div>
    </article>
  );
};
