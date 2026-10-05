import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { AGENCY_INFO } from '../data/packagesData';

export const FloatingActions: React.FC = () => {
  return (
    <>
      {/* Desktop Floating WhatsApp Button */}
      <div className="hidden sm:block fixed bottom-6 right-6 z-40">
        <a
          href={`https://wa.me/${AGENCY_INFO.whatsapp}?text=${encodeURIComponent('Hello Shiv Shakti Tour & Travels, I want to inquire about Ujjain and Indore tour packages.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-full shadow-lg shadow-emerald-950/20 hover:scale-105 transition-all"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
          <span className="font-semibold text-sm tracking-wide">
            Chat on WhatsApp
          </span>
        </a>
      </div>

      {/* Mobile Bottom Fixed Bar for immediate conversion */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 shadow-2xl flex items-center gap-2">
        <a
          href={`tel:${AGENCY_INFO.phoneRaw}`}
          className="flex-1 flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white py-2.5 px-3 rounded-xl font-semibold text-sm shadow-sm"
        >
          <Phone className="w-4 h-4" />
          <span>Call Now</span>
        </a>
        <a
          href={`https://wa.me/${AGENCY_INFO.whatsapp}?text=${encodeURIComponent('Hello Shiv Shakti Tour & Travels, I want to book a tour package.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-3 rounded-xl font-semibold text-sm shadow-sm"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>WhatsApp</span>
        </a>
      </div>
    </>
  );
};
