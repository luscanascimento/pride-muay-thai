import React, { useState, useEffect, useCallback } from 'react';
import { SmoothScrollProvider } from './components/motion/SmoothScrollProvider';
import { SkipLink } from './components/ui/SkipLink';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { AboutMuayThai } from './components/sections/AboutMuayThai';
import { EightWeaponsSection } from './components/sections/EightWeaponsSection';
import { CombatTechniquesSection } from './components/sections/CombatTechniquesSection';
import { CuriositiesSection } from './components/sections/CuriositiesSection';
import { BenefitsSection } from './components/sections/BenefitsSection';
import { TrainingExperienceSection } from './components/sections/TrainingExperienceSection';
import { WhoIsItForSection } from './components/sections/WhoIsItForSection';
import { TeamPrideSection } from './components/sections/TeamPrideSection';
import { TeamSection } from './components/sections/TeamSection';
import { LocationsSection } from './components/sections/LocationsSection';
import { ContactCtaSection } from './components/sections/ContactCtaSection';
import { WhatsAppFloat } from './components/ui/WhatsAppFloat';
import { ProfessorDetailPage } from './components/pages/ProfessorDetailPage';
import { getProfessorById } from './data/gymsAndTeamData';

export const App: React.FC = () => {
  const [selectedGymId, setSelectedGymId] = useState<string | null>(null);
  const [currentProfessorId, setCurrentProfessorId] = useState<string | null>(null);

  // Sync routing with window.location.hash (GitHub Pages compatible)
  useEffect(() => {
    const parseHashRoute = () => {
      const hash = window.location.hash;
      const match = hash.match(/^#\/(?:professores|professor)\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        const profId = match[1];
        if (getProfessorById(profId)) {
          setCurrentProfessorId(profId);
          return;
        }
      }

      setCurrentProfessorId((prev) => {
        if (prev !== null && hash && !hash.startsWith('#/')) {
          // Navigated from professor detail to an anchor on landing page
          setTimeout(() => {
            const targetId = hash.replace(/^#/, '');
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          }, 60);
        }
        return null;
      });
    };

    parseHashRoute();
    window.addEventListener('hashchange', parseHashRoute);
    return () => window.removeEventListener('hashchange', parseHashRoute);
  }, []);

  const handleViewProfessor = useCallback((profId: string) => {
    setCurrentProfessorId(profId);
    window.location.hash = `#/professores/${profId}`;
  }, []);

  const handleBackToTeam = useCallback(() => {
    setCurrentProfessorId(null);
    window.location.hash = '#nossa-equipe';
    setTimeout(() => {
      const el = document.getElementById('nossa-equipe');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  }, []);

  const selectedProfessor = currentProfessorId ? getProfessorById(currentProfessorId) : undefined;

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-[#080809] text-zinc-100 overflow-x-hidden w-full max-w-full relative">
        <SkipLink />
        <Header />
        
        <main id="main-content" tabIndex={-1} className="focus:outline-none overflow-x-hidden w-full max-w-full">
          {selectedProfessor ? (
            <ProfessorDetailPage
              professor={selectedProfessor}
              onBack={handleBackToTeam}
              onNavigateToProfessor={handleViewProfessor}
            />
          ) : (
            <>
              <Hero />
              <AboutMuayThai />
              <EightWeaponsSection />
              <CombatTechniquesSection />
              <CuriositiesSection />
              <BenefitsSection />
              <TrainingExperienceSection />
              <WhoIsItForSection />
              <TeamPrideSection />
              <TeamSection
                onSelectGym={(gymId) => setSelectedGymId(gymId)}
                onViewProfessor={handleViewProfessor}
              />
              <LocationsSection selectedGymId={selectedGymId} onSelectGym={setSelectedGymId} />
              <ContactCtaSection />
            </>
          )}
        </main>

        <Footer />
        <WhatsAppFloat />
      </div>
    </SmoothScrollProvider>
  );
};

export default App;
