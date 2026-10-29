/**
 * Regras fixas e oficiais para eventos de graduação da Pride Muay Thai.
 * Fonte única, tipada e reutilizável para regras, equipamentos, PIX e tabela de valores.
 */

export interface GraduationPixInfo {
  readonly key: string;
  readonly displayKey: string;
  readonly institution: string;
  readonly beneficiary: string;
}

export const GRADUATION_PIX: GraduationPixInfo = {
  key: '12991746964',
  displayKey: '(12) 99174-6964',
  institution: 'Mercado Pago',
  beneficiary: 'Renan',
} as const;

export const GRADUATION_MANDATORY_EQUIPMENT: readonly string[] = [
  'Camiseta padrão da equipe',
  'Calção de Muay Thai',
  'Bandagem e luva',
  'Caneleira acima do 4º Khan',
] as const;

export interface GraduationPricingTier {
  readonly level: number;
  readonly colorName: string;
  readonly priceInCents: number | null;
}

/**
 * Tabela fixa de valores para os Khans (em centavos).
 * 1º Khan (Branco): valor não definido (exibir "—", não chamar automaticamente de gratuito).
 * Não inventar preços para os Khans 11 a 16.
 */
export const GRADUATION_PRICING_TABLE: readonly GraduationPricingTier[] = [
  { level: 1, colorName: 'Branca', priceInCents: null },
  { level: 2, colorName: 'Amarela', priceInCents: 14500 },
  { level: 3, colorName: 'Amarela Ponta Branca', priceInCents: 17500 },
  { level: 4, colorName: 'Verde', priceInCents: 23000 },
  { level: 5, colorName: 'Verde Ponta Branca', priceInCents: 26000 },
  { level: 6, colorName: 'Azul', priceInCents: 30000 },
  { level: 7, colorName: 'Azul Ponta Branca', priceInCents: 36000 },
  { level: 8, colorName: 'Marrom', priceInCents: 48000 },
  { level: 9, colorName: 'Marrom Ponta Branca', priceInCents: 70000 },
  { level: 10, colorName: 'Vermelha', priceInCents: 150000 },
] as const;

/**
 * Formata o preço da graduação em pt-BR.
 * Retorna "—" caso o valor seja nulo/não definido.
 */
export function formatGraduationPrice(priceInCents: number | null | undefined): string {
  if (priceInCents === null || priceInCents === undefined) {
    return '—';
  }

  const valueInReais = priceInCents / 100;
  return valueInReais.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Retorna o preço em centavos para determinado Khan (se estiver na tabela oficial).
 */
export function getGraduationPriceForKhan(level: number): number | null {
  const tier = GRADUATION_PRICING_TABLE.find((t) => t.level === level);
  return tier ? tier.priceInCents : null;
}

/**
 * Sugere o próximo Khan para um aluno com base em seu Khan atual.
 * - atual 1 → pretendido 2
 * - atual 9 → pretendido 10
 * - atual 16 → pretendido 16 (teto máximo)
 * - indefinido/nulo → 1
 */
export function suggestNextKhan(currentKhan: number | null | undefined): number {
  if (!currentKhan || currentKhan < 1) {
    return 1;
  }
  return Math.min(currentKhan + 1, 16);
}
