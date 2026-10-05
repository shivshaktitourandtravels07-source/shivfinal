import React, { useState, useEffect } from 'react';
import { Clock, Users, ShieldCheck, Check, X, Phone, MessageCircle, MapPin, Calendar, Car, Hotel, UtensilsCrossed, ChevronRight, ChevronLeft, HelpCircle, Sparkles, Share2, Eye } from 'lucide-react';
import { TourPackage } from '../types';
import { AGENCY_INFO } from '../data/packagesData';

interface PackageDetailPageProps {
  pkg: TourPackage;
  onBook: (pkg: TourPackage) => void;
  navigate: (path: string) => void;
}

export const PackageDetailPage: React.FC<PackageDetailPageProps> = ({
  pkg,
  onBook,
  navigate
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeDayTab, setActiveDayTab] = useState(1);
  const [copied, setCopied] = useState(false);

  // Dynamic SEO Meta Tags & Schema.org JSON-LD
  useEffect(() => {
    const originalTitle = document.title;
    const pageTitle = `${pkg.title} | ${AGENCY_INFO.name}`;
    document.title = pageTitle;

    const metaDescription = pkg.metaDescription || pkg.overview || pkg.tagline;
    const metaKeywords = (pkg.seoKeywords && pkg.seoKeywords.length > 0)
      ? pkg.seoKeywords.join(', ')
      : `${pkg.title}, Ujjain tour, Omkareshwar package, Mahakaleshwar darshan, Madhya Pradesh pilgrimage`;

    const fullImageUrl = pkg.coverImage?.startsWith('http')
      ? pkg.coverImage
      : `${window.location.origin}${pkg.coverImage || '/hero/slide1.jpg'}`;

    const canonicalUrl = `${window.location.origin}/package/${pkg.slug}`;

    // Helper to create or update meta tag
    const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
      return el;
    };

    // Standard Meta Tags
    setMetaTag('meta[name="description"]', 'name', 'description', metaDescription);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', metaKeywords);

    // OpenGraph Meta Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', pageTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', metaDescription);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', fullImageUrl);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', AGENCY_INFO.name);

    // Twitter Card Meta Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', pageTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', metaDescription);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', fullImageUrl);

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Schema.org Structured Data (JSON-LD)
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "TouristTrip",
          "name": pkg.title,
          "description": metaDescription,
          "touristType": pkg.suitableFor || "Devotees, Families, Pilgrims",
          "offers": {
            "@type": "Offer",
            "price": pkg.pricePerPerson,
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
            "url": canonicalUrl,
            "validFrom": new Date().toISOString()
          },
          "provider": {
            "@type": "TravelAgency",
            "name": AGENCY_INFO.name,
            "telephone": AGENCY_INFO.phoneRaw,
            "email": AGENCY_INFO.email,
            "address": [
              {
                "@type": "PostalAddress",
                "streetAddress": AGENCY_INFO.address,
                "addressLocality": "Ujjain",
                "addressRegion": "Madhya Pradesh",
                "postalCode": "456010",
                "addressCountry": "IN"
              },
              {
                "@type": "PostalAddress",
                "streetAddress": "220, Surya Appartment Usha Nagar, Near Ranjeet Hanuman Mandir",
                "addressLocality": "Indore",
                "addressRegion": "Madhya Pradesh",
                "postalCode": "452009",
                "addressCountry": "IN"
              }
            ]
          },
          "itinerary": pkg.itinerary.map(item => ({
            "@type": "Day",
            "name": item.title,
            "description": item.description,
            "itemListElement": item.places.map(p => ({
              "@type": "TouristAttraction",
              "name": p
            }))
          }))
        }
      ]
    };

    let scriptTag = document.getElementById('package-jsonld-schema') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'package-jsonld-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

    return () => {
      document.title = originalTitle;
      const script = document.getElementById('package-jsonld-schema');
      if (script) script.remove();
    };
  }, [pkg]);

  const rawImages = [pkg.coverImage, ...(pkg.galleryImages || [])].filter(Boolean) as string[];
  const images = Array.from(new Set(rawImages));
  if (images.length === 0) images.push('/hero/slide1.jpg');

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 sm:space-y-12 pb-16">
      {/* Breadcrumbs & Header Strip */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-slate-900 text-white py-8 sm:py-12 border-b border-amber-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-4">
          <nav className="flex items-center gap-2 text-xs text-slate-400">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-amber-400">Home</a>
            <ChevronRight className="w-3 h-3" />
            <a href="/packages" onClick={(e) => { e.preventDefault(); navigate('/packages'); }} className="hover:text-amber-400">Packages</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-amber-400 truncate max-w-[200px] sm:max-w-md">{pkg.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {pkg.badge && (
              <span className="px-3 py-1 bg-amber-700 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                {pkg.badge}
              </span>
            )}
            <span className="px-3 py-1 bg-white/10 text-amber-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {pkg.duration}
            </span>
            <span className="text-xs text-slate-300">
              📍 Indore • Ujjain • Omkareshwar
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {pkg.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {pkg.tagline}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Main Left Content */}
          <div className="lg:col-span-8 space-y-8 sm:space-y-10">
            {/* Image Gallery Showcase */}
            <div className="space-y-3">
              <div className="relative h-64 sm:h-96 md:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 shadow-md group">
                <img
                  src={images[activeImageIndex] || pkg.coverImage || '/hero/slide1.jpg'}
                  alt={pkg.title}
                  className="w-full h-full object-cover transition-all duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== window.location.origin + '/hero/slide1.jpg') {
                      target.src = '/hero/slide1.jpg';
                    }
                  }}
                />

                {/* Photo counter badge */}
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow">
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>{activeImageIndex + 1} / {images.length} Photos</span>
                </div>

                {/* Left / Right arrows if multiple images */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors cursor-pointer"
                      title="Previous photo"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors cursor-pointer"
                      title="Next photo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-xs transition-colors text-xs flex items-center gap-1.5"
                    title="Share package"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{copied ? 'Link Copied!' : 'Share'}</span>
                  </button>
                </div>
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        activeImageIndex === idx ? 'border-amber-700 scale-105 shadow-sm' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img || '/hero/slide1.jpg'}
                        alt={`View ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== window.location.origin + '/hero/slide1.jpg') {
                            target.src = '/hero/slide1.jpg';
                          }
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Key Amenities */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
              <div className="p-2">
                <Car className="w-6 h-6 text-amber-700 mx-auto mb-1.5" />
                <strong className="block text-xs text-slate-900 font-bold">Dedicated AC Cab</strong>
                <span className="text-[11px] text-slate-500">Pick to Drop</span>
              </div>
              <div className="p-2">
                <Hotel className="w-6 h-6 text-amber-700 mx-auto mb-1.5" />
                <strong className="block text-xs text-slate-900 font-bold">Super Deluxe Room</strong>
                <span className="text-[11px] text-slate-500">AC, Geyser, Wi-Fi</span>
              </div>
              <div className="p-2">
                <Sparkles className="w-6 h-6 text-amber-700 mx-auto mb-1.5" />
                <strong className="block text-xs text-slate-900 font-bold">VIP Darshan</strong>
                <span className="text-[11px] text-slate-500">Mahakal & Omkareshwar</span>
              </div>
              <div className="p-2">
                <UtensilsCrossed className="w-6 h-6 text-amber-700 mx-auto mb-1.5" />
                <strong className="block text-xs text-slate-900 font-bold">Pure Veg Meals</strong>
                <span className="text-[11px] text-slate-500">Breakfast, Lunch, Dinner</span>
              </div>
            </div>

            {/* Overview */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-slate-900">
                Package Overview
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {pkg.overview}
              </p>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-3">
                  Key Highlights of this Tour:
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {pkg.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Comprehensive Day-by-Day Itinerary */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Tour Program</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Day-Wise Itinerary & Temple Visits
                  </h2>
                </div>
                <span className="text-xs text-slate-500">
                  Total {pkg.itinerary.length} Days Itinerary
                </span>
              </div>

              {/* Day selection tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {pkg.itinerary.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setActiveDayTab(day.day)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      activeDayTab === day.day
                        ? 'bg-amber-800 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Day {day.day}
                  </button>
                ))}
              </div>

              {/* Active Day Content */}
              {pkg.itinerary
                .filter((d) => d.day === activeDayTab)
                .map((day) => (
                  <div key={day.day} className="space-y-5 animate-in fade-in">
                    <div>
                      <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wide">
                        <span>Day {day.day}</span>
                        <span>•</span>
                        <span>{day.subtitle}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                        {day.title}
                      </h3>
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                      {day.description}
                    </p>

                    {/* Temples & Places list */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                        Temples & Attractions Visited on Day {day.day}:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {day.places.map((place, pIdx) => (
                          <div
                            key={pIdx}
                            className="flex items-center gap-2 bg-amber-50/70 border border-amber-200/60 rounded-xl p-2.5 text-xs text-amber-950 font-medium"
                          >
                            <span className="w-5 h-5 rounded-full bg-amber-800 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                              {pIdx + 1}
                            </span>
                            <span className="line-clamp-1">{place}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Day Details Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
                      <div>
                        <strong>Meals: </strong>
                        <span>{day.mealsIncluded}</span>
                      </div>
                      <div>
                        <strong>Stay: </strong>
                        <span>{day.stayLocation}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Inclusions vs Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inclusions */}
              <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <Check className="w-5 h-5" />
                  <h3 className="text-base">What is Included</h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  {pkg.inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="bg-rose-50/60 border border-rose-200/80 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-rose-900 font-bold">
                  <X className="w-5 h-5" />
                  <h3 className="text-base">What is Excluded</h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  {pkg.exclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-700 font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Frequently Asked Questions */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-700" />
                <h3 className="text-lg font-bold text-slate-900">
                  Frequently Asked Questions (FAQ)
                </h3>
              </div>
              <div className="space-y-4 text-xs">
                <div className="border-b border-slate-100 pb-3">
                  <strong className="text-slate-900 block text-sm mb-1">
                    How do we attend the 4:00 AM Mahakaleshwar Bhasma Aarti?
                  </strong>
                  <p className="text-slate-600 leading-relaxed">
                    Our local pilgrimage manager provides complete guidance and booking facilitation for official Bhasma Aarti slots on the temple trust portal. Our cab picks you up at 3:15 AM from your hotel for direct entry.
                  </p>
                </div>
                <div className="border-b border-slate-100 pb-3">
                  <strong className="text-slate-900 block text-sm mb-1">
                    Is the package suitable for senior citizens and kids?
                  </strong>
                  <p className="text-slate-600 leading-relaxed">
                    Yes, absolutely! We prioritize minimal walking, arrange battery rickshaws/dolis if requested, provide spacious air-conditioned cabs, and ensure sattvik, fresh food.
                  </p>
                </div>
                <div>
                  <strong className="text-slate-900 block text-sm mb-1">
                    What are the pickup and drop options?
                  </strong>
                  <p className="text-slate-600 leading-relaxed">
                    We offer complimentary pickup and drop from Indore Airport (IDR), Indore Junction, or Ujjain Junction Railway Station. Custom hotel pickup is also available.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sticky Booking Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-3xl border border-slate-200 p-6 shadow-xl space-y-6">
              <div>
                <span className="text-xs uppercase font-bold text-amber-800 tracking-wider">
                  All-Inclusive Package Price
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-slate-900">
                    ₹{pkg.pricePerPerson.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ per person</span>
                  {pkg.originalPrice && (
                    <span className="text-xs line-through text-slate-400">
                      ₹{pkg.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-emerald-700 font-medium mt-1">
                  ✓ Special discount for group of 4 to 6+ persons (starts ₹6,499)
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href={`https://wa.me/${AGENCY_INFO.whatsapp}?text=${encodeURIComponent(`Hello Shiv Shakti Tour & Travels! I want to book the "${pkg.title}" (${pkg.duration}) priced at ₹${pkg.pricePerPerson} per person. Please share available dates and vehicle details.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Book via WhatsApp</span>
                </a>

                <button
                  onClick={() => onBook(pkg)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl shadow-xs transition-all text-sm flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Request Custom Quote</span>
                </button>

                <a
                  href={`tel:${AGENCY_INFO.phoneRaw}`}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-4 rounded-xl transition-all text-xs flex items-center justify-center gap-2 border border-slate-200"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-700" />
                  <span>Call {AGENCY_INFO.phone}</span>
                </a>
              </div>

              {/* Quick Trust Checks */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>No hidden fees. All taxes & tolls covered.</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Free cancellation up to 48 hours before.</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>100% verified temple darshan guarantee.</span>
                </div>
              </div>

              {/* Direct Agency Card */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/60 text-xs text-amber-950">
                <strong className="block font-bold text-slate-900 mb-1">
                  Shiv Shakti Tour & Travels
                </strong>
                <p className="text-[11px] text-amber-900/80 mb-2">
                  “Your Journey, Our Expertise.”
                </p>
                <div className="text-[11px] space-y-1">
                  <p>📍 A-5/15 Mahakal Vanijya Kendra, Nanakheda, Ujjain</p>
                  <p>📍 220, Surya Appartment Usha Nagar, Near Ranjeet Hanuman, Indore</p>
                  <p>📞 Phone: {AGENCY_INFO.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
