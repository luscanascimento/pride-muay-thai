# Relatório de Auditoria de Segurança, Hardening & Governança (Pride Muay Thai)

Data da Auditoria: 31 de Outubro de 2026  
Status: **Implementado & Mitigado**  
Versão da Plataforma: 1.0.0 (React 19 + TypeScript + Vite + Supabase)

---

## 1. Sumário Executivo & Incidente Resolvido

No dia 31/10/2026, uma notificação de pesquisador de segurança alertou para o fato de que duas RPCs administrativas (`admin_reset_user_password` e `admin_delete_user`) estavam abertas para execução pela role anônima (`anon`) com permissão pública padrão do PostgreSQL e sem checagens de autorização na instância remota do Supabase.

A **Hotfix Emergencial** foi imediatamente aplicada manualmente no Supabase pelo administrador e versionada na migração `008_security_hardening.sql`. Um reteste formal com a `anon key` pública confirmou:
- `POST /rest/v1/rpc/admin_reset_user_password` ➜ **HTTP 401 Permission Denied**
- `POST /rest/v1/rpc/admin_delete_user` ➜ **HTTP 401 Permission Denied**
- `POST /rest/v1/rpc/admin_create_user` ➜ **HTTP 401 Permission Denied**
- `POST /rest/v1/rpc/is_super_admin` ➜ **HTTP 401 Permission Denied**

Este documento detalha o endurecimento completo em 10 fases aplicado no repositório, mitigando não apenas a brecha inicial, mas elevando a postura de segurança do banco, Edge Functions, autenticação, frontend, headers HTTP, supply chain e exportações.

---

## 2. Modelo de Ameaça (Threat Model)

O sistema Pride Muay Thai consiste em uma SPA pública integrada a um painel administrativo com acesso restrito a professores e fundadores.

| Vetor de Ameaça | Superfície Afetada | Impacto Potencial | Mitigação Aplicada |
|---|---|---|---|
| **Invocação anônima de RPCs** | Endpoints `/rest/v1/rpc/*` | Reset não autorizado de senhas, sequestro de contas fundadoras e deleção | Revogação explícita de `EXECUTE` para `anon`/`public`, `SET search_path = ''`, verificação estrita de `auth.uid()` e papel de fundador. |
| **Vazamento de Chave PIX** | Tabela `public.events` | Exposição de dados bancários/PIX em eventos onde `show_pix=false` | View pública `public.public_events` com mascaramento condicional (`case when show_pix then pix_key else null`), seleção explícita de colunas no frontend. |
| **Usurpação de Ownership** | `events`, `event_brackets` | Administrador delegado alterando/excluindo eventos ou chaveamentos de outros admins | RLS condicional (`created_by = auth.uid() OR is_super_admin()`) e trigger imutável que fixa `created_by` pelo banco. |
| **Supply Chain & Vulnerabilidades em Dependências** | Pacotes NPM (`xlsx`) | Execução de código arbitrário e ReDoS via Prototype Pollution (`GHSA-4r6h-8v6p-xvw6`) | Remoção de `xlsx@0.18.5`, substituição por `write-excel-file` (0 vulnerabilidades), atualização do Vite 6.4.5. |
| **Spreadsheet Formula Injection** | Exportações CSV e Excel | Execução remota de comandos no MS Excel via `=cmd|...` ou `=HYPERLINK` ao abrir planilhas | Neutralização estrita com apóstrofo (`'`) para valores iniciados por `=`, `+`, `-`, `@`, `\t`, `\r`. |
| **Ataques de Injeção & XSS em Mapa** | `GymsMap.tsx` via `innerHTML` | Injeção de script via dados de academias | Sanitização rigorosa via `escapeHtml()`, remoção do token Mapbox estático, tratamento amigável de erro. |
| **Clickjacking & Inline Injection** | Vercel / Cabeçalhos HTTP | Embed malicioso do painel em iframe, injeção de scripts não autorizados | Headers HTTP em `vercel.json`: CSP estrita com Supabase/Mapbox/Fonts, `frame-ancestors 'none'`, HSTS, `nosniff`. |

