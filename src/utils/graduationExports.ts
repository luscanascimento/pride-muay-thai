import { GraduationRegistrationWithEvent } from '../services/graduationRegistrationsService';
import { getKhanRank } from '../constants/khans';
import { formatDateTime } from './date';
import { sanitizeSpreadsheetFormula } from './studentExcelExport';

export interface FormattedGraduationExportRow {
  name: string;
  isRegisteredStudent: boolean;
  currentKhanText: string;
  targetKhanText: string;
  eventName: string;
  eventDateText: string;
  paymentStatusText: string;
  registrationDateText: string;
}

export interface GraduationExportDataset {
  title: string;
  eventName?: string;
  eventDateText?: string;
  filtersSummary: string;
  generatedAtText: string;
  stats: {
    total: number;
    paid: number;
    pending: number;
  };
  rows: FormattedGraduationExportRow[];
}

export interface ExportFilterOptions {
  eventName?: string;
  eventDate?: string;
  filterSummary?: string;
}

/**
 * Transforma a lista de inscrições em uma estrutura uniforme para exportação em Word, PDF e Excel.
 * Função pura e desacoplada do DOM para permitir testes automatizados.
 */
export function transformGraduationRegistrationsForExport(
  registrations: GraduationRegistrationWithEvent[],
  options: ExportFilterOptions = {}
): GraduationExportDataset {
  const total = registrations.length;
  const paid = registrations.filter((r) => r.payment_status === 'paid').length;
  const pending = total - paid;

  const rows: FormattedGraduationExportRow[] = registrations.map((reg) => {
    const isRegisteredStudent = Boolean(reg.student_id);

    let currentKhanText = 'Informado manualmente';
    if (reg.current_khan_at_registration) {
      const rank = getKhanRank(reg.current_khan_at_registration);
      currentKhanText = `${reg.current_khan_at_registration}º Khan (${rank.colorName})`;
    }

    const targetRank = getKhanRank(reg.target_khan);
    const targetKhanText = `${reg.target_khan}º Khan (${targetRank.colorName})`;

    const eventName = reg.event?.title || options.eventName || 'Graduação Pride';
    const eventDateText = reg.event?.event_date
      ? formatDateTime(reg.event.event_date)
      : options.eventDate || '—';

    const paymentStatusText = reg.payment_status === 'paid' ? 'Pago' : 'Pendente';
    const registrationDateText = formatDateTime(reg.created_at);

    return {
      name: reg.full_name,
      isRegisteredStudent,
      currentKhanText,
      targetKhanText,
      eventName,
      eventDateText,
      paymentStatusText,
      registrationDateText,
    };
  });

  return {
    title: 'Pride Muay Thai — Lista de Graduação',
    eventName: options.eventName,
    eventDateText: options.eventDate,
    filtersSummary: options.filterSummary || 'Todos os registros filtrados',
    generatedAtText: formatDateTime(new Date().toISOString()),
    stats: {
      total,
      paid,
      pending,
    },
    rows,
  };
}

/**
 * Gera o nome de arquivo padronizado com data e slug do evento se aplicável
 */
