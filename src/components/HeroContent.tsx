import React from 'react';
import { Translations } from '../types';
import n3Logo from '../assets/images/new_user_logo.jpg';

interface HeroContentProps {
  t: Translations;
}

export const HeroContent: React.FC<HeroContentProps> = ({ t }) => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 my-auto select-none">
      {/* Side-by-side Logo and Brand Text Container */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 my-auto animate-float-slow">
        {/* N3 Logo Emblem beside the text */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 shrink-0 rounded-full p-1 bg-gradient-to-b from-red-600/60 via-red-500/20 to-transparent border border-red-500/60 shadow-[0_0_40px_rgba(220,38,38,0.85)] overflow-hidden">
          <img
            src={n3Logo}
            alt="N3 Logo"
            className="w-full h-full object-cover rounded-full drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            loading="eager"
            // @ts-ignore
            fetchPriority="high"
            decoding="async"
          />
        </div>

        {/* Text Group Beside Logo: Red PROJECT N3 on top, White ORGANIZER below */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          {/* Red PROJECT N3 Title */}
          <h1 className="font-outfit text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-wider uppercase leading-none text-red-600 drop-shadow-[0_4px_30px_rgba(220,38,38,0.8)]">
            {t.eyebrow || 'PROJECT N3'}
          </h1>

          {/* White ORGANIZER Title directly below PROJECT N3 */}
          <h2 className="font-outfit text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[0.2em] uppercase leading-none mt-2 sm:mt-3 text-white drop-shadow-[0_4px_20px_rgba(255,255,255,0.4)]">
            {t.title || 'ORGANIZER'}
          </h2>
        </div>
      </div>

      {/* Subtitle / Tagline below */}
      <p className="mt-4 sm:mt-6 text-xs sm:text-sm md:text-base font-montserrat font-bold tracking-[0.25em] sm:tracking-[0.4em] text-neutral-300 uppercase max-w-xl">
        {t.subtitle || 'VIP Event Curation & Luxury Lifestyle Management'}
      </p>
    </div>
  );
};
