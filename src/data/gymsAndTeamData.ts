import { Gym, Professor, KhanRank } from '../types/gymsAndTeam';

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

export function getKhanRank(level: number): KhanRank {
  return KHAN_RANKS_DATA[level] || {
    level,
    title: 'Graduado',
    colorName: 'Graduação Pride',
    primaryColor: '#dc2626',
    description: 'Graduação marcial Pride Muay Thai',
  };
}

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
    roleTitle: 'Professor de Muay Thai • Braço Direito da Pride',
    khan: 11,
    bio: 'Na Pride desde 2018 com o Mestre Renan Hulkinho, árbitro certificado, professor e braço direito da equipe, construindo sua história com dedicação, lealdade e amor ao esporte.',
    storyTitle: 'Paulo Roberto | Professor de Muay Thai & Braço Direito da Pride',
    storyParagraphs: [
      'Meu nome é Paulo, e minha história com o Muay-Thai começou em 2018, quando tive a oportunidade de conhecer essa arte marcial através do Mestre Renan Guedes, conhecido como “Hulkinho”.',
      'O que começou como uma experiência no esporte se tornou uma paixão, um propósito e um estilo de vida. Ao longo dessa trajetória, conquistei minha graduação, participei de campeonatos e, com muito esforço, dedicação e reconhecimento, realizei meu curso de arbitragem.',
      'Com o passar do tempo, assumi novas responsabilidades, atuando como instrutor e, posteriormente, conquistando meu espaço como professor de Muay-Thai. Minha história é construída com dedicação, lealdade e amor pelo esporte.',
      'Acredito que o Muay-Thai vai muito além das técnicas de luta: ele ensina respeito, humildade, disciplina e a perseverança de nunca desistir diante das dificuldades.',
      'Tenho muito orgulho da minha caminhada, respeito por aqueles que me ensinaram e gratidão pela equipe que caminha ao meu lado.',
      'Sigo hoje, carregando com muito orgulho a responsabilidade de fazer parte dessa grande família, sendo professor de Muay-Thai e braço direito da Equipe Pride Muay-Thai.',
    ],
    quote: 'O Muay-Thai vai muito além das técnicas de luta: ele ensina respeito, humildade, disciplina e a perseverança de nunca desistir diante das dificuldades.',
    highlightBadges: ['11º Khan • Vermelha Ponta Branca', 'Braço Direito da Pride', 'Na Equipe desde 2018', 'Árbitro Certificado', '4 Unidades no Vale'],
  },
  {
    id: 'simone-osses',
    name: 'Simone Osses',
    nickname: null,
    photoUrl: resolvePhotoUrl('simone-osses.jpeg'),
    gymIds: [
      'ct3-artes-marciais',
    ],
    roleTitle: 'Professora de Muay Thai • 11º Khan',
    khan: 11,
    bio: 'Referência no tatame, incentiva a superação diária, postura marcial consciente e a construção de autoconfiança para todas as idades.',
    storyTitle: 'Simone Osses | Professora de Muay Thai',
    storyParagraphs: [
      'A Professora Simone Osses é um dos grandes símbolos de força, dedicação e liderança marcial feminina dentro da Pride Muay Thai.',
      'Atuando no CT3 Artes Marciais, Simone inspira mulheres, homens e jovens a quebrarem barreiras e descobrirem uma autoconfiança inabalável através da prática do esporte.',
      'Seu trabalho enfatiza a precisão técnica, a resistência cardiorrespiratória e o desenvolvimento de uma mentalidade focada na vitória pessoal sobre medos e limites.',
      'No tatame da Professora Simone, o respeito é mútuo e a energia é contagiante, mostrando que o Muay Thai é um espaço acolhedor e transformador para qualquer pessoa disposta a evoluir.',
    ],
    quote: 'A sua única limitação real é aquela que você aceita na sua mente. No tatame, descobrimos que somos infinitamente mais fortes.',
    highlightBadges: ['11º Khan • Vermelha Ponta Branca', 'Liderança & Inspiração', 'Autoconfiança', 'CT3 Artes Marciais'],
  },
  {
    id: 'jean',
    name: 'Jean',
    nickname: null,
    photoUrl: resolvePhotoUrl('jean.jpeg'),
    gymIds: [],
    roleTitle: 'Professor de Muay Thai • 11º Khan',
    khan: 11,
    bio: 'Professor graduado 11º Khan (Vermelha Ponta Branca), dedicado à formação técnica, física e ao espírito de disciplina e lealdade da Pride Muay Thai.',
    storyTitle: 'Jean | Professor de Muay Thai',
    storyParagraphs: [
      'Graduado 11º Khan (Vermelha Ponta Branca) na Pride Muay Thai, o Professor Jean construiu sua jornada marcial fundamentada na disciplina inabalável, na técnica apurada e no respeito às tradições tailandesas.',
      'Sua atuação na equipe é marcada pelo incentivo constante aos alunos, auxiliando tanto quem busca condicionamento físico e defesa pessoal quanto aqueles que desejam aprofundar o conhecimento técnico do esporte.',
      'Para Jean, o tatame é uma escola para a vida, onde cada round ensina paciência, resiliência e a humildade necessária para nunca parar de aprender e evoluir.',
    ],
    quote: 'A disciplina forjada no tatame é a força que te mantém firme em qualquer desafio da vida.',
    highlightBadges: ['11º Khan • Vermelha Ponta Branca', 'Professor Pride', 'Tradição & Disciplina'],
    photoPosition: 'center 10%',
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
    roleTitle: 'Professor de Muay Thai • 10º Khan',
    khan: 10,
    bio: 'Especialista em biomecânica de combate, movimentação inteligente de ringue e preservação da tradição tailandesa em São José dos Campos.',
    storyTitle: 'Rafael (Lobinho) | Professor de Muay Thai',
    storyParagraphs: [
      'Conhecido carinhosamente como Lobinho, o Professor Rafael é especialista na dinâmica do combate inteligente e na leitura estratégica de luta.',
      'À frente das turmas na Calasans Camargo e no Yukon Dojo em São José dos Campos, sua didática foca na biomecânica dos golpes, na movimentação fluida de pernas e no ritmo característico do Muay Thai de alto rendimento.',
      'Para Rafael, o ringue e o tatame são extensões da mente: a inteligência tática, a calma sob pressão e o respeito aos companheiros de treino são os maiores legados que a arte marcial proporciona.',
      'Com atenção personalizada a cada praticante, Lobinho constrói um ambiente acolhedor e motivador, onde iniciantes descobrem seu potencial e atletas aprimoram sua eficiência marcial.',
    ],
    quote: 'A técnica supera a força bruta quando a mente permanece calma e atenta ao momento presente.',
    highlightBadges: ['10º Khan • Vermelha', 'Biomecânica & Estratégia', 'São José dos Campos', 'Calasans & Yukon'],
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
    roleTitle: 'Professor de Muay Thai • 10º Khan',
    khan: 10,
    bio: 'Dedicado ao acolhimento e evolução progressiva dos alunos, combinando condicionamento dinâmico e fundamentos sólidos das 8 armas.',
    storyTitle: 'Eduardo | Professor de Muay Thai',
    storyParagraphs: [
      'Com um compromisso permanente com a evolução de cada praticante, o Professor Eduardo conduz aulas dinâmicas na Arena Viking Parque Itamaraty e no CT3 Artes Marciais em Jacareí.',
      'Sua filosofia de ensino equilibra o condicionamento físico intenso com a construção cuidadosa da postura marcial, garantindo que os alunos aprendam com segurança, firmeza e entusiasmo.',
      'Eduardo acredita que o Muay Thai tem o poder de transformar a rotina, aliviar o estresse diário e construir amizades verdadeiras dentro do tatame.',
      'Seu trabalho destaca a importância da persistência: superar a si mesmo a cada round e transformar pequenas vitórias no treino em grandes conquistas pessoais fora dele.',
    ],
    quote: 'Cada treino concluído é mais um tijolo firme na construção da sua melhor versão.',
    photoPosition: 'center 0%',
    highlightBadges: ['10º Khan • Vermelha', 'Fundamentos Sólidos', 'Jacareí', 'Viking Itamaraty & CT3'],
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
    roleTitle: 'Professor de Muay Thai • 9º Khan',
    khan: 9,
    bio: 'Instrutor na Academia VG e Projeto VG com 12 anos de trajetória marcial, conciliando a essência do Muay Thai com valores de família, equilíbrio e perseverança.',
    storyTitle: 'Gustavo Arantes | Professor de Muay Thai',
    storyParagraphs: [
      'Minha história nas artes marciais começou aos 15 anos, quando tive meus primeiros contatos com o Wing Chun e o Boxe, sob orientação da professora Rosa, uma veterana e referência do boxe em nossa cidade.',
      'Aos 18 anos, iniciei minha trajetória no Kickboxing com o professor Juliano, ao lado de Renan, o Hulkinho, que naquela época era meu parceiro de treino e que, anos depois, se tornaria nosso mestre.',
      'Entre os 18 e 19 anos, também tive a oportunidade de vivenciar o Hapkido sob orientação do renomado Mestre Machuca, uma grande referência das artes marciais em nossa cidade. Embora tenha sido uma experiência breve, foi um período de muito aprendizado, que me proporcionou inclusive a oportunidade de participar de um campeonato amador de MMA, ampliando minha visão sobre o combate e as diferentes filosofias marciais.',
      'Em 2014, fizemos a transição para o Muay Thai. O que começou como uma atividade de lazer foi, aos poucos, se tornando parte essencial da minha vida. Em 2016, nasceu oficialmente nossa equipe, a Pride Muay Thai, sob a liderança do Mestre Renan Hulkinho, consolidando uma história construída com amizade, respeito, dedicação e perseverança.',
      'Hoje, aos 33 anos, carrego 12 anos de vivência no Muay Thai, conciliando os treinos com minhas responsabilidades como marido, pai e profissional. Essa jornada me ensinou que não é necessário abrir mão de uma vida familiar e profissional para viver a essência das artes marciais. Pelo contrário: o equilíbrio, a disciplina e a constância fazem parte do caminho.',
      'Acredito profundamente que o Muay Thai vai muito além de golpes, técnicas e condicionamento físico. É uma filosofia capaz de transformar pessoas, fortalecer o caráter e nos ensinar a enfrentar os desafios da vida com coragem, humildade e determinação.',
      'E acredito também que ensinar exige nunca deixar de aprender. Por isso, sempre que tenho a oportunidade, continuo treinando e aperfeiçoando meus conhecimentos com o Professor Paulo, uma grande referência dentro da nossa equipe. Busco estar em constante evolução, acompanhando o desenvolvimento técnico do Muay Thai para proporcionar aos meus alunos um ensino cada vez mais atualizado, completo e de qualidade.',
      'Como professor, meu propósito é compartilhar não apenas aquilo que aprendi dentro dos treinos, mas também os valores que as artes marciais me ensinaram ao longo dos anos.',
      'Porque, para mim, a verdadeira força não está apenas em saber lutar, mas em aprender a permanecer de pé diante das adversidades.',
      'Não importa a intensidade da tempestade. O importante é continuar firme, respeitando o processo e nunca abandonando o caminho.',
    ],
    quote: 'Porque, para mim, a verdadeira força não está apenas em saber lutar, mas em aprender a permanecer de pé diante das adversidades. Não importa a intensidade da tempestade. O importante é continuar firme, respeitando o processo e nunca abandonando o caminho.',
    experienceYears: 12,
    highlightBadges: ['9º Khan • Marrom Ponta Branca', '12 Anos de Muay Thai', '33 Anos de Idade', 'Pioneiro Pride desde 2016', 'Academia VG & Projeto VG'],
  },
  {
    id: 'rafael-japones',
    name: 'Rafael',
    nickname: 'Japonês',
    photoUrl: resolvePhotoUrl('rafael-japones.jpeg'),
    gymIds: [
      'studio-m',
    ],
    roleTitle: 'Professor de Muay Thai • 8º Khan',
    khan: 8,
    bio: 'Instrutor responsável pela unidade de Santa Branca, focado na marcialidade autêntica, precisão de golpes e respeito à linhagem do esporte.',
    storyTitle: 'Rafael (Japonês) | Professor de Muay Thai',
    storyParagraphs: [
      'À frente das aulas no Studio M em Santa Branca, o Professor Rafael Japonês é o embaixador dos valores da Pride Muay Thai no Alto Vale do Paraíba.',
      'Com um olhar apurado para os detalhes e uma paixão declarada pela arte das oito armas, Rafael transmite as técnicas tradicionais com disciplina rígida e camaradagem fraterna.',
      'Suas aulas desafiam os limites físicos dos alunos enquanto constroem uma base marcial sólida em defesa pessoal, velocidade de punhos e potência nos chutes.',
      'Para Rafael, preservar a identidade da Pride significa honrar cada treino como uma oportunidade de aprendizado e crescimento com os irmãos de equipe.',
    ],
    quote: 'Respeito aos mestres, lealdade à equipe e dedicação incansável em cada golpe desferido.',
    highlightBadges: ['8º Khan • Marrom', 'Pioneirismo em Santa Branca', 'Studio M', 'Técnica Tradicional'],
  },
  {
    id: 'augusto',
    name: 'Augusto',
    nickname: null,
    photoUrl: resolvePhotoUrl('augusto.jpeg'),
    gymIds: [],
    roleTitle: 'Instrutor de Muay Thai • 7º Khan',
    khan: 7,
    bio: 'Graduado 7º Khan (Azul Ponta Branca), entusiasta da essência do Muay Thai, focado no dinamismo dos treinos, condicionamento físico e acolhimento dos novos alunos.',
    storyTitle: 'Augusto | Instrutor de Muay Thai',
    storyParagraphs: [
      'Graduado 7º Khan (Azul Ponta Branca) pela Pride Muay Thai, o Instrutor Augusto representa a nova geração de dedicação marcial e energia da equipe.',
      'Com um trabalho focado na dinâmica dos treinos, na preparação corporal e na correta execução dos fundamentos básicos das oito armas, Augusto orienta novos praticantes com paciência e dedicação.',
      'Seu compromisso com o Muay Thai reflete a busca contínua por superação, motivando cada aluno a encontrar confiança na superação de seus próprios limites round a round.',
    ],
    quote: 'Cada passo respeitado na caminhada constrói a firmeza do verdadeiro praticante de Muay Thai.',
    highlightBadges: ['7º Khan • Azul Ponta Branca', 'Instrutor Pride', 'Fundamentos & Superação'],
    photoPosition: 'center 10%',
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
    roleTitle: 'Professor de Muay Thai • 7º Khan',
    khan: 7,
    bio: 'Entusiasta da energia marcial e do trabalho de clinch e manoplas, auxiliando os alunos a desenvolverem força física e mental constante.',
    storyTitle: 'Pedro | Professor de Muay Thai',
    storyParagraphs: [
      'Com energia contagiante e paixão vibrante pelo esporte, o Professor Pedro dedica-se à formação de novos talentos e ao desenvolvimento de praticantes na Arena Viking Parque Itamaraty e Unciclo.',
      'Especialista na intensidade das manoplas, na cadência de combinações e no estudo das posições de clinch, Pedro busca extrair a melhor performance física e mental de cada aluno.',
      'Para ele, o treino é um momento sagrado de renovação de energias, onde o esforço coletivo empurra cada praticante para além dos seus supostos limites.',
      'Sua metodologia incentiva a camaradagem, a escuta atenta aos princípios do Muay Thai e o cultivo de hábitos saudáveis que perduram para a vida inteira.',
    ],
    quote: 'A intensidade que você entrega ao tatame se transforma na energia que move a sua vida lá fora.',
    highlightBadges: ['7º Khan • Azul Ponta Branca', 'Energia & Dinâmica', 'Clinch & Manoplas', 'Viking Itamaraty & Unciclo'],
  },
  {
    id: 'renan-hulkinho',
    name: 'Renan',
    nickname: 'Hulkinho',
    photoUrl: resolvePhotoUrl('renan-hulkinho.jpeg'),
    gymIds: [],
    roleTitle: 'Líder & Fundador da Pride • 13º Khan',
    khan: 13,
    bio: 'Com 14 anos de vivência no Muay Thai, Renan encontrou na arte marcial um caminho de evolução contínua, amadurecimento e superação diária. Como líder da Pride, conduz a formação de instrutores e alunos em todo o Vale do Paraíba, inspirando através da honra, disciplina e amor ao esporte.',
    storyTitle: 'Renan (Hulkinho) | Líder & Fundador da Pride Muay Thai',
    storyParagraphs: [
      'Com mais de 14 anos dedicados de corpo e alma às artes marciais, Renan "Hulkinho" é o fundador e o coração da equipe Pride Muay Thai.',
      'Sua caminhada começou nos tatames de kickboxing ainda na juventude, compartilhando rounds e sonhos com grandes companheiros como o Professor Gustavo Arantes, sob a mentoria de experientes mestres da nossa região.',
      'Com a transição para o Muay Thai em 2014 e a fundação oficial da Pride em 2016, Renan abraçou a nobre missão de construir não apenas uma academia, mas uma verdadeira irmandade baseada na disciplina férrea, na humildade, no respeito e na superação pessoal.',
      'Ao longo de mais de uma década, Renan amadureceu com o esporte e viu o Muay Thai transformar sua vida e a vida de centenas de alunos por todo o Vale do Paraíba — em Jacareí, São José dos Campos e Santa Branca.',
      'Como líder da Pride, Renan supervisiona pessoalmente a formação contínua dos professores da equipe, assegurando que o padrão técnico mais rigoroso caminhe sempre lado a lado com os valores éticos que definem a verdadeira arte das oito armas.',
      'Sua liderança inspira pelo exemplo diário: estar presente, treinar junto, acolher o iniciante com respeito e exigir do graduado o mais alto nível de conduta dentro e fora do ringue.',
    ],
    quote: 'A Pride não é apenas uma equipe de luta. É uma família forjada no respeito, na honra e na superação diária de cada um dos nossos irmãos.',
    experienceYears: 14,
    photoPosition: 'center 5%',
    isLeader: true,
    highlightBadges: ['13º Khan • Preta Ponta Branca', 'Líder & Fundador da Pride', '14 Anos de Muay Thai', 'Coordenação Técnica Geral', 'Vale do Paraíba'],
  },
];

// Helper functions for DRY cross-referencing and WhatsApp generation
export function getProfessorById(id: string): Professor | undefined {
  return PROFESSORS_DATA.find((p) => p.id === id);
}

export function getAdjacentProfessors(currentId: string): { prev: Professor; next: Professor } | null {
  const index = PROFESSORS_DATA.findIndex((p) => p.id === currentId);
  if (index === -1) return null;
  const prevIndex = (index - 1 + PROFESSORS_DATA.length) % PROFESSORS_DATA.length;
  const nextIndex = (index + 1) % PROFESSORS_DATA.length;
  return {
    prev: PROFESSORS_DATA[prevIndex],
    next: PROFESSORS_DATA[nextIndex],
  };
}

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
