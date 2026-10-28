import { DbStudent } from '../types/database';
import { getKhanRank } from '../constants/khans';
import { getGymNames } from './gyms';

/**
 * Constrói o conteúdo CSV compatível com Microsoft Excel (RFC 4180 + UTF-8 BOM + delimitador ponto e vírgula).
 *
 * Colunas estritamente delimitadas:
 * 1. Nome
 * 2. Khan Atual
 * 3. Academia
 */
export function buildStudentsCsvContent(students: DbStudent[]): string {
  if (!students || students.length === 0) {
    throw new Error('Nenhum aluno disponível para exportação.');
  }

  const headers = ['Nome', 'Khan Atual', 'Academia'];

  const rows = students.map((student) => {
    const rank = getKhanRank(student.current_khan);
    const khanText = `${student.current_khan}º Khan (${rank.colorName})`;
    const gymsText = getGymNames(student.gym_ids).join(', ') || 'Não informada';

    // Escapar aspas duplas dentro dos valores conforme RFC 4180
    const escapedName = (student.name || '').replace(/"/g, '""');
    const escapedKhan = khanText.replace(/"/g, '""');
    const escapedGyms = gymsText.replace(/"/g, '""');

    return `"${escapedName}";"${escapedKhan}";"${escapedGyms}"`;
  });

  // UTF-8 BOM (\uFEFF) garante que o Microsoft Excel abra o arquivo
  // diretamente com a acentuação correta em português (pt-BR)
  return '\uFEFF' + [headers.map((h) => `"${h}"`).join(';'), ...rows].join('\r\n');
}

/**
 * Exporta a tabela de alunos para uma planilha compatível com Microsoft Excel,
 * Google Planilhas e LibreOffice Calc.
 */
export function exportStudentsToExcel(
  students: DbStudent[],
  filename = 'pride-muay-thai-alunos'
): void {
  const csvContent = buildStudentsCsvContent(students);

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
