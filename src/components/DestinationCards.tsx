import React from 'react';
import { motion } from 'motion/react';
import { Destination, Translations } from '../types';
import { DESTINATIONS } from '../data/destinations';
import { MapPin } from 'lucide-react';

interface DestinationCardsProps {
  onSelectDestination: (dest: Destination) => void;
  selectedDestinationId?: string;
  t: Translations;
}

export const DestinationCards: React.FC<DestinationCardsProps> = ({
  onSelectDestination,
  selectedDestinationId,
  t,
}) => {
  return (
    <div className="relative z-20 w-full max-w-5xl mx-auto px-4 pb-8 sm:pb-10 md:pb-12 mt-auto">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
        {DESTINATIONS.map((item, idx) => {
          const isSelected = selectedDestinationId === item.id;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
              onClick={() => onSelectDestination(item)}
              className={`glass-card relative flex items-center p-3.5 sm:p-4 rounded-xl sm:rounded-2xl text-left transition-all duration-300 group cursor-pointer ${
                isSelected
                  ? 'border-white/40 bg-[#2d2d32] shadow-[0_8px_24px_rgba(0,0,0,0.6)]'
                  : 'hover:scale-[1.02]'
              }`}
            >
              {/* Map Pin Icon */}
              <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/5 border border-white/10 text-neutral-300 group-hover:text-white group-hover:bg-white/10 transition-colors mr-3 shrink-0">
                <MapPin className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </div>

              {/* Text Info */}
              <div className="flex flex-col min-w-0">
                <span className="font-montserrat text-xs sm:text-sm font-semibold text-white tracking-wide rtl:tracking-normal truncate group-hover:text-white transition-colors">
                  {item.name}
                </span>
                <span className="font-montserrat text-[11px] text-neutral-400 font-normal">
                  {t.placeToBe}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

