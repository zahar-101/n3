import React, { useState, useEffect } from 'react';
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
  const [customGallery, setCustomGallery] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('n3_custom_gallery_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('n3_custom_gallery_list');
        if (saved) setCustomGallery(JSON.parse(saved));
      } catch(e) {}
    };
    window.addEventListener('n3_content_updated', handleUpdate);
    return () => window.removeEventListener('n3_content_updated', handleUpdate);
  }, []);

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
                ] : currentLanguage === 'zh' ? [
                  {
                    title: '活动策划与全案管理',
                    num: '01',
                    desc: '从概念构思、预算编制、物料统筹到现场总控的全流程活动管理。',
                    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: '企业商务活动',
                    num: '02',
                    desc: '高端晚宴、高管峰会、新品发布会、企业团建与品牌公关活动。',
                    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: '私人定制庆典',
                    num: '03',
                    desc: '奢华生日派对、结婚纪念、独栋庄园聚会与高规格私密聚会。',
                    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: '大型节庆与博览会',
                    num: '04',
                    desc: '大型音乐节、文化艺术展、品牌巡展及综合性户外展览。',
                    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: '体育赛事与健康',
                    num: '05',
                    desc: '健身锦标赛、趣味跑、瑜伽静修营及定制体育赛事。',
                    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: '演艺娱乐与演出',
                    num: '06',
                    desc: '现场音乐会、顶级DJ表演、舞台灯光秀及专业艺人统筹。',
                    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: '活动工程与舞美制作',
                    num: '07',
                    desc: '舞台设计搭建、灯光音响工程、高清LED大屏及现场技术统筹。',
                    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: '影视摄影与全案记录',
                    num: '08',
                    desc: '专业摄影摄像、4K高清视频录制、无人机航拍及全流程宣发内容制作。',
                    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
                  },
                ] : currentLanguage === 'tr' ? [
                  {
                    title: 'ETKİNLİK PLANLAMA & YÖNETİMİ',
                    num: '01',
                    desc: 'Fikir aşamasından bütçelendirmeye, tedarikçi yönetiminden saha operasyonuna tam kapsamlı etkinlik yönetimi.',
                    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'KURUMSAL ETKİNLİKLER',
                    num: '02',
                    desc: 'Gala yemekleri, yönetici zirveleri, ürün lansmanları ve kurumsal şirket buluşmaları.',
                    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'ÖZEL KUTLAMALAR',
                    num: '03',
                    desc: 'Kişiye özel doğum günleri, yıldönümleri, lüks villa partileri ve VIP buluşmalar.',
                    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'FESTİVAL & FUARLAR',
                    num: '04',
                    desc: 'Büyük çaplı müzik festivalleri, kültürel fuarlar, ürün tanıtımları ve açık hava gösterileri.',
                    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'SPOR & WELLNESS',
                    num: '05',
                    desc: 'Fitness yarışmaları, koşu etkinlikleri, yoga kampları ve spor turnuvaları.',
                    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'EĞLENCE & ŞOVLAR',
                    num: '06',
                    desc: 'Canlı konserler, DJ performansları, sahne gösterileri ve ışık şovları.',
                    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'ETKİNLİK PRODÜKSİYONU',
                    num: '07',
                    desc: 'Sahne tasarımı, ses mühendisliği, LED ekranlar, aydınlatma ve teknik kurulum.',
                    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    title: 'MEDYA & BELGELEME',
                    num: '08',
                    desc: 'Profesyonel fotoğrafçılık, 4K video kaydı, drone çekimleri ve post-prodüksiyon.',
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
            {/* Dynamic Multilingual About Us Content */}
            {(() => {
              const aboutI18n = {
                ar: {
                  whoBadge: 'من نحن',
                  organizerBadge: 'المنظم',
                  headline: 'منظم فعاليات وإدارة فعاليات — بالي، إندونيسيا',
                  intro: 'نحن نبتكر تجارب هادفة من خلال مفاهيم مدروسة، وتنفيذ مهني، واهتمام استثنائي بالتفاصيل.',
                  pillars: [
                    { title: 'صنع تجارب', desc: 'ابتكار لحظات استثنائية تترك أثراً دائماً.', icon: Sparkles },
                    { title: 'ربط الأشخاص', desc: 'بناء روابط معنوية وقوية بين الجمهور والفعالية.', icon: Users },
                    { title: 'جعل اللحظات مهمة', desc: 'عناية فائقة بكافة التفاصيل الدقيقة.', icon: CheckCircle2 }
                  ],
                  whyTitle: 'لماذا PROJECT N3 ORGANIZER',
                  whyDesc: 'PROJECT N3 ORGANIZER هي شركة تنظيم فعاليات مقرها بالي متخصصة في تخطيط وإدارة وتنفيذ الفعاليات المميزة. نحن نجمع بين الإبداع وإدارة الفعاليات الاحترافية والتنفيذ التشغيلي القوي لتقديم فعاليات متكاملة واستثنائية.',
                  approachBadge: 'نهجنا',
                  aboutBadge: 'عن الشركة',
                  approachTitle: 'نهجنا بسيط وفعال',
                  approachDesc: 'PROJECT N3 ORGANIZER تقدم حلولاً متكاملة لتنظيم الفعاليات في بالي، من التجمعات الخاصة إلى الفعاليات الكبرى والمهرجانات والبرامج الترفيهية مع تخطيط متقن وتنفيذ دقيق.',
                  steps: [
                    { step: '01', name: 'الفكرة', label: 'CONCEPT' },
                    { step: '02', name: 'التخطيط', label: 'PLAN' },
                    { step: '03', name: 'التنفيذ', label: 'EXECUTE' },
                    { step: '04', name: 'التجربة', label: 'EXPERIENCE' }
                  ],
                  directContact: 'تواصل مباشر',
                  inquireNow: 'استفسر الآن'
                },
                zh: {
                  whoBadge: '关于我们',
                  organizerBadge: '活动统筹',
                  headline: '活动策划与全案管理 — 印尼巴厘岛',
                  intro: '我们通过严谨的策划构想、专业的现场执行与极致的细节打磨，打造充满意义且难以忘怀的精彩盛会。',
                  pillars: [
                    { title: '创造非凡体验', desc: '精心雕琢每一个难忘瞬间，留下恒久记忆。', icon: Sparkles },
                    { title: '凝聚人际连接', desc: '在品牌、嘉宾与观众之间建立深厚的情感共鸣。', icon: Users },
                    { title: '成就精彩时刻', desc: '对活动全流程的每一处细节精益求精。', icon: CheckCircle2 }
                  ],
                  whyTitle: '为什么选择 PROJECT N3 ORGANIZER',
                  whyDesc: 'PROJECT N3 ORGANIZER 是立足于印尼巴厘岛的专业活动策划机构，专注于高品质活动的统筹、策划与全方位执行。我们将创新灵感、专业管理与强大执行力深度融合，不仅确保活动井然有序，更赋予其深远价值。从私密高端派对、大型企业年会、音乐节，到健康养生盛会及娱乐演出，我们为每位客户提供一站式定制化解决方案。',
                  approachBadge: '核心优势',
                  aboutBadge: '关于我们',
                  approachTitle: '我们的方法：简单高效，精益求精',
                  approachDesc: 'PROJECT N3 ORGANIZER 是一家位于巴厘岛的专业活动策划团队，致力于打造震撼人心的卓越盛会。\n\n我们融合创意策划、标准化统筹与高效运营，从方案构想到现场落地的每一个环节保驾护航。无论是私人庄园宴会、企业商务峰会、音乐艺术节，还是专属娱乐体验，我们均量身定制专属方案。',
                  steps: [
                    { step: '01', name: '策划构思', label: 'CONCEPT' },
                    { step: '02', name: '统筹规划', label: 'PLAN' },
                    { step: '03', name: '专业执行', label: 'EXECUTE' },
                    { step: '04', name: '极致体验', label: 'EXPERIENCE' }
                  ],
                  directContact: '直接联系方式',
                  inquireNow: '立即咨询'
                },
                tr: {
                  whoBadge: 'HAKKIMIZDA',
                  organizerBadge: 'ORGANİZATÖR',
                  headline: 'ETKİNLİK ORGANİZASYONU & YÖNETİMİ — Bali, Endonezya',
                  intro: 'Düşünceli konseptler, profesyonel uygulama ve olağanüstü detay hassasiyetiyle anlamlı deneyimler yaratıyoruz.',
                  pillars: [
                    { title: 'Deneyim Yaratmak', desc: 'Kalıcı ve olağanüstü anlar inşa ediyoruz.', icon: Sparkles },
                    { title: 'İnsanları Birleştirmek', desc: 'Markalar ve izleyiciler arasında güçlü bağlar kuruyoruz.', icon: Users },
                    { title: 'Her Anı Değerli Kılmak', desc: 'Her bir detaya titiz ve kusursuz özen gösteriyoruz.', icon: CheckCircle2 }
                  ],
                  whyTitle: 'NEDEN PROJECT N3 ORGANIZER',
                  whyDesc: 'PROJECT N3 ORGANIZER, unutulmaz etkinliklerin planlanması, yönetimi ve kusursuz uygulanmasında uzmanlaşmış Bali merkezli bir Etkinlik Organizatörüdür. Yaratıcılığı, profesyonel yönetimi ve güçlü operasyonel gücü birleştirerek sadece düzenli değil, aynı zamanda anlamlı etkinlikler sunuyoruz. Özel kutlamalardan kurumsal galalara, festivallerden wellness etkinliklerine kadar her ihtiyaca özel uçtan uca çözümler sağlıyoruz.',
                  approachBadge: 'YAKLAŞIMIMIZ',
                  aboutBadge: 'HAKKIMIZDA',
                  approachTitle: 'YAKLAŞIMIMIZ BASİT VE ETKİLİDİR',
                  approachDesc: 'PROJECT N3 ORGANIZER, unutulmaz anlar yaratma konusunda uzmanlaşmış Bali merkezli lider bir etkinlik ajansıdır.\n\nYaratıcılığı, profesyonel planlamayı ve güçlü operasyonu bir araya getirerek her etkinliği unutulmaz bir deneyime dönüştürüyoruz.',
                  steps: [
                    { step: '01', name: 'KONSEPT', label: 'FİKİR' },
                    { step: '02', name: 'PLANLAMA', label: 'STRATEJİ' },
                    { step: '03', name: 'UYGULAMA', label: 'OPERASYON' },
                    { step: '04', name: 'DENEYİM', label: 'ANILAR' }
                  ],
                  directContact: 'Doğrudan İletişim',
                  inquireNow: 'Hemen Danışın'
                },
                ru: {
                  whoBadge: 'О НАС',
                  organizerBadge: 'ОРГАНИЗАТОР',
                  headline: 'ОРГАНИЗАЦИЯ И МЕНЕДЖМЕНТ МЕРОПРИЯТИЙ — Бали, Индонезия',
                  intro: 'Мы создаем значимые события благодаря продуманным концепциям, профессиональному исполнению и вниманию к каждой детали.',
                  pillars: [
                    { title: 'Создание Впечатлений', desc: 'Создаем незабываемые моменты, которые остаются навсегда.', icon: Sparkles },
                    { title: 'Объединение Людей', desc: 'Выстраиваем прочные связи между брендами, гостями и партнерами.', icon: Users },
                    { title: 'Ценность Каждой Детали', desc: 'Исключительное внимание к каждому аспекту события.', icon: CheckCircle2 }
                  ],
                  whyTitle: 'ПОЧЕМУ PROJECT N3 ORGANIZER',
                  whyDesc: 'PROJECT N3 ORGANIZER — агентство по организации мероприятий на Бали, специализирующееся на планировании, управлении и проведении ярких событий. Мы объединяем креативность, профессиональный менеджмент и надежное операционное исполнение для создания мероприятий, которые вдохновляют и надолго остаются в памяти.',
                  approachBadge: 'НАШ ПОДХОД',
                  aboutBadge: 'О НАС',
                  approachTitle: 'НАШ ПОДХОД: ПРОСТОЙ И ЭФФЕКТИВНЫЙ',
                  approachDesc: 'PROJECT N3 ORGANIZER — ведущий организатор мероприятий на Бали, создающий яркие и безупречные события.\n\nМы объединяем креативные идеи, профессиональное планирование и безупречное проведение для достижения наивысших результатов.',
                  steps: [
                    { step: '01', name: 'КОНЦЕПЦИЯ', label: 'ИДЕЯ' },
                    { step: '02', name: 'ПЛАН', label: 'СТРАТЕГИЯ' },
                    { step: '03', name: 'ИСПОЛНЕНИЕ', label: 'ОПЕРАЦИИ' },
                    { step: '04', name: 'ВПЕЧАТЛЕНИЯ', label: 'ПАМЯТЬ' }
                  ],
                  directContact: 'Прямые Контакты',
                  inquireNow: 'Запросить консультацию'
                },
                id: {
                  whoBadge: 'TENTANG KAMI',
                  organizerBadge: 'ORGANIZER',
                  headline: 'PENYELENGGARA ACARA & MANAJEMEN ACARA — Bali, Indonesia',
                  intro: 'Kami menciptakan pengalaman bermakna melalui konsep terencana, eksekusi profesional, dan perhatian luar biasa terhadap detail.',
                  pillars: [
                    { title: 'Menciptakan Pengalaman', desc: 'Membuat momen luar biasa dan tak terlupakan.', icon: Sparkles },
                    { title: 'Menghubungkan Orang', desc: 'Mempererat hubungan antara merek dan audiens.', icon: Users },
                    { title: 'Menjadikan Momen Berharga', desc: 'Detail luar biasa pada setiap aspek acara.', icon: CheckCircle2 }
                  ],
                  whyTitle: 'MENGAPA PROJECT N3 ORGANIZER',
                  whyDesc: 'PROJECT N3 ORGANIZER adalah Penyelenggara Acara berbasis di Bali yang berspesialisasi dalam perencanaan, manajemen, dan eksekusi acara berkesan. Kami menggabungkan kreativitas, manajemen acara profesional, dan eksekusi operasional yang kuat untuk menghadirkan acara yang terorganisir dengan baik, bermakna, dan tak terlupakan.',
                  approachBadge: 'PENDEKATAN KAMI',
                  aboutBadge: 'TENTANG KAMI',
                  approachTitle: 'PENDEKATAN KAMI SEDERHANA & EFEKTIF',
                  approachDesc: 'PROJECT ORGANIZER adalah Penyelenggara Acara berbasis di Bali yang berspesialisasi dalam perencanaan, manajemen, dan eksekusi acara berkesan.\n\nKami menggabungkan kreativitas, manajemen acara profesional, dan eksekusi operasional yang kuat untuk menghadirkan acara yang terorganisir dengan baik, bermakna, dan tak terlupakan.',
                  steps: [
                    { step: '01', name: 'KONSEP', label: 'IDEASI' },
                    { step: '02', name: 'RENCANA', label: 'STRATEGI' },
                    { step: '03', name: 'EKSEKUSI', label: 'OPERASIONAL' },
                    { step: '04', name: 'PENGALAMAN', label: 'KENANGAN' }
                  ],
                  directContact: 'Kontak Langsung',
                  inquireNow: 'Tanya Sekarang'
                },
                en: {
                  whoBadge: 'WHO WE ARE',
                  organizerBadge: 'ORGANIZER',
                  headline: 'EVENT ORGANIZER & EVENT MANAGEMENT — Bali, Indonesia',
                  intro: 'We create meaningful experiences through thoughtful concepts, professional execution, and exceptional attention to detail.',
                  pillars: [
                    { title: 'Creating Experiences', desc: 'Crafting extraordinary moments that last.', icon: Sparkles },
                    { title: 'Connecting People', desc: 'Building meaningful connections between people.', icon: Users },
                    { title: 'Making Moments Matter', desc: 'Meticulous attention to every single detail.', icon: CheckCircle2 }
                  ],
                  whyTitle: 'WHY PROJECT N3 ORGANIZER',
                  whyDesc: 'PROJECT N3 ORGANIZER is a Bali-based Event Organizer specializing in the planning, management, and execution of memorable events. We combine creativity, professional event management, and strong operational execution to deliver events that are not only well-organized, but also meaningful and memorable. From intimate private gatherings to large-scale corporate events, festivals, wellness experiences, and entertainment programs, we provide end-to-end solutions tailored to each client\'s needs.',
                  approachBadge: 'WHY US',
                  aboutBadge: 'ABOUT US',
                  approachTitle: 'OUR APPROACH IS SIMPLE & EFFECTIVE',
                  approachDesc: 'PROJECT ORGANIZER is a Bali-based Event Organizer specializing in the planning, management, and execution of memorable events.\n\nWe combine creativity, professional event management, and strong operational execution to deliver events that are not only well-organized, but also meaningful and memorable. From intimate private gatherings to large-scale corporate events, festivals, wellness experiences, and entertainment programs, we provide end-to-end solutions tailored to each client\'s needs.',
                  steps: [
                    { step: '01', name: 'CONCEPT', label: 'IDEATION' },
                    { step: '02', name: 'PLAN', label: 'STRATEGY' },
                    { step: '03', name: 'EXECUTE', label: 'OPERATION' },
                    { step: '04', name: 'EXPERIENCE', label: 'MEMORIES' }
                  ],
                  directContact: 'Direct Contact',
                  inquireNow: 'Inquire Now'
                }
              };

              const currentAbout = aboutI18n[currentLanguage] || aboutI18n.en;

              return (
                <>
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
                          {currentAbout.whoBadge}
                        </span>
                        <span className="text-xs font-bold text-[#f3e5ab] uppercase tracking-wider">
                          {currentAbout.organizerBadge}
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug uppercase tracking-tight">
                        {currentAbout.headline}
                      </h3>

                      <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-medium">
                        {currentAbout.intro}
                      </p>

                      {/* 3 Pillars Bullets */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                        {currentAbout.pillars.map((pillar, pIdx) => {
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
                          {currentAbout.whyTitle}
                        </h4>
                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-medium">
                          {currentAbout.whyDesc}
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
                        {currentAbout.approachBadge}
                      </span>
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                        {currentAbout.aboutBadge}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-[#f3e5ab] uppercase tracking-wider">
                      {currentAbout.approachTitle}
                    </h3>

                    <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal whitespace-pre-line">
                      {currentAbout.approachDesc}
                    </p>

                    {/* 4 Steps Workflow Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {currentAbout.steps.map((st, idx) => (
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
                      {currentAbout.directContact}
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
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Bottom Padding */}
      <div className="pb-12" />

    </div>
  );
};
