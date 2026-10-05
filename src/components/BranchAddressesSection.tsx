import React, { useState, useEffect } from 'react';
import { MapPin, Phone, MessageCircle } from 'lucide-react';
import { AgencySettings } from '../types';

const DEFAULT_SETTINGS: AgencySettings = {
  ujjainOffice: {
    title: 'Ujjain Office',
    address: 'A-5/15 Mahakal Vanijya Kendra, Nanakheda, Ujjain, Madhya Pradesh 456010',
    contactPerson: '',
    phone: '7999 353 101',
    timing: '',
    landmark: 'Near Nanakheda Bus Stand, Ujjain',
    mapUrl: ''
  },
  indoreOffice: {
    title: 'Indore Office',
    address: '220, Surya Appartment Usha Nagar, Near Ranjeet Hanuman Mandir Indore',
    contactPerson: '',
    phone: '7999 353 101',
    timing: '',
    landmark: 'Near Ranjeet Hanuman Mandir, Usha Nagar',
    mapUrl: ''
  }
};

export const BranchAddressesSection: React.FC = () => {
  const [settings, setSettings] = useState<AgencySettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to load settings');
      })
      .then((data) => {
        if (data && data.ujjainOffice && data.indoreOffice) {
          setSettings(data);
        }
      })
      .catch(() => {
        // Fallback to default
      });
  }, []);

  const ujjain = settings.ujjainOffice;
  const indore = settings.indoreOffice;
  const ujjainPhone = ujjain.phone || '7999 353 101';
  const indorePhone = indore.phone || '7999 353 101';
  const rawUjjainPhone = ujjainPhone.replace(/\D/g, '') || '917999353101';
  const rawIndorePhone = indorePhone.replace(/\D/g, '') || '917999353101';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* 2 Simple Address Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Box 1: Ujjain Office */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-amber-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-amber-900">
              <MapPin className="w-5 h-5 text-amber-700 shrink-0" />
              <h3 className="text-lg font-bold text-slate-900">
                {ujjain.title || 'Ujjain Office'}
              </h3>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed pl-7">
              {ujjain.address}
            </p>
          </div>

          {/* Action Buttons: Call & WhatsApp */}
          <div className="grid grid-cols-2 gap-3 pt-6 mt-6 border-t border-slate-100">
            <a
              href={`tel:${rawUjjainPhone.startsWith('91') && rawUjjainPhone.length === 12 ? '+' + rawUjjainPhone : '+91' + rawUjjainPhone.slice(-10)}`}
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-amber-900 text-white font-bold text-xs sm:text-sm py-3 px-3 rounded-xl transition-colors shadow-xs"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Call: {ujjainPhone}</span>
            </a>

            <a
              href={`https://wa.me/${rawUjjainPhone.length === 10 ? '91' + rawUjjainPhone : rawUjjainPhone}?text=${encodeURIComponent(`Namaste Shiv Shakti Tour & Travels! I am inquiring about your Ujjain Office.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3 px-3 rounded-xl transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Box 2: Indore Office */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-slate-900">
              <MapPin className="w-5 h-5 text-amber-700 shrink-0" />
              <h3 className="text-lg font-bold text-slate-900">
                {indore.title || 'Indore Office'}
              </h3>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed pl-7">
              {indore.address}
            </p>
          </div>

          {/* Action Buttons: Call & WhatsApp */}
          <div className="grid grid-cols-2 gap-3 pt-6 mt-6 border-t border-slate-100">
            <a
              href={`tel:${rawIndorePhone.startsWith('91') && rawIndorePhone.length === 12 ? '+' + rawIndorePhone : '+91' + rawIndorePhone.slice(-10)}`}
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-amber-900 text-white font-bold text-xs sm:text-sm py-3 px-3 rounded-xl transition-colors shadow-xs"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Call: {indorePhone}</span>
            </a>

            <a
              href={`https://wa.me/${rawIndorePhone.length === 10 ? '91' + rawIndorePhone : rawIndorePhone}?text=${encodeURIComponent(`Namaste Shiv Shakti Tour & Travels! I am inquiring about your Indore Office.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3 px-3 rounded-xl transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
