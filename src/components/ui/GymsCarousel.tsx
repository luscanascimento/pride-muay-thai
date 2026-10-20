import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Building2, ExternalLink } from 'lucide-react';

interface GymCarouselItem {
  id: string;
  gymId: string;
  name: string;
  city: string;
  neighborhood: string;
  image: string;
}

const basePath = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) ? import.meta.env.BASE_URL : './';
const resolveGymPhoto = (filename: string) => {
  const base = basePath.endsWith('/') ? basePath : `${basePath}/`;
  return `${base}images/academias/${filename}`;
};

const GYM_CAROUSEL_ITEMS: GymCarouselItem[] = [
  {
    id: 'calasans-camargo',
    gymId: 'calasans-camargo',
    name: 'Academia Calasans Camargo',
    city: 'São José dos Campos',
    neighborhood: 'Jardim das Indústrias',
    image: resolveGymPhoto('calasans-carmargo.jpeg'),
  },
  {
    id: 'uniclo',
    gymId: 'unciclo',
    name: 'Academia Uniclo',
    city: 'São José dos Campos',
    neighborhood: 'Monte Castelo',
    image: resolveGymPhoto('uniclo.jpeg'),
  },
  {
    id: 'arena-viking-santa-maria',
    gymId: 'arena-viking-santa-maria',
    name: 'Arena Viking Santa Maria',
    city: 'Jacareí',
    neighborhood: 'Parque Brasil',
    image: resolveGymPhoto('arena-viking-santa-maria.jpeg'),
  },
  {
    id: 'arena-viking-sao-joao',
    gymId: 'arena-viking-sao-joao',
    name: 'Arena Viking São João',
    city: 'Jacareí',
    neighborhood: 'São João',
    image: resolveGymPhoto('arena-viking-sao-joao.jpeg'),
  },
  {
    id: 'ct3-artes-marciais',
    gymId: 'ct3-artes-marciais',
    name: 'CT3 Artes Marciais (CT03)',
    city: 'Jacareí',
    neighborhood: 'Centro',
    image: resolveGymPhoto('ct03.jpeg'),
  },
  {
    id: 'arena-muv',
    gymId: 'arena-muv',
    name: 'Arena MUV',
    city: 'Jacareí',
    neighborhood: 'Jardim Esperança',
    image: resolveGymPhoto('arena-muv.jpeg'),
  },
  {
    id: 'projeto-vg',
    gymId: 'projeto-vg',
    name: 'Projeto VG (Vila Garcia)',
    city: 'Jacareí',
    neighborhood: 'Vila Garcia',
    image: resolveGymPhoto('projeto-vg.jpeg'),
  },
  {
    id: 'studio-m',
    gymId: 'studio-m',
    name: 'Studio M Santa Branca',
    city: 'Santa Branca',
    neighborhood: 'Centro',
    image: resolveGymPhoto('studio-m-santa-branca.jpeg'),
  },
];

interface GymsCarouselProps {
  onSelectGym?: (gymId: string) => void;
}

export const GymsCarousel: React.FC<GymsCarouselProps> = ({ onSelectGym }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const items = GYM_CAROUSEL_ITEMS;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalItems = items.length;

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth >= 1024) {
        setItemsPerPage(3);
      } else if (window.innerWidth >= 640) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, totalItems - itemsPerPage);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 3800);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  const handleCardClick = (gymId: string) => {
    if (onSelectGym) {
      onSelectGym(gymId);
    }
    const targetElement = document.getElementById(`gym-card-${gymId}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetElement.classList.add('ring-2', 'ring-red-500', 'ring-offset-2', 'ring-offset-black');
      setTimeout(() => {
        targetElement.classList.remove('ring-2', 'ring-red-500', 'ring-offset-2', 'ring-offset-black');
      }, 2500);
    }
  };

  return (
    <div 
      className="my-14 sm:my-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#121217] via-[#0e0e13] to-[#0a0a0d] border border-zinc-800/90 shadow-2xl relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Decorative red ambient light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header with Title and Nav Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/50 border border-red-800/50 text-red-400 text-xs font-mono uppercase tracking-wider mb-2.5 font-semibold">
            <Building2 size={13} />
            <span>Estrutura & Tatames Oficiais</span>
          </div>
          <h3 className="font-fight text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-wide leading-none">
            CONHEÇA A ESTRUTURA <span className="text-red-500">DOS NOSSOS POLOS</span>
          </h3>
          <p className="mt-2 text-zinc-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Ambientes preparados para seu desenvolvimento no Muay Thai com tatames de alta absorção, ringue, sacos pesados e manoplas profissionais.
          </p>
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Foto anterior da academia"
            className="p-2.5 rounded-xl bg-zinc-900/90 hover:bg-red-600 text-zinc-300 hover:text-white border border-zinc-800 hover:border-red-500 transition-all duration-200 shadow-md cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Próxima foto da academia"
            className="p-2.5 rounded-xl bg-zinc-900/90 hover:bg-red-600 text-zinc-300 hover:text-white border border-zinc-800 hover:border-red-500 transition-all duration-200 shadow-md cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Carousel Track */}
      <div className="relative overflow-hidden rounded-2xl -mx-2 sm:-mx-3">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => handleCardClick(item.gymId)}
              className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-2 sm:px-3 group cursor-pointer"
            >
              <div className="relative rounded-2xl overflow-hidden border border-zinc-800/90 bg-[#14141a] shadow-lg group-hover:border-red-500/70 group-hover:shadow-[0_0_25px_rgba(220,38,38,0.2)] transition-all duration-300 h-full flex flex-col justify-between">
                
                {/* Photo container with 16:10 aspect ratio */}
                <div className="relative aspect-[16/10] bg-zinc-950 overflow-hidden">
                  <img
                    src={item.image}
                    alt={`Estrutura e tatame da ${item.name}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 filter contrast-105"
                  />
                  
                  {/* Subtle gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-black/20 to-transparent" />
                  
                  {/* City Pill Tag on top-left */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-zinc-700/60 text-zinc-200 font-mono text-[11px] font-semibold uppercase tracking-wider">
                      <MapPin size={11} className="text-red-500" />
                      {item.city}
                    </span>
                  </div>

                  {/* Neighborhood badge on top-right */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-950/80 border border-red-700/60 text-red-300 font-mono text-[10px] uppercase font-semibold">
                      {item.neighborhood}
                    </span>
                  </div>

                  {/* Hover interactive prompt */}
                  <div className="absolute inset-0 bg-red-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white font-fight text-xs uppercase tracking-wider shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <span>Ver Horários & Local</span>
                      <ExternalLink size={12} />
                    </span>
                  </div>
                </div>

                {/* Card Title & Info */}
                <div className="p-4 sm:p-5 flex items-center justify-between gap-3 flex-1">
                  <div>
                    <h4 className="font-fight text-lg sm:text-xl text-white uppercase tracking-wide group-hover:text-red-400 transition-colors leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                      Polo Oficial Pride Muay Thai
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-500 transition-colors flex-shrink-0">
                    <ChevronRight size={16} />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dot Indicators */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Ir para foto ${idx + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              currentIndex === idx
                ? 'w-7 h-2 bg-red-600 shadow-red-glow'
                : 'w-2 h-2 bg-zinc-700 hover:bg-zinc-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
