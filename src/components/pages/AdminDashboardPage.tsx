import React from 'react';
import { Calendar, Users, Plus, Globe, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { navigateTo } from '../../utils/routes';

export const AdminDashboardPage: React.FC = () => {
  const { session } = useAuth();
  const displayName = session?.adminUser.display_name || 'Administrador';

  return (
    <div>
      {/* Welcome banner */}
      <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#14141a] via-[#0f0f14] to-[#0a0a0d] border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-mono uppercase tracking-wider mb-3 font-semibold">
              <ShieldCheck size={14} />
              <span>Sessão Administrativa Ativa</span>
            </div>
            <h1 className="font-fight text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-wider">
              Bem-vindo, <span className="text-red-500">{displayName}</span>
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Painel de controle oficial da Pride Muay Thai. Gerencie eventos, competições, graduações e o registro dos alunos com integridade e segurança.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateTo('/eventos')}
            >
              <Globe size={16} />
              <span>Ver Site</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Grid of administrative modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Events Module Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-red-950/40 border border-red-800/50 flex items-center justify-center text-red-400 mb-4">
              <Calendar size={24} />
            </div>
            <h2 className="font-fight text-2xl text-white uppercase tracking-wider">
              Gerenciar Eventos & Mini-CMS
            </h2>
            <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
              Crie novas publicações de competições, graduações, seminários ou treinos especiais. Salve rascunhos, revise, publique e edite o conteúdo editorial.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigateTo('/admin/eventos/novo')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase font-semibold transition-colors shadow-red-glow"
            >
              <Plus size={14} />
              <span>Novo Evento</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/admin/eventos')}
              className="inline-flex items-center gap-1 text-xs font-mono uppercase text-zinc-300 hover:text-white transition-colors"
            >
              <span>Listar todos</span>
              <ArrowRight size={14} className="text-red-500" />
            </button>
          </div>
        </div>

        {/* Students Module Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-950/40 border border-blue-800/50 flex items-center justify-center text-blue-400 mb-4">
              <Users size={24} />
            </div>
            <h2 className="font-fight text-2xl text-white uppercase tracking-wider">
              Gerenciar Quadro de Alunos
            </h2>
            <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
              Cadastre alunos, controle visibilidade pública (ativo/arquivado, publicado/oculto) e registre a progressão cumulativa pelos 16 Khans.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigateTo('/admin/alunos/novo')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase font-semibold transition-colors shadow-red-glow"
            >
              <Plus size={14} />
              <span>Novo Aluno</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/admin/alunos')}
              className="inline-flex items-center gap-1 text-xs font-mono uppercase text-zinc-300 hover:text-white transition-colors"
            >
              <span>Listar todos</span>
              <ArrowRight size={14} className="text-red-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
