import React from 'react';
import { Translations } from '../types';

interface HeroLeftSidebarProps {
  t: Translations;
}

export const HeroLeftSidebar: React.FC<HeroLeftSidebarProps> = ({ t }) => {
  return (
    <div className="absolute left-6 sm:left-10 md:left-12 top-1/2 -translate-y-1/2 z-20 hidden sm:flex flex-col items-start space-y-10">
      {/* Social Links */}
      <div className="flex flex-col space-y-5 text-left font-montserrat text-xs font-semibold tracking-wide text-neutral-300">
        <a
          href="https://www.instagram.com/project.n3bali?igsh=MXhzMXo2bGN4YmsxNg=="
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors cursor-pointer uppercase"
        >
          {t.socialInstagram}
        </a>
        <a
          href="https://tiktok.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors cursor-pointer uppercase"
        >
          {t.socialTiktok}
        </a>
        <a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors cursor-pointer uppercase"
        >
          {t.socialX}
        </a>
      </div>

      {/* Vertical Scale / Ruler Indicator */}
      <div className="flex flex-col items-center space-y-1.5 pt-8">
        {/* Dash ticks */}
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className={`h-[1px] transition-all duration-300 ${
              i === 3 ? 'w-3.5 bg-neutral-200' : 'w-2 bg-neutral-500/70'
            }`}
          />
        ))}
        {/* Solid vertical line stem below ticks */}
        <div className="w-[1px] h-12 bg-neutral-400/80 mt-2" />
      </div>
    </div>
  );
};

