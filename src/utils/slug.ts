/**
 * Utilitário para geração de slug amigável para URLs
 */
export function generateSlug(text: string): string {
  if (!text) return '';

  return text
    .normalize('NFD') // Decomposição canônica de acentos
    .replace(/[\u0300-\u036f]/g, '') // Remove marcas de acentuação
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Espaços para hífens
    .replace(/-+/g, '-') // Múltiplos hífens para único hífen
    .replace(/^-+|-+$/g, ''); // Remove hífens no início e fim
}
