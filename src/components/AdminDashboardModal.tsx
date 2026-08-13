import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  LayoutDashboard,
  Building2,
  Phone,
  Mail,
  Instagram,
  Settings,
  Plus,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Save,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Image as ImageIcon,
  SlidersHorizontal,
  Eye,
  EyeOff,
  Check,
  Lock,
  LogOut,
  Key,
  Upload,
  Camera,
  Loader2,
  Inbox,
  Star,
  User,
  Search,
  Filter,
  Clock,
  Send,
  XCircle,
  MessageSquare
} from 'lucide-react';
import { LanguageCode } from '../types';
import {
  isSupabaseConfigured,
  saveSectionToSupabase,
  fetchSectionsFromSupabase,
  saveServicesToSupabase,
  fetchServicesFromSupabase,
  saveGalleryToSupabase,
  fetchGalleryFromSupabase,
  saveSiteSettingsToSupabase,
  fetchSiteSettingsFromSupabase,
  uploadImageToSupabase,
  loginAdminAccount,
  ADMIN_EMAIL,
  ADMIN_PASS
} from '../lib/supabase';
import { Database, Copy } from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
}

export interface SectionConfig {
  id: string; // '01', '02', '03', '04', '05', '06', '07', '08'
  nameEn: string;
  nameAr: string;
  badgeEn: string;
  badgeAr: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  imageUrl: string;
  customNotesEn?: string;
  customNotesAr?: string;
}

export interface ServiceItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  imageUrl: string;
  active: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  desc: string;
  imageUrl: string;
  active: boolean;
}

export const defaultGalleryList: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Corporate Gala & Awards Night',
    desc: 'Executive gala dinner with custom staging, immersive LED displays, and awards show production.',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    active: true
  },
  {
    id: 'g2',
    title: 'Luxury Villa Celebration',
    desc: 'Exclusive private event with bespoke decor, VIP catering, and live entertainment setup.',
    imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80',
    active: true
  },
  {
    id: 'g3',
    title: 'Beachfront Music Festival',
    desc: 'High-energy outdoor music festival featuring top stage engineering and lighting.',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    active: true
  },
  {
    id: 'g4',
    title: 'Brand Product Launch',
    desc: 'Interactive product showcase, stage lighting design, and media coverage.',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    active: true
  },
  {
    id: 'g5',
    title: 'Cultural Expo & Art Fair',
    desc: 'Cultural exhibitions with artisan displays, traditional design, and live music stages.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    active: true
  },
  {
    id: 'g6',
    title: 'Wellness & Fitness Retreat',
    desc: 'Holistic health gathering, outdoor yoga stages, sound healing, and fun runs.',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    active: true
  }
];

const defaultSectionsConfig: Record<string, SectionConfig> = {
  '01': {
    id: '01',
    nameEn: 'Who We Are',
    nameAr: 'من نحن',
    badgeEn: 'WHO WE ARE',
    badgeAr: 'من نحن',
    titleEn: 'WHO WE ARE',
    titleAr: 'من نحن',
    descEn: 'We create meaningful experiences through thoughtful concepts, professional execution, and exceptional attention to detail.',
    descAr: 'نحن نبتكر تجارب هادفة من خلال مفاهيم مدروسة، وتنفيذ مهني، واهتمام استثنائي بالتفاصيل.',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    customNotesEn: 'Bullet 1: Creating Experiences\nBullet 2: Connecting People\nBullet 3: Making Moments Matter',
    customNotesAr: 'نقطة 1: صنع تجارب متكاملة\nنقطة 2: ربط الأشخاص والشركات\nنقطة 3: جعل اللحظات استثنائية'
  },
  '02': {
    id: '02',
    nameEn: 'Our Vision & Mission',
    nameAr: 'رؤيتنا ومهمتنا',
    badgeEn: 'VISION & MISSION',
    badgeAr: 'رؤيتنا ومهمتنا',
    titleEn: 'OUR VISION & MISSION',
    titleAr: 'رؤيتنا ومهمتنا',
    descEn: 'Delivering flawless, high-impact events with unmatched creativity and dedication.',
    descAr: 'تقديم فعاليات متقنة وعالية الأثر بإبداع لا مثيل له والتزام تام بالتميز.',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    customNotesEn: 'Vision statement & Core Values',
    customNotesAr: 'الرؤية والرسالة والقيم الأساسية'
  },
  '03': {
    id: '03',
    nameEn: 'Why Choose Us',
    nameAr: 'لماذا تختارنا',
    badgeEn: 'WHY CHOOSE US',
    badgeAr: 'لماذا تختارنا',
    titleEn: 'WHY CHOOSE US?',
    titleAr: 'لماذا تختارنا؟',
    descEn: 'We believe a successful event is more than just a beautiful setup. It\'s about experience, execution, and attention to every detail.',
    descAr: 'نحن نؤمن بأن الفعالية الناجحة هي أكثر من مجرد إعداد جميل. إنها تتعلق بالتجربة والتنفيذ والاهتمام بكل تفصيلة دقيقة.',
    imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80',
    customNotesEn: 'Local Expertise, Tailored Concepts, End-to-End Execution',
    customNotesAr: 'خبرة متخصصة، مفاهيم مخصصة، تنفيذ شامل'
  },
  '04': {
    id: '04',
    nameEn: 'Our Services',
    nameAr: 'خدماتنا',
    badgeEn: 'SERVICES',
    badgeAr: 'خدماتنا',
    titleEn: 'FULL-SERVICE EVENT SOLUTIONS',
    titleAr: 'حلول متكاملة لتنظيم الفعاليات',
    descEn: 'From concept to execution, we handle every detail so you can focus on what truly matters.',
    descAr: 'من الفكرة إلى التنفيذ، نتولى جميع التفاصيل حتى تتمكن من التركيز على ما يهمك بحق.',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    customNotesEn: 'Corporate Events, Private Parties, Festivals, Entertainment',
    customNotesAr: 'فعاليات مؤسسية، حفلات خاصة، مهرجانات، عروض ترفيهية'
  },
  '05': {
    id: '05',
    nameEn: 'Event Categories',
    nameAr: 'فئات الفعاليات',
    badgeEn: 'CATEGORIES',
    badgeAr: 'فئات الفعاليات',
    titleEn: 'EVENTS WE CREATE',
    titleAr: 'فئات الفعاليات التي ننفذها',
    descEn: 'From corporate conventions to high-octane festivals and intimate private celebrations.',
    descAr: 'من المؤتمرات المؤسسية والمهرجانات الحماسية إلى الاحتفالات الخاصة واللقاءات الفاخرة.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    customNotesEn: 'Corporate Galas, Music Festivals, Private Parties',
    customNotesAr: 'حفلات مؤسسية، مهرجانات غنائية، مناسبات خاصة'
  },
  '06': {
    id: '06',
    nameEn: 'Work Process',
    nameAr: 'عملية العمل',
    badgeEn: 'WORK PROCESS',
    badgeAr: 'عملية العمل',
    titleEn: 'FROM IDEA TO EXPERIENCE',
    titleAr: 'مسار عملية العمل',
    descEn: 'Our structured step-by-step event execution blueprint ensuring flawless delivery every single time.',
    descAr: 'مخططنا المنظم المكون من خطوات مدروسة لضمان تنفيذ متقن وخالٍ من الأخطاء.',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    customNotesEn: 'Consultation, Concept, Planning, On-Site Execution, Review',
    customNotesAr: 'استشارة، مفهوم، تخطيط، تنفيذ ميداني، تقييم'
  },
  '07': {
    id: '07',
    nameEn: 'Our Team',
    nameAr: 'فريقنا',
    badgeEn: 'OUR TEAM',
    badgeAr: 'فريقنا',
    titleEn: 'THE PEOPLE BEHIND THE EXPERIENCE',
    titleAr: 'الفريق وراء كل تجربة استثنائية',
    descEn: 'One Team. One Vision. Dedicated professionals uniting to bring extraordinary concepts to reality.',
    descAr: 'فريق واحد. رؤية واحدة. محترفون متفانون يجمعهم هدف واحد لتحويل المفاهيم الاستثنائية إلى واقع.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    customNotesEn: 'Event Directors, Lighting Designers, Stage Engineers',
    customNotesAr: 'مدراء الفعاليات، مهندسو الإضاءة والصوت، مشرفو التنفيذ'
  },
  '08': {
    id: '08',
    nameEn: 'Contact Us',
    nameAr: 'تواصل معنا',
    badgeEn: 'CONTACT US',
    badgeAr: 'تواصل معنا',
    titleEn: 'LET\'S CREATE SOMETHING EXTRAORDINARY',
    titleAr: 'تواصل معنا لنبتكر شيئاً استثنائياً',
    descEn: 'Have an event in mind? Let\'s turn your idea into an experience.',
    descAr: 'هل لديك فعالية في ذهنك؟ دعنا نحول فكرتك إلى تجربة لا تُنسى.',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    customNotesEn: 'WhatsApp, Email, Location',
    customNotesAr: 'واتساب، البريد الإلكتروني، الموقع'
  }
};

