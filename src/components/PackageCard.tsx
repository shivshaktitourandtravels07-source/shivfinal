import React from 'react';
import { Clock, Users, Check, ArrowRight, Car, Hotel, UtensilsCrossed, Sparkles, MessageCircle } from 'lucide-react';
import { TourPackage } from '../types';
import { AGENCY_INFO } from '../data/packagesData';

interface PackageCardProps {
  pkg: TourPackage;
  onSelect: (pkg: TourPackage) => void;
  onBook: (pkg: TourPackage) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg, onSelect, onBook }) => {
  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect(pkg);
  };

  const handleDirectWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `Namaste Shiv Shakti Tour & Travels! I want to book:
*${pkg.title}*
*Duration:* ${pkg.duration}
*Price:* ₹${pkg.pricePerPerson}/person
Please share vehicle availability and dates.`;
    window.open(`https://wa.me/${AGENCY_INFO.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Top Image Banner - Clickable */}
      <a
        href={`/package/${pkg.slug}`}
        onClick={handleView}
        className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900 block cursor-pointer"
      >
        <img
          src={pkg.coverImage || '/hero/slide1.jpg'}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== window.location.origin + '/hero/slide1.jpg') {
              target.src = '/hero/slide1.jpg';
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        
        {/* Badge */}
        {pkg.badge && (
          <div className="absolute top-3 left-3 bg-amber-700 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>{pkg.badge}</span>
          </div>
        )}

        {/* Duration pill */}
        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{pkg.duration}</span>
        </div>

        {/* Suitable For */}
        {pkg.suitableFor && (
          <div className="absolute bottom-3 left-3 right-3 text-white/90 text-xs flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-amber-300" />
            <span className="truncate">{pkg.suitableFor}</span>
          </div>
        )}
      </a>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <a
            href={`/package/${pkg.slug}`}
            onClick={handleView}
            className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-2 block leading-snug cursor-pointer"
          >
            {pkg.title}
          </a>
          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {pkg.tagline}
          </p>

          {/* Quick Inclusions Badges */}
          <div className="grid grid-cols-3 gap-2 my-4 py-3 border-y border-slate-100 text-slate-700 text-xs">
            <div className="flex flex-col items-center text-center">
              <Car className="w-4 h-4 text-amber-700 mb-1" />
              <span className="text-[11px] font-medium">Sanitized Cab</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Hotel className="w-4 h-4 text-amber-700 mb-1" />
              <span className="text-[11px] font-medium">Deluxe Stay</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <UtensilsCrossed className="w-4 h-4 text-amber-700 mb-1" />
              <span className="text-[11px] font-medium">Pure Veg Meals</span>
            </div>
          </div>

          {/* Top Itinerary Highlights */}
          <div className="space-y-1.5 mb-5">
            {pkg.highlights.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-start gap-2 text-xs text-slate-600">
                <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span className="line-clamp-1">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="text-[11px] text-slate-500 block">Starting from</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-amber-900">
                  ₹{pkg.pricePerPerson.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500 font-medium">/ person</span>
                {pkg.originalPrice && (
                  <span className="text-xs line-through text-slate-400">
                    ₹{pkg.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              VIP Darshan
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={`/package/${pkg.slug}`}
              onClick={handleView}
              className="w-full flex items-center justify-center gap-1 text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-300 text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={handleDirectWhatsApp}
              className="w-full text-xs font-bold py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Book on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
