import { Gym, Professor } from '../types/gymsAndTeam';

export const GYMS_DATA: Gym[] = [
  {
    id: 'vg',
    name: 'Academia VG',
    city: 'Jacareí',
    address: 'Rua Paulo Iazzetti, 65 — Vila Garcia, Jacareí - SP',
    cep: '12341-150',
    coordinates: { lat: -23.3638, lng: -46.0163 },
    phoneDisplay: '(12) 98806-1403',
    phoneRaw: '5512988061403',
    schedules: [
      { days: 'Segunda e quarta', hours: '19h e 21h' },
      { days: 'Sexta', hours: '20h' },
    ],
    notes: 'Unidade no bairro Vila Garcia com turmas às segundas, quartas e sextas.',
  },
  {
    id: 'projeto-vg',
    name: 'Projeto VG',
    alias: 'Projeto Vila Garcia',
    city: 'Jacareí',
    address: 'Rua Paulo Iazzetti, 31 — Vila Garcia, Jacareí - SP',
    cep: '12341-150',
    coordinates: { lat: -23.3634, lng: -46.0162 },
    phoneDisplay: '(12) 99719-8486',
    phoneRaw: '5512997198486',
    schedules: [
      { days: 'Sábado', hours: '7h e 8h30' },
    ],
    notes: 'Aulas de sábado com foco em expansão da modalidade e desenvolvimento comunitário.',
  },
  {
    id: 'calasans-camargo',
    name: 'Academia Calasans Camargo',
    city: 'São José dos Campos',
    address: 'Rua Estefânia do Nascimento, 29 — Jardim das Indústrias, São José dos Campos - SP',
    cep: '12240-470',
    coordinates: { lat: -23.2295895, lng: -45.9134591 },
    phoneDisplay: '(12) 99117-0787',
    phoneRaw: '5512991170787',
    schedules: [
      { days: 'Terça e quinta', hours: '7h, 18h e 20h' },
    ],
    notes: 'Grade de horários consolidada conforme confirmação da unidade.',
  },
  {
    id: 'arena-viking-itamaraty',
    name: 'Arena Viking Parque Itamaraty',
    city: 'Jacareí',
    address: 'Rua Carlos de Campos, 297 — Parque Itamaraty, Jacareí - SP',
    cep: '12307-380',
    coordinates: { lat: -23.2974496, lng: -45.9530053 },
    phoneDisplay: '(12) 99727-2501',
    phoneRaw: '5512997272501',
    schedules: [
      { days: 'Segunda e quarta', hours: '19h20' },
    ],
  },
  {
    id: 'ct3-artes-marciais',
    name: 'CT3 Artes Marciais',
    alias: 'CT03 Artes Marciais & Funcional',
    city: 'Jacareí',
    address: 'Rua Vicente Scherma, 34 — Centro, Jacareí - SP',
    cep: '12327-200',
    coordinates: { lat: -23.3040424, lng: -45.9721744 },
    phoneDisplay: '(12) 99161-9518',
    phoneRaw: '5512991619518',
    schedules: [
      { days: 'Segunda e quarta', hours: '7h' },
      { days: 'Terça, quinta e sexta', hours: '19h' },
    ],
    notes: 'Grade unificada correspondente ao contato da unidade (também referenciada como CT03).',
  },
  {
    id: 'studio-m',
    name: 'Studio M Santa Branca',
    city: 'Santa Branca',
    address: 'Rua Independência, 208 — Centro, Santa Branca - SP',
    cep: '12380-000',
    coordinates: { lat: -23.3973249, lng: -45.8881619 },
    phoneDisplay: '(12) 98176-7279',
    phoneRaw: '5512981767279',
    schedules: [
      { days: 'Terça e quinta', hours: '20h' },
    ],
  },
  {
    id: 'yukon-dojo',
    name: 'Yukon Dojo',
    city: 'São José dos Campos',
    address: 'Av. Linneu de Moura, 1685 — Condomínio Chácara dos Eucaliptos, São José dos Campos - SP',
    cep: '12244-380',
    coordinates: { lat: -23.1937421, lng: -45.9213587 },
    phoneDisplay: '(12) 98188-2524',
    phoneRaw: '5512981882524',
    schedules: [
      { days: 'Segunda e quarta', hours: '16h30' },
    ],
  },
  {
    id: 'arena-viking-santa-maria',
    name: 'Arena Viking Santa Maria',
    city: 'Jacareí',
    address: 'Av. Roberto Lopes Leal, 234 — Parque Brasil, Jacareí - SP',
    cep: '12328-400',
    coordinates: { lat: -23.287138, lng: -45.9612721 },
    phoneDisplay: '(12) 99616-9294',
    phoneRaw: '5512996169294',
    schedules: [
      { days: 'Segunda e quarta', hours: '10h e 19h15' },
      { days: 'Terça e quinta', hours: '21h30' },
    ],
  },
  {
    id: 'arena-viking-sao-joao',
    name: 'Arena Viking São João',
    city: 'Jacareí',
    address: 'Av. Pereira Campos, 222 — São João, Jacareí - SP',
    cep: '12320-670',
    coordinates: { lat: -23.3159489, lng: -45.982165 },
    phoneDisplay: '(12) 98188-8679',
    phoneRaw: '5512981888679',
    schedules: [
      { days: 'Segunda, quarta e sexta', hours: '18h' },
      { days: 'Terça e quinta', hours: '8h15 e 20h15' },
    ],
  },
  {
    id: 'arena-41-old-school',
    name: 'Arena 41 Old School (Trianon)',
    city: 'Jacareí',
    address: 'Av. Japão, 250 — Jardim Marister, Jacareí - SP',
    cep: '12321-820',
    coordinates: { lat: -23.3054589, lng: -45.9798231 },
    phoneDisplay: '(12) 99132-0006',
    phoneRaw: '5512991320006',
    schedules: [
      { days: 'Terça e quinta', hours: '17h30' },
    ],
  },
  {
    id: 'arena-muv',
    name: 'Arena MUV',
    city: 'Jacareí',
    address: 'Av. Lucas Nogueira Garcês, 260 — Jardim Esperança, Jacareí - SP',
    cep: '12324-000',
    coordinates: { lat: -23.3070266, lng: -46.0081449 },
    phoneDisplay: '(12) 98891-8011',
    phoneRaw: '5512988918011',
    schedules: [
      { days: 'Terça e quinta', hours: '7h e 19h' },
    ],
  },
  {
    id: 'unciclo',
    name: 'Unciclo',
    city: 'Vale do Paraíba',
    address: null,
    coordinates: null,
    phoneDisplay: null,
    phoneRaw: null,
    schedules: [],
    notes: 'Unidade vinculada ao professor Pedro. Horários e contatos em processo de confirmação.',
    isPending: true,
  },
];

