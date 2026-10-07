import React, { useState, useEffect } from 'react';
import { TourPackage } from './types';
import { INITIAL_PACKAGES } from './data/packagesData';
import { getStoredPackages } from './services/packageStorage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { BookingModal } from './components/BookingModal';
import { HomePage } from './pages/HomePage';
import { PackagesListPage } from './pages/PackagesListPage';
import { PackageDetailPage } from './pages/PackageDetailPage';
import { DestinationPage } from './pages/DestinationPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { AdminPanel } from './pages/AdminPanel';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [packages, setPackages] = useState<TourPackage[]>(INITIAL_PACKAGES);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSelectedPackage, setBookingSelectedPackage] = useState<TourPackage | null>(null);

  // Load packages from Supabase / Server / LocalStorage
  const loadPackages = async (): Promise<TourPackage[]> => {
    try {
      const stored = await getStoredPackages(true);
      if (Array.isArray(stored)) {
        setPackages(stored);
        return stored;
      }
    } catch (err) {
      console.warn('Fallback to initial packages:', err);
    }
    return packages;
  };

  useEffect(() => {
    loadPackages();
  }, []);

  // Listen to browser navigation popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Router navigation helper
  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Open booking modal with specific or default package
  const handleOpenBooking = (pkg?: TourPackage) => {
    setBookingSelectedPackage(pkg || packages[0]);
    setBookingModalOpen(true);
  };

  // Select package to view its dedicated landing page
  const handleSelectPackage = (pkg: TourPackage) => {
    navigate(`/package/${pkg.slug}`);
  };

  // Determine which page to render based on URL pattern
  const renderCurrentView = () => {
    // 1. Package Detail Landing Page: /package/:slug, /packages/:slug, /:slug.html
    const isHtmlRoute = currentPath.endsWith('.html') && !currentPath.includes('index.html');
    const isPackagePrefix = currentPath.startsWith('/package/') || (currentPath.startsWith('/packages/') && currentPath !== '/packages');
    
    if (isPackagePrefix || isHtmlRoute) {
      let slug = currentPath
        .replace('/package/', '')
        .replace('/packages/', '')
        .replace(/^\//, '')
        .replace(/\.html$/, '');

      const matchedPkg = packages.find(p => p.slug === slug || p.id === slug || p.slug === slug + '-tour' || slug.includes(p.slug));
      if (matchedPkg) {
        document.title = `${matchedPkg.title} | Shiv Shakti Tour & Travels`;
        return (
          <PackageDetailPage
            pkg={matchedPkg}
            onBook={handleOpenBooking}
            navigate={navigate}
          />
        );
      }
    }

    // 2. Destination Landing Page: /destination/:slug
    if (currentPath.startsWith('/destination/')) {
      const destSlug = currentPath.replace('/destination/', '');
      const destTitles: Record<string, string> = {
        ujjain: 'Ujjain Mahakal Darshan Tour Packages & Guide | Bhasma Aarti Timings | Shiv Shakti Travels',
        omkareshwar: 'Omkareshwar Jyotirlinga Tour & Darshan Guide | Narmada Boating | Shiv Shakti Travels',
        indore: 'Indore Sightseeing & City Tour Packages | Rajwada, Lal Bagh, 56 Dukan | Shiv Shakti Travels',
        maheshwar: 'Maheshwar Ahilya Fort Tour & Narmada Boating Guide | Tour Packages | Shiv Shakti Travels',
        mandu: 'Mandu Tourism & Jahaz Mahal Sightseeing Tour Package | Shiv Shakti Travels'
      };
      document.title = destTitles[destSlug] || `${destSlug.toUpperCase()} Tour & Pilgrimage Guide | Shiv Shakti Tour & Travels`;
      return (
        <DestinationPage
          destinationSlug={destSlug}
          packages={packages}
          onSelectPackage={handleSelectPackage}
          onBookPackage={handleOpenBooking}
          navigate={navigate}
        />
      );
    }

    // 3. All Packages List: /packages
    if (currentPath === '/packages') {
      document.title = 'Ujjain Mahakal Tour Packages & Price List 2026 | Shiv Shakti Travels';
      return (
        <PackagesListPage
          packages={packages}
          onSelectPackage={handleSelectPackage}
          onBookPackage={handleOpenBooking}
          navigate={navigate}
        />
      );
    }

    // 4. Contact Page: /contact
    if (currentPath === '/contact') {
      document.title = 'Contact Shiv Shakti Tour & Travels | Ujjain & Indore Office Phone 7999 353 101';
      return <ContactPage />;
    }

    // 5. About Us Page: /about
    if (currentPath === '/about') {
      document.title = 'Best Tour & Travel Agency in Ujjain & Indore | Shiv Shakti Tour & Travels';
      return <AboutPage navigate={navigate} />;
    }

    // 6. Admin Panel: /admin
    if (currentPath === '/admin') {
      document.title = 'Admin Portal | Shiv Shakti Tour & Travels';
      return (
        <AdminPanel
          packages={packages}
          onRefreshPackages={loadPackages}
          navigate={navigate}
        />
      );
    }

    // Default: Home Page
    document.title = 'Ujjain Tour Packages | Indore to Ujjain Mahakal Darshan Cab | Shiv Shakti Travels';
    return (
      <HomePage
        packages={packages}
        onSelectPackage={handleSelectPackage}
        onBookPackage={handleOpenBooking}
        navigate={navigate}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-200 selection:text-amber-950">
      <Header currentPath={currentPath} navigate={navigate} />
      
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      <Footer navigate={navigate} />

      {/* Instant Action Floaters */}
      <FloatingActions />

      {/* Quick Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        selectedPackage={bookingSelectedPackage}
      />
    </div>
  );
}
