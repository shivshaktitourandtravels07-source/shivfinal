import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, Image as ImageIcon, CheckCircle, AlertCircle, Save, X, Phone, Calendar, Users, Eye, RefreshCw, Lock, KeyRound, Download, LogOut, ShieldCheck, FileSpreadsheet, MapPin, Building2, Navigation, Database, Copy, Check, ExternalLink, Sparkles, CheckCheck, CopyPlus, Link, Clock, Star, AlertTriangle, ArrowLeft, ArrowRight, ImagePlus, Maximize2 } from 'lucide-react';
import { TourPackage, BookingInquiry, AgencySettings, HeroSlide, ItineraryDay } from '../types';
import { getStoredPackages, saveTourPackage, deleteTourPackage, uploadImageFile, syncAllPackagesToSupabase, SUPABASE_CONFIG, SUPABASE_SETUP_SQL, getAgencySettings, saveAgencySettings, DEFAULT_AGENCY_SETTINGS, generateUniqueSlug, getUploadedPhotosList, deleteUploadedPhoto, clearAllLocalStorageCache, cleanupOversizedLocalStorage } from '../services/packageStorage';
import { HERO_SLIDES } from '../data/packagesData';

// Verified sacred destination image presets for 1-click package and cover assignment
const SACRED_IMAGE_PRESETS = [
  { title: 'Mahakaleshwar Jyotirlinga, Ujjain', subtitle: 'Sacred Bhasma Aarti & Darshan', url: '/hero/slide1.jpg' },
  { title: 'Holy Omkareshwar Jyotirlinga', subtitle: 'Narmada Island & Mamleshwar', url: '/hero/slide2.jpg' },
  { title: 'Royal Maheshwar Ahilya Fort', subtitle: 'Ahilya Ghat & Narmada River', url: '/hero/slide3.jpg' },
  { title: 'Historic Rajwada Palace, Indore', subtitle: 'Heritage & 56 Dukan Street Food', url: '/hero/slide4.jpg' },
  { title: 'Mandu Jahaz Mahal', subtitle: 'Rani Roopmati & Historic Monuments', url: '/hero/slide5.jpg' },
  { title: 'Mahakal Lok Corridor, Ujjain', subtitle: 'Illuminated Night Walkway', url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Kaal Bhairav Mandir, Ujjain', subtitle: 'Sacred Kotwal of Avantika', url: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Shipra Ram Ghat Evening Aarti', subtitle: 'Maha Aarti & Deep Daan', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Harsiddhi Mata Shaktipeeth', subtitle: 'Twin Lamp Deepstambha Pillars', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Narmada Ghat Holy Snan', subtitle: 'Sacred River Pilgrimage', url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80' }
];

interface AdminPanelProps {
  packages: TourPackage[];
  onRefreshPackages: () => Promise<TourPackage[]> | void;
  navigate: (path: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  packages,
  onRefreshPackages,
  navigate
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('sst_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Tab State: packages | cover_banner | supabase | inquiries | uploads | addresses
  const [activeTab, setActiveTab] = useState<'packages' | 'cover_banner' | 'supabase' | 'inquiries' | 'uploads' | 'addresses'>('packages');
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [savingPackage, setSavingPackage] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<TourPackage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [inquiries, setInquiries] = useState<BookingInquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [heroUploadLoading, setHeroUploadLoading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [supabaseStatus, setSupabaseStatus] = useState<'testing' | 'connected' | 'table_missing' | 'error'>('testing');
  const [copiedSql, setCopiedSql] = useState(false);
  const [syncingAll, setSyncingAll] = useState(false);

  // Media & Photo Manager States
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);
  const [editImageUrlInput, setEditImageUrlInput] = useState('');
  const [replaceImageLoading, setReplaceImageLoading] = useState(false);
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);
  const [serverUploads, setServerUploads] = useState<{ filename: string; url: string; time: number }[]>([]);
  const [loadingServerUploads, setLoadingServerUploads] = useState(false);
  const [mediaTabUploadLoading, setMediaTabUploadLoading] = useState(false);
  const [showBulkUrlModal, setShowBulkUrlModal] = useState(false);
  const [bulkUrlsInput, setBulkUrlsInput] = useState('');
  const [isDragOverUpload, setIsDragOverUpload] = useState(false);

  // Agency & Home Hero Banner Settings State
  const [addressSettings, setAddressSettings] = useState<AgencySettings>(DEFAULT_AGENCY_SETTINGS);
  const [savingAddresses, setSavingAddresses] = useState(false);
  const [savingHomeHero, setSavingHomeHero] = useState(false);
  const [customHomeHeroUrl, setCustomHomeHeroUrl] = useState('');

  // Form state for creating or editing package
  const [formData, setFormData] = useState<Partial<TourPackage>>({
    title: '',
    slug: '',
    tagline: '',
    duration: '2 Days / 1 Night',
    daysCount: 2,
    nightsCount: 1,
    pricePerPerson: 6499,
    originalPrice: 7999,
    badge: 'Popular Tour',
    coverImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [],
    overview: '',
    highlights: [],
    inclusions: [],
    exclusions: [],
    itinerary: []
  });

  const [highlightsText, setHighlightsText] = useState('');
  const [inclusionsText, setInclusionsText] = useState('');
  const [exclusionsText, setExclusionsText] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Check Supabase connection
  const checkSupabase = async () => {
    setSupabaseStatus('testing');
    try {
      const res = await fetch(`${SUPABASE_CONFIG.restUrl}/packages?select=id&limit=1`, {
        headers: {
          'apikey': SUPABASE_CONFIG.anonKey,
          'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
        }
      });

      if (res.ok) {
        setSupabaseStatus('connected');
      } else if (res.status === 404 || res.status === 400) {
        setSupabaseStatus('table_missing');
      } else {
        setSupabaseStatus('error');
      }
    } catch {
      setSupabaseStatus('error');
    }
  };

  const loadServerUploads = async () => {
    setLoadingServerUploads(true);
    try {
      const list = await getUploadedPhotosList();
      setServerUploads(list);
    } catch {
      // quiet fallback
    } finally {
      setLoadingServerUploads(false);
    }
  };

  const handleClearStorageCache = () => {
    clearAllLocalStorageCache();
    showNotification('success', 'Browser storage cache cleared & quota freed! Re-fetching packages...');
    onRefreshPackages();
  };

  useEffect(() => {
    cleanupOversizedLocalStorage();
    if (isAuthenticated) {
      checkSupabase();
      loadServerUploads();
    }
  }, [isAuthenticated]);

  // Handle Admin Login with password "Shubham@123"
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('sst_admin_auth', 'true');
        sessionStorage.setItem('sst_admin_token', data.token);
        setPasswordInput('');
      } else if (passwordInput === 'Shubham@123') {
        // Fallback local password verification
        setIsAuthenticated(true);
        sessionStorage.setItem('sst_admin_auth', 'true');
        setPasswordInput('');
      } else {
        setLoginError(data.error || 'Invalid password. Please enter authorized admin key.');
      }
    } catch {
      if (passwordInput === 'Shubham@123') {
        setIsAuthenticated(true);
        sessionStorage.setItem('sst_admin_auth', 'true');
        setPasswordInput('');
      } else {
        setLoginError('Invalid password. Please enter authorized admin key.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('sst_admin_auth');
    sessionStorage.removeItem('sst_admin_token');
  };

  // Fetch inquiries
  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error('Inquiries fetch error:', err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  // Fetch agency settings (Office addresses + Home Hero banner)
  const fetchAddressSettings = async () => {
    try {
      const data = await getAgencySettings();
      if (data) {
        setAddressSettings(data);
        if (data.homeHero?.coverImage) {
          setCustomHomeHeroUrl(data.homeHero.coverImage);
        }
      }
    } catch (err) {
      console.error('Settings fetch notice:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddressSettings();
      if (activeTab === 'inquiries') {
        fetchInquiries();
      }
    }
  }, [isAuthenticated, activeTab]);

  const handleSaveAddresses = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddresses(true);
    try {
      const success = await saveAgencySettings(addressSettings);
      if (success) {
        showNotification('success', 'Branch office addresses saved successfully! They are now live on the website.');
      } else {
        showNotification('error', 'Failed to save addresses');
      }
    } catch (err: any) {
      showNotification('error', 'Network error: ' + err.message);
    } finally {
      setSavingAddresses(false);
    }
  };

  // Home Page Cover Image & Banner Handlers
  const handleSaveHomeHero = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingHomeHero(true);
    try {
      const success = await saveAgencySettings(addressSettings);
      if (success) {
        showNotification('success', 'Home Page Cover Image & Banner updated! Changes are now live on the homepage.');
      } else {
        showNotification('error', 'Failed to save Home Page Cover Image.');
      }
    } catch (err: any) {
      showNotification('error', 'Network error: ' + err.message);
    } finally {
      setSavingHomeHero(false);
    }
  };

  const handleSetGlobalHomeCover = async (imgUrl: string) => {
    if (!imgUrl) return;
    const updated: AgencySettings = {
      ...addressSettings,
      homeHero: {
        ...(addressSettings.homeHero || DEFAULT_AGENCY_SETTINGS.homeHero!),
        coverImage: imgUrl
      }
    };
    setAddressSettings(updated);
    setCustomHomeHeroUrl(imgUrl);
    await saveAgencySettings(updated);
    showNotification('success', 'Home Page Cover Image updated! This photo is now live on the homepage.');
  };

  const handleHeroCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroUploadLoading(true);
    try {
      const url = await uploadImageFile(file);
      await handleSetGlobalHomeCover(url);
    } catch (err: any) {
      showNotification('error', 'Upload error: ' + err.message);
    } finally {
      setHeroUploadLoading(false);
      e.target.value = '';
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleStartCreate = () => {
    setIsCreatingNew(true);
    setEditingPackage(null);
    const newId = `pkg-${Date.now()}`;
    setFormData({
      id: newId,
      title: '',
      slug: '',
      tagline: '',
      duration: '2 Days / 1 Night',
      daysCount: 2,
      nightsCount: 1,
      pricePerPerson: 6499,
      originalPrice: 7999,
      badge: 'New Pilgrimage Tour',
      featured: false,
      suitableFor: 'Family, Senior Citizens & Groups',
      coverImage: '/hero/slide1.jpg',
      galleryImages: ['/hero/slide1.jpg'],
      overview: '',
      highlights: [
        'VIP Darshan at Shree Mahakaleshwar Jyotirlinga',
        'Dedicated sanitized cab for all sightseeing & transfers',
        'Super Deluxe hotel accommodation with modern amenities',
        '100% Pure vegetarian breakfast, lunch and dinner included'
      ],
      inclusions: [
        'Dedicated sanitized cab with fuel and driver allowances',
        'Super Deluxe hotel stay',
        'All meals: Breakfast, Lunch, Dinner',
        'VIP Darshan facilitation at temples',
        'All toll taxes and parking'
      ],
      exclusions: [
        'Train or flight tickets to Indore/Ujjain',
        'Bhasma Aarti booking fee',
        'Personal shopping and laundry'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Day 1: Holy Ujjain Darshan',
          subtitle: 'Mahakaleshwar & Shipra Ram Ghat Aarti',
          places: ['Mahakal Mandir', 'Kaal Bhairav', 'Ram Ghat Aarti'],
          description: 'Arrival and check-in. Head for VIP Mahakal Darshan, explore Kaal Bhairav and attend evening Shipra Aarti.',
          mealsIncluded: 'Lunch, Dinner',
          stayLocation: 'Super Deluxe Hotel, Ujjain'
        }
      ],
      cancellationPolicy: 'Full refund if cancelled 72 hours before journey start date.'
    });
    setHighlightsText('VIP Darshan at Shree Mahakaleshwar Jyotirlinga\nDedicated sanitized cab for all sightseeing & transfers\nSuper Deluxe hotel accommodation with modern amenities\n100% Pure vegetarian breakfast, lunch and dinner included');
    setInclusionsText('Dedicated sanitized cab with fuel and driver allowances\nSuper Deluxe hotel stay\nAll meals: Breakfast, Lunch, Dinner\nVIP Darshan facilitation at temples\nAll toll taxes and parking');
    setExclusionsText('Train or flight tickets to Indore/Ujjain\nBhasma Aarti booking fee\nPersonal shopping and laundry');
  };

  const handleStartEdit = (pkg: TourPackage) => {
    setEditingPackage(pkg);
    setIsCreatingNew(false);
    const gallery = pkg.galleryImages || [];
    let cover = pkg.coverImage;
    if (!cover || cover.includes('photo-1548013146-72479768bada')) {
      cover = gallery[0] || '/hero/slide1.jpg';
    }
    setFormData({
      ...pkg,
      coverImage: cover,
      galleryImages: gallery,
      itinerary: Array.isArray(pkg.itinerary) ? [...pkg.itinerary] : []
    });
    setHighlightsText(pkg.highlights?.join('\n') || '');
    setInclusionsText(pkg.inclusions?.join('\n') || '');
    setExclusionsText(pkg.exclusions?.join('\n') || '');
  };

  const handleClonePackage = (pkg: TourPackage) => {
    setIsCreatingNew(true);
    setEditingPackage(null);
    const newId = `pkg-${Date.now()}`;
    const newSlug = generateUniqueSlug(`${pkg.title}-copy`, newId, packages);
    setFormData({
      ...pkg,
      id: newId,
      title: `${pkg.title} (Clone)`,
      slug: newSlug,
      itinerary: pkg.itinerary ? JSON.parse(JSON.stringify(pkg.itinerary)) : []
    });
    setHighlightsText(pkg.highlights?.join('\n') || '');
    setInclusionsText(pkg.inclusions?.join('\n') || '');
    setExclusionsText(pkg.exclusions?.join('\n') || '');
    showNotification('success', `Created draft duplicate of "${pkg.title}". Edit details and click Save!`);
  };

  const handleCancelForm = () => {
    setEditingPackage(null);
    setIsCreatingNew(false);
  };

  // Itinerary Helpers
  const handleAddItineraryDay = () => {
    setFormData(prev => {
      const current = prev.itinerary || [];
      const newDayNum = current.length + 1;
      return {
        ...prev,
        itinerary: [
          ...current,
          {
            day: newDayNum,
            title: `Day ${newDayNum}: Sightseeing`,
            subtitle: 'Temple Darshan & Heritage Excursion',
            places: ['Mahakal Lok / Local Sightseeing'],
            description: 'Visit sacred shrines, local exploration, and comfortable stay.',
            mealsIncluded: 'Breakfast, Dinner',
            stayLocation: 'Super Deluxe Hotel'
          }
        ]
      };
    });
  };

  const handleUpdateItineraryDay = (index: number, updatedDay: Partial<ItineraryDay>) => {
    setFormData(prev => {
      const current = [...(prev.itinerary || [])];
      if (current[index]) {
        current[index] = { ...current[index], ...updatedDay };
      }
      return { ...prev, itinerary: current };
    });
  };

  const handleRemoveItineraryDay = (index: number) => {
    setFormData(prev => {
      const filtered = (prev.itinerary || []).filter((_, idx) => idx !== index);
      const reindexed = filtered.map((d, idx) => ({ ...d, day: idx + 1 }));
      return { ...prev, itinerary: reindexed };
    });
  };

  // Image helpers for unlimited gallery images
  const handleAddCustomImageUrl = () => {
    if (!customImageUrl.trim()) return;
    const url = customImageUrl.trim();
    setFormData(prev => {
      const existing = prev.galleryImages || [];
      const updatedGallery = existing.includes(url) ? existing : [...existing, url];
      const isDefaultCover = !prev.coverImage || prev.coverImage.includes('photo-1548013146-72479768bada');
      return {
        ...prev,
        coverImage: isDefaultCover ? url : prev.coverImage,
        galleryImages: updatedGallery
      };
    });
    setCustomImageUrl('');
    showNotification('success', 'Image added to gallery!');
  };

  const handleMultipleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadLoading(true);
    try {
      const fileList = Array.from(files) as File[];
      const urls: string[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const u = await uploadImageFile(fileList[i]);
        urls.push(u);
      }

      setFormData(prev => {
        const existing = prev.galleryImages || [];
        const isDefaultCover = !prev.coverImage || prev.coverImage.includes('photo-1548013146-72479768bada');
        return {
          ...prev,
          coverImage: isDefaultCover ? urls[0] : prev.coverImage,
          galleryImages: [...existing, ...urls]
        };
      });

      setUploadedPhotos(prev => [...urls, ...prev]);
      loadServerUploads();
      showNotification('success', `${urls.length} image(s) processed & added to package!`);
    } catch (err: any) {
      showNotification('error', 'Error uploading images: ' + err.message);
    } finally {
      setUploadLoading(false);
      e.target.value = '';
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setFormData(prev => {
      const current = prev.galleryImages || [];
      const removedUrl = current[indexToRemove];
      const updated = current.filter((_, idx) => idx !== indexToRemove);
      let newCover = prev.coverImage;
      if (prev.coverImage === removedUrl) {
        newCover = updated[0] || '/hero/slide1.jpg';
      }
      return {
        ...prev,
        coverImage: newCover,
        galleryImages: updated
      };
    });
    showNotification('success', 'Image removed from gallery.');
  };

  const handleClearAllGalleryImages = () => {
    setFormData(prev => ({
      ...prev,
      galleryImages: [],
      coverImage: '/hero/slide1.jpg'
    }));
    showNotification('success', 'All gallery photos cleared.');
  };

  const handleSetCoverImage = (imgUrl: string) => {
    setFormData(prev => ({
      ...prev,
      coverImage: imgUrl,
      galleryImages: prev.galleryImages?.includes(imgUrl) ? prev.galleryImages : [imgUrl, ...(prev.galleryImages || [])]
    }));
    showNotification('success', 'Primary cover photo updated! This photo will appear on the Home Page and Package listings.');
  };

  // Open edit modal for a specific gallery photo
  const handleStartEditGalleryImage = (index: number) => {
    const current = formData.galleryImages || [];
    if (current[index]) {
      setEditingImageIndex(index);
      setEditImageUrlInput(current[index]);
    }
  };

  // Save edited URL for a specific gallery photo
  const handleSaveEditGalleryImage = () => {
    if (editingImageIndex === null) return;
    if (!editImageUrlInput.trim()) {
      showNotification('error', 'Please enter a valid image URL');
      return;
    }
    const cleanUrl = editImageUrlInput.trim();
    setFormData(prev => {
      const current = [...(prev.galleryImages || [])];
      const oldUrl = current[editingImageIndex];
      current[editingImageIndex] = cleanUrl;
      const updatedCover = prev.coverImage === oldUrl ? cleanUrl : prev.coverImage;
      return {
        ...prev,
        coverImage: updatedCover,
        galleryImages: current
      };
    });
    setEditingImageIndex(null);
    setEditImageUrlInput('');
    showNotification('success', 'Photo updated successfully!');
  };

  // Replace a specific gallery image by uploading a new file
  const handleReplaceGalleryImageFile = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReplaceImageLoading(true);
    try {
      const newUrl = await uploadImageFile(file);
      setFormData(prev => {
        const current = [...(prev.galleryImages || [])];
        const oldUrl = current[index];
        current[index] = newUrl;
        const updatedCover = prev.coverImage === oldUrl ? newUrl : prev.coverImage;
        return {
          ...prev,
          coverImage: updatedCover,
          galleryImages: current
        };
      });
      setEditingImageIndex(null);
      setEditImageUrlInput('');
      loadServerUploads();
      showNotification('success', 'Photo replaced with uploaded file!');
    } catch (err: any) {
      showNotification('error', 'Failed to replace photo: ' + err.message);
    } finally {
      setReplaceImageLoading(false);
      e.target.value = '';
    }
  };

  // Move gallery image left or right to reorder
  const handleMoveGalleryImage = (index: number, direction: 'left' | 'right') => {
    setFormData(prev => {
      const current = [...(prev.galleryImages || [])];
      const targetIndex = direction === 'left' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= current.length) return prev;
      const temp = current[index];
      current[index] = current[targetIndex];
      current[targetIndex] = temp;
      return { ...prev, galleryImages: current };
    });
  };

  // Upload and set primary cover directly from file
  const handleCoverPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadLoading(true);
    try {
      const url = await uploadImageFile(file);
      setFormData(prev => ({
        ...prev,
        coverImage: url,
        galleryImages: prev.galleryImages?.includes(url) ? prev.galleryImages : [url, ...(prev.galleryImages || [])]
      }));
      loadServerUploads();
      showNotification('success', 'Primary cover photo uploaded and set!');
    } catch (err: any) {
      showNotification('error', 'Error uploading cover photo: ' + err.message);
    } finally {
      setUploadLoading(false);
      e.target.value = '';
    }
  };

  // 1-Click Add Preset Photo
  const handleAddPresetImage = (url: string) => {
    setFormData(prev => {
      const existing = prev.galleryImages || [];
      if (existing.includes(url)) {
        showNotification('success', 'Photo is already in gallery!');
        return prev;
      }
      const isDefaultCover = !prev.coverImage || prev.coverImage.includes('photo-1548013146-72479768bada');
      return {
        ...prev,
        coverImage: isDefaultCover ? url : prev.coverImage,
        galleryImages: [...existing, url]
      };
    });
    showNotification('success', 'Preset photo added to package!');
  };

  // Add all 10 sacred destination presets in 1 click
  const handleAddAllPresets = () => {
    setFormData(prev => {
      const existing = prev.galleryImages || [];
      const newUrls = SACRED_IMAGE_PRESETS.map(p => p.url).filter(url => !existing.includes(url));
      if (newUrls.length === 0) {
        showNotification('success', 'All sacred presets are already added to this package!');
        return prev;
      }
      const updatedGallery = [...existing, ...newUrls];
      const isDefaultCover = !prev.coverImage || prev.coverImage.includes('photo-1548013146-72479768bada');
      return {
        ...prev,
        coverImage: isDefaultCover ? updatedGallery[0] : prev.coverImage,
        galleryImages: updatedGallery
      };
    });
    showNotification('success', 'Added all sacred destination photos to package gallery!');
  };

  // Bulk add multiple URLs at once (paste 10, 20, 50 URLs at once!)
  const handleBulkAddUrls = () => {
    if (!bulkUrlsInput.trim()) return;
    const lines = bulkUrlsInput
      .split(/[\n,]+/)
      .map(s => s.trim())
      .filter(Boolean);

    if (lines.length === 0) return;

    setFormData(prev => {
      const existing = prev.galleryImages || [];
      const newUrls = lines.filter(url => !existing.includes(url));
      const updatedGallery = [...existing, ...newUrls];
      const isDefaultCover = !prev.coverImage || prev.coverImage.includes('photo-1548013146-72479768bada');
      return {
        ...prev,
        coverImage: isDefaultCover ? (updatedGallery[0] || prev.coverImage) : prev.coverImage,
        galleryImages: updatedGallery
      };
    });

    showNotification('success', `Added ${lines.length} photos to package gallery!`);
    setBulkUrlsInput('');
    setShowBulkUrlModal(false);
  };

  // Drag and drop handler for upload box
  const handleDropFiles = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOverUpload(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    setUploadLoading(true);
    try {
      const fileList = Array.from(files) as File[];
      const urls: string[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const u = await uploadImageFile(fileList[i]);
        urls.push(u);
      }

      setFormData(prev => {
        const existing = prev.galleryImages || [];
        const isDefaultCover = !prev.coverImage || prev.coverImage.includes('photo-1548013146-72479768bada');
        return {
          ...prev,
          coverImage: isDefaultCover ? urls[0] : prev.coverImage,
          galleryImages: [...existing, ...urls]
        };
      });

      setUploadedPhotos(prev => [...urls, ...prev]);
      loadServerUploads();
      showNotification('success', `${urls.length} image(s) processed & added to package!`);
    } catch (err: any) {
      showNotification('error', 'Error uploading images: ' + err.message);
    } finally {
      setUploadLoading(false);
    }
  };

  // Delete uploaded photo from server storage
  const handleDeleteServerUpload = async (filename: string) => {
    try {
      const ok = await deleteUploadedPhoto(filename);
      if (ok) {
        showNotification('success', 'Photo removed from server library.');
        loadServerUploads();
      } else {
        showNotification('error', 'Failed to delete photo.');
      }
    } catch (e: any) {
      showNotification('error', 'Error deleting photo: ' + e.message);
    }
  };

  // Direct upload for Media & Photos tab
  const handleMediaTabDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setMediaTabUploadLoading(true);
    try {
      const fileList = Array.from(files) as File[];
      for (const file of fileList) {
        await uploadImageFile(file);
      }
      await loadServerUploads();
      showNotification('success', `${fileList.length} photo(s) uploaded to media library!`);
    } catch (err: any) {
      showNotification('error', 'Upload error: ' + err.message);
    } finally {
      setMediaTabUploadLoading(false);
      e.target.value = '';
    }
  };

  // Save Package (Works directly with Supabase, Server & LocalStorage!)
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      showNotification('error', 'Package title is required.');
      return;
    }

    if (!formData.pricePerPerson || Number(formData.pricePerPerson) <= 0) {
      showNotification('error', 'Please enter a valid price per person.');
      return;
    }

    setSavingPackage(true);

    const preparedHighlights = highlightsText.split('\n').map(s => s.trim()).filter(Boolean);
    const preparedInclusions = inclusionsText.split('\n').map(s => s.trim()).filter(Boolean);
    const preparedExclusions = exclusionsText.split('\n').map(s => s.trim()).filter(Boolean);

    // Ensure cover image is valid
    let finalCover = (formData.coverImage || '').trim();
    if (!finalCover) {
      if (formData.galleryImages && formData.galleryImages.length > 0) {
        finalCover = formData.galleryImages[0];
      } else {
        finalCover = '/hero/slide1.jpg';
      }
    }

    // Ensure gallery images array is clean
    const cleanGallery = Array.isArray(formData.galleryImages)
      ? formData.galleryImages.filter(Boolean)
      : [];
    if (finalCover && !cleanGallery.includes(finalCover) && cleanGallery.length > 0) {
      cleanGallery.unshift(finalCover);
    }

    // Auto-generate or sanitize slug
    const finalSlug = formData.slug?.trim()
      ? generateUniqueSlug(formData.slug, formData.id || '', packages)
      : generateUniqueSlug(formData.title || '', formData.id || '', packages);

    const payload: Partial<TourPackage> = {
      ...formData,
      slug: finalSlug,
      coverImage: finalCover,
      galleryImages: cleanGallery,
      highlights: preparedHighlights,
      inclusions: preparedInclusions,
      exclusions: preparedExclusions,
      itinerary: formData.itinerary || []
    };

    try {
      const result = await saveTourPackage(payload, isCreatingNew);
      if (result.success) {
        showNotification('success', isCreatingNew ? 'Package created and synced to Supabase database & website!' : 'Package updated successfully in Supabase database & website!');
        handleCancelForm();
        await onRefreshPackages();
      } else {
        showNotification('error', result.error || 'Failed to save package to Supabase.');
      }
    } catch (err: any) {
      showNotification('error', 'Error saving package: ' + err.message);
    } finally {
      setSavingPackage(false);
    }
  };

  // Delete Package request (opens custom modal)
  const handleRequestDelete = (pkg: TourPackage) => {
    setPackageToDelete(pkg);
  };

  // Confirm delete package from Supabase and Server
  const handleConfirmDelete = async () => {
    if (!packageToDelete) return;
    setIsDeleting(true);
    try {
      const result = await deleteTourPackage(packageToDelete.id);
      if (result.success) {
        showNotification('success', `Package "${packageToDelete.title}" permanently deleted from Supabase & website.`);
        setPackageToDelete(null);
        await onRefreshPackages();
      } else {
        showNotification('error', result.error || 'Failed to delete package from Supabase.');
      }
    } catch (err: any) {
      showNotification('error', 'Error deleting package: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Manual refresh from Supabase
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshPackages();
      await checkSupabase();
      showNotification('success', 'Refreshed latest packages from Supabase cloud database.');
    } catch {
      showNotification('error', 'Failed to refresh packages.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Update Inquiry Status
  const handleUpdateInquiryStatus = async (id: string, status: BookingInquiry['status']) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
        showNotification('success', `Inquiry status updated to ${status}.`);
      }
    } catch {
      showNotification('error', 'Failed to update inquiry status.');
    }
  };

  // Copy Supabase SQL
  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
    showNotification('success', 'Supabase SQL copied to clipboard!');
  };

  // Sync all packages to Supabase
  const handleSyncAllToSupabase = async () => {
    setSyncingAll(true);
    try {
      const currentPkgs = await getStoredPackages();
      const res = await syncAllPackagesToSupabase(currentPkgs);
      if (res.success) {
        showNotification('success', `Successfully synced ${res.count} packages to Supabase cloud!`);
        onRefreshPackages();
      } else {
        showNotification('error', `Sync failed: ${res.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      showNotification('error', `Sync error: ${err.message}`);
    } finally {
      setSyncingAll(false);
    }
  };

  // 1. Password Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-900/5">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-amber-200/80 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto text-amber-800 shadow-xs">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Shiv Shakti Admin Portal</h2>
            <p className="text-xs text-slate-600">
              Manage tour packages, images, Supabase database, and inquiries.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Admin Master Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password..."
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-700 text-slate-900"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {loginError && (
              <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loginLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>{loginLoading ? 'Authenticating...' : 'Unlock Admin Dashboard'}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs font-semibold text-slate-500 hover:text-amber-800 transition-colors"
            >
              ← Return to Main Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Full Admin Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header Bar */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>Shiv Shakti Tour & Travels • Admin Control Panel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Tour & Database Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Add unlimited images, edit itineraries, configure Supabase sync, and manage customer inquiries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onRefreshPackages()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-all cursor-pointer"
            title="Refresh packages"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-sm font-semibold transition-all ${
          notification.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-300' : 'bg-red-50 text-red-900 border border-red-300'
        }`}>
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => { setActiveTab('packages'); handleCancelForm(); }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'packages'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Tour Packages ({packages.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('cover_banner'); handleCancelForm(); }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'cover_banner'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Home Cover & Banner</span>
        </button>

        <button
          onClick={() => { setActiveTab('uploads'); handleCancelForm(); loadServerUploads(); }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'uploads'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-amber-500" />
          <span>Photos & Media</span>
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'supabase'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Supabase Sync</span>
          <span className={`w-2 h-2 rounded-full ${supabaseStatus === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'inquiries'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Inquiries ({inquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'addresses'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Office Addresses</span>
        </button>
      </div>

      {/* TAB 1: TOUR PACKAGES & DYNAMIC EDITOR */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          {/* Action Header */}
          {!isCreatingNew && !editingPackage && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Current Tour Packages</h3>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    supabaseStatus === 'connected'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${supabaseStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span>{supabaseStatus === 'connected' ? 'Supabase Synced' : 'Local + Server Ready'}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Edit existing packages, add new ones, or upload unlimited photos.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-2.5 rounded-xl border border-slate-300 shadow-xs transition-all flex items-center gap-1.5 text-xs cursor-pointer disabled:opacity-50"
                  title="Reload fresh packages directly from Supabase"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-700' : ''}`} />
                  <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
                <button
                  onClick={handleSyncAllToSupabase}
                  disabled={syncingAll}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-2.5 rounded-xl border border-slate-300 shadow-xs transition-all flex items-center gap-1.5 text-xs cursor-pointer disabled:opacity-50"
                  title="Push all packages to Supabase cloud table"
                >
                  <Database className="w-3.5 h-3.5 text-amber-700" />
                  <span>{syncingAll ? 'Syncing...' : 'Sync All to Cloud'}</span>
                </button>
                <button
                  onClick={handleStartCreate}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Package</span>
                </button>
              </div>
            </div>
          )}

          {/* Form Modal / In-line Editor */}
          {(isCreatingNew || editingPackage) && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-300 shadow-lg space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                    {isCreatingNew ? 'Create Tour Package' : 'Edit Tour Package'}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">
                    {formData.title || 'Untitled Tour Package'}
                  </h3>
                </div>
                <button
                  onClick={handleCancelForm}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePackage} className="space-y-6">
                {/* Basic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Package Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ''}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          title: newTitle,
                          slug: isCreatingNew && (!prev.slug || prev.slug.startsWith('tour-') || prev.slug.startsWith('package-'))
                            ? generateUniqueSlug(newTitle, prev.id || '', packages)
                            : prev.slug
                        }));
                      }}
                      placeholder="e.g. 3 Days 2 Nights Complete Ujjain, Maheshwar & Mandu Tour"
                      className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-700 text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">URL Slug (Web Key) *</label>
                      <button
                        type="button"
                        onClick={() => {
                          const s = generateUniqueSlug(formData.title || '', formData.id || '', packages);
                          setFormData(prev => ({ ...prev, slug: s }));
                        }}
                        className="text-[10px] text-amber-800 hover:underline font-semibold cursor-pointer"
                      >
                        Auto-generate
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.slug || ''}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                      placeholder="e.g. 3-days-ujjain-maheshwar"
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-xl font-mono text-slate-800"
                    />
                    <span className="text-[10px] text-slate-400 truncate block mt-0.5">/package/{formData.slug || 'slug-preview'}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Badge / Ribbon</label>
                    <input
                      type="text"
                      value={formData.badge || ''}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="e.g. Signature Royal Circuit"
                      className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-700 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Duration Text *</label>
                    <input
                      type="text"
                      required
                      value={formData.duration || ''}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g. 3 Days / 2 Nights"
                      className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-700 text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Days Count</label>
                      <input
                        type="number"
                        min={1}
                        value={formData.daysCount || 1}
                        onChange={(e) => setFormData({ ...formData, daysCount: Math.max(1, Number(e.target.value)) })}
                        className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl text-slate-900 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nights Count</label>
                      <input
                        type="number"
                        min={0}
                        value={formData.nightsCount ?? 0}
                        onChange={(e) => setFormData({ ...formData, nightsCount: Math.max(0, Number(e.target.value)) })}
                        className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl text-slate-900 font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Price Per Person (₹) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.pricePerPerson || ''}
                      onChange={(e) => setFormData({ ...formData, pricePerPerson: Number(e.target.value) })}
                      className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-700 text-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Original Cut Price (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.originalPrice || ''}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/30 text-slate-900"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4 sm:pt-6">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(formData.featured)}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                      <span className="ml-2 text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Star className={`w-3.5 h-3.5 ${formData.featured ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                        <span>Featured Tour</span>
                      </span>
                    </label>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Suitable For (Pilgrims / Travelers)</label>
                    <input
                      type="text"
                      value={formData.suitableFor || ''}
                      onChange={(e) => setFormData({ ...formData, suitableFor: e.target.value })}
                      placeholder="e.g. Family with Senior Citizens, Couples, Group of 2 to 6+ Persons"
                      className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl text-slate-900"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Short Tagline / Catchphrase</label>
                    <input
                      type="text"
                      value={formData.tagline || ''}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="Brief one-line summary displayed on cards..."
                      className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-700 text-slate-900"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Overview Description</label>
                    <textarea
                      rows={3}
                      value={formData.overview || ''}
                      onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                      placeholder="Comprehensive overview of places, temples, history, and experience..."
                      className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-700 text-slate-900"
                    />
                  </div>
                </div>

                {/* UNLIMITED GALLERY & COVER IMAGES SECTION */}
                <div className="bg-amber-50/40 p-5 sm:p-6 rounded-3xl border-2 border-amber-200/90 space-y-6">
                  {/* UNLIMITED PHOTOS HIGHLIGHT BANNER */}
                  <div className="bg-gradient-to-r from-amber-800 via-amber-900 to-slate-900 text-white p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-amber-300" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold tracking-tight">Unlimited Photos Allowed (No Limit / जितनी चाहें उतनी Photos जोड़ें)</span>
                          <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Unlimited Supported
                          </span>
                        </div>
                        <p className="text-xs text-amber-200/80 mt-0.5">
                          You can upload 5, 10, 20, 50+ photos at once, paste multiple links, or use our 1-click sacred presets.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowBulkUrlModal(true)}
                        className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <CopyPlus className="w-3.5 h-3.5 text-amber-300" />
                        <span>Paste Multiple URLs (Bulk)</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleAddAllPresets}
                        className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add All 10 Presets</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/70">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Package Photos & Gallery</span>
                        <span className="text-xs font-extrabold text-amber-900 bg-amber-200/80 px-3 py-0.5 rounded-full border border-amber-300">
                          {formData.galleryImages?.length || 0} Photos Added
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2 mt-0.5">
                        <ImageIcon className="w-5 h-5 text-amber-700" />
                        <span>Add, Edit, Reorder & Remove Images</span>
                      </h4>
                      <p className="text-xs text-slate-600">
                        Upload photos from your device, paste URLs, or pick from verified sacred temple presets. Click any photo to set it as Cover.
                      </p>
                    </div>

                    {formData.galleryImages && formData.galleryImages.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAllGalleryImages}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-xl cursor-pointer transition-all self-start sm:self-auto"
                      >
                        Clear All Photos
                      </button>
                    )}
                  </div>

                  {/* 3 Methods to Add Photos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Method 1: Upload from device (with Drag & Drop zone) */}
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragOverUpload(true); }}
                      onDragLeave={() => setIsDragOverUpload(false)}
                      onDrop={handleDropFiles}
                      className={`p-4 rounded-2xl border-2 transition-all space-y-2 shadow-xs ${
                        isDragOverUpload
                          ? 'border-amber-600 bg-amber-100/70 ring-4 ring-amber-400/30'
                          : 'border-slate-200 bg-white hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                          <Upload className="w-4 h-4 text-amber-700" />
                          <span>1. Upload Photos (Multiple Allowed • Unlimited)</span>
                        </div>
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                          Drag & Drop or Select
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Select as many photos as you want (5, 10, 20+). All photos are automatically optimized.
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleMultipleFilesUpload}
                        disabled={uploadLoading}
                        className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-800 file:text-white hover:file:bg-amber-900 cursor-pointer"
                      />
                      {uploadLoading && (
                        <p className="text-xs text-amber-700 font-semibold flex items-center gap-1.5 animate-pulse">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Compressing and uploading images...</span>
                        </p>
                      )}
                    </div>

                    {/* Method 2: Add by Web URL */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                          <Link className="w-4 h-4 text-amber-700" />
                          <span>2. Add via URL (Single or Multiple)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowBulkUrlModal(true)}
                          className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
                        >
                          + Paste Bulk URLs
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Paste any image link (e.g. Unsplash, web link, or /hero/slide1.jpg) and press Add.
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customImageUrl}
                          onChange={(e) => setCustomImageUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomImageUrl();
                            }
                          }}
                          placeholder="https://... or /uploads/..."
                          className="flex-1 p-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-slate-900 font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomImageUrl}
                          className="bg-amber-800 hover:bg-amber-900 text-white font-bold px-4 py-2 rounded-xl text-xs shrink-0 cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add URL</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Method 3: 1-Click Sacred Destination Presets */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>3. Quick Add from 10 High-Resolution Sacred Presets (1-Click)</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleAddAllPresets}
                        className="text-[11px] font-bold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg cursor-pointer"
                      >
                        + Add All 10 Presets
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                      {SACRED_IMAGE_PRESETS.map((preset, idx) => {
                        const isAlreadyAdded = formData.galleryImages?.includes(preset.url);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleAddPresetImage(preset.url)}
                            className={`group text-left p-1.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                              isAlreadyAdded
                                ? 'border-emerald-400 bg-emerald-50/60'
                                : 'border-slate-200 bg-slate-50 hover:border-amber-400 hover:bg-amber-50/50'
                            }`}
                          >
                            <div className="aspect-video rounded-lg overflow-hidden bg-slate-900 mb-1 relative">
                              <img
                                src={preset.url}
                                alt={preset.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/hero/slide1.jpg';
                                }}
                              />
                              {isAlreadyAdded && (
                                <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5">
                                  <Check className="w-2.5 h-2.5" />
                                </div>
                              )}
                            </div>
                            <p className="text-[11px] font-bold text-slate-900 truncate leading-tight">{preset.title}</p>
                            <p className="text-[9px] text-slate-500 truncate">{preset.subtitle}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Primary Cover Photo Preview & Live Manager */}
                  <div className="bg-amber-100/60 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Primary Cover Photo</span>
                          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                            <Check className="w-3 h-3" />
                            <span>Displayed on Home Page & Tour Cards</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-900/80 mt-0.5">
                          This is the main hero banner photo pilgrims see first. You can change it below or click "Set Cover" on any gallery image.
                        </p>
                      </div>

                      {formData.coverImage && (
                        <button
                          type="button"
                          onClick={() => handleSetGlobalHomeCover(formData.coverImage!)}
                          className="px-3 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                          title="Set this photo as the Home Page Cover Banner"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Use for Home Banner</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-1">
                      <div className="sm:col-span-4 h-36 rounded-2xl overflow-hidden bg-slate-900 border-2 border-amber-400 relative shadow-sm group">
                        <img
                          src={formData.coverImage || (formData.galleryImages && formData.galleryImages[0]) || '/hero/slide1.jpg'}
                          alt="Primary cover preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src !== window.location.origin + '/hero/slide1.jpg') {
                              target.src = '/hero/slide1.jpg';
                            }
                          }}
                        />
                        <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                          Current Primary Cover
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewModalUrl(formData.coverImage || (formData.galleryImages && formData.galleryImages[0]) || '/hero/slide1.jpg')}
                          className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-lg opacity-80 hover:opacity-100 cursor-pointer"
                          title="View Full Size"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="sm:col-span-8 space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">Upload New Cover Directly from Device</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverPhotoUpload}
                            disabled={uploadLoading}
                            className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-700 file:text-white hover:file:bg-amber-800 cursor-pointer"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">Or Paste Cover Image URL</label>
                          <input
                            type="text"
                            value={formData.coverImage || ''}
                            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                            placeholder="Paste image URL or /uploads/..."
                            className="w-full p-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 font-mono focus:ring-2 focus:ring-amber-500/30"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thumbnails Grid of all added images with Permanent, Clear Action Controls */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <label className="block text-xs font-extrabold text-slate-800">
                          Package Photo Gallery ({formData.galleryImages?.length || 0} Photos) • Unlimited Allowed
                        </label>
                        <p className="text-[11px] text-slate-500">
                          Use the buttons on each card below to Edit, Reorder, Set as Cover, or Remove photos.
                        </p>
                      </div>
                      <span className="text-[11px] text-amber-800 font-medium">
                        First photo or selected cover is shown on listings
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                      {/* Add Photo tile in the grid itself */}
                      <label className="border-2 border-dashed border-amber-300 hover:border-amber-600 bg-amber-50/50 hover:bg-amber-100/60 rounded-2xl aspect-video flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all group shadow-xs">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleMultipleFilesUpload}
                          disabled={uploadLoading}
                          className="hidden"
                        />
                        <div className="w-8 h-8 rounded-full bg-amber-800 text-white flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-xs">
                          <Plus className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-amber-950">+ Add Photos</span>
                        <span className="text-[10px] text-amber-800/80">Upload any number</span>
                      </label>

                      {formData.galleryImages && formData.galleryImages.map((imgUrl, idx) => {
                        const isCover = formData.coverImage === imgUrl;
                        return (
                          <div
                            key={idx}
                            className={`bg-white rounded-2xl overflow-hidden border-2 shadow-xs transition-all flex flex-col ${
                              isCover
                                ? 'border-emerald-500 ring-2 ring-emerald-400/40 shadow-emerald-100'
                                : 'border-slate-200 hover:border-amber-400'
                            }`}
                          >
                            {/* Image Preview Container */}
                            <div className="relative aspect-video bg-slate-950 overflow-hidden">
                              <img
                                src={imgUrl}
                                alt={`Gallery photo ${idx + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/hero/slide1.jpg';
                                }}
                              />

                              {/* Index Badge */}
                              <div className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                                #{idx + 1}
                              </div>

                              {/* Active Cover Badge */}
                              {isCover && (
                                <div className="absolute top-1.5 right-1.5 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-md flex items-center gap-1">
                                  <Check className="w-2.5 h-2.5" />
                                  <span>Cover</span>
                                </div>
                              )}

                              {/* Full View Button */}
                              <button
                                type="button"
                                onClick={() => setPreviewModalUrl(imgUrl)}
                                className="absolute bottom-1.5 right-1.5 p-1 bg-black/60 hover:bg-black text-white rounded-md cursor-pointer transition-opacity"
                                title="View full size"
                              >
                                <Maximize2 className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Action Buttons Toolbar (Always visible, clean, mobile-friendly!) */}
                            <div className="p-2.5 bg-slate-50/80 border-t border-slate-100 flex-1 flex flex-col justify-between gap-2">
                              <div className="text-[10px] font-mono text-slate-500 truncate" title={imgUrl}>
                                {imgUrl}
                              </div>

                              <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-200">
                                {/* Left: Reorder buttons */}
                                <div className="flex items-center gap-0.5">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => handleMoveGalleryImage(idx, 'left')}
                                    className="p-1 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                    title="Move Left"
                                  >
                                    <ArrowLeft className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === (formData.galleryImages?.length || 1) - 1}
                                    onClick={() => handleMoveGalleryImage(idx, 'right')}
                                    className="p-1 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                    title="Move Right"
                                  >
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                </div>

                                {/* Middle / Right: Edit, Set Cover, Remove */}
                                <div className="flex items-center gap-1">
                                  {!isCover && (
                                    <button
                                      type="button"
                                      onClick={() => handleSetCoverImage(imgUrl)}
                                      className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 cursor-pointer"
                                      title="Make this the main package cover photo"
                                    >
                                      Cover
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => handleStartEditGalleryImage(idx)}
                                    className="p-1 rounded-md bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 cursor-pointer"
                                    title="Edit photo URL or replace photo"
                                  >
                                    <Edit2 className="w-3 h-3 text-amber-700" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleRemoveGalleryImage(idx)}
                                    className="p-1 rounded-md bg-red-50 text-red-700 hover:bg-red-600 hover:text-white border border-red-200 cursor-pointer transition-colors"
                                    title="Remove photo from package"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Highlights, Inclusions & Exclusions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Key Highlights (1 per line)
                    </label>
                    <textarea
                      rows={5}
                      value={highlightsText}
                      onChange={(e) => setHighlightsText(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/30 text-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Inclusions (1 per line)
                    </label>
                    <textarea
                      rows={5}
                      value={inclusionsText}
                      onChange={(e) => setInclusionsText(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/30 text-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Exclusions (1 per line)
                    </label>
                    <textarea
                      rows={5}
                      value={exclusionsText}
                      onChange={(e) => setExclusionsText(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/30 text-slate-900 font-mono"
                    />
                  </div>
                </div>

                {/* Day-by-Day Itinerary Builder */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-700" />
                        <span>Day-by-Day Tour Itinerary ({formData.itinerary?.length || 0} Days)</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Add detailed schedules, temple visits, and meals for each day.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddItineraryDay}
                      className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Day Plan</span>
                    </button>
                  </div>

                  {(!formData.itinerary || formData.itinerary.length === 0) ? (
                    <div className="p-4 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-400 text-xs">
                      No days added yet. Click &quot;Add Day Plan&quot; to build a structured itinerary for pilgrims.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.itinerary.map((dayItem, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                              Day {dayItem.day}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveItineraryDay(idx)}
                              className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove Day</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">Day Title</label>
                              <input
                                type="text"
                                value={dayItem.title}
                                onChange={(e) => handleUpdateItineraryDay(idx, { title: e.target.value })}
                                placeholder="e.g. Day 1: Sacred Mahakaleshwar Darshan"
                                className="w-full p-2 text-xs border border-slate-300 rounded-lg text-slate-900"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">Subtitle / Circuit</label>
                              <input
                                type="text"
                                value={dayItem.subtitle}
                                onChange={(e) => handleUpdateItineraryDay(idx, { subtitle: e.target.value })}
                                placeholder="e.g. Bhasma Aarti & Shipra Ram Ghat"
                                className="w-full p-2 text-xs border border-slate-300 rounded-lg text-slate-900"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">Places Visited (Comma Separated)</label>
                              <input
                                type="text"
                                value={Array.isArray(dayItem.places) ? dayItem.places.join(', ') : ''}
                                onChange={(e) => handleUpdateItineraryDay(idx, { places: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                placeholder="Mahakal Mandir, Kaal Bhairav, Ram Ghat, Harsiddhi"
                                className="w-full p-2 text-xs border border-slate-300 rounded-lg text-slate-900"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">Detailed Description</label>
                              <textarea
                                rows={2}
                                value={dayItem.description}
                                onChange={(e) => handleUpdateItineraryDay(idx, { description: e.target.value })}
                                placeholder="Details of visits, darshan timing, and night stay..."
                                className="w-full p-2 text-xs border border-slate-300 rounded-lg text-slate-900"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">Meals Included</label>
                              <input
                                type="text"
                                value={dayItem.mealsIncluded || ''}
                                onChange={(e) => handleUpdateItineraryDay(idx, { mealsIncluded: e.target.value })}
                                placeholder="e.g. Lunch, Dinner (Pure Vegetarian)"
                                className="w-full p-2 text-xs border border-slate-300 rounded-lg text-slate-900"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">Stay Location</label>
                              <input
                                type="text"
                                value={dayItem.stayLocation || ''}
                                onChange={(e) => handleUpdateItineraryDay(idx, { stayLocation: e.target.value })}
                                placeholder="e.g. Super Deluxe Hotel, Ujjain"
                                className="w-full p-2 text-xs border border-slate-300 rounded-lg text-slate-900"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    disabled={savingPackage}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingPackage}
                    className="px-6 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-bold shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
                  >
                    {savingPackage ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Saving & Syncing to Supabase...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{isCreatingNew ? 'Create & Sync to Supabase' : 'Update & Sync to Supabase'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Packages List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={pkg.coverImage || '/hero/slide1.jpg'}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== window.location.origin + '/hero/slide1.jpg') {
                          target.src = '/hero/slide1.jpg';
                        }
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-amber-900/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                      {pkg.duration}
                    </div>
                    {pkg.galleryImages && pkg.galleryImages.length > 0 && (
                      <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        <span>{pkg.galleryImages.length} photos</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-amber-800 font-bold">₹{pkg.pricePerPerson} / person</span>
                      {pkg.badge && (
                        <span className="bg-amber-50 text-amber-900 text-[10px] font-semibold px-2 py-0.5 rounded border border-amber-200">
                          {pkg.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                      {pkg.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {pkg.tagline || pkg.overview}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3">
                  <div className="flex items-center gap-2">
                    <a
                      href={`/package/${pkg.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-500 hover:text-amber-800 rounded-lg hover:bg-slate-100 transition-colors"
                      title="View Public Page"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <span className="text-[10px] text-slate-400 font-mono truncate max-w-[130px]">
                      /{pkg.slug}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => handleSetGlobalHomeCover(pkg.coverImage || (pkg.galleryImages && pkg.galleryImages[0]) || '/hero/slide1.jpg')}
                      className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
                      title="Set this photo as the Home Page Cover Banner"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span className="hidden sm:inline">Home Cover</span>
                    </button>
                    <button
                      onClick={() => handleClonePackage(pkg)}
                      className="p-1.5 text-[11px] font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
                      title="Duplicate this package"
                    >
                      <CopyPlus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleStartEdit(pkg)}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleRequestDelete(pkg)}
                      className="p-1.5 text-[11px] font-semibold rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 cursor-pointer"
                      title="Delete package from Supabase and Website"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: HOME COVER & HERO BANNER MANAGER */}
      {activeTab === 'cover_banner' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Homepage Customization</span>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span>Home Page Cover Image & Hero Banner</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Change the main cover background image, banner title, and sliding spots displayed at the very top of your homepage.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveHomeHero()}
                  disabled={savingHomeHero}
                  className="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingHomeHero ? 'Saving Changes...' : 'Save Live Home Banner'}</span>
                </button>
              </div>
            </div>

            {/* LIVE PREVIEW OF CURRENT COVER BANNER */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                1. Live Homepage Cover Preview
              </label>
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[21/9] sm:aspect-[24/9] border-2 border-amber-500 shadow-md">
                <img
                  src={addressSettings.homeHero?.coverImage || '/hero/slide1.jpg'}
                  alt="Homepage Hero Banner Preview"
                  className="w-full h-full object-cover filter brightness-90"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== window.location.origin + '/hero/slide1.jpg') {
                      target.src = '/hero/slide1.jpg';
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent p-6 sm:p-8 flex flex-col justify-end text-white">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[11px] font-semibold w-fit mb-2 backdrop-blur-sm">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Active Live Homepage Cover Image</span>
                  </div>
                  <h4 className="text-xl sm:text-3xl font-extrabold text-white leading-tight">
                    {addressSettings.homeHero?.heading || 'Indore & Ujjain Darshan & Tour Packages'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-xl mt-1">
                    {addressSettings.homeHero?.subheading || 'Experience divine spiritual bliss across Madhya Pradesh’s revered Jyotirlingas: Shree Mahakaleshwar Bhasma Aarti (Ujjain) and Holy Omkareshwar (Narmada Island)...'}
                  </p>
                </div>
                <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Currently Live on Website</span>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS TO CHANGE COVER IMAGE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Option A: Upload Direct from Device */}
              <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <Upload className="w-4 h-4 text-amber-700" />
                  <span>Upload New Cover Image from Device</span>
                </div>
                <p className="text-xs text-slate-600">
                  Select a high-resolution photo from your phone or PC. It will automatically upload and become the new Homepage Cover.
                </p>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroCoverUpload}
                    disabled={heroUploadLoading}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-700 file:text-white hover:file:bg-amber-800 cursor-pointer"
                  />
                  {heroUploadLoading && (
                    <p className="text-xs text-amber-700 font-semibold mt-2 flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading & setting home cover image...</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Option B: Enter Custom URL */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <ImageIcon className="w-4 h-4 text-amber-700" />
                  <span>Or Paste Image URL</span>
                </div>
                <p className="text-xs text-slate-600">
                  Paste any web link or uploaded image path to use as the Home Cover Image.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customHomeHeroUrl}
                    onChange={(e) => setCustomHomeHeroUrl(e.target.value)}
                    placeholder="https://... or /uploads/..."
                    className="flex-1 p-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customHomeHeroUrl.trim()) {
                        handleSetGlobalHomeCover(customHomeHeroUrl.trim());
                      }
                    }}
                    className="bg-amber-800 hover:bg-amber-900 text-white font-bold px-4 py-2 rounded-xl text-xs shrink-0 cursor-pointer"
                  >
                    Apply URL
                  </button>
                </div>
              </div>

            </div>

            {/* PRE-VERIFIED SACRED DESTINATION PRESETS (1-CLICK SELECT) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800">
                  2. Choose from High-Resolution Sacred Presets (1-Click Apply)
                </label>
                <span className="text-[11px] text-slate-500">Instant preview & switch</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  { title: 'Shree Mahakaleshwar, Ujjain', img: '/hero/slide1.jpg', tag: 'Mahakal Mandir' },
                  { title: 'Holy Omkareshwar Jyotirlinga', img: '/hero/slide2.jpg', tag: 'Narmada Island' },
                  { title: 'Royal Maheshwar Ahilya Fort', img: '/hero/slide3.jpg', tag: 'Ahilya Ghat' },
                  { title: 'Historic Rajwada Palace', img: '/hero/slide4.jpg', tag: 'Indore Heritage' },
                  { title: 'Mandu Jahaz Mahal', img: '/hero/slide5.jpg', tag: 'Mandu Fort' },
                ].map((preset, idx) => {
                  const isCurrent = addressSettings.homeHero?.coverImage === preset.img;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSetGlobalHomeCover(preset.img)}
                      className={`group relative rounded-xl overflow-hidden aspect-[4/3] border-2 cursor-pointer transition-all ${
                        isCurrent
                          ? 'border-emerald-500 ring-2 ring-emerald-400 shadow-md scale-[1.02]'
                          : 'border-slate-200 hover:border-amber-400 hover:scale-[1.01]'
                      }`}
                    >
                      <img src={preset.img} alt={preset.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2.5 flex flex-col justify-end text-white">
                        <span className="text-[10px] font-bold text-amber-300 truncate">{preset.tag}</span>
                        <span className="text-[11px] font-semibold line-clamp-1">{preset.title}</span>
                      </div>
                      {isCurrent && (
                        <div className="absolute top-1.5 right-1.5 bg-emerald-600 text-white rounded-full p-1 shadow">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CHOOSE FROM YOUR TOUR PACKAGES' COVERS */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800">
                  3. Or Pick From Any Tour Package's Cover Photo
                </label>
                <span className="text-[11px] text-slate-500">Uses that package's cover photo for Homepage</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {packages.map((pkg) => {
                  const isCurrent = addressSettings.homeHero?.coverImage === pkg.coverImage;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => handleSetGlobalHomeCover(pkg.coverImage)}
                      className={`group relative rounded-xl overflow-hidden aspect-video border-2 cursor-pointer transition-all ${
                        isCurrent
                          ? 'border-emerald-500 ring-2 ring-emerald-400 shadow-md scale-[1.02]'
                          : 'border-slate-200 hover:border-amber-400'
                      }`}
                    >
                      <img
                        src={pkg.coverImage || '/hero/slide1.jpg'}
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== window.location.origin + '/hero/slide1.jpg') {
                            target.src = '/hero/slide1.jpg';
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex flex-col justify-end text-white">
                        <span className="text-[10px] font-semibold line-clamp-1">{pkg.title}</span>
                      </div>
                      {isCurrent && (
                        <div className="absolute top-1.5 right-1.5 bg-emerald-600 text-white rounded-full p-1 shadow">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* EDIT HOMEPAGE HEADINGS */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <label className="block text-xs font-bold text-slate-800">
                4. Customize Hero Title & Subheading Text (Optional)
              </label>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Main Heading</label>
                  <input
                    type="text"
                    value={addressSettings.homeHero?.heading || ''}
                    onChange={(e) => setAddressSettings({
                      ...addressSettings,
                      homeHero: {
                        ...(addressSettings.homeHero || DEFAULT_AGENCY_SETTINGS.homeHero!),
                        heading: e.target.value
                      }
                    })}
                    placeholder="Indore & Ujjain Darshan & Tour Packages"
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Subheading Description</label>
                  <textarea
                    rows={3}
                    value={addressSettings.homeHero?.subheading || ''}
                    onChange={(e) => setAddressSettings({
                      ...addressSettings,
                      homeHero: {
                        ...(addressSettings.homeHero || DEFAULT_AGENCY_SETTINGS.homeHero!),
                        subheading: e.target.value
                      }
                    })}
                    placeholder="Experience divine spiritual bliss across Madhya Pradesh’s revered Jyotirlingas..."
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleSaveHomeHero()}
                  disabled={savingHomeHero}
                  className="px-6 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingHomeHero ? 'Saving...' : 'Save & Publish All Homepage Changes'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB: PHOTOS & MEDIA GALLERY MANAGER */}
      {activeTab === 'uploads' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Media Library</span>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                  <ImageIcon className="w-5 h-5 text-amber-700" />
                  <span>Photos & Media Gallery Manager</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload, view, copy URLs, and manage all photos stored on your server and website.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearStorageCache}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Clears local browser cache to free up 5MB quota"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                  <span>Free Storage Quota</span>
                </button>

                <button
                  type="button"
                  onClick={loadServerUploads}
                  disabled={loadingServerUploads}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingServerUploads ? 'animate-spin' : ''}`} />
                  <span>Refresh Media</span>
                </button>
              </div>
            </div>

            {/* Direct Media Upload Box */}
            <div className="p-5 bg-amber-50/60 border-2 border-dashed border-amber-300 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-950">
                <Upload className="w-4 h-4 text-amber-700" />
                <span>Upload New Photos to Media Library</span>
              </div>
              <p className="text-xs text-slate-600">
                Photos uploaded here will be saved to your website storage at <code>/uploads/</code> and can be used for packages, homepage banners, or gallery sliders.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMediaTabDirectUpload}
                  disabled={mediaTabUploadLoading}
                  className="w-full sm:w-auto text-xs text-slate-500 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-800 file:text-white hover:file:bg-amber-900 cursor-pointer"
                />
                {mediaTabUploadLoading && (
                  <p className="text-xs text-amber-700 font-semibold flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing and uploading photos...</span>
                  </p>
                )}
              </div>
            </div>

            {/* Section 1: Server Uploaded Photos */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Server Uploaded Photos</span>
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                    {serverUploads.length} Photos
                  </span>
                </h4>
              </div>

              {serverUploads.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500 space-y-1">
                  <p className="text-xs font-bold text-slate-700">No photos uploaded to server yet.</p>
                  <p className="text-[11px] text-slate-400">
                    Use the upload box above to add photos from your phone or PC.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {serverUploads.map((photo, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-amber-400 shadow-xs flex flex-col justify-between transition-all group"
                    >
                      <div className="relative aspect-video bg-slate-900 overflow-hidden">
                        <img
                          src={photo.url}
                          alt={photo.filename}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/hero/slide1.jpg';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setPreviewModalUrl(photo.url)}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-lg cursor-pointer"
                          title="View Full Size"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="p-3 bg-slate-50/70 border-t border-slate-100 space-y-2">
                        <div>
                          <p className="text-xs font-bold text-slate-900 truncate" title={photo.filename}>
                            {photo.filename}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono truncate" title={photo.url}>
                            {photo.url}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-200">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(photo.url);
                              showNotification('success', 'Photo path copied to clipboard!');
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 flex items-center gap-1 cursor-pointer"
                            title="Copy photo URL"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy URL</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSetGlobalHomeCover(photo.url)}
                            className="px-2 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 cursor-pointer"
                            title="Set as Homepage Hero Cover"
                          >
                            Home Cover
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteServerUpload(photo.filename)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-600 hover:text-white border border-red-200 cursor-pointer transition-colors"
                            title="Delete photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 2: Verified Sacred Presets */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Verified Sacred Temple Presets Library</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    High-resolution photos for Mahakaleshwar, Omkareshwar, Maheshwar, Indore Rajwada, and Mandu.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {SACRED_IMAGE_PRESETS.map((preset, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-amber-400 shadow-xs flex flex-col justify-between transition-all group"
                  >
                    <div className="relative aspect-video bg-slate-900 overflow-hidden">
                      <img
                        src={preset.url}
                        alt={preset.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/hero/slide1.jpg';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setPreviewModalUrl(preset.url)}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-lg cursor-pointer"
                        title="View Full Size"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-3.5 bg-slate-50/70 border-t border-slate-100 space-y-2">
                      <div>
                        <p className="text-xs font-bold text-slate-900 truncate">{preset.title}</p>
                        <p className="text-[11px] text-slate-500 truncate">{preset.subtitle}</p>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{preset.url}</p>
                      </div>

                      <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(preset.url);
                            showNotification('success', 'Preset URL copied to clipboard!');
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy URL</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSetGlobalHomeCover(preset.url)}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>Set Home Cover</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'supabase' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Cloud Storage</span>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                <Database className="w-5 h-5 text-amber-700" />
                <span>Supabase Integration Hub</span>
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClearStorageCache}
                className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                title="Clears browser storage cache if quota exceeded"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                <span>Fix Storage Quota</span>
              </button>
              <button
                onClick={checkSupabase}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Test Connection</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Supabase API Endpoint</span>
              <p className="text-xs font-mono font-bold text-slate-800 truncate">{SUPABASE_CONFIG.restUrl}</p>
              <p className="text-[11px] text-slate-500">Project: kbqvgvnoemnyjbytnacu</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Connection Status</span>
                <button
                  onClick={handleSyncAllToSupabase}
                  disabled={syncingAll}
                  className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${syncingAll ? 'animate-spin' : ''}`} />
                  <span>{syncingAll ? 'Syncing...' : 'Sync All Packages Now'}</span>
                </button>
              </div>
              <div className="flex items-center gap-2 pt-0.5">
                <span className={`w-3 h-3 rounded-full ${supabaseStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className="text-xs font-bold text-slate-900">
                  {supabaseStatus === 'connected' ? 'Connected & Ready' : (supabaseStatus === 'table_missing' ? 'Connected (Table Schema Pending)' : 'Active (Local Sync Fallback Ready)')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Automatic multi-tier fallback ensures zero downtime on Netlify or local preview.
              </p>
            </div>
          </div>

          {/* SQL Setup Helper */}
          <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">1-Click Supabase Table Setup SQL</h4>
                <p className="text-xs text-slate-600">
                  If you haven't created the `packages` table in your Supabase dashboard yet, copy this SQL and run it in your Supabase SQL Editor.
                </p>
              </div>
              <button
                onClick={handleCopySql}
                className="bg-amber-800 hover:bg-amber-900 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied!' : 'Copy SQL Script'}</span>
              </button>
            </div>

            <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs overflow-x-auto font-mono max-h-60">
              {SUPABASE_SETUP_SQL}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: INQUIRIES MANAGEMENT */}
      {activeTab === 'inquiries' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Bookings</span>
              <h3 className="text-xl font-bold text-slate-900">Customer Booking Inquiries</h3>
            </div>
            <button
              onClick={fetchInquiries}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Inquiries</span>
            </button>
          </div>

          {inquiries.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No booking inquiries logged yet. When visitors fill out WhatsApp booking forms, they will show here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Package</th>
                    <th className="py-3 px-3">Travel Date</th>
                    <th className="py-3 px-3">Persons</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 text-slate-500">{new Date(inq.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-3 font-medium text-slate-900">
                        {inq.customerName || 'Pilgrim'}
                        <div className="text-[11px] text-slate-500">{inq.phone}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-800 font-medium">{inq.packageName}</td>
                      <td className="py-3 px-3 text-slate-600">{inq.travelDate || 'Flexible'}</td>
                      <td className="py-3 px-3 text-slate-600">{inq.numberOfPersons}</td>
                      <td className="py-3 px-3">
                        <select
                          value={inq.status}
                          onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                          className="text-xs p-1 rounded border border-slate-300 font-medium"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: OFFICE ADDRESSES */}
      {activeTab === 'addresses' && (
        <form onSubmit={handleSaveAddresses} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Branch Offices</span>
              <h3 className="text-xl font-bold text-slate-900">Ujjain & Indore Office Addresses</h3>
            </div>
            <button
              type="submit"
              disabled={savingAddresses}
              className="bg-amber-800 hover:bg-amber-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{savingAddresses ? 'Saving...' : 'Save Office Addresses'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ujjain Office */}
            <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-700" />
                <span>Ujjain Branch Office</span>
              </h4>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={addressSettings.ujjainOffice.title}
                  onChange={(e) => setAddressSettings({
                    ...addressSettings,
                    ujjainOffice: { ...addressSettings.ujjainOffice, title: e.target.value }
                  })}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Address</label>
                <textarea
                  rows={2}
                  value={addressSettings.ujjainOffice.address}
                  onChange={(e) => setAddressSettings({
                    ...addressSettings,
                    ujjainOffice: { ...addressSettings.ujjainOffice, address: e.target.value }
                  })}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={addressSettings.ujjainOffice.phone}
                    onChange={(e) => setAddressSettings({
                      ...addressSettings,
                      ujjainOffice: { ...addressSettings.ujjainOffice, phone: e.target.value }
                    })}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Timings</label>
                  <input
                    type="text"
                    value={addressSettings.ujjainOffice.timing}
                    onChange={(e) => setAddressSettings({
                      ...addressSettings,
                      ujjainOffice: { ...addressSettings.ujjainOffice, timing: e.target.value }
                    })}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Indore Office */}
            <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-700" />
                <span>Indore Head Office</span>
              </h4>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={addressSettings.indoreOffice.title}
                  onChange={(e) => setAddressSettings({
                    ...addressSettings,
                    indoreOffice: { ...addressSettings.indoreOffice, title: e.target.value }
                  })}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Address</label>
                <textarea
                  rows={2}
                  value={addressSettings.indoreOffice.address}
                  onChange={(e) => setAddressSettings({
                    ...addressSettings,
                    indoreOffice: { ...addressSettings.indoreOffice, address: e.target.value }
                  })}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={addressSettings.indoreOffice.phone}
                    onChange={(e) => setAddressSettings({
                      ...addressSettings,
                      indoreOffice: { ...addressSettings.indoreOffice, phone: e.target.value }
                    })}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Timings</label>
                  <input
                    type="text"
                    value={addressSettings.indoreOffice.timing}
                    onChange={(e) => setAddressSettings({
                      ...addressSettings,
                      indoreOffice: { ...addressSettings.indoreOffice, timing: e.target.value }
                    })}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Custom In-App Delete Confirmation Modal (Guaranteed to work in iframe) */}
      {packageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">Delete Tour Package?</h3>
                <p className="text-xs text-slate-500">Permanent removal from Supabase database</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              <img
                src={packageToDelete.coverImage || '/hero/slide1.jpg'}
                alt={packageToDelete.title}
                className="w-16 h-12 rounded-xl object-cover shrink-0 bg-slate-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/hero/slide1.jpg';
                }}
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{packageToDelete.title}</p>
                <p className="text-[11px] text-slate-500">{packageToDelete.duration} • ₹{packageToDelete.pricePerPerson}/person</p>
                <p className="text-[10px] text-amber-800 font-mono truncate">ID: {packageToDelete.id}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete this package? It will be removed immediately from your <strong>Supabase Cloud Database</strong>, local server, and will disappear from the live website.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPackageToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting from Supabase...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Permanently</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SPECIFIC GALLERY PHOTO */}
      {editingImageIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-amber-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-amber-700" />
                <h3 className="text-base font-bold text-slate-900">
                  Edit Photo #{editingImageIndex + 1}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => { setEditingImageIndex(null); setEditImageUrlInput(''); }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview of current photo */}
            <div className="aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner relative">
              <img
                src={editImageUrlInput || formData.galleryImages?.[editingImageIndex] || '/hero/slide1.jpg'}
                alt="Edit preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/hero/slide1.jpg';
                }}
              />
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Live Image Preview
              </div>
            </div>

            {/* Option 1: Replace by uploading from device */}
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-1.5">
              <label className="block text-xs font-bold text-amber-900">
                Option A: Replace with New Photo from Device
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleReplaceGalleryImageFile(editingImageIndex, e)}
                disabled={replaceImageLoading}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-800 file:text-white hover:file:bg-amber-900 cursor-pointer"
              />
              {replaceImageLoading && (
                <p className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Compressing and uploading replacement photo...</span>
                </p>
              )}
            </div>

            {/* Option 2: Edit URL / Path */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Option B: Edit Photo URL or File Path
              </label>
              <input
                type="text"
                value={editImageUrlInput}
                onChange={(e) => setEditImageUrlInput(e.target.value)}
                placeholder="https://... or /uploads/... or /hero/slide1.jpg"
                className="w-full p-2.5 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-slate-900"
              />
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  if (editImageUrlInput) {
                    handleSetCoverImage(editImageUrlInput);
                  }
                }}
                className="text-xs font-bold text-amber-900 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl cursor-pointer self-start sm:self-auto"
              >
                ★ Set as Primary Cover
              </button>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => { setEditingImageIndex(null); setEditImageUrlInput(''); }}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditGalleryImage}
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-md cursor-pointer"
                >
                  Save Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FULL SIZE IMAGE PREVIEW */}
      {previewModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500 truncate max-w-md">{previewModalUrl}</span>
              <button
                type="button"
                onClick={() => setPreviewModalUrl(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[65vh] rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center">
              <img
                src={previewModalUrl}
                alt="Full preview"
                className="max-h-[65vh] w-auto object-contain mx-auto"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(previewModalUrl);
                    showNotification('success', 'Image URL copied to clipboard!');
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSetGlobalHomeCover(previewModalUrl)}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Set as Home Cover</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setPreviewModalUrl(null)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
