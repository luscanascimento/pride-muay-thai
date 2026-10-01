import React, { useState } from 'react';
import { ShieldCheck, HeartPulse, Brain, Zap, Target, Flame, Sparkles } from 'lucide-react';
import bagImg from '../../assets/images/heavy-bag.jpg';
import padImg from '../../assets/images/pad-work.jpg';

export const BenefitsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'martial' | 'fitness'>('martial');

  const martialBenefits = [
    {
      icon: ShieldCheck,
      title: 'Fundamentos de Defesa Pessoal',
      desc: 'Compreensão de distância, tempo de reação e bloqueios eficientes contra golpes em diferentes alturas.',
    },
    {
      icon: Brain,
      title: 'Controle Emocional & Calma sob Pressão',
      desc: 'A prática constante ensina a manter a cabeça fria, respirar conscientemente e tomar decisões lúcidas em momentos de estresse.',
    },
    {
      icon: Target,
      title: 'Consciência Corporal & Coordenação',
      desc: 'Alinhamento postural, equilíbrio dinâmico e integração motora refinada entre membros superiores e inferiores.',
    },
    {
      icon: Sparkles,
      title: 'Disciplina & Evolução Pessoal',
      desc: 'Constância semanal que desenvolve autoconfiança realista, respeito aos colegas e superação de limites individuais.',
    },
  ];

  const fitnessBenefits = [
    {
      icon: HeartPulse,
      title: 'Condicionamento Cardiovascular',
      desc: 'Treinos intervalados de alta intensidade que elevam a resistência aeróbica e o vigor para as atividades do dia a dia.',
    },
    {
      icon: Flame,
      title: 'Fortalecimento de Core & Pernas',
      desc: 'A mecânica de chutes e rotações de quadril ativa intensamente a musculatura abdominal, lombar, glúteos e panturrilhas.',
    },
    {
      icon: Zap,
      title: 'Potência & Agilidade',
      desc: 'Trabalho contínuo em manoplas e sacos pesados que treina aceleração muscular, velocidade e explosão física.',
    },
    {
      icon: Target,
      title: 'Mobilidade Articular & Descompressão',
      desc: 'Alongamentos dinâmicos e descompressão corporal que auxiliam no combate ao sedentarismo e à rigidez muscular.',
    },
  ];

  return (
    <section id="beneficios" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#0b0b0e] overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <HeartPulse size={14} />
            <span>Transformação Integral</span>
          </div>
          <h2 className="font-fight text-4xl sm:text-5xl lg:text-6xl text-white uppercase leading-none">
            POR QUE PRATICAR <br />
            <span className="text-red-500 text-glow-red">MUAY THAI?</span>
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
            Benefícios práticos que transformam tanto sua mente e reflexos marciais quanto sua saúde e capacidade física.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setActiveTab('martial')}
              className={`px-5 sm:px-8 py-2.5 rounded-md font-fight text-lg uppercase tracking-wider transition-all duration-200 ${
                activeTab === 'martial'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Defesa & Mente Marcial
            </button>
            <button
              onClick={() => setActiveTab('fitness')}
              className={`px-5 sm:px-8 py-2.5 rounded-md font-fight text-lg uppercase tracking-wider transition-all duration-200 ${
                activeTab === 'fitness'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Saúde & Condicionamento
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Benefits Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(activeTab === 'martial' ? martialBenefits : fitnessBenefits).map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-[#121217] border border-zinc-800/80 hover:border-red-600/50 transition-all duration-300 flex flex-col gap-3 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-red-950/50 border border-red-800/50 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-fight text-2xl text-white uppercase tracking-wide">
                    {benefit.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Contextual Photo Card */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-xl overflow-hidden border border-zinc-800 shadow-2xl relative min-h-[380px] lg:min-h-[440px] flex items-end">
              <img
                src={activeTab === 'martial' ? padImg : bagImg}
                alt="Treinamento intenso no Pride Muay Thai"
                className="absolute inset-0 w-full h-full object-cover filter contrast-125 brightness-80 transition-all duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080809] via-[#080809]/50 to-transparent" />
              
              <div className="relative z-10 p-6 sm:p-8">
                <span className="text-xs uppercase font-mono tracking-widest text-red-400 font-semibold block mb-1">
                  {activeTab === 'martial' ? 'Técnica e Precisão' : 'Intensidade & Foco'}
                </span>
                <h4 className="font-fight text-2xl sm:text-3xl text-white uppercase">
                  {activeTab === 'martial' ? 'Aprenda a arte verdadeira' : 'Supere seus limites físicos'}
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-zinc-300">
                  {activeTab === 'martial'
                    ? 'Treinos estruturados para que você aprenda a golpear com biomecânica correta e segurança, sem riscos desnecessários.'
                    : 'Exercício completo que trabalha o corpo todo, promovendo condicionamento físico, queima calórica e disposição.'}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