---

## 3. Matriz de Roles & Controle de Acesso (RBAC)

O sistema opera com 5 níveis de privilégio:

| Recurso / Operação | Visitante Anônimo (`anon`) | Usuário Autenticado Comum | Administrador Delegado (`admin`) | Super Administrador (`super_admin`) | Service Role (`service_role`) |
|---|---|---|---|---|---|
| **Eventos Publicados** | Leitura (PIX mascarado se oculto) | Leitura | Leitura completa | Leitura completa | Acesso irrestrito |
| **Eventos em Rascunho** | Negado | Negado | Leitura/Edição (apenas se `created_by = auth.uid()`) | Leitura/Edição irrestrita | Acesso irrestrito |
| **Chaveamentos de Luta** | Leitura (se `is_published = true`) | Leitura (se `is_published = true`) | Gestão (apenas do seu próprio evento) | Gestão de todos os chaveamentos | Acesso irrestrito |
| **Alunos e Graduações** | Leitura (apenas públicos e ativos) | Leitura | Criação e Edição | Criação e Edição total | Acesso irrestrito |
| **Inscrições de Graduação** | Submissão com Anti-Spam | Submissão com Anti-Spam | Visualização, Edição de Candidato, Baixa | Visualização, Edição, Baixa, Exportação | Acesso irrestrito |
| **Gestão de Usuários** | Bloqueado (401) | Bloqueado (403) | Bloqueado (403) | **Acesso Exclusivo** (Criação, Reset, Deleção) | Acesso irrestrito |
| **Tabela de Auditoria** | Bloqueado | Bloqueado | Bloqueado | **Leitura Exclusiva** | Inserção/Manutenção |

---

## 4. Catálogo de RPCs e Endpoints

### 4.1 RPCs Privadas (Exclusivas de Super Administradores)
1. `public.admin_create_user(new_email, new_password, new_display_name)`:
   - Permissão: `authenticated` (valida internamente `is_super_admin()`).
   - Bloqueio: `anon` e `public` revogados.
   - Requisito de senha: Mínimo de 12 caracteres.
   - Auditoria: Registra ação em `admin_audit_logs`.
2. `public.admin_reset_user_password(target_user_id, new_password)`:
   - Permissão: `authenticated` (valida internamente `is_super_admin()`).
   - Regra estrita: Nenhum super admin pode resetar a senha de outro super admin (apenas a sua própria).
   - Retorno: Erro explícito (`Usuário não encontrado`) se o UUID não existir.
   - Auditoria: Registra ação em `admin_audit_logs`.
3. `public.admin_delete_user(target_user_id)`:
   - Permissão: `authenticated` (valida internamente `is_super_admin()`).
   - Regra estrita: Contas fundadoras são protegidas contra exclusão.
   - Retorno: Erro explícito se o UUID não existir.
   - Auditoria: Registra ação em `admin_audit_logs`.
4. `public.is_super_admin()`:
   - Permissão: `authenticated`.
   - Bloqueio: `anon` e `public` revogados.

### 4.2 RPCs Privadas (Administradores Autenticados)
1. `public.is_admin()`: Retorna se `auth.uid()` consta na tabela `admin_users`.
2. `public.set_student_khan(target_student_id, target_khan, achieved_at_date, correction_mode)`:
   - Permissão: `authenticated` (valida internamente `is_admin()`).
   - Bloqueio: `anon` e `public` revogados.
3. `public.set_graduation_registration_paid(p_registration_id, p_is_paid)`:
   - Permissão: `authenticated` (valida internamente `is_admin()`).
   - Bloqueio: `anon` e `public` revogados.

