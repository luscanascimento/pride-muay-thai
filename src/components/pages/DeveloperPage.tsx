import React, { useEffect } from 'react';
import {
  ArrowLeft,
  MessageCircle,
  ExternalLink,
  Shield,
  Heart,
  Quote,
  Code2,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Mail,
  Phone,
  FileDown,
  Terminal,
  Cpu,
  Layers,
  Database,
  Lock,
  TestTube,
} from 'lucide-react';
import { PrajiedBadge, PrajiedRope } from '../ui/PrajiedBadge';
import { getKhanRank } from '../../data/gymsAndTeamData';
import { GithubIcon, InstagramIcon, LinkedinIcon } from '../ui/Icons';

interface DeveloperPageProps {
  onBack: () => void;
}

export const DeveloperPage: React.FC<DeveloperPageProps> = ({ onBack }) => {
  const rank = getKhanRank(2); // 2º Khan • Amarela
  const basePath = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) ? import.meta.env.BASE_URL : './';
  const photoUrl = `${basePath}lucas-nascimento.jpeg`;
  const resumePdfUrl = `${basePath}lucas_nascimento_curriculo.pdf`;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <article className="min-h-screen bg-[#080809] text-zinc-100 pt-28 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 sm:w-[700px] h-96 sm:h-[700px] bg-amber-500/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-red-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Navigation & Breadcrumbs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-10 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900/90 hover:bg-red-600 border border-zinc-800 hover:border-red-500 text-zinc-300 hover:text-white text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all duration-200 group shadow-md"
              aria-label="Voltar para a página inicial"
            >
              <ArrowLeft size={16} className="text-red-400 group-hover:text-white group-hover:-translate-x-1 transition-transform" />
              <span>Voltar ao Início</span>
            </button>

            <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-2 text-xs text-zinc-400">
              <span>/</span>
              <button onClick={onBack} className="hover:text-zinc-200 transition-colors">
                Início
              </button>
              <span>/</span>
              <span className="text-zinc-300 font-medium">Desenvolvedor & Aluno Pride</span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/50 text-red-400 text-xs font-mono font-semibold">
              <Code2 size={13} />
              <span>Easter Egg • Perfil do Desenvolvedor</span>
            </span>
          </div>
        </div>

        {/* Hero Section of Lucas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-14">
          
          {/* Photo & Badges Column */}
          <div className="lg:col-span-5 flex flex-col items-center sm:items-start">
            <div className="relative w-full max-w-md mx-auto aspect-[4/5] rounded-2xl overflow-hidden border-2 border-zinc-800/90 shadow-2xl bg-zinc-950 group">
              <img
                src={photoUrl}
                alt="Fotografia de Lucas Gabriel Ferreira do Nascimento"
                style={{ objectPosition: '63% center' }}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                onError={(e) => {
                  // Fallback to original JPG if jpeg fails
                  const target = e.currentTarget;
                  if (!target.src.endsWith('lucas-nascimento.JPG')) {
                    target.src = `${basePath}lucas-nascimento.JPG`;
                  }
                }}
              />
              
              {/* Vignette gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090c] via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

              {/* Khan Prajied badge on top-left of photo */}
              <div className="absolute top-4 left-4 z-10">
                <PrajiedBadge level={2} size="sm" />
              </div>

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-fight tracking-wider uppercase shadow-xl border backdrop-blur-md bg-zinc-900/90 border-amber-500/50 text-amber-300">
                  <Shield size={14} className="text-amber-400" />
                  <span>Aluno Pride • 2º Khan</span>
                </span>
              </div>
            </div>

            {/* Highlight Badges / Tags */}
            <div className="w-full max-w-md mx-auto mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide bg-amber-950/40 text-amber-300 border border-amber-800/60">
                2º Khan • Amarela
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide bg-zinc-900/90 text-zinc-300 border border-zinc-800/90">
                Recém-Iniciado em 2026
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide bg-zinc-900/90 text-zinc-300 border border-zinc-800/90">
                Superação & Saúde
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide bg-red-950/40 text-red-300 border border-red-800/60">
                Software Engineer Pleno
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide bg-zinc-900/90 text-zinc-300 border border-zinc-800/90">
                São José dos Campos - SP
              </span>
            </div>

            {/* Contact & Social Links Box */}
            <div className="w-full max-w-md mx-auto mt-6 p-5 rounded-2xl bg-[#121217] border border-zinc-800 shadow-xl space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-semibold block mb-2">
                Conectar com Lucas:
              </span>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://github.com/luscanascimento"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
                >
                  <GithubIcon size={15} />
                  <span>GitHub</span>
                  <ExternalLink size={12} className="ml-auto text-zinc-500" />
                </a>

                <a
                  href="https://linkedin.com/in/lucas-nascimento-0b773a16a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-950/40 hover:bg-blue-900/40 border border-blue-800/50 text-blue-300 text-xs font-medium transition-colors"
                >
                  <LinkedinIcon size={15} />
                  <span>LinkedIn</span>
                  <ExternalLink size={12} className="ml-auto text-blue-400" />
                </a>

                <a
                  href="https://instagram.com/luscanascimento"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-pink-950/30 hover:bg-pink-900/40 border border-pink-800/40 text-pink-300 text-xs font-medium transition-colors"
                >
                  <InstagramIcon size={15} />
                  <span>@luscanascimento</span>
                </a>

                <a
                  href="https://wa.me/5512982983353?text=Ol%C3%A1%20Lucas!%20Vi%20sua%20p%C3%A1gina%20no%20site%20da%20Pride%20Muay%20Thai."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/50 text-emerald-300 text-xs font-medium transition-colors"
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp</span>
                </a>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 flex flex-col gap-2">
                <a
                  href="mailto:lucasnascimentocontato@gmail.com"
                  className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  <Mail size={13} className="text-red-400 flex-shrink-0" />
                  <span className="truncate">lucasnascimentocontato@gmail.com</span>
                </a>

                <a
                  href="tel:5512982983353"
                  className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  <Phone size={13} className="text-emerald-400 flex-shrink-0" />
                  <span>(12) 98298-3353</span>
                </a>

                <a
                  href={resumePdfUrl}
                  download="Lucas_Nascimento_Curriculo.pdf"
                  className="mt-2 inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
                >
                  <FileDown size={15} />
                  <span>Baixar Currículo em PDF</span>
                </a>
              </div>
            </div>

          </div>

          {/* Quick Info & Header Column */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-amber-950/40 border border-amber-800/40 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-3">
                <Heart size={13} className="text-red-400" />
                <span>Aluno Pride Muay Thai • Desenvolvedor da Plataforma</span>
              </div>

              <h1 className="font-fight text-4xl sm:text-5xl lg:text-6xl text-white uppercase tracking-wide leading-none mb-2">
                LUCAS NASCIMENTO
              </h1>

              <div className="text-sm sm:text-base font-mono uppercase tracking-wider text-amber-400 font-semibold mb-4">
                Software Engineer (Full Stack & Backend) • Aluno 2º Khan
              </div>

              {/* Khan Graduation Banner */}
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#14141a] via-[#101015] to-[#0c0c10] border border-zinc-800/90 shadow-xl flex items-center gap-4">
                <PrajiedRope level={2} size="md" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-fight text-xl sm:text-2xl text-white uppercase tracking-wider leading-none">
                      {rank.level}º KHAN • {rank.colorName}
                    </span>
                  </div>
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold block mt-0.5">
                    {rank.title} • Graduação Marcial Tradicional
                  </span>
                  <p className="text-xs text-zinc-400 mt-1 leading-snug">
                    {rank.description}
                  </p>
                </div>
              </div>

              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed mb-6 border-l-2 border-amber-500 pl-4 py-1 italic bg-amber-950/10 rounded-r-lg">
                "Recém-iniciado no Muay Thai em 2026, encontrei no tatame da Pride a determinação para superar o sedentarismo e limitações físicas a cada treino. Sou imensamente grato ao Mestre Renan Hulkinho e ao Professor Paulo Roberto pela paciência, incentivo constante e por me ensinarem que qualquer barreira pode ser vencida com disciplina e coração."
              </p>

              {/* Mentorship & Gratitude Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/30 via-zinc-900/60 to-zinc-950 border border-red-900/40 shadow-xl mb-6">
                <span className="text-xs font-mono uppercase tracking-widest text-red-400 font-semibold flex items-center gap-1.5 mb-2">
                  <Heart size={14} className="text-red-500" />
                  Agradecimento Especial aos Mestres:
                </span>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-3">
                  Um agradecimento de coração ao <strong>Mestre Renan Hulkinho</strong> e ao <strong>Professor Paulo Roberto</strong>. Mesmo diante das minhas limitações físicas e das dificuldades iniciais para praticar o esporte, vocês nunca deixaram de me orientar, incentivar e acreditar que eu era capaz de evoluir. Essa postura faz da Pride mais do que uma equipe: uma família de verdade.
                </p>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-400">
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                    🙏 Respeito & Gratidão
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                    🥊 Disciplina de Tatame
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                    ❤️ Família Pride Muay Thai
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Detailed Story / Trajectory Section */}
        <div className="p-6 sm:p-10 lg:p-12 rounded-3xl bg-gradient-to-b from-[#101015] via-[#0c0c10] to-[#08080a] border border-zinc-800/90 shadow-2xl relative overflow-hidden mb-14">
          
          <div className="flex items-center gap-2 mb-6">
            <span className="w-8 h-[2px] bg-amber-500" />
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
              Minha Jornada & Superação
            </span>
          </div>

          <h2 className="font-fight text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-wide leading-none mb-8">
            DO SEDENTARISMO AO TATAME: O MUAY THAI COMO TRANSFORMAÇÃO
          </h2>

          <div className="space-y-5 text-zinc-300 text-base sm:text-lg leading-relaxed font-sans">
            <p className="text-pretty">
              Minha história com as artes marciais começou em 2026 como um grito de basta ao sedentarismo e às limitações físicas que vinham me acompanhando há anos. Passar horas sentado em frente ao computador construindo softwares é a minha paixão e profissão, mas meu corpo cobrava a conta com dores, baixa energia e falta de condicionamento.
            </p>
            <p className="text-pretty">
              Dar o primeiro passo para dentro de uma academia de luta foi desafiador. Eu sabia que enfrentaria dificuldades, cansaço extremo e que meu corpo demoraria a responder aos movimentos técnicos das oito armas. Mas foi na <strong>Pride Muay Thai</strong> que encontrei algo raro: um ambiente onde você é acolhido com paciência e respeito genuíno, independentemente do seu ponto de partida.
            </p>
            <p className="text-pretty">
              Agradeço imensamente ao <strong>Mestre Renan Hulkinho</strong> e ao <strong>Professor Paulo Roberto</strong>. Nos dias em que o cansaço batia forte ou em que as limitações físicas pareciam travar o movimento, as palavras de incentivo, as correções precisas e a paciência de ambos me mantiveram firme. Cada round de saco de pancada, cada correção de teep ou direto conquistados representam uma vitória pessoal inestimável.
            </p>
            <p className="text-pretty">
              Desenvolver este portal para a Pride Muay Thai foi a minha forma de retribuir esse acolhimento e colocar meus mais de 5 anos de engenharia de software a serviço dessa equipe que transforma tantas vidas todos os dias. O Muay Thai me ensinou que a mente forte comanda o corpo, e que a verdadeira vitória é acordar todo dia disposto a vencer a si mesmo.
            </p>
          </div>

          {/* Highlight Quote Box */}
          <div className="my-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-950/30 via-zinc-900/60 to-zinc-950 border-l-4 border-amber-500 border-t border-r border-b border-zinc-800/80 shadow-xl relative">
            <Quote size={32} className="text-amber-500/20 absolute top-4 right-4 pointer-events-none" />
            <blockquote className="text-lg sm:text-xl md:text-2xl font-serif italic text-zinc-200 leading-snug mb-3">
              "O tatame não julga onde você começou; ele respeita a sua coragem de permanecer e evoluir. Obrigado ao Renan e ao Professor Paulo por me mostrarem que limites existem para serem superados."
            </blockquote>
            <div className="text-xs sm:text-sm font-fight uppercase tracking-wider text-amber-400">
              — Lucas Nascimento • Aluno 2º Khan (Amarela) & Desenvolvedor do Site
            </div>
          </div>

        </div>

        {/* Professional Resume Section (CV) */}
        <div className="p-6 sm:p-10 lg:p-12 rounded-3xl bg-gradient-to-b from-[#121217] via-[#0e0e13] to-[#0a0a0d] border border-zinc-800/90 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-red-950/50 border border-red-800/50 text-red-400 text-xs font-mono font-semibold uppercase mb-2">
                <Terminal size={13} />
                <span>Currículo Profissional & Engenharia de Software</span>
              </div>
              <h3 className="font-fight text-3xl sm:text-4xl text-white uppercase tracking-wide">
                LUCAS GABRIEL FERREIRA DO NASCIMENTO
              </h3>
              <p className="text-zinc-400 text-sm font-mono mt-1">
                Software Engineer | Full Stack & Backend (Pleno) • São José dos Campos, SP (Global Remote / B2B)
              </p>
            </div>

            <a
              href={resumePdfUrl}
              download="Lucas_Nascimento_Curriculo.pdf"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-red-600 border border-zinc-800 hover:border-red-500 text-zinc-200 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md self-start sm:self-auto flex-shrink-0"
            >
              <FileDown size={15} />
              <span>Baixar CV (PDF)</span>
            </a>
          </div>

          {/* Professional Summary */}
          <div className="mb-10">
            <h4 className="text-xs font-mono uppercase tracking-widest text-red-400 font-semibold flex items-center gap-2 mb-3">
              <Briefcase size={14} />
              <span>Resumo Profissional</span>
            </h4>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed bg-zinc-900/60 p-4 sm:p-5 rounded-xl border border-zinc-800/80">
              Software Engineer with <strong>5+ years</strong> of software engineering and technical support experience, specializing in full-stack web applications, resilient REST APIs, and database architecture. Proven expertise in <strong>Angular, TypeScript, Node.js (NestJS, Fastify), C# (.NET 9), Laravel, PostgreSQL, Clean Architecture</strong>, and application security (AES-256-GCM, RFC 6238 TOTP, RBAC). Experienced in distributed locks via Redis, monorepos (Nx, Turborepo), and AI tooling integration via the Model Context Protocol (MCP).
            </p>
          </div>

          {/* Technical Skills Grid */}
          <div className="mb-12">
            <h4 className="text-xs font-mono uppercase tracking-widest text-red-400 font-semibold flex items-center gap-2 mb-4">
              <Cpu size={14} />
              <span>Habilidades Técnicas & Stack</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Code2 size={13} className="text-amber-400" />
                  Languages & Frameworks
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                  TypeScript, JavaScript, Node.js (NestJS, Fastify), Angular (Signals, NgRx), C# (.NET 9), Laravel, React, Java, SQL.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Layers size={13} className="text-blue-400" />
                  Architecture & Patterns
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                  Clean Architecture, Domain-Driven Design (DDD), Hexagonal Architecture, CQRS, RESTful APIs, Monorepos (Nx, Turborepo).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Database size={13} className="text-emerald-400" />
                  Databases & Caching
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                  PostgreSQL, Redis (Distributed Locks, Rate Limiting), SQLite (WAL Engine), EF Core 9, Prisma ORM, Eloquent.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Lock size={13} className="text-red-400" />
                  Security & Auth
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                  Zero-Trust RBAC, BOLA Remediation, AES-256-GCM Vaults, Argon2id, RFC 4226/6238 TOTP MFA, JWT Rotation & Replay Detection.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 md:col-span-2">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-2">
                  <TestTube size={13} className="text-purple-400" />
                  Testing & DevOps
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                  xUnit, FluentAssertions, Vitest, Jest, Playwright (E2E), Testcontainers, Docker, GitLab CI/CD, Git, Linux/Bash, MCP (Model Context Protocol).
                </p>
              </div>

            </div>
          </div>

          {/* Professional Experience */}
          <div className="mb-12">
            <h4 className="text-xs font-mono uppercase tracking-widest text-red-400 font-semibold flex items-center gap-2 mb-4">
              <Briefcase size={14} />
              <span>Experiência Profissional</span>
            </h4>

            <div className="space-y-6">
              
              <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h5 className="font-fight text-xl text-white uppercase tracking-wide">
                    FaberSoft Tecnologia
                  </h5>
                  <span className="text-xs font-mono text-amber-400 font-semibold">
                    Maio 2021 – Presente (5+ anos) • São José dos Campos, SP
                  </span>
                </div>
                <div className="text-xs font-mono text-zinc-400 mb-3 font-medium">
                  Software Engineer (Full Stack) & Technical Support
                </div>

                <ul className="space-y-2 text-xs sm:text-sm text-zinc-300 leading-relaxed list-disc list-inside">
                  <li>
                    <strong>Full Stack Development (Angular, Laravel, PostgreSQL):</strong> Arquitetura e desenvolvimento de funcionalidades centrais, mantendo aplicações empresariais em produção com arquitetura modular; gerenciamento de migrações e otimização avançada de queries SQL.
                  </li>
                  <li>
                    <strong>System Maintenance & Bug Remediation:</strong> Implementação de componentes de interface e endpoints RESTful, reduzindo débito técnico e resolvendo bugs de borda em fluxos contínuos de versionamento via GitLab CI/CD.
                  </li>
                  <li>
                    <strong>Technical Support & Hardware Diagnostics:</strong> Atendimento de suporte L2/L3 para usuários corporativos, sistemas ERP e coletores móveis de dados; diagnósticos remotos para desbloqueio ágil de operações críticas.
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h5 className="font-fight text-xl text-white uppercase tracking-wide">
                    Ruston Alimentos
                  </h5>
                  <span className="text-xs font-mono text-zinc-400 font-semibold">
                    Setembro 2018 – Maio 2021 (2 anos e 9 meses) • Jacareí, SP
                  </span>
                </div>
                <div className="text-xs font-mono text-zinc-400 mb-3 font-medium">
                  Logistics & Inventory Operations Assistant
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Controle de estoque, auditorias e reabastecimento utilizando análise de Curva ABC, metodologias FIFO (PEPS) e ciclos PDCA para eliminar discrepâncias de inventário.
                </p>
              </div>

            </div>
          </div>

          {/* Featured Open-Source Projects */}
          <div className="mb-12">
            <h4 className="text-xs font-mono uppercase tracking-widest text-red-400 font-semibold flex items-center gap-2 mb-4">
              <FolderGit2 size={14} />
              <span>Projetos Open-Source em Destaque</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between hover:border-red-600/60 transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h5 className="font-fight text-lg text-white uppercase tracking-wide">
                      FinanceHub
                    </h5>
                    <a
                      href="https://github.com/luscanascimento/financial-system"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-white transition-colors"
                      title="Ver no GitHub"
                    >
                      <GithubIcon size={16} />
                    </a>
                  </div>
                  <div className="text-[11px] font-mono text-amber-400 mb-3">
                    Multi-Tenant Financial Platform
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                    Plataforma financeira em Nx Monorepo com NestJS 11, Angular 21, Flutter 3, Prisma 6 e Redis mutex locks para prevenir race conditions contábeis. Integrada a servidor AI MCP; 100% de aprovação em 134+ testes.
                  </p>
                </div>
                <a
                  href="https://github.com/luscanascimento/financial-system"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-mono transition-colors pt-3 border-t border-zinc-800/80"
                >
                  <span>github.com/.../financial-system</span>
                  <ExternalLink size={11} />
                </a>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between hover:border-red-600/60 transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h5 className="font-fight text-lg text-white uppercase tracking-wide">
                      Task Kanban Flow
                    </h5>
                    <a
                      href="https://github.com/luscanascimento/task-kanban-flow"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-white transition-colors"
                      title="Ver no GitHub"
                    >
                      <GithubIcon size={16} />
                    </a>
                  </div>
                  <div className="text-[11px] font-mono text-blue-400 mb-3">
                    Multi-Tenant Kanban System
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                    Backend Fastify REST com mitigação BOLA, cofre de segredos AES-256-GCM e Design System acessível em Angular 21 Zoneless (@tkf/ui) validado por 242 testes automatizados Jest e Playwright.
                  </p>
                </div>
                <a
                  href="https://github.com/luscanascimento/task-kanban-flow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-mono transition-colors pt-3 border-t border-zinc-800/80"
                >
                  <span>github.com/.../task-kanban-flow</span>
                  <ExternalLink size={11} />
                </a>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between hover:border-red-600/60 transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h5 className="font-fight text-lg text-white uppercase tracking-wide">
                      OrderFlow API
                    </h5>
                    <a
                      href="https://github.com/luscanascimento/orderflow-api"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-white transition-colors"
                      title="Ver no GitHub"
                    >
                      <GithubIcon size={16} />
                    </a>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400 mb-3">
                    Enterprise Sales REST API
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                    Web API .NET 9 em Clean Architecture com C# 13, EF Core 9 e PostgreSQL. Validação de estoque em tempo real, dedução automatizada de inventário e 100% de aprovação em 28 testes xUnit.
                  </p>
                </div>
                <a
                  href="https://github.com/luscanascimento/orderflow-api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-mono transition-colors pt-3 border-t border-zinc-800/80"
                >
                  <span>github.com/.../orderflow-api</span>
                  <ExternalLink size={11} />
                </a>
              </div>

            </div>
          </div>

          {/* Education */}
          <div className="mb-10">
            <h4 className="text-xs font-mono uppercase tracking-widest text-red-400 font-semibold flex items-center gap-2 mb-4">
              <GraduationCap size={14} />
              <span>Formação Acadêmica</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <div className="text-sm font-semibold text-white">
                  Tecnólogo em Análise e Desenvolvimento de Sistemas (ADS)
                </div>
                <div className="text-xs font-mono text-amber-400 mt-1">
                  UNIP — Universidade Paulista
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  2024 – 2026 (Semestre Final / Conclusão Prevista Dez 2026)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <div className="text-sm font-semibold text-white">
                  Ensino Médio Completo
                </div>
                <div className="text-xs font-mono text-zinc-400 mt-1">
                  EE Hermínia Silva de Mesquita
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Back Button */}
          <div className="pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-red-600 border border-zinc-800 hover:border-red-500 text-zinc-200 hover:text-white text-sm font-semibold tracking-wider uppercase transition-all shadow-md group"
            >
              <ArrowLeft size={16} className="text-red-400 group-hover:text-white group-hover:-translate-x-1 transition-transform" />
              <span>Voltar para a Página Inicial</span>
            </button>

            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/5512982983353?text=Ol%C3%A1%20Lucas!%20Vi%20sua%20p%C3%A1gina%20no%20site%20da%20Pride%20Muay%20Thai."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
              >
                <MessageCircle size={15} />
                <span>Conversar no WhatsApp</span>
              </a>

              <a
                href="https://github.com/luscanascimento"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
              >
                <GithubIcon size={15} />
                <span>GitHub</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </article>
  );
};