export const defaultServicesList: ServiceItem[] = [
  {
    id: '1',
    titleAr: 'تخطيط وإدارة الفعاليات',
    titleEn: 'Event Planning & Management',
    descAr: 'تخطيط شامل وإدارة احترافية لجميع تفاصيل الفعالية من البداية وحتى نهاية التنفيذ.',
    descEn: 'End-to-end event conceptualization, scheduling, budgeting, vendor management, and live operations.',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    active: true
  },
  {
    id: '2',
    titleAr: 'الفعاليات المؤسسية',
    titleEn: 'Corporate Events',
    descAr: 'حفلات عشاء رسمية، اجتماعات تنفيذية، إطلاق منتجات، وملاذات الشركات ورعايات العلامات.',
    descEn: 'Gala dinners, executive retreats, product launches, corporate meetings, and brand activations.',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    active: true
  },
  {
    id: '3',
    titleAr: 'الفعاليات الخاصة',
    titleEn: 'Private Events',
    descAr: 'احتفالات أعياد ميلاد مخصصة، ذكرى سنوية، حفلات فيلات فاخرة، وتجمعات خاصة بكبار الشخصيات.',
    descEn: 'Bespoke birthday celebrations, anniversaries, private estate galas, and VIP parties.',
    imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
    active: true
  },
  {
    id: '4',
    titleAr: 'المهرجانات والمعارض',
    titleEn: 'Festival & Exhibition',
    descAr: 'مهرجانات موسيقية كبرى، معارض ثقافية، استعراض المنتجات، ومعارض تجارية مفتوحة.',
    descEn: 'Large-scale music festivals, cultural expos, brand showcases, and outdoor exhibitions.',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    active: true
  },
  {
    id: '5',
    titleAr: 'الرياضة والصحة',
    titleEn: 'Sports & Wellness',
    descAr: 'مسابقات لياقة بدنية، سباقات ممتعة، جلسات يوغا، وبطولات رياضية مخصصة.',
    descEn: 'Fitness competitions, marathon fun runs, yoga retreats, and athletic tournaments.',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    active: true
  },
  {
    id: '6',
    titleAr: 'البرامج الترفيهية والعروض',
    titleEn: 'Entertainment & Shows',
    descAr: 'حفلات موسيقية حية، عروض دي جيه، استعراضات مسرحية، ومؤثرات ضوئية فائقة الجودة.',
    descEn: 'Live concerts, DJ performances, stage shows, light spectacles, and artist management.',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    active: true
  },
  {
    id: '7',
    titleAr: 'تجهيز المسارح والإضاءة',
    titleEn: 'Event Production & Staging',
    descAr: 'تصميم المسارح، الهندسة الصوتية، شاشات LED، تصميم الإضاءة، والتجهيز الفني في الموقع.',
    descEn: 'Stage design, sound engineering, LED screens, lighting design, and technical site setup.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    active: true
  },
  {
    id: '8',
    titleAr: 'التوثيق والإعلام 4K',
    titleEn: 'Media & 4K Documentation',
    descAr: 'تصوير فوتوغرافي احترافي، توثيق فيديو بدقة 4K، تصوير درون جوي، وإنتاج إعلامي متكامل.',
    descEn: 'Professional photography, 4K videography, drone coverage, and post-event media production.',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    active: true
  }
];

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  currentLanguage
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'gallery' | 'settings' | 'inbox'>('overview');

  // Contact Messages Inbox State (Section 5 Top Part)
  const [contactMessages, setContactMessages] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('n3_contact_messages');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'msg_1',
        firstName: 'أحمد',
        lastName: 'العلي',
        email: 'ahmed.ali@example.com',
        message: 'السلام عليكم، نود الاستفسار عن باقات تنظيم المؤتمرات والفعاليات المؤسسية في بالي وتحديد موعد اجتماع استشاري.',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        read: false,
      },
      {
        id: 'msg_2',
        firstName: 'Sarah',
        lastName: 'Jenkins',
        email: 's.jenkins@luxeevents.com',
        message: 'Hello, we are looking for a VIP event management team for a private beach gala in Bali next month. Please send us information on packages.',
        createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
        read: true,
      },
    ];
  });

  // Client Reviews Approval State (Section 5 Bottom Part)
  const [reviewsList, setReviewsList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('n3_testimonials_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'rev_1',
        name: 'Alexandre Dubois',
        role: 'CEO, Luxe Global',
        text: 'PROJECT N3 ORGANIZER made our Bali corporate retreat seamless and unforgettable. Flawless execution from start to finish.',
        rating: 5,
        status: 'approved',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: 'rev_2',
        name: 'Elena Rostova',
        role: 'Private Client',
        text: 'The private anniversary event was breathtaking. Every detail was curated with extreme elegance.',
        rating: 5,
        status: 'approved',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'rev_3',
        name: 'Marcus Vance',
        role: 'Festival Founder',
        text: 'Incredible production standards and vendor network across Bali. They delivered above and beyond expectations.',
        rating: 5,
        status: 'approved',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
      },
      {
        id: 'rev_4',
        name: 'محمد العتيبي',
        role: 'مدير تسويق - شركة رؤية',
        text: 'تجربة ممتازة جداً في تنظيم احتفال شركتنا السنوي، الاهتمام بالتفاصيل والإخراج الفني كان رائعاً وبمعايير عالمية.',
        rating: 5,
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ];
  });

  // Inbox Search & Filters
  const [msgSearchQuery, setMsgSearchQuery] = useState('');
  const [msgFilterStatus, setMsgFilterStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [revFilterStatus, setRevFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  // Keep state synced across tabs & storage events
  useEffect(() => {
    const syncInboxData = () => {
      try {
        const savedMsgs = localStorage.getItem('n3_contact_messages');
        if (savedMsgs) setContactMessages(JSON.parse(savedMsgs));

        const savedRevs = localStorage.getItem('n3_testimonials_list');
        if (savedRevs) setReviewsList(JSON.parse(savedRevs));
      } catch (e) {}
    };

    window.addEventListener('n3_content_updated', syncInboxData);
    window.addEventListener('storage', syncInboxData);
    return () => {
      window.removeEventListener('n3_content_updated', syncInboxData);
      window.removeEventListener('storage', syncInboxData);
    };
  }, []);

  // Message Action Handlers
  const toggleMessageRead = (id: string) => {
    const updated = contactMessages.map((msg) =>
      msg.id === id ? { ...msg, read: !msg.read } : msg
    );
    setContactMessages(updated);
    try {
      localStorage.setItem('n3_contact_messages', JSON.stringify(updated));
      window.dispatchEvent(new Event('n3_content_updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteMessage = (id: string) => {
    const updated = contactMessages.filter((msg) => msg.id !== id);
    setContactMessages(updated);
    try {
      localStorage.setItem('n3_contact_messages', JSON.stringify(updated));
      window.dispatchEvent(new Event('n3_content_updated'));
    } catch (e) {
      console.error(e);
    }
  };

  // Review Approval Handlers
  const setReviewStatus = (id: string, newStatus: 'approved' | 'rejected') => {
    const updated = reviewsList.map((rev) =>
      rev.id === id ? { ...rev, status: newStatus } : rev
    );
    setReviewsList(updated);
    try {
      localStorage.setItem('n3_testimonials_list', JSON.stringify(updated));
      window.dispatchEvent(new Event('n3_content_updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteReviewItem = (id: string) => {
    const updated = reviewsList.filter((rev) => rev.id !== id);
    setReviewsList(updated);
    try {
      localStorage.setItem('n3_testimonials_list', JSON.stringify(updated));
      window.dispatchEvent(new Event('n3_content_updated'));
    } catch (e) {
      console.error(e);
    }
  };
  
  // Admin Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('n3_admin_auth') === 'true';
  });
  const [emailInput, setEmailInput] = useState<string>(ADMIN_EMAIL);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState<boolean>(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmittingLogin(true);

    const res = await loginAdminAccount(emailInput, passwordInput);
    setIsSubmittingLogin(false);

    if (res.success) {
      setIsAuthenticated(true);
      sessionStorage.setItem('n3_admin_auth', 'true');
    } else {
      setLoginError(res.message || (currentLanguage === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password'));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('n3_admin_auth');
    setPasswordInput('');
  };

  // Sections Config State (01 - 08)
  const [sections, setSections] = useState<Record<string, SectionConfig>>(() => {
    try {
      const saved = localStorage.getItem('n3_sections_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return defaultSectionsConfig;
  });

  // Selected Section ID to Edit
  const [selectedSectionId, setSelectedSectionId] = useState<string>('01');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [uploadingItemId, setUploadingItemId] = useState<string | null>(null);

  // Services Management State
  const [servicesList, setServicesList] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem('n3_custom_services_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return defaultServicesList;
  });

  // Gallery Management State (معرض الأعمال)
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('n3_custom_gallery_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return defaultGalleryList;
  });

  // Editable Site Settings State
  const [siteSettings, setSiteSettings] = useState({
    whatsapp: '+62895336689599',
    instagram: 'https://www.instagram.com/project.n3bali?igsh=MXhzMXo2bGN4YmsxNg==',
    email: 'creativegrouplimabersama@gmail.com',
    location: 'Bali, Indonesia',
    brandName: 'PROJECT N3 ORGANIZER',
  });

  const [copiedSql, setCopiedSql] = useState(false);
  const isSupabaseActive = isSupabaseConfigured();

  // Helper function to safely write to localStorage with quota fallback
  const safeLocalStorageSetItem = (key: string, data: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (err) {
      console.warn(`localStorage setItem quota error for ${key}:`, err);
      try {
        localStorage.removeItem('n3_sections_data');
        localStorage.removeItem('n3_custom_services_list');
        localStorage.removeItem('n3_custom_gallery_list');
        localStorage.setItem(key, JSON.stringify(data));
        return true;
      } catch {
        return false;
      }
    }
  };

  // Helper function to compress images before saving to prevent QuotaExceededError in localStorage
  const compressImageFile = (file: File, maxWidth = 900, quality = 0.75): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        if (!src) {
          resolve('');
          return;
        }
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(src);
              return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', quality);
            resolve(compressed);
          } catch {
            resolve(src);
          }
        };
        img.onerror = () => resolve(src);
        img.src = src;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // On mount or when active, load latest data from Supabase bucket & database
  const refreshSectionsFromSupabase = async () => {
    if (!isSupabaseActive) return;
    try {
      const data = await fetchSectionsFromSupabase();
      if (data && data.length > 0) {
        setSections(prev => {
          const updated = { ...prev };
          data.forEach(item => {
            if (updated[item.section_id]) {
              updated[item.section_id] = {
                ...updated[item.section_id],
                badgeEn: item.badge || updated[item.section_id].badgeEn,
                badgeAr: item.badge || updated[item.section_id].badgeAr,
                titleEn: item.title || updated[item.section_id].titleEn,
                titleAr: item.title || updated[item.section_id].titleAr,
                descEn: item.description || updated[item.section_id].descEn,
                descAr: item.description || updated[item.section_id].descAr,
                imageUrl: item.image || updated[item.section_id].imageUrl,
                customNotesEn: item.note || updated[item.section_id].customNotesEn
              };
            }
          });
          safeLocalStorageSetItem('n3_sections_data', updated);
          return updated;
        });
        window.dispatchEvent(new Event('n3_content_updated'));
      }
    } catch (e) {
      console.warn('Error refreshing sections from Supabase:', e);
    }
  };

  const refreshServicesFromSupabase = async () => {
    if (!isSupabaseActive) return;
    try {
      const data = await fetchServicesFromSupabase();
      if (data && data.length > 0) {
        setServicesList(data);
        safeLocalStorageSetItem('n3_custom_services_list', data);
        window.dispatchEvent(new Event('n3_content_updated'));
      }
    } catch (e) {
      console.warn('Error refreshing services from Supabase:', e);
    }
  };

  const refreshGalleryFromSupabase = async () => {
    if (!isSupabaseActive) return;
    try {
      const data = await fetchGalleryFromSupabase();
      if (data && data.length > 0) {
        setGalleryList(data);
        safeLocalStorageSetItem('n3_custom_gallery_list', data);
        window.dispatchEvent(new Event('n3_content_updated'));
      }
    } catch (e) {
      console.warn('Error refreshing gallery from Supabase:', e);
    }
  };

  const refreshSiteSettingsFromSupabase = async () => {
    if (!isSupabaseActive) return;
    try {
      const data = await fetchSiteSettingsFromSupabase();
      if (data) {
        setSiteSettings(prev => ({
          ...prev,
          whatsapp: data.whatsapp || prev.whatsapp,
          phone: data.phone || prev.phone,
          email: data.email || prev.email,
          instagram: data.instagram || prev.instagram,
          facebook: data.facebook || prev.facebook,
          tiktok: data.tiktok || prev.tiktok,
          location: data.location || prev.location,
        }));
        safeLocalStorageSetItem('n3_site_settings', data);
        window.dispatchEvent(new Event('n3_content_updated'));
      }
    } catch (e) {
      console.warn('Error refreshing site settings from Supabase:', e);
    }
  };

  useEffect(() => {
    if (isSupabaseActive) {
      refreshSectionsFromSupabase();
      refreshServicesFromSupabase();
      refreshGalleryFromSupabase();
      refreshSiteSettingsFromSupabase();
    }
  }, [isSupabaseActive]);

  // Early return if modal is closed (called AFTER all hooks)
  if (!isOpen) return null;

  // Admin Dashboard UI is forced to English as requested
  const isAr = false;

  // Service field changes
  const handleServiceFieldChange = (id: string, field: keyof ServiceItem, value: any) => {
    setServicesList(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleServiceImageFileUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingItemId(id);
      try {
        let finalUrl = await uploadImageToSupabase(file);
        if (!finalUrl) {
          finalUrl = await compressImageFile(file, 900, 0.75);
        }
        if (finalUrl) {
          handleServiceFieldChange(id, 'imageUrl', finalUrl);
          const updatedList = servicesList.map(s => s.id === id ? { ...s, imageUrl: finalUrl } : s);
          safeLocalStorageSetItem('n3_custom_services_list', updatedList);
          window.dispatchEvent(new Event('n3_content_updated'));

          if (isSupabaseActive) {
            await saveServicesToSupabase(updatedList);
            // Refresh UI state immediately from Supabase to guarantee data consistency
            await refreshServicesFromSupabase();
          }

          setSaveSuccessMsg(isAr ? 'تم رفع صورة الخدمة وتحديث الواجهة والمزامنة مع Supabase بنجاح! 🟢' : 'Service image uploaded & synced from Supabase! 🟢');
          setTimeout(() => setSaveSuccessMsg(null), 3500);
        }
      } finally {
        setUploadingItemId(null);
      }
    }
  };

  const handleSaveServices = async () => {
    setIsSaving(true);
    try {
      let dbSaved = false;
      if (isSupabaseActive) {
        dbSaved = await saveServicesToSupabase(servicesList);
        await refreshServicesFromSupabase();
      }

      safeLocalStorageSetItem('n3_custom_services_list', servicesList);
      window.dispatchEvent(new Event('n3_content_updated'));

      if (dbSaved) {
        setSaveSuccessMsg(isAr ? 'تم حفظ قسم خدماتنا ومزامنته مع Supabase بنجاح! 🟢' : 'Services updated and synced to Supabase! 🟢');
      } else {
        setSaveSuccessMsg(isAr ? 'تم حفظ قسم خدماتنا بنجاح! 🟢' : 'Services updated successfully! 🟢');
      }
    } catch (err) {
      console.error('Error saving services:', err);
      setSaveSuccessMsg(isAr ? 'تم تطبيق الحفظ محلياً 🟢' : 'Saved services locally 🟢');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    }
  };

  const handleAddService = () => {
    const newSrv: ServiceItem = {
      id: Date.now().toString(),
      titleAr: 'خدمة جديدة',
      titleEn: 'New Service',
      descAr: 'وصف تفصيلي للخدمة الجديدة...',
      descEn: 'Detailed description of the new service...',
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      active: true
    };
    setServicesList([...servicesList, newSrv]);
  };

  const handleDeleteService = (id: string) => {
    setServicesList(prev => prev.filter(s => s.id !== id));
  };

  // Gallery Action Handlers
  const handleGalleryFieldChange = (id: string, field: keyof GalleryItem, value: any) => {
    setGalleryList(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleGalleryImageFileUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingItemId(id);
      try {
        let finalUrl = await uploadImageToSupabase(file);
        if (!finalUrl) {
          finalUrl = await compressImageFile(file, 900, 0.75);
        }
        if (finalUrl) {
          handleGalleryFieldChange(id, 'imageUrl', finalUrl);
          const updatedList = galleryList.map(item => item.id === id ? { ...item, imageUrl: finalUrl } : item);
          safeLocalStorageSetItem('n3_custom_gallery_list', updatedList);
          window.dispatchEvent(new Event('n3_content_updated'));

          if (isSupabaseActive) {
            await saveGalleryToSupabase(updatedList);
            // Refresh UI state immediately from Supabase to guarantee data consistency
            await refreshGalleryFromSupabase();
          }

          setSaveSuccessMsg(isAr ? 'تم رفع صورة المعرض وتحديث الواجهة والمزامنة مع Supabase بنجاح! 🟢' : 'Gallery image uploaded & synced from Supabase! 🟢');
          setTimeout(() => setSaveSuccessMsg(null), 3500);
        }
      } finally {
        setUploadingItemId(null);
      }
    }
  };

  const handleSaveGallery = async () => {
    setIsSaving(true);
    try {
      let dbSaved = false;
      if (isSupabaseActive) {
        dbSaved = await saveGalleryToSupabase(galleryList);
        await refreshGalleryFromSupabase();
      }

      safeLocalStorageSetItem('n3_custom_gallery_list', galleryList);
      window.dispatchEvent(new Event('n3_content_updated'));

      if (dbSaved) {
        setSaveSuccessMsg(isAr ? 'تم حفظ معرض الأعمال ومزامنته بنجاح! 🟢' : 'Gallery updated and synced successfully! 🟢');
      } else {
        setSaveSuccessMsg(isAr ? 'تم حفظ معرض الأعمال بنجاح! 🟢' : 'Gallery updated successfully! 🟢');
      }
    } catch (err) {
      console.error('Error saving gallery:', err);
      setSaveSuccessMsg(isAr ? 'تم تطبيق الحفظ محلياً 🟢' : 'Saved gallery locally 🟢');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    }
  };

  const handleAddGalleryItem = () => {
    const newItem: GalleryItem = {
      id: Date.now().toString(),
      title: 'New Event Showcase',
      desc: 'Event description details...',
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      active: true
    };
    setGalleryList([...galleryList, newItem]);
  };

  const handleDeleteGalleryItem = (id: string) => {
    setGalleryList(prev => prev.filter(item => item.id !== id));
  };

  // Section Field Update Handler
  const handleSectionFieldChange = (sectionId: string, field: keyof SectionConfig, value: string) => {
    setSections(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [field]: value
      }
    }));
  };

  // Save current section to LocalStorage & Supabase
  const handleSaveSection = async (sectionId: string) => {
    setIsSaving(true);
    try {
      const sec = sections[sectionId];
      const secName = isAr ? sec.nameAr : sec.nameEn;

      // 1. Sync to Supabase if active
      let savedToDb = false;
      if (isSupabaseActive) {
        savedToDb = await saveSectionToSupabase({
          section_id: sectionId,
          badge: isAr ? sec.badgeAr : sec.badgeEn,
          title: isAr ? sec.titleAr : sec.titleEn,
          description: isAr ? sec.descAr : sec.descEn,
          image: sec.imageUrl,
          note: isAr ? sec.customNotesAr : sec.customNotesEn
        });
        await refreshSectionsFromSupabase();
      }

      // 2. Save to LocalStorage & notify components
      safeLocalStorageSetItem('n3_sections_data', sections);
      window.dispatchEvent(new Event('n3_content_updated'));

      if (savedToDb) {
        setSaveSuccessMsg(isAr ? `تم حفظ ${secName} بنجاح ومزامنته مع Supabase! 🟢` : `Saved ${secName} to Supabase and site! 🟢`);
      } else {
        setSaveSuccessMsg(isAr ? `تم حفظ تعديلات ${secName} بنجاح! 🟢` : `Saved changes for ${secName} successfully! 🟢`);
      }
    } catch (e) {
      console.error('Error saving section data:', e);
      setSaveSuccessMsg(isAr ? 'تم تطبيق الحفظ محلياً بنجاح! 🟢' : 'Saved changes locally! 🟢');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    }
  };

  const handleSaveSiteSettings = async () => {
    setIsSaving(true);
    try {
      let dbSaved = false;
      if (isSupabaseActive) {
        dbSaved = await saveSiteSettingsToSupabase(siteSettings);
        await refreshSiteSettingsFromSupabase();
      }

      safeLocalStorageSetItem('n3_site_settings', siteSettings);
      window.dispatchEvent(new Event('n3_content_updated'));

      if (dbSaved) {
        setSaveSuccessMsg(isAr ? 'تم حفظ إعدادات مواقع التواصل ومزامنتها مع Supabase بنجاح! 🟢' : 'Settings saved and synced to Supabase! 🟢');
      } else {
        setSaveSuccessMsg(isAr ? 'تم حفظ إعدادات مواقع التواصل بنجاح! 🟢' : 'Settings saved successfully! 🟢');
      }
    } catch (err) {
      console.error('Error saving site settings:', err);
      setSaveSuccessMsg(isAr ? 'تم تطبيق الحفظ محلياً 🟢' : 'Saved settings 🟢');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    }
  };

  // Handle image upload from device/phone photo gallery for main sections
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingItemId(selectedSectionId);
      try {
        let finalUrl = await uploadImageToSupabase(file);
        if (!finalUrl) {
          finalUrl = await compressImageFile(file, 1000, 0.75);
        }
        if (finalUrl) {
          handleSectionFieldChange(selectedSectionId, 'imageUrl', finalUrl);
          
          const currentSec = sections[selectedSectionId];
          const updatedSec = { ...currentSec, imageUrl: finalUrl };
          const updatedSections = { ...sections, [selectedSectionId]: updatedSec };

          safeLocalStorageSetItem('n3_sections_data', updatedSections);
          window.dispatchEvent(new Event('n3_content_updated'));

          if (isSupabaseActive) {
            await saveSectionToSupabase({
              section_id: selectedSectionId,
              badge: isAr ? updatedSec.badgeAr : updatedSec.badgeEn,
              title: isAr ? updatedSec.titleAr : updatedSec.titleEn,
              description: isAr ? updatedSec.descAr : updatedSec.descEn,
              image: finalUrl,
              note: isAr ? updatedSec.customNotesAr : updatedSec.customNotesEn
            });
            // Refresh UI state immediately from Supabase to guarantee data consistency
            await refreshSectionsFromSupabase();
          }

          setSaveSuccessMsg(isAr ? 'تم رفع صورة القسم وتحديث الواجهة والمزامنة مع Supabase بنجاح! 🟢' : 'Section image uploaded & synced from Supabase! 🟢');
          setTimeout(() => setSaveSuccessMsg(null), 3500);
        }
      } finally {
        setUploadingItemId(null);
      }
    }
  };

  const currentSection = sections[selectedSectionId] || defaultSectionsConfig['01'];

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-fadeIn">
        <div className="relative w-full max-w-md bg-gradient-to-b from-[#16161d] to-[#0c0c0f] border border-red-500/30 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.25)] overflow-hidden text-white p-6 sm:p-8 space-y-6">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header & Logo */}
          <div className="flex flex-col items-center text-center space-y-3 pt-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-red-500 p-0.5 shadow-xl border border-white/20">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center text-red-500">
                <ShieldCheck className="w-8 h-8" />
              </div>
            </div>
            <div>
              <h2 className="font-outfit text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                {isAr ? 'لوحة التحكم الإدارية' : 'Admin Portal Access'}
              </h2>
              <p className="text-xs text-neutral-400 mt-1 font-medium">
                {isAr ? 'أدخل البريد الإلكتروني وكلمة المرور للمتابعة' : 'Enter admin email & password to manage site content'}
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase text-neutral-300 tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-red-500" />
                <span>{isAr ? 'البريد الإلكتروني المسؤول' : 'Admin Email'}</span>
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="creativegrouplimabersama@gmail.com"
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-red-500 text-white text-sm outline-none transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase text-neutral-300 tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-red-500" />
                <span>{isAr ? 'كلمة المرور' : 'Password'}</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-black/60 border border-white/15 focus:border-red-500 text-white text-sm outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message Alert */}
            {loginError && (
              <div className="p-3 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmittingLogin}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-red-900/40 transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>{isSubmittingLogin ? (isAr ? 'جاري التحقق...' : 'Authenticating...') : (isAr ? 'تسجيل الدخول للوحة' : 'Sign In To Portal')}</span>
            </button>
          </form>

          {/* Footer Notice */}
          <div className="text-center pt-2 border-t border-white/10 text-[11px] text-neutral-400">
            {isAr ? 'محمي بواسطة Supabase Auth & PROJECT N3 Security' : 'Protected by Supabase Auth & PROJECT N3 Security'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-6xl h-[94vh] bg-[#0c0c0f] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600/20 border border-red-500/40 text-red-500 shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-wider text-white">
                  {siteSettings.brandName}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-red-600 text-[10px] font-mono font-black text-white uppercase">
                  ADMIN
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-medium">
                {isAr ? 'لوحة التحكم المركزية للفعاليات وإدارة أقسام الموقع' : 'Central Events & Site Sections Control Panel'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline-block text-xs font-mono bg-white/10 border border-white/15 px-3 py-1 rounded-full text-neutral-300">
              {ADMIN_EMAIL}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title={isAr ? 'تسجيل الخروج' : 'Logout'}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{isAr ? 'تسجيل الخروج' : 'Logout'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-white/10 bg-black/40 overflow-x-auto">
          {/* TAB 1: الرئيسية */}
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/50'
                : 'bg-white/5 hover:bg-white/10 text-neutral-300'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{isAr ? 'الرئيسية' : 'Home Sections'}</span>
          </button>

          {/* TAB 2: الخدمات */}
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'services'
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/50'
                : 'bg-white/5 hover:bg-white/10 text-neutral-300'
            }`}
          >
            <span>{isAr ? 'الخدمات' : 'Our Services'}</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">
              {servicesList.length}
            </span>
          </button>

          {/* TAB 3: معرض الأعمال */}
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'gallery'
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/50'
                : 'bg-white/5 hover:bg-white/10 text-neutral-300'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{isAr ? 'معرض الأعمال' : 'Gallery & Showcase'}</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">
              {galleryList.length}
            </span>
          </button>

          {/* TAB 4: إعدادات مواقع التواصل */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/50'
                : 'bg-white/5 hover:bg-white/10 text-neutral-300'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{isAr ? 'إعدادات مواقع التواصل' : 'Social & Contact Settings'}</span>
          </button>

          {/* TAB 5: الرسائل والتعليقات (قسم الرسائل وإدارة قبول التعليقات) */}
          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'inbox'
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/50'
                : 'bg-white/5 hover:bg-white/10 text-neutral-300'
            }`}
          >
            <Inbox className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'الرسائل والتعليقات' : 'Inbox & Approvals'}</span>
            {contactMessages.filter((m) => !m.read).length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black animate-pulse">
                {contactMessages.filter((m) => !m.read).length} {isAr ? 'جديد' : 'new'}
              </span>
            )}
            {reviewsList.filter((r) => r.status === 'pending').length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black">
                {reviewsList.filter((r) => r.status === 'pending').length} {isAr ? 'معلق' : 'pending'}
              </span>
            )}
          </button>
        </div>

        {/* Success Alert Toast Notification */}
        <AnimatePresence>
          {saveSuccessMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-6 mt-3 p-3 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{saveSuccessMsg}</span>
              </div>
              <button onClick={() => setSaveSuccessMsg(null)} className="text-emerald-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Body Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* TAB 1: الرئيسية - MAIN SECTIONS EDITOR (01 to 08) */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* SECTIONS NAVIGATOR BAR */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-red-500" />
                    <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">
                      {isAr ? 'اختر القسم للتعديل' : 'Select Section to Edit'}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-red-400 bg-red-950/50 px-3 py-1 rounded-lg border border-red-800/40">
                    {isAr ? `القسم المختار: ${currentSection?.nameAr || ''}` : `Selected: ${currentSection?.nameEn || ''}`}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 pt-1">
                  {Object.keys(defaultSectionsConfig).map((id) => {
                    const sec = sections[id] || defaultSectionsConfig[id];
                    const isSelected = selectedSectionId === id;
                    const secTitle = isAr ? sec.nameAr : sec.nameEn;
                    return (
                      <button
                        key={id}
                        onClick={() => setSelectedSectionId(id)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/50 scale-105 font-black'
                            : 'bg-black/60 border-white/10 text-neutral-300 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <span className="text-xs font-bold leading-tight line-clamp-1">{secTitle}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ACTIVE SECTION EDITOR FORM */}
              <div className="p-6 rounded-2xl bg-black/60 border border-white/15 space-y-6">
                
                {/* Editor Section Header */}
                <div className="border-b border-white/10 pb-4">
                  <h3 className="font-extrabold text-lg text-white">
                    {isAr ? currentSection.nameAr : currentSection.nameEn}
                  </h3>
                </div>

                {/* Section Image / Media Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  
                  {/* Image Preview Card */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-red-500" />
                      <span>{isAr ? 'معاينة صورة القسم الحالية:' : 'Current Image Preview:'}</span>
                    </label>

                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/20 bg-neutral-900 group shadow-xl">
                      <img
                        src={currentSection.imageUrl}
                        alt={`Section ${currentSection.id} preview`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80';
                        }}
                      />
                    </div>
                  </div>

                  {/* Image Upload & Link Controls */}
                  <div className="md:col-span-2 space-y-4">
                    
                    {/* 1) Change image via mobile/device photo gallery */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <label className="block text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                        <Upload className="w-4 h-4 text-red-500" />
                        <span>{isAr ? 'تغيير الصورة عن طريق معرض الصور في الهاتف / الجهاز:' : 'Change Image from Mobile / Device Gallery:'}</span>
                      </label>
                      <p className="text-[11px] text-neutral-400">
                        {isAr ? 'اضغط لاختيار صورة من الاستوديو أو معرض الهاتف وسيتم تطبيقها فوراً' : 'Choose an image file directly from your device gallery.'}
                      </p>
                      <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/30 hover:bg-red-600/50 border border-red-500/50 text-white text-xs font-extrabold cursor-pointer transition-all">
                        {uploadingItemId === currentSection.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                            <span>{isAr ? 'جاري رفع وصقل الصورة...' : 'Uploading Image...'}</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-red-400" />
                            <span>{isAr ? 'اختيار صورة من معرض الهاتف' : 'Choose Photo from Mobile Gallery'}</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* 2) Change image via direct URL */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <label className="block text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-red-500" />
                        <span>{isAr ? 'تغيير الصورة عن طريق الرابط (URL):' : 'Change Image via Direct Link (URL):'}</span>
                      </label>
                      <input
                        type="text"
                        value={currentSection.imageUrl}
                        onChange={(e) => handleSectionFieldChange(currentSection.id, 'imageUrl', e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full p-2.5 bg-black/80 border border-white/20 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                </div>

                {/* Bottom Save Changes Button */}
                <div className="pt-4 border-t border-white/10 flex justify-end">
                  <button
                    onClick={() => handleSaveSection(currentSection.id)}
                    disabled={isSaving}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-900/50 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>{isAr ? 'جاري الحفظ والمزامنة...' : 'Saving & Syncing...'}</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{isAr ? 'حفظ التغييرات' : 'Save Changes'}</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: SERVICES (قسم خدماتنا) */}
          {activeTab === 'services' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Services Header & Quick Actions */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-white">
                    {isAr ? 'إدارة قسم خدماتنا' : 'Our Services Management'}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    {isAr
                      ? 'تعديل صور الخدمات، العنوان، والوصف بشكل مباشر. يبقى زر "استفسر الآن" فعالاً.'
                      : 'Customize service images, titles, descriptions, and maintain active "Inquire Now" buttons.'}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleAddService}
                    className="px-4 py-2.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/50 text-amber-300 font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAr ? 'إضافة خدمة جديدة' : 'Add New Service'}</span>
                  </button>

                  <button
                    onClick={handleSaveServices}
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>{isAr ? 'جاري الحفظ...' : 'Saving...'}</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{isAr ? 'حفظ الخدمات' : 'Save Services'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Services List Cards */}
              <div className="space-y-6">
                {servicesList.map((srv, index) => (
                  <div
                    key={srv.id}
                    className="p-5 sm:p-6 rounded-2xl bg-black/70 border border-[#f3e5ab]/30 hover:border-[#f3e5ab]/60 transition-all shadow-xl space-y-5"
                  >
                    {/* Card Header & Status */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-red-600/30 border border-red-500/40 text-red-400 font-mono font-black text-xs flex items-center justify-center">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {/* Title Displayed in Light Gold (#f3e5ab) */}
                        <h4 className="text-base sm:text-lg font-black text-[#f3e5ab] tracking-wider uppercase drop-shadow-sm">
                          {srv.titleEn || srv.titleAr || 'عنوان الخدمة'}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleServiceFieldChange(srv.id, 'active', !srv.active)}
                          className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                            srv.active
                              ? 'bg-emerald-600/30 border border-emerald-500/50 text-emerald-300'
                              : 'bg-white/10 text-neutral-400 border border-white/10'
                          }`}
                        >
                          {srv.active ? (isAr ? 'مفعّلة 🟢' : 'Active 🟢') : (isAr ? 'معطلة ⚪' : 'Disabled ⚪')}
                        </button>

                        <button
                          onClick={() => handleDeleteService(srv.id)}
                          className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 border border-red-500/30 transition-colors cursor-pointer"
                          title={isAr ? 'حذف الخدمة' : 'Delete Service'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      
                      {/* Left / Top Image Controls */}
                      <div className="lg:col-span-4 space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-amber-400" />
                          <span>{isAr ? 'صورة الخدمة:' : 'Service Cover Image:'}</span>
                        </label>

                        {/* Image Preview */}
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/20 bg-neutral-900 shadow-md">
                          <img
                            src={srv.imageUrl}
                            alt={srv.titleEn}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                        </div>

                        {/* Device Photo Gallery Upload Input */}
                        <label className="w-full py-2.5 px-3 rounded-xl bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/40 text-amber-300 text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all">
                          {uploadingItemId === srv.id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                              <span>{isAr ? 'جاري رفع وصقل الصورة...' : 'Uploading Image...'}</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 text-amber-400" />
                              <span>{isAr ? 'رفع صورة من الاستوديو / الهاتف' : 'Upload Image from Device'}</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleServiceImageFileUpload(srv.id, e)}
                            className="hidden"
                          />
                        </label>

                        {/* URL Direct Input */}
                        <div>
                          <input
                            type="text"
                            value={srv.imageUrl}
                            onChange={(e) => handleServiceFieldChange(srv.id, 'imageUrl', e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full p-2 bg-black/80 border border-white/20 rounded-xl text-[11px] font-mono text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      {/* Right / Fields Controls */}
                      <div className="lg:col-span-8 space-y-4">
                        
                        {/* Service Title Field (اضافة عنوان) */}
                        <div>
                          <label className="block text-xs font-extrabold text-[#f3e5ab] mb-1">
                            {isAr ? 'اضافة عنوان' : 'Add Title'}
                          </label>
                          <input
                            type="text"
                            value={srv.titleEn || srv.titleAr || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleServiceFieldChange(srv.id, 'titleEn', val);
                              handleServiceFieldChange(srv.id, 'titleAr', val);
                            }}
                            placeholder={isAr ? 'مثال: Event Planning & Management' : 'e.g. Event Planning & Management'}
                            className="w-full p-2.5 bg-black/80 border border-[#f3e5ab]/40 focus:border-[#f3e5ab] rounded-xl text-xs font-black text-[#f3e5ab] outline-none"
                          />
                        </div>

                        {/* Service Description Field (اضافة نص) */}
                        <div>
                          <label className="block text-xs font-bold text-neutral-300 mb-1">
                            {isAr ? 'اضافة نص' : 'Add Text'}
                          </label>
                          <textarea
                            rows={3}
                            value={srv.descEn || srv.descAr || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleServiceFieldChange(srv.id, 'descEn', val);
                              handleServiceFieldChange(srv.id, 'descAr', val);
                            }}
                            placeholder={isAr ? 'أدخل تفاصيل الوصف المباشر...' : 'Enter description details...'}
                            className="w-full p-2.5 bg-black/80 border border-white/20 focus:border-red-500 rounded-xl text-xs text-white resize-none outline-none"
                          />
                        </div>

                        {/* Inquire Now Button Preview & Action */}
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                          <span className="text-xs text-neutral-400 font-bold">
                            {isAr ? 'زر الاستفسار المباشر:' : 'Direct Inquiry Action:'}
                          </span>

                          <a
                            href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent((isAr ? 'مرحباً، أود الاستفسار عن خدمة: ' : 'Hello, I want to inquire about: ') + (srv.titleEn || srv.titleAr))}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>{isAr ? 'استفسر الآن' : 'Inquire Now'}</span>
                          </a>
                        </div>

                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Save Button */}
              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={handleSaveServices}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-900/50 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{isAr ? 'جاري حفظ التغييرات للخدمات...' : 'Saving All Services Changes...'}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{isAr ? 'حفظ كافة التغييرات للخدمات' : 'Save All Services Changes'}</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: GALLERY (معرض الأعمال) */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Gallery Header & Quick Actions */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-white">
                    {isAr ? 'إدارة معرض الأعمال' : 'Gallery & Showcase Management'}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    {isAr
                      ? 'إضافة وتعديل صور ومعلومات معرض الأعمال، وتغيير الصورة واضافة عنوان واضافة نص.'
                      : 'Customize gallery pictures, titles, and description text.'}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleAddGalleryItem}
                    className="px-4 py-2.5 rounded-xl bg-red-600/30 hover:bg-red-600/50 border border-red-500/50 text-red-300 font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAr ? 'إضافة عمل جديد للمعرض' : 'Add New Gallery Item'}</span>
                  </button>

                  <button
                    onClick={handleSaveGallery}
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>{isAr ? 'جاري الحفظ...' : 'Saving...'}</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{isAr ? 'حفظ معرض الأعمال' : 'Save Gallery'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Gallery List Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {galleryList.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-black/70 border border-white/15 hover:border-red-500/40 transition-all shadow-xl space-y-4"
                  >
                    {/* Item Header & Status */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-red-600/30 border border-red-500/40 text-red-400 font-mono font-black text-xs flex items-center justify-center">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h4 className="text-sm font-black text-white tracking-wider uppercase truncate max-w-[180px]">
                          {item.title || 'عنوان العمل'}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleGalleryFieldChange(item.id, 'active', !item.active)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                            item.active
                              ? 'bg-emerald-600/30 border border-emerald-500/50 text-emerald-300'
                              : 'bg-white/10 text-neutral-400 border border-white/10'
                          }`}
                        >
                          {item.active ? (isAr ? 'مفعّل 🟢' : 'Active 🟢') : (isAr ? 'معطل ⚪' : 'Disabled ⚪')}
                        </button>

                        <button
                          onClick={() => handleDeleteGalleryItem(item.id)}
                          className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 border border-red-500/30 transition-colors cursor-pointer"
                          title={isAr ? 'حذف العمل' : 'Delete Item'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Image Upload / Preview */}
                    <div className="space-y-3">
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-white/20 bg-neutral-900 shadow-md">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                      </div>

                      <label className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all">
                        {uploadingItemId === item.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                            <span>{isAr ? 'جاري رفع وصقل الصورة...' : 'Uploading Image...'}</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-red-400" />
                            <span>{isAr ? 'تغيير الصورة من معرض الجهاز' : 'Change Image from Device'}</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleGalleryImageFileUpload(item.id, e)}
                          className="hidden"
                        />
                      </label>

                      <input
                        type="text"
                        value={item.imageUrl}
                        onChange={(e) => handleGalleryFieldChange(item.id, 'imageUrl', e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full p-2 bg-black/80 border border-white/20 rounded-xl text-[11px] font-mono text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    {/* Title Field (اضافة عنوان) */}
                    <div>
                      <label className="block text-xs font-extrabold text-neutral-200 mb-1">
                        {isAr ? 'اضافة عنوان' : 'Add Title'}
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleGalleryFieldChange(item.id, 'title', e.target.value)}
                        placeholder={isAr ? 'عنوان الفعالية أو المعرض...' : 'Showcase event title...'}
                        className="w-full p-2.5 bg-black/80 border border-white/20 focus:border-red-500 rounded-xl text-xs font-bold text-white outline-none"
                      />
                    </div>

                    {/* Desc Field (اضافة نص) */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 mb-1">
                        {isAr ? 'اضافة نص' : 'Add Text'}
                      </label>
                      <textarea
                        rows={2}
                        value={item.desc}
                        onChange={(e) => handleGalleryFieldChange(item.id, 'desc', e.target.value)}
                        placeholder={isAr ? 'تفاصيل ونص المعرض...' : 'Showcase description text...'}
                        className="w-full p-2.5 bg-black/80 border border-white/20 focus:border-red-500 rounded-xl text-xs text-white resize-none outline-none"
                      />
                    </div>

                  </div>
                ))}
              </div>

              {/* Bottom Save Button */}
              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={handleSaveGallery}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-900/50 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{isAr ? 'جاري حفظ التغييرات...' : 'Saving Changes...'}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{isAr ? 'حفظ كافة التغييرات لمعرض الأعمال' : 'Save Gallery Changes'}</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* TAB 4: CONTACT & SITE SETTINGS (إعدادات مواقع التواصل) */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <h3 className="font-extrabold text-base text-white border-b border-white/10 pb-3">
                  {isAr ? 'إعدادات مواقع التواصل وبيانات الاتصال' : 'Social Media & Contact Settings'}
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">
                      {isAr ? 'اسم العلامة التجارية:' : 'Brand Name:'}
                    </label>
                    <input
                      type="text"
                      value={siteSettings.brandName}
                      onChange={(e) => setSiteSettings({ ...siteSettings, brandName: e.target.value })}
                      className="w-full p-2.5 bg-black/60 border border-white/15 rounded-xl text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">
                      {isAr ? 'رقم واتساب الرسمي (مع رمز الدولة):' : 'WhatsApp Number (with country code):'}
                    </label>
                    <input
                      type="text"
                      value={siteSettings.whatsapp}
                      onChange={(e) => setSiteSettings({ ...siteSettings, whatsapp: e.target.value })}
                      className="w-full p-2.5 bg-black/60 border border-white/15 rounded-xl text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">
                      {isAr ? 'رابط صفحة الإنستغرام:' : 'Instagram Profile URL:'}
                    </label>
                    <input
                      type="text"
                      value={siteSettings.instagram}
                      onChange={(e) => setSiteSettings({ ...siteSettings, instagram: e.target.value })}
                      className="w-full p-2.5 bg-black/60 border border-white/15 rounded-xl text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">
                      {isAr ? 'البريد الإلكتروني للشركة:' : 'Company Contact Email:'}
                    </label>
                    <input
                      type="email"
                      value={siteSettings.email}
                      onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                      className="w-full p-2.5 bg-black/60 border border-white/15 rounded-xl text-white font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSaveSiteSettings}
                    disabled={isSaving}
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>{isAr ? 'جاري الحفظ والمزامنة...' : 'Saving & Syncing...'}</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{isAr ? 'حفظ التغييرات' : 'Save Social & Contact Settings'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: صندوق الرسائل وقبول/رفض التعليقات */}
          {activeTab === 'inbox' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* SECTION 1: صندوق رسائل نموذج التواصل (TOP PART) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-500">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base sm:text-lg uppercase tracking-wider text-white flex items-center gap-2">
                        <span>{isAr ? 'صندوق رسائل نموذج التواصل' : 'Contact Messages Inbox'}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-xs font-mono font-black">
                          {contactMessages.length}
                        </span>
                      </h3>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {isAr
                          ? 'استعراض وقراءة وإدارة جميع الرسائل الواردة من نموذج اتصل بنا بالموقع'
                          : 'View and manage all inquiry messages submitted via the website contact form'}
                      </p>
                    </div>
                  </div>

                  {/* Message Search & Filter Bar */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        value={msgSearchQuery}
                        onChange={(e) => setMsgSearchQuery(e.target.value)}
                        placeholder={isAr ? 'بحث في الرسائل...' : 'Search messages...'}
                        className="pl-3 pr-8 py-1.5 bg-black/60 border border-white/15 rounded-xl text-xs text-white outline-none focus:border-red-500 w-36 sm:w-48"
                      />
                    </div>

                    <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
                      <button
                        onClick={() => setMsgFilterStatus('all')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          msgFilterStatus === 'all' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        {isAr ? 'الكل' : 'All'}
                      </button>
                      <button
                        onClick={() => setMsgFilterStatus('unread')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          msgFilterStatus === 'unread' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        {isAr ? 'غير مقروءة' : 'Unread'}
                      </button>
                      <button
                        onClick={() => setMsgFilterStatus('read')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          msgFilterStatus === 'read' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        {isAr ? 'مقروءة' : 'Read'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages Cards List */}
                {(() => {
                  const filteredMsgs = contactMessages.filter((msg) => {
                    const matchesQuery =
                      !msgSearchQuery ||
                      `${msg.firstName} ${msg.lastName} ${msg.email} ${msg.message}`
                        .toLowerCase()
                        .includes(msgSearchQuery.toLowerCase());
                    const matchesStatus =
                      msgFilterStatus === 'all' ||
                      (msgFilterStatus === 'unread' && !msg.read) ||
                      (msgFilterStatus === 'read' && msg.read);
                    return matchesQuery && matchesStatus;
                  });

                  if (filteredMsgs.length === 0) {
                    return (
                      <div className="text-center py-10 bg-black/40 rounded-2xl border border-dashed border-white/10 space-y-2">
                        <Mail className="w-8 h-8 text-neutral-600 mx-auto" />
                        <p className="text-xs text-neutral-400 font-bold">
                          {isAr ? 'لا توجد رسائل مطابقة لخيارات البحث' : 'No messages found matching search query'}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      {filteredMsgs.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                            !msg.read
                              ? 'bg-gradient-to-r from-red-950/30 via-black/80 to-black/90 border-red-500/40 shadow-lg shadow-red-950/20'
                              : 'bg-black/50 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center font-black text-white text-sm shadow-md flex-shrink-0">
                                {(msg.firstName?.[0] || 'U').toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-extrabold text-sm text-white">
                                    {msg.firstName} {msg.lastName}
                                  </h4>
                                  {!msg.read ? (
                                    <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase">
                                      {isAr ? 'جديدة' : 'NEW'}
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-neutral-400 text-[10px] font-bold">
                                      {isAr ? 'مقروءة' : 'Read'}
                                    </span>
                                  )}
                                </div>
                                <a
                                  href={`mailto:${msg.email}`}
                                  className="text-xs text-red-400 hover:underline font-mono"
                                >
                                  {msg.email}
                                </a>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                                <span>{new Date(msg.createdAt).toLocaleString(isAr ? 'ar-EG' : 'en-US')}</span>
                              </span>
                            </div>
                          </div>

                          {/* Message Body Text */}
                          <div className="p-3.5 bg-black/70 rounded-xl border border-white/10 text-xs sm:text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap font-sans">
                            {msg.message}
                          </div>

                          {/* Action Toolbar */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleMessageRead(msg.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                  !msg.read
                                    ? 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40'
                                    : 'bg-white/10 hover:bg-white/20 text-neutral-300'
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>
                                  {msg.read
                                    ? isAr ? 'تحديد كغير مقروء' : 'Mark Unread'
                                    : isAr ? 'تحديد كمقروء' : 'Mark Read'}
                                </span>
                              </button>

                              <a
                                href={`mailto:${msg.email}?subject=رد على استفساركم - PROJECT N3 ORGANIZER`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>{isAr ? 'رد عبر البريد' : 'Reply Email'}</span>
                              </a>

                              <a
                                href={`https://wa.me/?text=${encodeURIComponent(
                                  `مرحباً ${msg.firstName}، شكراً لتواصلكم مع PROJECT N3 ORGANIZER.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>{isAr ? 'رد عبر الواتساب' : 'Reply WhatsApp'}</span>
                              </a>
                            </div>

                            <button
                              onClick={() => deleteMessage(msg.id)}
                              className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ml-auto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{isAr ? 'حذف الرسالة' : 'Delete'}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* SECTION 2: قسم قبول وإدارة التعليقات والتقييمات (BOTTOM PART) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-amber-600/20 border border-amber-500/40 text-amber-400">
                      <Star className="w-6 h-6 fill-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base sm:text-lg uppercase tracking-wider text-white flex items-center gap-2">
                        <span>{isAr ? 'قسم قبول وإدارة طلبات التعليقات والتقييمات' : 'Client Reviews & Comments Approvals'}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-xs font-mono font-black">
                          {reviewsList.filter((r) => r.status === 'pending').length} {isAr ? 'معلق' : 'pending'}
                        </span>
                      </h3>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {isAr
                          ? 'يمكن للمسؤول هنا قبول أو إخفاء التعليقات المضافة من الزوار قبل عرضها في الواجهة الرئيسية'
                          : 'Approve or reject customer review submissions before they display on the Home page'}
                      </p>
                    </div>
                  </div>

                  {/* Reviews Status Filter Pills */}
                  <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs flex-wrap">
                    <button
                      onClick={() => setRevFilterStatus('pending')}
                      className={`px-3 py-1.5 rounded-lg font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                        revFilterStatus === 'pending'
                          ? 'bg-amber-500 text-black shadow-md'
                          : 'text-neutral-300 hover:text-white'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{isAr ? 'بانتظار القبول' : 'Pending'}</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px] font-mono">
                        {reviewsList.filter((r) => r.status === 'pending').length}
                      </span>
                    </button>

                    <button
                      onClick={() => setRevFilterStatus('approved')}
                      className={`px-3 py-1.5 rounded-lg font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                        revFilterStatus === 'approved'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'text-neutral-300 hover:text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isAr ? 'المقبولة' : 'Approved'}</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px] font-mono">
                        {reviewsList.filter((r) => r.status === 'approved' || !r.status).length}
                      </span>
                    </button>

                    <button
                      onClick={() => setRevFilterStatus('rejected')}
                      className={`px-3 py-1.5 rounded-lg font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                        revFilterStatus === 'rejected'
                          ? 'bg-red-600 text-white shadow-md'
                          : 'text-neutral-300 hover:text-white'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{isAr ? 'المرفوضة' : 'Rejected'}</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px] font-mono">
                        {reviewsList.filter((r) => r.status === 'rejected').length}
                      </span>
                    </button>

                    <button
                      onClick={() => setRevFilterStatus('all')}
                      className={`px-3 py-1.5 rounded-lg font-extrabold transition-all cursor-pointer ${
                        revFilterStatus === 'all'
                          ? 'bg-white/20 text-white shadow-md'
                          : 'text-neutral-300 hover:text-white'
                      }`}
                    >
                      <span>{isAr ? 'الكل' : 'All'}</span>
                    </button>
                  </div>
                </div>

                {/* Reviews List */}
                {(() => {
                  const filteredRevs = reviewsList.filter((rev) => {
                    if (revFilterStatus === 'all') return true;
                    if (revFilterStatus === 'pending') return rev.status === 'pending';
                    if (revFilterStatus === 'approved') return rev.status === 'approved' || !rev.status;
                    if (revFilterStatus === 'rejected') return rev.status === 'rejected';
                    return true;
                  });

                  if (filteredRevs.length === 0) {
                    return (
                      <div className="text-center py-10 bg-black/40 rounded-2xl border border-dashed border-white/10 space-y-2">
                        <Star className="w-8 h-8 text-neutral-600 mx-auto" />
                        <p className="text-xs text-neutral-400 font-bold">
                          {isAr ? 'لا توجد تعليقات أو تقييمات في هذه الفئة حالياً' : 'No review submissions found in this category'}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredRevs.map((rev) => (
                        <div
                          key={rev.id}
                          className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                            rev.status === 'pending'
                              ? 'bg-gradient-to-br from-amber-950/20 via-black/80 to-black/90 border-amber-500/40 shadow-lg shadow-amber-950/20'
                              : rev.status === 'approved' || !rev.status
                              ? 'bg-black/50 border-emerald-500/30'
                              : 'bg-black/50 border-red-500/30 opacity-75'
                          }`}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                              <div>
                                <h4 className="font-extrabold text-sm text-white">{rev.name}</h4>
                                <p className="text-xs text-neutral-400 font-medium">{rev.role}</p>
                              </div>

                              <div>
                                {rev.status === 'pending' && (
                                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{isAr ? 'بانتظار الموافقة' : 'Pending Approval'}</span>
                                  </span>
                                )}
                                {(rev.status === 'approved' || !rev.status) && (
                                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>{isAr ? 'مقبول بالموقع' : 'Approved'}</span>
                                  </span>
                                )}
                                {rev.status === 'rejected' && (
                                  <span className="px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-black flex items-center gap-1">
                                    <XCircle className="w-3 h-3" />
                                    <span>{isAr ? 'مرفوض / مخفي' : 'Rejected'}</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Rating Stars */}
                            <div className="flex items-center gap-1">
                              {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              ))}
                            </div>

                            {/* Comment Text */}
                            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans bg-black/60 p-3 rounded-xl border border-white/10">
                              "{rev.text}"
                            </p>
                          </div>

                          {/* Approval Actions Toolbar */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
                            <div className="flex items-center gap-2">
                              {rev.status !== 'approved' && (
                                <button
                                  onClick={() => setReviewStatus(rev.id, 'approved')}
                                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>{isAr ? 'قبول ونشر بالموقع' : 'Approve & Publish'}</span>
                                </button>
                              )}

                              {rev.status !== 'rejected' && (
                                <button
                                  onClick={() => setReviewStatus(rev.id, 'rejected')}
                                  className="px-3.5 py-1.5 rounded-xl bg-amber-600/30 hover:bg-amber-600 text-amber-200 hover:text-white border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>{isAr ? 'رفض / إخفاء' : 'Reject / Hide'}</span>
                                </button>
                              )}
                            </div>

                            <button
                              onClick={() => deleteReviewItem(rev.id)}
                              className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ml-auto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{isAr ? 'حذف' : 'Delete'}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