export function buildGraduationExportFilename(
  extension: 'xlsx' | 'pdf' | 'docx',
  eventSlug?: string
): string {
  const dateStr = new Date().toISOString().slice(0, 10);
  const cleanSlug = eventSlug
    ? `-${eventSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    : '';
  return `pride-graduacao${cleanSlug}-${dateStr}.${extension}`;
}

/**
 * Dispara o download de um Blob no navegador
 */
function downloadBlob(blob: Blob, filename: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 1. Exportação para Excel (.xlsx real)
 * Carregado via importação dinâmica
 */
export async function exportGraduationToExcel(
  registrations: GraduationRegistrationWithEvent[],
  options: ExportFilterOptions = {},
  eventSlug?: string
): Promise<void> {
  if (!registrations || registrations.length === 0) {
    throw new Error('Nenhum registro disponível para exportação.');
  }

  const dataset = transformGraduationRegistrationsForExport(registrations, options);
  const writeExcelFile = (await import('write-excel-file/browser')).default;

  const HEADER_STYLE = {
    fontWeight: 'bold' as const,
    backgroundColor: '#1E1E24',
    textColor: '#FFFFFF',
  };

  const sheetData = [
    [{ value: sanitizeSpreadsheetFormula(dataset.title), fontWeight: 'bold' as const, fontSize: 13 }],
    [
      {
        value: sanitizeSpreadsheetFormula(
          dataset.eventName
            ? `Evento: ${dataset.eventName} (${dataset.eventDateText || ''})`
            : 'Evento: Todos os eventos'
        ),
      },
    ],
    [{ value: sanitizeSpreadsheetFormula(`Filtros aplicados: ${dataset.filtersSummary}`) }],
    [{ value: sanitizeSpreadsheetFormula(`Data de geração: ${dataset.generatedAtText}`) }],
    [
      {
        value: sanitizeSpreadsheetFormula(
          `Total de inscritos: ${dataset.stats.total} | Pagos: ${dataset.stats.paid} | Pendentes: ${dataset.stats.pending}`
        ),
      },
    ],
    [], // linha em branco
    [
      { value: 'Nome', ...HEADER_STYLE },
      { value: 'Khan Atual', ...HEADER_STYLE },
      { value: 'Khan Pretendido', ...HEADER_STYLE },
      { value: 'Evento', ...HEADER_STYLE },
      { value: 'Data da Graduação', ...HEADER_STYLE },
      { value: 'Status do Pagamento', ...HEADER_STYLE },
      { value: 'Data da Inscrição', ...HEADER_STYLE },
    ],
  ];

  for (const r of dataset.rows) {
    sheetData.push([
      { value: sanitizeSpreadsheetFormula(r.name) },
      { value: sanitizeSpreadsheetFormula(r.currentKhanText) },
      { value: sanitizeSpreadsheetFormula(r.targetKhanText) },
      { value: sanitizeSpreadsheetFormula(r.eventName) },
      { value: sanitizeSpreadsheetFormula(r.eventDateText) },
      { value: sanitizeSpreadsheetFormula(r.paymentStatusText) },
      { value: sanitizeSpreadsheetFormula(r.registrationDateText) },
    ]);
  }

  const filename = buildGraduationExportFilename('xlsx', eventSlug);
  const blob = await writeExcelFile(sheetData, {
    columns: [
      { width: 30 },
      { width: 26 },
      { width: 26 },
      { width: 30 },
      { width: 20 },
      { width: 18 },
      { width: 20 },
    ],
  }).toBlob();

  downloadBlob(blob, filename);
}

/**
 * 2. Exportação para PDF (.pdf real)
 * Carregado via importação dinâmica com jsPDF e jspdf-autotable
 */
export async function exportGraduationToPdf(
  registrations: GraduationRegistrationWithEvent[],
  options: ExportFilterOptions = {},
  eventSlug?: string
): Promise<void> {
  if (!registrations || registrations.length === 0) {
    throw new Error('Nenhum registro disponível para exportação.');
  }

  const dataset = transformGraduationRegistrationsForExport(registrations, options);

  const { jsPDF } = await import('jspdf');
  const autotableModule = await import('jspdf-autotable');
  // jspdf-autotable pode vir como default export ou função direta
  const autoTable = (autotableModule.default || autotableModule) as unknown as (
    doc: InstanceType<typeof jsPDF>,
    options: Record<string, unknown>
  ) => void;

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Título e cabeçalho editorial
  doc.setFontSize(16);
  doc.setTextColor(220, 38, 38); // Red-600
  doc.text(dataset.title, 14, 15);

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);

  let currentY = 22;
  if (dataset.eventName) {
    doc.text(`Evento: ${dataset.eventName} (${dataset.eventDateText || ''})`, 14, currentY);
    currentY += 5;
  }

  doc.text(`Filtros: ${dataset.filtersSummary}`, 14, currentY);
  currentY += 5;

  doc.text(
    `Gerado em: ${dataset.generatedAtText} | Total: ${dataset.stats.total} | Pagos: ${dataset.stats.paid} | Pendentes: ${dataset.stats.pending}`,
    14,
    currentY
  );
  currentY += 7;

  // Tabela de dados
  const tableHeaders = [
    'Nome',
    'Khan Atual',
    'Khan Pretendido',
    'Evento',
    'Data da Graduação',
    'Status',
    'Data da Inscrição',
  ];

  const tableBody = dataset.rows.map((r) => [
    r.name,
    r.currentKhanText,
    r.targetKhanText,
    r.eventName,
    r.eventDateText,
    r.paymentStatusText,
    r.registrationDateText,
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [tableHeaders],
    body: tableBody,
    theme: 'striped',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      font: 'helvetica',
    },
    headStyles: {
      fillColor: [180, 20, 20],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 248, 248],
    },
  });

  const filename = buildGraduationExportFilename('pdf', eventSlug);
  doc.save(filename);
}

/**
 * 3. Exportação para Word (.docx real)
 * Carregado via importação dinâmica com docx
 */
export async function exportGraduationToWord(
  registrations: GraduationRegistrationWithEvent[],
  options: ExportFilterOptions = {},
  eventSlug?: string
): Promise<void> {
  if (!registrations || registrations.length === 0) {
    throw new Error('Nenhum registro disponível para exportação.');
  }

  const dataset = transformGraduationRegistrationsForExport(registrations, options);
  const docx = await import('docx');

  const {
    Document,
    Packer,
    Paragraph,
    Table,
    TableRow,
    TableCell,
    TextRun,
    HeadingLevel,
    AlignmentType,
    WidthType,
    ShadingType,
  } = docx;

  const tableHeaders = [
    'Nome',
    'Khan Atual',
    'Khan Pretendido',
    'Evento',
    'Data da Graduação',
    'Status',
    'Data Inscrição',
  ];

  const headerRow = new TableRow({
    tableHeader: true,
    children: tableHeaders.map(
      (header) =>
        new TableCell({
          shading: {
            fill: '991B1B', // Dark red
            type: ShadingType.CLEAR,
          },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: header,
                  bold: true,
                  color: 'FFFFFF',
                  size: 18, // 9pt
                }),
              ],
            }),
          ],
        })
    ),
  });

  const dataRows = dataset.rows.map(
    (row, idx) =>
      new TableRow({
        children: [
          row.name,
          row.currentKhanText,
          row.targetKhanText,
          row.eventName,
          row.eventDateText,
          row.paymentStatusText,
          row.registrationDateText,
        ].map(
          (text) =>
            new TableCell({
              shading:
                idx % 2 === 1
                  ? { fill: 'F4F4F5', type: ShadingType.CLEAR }
                  : undefined,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text,
                      size: 16, // 8pt
                    }),
                  ],
                }),
              ],
            })
        ),
      })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: docx.PageOrientation.LANDSCAPE,
            },
          },
        },
        children: [
          new Paragraph({
            text: dataset.title,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.LEFT,
          }),
          ...(dataset.eventName
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Evento: ${dataset.eventName} (${dataset.eventDateText || ''})`,
                      bold: true,
                    }),
                  ],
                }),
              ]
            : []),
          new Paragraph({
            children: [
              new TextRun({
                text: `Filtros: ${dataset.filtersSummary}`,
                italics: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Gerado em: ${dataset.generatedAtText} | Total: ${dataset.stats.total} | Pagos: ${dataset.stats.paid} | Pendentes: ${dataset.stats.pending}`,
              }),
            ],
          }),
          new Paragraph({ text: '' }), // Linha em branco
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [headerRow, ...dataRows],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filename = buildGraduationExportFilename('docx', eventSlug);
  downloadBlob(blob, filename);
}
