import React from 'react';
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

export const App: React.FC = () => {
  const [selectedGymId, setSelectedGymId] = React.useState<string | null>(null);

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-[#080809] text-zinc-100 overflow-x-hidden w-full max-w-full relative">
        <SkipLink />
        <Header />
        
        <main id="main-content" tabIndex={-1} className="focus:outline-none overflow-x-hidden w-full max-w-full">
          <Hero />
          <AboutMuayThai />
          <EightWeaponsSection />
          <CombatTechniquesSection />
          <CuriositiesSection />
          <BenefitsSection />
          <TrainingExperienceSection />
          <WhoIsItForSection />
          <TeamPrideSection />
          <TeamSection onSelectGym={(gymId) => setSelectedGymId(gymId)} />
          <LocationsSection selectedGymId={selectedGymId} onSelectGym={setSelectedGymId} />
          <ContactCtaSection />
        </main>

        <Footer />
        <WhatsAppFloat />
      </div>
    </SmoothScrollProvider>
  );
};

export default App;
