import { Gym, Professor, PersonalFighter, PricingPlan } from '../types/gymsAndTeam';
export type { KhanRank, FullKhanLevel } from '../types/gymsAndTeam';

export const GYMS_DATA: Gym[] = [
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
    id: 'calasans-camargo',
    name: 'Academia Calasans Camargo',
    city: 'São José dos Campos',
    address: 'Rua Estefânia do Nascimento, 29 — Jardim das Indústrias, São José dos Campos - SP',
    cep: '12240-470',
    coordinates: { lat: -23.2295895, lng: -45.9134591 },
    phoneDisplay: '(12) 99117-0787',
    phoneRaw: '5512991170787',
    schedules: [
      { days: 'Segunda e quarta', hours: '19h' },
      { days: 'Terça e quinta', hours: '7h, 18h e 20h' },
    ],
    notes: 'Grade de horários consolidada conforme confirmação da unidade.',
  },
  {
    id: 'arena-viking-itamaraty',
    name: 'Arena Viking Parque Itamaraty',
    alias: 'Arena Viking - Pq. Itamaraty',
    city: 'Jacareí',
    address: 'Rua Carlos de Campos, 297 — Parque Itamaraty, Jacareí - SP',
    cep: '12307-430',
    coordinates: { lat: -23.2974496, lng: -45.9530053 },
    phoneDisplay: '(12) 99727-2501',
    phoneRaw: '5512997272501',
    schedules: [
      { days: 'Segunda e quarta', hours: '8h30 e 19h20' },
      { days: 'Terça e quinta', hours: '14h30' },
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
    name: 'Academia Uniclo',
    alias: 'Uniclo',
    city: 'São José dos Campos',
    address: 'R. Manoel Joaquim de Oliveira, 372 — Monte Castelo, São José dos Campos - SP',
    cep: '12215-090',
    coordinates: { lat: -23.1857366, lng: -45.8740607 },
    phoneDisplay: '(12) 99686-7147',
    phoneRaw: '5512996867147',
    schedules: [
      { days: 'Segunda e quarta', hours: '19h30' },
    ],
    notes: 'Unidade no bairro Monte Castelo com turmas às segundas e quartas.',
  },
  {
    id: 'ct-fabrica-de-monstro',
    name: 'CT Fábrica de Monstro',
    alias: 'Fábrica de Monstros',
    city: 'Jacareí',
    address: 'Av. Edouard Six, 333 — Jardim Paraíba, Jacareí - SP',
    cep: '12327-673',
    coordinates: { lat: -23.29818, lng: -45.97322 },
    phoneDisplay: '(12) 98878-2112',
    phoneRaw: '5512988782112',
    schedules: [
      { days: 'Segunda e quarta', hours: '21h' },
    ],
    notes: 'Unidade no Jardim Paraíba com turmas de Muay Thai às segundas e quartas às 21h.',
  },
];

const basePath = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) ? import.meta.env.BASE_URL : './';
const resolvePhotoUrl = (filename: string) => `${basePath}professores/${filename}`;

