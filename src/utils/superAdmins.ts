/**
 * Definições e regras de segurança para os 3 Administradores Fundadores (Super Admins)
 * da Pride Muay Thai: Renan Fernandes, Paulo Roberto e Lucas Nascimento.
 *
 * Regras estritas:
 * 1. As 3 contas iniciais possuem acesso total (full access) ao sistema.
 * 2. As 3 contas são fixas e imutáveis por terceiros: nenhum fundador pode resetar
 *    a senha ou excluir a conta de outro fundador (apenas cada um altera a sua própria).
 * 3. Novos administradores criados podem criar eventos e gerenciar alunos, mas
 *    SÓ PODEM EDITAR os eventos que eles próprios criaram.
 * 4. Novos administradores não podem criar ou gerenciar outros usuários.
 */

export const RENAN_FERNANDES_ID = 'f9775608-a259-479f-bb4f-343819ab8f43';
export const PAULO_ROBERTO_ID = 'c042913b-b249-43f5-a0ff-a88ef1927d24';
export const LUCAS_NASCIMENTO_ID = '731d2560-3eb7-42c2-9c21-7395835bffbd';

export const INITIAL_SUPER_ADMIN_IDS: readonly string[] = [
  RENAN_FERNANDES_ID,
  PAULO_ROBERTO_ID,
  LUCAS_NASCIMENTO_ID,
];

/**
 * Retorna se o usuário informado é um dos 3 administradores fundadores (Super Admins).
 */
export function isInitialSuperAdmin(userId: string | null | undefined): boolean {
  if (!userId) return false;
  return INITIAL_SUPER_ADMIN_IDS.includes(userId);
}

/**
 * Verifica se o usuário atual tem permissão para editar um evento:
 * - Fundadores podem editar qualquer evento.
 * - Outros administradores só podem editar os eventos que eles próprios criaram (created_by === userId).
 */
export function canUserEditEvent(
  userId: string | null | undefined,
  event: { created_by?: string | null } | null | undefined
): boolean {
  if (!userId) return false;
  if (isInitialSuperAdmin(userId)) return true;
  if (!event || !event.created_by) return false;
  return event.created_by === userId;
}

/**
 * Verifica se o usuário atual pode resetar a senha de um usuário alvo:
 * - Apenas fundadores podem resetar senhas de outros usuários.
 * - Regra estrita: NENHUM fundador pode resetar a senha de outro fundador.
 */
export function canResetUserPassword(
  currentUserId: string | null | undefined,
  targetUserId: string
): boolean {
  if (!currentUserId) return false;
  if (!isInitialSuperAdmin(currentUserId)) return false;

  // Um fundador não pode resetar a senha de outro fundador
  if (isInitialSuperAdmin(targetUserId) && targetUserId !== currentUserId) {
    return false;
  }

  return true;
}

/**
 * Verifica se o usuário atual pode excluir ou desativar outro usuário:
 * - Apenas fundadores podem excluir usuários.
 * - NENHUM fundador pode ser excluído por ninguém.
 */
export function canDeleteUser(
  currentUserId: string | null | undefined,
  targetUserId: string
): boolean {
  if (!currentUserId) return false;
  if (!isInitialSuperAdmin(currentUserId)) return false;
  if (isInitialSuperAdmin(targetUserId)) return false;
  return true;
}

/**
 * Retorna o rótulo visual personalizado para o "Papel no Sistema" de cada usuário:
 * - Lucas Nascimento: 'Desenvolvedor / Full Access'
 * - Paulo Roberto: 'Professor / Full Access'
 * - Renan Fernandes: 'Fundador / Full Access'
 * - Outros administradores: 'Administrador Delegado'
 */
export function getUserRoleDisplayLabel(userId: string | null | undefined): string {
  if (userId === LUCAS_NASCIMENTO_ID) {
    return 'Desenvolvedor / Full Access';
  }
  if (userId === PAULO_ROBERTO_ID) {
    return 'Professor / Full Access';
  }
  if (userId === RENAN_FERNANDES_ID) {
    return 'Fundador / Full Access';
  }
  if (isInitialSuperAdmin(userId)) {
    return 'Fundador / Full Access';
  }
  return 'Administrador Delegado';
}
