import React, { useState, useEffect } from 'react';
import {
  Save,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Eye,
  Trophy,
  Lock,
  GraduationCap,
  CalendarClock,
  Users,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { canUserEditEvent } from '../../utils/superAdmins';
import { eventsService, CreateEventInput } from '../../services/eventsService';
import { EventCategory, EventStatus } from '../../types/database';
import { generateSlug } from '../../utils/slug';
import { navigateTo } from '../../utils/routes';
import { maskCurrencyInput, normalizeCurrencyBrl } from '../../utils/currency';
import { EventBracketsManager } from './EventBracketsManager';
import {
  GRADUATION_PIX,
  GRADUATION_MANDATORY_EQUIPMENT,
  GRADUATION_PRICING_TABLE,
  formatGraduationPrice,
} from '../../constants/graduation';

interface EventFormProps {
  eventId?: string; // Se fornecido, modo de edição; se não, modo de criação
}

export const EventForm: React.FC<EventFormProps> = ({ eventId }) => {
  const { session } = useAuth();
  const isEditing = Boolean(eventId);
  const [canEdit, setCanEdit] = useState(true);

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
  const [price, setPrice] = useState('');
  const [showPix, setShowPix] = useState(false);
  const [pixKey, setPixKey] = useState('12991746964');
  const [showInstagram, setShowInstagram] = useState(false);
  const [showYouTube, setShowYouTube] = useState(false);
  const [graduationRegistrationEnabled, setGraduationRegistrationEnabled] = useState(false);
  const [graduationRegistrationDeadline, setGraduationRegistrationDeadline] = useState('');

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
        const allowed = canUserEditEvent(session?.user?.id, event);
        setCanEdit(allowed);
        if (!allowed) {
          setFeedback({
            type: 'error',
            message: 'Acesso restrito: este evento foi criado por outro usuário e você não possui permissão para editá-lo.',
          });
        }
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
        setPrice(normalizeCurrencyBrl(event.price || ''));
        setShowPix(Boolean(event.show_pix));
        setPixKey(event.pix_key || '12991746964');
        setShowInstagram(Boolean(event.show_instagram));
        setShowYouTube(Boolean(event.show_youtube));
        setGraduationRegistrationEnabled(Boolean(event.graduation_registration_enabled));

        if (event.graduation_registration_deadline) {
          const d = new Date(event.graduation_registration_deadline);
          const offset = d.getTimezoneOffset() * 60000;
          const localIso = new Date(d.getTime() - offset).toISOString().slice(0, 16);
          setGraduationRegistrationDeadline(localIso);
        } else {
          setGraduationRegistrationDeadline('');
        }

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
  }, [eventId, session?.user?.id]);

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

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setPrice(maskCurrencyInput(raw));
  };

  const handlePricePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    if (pasted) {
      setPrice(normalizeCurrencyBrl(pasted));
    }
  };

  const handlePriceBlur = () => {
    if (price.trim()) {
      setPrice(normalizeCurrencyBrl(price));
    }
  };

  const handleCategoryChange = (newCat: EventCategory) => {
    setCategory(newCat);
    if (newCat !== 'graduation') {
      setGraduationRegistrationEnabled(false);
      setGraduationRegistrationDeadline('');
    } else {
      // Ao selecionar "Graduação", o formulário vem ativo por padrão!
      setGraduationRegistrationEnabled(true);
      if (!graduationRegistrationDeadline && eventDate) {
        setGraduationRegistrationDeadline(eventDate);
      }
    }
  };

  const handleEventDateChange = (val: string) => {
    setEventDate(val);
    // Se for evento de graduação com formulário ativo e sem prazo definido, sugere a própria data de início
    if (category === 'graduation' && graduationRegistrationEnabled && !graduationRegistrationDeadline) {
      setGraduationRegistrationDeadline(val);
    }
  };

  const handleSubmit = async (targetStatus?: EventStatus) => {
    setFeedback(null);

    if (isEditing && !canEdit) {
      setFeedback({ type: 'error', message: 'Você não possui permissão para salvar alterações neste evento.' });
      return;
    }

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

    if (category === 'graduation' && graduationRegistrationEnabled) {
      if (!graduationRegistrationDeadline) {
        setFeedback({
          type: 'error',
          message: 'Ao habilitar o formulário de inscrição para graduação, o prazo final é obrigatório.',
        });
        return;
      }
      const deadlineTime = new Date(graduationRegistrationDeadline).getTime();
      const eventStartTime = new Date(eventDate).getTime();
      if (deadlineTime > eventStartTime) {
        setFeedback({
          type: 'error',
          message: 'O prazo final de inscrições não pode ser posterior à data de início do evento.',
        });
        return;
      }
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
        requirements: category === 'graduation' ? null : (requirements.trim() || null),
        registration_info: category === 'graduation' ? null : (registrationInfo.trim() || null),
        registration_url: category === 'graduation' ? null : (registrationUrl.trim() || null),
        contact: contact.trim() || null,
        price: category === 'graduation' ? null : (price.trim() ? normalizeCurrencyBrl(price) : null),
        show_pix: category === 'graduation' ? false : showPix,
        pix_key: category === 'graduation' ? '12991746964' : (pixKey.trim() || '12991746964'),
        show_instagram: showInstagram,
        show_youtube: showYouTube,
        graduation_registration_enabled: category === 'graduation' ? graduationRegistrationEnabled : false,
        graduation_registration_deadline:
          category === 'graduation' && graduationRegistrationEnabled && graduationRegistrationDeadline
            ? new Date(graduationRegistrationDeadline).toISOString()
            : null,
        created_by: session?.user?.id || null,
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
                onChange={(e) => handleCategoryChange(e.target.value as EventCategory)}
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
                onChange={(e) => handleEventDateChange(e.target.value)}
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
                Resumo Editorial (Listagem) <span className="text-zinc-500 font-normal lowercase">(opcional)</span>
              </label>
              <span className={`text-[10px] font-mono ${summary.length > 300 ? 'text-red-500' : 'text-zinc-500'}`}>
                {summary.length}/300
              </span>
            </div>
            <textarea
              id="event-summary"
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

          {/* Requirements & Registration Instructions (Ocultados para graduação) */}
          {category !== 'graduation' && (
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
          )}

          {/* Registration URL & Contact */}
          {category === 'graduation' ? (
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
          ) : (
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
          )}

          {/* Valores, Pagamento PIX & Redes Sociais */}
          {category === 'graduation' ? (
            <div className="p-5 rounded-2xl bg-[#0e0e14] border border-zinc-800/90 space-y-4">
              <div className="border-b border-zinc-800/80 pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-red-500 font-bold block">
                  Redes Sociais Oficiais
                </span>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Configure os botões de redes sociais do evento. As informações de chave PIX, tabela de valores e equipamentos da graduação são gerenciadas automaticamente pelas regras da Pride.
                </p>
              </div>

              {/* Toggles de Exibição das Redes Sociais */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Toggle Instagram */}
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono uppercase text-zinc-200 block font-semibold">
                      Botão do Instagram
                    </span>
                    <span className="text-[11px] text-zinc-400 block">
                      {showInstagram ? 'Exibindo no evento' : 'Oculto'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowInstagram(!showInstagram)}
                    className={`px-3 py-1 rounded text-xs font-mono uppercase font-semibold border transition-colors ${
                      showInstagram
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80 hover:bg-emerald-900/80'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {showInstagram ? '● Ativo' : '○ Não'}
                  </button>
                </div>

                {/* Toggle YouTube */}
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono uppercase text-zinc-200 block font-semibold">
                      Botão do YouTube
                    </span>
                    <span className="text-[11px] text-zinc-400 block">
                      {showYouTube ? 'Exibindo no evento' : 'Oculto'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowYouTube(!showYouTube)}
                    className={`px-3 py-1 rounded text-xs font-mono uppercase font-semibold border transition-colors ${
                      showYouTube
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80 hover:bg-emerald-900/80'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {showYouTube ? '● Ativo' : '○ Não'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-[#0e0e14] border border-zinc-800/90 space-y-5">
              <div className="border-b border-zinc-800/80 pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-red-500 font-bold block">
                  Valores, Pagamento PIX & Redes Sociais
                </span>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Configure os valores de entrada, chave PIX e botões de redes sociais do evento.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Valor do Evento com máscara de R$ */}
                <div>
                  <label htmlFor="event-price" className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                    Valor do PIX / Inscrição <span className="text-zinc-500 font-normal lowercase">(opcional)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="event-price"
                      type="text"
                      inputMode="numeric"
                      maxLength={30}
                      value={price}
                      onChange={handlePriceChange}
                      onPaste={handlePricePaste}
                      onBlur={handlePriceBlur}
                      placeholder="R$ 60,00"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500 mt-1 block">
                    Máscara automática: digite os números (ex: 6000 para R$ 60,00)
                  </span>
                </div>

                {/* Chave PIX (editável com padrão Renan 12991746964) */}
                <div>
                  <label htmlFor="event-pix-key" className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                    Chave PIX para Inscrição / Pagamento
                  </label>
                  <input
                    id="event-pix-key"
                    type="text"
                    maxLength={100}
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    placeholder="12991746964"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                  />
                  <span className="text-[10px] text-zinc-500 font-mono block mt-1">
                    Padrão: 12991746964 (Renan Hulkinho)
                  </span>
                </div>
              </div>

              {/* Toggles de Exibição */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-800/80">
                {/* Toggle PIX */}
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono uppercase text-zinc-200 block font-semibold">
                      Mostrar Chave PIX
                    </span>
                    <span className="text-[11px] text-zinc-400 block">
                      {showPix ? 'Exibindo no evento' : 'Oculto'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPix(!showPix)}
                    className={`px-3 py-1 rounded text-xs font-mono uppercase font-semibold border transition-colors ${
                      showPix
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80 hover:bg-emerald-900/80'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {showPix ? '● Ativo' : '○ Não'}
                  </button>
                </div>

                {/* Toggle Instagram */}
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono uppercase text-zinc-200 block font-semibold">
                      Botão do Instagram
                    </span>
                    <span className="text-[11px] text-zinc-400 block">
                      {showInstagram ? 'Exibindo no evento' : 'Oculto'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowInstagram(!showInstagram)}
                    className={`px-3 py-1 rounded text-xs font-mono uppercase font-semibold border transition-colors ${
                      showInstagram
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80 hover:bg-emerald-900/80'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {showInstagram ? '● Ativo' : '○ Não'}
                  </button>
                </div>

                {/* Toggle YouTube */}
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono uppercase text-zinc-200 block font-semibold">
                      Botão do YouTube
                    </span>
                    <span className="text-[11px] text-zinc-400 block">
                      {showYouTube ? 'Exibindo no evento' : 'Oculto'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowYouTube(!showYouTube)}
                    className={`px-3 py-1 rounded text-xs font-mono uppercase font-semibold border transition-colors ${
                      showYouTube
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80 hover:bg-emerald-900/80'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {showYouTube ? '● Ativo' : '○ Não'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Seção Inscrições para Graduação (Exclusiva para categoria 'graduation') */}
          {category === 'graduation' && (
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0f0e15] border border-red-900/50 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400 flex-shrink-0">
                    <GraduationCap size={22} />
                  </div>
                  <div>
                    <h3 className="font-fight text-xl text-white uppercase tracking-wider">
                      Inscrições para Graduação
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Controle o formulário público de inscrição e o prazo limite para os alunos.
                    </p>
                  </div>
                </div>

                {isEditing && eventId && (
                  <button
                    type="button"
                    onClick={() => navigateTo(`/admin/graduacoes?event_id=${eventId}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-red-950/60 border border-red-800/60 text-red-300 hover:text-white hover:bg-red-900/60 font-mono text-xs uppercase font-semibold transition-colors self-start sm:self-auto"
                  >
                    <Users size={14} />
                    <span>Gerenciar Inscritos deste Evento</span>
                  </button>
                )}
              </div>

              {/* Toggle e Prazo Final */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-4">
                  <div>
                    <label htmlFor="graduation-reg-toggle" className="text-xs font-mono uppercase text-zinc-200 block font-semibold cursor-pointer">
                      Habilitar formulário público de inscrição
                    </label>
                    <span className="text-[11px] text-zinc-400 block mt-0.5">
                      {graduationRegistrationEnabled
                        ? 'Visitantes podem se inscrever até o prazo'
                        : 'Inscrições públicas desabilitadas'}
                    </span>
                  </div>
                  <button
                    id="graduation-reg-toggle"
                    type="button"
                    role="switch"
                    aria-checked={graduationRegistrationEnabled}
                    onClick={() => setGraduationRegistrationEnabled(!graduationRegistrationEnabled)}
                    className={`px-3 py-1.5 rounded text-xs font-mono uppercase font-semibold border transition-colors flex-shrink-0 ${
                      graduationRegistrationEnabled
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80 hover:bg-emerald-900/80'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {graduationRegistrationEnabled ? '● Habilitado' : '○ Desabilitado'}
                  </button>
                </div>

                {graduationRegistrationEnabled ? (
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="graduation-deadline" className="text-xs font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                        <CalendarClock size={14} className="text-red-500" />
                        <span>Prazo Final para Inscrições *</span>
                      </label>
                    </div>
                    <input
                      id="graduation-deadline"
                      type="datetime-local"
                      required={graduationRegistrationEnabled}
                      value={graduationRegistrationDeadline}
                      onChange={(e) => setGraduationRegistrationDeadline(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                    />
                    <span className="text-[11px] font-mono text-amber-400/90 block mt-1.5">
                      Após este prazo, novas inscrições serão bloqueadas automaticamente pelo banco de dados.
                    </span>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/60 text-xs text-zinc-500 flex items-center">
                    <span>Habilite o formulário acima para definir a data e horário limite de inscrição.</span>
                  </div>
                )}
              </div>

              {/* Preview das Regras Fixas de Graduação */}
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold block">
                  Regras Oficiais & Tabela Fixa de Graduação (Automáticas)
                </span>
                <p className="text-xs text-zinc-400">
                  Todo evento marcado como Graduação exibe automaticamente no site as seguintes informações padronizadas:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-300 pt-2 border-t border-zinc-800/60">
                  <div>
                    <strong className="text-white font-mono uppercase block mb-1">Dados de Pagamento (PIX):</strong>
                    <p className="text-zinc-400">
                      Chave: <span className="font-mono text-zinc-200">{GRADUATION_PIX.displayKey}</span> ({GRADUATION_PIX.beneficiary} — {GRADUATION_PIX.institution})
                    </p>
                    <strong className="text-white font-mono uppercase block mt-3 mb-1">Equipamentos Obrigatórios:</strong>
                    <ul className="list-disc list-inside text-zinc-400 space-y-0.5">
                      {GRADUATION_MANDATORY_EQUIPMENT.map((eq) => (
                        <li key={eq}>{eq}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong className="text-white font-mono uppercase block mb-1">Tabela de Valores Oficiais:</strong>
                    <div className="max-h-40 overflow-y-auto space-y-1 font-mono text-[11px] pr-1">
                      {GRADUATION_PRICING_TABLE.map((tier) => (
                        <div key={tier.level} className="flex justify-between border-b border-zinc-800/40 py-0.5">
                          <span className="text-zinc-400">{tier.level}º Khan ({tier.colorName})</span>
                          <span className="text-white font-semibold">{formatGraduationPrice(tier.priceInCents)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
              {isEditing && !canEdit ? (
                <div className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-xs">
                  <Lock size={14} className="text-zinc-500" />
                  <span>Edição bloqueada (pertence a outro organizador)</span>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Seção de Chaveamentos de Lutas (Exclusivo para eventos do tipo competição) */}
      {category === 'competition' && (
        isEditing && eventId ? (
          <div className="mt-8">
            <EventBracketsManager
              eventId={eventId}
              eventTitle={title || 'Evento'}
              eventDate={eventDate}
              category={category}
            />
          </div>
        ) : (
          <div className="mt-8 p-6 rounded-2xl bg-[#0c0c10] border border-zinc-800 text-center">
            <Trophy size={28} className="text-zinc-600 mx-auto mb-2" />
            <h3 className="font-fight text-base text-zinc-300 uppercase">Chaveamentos de Competição</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
              Ao salvar este evento, você poderá criar chaveamentos de lutas (GP, superlutas, etc.), definir vencedores e baixar as imagens oficiais em alta resolução.
            </p>
          </div>
        )
      )}
    </div>
  );
};
