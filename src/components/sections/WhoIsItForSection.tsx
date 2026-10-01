import React from 'react';
import { Users, UserCheck, Flame, HeartHandshake } from 'lucide-react';

export const WhoIsItForSection: React.FC = () => {
  const profiles = [
    {
      icon: UserCheck,
      title: 'Iniciantes Sem Experiência',
      desc: 'Nunca colocou uma luva na vida? Não tem problema. A maior parte dos nossos alunos começou do zero absoluto. O foco inicial é aprender com calma, postura e segurança.',
    },
    {
      icon: Flame,
      title: 'Busca por Condicionamento e Energia',
      desc: 'Cansou da rotina monótona da academia tradicional? As aulas de Muay Thai oferecem um treino dinâmico, motivador e desafiador onde o tempo passa sem você perceber.',
    },
    {
      icon: HeartHandshake,
      title: 'Ambiente de Mútuo Respeito',
      desc: 'Nosso espaço é livre de egos e intimidações. Homens e mulheres treinam lado a lado em clima de companheirismo, onde o parceiro mais experiente ajuda o iniciante.',
    },
    {
      icon: Users,
      title: 'Quem Quer Aprender a Arte Real',
      desc: 'Se o seu objetivo é dominar a verdadeira técnica tailandesa — golpes limpos, guarda firme, movimentação e defesa —, você encontrará a linhagem tradicional que procura.',
    },
  ];

  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#0b0b0e] border-t border-zinc-900 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <Users size={14} />
            <span>Todos São Bem-Vindos</span>
          </div>
          <h2 className="font-fight text-4xl sm:text-5xl lg:text-6xl text-white uppercase leading-none">
            O MUAY THAI É PARA <span className="text-red-500 text-glow-red">VOCÊ?</span>
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
            Esqueça o mito de que você precisa ser um atleta profissional ou alguém violento para treinar. O tatame é um lugar de crescimento individual e superação pessoal.
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {profiles.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl bg-[#121217] border border-zinc-800/80 hover:border-red-600/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 mb-4">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-fight text-2xl text-white uppercase mb-2">
                    {p.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
