import React from 'react';
import { Destination, Translations } from '../types';
import { X, MapPin, Thermometer, Compass, Sparkles, ArrowRight } from 'lucide-react';

interface DestinationModalProps {
  destination: Destination | null;
  onClose: () => void;
  t: Translations;
}

export const DestinationModal: React.FC<DestinationModalProps> = ({
  destination,
  onClose,
  t,
}) => {
  if (!destination) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md transition-all duration-300 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-black/60 backdrop-blur-2xl border border-white/20 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full glass-button text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image Header */}
        <div className="relative h-56 sm:h-72 w-full overflow-hidden">
          <img
            src={destination.imageUrl}
            referrerPolicy="no-referrer"
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#16161a] via-[#16161a]/40 to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <span className="text-xs font-semibold tracking-widest rtl:tracking-normal text-white uppercase font-bold">
                {destination.region}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                {destination.name}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium text-neutral-200">
              <Thermometer className="w-3.5 h-3.5 text-white" />
              <span>{destination.temperature}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Coordinates & Region */}
          <div className="flex items-center gap-2 text-xs text-neutral-300 font-mono">
            <Compass className="w-4 h-4 text-neutral-300" />
            <span>{destination.coordinates}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-neutral-300 leading-relaxed">
            {destination.description}
          </p>

          {/* Highlights */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold tracking-wider rtl:tracking-normal text-white uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              {t.topHighlights}
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {destination.highlights.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <MapPin className="w-4 h-4 text-white" />
              <span>{t.vipGuideTag}</span>
            </div>
            <a
              href={`https://wa.me/62895336689599?text=${encodeURIComponent('Hello PROJECT ORGANIZER, I want to plan a trip to: ' + destination.name)}`}
              target="_blank"
              rel="noreferrer"
              onClick={onClose}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-neutral-200 transition-all cursor-pointer"
            >
              <span>{t.planTrip}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

