import React, { useState, useEffect } from 'react';
import {
  Save,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Eye,
} from 'lucide-react';
import { eventsService, CreateEventInput } from '../../services/eventsService';
import { EventCategory, EventStatus } from '../../types/database';
import { generateSlug } from '../../utils/slug';
import { navigateTo } from '../../utils/routes';

interface EventFormProps {
  eventId?: string; // Se fornecido, modo de edição; se não, modo de criação
}

export const EventForm: React.FC<EventFormProps> = ({ eventId }) => {
  const isEditing = Boolean(eventId);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [category, setCategory] = useState<EventCategory>('competition');
  const [status, setStatus] = useState<EventStatus>('draft');
  const [eventDate, setEventDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [registrationInfo, setRegistrationInfo] = useState('');
  const [registrationUrl, setRegistrationUrl] = useState('');
  const [contact, setContact] = useState('');

  const [isLoadingEvent, setIsLoadingEvent] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Carregar dados caso seja modo de edição
  useEffect(() => {
    if (!eventId) return;

    let isMounted = true;
    setIsLoadingEvent(true);

    eventsService
      .getEventById(eventId)
      .then((event) => {
        if (!isMounted || !event) return;
        setTitle(event.title);
        setSlug(event.slug);
        setIsSlugManuallyEdited(true);
        setCategory(event.category);
        setStatus(event.status);
        setLocation(event.location);
        setSummary(event.summary);
        setDescription(event.description);
        setRequirements(event.requirements || '');
        setRegistrationInfo(event.registration_info || '');
        setRegistrationUrl(event.registration_url || '');
        setContact(event.contact || '');

        // Formatar para formato do input datetime-local: YYYY-MM-DDTHH:mm
        if (event.event_date) {
          const d = new Date(event.event_date);
          const offset = d.getTimezoneOffset() * 60000;
          const localIso = new Date(d.getTime() - offset).toISOString().slice(0, 16);
          setEventDate(localIso);
        }
        if (event.end_date) {
          const d = new Date(event.end_date);
          const offset = d.getTimezoneOffset() * 60000;
          const localIso = new Date(d.getTime() - offset).toISOString().slice(0, 16);
          setEndDate(localIso);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setFeedback({
          type: 'error',
          message: err instanceof Error ? err.message : 'Erro ao carregar dados do evento.',
        });
      })
      .finally(() => {
        if (isMounted) setIsLoadingEvent(false);
      });

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManuallyEdited) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setIsSlugManuallyEdited(true);
    setSlug(generateSlug(val));
  };

  const handleSubmit = async (targetStatus?: EventStatus) => {
    setFeedback(null);

    // Validações
    if (!title.trim()) {
      setFeedback({ type: 'error', message: 'O título do evento é obrigatório.' });
      return;
    }
    if (title.length > 120) {
      setFeedback({ type: 'error', message: 'O título não pode exceder 120 caracteres.' });
      return;
    }
    if (!slug.trim()) {
      setFeedback({ type: 'error', message: 'O slug do evento é obrigatório.' });
      return;
    }
    if (!summary.trim()) {
      setFeedback({ type: 'error', message: 'O resumo do evento é obrigatório.' });
      return;
    }
    if (summary.length > 300) {
      setFeedback({ type: 'error', message: 'O resumo não pode exceder 300 caracteres.' });
      return;
    }
    if (!description.trim()) {
      setFeedback({ type: 'error', message: 'A descrição completa do evento é obrigatória.' });
      return;
    }
    if (description.length > 5000) {
      setFeedback({ type: 'error', message: 'A descrição não pode exceder 5.000 caracteres.' });
      return;
    }
    if (!eventDate) {
      setFeedback({ type: 'error', message: 'A data e horário do evento são obrigatórios.' });
      return;
    }
    if (!location.trim()) {
      setFeedback({ type: 'error', message: 'O local do evento é obrigatório.' });
      return;
    }
    if (location.length > 200) {
      setFeedback({ type: 'error', message: 'O local não pode exceder 200 caracteres.' });
      return;
    }

    const finalStatus = targetStatus || status;

    setIsSubmitting(true);
    try {
      const payload: CreateEventInput = {
        title: title.trim(),
        slug: slug.trim(),
        category,
        status: finalStatus,
        event_date: new Date(eventDate).toISOString(),
        end_date: endDate ? new Date(endDate).toISOString() : null,
        location: location.trim(),
        summary: summary.trim(),
        description: description.trim(),
        requirements: requirements.trim() || null,
        registration_info: registrationInfo.trim() || null,
        registration_url: registrationUrl.trim() || null,
        contact: contact.trim() || null,
      };

      if (isEditing && eventId) {
        await eventsService.updateEvent({
          id: eventId,
          ...payload,
        });
        setFeedback({ type: 'success', message: 'Evento atualizado com sucesso!' });
      } else {
        const created = await eventsService.createEvent(payload);
        setFeedback({ type: 'success', message: 'Evento criado com sucesso!' });
        // Redireciona para edição do evento criado para evitar duplicações
        setTimeout(() => {
          navigateTo(`/admin/eventos/${created.id}/editar`);
        }, 1000);
      }
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Erro ao salvar evento.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingEvent) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <RefreshCw size={36} className="animate-spin text-red-500 mb-4" />
        <p className="text-zinc-400 font-mono text-sm">Carregando dados do evento...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigateTo('/admin/eventos')}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} className="text-red-500" />
          <span>Voltar para Lista de Eventos</span>
        </button>

        {isEditing && slug && (
          <a
            href={`#/eventos/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-mono text-xs uppercase transition-colors"
          >
            <Eye size={14} />
            <span>Ver no Site Público</span>
          </a>
        )}
      </div>

      {/* Main form card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0c10] border border-zinc-800 shadow-2xl relative">
        <div className="mb-6 pb-6 border-b border-zinc-800 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase text-red-500 tracking-wider font-semibold">
              {isEditing ? 'Edição Editorial' : 'Nova Publicação'}
            </span>
            <h1 className="font-fight text-2xl sm:text-3xl text-white uppercase tracking-wider mt-1">
              {isEditing ? 'Editar Evento' : 'Cadastrar Novo Evento'}
            </h1>
          </div>
        </div>

        {/* Feedback alert */}
        {feedback && (
          <div
            role="alert"
            className={`mb-6 p-4 rounded-xl border text-sm flex items-start gap-3 ${
              feedback.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
                : 'bg-red-950/60 border-red-800 text-red-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="event-title" className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                  Título do Evento *
                </label>
                <span className={`text-[10px] font-mono ${title.length > 120 ? 'text-red-500' : 'text-zinc-500'}`}>
                  {title.length}/120
                </span>
              </div>
              <input
                id="event-title"
                type="text"
                required
                maxLength={120}
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ex: Copa Pride de Muay Thai 2026"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="event-slug" className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                  Slug da URL *
                </label>
                <span className="text-[10px] font-mono text-zinc-500">Único</span>
              </div>
              <input
                id="event-slug"
                type="text"
                required
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="copa-pride-de-muay-thai-2026"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2.5 px-3 font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="event-category" className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                Categoria *
              </label>
              <select
                id="event-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="competition">Competição</option>
                <option value="graduation">Graduação</option>
                <option value="seminar">Seminário</option>
                <option value="special_training">Treino Especial</option>
                <option value="other">Outros / Geral</option>
              </select>
            </div>

            <div>
              <label htmlFor="event-status" className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                Situação da Publicação *
              </label>
              <select
                id="event-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as EventStatus)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="draft">Rascunho (Não visível ao público)</option>
                <option value="published">Publicado (Visível no site)</option>
                <option value="cancelled">Cancelado (Visível com tarja de cancelamento)</option>
              </select>
            </div>
          </div>

          {/* Dates & Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="event-date" className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                Data & Hora de Início *
              </label>
              <input
                id="event-date"
                type="datetime-local"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
              />
            </div>

            <div>
              <label htmlFor="end-date" className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                Término Previsto (Opcional)
              </label>
              <input
                id="end-date"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="event-location" className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                  Localização *
                </label>
                <span className={`text-[10px] font-mono ${location.length > 200 ? 'text-red-500' : 'text-zinc-500'}`}>
                  {location.length}/200
                </span>
              </div>
              <input
                id="event-location"
                type="text"
                required
                maxLength={200}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Arena Viking — Jacareí/SP"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="event-summary" className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                Resumo Editorial (Listagem) *
              </label>
              <span className={`text-[10px] font-mono ${summary.length > 300 ? 'text-red-500' : 'text-zinc-500'}`}>
                {summary.length}/300
              </span>
            </div>
            <textarea
              id="event-summary"
              required
              rows={2}
              maxLength={300}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Breve resumo informativo do evento que aparecerá nos cards e na listagem..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 leading-relaxed"
            />
          </div>

          {/* Full Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="event-description" className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                Conteúdo Editorial Completo *
              </label>
              <span className={`text-[10px] font-mono ${description.length > 5000 ? 'text-red-500' : 'text-zinc-500'}`}>
                {description.length}/5000
              </span>
            </div>
            <textarea
              id="event-description"
              required
              rows={6}
              maxLength={5000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Escreva a descrição completa do evento, cronograma, histórico, expectativas e detalhes para o público..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 leading-relaxed font-sans"
            />
          </div>

          {/* Requirements & Registration Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="event-requirements" className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                  Requisitos de Participação
                </label>
                <span className="text-[10px] font-mono text-zinc-500">{requirements.length}/2000</span>
              </div>
              <textarea
                id="event-requirements"
                rows={3}
                maxLength={2000}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Ex: Graduação mínima no 4º Khan, kimono tradicional, luva 14oz..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 leading-relaxed"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="registration-info" className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                  Instruções de Inscrição
                </label>
                <span className="text-[10px] font-mono text-zinc-500">{registrationInfo.length}/2000</span>
              </div>
              <textarea
                id="registration-info"
                rows={3}
                maxLength={2000}
                value={registrationInfo}
                onChange={(e) => setRegistrationInfo(e.target.value)}
                placeholder="Ex: Inscrições até 15 dias antes na secretaria da sua unidade..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Registration URL & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="registration-url" className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                Link Externo de Inscrição (Opcional)
              </label>
              <input
                id="registration-url"
                type="url"
                value={registrationUrl}
                onChange={(e) => setRegistrationUrl(e.target.value)}
                placeholder="https://exemplo.com/inscricoes"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="event-contact" className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                  Contato de Dúvidas (Opcional)
                </label>
                <span className="text-[10px] font-mono text-zinc-500">{contact.length}/200</span>
              </div>
              <input
                id="event-contact"
                type="text"
                maxLength={200}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Ex: WhatsApp da Pride (12) 99174-6964"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="pt-6 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigateTo('/admin/eventos')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-mono text-xs uppercase transition-colors"
            >
              Cancelar
            </button>

            <div className="flex flex-wrap items-center gap-3">
              {/* Save as Draft */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit('draft')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-mono text-xs uppercase font-semibold transition-colors disabled:opacity-50"
              >
                <Save size={14} />
                <span>Salvar como Rascunho</span>
              </button>

              {/* Publish directly */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit('published')}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-sm bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase font-semibold transition-colors shadow-red-glow disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} />
                    <span>Publicar Agora</span>
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
