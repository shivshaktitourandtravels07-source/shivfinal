export interface ItineraryDay {
  day: number;
  title: string;
  subtitle: string;
  places: string[];
  description: string;
  mealsIncluded: string;
  stayLocation: string;
}

export interface TourPackage {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  duration: string;
  daysCount: number;
  nightsCount: number;
  pricePerPerson: number;
  originalPrice?: number;
  suitableFor?: string;
  badge?: string;
  featured: boolean;
  coverImage: string;
  galleryImages: string[];
  overview: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  cancellationPolicy: string;
  seoKeywords: string[];
  metaDescription: string;
}

export interface BookingInquiry {
  id: string;
  packageId?: string;
  packageName?: string;
  customerName: string;
  phone: string;
  email?: string;
  travelDate: string;
  numberOfPersons: number;
  pickupLocation: string;
  specialRequests?: string;
  status: 'new' | 'contacted' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface DestinationInfo {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  heroImage: string;
  description: string;
  topAttractions: {
    name: string;
    description: string;
    image: string;
    timings?: string;
  }[];
  bestTimeToVisit: string;
  howToReach: string;
  travelTips: string[];
}

export interface OfficeBranch {
  title: string;
  address: string;
  contactPerson: string;
  phone: string;
  timing: string;
  landmark: string;
  mapUrl: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
}

export interface HomeHeroSettings {
  coverImage?: string;
  heading?: string;
  subheading?: string;
  slides?: HeroSlide[];
}

export interface AgencySettings {
  homeHero?: HomeHeroSettings;
  ujjainOffice: OfficeBranch;
  indoreOffice: OfficeBranch;
}
