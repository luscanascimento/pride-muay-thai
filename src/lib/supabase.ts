import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL as string | undefined;
const supabasePublishableKey = (
  import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env?.VITE_SUPABASE_ANON_KEY
) as string | undefined;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabasePublishableKey &&
  !supabaseUrl.includes('your-project') &&
  !supabasePublishableKey.includes('your-supabase')
);

if (!isSupabaseConfigured && import.meta.env?.DEV) {
  console.warn(
    '[Pride Muay Thai] Variáveis VITE_SUPABASE_URL e/ou VITE_SUPABASE_PUBLISHABLE_KEY não estão configuradas.\n' +
    'Crie um arquivo .env.local com suas credenciais públicas do Supabase para utilizar autenticação, eventos e alunos dinâmicos.'
  );
}

// Inicializa o cliente Supabase tipado.
// Utiliza fallback seguro para evitar crash durante build ou quando variáveis ainda não foram provisionadas.
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabasePublishableKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