### 4.3 RPCs Públicas
1. `public.submit_graduation_registration(p_event_id, p_target_khan, p_student_id, p_manual_name, p_client_hash)`:
   - Permissão: `anon, authenticated`.
   - Anti-spam: Rate limiting (máx 5 inscrições por hash em 10 minutos).
   - Higienização: Normalização de nomes, proibição de duplicatas no mesmo evento e bloqueio de caracteres de injeção de fórmulas (`=`, `+`, `-`, `@`).

---

## 5. Arquitetura Server-Side: Supabase Edge Functions

Para eliminar permanentemente a manipulação de `auth.users` diretamente via SQL/frontend:

- **Edge Function criada:** `supabase/functions/admin-users/index.ts`
- **Operações:**
  - `create`: Invoca `supabaseAdmin.auth.admin.createUser` e insere em `public.admin_users`.
  - `reset_password`: Invoca `supabaseAdmin.auth.admin.updateUserById`, revoga sessões antigas com `signOut`.
  - `delete`: Deleta de `public.admin_users` e `supabaseAdmin.auth.admin.deleteUser`.
  - `revoke_sessions`: Força encerramento de tokens ativos do usuário alvo.
- **Segurança:**
  - `SUPABASE_SERVICE_ROLE_KEY` reside exclusivamente nos Secrets do Supabase.
  - Valida o token do chamador via `auth.getUser(token)`.
  - Checa se o usuário é super admin antes de processar qualquer instrução.
  - Registra cada operação na tabela de auditoria `admin_audit_logs`.

---

## 6. Procedimento de Resposta a Incidentes & Rotação de Credenciais

Caso haja suspeita de comprometimento de credenciais:

1. **Inspeção de Contas Modificadas:**
   ```sql
   select id, email, created_at, updated_at
   from auth.users
   order by updated_at desc
   limit 20;
   ```
2. **Auditoria de Ações Administrativas:**
   ```sql
   select occurred_at, action, actor_user_id, target_user_id, status, metadata
   from public.admin_audit_logs
   order by occurred_at desc
   limit 50;
   ```
3. **Inspeção de Logs de Acesso da API:**
   - Acesse **Supabase Dashboard** ➜ **Logs** ➜ **API Logs**.
   - Filtre por `path ~ "rpc/admin"`.
   - Analise os endereços IP de origem e payloads enviados.
4. **Rotação Imediata de Senhas:**
   - No Supabase Dashboard, navegue até **Authentication** ➜ **Users**.
   - Para os 3 fundadores (Lucas, Renan, Paulo), selecione **Send password recovery** ou redefina uma nova senha forte (mínimo 12 caracteres com letras maiúsculas, minúsculas, números e símbolos).

---

## 7. Preparação e Rollout Seguro de MFA / TOTP

O sistema foi instrumentado com os métodos no `authService.ts`:
- `getMfaAssuranceLevel()`: Consulta o nível atual (`aal1` ou `aal2`).
- `enrollTotpFactor()`: Gera URI e QR Code para Google Authenticator / 1Password.
- `verifyTotpFactor(factorId, code)`: Valida desafio e eleva a sessão para `aal2`.
- `listTotpFactors()`: Lista fatores ativos.

### Rollout Seguro em Duas Etapas:
- **Etapa 1 (Atual - Opt-in):** Cada super admin ativa seu fator TOTP no perfil. Sessões sem MFA continuam em `aal1` sem lockout acidental.
- **Etapa 2 (Enforcement Futuro):** Após os 3 fundadores confirmarem o cadastro de seus fatores TOTP, aplicar política RLS / Edge Function bloqueando operações críticas caso `aal !== 'aal2'`.

---

## 8. Proteção contra Injeção em Planilhas (Formula Injection)

Arquivos CSV e Excel abertos no Microsoft Excel, Google Sheets ou LibreOffice podem interpretar células iniciadas por `=`, `+`, `-`, `@`, `\t` ou `\r` como fórmulas ativas (DDE, chamadas de sistema ou exfiltração de dados).

