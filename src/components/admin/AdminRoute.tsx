import React, { useState } from 'react';
import {
  LogOut,
  Calendar,
  Users,
  LayoutDashboard,
  Globe,
  RefreshCw,
  KeyRound,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { navigateTo } from '../../utils/routes';
import { isInitialSuperAdmin } from '../../utils/superAdmins';
import { ChangePasswordModal } from './ChangePasswordModal';

interface AdminRouteProps {
  children: React.ReactNode;
  currentPath?: string;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children, currentPath = '/admin' }) => {
  const { session, isInitialLoading, isAdmin, signOut } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  if (isInitialLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 pt-32 pb-20">
        <RefreshCw size={36} className="animate-spin text-red-500 mb-4" />
        <p className="text-zinc-400 font-mono text-sm">Validando permissões de acesso...</p>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return <AdminLoginPage />;
  }

  const displayName = session.adminUser.display_name;

  return (
    <div className="min-h-screen pt-20 pb-16 bg-[#080809] text-zinc-100">
      {/* Admin Top Bar */}
      <div className="border-b border-zinc-800 bg-[#0d0d12]/95 backdrop-blur-md sticky top-16 z-40">
        <div className="max-w-[1780px] 2xl:max-w-[1880px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Admin Identity & Sub-nav */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-fight text-lg uppercase text-white tracking-wider">
                Painel <span className="text-red-500">Admin</span>
              </span>
              <span className="hidden sm:inline text-xs font-mono text-zinc-400">
                ({displayName})
              </span>
            </div>

            <nav className="flex items-center gap-2 text-xs font-mono uppercase" aria-label="Navegação do painel">
              <button
                type="button"
                onClick={() => navigateTo('/admin')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm transition-colors ${
                  currentPath === '/admin' || currentPath === '/admin/dashboard'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <LayoutDashboard size={14} />
                <span>Início</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('/admin/eventos')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm transition-colors ${
                  currentPath.startsWith('/admin/eventos')
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Calendar size={14} />
                <span>Eventos</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('/admin/alunos')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm transition-colors ${
                  currentPath.startsWith('/admin/alunos')
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Users size={14} />
                <span>Alunos</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('/admin/graduacoes')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm transition-colors ${
                  currentPath.startsWith('/admin/graduacoes')
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <GraduationCap size={14} className="text-red-400" />
                <span>Graduações</span>
              </button>

              {isInitialSuperAdmin(session.user.id) && (
                <button
                  type="button"
                  onClick={() => navigateTo('/admin/usuarios')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm transition-colors ${
                    currentPath.startsWith('/admin/usuarios')
                      ? 'bg-zinc-800 text-white font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck size={14} className="text-amber-400" />
                  <span>Usuários</span>
                </button>
              )}
            </nav>
          </div>

          {/* Quick Actions (Password, View Site & Logout) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono uppercase text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-700/60 transition-colors"
              title="Trocar minha senha"
            >
              <KeyRound size={14} className="text-red-400" />
              <span className="hidden sm:inline">Alterar Senha</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono uppercase text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors"
              title="Ir para o site público"
            >
              <Globe size={14} />
              <span className="hidden sm:inline">Ver Site</span>
            </button>

            <button
              type="button"
              onClick={() => signOut()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono uppercase text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/50 border border-red-900/60 transition-colors"
            >
              <LogOut size={14} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Content */}
      <div className="max-w-[1780px] 2xl:max-w-[1880px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-8">
        {children}
      </div>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
};
