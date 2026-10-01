import React, { useState } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { BRAND, getWhatsAppUrl } from '../../constants/brand';
import { useScrollHeader } from '../../hooks/useScrollHeader';
import { Button } from '../ui/Button';
import prideLogoCutout from '../../assets/pride-muay-thai-cutout.png';

export const Header: React.FC = () => {
  const isScrolled = useScrollHeader(40);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'A Arte', href: '#sobre-muay-thai' },
    { label: '8 Armas', href: '#oito-armas' },
    { label: 'Benefícios', href: '#beneficios' },
    { label: 'O Treino', href: '#treino' },
    { label: 'Unidades', href: '#unidades' },
    { label: 'Contato', href: '#contato' },
  ];

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0a0a0d]/95 backdrop-blur-md border-b border-zinc-800/80 py-3 shadow-xl'
          : 'bg-gradient-to-b from-[#080809]/90 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand identity logo + text */}
        <a
          href="#inicio"
          className="flex items-center gap-2 sm:gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-sm"
          aria-label="Pride Muay Thai - Voltar ao início"
        >
          <div className="relative w-8 h-8 sm:w-11 sm:h-11 flex-shrink-0">
            <img
              src={prideLogoCutout}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-contain transition-transform group-hover:scale-105 duration-300"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-fight text-lg sm:text-2xl font-bold tracking-wider leading-none text-white group-hover:text-red-500 transition-colors">
              PRIDE <span className="text-red-500">MUAY THAI</span>
            </span>
            <span className="text-[9px] sm:text-[11px] font-medium tracking-widest text-zinc-400 uppercase leading-tight mt-0.5">
              {BRAND.coach}
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Navegação principal">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-fight text-lg uppercase tracking-wider text-zinc-300 hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-red-600 after:absolute after:bottom-0 after:left-0 after:transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden lg:flex items-center gap-3">
          <Button
            as="a"
            href={getWhatsAppUrl()}
            target="_blank"
            variant="primary"
            size="sm"
            className="rounded-sm"
          >
            <MessageCircle size={18} />
            Comece a Treinar
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-800/80 focus-visible:ring-2 focus-visible:ring-red-500"
            aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-[#0d0d11]/98 backdrop-blur-xl border-b border-zinc-800 px-6 py-8 shadow-2xl transition-all animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-4 text-center" aria-label="Menu móvel">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="font-fight text-2xl uppercase tracking-wider text-zinc-200 hover:text-red-500 py-2 border-b border-zinc-800/50 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <Button
                as="a"
                href={getWhatsAppUrl()}
                target="_blank"
                variant="primary"
                size="lg"
                onClick={closeMenu}
                className="w-full justify-center"
              >
                <MessageCircle size={20} />
                Comece a Treinar no WhatsApp
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
