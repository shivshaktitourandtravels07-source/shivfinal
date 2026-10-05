import { TourPackage, BookingInquiry, AgencySettings } from '../types';
import { INITIAL_PACKAGES, HERO_SLIDES } from '../data/packagesData';

// Supabase Configuration provided by user
export const SUPABASE_CONFIG = {
  url: 'https://kbqvgvnoemnyjbytnacu.supabase.co',
  restUrl: 'https://kbqvgvnoemnyjbytnacu.supabase.co/rest/v1',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImticXZndm5vZW1ueWpieXRuYWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNDQ2ODcsImV4cCI6MjEwNTgyMDY4N30.b8uD4E9gAa7odru1eAUpzFK6JfkPCFyiXiZnakr_AgA'
};

const LOCAL_STORAGE_KEY = 'sst_custom_packages_v2';
const LOCAL_INQUIRIES_KEY = 'sst_inquiries_v2';
const LOCAL_SETTINGS_KEY = 'sst_agency_settings_v2';

// ---------------- LOCAL STORAGE SAFE HELPERS (QUOTA-PROOF) ----------------

/**
 * Strips heavy data:image/ base64 strings so local cache only stores lightweight URLs
 */
export function sanitizePackagesForLocalStorage(pkgs: TourPackage[]): TourPackage[] {
  if (!Array.isArray(pkgs)) return [];
  return pkgs.map((pkg) => {
    const isCoverBase64 = typeof pkg.coverImage === 'string' && pkg.coverImage.startsWith('data:');
    const safeCover = isCoverBase64 ? '/hero/slide1.jpg' : pkg.coverImage;
    const safeGallery = Array.isArray(pkg.galleryImages)
      ? pkg.galleryImages.filter((img) => typeof img === 'string' && !img.startsWith('data:'))
      : [];

    return {
      ...pkg,
      coverImage: safeCover,
      galleryImages: safeGallery
    };
  });
}

/**
 * Safe localStorage setter that handles QuotaExceededError and sanitizes bloated data.
 * NEVER throws an exception so user operations (like saving packages) will never crash.
 */
export function safeSetLocalStorage(key: string, value: string): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (quotaErr) {
    console.warn(`[Storage] Quota exceeded for "${key}". Sanitizing and retrying...`, quotaErr);

    // 1. If saving packages, strip base64 data URLs completely
    try {
      if (key === LOCAL_STORAGE_KEY) {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          const sanitized = sanitizePackagesForLocalStorage(parsed);
          localStorage.setItem(key, JSON.stringify(sanitized));
          return true;
        }
      }
    } catch (e1) {
      console.warn('[Storage] Sanitized retry failed:', e1);
    }

    // 2. Free up space by removing older or non-critical caches
    try {
      localStorage.removeItem('sst_temp_image');
      localStorage.removeItem('sst_packages_cache');
      localStorage.removeItem('sst_custom_packages');
      // If still failing, purge the key so future operations don't get blocked
      localStorage.removeItem(key);
    } catch {}

    // Never rethrow - returns false gracefully so user workflows don't fail!
    return false;
  }
}

/**
 * Scans localStorage on startup and purges bloated base64 strings from previous versions
 */
export function cleanupOversizedLocalStorage(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw && (raw.includes('data:image/') || raw.length > 250000)) {
      console.warn('[Storage] Cleaning oversized base64 data from localStorage...');
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const sanitized = sanitizePackagesForLocalStorage(parsed);
          safeSetLocalStorage(LOCAL_STORAGE_KEY, JSON.stringify(sanitized));
        } else {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
  } catch (err) {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {}
  }
}

/**
 * Flush all package & inquiry cache from localStorage (useful for admin troubleshoot)
 */
export function clearAllLocalStorageCache(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_INQUIRIES_KEY);
    localStorage.removeItem(LOCAL_SETTINGS_KEY);
    localStorage.removeItem('sst_temp_image');
    localStorage.removeItem('sst_packages_cache');
    console.log('[Storage] All local storage cache cleared.');
  } catch (e) {
    console.warn('[Storage] Error clearing cache:', e);
  }
}

// Auto-run cleanup on initial load
if (typeof window !== 'undefined') {
  cleanupOversizedLocalStorage();
}

