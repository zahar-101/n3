import React, { useState, useRef, useEffect } from 'react';
import { NavItem, LanguageCode, Translations } from '../types';
import { LANGUAGES } from '../data/languages';
import { Globe, ChevronDown, ShieldCheck } from 'lucide-react';

interface HeroHeaderProps {
  activeNav: NavItem;
  setActiveNav: (nav: NavItem) => void;
  onSelectNavPage: (nav: NavItem) => void;
  onOpenMenu: () => void;
  onOpenAdmin?: () => void;
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  activeNav,
  setActiveNav,
  onSelectNavPage,
  onOpenMenu,
  onOpenAdmin,
  currentLanguage,
  setLanguage,
  t,
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLangObj = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Triple Click Handler on Logo to trigger Admin Modal
  const logoClickCountRef = useRef<number>(0);
  const logoClickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = () => {
    setActiveNav('Home');
    onSelectNavPage('Home');

    logoClickCountRef.current += 1;
    if (logoClickTimerRef.current) {
      clearTimeout(logoClickTimerRef.current);
    }

    if (logoClickCountRef.current >= 3) {
      logoClickCountRef.current = 0;
      if (onOpenAdmin) {
        onOpenAdmin();
      }
    } else {
      logoClickTimerRef.current = setTimeout(() => {
        logoClickCountRef.current = 0;
      }, 900);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-transparent flex items-center justify-between w-full px-6 py-4 sm:px-10 sm:py-5 md:px-12 transition-all duration-300">
      {/* Brand Logo without Frame/Border - Triple Click for Admin */}
      <button
        onClick={handleLogoClick}
        title="PROJECT N3 ORGANIZER - Triple click to open Admin Login"
        className="flex items-center gap-3 group cursor-pointer select-none"
      >
        <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 bg-transparent border-none">
          <img
            src="https://lh3.googleusercontent.com/d/12MtKjruk9v0BX7RbcurEtFSuYOKmME7E"
            alt="PROJECT N3 ORGANIZER Logo"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="eager"
            // @ts-ignore
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="flex flex-col text-left rtl:text-right">
          <span className="font-outfit text-xs sm:text-sm md:text-base font-black text-white tracking-wider leading-none group-hover:text-red-500 transition-colors uppercase">
            PROJECT N3
          </span>
          <span className="font-outfit text-[9px] sm:text-[10px] md:text-xs font-extrabold text-neutral-300 tracking-[0.2em] leading-tight mt-1 uppercase">
            ORGANIZER
          </span>
        </div>
      </button>

      {/* Right Controls Group: Language Selector + Hamburger Menu Button */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Hidden Admin Dashboard Button (accessible via URL/admin state if needed) */}
        {/* Language Selector Icon Button & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            aria-label="Select Language"
            className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl glass-button text-white transition-all duration-300 group shadow-lg cursor-pointer"
          >
            <Globe className="w-5 h-5 text-neutral-200 group-hover:text-white transition-colors" />
          </button>

          {/* Language Dropdown Menu */}
          {isLangOpen && (
            <div className="absolute right-0 mt-2 w-44 py-2 bg-black/80 border border-white/20 rounded-2xl shadow-2xl z-50 animate-fadeIn backdrop-blur-2xl">
              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === currentLanguage;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors text-left cursor-pointer ${
                      isSelected
                        ? 'bg-white/30 text-white font-bold'
                        : 'text-neutral-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center space-x-2.5">
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                    <span className="text-[10px] uppercase font-mono text-neutral-300">{lang.code}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Right Hamburger Button */}
        <button
          onClick={onOpenMenu}
          aria-label="Open menu"
          className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl glass-button transition-all duration-300 group shadow-lg cursor-pointer"
        >
          <div className="flex flex-col justify-between w-5 h-3.5 group-hover:scale-105 transition-transform">
            <span className="w-full h-[2px] bg-neutral-200 rounded-full group-hover:bg-white transition-colors"></span>
            <span className="w-full h-[2px] bg-neutral-200 rounded-full group-hover:bg-white transition-colors"></span>
            <span className="w-full h-[2px] bg-neutral-200 rounded-full group-hover:bg-white transition-colors"></span>
          </div>
        </button>
      </div>
    </header>
  );
};

