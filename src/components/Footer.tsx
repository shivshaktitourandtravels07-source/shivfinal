import React from 'react';
import { Phone, MessageCircle, Mail, MapPin, ShieldCheck, Award, HeartHandshake, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { AGENCY_INFO } from '../data/packagesData';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-amber-900/40 relative overflow-hidden">
      {/* Subtle divine watermark pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Top Feature Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 pb-12 border-b border-slate-800/80">
          <div className="flex items-center gap-3.5 bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">Government Registered</h4>
              <p className="text-xs text-slate-400">Authentic local agency in MP</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">VIP Darshan Assistance</h4>
              <p className="text-xs text-slate-400">Mahakal & Omkareshwar priority</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">Sanitized Comfortable Cabs</h4>
              <p className="text-xs text-slate-400">Polite verified local chauffeurs</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">100% Pure Veg Meals</h4>
              <p className="text-xs text-slate-400">Hygienic fresh sattvik food</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
          {/* Company Info with Logo */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              {/* White square background for bottom logo */}
              <div className="w-14 h-14 rounded-2xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-md overflow-hidden border border-amber-200">
                <img
                  src="/logo.png"
                  alt="Shiv Shakti Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <span className="text-white font-extrabold text-lg tracking-tight block">
                  {AGENCY_INFO.name}
                </span>
                <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase">
                  Indore & Ujjain Tour Operator
                </span>
              </div>
            </div>

            <p className="text-xs text-amber-400 font-medium mb-3 tracking-wide">
              ॥ ॐ नमः शिवाय • जय श्री महाकाल ॥
            </p>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Madhya Pradesh's premier pilgrimage and tour operator. Specialists in Shree Mahakaleshwar VIP Darshan, Omkareshwar Jyotirlinga, and Maheshwar Ahilya Fort heritage tours.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-800 text-amber-300 font-semibold">⭐ 5.0 Star Rating</span>
              <span className="px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-800">25,000+ Happy Pilgrims</span>
            </div>
          </div>

          {/* Tour Packages */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="text-amber-500">✦</span>
              <span>Tour Packages</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a
                  href="/package/2-days-1-night-ujjain-omkareshwar-darshan"
                  onClick={(e) => handleNav(e, '/package/2-days-1-night-ujjain-omkareshwar-darshan')}
                  className="hover:text-amber-400 flex items-center gap-1.5 transition-colors"
                >
                  <ChevronRight className="w-3 h-3 text-amber-500" />
                  <span>2D/1N Ujjain & Omkareshwar (₹6,499)</span>
                </a>
              </li>
              <li>
                <a
                  href="/package/3-days-2-nights-ujjain-omkareshwar-maheshwar-tour"
                  onClick={(e) => handleNav(e, '/package/3-days-2-nights-ujjain-omkareshwar-maheshwar-tour')}
                  className="hover:text-amber-400 flex items-center gap-1.5 transition-colors"
                >
                  <ChevronRight className="w-3 h-3 text-amber-500" />
                  <span>3D/2N Ujjain, Omkareshwar & Maheshwar (₹8,499)</span>
                </a>
              </li>
              <li>
                <a
                  href="/package/1-day-ujjain-mahakal-darshan-day-tour"
                  onClick={(e) => handleNav(e, '/package/1-day-ujjain-mahakal-darshan-day-tour')}
                  className="hover:text-amber-400 flex items-center gap-1.5 transition-colors"
                >
                  <ChevronRight className="w-3 h-3 text-amber-500" />
                  <span>1 Day Ujjain Mahakal Excursion (₹3,499)</span>
                </a>
              </li>
              <li>
                <a
                  href="/packages"
                  onClick={(e) => handleNav(e, '/packages')}
                  className="hover:text-amber-400 flex items-center gap-1.5 transition-colors"
                >
                  <ChevronRight className="w-3 h-3 text-amber-500" />
                  <span>Custom Family Group Packages</span>
                </a>
              </li>
              <li>
                <a
                  href="/packages"
                  onClick={(e) => handleNav(e, '/packages')}
                  className="hover:text-amber-400 flex items-center gap-1.5 transition-colors"
                >
                  <ChevronRight className="w-3 h-3 text-amber-500" />
                  <span>View All Tour Packages</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Destinations SEO Links */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="text-amber-500">✦</span>
              <span>Pilgrimage & Heritage</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a
                  href="/destination/ujjain"
                  onClick={(e) => handleNav(e, '/destination/ujjain')}
                  className="hover:text-amber-400 flex items-center gap-1.5 transition-colors"
                >
                  <ChevronRight className="w-3 h-3 text-amber-500" />
                  <span>Ujjain Mahakal Darshan Guide</span>
                </a>
              </li>
              <li>
                <a
                  href="/destination/omkareshwar"
                  onClick={(e) => handleNav(e, '/destination/omkareshwar')}
                  className="hover:text-amber-400 flex items-center gap-1.5 transition-colors"
                >
                  <ChevronRight className="w-3 h-3 text-amber-500" />
                  <span>Omkareshwar Jyotirlinga Guide</span>
                </a>
              </li>
              <li>
                <a
                  href="/destination/indore"
                  onClick={(e) => handleNav(e, '/destination/indore')}
                  className="hover:text-amber-400 flex items-center gap-1.5 transition-colors"
                >
                  <ChevronRight className="w-3 h-3 text-amber-500" />
                  <span>Indore Sightseeing & Food Guide</span>
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleNav(e, '/contact')}
                  className="hover:text-amber-400 flex items-center gap-1.5 transition-colors"
                >
                  <ChevronRight className="w-3 h-3 text-amber-500" />
                  <span>Maheshwar & Mandu Itineraries</span>
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleNav(e, '/contact')}
                  className="hover:text-amber-400 flex items-center gap-1.5 transition-colors"
                >
                  <ChevronRight className="w-3 h-3 text-amber-500" />
                  <span>Bhasma Aarti Guidance Desk</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Contact Info */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="text-amber-500">✦</span>
              <span>Offices & Helpline</span>
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>A-5/15 Mahakal Vanijya Kendra, Nanakheda, Ujjain</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>220, Surya Appartment Usha Nagar, Near Ranjeet Hanuman Mandir, Indore</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${AGENCY_INFO.phoneRaw}`} className="text-white hover:text-amber-300 font-bold text-sm">
                  {AGENCY_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate text-slate-400">{AGENCY_INFO.email}</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800">
              <a
                href={`https://wa.me/${AGENCY_INFO.whatsapp}?text=${encodeURIComponent('Hello Shiv Shakti Tour & Travels! I want to inquire about Ujjain and Indore tour packages.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-4 rounded-xl text-xs font-semibold shadow transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-5 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-slate-400 text-center md:text-left">
            <span>© {new Date().getFullYear()} Shiv Shakti Tour & Travels. All Rights Reserved. Ujjain & Indore (M.P.).</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-amber-400/90 font-serif">॥ जय श्री महाकाल ॥</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800 hover:border-slate-700 text-[11px] transition-all font-medium"
            >
              <span>XML Sitemap</span>
            </a>

            <a
              href="/admin"
              onClick={(e) => handleNav(e, '/admin')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-amber-700/60 shadow-xs transition-all font-medium"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Agency Admin Portal</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
