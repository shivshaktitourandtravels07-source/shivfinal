import React from 'react';
import { ShieldCheck, Star, Users, Award, Car, Hotel, UtensilsCrossed, Phone, MessageCircle, MapPin, CheckCircle2, Clock, Sparkles, HeartHandshake, Compass, ArrowRight } from 'lucide-react';
import { AGENCY_INFO } from '../data/packagesData';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Hero / Header Section - Trustworthy, Warm & Clean Light Theme */}
      <section className="relative bg-gradient-to-b from-amber-50/70 via-white to-slate-50 border-b border-amber-200/60 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Serving Devotees Since 2012 • Registered Tour Operator</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            About <span className="text-amber-800">Shiv Shakti Tour & Travels</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-700 max-w-3xl mx-auto leading-relaxed font-normal">
            Your trusted local pilgrimage and travel partner in <strong>Indore and Ujjain</strong>. We specialize in comprehensive, worry-free tour packages for <strong>Shree Mahakaleshwar & Omkareshwar Jyotirlinga Darshan</strong>, Malwa heritage, and reliable cab transfers.
          </p>

          {/* Quick Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-4xl mx-auto">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-900">12+</div>
              <div className="text-xs font-semibold text-slate-600 mt-0.5">Years of Devoted Service</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-900">25,000+</div>
              <div className="text-xs font-semibold text-slate-600 mt-0.5">Happy Pilgrims Hosted</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 flex items-center justify-center gap-1">
                <span>5 Star</span>
                <Star className="w-5 h-5 fill-current text-amber-500" />
              </div>
              <div className="text-xs font-semibold text-slate-600 mt-0.5">5 Star Rated Service</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-900">24/7</div>
              <div className="text-xs font-semibold text-slate-600 mt-0.5">Bhasma Aarti Assistance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story & Origin */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-block text-xs font-bold uppercase tracking-wider text-amber-800">
              Our Journey & Mission
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Making Sacred Darshan Smooth, Safe & Dignified for Every Family
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Every month, thousands of devotees travel across India to seek the divine blessings of <strong>Lord Mahakaleshwar in Ujjain</strong> and <strong>Lord Omkareshwar on the sacred Narmada river</strong>. Too often, visiting families face confusion around 4 AM Bhasma Aarti slots, unofficial touts, erratic local taxis, and substandard lodging.
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>Shiv Shakti Tour & Travels</strong> was established with a singular mission: to provide families, senior citizens, and pilgrimage groups with complete, transparent, and respectful on-ground hospitality. From the moment you step off your flight or train in Indore or Ujjain, our dedicated team handles every detail — from sanitized AC cabs and handpicked deluxe hotels to pure vegetarian food and official VIP temple darshan queues.
            </p>

            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-950">
              <HeartHandshake className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Our Promise:</strong> 100% transparent pricing with zero hidden charges. Tolls, parking, driver night allowances, and temple transfer permits are all covered upfront.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
              <img
                src="/hero/slide1.jpg"
                alt="Shree Mahakaleshwar Temple Ujjain Darshan"
                className="w-full h-80 sm:h-96 object-cover"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== window.location.origin + '/hero/slide1.jpg') {
                    target.src = '/hero/slide1.jpg';
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wide block">
                    Avanti Nagari • Ujjain
                  </span>
                  <h3 className="text-lg font-bold">
                    Divine Abode of Shree Mahakaleshwar Jyotirlinga
                  </h3>
                  <p className="text-xs text-slate-200 mt-0.5">
                    Our local pilgrimage desk operates 24x7 within walking distance of Mahakal Lok.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars / Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
            Why Pilgrims Trust Us
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            The Shiv Shakti Tour & Travels Difference
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Engineered around comfort, devotion, and absolute transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              VIP Darshan & Bhasma Aarti Support
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete guidance on official temple trust slots, traditional Jalabhishek attire rules (Dhoti/Saree), and step-by-step coordination so you never feel lost in huge crowds.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Private, Sanitized AC Cabs
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Immaculately maintained fleet: Maruti Dzire, Ertiga, Innova Crysta, and Tempo Travellers with courteous, non-smoking, devotional local drivers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
              <Hotel className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Super Deluxe Hotel Stays
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clean AC rooms, fresh linen, 24-hour hot water geysers, and peaceful surroundings in verified hotels located convenient to temple corridors.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              100% Pure Veg Sattvik Meals
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hygienic vegetarian dining included: hearty breakfast, wholesome lunch, and delicious dinner. Special accommodations for Jain and fasting (Vrat) devotees.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Elderly & Family Friendly Care
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Paced itineraries suitable for senior citizens and young kids. Assistance with battery car transfers inside Mahakal Lok, wheel-chairs, and boat boarding in Omkareshwar.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Indore & Ujjain On-Ground Presence
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We are not an anonymous internet reseller. We run physical branch offices in both cities, ensuring local backup and immediate assistance throughout your tour.
            </p>
          </div>
        </div>
      </section>

      {/* Detailed Fleet Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Our Vehicle Fleet
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Sanitized AC Vehicles for Every Group Size
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              All vehicles are thoroughly inspected, equipped with functional air conditioning, phone charging ports, and experienced local chauffeurs who know every temple route and bypass.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 text-sm">Sedan (Swift Dzire / Etios)</div>
              <div className="text-xs text-amber-800 font-semibold mt-0.5">1 to 4 Passengers</div>
              <p className="text-xs text-slate-600 mt-2">
                Ideal for couples and small families. Ample boot space for luggage, great highway suspension.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 text-sm">Compact SUV (Maruti Ertiga)</div>
              <div className="text-xs text-amber-800 font-semibold mt-0.5">4 to 6 Passengers</div>
              <p className="text-xs text-slate-600 mt-2">
                Comfortable 3-row seating with dedicated rear AC vents. Great value for medium families.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 text-sm">Luxury SUV (Innova Crysta)</div>
              <div className="text-xs text-amber-800 font-semibold mt-0.5">6 to 7 Passengers</div>
              <p className="text-xs text-slate-600 mt-2">
                Premium comfort with captain seats, superior legroom, and effortless highway cruising.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 text-sm">Tempo Traveller (12/17/26 Seats)</div>
              <div className="text-xs text-amber-800 font-semibold mt-0.5">8 to 26 Passengers</div>
              <p className="text-xs text-slate-600 mt-2">
                Pushback luxury seats, sound system, and generous luggage carrier for large community groups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ for Devotees (SEO Boosted) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            Planning Your Ujjain & Indore Tour
          </h2>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              How does Shiv Shakti Tour & Travels assist with Mahakaleshwar Bhasma Aarti?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We provide complete advance guidance on official Bhasma Aarti booking through the Shree Mahakaleshwar Temple Management Committee portal. On the day of your Aarti (approx. 4:00 AM), our private cab picks you up from your hotel on time and coordinates entry through Gate No. 4 and Gate No. 5 with appropriate traditional dress guidance (Dhoti/Kurta for men and Saree for women).
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Can our tour start directly from Indore Airport or Railway Station?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Yes, absolutely. Devi Ahilyabai Holkar International Airport (IDR) and Indore Junction Railway Station are our primary pickup points. Your assigned chauffeur will be stationed at the arrival gate with a name placard to assist with luggage and take you directly into your comfortable AC cab.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Are the meals included in the package strictly vegetarian?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Yes, 100%. All breakfasts, lunches, and dinners included in our pilgrimage packages are served at reputable pure vegetarian restaurants. We also accommodate Jain (no onion, no garlic) food and fasting (Upvas/Vrat) meal requests upon prior notice.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              How do we book and do we need to pay in advance?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Booking is simple and fast. You can send us your dates and passenger count via WhatsApp or direct phone call at <strong>7999 353 101</strong>. We confirm vehicle and hotel availability with zero pressure, and provide transparent payment terms without online advance stress.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box - Warm, Trustworthy & Direct */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg border border-amber-800/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Ready for a Divine Experience?
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Connect With Our Travel Managers Today
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Get an instant customized quote for your family or group directly on WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`https://wa.me/${AGENCY_INFO.whatsapp}?text=${encodeURIComponent('Hello Shiv Shakti Tour & Travels! I visited your About Us page and want to discuss tour package options.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 text-sm"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chat on WhatsApp</span>
            </a>
            <button
              onClick={() => navigate('/packages')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3 rounded-xl border border-white/20 transition-all flex items-center gap-2 text-sm"
            >
              <span>View Packages</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={`tel:${AGENCY_INFO.phoneRaw}`}
              className="text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 px-3 py-2"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{AGENCY_INFO.phone}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
