import React from 'react';
import newBg from '../assets/images/new_user_bg.png';
import desktopBg from '../assets/images/desktop_user_bg.jpg';

export const BackgroundVideo: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-neutral-950">
      {/* Mobile Background Image (Default) */}
      <img
        src={newBg}
        loading="eager"
        // @ts-ignore
        fetchPriority="high"
        decoding="async"
        alt="Project N3 Background Mobile"
        className="absolute inset-0 w-full h-full object-cover object-center z-1 opacity-100 sm:hidden"
      />
      
      {/* Desktop Background Image (Hidden on Mobile) */}
      <img
        src={desktopBg}
        loading="eager"
        // @ts-ignore
        fetchPriority="high"
        decoding="async"
        alt="Project N3 Background Desktop"
        className="absolute inset-0 w-full h-full object-cover object-center z-1 opacity-100 hidden sm:block"
      />

      {/* Subtle dark overlay vignette to ensure contrast & luxury feel */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80 z-2 pointer-events-none" />
    </div>
  );
};
