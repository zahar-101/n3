import React from 'react';

export const BackgroundVideo: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-neutral-950">
      {/* Background Image from requested source */}
      <img
        src="https://lh3.googleusercontent.com/d/1sE6ZmLtSS9QzfPE6e6vrJ0ums6DgKcuA"
        referrerPolicy="no-referrer"
        loading="eager"
        // @ts-ignore
        fetchPriority="high"
        decoding="async"
        alt="Project N3 Background"
        className="absolute inset-0 w-full h-full object-cover object-center z-1 opacity-100"
      />

      {/* Subtle dark overlay vignette to ensure contrast & luxury feel */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80 z-2 pointer-events-none" />
    </div>
  );
};







