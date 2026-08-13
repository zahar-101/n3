import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Destination, Translations, LanguageCode } from '../types';
import {
  fetchSectionsFromSupabase,
  fetchServicesFromSupabase,
  fetchGalleryFromSupabase,
  fetchSiteSettingsFromSupabase
} from '../lib/supabase';
import { DESTINATIONS } from '../data/destinations';
import {
  Sparkles,
  ShieldCheck,
  Star,
  CheckCircle2,
  PhoneCall,
  Mail,
  Calendar,
  Users,
  Car,
  Anchor,
  GlassWater,
  Building2,
  ChevronRight,
  Send,
  MapPin,
  Clock,
  Award,
  Lightbulb,
  ClipboardList,
  Cog,
  ArrowRight,
  Eye,
  Target,
  Handshake,
  Sliders,
  Layers,
  UserCheck,
  Camera,
  Music,
  Activity,
  Briefcase,
  Heart,
  Megaphone,
  Search,
  Trophy,
  Globe,
  Flame,
  User,
  Instagram,
  Plus,
  X,
  HeartPulse,
  Mic2,
  Ticket,
  LayoutGrid,
  Gift,
  Presentation,
  CalendarCheck
} from 'lucide-react';

interface HomePageSectionsProps {
  onSelectDestination: (dest: Destination) => void;
  t: Translations;
  currentLanguage?: LanguageCode;
}

// Multi-language Translation Dictionaries for Sections 01-08
const sectionTranslations: Record<LanguageCode, Record<string, {
  banner: string;
  badge: string;
  title: string;
  desc: string;
  bullets?: string[];
}>> = {
  en: {
    '01': {
      banner: 'WHO WE ARE',
      badge: 'ORGANIZER',
      title: 'WHO WE ARE',
      desc: 'We create meaningful experiences through thoughtful concepts, professional execution, and exceptional attention to detail.',
      bullets: ['Creating Experiences', 'Connecting People', 'Making Moments Matter']
    },
    '02': {
      banner: 'VISION & MISSION',
      badge: 'VISION & MISSION',
      title: 'OUR VISION & MISSION',
      desc: 'Delivering flawless, high-impact events with unmatched creativity and dedication.'
    },
    '03': {
      banner: 'WHY CHOOSE US',
      badge: 'WHY US',
      title: 'WHY CHOOSE US?',
      desc: 'We believe a successful event is more than just a beautiful setup. It\'s about experience, execution, and attention to every detail.'
    },
    '04': {
      banner: 'OUR SERVICES',
      badge: 'SERVICES',
      title: 'FULL-SERVICE EVENT SOLUTIONS',
      desc: 'From concept to execution, we handle every detail so you can focus on what truly matters.'
    },
    '05': {
      banner: 'EVENT CATEGORIES',
      badge: 'CATEGORIES',
      title: 'EVENTS WE CREATE',
      desc: 'From corporate conventions to high-octane festivals and intimate private celebrations.'
    },
    '06': {
      banner: 'OUR PROCESS',
      badge: 'WORK PROCESS',
      title: 'FROM IDEA TO EXPERIENCE',
      desc: 'Our structured step-by-step event execution blueprint ensuring flawless delivery every single time.'
    },
    '07': {
      banner: 'OUR TEAM',
      badge: 'OUR TEAM',
      title: 'THE PEOPLE BEHIND THE EXPERIENCE',
      desc: 'One Team. One Vision. Dedicated professionals uniting to bring extraordinary concepts to reality.'
    },
    '08': {
      banner: 'CONTACT US',
      badge: 'CONTACT US',
      title: "LET'S CREATE SOMETHING EXTRAORDINARY",
      desc: "Have an event in mind?\nLet's turn your idea into an experience."
    }
  },
  ar: {
    '01': {
      banner: 'من نحن',
      badge: 'من نحن',
      title: 'من نحن',
      desc: 'نحن نبتكر تجارب هادفة من خلال مفاهيم مدروسة، وتنفيذ مهني، واهتمام استثنائي بالتفاصيل.',
      bullets: ['صنع تجارب', 'ربط الأشخاص', 'جعل اللحظات مهمة']
    },
    '02': {
      banner: 'رؤيتنا ومهمتنا',
      badge: 'رؤيتنا ومهمتنا',
      title: 'رؤيتنا ومهمتنا',
      desc: 'تقديم فعاليات متقنة وعالية الأثر بإبداع لا مثيل له والتزام تام بالتميز.'
    },
    '03': {
      banner: 'لماذا تختارنا',
      badge: 'لماذا تختارنا',
      title: 'لماذا تختارنا؟',
      desc: 'نحن نؤمن بأن الفعالية الناجحة هي أكثر من مجرد إعداد جميل. إنها تتعلق بالتجربة والتنفيذ والاهتمام بكل تفصيلة.'
    },
    '04': {
      banner: 'خدماتنا',
      badge: 'خدماتنا',
      title: 'خدماتنا الشاملة',
      desc: 'من الفكرة إلى التنفيذ، نتولى جميع التفاصيل حتى تتمكن من التركيز على ما يهمك بحق.'
    },
    '05': {
      banner: 'فئات الفعاليات',
      badge: 'فئات الفعاليات',
      title: 'فئات الفعاليات',
      desc: 'من المؤتمرات المؤسسية والمهرجانات الحماسية إلى الاحتفالات الخاصة واللقاءات الفاخرة.'
    },
    '06': {
      banner: 'عملية العمل',
      badge: 'عملية العمل',
      title: 'عملية العمل',
      desc: 'مخططنا المنظم المكون من خطوات لضمان تنفيذ متقن وخالٍ من الأخطاء في كل مرة.'
    },
    '07': {
      banner: 'فريقنا',
      badge: 'فريقنا',
      title: 'فريقنا وصناع التجارب',
      desc: 'فريق واحد. رؤية واحدة. محترفون متفانون يجمعهم هدف واحد لتحويل المفاهيم الاستثنائية إلى واقع.'
    },
    '08': {
      banner: 'تواصل معنا',
      badge: 'تواصل معنا',
      title: 'تواصل معنا',
      desc: "هل لديك فعالية في ذهنك؟\nدعنا نحول فكرتك إلى تجربة لا تُنسى."
    }
  },
  id: {
    '01': {
      banner: 'TENTANG KAMI',
      badge: 'TENTANG KAMI',
      title: 'TENTANG KAMI',
      desc: 'Kami menciptakan pengalaman bermakna melalui konsep terencana, eksekusi profesional, dan perhatian luar biasa terhadap detail.',
      bullets: ['Menciptakan Pengalaman', 'Menghubungkan Orang', 'Menjadikan Momen Berharga']
    },
    '02': {
      banner: 'VISI & MISI KAMI',
      badge: 'VISI & MISI',
      title: 'VISI & MISI KAMI',
      desc: 'Menghadirkan acara yang sempurna dan berdampak tinggi dengan kreativitas tanpa tanding.'
    },
    '03': {
      banner: 'MENGAPA MEMILIH KAMI',
      badge: 'MENGAPA KAMI',
      title: 'MENGAPA MEMILIH KAMI?',
      desc: 'Kami percaya acara yang sukses lebih dari sekadar dekorasi indah. Ini tentang pengalaman, eksekusi, dan perhatian pada setiap detail.'
    },
    '04': {
      banner: 'LAYANAN KAMI',
      badge: 'LAYANAN',
      title: 'SOLUSI ACARA LENGKAP',
      desc: 'Dari konsep hingga eksekusi, kami menangani setiap detail sehingga Anda dapat fokus pada hal terpenting.'
    },
    '05': {
      banner: 'KATEGORI ACARA',
      badge: 'KATEGORI',
      title: 'KATEGORI ACARA',
      desc: 'Dari konvensi perusahaan hingga festival meriah dan perayaan pribadi yang intim.'
    },
    '06': {
      banner: 'PROSES KAMI',
      badge: 'PROSES KAMI',
      title: 'PROSES KERJA',
      desc: 'Rancangan eksekusi acara terstruktur kami memastikan hasil sempurna setiap saat.'
    },
    '07': {
      banner: 'TIM KAMI',
      badge: 'TIM KAMI',
      title: 'TIM KAMI',
      desc: 'Satu Tim. Satu Visi. Profesional berdedikasi yang bersatu mewujudkan konsep luar biasa.'
    },
    '08': {
      banner: 'HUBUNGI KAMI',
      badge: 'HUBUNGI KAMI',
      title: 'HUBUNGI KAMI',
      desc: 'Punya ide acara di pikiran Anda?\nMari ubah ide Anda menjadi pengalaman tak terlupakan.'
    }
  },
  zh: {
    '01': {
      banner: '关于我们',
      badge: '关于我们',
      title: '关于我们',
      desc: '我们通过周密的概念、专业的执行和对细节的极致关注，打造有意义的活动体验。',
      bullets: ['创造非凡体验', '构建人脉纽带', '成就难忘时刻']
    },
    '02': {
      banner: '愿景与使命',
      badge: '愿景与使命',
      title: '愿景与使命',
      desc: '凭借无与伦比的创意与专注，交付完美且极具影响力的活动。'
    },
    '03': {
      banner: '为什么选择我们',
      badge: '核心优势',
      title: '为什么选择我们？',
      desc: '我们坚信成功的活动不仅是美观的现场，更是卓越的体验、极致的执行与对每个细节的专注。'
    },
    '04': {
      banner: '我们的服务',
      badge: '服务项目',
      title: '全方位活动解决方案',
      desc: '从概念到落地，我们倾力操办每个细节，让您专注核心事务。'
    },
    '05': {
      banner: '活动类别',
      badge: '活动类型',
      title: '活动类别',
      desc: '涵盖企业商务、大型音乐节、康养盛会及私享派对。'
    },
    '06': {
      banner: '服务流程',
      badge: '服务流程',
      title: '工作流程',
      desc: '严谨的策划执行流程，确保每次活动都完美交付。'
    },
    '07': {
      banner: '核心团队',
      badge: '核心团队',
      title: '核心团队',
      desc: '同心协力，共享愿景。专业团队凝聚合力，将非凡创意化为现实。'
    },
    '08': {
      banner: '联系我们',
      badge: '联系我们',
      title: '联系我们',
      desc: '心中有憧憬的活动？\n让我们将您的创意化为难忘的现实。'
    }
  },
  tr: {
    '01': {
      banner: 'HAKKIMIZDA',
      badge: 'HAKKIMIZDA',
      title: 'HAKKIMIZDA',
      desc: 'Düşünülmüş konseptler, profesyonel uygulama ve detaylara gösterilen olağanüstü özenle anlamlı deneyimler yaratıyoruz.',
      bullets: ['Deneyimler Yaratmak', 'İnsanları Bağlamak', 'Anları Anlamlı Kılmak']
    },
    '02': {
      banner: 'VİZYON VE MİSYON',
      badge: 'VİZYON VE MİSYON',
      title: 'VİZYON VE MİSYONUMUZ',
      desc: 'Eşsiz yaratıcılık ve adanmışlıkla kusursuz, yüksek etkili etkinlikler sunuyoruz.'
    },
    '03': {
      banner: 'NEDEN BİZİ SEÇMELİSİNİZ',
      badge: 'AVANTAJLARIMIZ',
      title: 'NEDEN BİZİ SEÇMELİSİNİZ?',
      desc: 'Başarılı bir etkinliğin sadece güzel bir kurulumdan ibaret olmadığına inanıyoruz. Bu, deneyim, uygulama ve her detaya özen göstermekle ilgilidir.'
    },
    '04': {
      banner: 'HİZMETLERİMİZ',
      badge: 'HİZMETLER',
      title: 'KAPSAMLI ETKİNLİK ÇÖZÜMLERİ',
      desc: 'Konseptten uygulamaya kadar her detayla biz ilgileniyoruz, böylece siz gerçekten önemli olana odaklanabilirsiniz.'
    },
    '05': {
      banner: 'ETKİNLİK KATEGORİLERİ',
      badge: 'KATEGORİLER',
      title: 'ETKİNLİK KATEGORİLERİ',
      desc: 'Kurumsal kongrelerden coşkulu festivallere ve samimi özel kutlamalara kadar.'
    },
    '06': {
      banner: 'SÜRECİMİZ',
      badge: 'ÇALIŞMA SÜRECİ',
      title: 'ÇALIŞMA SÜRECİ',
      desc: 'Her seferinde kusursuz teslimat sağlayan yapılandırılmış adım adım etkinlik uygulama planımız.'
    },
    '07': {
      banner: 'EKİBİMİZ',
      badge: 'EKİBİMİZ',
      title: 'EKİBİMİZ',
      desc: 'Tek Ekip. Tek Vizyon. Olağanüstü konseptleri gerçeğe dönüştürmek için birleşen adanmış profesyoneller.'
    },
    '08': {
      banner: 'İLETİŞİM',
      badge: 'İLETİŞİM',
      title: 'BİZİMLE İLETİŞİME GEÇİN',
      desc: 'Aklınızda bir etkinlik mi var?\nFikrinizi unutulmaz bir deneyime dönüştürelim.'
    }
  },
  ru: {
    '01': {
      banner: 'О НАС',
      badge: 'О НАС',
      title: 'О НАС',
      desc: 'Мы создаем значимые события благодаря продуманным концепциям, профессиональному исполнению и вниманию к каждой детали.',
      bullets: ['Создание Впечатлений', 'Объединение Людей', 'Ценные Моменты']
    },
    '02': {
      banner: 'ВИДЕНИЕ И МИССИЯ',
      badge: 'ВИДЕНИЕ И МИССИЯ',
      title: 'НАШЕ ВИДЕНИЕ И МИССИЯ',
      desc: 'Проведение безупречных и впечатляющих мероприятий с непревзойденным креативом и преданностью делу.'
    },
    '03': {
      banner: 'ПОЧЕМУ МЫ',
      badge: 'ПОЧЕМУ МЫ',
      title: 'ПОЧЕМУ ВЫБИРАЮТ НАС?',
      desc: 'Мы верим, что успешное событие — это больше, чем просто красивое оформление. Это впечатления, четкое исполнение и внимание к деталям.'
    },
    '04': {
      banner: 'НАШИ УСЛУГИ',
      badge: 'УСЛУГИ',
      title: 'ПОЛНЫЙ КОМПЛЕКС ИВЕНТ-УСЛУГ',
      desc: 'От идеи до реализации — мы берем на себя все детали, чтобы вы могли сосредоточиться на главном.'
    },
    '05': {
      banner: 'КАТЕГОРИИ СОБЫТИЙ',
      badge: 'КАТЕГОРИИ',
      title: 'СОБЫТИЯ, КОТОРЫЕ МЫ СОЗДАЕМ',
      desc: 'От корпоративных конференций до грандиозных фестивалей и частных торжеств.'
    },
    '06': {
      banner: 'НАШ ПРОЦЕСС',
      badge: 'ПРОЦЕСС РАБОТЫ',
      title: 'ОТ ИДЕИ К ВПЕЧАТЛЕНИЯМ',
      desc: 'Наш поэтапный план организации гарантирует безупречное проведение каждого мероприятия.'
    },
    '07': {
      banner: 'НАША КОМАНДА',
      badge: 'КОМАНДА',
      title: 'ЛЮДИ, СОЗДАЮЩИЕ ВПЕЧАТЛЕНИЯ',
      desc: 'Одна команда. Одно видение. Профессионалы, объединившиеся для воплощения экстраординарных идей в реальность.'
    },
    '08': {
      banner: 'СВЯЗАТЬСЯ С НАМИ',
      badge: 'КОНТАКТЫ',
      title: 'СОЗДАДИМ ЧТО-ТО ИСКЛЮЧИТЕЛЬНОЕ',
      desc: "Планируете мероприятие?\nДавайте превратим вашу идею в незабываемое событие."
    }
  }
};

