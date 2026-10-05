import React, { useState } from 'react';
import { Search, Filter, Sparkles, SlidersHorizontal, CheckCircle2, Phone } from 'lucide-react';
import { TourPackage } from '../types';
import { PackageCard } from '../components/PackageCard';
import { AGENCY_INFO } from '../data/packagesData';

interface PackagesListPageProps {
  packages: TourPackage[];
  onSelectPackage: (pkg: TourPackage) => void;
  onBookPackage: (pkg: TourPackage) => void;
  navigate: (path: string) => void;
}

export const PackagesListPage: React.FC<PackagesListPageProps> = ({
  packages,
  onSelectPackage,
  onBookPackage,
  navigate
}) => {
  const [filterDuration, setFilterDuration] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = packages.filter((pkg) => {
    const matchesSearch =
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.itinerary.some(d => d.places.some(p => p.toLowerCase().includes(searchQuery.toLowerCase())));

    if (!matchesSearch) return false;

    if (filterDuration === '1day') return pkg.daysCount === 1;
    if (filterDuration === '2days') return pkg.daysCount === 2;
    if (filterDuration === '3days') return pkg.daysCount === 3;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>All Pilgrimage & Sightseeing Circuits</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Ujjain, Omkareshwar & Indore Tour Packages
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Choose from 1-day rapid temple tours to comprehensive 3-day signature pilgrimage packages with VIP Darshan, dedicated AC cab, super deluxe hotels, and sattvik meals.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by temple, Mahakal, palace..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilterDuration('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterDuration === 'all'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Packages ({packages.length})
          </button>
          <button
            onClick={() => setFilterDuration('2days')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterDuration === '2days'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            2 Days / 1 Night (₹6,499)
          </button>
          <button
            onClick={() => setFilterDuration('3days')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterDuration === '3days'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            3 Days / 2 Nights (₹8,499)
          </button>
          <button
            onClick={() => setFilterDuration('1day')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterDuration === '1day'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            1 Day Special
          </button>
        </div>
      </div>

      {/* Package Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <p className="text-slate-500 text-base">No packages found matching your criteria.</p>
          <button
            onClick={() => { setFilterDuration('all'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 bg-amber-800 text-white text-xs font-semibold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onSelect={onSelectPackage}
              onBook={onBookPackage}
            />
          ))}
        </div>
      )}

      {/* Helpful Custom Group Booking Banner */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-bold font-serif text-amber-950">
            Need a Customized Itinerary or Group Discount for 6+ Pilgrims?
          </h3>
          <p className="text-xs text-amber-900/80">
            We arrange Innova Crysta, Tempo Travellers, and luxury buses with personalized meal plans and Senior Citizen special care.
          </p>
        </div>
        <a
          href={`tel:${AGENCY_INFO.phoneRaw}`}
          className="bg-amber-800 hover:bg-amber-900 text-white font-semibold px-6 py-3 rounded-xl text-xs sm:text-sm whitespace-nowrap shadow-sm"
        >
          Call: {AGENCY_INFO.phone}
        </a>
      </div>
    </div>
  );
};
