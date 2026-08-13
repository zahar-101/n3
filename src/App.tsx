import React, { useState, useRef, useEffect } from 'react';
import { HeroHeader } from './components/HeroHeader';
import { HeroLeftSidebar } from './components/HeroLeftSidebar';
import { HeroRightSidebar } from './components/HeroRightSidebar';
import { HeroContent } from './components/HeroContent';
import { DestinationCards } from './components/DestinationCards';
import { DestinationModal } from './components/DestinationModal';
import { NavigationDrawer } from './components/NavigationDrawer';
import { NavPageDrawer } from './components/NavPageDrawer';
import { BackgroundVideo } from './components/BackgroundVideo';
import { HomePageSections } from './components/HomePageSections';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { Destination, NavItem, LanguageCode } from './types';
import { TRANSLATIONS, LANGUAGES } from './data/languages';
import { ChevronUp } from 'lucide-react';

export default function App() {
  const [activeNav, setActiveNav] = useState<NavItem>('Home');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [activePageDrawer, setActivePageDrawer] = useState<NavItem | null>(null);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  
  // English is the primary main language of the entire site by default
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const currentLangObj = LANGUAGES.find((l) => l.code === currentLanguage);
  const isRtl = currentLangObj?.dir === 'rtl';

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      setShowScrollTop(el.scrollTop > 350);
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectNavPage = (page: NavItem) => {
    if (page === 'Home') {
      setActivePageDrawer(null);
      setActiveNav('Home');
      scrollToTop();
    } else {
      setActivePageDrawer(page);
      setActiveNav(page);
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative min-h-screen w-full bg-black text-white flex items-center justify-center p-2 sm:p-6 md:p-8 font-montserrat overflow-hidden select-none transition-all duration-300"
    >
      {/* Outer Container Frame - Fixed background image with scrollable overlay content */}
      <div
        ref={scrollRef}
        className="relative w-full max-w-[1400px] h-[calc(100vh-1rem)] sm:h-[calc(100vh-3rem)] rounded-[24px] sm:rounded-[32px] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-y-auto overflow-x-hidden scroll-smooth flex flex-col"
      >
        {/* Fixed Background Image stays pinned while scrolling */}
        <div className="sticky top-0 left-0 w-full h-0 z-0 pointer-events-none overflow-visible">
          <div className="relative w-full h-[calc(100vh-1rem)] sm:h-[calc(100vh-3rem)] overflow-hidden rounded-[24px] sm:rounded-[32px]">
            <BackgroundVideo />
          </div>
        </div>

        {/* Sticky Top Header stays pinned across all scroll sections */}
        <div className="sticky top-0 z-50 w-full">
          <HeroHeader
            activeNav={activeNav}
            setActiveNav={setActiveNav}
            onSelectNavPage={handleSelectNavPage}
            onOpenMenu={() => setIsMenuOpen(true)}
            onOpenAdmin={() => setIsAdminOpen(true)}
            currentLanguage={currentLanguage}
            setLanguage={setCurrentLanguage}
            t={t}
          />
        </div>

        {/* Full Viewport First Fold (Hero Section) */}
        <div className="relative z-10 w-full min-h-[calc(100vh-6rem)] sm:min-h-[calc(100vh-8rem)] flex flex-col justify-between flex-shrink-0">
          {/* Main Content Area - Clean Background View */}
          <div className="relative flex-1 flex flex-col items-center justify-center my-auto w-full z-10 py-6 sm:py-10 pointer-events-none" />
        </div>

        {/* Homepage Sections Below Fold */}
        <div className="relative z-10">
          <HomePageSections
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            t={t}
            currentLanguage={currentLanguage}
          />
        </div>
      </div>

      {/* Destination Detail Modal */}
      <DestinationModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
        t={t}
      />

      {/* Full Page View for Services, Portfolio, About Us */}
      <NavPageDrawer
        activePage={activePageDrawer}
        onClose={() => setActivePageDrawer(null)}
        onSelectNavPage={handleSelectNavPage}
        currentLanguage={currentLanguage}
        setLanguage={setCurrentLanguage}
        onOpenMenu={() => setIsMenuOpen(true)}
        t={t}
      />

      {/* Navigation Drawer */}
      <NavigationDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onOpenNavPage={(page) => setActivePageDrawer(page)}
        t={t}
      />

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentLanguage={currentLanguage}
      />

      {/* Floating Smooth Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-40 p-3 rounded-full bg-red-600/90 hover:bg-red-500 text-white shadow-[0_4px_20px_rgba(220,38,38,0.6)] backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer animate-fadeIn"
        >
          <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}
    </div>
  );
}



