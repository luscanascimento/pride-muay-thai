/**
 * Utilitários de formatação e máscara para valores monetários em Real (BRL / R$).
 */

/**
 * Aplica máscara de moeda em tempo real durante a digitação no input.
 * Formata os dígitos inseridos progressivamente em centavos.
 *
 * Exemplos:
 * - '6' -> 'R$ 0,06'
 * - '60' -> 'R$ 0,60'
 * - '600' -> 'R$ 6,00'
 * - '6000' -> 'R$ 60,00'
 * - '60000' -> 'R$ 600,00'
 * - '' -> ''
 */
export function maskCurrencyInput(rawValue: string): string {
  if (!rawValue) return '';

  const digits = rawValue.replace(/\D/g, '');
  if (!digits) return '';

  const cents = parseInt(digits, 10);
  if (isNaN(cents) || cents === 0) return '';

  const amount = (cents / 100).toFixed(2);
  const [integerPart, decimalPart] = amount.split('.');
  const formattedInteger = parseInt(integerPart, 10).toLocaleString('pt-BR');

  return `R$ ${formattedInteger},${decimalPart}`;
}

/**
 * Normaliza qualquer entrada (número, string com ou sem R$, colada ou salva no banco)
 * para o formato monetário padrão brasileiro com 'R$' antes do número: 'R$ 60,00'.
 */
export function normalizeCurrencyBrl(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';

  const str = String(value).trim();
  if (!str) return '';

  // Se for texto sem nenhum número (ex: 'Gratuito', 'Isento'), mantém
  if (!/\d/.test(str)) {
    return str;
  }

  // Remove espaços duplicados e prefixo R$ para normalização limpa
  const withoutPrefix = str.replace(/^R\$\s*/i, '').trim();

  // Caso 1: String com vírgula decimal (ex: '60,00', '1.250,50', '60,5')
  if (withoutPrefix.includes(',')) {
    const [rawInt, rawDec = '00'] = withoutPrefix.split(',');
    const cleanInt = rawInt.replace(/\D/g, '');
    const intNum = cleanInt ? parseInt(cleanInt, 10) : 0;
    const decStr = rawDec.replace(/\D/g, '').padEnd(2, '0').slice(0, 2);
    return `R$ ${intNum.toLocaleString('pt-BR')},${decStr}`;
  }

  // Caso 2: String com ponto decimal (ex: '60.00', '60.5', '1250.50')
  if (withoutPrefix.includes('.')) {
    const parts = withoutPrefix.split('.');
    // Se a última parte tem até 2 dígitos, trata como decimal
    if (parts.length === 2 && parts[1].length <= 2) {
      const intNum = parseInt(parts[0].replace(/\D/g, ''), 10) || 0;
      const decStr = parts[1].replace(/\D/g, '').padEnd(2, '0').slice(0, 2);
      return `R$ ${intNum.toLocaleString('pt-BR')},${decStr}`;
    }
  }

  // Caso 3: Apenas inteiros (ex: '60', '100', '1500')
  const digits = withoutPrefix.replace(/\D/g, '');
  if (!digits) return '';

  const num = parseInt(digits, 10);
  if (isNaN(num)) return '';

  return `R$ ${num.toLocaleString('pt-BR')},00`;
}

/**
 * Formata o valor para exibição em cards, detalhes de eventos e seção do PIX.
 * Garante que o valor sempre contenha o prefixo 'R$' antes do número.
 */
export function formatDisplayPrice(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '';
  return normalizeCurrencyBrl(value);
}
