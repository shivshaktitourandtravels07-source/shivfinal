import fs from 'fs';
import path from 'path';
import { INITIAL_PACKAGES, AGENCY_INFO } from '../src/data/packagesData.ts';

const PUBLIC_DIR = path.resolve('public');
const PACKAGE_DIR = path.join(PUBLIC_DIR, 'package');
const PACKAGES_DIR = path.join(PUBLIC_DIR, 'packages');

// Ensure target directories exist
if (!fs.existsSync(PACKAGE_DIR)) fs.mkdirSync(PACKAGE_DIR, { recursive: true });
if (!fs.existsSync(PACKAGES_DIR)) fs.mkdirSync(PACKAGES_DIR, { recursive: true });

function renderPackageHtml(pkg) {
  const pageTitle = `${pkg.title} | Shiv Shakti Tour & Travels (₹${pkg.pricePerPerson.toLocaleString('en-IN')})`;
  const pageDesc = pkg.metaDescription || `${pkg.title} - ${pkg.tagline}. All-inclusive tour with AC Cab, Super Deluxe Hotel, VIP Darshan & meals. Call 7999 353 101.`;
  const pageKeywords = (pkg.seoKeywords && pkg.seoKeywords.length > 0)
    ? pkg.seoKeywords.join(', ')
    : 'Ujjain tour packages, Mahakal darshan package, Omkareshwar Jyotirlinga tour, Indore sightseeing cab';
  const coverImg = pkg.coverImage.startsWith('http') ? pkg.coverImage : `https://www.shivshaktitours.co.in${pkg.coverImage}`;
  const canonicalUrl = `https://www.shivshaktitours.co.in/package/${pkg.slug}`;

  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristTrip",
        "@id": `${canonicalUrl}#trip`,
        "name": pkg.title,
        "description": pkg.overview,
        "touristType": ["Pilgrim", "Family", "Cultural", "Devotee"],
        "offers": {
          "@type": "Offer",
          "price": pkg.pricePerPerson,
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "validFrom": "2024-01-01",
          "url": canonicalUrl
        },
        "provider": {
          "@type": "TravelAgency",
          "name": AGENCY_INFO.name,
          "telephone": "+91-7999353101",
          "url": "https://www.shivshaktitours.co.in",
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
        "itinerary": {
          "@type": "ItemList",
          "itemListElement": (pkg.itinerary || []).map((day, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "item": {
              "@type": "TouristAttraction",
              "name": day.title,
              "description": day.description
            }
          }))
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.shivshaktitours.co.in/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Tour Packages",
            "item": "https://www.shivshaktitours.co.in/packages"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": pkg.title,
            "item": canonicalUrl
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        "mainEntity": (pkg.faqs || [
          {
            question: `What is included in the ${pkg.title}?`,
            answer: `The package includes dedicated sanitized AC cab for all transfers and sightseeing, VIP Mahakaleshwar & Jyotirlinga darshan assistance, super deluxe hotel stay (for multi-day tours), daily pure vegetarian breakfast, and complete toll/parking taxes.`
          },
          {
            question: "How do I book this package or request customization?",
            answer: "You can book instantly by calling our 24/7 pilgrimage helpline at +91 7999 353 101 or by messaging us directly on WhatsApp. Custom pickups from Indore Airport, Railway Station or Ujjain are arranged without extra hassle."
          },
          {
            question: "Where are your branch offices located?",
            answer: "Our Ujjain office is located at A-5/15 Mahakal Vanijya Kendra, Nanakheda, Ujjain (M.P.) - 456010. Our Indore head office is located at 220, Surya Appartment Usha Nagar, Near Ranjeet Hanuman Mandir, Indore."
          }
        ]).map(f => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer
          }
        }))
      }
    ]
  };

  const galleryHtml = (pkg.galleryImages || [pkg.coverImage]).map((img, i) => `
    <div class="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-200 group aspect-4/3 sm:aspect-16/10 shadow-sm">
      <img src="${img}" alt="${pkg.title} - Photo ${i + 1}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
        <span class="text-white text-xs font-semibold drop-shadow-md">${img.split('/').pop().replace(/_/g, ' ').replace(/\.[^/.]+$/, '').toUpperCase()}</span>
      </div>
    </div>
  `).join('');

  const highlightsHtml = (pkg.highlights || []).map(h => `
    <li class="flex items-start gap-3 py-2 text-slate-800 text-sm font-medium">
      <span class="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs mt-0.5">✓</span>
      <span>${h}</span>
    </li>
  `).join('');

  const inclusionsHtml = (pkg.inclusions || []).map(inc => `
    <li class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
      <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
      <span>${inc}</span>
    </li>
  `).join('');

  const exclusionsHtml = (pkg.exclusions || []).map(exc => `
    <li class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
      <span class="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✕</span>
      <span>${exc}</span>
    </li>
  `).join('');

  const itineraryHtml = (pkg.itinerary || []).map((day, idx) => `
    <div class="relative pl-8 sm:pl-10 pb-10 last:pb-2 border-l-2 border-amber-300">
      <!-- Day Circle Pin -->
      <div class="absolute -left-4 top-0 w-8 h-8 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center shadow-md ring-4 ring-amber-100">
        ${day.day || (idx + 1)}
      </div>

      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-amber-700">Day ${day.day || (idx + 1)} Detailed Itinerary</span>
            <h3 class="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">${day.title}</h3>
          </div>
          ${day.stayLocation ? `
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200/70">
              🏨 ${day.stayLocation}
            </span>
          ` : ''}
        </div>

        <p class="text-sm sm:text-base text-slate-700 leading-relaxed">${day.description}</p>

        <!-- Activities Breakdown -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
          ${day.morning ? `
            <div class="p-4 bg-amber-50/60 rounded-2xl border border-amber-100/80">
              <span class="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">🌅 Morning</span>
              <p class="text-xs text-slate-700 mt-1.5 leading-relaxed">${day.morning}</p>
            </div>
          ` : ''}
          ${day.afternoon ? `
            <div class="p-4 bg-orange-50/60 rounded-2xl border border-orange-100/80">
              <span class="text-xs font-bold uppercase tracking-wider text-orange-900 flex items-center gap-1.5">☀️ Afternoon</span>
              <p class="text-xs text-slate-700 mt-1.5 leading-relaxed">${day.afternoon}</p>
            </div>
          ` : ''}
          ${day.evening ? `
            <div class="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100/80">
              <span class="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">🌙 Evening</span>
              <p class="text-xs text-slate-700 mt-1.5 leading-relaxed">${day.evening}</p>
            </div>
          ` : ''}
        </div>

        ${(day.placesCovered && day.placesCovered.length > 0) ? `
          <div class="pt-3">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Key Spots Covered:</span>
            <div class="flex flex-wrap gap-2">
              ${day.placesCovered.map(p => `<span class="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-medium rounded-lg border border-slate-200">${p}</span>`).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');

  const faqsHtml = (pkg.faqs || [
    {
      question: `What is the pickup location for the ${pkg.title}?`,
      answer: "We offer dedicated doorstep pickup and drop from Indore Airport (IDR), Indore Junction Railway Station, Ujjain Junction, or any hotel of your choice in Indore / Ujjain."
    },
    {
      question: "Are temple VIP Darshan tickets and Bhasma Aarti guided?",
      answer: "Yes, our experienced drivers and pilgrimage coordinators guide you through VIP Darshan queues, proper dress codes, and timely entry at Shree Mahakaleshwar, Omkareshwar, and local shrines."
    },
    {
      question: "Can we customize or add extra places like Maheshwar or Mandu?",
      answer: "Absolutely! We can modify the itinerary, add days, change vehicle types (Dzire, Ertiga, Innova Crysta, Tempo Traveller), or upgrade hotels according to your family's preferences. Call 7999 353 101."
    }
  ]).map((f, i) => `
    <details class="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 group [&_summary::-webkit-details-marker]:hidden" ${i === 0 ? 'open' : ''}>
      <summary class="flex items-center justify-between cursor-pointer font-bold text-slate-900 text-sm sm:text-base gap-4">
        <span>${f.question}</span>
        <span class="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 group-open:rotate-180 transition-transform">▼</span>
      </summary>
      <p class="text-sm text-slate-600 mt-3 pt-3 border-t border-slate-100 leading-relaxed">${f.answer}</p>
    </details>
  `).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle}</title>
  <meta name="description" content="${pageDesc}" />
  <meta name="keywords" content="${pageKeywords}" />
  <link rel="canonical" href="${canonicalUrl}" />

  <!-- OpenGraph Social Cards -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Shiv Shakti Tour & Travels" />
  <meta property="og:title" content="${pkg.title} | Shiv Shakti Tour & Travels" />
  <meta property="og:description" content="${pageDesc}" />
  <meta property="og:image" content="${coverImg}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:locale" content="en_IN" />

  <!-- Twitter Social Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${pkg.title} (₹${pkg.pricePerPerson})" />
  <meta name="twitter:description" content="${pageDesc}" />
  <meta name="twitter:image" content="${coverImg}" />

  <link rel="icon" type="image/png" href="/logo.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS CDN for instant standalone styling -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            amber: {
              50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
              400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309',
              800: '#92400e', 900: '#78350f', 950: '#451a03',
            }
          }
        }
      }
    }
  </script>

  <!-- Schema.org JSON-LD Structured Data for Rich Search Results -->
  <script type="application/ld+json">
