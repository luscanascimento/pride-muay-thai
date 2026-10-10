import React, { useState } from 'react';
import { BookOpen, ScrollText, ChevronDown } from 'lucide-react';
import traditionImg from '../../assets/images/thailand-tradition.jpg';
import { AllKhansCuriosityTable } from '../ui/AllKhansCuriosityTable';

interface CuriosityItem {
  id: string;
  number: string;
  title: string;
  thai: string;
  summary: string;
  fullStory: string;
  tag: string;
}

const CURIOSITIES: CuriosityItem[] = [
  {
    id: 'history',
    number: '01',
    title: 'Das Batalhas do Antigo Reino de Sião aos Ringues',
    thai: 'มวยโบราณ สู่ มวยไทย',
    tag: 'História & Tradição',
    summary: 'Antes de ser esporte, o Muay Boran era a arte marcial de sobrevivência do exército de Sião (antiga Tailândia) para proteger suas fronteiras quando as armas quebravam.',
    fullStory: 'No início do século XX, sob o reinado do Rei Rama VII, foram introduzidas regras modernas, luvas acolchoadas (substituindo as cordas de cânhamo cru Kaad Chuek), categorias de peso e ringues com cordas, transformando a disciplina em um esporte internacional seguro e regulamentado.',
  },
  {
    id: 'wai-kru',
    number: '02',
    title: 'Wai Kru Ram Muay: A Dança Sagrada de Respeito',
    thai: 'ไหว้ครูรำมวย',
    tag: 'Ritual Sagrado',
    summary: 'Antes de qualquer combate oficial, os lutadores realizam uma dança ritualística em círculo ao som da música tradicional Sarama.',
    fullStory: 'Wai significa saudação de respeito; Kru significa mestre/professor. A dança agradece aos pais, treinadores e ancestrais, abençoa os quatro cantos do ringue e serve como concentração psicológica e aquecimento neuromuscular pré-luta.',
  },
  {
    id: 'mongkhon',
    number: '03',
    title: 'Mongkhon & Prajiad: Símbolos de Proteção e Honra',
    thai: 'มงคล และ ประเจียด',
    tag: 'Amuletos Marciais',
    summary: 'O Mongkhon (coroa de cabeça) e o Prajiad (braçadeira) são símbolos sagrados tecidos e abençoados pelo Kru (mestre).',
    fullStory: 'Por tradição rigorosa, o Mongkhon nunca pode tocar o chão e é retirado pelo treinador antes do início do primeiro round, acompanhado de uma oração silenciosa. O lutador carrega no braço o Prajiad durante todo o combate como lembrete de sua linhagem.',
  },
  {
    id: 'respect',
    number: '04',
    title: 'A Filosofia do Respeito e o Cumprimento "Wai"',
    thai: 'ความเคารพ และ น้ำใจนักกีฬา',
    tag: 'Código Marcial',
    summary: 'No Muay Thai autêntico, arrogância é sinal de fraqueza. A reverência Wai marca o início e o fim de cada treino.',
    fullStory: 'Mesmo nos estádios mais lendários de Bangkok (Lumpinee e Rajadamnern), após rounds de combate intenso, os adversários abraçam-se, agradecem aos treinadores opostos e demonstram fraternidade incondicional. Essa é a conduta que cultivamos diariamente no Pride Muay Thai.',
  },
  {
    id: 'khans-system',
    number: '05',
    title: 'A Escala de Khans: A Ordem Sagrada das Cores do Prajied',
    thai: 'ลำดับขั้นมวยไทย',
    tag: 'Curiosidade & Graduação',
    summary: 'Ao contrário de outras artes marciais que utilizam faixas na cintura, no Muay Thai a graduação é indicada pelas cores do Prajied (cordão no braço), dividida em graus chamados Khans.',
    fullStory: 'O sistema tradicional é estruturado em 16 Khans, partindo da corda branca para os iniciantes até as cores escuras e nobres para mestres e fundadores. Veja abaixo a tabela completa com a ordem exata de cada graduação!',
  },
];

export const CuriositiesSection: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>('khans-system');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="curiosidades" className="scroll-mt-24 relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#080809] overflow-hidden">
      
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 bg-canvas-texture opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <BookOpen size={14} />
            <span>Cultura & Legado</span>
          </div>
          <h2 className="font-fight text-4xl sm:text-5xl lg:text-6xl text-white uppercase leading-none">
            CURIOSIDADES & HISTÓRIA <br />
            <span className="text-red-500 text-glow-red">DO MUAY THAI</span>
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
            Mergulhe nas raízes milenares de uma das manifestações culturais mais impressionantes do sudeste asiático.
          </p>
        </div>

        {/* Editorial Storytelling Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left: Featured Cultural Photography Banner */}
          <div className="lg:col-span-4 sticky top-28 hidden lg:block">
            <div className="rounded-xl overflow-hidden border border-zinc-800 shadow-2xl relative">
              <img
                src={traditionImg}
                alt="Herança cultural e templos da Tailândia"
                className="w-full h-[460px] object-cover filter contrast-125 brightness-80"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080809] via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs uppercase font-mono tracking-widest text-red-400 block mb-1">
                  Patrimônio Tailandês
                </span>
                <h3 className="font-fight text-2xl text-white uppercase">
                  Tradição viva em cada detalhe
                </h3>
                <p className="mt-2 text-xs text-zinc-300">
                  Praticar Muay Thai é conectar-se com uma herança marcial autêntica, onde a técnica é transmitida de geração em geração.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Editorial Timeline Accordion */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {CURIOSITIES.map((item) => {
              const isOpen = expandedId === item.id;
              return (
                <article
                  key={item.id}
                  className={`p-6 sm:p-7 rounded-xl transition-all duration-300 border ${
                    isOpen
                      ? 'bg-[#121217] border-red-600/70 shadow-red-glow'
                      : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div
                    onClick={() => toggleExpand(item.id)}
                    className="cursor-pointer flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 sm:gap-6">
                      <span className="font-fight text-3xl sm:text-4xl text-red-500/80 leading-none">
                        {item.number}
                      </span>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-red-400 font-semibold">
                            {item.tag}
                          </span>
                          <span className="text-zinc-600">•</span>
                          <span className="text-xs text-zinc-400">{item.thai}</span>
                        </div>
                        <h3 className="font-fight text-2xl sm:text-3xl text-white uppercase leading-tight">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-zinc-300 text-sm sm:text-base leading-relaxed">
                          {item.summary}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label={isOpen ? 'Recolher detalhes' : 'Expandir história completa'}
                      aria-expanded={isOpen}
                      className="p-2 rounded-full bg-zinc-800/80 text-zinc-300 hover:text-white flex-shrink-0 transition-transform duration-300"
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-red-500' : ''}`}
                      />
                    </button>
                  </div>

                  {/* Expanded deep dive */}
                  {isOpen && (
                    <div className="mt-5 pt-5 border-t border-zinc-800/80 text-zinc-400 text-sm leading-relaxed pl-12 sm:pl-16 flex items-start gap-3 animate-in fade-in duration-300">
                      <ScrollText size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <p>{item.fullStory}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

        </div>

        {/* Complete Khans Hierarchy Curiosity Table */}
        <AllKhansCuriosityTable />

      </div>
    </section>
  );
};
