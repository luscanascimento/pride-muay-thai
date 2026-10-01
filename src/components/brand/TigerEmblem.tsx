import React, { useState } from 'react';
import prideLogoCutout from '../../assets/pride-muay-thai-cutout.png';

interface TigerEmblemProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  showEyesGlow?: boolean;
  interactive?: boolean;
}

export const TigerEmblem: React.FC<TigerEmblemProps> = ({
  size = 'md',
  className = '',
  showEyesGlow = true,
  interactive = true,
}) => {
  const [isRoaring, setIsRoaring] = useState(false);

  const sizeClasses = {
    sm: 'w-20 h-20 sm:w-24 sm:h-24',
    md: 'w-40 h-40 sm:w-56 sm:h-56',
    lg: 'w-52 h-52 sm:w-80 sm:h-80',
    hero: 'w-52 h-52 sm:w-72 sm:h-72 md:w-88 md:h-88 lg:w-[390px] lg:h-[390px] max-w-full max-h-[42vh]',
  }[size];

  const handleRoar = () => {
    if (!interactive || isRoaring) return;
    setIsRoaring(true);
    setTimeout(() => setIsRoaring(false), 1200);
  };

  return (
    <div
      onClick={handleRoar}
      className={`relative flex items-center justify-center select-none ${interactive ? 'cursor-pointer' : ''} ${className}`}
      title={interactive ? 'Pride Muay Thai — Sinta a força dos Tigres' : 'Pride Muay Thai'}
    >
      {/* Container maintaining aspect ratio */}
      <div className={`relative ${sizeClasses} transition-transform duration-500 ease-out hover:scale-[1.02]`}>
        {/* Outer ambient glow */}
        <div className="absolute inset-0 rounded-full bg-red-600/15 blur-2xl pointer-events-none transform scale-110 animate-pulse-slow" />

        {/* Visual roar shockwave ripples */}
        {isRoaring && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping pointer-events-none duration-1000 opacity-75" />
            <div className="absolute -inset-4 rounded-full border border-red-600 animate-ping pointer-events-none duration-700 opacity-60 delay-150" />
          </>
        )}

        {/* Rotating concentric traditional ring line */}
        <div
          className="absolute inset-[-6%] rounded-full border border-red-600/30 border-dashed pointer-events-none"
          style={{
            animation: 'spin 40s linear infinite',
          }}
        />

        <img
          src={prideLogoCutout}
          alt="Pride Muay Thai — Tigres Sak Yant Renan Hulkinho"
          className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
          loading="eager"
          decoding="async"
        />

        {/* Tiger Eyes Crimson Glow */}
        {showEyesGlow && (
          <>
            {/* Left Tiger Eye */}
            <div
              className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: '27.96%', top: '65.77%' }}
            >
              <span className="block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ff1e27,0_0_16px_#ff1e27] animate-pulse" />
            </div>

            {/* Right Tiger Eye */}
            <div
              className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: '72.04%', top: '65.77%' }}
            >
              <span className="block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ff1e27,0_0_16px_#ff1e27] animate-pulse" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
