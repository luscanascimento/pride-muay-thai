import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  GraduationCap,
  CheckCircle,
  AlertCircle,
  Clock,
  Search,
  UserCheck,
  RefreshCw,
  Send,
  MessageSquare,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { DbEvent } from '../../types/database';
import { ALL_KHANS_SYSTEM, getKhanRank } from '../../constants/khans';
import { suggestNextKhan, GRADUATION_PIX } from '../../constants/graduation';
import { formatDateTime } from '../../utils/date';

interface GraduationRegistrationFormProps {
  event: DbEvent;
}

interface StudentSearchResult {
  id: string;
  name: string;
  current_khan: number;
}

export const GraduationRegistrationForm: React.FC<GraduationRegistrationFormProps> = ({ event }) => {
  // Verificação de prazo
  const deadlineIso = event.graduation_registration_deadline;
  const isDeadlineExpired = Boolean(deadlineIso && new Date(deadlineIso).getTime() <= Date.now());
  const isRegistrationOpen = Boolean(
    event.status === 'published' &&
    event.category === 'graduation' &&
    event.graduation_registration_enabled &&
    deadlineIso &&
    !isDeadlineExpired
  );

  // Estados do formulário
  const [isManualName, setIsManualName] = useState(false);
  const [manualFullName, setManualFullName] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentSearchResult | null>(null);

  // Khan pretendido
  const [targetKhan, setTargetKhan] = useState<number | ''>('');

  // Estados de busca do combobox
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<StudentSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isComboboxOpen, setIsComboboxOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Estados de submissão e feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const comboboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search de alunos cadastrados (apenas ativos e publicados)
  useEffect(() => {
    if (isManualName || !searchTerm.trim() || selectedStudent) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let isMounted = true;
    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        if (!isSupabaseConfigured) {
          if (isMounted) setSearchResults([]);
          return;
        }

        const { data, error } = await supabase
          .from('students')
          .select('id, name, current_khan')
          .eq('is_active', true)
          .eq('is_published', true)
          .ilike('name', `%${searchTerm.trim()}%`)
          .order('name', { ascending: true })
          .limit(8);

        if (error) throw error;
        if (isMounted) {
          setSearchResults(data || []);
          setIsComboboxOpen(true);
        }
      } catch (err) {
        console.error('Erro ao pesquisar alunos:', err);
      } finally {
        if (isMounted) setIsSearching(false);
      }
    }, 280);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchTerm, isManualName, selectedStudent]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(e.target as Node)) {
        setIsComboboxOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Selecionar aluno do autocomplete
  const handleSelectStudent = useCallback((student: StudentSearchResult) => {
    setSelectedStudent(student);
    setSearchTerm(student.name);
    setIsComboboxOpen(false);
    setHighlightedIndex(-1);

    // Sugere o próximo Khan (Math.min(current_khan + 1, 16))
    const nextKhan = suggestNextKhan(student.current_khan);
    setTargetKhan(nextKhan);
    setErrorMessage(null);
  }, []);

  // Limpar aluno selecionado
  const handleClearStudent = () => {
    setSelectedStudent(null);
    setSearchTerm('');
    setTargetKhan('');
    setSearchResults([]);
    setIsComboboxOpen(false);
  };

  // Alternar checkbox "Meu nome não está na lista"
  const handleToggleManualName = (checked: boolean) => {
    setIsManualName(checked);
    handleClearStudent();
    setManualFullName('');
    setTargetKhan('');
    setErrorMessage(null);
  };

  // Teclado no combobox
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isComboboxOpen || searchResults.length === 0) {
      if (e.key === 'ArrowDown' && searchResults.length > 0) {
        setIsComboboxOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < searchResults.length) {
        handleSelectStudent(searchResults[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsComboboxOpen(false);
    }
  };

  // Submissão via RPC pública segura
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isRegistrationOpen) {
      setErrorMessage('As inscrições para este evento de graduação não estão disponíveis.');
      return;
    }

    if (!isManualName && !selectedStudent) {
      setErrorMessage('Selecione seu nome na lista ou marque a opção "Meu nome não está na lista".');
      return;
    }

    if (isManualName && !manualFullName.trim()) {
      setErrorMessage('Informe seu nome completo para prosseguir.');
      return;
    }

    if (!targetKhan || targetKhan < 1 || targetKhan > 16) {
      setErrorMessage('Selecione o Khan pretendido para o exame de graduação.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase não configurado no ambiente.');
      }

      const { error } = await supabase.rpc('submit_graduation_registration', {
        p_event_id: event.id,
        p_target_khan: Number(targetKhan),
        p_student_id: isManualName ? null : selectedStudent?.id || null,
        p_manual_name: isManualName ? manualFullName.trim() : null,
      });

      if (error) {
        if (error.message?.includes('já está inscrito') || error.message?.includes('duplicate key') || error.message?.includes('uq_grad_reg_event_student')) {
          throw new Error('Este aluno já está inscrito neste evento de graduação.');
        }
        if (error.message?.includes('encerradas') || error.message?.includes('prazo')) {
          throw new Error('As inscrições para este evento de graduação já foram encerradas.');
        }
        throw new Error(error.message || 'Erro ao realizar inscrição.');
      }

      setSubmitSuccess(true);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Erro inesperado ao realizar inscrição.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Caso inscrições estejam encerradas
  if (isDeadlineExpired) {
    return (
      <section
        aria-label="Inscrições de Graduação"
        className="mb-10 p-6 sm:p-8 rounded-2xl bg-[#140e10] border border-red-900/60 shadow-xl"
      >
        <div className="flex items-start gap-4">
          <Clock size={28} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-fight text-2xl uppercase tracking-wider text-white">
              Inscrições Encerradas
            </h2>
            <p className="text-zinc-300 text-sm mt-1 leading-relaxed">
              O período oficial de inscrições para este exame de graduação foi encerrado em{' '}
              <strong className="text-white font-mono">
                {deadlineIso ? formatDateTime(deadlineIso) : 'data anterior'}
              </strong>
              . Novas submissões foram desativadas.
            </p>
            <p className="text-zinc-400 text-xs mt-3">
              Em caso de dúvidas ou solicitações excepcionais, procure diretamente o instrutor responsável ou a coordenação técnica da Pride Muay Thai.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // 2. Caso formulário não esteja habilitado
  if (!event.graduation_registration_enabled || !deadlineIso) {
    return null;
  }

  // 3. Caso inscrição tenha sido realizada com sucesso
  if (submitSuccess) {
    return (
      <section
        aria-label="Confirmação de Inscrição"
        className="mb-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-emerald-950/60 to-zinc-950 border border-emerald-800/80 shadow-2xl text-center"
      >
        <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-600 flex items-center justify-center text-emerald-400 mx-auto mb-4">
          <CheckCircle size={32} />
        </div>
        <h2 className="font-fight text-3xl uppercase tracking-wider text-white">
          Inscrição Registrada com Sucesso!
        </h2>
        <p className="text-zinc-300 text-sm sm:text-base mt-2 max-w-xl mx-auto leading-relaxed">
          Sua inscrição para o exame de graduação foi cadastrada no sistema. O pagamento será verificado e confirmado manualmente pela coordenação da Pride Muay Thai.
        </p>

        <div className="mt-6 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400 max-w-md mx-auto text-left space-y-1">
          <p>
            <strong className="text-zinc-200">Inscrito:</strong>{' '}
            {isManualName ? manualFullName : selectedStudent?.name}
          </p>
          <p>
            <strong className="text-zinc-200">Khan Pretendido:</strong>{' '}
            {targetKhan}º Khan — {targetKhan ? getKhanRank(Number(targetKhan)).colorName : ''}
          </p>
          <p>
            <strong className="text-zinc-200">Status do Pagamento:</strong> Pendente de confirmação
          </p>
        </div>

        {/* Destaque Obrigatório: Envio de Comprovante com Nome Completo */}
        <div className="mt-6 p-5 rounded-2xl bg-amber-950/50 border border-amber-600/70 text-left max-w-lg mx-auto shadow-xl">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-amber-900/80 border border-amber-700 text-amber-300 flex-shrink-0 mt-0.5">
              <MessageSquare size={20} />
            </div>
            <div className="space-y-2">
              <span className="font-mono uppercase font-bold tracking-wider text-amber-300 text-xs block">
                Atenção: Envio Obrigatório do Comprovante
              </span>
              <p className="text-zinc-200 text-xs sm:text-sm leading-relaxed">
                Para confirmar a sua participação, envie o comprovante do pagamento PIX para o número{' '}
                <strong className="text-white font-mono">{GRADUATION_PIX.displayKey}</strong> informando obrigatoriamente o{' '}
                <strong className="text-amber-300 underline underline-offset-2">nome completo do aluno ({isManualName ? manualFullName : selectedStudent?.name})</strong>.
              </p>
              <div className="pt-1">
                <a
                  href={`https://wa.me/55${GRADUATION_PIX.key}?text=${encodeURIComponent(
                    `Olá! Segue o comprovante de pagamento do exame de graduação.\nNome completo do aluno: ${isManualName ? manualFullName : selectedStudent?.name}\nKhan pretendido: ${targetKhan}º Khan\nEvento: ${event.title}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase font-semibold transition-colors shadow-emerald-glow"
                >
                  <MessageSquare size={14} />
                  <span>Enviar Comprovante via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSubmitSuccess(false);
            handleClearStudent();
            setIsManualName(false);
            setManualFullName('');
          }}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs uppercase font-semibold transition-colors"
        >
          <span>Realizar Outra Inscrição</span>
        </button>
      </section>
    );
  }

  // 4. Formulário ativo
  return (
    <section
      aria-labelledby="heading-inscricao-graduacao"
      className="mb-10 p-6 sm:p-8 rounded-2xl bg-[#0e0e15] border border-red-900/60 shadow-2xl"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-500 flex-shrink-0">
            <GraduationCap size={26} />
          </div>
          <div>
            <h2 id="heading-inscricao-graduacao" className="font-fight text-2xl sm:text-3xl text-white uppercase tracking-wider">
              Formulário de Inscrição na Graduação
            </h2>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Inscrição individual aberta aos alunos e praticantes
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-800/40 text-red-400 font-mono text-xs">
          <Clock size={14} className="flex-shrink-0" />
          <span>Prazo final: {formatDateTime(deadlineIso)}</span>
        </div>
      </div>

      {/* Erro de feedback */}
      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-5 p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-sm flex items-start gap-3"
        >
          <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Opção Manual / Aluno */}
        <div className="flex items-center gap-2.5">
          <input
            id="checkbox-manual-name"
            type="checkbox"
            checked={isManualName}
            onChange={(e) => handleToggleManualName(e.target.checked)}
            className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-red-600 focus:ring-red-500 cursor-pointer"
          />
          <label
            htmlFor="checkbox-manual-name"
            className="text-xs font-mono uppercase text-zinc-300 cursor-pointer select-none"
          >
            Meu nome não está na lista de alunos cadastrados
          </label>
        </div>

        {/* Campo de Aluno com Autocomplete OU Nome Manual */}
        {!isManualName ? (
          <div ref={comboboxRef} className="relative">
            <label
              htmlFor="student-search-input"
              className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5"
            >
              Pesquisar Aluno Cadastrado *
            </label>

            {selectedStudent ? (
              <div className="p-3 rounded-sm bg-zinc-900 border border-emerald-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <UserCheck size={18} className="text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-white block">
                      {selectedStudent.name}
                    </span>
                    <span className="text-xs font-mono text-zinc-400 block">
                      Khan Atual: {selectedStudent.current_khan}º Khan (
                      {getKhanRank(selectedStudent.current_khan).colorName})
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClearStudent}
                  className="px-2.5 py-1 text-xs font-mono text-zinc-400 hover:text-white rounded bg-zinc-800 hover:bg-zinc-700 transition-colors"
                >
                  Trocar
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  ref={inputRef}
                  id="student-search-input"
                  type="text"
                  role="combobox"
                  aria-expanded={isComboboxOpen}
                  aria-autocomplete="list"
                  aria-controls="student-autocomplete-list"
                  aria-activedescendant={
                    highlightedIndex >= 0 ? `student-option-${highlightedIndex}` : undefined
                  }
                  autoComplete="off"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setHighlightedIndex(-1);
                  }}
                  onFocus={() => {
                    if (searchResults.length > 0) setIsComboboxOpen(true);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite as primeiras letras do seu nome..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2.5 pl-9 pr-10 focus:outline-none focus:ring-2 focus:ring-red-500 font-sans"
                />
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                />
                {isSearching && (
                  <RefreshCw
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 animate-spin"
                  />
                )}

                {/* Dropdown de sugestões */}
                {isComboboxOpen && searchResults.length > 0 && (
                  <ul
                    id="student-autocomplete-list"
                    role="listbox"
                    className="absolute z-20 w-full mt-1 bg-zinc-950 border border-zinc-800 rounded-sm shadow-2xl max-h-60 overflow-y-auto divide-y divide-zinc-900"
                  >
                    {searchResults.map((student, idx) => (
                      <li
                        key={student.id}
                        id={`student-option-${idx}`}
                        role="option"
                        aria-selected={idx === highlightedIndex}
                        onClick={() => handleSelectStudent(student)}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        className={`p-3 cursor-pointer flex items-center justify-between text-sm transition-colors ${
                          idx === highlightedIndex
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-300 hover:bg-zinc-900'
                        }`}
                      >
                        <span className="font-medium text-white">{student.name}</span>
                        <span className="text-xs font-mono text-zinc-400">
                          {student.current_khan}º Khan (
                          {getKhanRank(student.current_khan).colorName})
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {isComboboxOpen && !isSearching && searchTerm.trim() && searchResults.length === 0 && (
                  <div className="absolute z-20 w-full mt-1 p-3 bg-zinc-950 border border-zinc-800 rounded-sm text-xs text-zinc-400 shadow-xl">
                    Nenhum aluno ativo encontrado com este nome. Marque a opção acima para informar manualmente.
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <label
              htmlFor="manual-full-name-input"
              className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5"
            >
              Nome Completo *
            </label>
            <input
              id="manual-full-name-input"
              type="text"
              required
              maxLength={150}
              value={manualFullName}
              onChange={(e) => setManualFullName(e.target.value)}
              placeholder="Informe seu nome e sobrenome completo"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 font-sans"
            />
          </div>
        )}

        {/* Seleção do Khan Pretendido */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="target-khan-select"
              className="text-xs font-mono uppercase tracking-wider text-zinc-300"
            >
              Khan Pretendido no Exame *
            </label>
            {selectedStudent && selectedStudent.current_khan === 16 && (
              <span className="text-[11px] font-mono text-amber-400">
                Aluno já no 16º Khan (grau honorário máximo)
              </span>
            )}
          </div>

          <select
            id="target-khan-select"
            required
            value={targetKhan}
            onChange={(e) => {
              const val = e.target.value ? Number(e.target.value) : '';
              setTargetKhan(val);
            }}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 font-sans cursor-pointer"
          >
            <option value="">Selecione o Khan que você irá prestar...</option>
            {ALL_KHANS_SYSTEM.map((khan) => (
              <option key={khan.level} value={khan.level}>
                {khan.level}º Khan — {khan.colorName} ({khan.title})
              </option>
            ))}
          </select>
        </div>

        {/* Lembrete de Envio do Comprovante com Nome Completo */}
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-600/50 flex items-start gap-3 text-xs text-zinc-300">
          <MessageSquare size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-amber-300 font-mono uppercase">Importante:</strong> Após confirmar sua inscrição, faça o pagamento via PIX para o número <strong className="text-white font-mono">{GRADUATION_PIX.displayKey}</strong> e envie o comprovante informando o <strong className="text-white underline underline-offset-2">nome completo do aluno</strong> para validação da inscrição.
          </p>
        </div>

        {/* Botão de Envio */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-sm bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase font-bold tracking-wider transition-colors shadow-red-glow disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Enviando Inscrição...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Confirmar Minha Inscrição</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};