const subTranslations: Record<LanguageCode, {
  sec02Steps: [string, string, string, string];
  sec03Vision: {
    visionTitle: string;
    visionText: string;
    missionTitle: string;
    pillars: Array<{ title: string; desc: string }>;
  };
  sec04WhyUs: Array<{ title: string; desc: string }>;
  sec05Services: {
    top6: string[];
    bottom2: string[];
    tagline: string;
  };
  sec06Categories: Array<{ title: string; desc: string }>;
  sec07Process: {
    steps: Array<{ title: string; desc: string }>;
    promiseBadge: string;
    promiseQuote: string;
  };
  sec08Team: {
    roles: Array<{ title: string; desc: string }>;
    sloganTitle: string;
    sloganDesc: string;
  };
  sec09Contact: {
    prompt: string;
    whatsappBtn: string;
    callBtn: string;
  };
}> = {
  en: {
    sec02Steps: ['CONCEPT', 'PLAN', 'EXECUTE', 'EXPERIENCE'],
    sec03Vision: {
      visionTitle: 'OUR VISION',
      visionText: 'To become a trusted and innovative event management partner in Bali and Indonesia, creating exceptional experiences that connect people, brands, and communities.',
      missionTitle: 'OUR MISSION',
      pillars: [
        { title: 'CREATE', desc: 'Develop unique and meaningful event concepts tailored to every client.' },
        { title: 'DELIVER', desc: 'Execute every event with professionalism, precision, and attention to detail.' },
        { title: 'CONNECT', desc: 'Build meaningful connections between brands, audiences, communities, and partners.' },
        { title: 'ELEVATE', desc: 'Continuously improve the quality and experience of every event we create.' }
      ]
    },
    sec04WhyUs: [
      { title: 'CREATIVE CONCEPT', desc: 'Unique event concepts designed around your objectives and audience.' },
      { title: 'PROFESSIONAL EXECUTION', desc: 'A dedicated team managing every stage from preparation to event day.' },
      { title: 'END-TO-END SERVICE', desc: 'From concept development, production, entertainment, logistics, to guest management.' },
      { title: 'RELIABLE PARTNERS', desc: 'Access to trusted vendors, talents, venues, and production partners.' },
      { title: 'FLEXIBLE SOLUTIONS', desc: 'Every event is customized according to your budget, objectives, and expectations.' },
      { title: 'BALI EXPERIENCE', desc: 'Local knowledge, connections, and operational experience across Bali.' }
    ],
    sec05Services: {
      top6: [
        'EVENT PLANNING & MANAGEMENT',
        'CORPORATE EVENTS',
        'PRIVATE EVENTS',
        'FESTIVAL & EXHIBITION',
        'SPORTS & WELLNESS',
        'ENTERTAINMENT'
      ],
      bottom2: [
        'EVENT PRODUCTION',
        'MEDIA & DOCUMENTATION'
      ],
      tagline: '"From concept to execution, we handle every detail so you can focus on what truly matters."'
    },
    sec06Categories: [
      { title: 'CORPORATE', desc: 'Gathering, Meeting, Retreat, Gala Dinner' },
      { title: 'WELLNESS', desc: 'Pilates, Yoga, Wellness Retreat' },
      { title: 'SPORTS', desc: 'Fun Run, Fitness Competition, Tournament' },
      { title: 'ENTERTAINMENT', desc: 'Concert, Live Performance, DJ Night' },
      { title: 'FESTIVAL', desc: 'Music, Food, Cultural, Sunset Festival' },
      { title: 'EXHIBITION', desc: 'Expo, Product Exhibition, Brand Showcase' },
      { title: 'PRIVATE', desc: 'Birthday, Anniversary, Private Party' },
      { title: 'BRAND ACTIVATION', desc: 'Product Launch, Campaign, Activation' },
      { title: 'COMMUNITY', desc: 'Charity, Social Gathering, Community Event' },
      { title: 'MICE', desc: 'Meeting, Incentive, Conference, Exhibition' }
    ],
    sec07Process: {
      steps: [
        { title: 'DISCOVER', desc: 'We listen to your objectives, audience, expectations, and budget.' },
        { title: 'CONCEPT', desc: 'Our creative team develops the event concept, theme, experience, and visual direction.' },
        { title: 'PLAN', desc: 'We prepare the budget, timeline, venue, vendors, production, talent, logistics, and operational plan.' },
        { title: 'EXECUTE', desc: 'Our team manages the event on-site, ensuring every element runs according to plan.' },
        { title: 'EVALUATE', desc: 'After the event, we review the execution, collect feedback, and provide documentation.' }
      ],
      promiseBadge: 'OUR PROMISE',
      promiseQuote: '"You bring the vision. We bring it to life."'
    },
    sec08Team: {
      roles: [
        { title: 'EVENT DIRECTOR', desc: 'Responsible for overall event strategy, client communication, and project direction.' },
        { title: 'PROJECT MANAGER', desc: 'Managing planning, timeline, budget, vendors, and event operations.' },
        { title: 'CREATIVE TEAM', desc: 'Developing concepts, themes, branding, and visual direction.' },
        { title: 'PRODUCTION TEAM', desc: 'Managing stage, sound, lighting, LED, technical production, and venue setup.' },
        { title: 'EVENT CREW', desc: 'Handling registration, guest experience, ushering, hospitality, and on-site operations.' }
      ],
      sloganTitle: 'ONE TEAM. ONE VISION.',
      sloganDesc: 'We believe great events are created by great teamwork.'
    },
    sec09Contact: {
      prompt: "Have an event in mind?\nLet's turn your idea into an experience.",
      whatsappBtn: 'Inquire On WhatsApp',
      callBtn: 'Call N3 Direct'
    }
  },
  ar: {
    sec02Steps: ['الفكرة', 'التخطيط', 'التنفيذ', 'التجربة'],
    sec03Vision: {
      visionTitle: 'رؤيتنا',
      visionText: 'أن نكون الشريك الموثوق والمبتكر لإدارة الفعاليات في بالي وإندونيسيا، ونبتكر تجارب استثنائية تربط بين الأفراد والعلامات التجارية والمجتمعات.',
      missionTitle: 'مهمتنا',
      pillars: [
        { title: 'CREATE (ابتكار)', desc: 'تطوير مفاهيم فريدة ومميزة للفعاليات مخصصة لكل عميل.' },
        { title: 'DELIVER (تنفيذ)', desc: 'تنفيذ كل فعالية باحترافية ودقة واهتمام تام بالتفاصيل.' },
        { title: 'CONNECT (تواصل)', desc: 'بناء روابط معنوية وقوية بين العلامات التجارية والجمهور والمجتمعات والشركاء.' },
        { title: 'ELEVATE (ارتقاء)', desc: 'التطوير المستمر لجودة وتجربة كل فعالية نبتكرها.' }
      ]
    },
    sec04WhyUs: [
      { title: 'مفهوم إبداعي', desc: 'مفاهيم فريدة للفعاليات مصممة حول أهدافك وجمهورك.' },
      { title: 'تنفيذ احترافي', desc: 'فريق متخصص يدير كل مرحلة من التحضير حتى يوم الفعالية.' },
      { title: 'خدمات شاملة', desc: 'من تطوير المفهوم والإنتاج والترفيه والخدمات اللوجستية إلى إدارة الضيوف.' },
      { title: 'شركاء موثوقون', desc: 'الوصول إلى الموردين والمواهب والأماكن وشركاء الإنتاج الموثوقين.' },
      { title: 'حلول مرنة', desc: 'يتم تخصيص كل فعالية وفقًا لميزانيتك وأهدافك وتوقعاتك.' },
      { title: 'خبرة بالي', desc: 'المعرفة المحلية والصلات والخبرة التشغيلية الممتدة في جميع أنحاء بالي.' }
    ],
    sec05Services: {
      top6: [
        'تخطيط وإدارة الفعاليات',
        'الفعاليات المؤسسية',
        'الفعاليات الخاصة',
        'المهرجانات والمعارض',
        'الرياضة والصحة',
        'البرامج الترفيهية'
      ],
      bottom2: [
        'إنتاج الفعاليات',
        'الإعلام والتوثيق'
      ],
      tagline: '"من الفكرة إلى التنفيذ، نتولى جميع التفاصيل حتى تتمكن من التركيز على ما يهمك بحق."'
    },
    sec06Categories: [
      { title: 'مؤسسية', desc: 'لقاءات، اجتماعات، ملاذات للشركات، حفل عشاء' },
      { title: 'الصحة والاستجمام', desc: 'بيلاتس، يوغا، ملاذات صحية' },
      { title: 'رياضية', desc: 'سباقات ممتعة، مسابقات لياقة، بطولات' },
      { title: 'ترفيهية', desc: 'حفلات موسيقية، عروض حية، ليالي دي جيه' },
      { title: 'مهرجانات', desc: 'موسيقى، طعام، مهرجانات ثقافية وغروب الشمس' },
      { title: 'معارض', desc: 'معارض، معارض منتجات، استعراض العلامات التجارية' },
      { title: 'خاصة', desc: 'أعياد ميلاد، ذكرى سنوية، حفلات خاصة' },
      { title: 'تنشيط العلامة', desc: 'إطلاق المنتجات، حملات ترويجية، تنشيط العلامة التجارية' },
      { title: 'مجتمعية', desc: 'أعمال خيرية، تجمعات اجتماعية، فعاليات مجتمعية' },
      { title: 'سياحة الفعاليات (MICE)', desc: 'اجتماعات، حوافز، مؤتمرات، معارض' }
    ],
    sec07Process: {
      steps: [
        { title: 'اكتشاف', desc: 'نستمع إلى أهدافك، جمهورك، توقعاتك، وميزانيتك.' },
        { title: 'المفهوم', desc: 'يطور فريقنا الإبداعي مفهوم الفعالية والموضوع والتجربة والتوجه البصري.' },
        { title: 'التخطيط', desc: 'نعد الميزانية والجدول الزمني والمكان والموردين والإنتاج والمواهب واللوجستيات والخطة التشغيلية.' },
        { title: 'التنفيذ', desc: 'يدير فريقنا الفعالية في الموقع، مع ضمان سير كل عنصر وفقًا للخطة.' },
        { title: 'التقييم', desc: 'بعد الفعالية، نراجع التنفيذ ونجمع الملاحظات ونقدم التوثيق الكامل.' }
      ],
      promiseBadge: 'وعدنا لكم',
      promiseQuote: '"أنت تجلب الرؤية. ونحن نحولها إلى واقع."'
    },
    sec08Team: {
      roles: [
        { title: 'مدير الفعالية', desc: 'مسؤول عن استراتيجية الفعالية العامة والتواصل مع العملاء وتوجيه المشروع.' },
        { title: 'مدير المشروع', desc: 'إدارة التخطيط والجدول الزمني والميزانية والموردين وعمليات الفعالية.' },
        { title: 'الفريق الإبداعي', desc: 'تطوير المفاهيم والموضوعات والهوية البصرية والتوجه الفني.' },
        { title: 'فريق الإنتاج', desc: 'إدارة المسرح والصوت والإضاءة ومؤثرات LED والإنتاج الفني وتجهيز الموقع.' },
        { title: 'طاقم العمل', desc: 'التعامل مع التسجيل وتجربة الضيوف والارشاد والضيافة والعمليات الميدانية.' }
      ],
      sloganTitle: 'فريق واحد. رؤية واحدة.',
      sloganDesc: 'نحن نؤمن بأن الفعاليات العظيمة تُصنع بعمل الفريق الرائع.'
    },
    sec09Contact: {
      prompt: "هل لديك فعالية في ذهنك؟\nدعنا نحول فكرتك إلى تجربة لا تُنسى.",
      whatsappBtn: 'تواصل معنا عبر واتساب',
      callBtn: 'اتصل بنا مباشرة'
    }
  },
  id: {
    sec02Steps: ['KONSEP', 'PERENCANAAN', 'EKSEKUSI', 'PENGALAMAN'],
    sec03Vision: {
      visionTitle: 'VISI KAMI',
      visionText: 'Menjadi mitra manajemen acara yang terpercaya dan inovatif di Bali dan Indonesia, menciptakan pengalaman luar biasa yang menghubungkan orang, merek, dan komunitas.',
      missionTitle: 'MISI KAMI',
      pillars: [
        { title: 'CREATE', desc: 'Mengembangkan konsep acara yang unik dan bermakna yang disesuaikan untuk setiap klien.' },
        { title: 'DELIVER', desc: 'Mengeksekusi setiap acara dengan profesionalisme, presisi, dan perhatian terhadap detail.' },
        { title: 'CONNECT', desc: 'Membangun hubungan bermakna antara merek, audiens, komunitas, dan mitra.' },
        { title: 'ELEVATE', desc: 'Tersedia secara berkelanjutan meningkatkan kualitas dan pengalaman setiap acara.' }
      ]
    },
    sec04WhyUs: [
      { title: 'KONSEP KREATIF', desc: 'Konsep acara unik yang dirancang sesuai tujuan dan audiens Anda.' },
      { title: 'EKSEKUSI PROFESIONAL', desc: 'Tim berdedikasi yang mengelola setiap tahap dari persiapan hingga hari H.' },
      { title: 'LAYANAN LENGKAP', desc: 'Dari pengembangan konsep, produksi, hiburan, logistik, hingga manajemen tamu.' },
      { title: 'MITRA TERPERCAYA', desc: 'Akses ke vendor, talenta, tempat, dan mitra produksi terpercaya.' },
      { title: 'SOLUSI FLEKSIBEL', desc: 'Setiap acara disesuaikan dengan anggaran, tujuan, dan harapan Anda.' },
      { title: 'PENGALAMAN BALI', desc: 'Pengetahuan lokal, koneksi, dan pengalaman operasional di seluruh Bali.' }
    ],
    sec05Services: {
      top6: [
        'PERENCANAAN & MANAJEMEN ACARA',
        'ACARA PERUSAHAAN',
        'ACARA PRIBADI',
        'FESTIVAL & PAMERAN',
        'OLAH RAGA & KESEHATAN',
        'HIBURAN'
      ],
      bottom2: [
        'PRODUKSI ACARA',
        'MEDIA & DOKUMENTASI'
      ],
      tagline: '"Dari konsep hingga eksekusi, kami menangani setiap detail sehingga Anda dapat fokus pada hal terpenting."'
    },
    sec06Categories: [
      { title: 'PERUSAHAAN', desc: 'Gathering, Rapat, Retreat, Gala Dinner' },
      { title: 'KESEHATAN', desc: 'Pilates, Yoga, Wellness Retreat' },
      { title: 'OLAH RAGA', desc: 'Fun Run, Kompetisi Kebugaran, Turnamen' },
      { title: 'HIBURAN', desc: 'Konser, Pertunjukan Langsung, DJ Night' },
      { title: 'FESTIVAL', desc: 'Festival Musik, Kuliner, Budaya, Sunset' },
      { title: 'PAMERAN', desc: 'Expo, Pameran Produk, Showroom Brand' },
      { title: 'PRIBADI', desc: 'Ulang Tahun, Peringatan, Pesta Pribadi' },
      { title: 'ACTIVATION BRAND', desc: 'Peluncuran Produk, Kampanye, Aktivasi' },
      { title: 'KOMUNITAS', desc: 'Bakti Sosial, Gathering, Acara Komunitas' },
      { title: 'MICE', desc: 'Rapat, Insentif, Konferensi, Pameran' }
    ],
    sec07Process: {
      steps: [
        { title: 'PENEMUAN', desc: 'Kami mendengarkan tujuan, audiens, harapan, dan anggaran Anda.' },
        { title: 'KONSEP', desc: 'Tim kreatif kami mengembangkan konsep acara, tema, pengalaman, dan arahan visual.' },
        { title: 'PERENCANAAN', desc: 'Kami menyiapkan anggaran, jadwal, tempat, vendor, produksi, talenta, logistik, dan rencana operasional.' },
        { title: 'EKSEKUSI', desc: 'Tim kami mengelola acara di lokasi, memastikan setiap elemen berjalan sesuai rencana.' },
        { title: 'EVALUASI', desc: 'Setelah acara, kami meninjau eksekusi, mengumpulkan umpan balik, dan menyediakan dokumentasi lengkap.' }
      ],
      promiseBadge: 'JANJI KAMI',
      promiseQuote: '"Anda membawa visi. Kami mewujudkannya menjadi kenyataan."'
    },
    sec08Team: {
      roles: [
        { title: 'DIREKTUR ACARA', desc: 'Bertanggung jawab atas strategi acara keseluruhan, komunikasi klien, dan arahan proyek.' },
        { title: 'MANAJER PROYEK', desc: 'Mengelola perencanaan, jadwal, anggaran, vendor, dan operasi acara.' },
        { title: 'TIM KREATIF', desc: 'Mengembangkan konsep, tema, branding, dan arahan visual.' },
        { title: 'TIM PRODUKSI', desc: 'Mengelola panggung, suara, pencahayaan, LED, produksi teknis, dan penataan lokasi.' },
        { title: 'KRU ACARA', desc: 'Menangani pendaftaran, pengalaman tamu, pengawalan, katering, dan operasi lapangan.' }
      ],
      sloganTitle: 'SATU TIM. SATU VISI.',
      sloganDesc: 'Kami percaya acara hebat diciptakan oleh kerja tim yang hebat.'
    },
    sec09Contact: {
      prompt: 'Punya ide acara di pikiran Anda?\nMari ubah ide Anda menjadi pengalaman tak terlupakan.',
      whatsappBtn: 'Tanyakan via WhatsApp',
      callBtn: 'Hubungi N3 Langsung'
    }
  },
  zh: {
    sec02Steps: ['创意构思', '周密策划', '高效执行', '卓越体验'],
    sec03Vision: {
      visionTitle: '企业愿景',
      visionText: '成为巴厘岛及印尼最具信赖与创新力的活动管理伙伴，打造连接人际、品牌与社区的非凡体验。',
      missionTitle: '企业使命',
      pillars: [
        { title: 'CREATE (创新)', desc: '为每位客户量身定制独一无二且内涵丰富的活动概念。' },
        { title: 'DELIVER (交付)', desc: '以专业、精准和对细节的极高要求执行每场活动。' },
        { title: 'CONNECT (连接)', desc: '在品牌、受众、社区和合作伙伴之间建立深远有意义的纽带。' },
        { title: 'ELEVATE (提升)', desc: '持续提升我们打造的每一场活动的品质与参与体验。' }
      ]
    },
    sec04WhyUs: [
      { title: '创意概念', desc: '围绕您的目标与受众量身定制独具特色的活动方案。' },
      { title: '专业执行', desc: '专属项目团队全程统筹，从筹备阶段直至于活动现场。' },
      { title: '一站式服务', desc: '涵盖概念开发、舞美制作、演艺经纪、物流及嘉宾接待。' },
      { title: '可靠伙伴', desc: '深厚的供应商、演艺人才、优质场地及制作伙伴资源。' },
      { title: '灵活定制', desc: '根据您的预算、战略目标与期望精准定制每场活动。' },
      { title: '巴厘岛地缘优势', desc: '深厚的本土资源、广泛人脉及覆盖巴厘岛全境的执行经验。' }
    ],
    sec05Services: {
      top6: [
        '活动策划与管理',
        '企业商务活动',
        '私人高端派对',
        '音乐节与展会',
        '体育与康养盛会',
        '演艺娱乐项目'
      ],
      bottom2: [
        '舞美工程制作',
        '媒体与影视记录'
      ],
      tagline: '“从概念构思到现场落地，我们操办每个细节，让您无忧专注核心事业。”'
    },
    sec06Categories: [
      { title: '企业商务', desc: '年终聚会、商务会议、团队团队游、晚宴' },
      { title: '康养体验', desc: '普拉提、瑜伽静修、健康体验营' },
      { title: '体育赛事', desc: '趣跑、健身挑战赛、各类锦标赛' },
      { title: '演艺娱乐', desc: '演唱会、现场演出、电音DJ之夜' },
      { title: '音乐节', desc: '音乐节、美食节、文化节、落日嘉年华' },
      { title: '展会盛典', desc: '博览会、新品发布会、品牌展示会' },
      { title: '私人派对', desc: '生日派对、周年纪念、私人高定宴会' },
      { title: '品牌激活', desc: '新品首发、营销快闪、品牌推广活动' },
      { title: '社区活动', desc: '慈善义演、社交聚会、社区文化活动' },
      { title: 'MICE会展', desc: '会议、奖励旅游、大型峰会、展览' }
    ],
    sec07Process: {
      steps: [
        { title: '需求探索', desc: '倾听您的活动目标、受众定位、品质期望与预算需求。' },
        { title: '概念生成', desc: '创意团队梳理主题概念、视觉方向与互动体验架构。' },
        { title: '周密规划', desc: '编制详细预算、时间表、场地场地、供应商、舞美及运营预案。' },
        { title: '现场执行', desc: '资深督导团队驻场指挥，确保各环节严丝合缝精确运转。' },
        { title: '评估复盘', desc: '活动结束后总结成果，收集反馈并交付完整影音复盘档案。' }
      ],
      promiseBadge: '我们的承诺',
      promiseQuote: '“您描绘愿景，我们将其化为非凡现实。”'
    },
    sec08Team: {
      roles: [
        { title: '活动总监', desc: '全面统筹活动战略、客户对接与项目宏观方向。' },
        { title: '项目经理', desc: '精准管控时间节点、预算开支、供应商调配及现场运营。' },
        { title: '创意团队', desc: '负责活动主视觉、主概念设计、主品牌调性及艺术指导。' },
        { title: '舞美制作团队', desc: '掌控舞台搭建、音响灯光、LED屏幕、技术控制及场地布置。' },
        { title: '现场执行团队', desc: '统筹嘉宾签到、礼仪接待、现场导引及服务保障。' }
      ],
      sloganTitle: '同心协力 · 共享愿景',
      sloganDesc: '我们坚信卓越的活动源于无间协作的专业团队。'
    },
    sec09Contact: {
      prompt: '心中有憧憬的活动？\n让我们将您的创意化为难忘的现实。',
      whatsappBtn: '通过 WhatsApp 咨询',
      callBtn: '直接拨打 N3 电话'
    }
  },
  tr: {
    sec02Steps: ['KONSEPT', 'PLANLAMA', 'UYGULAMA', 'DENEYİM'],
    sec03Vision: {
      visionTitle: 'VİZYONUMUZ',
      visionText: 'Bali ve Endonezya\'da insanları, markaları ve toplulukları bir araya getiren olağanüstü deneyimler yaratan, güvenilir ve yenilikçi bir etkinlik yönetim ortağı olmak.',
      missionTitle: 'MİSYONUMUZ',
      pillars: [
        { title: 'CREATE (YARAT)', desc: 'Her müşteriye özel benzersiz ve anlamlı etkinlik konseptleri geliştirmek.' },
        { title: 'DELIVER (TESLİM ET)', desc: 'Her etkinliği profesyonellik, hassasiyet ve detaylara özenle yürütmek.' },
        { title: 'CONNECT (BAĞ KUR)', desc: 'Markalar, izleyiciler, topluluklar ve ortaklar arasında güçlü bağlar kurmak.' },
        { title: 'ELEVATE (YÜKSELT)', desc: 'Yarattığımız her etkinliğin kalitesini ve deneyimini sürekli iyileştirmek.' }
      ]
    },
    sec04WhyUs: [
      { title: 'YARATICI KONSEPT', desc: 'Hedeflerinize ve hedef kitlenize özel tasarlanmış benzersiz konseptler.' },
      { title: 'PROFESYONEL UYGULAMA', desc: 'Hazırlık aşamasından etkinlik gününe kadar her aşamayı yöneten uzman ekip.' },
      { title: 'UÇTAN UCA HİZMET', desc: 'Konsept geliştirmeden prodüksiyona, eğlenceden lojistik ve konuk yönetimine.' },
      { title: 'GÜVENİLİR ORTAKLAR', desc: 'Güvenilir tedarikçilere, yeteneklere, mekanlara ve prodüksiyon ortaklarına erişim.' },
      { title: 'ESNEK ÇÖZÜMLER', desc: 'Her etkinlik bütçenize, hedeflerinize ve beklentilerinize göre özelleştirilir.' },
      { title: 'BALİ DENEYİMİ', desc: 'Bali genelinde yerel bilgi, bağlantılar ve operasyonel deneyim.' }
    ],
    sec05Services: {
      top6: [
        'ETKİNLİK PLANLAMA VE YÖNETİMİ',
        'KURUMSAL ETKİNLİKLER',
        'ÖZEL ETKİNLİKLER',
        'FESTİVAL VE SERGİ',
        'SPOR VE SAĞLIKLI YAŞAM',
        'EĞLENCE'
      ],
      bottom2: [
        'ETKİNLİK PRODÜKSİYONU',
        'MEDYA VE BELGELENDİRME'
      ],
      tagline: '"Konseptten uygulamaya kadar tüm detayları biz yönetiyoruz, siz sadece anın tadını çıkarın."'
    },
    sec06Categories: [
      { title: 'KURUMSAL', desc: 'Buluşma, Toplantı, Şirket Kampı, Gala Yemeği' },
      { title: 'SAĞLIKLI YAŞAM', desc: 'Pilates, Yoga, Sağlık Kampı' },
      { title: 'SPOR', desc: 'Eğlenceli Koşu, Fitness Yarışması, Turnuva' },
      { title: 'EĞLENCE', desc: 'Konser, Canlı Performans, DJ Gecesi' },
      { title: 'FESTİVAL', desc: 'Müzik, Yemek, Kültür, Gün Batımı Festivali' },
      { title: 'SERGİ', desc: 'Expo, Ürün Sergisi, Marka Tanıtımı' },
      { title: 'ÖZEL', desc: 'Doğum Günü, Yıldönümü, Özel Parti' },
      { title: 'MARKA TANITIMI', desc: 'Ürün Lansmanı, Kampanya, Aktivasyon' },
      { title: 'TOPLULUK', desc: 'Hayır İşleri, Sosyal Buluşma, Topluluk Etkinliği' },
      { title: 'MICE', desc: 'Toplantı, Teşvik, Konferans, Sergi' }
    ],
    sec07Process: {
      steps: [
        { title: 'KEŞFET', desc: 'Hedeflerinizi, kitlenizi, beklentilerinizi ve bütçenizi dinliyoruz.' },
        { title: 'KONSEPT', desc: 'Yaratıcı ekibimiz konsepti, temayı, deneyimi ve görsel yönü geliştirir.' },
        { title: 'PLANLA', desc: 'Bütçe, zaman çizelgesi, mekan, tedarikçiler, prodüksiyon ve lojistiği hazırlıyoruz.' },
        { title: 'UYGULA', desc: 'Ekibimiz sahadaki etkinliği yönetir, her unsurun plana uygun işlemesini sağlar.' },
        { title: 'DEĞERLENDİR', desc: 'Etkinlik sonrasında uygulamayı gözden geçirir, geri bildirimleri toplarız.' }
      ],
      promiseBadge: 'SÖZÜMÜZ',
      promiseQuote: '"Siz vizyonu getirin. Biz onu hayata geçirelim."'
    },
    sec08Team: {
      roles: [
        { title: 'ETKİNLİK DİREKTÖRÜ', desc: 'Genel etkinlik stratejisi, müşteri iletişimi ve proje yönlendirmesinden sorumlu.' },
        { title: 'PROJE MÜDÜRÜ', desc: 'Planlama, zaman çizelgesi, bütçe, tedarikçiler ve operasyonların yönetimi.' },
        { title: 'YARATICI EKİP', desc: 'Konseptler, temalar, markalaşma ve görsel yönün geliştirilmesi.' },
        { title: 'PRODÜKSİYON EKİBİ', desc: 'Sahne, ses, ışık, LED, teknik prodüksiyon ve mekan kurulumunun yönetimi.' },
        { title: 'ETKİNLİK EKİBİ', desc: 'Kayıt, konuk deneyimi, karşılama ve saha operasyonlarının yürütülmesi.' }
      ],
      sloganTitle: 'TEK EKİP. TEK VİZYON.',
      sloganDesc: 'Harika etkinliklerin harika bir takım çalışmasıyla yaratıldığına inanıyoruz.'
    },
    sec09Contact: {
      prompt: 'Aklınızda bir etkinlik mi var?\nFikrinizi unutulmaz bir deneyime dönüştürelim.',
      whatsappBtn: 'WhatsApp Üzerinden Danışın',
      callBtn: 'N3\'ü Doğrudan Arayın'
    }
  },
  ru: {
    sec02Steps: ['КОНЦЕПЦИЯ', 'ПЛАН', 'ИСПОЛНЕНИЕ', 'ВПЕЧАТЛЕНИЯ'],
    sec03Vision: {
      visionTitle: 'НАШЕ ВИДЕНИЕ',
      visionText: 'Стать надежным и инновационным партнером по организации мероприятий на Бали и в Индонезии, создавая исключительные события.',
      missionTitle: 'НАША МИССИЯ',
      pillars: [
        { title: 'CREATE (СОЗДАВАТЬ)', desc: 'Разрабатывать уникальные концепции событий для каждого клиента.' },
        { title: 'DELIVER (ВОПЛОЩАТЬ)', desc: 'Проводить каждое мероприятие с профессионализмом и точностью.' },
        { title: 'CONNECT (ОБЪЕДИНЯТЬ)', desc: 'Строить глубокие связи между брендами, аудиторией и партнерами.' },
        { title: 'ELEVATE (РАЗВИВАТЬ)', desc: 'Постоянно повышать качество и уровень каждого создаваемого события.' }
      ]
    },
    sec04WhyUs: [
      { title: 'КРЕАТИВНАЯ КОНЦЕПЦИЯ', desc: 'Уникальные концепции, разработанные под ваши цели и аудиторию.' },
      { title: 'ПРОФЕССИОНАЛЬНОЕ ИСПОЛНЕНИЕ', desc: 'Команда, управляющая каждым этапом от подготовки до дня события.' },
      { title: 'ПОЛНЫЙ ЦИКЛ УСЛУГ', desc: 'От концепта, технического оснащения и артистов до логистики и приема гостей.' },
      { title: 'НАДЕЖНЫЕ ПАРТНЕРЫ', desc: 'Доступ к лучшим подрядчикам, площадкам и артистам.' },
      { title: 'ГИБКИЕ РЕШЕНИЯ', desc: 'Индивидуальная адаптация под ваш бюджет, цели и ожидания.' },
      { title: 'ОПЫТ НА БАЛИ', desc: 'Локальные связи, глубокие знания и успешный опыт работы по всему Бали.' }
    ],
    sec05Services: {
      top6: [
        'ОРГАНИЗАЦИЯ И МЕНЕДЖМЕНТ СОБЫТИЙ',
        'КОРПОРАТИВНЫЕ МЕРОПРИЯТИЯ',
        'ЧАСТНЫЕ ТОРЖЕСТВА',
        'ФЕСТИВАЛИ И ВЫСТАВКИ',
        'СПОРТ И WELLNESS',
        'ШОУ И РАЗВЛЕЧЕНИЯ'
      ],
      bottom2: [
        'ТЕХНИЧЕСКИЙ ПРОДАКШН',
        'МЕДИАСЪЕМКА И ДОКУМЕНТАЦИЯ'
      ],
      tagline: '"От идеи до воплощения — мы берем на себя все детали, чтобы вы могли наслаждаться моментом."'
    },
    sec06Categories: [
      { title: 'КОРПОРАТИВ', desc: 'Тимбилдинг, Саммиты, Ретриты, Гала-Ужин' },
      { title: 'WELLNESS', desc: 'Пилатес, Йога, Здоровый ретрит' },
      { title: 'СПОРТ', desc: 'Забеги, Фитнес-турниры, Соревнования' },
      { title: 'ШОУ', desc: 'Концерты, Шоу-программы, DJ Вечеринки' },
      { title: 'ФЕСТИВАЛИ', desc: 'Музыкальные, Гастрономические, Культурные' },
      { title: 'ВЫСТАВКИ', desc: 'Экспо, Презентации продуктов, Шоурумы' },
      { title: 'ЧАСТНЫЕ', desc: 'Дни рождения, Юбилеи, Закрытые вечеринки' },
      { title: 'АКТИВАЦИЯ БРЕНДА', desc: 'Запуск продуктов, Промо-кампании, Поп-ап' },
      { title: 'СООБЩЕСТВА', desc: 'Благотворительность, Встречи, Социальные события' },
      { title: 'MICE', desc: 'Конференции, Инсентив-туры, Выставки' }
    ],
    sec07Process: {
      steps: [
        { title: 'АНАЛИЗ', desc: 'Мы изучаем ваши цели, аудиторию, ожидания и бюджет.' },
        { title: 'КОНЦЕПЦИЯ', desc: 'Креативная команда разрабатывает тему, визуальный стиль и сценарий.' },
        { title: 'ПЛАНИРОВАНИЕ', desc: 'Готовим смету, тайминг, площадку, подрядчиков и логистику.' },
        { title: 'РЕАЛИЗАЦИЯ', desc: 'Команда координирует событие на площадке в режиме реального времени.' },
        { title: 'ИТОГИ', desc: 'Подводим итоги, собираем отзывы и предоставляем фото/видео отчеты.' }
      ],
      promiseBadge: 'НАШЕ ОБЕЩАНИЕ',
      promiseQuote: '"Вы приносите видение. Мы превращаем его в реальность."'
    },
    sec08Team: {
      roles: [
        { title: 'ИВЕНТ-ДИРЕКТОР', desc: 'Отвечает за общую стратегию события и коммуникацию с клиентом.' },
        { title: 'ПРОЕКТ-МЕНЕДЖЕР', desc: 'Управляет таймингом, бюджетом, подрядчиками и операционной частью.' },
        { title: 'КРЕАТИВНЫЙ ОТДЕЛ', desc: 'Разрабатывает концепции, стиль, брендинг и визуальные направления.' },
        { title: 'ТЕХНИЧЕСКАЯ КОМАНДА', desc: 'Управляет сценой, светом, звуком, LED-экранами и технической частью.' },
        { title: 'СЛУЖБА ЗАБОТЫ', desc: 'Встреча гостей, регистрация, навигация и комфорт участников.' }
      ],
      sloganTitle: 'ОДНА КОМАНДА. ОДНО ВИДЕНИЕ.',
      sloganDesc: 'Мы верим, что великие события создаются благодаря слаженной командной работе.'
    },
    sec09Contact: {
      prompt: 'Планируете мероприятие?\nДавайте превратим вашу идею в незабываемое событие.',
      whatsappBtn: 'Консультация в WhatsApp',
      callBtn: 'Позвонить в N3 Direct'
    }
  }
};

