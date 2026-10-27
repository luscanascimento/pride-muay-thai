import { KhanRank, FullKhanLevel } from '../types/gymsAndTeam';

export const TOTAL_KHANS = 16;

export const isValidKhan = (level: number): boolean => {
  return Number.isInteger(level) && level >= 1 && level <= TOTAL_KHANS;
};

export const KHAN_RANKS_DATA: Record<number, KhanRank> = {
  13: {
    level: 13,
    title: 'Mestre / Kru Yai',
    colorName: 'Preta Ponta Branca',
    primaryColor: '#18181b',
    tipColor: '#ffffff',
    description: 'Nível máximo de liderança técnica e marcial. Fundador e formador de mestres e instrutores.',
  },
  12: {
    level: 12,
    title: 'Professor Docente / Mestre',
    colorName: 'Preta',
    primaryColor: '#18181b',
    description: 'Grau pleno de maestria e docência avançada no Muay Thai tradicional.',
  },
  11: {
    level: 11,
    title: 'Professor',
    colorName: 'Vermelha Ponta Branca',
    primaryColor: '#dc2626',
    tipColor: '#ffffff',
    description: 'Professor formado e habilitado para condução técnica de academias e graduação de praticantes.',
  },
  10: {
    level: 10,
    title: 'Instrutor Sênior',
    colorName: 'Vermelha',
    primaryColor: '#dc2626',
    description: 'Instrutor avançado com pleno domínio dos fundamentos, estratégias de combate e didática marcial.',
  },
  9: {
    level: 9,
    title: 'Instrutor',
    colorName: 'Marrom Ponta Branca',
    primaryColor: '#78350f',
    tipColor: '#ffffff',
    description: 'Instrutor em consolidação pedagógica e aperfeiçoamento constante da arte das oito armas.',
  },
  8: {
    level: 8,
    title: 'Instrutor / Monitor',
    colorName: 'Marrom',
    primaryColor: '#854d0e',
    description: 'Monitor e assistente técnico qualificado com sólida vivência prática nos tatames.',
  },
  7: {
    level: 7,
    title: 'Graduado / Instrutor',
    colorName: 'Azul Ponta Branca',
    primaryColor: '#2563eb',
    tipColor: '#ffffff',
    description: 'Graduado experiente, atuante no suporte e acompanhamento técnico de novos praticantes.',
  },
};

