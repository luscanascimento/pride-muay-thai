import React, { useState, useEffect, useCallback } from 'react';
import { SmoothScrollProvider } from './components/motion/SmoothScrollProvider';
import { AuthProvider } from './contexts/AuthContext';
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
import { StudentsPage } from './components/pages/StudentsPage';
import { StudentDetailPage } from './components/pages/StudentDetailPage';
import { AdminRoute } from './components/admin/AdminRoute';
import { AdminLoginPage } from './components/pages/AdminLoginPage';
import { AdminDashboardPage } from './components/pages/AdminDashboardPage';
import { EventsAdmin } from './components/admin/EventsAdmin';
import { EventForm } from './components/admin/EventForm';
import { StudentsAdmin } from './components/admin/StudentsAdmin';
import { StudentForm } from './components/admin/StudentForm';
import { UsersAdmin } from './components/admin/UsersAdmin';
import { GraduationRegistrationsAdmin } from './components/admin/GraduationRegistrationsAdmin';
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
    <AuthProvider>
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
            ) : currentRoute.type === 'students-list' ? (
              <StudentsPage initialSearchParams={currentRoute.searchParams} />
            ) : currentRoute.type === 'student-detail' ? (
              <StudentDetailPage slug={currentRoute.slug} />
            ) : currentRoute.type === 'admin-login' ? (
              <AdminLoginPage />
            ) : currentRoute.type === 'admin-dashboard' ? (
              <AdminRoute currentPath="/admin">
                <AdminDashboardPage />
              </AdminRoute>
            ) : currentRoute.type === 'admin-events-list' ? (
              <AdminRoute currentPath="/admin/eventos">
                <EventsAdmin />
              </AdminRoute>
            ) : currentRoute.type === 'admin-event-create' ? (
              <AdminRoute currentPath="/admin/eventos">
                <EventForm />
              </AdminRoute>
            ) : currentRoute.type === 'admin-event-edit' ? (
              <AdminRoute currentPath="/admin/eventos">
                <EventForm eventId={currentRoute.id} />
              </AdminRoute>
            ) : currentRoute.type === 'admin-students-list' ? (
              <AdminRoute currentPath="/admin/alunos">
                <StudentsAdmin />
              </AdminRoute>
            ) : currentRoute.type === 'admin-graduation-registrations' ? (
              <AdminRoute currentPath="/admin/graduacoes">
                <GraduationRegistrationsAdmin initialSearchParams={currentRoute.searchParams} />
              </AdminRoute>
            ) : currentRoute.type === 'admin-users-list' ? (
              <AdminRoute currentPath="/admin/usuarios" requiredRole="super_admin">
                <UsersAdmin />
              </AdminRoute>
            ) : currentRoute.type === 'admin-student-create' ? (
              <AdminRoute currentPath="/admin/alunos">
                <StudentForm />
              </AdminRoute>
            ) : currentRoute.type === 'admin-student-detail' || currentRoute.type === 'admin-student-edit' ? (
              <AdminRoute currentPath="/admin/alunos">
                <StudentForm studentId={currentRoute.id} />
              </AdminRoute>
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
    </AuthProvider>
  );
};

export default App;
