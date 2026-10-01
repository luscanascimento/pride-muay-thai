import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    // If the user prefers reduced motion or is on mobile touch with small viewport, keep native scroll
    if (prefersReduced) return;

    const lenis = new Lenis({
      lerp: 0.12,
      duration: 1.1,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    const onLenisScroll = () => {
      ScrollTrigger.update();
    };

    lenis.on('scroll', onLenisScroll);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      gsap.ticker.remove(updateTicker);
    };
  }, [prefersReduced]);

  return <>{children}</>;
};
