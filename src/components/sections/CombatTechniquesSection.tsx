import React, { useState } from 'react';
import { Activity, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';
import { BRAND } from '../../constants/brand';
import kickImg from '../../assets/images/muay-thai-kick.jpg';
import clinchImg from '../../assets/images/clinch-combat.jpg';

interface Technique {
  id: string;
  name: string;
  thai: string;
  weapon: string;
  trajectory: string;
  description: string;
  keyAspect: string;
  strokeType: 'arc' | 'slash' | 'thrust' | 'knee' | 'clinch';
}

const TECHNIQUES: Technique[] = [
  {
    id: 'kick',
    name: 'Te Chiang (Chute Circular de Canela)',
    thai: 'เตะเฉียง',
    weapon: 'Canela / Tíbia',
    trajectory: 'Arco rotacional ascendente de 45° a 90°',
    description: 'A marca registrada do Muay Thai. O golpe não utiliza o peito do pé, mas sim a canela blindada como um taco de beisebol, girando o pé de apoio e os quadris com força centrífuga total.',
    keyAspect: 'Rotação total do quadril e projeção do ombro para geração de torque máximo.',
    strokeType: 'arc',
  },
  {
    id: 'elbow',
    name: 'Sok Klap / Sok Tee (Cotovelada Cortante)',
    thai: 'ศอกตี / ศอกกลับ',
    weapon: 'Ponta do Cotovelo (Ulna)',
    trajectory: 'Linha cortante horizontal ou diagonal em ângulo agudo',
    description: 'Executado a curta distância, o cotovelo rasga e atordoa. A rotação do tronco transfere o peso corporal instantaneamente para uma área pontual de alto impacto.',
    keyAspect: 'Mão colada na têmpora para manter a guarda oposta alta e protegida contra contra-ataques.',
    strokeType: 'slash',
  },
  {
    id: 'knee',
    name: 'Khao Trong / Khao Loi (Joelhada Perfurante)',
    thai: 'เข่าตรง / เข่าลอย',
    weapon: 'Patela / Joelho',
    trajectory: 'Empuxo linear ascendente em direção às costelas ou plexo solar',
    description: 'Arma devastadora no combate corpo a corpo. O lutador projeta o quadril para a frente, ponta dos dedos dos pés apontada para baixo para tensionar a musculatura.',
    keyAspect: 'Alavanca de quadril que penetra a defesa adversária com o peso do corpo.',
    strokeType: 'knee',
  },
  {
    id: 'teep',
    name: 'Teep Trong (Chute Frontal de Controle)',
    thai: 'ถีบตรง',
    weapon: 'Planta do pé / Metatarso',
    trajectory: 'Linha reta de pistão no abdômen ou peito',
    description: 'O jab do Muay Thai. Utilizado para controlar a distância, interceptar investidas do oponente e criar aberturas táticas para combinações de golpes contundentes.',
    keyAspect: 'Extensão rápida da perna que desarma o equilíbrio e quebra o ritmo do adversário.',
    strokeType: 'thrust',
  },
  {
    id: 'clinch',
    name: 'Chap Ko (Clinch Tradicional & Esgrima)',
    thai: 'จับคอ',
    weapon: 'Braços, Ombros, Cabeça e Joelhos integrados',
    trajectory: 'Tração contínua e rotação de pescoço',
    description: 'O domínio do clinch separa o Muay Thai de qualquer outra luta em pé. Uma batalha técnica de alavancas onde os lutadores disputam a postura da nuca e criam ângulos de joelhadas e projeções.',
    keyAspect: 'Controle de cabeça com antebraços nas clavículas para evitar contra-golpes de cotovelo.',
    strokeType: 'clinch',
  },
];

export const CombatTechniquesSection: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState<Technique>(TECHNIQUES[0]);

  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#0a0a0d] border-t border-zinc-900 overflow-hidden">
      
      {/* Background ambient red sweep */}
      <div className="absolute top-1/3 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none max-w-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <Activity size={14} />
            <span>Biomecânica Marcial</span>
          </div>
          <h2 className="font-fight text-4xl sm:text-5xl lg:text-6xl text-white uppercase leading-none">
            A CIÊNCIA DO IMPACTO <br />
            <span className="text-red-500 text-glow-red">E DO MOVIMENTO</span>
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
            Cada golpe do Muay Thai foi moldado por séculos de refinamento físico. Não existe movimento em vão: a força nasce no solo, percorre o quadril e explode no ponto de contato.
          </p>
        </div>

        {/* Interactive Technique Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Technique Selection Menu */}
          <div className="lg:col-span-4 flex flex-col gap-2.5">
            {TECHNIQUES.map((tech) => {
              const isCurrent = tech.id === selectedTech.id;
              return (
                <button
                  key={tech.id}
                  onClick={() => setSelectedTech(tech)}
                  className={`p-4 text-left rounded-lg transition-all duration-300 flex items-center justify-between border ${
                    isCurrent
                      ? 'bg-zinc-900/90 border-red-600 shadow-red-glow text-white translate-x-1.5'
                      : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-mono text-red-400 font-semibold">{tech.weapon}</span>
                    <span className="font-fight text-xl uppercase tracking-wide">{tech.name.split('(')[0]}</span>
                    <span className="text-xs text-zinc-400">{tech.thai}</span>
                  </div>
                  <ChevronRight
                    size={20}
                    className={`transition-transform duration-300 ${
                      isCurrent ? 'text-red-500 translate-x-1' : 'text-zinc-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Technique Visual Canvas & Real Photography */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Visual Vector Trajectory Diagram */}
            <div className="p-6 sm:p-7 rounded-xl bg-[#111116] border border-zinc-800 shadow-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-red-500 uppercase tracking-wider">{selectedTech.thai}</span>
                  <h3 className="font-fight text-2xl sm:text-3xl text-white uppercase">{selectedTech.name}</h3>
                </div>
                <div className="p-2 rounded-md bg-zinc-900 border border-zinc-800 text-red-400">
                  <ShieldAlert size={20} />
                </div>
              </div>

              {/* Dynamic SVG Strike Trajectory Arc / Line animation */}
              <div className="my-6 py-6 px-4 rounded-lg bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-center relative min-h-[160px]">
                <svg viewBox="0 0 300 140" className="w-full h-36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid background reference lines */}
                  <line x1="20" y1="70" x2="280" y2="70" stroke="#27272a" strokeDasharray="3 3" />
                  <line x1="150" y1="20" x2="150" y2="120" stroke="#27272a" strokeDasharray="3 3" />

                  {selectedTech.strokeType === 'arc' && (
                    <g>
                      {/* Roundhouse kick arc */}
                      <path
                        d="M 50 110 C 100 130, 200 110, 240 40"
                        stroke="#dc2626"
                        strokeWidth="5"
                        strokeLinecap="round"
                        className="animate-pulse"
                      />
                      {/* Secondary speed trail */}
                      <path d="M 60 118 C 110 135, 190 120, 230 55" stroke="#ef4444" strokeWidth="2" strokeOpacity="0.4" />
                      {/* Impact point */}
                      <circle cx="240" cy="40" r="10" fill="#dc2626" className="animate-ping opacity-75" />
                      <circle cx="240" cy="40" r="7" fill="#ffffff" />
                      <text x="140" y="125" fill="#f87171" fontSize="11" fontFamily="monospace" textAnchor="middle">
                        VETOR DE ROTAÇÃO DA CANELA (TORQUE)
                      </text>
                    </g>
                  )}

                  {selectedTech.strokeType === 'slash' && (
                    <g>
                      {/* Diagonal sharp elbow slash */}
                      <path d="M 50 30 L 250 110" stroke="#dc2626" strokeWidth="5" strokeLinecap="round" className="animate-pulse" />
                      <path d="M 70 30 L 260 105" stroke="#ef4444" strokeWidth="2" strokeOpacity="0.4" />
                      {/* Target cutting impact */}
                      <circle cx="250" cy="110" r="8" fill="#ffffff" />
                      <polygon points="250,100 260,110 250,120 240,110" fill="#dc2626" className="animate-ping opacity-60" />
                      <text x="150" y="128" fill="#f87171" fontSize="11" fontFamily="monospace" textAnchor="middle">
                        LINHA DE CORTE DO COTOVELO (45°)
                      </text>
                    </g>
                  )}

                  {selectedTech.strokeType === 'knee' && (
                    <g>
                      {/* Knee thrust */}
                      <path d="M 80 120 L 220 30" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" className="animate-pulse" />
                      <circle cx="220" cy="30" r="11" fill="#dc2626" className="animate-ping opacity-75" />
                      <circle cx="220" cy="30" r="8" fill="#ffffff" />
                      <path d="M 200 45 L 240 15" stroke="#ef4444" strokeWidth="2" />
                      <text x="150" y="128" fill="#f87171" fontSize="11" fontFamily="monospace" textAnchor="middle">
                        EMPUXO DE QUADRIL E PENETRAÇÃO VERTICAL
                      </text>
                    </g>
                  )}

                  {selectedTech.strokeType === 'thrust' && (
                    <g>
                      {/* Front Teep linear thrust */}
                      <path d="M 40 70 L 250 70" stroke="#dc2626" strokeWidth="5" strokeLinecap="round" className="animate-pulse" />
                      <circle cx="250" cy="70" r="10" fill="#dc2626" className="animate-ping opacity-75" />
                      <circle cx="250" cy="70" r="6" fill="#ffffff" />
                      <line x1="220" y1="50" x2="220" y2="90" stroke="#ef4444" strokeWidth="2" />
                      <text x="150" y="120" fill="#f87171" fontSize="11" fontFamily="monospace" textAnchor="middle">
                        LINHA RETA DE INTERRUPÇÃO E PISTÃO (TEEP)
                      </text>
                    </g>
                  )}

                  {selectedTech.strokeType === 'clinch' && (
                    <g>
                      {/* Clinch dual lock rings */}
                      <circle cx="120" cy="65" r="28" stroke="#71717a" strokeWidth="3" />
                      <circle cx="180" cy="65" r="28" stroke="#dc2626" strokeWidth="3.5" className="animate-pulse" />
                      {/* Leverage arrows */}
                      <path d="M 120 40 Q 150 20 180 40" stroke="#ef4444" strokeWidth="3" fill="none" />
                      <circle cx="150" cy="65" r="6" fill="#ffffff" />
                      <text x="150" y="125" fill="#f87171" fontSize="11" fontFamily="monospace" textAnchor="middle">
                        ALAVANCA CERVICAL & CONTROLE DE POSTURA
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              {/* Technique details */}
              <div className="flex flex-col gap-3">
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {selectedTech.description}
                </p>
                <div className="p-3 rounded-md bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2">
                  <Sparkles size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Ponto técnico essencial:</strong> {selectedTech.keyAspect}
                  </span>
                </div>
              </div>
            </div>

            {/* Authentic Photography Card */}
            <div className="relative rounded-xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col justify-end min-h-[340px] group">
              <img
                src={selectedTech.id === 'clinch' ? clinchImg : kickImg}
                alt="Treino prático de Muay Thai"
                className="absolute inset-0 w-full h-full object-cover filter contrast-125 brightness-75 transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080809] via-[#080809]/60 to-transparent" />
              
              <div className="relative z-10 p-6">
                <span className="text-xs uppercase font-mono tracking-widest text-red-400 font-semibold block mb-1">
                  Execução Real nos Treinos
                </span>
                <h4 className="font-fight text-2xl text-white uppercase">
                  Técnica sem agressividade cega
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-zinc-300">
                  Nas aulas do Pride Muay Thai, cada movimento é praticado com proteção adequada, manoplas e correção postural constante pelo treinador {BRAND.coach}.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