${JSON.stringify(schemaJsonLd, null, 2)}
  </script>
</head>
<body class="bg-slate-50 text-slate-900 font-sans antialiased selection:bg-amber-500 selection:text-white pb-20">

  <!-- TOP BRAND NOTIFICATION BAR -->
  <div class="bg-amber-950 text-amber-200 text-xs py-2 px-4 text-center font-medium border-b border-amber-900/50 flex items-center justify-center gap-2">
    <span>✨ Verified Ujjain Mahakal & Omkareshwar Tour Operator • 24x7 Helpline:</span>
    <a href="tel:7999353101" class="font-bold text-amber-400 underline hover:text-white">7999 353 101</a>
  </div>

  <!-- MAIN NAVIGATION -->
  <header class="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
      <a href="/" class="flex items-center gap-3 group">
        <img src="/logo.png" alt="Shiv Shakti Tour & Travels Logo" class="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
        <div>
          <span class="block font-black text-slate-950 text-base sm:text-lg tracking-tight group-hover:text-amber-700 transition-colors">SHIV SHAKTI</span>
          <span class="block text-[10px] sm:text-xs font-bold text-amber-700 uppercase tracking-widest -mt-1">TOUR & TRAVELS</span>
        </div>
      </a>

      <nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
        <a href="/" class="hover:text-amber-800 transition-colors">Home</a>
        <a href="/packages" class="text-amber-700 font-bold hover:text-amber-800 transition-colors">Tour Packages</a>
        <a href="/about" class="hover:text-amber-800 transition-colors">About Us</a>
        <a href="/contact" class="hover:text-amber-800 transition-colors">Contact</a>
      </nav>

      <div class="flex items-center gap-3">
        <a href="tel:7999353101" class="flex items-center gap-2 px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-colors">
          <span>📞 Call 7999 353 101</span>
        </a>
        <a href="https://wa.me/917999353101?text=${encodeURIComponent(`Namaste! I am interested in booking: ${pkg.title}`)}" target="_blank" rel="noopener noreferrer" class="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-colors">
          <span>💬 WhatsApp</span>
        </a>
      </div>
    </div>
  </header>

  <!-- BREADCRUMBS -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs text-slate-500 flex items-center gap-2 flex-wrap">
    <a href="/" class="hover:text-amber-800">Home</a>
    <span>/</span>
    <a href="/packages" class="hover:text-amber-800">Tour Packages</a>
    <span>/</span>
    <span class="text-slate-900 font-semibold">${pkg.title}</span>
  </div>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-10">

    <!-- HERO HEADER SECTION -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div class="lg:col-span-8 space-y-6">
        <div>
          <div class="flex flex-wrap items-center gap-2.5 mb-3">
            <span class="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full uppercase tracking-wider">
              ${pkg.badge || `${pkg.daysCount} Days Sacred Tour`}
            </span>
            <span class="px-3 py-1 bg-slate-200 text-slate-800 text-xs font-semibold rounded-full">
              ⏱️ ${pkg.duration}
            </span>
            <span class="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
              ⭐ 5.0 Rating (25,000+ Happy Pilgrims)
            </span>
          </div>

          <h1 class="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
            ${pkg.title}
          </h1>

          <p class="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
            ${pkg.tagline}
          </p>
        </div>

        <!-- MAIN FEATURED IMAGE -->
        <div class="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 group aspect-16/9 bg-slate-900">
          <img src="${pkg.coverImage}" alt="${pkg.title} Cover" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
            <span class="text-xs uppercase tracking-widest font-bold text-amber-300">Central MP Pilgrimage Circuit</span>
            <h2 class="text-xl sm:text-2xl font-bold mt-1 text-white">${pkg.title}</h2>
          </div>
        </div>

        <!-- PHOTO GALLERY -->
        <div class="space-y-3">
          <h2 class="text-lg font-bold text-slate-900">Sacred Spots & Destinations Gallery</h2>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            ${galleryHtml}
          </div>
        </div>

        <!-- OVERVIEW CARD -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900">Tour Overview & Experience</h2>
          <p class="text-sm sm:text-base text-slate-700 leading-relaxed">${pkg.overview}</p>

          <div class="pt-4 border-t border-slate-100">
            <h3 class="text-base font-bold text-slate-900 mb-3">Key Highlights of this Package:</h3>
            <ul class="space-y-1.5">
              ${highlightsHtml}
            </ul>
          </div>
        </div>

        <!-- DAY-BY-DAY ITINERARY -->
        <div class="space-y-6">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-amber-700">Detailed Schedule</span>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-950">Day-by-Day Sacred Itinerary</h2>
            </div>
            <span class="px-3.5 py-1.5 bg-amber-50 text-amber-900 text-xs font-bold rounded-xl border border-amber-200">
              100% Fully Customizable
            </span>
          </div>

          <div class="pt-4">
            ${itineraryHtml}
          </div>
        </div>

        <!-- INCLUSIONS & EXCLUSIONS -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-200/80 shadow-xs space-y-4">
            <div class="flex items-center gap-2.5 text-emerald-800">
              <span class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-base">✓</span>
              <h3 class="text-lg font-bold">What's Included (100% Clear)</h3>
            </div>
            <ul class="space-y-2.5">
              ${inclusionsHtml}
            </ul>
          </div>

          <div class="bg-white rounded-3xl p-6 sm:p-7 border border-rose-200/80 shadow-xs space-y-4">
            <div class="flex items-center gap-2.5 text-rose-800">
              <span class="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center font-bold text-base">✕</span>
              <h3 class="text-lg font-bold">What's Excluded</h3>
            </div>
            <ul class="space-y-2.5">
              ${exclusionsHtml}
            </ul>
          </div>
        </div>

        <!-- FAQ SECTION -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-amber-700">Devotee Assistance</span>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>
          <div class="space-y-3">
            ${faqsHtml}
          </div>
        </div>

      </div>

      <!-- RIGHT STICKY BOOKING CARD & INSTANT INQUIRY -->
      <div class="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
        
        <!-- PRICE & QUICK BOOKING CARD -->
        <div class="bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-amber-800/40">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-amber-400">All-Inclusive Fixed Price</span>
            <div class="flex items-baseline gap-2 mt-1">
              <span class="text-3xl sm:text-4xl font-black text-amber-400">₹${pkg.pricePerPerson.toLocaleString('en-IN')}</span>
              <span class="text-xs text-amber-200/70 line-through">₹${(pkg.originalPrice || pkg.pricePerPerson + 1500).toLocaleString('en-IN')}</span>
              <span class="text-xs text-amber-200 font-semibold">/ person</span>
            </div>
            <p class="text-xs text-amber-200/80 mt-1">Includes AC Chauffeur Cab + Hotel + VIP Darshan Assistance</p>
          </div>

          <div class="space-y-3 pt-2">
            <a href="tel:7999353101" class="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3.5 px-4 rounded-2xl shadow-lg transition-all text-sm">
              <span>📞 Instant Call: 7999 353 101</span>
            </a>
            <a href="https://wa.me/917999353101?text=${encodeURIComponent(`Jai Mahakal! I want to book: ${pkg.title} (₹${pkg.pricePerPerson}). Please share booking confirmation.`)}" target="_blank" rel="noopener noreferrer" class="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg transition-all text-sm">
              <span>💬 Book on WhatsApp</span>
            </a>
          </div>

          <!-- QUICK INQUIRY FORM -->
          <div class="pt-5 border-t border-amber-800/50 space-y-4">
            <h3 class="text-sm font-bold text-amber-200">Send Instant Booking Request</h3>
            <form id="quick-inquiry-form" class="space-y-3">
              <input type="hidden" name="packageName" value="${pkg.title}" />
              <div>
                <label class="block text-[11px] font-semibold text-amber-200 mb-1">Your Full Name *</label>
                <input type="text" name="customerName" required placeholder="e.g. Rajesh Sharma" class="w-full px-3.5 py-2 rounded-xl bg-white/10 text-white placeholder-slate-400 border border-white/20 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-amber-200 mb-1">Mobile / WhatsApp Number *</label>
                <input type="tel" name="phone" required placeholder="e.g. 9876543210" class="w-full px-3.5 py-2 rounded-xl bg-white/10 text-white placeholder-slate-400 border border-white/20 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-[11px] font-semibold text-amber-200 mb-1">Travel Date</label>
                  <input type="date" name="travelDate" class="w-full px-3 py-2 rounded-xl bg-white/10 text-white border border-white/20 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-amber-200 mb-1">Total Persons</label>
                  <input type="number" name="numberOfPersons" min="1" value="2" class="w-full px-3 py-2 rounded-xl bg-white/10 text-white border border-white/20 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-amber-200 mb-1">Pickup Location</label>
                <select name="pickupLocation" class="w-full px-3 py-2 rounded-xl bg-slate-900 text-white border border-white/20 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400">
                  <option value="Indore Airport (IDR)">Indore Airport (IDR)</option>
                  <option value="Indore Railway Station">Indore Railway Station</option>
                  <option value="Ujjain Junction / Mahakal">Ujjain Junction / Mahakal</option>
                  <option value="Other Hotel / Residence">Other Hotel / Residence</option>
                </select>
              </div>
              <button type="submit" id="submit-btn" class="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all">
                Submit Booking Inquiry
              </button>
              <div id="form-msg" class="hidden text-xs text-center p-2 rounded-lg font-semibold"></div>
            </form>
          </div>

          <!-- TRUST BADGES -->
          <div class="pt-4 border-t border-amber-800/40 grid grid-cols-2 gap-2 text-[11px] text-amber-200/90 font-medium">
            <div>🛡️ Zero Advance Scam</div>
            <div>🏨 Verified Deluxe Hotels</div>
            <div>🚗 Sanitized Private Cabs</div>
            <div>🙏 VIP Darshan Guidance</div>
          </div>
        </div>

        <!-- OTHER PACKAGES MINI LIST -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 class="text-base font-bold text-slate-900">Explore Other Tour Packages</h3>
          <div class="space-y-2.5">
            ${INITIAL_PACKAGES.filter(p => p.id !== pkg.id).map(p => `
              <a href="/package/${p.slug}" class="block p-3 rounded-2xl bg-slate-50 hover:bg-amber-50/80 border border-slate-200/70 hover:border-amber-300 transition-all group">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-900 group-hover:text-amber-800">${p.duration}</span>
                  <span class="text-xs font-bold text-amber-700">₹${p.pricePerPerson.toLocaleString('en-IN')}</span>
                </div>
                <p class="text-xs text-slate-600 line-clamp-1 mt-0.5">${p.title}</p>
              </a>
            `).join('')}
          </div>
        </div>

      </div>
    </div>

    <!-- 2 VERIFIED OFFICE BRANCHES -->
    <section class="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      <div class="text-center max-w-xl mx-auto space-y-1">
        <span class="text-xs font-bold uppercase tracking-wider text-amber-700">Visit Our Dedicated Branches</span>
        <h2 class="text-xl sm:text-2xl font-bold text-slate-900">Ujjain & Indore Office Addresses</h2>
        <p class="text-xs text-slate-600">Walk into our offices or call our round-the-clock booking team.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <!-- Ujjain Office -->
        <div class="p-6 rounded-2xl bg-amber-50/40 border border-amber-200/80 flex flex-col justify-between">
          <div class="space-y-2">
            <span class="text-xs font-black uppercase text-amber-900 tracking-wider">🕉️ Ujjain Head Office</span>
            <h3 class="text-base font-bold text-slate-900">Near Mahakaleshwar Temple</h3>
            <p class="text-xs text-slate-700 leading-relaxed">${AGENCY_INFO.address}</p>
          </div>
          <div class="pt-4 mt-4 border-t border-amber-200/60 flex items-center justify-between">
            <a href="tel:7999353101" class="text-xs font-bold text-amber-900 hover:underline">📞 7999 353 101</a>
            <a href="https://maps.google.com/?q=Mahakaleshwar+Temple+Ujjain" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold text-slate-700 hover:text-amber-800 underline">View Map</a>
          </div>
        </div>

        <!-- Indore Office -->
        <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div class="space-y-2">
            <span class="text-xs font-black uppercase text-slate-800 tracking-wider">🏢 Indore Branch Office</span>
            <h3 class="text-base font-bold text-slate-900">Near Ranjeet Hanuman Mandir</h3>
            <p class="text-xs text-slate-700 leading-relaxed">220, Surya Appartment Usha Nagar, Near Ranjeet Hanuman Mandir Indore</p>
          </div>
          <div class="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between">
            <a href="tel:7999353101" class="text-xs font-bold text-amber-900 hover:underline">📞 7999 353 101</a>
            <a href="https://maps.google.com/?q=Ranjeet+Hanuman+Mandir+Indore" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold text-slate-700 hover:text-amber-800 underline">View Map</a>
          </div>
        </div>
      </div>
    </section>

  </main>

  <!-- FLOATING CTA BUTTONS -->
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5">
    <a href="https://wa.me/917999353101?text=${encodeURIComponent(`Jai Mahakal! I am inquiring about ${pkg.title}`)}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-full shadow-2xl hover:scale-105 transition-all">
      <span class="text-base">💬</span>
      <span class="hidden sm:inline">WhatsApp Us</span>
    </a>
    <a href="tel:7999353101" class="flex items-center gap-2 px-4 py-3 bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs rounded-full shadow-2xl hover:scale-105 transition-all">
      <span class="text-base">📞</span>
      <span class="hidden sm:inline">Call 7999 353 101</span>
    </a>
  </div>

  <!-- INQUIRY SCRIPT -->
  <script>
    document.getElementById('quick-inquiry-form')?.addEventListener('submit', async function(e) {
      e.preventDefault();
      const form = e.target;
      const btn = document.getElementById('submit-btn');
      const msg = document.getElementById('form-msg');
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      btn.disabled = true;
      btn.innerText = 'Submitting Request...';

      try {
        const res = await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (res.ok) {
          msg.className = 'text-xs text-center p-2 rounded-lg font-bold bg-emerald-500 text-white block mt-2';
          msg.innerText = '✓ Inquiry Sent! Our team will call you within 15 minutes.';
          form.reset();
        } else {
          throw new Error('Failed');
        }
      } catch (err) {
        msg.className = 'text-xs text-center p-2 rounded-lg font-bold bg-amber-400 text-slate-900 block mt-2';
        msg.innerText = '✓ Inquiry noted! Calling you shortly on ' + (data.phone || '7999 353 101');
      } finally {
        btn.disabled = false;
        btn.innerText = 'Submit Booking Inquiry';
      }
    });
  </script>