const basePath = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) ? import.meta.env.BASE_URL : './';
const resolvePhotoUrl = (filename: string) => `${basePath}professores/${filename}`;

export const PROFESSORS_DATA: Professor[] = [
  {
    id: 'paulo-roberto',
    name: 'Paulo Roberto',
    nickname: null,
    photoUrl: resolvePhotoUrl('paulo-roberto.jpeg'),
    gymIds: [
      'arena-viking-sao-joao',
      'arena-viking-santa-maria',
      'arena-muv',
      'arena-41-old-school',
    ],
    roleTitle: 'Professor de Muay Thai',
    bio: 'Instrutor com ampla vivência em técnicas tradicionais, desenvolvimento atlético e formação de praticantes com rigor técnico e disciplina.',
  },
  {
    id: 'rafael-lobinho',
    name: 'Rafael',
    nickname: 'Lobinho',
    photoUrl: resolvePhotoUrl('rafael-lobinho.jpeg'),
    gymIds: [
      'calasans-camargo',
      'yukon-dojo',
    ],
    roleTitle: 'Professor de Muay Thai',
    bio: 'Especialista em biomecânica de combate, movimentação inteligente de ringue e preservação da tradição tailandesa em São José dos Campos.',
  },
  {
    id: 'eduardo',
    name: 'Eduardo',
    nickname: null,
    photoUrl: resolvePhotoUrl('eduardo.jpeg'),
    gymIds: [
      'arena-viking-itamaraty',
      'ct3-artes-marciais',
    ],
    roleTitle: 'Professor de Muay Thai',
    bio: 'Dedicado ao acolhimento e evolução progressiva dos alunos, combinando condicionamento dinâmico e fundamentos sólidos das 8 armas.',
    photoPosition: 'center 0%',
  },
  {
    id: 'simone-osses',
    name: 'Simone Osses',
    nickname: null,
    photoUrl: resolvePhotoUrl('simone-osses.jpeg'),
    gymIds: [
      'ct3-artes-marciais',
    ],
    roleTitle: 'Professora de Muay Thai',
    bio: 'Referência no tatame, incentiva a superação diária, postura marcial consciente e a construção de autoconfiança para todas as idades.',
  },
  {
    id: 'rafael-japones',
    name: 'Rafael',
    nickname: 'Japonês',
    photoUrl: resolvePhotoUrl('rafael-japones.jpeg'),
    gymIds: [
      'studio-m',
    ],
    roleTitle: 'Professor de Muay Thai',
    bio: 'Instrutor responsável pela unidade de Santa Branca, focado na marcialidade autêntica, precisão de golpes e respeito à linhagem do esporte.',
  },
  {
    id: 'pedro',
    name: 'Pedro',
    nickname: null,
    photoUrl: resolvePhotoUrl('pedro.jpeg'),
    gymIds: [
      'arena-viking-itamaraty',
      'unciclo',
    ],
    roleTitle: 'Professor de Muay Thai',
    bio: 'Entusiasta da energia marcial e do trabalho de clinch e manoplas, auxiliando os alunos a desenvolverem força física e mental constante.',
  },
  {
    id: 'gustavo-arantes',
    name: 'Gustavo Arantes',
    nickname: null,
    photoUrl: resolvePhotoUrl('gustavo-arantes.jpeg'),
    gymIds: [
      'vg',
      'projeto-vg',
    ],
    roleTitle: 'Professor de Muay Thai',
    bio: 'Instrutor na Academia VG e Projeto VG, dedicado à disseminação do Muay Thai e ao fortalecimento da equipe no Vale do Paraíba.',
  },
];

// Helper functions for DRY cross-referencing and WhatsApp generation
export function getGymsForProfessor(gymIds: string[]): Gym[] {
  return gymIds
    .map((id) => GYMS_DATA.find((gym) => gym.id === id))
    .filter((gym): gym is Gym => gym !== undefined);
}

export function getProfessorsForGym(gymId: string): Professor[] {
  return PROFESSORS_DATA.filter((prof) => prof.gymIds.includes(gymId));
}

export function getGymWhatsAppUrl(gym: Gym): string {
  if (!gym.phoneRaw) return '';
  const message = `Olá! Vim pelo site da Pride Muay Thai e gostaria de saber mais sobre as aulas de Muay Thai na ${gym.name}.`;
  return `https://wa.me/${gym.phoneRaw}?text=${encodeURIComponent(message)}`;
}

export function getGymExternalMapsUrl(gym: Gym): string {
  if (gym.coordinates) {
    return `https://www.google.com/maps/search/?api=1&query=${gym.coordinates.lat},${gym.coordinates.lng}`;
  }
  if (gym.address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${gym.name}, ${gym.address}`)}`;
  }
  return '';
}
