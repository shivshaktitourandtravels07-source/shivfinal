import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PACKAGES, DESTINATIONS_DATA, AGENCY_INFO } from './src/data/packagesData';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Admin authentication password requested by user
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Shubham@123';

// Increase payload limit for uploading package photos
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static assets from public folder (including /hero, /uploads, etc.)
app.use(express.static(path.join(process.cwd(), 'public')));

const DATA_DIR = path.join(process.cwd(), 'data');
const PACKAGES_FILE = path.join(DATA_DIR, 'packages.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Default office branch settings & hero cover image (Editable from Admin Panel)
const DEFAULT_SETTINGS = {
  homeHero: {
    coverImage: '/hero/slide1.jpg',
    heading: 'Indore & Ujjain Darshan & Tour Packages',
    subheading: 'Experience divine spiritual bliss across Madhya Pradesh’s revered Jyotirlingas: Shree Mahakaleshwar Bhasma Aarti (Ujjain) and Holy Omkareshwar (Narmada Island), together with Queen Ahilyabai’s sacred Maheshwar Ahilya Fort and Indore Heritage. Complete packages with sanitized cabs, deluxe hotels, and pure vegetarian dining.',
    slides: [
      { id: 'slide-1', title: 'Shree Mahakaleshwar Jyotirlinga, Ujjain', subtitle: 'Sacred Bhasma Aarti, Mahakal Lok Corridor & Shipra Ram Ghat', image: '/hero/slide1.jpg' },
      { id: 'slide-2', title: 'Holy Omkareshwar Jyotirlinga & Narmada River', subtitle: 'Divine Island Pilgrimage, Mamleshwar Mahadev & Sacred Boat Ride', image: '/hero/slide2.jpg' },
      { id: 'slide-3', title: 'Royal Maheshwar Fort & Sacred Ahilya Ghat', subtitle: 'Ahilya Fort, Ahileshwar Mandir, Sahastradhara & Rehwa Handlooms', image: '/hero/slide3.jpg' },
      { id: 'slide-4', title: 'Historic Rajwada Palace & Indore City Heritage', subtitle: 'Rajwada Palace, Lal Bagh, 56 Dukan & Midnight Sarafa Street Food', image: '/hero/slide4.jpg' },
      { id: 'slide-5', title: 'Mandu Jahaz Mahal & Heritage Monuments', subtitle: 'Jahaz Mahal, Hindola Mahal, Baz Bahadur & Rani Roopmati Pavilion', image: '/hero/slide5.jpg' }
    ]
  },
  ujjainOffice: {
    title: 'Ujjain Pilgrimage Branch (Nanakheda Hub)',
    address: 'A-5/15 Mahakal Vanijya Kendra, Nanakheda, Ujjain, Madhya Pradesh 456010',
    contactPerson: 'Branch Manager / Mahakal Darshan Desk',
    phone: '7999 353 101',
    timing: '24x7 Available for Mahakal Bhasma Aarti & Darshan',
    landmark: 'Near Nanakheda Bus Stand, Ujjain',
    mapUrl: 'https://maps.google.com/?q=Mahakal+Vanijya+Kendra+Nanakheda+Ujjain'
  },
  indoreOffice: {
    title: 'Indore Head Branch (Airport & Station Hub)',
    address: '220, Surya Appartment Usha Nagar, Near Ranjeet Hanuman Mandir Indore',
    contactPerson: 'Operations Head / Fleet Incharge',
    phone: '7999 353 101',
    timing: '06:00 AM to 11:30 PM (All 7 Days Open)',
    landmark: 'Near Ranjeet Hanuman Mandir, Usha Nagar, Indore',
    mapUrl: 'https://maps.google.com/?q=Ranjeet+Hanuman+Mandir+Indore'
  }
};

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Ensure packages.json exists
if (!fs.existsSync(PACKAGES_FILE)) {
  fs.writeFileSync(PACKAGES_FILE, JSON.stringify(INITIAL_PACKAGES, null, 2), 'utf-8');
}

// Ensure inquiries.json exists
if (!fs.existsSync(INQUIRIES_FILE)) {
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// Ensure settings.json exists
if (!fs.existsSync(SETTINGS_FILE)) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
}

// Helper to read packages
function readPackages() {
  try {
    const raw = fs.readFileSync(PACKAGES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return INITIAL_PACKAGES;
  }
}

// Helper to write packages
function writePackages(data: any) {
  fs.writeFileSync(PACKAGES_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Helper to read inquiries
function readInquiries() {
  try {
    const raw = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Helper to write inquiries
function writeInquiries(data: any) {
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Helper to read settings
function readSettings() {
  try {
    const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      homeHero: {
        ...DEFAULT_SETTINGS.homeHero,
        ...(parsed.homeHero || {})
      }
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

// Helper to write settings
function writeSettings(data: any) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ---------------- API ENDPOINTS ----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Admin authentication endpoint
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    // Return token
    res.json({
      success: true,
      token: 'sst_admin_authorized_' + Buffer.from(ADMIN_PASSWORD).toString('base64'),
      message: 'Admin authentication successful'
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid Admin Password. Please enter correct password.' });
  }
});

// Admin verify token
app.post('/api/admin/verify', (req, res) => {
  const { token } = req.body;
  const expectedToken = 'sst_admin_authorized_' + Buffer.from(ADMIN_PASSWORD).toString('base64');
  if (token === expectedToken) {
    res.json({ valid: true });
  } else {
    res.status(401).json({ valid: false });
  }
});

// GET all packages
app.get('/api/packages', (req, res) => {
  const packages = readPackages();
  res.json(packages);
});

// GET package by slug or id
app.get('/api/packages/:slug', (req, res) => {
  const { slug } = req.params;
  const packages = readPackages();
  const found = packages.find((p: any) => p.slug === slug || p.id === slug);
  if (!found) {
    return res.status(404).json({ error: 'Package not found' });
  }
  res.json(found);
});

// POST create package
app.post('/api/packages', (req, res) => {
  const packages = readPackages();
  const newPkg = {
    ...req.body,
    id: req.body.id || `pkg-${Date.now()}`,
    slug: req.body.slug || `package-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  packages.push(newPkg);
  writePackages(packages);
  res.status(201).json(newPkg);
});

// PUT update package
app.put('/api/packages/:id', (req, res) => {
  const { id } = req.params;
  const packages = readPackages();
  const index = packages.findIndex((p: any) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Package not found' });
  }
  packages[index] = { ...packages[index], ...req.body, updatedAt: new Date().toISOString() };
  writePackages(packages);
  res.json(packages[index]);
});

// DELETE package
app.delete('/api/packages/:id', (req, res) => {
  const { id } = req.params;
  const packages = readPackages();
  const filtered = packages.filter((p: any) => p.id !== id);
  writePackages(filtered);
  res.json({ success: true, message: 'Package deleted successfully' });
});

// POST upload photo directly to host folder /public/uploads/
app.post('/api/upload', async (req, res) => {
  try {
    const { data, filename } = req.body;
    if (!data) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Extract base64 safely
    let buffer: Buffer;
    let ext = 'jpg';
    const commaIndex = data.indexOf(',');

    if (commaIndex !== -1) {
      const header = data.substring(0, commaIndex);
      const base64Content = data.substring(commaIndex + 1);
      if (header.includes('png')) ext = 'png';
      else if (header.includes('webp')) ext = 'webp';
      else if (header.includes('gif')) ext = 'gif';
      else if (header.includes('svg')) ext = 'svg';
      else ext = 'jpg';
      buffer = Buffer.from(base64Content, 'base64');
    } else {
      buffer = Buffer.from(data, 'base64');
    }

    const baseName = filename ? path.parse(filename).name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase() : 'photo';
    const finalFilename = `${Date.now()}_${baseName}.${ext}`;
    const targetPath = path.join(UPLOADS_DIR, finalFilename);

    await fs.promises.writeFile(targetPath, buffer);

    const publicUrl = `/uploads/${finalFilename}`;
    res.json({ success: true, url: publicUrl, filename: finalFilename });
  } catch (err: any) {
    console.error('Error saving image upload:', err);
    res.status(500).json({ error: 'Failed to upload photo: ' + err.message });
  }
});

// GET all uploaded photos
app.get('/api/uploads', (req, res) => {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      return res.json([]);
    }
    const files = fs.readdirSync(UPLOADS_DIR);
    const photos = files
      .filter(f => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f))
      .map(f => ({
        filename: f,
        url: `/uploads/${f}`,
        time: fs.statSync(path.join(UPLOADS_DIR, f)).mtimeMs
      }))
      .sort((a, b) => b.time - a.time);
    res.json(photos);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to list uploads: ' + err.message });
  }
});

// DELETE uploaded photo
app.delete('/api/uploads/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const sanitized = path.basename(filename);
    const targetPath = path.join(UPLOADS_DIR, sanitized);
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
      res.json({ success: true, message: 'Photo deleted successfully' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete photo: ' + err.message });
  }
});

// GET all inquiries (Saved in /data/inquiries.json)
app.get('/api/inquiries', (req, res) => {
  const inquiries = readInquiries();
  res.json(inquiries);
});

// POST new booking inquiry
app.post('/api/inquiries', (req, res) => {
  const inquiries = readInquiries();
  const newInquiry = {
    ...req.body,
    id: `inq-${Date.now()}`,
    status: 'new',
    createdAt: new Date().toISOString()
  };
  inquiries.unshift(newInquiry);
  writeInquiries(inquiries);
  res.status(201).json(newInquiry);
});

// PUT update inquiry status
app.put('/api/inquiries/:id', (req, res) => {
  const { id } = req.params;
  const inquiries = readInquiries();
  const index = inquiries.findIndex((i: any) => i.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }
  inquiries[index] = { ...inquiries[index], ...req.body };
  writeInquiries(inquiries);
  res.json(inquiries[index]);
});

// Export inquiries to CSV for Excel download
app.get('/api/inquiries/export-csv', (req, res) => {
  const inquiries = readInquiries();
  const headers = ['ID', 'Customer Name', 'Phone', 'Package', 'Persons', 'Travel Date', 'Pickup', 'Status', 'Date Submitted'];
  const rows = inquiries.map((inq: any) => [
    `"${inq.id || ''}"`,
    `"${(inq.customerName || '').replace(/"/g, '""')}"`,
    `"${inq.phone || ''}"`,
    `"${(inq.packageName || '').replace(/"/g, '""')}"`,
    `"${inq.numberOfPersons || 1}"`,
    `"${inq.travelDate || ''}"`,
    `"${(inq.pickupLocation || '').replace(/"/g, '""')}"`,
    `"${inq.status || 'new'}"`,
    `"${inq.createdAt || ''}"`
  ]);
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="inquiries_export.csv"');
  res.send(csvContent);
});

// GET settings (Branch addresses for Ujjain & Indore)
app.get('/api/settings', (req, res) => {
  const settings = readSettings();
  res.json(settings);
});

// PUT update settings (Office addresses editable from Admin Panel)
app.put('/api/settings', (req, res) => {
  const current = readSettings();
  const updated = {
    ...current,
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  writeSettings(updated);
  res.json({ success: true, settings: updated, message: 'Branch office addresses updated successfully' });
});

// Static serve for uploads directory
app.use('/uploads', express.static(UPLOADS_DIR));

// Direct SEO Static HTML serving for all 6 tour packages
app.get(['/package/:slug', '/packages/:slug', '/:slug.html', '/package/:slug.html'], (req, res, next) => {
  // If explicitly requested via API or assets, skip
  if (req.path.startsWith('/api') || req.path.startsWith('/assets') || req.path.startsWith('/hero')) {
    return next();
  }

  const rawSlug = req.params.slug || req.path.replace(/^\//, '').replace(/\.html$/, '').replace(/^package\//, '').replace(/^packages\//, '');
  const cleanSlug = rawSlug.split('?')[0].replace(/\.html$/, '');
  
  const publicDir = path.join(process.cwd(), 'public');
  const possiblePaths = [
    path.join(publicDir, `${cleanSlug}.html`),
    path.join(publicDir, 'package', `${cleanSlug}.html`),
    path.join(publicDir, 'packages', `${cleanSlug}.html`),
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }

  next();
});

// Helper to generate SEO metadata for any route
function getPageSeoMeta(urlPath: string) {
  const packages = readPackages();

  if (urlPath.startsWith('/package/')) {
    const slug = urlPath.replace('/package/', '').split('?')[0];
    const pkg = packages.find((p: any) => p.slug === slug || p.id === slug);
    if (pkg) {
      return {
        title: `${pkg.title} | Shiv Shakti Tour & Travels (₹${pkg.pricePerPerson})`,
        description: pkg.metaDescription || `${pkg.title} - ${pkg.tagline}. All-inclusive tour with AC Cab, Super Deluxe Hotel, VIP Darshan & meals. Call 7999 353 101.`,
        keywords: pkg.seoKeywords ? pkg.seoKeywords.join(', ') : 'Ujjain tour, Mahakal darshan, Omkareshwar package, Indore tour',
        ogTitle: `${pkg.title} - Shiv Shakti Tour & Travels`,
        ogDescription: `Book ${pkg.duration} pilgrimage at ₹${pkg.pricePerPerson}/person. Includes VIP Mahakaleshwar darshan, hotel & AC cab.`,
        schema: {
          "@context": "https://schema.org",
          "@type": "TouristTrip",
          "name": pkg.title,
          "description": pkg.overview,
          "touristType": ["Pilgrim", "Family", "Cultural"],
          "offers": {
            "@type": "Offer",
            "price": pkg.pricePerPerson,
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock"
          },
          "provider": {
            "@type": "TravelAgency",
            "name": AGENCY_INFO.name,
            "telephone": "+91-7999353101",
            "address": AGENCY_INFO.address
          }
        }
      };
    }
  }

  if (urlPath.startsWith('/destination/ujjain')) {
    return {
      title: 'Ujjain Tour Packages & Mahakaleshwar Darshan Guide | Shiv Shakti Tour & Travels',
      description: 'Book comprehensive Ujjain tour packages. Shree Mahakaleshwar Jyotirlinga VIP darshan, Bhasma Aarti guidance, Kaal Bhairav, Ram Ghat Shipra Aarti & AC cabs.',
      keywords: 'Ujjain tour package, Mahakal darshan package, Ujjain pilgrimage tour, Ujjain travel agency 7999353101',
      ogTitle: 'Ujjain Tour & Mahakaleshwar Darshan Packages',
      ogDescription: 'Experience divine Ujjain with VIP darshan, luxury AC cabs and super deluxe hotel stays.'
    };
  }

  if (urlPath.startsWith('/destination/indore')) {
    return {
      title: 'Indore Sightseeing & Food Tour Packages | Rajwada, 56 Dukan, Lal Bagh',
      description: 'Explore the best of Indore heritage with Shiv Shakti Tour & Travels. Rajwada Palace, Lal Bagh, Sarafa Night Market, 56 Dukan & Kanch Mandir.',
      keywords: 'Indore tour packages, Indore sightseeing cab, Indore travel agency, Rajwada tour, 56 dukan tour',
      ogTitle: 'Indore Heritage & City Tour Packages',
      ogDescription: 'Explore royal Holkar palaces and world-famous culinary streets with dedicated comfortable cab service.'
    };
  }

  if (urlPath.startsWith('/destination/omkareshwar')) {
    return {
      title: 'Omkareshwar Jyotirlinga & Mamleshwar Tour Package | Shiv Shakti Tour & Travels',
      description: 'Book Omkareshwar Jyotirlinga tour package from Indore and Ujjain. Includes sacred Narmada boat ride, Mamleshwar darshan & comfortable transport.',
      keywords: 'Omkareshwar tour package, Omkareshwar jyotirlinga from Indore, Mamleshwar mahadev tour, Omkareshwar taxi',
      ogTitle: 'Omkareshwar Jyotirlinga Tour Packages',
      ogDescription: 'Sacred island pilgrimage with Narmada boat ride, Mamleshwar Mahadev and dedicated comfortable transfers.'
    };
  }

  if (urlPath === '/packages') {
    return {
      title: 'All Tour Packages in Ujjain & Indore | 2D/1N & 3D/2N Rates | Shiv Shakti Tour & Travels',
      description: 'Compare all pilgrimage and heritage tour packages in Ujjain, Omkareshwar, and Indore starting at ₹6,499. Transparent pricing, luxury cabs & VIP darshan.',
      keywords: 'Ujjain packages, Indore packages, Mahakal 2 days package, MP tourism packages',
      ogTitle: 'Pilgrimage & Heritage Tour Packages - Ujjain & Indore',
      ogDescription: 'Compare verified 2D/1N, 3D/2N & 1-day tours for Mahakal, Omkareshwar and Indore.'
    };
  }

  if (urlPath === '/about') {
    return {
      title: 'About Us | Shiv Shakti Tour & Travels - Indore & Ujjain Pilgrimage Specialist',
      description: 'Learn about Shiv Shakti Tour & Travels. 12+ years of providing trusted pilgrimage packages for Shree Mahakaleshwar Jyotirlinga, Omkareshwar, and Indore heritage tours. 25,000+ satisfied pilgrims.',
      keywords: 'about Shiv Shakti Tour Travels, top travel agency Ujjain, best tour operator Indore, trusted Mahakal tour company, Mahakal darshan tour agency',
      ogTitle: 'About Us | Shiv Shakti Tour & Travels - Ujjain & Indore',
      ogDescription: '12+ years of devoted service, 25,000+ happy pilgrims. VIP Darshan assistance, sanitized AC cabs, deluxe hotel stays, and pure veg meals.',
      schema: {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "About Shiv Shakti Tour & Travels",
        "description": "Premier pilgrimage tour operator based in Ujjain and Indore, specializing in Mahakaleshwar VIP Darshan, Omkareshwar Jyotirlinga, and Malwa heritage circuits.",
        "publisher": {
          "@type": "TravelAgency",
          "name": "Shiv Shakti Tour & Travels",
          "telephone": "+91-7999353101",
          "email": "shivshaktitourtravels7999@gmail.com"
        }
      }
    };
  }

  if (urlPath === '/contact') {
    return {
      title: 'Contact Shiv Shakti Tour & Travels | Call 7999 353 101 | Ujjain & Indore Offices',
      description: 'Contact Shiv Shakti Tour & Travels for tour bookings and customized itineraries. Offices at Nanakheda Ujjain and Usha Nagar Near Ranjeet Hanuman Mandir Indore.',
      keywords: 'contact Shiv Shakti Tour Travels, travel agent phone Ujjain, travel agency number 7999353101',
      ogTitle: 'Contact Shiv Shakti Tour & Travels',
      ogDescription: 'Call 7999 353 101 or message on WhatsApp for customized tour plans.'
    };
  }

  // Default Home Page SEO
  return {
    title: 'Shiv Shakti Tour & Travels | Indore & Ujjain Darshan Tour Packages',
    description: 'Premier travel agency for Ujjain Mahakaleshwar VIP Darshan, Omkareshwar Jyotirlinga, and Indore heritage sightseeing. 2D/1N & 3D/2N all-inclusive packages.',
    keywords: 'Ujjain tour packages, Mahakal darshan package, Omkareshwar Jyotirlinga tour, Indore sightseeing cab, Shiv Shakti Tour and Travels',
    ogTitle: 'Shiv Shakti Tour & Travels | Indore & Ujjain Pilgrimage Packages',
    ogDescription: 'All-inclusive divine tours with VIP darshan assistance, super deluxe hotels, pure veg meals, and dedicated AC cabs.'
  };
}

// ---------------- VITE & PRODUCTION SERVING ----------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    // Vite handles client assets, scripts, HMR and index.html in development
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const indexPath = path.join(distPath, 'index.html');

    app.use('/assets', express.static(path.join(distPath, 'assets')));
    app.use('*/assets', (req, res, next) => {
      const assetFile = req.path.replace(/^.*\//, '');
      const fullPath = path.join(distPath, 'assets', assetFile);
      if (fs.existsSync(fullPath)) {
        return res.sendFile(fullPath);
      }
      next();
    });
    app.use(express.static(distPath, { index: false }));

    app.get('*', (req, res) => {
      let baseHtml = '';
      try {
        baseHtml = fs.readFileSync(indexPath, 'utf-8');
      } catch {
        return res.status(404).send('Not found');
      }

      const seo = getPageSeoMeta(req.url);
      let pageHtml = baseHtml
        .replace(/<title>.*?<\/title>/, `<title>${seo.title}</title>`)
        .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${seo.description}" />`)
        .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${seo.ogTitle}" />`)
        .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${seo.ogDescription}" />`);

      if (seo.schema) {
        const schemaTag = `\n    <script type="application/ld+json">${JSON.stringify(seo.schema)}</script>`;
        pageHtml = pageHtml.replace('</head>', `${schemaTag}\n  </head>`);
      }

      res.status(200).set({ 'Content-Type': 'text/html' }).send(pageHtml);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Shiv Shakti Tour & Travels Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
