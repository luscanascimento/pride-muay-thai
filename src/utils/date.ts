/**
 * Utilitários para formatação de data e hora em pt-BR no fuso de São Paulo (America/Sao_Paulo).
 *
 * Trata corretamente datas de calendário puro (YYYY-MM-DD) sem deslocamento de fuso UTC,
 * evitando que 27/10 vire 26/10 no fuso de Brasília/São Paulo (-03:00).
 */

const TIMEZONE = 'America/Sao_Paulo';
const DATE_ONLY_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;

const MONTH_NAMES_PT = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

/**
 * Retorna a data atual (hoje) no formato YYYY-MM-DD conforme o fuso horário de São Paulo.
 */
export function getTodayLocalDate(): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

/**
 * Formata data e hora no padrão pt-BR: DD/MM/YYYY HH:mm
 */
export function formatDateTime(isoString: string | null | undefined): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: TIMEZONE,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return '';
  }
}

/**
 * Formata data no padrão pt-BR: DD/MM/YYYY.
 *
 * Se a string recebida for uma data de calendário simples (YYYY-MM-DD),
 * formata diretamente preservando dia, mês e ano sem sofrer conversão UTC.
 */
export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return '';
  const trimmed = isoString.trim();

  // Verifica se é data pura no formato YYYY-MM-DD (tipo DATE do PostgreSQL)
  const match = DATE_ONLY_REGEX.exec(trimmed);
  if (match) {
    const [, year, month, day] = match;
    return `${day}/${month}/${year}`;
  }

  try {
    const date = new Date(trimmed);
    if (isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: TIMEZONE,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch {
    return '';
  }
}

/**
 * Formata data por extenso: "27 de outubro de 2026"
 */
export function formatDateLong(isoString: string | null | undefined): string {
  if (!isoString) return '';
  const trimmed = isoString.trim();

  const match = DATE_ONLY_REGEX.exec(trimmed);
  if (match) {
    const [, year, monthStr, dayStr] = match;
    const day = parseInt(dayStr, 10);
    const monthIndex = parseInt(monthStr, 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${day} de ${MONTH_NAMES_PT[monthIndex]} de ${year}`;
    }
  }

  try {
    const date = new Date(trimmed);
    if (isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: TIMEZONE,
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return '';
  }
}
