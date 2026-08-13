import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawSupabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
// Clean URL to prevent trailing slashes or duplicate path components in @supabase/supabase-js
const supabaseUrl = rawSupabaseUrl.replace(/\/+$/, '').replace(/\/rest\/v1\/?$/i, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const ADMIN_EMAIL = 'creativegrouplimabersama@gmail.com';
export const ADMIN_PASS = 'p199900';

/**
 * Authenticate Admin with email & password.
 * Checks against static admin credentials or Supabase Auth.
 */
export async function loginAdminAccount(emailInput: string, passInput: string): Promise<{ success: boolean; message?: string }> {
  const cleanEmail = emailInput.trim().toLowerCase();
  
  // 1. Direct validation against requested Admin credentials
  if (cleanEmail === ADMIN_EMAIL.toLowerCase() && passInput === ADMIN_PASS) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        // Attempt Supabase Auth login with these credentials
        const { error } = await supabase.auth.signInWithPassword({
          email: ADMIN_EMAIL,
          password: ADMIN_PASS
        });
        if (error && error.message.includes('Invalid login credentials')) {
          // Auto sign-up if first time on Supabase Auth
          await supabase.auth.signUp({
            email: ADMIN_EMAIL,
            password: ADMIN_PASS
          });
        }
      } catch (err) {
        console.warn('Supabase Auth warning:', err);
      }
    }
    return { success: true };
  }

  // 2. Fallback to Supabase Auth login for other accounts if Supabase is active
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: passInput
      });
      if (error) {
        return { success: false, message: error.message };
      }
      if (data.user) {
        return { success: true };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Supabase auth error' };
    }
  }

  return {
    success: false,
    message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
  };
}

// Helper to check if Supabase is configured with valid non-empty credentials
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'YOUR_SUPABASE_URL' &&
    supabaseUrl.startsWith('https://')
  );
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return clientInstance;
};

// Interface for Contact / Booking Inquiries
export interface InquiryData {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  destination_id?: string;
  destination_name?: string;
  message?: string;
  created_at?: string;
}

// Interface for Home Sections stored in Supabase
export interface SupabaseHomeSection {
  section_id: string; // e.g., "01", "02", ...
  badge?: string;
  title?: string;
  description?: string;
  image?: string;
  note?: string;
  updated_at?: string;
}

/**
 * Fetch sections from Supabase table 'home_sections'
 */
export async function fetchSectionsFromSupabase(): Promise<SupabaseHomeSection[] | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('home_sections')
      .select('*');

    if (error) {
      console.warn('Supabase fetch error:', error.message);
      return null;
    }
    return data as SupabaseHomeSection[];
  } catch (err) {
    console.warn('Failed to fetch sections from Supabase:', err);
    return null;
  }
}

/**
 * Save or update a section in Supabase table 'home_sections'
 */
export async function saveSectionToSupabase(section: SupabaseHomeSection): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const payload = {
      section_id: section.section_id,
      badge: section.badge || '',
      title: section.title || '',
      description: section.description || '',
      image: section.image || '',
      note: section.note || '',
      updated_at: new Date().toISOString()
    };

    // Attempt standard upsert
    const { error: upsertError } = await supabase
      .from('home_sections')
      .upsert(payload, { onConflict: 'section_id' });

    if (!upsertError) return true;

    console.warn('Supabase upsert note:', upsertError.message);

    // Fallback: try UPDATE
    const { error: updateError } = await supabase
      .from('home_sections')
      .update(payload)
      .eq('section_id', section.section_id);

    if (!updateError) return true;

    // Fallback: try INSERT
    const { error: insertError } = await supabase
      .from('home_sections')
      .insert([payload]);

    if (!insertError) return true;

    console.warn('Supabase insert fallback note:', insertError.message);
    return false;
  } catch (err) {
    console.warn('Failed to save section to Supabase:', err);
    return false;
  }
}

/**
 * Compress heavy image file before uploading to Storage (< 200KB output)
 */
export function compressImageToBlob(file: File, maxWidth = 1200, quality = 0.82): Promise<Blob | File> {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve(file);
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => resolve(file);
    reader.onload = (event) => {
      const src = event.target?.result as string;
      if (!src) {
        resolve(file);
        return;
      }
      const img = new Image();
      img.onerror = () => resolve(file);
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
            resolve(file);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            quality
          );
        } catch {
          resolve(file);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Upload image file to Supabase Storage bucket 'n3-images'
 */
export async function uploadImageToSupabase(file: File): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    // Compress first to guarantee ultra-fast upload (< 1s)
    const compressedBlob = await compressImageToBlob(file, 1200, 0.82);
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.jpg`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('n3-images')
      .upload(filePath, compressedBlob, {
        contentType: 'image/jpeg',
        cacheControl: '3600000',
        upsert: true
      });

    if (uploadError) {
      console.warn('Supabase storage upload note:', uploadError.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('n3-images')
      .getPublicUrl(filePath);

    return urlData?.publicUrl || null;
  } catch (err) {
    console.warn('Failed to upload image to Supabase Storage:', err);
    return null;
  }
}

/**
 * Sync Services to Supabase table 'services'
 */
export async function saveServicesToSupabase(services: any[]): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const rows = services.map(s => ({
      id: s.id,
      title_ar: s.titleAr || '',
      title_en: s.titleEn || '',
      desc_ar: s.descAr || '',
      desc_en: s.descEn || '',
      image_url: s.imageUrl || '',
      active: s.active !== false,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('services')
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase services save error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to save services to Supabase:', err);
    return false;
  }
}

export async function fetchServicesFromSupabase(): Promise<any[] | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from('services').select('*');
    if (error || !data) return null;

    return data.map((item: any) => ({
      id: item.id,
      titleAr: item.title_ar,
      titleEn: item.title_en,
      descAr: item.desc_ar,
      descEn: item.desc_en,
      imageUrl: item.image_url,
      active: item.active
    }));
  } catch (e) {
    return null;
  }
}

/**
 * Sync Gallery to Supabase table 'gallery'
 */
export async function saveGalleryToSupabase(gallery: any[]): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const rows = gallery.map(g => ({
      id: g.id,
      title: g.title || '',
      description: g.desc || g.description || '',
      image_url: g.imageUrl || '',
      active: g.active !== false,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('gallery')
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase gallery save error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to save gallery to Supabase:', err);
    return false;
  }
}

export async function fetchGalleryFromSupabase(): Promise<any[] | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from('gallery').select('*');
    if (error || !data) return null;

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      desc: item.description || item.desc || '',
      imageUrl: item.image_url,
      active: item.active
    }));
  } catch (e) {
    return null;
  }
}

/**
 * Sync Site Settings to Supabase table 'site_settings'
 */
export async function saveSiteSettingsToSupabase(settings: any): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const payload = {
      id: 'default',
      whatsapp: settings.whatsapp || '',
      phone: settings.phone || '',
      email: settings.email || '',
      instagram: settings.instagram || '',
      facebook: settings.facebook || '',
      tiktok: settings.tiktok || '',
      location: settings.location || '',
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('site_settings')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase site_settings save error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to save site_settings to Supabase:', err);
    return false;
  }
}

export async function fetchSiteSettingsFromSupabase(): Promise<any | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 'default').single();
    if (error || !data) return null;

    return {
      whatsapp: data.whatsapp,
      phone: data.phone,
      email: data.email,
      instagram: data.instagram,
      facebook: data.facebook,
      tiktok: data.tiktok,
      location: data.location
    };
  } catch (e) {
    return null;
  }
}
