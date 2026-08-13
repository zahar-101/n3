import React from 'react';

export const HeroRightSidebar: React.FC = () => {
  return (
    <div className="absolute right-6 sm:right-10 md:right-12 top-1/2 -translate-y-1/2 z-20 hidden sm:flex flex-col items-center">
      {/* Right side thin vertical line with active marker */}
      <div className="relative w-[1.5px] h-36 bg-neutral-800/90 rounded-full overflow-hidden">
        {/* Top Active Segment (White/Orange highlight as seen in screenshot) */}
        <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-white via-neutral-200 to-amber-500/80 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
      </div>
    </div>
  );
};
