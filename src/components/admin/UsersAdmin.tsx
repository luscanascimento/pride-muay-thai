import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Plus,
  RefreshCw,
  KeyRound,
  Trash2,
  Lock,
  X,
  Check,
  AlertCircle,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';
import { DbAdminUser } from '../../types/database';
import {
  isInitialSuperAdmin,
  canResetUserPassword,
  canDeleteUser,
} from '../../utils/superAdmins';
import { formatDateTime } from '../../utils/date';
import { navigateTo } from '../../utils/routes';

export const UsersAdmin: React.FC = () => {
  const { session } = useAuth();
  const currentUserId = session?.user?.id || '';
  const isSuper = isInitialSuperAdmin(currentUserId);

  const [users, setUsers] = useState<DbAdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modais
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [resetTargetUser, setResetTargetUser] = useState<DbAdminUser | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.listAdminUsers();
      setUsers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao listar administradores.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSuper) {
      fetchUsers();
    }
  }, [isSuper, fetchUsers]);

  const handleDeleteUser = async (user: DbAdminUser) => {
    if (!canDeleteUser(currentUserId, user.user_id)) {
      alert('Não é permitido excluir uma conta de fundador.');
      return;
    }

    const confirm = window.confirm(
      `Deseja realmente remover o acesso administrativo de "${user.display_name}"?`
    );
    if (!confirm) return;

    setDeletingId(user.user_id);
    try {
      await userService.deleteAdminUser(currentUserId, user.user_id);
      await fetchUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir usuário.');
    } finally {
      setDeletingId(null);
    }
  };

  if (!isSuper) {
    return (
      <div className="p-8 text-center rounded-2xl bg-red-950/20 border border-red-900/60 max-w-2xl mx-auto my-12">
        <ShieldAlert size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="font-fight text-2xl text-white uppercase tracking-wider mb-2">
          Acesso Restrito aos Fundadores
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
          A gestão de usuários e criação de novos administradores é uma ferramenta exclusiva dos fundadores Renan Fernandes, Paulo Roberto e Lucas Nascimento.
        </p>
        <button
          type="button"
          onClick={() => navigateTo('/admin')}
          className="px-5 py-2.5 rounded-sm bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase font-semibold transition-colors"
        >
          Voltar ao Início do Painel
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/50 border border-red-800/50 text-red-400 text-xs font-mono uppercase tracking-wider mb-2 font-semibold">
            <ShieldCheck size={14} />
            <span>Controle de Acessos dos Fundadores</span>
          </div>
          <h1 className="font-fight text-3xl text-white uppercase tracking-wider">
            Gestão de <span className="text-red-500">Usuários</span>
          </h1>
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-400 mt-1">
            Cadastre novos administradores e gerencie credenciais de acesso
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase font-semibold transition-colors shadow-red-glow"
        >
          <Plus size={16} />
          <span>Novo Usuário</span>
        </button>
      </div>

      {/* Regras e Governança */}
      <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 text-xs text-zinc-300 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-800/50 text-amber-400 flex-shrink-0 mt-0.5">
            <Lock size={16} />
          </div>
          <div>
            <strong className="text-white font-mono uppercase block mb-0.5">
              Contas Fundadoras Fixas:
            </strong>
            <span>
              As contas de Renan Fernandes, Paulo Roberto e Lucas Nascimento possuem acesso total permanente e são imutáveis por terceiros. Um fundador não pode alterar a senha de outro.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-950/40 border border-blue-800/50 text-blue-400 flex-shrink-0 mt-0.5">
            <UserCheck size={16} />
          </div>
          <div>
            <strong className="text-white font-mono uppercase block mb-0.5">
              Administradores Delegados:
            </strong>
            <span>
              Novos usuários criados podem gerenciar alunos e criar eventos, mas só conseguem editar os eventos criados por eles mesmos. Não têm permissão para editar usuários ou eventos alheios.
            </span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <RefreshCw size={32} className="animate-spin text-red-500 mb-4" />
          <p className="text-zinc-400 font-mono text-sm">Carregando lista de administradores...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center rounded-2xl bg-red-950/20 border border-red-900/50">
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <button
            type="button"
            onClick={fetchUsers}
            className="px-4 py-2 bg-red-600 text-white font-mono text-xs uppercase font-semibold rounded-sm"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-[#0c0c10] shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                <th scope="col" className="py-3 px-4">Nome do Usuário</th>
                <th scope="col" className="py-3 px-4">E-mail / Identificador</th>
                <th scope="col" className="py-3 px-4">Papel no Sistema</th>
                <th scope="col" className="py-3 px-4 whitespace-nowrap">Data de Ingresso</th>
                <th scope="col" className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-sm">
              {users.map((user) => {
                const userIsSuper = isInitialSuperAdmin(user.user_id);
                const isSelf = user.user_id === currentUserId;
                const canReset = canResetUserPassword(currentUserId, user.user_id);
                const canDel = canDeleteUser(currentUserId, user.user_id);

                return (
                  <tr key={user.user_id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span>{user.display_name}</span>
                        {isSelf && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                            (Você)
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs font-mono text-zinc-300">
                      {user.email || 'Autenticação Supabase'}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {userIsSuper ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono uppercase font-bold bg-amber-950/60 text-amber-400 border border-amber-800/50 shadow-sm">
                          <ShieldCheck size={13} />
                          <span>Fundador / Full Access</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono uppercase font-semibold bg-zinc-900 text-zinc-300 border border-zinc-800">
                          <UserCheck size={13} className="text-blue-400" />
                          <span>Administrador Delegado</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-xs font-mono text-zinc-400">
                      {formatDateTime(user.created_at)}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {!canReset && !canDel ? (
                        <span className="text-[11px] font-mono text-zinc-500 italic">
                          Conta Fixa Protegida
                        </span>
                      ) : (
                        <div className="inline-flex items-center gap-2">
                          {canReset && (
                            <button
                              type="button"
                              onClick={() => setResetTargetUser(user)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono uppercase transition-colors"
                              title={`Redefinir senha de ${user.display_name}`}
                            >
                              <KeyRound size={13} className="text-amber-500" />
                              <span>Resetar Senha</span>
                            </button>
                          )}

                          {canDel && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(user)}
                              disabled={deletingId === user.user_id}
                              className="p-1.5 rounded text-red-500 hover:text-red-400 hover:bg-red-950/40 transition-colors disabled:opacity-50"
                              title={`Remover acesso de ${user.display_name}`}
                            >
                              {deletingId === user.user_id ? (
                                <RefreshCw size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Novo Usuário */}
      {showCreateModal && (
        <CreateUserModal
          currentUserId={currentUserId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchUsers();
          }}
        />
      )}

      {/* Modal Resetar Senha de Terceiro */}
      {resetTargetUser && (
        <ResetPasswordModal
          currentUserId={currentUserId}
          targetUser={resetTargetUser}
          onClose={() => setResetTargetUser(null)}
          onSuccess={() => setResetTargetUser(null)}
        />
      )}
    </div>
  );
};

interface CreateUserModalProps {
  currentUserId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ currentUserId, onClose, onSuccess }) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName.trim()) {
      setError('O nome é obrigatório.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Informe um e-mail válido.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setIsSubmitting(true);
    try {
      await userService.createAdminUser(currentUserId, {
        displayName: displayName.trim(),
        email: email.trim(),
        password,
      });
      alert('Usuário cadastrado com sucesso!');
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha ao cadastrar usuário.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0e0e14] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-400">
              <Plus size={18} />
            </div>
            <div>
              <h2 className="font-fight text-lg text-white uppercase tracking-wider">
                Novo Administrador
              </h2>
              <span className="text-[11px] font-mono text-zinc-400 block">
                Cadastre um usuário delegado da equipe
              </span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-zinc-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-900 text-red-400 text-xs font-mono flex items-center gap-2">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-300 mb-1.5">
              Nome Completo *
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ex: Instrutor João Silva"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-300 mb-1.5">
              E-mail de Acesso *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@pridemuaythai.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-300 mb-1.5">
              Senha Inicial (mínimo 6 caracteres) *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
            />
          </div>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-mono text-xs uppercase"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-sm bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase font-semibold transition-colors disabled:opacity-50 shadow-red-glow"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Cadastrando...</span>
                </>
              ) : (
                <span>Cadastrar Usuário</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ResetPasswordModalProps {
  currentUserId: string;
  targetUser: DbAdminUser;
  onClose: () => void;
  onSuccess: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  currentUserId,
  targetUser,
  onClose,
  onSuccess,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('A confirmação da senha não coincide.');
      return;
    }

    setIsSubmitting(true);
    try {
      await userService.resetUserPassword(currentUserId, targetUser.user_id, newPassword);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha ao redefinir senha.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0e0e14] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400">
              <KeyRound size={18} />
            </div>
            <div>
              <h2 className="font-fight text-lg text-white uppercase tracking-wider">
                Resetar Senha
              </h2>
              <span className="text-[11px] font-mono text-zinc-400 block">
                Usuário: {targetUser.display_name}
              </span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-zinc-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-900 text-red-400 text-xs font-mono flex items-center gap-2">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-900 text-emerald-400 text-xs font-mono flex items-center gap-2">
              <Check size={15} className="flex-shrink-0" />
              <span>Senha redefinida com sucesso!</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-300 mb-1.5">
              Nova Senha para {targetUser.display_name}
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isSubmitting || success}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-300 mb-1.5">
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isSubmitting || success}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
            />
          </div>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-mono text-xs uppercase"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || success}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs uppercase font-semibold transition-colors disabled:opacity-50 shadow-md"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <span>Redefinir Senha</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
