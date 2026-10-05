import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AGENCY_INFO } from '../data/packagesData';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          phone: formData.phone,
          pickupLocation: formData.city || 'Indore/Ujjain',
          specialRequests: formData.message,
          packageName: 'General Contact Inquiry'
        })
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Contact Shiv Shakti Tour & Travels
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          We are available 24/7 to assist with your Ujjain Mahakal, Omkareshwar Jyotirlinga, and Indore tour bookings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Contact Information */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Direct Contact Card */}
          <div className="bg-gradient-to-br from-amber-900 to-amber-950 text-white rounded-3xl p-8 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                Direct Booking Helpline
              </span>
              <h2 className="text-2xl font-bold mt-1">
                {AGENCY_INFO.phone}
              </h2>
              <p className="text-xs text-amber-200/80 mt-1">
                Available 24 Hours • Quick Call or WhatsApp
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={`tel:${AGENCY_INFO.phoneRaw}`}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl shadow transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Call Us Now</span>
              </a>
              <a
                href={`https://wa.me/${AGENCY_INFO.whatsapp}?text=${encodeURIComponent('Hello Shiv Shakti Tour & Travels, I need assistance with a tour package.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl shadow transition-colors text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            <div className="pt-4 border-t border-amber-800/80 space-y-3 text-xs text-amber-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Office Hours: 24/7 Everyday</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{AGENCY_INFO.email}</span>
              </div>
            </div>
          </div>

          {/* Offices List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Our Locations
            </h3>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-xs mb-0.5">Ujjain Head Office:</strong>
                  <span>{AGENCY_INFO.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-xs mb-0.5">Indore Branch Office:</strong>
                  <span>{AGENCY_INFO.indoreOffice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Message / Callback Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Message Received!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to Shiv Shakti Tour & Travels. Our representative will contact you shortly on <strong>{formData.phone}</strong>.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-amber-800 text-white rounded-xl text-xs font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold font-serif text-slate-900">
                    Send Us an Inquiry
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill in your contact details and our team will get back to you with custom pricing and dates.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 7999353101"
                      className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your City / State</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Delhi, Mumbai, Ahmedabad"
                      className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Requirement / Questions</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about the number of persons, preferred dates, temple darshan priorities, or hotel preferences..."
                    className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting...' : 'Send Inquiry Now'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
