import React, { useState } from 'react';
import {
  QrCode,
  Copy,
  Check,
  ShieldAlert,
  Award,
  CheckCircle,
} from 'lucide-react';
import {
  GRADUATION_PIX,
  GRADUATION_MANDATORY_EQUIPMENT,
  GRADUATION_PRICING_TABLE,
  formatGraduationPrice,
} from '../../constants/graduation';

export const GraduationInfo: React.FC = () => {
  const [copiedPix, setCopiedPix] = useState(false);

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(GRADUATION_PIX.key);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2500);
    } catch {
      alert(`Chave PIX: ${GRADUATION_PIX.key}`);
    }
  };

  return (
    <div className="space-y-8 mb-10">
      {/* 1. Equipamentos Obrigatórios */}
      <section
        aria-labelledby="heading-equipamentos"
        className="p-6 sm:p-7 rounded-2xl bg-[#0d0d12] border border-zinc-800 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-zinc-800">
          <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-800/50 flex items-center justify-center text-red-500 flex-shrink-0">
            <ShieldAlert size={22} />
          </div>
          <div>
            <h2 id="heading-equipamentos" className="font-fight text-xl sm:text-2xl text-white uppercase tracking-wider">
              Equipamentos Obrigatórios
            </h2>
            <span className="text-xs text-zinc-400 font-mono">
              Padronização oficial para todos os participantes do exame
            </span>
          </div>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-zinc-300">
          {GRADUATION_MANDATORY_EQUIPMENT.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-950 border border-zinc-800/80"
            >
              <CheckCircle size={16} className="text-red-500 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 2. Tabela Fixa de Valores */}
      <section
        aria-labelledby="heading-valores"
        className="p-6 sm:p-7 rounded-2xl bg-[#0d0d12] border border-zinc-800 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-zinc-800">
          <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-800/50 flex items-center justify-center text-red-500 flex-shrink-0">
            <Award size={22} />
          </div>
          <div>
            <h2 id="heading-valores" className="font-fight text-xl sm:text-2xl text-white uppercase tracking-wider">
              Tabela de Valores Oficiais de Exame
            </h2>
            <span className="text-xs text-zinc-400 font-mono">
              Valores definidos por Khan pretendido no exame de graduação
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-[11px] font-mono uppercase tracking-wider text-zinc-400 bg-zinc-950/60">
                <th scope="col" className="py-2.5 px-4">Khan Pretendido</th>
                <th scope="col" className="py-2.5 px-4">Cor Oficial</th>
                <th scope="col" className="py-2.5 px-4 text-right">Valor do Exame</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-sm">
              {GRADUATION_PRICING_TABLE.map((tier) => (
                <tr key={tier.level} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="py-2.5 px-4 font-mono font-medium text-white">
                    {tier.level}º Khan
                  </td>
                  <td className="py-2.5 px-4 text-zinc-300">
                    {tier.colorName}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-white">
                    {formatGraduationPrice(tier.priceInCents)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Pagamento via PIX Oficial */}
      <section
        aria-labelledby="heading-pix"
        className="p-6 sm:p-7 rounded-2xl bg-[#0b100d] border border-emerald-900/60 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-emerald-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <QrCode size={22} />
            </div>
            <div>
              <h2 id="heading-pix" className="font-fight text-xl sm:text-2xl text-white uppercase tracking-wider">
                Pagamento da Graduação via PIX
              </h2>
              <span className="text-xs text-zinc-400 font-mono">
                Conta: {GRADUATION_PIX.institution} — Beneficiário: {GRADUATION_PIX.beneficiary}
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 font-mono text-xs uppercase font-semibold">
            <CheckCircle size={13} />
            <span>Chave Oficial Verificada</span>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
              Chave PIX para Cópia e Pagamento
            </span>
            <span className="text-lg sm:text-2xl font-mono font-bold text-emerald-400 tracking-wider block select-all">
              {GRADUATION_PIX.displayKey}
            </span>
            <span className="text-xs text-zinc-400 mt-1 block">
              Instituição: <strong className="text-zinc-200">{GRADUATION_PIX.institution}</strong> | Beneficiário: <strong className="text-zinc-200">{GRADUATION_PIX.beneficiary}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyPix}
            aria-label={`Copiar chave PIX ${GRADUATION_PIX.key}`}
            title="Copiar chave PIX"
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm font-mono text-xs uppercase font-semibold transition-all ${
              copiedPix
                ? 'bg-emerald-600 text-white shadow-emerald-glow'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            {copiedPix ? (
              <>
                <Check size={15} />
                <span>Chave Copiada!</span>
              </>
            ) : (
              <>
                <Copy size={15} />
                <span>Copiar Chave PIX</span>
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
};
