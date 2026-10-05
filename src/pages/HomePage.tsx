import React, { useState, useEffect } from 'react';
import { Sparkles, Star, Phone, MessageCircle, Clock, MapPin, CheckCircle2, ChevronRight, Car, Hotel, UtensilsCrossed, ArrowRight, ShieldCheck, ChevronLeft, Flame, Award, HeartHandshake } from 'lucide-react';
import { TourPackage, HeroSlide } from '../types';
import { AGENCY_INFO, HERO_SLIDES } from '../data/packagesData';
import { getAgencySettings } from '../services/packageStorage';
import { PackageCard } from '../components/PackageCard';
import { BranchAddressesSection } from '../components/BranchAddressesSection';

interface HomePageProps {
  packages: TourPackage[];
  onSelectPackage: (pkg: TourPackage) => void;
  onBookPackage: (pkg?: TourPackage) => void;
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  packages,
  onSelectPackage,
  onBookPackage,
  navigate
}) => {
  const [quickDate, setQuickDate] = useState('');
  const [quickPersons, setQuickPersons] = useState('2');
  const [quickPackageSlug, setQuickPackageSlug] = useState('2-days-1-night-ujjain-omkareshwar-darshan');
  const [quickMobile, setQuickMobile] = useState('');

  // Hero background slider & settings state
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(HERO_SLIDES);
  const [heroHeading, setHeroHeading] = useState('');
  const [heroSubheading, setHeroSubheading] = useState('');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Load custom cover image & hero slides from Admin Settings
  useEffect(() => {
    getAgencySettings().then(settings => {
      if (settings?.homeHero?.coverImage) {
        const cover = settings.homeHero.coverImage;
        const baseSlides = (settings.homeHero.slides && settings.homeHero.slides.length > 0)
          ? settings.homeHero.slides
          : HERO_SLIDES;
        
        // Put the active coverImage as the first slide
        const mergedSlides: HeroSlide[] = [
          {
            id: 'primary-cover-slide',
            title: baseSlides[0]?.title || 'Shree Mahakaleshwar & Omkareshwar Darshan',
            subtitle: baseSlides[0]?.subtitle || 'Premier Pilgrimage & Tour Specialist',
            image: cover
          },
          ...baseSlides.filter(s => s.image !== cover)
        ];
        setHeroSlides(mergedSlides);
      } else if (settings?.homeHero?.slides && settings.homeHero.slides.length > 0) {
        setHeroSlides(settings.homeHero.slides);
      }

      if (settings?.homeHero?.heading) {
        setHeroHeading(settings.homeHero.heading);
      }
      if (settings?.homeHero?.subheading) {
        setHeroSubheading(settings.homeHero.subheading);
      }
    }).catch(() => {});
  }, []);

  // Auto slide rotation every 5 seconds (pauses when hovered)
  useEffect(() => {
    if (isPaused || heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Top featured packages only on HomePage (rest on /packages)
  const featuredPackages = packages.slice(0, 3);

  const handleQuickWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pkg = packages.find(p => p.slug === quickPackageSlug) || packages[0];
    const text = `Namaste Shiv Shakti Tour & Travels!
I want to book/inquire about:
*Package:* ${pkg.title} (${pkg.duration})
*Price:* ₹${pkg.pricePerPerson}/person
*Travel Date:* ${quickDate || 'Flexible'}
*Persons:* ${quickPersons}
*Mobile:* ${quickMobile || 'Inquired on Website'}
Please share complete itinerary & confirm availability.`;

    // Asynchronously save inquiry
    fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        packageName: pkg.title,
        travelDate: quickDate,
        numberOfPersons: Number(quickPersons),
        phone: quickMobile || 'Direct WhatsApp Inquiry'
      })
    }).catch(() => {});

    window.open(`https://wa.me/${AGENCY_INFO.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 
        HERO SECTION WITH 4-IMAGE BACKGROUND SLIDER 
        Crisp visibility with clean, modern typography and no Hindi text clutter
      */}
      <section
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative bg-slate-950 text-white overflow-hidden border-b-4 border-amber-600 min-h-[640px] lg:min-h-[700px] flex items-center shadow-xl"
      >
        {/* Background Images Slider Container */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {heroSlides.map((slide, idx) => {
            const isActive = idx === currentSlideIndex;
            return (
              <div
                key={slide.id || idx}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  isActive ? 'opacity-85 scale-100' : 'opacity-0 scale-105'
                }`}
              >
                <img
                  src={slide.image || '/hero/slide1.jpg'}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== window.location.origin + '/hero/slide1.jpg') {
                      target.src = '/hero/slide1.jpg';
                    }
                  }}
                />
              </div>
            );
          })}

          {/* Clean Gradient Overlay: High image visibility with crisp text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/50" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Heading, Badges & Key Amenities */}
            <div className="lg:col-span-7 space-y-5 text-left">
              
              {/* Clean Professional Category Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-semibold backdrop-blur-md shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Premier Pilgrimage & Tour Specialist</span>
                <span className="text-amber-300/60">•</span>
                <span className="text-emerald-400 font-medium">Govt. Reg. Operator</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
                Indore & Ujjain <br className="hidden sm:inline" />
                <span className="text-amber-400 bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400">
                  Darshan & Tour Packages
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl font-normal drop-shadow">
                Experience divine spiritual bliss across Madhya Pradesh’s revered Jyotirlingas: <strong>Shree Mahakaleshwar Bhasma Aarti (Ujjain)</strong> and <strong>Holy Omkareshwar (Narmada Island)</strong>, together with Queen Ahilyabai’s sacred <strong>Maheshwar Ahilya Fort</strong> and <strong>Indore Heritage</strong>. Complete packages with sanitized cabs, deluxe hotels, and pure vegetarian dining.
              </p>

              {/* Inclusions Feature Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
                <div className="bg-slate-900/85 backdrop-blur-md border border-amber-500/40 rounded-2xl p-3 shadow-md hover:border-amber-400 transition-all">
                  <div className="text-amber-300 font-bold flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span>VIP Darshan</span>
                  </div>
                  <div className="text-slate-300 text-[11px] mt-0.5">Mahakal & Omkareshwar</div>
                </div>

                <div className="bg-slate-900/85 backdrop-blur-md border border-amber-500/40 rounded-2xl p-3 shadow-md hover:border-amber-400 transition-all">
                  <div className="text-amber-300 font-bold flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-amber-400" />
                    <span>Sanitized Cabs</span>
                  </div>
                  <div className="text-slate-300 text-[11px] mt-0.5">Dzire / Ertiga / Innova</div>
                </div>

                <div className="bg-slate-900/85 backdrop-blur-md border border-amber-500/40 rounded-2xl p-3 shadow-md hover:border-amber-400 transition-all">
                  <div className="text-amber-300 font-bold flex items-center gap-1.5">
                    <Hotel className="w-4 h-4 text-amber-400" />
                    <span>Deluxe Stay</span>
                  </div>
                  <div className="text-slate-300 text-[11px] mt-0.5">AC Rooms & Hot Geyser</div>
                </div>

                <div className="bg-slate-900/85 backdrop-blur-md border border-amber-500/40 rounded-2xl p-3 shadow-md hover:border-amber-400 transition-all">
                  <div className="text-amber-300 font-bold flex items-center gap-1.5">
                    <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                    <span>Pure Veg Meals</span>
                  </div>
                  <div className="text-slate-300 text-[11px] mt-0.5">100% Sattvik Food</div>
                </div>
              </div>

              {/* Direct Booking & Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={`https://wa.me/${AGENCY_INFO.whatsapp}?text=${encodeURIComponent('Hello Shiv Shakti Tour & Travels! I want details regarding Indore & Ujjain tour packages.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2 text-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Book via WhatsApp</span>
                </a>

                <button
                  onClick={() => navigate('/packages')}
                  className="bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 hover:text-white font-bold px-5 py-3.5 rounded-xl border-2 border-amber-400/60 shadow-md transition-all flex items-center gap-2 text-sm backdrop-blur-xs cursor-pointer"
                >
                  <span>Explore All Packages</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>

                <a
                  href={`tel:${AGENCY_INFO.phoneRaw}`}
                  className="text-amber-300 hover:text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 px-3 py-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>{AGENCY_INFO.phone}</span>
                </a>
              </div>
            </div>

            {/* Right Column: Quick WhatsApp Reservation Card */}
            <div className="lg:col-span-5">
              <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-amber-200/80">
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Quick Pilgrimage Booking</span>
                    <h3 className="text-lg font-bold text-slate-900">Check Dates on WhatsApp</h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Instant Response
                  </span>
                </div>

                <form onSubmit={handleQuickWhatsAppSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Select Tour Package</label>
                    <select
                      value={quickPackageSlug}
                      onChange={(e) => setQuickPackageSlug(e.target.value)}
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-700 font-medium text-slate-900"
                    >
                      <option value="2-days-1-night-ujjain-omkareshwar-darshan">
                        2 Days / 1 Night Ujjain & Omkareshwar (₹6,499)
                      </option>
                      <option value="3-days-2-nights-ujjain-omkareshwar-maheshwar-tour">
                        3 Days / 2 Nights Ujjain, Omkareshwar & Maheshwar (₹8,499)
                      </option>
                      <option value="1-day-ujjain-mahakal-darshan-day-tour">
                        1 Day Ujjain Mahakal Excursion (₹2,499)
                      </option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Travel Date</label>
                      <input
                        type="date"
                        required
                        value={quickDate}
                        onChange={(e) => setQuickDate(e.target.value)}
                        className="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-700 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">No. of Persons</label>
                      <select
                        value={quickPersons}
                        onChange={(e) => setQuickPersons(e.target.value)}
                        className="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-700 font-medium text-slate-900"
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 Persons</option>
                        <option value="3">3 Persons</option>
                        <option value="4">4 Persons</option>
                        <option value="5">5 Persons</option>
                        <option value="6">6 Persons (Family)</option>
                        <option value="7+">7+ Persons (Large Group)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Mobile / WhatsApp Number</label>
                    <input
                      type="tel"
                      required
                      value={quickMobile}
                      onChange={(e) => setQuickMobile(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-700 font-mono text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Send Inquiry on WhatsApp</span>
                  </button>

                  <p className="text-[11px] text-center text-slate-500">
                    Direct local manager helpline • 0% advance online charge
                  </p>
                </form>
              </div>
            </div>

          </div>

          {/* 
            SLIDER THUMBNAIL NAVIGATOR 
            Shows sliding destination preview cards with clean English titles
          */}
          <div className="pt-8 border-t border-white/15 mt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3 text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-white font-semibold">Slide {currentSlideIndex + 1} of {heroSlides.length}:</span>
                <span className="text-amber-200 font-bold">{heroSlides[currentSlideIndex]?.title || 'Holy Pilgrimage Tour'}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-300">
                <span>Click destination to preview</span>
                <button
                  onClick={prevSlide}
                  className="p-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 cursor-pointer"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 cursor-pointer"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Sliding Destination Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
              {heroSlides.map((slide, idx) => {
                const isActive = idx === currentSlideIndex;
                return (
                  <button
                    key={slide.id || idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`relative rounded-xl overflow-hidden text-left p-2 border-2 transition-all cursor-pointer flex items-center gap-2.5 ${
                      isActive
                        ? 'border-amber-400 bg-amber-950/80 shadow-lg ring-2 ring-amber-400/40 scale-[1.02]'
                        : 'border-white/20 bg-slate-900/70 hover:border-amber-300/50 hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="w-12 h-10 rounded-lg overflow-hidden shrink-0 border border-white/20">
                      <img
                        src={slide.image || '/hero/slide1.jpg'}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== window.location.origin + '/hero/slide1.jpg') {
                            target.src = '/hero/slide1.jpg';
                          }
                        }}
                      />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-[10px] uppercase font-bold text-amber-400 truncate">
                        Spot {idx + 1}
                      </div>
                      <div className="text-xs font-bold text-white truncate">
                        {idx === 0 && 'Ujjain Mahakal'}
                        {idx === 1 && 'Omkareshwar Island'}
                        {idx === 2 && 'Maheshwar Ahilya Fort'}
                        {idx === 3 && 'Indore Rajwada'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Authentic Pilgrimage Itineraries
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Popular Tour Packages
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              All-inclusive Jyotirlinga packages with dedicated comfortable cabs, deluxe hotel stays, pure vegetarian meals, and VIP Darshan assistance.
            </p>
          </div>
          <button
            onClick={() => navigate('/packages')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-800 hover:text-amber-950 transition-colors cursor-pointer"
          >
            <span>View All Packages ({packages.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Top Featured Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredPackages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onSelect={onSelectPackage}
              onBook={onBookPackage}
            />
          ))}
        </div>

        {/* View All Packages Callout */}
        <div className="mt-8 sm:mt-10 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="text-left">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Looking for custom family circuits or group yatra?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              We specialize in 1-Day, 2-Days, 3-Days, and custom Jyotirlinga circuits with senior-citizen assistance.
            </p>
          </div>
          <button
            onClick={() => navigate('/packages')}
            className="shrink-0 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span>Browse All Packages</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Why Devotees Choose Shiv Shakti Tour & Travels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border-2 border-amber-200/80 rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Why Devotees Choose Us
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Complete Pilgrimage Hospitality
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              From early morning 4 AM Bhasma Aarti to sacred Narmada boat rides, our local team takes care of your family with devotion and care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-50/70 to-orange-50/40 border border-amber-300/70 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-3 shadow-xs">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">VIP Darshan Assistance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Step-by-step guidance for Shree Mahakaleshwar, 4 AM Bhasma Aarti slots, and Omkareshwar VIP temple entry.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-50/70 to-orange-50/40 border border-amber-300/70 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-3 shadow-xs">
                <Car className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Dedicated Clean Cabs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sanitized, comfortable Swift Dzire / Ertiga / Innova cabs from airport or railway pickup to all temple visits.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-50/70 to-orange-50/40 border border-amber-300/70 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-3 shadow-xs">
                <Hotel className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Deluxe Hotel Stays</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Handpicked AC hotels with clean rooms, hot water geysers, and peaceful surroundings near the temple premises.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-50/70 to-orange-50/40 border border-amber-300/70 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-3 shadow-xs">
                <UtensilsCrossed className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">100% Pure Veg Food</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hygienic sattvik vegetarian breakfast, lunch, and dinner included throughout your sacred tour.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pilgrim Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
            ⭐ 5.0 Star Rated Pilgrim Service
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Devotees Experiences
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">5 Star</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              "We booked the 3D/2N tour for our family. Everything was punctual, driver was courteous, and Bhasma Aarti at Mahakal was arranged without any trouble."
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs">
              <strong className="text-slate-900 block">Dr. R. K. Patel</strong>
              <span className="text-slate-500">Ahmedabad, Gujarat</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">5 Star</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              "Affordable package and very honest operators. The hotel was neat and the food was completely pure veg. Will definitely recommend Shiv Shakti Tour & Travels."
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs">
              <strong className="text-slate-900 block">Ananya Verma & Family</strong>
              <span className="text-slate-500">New Delhi</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">5 Star</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              "Prompt response on WhatsApp. Airport pickup at Indore was ready as soon as we landed. Complete darshan at Ujjain and Omkareshwar went super smoothly."
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs">
              <strong className="text-slate-900 block">Sanjay Aggarwal</strong>
              <span className="text-slate-500">Jaipur, Rajasthan</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2 Address Sections (Ujjain & Indore) Above Footer */}
      <BranchAddressesSection />

      {/* Direct Contact / WhatsApp Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border-2 border-amber-600/60">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-block text-xs font-bold uppercase tracking-wider text-amber-400">
              Trusted Pilgrimage Operator
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              Plan Your Sacred Pilgrimage Today
            </h3>
            <p className="text-xs sm:text-sm text-slate-200">
              Get an instant quote and date confirmation directly on WhatsApp or phone call.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`https://wa.me/${AGENCY_INFO.whatsapp}?text=${encodeURIComponent('Hello Shiv Shakti Tour & Travels! I want to plan my pilgrimage tour to Ujjain & Indore.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold px-5 py-3 rounded-xl shadow transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Us</span>
            </a>
            <a
              href={`tel:${AGENCY_INFO.phoneRaw}`}
              className="flex items-center gap-2 bg-white text-slate-900 font-bold px-5 py-3 rounded-xl shadow hover:bg-slate-100 transition-colors text-sm"
            >
              <Phone className="w-4 h-4 text-amber-800" />
              <span>{AGENCY_INFO.phone}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
