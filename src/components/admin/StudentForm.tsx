import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Eye,
  Calendar,
  MapPin,
} from 'lucide-react';
import { studentsService, StudentWithGraduations } from '../../services/studentsService';
import { KhanProgressSelector } from './KhanProgressSelector';
import { GraduationHistory } from './GraduationHistory';
import { generateSlug } from '../../utils/slug';
import { navigateTo } from '../../utils/routes';
import { GYMS_DATA } from '../../data/gymsAndTeamData';

interface StudentFormProps {
  studentId?: string; // Se presente, modo de edição; se não, modo de criação
}

export const StudentForm: React.FC<StudentFormProps> = ({ studentId }) => {
  const isEditing = Boolean(studentId);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isPublished, setIsPublished] = useState(true);
  const [selectedGymIds, setSelectedGymIds] = useState<string[]>([]);
  const [currentKhan, setCurrentKhan] = useState(1);
  const [initialKhan, setInitialKhan] = useState(1);
  const [isCorrectionMode, setIsCorrectionMode] = useState(false);
  const [graduationDate, setGraduationDate] = useState(() => {
    return new Date().toISOString().slice(0, 10);
  });
  const [existingGraduations, setExistingGraduations] = useState<StudentWithGraduations['graduations']>([]);

  const [isLoadingStudent, setIsLoadingStudent] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!studentId) return;

    let isMounted = true;
    setIsLoadingStudent(true);

    studentsService
      .getStudentById(studentId)
      .then((data) => {
        if (!isMounted || !data) return;
        setName(data.name);
        setSlug(data.slug);
        setIsSlugManuallyEdited(true);
        setIsActive(data.is_active);
        setIsPublished(data.is_published);
        setSelectedGymIds(data.gym_ids || []);
        setCurrentKhan(data.current_khan);
        setInitialKhan(data.current_khan);
        setExistingGraduations(data.graduations);
      })
      .catch((err) => {
        if (!isMounted) return;
        setFeedback({
          type: 'error',
          message: err instanceof Error ? err.message : 'Erro ao carregar dados do aluno.',
        });
      })
      .finally(() => {
        if (isMounted) setIsLoadingStudent(false);
      });

    return () => {
      isMounted = false;
    };
  }, [studentId]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugManuallyEdited) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setIsSlugManuallyEdited(true);
    setSlug(generateSlug(val));
  };

  const handleKhanSelect = (targetKhan: number, isCorrection: boolean) => {
    setCurrentKhan(targetKhan);
    if (isCorrection) {
      setIsCorrectionMode(true);
    }
  };

  const handleToggleGym = (gymId: string) => {
    setSelectedGymIds((prev) =>
      prev.includes(gymId) ? prev.filter((id) => id !== gymId) : [...prev, gymId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!name.trim()) {
      setFeedback({ type: 'error', message: 'O nome do aluno é obrigatório.' });
      return;
    }
    if (name.length > 150) {
      setFeedback({ type: 'error', message: 'O nome não pode exceder 150 caracteres.' });
      return;
    }
    if (!slug.trim()) {
      setFeedback({ type: 'error', message: 'O slug é obrigatório.' });
      return;
    }
    if (currentKhan < 1 || currentKhan > 16) {
      setFeedback({ type: 'error', message: 'O Khan deve estar entre 1 e 16.' });
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && studentId) {
        // Atualiza dados cadastrais
        await studentsService.updateStudent({
          id: studentId,
          name: name.trim(),
          slug: slug.trim(),
          is_active: isActive,
          is_published: isPublished,
          gym_ids: selectedGymIds,
        });

        // Se o Khan foi alterado ou se forneceu uma nova graduação, invoca RPC transacional
        if (currentKhan !== initialKhan || graduationDate) {
          await studentsService.setStudentKhan(
            studentId,
            currentKhan,
            graduationDate || null,
            isCorrectionMode
          );
        }

        // Recarrega graduações atualizadas
        const updated = await studentsService.getStudentById(studentId);
        if (updated) {
          setInitialKhan(updated.current_khan);
          setExistingGraduations(updated.graduations);
          setIsCorrectionMode(false);
        }

        setFeedback({ type: 'success', message: 'Aluno e graduação atualizados com sucesso!' });
      } else {
        // Cria aluno e gera graduações cumulativas iniciais
        const created = await studentsService.createStudent({
          name: name.trim(),
          slug: slug.trim(),
          current_khan: currentKhan,
          is_active: isActive,
          is_published: isPublished,
          graduation_date: graduationDate || null,
          gym_ids: selectedGymIds,
        });

        setFeedback({ type: 'success', message: 'Aluno cadastrado com sucesso!' });
        setTimeout(() => {
          navigateTo(`/admin/alunos/${created.id}/editar`);
        }, 1000);
      }
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Erro ao salvar aluno.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingStudent) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <RefreshCw size={36} className="animate-spin text-red-500 mb-4" />
        <p className="text-zinc-400 font-mono text-sm">Carregando dados do aluno...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigateTo('/admin/alunos')}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} className="text-red-500" />
          <span>Voltar para Lista de Alunos</span>
        </button>

        {isEditing && slug && (
          <a
            href={`#/alunos/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-mono text-xs uppercase transition-colors"
          >
            <Eye size={14} />
            <span>Ver Trajetória Pública</span>
          </a>
        )}
      </div>

      {/* Main Form card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0c10] border border-zinc-800 shadow-2xl relative">
        <div className="mb-6 pb-6 border-b border-zinc-800 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase text-red-500 tracking-wider font-semibold">
              {isEditing ? 'Gestão de Aluno' : 'Novo Aluno'}
            </span>
            <h1 className="font-fight text-2xl sm:text-3xl text-white uppercase tracking-wider mt-1">
              {isEditing ? `Editar: ${name || 'Aluno'}` : 'Cadastrar Novo Aluno'}
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="student-name" className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                  Nome Completo *
                </label>
                <span className={`text-[10px] font-mono ${name.length > 150 ? 'text-red-500' : 'text-zinc-500'}`}>
                  {name.length}/150
                </span>
              </div>
              <input
                id="student-name"
                type="text"
                required
                maxLength={150}
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ex: Carlos Eduardo de Oliveira"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="student-slug" className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                  Slug da URL *
                </label>
                <span className="text-[10px] font-mono text-zinc-500">Único</span>
              </div>
              <input
                id="student-slug"
                type="text"
                required
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="carlos-eduardo-de-oliveira"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2.5 px-3 font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Visibility Switches: Active & Published */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="block text-xs font-mono uppercase text-zinc-300 font-semibold">
                  Ativo na Equipe
                </span>
                <span className="block text-[11px] text-zinc-500">
                  {isActive ? 'Aluno com matrícula ativa' : 'Aluno arquivado / inativo'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                aria-label="Status do aluno ativo"
                className="w-5 h-5 rounded border-zinc-700 text-red-600 focus:ring-red-500 bg-zinc-900 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between gap-3 border-t sm:border-t-0 sm:border-l border-zinc-800 pt-3 sm:pt-0 sm:pl-4">
              <div>
                <span className="block text-xs font-mono uppercase text-zinc-300 font-semibold">
                  Visível Publicamente
                </span>
                <span className="block text-[11px] text-zinc-500">
                  {isPublished ? 'Aparece no site público' : 'Oculto na listagem pública'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                aria-label="Status de publicação pública"
                className="w-5 h-5 rounded border-zinc-700 text-red-600 focus:ring-red-500 bg-zinc-900 cursor-pointer"
              />
            </div>
          </div>

          {/* Academia ou Academias (Opcional) */}
          <div className="p-5 rounded-2xl bg-[#0c0c10] border border-zinc-800">
            <div className="flex items-center gap-2 mb-1.5">
              <MapPin size={16} className="text-red-500" />
              <h2 className="font-fight text-base sm:text-lg text-white uppercase tracking-wider">
                Academia ou Academias <span className="text-zinc-500 text-xs font-mono lowercase">(opcional)</span>
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mb-3.5">
              Selecione as unidades da Pride Muay Thai onde o aluno realiza seus treinos semanais.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {GYMS_DATA.map((gym) => {
                const isSelected = selectedGymIds.includes(gym.id);
                return (
                  <button
                    key={gym.id}
                    type="button"
                    onClick={() => handleToggleGym(gym.id)}
                    className={`text-left p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-red-950/40 border-red-500/80 text-white shadow-sm ring-1 ring-red-500/40'
                        : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-xs leading-snug line-clamp-1">{gym.name}</span>
                      <span
                        className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                          isSelected ? 'bg-red-600 text-white' : 'border border-zinc-700 bg-zinc-800'
                        }`}
                      >
                        {isSelected ? '✓' : ''}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 mt-1">
                      {gym.city}
                    </span>
                  </button>
                );
              })}
            </div>
            {selectedGymIds.length > 0 && (
              <p className="text-[11px] font-mono text-red-400 mt-3">
                {selectedGymIds.length} {selectedGymIds.length === 1 ? 'academia selecionada' : 'academias selecionadas'}.
              </p>
            )}
          </div>

          {/* Cumulative Khan Selector */}
          <div className="pt-2">
            <KhanProgressSelector
              selectedKhan={currentKhan}
              initialKhan={initialKhan}
              onSelectKhan={handleKhanSelect}
              disabled={isSubmitting}
            />
          </div>

          {/* Optional Graduation Date */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 max-w-sm">
            <label htmlFor="graduation-date" className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
              Data da Graduação do Khan Atual
            </label>
            <div className="relative">
              <input
                id="graduation-date"
                type="date"
                value={graduationDate}
                onChange={(e) => setGraduationDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
              />
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            </div>
            <span className="text-[10px] text-zinc-500 font-mono block mt-1">
              Opcional. Registra a data oficial da conquista no histórico.
            </span>
          </div>

          {/* Existing Graduations History (if editing) */}
          {isEditing && (
            <div className="pt-4 border-t border-zinc-800">
              <GraduationHistory graduations={existingGraduations} />
            </div>
          )}

          {/* Actions Bar */}
          <div className="pt-6 border-t border-zinc-800 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigateTo('/admin/alunos')}
              className="px-4 py-2.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-mono text-xs uppercase transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-sm bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase font-semibold transition-colors shadow-red-glow disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Salvando Aluno...</span>
                </>
              ) : (
                <span>{isEditing ? 'Salvar Alterações' : 'Cadastrar Aluno'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
