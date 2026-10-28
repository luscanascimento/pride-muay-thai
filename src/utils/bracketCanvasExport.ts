import { DbEventBracket, BracketMatch } from '../types/brackets';

export interface BracketExportOptions {
  eventTitle: string;
  eventDate?: string;
}

/**
 * Renderiza um chaveamento em um Canvas HTML5 em alta resolução (2x Retina)
 * e realiza o download direto em formato PNG.
 */
export async function downloadBracketAsImage(
  bracket: DbEventBracket,
  options: BracketExportOptions
): Promise<void> {
  const rounds = bracket.rounds || [];
  if (rounds.length === 0) {
    throw new Error('O chaveamento não possui lutas cadastradas para exportação.');
  }

  // Dimensões base do canvas
  const paddingX = 80;
  const headerHeight = 220;
  const footerHeight = 80;
  const colWidth = 320;
  const colGap = 70;
  const matchCardWidth = 300;
  const matchCardHeight = 110;

  const totalCols = rounds.length;
  const maxMatchesInRound = Math.max(...rounds.map((r) => r.matches.length), 1);

  // Calcula altura necessária
  const contentHeight = Math.max(650, maxMatchesInRound * (matchCardHeight + 50));
  const canvasWidth = Math.max(1400, paddingX * 2 + totalCols * colWidth + (totalCols - 1) * colGap);
  const canvasHeight = headerHeight + contentHeight + footerHeight;

  // Renderiza com escala 2x para nitidez em telas Retina e impressões
  const scale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth * scale;
  canvas.height = canvasHeight * scale;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Falha ao inicializar o motor gráfico do navegador.');
  }

  ctx.scale(scale, scale);

  // 1. Fundo dark martial elegante
  const bgGrad = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
  bgGrad.addColorStop(0, '#0a0a0e');
  bgGrad.addColorStop(0.5, '#0e0e13');
  bgGrad.addColorStop(1, '#070709');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Glow vermelho sutil no topo e centro
  const topGlow = ctx.createRadialGradient(
    canvasWidth / 2,
    0,
    50,
    canvasWidth / 2,
    0,
    canvasWidth * 0.6
  );
  topGlow.addColorStop(0, 'rgba(220, 38, 38, 0.18)');
  topGlow.addColorStop(1, 'rgba(220, 38, 38, 0)');
  ctx.fillStyle = topGlow;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Linhas cerimoniais decorativas
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(paddingX, headerHeight - 30);
  ctx.lineTo(canvasWidth - paddingX, headerHeight - 30);
  ctx.stroke();

  // 2. Cabeçalho oficial Pride Muay Thai
  ctx.textAlign = 'center';

  // Badge da Federação/Equipe
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 12px "Montserrat", sans-serif';
  ctx.fillText('PRIDE MUAY THAI • CHAVEAMENTO OFICIAL DE COMPETIÇÃO', canvasWidth / 2, 60);

  // Título do Evento
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 34px "Bebas Neue", "Montserrat", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText(options.eventTitle.toUpperCase(), canvasWidth / 2, 105);

  // Título do Chaveamento / Categoria
  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 22px "Bebas Neue", "Montserrat", sans-serif';
  const subtitle = bracket.category_name
    ? `${bracket.title.toUpperCase()} — ${bracket.category_name.toUpperCase()}`
    : bracket.title.toUpperCase();
  ctx.fillText(subtitle, canvasWidth / 2, 140);

  if (options.eventDate) {
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '13px monospace';
    ctx.fillText(options.eventDate, canvasWidth / 2, 168);
  }

  // 3. Renderização das Colunas de Rodadas e Lutas
  const matchPositions = new Map<string, { x: number; y: number }>();

  rounds.forEach((round, colIdx) => {
    const colX = paddingX + colIdx * (colWidth + colGap);

    // Título da Rodada
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 14px "Montserrat", monospace';
    ctx.fillText(round.round_name.toUpperCase(), colX, headerHeight + 10);

    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(colX, headerHeight + 18);
    ctx.lineTo(colX + 80, headerHeight + 18);
    ctx.stroke();

    const matchesCount = round.matches.length;
    const spacingY = contentHeight / matchesCount;

    round.matches.forEach((match: BracketMatch, mIdx: number) => {
      const matchY = headerHeight + 45 + mIdx * spacingY + (spacingY - matchCardHeight) / 2;
      matchPositions.set(match.id, { x: colX + matchCardWidth, y: matchY + matchCardHeight / 2 });

      // Desenhar Card da Luta
      drawMatchCard(ctx, colX, matchY, matchCardWidth, matchCardHeight, match);
    });
  });

  // 4. Desenhar Conectores entre Rodadas
  rounds.forEach((round, colIdx) => {
    if (colIdx >= rounds.length - 1) return;
    const nextRound = rounds[colIdx + 1];

    round.matches.forEach((match: BracketMatch) => {
      const currentPos = matchPositions.get(match.id);
      if (!currentPos) return;

      // Localiza a luta de destino no próximo round (por next_match_id ou cálculo proporcional)
      let targetMatch: BracketMatch | undefined;
      if (match.next_match_id) {
        targetMatch = nextRound.matches.find((m) => m.id === match.next_match_id);
      } else {
        const nextIdx = Math.floor((match.match_number - 1) / 2);
        targetMatch = nextRound.matches[nextIdx] || nextRound.matches[0];
      }

      if (!targetMatch) return;
      const targetPos = matchPositions.get(targetMatch.id);
      if (!targetPos) return;

      // Ponto de entrada do card destino
      const targetInX = targetPos.x - matchCardWidth;
      const midX = currentPos.x + (targetInX - currentPos.x) / 2;

      ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(currentPos.x, currentPos.y);
      ctx.lineTo(midX, currentPos.y);
      ctx.lineTo(midX, targetPos.y);
      ctx.lineTo(targetInX, targetPos.y);
      ctx.stroke();
    });
  });

  // 5. Rodapé oficial na imagem
  ctx.textAlign = 'center';
  ctx.fillStyle = '#71717a';
  ctx.font = '12px "Montserrat", monospace';
  ctx.fillText(
    'PRIDE MUAY THAI • pridemuaythai.com.br • Tradição, Técnica, Disciplina e Respeito',
    canvasWidth / 2,
    canvasHeight - 35
  );

  // 6. Conversão para blob e disparo de download
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/png')
  );

  if (!blob) {
    throw new Error('Falha ao gerar o arquivo de imagem.');
  }

  const sanitizedTitle = bracket.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pride-chaveamento-${sanitizedTitle || 'lutas'}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function drawMatchCard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  match: BracketMatch
) {
  const radius = 8;

  // Fundo do card
  ctx.fillStyle = '#111116';
  roundRect(ctx, x, y, w, h, radius);
  ctx.fill();

  // Borda do card
  ctx.strokeStyle = '#27272a';
  ctx.lineWidth = 1.2;
  roundRect(ctx, x, y, w, h, radius);
  ctx.stroke();

  const slotHeight = (h - 2) / 2;

  // Slot Fighter A (Corner Vermelho)
  const isWinnerA = match.winner === 'a';
  if (isWinnerA) {
    ctx.fillStyle = 'rgba(220, 38, 38, 0.25)';
    ctx.fillRect(x + 1, y + 1, w - 2, slotHeight);
  }

  // Marcador de Corner A
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(x + 1, y + 1, 4, slotHeight);

  // Texto Fighter A
  ctx.textAlign = 'left';
  ctx.font = isWinnerA ? 'bold 13px "Montserrat", sans-serif' : '13px "Montserrat", sans-serif';
  ctx.fillStyle = isWinnerA ? '#ffffff' : '#d4d4d8';
  const nameA = match.fighter_a || 'A definir';
  ctx.fillText(nameA.length > 24 ? nameA.slice(0, 23) + '…' : nameA, x + 14, y + 25);

  if (match.fighter_a_gym) {
    ctx.font = '10px monospace';
    ctx.fillStyle = '#71717a';
    ctx.fillText(match.fighter_a_gym, x + 14, y + 42);
  }

  if (isWinnerA) {
    ctx.textAlign = 'right';
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('★ VENCEU', x + w - 12, y + 26);
  }

  // Divisor central do card
  ctx.strokeStyle = '#1f1f23';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 6, y + slotHeight);
  ctx.lineTo(x + w - 6, y + slotHeight);
  ctx.stroke();

  // Slot Fighter B (Corner Azul)
  const isWinnerB = match.winner === 'b';
  const slotBY = y + slotHeight;
  if (isWinnerB) {
    ctx.fillStyle = 'rgba(59, 130, 246, 0.22)';
    ctx.fillRect(x + 1, slotBY, w - 2, slotHeight);
  }

  // Marcador de Corner B
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(x + 1, slotBY, 4, slotHeight);

  // Texto Fighter B
  ctx.textAlign = 'left';
  ctx.font = isWinnerB ? 'bold 13px "Montserrat", sans-serif' : '13px "Montserrat", sans-serif';
  ctx.fillStyle = isWinnerB ? '#ffffff' : '#d4d4d8';
  const nameB = match.fighter_b || 'A definir';
  ctx.fillText(nameB.length > 24 ? nameB.slice(0, 23) + '…' : nameB, x + 14, slotBY + 25);

  if (match.fighter_b_gym) {
    ctx.font = '10px monospace';
    ctx.fillStyle = '#71717a';
    ctx.fillText(match.fighter_b_gym, x + 14, slotBY + 42);
  }

  if (isWinnerB) {
    ctx.textAlign = 'right';
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('★ VENCEU', x + w - 12, slotBY + 26);
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
