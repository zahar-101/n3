import React, { useState } from 'react';
import { NavItem, Translations } from '../types';
import { X, MapPin, Mountain, Compass, Home as HomeIcon, Send, CheckCircle2, Mail, User, MessageSquare, MessageCircle, Instagram } from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeNav: NavItem;
  setActiveNav: (nav: NavItem) => void;
  onOpenNavPage: (page: NavItem) => void;
  t: Translations;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  activeNav,
  setActiveNav,
  onOpenNavPage,
  t,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;

    try {
      const existingMsgsStr = localStorage.getItem('n3_contact_messages');
      const existingMsgs = existingMsgsStr ? JSON.parse(existingMsgsStr) : [];
      const newMsg = {
        id: 'msg_' + Date.now(),
        firstName: firstName.trim() || 'زائر',
        lastName: lastName.trim() || '',
        email: email.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString(),
        read: false,
      };
      const updatedMsgs = [newMsg, ...existingMsgs];
      localStorage.setItem('n3_contact_messages', JSON.stringify(updatedMsgs));
      window.dispatchEvent(new Event('n3_content_updated'));
    } catch (err) {
      console.error('Error saving contact message:', err);
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFirstName('');
      setLastName('');
      setEmail('');
      setMessage('');
    }, 4000);
  };

  const navGridItems = [
    {
      navKey: 'Home' as NavItem,
      title: t.navHome,
      subtitle: t.mainShowcase,
      icon: HomeIcon,
    },
    {
      navKey: 'Destinations' as NavItem,
      title: t.navDestinations,
      subtitle: t.vipConciergeSub,
      icon: MapPin,
    },
    {
      navKey: 'Activities' as NavItem,
      title: t.navActivities,
      subtitle: t.eventsPortfolioSub,
      icon: Mountain,
    },
  ];

  const handleWhatsApp = () => {
    window.open('https://wa.me/62895336689599', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fadeIn overflow-hidden touch-pan-y overscroll-x-none">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Glass Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-black/50 backdrop-blur-3xl border-l border-white/15 p-5 sm:p-7 flex flex-col justify-between overflow-x-hidden overflow-y-auto touch-pan-y overscroll-x-none z-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-6">
        
        {/* Glow ambient background elements inside drawer */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <span className="text-xs sm:text-sm font-black tracking-wider text-white uppercase block">
              PROJECT N3 ORGANIZER
            </span>
          </div>
          
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-300 cursor-pointer hover:scale-105"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Navigation Grid */}
        <div className="relative z-10 space-y-3">
          <span className="block text-[10px] font-bold uppercase tracking-wider rtl:tracking-normal text-white">
            {t.menuTitle}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {navGridItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.navKey;

              return (
                <button
                  key={item.navKey}
                  onClick={() => {
                    setActiveNav(item.navKey);
                    onOpenNavPage(item.navKey);
                    onClose();
                  }}
                  className={`group relative flex items-center gap-2.5 py-2.5 px-3 rounded-xl transition-all duration-300 cursor-pointer border text-left rtl:text-right overflow-hidden ${
                    isActive
                      ? 'bg-white/20 border-white/60 text-white shadow-sm scale-[1.02]'
                      : 'bg-white/5 border-white/10 hover:bg-white/12 hover:border-white/40 text-neutral-200 hover:text-white hover:scale-[1.02]'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-all duration-300 flex-shrink-0 ${
                    isActive 
                      ? 'bg-white text-black' 
                      : 'bg-white/10 text-white group-hover:bg-white/20 group-hover:text-white'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="relative z-10 min-w-0 flex-1">
                    <span className="block text-xs font-extrabold tracking-wide rtl:tracking-normal text-white truncate">
                      {item.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Side Drawer Contact Form Section */}
        <div className="relative z-10 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-white">
            <Mail className="w-4 h-4 text-white" />
            <h3 className="text-xs font-bold uppercase tracking-wider rtl:tracking-normal text-white">
              {t.contactTitle}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* First Name & Last Name Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="block text-[10px] font-medium text-neutral-300">
                  {t.contactFirstName}
                </label>
                <div className="relative flex items-center">
                  <User className="w-3 h-3 text-neutral-400 absolute left-2.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={t.contactFirstName}
                    className="w-full bg-black/50 border border-white/15 rounded-lg pl-7 pr-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-medium text-neutral-300">
                  {t.contactLastName}
                </label>
                <div className="relative flex items-center">
                  <User className="w-3 h-3 text-neutral-400 absolute left-2.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={t.contactLastName}
                    className="w-full bg-black/50 border border-white/15 rounded-lg pl-7 pr-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="block text-[10px] font-medium text-neutral-300">
                {t.contactEmail}
              </label>
              <div className="relative flex items-center">
                <Mail className="w-3 h-3 text-neutral-400 absolute left-2.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.contactEmail}
                  className="w-full bg-black/50 border border-white/15 rounded-lg pl-7 pr-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label className="block text-[10px] font-medium text-neutral-300">
                {t.contactMessage}
              </label>
              <div className="relative">
                <MessageSquare className="w-3 h-3 text-neutral-400 absolute left-2.5 top-2.5 pointer-events-none" />
                <textarea
                  required
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.contactMessage}
                  className="w-full bg-black/50 border border-white/15 rounded-lg pl-7 pr-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-sky-400 resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 px-3 rounded-lg bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider rtl:tracking-normal shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-black" />
              <span>{t.contactSubmit}</span>
            </button>

            {isSubmitted && (
              <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold text-center flex items-center justify-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.contactSuccess}</span>
              </div>
            )}
          </form>
        </div>

        {/* 3 Contact Icons: Instagram, WhatsApp, Email */}
        <div className="relative z-10 pt-4 border-t border-white/10 space-y-3">
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <a
              href="https://www.instagram.com/project.n3bali?igsh=MXhzMXo2bGN4YmsxNg=="
              target="_blank"
              rel="noreferrer"
              title="Instagram: @project.n3bali"
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-pink-500/20 border border-white/10 hover:border-pink-500/50 text-white transition-all duration-300 hover:scale-105 group"
            >
              <Instagram className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-bold tracking-wider text-neutral-300 group-hover:text-white uppercase">Instagram</span>
            </a>

            <a
              href="https://wa.me/62895336689599"
              target="_blank"
              rel="noreferrer"
              title="WhatsApp: +62 895 3366 89599"
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/50 text-white transition-all duration-300 hover:scale-105 group"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-bold tracking-wider text-neutral-300 group-hover:text-white uppercase">WhatsApp</span>
            </a>

            <a
              href="mailto:creativegrouplimabersama@gmail.com"
              title="Email: creativegrouplimabersama@gmail.com"
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 text-white transition-all duration-300 hover:scale-105 group"
            >
              <Mail className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-bold tracking-wider text-neutral-300 group-hover:text-white uppercase">Email</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};


