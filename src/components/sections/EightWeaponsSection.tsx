import React, { useState } from 'react';
import { Target, Zap, Sparkles } from 'lucide-react';
import { BRAND } from '../../constants/brand';

export const EightWeaponsSection: React.FC = () => {
  const [activeWeaponId, setActiveWeaponId] = useState<string>('punhos');

  const activeWeapon = BRAND.eightWeapons.find((w) => w.id === activeWeaponId) || BRAND.eightWeapons[0];

  return (
    <section id="oito-armas" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#080809] overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[700px] h-72 sm:h-[700px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none max-w-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <Target size={14} />
            <span>ศาสตร์แห่งอาวุธทั้งแปด</span>
          </div>
          <h2 className="font-fight text-4xl sm:text-5xl lg:text-6xl text-white uppercase leading-none">
            A ARTE DAS <span className="text-red-500 text-glow-red">OITO ARMAS</span>
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
            Ao contrário de esportes que usam apenas 2 ou 4 pontos de contato, o lutador de Muay Thai transforma todo o corpo em um arsenal sincronizado: dois punhos, dois cotovelos, dois joelhos e duas canelas.
          </p>
        </div>

        {/* Interactive Selector & Visual Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Interactive Fighter Body Silhouette with Glowing Strike Nodes */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 sm:p-8 rounded-xl bg-gradient-to-b from-[#111116] to-[#0a0a0d] border border-zinc-800/80 shadow-2xl relative">
            <div className="text-xs uppercase tracking-widest text-zinc-500 mb-4 font-mono">
              Clique nos pontos corporais ou botões
            </div>

            {/* Stylized Martial Anatomy SVG */}
            <div className="relative w-64 h-96 sm:w-72 sm:h-[420px] flex items-center justify-center">
              <svg
                viewBox="0 0 300 450"
                className="w-full h-full filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Martial Fighter Body Silhouette wireframe */}
                <g stroke="#3f3f46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
                  {/* Head & Mongkhon */}
                  <circle cx="150" cy="55" r="28" fill="#18181b" stroke="#71717a" strokeWidth="2" />
                  <path d="M 125 50 Q 150 35 175 50" stroke="#dc2626" strokeWidth="2.5" />
                  {/* Neck */}
                  <path d="M 142 83 L 142 100 M 158 83 L 158 100" />
                  {/* Torso & Ribs */}
                  <path d="M 115 105 L 185 105 L 170 230 L 130 230 Z" fill="#18181b" stroke="#52525b" />
                  <path d="M 125 140 L 175 140 M 128 170 L 172 170 M 133 200 L 167 200" stroke="#3f3f46" />
                  {/* Arms */}
                  {/* Left Arm to Elbow to Fist */}
                  <path d="M 115 110 L 80 160 L 95 90" stroke="#71717a" strokeWidth="3" />
                  {/* Right Arm to Elbow to Fist */}
                  <path d="M 185 110 L 220 160 L 205 90" stroke="#71717a" strokeWidth="3" />
                  {/* Legs */}
                  {/* Left Leg to Knee to Shin/Foot */}
                  <path d="M 135 230 L 115 315 L 125 410 L 105 415" stroke="#71717a" strokeWidth="3.5" />
                  {/* Right Leg to Knee to Shin/Foot */}
                  <path d="M 165 230 L 185 315 L 175 410 L 195 415" stroke="#71717a" strokeWidth="3.5" />
                </g>

                {/* Interactive Hotspot: PUNHOS (Hands / Fists) */}
                <g
                  onClick={() => setActiveWeaponId('punhos')}
                  className="cursor-pointer group"
                >
                  <circle
                    cx="95"
                    cy="90"
                    r={activeWeaponId === 'punhos' ? 14 : 9}
                    className={`transition-all duration-300 ${
                      activeWeaponId === 'punhos'
                        ? 'fill-red-600 stroke-white stroke-2 filter drop-shadow-[0_0_12px_#ff2a3a]'
                        : 'fill-zinc-700 stroke-zinc-500 hover:fill-red-500'
                    }`}
                  />
                  <circle
                    cx="205"
                    cy="90"
                    r={activeWeaponId === 'punhos' ? 14 : 9}
                    className={`transition-all duration-300 ${
                      activeWeaponId === 'punhos'
                        ? 'fill-red-600 stroke-white stroke-2 filter drop-shadow-[0_0_12px_#ff2a3a]'
                        : 'fill-zinc-700 stroke-zinc-500 hover:fill-red-500'
                    }`}
                  />
                  {activeWeaponId === 'punhos' && (
                    <line x1="95" y1="90" x2="205" y2="90" stroke="#dc2626" strokeDasharray="4 4" strokeWidth="1.5" />
                  )}
                </g>

                {/* Interactive Hotspot: COTOVELOS (Elbows) */}
                <g
                  onClick={() => setActiveWeaponId('cotovelos')}
                  className="cursor-pointer group"
                >
                  <circle
                    cx="80"
                    cy="160"
                    r={activeWeaponId === 'cotovelos' ? 14 : 9}
                    className={`transition-all duration-300 ${
                      activeWeaponId === 'cotovelos'
                        ? 'fill-red-600 stroke-white stroke-2 filter drop-shadow-[0_0_12px_#ff2a3a]'
                        : 'fill-zinc-700 stroke-zinc-500 hover:fill-red-500'
                    }`}
                  />
                  <circle
                    cx="220"
                    cy="160"
                    r={activeWeaponId === 'cotovelos' ? 14 : 9}
                    className={`transition-all duration-300 ${
                      activeWeaponId === 'cotovelos'
                        ? 'fill-red-600 stroke-white stroke-2 filter drop-shadow-[0_0_12px_#ff2a3a]'
                        : 'fill-zinc-700 stroke-zinc-500 hover:fill-red-500'
                    }`}
                  />
                </g>

                {/* Interactive Hotspot: JOELHOS (Knees) */}
                <g
                  onClick={() => setActiveWeaponId('joelhos')}
                  className="cursor-pointer group"
                >
                  <circle
                    cx="115"
                    cy="315"
                    r={activeWeaponId === 'joelhos' ? 14 : 9}
                    className={`transition-all duration-300 ${
                      activeWeaponId === 'joelhos'
                        ? 'fill-red-600 stroke-white stroke-2 filter drop-shadow-[0_0_12px_#ff2a3a]'
                        : 'fill-zinc-700 stroke-zinc-500 hover:fill-red-500'
                    }`}
                  />
                  <circle
                    cx="185"
                    cy="315"
                    r={activeWeaponId === 'joelhos' ? 14 : 9}
                    className={`transition-all duration-300 ${
                      activeWeaponId === 'joelhos'
                        ? 'fill-red-600 stroke-white stroke-2 filter drop-shadow-[0_0_12px_#ff2a3a]'
                        : 'fill-zinc-700 stroke-zinc-500 hover:fill-red-500'
                    }`}
                  />
                </g>

                {/* Interactive Hotspot: CANELAS / PÉS (Shins / Feet) */}
                <g
                  onClick={() => setActiveWeaponId('pernas')}
                  className="cursor-pointer group"
                >
                  <circle
                    cx="125"
                    cy="390"
                    r={activeWeaponId === 'pernas' ? 14 : 9}
                    className={`transition-all duration-300 ${
                      activeWeaponId === 'pernas'
                        ? 'fill-red-600 stroke-white stroke-2 filter drop-shadow-[0_0_12px_#ff2a3a]'
                        : 'fill-zinc-700 stroke-zinc-500 hover:fill-red-500'
                    }`}
                  />
                  <circle
                    cx="175"
                    cy="390"
                    r={activeWeaponId === 'pernas' ? 14 : 9}
                    className={`transition-all duration-300 ${
                      activeWeaponId === 'pernas'
                        ? 'fill-red-600 stroke-white stroke-2 filter drop-shadow-[0_0_12px_#ff2a3a]'
                        : 'fill-zinc-700 stroke-zinc-500 hover:fill-red-500'
                    }`}
                  />
                </g>
              </svg>
            </div>

            {/* Micro legend */}
            <div className="mt-4 flex items-center gap-4 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block shadow-sm" /> Ativo
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-600 inline-block" /> Ponto Corporal
              </span>
            </div>
          </div>

          {/* Right: Weapons List Tabs & Detailed Anatomy Card */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Weapon Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {BRAND.eightWeapons.map((weapon) => {
                const isSelected = weapon.id === activeWeaponId;
                return (
                  <button
                    key={weapon.id}
                    onClick={() => setActiveWeaponId(weapon.id)}
                    className={`p-3 text-left rounded-lg transition-all duration-200 border ${
                      isSelected
                        ? 'bg-red-950/60 border-red-600 shadow-red-glow text-white'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <span className="block text-[10px] font-mono uppercase text-red-400">{weapon.type}</span>
                    <span className="font-fight text-lg sm:text-xl font-bold uppercase block leading-tight">{weapon.name}</span>
                    <span className="text-[11px] text-zinc-400 block truncate">{weapon.thaiName.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Weapon Detail Showcase Card */}
            <div className="p-6 sm:p-8 rounded-xl bg-[#111116] border border-zinc-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs uppercase font-mono tracking-widest text-red-500 font-semibold block mb-1">
                    {activeWeapon.thaiName}
                  </span>
                  <h3 className="font-fight text-3xl sm:text-4xl text-white uppercase leading-none">
                    {activeWeapon.name}
                  </h3>
                </div>
                <div className="p-2.5 rounded-md bg-zinc-900 border border-zinc-800 text-red-400">
                  <Zap size={22} />
                </div>
              </div>

              {/* Tactical role */}
              <div className="mt-4 p-3 rounded-md bg-zinc-900/80 border border-zinc-800 flex items-center gap-2.5">
                <Target size={16} className="text-red-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-zinc-300">
                  <strong className="text-white">Função tática:</strong> {activeWeapon.role}
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 text-zinc-300 text-sm sm:text-base leading-relaxed">
                {activeWeapon.description}
              </p>

              {/* Strike examples */}
              <div className="mt-6 pt-5 border-t border-zinc-800/80">
                <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-3">
                  Golpes & Técnicas Principais:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeWeapon.examples.map((example, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-700/80 text-xs sm:text-sm text-zinc-200 font-medium flex items-center gap-1.5"
                    >
                      <Sparkles size={12} className="text-red-400" />
                      {example}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
