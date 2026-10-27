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
import { DeveloperPage } from './components/pages/DeveloperPage';
import { EventsPage } from './components/pages/EventsPage';
import { EventDetailPage } from './components/pages/EventDetailPage';
import { getProfessorById } from './data/gymsAndTeamData';
import { AppRoute } from './types/routes';
import { parseHashRoute, navigateTo } from './utils/routes';

export const App: React.FC = () => {
  const [selectedGymId, setSelectedGymId] = useState<string | null>(null);
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => parseHashRoute(window.location.hash));

  // Sync routing with window.location.hash
  useEffect(() => {
    const handleHashChange = () => {
      const nextRoute = parseHashRoute(window.location.hash);
      setCurrentRoute(nextRoute);

      if (nextRoute.type === 'home' && nextRoute.anchor) {
        setTimeout(() => {
          const targetEl = document.getElementById(nextRoute.anchor!);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }, 60);
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    // Initial check for anchor scroll
    if (currentRoute.type === 'home' && currentRoute.anchor) {
      setTimeout(() => {
        const targetEl = document.getElementById(currentRoute.anchor!);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentRoute]);

  const handleViewProfessor = useCallback((profId: string) => {
    navigateTo(`/professores/${profId}`);
  }, []);

  const handleBackToTeam = useCallback(() => {
    navigateTo('nossa-equipe');
  }, []);

  const handleBackToHome = useCallback(() => {
    navigateTo('', { smoothScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const selectedProfessor =
    currentRoute.type === 'professor-detail'
      ? getProfessorById(currentRoute.professorId)
      : undefined;

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-[#080809] text-zinc-100 overflow-x-hidden w-full max-w-full relative">
        <SkipLink />
        <Header />
        
        <main id="main-content" tabIndex={-1} className="focus:outline-none overflow-x-hidden w-full max-w-full">
          {currentRoute.type === 'developer' ? (
            <DeveloperPage onBack={handleBackToHome} />
          ) : currentRoute.type === 'events-list' ? (
            <EventsPage initialSearchParams={currentRoute.searchParams} />
          ) : currentRoute.type === 'event-detail' ? (
            <EventDetailPage slug={currentRoute.slug} />
          ) : selectedProfessor ? (
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
