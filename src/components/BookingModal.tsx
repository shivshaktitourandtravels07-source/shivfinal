import React, { useState } from 'react';
import { X, Calendar, User, Phone, Users, MapPin, Send, CheckCircle2, MessageCircle } from 'lucide-react';
import { TourPackage, BookingInquiry } from '../types';
import { AGENCY_INFO } from '../data/packagesData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: TourPackage | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, selectedPackage }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    travelDate: '',
    numberOfPersons: 2,
    pickupLocation: 'Indore Airport / Railway Station',
    specialRequests: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const buildWhatsAppText = () => {
    return `Namaste Shiv Shakti Tour & Travels!
I want to book the following tour:
*Package:* ${selectedPackage?.title || 'Indore & Ujjain Darshan Package'}
*Duration:* ${selectedPackage?.duration || 'Tour Package'}
*Price:* ₹${selectedPackage?.pricePerPerson || 6499}/person
*Customer Name:* ${formData.customerName || 'Devotee'}
*Contact No.:* ${formData.phone}
*Travel Date:* ${formData.travelDate || 'Flexible'}
*Number of Persons:* ${formData.numberOfPersons}
*Pickup Point:* ${formData.pickupLocation}
${formData.specialRequests ? `*Special Request:* ${formData.specialRequests}\n` : ''}
Please confirm cab & hotel availability.`;
  };

  const openWhatsAppDirectly = () => {
    const text = buildWhatsAppText();
    const url = `https://wa.me/${AGENCY_INFO.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: Partial<BookingInquiry> = {
        packageId: selectedPackage?.id,
        packageName: selectedPackage?.title || 'Custom Tour Inquiry',
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        travelDate: formData.travelDate,
        numberOfPersons: Number(formData.numberOfPersons),
        pickupLocation: formData.pickupLocation,
        specialRequests: formData.specialRequests
      };

      // Save inquiry in backend records
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setSubmitted(true);
      // Immediately open WhatsApp with the details
      openWhatsAppDirectly();
    } catch (err) {
      console.error('Error sending inquiry:', err);
      setSubmitted(true);
      openWhatsAppDirectly();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs uppercase font-bold text-amber-400">
            <span>Shiv Shakti Tour & Travels</span>
            <span>•</span>
            <span className="text-emerald-400">WhatsApp Booking</span>
          </div>
          <h3 className="text-xl font-bold mt-1 text-white">
            {submitted ? 'Booking Details Sent!' : (selectedPackage ? `Book: ${selectedPackage.duration}` : 'Tour Package Inquiry')}
          </h3>
          {selectedPackage && (
            <p className="text-xs text-slate-300 mt-1 line-clamp-1">
              {selectedPackage.title} (₹{selectedPackage.pricePerPerson}/person)
            </p>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                Booking Request Sent on WhatsApp!
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                Your tour inquiry has been saved and your WhatsApp chat was initiated. Our travel manager is waiting to assist you with dates, vehicle allocation, and Bhasma Aarti slots.
              </p>
              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  onClick={openWhatsAppDirectly}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Open WhatsApp Chat Again</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full text-slate-500 hover:text-slate-800 text-xs font-semibold py-2"
                >
                  Done & Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Quick WhatsApp Direct Banner */}
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="text-xs text-emerald-950">
                  <span className="font-bold block text-emerald-900">Direct WhatsApp Booking</span>
                  <span>Instant confirmation on WhatsApp with no online advance payment</span>
                </div>
                <button
                  type="button"
                  onClick={openWhatsAppDirectly}
                  className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>Direct Chat</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp / Mobile *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Planned Travel Date *</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      required
                      value={formData.travelDate}
                      onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Number of Persons</label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={formData.numberOfPersons}
                      onChange={(e) => setFormData({ ...formData, numberOfPersons: Number(e.target.value) })}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 bg-white"
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 Persons</option>
                      <option value="3">3 Persons</option>
                      <option value="4">4 Persons</option>
                      <option value="5">5 Persons</option>
                      <option value="6">6 Persons (Group Discount)</option>
                      <option value="8">Large Group (7+ Persons)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup Location</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={formData.pickupLocation}
                    onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 bg-white"
                  >
                    <option value="Indore Airport (IDR)">Indore Airport (IDR)</option>
                    <option value="Indore Railway Station">Indore Railway Station</option>
                    <option value="Ujjain Junction (UJN)">Ujjain Junction (UJN)</option>
                    <option value="Hotel in Indore">Hotel in Indore</option>
                    <option value="Hotel in Ujjain">Hotel in Ujjain</option>
                    <option value="Other Location">Other Location</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Special Requirements (Optional)</label>
                <input
                  type="text"
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  placeholder="Need Bhasma Aarti help, senior citizen doli, cab upgrade..."
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-sm disabled:opacity-50"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{loading ? 'Processing...' : 'Book via WhatsApp'}</span>
                </button>
                <p className="text-[11px] text-center text-slate-500 mt-2">
                  🔒 Free inquiry submission & immediate WhatsApp chat with travel manager.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
