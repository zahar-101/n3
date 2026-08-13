import React from 'react';
import { motion } from 'motion/react';
import { NavItem, LanguageCode, Translations } from '../types';
import { HeroHeader } from './HeroHeader';
import { Sparkles, CheckCircle2, Star, ShieldCheck, PhoneCall, Mail, CalendarCheck, Building2, Ticket, Activity, Music, Sliders, Camera, MessageCircle, Instagram, Users } from 'lucide-react';

interface NavPageDrawerProps {
  activePage: NavItem | null;
  onClose: () => void;
  onSelectNavPage: (nav: NavItem) => void;
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  onOpenMenu: () => void;
  t: Translations;
}

export const NavPageDrawer: React.FC<NavPageDrawerProps> = ({
  activePage,
  onClose,
  onSelectNavPage,
  currentLanguage,
  setLanguage,
  onOpenMenu,
  t,
}) => {
  if (!activePage || activePage === 'Home') return null;

  const getPageTitle = () => {
    switch (activePage) {
      case 'Destinations':
        return t.navDestinations;
      case 'Activities':
        return t.navActivities;
      case 'About Us':
        return t.navAboutUs;
      default:
        return '';
    }
  };

  const getHeaderImage = () => {
    switch (activePage) {
      case 'Destinations':
        return 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80';
      case 'Activities':
        return 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1600&q=80';
      case 'About Us':
        return 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80';
      default:
        return 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0c0c0e] text-white overflow-y-auto animate-fadeIn min-h-screen w-full">
      
      {/* Hero Section Banner with Overlay transparent header */}
      <div className="relative w-full h-[340px] sm:h-[400px] md:h-[450px] overflow-hidden flex flex-col justify-between flex-shrink-0">
        {/* Background image & gradient overlay */}
        <img
          src={getHeaderImage()}
          alt={getPageTitle()}
          className="absolute inset-0 w-full h-full object-cover filter brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#0c0c0e]" />

        {/* Transparent Top Header Bar */}
        <div className="relative z-30 w-full bg-transparent">
          <HeroHeader
            activeNav={activePage}
            setActiveNav={(nav) => {
              if (nav === 'Home') {
                onClose();
              } else {
                onSelectNavPage(nav);
              }
            }}
            onSelectNavPage={(nav) => {
              if (nav === 'Home') {
                onClose();
              } else {
                onSelectNavPage(nav);
              }
            }}
            onOpenMenu={onOpenMenu}
            currentLanguage={currentLanguage}
            setLanguage={setLanguage}
            t={t}
          />
        </div>

        {/* Centered Title text over Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center px-6 max-w-3xl mx-auto my-auto pb-8"
        >
          <span className="block text-xs sm:text-sm font-bold tracking-[0.3em] rtl:tracking-normal text-white uppercase mb-2 drop-shadow-md">
            {t.brandName}
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-wide drop-shadow-2xl">
            {getPageTitle()}
          </h1>
          <div className="w-20 h-1 bg-white mx-auto mt-4 rounded-full" />
        </motion.div>
      </div>

      {/* Main Page Scrollable Body Content */}
      <div className="max-w-6xl mx-auto w-full px-6 py-8 sm:py-12 flex-1 space-y-10">
        {activePage === 'Destinations' && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
              className="text-center max-w-3xl mx-auto space-y-3"
            >
              <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-medium">
                {t.destinationsPageSubtitle}
              </p>
            </motion.div>
            
            {/* Grid of Section #05 Services with high quality images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              {(() => {
                let dynamicServices = null;
                try {
                  const saved = localStorage.getItem('n3_custom_services_list');
                  if (saved) {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                      dynamicServices = parsed
                        .filter((item: any) => item.active !== false)
                        .map((item: any, idx: number) => ({
                          title: currentLanguage === 'ar' ? (item.titleAr || item.titleEn) : (item.titleEn || item.titleAr),
                          num: String(idx + 1).padStart(2, '0'),
                          desc: currentLanguage === 'ar' ? (item.descAr || item.descEn) : (item.descEn || item.descAr),
                          image: item.imageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
                        }));
                    }
                  }
                } catch (e) {
                  console.error(e);
                }

                const fallbackList = currentLanguage === 'ar' ? [
                  {
                    title: 'تخطيط وإدارة الفعاليات',
                    num: '01',
                    desc: 'إدارة شاملة للفعاليات من المفهوم الأولي، الميزانية، اختيار الموردين وحتى التنفيذ الميداني المباشر.',
                    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'الفعاليات المؤسسية',
                    num: '02',
                    desc: 'حفلات عشاء رسمية، اجتماعات تنفيذية، إطلاق منتجات، وملاذات الشركات ورعايات العلامات.',
                    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'الفعاليات الخاصة',
                    num: '03',
                    desc: 'احتفالات أعياد ميلاد مخصصة، ذكرى سنوية، حفلات فيلات فاخرة، وتجمعات خاصة بكبار الشخصيات.',
                    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'المهرجانات والمعارض',
                    num: '04',
                    desc: 'مهرجانات موسيقية كبرى، معارض ثقافية، استعراض المنتجات، ومعارض تجارية مفتوحة.',
                    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'الرياضة والصحة',
                    num: '05',
                    desc: 'مسابقات لياقة بدنية، سباقات ممتعة، جلسات يوغا، وبطولات رياضية مخصصة.',
                    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'البرامج الترفيهية',
                    num: '06',
                    desc: 'حفلات موسيقية حية، عروض دي جيه، استعراضات مسرحية، ومؤثرات ضوئية فائقة الجودة.',
                    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'إنتاج الفعاليات',
                    num: '07',
                    desc: 'تصميم المسارح، الهندسة الصوتية، شاشات LED، تصميم الإضاءة، والتجهيز الفني في الموقع.',
                    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'الإعلام والتوثيق',
                    num: '08',
                    desc: 'تصوير فوتوغرافي احترافي، توثيق فيديو بدقة 4K، تصوير درون جوي، وإنتاج إعلامي متكامل.',
                    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
                  },
                ] : currentLanguage === 'ru' ? [
                  {
                    title: 'ОРГАНИЗАЦИЯ И МЕНЕДЖМЕНТ СОБЫТИЙ',
                    num: '01',
                    desc: 'Комплексное управление событием: концепция, планирование, кейтеринг и координация на площадке.',
                    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'КОРПОРАТИВНЫЕ МЕРОПРИЯТИЯ',
                    num: '02',
                    desc: 'Гала-ужины, встречи директоров, презентации продуктов и корпоративные ретриты.',
                    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'ЧАСТНЫЕ ТОРЖЕСТВА',
                    num: '03',
                    desc: 'Дни рождения, юбилеи, закрытые праздники на виллах и особые даты.',
                    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'ФЕСТИВАЛИ И ВЫСТАВКИ',
                    num: '04',
                    desc: 'Масштабные музыкальные фестивали, выставки, презентации и поп-ап пространства.',
                    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'СПОРТ И WELLNESS',
                    num: '05',
                    desc: 'Фитнес-соревнования, марафоны, йога-ретриты и спортивные чемпионаты.',
                    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'ШОУ И РАЗВЛЕЧЕНИЯ',
                    num: '06',
                    desc: 'Концерты, выступление DJ, артистов, световые и сценические шоу.',
                    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'ТЕХНИЧЕСКИЙ ПРОДАКШН',
                    num: '07',
                    desc: 'Сцена, звук, LED экраны, световой дизайн и инженерная подготовка.',
                    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'МЕДИАСЪЕМКА И ДОКУМЕНТАЦИЯ',
                    num: '08',
                    desc: 'Профессиональная фото и 4K видеосъемка, аэросъемка и продакшн контента.',
                    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
                  },
                ] : currentLanguage === 'id' ? [
                  {
                    title: 'PERENCANAAN & MANAJEMEN ACARA',
                    num: '01',
                    desc: 'Manajemen acara menyeluruh dari konsep awal, anggaran, katering, hingga operasional langsung di lokasi.',
                    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'ACARA PERUSAHAAN',
                    num: '02',
                    desc: 'Gala dinner, Rapat Eksekutif, peluncuran produk, dan aktivasi merek.',
                    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'ACARA PRIBADI',
                    num: '03',
                    desc: 'Pesta ulang tahun mewah, syukuran pribadi, dan pesta villa kustom.',
                    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'FESTIVAL & PAMERAN',
                    num: '04',
                    desc: 'Festival musik skala besar, pameran budaya, expo produk, dan pertunjukan terbuka.',
                    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'OLAH RAGA & KESEHATAN',
                    num: '05',
                    desc: 'Kompetisi kebugaran, fun run, retreat yoga, dan turnamen olahraga.',
                    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'HIBURAN',
                    num: '06',
                    desc: 'Konser musik langsung, penampilan DJ, pertunjukan panggung, dan tata cahaya menakjubkan.',
                    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'PRODUKSI ACARA',
                    num: '07',
                    desc: 'Desain panggung, tata suara, layar LED, pencahayaan, dan tata teknis di lokasi.',
                    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'MEDIA & DOKUMENTASI',
                    num: '08',
                    desc: 'Fotografi profesional, dokumentasi video 4K, liputan drone, dan produksi media pasca acara.',
                    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
                  },
                ] : [
                  {
                    title: 'Event Planning & Management',
                    num: '01',
                    desc: 'End-to-end event conceptualization, scheduling, budgeting, vendor management, and live operations.',
                    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'Corporate Events',
                    num: '02',
                    desc: 'Gala dinners, executive retreats, product launches, corporate meetings, and brand activations.',
                    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'Private Events',
                    num: '03',
                    desc: 'Bespoke birthday celebrations, anniversaries, private estate galas, and VIP parties.',
                    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'Festival & Exhibition',
                    num: '04',
                    desc: 'Large-scale music festivals, cultural expos, brand showcases, and outdoor exhibitions.',
                    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'Sports & Wellness',
                    num: '05',
                    desc: 'Fitness competitions, marathon fun runs, yoga retreats, and athletic tournaments.',
                    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'Entertainment',
                    num: '06',
                    desc: 'Live concerts, DJ performances, stage shows, light spectacles, and artist management.',
                    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'Event Production',
                    num: '07',
                    desc: 'Stage design, sound engineering, LED screens, lighting design, and technical site setup.',
                    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'Media & Documentation',
                    num: '08',
                    desc: 'Professional photography, 4K videography, drone coverage, and post-event media production.',
                    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
                  },
                ];

                return (dynamicServices || fallbackList);
              })().map((service, idx) => {
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.215, 0.61, 0.355, 1] }}
                    className="rounded-2xl bg-black/80 border border-[#f3e5ab]/20 hover:border-[#f3e5ab]/70 transition-all duration-300 group hover:bg-black/95 hover:shadow-2xl overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* High Resolution Cover Image */}
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                      </div>

                      <div className="p-5">
                        <h3 className="font-extrabold text-sm sm:text-base text-[#f3e5ab] group-hover:text-white transition-colors mb-2 leading-snug uppercase tracking-wider">
                          {service.title}
                        </h3>
                        <p className="text-xs text-neutral-300 leading-relaxed font-medium">
                          {service.desc}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 mt-auto border-t border-white/10 flex items-center justify-between">
                      <a
                        href={`https://wa.me/62895336689599?text=${encodeURIComponent('Hello PROJECT ORGANIZER, I want to inquire about: ' + service.title)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{currentLanguage === 'ar' ? 'استفسر الآن' : 'Inquire Now'}</span>
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {activePage === 'Activities' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              {[
                {
                  title: t.activity1Title,
                  img: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
                  desc: t.activity1Desc,
                },
                {
                  title: t.activity2Title,
                  img: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
                  desc: t.activity2Desc,
                },
                {
                  title: t.activity3Title,
                  img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
                  desc: t.activity3Desc,
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
                  className="overflow-hidden rounded-2xl bg-white/5 border border-white/10 group hover:border-white/50 transition-all flex flex-col hover:shadow-md"
                >
                  <div className="h-48 w-full overflow-hidden relative">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base text-white group-hover:text-neutral-200 transition-colors mb-2">{item.title}</h3>
                      <p className="text-xs text-neutral-300">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activePage === 'About Us' && (
          <div className="space-y-12 max-w-5xl mx-auto">
            {/* --- SECTION #01: WHO WE ARE --- */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-black/80 via-black/60 to-black/80 border border-[#f3e5ab]/30 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-[10px] font-black text-red-400 tracking-widest uppercase">
                    {currentLanguage === 'ar' ? 'من نحن' : 'WHO WE ARE'}
                  </span>
                  <span className="text-xs font-bold text-[#f3e5ab] uppercase tracking-wider">
                    {currentLanguage === 'ar' ? 'المنظم' : 'ORGANIZER'}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug uppercase tracking-tight">
                  {currentLanguage === 'ar'
                    ? 'منظم فعاليات وإدارة فعاليات — بالي، إندونيسيا'
                    : currentLanguage === 'id'
                    ? 'PENYELENGGARA ACARA & MANAJEMEN ACARA — Bali, Indonesia'
                    : 'EVENT ORGANIZER & EVENT MANAGEMENT — Bali, Indonesia'}
                </h3>

                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-medium">
                  {currentLanguage === 'ar'
                    ? 'نحن نبتكر تجارب هادفة من خلال مفاهيم مدروسة، وتنفيذ مهني، واهتمام استثنائي بالتفاصيل.'
                    : currentLanguage === 'id'
                    ? 'Kami menciptakan pengalaman bermakna melalui konsep terencana, eksekusi profesional, dan perhatian luar biasa terhadap detail.'
                    : 'We create meaningful experiences through thoughtful concepts, professional execution, and exceptional attention to detail.'}
                </p>

                {/* 3 Pillars Bullets */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  {(currentLanguage === 'ar' ? [
                    { title: 'صنع تجارب', desc: 'ابتكار لحظات استثنائية تترك أثراً دائماً.', icon: Sparkles },
                    { title: 'ربط الأشخاص', desc: 'بناء روابط معنوية وقوية بين الجمهور والفعالية.', icon: Users },
                    { title: 'جعل اللحظات مهمة', desc: 'عناية فائقة بكافة التفاصيل الدقيقة.', icon: CheckCircle2 }
                  ] : currentLanguage === 'id' ? [
                    { title: 'Menciptakan Pengalaman', desc: 'Membuat momen luar biasa dan tak terlupakan.', icon: Sparkles },
                    { title: 'Menghubungkan Orang', desc: 'Mempererat hubungan antara merek dan audiens.', icon: Users },
                    { title: 'Menjadikan Momen Berharga', desc: 'Detail luar biasa pada setiap aspek acara.', icon: CheckCircle2 }
                  ] : [
                    { title: 'Creating Experiences', desc: 'Crafting extraordinary moments that last.', icon: Sparkles },
                    { title: 'Connecting People', desc: 'Building meaningful connections between people.', icon: Users },
                    { title: 'Making Moments Matter', desc: 'Meticulous attention to every single detail.', icon: CheckCircle2 }
                  ]).map((pillar, pIdx) => {
                    const PIcon = pillar.icon;
                    return (
                      <div key={pIdx} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between hover:border-red-500/40 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <PIcon className="w-4 h-4 text-red-400" />
                          <h4 className="font-bold text-xs text-white uppercase">{pillar.title}</h4>
                        </div>
                        <p className="text-[11px] text-neutral-300 leading-relaxed">{pillar.desc}</p>
                      </div>
                    );
                  })}
                </div>

                {/* WHY PROJECT N3 ORGANIZER Red Heading & Description */}
                <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-2 mt-4">
                  <h4 className="text-sm sm:text-base font-black text-red-600 uppercase tracking-wider">
                    WHY PROJECT N3 ORGANIZER
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-medium">
                    PROJECT N3 ORGANIZER is a Bali-based Event Organizer specializing in the planning, management, and execution of memorable events. We combine creativity, professional event management, and strong operational execution to deliver events that are not only well-organized, but also meaningful and memorable. From intimate private gatherings to large-scale corporate events, festivals, wellness experiences, and entertainment programs, we provide end-to-end solutions tailored to each client's needs.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* --- SECTION #02: WHY PROJECT? / OUR APPROACH --- */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="p-8 sm:p-10 rounded-3xl bg-black/80 border border-white/15 space-y-6"
            >
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-black text-[#f3e5ab] tracking-widest uppercase">
                  {currentLanguage === 'ar' ? 'لماذا مشروعنا؟' : 'WHY PROJECT?'}
                </span>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  {currentLanguage === 'ar' ? 'عن الشركة' : 'ABOUT US'}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#f3e5ab] uppercase tracking-wider">
                {currentLanguage === 'ar' ? 'نهجنا بسيط وفعال' : 'OUR APPROACH IS SIMPLE & EFFECTIVE'}
              </h3>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal whitespace-pre-line">
                {currentLanguage === 'ar'
                  ? 'PROJECT ORGANIZER هي شركة تنظيم فعاليات مقرها بالي متخصصة في تخطيط وإدارة وتنفيذ الفعاليات المميزة.\n\nنحن نجمع بين الإبداع وإدارة الفعاليات الاحترافية والتنفيذ التشغيلي القوي لتقديم فعاليات ليست فقط منظمة بل ذات مغزى ولاتنسى. من التجمعات الخاصة إلى الفعاليات الكبرى والمهرجانات والبرامج الترفيهية، نقدم حلولاً متكاملة مخصصة لكل عميل.'
                  : currentLanguage === 'id'
                  ? 'PROJECT ORGANIZER adalah Penyelenggara Acara berbasis di Bali yang berspesialisasi dalam perencanaan, manajemen, dan eksekusi acara berkesan.\n\nKami menggabungkan kreativitas, manajemen acara profesional, dan eksekusi operasional yang kuat untuk menghadirkan acara yang terorganisir dengan baik, bermakna, dan tak terlupakan.'
                  : 'PROJECT ORGANIZER is a Bali-based Event Organizer specializing in the planning, management, and execution of memorable events.\n\nWe combine creativity, professional event management, and strong operational execution to deliver events that are not only well-organized, but also meaningful and memorable. From intimate private gatherings to large-scale corporate events, festivals, wellness experiences, and entertainment programs, we provide end-to-end solutions tailored to each client\'s needs.'}
              </p>

              {/* 4 Steps Workflow Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {(currentLanguage === 'ar' ? [
                  { step: '01', name: 'الفكرة', label: 'CONCEPT' },
                  { step: '02', name: 'التخطيط', label: 'PLAN' },
                  { step: '03', name: 'التنفيذ', label: 'EXECUTE' },
                  { step: '04', name: 'التجربة', label: 'EXPERIENCE' }
                ] : [
                  { step: '01', name: 'CONCEPT', label: 'IDEATION' },
                  { step: '02', name: 'PLAN', label: 'STRATEGY' },
                  { step: '03', name: 'EXECUTE', label: 'OPERATION' },
                  { step: '04', name: 'EXPERIENCE', label: 'MEMORIES' }
                ]).map((st, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#f3e5ab]/50 text-center transition-all group">
                    <span className="block text-xs font-mono font-black text-red-500 mb-1">{st.step}</span>
                    <h5 className="font-extrabold text-xs sm:text-sm text-white group-hover:text-[#f3e5ab] transition-colors uppercase tracking-wider">{st.name}</h5>
                    <span className="block text-[10px] text-neutral-400 mt-1 uppercase tracking-widest">{st.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <span className="text-3xl font-extrabold text-white">500+</span>
                <span className="block text-xs sm:text-sm text-neutral-300 mt-2">{t.aboutStat1}</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <span className="text-3xl font-extrabold text-white">24/7</span>
                <span className="block text-xs sm:text-sm text-neutral-300 mt-2">{t.aboutStat2}</span>
              </motion.div>
            </div>

            {/* Direct Contact */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3 pt-2"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider rtl:tracking-normal text-white">
                {currentLanguage === 'ar' ? 'تواصل مباشر' : 'Direct Contact'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <a href="https://instagram.com/project.n3bali" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-neutral-200 hover:border-pink-500/50 transition-colors">
                  <Instagram className="w-5 h-5 text-pink-400 shrink-0" />
                  <span className="truncate">@project.n3bali</span>
                </a>
                <a href="https://wa.me/62895336689599" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-neutral-200 hover:border-emerald-500/50 transition-colors">
                  <PhoneCall className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>+62 895 3366 89599</span>
                </a>
                <a href="mailto:creativegrouplimabersama@gmail.com" className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-neutral-200 hover:border-red-500/50 transition-colors truncate">
                  <Mail className="w-5 h-5 text-red-400 shrink-0" />
                  <span className="truncate">creativegrouplimabersama@gmail.com</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Bottom Padding */}
      <div className="pb-12" />

    </div>
  );
};
