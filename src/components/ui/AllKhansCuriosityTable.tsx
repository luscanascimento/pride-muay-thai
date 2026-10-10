import React, { useState } from 'react';
import { ChevronDown, Sparkles, Shield, Users } from 'lucide-react';
import { ALL_KHANS_SYSTEM } from '../../data/gymsAndTeamData';
import { PrajiedRope } from './PrajiedBadge';

interface AllKhansCuriosityTableProps {
  initialExpanded?: boolean;
}

export const AllKhansCuriosityTable: React.FC<AllKhansCuriosityTableProps> = ({
  initialExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  const categories = [
    { id: 'todos', label: 'Todos os 16 Khans' },
    { id: 'Aluno', label: 'Aluno (1º ao 6º)' },
    { id: 'Graduado & Instrutor', label: 'Instrutor (7º ao 10º)' },
    { id: 'Professor & Mestre', label: 'Professor/Mestre (11º ao 13º)' },
    { id: 'Mestre de Honra', label: 'Grão-Mestres (14º ao 16º)' },
  ];

  const filteredKhans = selectedCategory === 'todos'
    ? ALL_KHANS_SYSTEM
    : ALL_KHANS_SYSTEM.filter((k) => k.category === selectedCategory);

  return (
    <div 
      id="curiosidades-khans" 
      className="scroll-mt-28 mt-12 p-6 sm:p-8 lg:p-10 rounded-3xl bg-gradient-to-b from-[#121218] via-[#0d0d12] to-[#08080a] border border-zinc-800 shadow-2xl relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header and Toggle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-mono uppercase tracking-wider mb-3 font-semibold">
            <Sparkles size={13} />
            <span>Curiosidade Marcial Tradicional</span>
          </div>
          <h3 className="font-fight text-3xl sm:text-4xl text-white uppercase tracking-wide leading-none">
            A ORDEM DE TODOS OS KHANS <span className="text-red-500">NO MUAY THAI</span>
          </h3>
          <p className="text-zinc-300 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
            Diferente de artes que utilizam faixas na cintura, no Muay Thai tradicional a graduação é representada no braço pelas cores sagradas do <strong>Prajied</strong> (cordão trançado), dividida em <strong>16 Khans</strong> — do primeiro passo como iniciante até a maestria suprema.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all self-start md:self-auto"
        >
          <span>{isExpanded ? 'Recolher Tabela' : 'Ver Todos os 16 Khans'}</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-red-400' : ''}`}
          />
        </button>
      </div>

      {isExpanded && (
        <div className="mt-8 animate-in fade-in duration-300">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                    : 'bg-zinc-900/90 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid of all 16 Khans */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredKhans.map((khan) => (
              <div
                key={khan.level}
                className={`p-4 sm:p-5 rounded-2xl bg-zinc-900/80 border transition-all duration-300 flex flex-col justify-between ${
                  khan.teamMembers && khan.teamMembers.length > 0
                    ? 'border-red-900/70 shadow-lg shadow-red-950/20 bg-gradient-to-b from-red-950/20 to-zinc-900/90'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div>
                  {/* Top row with Prajied and Level */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <PrajiedRope
                        customPrimary={khan.primaryColor}
                        customTip={khan.tipColor}
                        size="sm"
                      />
                      <div>
                        <span className="font-fight text-xl sm:text-2xl text-white uppercase tracking-wide leading-none block">
                          {khan.level}º KHAN
                        </span>
                        <span className="text-[11px] font-mono font-bold tracking-tight text-red-400 uppercase">
                          {khan.colorName}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800/90 text-zinc-400 border border-zinc-700/50 uppercase">
                      {khan.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="text-xs font-semibold text-zinc-200 uppercase tracking-wide mb-1 font-mono">
                    {khan.title}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                    {khan.description}
                  </p>
                </div>

                {/* Team members highlight pill if applicable */}
                {khan.teamMembers && khan.teamMembers.length > 0 && (
                  <div className="pt-2.5 border-t border-red-900/40 mt-auto">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-semibold flex items-center gap-1 mb-1">
                      <Users size={11} />
                      Na Pride Muay Thai:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {khan.teamMembers.map((member, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium px-2 py-0.5 rounded bg-red-950/60 border border-red-800/50 text-red-200"
                        >
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Cultural Footer Notes */}
          <div className="mt-8 pt-5 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-red-500" />
              <span>
                A graduação no Muay Thai exige tempo, conduta ética irrepreensível, disciplina e aprovação em exames oficiais.
              </span>
            </div>
            <div className="text-zinc-500 italic">
              Fonte: Tradição e Sistema de Khans WMBF / WTBF
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