export const HomePageSections: React.FC<HomePageSectionsProps> = ({
  onSelectDestination,
  t,
  currentLanguage,
}) => {
  const activeLang: LanguageCode = currentLanguage || ( /[\u0600-\u06FF]/.test(t.eyebrow) ? 'ar' : 'en' );
  const langTexts = sectionTranslations[activeLang] || sectionTranslations['en'];
  const subData = subTranslations[activeLang] || subTranslations['en'];

  // State loaded from LocalStorage for sections, services, gallery, and site settings
  const [savedSections, setSavedSections] = useState<Record<string, any>>(() => {
    try {
      const saved = localStorage.getItem('n3_sections_data');
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return {};
  });

  const [customServices, setCustomServices] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('n3_custom_services_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { console.error(e); }
    return [];
  });

  const [customGallery, setCustomGallery] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('n3_custom_gallery_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { console.error(e); }
    return [];
  });

  const [siteSettings, setSiteSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('n3_site_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return { whatsapp: '+6281234567890' };
  });

  useEffect(() => {
    // Sync initial state from Supabase if configured
    const loadFromSupabase = async () => {
      try {
        const [dbSections, dbServices, dbGallery, dbSettings] = await Promise.all([
          fetchSectionsFromSupabase(),
          fetchServicesFromSupabase(),
          fetchGalleryFromSupabase(),
          fetchSiteSettingsFromSupabase()
        ]);

        if (dbSections && dbSections.length > 0) {
          const mapSec: Record<string, any> = {};
          dbSections.forEach(s => {
            mapSec[s.section_id] = {
              titleAr: s.title,
              titleEn: s.title,
              descAr: s.description,
              descEn: s.description,
              badgeAr: s.badge,
              badgeEn: s.badge,
              imageUrl: s.image,
              customNotesAr: s.note,
              customNotesEn: s.note
            };
          });
          setSavedSections(prev => ({ ...prev, ...mapSec }));
        }

        if (dbServices && dbServices.length > 0) {
          setCustomServices(dbServices);
        }

        if (dbGallery && dbGallery.length > 0) {
          setCustomGallery(dbGallery);
        }

        if (dbSettings) {
          setSiteSettings(prev => ({ ...prev, ...dbSettings }));
        }
      } catch (err) {
        console.warn('Error loading initial data from Supabase:', err);
      }
    };

    loadFromSupabase();

    const handleUpdate = () => {
      try {
        const savedSec = localStorage.getItem('n3_sections_data');
        if (savedSec) setSavedSections(JSON.parse(savedSec));

        const savedSrv = localStorage.getItem('n3_custom_services_list');
        if (savedSrv) {
          const parsedSrv = JSON.parse(savedSrv);
          if (Array.isArray(parsedSrv)) setCustomServices(parsedSrv);
        }

        const savedGal = localStorage.getItem('n3_custom_gallery_list');
        if (savedGal) {
          const parsedGal = JSON.parse(savedGal);
          if (Array.isArray(parsedGal)) setCustomGallery(parsedGal);
        }

        const savedTestimonials = localStorage.getItem('n3_testimonials_list');
        if (savedTestimonials) {
          const parsedTest = JSON.parse(savedTestimonials);
          if (Array.isArray(parsedTest)) setTestimonialsList(parsedTest);
        }

        const savedSet = localStorage.getItem('n3_site_settings');
        if (savedSet) setSiteSettings(JSON.parse(savedSet));
      } catch (e) { console.error(e); }
    };

    handleUpdate();

    window.addEventListener('n3_content_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('n3_content_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Testimonials & Review Modal State
  const [testimonialsList, setTestimonialsList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('n3_testimonials_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'rev_1',
        name: t.test1Name || 'Alexandre Dubois',
        role: t.test1Role || 'CEO, Luxe Global',
        text: t.test1Text || 'Project Organizer made our Bali corporate retreat seamless and unforgettable. Flawless execution from start to finish.',
        rating: 5,
        status: 'approved',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: 'rev_2',
        name: t.test2Name || 'Elena Rostova',
        role: t.test2Role || 'Private Client',
        text: t.test2Text || 'The private anniversary event was breathtaking. Every detail was curated with extreme elegance.',
        rating: 5,
        status: 'approved',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'rev_3',
        name: t.test3Name || 'Marcus Vance',
        role: t.test3Role || 'Festival Founder',
        text: t.test3Text || 'Incredible production standards and vendor network across Bali. They delivered above and beyond expectations.',
        rating: 5,
        status: 'approved',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
      },
    ];
  });

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [revName, setRevName] = useState('');
  const [revRole, setRevRole] = useState('');
  const [revText, setRevText] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [reviewSubmittedToast, setReviewSubmittedToast] = useState(false);

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revText.trim()) return;

    const newReview = {
      id: 'rev_' + Date.now(),
      name: revName.trim(),
      role: revRole.trim() || (activeLang === 'ar' ? 'عميل VIP' : 'VIP Client'),
      text: revText.trim(),
      rating: revRating,
      status: 'pending', // Pending approval by admin!
      createdAt: new Date().toISOString(),
    };

    const updated = [newReview, ...testimonialsList];
    setTestimonialsList(updated);

    try {
      localStorage.setItem('n3_testimonials_list', JSON.stringify(updated));
      window.dispatchEvent(new Event('n3_content_updated'));
    } catch (e) {
      console.error(e);
    }

    setRevName('');
    setRevRole('');
    setRevText('');
    setRevRating(5);
    setIsReviewModalOpen(false);
    setReviewSubmittedToast(true);
    setTimeout(() => setReviewSubmittedToast(false), 5000);
  };

  return (
    <div className="w-full bg-[#0a0a0c] text-white pt-12 pb-12 px-4 sm:px-8 md:px-12 space-y-16 border-t border-white/10 relative z-20">
      
      {/* 9-PART PROJECT ORGANIZER CURATED SERVICES */}
      <section className="max-w-6xl mx-auto space-y-16">
        {/* 9 Sequential Organizer Sections */}
        <div className="space-y-12">
          {[
            {
              num: '01',
              titleEn: 'WHO WE ARE',
              titleAr: 'من نحن',
              descEn: 'We create meaningful experiences through thoughtful concepts, professional execution, and exceptional attention to detail.',
              descAr: 'نحن نبتكر تجارب هادفة من خلال مفاهيم مدروسة، وتنفيذ مهني، واهتمام استثنائي بالتفاصيل.',
              icon: Sparkles,
              image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
              bulletsEn: ['Creating Experiences', 'Connecting People', 'Making Moments Matter'],
              bulletsAr: ['صنع تجارب', 'وربط الأشخاص', 'وجعل اللحظات مهمة'],
              badge: 'WHO WE ARE'
            },
            {
              num: '02',
              titleEn: 'VISION & MISSION',
              titleAr: 'رؤيتنا ومهمتنا',
              descEn: 'Delivering flawless, high-impact events with unmatched creativity and dedication.',
              descAr: 'تقديم فعاليات متقنة وعالية الأثر بإبداع لا مثيل له والتزام تام بالتميز.',
              icon: Target,
              image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
              bulletsEn: [],
              bulletsAr: [],
              badge: 'VISION & MISSION'
            },
            {
              num: '03',
              titleEn: 'WHY CHOOSE US?',
              titleAr: 'لماذا تختارنا؟',
              descEn: 'We believe a successful event is more than just a beautiful setup. It\'s about experience, execution, and attention to every detail.',
              descAr: 'نحن نؤمن بأن الفعالية الناجحة هي أكثر من مجرد إعداد جميل. إنها تتعلق بالتجربة والتنفيذ والاهتمام بكل تفصيلة.',
              icon: Award,
              image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80',
              bulletsEn: [],
              bulletsAr: [],
              badge: 'WHY CHOOSE US'
            },
            {
              num: '04',
              titleEn: 'FULL-SERVICE EVENT SOLUTIONS',
              titleAr: 'خدماتنا الشاملة',
              descEn: 'From concept to execution, we handle every detail so you can focus on what truly matters.',
              descAr: 'من الفكرة إلى التنفيذ، نتولى جميع التفاصيل حتى تتمكن من التركيز على ما يهمك بحق.',
              icon: Cog,
              image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
              bulletsEn: [],
              bulletsAr: [],
              badge: 'SERVICES'
            },
            {
              num: '05',
              titleEn: 'EVENT CATEGORIES',
              titleAr: 'فئات الفعاليات',
              descEn: 'From corporate conventions to high-octane festivals and intimate private celebrations.',
              descAr: 'من المؤتمرات المؤسسية والمهرجانات الحماسية إلى الاحتفالات الخاصة واللقاءات الفاخرة.',
              icon: Sparkles,
              image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
              bulletsEn: [],
              bulletsAr: [],
              badge: 'CATEGORIES'
            },
            {
              num: '06',
              titleEn: 'WORK PROCESS',
              titleAr: 'عملية العمل',
              descEn: 'Our structured step-by-step event execution blueprint ensuring flawless delivery every single time.',
              descAr: 'مخططنا المنظم المكون من خطوات لضمان تنفيذ متقن وخالٍ من الأخطاء في كل مرة.',
              icon: Cog,
              image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
              bulletsEn: [],
              bulletsAr: [],
              badge: 'WORK PROCESS'
            },
            {
              num: '07',
              titleEn: 'THE PEOPLE BEHIND THE EXPERIENCE',
              titleAr: 'فريقنا وصناع التجارب',
              descEn: 'Dedicated professionals uniting to bring extraordinary concepts to reality.',
              descAr: 'محترفون متفانون يجمعهم هدف واحد لتحويل المفاهيم الاستثنائية إلى واقع.',
              icon: Users,
              image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
              bulletsEn: [],
              bulletsAr: [],
              badge: 'OUR TEAM'
            },
            {
              num: '08',
              titleEn: "LET'S CREATE SOMETHING EXTRAORDINARY",
              titleAr: 'تواصل معنا',
              descEn: "Have an event in mind?\nLet's turn your idea into an experience.",
              descAr: "هل لديك فعالية في ذهنك؟\nدعنا نحول فكرتك إلى تجربة لا تُنسى.",
              icon: Send,
              image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
              bulletsEn: [],
              bulletsAr: [],
              badge: 'CONTACT US'
            }
          ].map((sec, idx) => {
            const Icon = sec.icon;
            const currentSecData = langTexts[sec.num as keyof typeof langTexts];
            const customSecData = savedSections[sec.num];

                        const isAr = activeLang === 'ar';
            const customTitle = isAr ? customSecData?.titleAr : customSecData?.titleEn;
            const customDesc = isAr ? customSecData?.descAr : customSecData?.descEn;
            const customBadge = isAr ? customSecData?.badgeAr : customSecData?.badgeEn;
            
            const title = customTitle || currentSecData?.title || (isAr ? sec.titleAr : sec.titleEn);
            const desc = customDesc !== undefined ? customDesc : (currentSecData?.desc !== undefined ? currentSecData.desc : (isAr ? sec.descAr : sec.descEn));
            const badgeText = customBadge || currentSecData?.badge || sec.badge;

            const secImage = customSecData?.imageUrl || sec.image;

            const bullets = currentSecData?.bullets || sec.bulletsEn || [];
            const bannerText = currentSecData?.banner;

            return (
              <motion.div
                key={sec.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: 0.05, ease: [0.215, 0.61, 0.355, 1] }}
                className="group relative overflow-hidden rounded-3xl bg-transparent border-none shadow-none transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-6 sm:p-8"
              >
                {/* Left / Top Image Banner */}
                <div className="lg:col-span-5 relative h-64 sm:h-72 lg:h-full min-h-[260px] rounded-2xl overflow-hidden bg-black flex flex-col items-center justify-center border border-white/10 shadow-inner">
                  <img
                    src={secImage}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80';
                    }}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {sec.num === '01' ? null : bannerText ? (
                    <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                      <span className="text-[#f3e5ab] text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-wider drop-shadow-[0_2px_15px_rgba(0,0,0,0.95)]">
                        {bannerText}
                      </span>
                    </div>
                  ) : (
                    <>
                      {/* Section Badge */}
                      <div className="absolute top-4 right-4 flex items-center justify-end">
                        <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest border border-white/20">
                          {badgeText}
                        </span>
                      </div>

                      {/* Floating Icon Box */}
                      <div className="absolute bottom-4 left-4">
                        <div className="p-3.5 rounded-2xl bg-red-600/30 backdrop-blur-md border border-red-500/50 text-white shadow-xl">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Right / Content Details */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-neutral-100 transition-colors whitespace-pre-line">
                      {title}
                    </h3>

                    {desc && (
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                        {desc}
                      </p>
                    )}
                  </div>

                  {/* Bullet Highlights / Custom Section Content */}
                  {sec.num === '01' ? (
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
                        {bullets.map((b, i) => (
                          <div key={i} className="flex items-center gap-3 bg-black/60 border border-white/15 rounded-xl p-3.5 sm:p-4 hover:border-red-500/50 transition-all shadow-md group/card">
                            <div className="p-2 rounded-lg bg-red-600/20 text-red-500 border border-red-500/30 shrink-0">
                              <CheckCircle2 className="w-4 h-4 text-red-500" />
                            </div>
                            <span className="text-xs font-extrabold text-white leading-tight">{b}</span>
                          </div>
                        ))}
                      </div>

                      {/* Description Block below 'Making Moments Matter / جعل اللحظات مهمة' */}
                      <div className="space-y-2 pt-4 border-t border-white/15 bg-black/40 p-4 rounded-2xl">
                        <h4 className="text-sm sm:text-base font-black text-red-600 uppercase tracking-wider">
                          WHY PROJECT N3 ORGANIZER
                        </h4>
                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-medium">
                          PROJECT N3 ORGANIZER is a Bali-based Event Organizer specializing in the planning, management, and execution of memorable events. We combine creativity, professional event management, and strong operational execution to deliver events that are not only well-organized, but also meaningful and memorable. From intimate private gatherings to large-scale corporate events, festivals, wellness experiences, and entertainment programs, we provide end-to-end solutions tailored to each client's needs.
                        </p>
                      </div>
                    </div>
                  ) : sec.num === '02' ? (
                    <div className="space-y-5 pt-1">
                      {/* OUR VISION Block (Clean Transparent) */}
                      <div className="space-y-2.5 bg-black/60 border border-white/10 rounded-2xl p-4 sm:p-5">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 shrink-0">
                            <Eye className="w-5 h-5 text-red-500" />
                          </div>
                          <h4 className="text-sm font-extrabold text-red-500 tracking-wider uppercase">
                            {subData.sec03Vision.visionTitle}
                          </h4>
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-medium">
                          {subData.sec03Vision.visionText}
                        </p>
                      </div>

                      {/* OUR MISSION 4 Pillars */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 shrink-0">
                            <Target className="w-5 h-5 text-red-500" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          {subData.sec03Vision.pillars.map((item, pIdx) => (
                            <div
                              key={pIdx}
                              className="flex items-start gap-3 bg-black/60 border border-white/10 rounded-xl p-3 hover:border-red-500/40 transition-colors"
                            >
                              <span className="text-red-500 font-mono font-black text-lg shrink-0 pt-0.5">
                                0{pIdx + 1}
                              </span>
                              <div className="space-y-0.5">
                                <h5 className="text-xs font-extrabold text-white tracking-wide uppercase">
                                  {item.title}
                                </h5>
                                <p className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed">
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : sec.num === '03' ? (
                    <div className="space-y-4 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          { icon: Lightbulb, item: subData.sec04WhyUs[0] },
                          { icon: UserCheck, item: subData.sec04WhyUs[1] },
                          { icon: Layers, item: subData.sec04WhyUs[2] },
                          { icon: Handshake, item: subData.sec04WhyUs[3] },
                          { icon: Sliders, item: subData.sec04WhyUs[4] },
                          { icon: MapPin, item: subData.sec04WhyUs[5] },
                        ].map((obj, idx) => {
                          const ItemIcon = obj.icon;
                          const item = obj.item || { title: '', desc: '' };
                          return (
                            <div
                              key={idx}
                              className="flex items-start gap-3 bg-black/60 border border-white/10 rounded-xl p-3 hover:border-red-500/40 transition-colors"
                            >
                              <div className="p-2 rounded-lg bg-red-600/15 border border-red-500/30 text-red-500 shrink-0">
                                <ItemIcon className="w-4 h-4 text-red-500" />
                              </div>
                              <div className="space-y-0.5">
                                <h5 className="text-xs font-extrabold text-white tracking-wide uppercase">
                                  {item.title}
                                </h5>
                                <p className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed">
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : sec.num === '04' ? (
                    <div className="space-y-4 pt-1">
                      {customServices.filter(s => s.active !== false).length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {customServices.filter(s => s.active !== false).map((srv, sIdx) => {
                            const srvTitle = activeLang === 'ar' ? (srv.titleAr || srv.titleEn) : (srv.titleEn || srv.titleAr);
                            const srvDesc = activeLang === 'ar' ? (srv.descAr || srv.descEn) : (srv.descEn || srv.descAr);
                            return (
                              <div
                                key={srv.id || sIdx}
                                className="flex flex-col justify-between p-3.5 bg-black/80 border border-[#f3e5ab]/30 hover:border-[#f3e5ab]/80 rounded-2xl transition-all duration-300 group shadow-lg"
                              >
                                <div className="space-y-2.5">
                                  {srv.imageUrl && (
                                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-neutral-900">
                                      <img
                                        src={srv.imageUrl}
                                        alt={srvTitle}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80';
                                        }}
                                      />
                                    </div>
                                  )}
                                  <h5 className="text-xs sm:text-sm font-black text-[#f3e5ab] uppercase tracking-wider">
                                    {srvTitle}
                                  </h5>
                                  {srvDesc && (
                                    <p className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed">
                                      {srvDesc}
                                    </p>
                                  )}
                                </div>

                                <div className="pt-2.5 mt-2.5 border-t border-white/10 flex justify-end">
                                  <a
                                    href={`https://wa.me/${(siteSettings.whatsapp || '+6281234567890').replace(/[^0-9]/g, '')}?text=${encodeURIComponent((activeLang === 'ar' ? 'مرحباً، أود الاستفسار عن خدمة: ' : 'Hello, I want to inquire about: ') + srvTitle)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer"
                                  >
                                    <PhoneCall className="w-3.5 h-3.5 text-white" />
                                    <span>{activeLang === 'ar' ? 'استفسر الآن' : 'Inquire Now'}</span>
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <>
                          {/* Top 6 cards (3 columns) */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {[
                              { icon: CalendarCheck, title: subData.sec05Services.top6[0] },
                              { icon: Building2, title: subData.sec05Services.top6[1] },
                              { icon: Sparkles, title: subData.sec05Services.top6[2] },
                              { icon: Ticket, title: subData.sec05Services.top6[3] },
                              { icon: Activity, title: subData.sec05Services.top6[4] },
                              { icon: Music, title: subData.sec05Services.top6[5] },
                            ].map((srv, idx) => {
                              const SrvIcon = srv.icon;
                              return (
                                <div
                                  key={idx}
                                  className="flex flex-col items-center justify-center text-center p-3 bg-black/70 border border-[#f3e5ab]/25 rounded-xl hover:border-[#f3e5ab]/70 hover:bg-black/90 transition-all duration-300 group shadow-md"
                                >
                                  <div className="p-2 rounded-xl bg-red-600/15 border border-red-500/30 text-red-500 mb-1.5 group-hover:scale-110 transition-transform">
                                    <SrvIcon className="w-4 h-4 text-red-500" />
                                  </div>
                                  <h5 className="text-[11px] sm:text-xs font-black text-[#f3e5ab] tracking-wider uppercase group-hover:text-white transition-colors leading-tight">
                                    {srv.title}
                                  </h5>
                                </div>
                              );
                            })}
                          </div>

                          {/* Bottom 2 cards (2 columns) */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {[
                              { icon: Sliders, title: subData.sec05Services.bottom2[0] },
                              { icon: Camera, title: subData.sec05Services.bottom2[1] },
                            ].map((srv, idx) => {
                              const SrvIcon = srv.icon;
                              return (
                                <div
                                  key={idx}
                                  className="flex flex-col items-center justify-center text-center p-3 bg-black/70 border border-[#f3e5ab]/25 rounded-xl hover:border-[#f3e5ab]/70 hover:bg-black/90 transition-all duration-300 group shadow-md"
                                >
                                  <div className="p-2 rounded-xl bg-red-600/15 border border-red-500/30 text-red-500 mb-1.5 group-hover:scale-110 transition-transform">
                                    <SrvIcon className="w-4 h-4 text-red-500" />
                                  </div>
                                  <h5 className="text-[11px] sm:text-xs font-black text-[#f3e5ab] tracking-wider uppercase group-hover:text-white transition-colors leading-tight">
                                    {srv.title}
                                  </h5>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}

                      {/* Tagline at bottom */}
                      <p className="text-center text-xs sm:text-sm text-[#f3e5ab] italic font-serif pt-2 border-t border-white/10">
                        {subData.sec05Services.tagline}
                      </p>
                    </div>
                  ) : sec.num === '05' ? (
                    <div className="space-y-2 pt-1 divide-y divide-white/10">
                      {[
                        { icon: Building2, color: 'text-cyan-400' },
                        { icon: HeartPulse, color: 'text-emerald-400' },
                        { icon: Trophy, color: 'text-amber-400' },
                        { icon: Mic2, color: 'text-purple-400' },
                        { icon: Ticket, color: 'text-pink-400' },
                        { icon: LayoutGrid, color: 'text-indigo-400' },
                        { icon: Gift, color: 'text-red-400' },
                        { icon: Megaphone, color: 'text-orange-400' },
                        { icon: Users, color: 'text-teal-400' },
                        { icon: Presentation, color: 'text-blue-400' },
                      ].map((catObj, idx) => {
                        const IconComp = catObj.icon;
                        const item = subData.sec06Categories[idx] || { title: '', desc: '' };
                        return (
                          <div
                            key={idx}
                            className="flex flex-col sm:flex-row sm:items-center justify-between py-2 px-2.5 rounded-lg hover:bg-white/5 transition-colors gap-1 sm:gap-4"
                          >
                            <div className="flex items-center gap-2.5 sm:w-52 shrink-0">
                              <IconComp className={`w-4 h-4 ${catObj.color} shrink-0`} />
                              <span className="text-xs font-black text-white tracking-wider uppercase">
                                {item.title}
                              </span>
                            </div>
                            <span className="text-[11px] sm:text-xs text-neutral-300 font-medium">
                              {item.desc}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : sec.num === '06' ? (
                    <div className="space-y-4 pt-1">
                      {/* Steps 01 to 05 */}
                      <div className="space-y-3 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-red-600/30">
                        {[Search, Lightbulb, ClipboardList, Cog, CheckCircle2].map((StepIcon, idx) => {
                          const step = subData.sec07Process.steps[idx] || { title: '', desc: '' };
                          return (
                            <div key={idx} className="flex items-start gap-3 relative z-10">
                              <div className="w-8 h-8 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0 border border-red-400/50 shadow-md">
                                0{idx + 1}
                              </div>
                              <div className="flex-1 bg-black/60 border border-white/10 rounded-xl p-2.5 hover:border-red-500/40 transition-colors">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <StepIcon className="w-3.5 h-3.5 text-red-500" />
                                  <h5 className="text-xs font-black text-white uppercase tracking-wider">
                                    {step.title}
                                  </h5>
                                </div>
                                <p className="text-[11px] text-neutral-300 leading-relaxed">
                                  {step.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Our Promise Box */}
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/40 via-black to-red-950/40 border border-red-500/40 text-center space-y-1">
                        <span className="text-[10px] font-black text-red-500 tracking-widest uppercase block">
                          {subData.sec07Process.promiseBadge}
                        </span>
                        <p className="text-xs font-semibold text-white italic font-serif">
                          {subData.sec07Process.promiseQuote}
                        </p>
                      </div>
                    </div>
                  ) : sec.num === '07' ? (
                    <div className="space-y-4 pt-1">
                      <div className="space-y-2.5">
                        {[User, ClipboardList, Lightbulb, Cog, Users].map((MemberIcon, idx) => {
                          const member = subData.sec08Team.roles[idx] || { title: '', desc: '' };
                          return (
                            <div
                              key={idx}
                              className="flex items-start gap-3 bg-black/60 border border-white/10 rounded-xl p-3 hover:border-red-500/40 transition-colors"
                            >
                              <div className="p-2 rounded-full bg-red-600/20 border border-red-500/40 text-red-500 shrink-0">
                                <MemberIcon className="w-4 h-4 text-red-500" />
                              </div>
                              <div className="space-y-0.5">
                                <h5 className="text-xs font-black text-white tracking-wider uppercase">
                                  {member.title}
                                </h5>
                                <p className="text-[11px] text-neutral-300 leading-relaxed">
                                  {member.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : sec.num === '08' ? (
                    <div className="space-y-5 pt-2">
                      <p className="text-sm sm:text-base font-semibold text-white leading-relaxed whitespace-pre-line">
                        {subData.sec09Contact.prompt}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        {/* Location Card */}
                        <div className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-black/60 border border-white/10 hover:border-red-500/40 transition-colors text-center">
                          <MapPin className="w-5 h-5 text-red-500 mb-1.5" />
                          <span className="text-[11px] sm:text-xs font-bold text-white">
                            {activeLang === 'ar' ? 'بالي، إندونيسيا' : 'Bali, Indonesia'}
                          </span>
                        </div>

                        {/* Instagram Card */}
                        <a
                          href="https://www.instagram.com/project.n3bali?igsh=MXhzMXo2bGN4YmsxNg=="
                          target="_blank"
                          rel="noreferrer"
                          className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-black/60 border border-white/10 hover:border-pink-500/40 transition-colors text-center group cursor-pointer"
                        >
                          <Instagram className="w-5 h-5 text-pink-500 mb-1.5 group-hover:scale-110 transition-transform" />
                          <span className="text-[11px] sm:text-xs font-bold text-white">
                            {activeLang === 'ar' ? 'إنستغرام' : 'Instagram'}
                          </span>
                        </a>

                        {/* Email Card */}
                        <a
                          href="mailto:creativegrouplimabersama@gmail.com"
                          className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-black/60 border border-white/10 hover:border-red-500/40 transition-colors text-center group cursor-pointer"
                        >
                          <Mail className="w-5 h-5 text-red-500 mb-1.5 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] sm:text-[11px] font-bold text-white truncate max-w-full">
                            {activeLang === 'ar' ? 'بريدنا الإلكتروني' : 'Our Email'}
                          </span>
                        </a>

                        {/* WhatsApp Card */}
                        <a
                          href="https://wa.me/62895336689599"
                          target="_blank"
                          rel="noreferrer"
                          className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-black/60 border border-white/10 hover:border-emerald-500/40 transition-colors text-center group cursor-pointer"
                        >
                          <PhoneCall className="w-5 h-5 text-emerald-500 mb-1.5 group-hover:scale-110 transition-transform" />
                          <span className="text-[11px] sm:text-xs font-bold text-white">
                            +62 895 3366 89599
                          </span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                      {bullets.map((b, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-semibold text-neutral-200 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                          <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action CTA */}
                  {sec.num !== '01' && sec.num !== '02' && sec.num !== '03' && sec.num !== '04' && sec.num !== '05' && sec.num !== '06' && sec.num !== '07' && sec.num !== '08' && sec.num !== '09' && (
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                      <a
                        href={`https://wa.me/62895336689599?text=${encodeURIComponent('Hello PROJECT ORGANIZER, I want to book: ' + sec.titleEn)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider rtl:tracking-normal shadow-lg shadow-red-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 text-white" />
                        <span>
                          {activeLang === 'ar'
                            ? 'احجز مع PROJECT ORGANIZER الآن'
                            : 'Inquire Now'}
                        </span>
                      </a>

                      <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-semibold">
                        <ShieldCheck className="w-4 h-4 text-red-500" />
                        <span>
                          {activeLang === 'ar' ? 'ضمان VIP كامل' : 'Full VIP Guarantee'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* DYNAMIC GALLERY / SHOWCASE SECTION */}
        {customGallery.filter(item => item.active !== false).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
            className="group relative overflow-hidden rounded-3xl bg-transparent border-none shadow-none transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-6 sm:p-8"
          >
            <div className="lg:col-span-5 relative h-64 sm:h-72 lg:h-full min-h-[260px] rounded-2xl overflow-hidden bg-black flex flex-col items-center justify-center border border-white/10 shadow-inner">
              <img
                src={customGallery[0]?.imageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'}
                alt="Gallery Showcase"
                className="w-full h-full object-cover filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <span className="text-red-500 text-xs font-black tracking-widest uppercase mb-1">
                  WORK GALLERY
                </span>
                <h3 className="text-[#f3e5ab] text-2xl sm:text-3xl font-black uppercase tracking-wider drop-shadow-md">
                  {activeLang === 'ar' ? 'معرض الأعمال' : 'EVENT SHOWCASE'}
                </h3>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {customGallery.filter(item => item.active !== false).map((item, gIdx) => (
                  <div
                    key={item.id || gIdx}
                    className="p-3.5 rounded-2xl bg-black/80 border border-white/15 hover:border-red-500/50 transition-all shadow-md space-y-2.5 group"
                  >
                    {item.imageUrl && (
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-neutral-900">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                      </div>
                    )}
                    <h5 className="text-xs font-black text-[#f3e5ab] uppercase tracking-wider truncate">
                      {item.title}
                    </h5>
                    {item.desc && (
                      <p className="text-[11px] text-neutral-300 leading-relaxed line-clamp-2">
                        {item.desc}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* METRICS & TESTIMONIALS SECTION */}
      <section className="max-w-6xl mx-auto space-y-12 pt-8">
        {/* Prestige Stats Grid (2 Columns as requested) */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
            className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/40 transition-all flex flex-col items-center justify-center space-y-2"
          >
            <Award className="w-6 h-6 text-red-500 mb-1" />
            <span className="text-3xl sm:text-5xl font-black text-white">+200</span>
            <span className="text-xs sm:text-sm text-neutral-300 font-bold">
              {activeLang === 'ar' ? 'العملاء الراضين' : 'Satisfied Clients'}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.215, 0.61, 0.355, 1] }}
            className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/40 transition-all flex flex-col items-center justify-center space-y-2"
          >
            <Clock className="w-6 h-6 text-red-500 mb-1" />
            <span className="text-3xl sm:text-5xl font-black text-white">2</span>
            <span className="text-xs sm:text-sm text-neutral-300 font-bold">
              {activeLang === 'ar' ? 'سنة خبرة' : 'Years Experience'}
            </span>
          </motion.div>
        </div>

        {/* Testimonials Header & Glassmorphic Add Review Button */}
        <div className="space-y-6 pt-6 border-t border-white/10">
          {reviewSubmittedToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>
                  {activeLang === 'ar'
                    ? 'شكراً لك! تم إرسال تعليقك وتقييمك بنجاح وسيكون ظاهراً بالموقع فور مراجعة وقبول الإدارة 🟢'
                    : 'Thank you! Your review has been submitted and will appear after admin approval 🟢'}
                </span>
              </div>
              <button
                onClick={() => setReviewSubmittedToast(false)}
                className="text-emerald-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                {activeLang === 'ar' ? 'آراء العملاء' : 'Client Reviews'}
              </h3>
              <p className="text-xs text-neutral-400">
                {activeLang === 'ar' ? 'شاركنا تجربتك وتقييمك لخدماتنا' : 'Share your experience and review'}
              </p>
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-lg hover:border-white/40 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-red-500" />
              <span>{activeLang === 'ar' ? 'إضافة تعليق وتقييم' : 'Add Review & Rating'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialsList
              .filter((tItem) => tItem.status === 'approved' || !tItem.status)
              .map((tItem, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.215, 0.61, 0.355, 1] }}
                className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex gap-1">
                    {Array.from({ length: tItem.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-200 italic leading-relaxed">
                    "{tItem.text}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-bold text-sm text-white">{tItem.name}</h4>
                  <span className="text-xs text-neutral-400 font-medium">{tItem.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Review Dialog Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#121216] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                {activeLang === 'ar' ? 'إضافة تعليق وتقييم' : 'Add Review & Rating'}
              </h3>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  {activeLang === 'ar' ? 'الاسم' : 'Your Name'}
                </label>
                <input
                  type="text"
                  required
                  value={revName}
                  onChange={(e) => setRevName(e.target.value)}
                  placeholder={activeLang === 'ar' ? 'أدخل اسمك' : 'e.g. John Doe'}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  {activeLang === 'ar' ? 'الصفة / الشركة (اختياري)' : 'Role / Company (Optional)'}
                </label>
                <input
                  type="text"
                  value={revRole}
                  onChange={(e) => setRevRole(e.target.value)}
                  placeholder={activeLang === 'ar' ? 'مثال: مدير مشروع' : 'e.g. Event Manager'}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  {activeLang === 'ar' ? 'التقييم' : 'Rating'}
                </label>
                <div className="flex gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRevRating(star)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= revRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  {activeLang === 'ar' ? 'التعليق' : 'Review Comment'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={revText}
                  onChange={(e) => setRevText(e.target.value)}
                  placeholder={activeLang === 'ar' ? 'اكتب تجربتك هنا...' : 'Write your feedback here...'}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-900/50 transition-all cursor-pointer"
              >
                {activeLang === 'ar' ? 'إرسال التقييم' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LUXURY FOOTER */}
      <footer className="max-w-6xl mx-auto pt-16 border-t border-white/10 space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <span className="text-xl font-black text-white tracking-wider rtl:tracking-normal">
              PROJECT N3 ORGANIZER
            </span>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {activeLang === 'ar' ? 'تنظيم الفعاليات والمؤتمرات والتجارب الاستثنائية في بالي - إندونيسيا' : 'Full-service event management and experience creation in Bali, Indonesia.'}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider rtl:tracking-normal text-white">
              {t.contactTitle}
            </h4>
            <div className="space-y-2 text-xs text-neutral-200">
              <a href="https://wa.me/62895336689599" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                <PhoneCall className="w-4 h-4 text-emerald-500" />
                <span>+62 895 3366 89599</span>
              </a>
              <a href="mailto:creativegrouplimabersama@gmail.com" className="flex items-center gap-2 hover:text-red-400 transition-colors">
                <Mail className="w-4 h-4 text-red-500" />
                <span className="truncate">creativegrouplimabersama@gmail.com</span>
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider rtl:tracking-normal text-white">
              {activeLang === 'ar' ? 'الخدمات' : 'Services'}
            </h4>
            <ul className="space-y-1.5 text-xs text-neutral-300">
              <li>{activeLang === 'ar' ? 'إدارة وتخطيط الفعاليات' : 'Event Planning & Management'}</li>
              <li>{activeLang === 'ar' ? 'الفعاليات المؤسسية' : 'Corporate Events'}</li>
              <li>{activeLang === 'ar' ? 'المهرجانات والتجهيزات' : 'Festivals & Productions'}</li>
              <li>{activeLang === 'ar' ? 'الاحتفالات الخاصة' : 'Private Celebrations'}</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider rtl:tracking-normal text-white">
              Social Media
            </h4>
            <div className="flex flex-col space-y-1.5 text-xs text-neutral-300">
              <a href="https://www.instagram.com/project.n3bali?igsh=MXhzMXo2bGN4YmsxNg==" target="_blank" rel="noreferrer" className="hover:text-pink-400 transition-colors flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-500" />
                <span>Instagram</span>
              </a>
              <a href="https://wa.me/62895336689599" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
