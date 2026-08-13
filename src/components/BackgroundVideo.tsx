import React, { useState } from 'react';
import bgDesktop from '../assets/images/hero_bg_desktop_1786630825177.jpg';
import bgMobile from '../assets/images/hero_bg_mobile_1786630838513.jpg';

export const BackgroundVideo: React.FC = () => {
  const [deskStage, setDeskStage] = useState<number>(0);
  const [mobStage, setMobStage] = useState<number>(0);

  // Exact Google Drive background image sources requested by the user:
  // Mobile & Tablet: https://drive.google.com/file/d/1-AEFX75BG9fk80xyGNQxXRlgN6WlpkTe
  // Desktop: https://drive.google.com/file/d/1rRn0Eyf3bBfcKd_vP_PzQgR3xiDRIYSY
  const desktopSources = [
    'https://drive.google.com/thumbnail?id=1rRn0Eyf3bBfcKd_vP_PzQgR3xiDRIYSY&sz=w1920',
    'https://lh3.googleusercontent.com/d/1rRn0Eyf3bBfcKd_vP_PzQgR3xiDRIYSY',
    bgDesktop,
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1920&q=80',
  ];

  const mobileSources = [
    'https://drive.google.com/thumbnail?id=1-AEFX75BG9fk80xyGNQxXRlgN6WlpkTe&sz=w1000',
    'https://lh3.googleusercontent.com/d/1-AEFX75BG9fk80xyGNQxXRlgN6WlpkTe',
    bgMobile,
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80',
  ];

  const deskSrc = desktopSources[deskStage] || bgDesktop;
  const mobSrc = mobileSources[mobStage] || bgMobile;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-neutral-950">
      {/* Instant Premium Background Gradient Placeholder before image renders */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 via-neutral-950 to-black z-0" />

      {/* Mobile & Tablet Background Image - Rendered instantly without opacity blocking */}
      <img
        src={mobSrc}
        referrerPolicy="no-referrer"
        loading="eager"
        // @ts-ignore
        fetchPriority="high"
        decoding="async"
        alt="Mobile Background"
        onError={() => {
          if (mobStage < mobileSources.length - 1) {
            setMobStage((prev) => prev + 1);
          }
        }}
        className="block lg:hidden absolute inset-0 w-full h-full object-cover object-center z-1 opacity-100"
      />

      {/* Desktop Background Image - Rendered instantly without opacity blocking */}
      <img
        src={deskSrc}
        referrerPolicy="no-referrer"
        loading="eager"
        // @ts-ignore
        fetchPriority="high"
        decoding="async"
        alt="Desktop Background"
        onError={() => {
          if (deskStage < desktopSources.length - 1) {
            setDeskStage((prev) => prev + 1);
          }
        }}
        className="hidden lg:block absolute inset-0 w-full h-full object-cover object-center scale-105 z-1 opacity-100"
      />

      {/* Elegant gradient overlay vignette to ensure contrast & readability of foreground content */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 z-2 pointer-events-none" />
    </div>
  );
};