A função centralizada `sanitizeSpreadsheetFormula` em [studentExcelExport.ts](file:///home/sirbu/projects/pride-muay-thai/src/utils/studentExcelExport.ts) neutraliza qualquer entrada maliciosa adicionando um apóstrofo (`'`) inicial:
```ts
export function sanitizeSpreadsheetFormula(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  const trimmedSpaces = str.replace(/^[ \uFEFF\xA0]+/, '');
  if (/^[=+\-@\t\r]/.test(trimmedSpaces)) {
    return `'${str}`;
  }
  return str;
}
```
Todas as exportações de Alunos e Graduações utilizam essa proteção.

---

## 9. Política de Migrações do Banco de Dados

| Migration | Arquivo | Finalidade |
|---|---|---|
| `001` | `001_initial_schema.sql` | Esquema inicial, tabelas `admin_users`, `events`, `students`. |
| `002` | `002_add_gyms_to_students.sql` | Vínculo de academias a alunos. |
| `003` | `003_event_brackets.sql` | Chaveamentos de competição vinculados a eventos. |
| `004` | `004_bracket_visibility.sql` | Controle de visibilidade de chaveamentos (`is_published`). |
| `005` | `005_event_enhancements.sql` | Novos campos em eventos (preço, PIX, redes sociais). |
| `006` | `006_user_management.sql` | Criação de papéis de super admin e gestão de usuários. |
| `007` | `007_graduation_registrations.sql` | Inscrições de graduação e gestão de pagamentos. |
| `008` | `008_security_hardening.sql` | **Hotfix Emergencial:** Revogação de privilégios de `public` e `anon`. |
| `009` | `009_security_definer_hardening.sql` | Endurecimento `SET search_path = ''`, qualificação explícita, senha >= 12 chars e tabela de auditoria. |
| `010` | `010_deprecate_legacy_admin_rpcs.sql` | Revogação definitiva de RPCs legadas pós deploy da Edge Function. |
| `011` | `011_rls_and_public_events_hardening.sql` | View pública de eventos (mascaramento PIX), RLS de chaveamentos por ownership e triggers de auditoria. |
| `012` | `012_graduation_registration_hardening.sql` | Anti-flood e rate-limit de inscrições de graduação, normalização e prevenção de fórmulas no banco. |

---

## 10. Passos Manuais de Deploy e Operação

### 10.1 Aplicar as Migrações 009, 011 e 012 no Supabase
Acesse o **Supabase Dashboard** ➜ **SQL Editor** e execute:
1. Conteúdo de `009_security_definer_hardening.sql`
2. Conteúdo de `011_rls_and_public_events_hardening.sql`
3. Conteúdo de `012_graduation_registration_hardening.sql`

*(A migração 010 deve ser aplicada apenas após o deploy da Edge Function abaixo).*

### 10.2 Deploy da Edge Function `admin-users`
Instale a CLI do Supabase localmente ou execute via terminal autenticado:
```bash
supabase login
supabase link --project-ref <seu-project-ref>
supabase functions deploy admin-users
```
Os segredos `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` são injetados automaticamente pelo Supabase Runtime nas Edge Functions.

### 10.3 Restrição de Domínio do Token Mapbox
No painel de controle do [Mapbox](https://account.mapbox.com/):
1. Acesse **Access Tokens**.
2. Selecione o token público utilizado no site.
3. Em **URL restrictions**, cadastre estritamente seus domínios autorizados (ex: `https://pridemuaythai.com.br/*`, `https://luscanascimento.github.io/*`, `http://localhost:*`).

---

## 11. Riscos Residuais e Recomendações Futuras

1. **CAPTCHA no Formulário de Graduação:** A migração 012 implementou rate-limit no banco de dados. Caso bots passem a submeter requisições distribuídas, recomenda-se ativar o Cloudflare Turnstile integrando com a Edge Function documentada.
2. **Monitoramento Contínuo:** Agendar revisão quinzenal dos registros de `public.admin_audit_logs`.