/**
 * Converts a base64 DataURL into a permanent static URL via /api/upload
 */
export async function uploadBase64IfAny(imgStr: string, hintName = 'photo'): Promise<string> {
  if (!imgStr || typeof imgStr !== 'string' || !imgStr.startsWith('data:image/')) {
    return imgStr;
  }
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: imgStr,
        filename: `${hintName}_${Date.now()}.jpg`
      })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.url) return data.url;
    }
  } catch (err) {
    console.warn('[Storage] Failed to convert base64 to /uploads path:', err);
  }
  return imgStr;
}

// Universal headers for Supabase REST API
const getSupabaseHeaders = () => ({
  'apikey': SUPABASE_CONFIG.anonKey,
  'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
  'Cache-Control': 'no-cache, no-store, must-revalidate'
});

// Helper: Generate URL-safe slug and ensure uniqueness
export function generateUniqueSlug(title: string, currentId: string, existingList: TourPackage[] = []): string {
  let base = (title || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!base || base.length < 2) {
    base = `tour-package-${Date.now()}`;
  }

  // Check if base is already used by another package
  let slug = base;
  let counter = 1;
  const isConflict = (s: string) => existingList.some(p => p.id !== currentId && p.slug === s);

  while (isConflict(slug)) {
    counter += 1;
    slug = `${base}-${counter}`;
  }

  return slug;
}

// SQL schema generator helper for the user to run in Supabase SQL Editor if table doesn't exist
export const SUPABASE_SETUP_SQL = `-- Run this once in Supabase SQL Editor (https://supabase.com/dashboard/project/kbqvgvnoemnyjbytnacu/sql)
create table if not exists public.packages (
  id text primary key,
  slug text unique,
  title text not null,
  tagline text,
  duration text,
  "daysCount" integer default 1,
  "nightsCount" integer default 0,
  "pricePerPerson" numeric not null default 2499,
  "originalPrice" numeric default 3499,
  "suitableFor" text,
  badge text,
  featured boolean default false,
  "coverImage" text,
  "galleryImages" text[] default '{}',
  overview text,
  highlights text[] default '{}',
  inclusions text[] default '{}',
  exclusions text[] default '{}',
  itinerary jsonb default '[]',
  "cancellationPolicy" text,
  "seoKeywords" text[] default '{}',
  "metaDescription" text,
  "createdAt" timestamp with time zone default now()
);

-- Enable public read & admin write policies
alter table public.packages enable row level security;

create policy "Public read packages" on public.packages for select using (true);
create policy "Public insert packages" on public.packages for insert with check (true);
create policy "Public update packages" on public.packages for update using (true);
create policy "Public delete packages" on public.packages for delete using (true);

-- Optional customer inquiries table
create table if not exists public.inquiries (
  id text primary key,
  "packageName" text,
  name text,
  phone text,
  email text,
  "travelDate" text,
  "numberOfPersons" integer default 2,
  status text default 'new',
  notes text,
  "createdAt" timestamp with time zone default now()
);

alter table public.inquiries enable row level security;
create policy "Public inquiries access" on public.inquiries for all using (true);
`;

// Helper: Normalize package data coming from Supabase or LocalStorage
function normalizePackage(pkg: any): TourPackage {
  const gallery = Array.isArray(pkg.galleryImages)
    ? pkg.galleryImages
    : (pkg.galleryImages ? [pkg.galleryImages] : []);

  let resolvedCover = pkg.coverImage;
  // If coverImage is empty or default unsplash placeholder, prioritize actual gallery image or reliable local slide
  if (!resolvedCover || resolvedCover.includes('photo-1548013146-72479768bada')) {
    if (gallery.length > 0) {
      resolvedCover = gallery[0];
    } else {
      resolvedCover = '/hero/slide1.jpg';
    }
  }

  return {
    id: String(pkg.id || `pkg-${Date.now()}`),
    slug: String(pkg.slug || `package-${Date.now()}`),
    title: String(pkg.title || 'Ujjain Pilgrimage Tour'),
    tagline: String(pkg.tagline || ''),
    duration: String(pkg.duration || '2 Days / 1 Night'),
    daysCount: Number(pkg.daysCount || 2),
    nightsCount: Number(pkg.nightsCount || 1),
    pricePerPerson: Number(pkg.pricePerPerson || 6499),
    originalPrice: pkg.originalPrice ? Number(pkg.originalPrice) : undefined,
    suitableFor: pkg.suitableFor || undefined,
    badge: pkg.badge || undefined,
    featured: Boolean(pkg.featured),
    coverImage: resolvedCover,
    galleryImages: gallery,
    overview: String(pkg.overview || ''),
    highlights: Array.isArray(pkg.highlights) ? pkg.highlights : [],
    inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions : [],
    exclusions: Array.isArray(pkg.exclusions) ? pkg.exclusions : [],
    itinerary: Array.isArray(pkg.itinerary) ? pkg.itinerary : [],
    cancellationPolicy: pkg.cancellationPolicy || undefined,
    seoKeywords: Array.isArray(pkg.seoKeywords) ? pkg.seoKeywords : [],
    metaDescription: pkg.metaDescription || undefined
  };
}

