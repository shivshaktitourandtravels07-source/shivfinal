import React from 'react';
import { MapPin, Clock, Compass, ShieldCheck, ChevronRight, Sparkles, Phone, MessageCircle } from 'lucide-react';
import { DestinationInfo, TourPackage } from '../types';
import { DESTINATIONS_DATA, AGENCY_INFO } from '../data/packagesData';
import { PackageCard } from '../components/PackageCard';

interface DestinationPageProps {
  destinationSlug: string;
  packages: TourPackage[];
  onSelectPackage: (pkg: TourPackage) => void;
  onBookPackage: (pkg?: TourPackage) => void;
  navigate: (path: string) => void;
}

export const DestinationPage: React.FC<DestinationPageProps> = ({
  destinationSlug,
  packages,
  onSelectPackage,
  onBookPackage,
  navigate
}) => {
  const destination: DestinationInfo =
    DESTINATIONS_DATA.find((d) => d.slug === destinationSlug) || DESTINATIONS_DATA[0];

  const relevantPackages = packages.filter((p) =>
    p.itinerary.some((d) =>
      d.places.some((place) =>
        place.toLowerCase().includes(destination.slug.toLowerCase()) ||
        (destination.slug === 'ujjain' && place.toLowerCase().includes('mahakal')) ||
        (destination.slug === 'indore' && place.toLowerCase().includes('rajwada')) ||
        (destination.slug === 'omkareshwar' && place.toLowerCase().includes('omkareshwar'))
      )
    )
  );

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 text-white py-16 sm:py-24 overflow-hidden border-b border-amber-900/30">
        <div className="absolute inset-0 z-0">
          <img
            src={destination.heroImage || '/hero/slide1.jpg'}
            alt={destination.name}
            className="w-full h-full object-cover opacity-30"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== window.location.origin + '/hero/slide1.jpg') {
                target.src = '/hero/slide1.jpg';
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-amber-950/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-400/30 text-amber-300 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Travel & Pilgrimage Guide</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {destination.name}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            {destination.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => onBookPackage()}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all text-sm"
            >
              Book {destination.name.split('-')[0]} Tour Package
            </button>
            <a
              href={`tel:${AGENCY_INFO.phoneRaw}`}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3 rounded-xl border border-white/20 transition-all text-sm flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Helpline: {AGENCY_INFO.phone}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Top Key Attractions Grid */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Must-Visit Landmarks</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Key Temples & Sightseeing Spots
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Included in our Shiv Shakti Tour & Travels itineraries with dedicated comfortable cab transfers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {destination.topAttractions.map((attr, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs flex flex-col sm:flex-row group hover:shadow-md transition-all"
              >
                <div className="sm:w-48 h-44 sm:h-auto shrink-0 bg-slate-900 overflow-hidden relative">
                  <img
                    src={attr.image || '/hero/slide1.jpg'}
                    alt={attr.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== window.location.origin + '/hero/slide1.jpg') {
                        target.src = '/hero/slide1.jpg';
                      }
                    }}
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-1.5">
                      {attr.name}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {attr.description}
                    </p>
                  </div>
                  {attr.timings && (
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 w-fit">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      <span>Timings: {attr.timings}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Travel Tips & How to Reach */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 space-y-3">
            <h3 className="text-base font-bold text-amber-950 flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-700" />
              <span>How to Reach & Best Time</span>
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>Best Season: </strong> {destination.bestTimeToVisit}
            </p>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>Connectivity: </strong> {destination.howToReach}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
              <span>Local Devotee Tips</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {destination.travelTips.map((tip, tIdx) => (
                <li key={tIdx} className="flex items-start gap-2">
                  <span className="text-amber-700 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommended Packages for this Destination */}
        <section className="space-y-6 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Tour Booking</span>
              <h2 className="text-2xl font-bold text-slate-900">
                Recommended Packages Covering {destination.name.split('-')[0]}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(relevantPackages.length > 0 ? relevantPackages : packages).map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onSelect={onSelectPackage}
                onBook={onBookPackage}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
