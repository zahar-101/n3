export interface Destination {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  region: string;
  coordinates: string;
  temperature: string;
  highlights: string[];
  imageUrl: string;
}

export type NavItem = 'Home' | 'Destinations' | 'Activities' | 'About Us';

export type LanguageCode = 'en' | 'ar' | 'id' | 'zh' | 'tr' | 'ru';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export interface Translations {
  brandName: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  navHome: string;
  navDestinations: string;
  navActivities: string;
  navAboutUs: string;
  socialInstagram: string;
  socialTiktok: string;
  socialX: string;
  placeToBe: string;
  copyright: string;
  selectLanguage: string;
  planTrip: string;
  topHighlights: string;
  contactTitle: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactMessage: string;
  contactSubmit: string;
  contactSuccess: string;
  whatsappButton: string;
  menuTitle: string;

  // VIP Services Section
  vipServicesBadge: string;
  vipServicesTitle: string;
  vipServicesSubtitle: string;
  beachclubTitle: string;
  beachclubDesc: string;
  beachclubTag: string;
  yachtTitle: string;
  yachtDesc: string;
  yachtTag: string;
  villaTitle: string;
  villaDesc: string;
  villaTag: string;
  supercarTitle: string;
  supercarDesc: string;
  supercarTag: string;

  // Destinations Section
  hotspotsBadge: string;
  hotspotsTitle: string;
  hotspotsSubtitle: string;
  exploreHotspot: string;

  // Interactive Concierge Request
  conciergeBadge: string;
  conciergeTitle: string;
  conciergeSubtitle: string;
  selectServiceLabel: string;
  serviceYacht: string;
  serviceBeachclub: string;
  serviceVilla: string;
  serviceSupercar: string;
  guestsLabel: string;
  phoneLabel: string;
  sendRequestBtn: string;
  successMsg: string;

  // Metrics & Testimonials
  metric1Label: string;
  metric2Label: string;
  metric3Label: string;
  metric4Label: string;
  testimonialsBadge: string;
  testimonialsTitle: string;
  test1Name: string;
  test1Role: string;
  test1Text: string;
  test2Name: string;
  test2Role: string;
  test2Text: string;
  test3Name: string;
  test3Role: string;
  test3Text: string;

  // Nav Page Drawer
  destinationsPageSubtitle: string;
  activitiesPageSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  whoWeAre?: string;
  card1?: string;
  card2?: string;
  card3?: string;
  organizerTitleRed?: string;
  locationWhite?: string;
  descriptionWhite?: string;
  aboutStat1: string;
  aboutStat2: string;
  directContact: string;
  activity1Title: string;
  activity1Desc: string;
  activity2Title: string;
  activity2Desc: string;
  activity3Title: string;
  activity3Desc: string;

  // Drawer / Modals
  mainShowcase: string;
  vipConciergeSub: string;
  eventsPortfolioSub: string;
  visionContactSub: string;
  vipGuideTag: string;
  closeBtn: string;
}
