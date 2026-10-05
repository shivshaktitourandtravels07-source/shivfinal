import React, { useState } from 'react';
import { Phone, MessageCircle, Menu, X, Lock, Sparkles } from 'lucide-react';
import { AGENCY_INFO } from '../data/packagesData';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'All Packages', path: '/packages' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Clean, Elegant Top Helpline Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-slate-200 text-[11px] sm:text-xs py-2 px-4 border-b border-amber-500/40 shadow-sm relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2 sm:gap-3 tracking-wide font-medium">
            <span className="text-amber-400 font-bold">Shree Mahakaleshwar & Omkareshwar Jyotirlinga Tours</span>
            <span className="hidden md:inline text-slate-400">•</span>
            <span className="hidden md:inline text-amber-200/90">Indore & Ujjain Dedicated Cab Service</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px]">
            <a
              href={`tel:${AGENCY_INFO.phoneRaw}`}
              className="flex items-center gap-1.5 bg-amber-800/80 hover:bg-amber-700 text-amber-200 hover:text-white px-2.5 py-1 rounded-full border border-amber-500/50 font-bold transition-all shadow-xs"
            >
              <Phone className="w-3 h-3 text-amber-300" />
              <span>24x7 Helpline: {AGENCY_INFO.phone}</span>
            </a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white/98 backdrop-blur-md shadow-sm border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Name with Left Logo */}
          <a
            href="/"
            onClick={(e) => handleNav(e, '/')}
            className="flex items-center gap-3 text-left group"
          >
            {/* Logo Image attached on the left side of brand name - transparent without square/border, enlarged */}
            <div className="h-14 sm:h-16 flex items-center justify-center shrink-0">
              <img
                src="/logo.png"
                alt="Shiv Shakti Tour & Travels Logo"
                className="h-full w-auto max-w-[70px] sm:max-w-[85px] object-contain drop-shadow-xs transition-transform group-hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<span class="font-serif font-black text-amber-800 text-2xl">ॐ</span>';
                  }
                }}
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg lg:text-xl text-slate-900 tracking-tight group-hover:text-amber-800 transition-colors leading-tight">
                  Shiv Shakti Tour & Travels
                </span>
                <span className="text-[10px] text-amber-700 font-serif font-bold hidden sm:inline">॥</span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 tracking-wider uppercase flex items-center gap-1.5 mt-0.5">
                <span>Indore • Ujjain Darshan</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-semibold hidden sm:inline">Govt. Registered</span>
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => handleNav(e, link.path)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-100/80 text-amber-950 border border-amber-300/80 shadow-xs'
                      : 'text-slate-700 hover:text-amber-800 hover:bg-amber-50/50'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Quick Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            <a
              href="/admin"
              onClick={(e) => handleNav(e, '/admin')}
              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-semibold border border-amber-200 transition-colors"
              title="Agency Admin Console"
            >
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>Admin</span>
            </a>
            <a
              href={`https://wa.me/${AGENCY_INFO.whatsapp}?text=${encodeURIComponent('Hello Shiv Shakti Tour & Travels, I want details regarding Indore and Ujjain tour packages.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`tel:${AGENCY_INFO.phoneRaw}`}
              className="flex items-center gap-1.5 bg-amber-900 hover:bg-amber-950 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-300" />
              <span>{AGENCY_INFO.phone}</span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-slate-900 focus:outline-none rounded-lg hover:bg-slate-100"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-amber-200/70 px-4 py-3 space-y-1 shadow-xl animate-in slide-in-from-top-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => handleNav(e, link.path)}
                  className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive ? 'bg-amber-100 text-amber-950 font-bold' : 'text-slate-700 hover:bg-amber-50/40'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <a
                href={`https://wa.me/${AGENCY_INFO.whatsapp}?text=${encodeURIComponent('Hello Shiv Shakti Tour & Travels, I want details regarding tour packages.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-emerald-600 text-white font-semibold py-2.5 px-3 rounded-lg text-xs"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp</span>
              </a>
              <a
                href={`tel:${AGENCY_INFO.phoneRaw}`}
                className="flex items-center justify-center gap-1.5 bg-amber-900 text-white font-semibold py-2.5 px-3 rounded-lg text-xs"
              >
                <Phone className="w-3.5 h-3.5 text-amber-300" />
                <span>Call Now</span>
              </a>
            </div>
            <div className="pt-2">
              <a
                href="/admin"
                onClick={(e) => handleNav(e, '/admin')}
                className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>Agency Admin Portal</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