export {
  KHAN_RANKS_DATA,
  ALL_KHANS_SYSTEM,
  getKhanRank,
  TOTAL_KHANS,
  isValidKhan,
} from '../constants/khans';

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
    phoneDisplay: '(12) 98192-5045',
    phoneRaw: '5512981925045',
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
    gymIds: [
      'calasans-camargo',
    ],
    roleTitle: 'Professor de Muay Thai • 11º Khan',
    khan: 11,
    bio: 'Instrutor 11º Khan na Calasans Camargo com uma trajetória de 10 anos no Muay Thai. Encontrou no tatame sua paixão e hoje, aos 51 anos, é prova viva de persistência, superação e dedicação à Família Pride.',
    storyTitle: 'Jean | Professor de Muay Thai • 11º Khan',
    storyParagraphs: [
      'Minha história com o esporte começou quando minha família se mudou para São José dos Campos. Preocupados com a minha saúde, meus pais me matricularam no judô, onde treinei por três anos e conquistei a faixa-azul. Aos 14 anos, encantado pelo som do berimbau em uma sala comercial do bairro, comecei na capoeira e permaneci até os 18 anos, quando as responsabilidades da vida adulta e o trabalho falaram mais alto.',
      'Aos 24 anos ingressei na empresa onde atuo até hoje. Entre a rotina de trabalho e faculdade, cheguei a praticar jiu-jitsu por um ano, mas lesões me fizeram migrar para a musculação. Ainda assim, a paixão pelas artes marciais de contato permanecia adormecida, sempre alimentada pela admiração pela eficiência do Muay Thai e por atletas lendários como o tailandês Buakaw.',
      'Com a rotina estabilizada, decidi iniciar no Muay Thai na Academia Calasans Camargo. Eu achava que tinha preparo por conta da musculação e corridas, mas na primeira aula mal passei da metade do aquecimento. Meu Mestre Renan até confessou na aula seguinte que não esperava que eu fosse voltar. Mas a teimosia e a disciplina falaram mais alto: persisti até vencer o cansaço e dominar o ritmo dos treinos.',
      'De 2016 a 2020 treinei sob a supervisão direta do Mestre Renan, superando graduações exigentes com seu incentivo constante. A relação de lealdade se consolidou quando recebi a missão de conduzir as aulas após o Renan sofrer um acidente — período que coincidiu com a pandemia, nos levando a treinar ao ar livre para não deixar a chama do esporte apagar.',
      'Hoje, com 51 anos e prestes a completar 10 anos dedicados ao Muay Thai, sou graduado no 11º Khan. Sigo conduzindo as turmas na Academia Calasans Camargo enquanto nosso mestre cuida da saúde, vivendo o esporte como filosofia para a mente e o corpo dentro dessa grande irmandade que é a Família Pride Muay Thai.',
    ],
    quote: 'A disciplina e a insistência superam qualquer cansaço. No tatame da Pride, aprendi que nunca é tarde para começar e que a evolução física e mental não tem limites de idade.',
    highlightBadges: ['11º Khan • Vermelha Ponta Branca', 'Academia Calasans Camargo', 'São José dos Campos', 'Técnica & Disciplina', 'Evolução Contínua'],
    photoPosition: 'center 45%',
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
    roleTitle: 'Instrutor de Muay Thai • 10º Khan',
    khan: 10,
    phoneDisplay: '(12) 98208-6665',
    phoneRaw: '5512982086665',
    bio: 'Iniciou no Muay Thai aos 13 anos e fez da modalidade sua filosofia de vida. Graduado 10º Khan, atua em São José dos Campos ensinando que a calma sob pressão e a resiliência no tatame transformam a maneira como enfrentamos os desafios fora do ringue.',
    storyTitle: 'Rafael (Lobinho) | Instrutor de Muay Thai',
    storyParagraphs: [
      'Minha trajetória no Muay Thai começou aos 13 anos. Antes mesmo de conhecer a modalidade, eu já buscava mudar meu condicionamento físico e comecei a emagrecer treinando em casa. Depois, surgiu a vontade de desenvolver mais força, e foi assim que conheci o Muay Thai.',
      'Quanto mais eu treinava, mais percebia o quanto a modalidade era desafiadora. Minha primeira luta terminou em derrota, mas isso não me desmotivou. Pelo contrário, só aumentou minha vontade de treinar, aprender e evoluir.',
      'Ainda criança, tive a oportunidade de ajudar meu mestre nos preparativos para suas lutas e, em algumas ocasiões, conduzir treinos e aulas. Essas experiências fizeram parte da minha formação muito antes de eu me tornar instrutor oficialmente.',
      'Durante a pandemia, precisei interromper minha caminhada por um período. Quando retornei, continuei treinando e auxiliando outro professor, assumindo as aulas quando necessário. Em 2026, surgiu a oportunidade de me tornar instrutor oficialmente, dando um novo passo em uma trajetória que começou ainda na infância. Atualmente, sou graduado no 10º Khan.',
      'Ao longo desses anos, o Muay Thai também se tornou uma filosofia pessoal. Desde criança, aprendi a enfrentar situações difíceis sem deixar que o medo, a dor ou o cansaço determinassem minhas decisões. Desenvolvi a convicção de que somos capazes de superar muito mais do que imaginamos quando não desistimos diante das dificuldades.',
      'Acredito que, se você consegue manter a calma diante de alguém que está tentando te nocautear, também pode aprender a manter a cabeça no lugar diante dos desafios da vida. Afinal, o Muay Thai vai muito além da luta: ensina a lidar com a pressão, controlar as próprias reações e continuar avançando mesmo quando as coisas ficam difíceis.',
      'Hoje, como instrutor, procuro compartilhar com meus alunos os conhecimentos e as experiências que construí ao longo dessa trajetória, mostrando que o Muay Thai não se resume a aprender a lutar, mas também pode transformar a maneira como enfrentamos os desafios fora do ringue.',
    ],
    quote: 'Se você consegue manter a calma diante de alguém que está tentando te nocautear, também pode aprender a manter a cabeça no lugar diante dos desafios da vida. O Muay Thai ensina a lidar com a pressão, controlar as próprias reações e continuar avançando mesmo quando as coisas ficam difíceis.',
    highlightBadges: ['10º Khan • Vermelha', 'Trajetória desde os 13 Anos', 'Calma sob Pressão', 'São José dos Campos', 'Calasans & Yukon'],
  },
  {
    id: 'eduardo',
    name: 'Eduardo',
    nickname: 'Du',
    photoUrl: resolvePhotoUrl('eduardo.jpeg'),
    gymIds: [
      'arena-viking-itamaraty',
      'ct3-artes-marciais',
    ],
    roleTitle: 'Professor de Muay Thai • 10º Khan',
    khan: 10,
    phoneDisplay: '(12) 99115-1494',
    phoneRaw: '5512991151494',
    bio: 'Dedicado ao acolhimento e evolução progressiva dos alunos, combinando condicionamento dinâmico e fundamentos sólidos das 8 armas.',
    storyTitle: 'Eduardo (Du) | Professor de Muay Thai',
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
    roleTitle: 'Instrutor de Muay Thai • 8º Khan',
    khan: 8,
    bio: 'Praticante de esportes desde a infância e na Pride desde 2021, alcançou o 8º Khan em 2026. Transmite aos alunos técnica, respeito mútuo, resiliência e reciprocidade para que se formem pessoas de bem.',
    storyTitle: 'Rafael (Japonês) | Instrutor de Muay Thai',
    storyParagraphs: [
      'Desde pequeno fiz esporte como futebol, futsal, vôlei, basquete, tênis de mesa, skate, patins, bicicross e muitos outros. Durante a minha vida sempre fiz alguma modalidade de luta como lazer e saúde, sem compromisso.',
      'Dos meus 14 para 15 anos, comecei o Muay Thai, pratiquei por quase um ano e parei por conta da distância, eu morava em Jacareí e treinava em SJC, e o meu transporte era a bike. Além disto, eu estava mais focado no bicicross, o qual praticava competição.',
      'Alguns anos depois voltei a prática do Muay Thai, mas parei novamente, tendo uma nova tentativa em 2019 e veio a pandemia de 2020, a qual me obrigou a interromper.',
      'Com o retorno das aula em 2021 eu conheci a Pride Muay Thai e desde então não parei. Hoje, em 2026, alcançei o meu 8 Khan e, pela primeira vez, faço parte do quadro de instrutores da Pride Muay Thai.',
      'Aqui eu levo o aprendizado de cada treino e tento transmiti-los para cada aluno, não somente as técnicas e golpes, mas também o respeito mútuo, resiliência e reciprocidade. Isto para que se formem pessoas de bem.',
    ],
    quote: 'Aqui eu levo o aprendizado de cada treino e tento transmiti-los para cada aluno, não somente as técnicas e golpes, mas também o respeito mútuo, resiliência e reciprocidade. Isto para que se formem pessoas de bem.',
    highlightBadges: ['8º Khan • Marrom', 'Instrutor Pride 2026', 'Studio M Santa Branca', 'Respeito, Resiliência & Reciprocidade'],
  },
  {
    id: 'gabriel-silva',
    name: 'Gabriel Silva Soares',
    nickname: null,
    photoUrl: resolvePhotoUrl('gabriel-silva.jpeg'),
    gymIds: [
      'calasans-camargo',
    ],
    roleTitle: 'Instrutor de Muay Thai • 8º Khan',
    khan: 8,
    bio: 'Iniciou no Muay Thai aos 15 anos e encontrou na disciplina marcial a força para superar qualquer obstáculo. Graduado 8º Khan, atua na Academia Calasans Camargo formando bons atletas e boas pessoas para a vida.',
    storyTitle: 'Gabriel Silva Soares | Instrutor de Muay Thai',
    storyParagraphs: [
      'Sempre fui muito ativo desde pequeno e sempre gostei de luta. Minha primeira arte marcial foi o jiu-jitsu, depois passei pelo judô e, aos 15 anos, comecei no Muay Thai. Gostei de treinar e fui me envolvendo cada vez mais com a modalidade, que acabou se tornando uma parte importante da minha vida.',
      'Uma das coisas que mais aprendi com o Muay Thai foi a disciplina. Tem dia em que a gente está cansado, com a cabeça cheia ou simplesmente sem vontade de treinar. É nesses dias que a gente aprende a não depender só da vontade para fazer aquilo com que se comprometeu. Isso é algo que levo para a minha vida pessoal também. Nem sempre vou estar animado ou as coisas vão acontecer como eu espero, mas preciso continuar fazendo a minha parte e aprender a lidar com as dificuldades.',
      'Muitas vezes, fui treinar abalado por algum problema pessoal, e o Renan percebia no meu olhar que eu não estava bem. No final dos treinos, ele sempre dirigia algumas palavras à turma sobre superar as dificuldades, não desistir e continuar tentando. Em vários desses dias, aquilo era justamente o que eu precisava ouvir. Essas palavras ficaram comigo e me ajudaram em situações que ele talvez nem soubesse que eu estava passando. O que aprendi com ele ajudou a formar quem eu sou hoje, tanto no tatame quanto na vida.',
      'Hoje, como instrutor, quero passar isso adiante. Faz parte do meu trabalho ajudar os alunos a melhorar a técnica e se tornarem bons atletas, mas também quero que levem os valores da arte marcial para fora do treino. O respeito pelas pessoas, a disciplina para cumprir seus compromissos e a disposição para enfrentar os obstáculos são coisas que servem para a vida inteira. Para mim, ensinar Muay Thai também é contribuir para a formação de boas pessoas. Sei a diferença que o Muay Thai fez na minha vida e quero levar esse cuidado para a forma como ensino meus alunos.',
    ],
    quote: 'Para mim, ensinar Muay Thai também é contribuir para a formação de boas pessoas. Sei a diferença que o Muay Thai fez na minha vida e quero levar esse cuidado para a forma como ensino meus alunos.',
    highlightBadges: ['8º Khan • Marrom', 'Academia Calasans Camargo', 'Segunda e quarta 19h', 'Disciplina & Valores', 'São José dos Campos'],
  },
  {
    id: 'milton-corvo',
    name: 'Milton',
    nickname: 'Corvo',
    photoUrl: resolvePhotoUrl('milton-corvo.jpeg'),
    gymIds: [],
    roleTitle: 'Instrutor de Muay Thai • 8º Khan',
    khan: 8,
    bio: 'Iniciou no Muay Thai em 2007, graduou-se com mestres de renome e integra a Pride desde 2015. Instrutor 8º Khan, ministra aulas pela equipe desde 2019 com o propósito de transformar vidas, formar caráter e transmitir a verdadeira essência da arte marcial.',
    storyTitle: 'Milton (Corvo) | Instrutor de Muay Thai • 8º Khan',
    storyParagraphs: [
      'Minha história no Muay Thai começou de um jeito diferente em 2007 fazendo musculação em uma academia perto de casa. Enquanto treinava, escutei um barulho forte vindo do piso superior e isso me chamou atenção. Quando subi para ver o que era, tinha um cara segurando um aparador de chute e outro chutando. Fiquei impressionado porque quem chutava era bem magro, mas o chute forte e encaixado que fazia aquele barulho.',
      'Então comecei a treinar sem muito compromisso, mas confesso que não sobrevivi aos 20min de aquecimento achando que por fazer musculação iria ser fácil. Aos poucos fui pegando gosto e deixando a musculação de lado. E quando achei que estava bom, aos 6 meses de treino tomei meu primeiro knockdown — aí sim eu me apaixonei pelo esporte.',
      'Tudo isso na mesma academia perto de casa. Claro que não posso deixar de falar que passamos por momentos difíceis, nem sempre tínhamos tatame, muitas vezes os treinos eram no piso mesmo, mas o amor pelo esporte sempre falava mais alto. Não tínhamos professores que podiam nos graduar naquela época; quem puxava os treinos eram os lutadores Gilmar China da Chute Boxe/Combate Esporte em São Paulo (que em seu auge enfrentou a lenda viva Buakaw Banchamek, a "Lótus Branca") e o Jorge Chagas, meu primeiro mestre, que veio realizar a nossa 1ª graduação em 2010.',
      'Continuei treinando nas academias por onde eu passava devido ao meu trabalho, mas nunca parei de treinar. Como meu antigo mestre falava: desistir não é uma opção.',
      'Conheci a equipe atual que estou hoje em outubro de 2015, que me chamou atenção pela raiz do verdadeiro Muay Thai que se conhece. Ainda não tinha esse nome forte que é hoje, mas era só o começo de mais uma jornada sólida e respeitosa com o meu novo mestre. Tenho apenas 3 lutas e 1 derrota como atleta, comecei a dar aulas em 2019 pela Pride e estou até hoje com a equipe que chamamos de família, porque estamos juntos até fora do tatame. E ensinar aquilo que aprendi lá atrás, pra mim, é transformar pessoas, formar caráter, criar disciplina e também salvar vidas, porque é isso que a família Pride Muay Thai faz: tornar seres humanos melhores.',
    ],
    quote: 'Ensinar aquilo que aprendi lá atrás, pra mim, é transformar pessoas, formar caráter, criar disciplina e também salvar vidas, porque é isso que a família Pride Muay Thai faz: tornar seres humanos melhores.',
    highlightBadges: ['8º Khan • Marrom', 'Trajetória desde 2007', 'Na Pride desde 2015', 'Leciona desde 2019', 'Transformando Vidas'],
    photoPosition: 'center 25%',
  },
  {
    id: 'augusto',
    name: 'Augusto',
    nickname: null,
    photoUrl: resolvePhotoUrl('augusto.jpeg'),
    gymIds: [
      'ct-fabrica-de-monstro',
    ],
    roleTitle: 'Instrutor de Muay Thai • 7º Khan',
    khan: 7,
    bio: 'Em setembro de 2022, Augusto decidiu mudar, venceu a insegurança e iniciou no Muay Thai. Com dedicação e evolução constante, tornou-se instrutor na Fábrica de Monstros em Jacareí, inspirando pessoas a superarem seus limites.',
    storyTitle: 'Augusto | Instrutor de Muay Thai',
    storyParagraphs: [
      'Em setembro de 2022, Augusto decidiu mudar. Apaixonado por lutas, venceu a insegurança e começou a treinar Muay Thai, deixando o sedentarismo para trás e cuidando melhor da saúde física e mental. O incentivo veio do irmão, professor da modalidade, que o levou ao tatame pela primeira vez.',
      'O que começou como uma busca por saúde logo se transformou em paixão. Com dedicação, treinos intensos e evolução constante, Augusto conquistou graduações e desenvolveu disciplina, confiança, equilíbrio e bem-estar.',
      'Com o tempo, tornou-se instrutor na Fábrica de Monstros, em Jacareí, onde compartilha seus conhecimentos e o amor pela arte marcial.',
      'Sua trajetória mostra como o esporte pode transformar vidas. Hoje, Augusto inspira outras pessoas a superarem seus limites por meio do Muay Thai.',
      'Muito além da luta, uma jornada de transformação, disciplina e superação!',
      'Sawadee krap! 🙏🥊✨',
    ],
    quote: 'Muito além da luta, uma jornada de transformação, disciplina e superação! Sawadee krap! 🙏🥊✨',
    highlightBadges: ['7º Khan • Azul Ponta Branca', 'Fábrica de Monstros', 'Jacareí', 'Superação & Saúde', 'Sawadee Krap'],
    photoPosition: 'center 10%',
  },
  {
    id: 'marina',
    name: 'Marina',
    nickname: null,
    photoUrl: resolvePhotoUrl('marina.jpeg'),
    gymIds: [
      'studio-m',
    ],
    roleTitle: 'Instrutora de Muay Thai • 7º Khan',
    khan: 7,
    bio: 'Graduada 7º Khan na Pride Muay Thai em Santa Branca, encontrou no esporte autoconfiança, superação e ferramentas de defesa pessoal feminina, auxiliando no aprendizado e desenvolvimento da equipe.',
    storyTitle: 'Marina | Graduada 7º Khan & Instrutora Pride',
    storyParagraphs: [
      'Minha história com o Muay Thai começou em 2016, aos 16 anos, quando aceitei o convite de uma amiga para conhecer a modalidade. O que começou como uma experiência acabou despertando em mim uma paixão pelo esporte que, mesmo após uma pausa, continuaria fazendo parte da minha vida.',
      'Depois de aproximadamente um ano e meio de treino, precisei interromper minha caminhada por conta dos estudos. Em 2023, após me mudar de São Paulo para Santa Branca, encontrei a Pride Muay Thai e não pensei duas vezes antes de procurar a academia para voltar a treinar. Foi assim que retomei uma parte importante da minha história, permanecendo na equipe até hoje.',
      'Ao longo dessa trajetória, o Muay Thai me mostrou que sou muito mais forte e capaz do que imaginava. A modalidade transformou a maneira como me enxergo, ampliou minha confiança e me ensinou a reconhecer minha própria força, dentro e fora do tatame. Seus ensinamentos ultrapassam os limites do treino e estão presentes na forma como enfrento os desafios e conduzo meu dia a dia.',
      'Além da transformação pessoal, encontrar no Muay Thai ferramentas de defesa e autoconfiança também tem um significado especial para mim, principalmente diante da realidade da violência contra a mulher. Saber que estou desenvolvendo habilidades que contribuem para minha segurança me faz sentir mais preparada para enfrentar o mundo de hoje, além de ter a oportunidade de repassar meus aprendizados para outras mulheres.',
      'As competições e as graduações são, sem dúvida, alguns dos momentos mais marcantes dessa caminhada. Cada uma delas representa uma conquista diferente, resultado de dedicação, aprendizado e superação, e me lembra de quanto já evoluí e de tudo o que ainda posso alcançar. Atualmente, sou graduada no 7º Khan e sigo em constante desenvolvimento, buscando evoluir a cada treino.',
      'Hoje, além de me dedicar à minha própria evolução, também auxilio nos treinos da equipe, compartilhando experiências e contribuindo com o aprendizado de outros alunos. Para mim, o Muay Thai vai muito além de uma modalidade esportiva: é uma ferramenta de transformação que me ensinou a acreditar mais em mim mesma, reconhecer minha força e levar para a vida os valores que aprendo no tatame.',
    ],
    quote: 'Para mim, o Muay Thai vai muito além de uma modalidade esportiva: é uma ferramenta de transformação que me ensinou a acreditar mais em mim mesma, reconhecer minha força e levar para a vida os valores que aprendo no tatame.',
    highlightBadges: ['7º Khan • Azul Ponta Branca', 'Santa Branca', 'Defesa & Autoconfiança Feminina', 'Superação & Dedicação'],
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
      'Com energia contagiante e paixão vibrante pelo esporte, o Professor Pedro dedica-se à formação de novos talentos e ao desenvolvimento de praticantes na Arena Viking Parque Itamaraty e na Academia Uniclo.',
      'Especialista na intensidade das manoplas, na cadência de combinações e no estudo das posições de clinch, Pedro busca extrair a melhor performance física e mental de cada aluno.',
      'Para ele, o treino é um momento sagrado de renovação de energias, onde o esforço coletivo empurra cada praticante para além dos seus supostos limites.',
      'Sua metodologia incentiva a camaradagem, a escuta atenta aos princípios do Muay Thai e o cultivo de hábitos saudáveis que perduram para a vida inteira.',
    ],
    quote: 'A intensidade que você entrega ao tatame se transforma na energia que move a sua vida lá fora.',
    highlightBadges: ['7º Khan • Azul Ponta Branca', 'Energia & Dinâmica', 'Clinch & Manoplas', 'Viking Itamaraty & Academia Uniclo'],
  },
  {
    id: 'rick-netto',
    name: 'Rick Netto',
    nickname: null,
    photoUrl: resolvePhotoUrl('rick-netto.jpeg'),
    gymIds: [],
    roleTitle: 'Instrutor de Muay Thai • 7º Khan',
    khan: 7,
    phoneDisplay: '(12) 99183-1028',
    phoneRaw: '5512991831028',
    bio: 'Graduado no 7º Khan (Azul e Branco), atua como instrutor em Jacareí com foco em inteligência tática, técnica apurada, disciplina e desenvolvimento de uma mentalidade forte.',
    storyTitle: 'Rick | Instrutor de Muay Thai • 7º Khan',
    storyParagraphs: [
      'Meu nome é Ricardo Faria dos Santos Neto, tenho 27 anos, sou de Jacareí, interior de São Paulo, mas no Muay Thai a maioria me conhece como Rick.',
      'Sempre gostei muito de artes marciais. Antes de conhecer o Muay Thai, cheguei a praticar Judô e Taekwondo, mas foi depois de assistir ao filme Ong-Bak: Guerreiro Sagrado, com Tony Jaa, que fiquei realmente interessado em conhecer a luta tailandesa.',
      'Comecei a treinar Muay Thai por volta de 2016/2017. Infelizmente, por conta do trabalho, precisei ficar um tempo afastado dos treinos, mas em 2021 consegui voltar. Desde então, venho me dedicando cada vez mais ao esporte, buscando evoluir tanto na parte técnica quanto no conhecimento sobre a modalidade.',
      'Durante essa caminhada, tive a oportunidade de aprender com grandes professores, como Renan Hulkinho, Erasmo Gibi e Paulão. Cada um teve sua importância na minha evolução e sou muito grato por tudo que aprendi e continuo aprendendo com eles.',
      'Hoje sou graduado no 7º Khan, azul e branco, e estou começando uma nova fase dentro do Muay Thai, agora também como instrutor. É uma responsabilidade muito grande, principalmente por saber que ainda tenho muita coisa para aprender, mas é algo que sempre tive vontade de fazer.',
      'Também tive algumas experiências em competições internas da equipe. Foram três participações, com uma vitória e duas derrotas. Independentemente dos resultados, todas foram importantes para mim. Competir é uma experiência completamente diferente de treinar, e cada vez que subi no ringue consegui tirar algum aprendizado, principalmente sobre o que precisava melhorar.',
      'MINHA FORMAÇÃO',
      'Uma coisa que sempre gostei de fazer é buscar conhecimento. Não quero ficar limitado apenas ao que aprendo durante os treinos. Gosto de entender o Muay Thai de uma forma mais completa, desde a parte técnica e tática até as regras, a arbitragem e tudo que envolve a modalidade.',
      'Por isso, procurei participar de cursos, congressos e workshops que pudessem acrescentar algo à minha formação.',
      'Tenho dois cursos de arbitragem, sendo um pela Confederação Brasileira de Muay Thai / Boxe Tailandês (CBMT/BT) e outro pela KAMMAKAM BRASIL.',
      'Também participei de duas edições do Congresso Nacional de Muay Thai, organizadas pela CBMT/BT, onde tive a oportunidade de acompanhar palestras e ensinamentos de nomes como Rangel Farias, Munil Adriano, Edvor Dias, Felipe Cazolari, Hugo Henrique e Pedro Rodrigues, entre outros profissionais da modalidade.',
      'Além disso, participei de workshops com Wilson Djavan e Léo Elias, que também contribuíram bastante para ampliar meus conhecimentos.',
      'E pretendo continuar assim. Sempre que tenho oportunidade, procuro aprender algo novo, conhecer outras formas de trabalhar e ouvir pessoas que possuem mais experiência.',
      'Acredito que, dentro do Muay Thai, ninguém sabe tudo. Sempre existe alguma coisa para aprender, independentemente da graduação ou do tempo de treino. E agora, começando a dar aulas, vejo isso como uma responsabilidade ainda maior, porque antes de ensinar alguém, preciso estar sempre disposto a aprender também.',
      'O QUE O MUAY THAI REPRESENTA PARA MIM',
      'Hoje posso dizer que o Muay Thai é uma das coisas mais importantes da minha vida.',
      'O que começou como uma curiosidade por causa de um filme acabou se tornando algo que faz parte de quem eu sou. É onde gosto de estar, onde me sinto bem e onde quero construir meu futuro profissional.',
      'Meu objetivo é continuar evoluindo, me especializar cada vez mais e, futuramente, poder viver do Muay Thai, fazendo aquilo de que realmente gosto.',
      'Como instrutor, quero passar para meus alunos muito mais do que socos, chutes, joelhadas e cotoveladas. Quero ensinar a pensar durante uma luta, ter inteligência tática, confiança, disciplina e, principalmente, desenvolver uma mentalidade forte.',
      'Uma das coisas que mais gosto no Muay Thai é justamente o quanto ele trabalha a nossa cabeça.',
      'Muitas vezes você chega para treinar depois de um dia cansativo, cheio de problemas e preocupações, mas, quando começa o treino, parece que tudo aquilo fica do lado de fora. Naquele momento, sua atenção está ali, tentando acertar um movimento, melhorar uma técnica ou aprender alguma coisa nova.',
      'E é isso que faz a gente gostar cada vez mais. Você aprende um golpe, depois quer aperfeiçoar. Aprende uma combinação, depois quer executar melhor. E quando percebe, já está completamente envolvido com o esporte e querendo evoluir a cada treino.',
      'Acredito muito no poder que o Muay Thai tem de transformar a vida das pessoas.',
      'Tem gente que começa a treinar para emagrecer, melhorar o condicionamento físico ou simplesmente sair do sedentarismo. Outros procuram mais confiança, uma forma de aliviar o estresse ou aprender a se defender. E também existem aqueles que sonham em competir e se tornar atletas.',
      'Cada pessoa chega com um objetivo diferente, e acho que uma das coisas mais importantes como instrutor é saber respeitar isso.',
      'Quero poder ajudar cada aluno a evoluir dentro daquilo que ele busca, seja alguém que nunca colocou uma luva na vida ou alguém que pretende entrar no ringue para competir.',
      'Sei que estou apenas começando minha caminhada como instrutor e que ainda tenho muito para aprender e conquistar. Mas tenho muita vontade de crescer dentro do Muay Thai, continuar estudando, adquirir experiência e, principalmente, compartilhar tudo aquilo que venho aprendendo.',
      'Também faço questão de valorizar os professores que fizeram e fazem parte da minha formação, porque sei que ninguém chega a lugar nenhum sozinho.',
      'Para mim, o Muay Thai é muito mais do que uma luta. É um esporte que ensina, desafia, fortalece e faz a gente querer ser melhor a cada dia.',
      'E é exatamente isso que quero levar para meus alunos.',
      'RICARDO FARIA DOS SANTOS NETO — RICK\nInstrutor de Muay Thai | 7º Khan — Azul e Branco',
    ],
    quote: 'Para mim, o Muay Thai é muito mais do que uma luta. É um esporte que ensina, desafia, fortalece e faz a gente querer ser melhor a cada dia. E é exatamente isso que quero levar para meus alunos.',
    highlightBadges: ['7º Khan • Azul e Branco', 'Instrutor Pride', 'Jacareí – SP', 'Cursos CBMT/BT & KAMMAKAM', 'Inteligência Tática & Mentalidade'],
    photoPosition: 'center 15%',
  },
  {
    id: 'renan-hulkinho',
    name: 'Renan',
    nickname: 'Hulkinho',
    photoUrl: resolvePhotoUrl('renan-hulkinho.jpeg'),
    gymIds: [
      'calasans-camargo',
    ],
    roleTitle: 'Líder & Fundador da Pride • 13º Khan',
    khan: 13,
    phoneDisplay: '(12) 99174-6964',
    phoneRaw: '5512991746964',
    scheduleNote: 'Não ministra aulas aos sábados (Segunda a Sexta)',
    bio: 'Com 14 anos de vivência no Muay Thai, Renan encontrou na arte marcial um caminho de evolução contínua, amadurecimento e superação diária. Como líder da Pride e professor na Academia Calasans Camargo, conduz a formação técnica e moral de instrutores e alunos em todo o Vale do Paraíba.',
    storyTitle: 'Renan (Hulkinho) | Líder & Fundador da Pride Muay Thai',
    storyParagraphs: [
      'Com mais de 14 anos dedicados de corpo e alma às artes marciais, Renan "Hulkinho" é o fundador e o coração da equipe Pride Muay Thai.',
      'Sua caminhada começou nos tatames de kickboxing ainda na juventude, compartilhando rounds e sonhos com grandes companheiros como o Professor Gustavo Arantes, sob a mentoria de experientes mestres da nossa região.',
      'Com a transição para o Muay Thai em 2014 e a fundação oficial da Pride em 2016, Renan abraçou a nobre missão de construir não apenas uma academia, mas uma verdadeira irmandade baseada na disciplina férrea, na humildade, no respeito e na superação pessoal.',
      'Ao longo de mais de uma década, Renan amadureceu com o esporte e viu o Muay Thai transformar sua vida e a vida de centenas de alunos por todo o Vale do Paraíba — em Jacareí, São José dos Campos e Santa Branca.',
      'Como líder da Pride, Renan ministra aulas na conceituada Academia Calasans Camargo e supervisiona pessoalmente a formação contínua dos professores da equipe, assegurando que o padrão técnico mais rigoroso caminhe sempre lado a lado com os valores éticos que definem a verdadeira arte das oito armas.',
      'Sua liderança inspira pelo exemplo diário: estar presente, treinar junto, acolher o iniciante com respeito e exigir do graduado o mais alto nível de conduta dentro e fora do ringue.',
    ],
    quote: 'A Pride não é apenas uma equipe de luta. É uma família forjada no respeito, na honra e na superação diária de cada um dos nossos irmãos.',
    experienceYears: 14,
    photoPosition: 'center 5%',
    isLeader: true,
    highlightBadges: ['13º Khan • Preta Ponta Branca', 'Líder & Fundador da Pride', 'Academia Calasans Camargo', '14 Anos de Muay Thai', 'Coordenação Técnica Geral'],
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

export function getProfessorWhatsAppUrl(prof: Professor): string {
  if (!prof.phoneRaw) return '';
  const message = `Olá, ${prof.nickname || prof.name}! Vi seu perfil de professor no site da Pride Muay Thai e gostaria de saber mais sobre treinos e horários.`;
  return `https://wa.me/${prof.phoneRaw}?text=${encodeURIComponent(message)}`;
}

// ==========================================
// PERSONAL FIGHTERS DATA & PRICING PLANS
// ==========================================
export const STANDARD_PERSONAL_PRICING: PricingPlan = {
  frequency1x: 'R$ 340',
  frequency2x: 'R$ 520',
  frequency3x: 'R$ 750',
  singleClass: 'R$ 100',
  trialClass: 'R$ 70',
};

export const RENAN_PERSONAL_PRICING: PricingPlan = {
  frequency1x: 'R$ 400',
  frequency2x: 'R$ 700',
  frequency3x: 'R$ 900',
  singleClass: 'R$ 120',
  trialClass: 'R$ 50',
  scheduleNote: 'Não ministra aulas aos sábados (Segunda a Sexta)',
};

export const PERSONAL_FIGHTERS_DATA: PersonalFighter[] = [
  {
    id: 'renan-personal',
    name: 'Renan',
    nickname: 'Hulkinho',
    photoUrl: resolvePhotoUrl('renan-hulkinho.jpeg'),
    khan: 13,
    city: 'São José dos Campos',
    price: 'A partir de R$ 400/mês',
    priceNote: 'Planos mensais ou aulas avulsas',
    roleTitle: 'Líder & Fundador da Pride • Personal Fighter',
    bio: 'Treinamento exclusivo de alta performance diretamente com o líder e fundador da Pride Muay Thai. Evolução técnica acelerada e acompanhamento de ponta.',
    highlightBadges: ['13º Khan • Kru Yai', 'São José dos Campos', 'Sem aulas aos sábados', 'Líder Geral Pride'],
    phoneDisplay: '(12) 99174-6964',
    phoneRaw: '5512991746964',
    photoPosition: 'center 5%',
    pricingPlan: RENAN_PERSONAL_PRICING,
    scheduleNote: 'Não ministra aulas aos sábados (Segunda a Sexta)',
  },
  {
    id: 'paulo-personal',
    name: 'Paulo Roberto',
    nickname: null,
    photoUrl: resolvePhotoUrl('paulo-roberto.jpeg'),
    khan: 11,
    city: 'Jacareí',
    price: 'A partir de R$ 340/mês',
    priceNote: 'Planos mensais ou aulas avulsas',
    roleTitle: 'Personal Fighter • Professor 11º Khan',
    bio: 'Braço direito da Pride e árbitro certificado, com didática exemplar e evolução sob medida tanto para iniciantes quanto para atletas avançados.',
    highlightBadges: ['11º Khan • Vermelha Ponta Branca', 'Jacareí', 'Árbitro Certificado', 'Braço Direito Pride'],
    phoneDisplay: '(12) 98192-5045',
    phoneRaw: '5512981925045',
    pricingPlan: STANDARD_PERSONAL_PRICING,
  },
  {
    id: 'rafael-lobinho-personal',
    name: 'Rafael',
    nickname: 'Lobinho',
    photoUrl: resolvePhotoUrl('rafael-lobinho.jpeg'),
    khan: 10,
    city: 'São José dos Campos',
    price: 'A partir de R$ 340/mês',
    priceNote: 'Planos mensais ou aulas avulsas',
    roleTitle: 'Personal Fighter • Instrutor Sênior',
    bio: 'Aulas particulares focadas em biomecânica de combate, movimentação inteligente de ringue, autodefesa e calma sob pressão.',
    highlightBadges: ['10º Khan • Vermelha', 'São José dos Campos', 'Biomecânica & Combate', 'Técnica Tradicional'],
    phoneDisplay: '(12) 98208-6665',
    phoneRaw: '5512982086665',
    pricingPlan: STANDARD_PERSONAL_PRICING,
  },
  {
    id: 'rick-netto-personal',
    name: 'Rick Netto',
    nickname: null,
    photoUrl: resolvePhotoUrl('rick-netto.jpeg'),
    khan: 7,
    city: 'Jacareí',
    price: 'A partir de R$ 340/mês',
    priceNote: 'Planos mensais ou aulas avulsas',
    roleTitle: 'Personal Fighter • Instrutor',
    bio: 'Treinamento focado em inteligência tática, técnica refinada, disciplina e desenvolvimento de uma mentalidade forte e vencedora.',
    highlightBadges: ['7º Khan • Azul e Branco', 'Jacareí', 'Cursos CBMT/BT & KAMMAKAM', 'Inteligência Tática'],
    phoneDisplay: '(12) 99183-1028',
    phoneRaw: '5512991831028',
    photoPosition: 'center 15%',
    pricingPlan: STANDARD_PERSONAL_PRICING,
  },
  {
    id: 'eduardo-personal',
    name: 'Eduardo',
    nickname: 'Du',
    photoUrl: resolvePhotoUrl('eduardo.jpeg'),
    khan: 10,
    city: 'Jacareí',
    price: 'A partir de R$ 340/mês',
    priceNote: 'Planos mensais ou aulas avulsas',
    roleTitle: 'Personal Fighter • Professor 10º Khan',
    bio: 'Treinos dinâmicos com forte foco em superação de limites, condicionamento físico de alta queima calórica e fundamentos sólidos das 8 armas.',
    highlightBadges: ['10º Khan • Vermelha', 'Jacareí', 'Condicionamento Intenso', 'Fundamentos'],
    phoneDisplay: '(12) 99115-1494',
    phoneRaw: '5512991151494',
    photoPosition: 'center 0%',
    pricingPlan: STANDARD_PERSONAL_PRICING,
  },
];

export function getPersonalFighterWhatsAppUrl(fighter: PersonalFighter): string {
  if (!fighter.phoneRaw) return '';
  const message = `Olá, ${fighter.nickname || fighter.name}! Vi seu perfil de Personal Fighter no site da Pride Muay Thai e gostaria de saber mais sobre aulas particulares de Muay Thai.`;
  return `https://wa.me/${fighter.phoneRaw}?text=${encodeURIComponent(message)}`;
}