// 1. GET ALL PACKAGES (Supabase -> Server API -> LocalStorage -> INITIAL_PACKAGES)
export async function getStoredPackages(forceRefresh: boolean = false): Promise<TourPackage[]> {
  // First, check if Supabase REST API has packages
  try {
    const timestamp = Date.now();
    const supabaseRes = await fetch(`${SUPABASE_CONFIG.restUrl}/packages?select=*&order=createdAt.desc&_ts=${timestamp}`, {
      headers: getSupabaseHeaders(),
      cache: 'no-store'
    });

    if (supabaseRes.ok) {
      const data = await supabaseRes.json();
      if (Array.isArray(data)) {
        if (data.length > 0) {
          const normalized = data.map(normalizePackage);
          safeSetLocalStorage(LOCAL_STORAGE_KEY, JSON.stringify(normalized));
          return normalized;
        } else if (data.length === 0 && forceRefresh) {
          // Explicitly empty table in Supabase
          safeSetLocalStorage(LOCAL_STORAGE_KEY, JSON.stringify([]));
          return [];
        }
      }
    }
  } catch (err) {
    console.debug('Supabase direct query notice:', err);
  }

  // Second, check server Node API (/api/packages)
  try {
    const serverRes = await fetch(`/api/packages?_ts=${Date.now()}`, { cache: 'no-store' });
    if (serverRes.ok) {
      const data = await serverRes.json();
      if (Array.isArray(data) && data.length > 0) {
        const normalized = data.map(normalizePackage);
        safeSetLocalStorage(LOCAL_STORAGE_KEY, JSON.stringify(normalized));
        return normalized;
      }
    }
  } catch (err) {
    console.debug('Server API fetch notice:', err);
  }

  // Third, check LocalStorage
  try {
    const localRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localRaw) {
      const parsed = JSON.parse(localRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizePackage);
      }
    }
  } catch (e) {
    console.debug('LocalStorage read notice:', e);
  }

  // Fallback to static initial packages
  safeSetLocalStorage(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PACKAGES));
  return INITIAL_PACKAGES;
}

