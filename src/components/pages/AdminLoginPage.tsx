import React, { useState } from 'react';
import { Lock, Mail, ShieldAlert, RefreshCw, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { navigateTo } from '../../utils/routes';
import prideLogoCutout from '../../assets/pride-muay-thai-cutout.png';

interface AdminLoginPageProps {
  onSuccess?: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess }) => {
  const { signIn, session, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Se já estiver logado como admin, redireciona para o dashboard
  if (session && isAdmin) {
    if (onSuccess) {
      onSuccess();
    } else {
      navigateTo('/admin');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Por favor, informe seu e-mail e senha.');
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email.trim(), password);
      if (onSuccess) {
        onSuccess();
      } else {
        navigateTo('/admin');
      }
    } catch {
      // Mensagem de erro genérica por segurança
      setErrorMessage('Credenciais inválidas ou conta sem privilégios de administrador.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 pt-32 sm:pt-36 md:pt-40 pb-20">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-[#0d0d12] border border-zinc-800 shadow-2xl relative overflow-hidden my-auto">
        {/* Glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-64 bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Brand header */}
        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 p-2 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <img
              src={prideLogoCutout}
              alt="Pride Muay Thai"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="font-fight text-2xl sm:text-3xl text-white uppercase tracking-wider">
            Painel <span className="text-red-500">Administrativo</span>
          </h1>
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-400 mt-1">
            Acesso Restrito à Liderança Pride
          </p>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-start gap-2.5"
          >
            <ShieldAlert size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5"
            >
              E-mail de Acesso
            </label>
            <div className="relative">
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2.5 pl-10 pr-3 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5"
            >
              Senha
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-zinc-200 py-2.5 pl-10 pr-3 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              className="w-full justify-center"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                <span>Entrar no Painel</span>
              )}
            </Button>
          </div>
        </form>

        {/* Back to landing */}
        <div className="mt-8 pt-6 border-t border-zinc-800/80 text-center relative z-10">
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} className="text-red-500" />
            <span>Voltar ao site público</span>
          </a>
        </div>
      </div>
    </div>
  );
};
