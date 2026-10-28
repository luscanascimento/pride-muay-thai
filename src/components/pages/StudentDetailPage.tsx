import React, { useState, useEffect } from 'react';
import {
  Award,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Shield,
  RefreshCw,
  AlertTriangle,
  MapPin,
  Edit,
  ExternalLink,
} from 'lucide-react';
import { studentsService, StudentWithGraduations } from '../../services/studentsService';
import { useAuth } from '../../hooks/useAuth';
import { PrajiedBadge, PrajiedRope } from '../ui/PrajiedBadge';
import { Button } from '../ui/Button';
import { getKhanRank, ALL_KHANS_SYSTEM } from '../../constants/khans';
import { formatDate } from '../../utils/date';
import { navigateTo } from '../../utils/routes';
import { getGymNames } from '../../utils/gyms';
import { getGoogleMapsSearchUrl } from '../../utils/maps';
import prideLogoCutout from '../../assets/pride-muay-thai-cutout.png';

interface StudentDetailPageProps {
  slug: string;
  onBack?: () => void;
}

export const StudentDetailPage: React.FC<StudentDetailPageProps> = ({ slug, onBack }) => {
  const { isAdmin } = useAuth();
  const [student, setStudent] = useState<StudentWithGraduations | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    studentsService
      .getPublicStudentBySlug(slug)
      .then((data) => {
        if (!isMounted) return;
        if (!data) {
          setError('Aluno não encontrado ou registro inativo.');
        } else {
          setStudent(data);
        }
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'Erro ao carregar trajetória do aluno.';
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
      navigateTo('/alunos');
    }
  };

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 px-4 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <RefreshCw size={36} className="animate-spin text-red-500 mb-4" />
        <p className="text-zinc-400 font-mono text-sm">Carregando trajetória do aluno...</p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="pt-32 pb-24 px-4 max-w-xl mx-auto text-center min-h-[60vh] flex flex-col items-center justify-center">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h1 className="font-fight text-2xl sm:text-3xl text-white uppercase mb-2">Aluno Não Encontrado</h1>
        <p className="text-zinc-400 text-sm mb-6">{error || 'O aluno solicitado não possui registro ativo.'}</p>
        <Button variant="secondary" size="md" onClick={handleBack}>
          <ArrowLeft size={16} />
          Voltar para Alunos
        </Button>
      </div>
    );
  }

  const currentRank = getKhanRank(student.current_khan);
  const gymNames = getGymNames(student.gym_ids);

  // Mapear datas de graduação pelo nível do Khan
  const graduationDatesMap = new Map<number, string | null>();
  for (const g of student.graduations) {
    graduationDatesMap.set(g.khan_level, g.achieved_at);
  }

  // Filtrar apenas os Khans conquistados (1 até student.current_khan)
  // Conforme requisito do plano: Aluno no Khan 7 mostra de 1 a 7, e NÃO 8 a 16.
  const achievedKhans = ALL_KHANS_SYSTEM.filter((k) => k.level <= student.current_khan);

  return (
    <article className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-[75vh]">
      {/* Top action bar: Back button + Admin Edit button */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 p-1 rounded"
        >
          <ArrowLeft size={16} className="text-red-500" />
          <span>Voltar para lista de alunos</span>
        </button>

        {isAdmin && (
          <button
            type="button"
            onClick={() => navigateTo(`/admin/alunos/${student.id}/editar`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-zinc-900 border border-zinc-700/80 hover:border-red-500/80 text-zinc-200 hover:text-white text-xs font-mono uppercase font-semibold transition-all shadow-sm group"
          >
            <Edit size={14} className="text-red-500 group-hover:scale-110 transition-transform" />
            <span>Editar Aluno</span>
          </button>
        )}
      </div>

      {/* Hero identity card (Composição visual com logotipo oficial e Prajied, sem avatar falso) */}
      <header className="mb-12 p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#16161d] via-[#101015] to-[#0a0a0d] border border-zinc-800 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 text-center sm:text-left relative z-10">
          {/* Official Pride emblem + Prajied badge composition */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-b from-zinc-900 to-black border-2 border-zinc-700/80 shadow-2xl flex items-center justify-center flex-shrink-0 p-3 group">
            <img
              src={prideLogoCutout}
              alt="Pride Muay Thai"
              className="w-full h-full object-contain drop-shadow"
            />
            <div className="absolute -bottom-3 -right-3 p-1.5 rounded-full bg-zinc-950 border border-zinc-700 shadow-lg">
              <PrajiedRope level={student.current_khan} size="sm" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider font-semibold bg-red-950/40 text-red-400 border border-red-800/50">
                <Shield size={12} />
                <span>Atleta Pride Muay Thai</span>
              </span>
              <PrajiedBadge level={student.current_khan} size="sm" showRankTitle={false} />
            </div>

            <h1 className="font-fight text-3xl sm:text-5xl text-white uppercase tracking-wider leading-none">
              {student.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm font-mono text-zinc-300">
              <span className="text-red-500 font-bold">{student.current_khan}º Khan</span>
              <span className="text-zinc-600">•</span>
              <span>{currentRank.colorName}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400 uppercase text-xs">{currentRank.title}</span>
            </div>

            <p className="text-zinc-400 text-xs sm:text-sm mt-3 leading-relaxed max-w-xl">
              {currentRank.description}
            </p>

            {gymNames.length > 0 && (
              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-zinc-500 text-xs font-mono uppercase flex items-center gap-1 font-semibold">
                  <MapPin size={13} className="text-red-500" />
                  {gymNames.length > 1 ? 'Academias:' : 'Academia:'}
                </span>
                {gymNames.map((name) => (
                  <a
                    key={name}
                    href={getGoogleMapsSearchUrl(name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 hover:border-red-500/50 font-medium transition-colors group"
                    title={`Abrir localização de ${name} no Google Maps`}
                  >
                    <span>{name}</span>
                    <ExternalLink size={11} className="text-zinc-500 group-hover:text-red-400 transition-colors" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Trajectory / Cumulative Khans progression section */}
      <section className="mb-12">
        <div className="flex items-center justify-between gap-4 mb-6 pb-3 border-b border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-red-500 font-semibold tracking-wider">
              <Award size={14} />
              <span>Progressão Marcial</span>
            </div>
            <h2 className="font-fight text-2xl sm:text-3xl text-white uppercase tracking-wider mt-1">
              Trajetória dos Khans Conquistados
            </h2>
          </div>
          <span className="font-mono text-xs text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-sm border border-zinc-800">
            {achievedKhans.length} de 16 Khans
          </span>
        </div>

        {/* Timeline list of achieved khans */}
        <div className="space-y-4">
          {achievedKhans.map((khan) => {
            const isHighest = khan.level === student.current_khan;
            const gradDate = graduationDatesMap.get(khan.level);

            return (
              <div
                key={`khan-achieved-${khan.level}`}
                className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                  isHighest
                    ? 'bg-gradient-to-r from-red-950/30 via-zinc-900 to-zinc-950 border-red-600/80 shadow-red-glow/20 shadow-xl'
                    : 'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Prajied rope icon */}
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <PrajiedRope level={khan.level} size="sm" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-fight text-lg sm:text-xl text-white uppercase">
                          {khan.level}º KHAN — {khan.colorName}
                        </span>
                        {isHighest && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold bg-red-600 text-white">
                            Graduação Atual
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mt-0.5">
                        {khan.title} ({khan.category})
                      </span>

                      <p className="text-zinc-400 text-xs sm:text-sm mt-2 leading-relaxed max-w-2xl">
                        {khan.description}
                      </p>
                    </div>
                  </div>

                  {/* Graduation date when recorded */}
                  <div className="self-end sm:self-center flex-shrink-0 text-right">
                    {gradDate ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
                        <Calendar size={13} className="text-red-500" />
                        <span>{formatDate(gradDate)}</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500">
                        <CheckCircle2 size={13} className="text-emerald-500" />
                        <span>Nível Conquistado</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Return button */}
      <div className="pt-6 border-t border-zinc-800 flex justify-between items-center">
        <Button variant="secondary" size="md" onClick={handleBack}>
          <ArrowLeft size={16} />
          <span>Voltar para Alunos</span>
        </Button>
      </div>
    </article>
  );
};