// 2. SAVE OR UPDATE PACKAGE (Syncs to Supabase, Server, and LocalStorage)
export async function saveTourPackage(
  pkgData: Partial<TourPackage>,
  isNew: boolean
): Promise<{ success: boolean; package: TourPackage; error?: string }> {
  try {
    const existing = await getStoredPackages(true);
    let targetPkg: TourPackage;

    if (isNew) {
      const id = pkgData.id || `pkg-${Date.now()}`;
      const uniqueSlug = pkgData.slug
        ? generateUniqueSlug(pkgData.slug, id, existing)
        : generateUniqueSlug(pkgData.title || `tour-${Date.now()}`, id, existing);

      targetPkg = normalizePackage({
        ...pkgData,
        id,
        slug: uniqueSlug
      });
      existing.unshift(targetPkg);
    } else {
      const index = existing.findIndex(p => p.id === pkgData.id);
      const uniqueSlug = pkgData.slug
        ? generateUniqueSlug(pkgData.slug, pkgData.id!, existing)
        : (index !== -1 && existing[index].slug ? existing[index].slug : generateUniqueSlug(pkgData.title || '', pkgData.id!, existing));

      if (index === -1) {
        targetPkg = normalizePackage({ ...pkgData, slug: uniqueSlug });
        existing.unshift(targetPkg);
      } else {
        existing[index] = normalizePackage({ ...existing[index], ...pkgData, slug: uniqueSlug });
        targetPkg = existing[index];
      }
    }

    // Auto-convert any base64 DataURLs to permanent /uploads/ files
    if (targetPkg.coverImage && targetPkg.coverImage.startsWith('data:image/')) {
      targetPkg.coverImage = await uploadBase64IfAny(targetPkg.coverImage, 'cover');
    }
    if (Array.isArray(targetPkg.galleryImages) && targetPkg.galleryImages.length > 0) {
      const cleanGallery: string[] = [];
      for (let i = 0; i < targetPkg.galleryImages.length; i++) {
        const img = targetPkg.galleryImages[i];
        if (typeof img === 'string' && img.startsWith('data:image/')) {
          const uploadedUrl = await uploadBase64IfAny(img, `gallery_${i + 1}`);
          cleanGallery.push(uploadedUrl);
        } else if (img) {
          cleanGallery.push(img);
        }
      }
      targetPkg.galleryImages = cleanGallery;
    }

    // A. Save to Supabase (Upsert with resolution=merge-duplicates)
    let supabaseSuccess = false;
    let supabaseErrorMsg = '';

    try {
      const executeSupabaseUpsert = async (pkgToSave: TourPackage) => {
        return await fetch(`${SUPABASE_CONFIG.restUrl}/packages`, {
          method: 'POST',
          headers: {
            ...getSupabaseHeaders(),
            'Prefer': 'resolution=merge-duplicates,return=representation'
          },
          body: JSON.stringify(pkgToSave)
        });
      };

      let sbRes = await executeSupabaseUpsert(targetPkg);

      // If 409 conflict (e.g. duplicate key on slug), append unique suffix and retry
      if (sbRes.status === 409) {
        const errorText = await sbRes.text();
        if (errorText.includes('slug') || errorText.includes('duplicate')) {
          targetPkg.slug = `${targetPkg.slug}-${Date.now().toString().slice(-4)}`;
          sbRes = await executeSupabaseUpsert(targetPkg);
        }
      }

      if (sbRes.ok || sbRes.status === 200 || sbRes.status === 201) {
        supabaseSuccess = true;
      } else {
        const errText = await sbRes.text();
        supabaseErrorMsg = `Supabase HTTP ${sbRes.status}: ${errText}`;
        console.warn('Supabase save error:', supabaseErrorMsg);
      }
    } catch (sbErr: any) {
      supabaseErrorMsg = sbErr.message || 'Supabase connection failed';
      console.warn('Supabase network notice:', sbErr);
    }

    // B. Save to Server Node filesystem (/data/packages.json)
    try {
      if (isNew) {
        await fetch('/api/packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(targetPkg)
        });
      } else {
        await fetch(`/api/packages/${encodeURIComponent(targetPkg.id)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(targetPkg)
        });
      }
    } catch (srvErr) {
      console.debug('Server sync notice:', srvErr);
    }

    // C. Always save to LocalStorage safely (never throws QuotaExceededError)
    safeSetLocalStorage(LOCAL_STORAGE_KEY, JSON.stringify(existing));

    if (!supabaseSuccess && supabaseErrorMsg) {
      return {
        success: false,
        package: targetPkg,
        error: `Supabase error: ${supabaseErrorMsg}. Please check Supabase table & policies.`
      };
    }

    return { success: true, package: targetPkg };
  } catch (err: any) {
    return { success: false, package: pkgData as TourPackage, error: err.message };
  }
}

// 3. DELETE PACKAGE (Deletes from Supabase, Server, and LocalStorage)
export async function deleteTourPackage(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    let supabaseSuccess = false;
    let supabaseErrorMsg = '';

    // A. Delete directly from Supabase
    try {
      const sbRes = await fetch(`${SUPABASE_CONFIG.restUrl}/packages?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getSupabaseHeaders()
      });
      if (sbRes.ok || sbRes.status === 200 || sbRes.status === 204) {
        supabaseSuccess = true;
      } else {
        const errText = await sbRes.text();
        supabaseErrorMsg = `Supabase status ${sbRes.status}: ${errText}`;
        console.warn('Supabase delete error:', supabaseErrorMsg);
      }
    } catch (sbErr: any) {
      supabaseErrorMsg = sbErr.message;
      console.warn('Supabase delete exception:', sbErr);
    }

    // B. Delete from Server
    try {
      await fetch(`/api/packages/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (srvErr) {
      console.debug('Server delete notice:', srvErr);
    }

    // C. Update LocalStorage safely
    try {
      const localRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localRaw) {
        const current = JSON.parse(localRaw);
        if (Array.isArray(current)) {
          const filtered = current.filter((p: any) => p.id !== id);
          safeSetLocalStorage(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
        }
      }
    } catch (e) {}

    if (!supabaseSuccess && supabaseErrorMsg) {
      return { success: false, error: `Supabase delete failed: ${supabaseErrorMsg}` };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete package' };
  }
}

// Helper: Push all current packages to Supabase
export async function syncAllPackagesToSupabase(pkgs: TourPackage[]): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    // Ensure all packages have valid IDs and unique slugs
    const cleanedPkgs: TourPackage[] = [];
    for (const p of pkgs) {
      const uniqueSlug = generateUniqueSlug(p.slug || p.title, p.id, cleanedPkgs);
      cleanedPkgs.push(normalizePackage({ ...p, slug: uniqueSlug }));
    }

    const res = await fetch(`${SUPABASE_CONFIG.restUrl}/packages`, {
      method: 'POST',
      headers: {
        ...getSupabaseHeaders(),
        'Prefer': 'resolution=merge-duplicates,return=representation'
      },
      body: JSON.stringify(cleanedPkgs)
    });

    if (res.ok || res.status === 200 || res.status === 201) {
      return { success: true, count: cleanedPkgs.length };
    } else {
      const errText = await res.text();
      return { success: false, count: 0, error: `Supabase status ${res.status}: ${errText}` };
    }
  } catch (err: any) {
    return { success: false, count: 0, error: err.message };
  }
}

// Compress and resize image client-side to prevent payload-too-large or quota errors
export async function compressAndResizeImage(
  file: File,
  maxWidth = 1280,
  maxHeight = 800,
  quality = 0.78
): Promise<string> {
  return new Promise((resolve) => {
    // If not an image, or if SVG/GIF, read directly as data URL
    if (!file.type.startsWith('image/') || file.type.includes('svg') || file.type.includes('gif')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Use JPEG for best compression unless original is PNG with transparency
        const format = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(format, quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        resolve(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

// 4. IMAGE UPLOAD HELPER (Compresses, saves to /uploads via server, falls back to compressed dataURL)
export async function uploadImageFile(file: File): Promise<string> {
  try {
    const compressedDataUrl = await compressAndResizeImage(file);
    if (!compressedDataUrl) {
      throw new Error('Failed to process image');
    }

    // Try uploading to server /api/upload to get a static URL
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: compressedDataUrl,
          filename: file.name || `photo_${Date.now()}.jpg`
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.url) {
          return json.url;
        }
      }
    } catch (err) {
      console.debug('Server upload notice, using compressed DataURL:', err);
    }

    return compressedDataUrl;
  } catch (err: any) {
    throw new Error(err.message || 'Image upload failed');
  }
}

export async function getUploadedPhotosList(): Promise<{ filename: string; url: string; time: number }[]> {
  try {
    const res = await fetch('/api/uploads');
    if (res.ok) {
      const list = await res.json();
      if (Array.isArray(list)) return list;
    }
  } catch (e) {
    console.debug('Failed to fetch uploaded photos:', e);
  }
  return [];
}

export async function deleteUploadedPhoto(filename: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/uploads/${encodeURIComponent(filename)}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}

// 5. INQUIRIES MANAGEMENT
export async function getStoredInquiries(): Promise<BookingInquiry[]> {
  try {
    const res = await fetch('/api/inquiries');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (e) {}

  try {
    const raw = localStorage.getItem(LOCAL_INQUIRIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  return [];
}

export async function saveBookingInquiry(inquiry: Partial<BookingInquiry>): Promise<boolean> {
  const newInq: BookingInquiry = {
    id: `inq-${Date.now()}`,
    packageName: inquiry.packageName || 'General Inquiry',
    customerName: inquiry.customerName || 'Pilgrim',
    phone: inquiry.phone || 'WhatsApp Inquiry',
    email: inquiry.email,
    travelDate: inquiry.travelDate || '',
    numberOfPersons: inquiry.numberOfPersons || 2,
    pickupLocation: inquiry.pickupLocation || 'Indore / Ujjain',
    specialRequests: inquiry.specialRequests,
    status: 'new',
    createdAt: new Date().toISOString()
  };

  // LocalStorage
  try {
    const inqs = await getStoredInquiries();
    inqs.unshift(newInq);
    safeSetLocalStorage(LOCAL_INQUIRIES_KEY, JSON.stringify(inqs));
  } catch (e) {}

  // Server
  try {
    await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInq)
    });
  } catch (e) {}

  // Supabase
  try {
    await fetch(`${SUPABASE_CONFIG.restUrl}/inquiries`, {
      method: 'POST',
      headers: getSupabaseHeaders(),
      body: JSON.stringify(newInq)
    });
  } catch (e) {}

  return true;
}

// 5. AGENCY & HERO SETTINGS (Home Hero Banner & Office Branches)
export const DEFAULT_AGENCY_SETTINGS: AgencySettings = {
  homeHero: {
    coverImage: '/hero/slide1.jpg',
    heading: 'Indore & Ujjain Darshan & Tour Packages',
    subheading: 'Experience divine spiritual bliss across Madhya Pradesh’s revered Jyotirlingas: Shree Mahakaleshwar Bhasma Aarti (Ujjain) and Holy Omkareshwar (Narmada Island), together with Queen Ahilyabai’s sacred Maheshwar Ahilya Fort and Indore Heritage. Complete packages with sanitized cabs, deluxe hotels, and pure vegetarian dining.',
    slides: HERO_SLIDES
  },
  ujjainOffice: {
    title: 'Ujjain Pilgrimage Branch (Nanakheda Hub)',
    address: 'A-5/15 Mahakal Vanijya Kendra, Nanakheda, Ujjain, Madhya Pradesh 456010',
    contactPerson: 'Branch Manager / Mahakal Darshan Desk',
    phone: '7999 353 101',
    timing: '24x7 Available for Mahakal Bhasma Aarti & Darshan',
    landmark: 'Near Nanakheda Bus Stand, Ujjain',
    mapUrl: 'https://maps.google.com/?q=Mahakal+Vanijya+Kendra+Nanakheda+Ujjain'
  },
  indoreOffice: {
    title: 'Indore Head Branch (Airport & Station Hub)',
    address: '220, Surya Appartment Usha Nagar, Near Ranjeet Hanuman Mandir Indore',
    contactPerson: 'Operations Head / Fleet Incharge',
    phone: '7999 353 101',
    timing: '06:00 AM to 11:30 PM (All 7 Days Open)',
    landmark: 'Near Ranjeet Hanuman Mandir, Usha Nagar, Indore',
    mapUrl: 'https://maps.google.com/?q=Ranjeet+Hanuman+Mandir+Indore'
  }
};

export async function getAgencySettings(): Promise<AgencySettings> {
  // 1. Try server API
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      if (data && (data.ujjainOffice || data.homeHero)) {
        const merged: AgencySettings = {
          ...DEFAULT_AGENCY_SETTINGS,
          ...data,
          homeHero: {
            ...DEFAULT_AGENCY_SETTINGS.homeHero,
            ...(data.homeHero || {})
          }
        };
        safeSetLocalStorage(LOCAL_SETTINGS_KEY, JSON.stringify(merged));
        return merged;
      }
    }
  } catch (err) {
    console.debug('Settings API notice:', err);
  }

  // 2. Try localStorage
  try {
    const local = localStorage.getItem(LOCAL_SETTINGS_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      return {
        ...DEFAULT_AGENCY_SETTINGS,
        ...parsed,
        homeHero: {
          ...DEFAULT_AGENCY_SETTINGS.homeHero,
          ...(parsed.homeHero || {})
        }
      };
    }
  } catch (e) {}

  return DEFAULT_AGENCY_SETTINGS;
}

export async function saveAgencySettings(settings: AgencySettings): Promise<boolean> {
  // Save local
  try {
    safeSetLocalStorage(LOCAL_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {}

  // Save server
  try {
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
  } catch (e) {
    console.debug('Server save settings notice:', e);
  }

  return true;
}