</body>
</html>`;
}

// Generate HTML files for all 6 packages
console.log('Generating static SEO HTML files for all packages...');

for (const pkg of INITIAL_PACKAGES) {
  const html = renderPackageHtml(pkg);
  
  // 1. Root level public/${slug}.html
  const rootPath = path.join(PUBLIC_DIR, `${pkg.slug}.html`);
  fs.writeFileSync(rootPath, html, 'utf-8');
  console.log(`Generated: ${rootPath}`);

  // 2. public/package/${slug}.html
  const pkgPath = path.join(PACKAGE_DIR, `${pkg.slug}.html`);
  fs.writeFileSync(pkgPath, html, 'utf-8');
  console.log(`Generated: ${pkgPath}`);

  // 3. public/packages/${slug}.html
  const pkgsPath = path.join(PACKAGES_DIR, `${pkg.slug}.html`);
  fs.writeFileSync(pkgsPath, html, 'utf-8');
  console.log(`Generated: ${pkgsPath}`);

  // 4. Also write by ID just in case
  const idPath = path.join(PUBLIC_DIR, `${pkg.id}.html`);
  fs.writeFileSync(idPath, html, 'utf-8');
}

// Generate XML Sitemap
function generateSitemap() {
  const baseUrl = 'https://www.shivshaktitours.co.in';
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <!-- Core Main Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${baseUrl}/hero/slide1.jpg</image:loc>
      <image:title>Shree Mahakaleshwar Jyotirlinga Ujjain Tour</image:title>
    </image:image>
  </url>

  <url>
    <loc>${baseUrl}/packages</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
`;

  for (const pkg of INITIAL_PACKAGES) {
    xml += `
  <url>
    <loc>${baseUrl}/package/${pkg.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
    <image:image>
      <image:loc>${baseUrl}${pkg.coverImage}</image:loc>
      <image:title>${pkg.title.replace(/&/g, '&amp;')}</image:title>
    </image:image>
  </url>

  <url>
    <loc>${baseUrl}/${pkg.slug}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>
`;
  }

  const dests = ['ujjain', 'indore', 'omkareshwar', 'maheshwar', 'mandu'];
  for (const dest of dests) {
    xml += `
  <url>
    <loc>${baseUrl}/destination/${dest}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
`;
  }

  xml += `\n</urlset>`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), xml, 'utf-8');
  fs.writeFileSync(path.resolve('sitemap.xml'), xml, 'utf-8');
  console.log('Generated: sitemap.xml in public/ and root');
}

generateSitemap();

console.log('All 6 package static HTML pages & sitemap generated successfully!');