export const ALL_KHANS_SYSTEM: FullKhanLevel[] = [
  {
    level: 1,
    colorName: 'Branca',
    category: 'Aluno',
    title: 'Iniciante',
    primaryColor: '#f8fafc',
    description: 'Início da jornada marcial. Postura de combate, guarda, deslocamento básico e respeito ao tatame.',
  },
  {
    level: 2,
    colorName: 'Amarela',
    category: 'Aluno',
    title: 'Aluno I',
    primaryColor: '#eab308',
    description: 'Aprendizado dos golpes retos (Jab e Direto), chutes frontais (Teep) e esquivas básicas.',
  },
  {
    level: 3,
    colorName: 'Amarela Ponta Branca',
    category: 'Aluno',
    title: 'Aluno II',
    primaryColor: '#eab308',
    tipColor: '#ffffff',
    description: 'Combinações de punhos com chutes circulares, bloqueios com canela e trabalho em saco de pancadas.',
  },
  {
    level: 4,
    colorName: 'Verde',
    category: 'Aluno',
    title: 'Intermediário I',
    primaryColor: '#16a34a',
    description: 'Introdução aos golpes curvos (Cruzado e Gancho), primeiros cotovelos e postura básica de clinch.',
  },
  {
    level: 5,
    colorName: 'Verde Ponta Branca',
    category: 'Aluno',
    title: 'Intermediário II',
    primaryColor: '#16a34a',
    tipColor: '#ffffff',
    description: 'Joelhadas frontais e diagonais, quebra de pegada no clinch e condicionamento atlético intenso.',
  },
  {
    level: 6,
    colorName: 'Azul',
    category: 'Aluno',
    title: 'Avançado',
    primaryColor: '#2563eb',
    description: 'Domínio das 8 armas, leitura rápida do oponente, sparring controlado e defesa pessoal sólida.',
  },
  {
    level: 7,
    colorName: 'Azul Ponta Branca',
    category: 'Graduado & Instrutor',
    title: 'Graduado / Instrutor em Formação',
    primaryColor: '#2563eb',
    tipColor: '#ffffff',
    description: 'Início da formação pedagógica. Auxílio na orientação de novos alunos e liderança de tatame.',
    teamMembers: ['Augusto', 'Pedro', 'Marina', 'Rick Netto'],
  },
  {
    level: 8,
    colorName: 'Marrom',
    category: 'Graduado & Instrutor',
    title: 'Instrutor / Monitor',
    primaryColor: '#78350f',
    description: 'Precisão biomecânica, trabalho refinado de manoplas e acompanhamento de atletas.',
    teamMembers: ['Rafael Japonês', 'Gabriel Silva Soares', 'Milton (Corvo)'],
  },
  {
    level: 9,
    colorName: 'Marrom Ponta Branca',
    category: 'Graduado & Instrutor',
    title: 'Instrutor',
    primaryColor: '#78350f',
    tipColor: '#ffffff',
    description: 'Instrutor qualificado, domínio metodológico e aprofundamento das tradições do Muay Thai.',
    teamMembers: ['Gustavo Arantes'],
  },
  {
    level: 10,
    colorName: 'Vermelha',
    category: 'Graduado & Instrutor',
    title: 'Instrutor Sênior',
    primaryColor: '#dc2626',
    description: 'Maturidade marcial avançada, formação de competidores e excelência em didática técnica.',
    teamMembers: ['Eduardo (Du)', 'Rafael Lobinho'],
  },
  {
    level: 11,
    colorName: 'Vermelha Ponta Branca',
    category: 'Professor & Mestre',
    title: 'Professor',
    primaryColor: '#dc2626',
    tipColor: '#ffffff',
    description: 'Professor habilitado para reger academias oficiais, conduzir exames e formar novas gerações de praticantes.',
    teamMembers: ['Simone Osses', 'Paulo Roberto', 'Jean'],
  },
  {
    level: 12,
    colorName: 'Preta',
    category: 'Professor & Mestre',
    title: 'Professor Docente / Mestre',
    primaryColor: '#18181b',
    description: 'Grau pleno de maestria, docência avançada e guardião das linhagens e tradições da arte.',
  },
  {
    level: 13,
    colorName: 'Preta Ponta Branca',
    category: 'Professor & Mestre',
    title: 'Kru Yai / Mestre',
    primaryColor: '#18181b',
    tipColor: '#ffffff',
    description: 'Liderança máxima da equipe, coordenação técnica regional e autoridade moral e marcial.',
    teamMembers: ['Renan Hulkinho (Líder da Pride)'],
  },
  {
    level: 14,
    colorName: 'Prata',
    category: 'Mestre de Honra',
    title: 'Mestre Sênior',
    primaryColor: '#94a3b8',
    description: 'Conselheiro de honra com décadas de dedicação ininterrupta ao engrandecimento do Muay Thai.',
  },
  {
    level: 15,
    colorName: 'Ouro',
    category: 'Mestre de Honra',
    title: 'Grão-Mestre',
    primaryColor: '#eab308',
    description: 'Reconhecimento supremo conferido por federações internacionais por contribuição histórica à arte marcial.',
  },
  {
    level: 16,
    colorName: 'Ouro e Prata',
    category: 'Mestre de Honra',
    title: 'Grão-Mestre Supremo',
    primaryColor: '#eab308',
    tipColor: '#94a3b8',
    description: 'Grau honorário conferido aos maiores patriarcas e lendas vivas do Muay Thai no mundo.',
  },
];

export function getKhanRank(level: number): KhanRank {
  if (KHAN_RANKS_DATA[level]) return KHAN_RANKS_DATA[level];
  const found = ALL_KHANS_SYSTEM.find((k) => k.level === level);
  if (found) {
    return {
      level: found.level,
      title: found.title,
      colorName: found.colorName,
      primaryColor: found.primaryColor,
      tipColor: found.tipColor,
      description: found.description,
    };
  }
  return {
    level,
    title: 'Graduado',
    colorName: 'Graduação Pride',
    primaryColor: '#dc2626',
    description: 'Graduação marcial Pride Muay Thai',
  };
}
