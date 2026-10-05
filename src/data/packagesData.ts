import { TourPackage, DestinationInfo } from '../types';

// Curated Hero Background Slides for the spiritual sliding background
export const HERO_SLIDES = [
  {
    id: 'slide-1',
    title: 'Shree Mahakaleshwar Jyotirlinga, Ujjain',
    subtitle: 'Sacred Bhasma Aarti, Mahakal Lok Corridor & Shipra Ram Ghat',
    image: '/hero/slide1.jpg'
  },
  {
    id: 'slide-2',
    title: 'Holy Omkareshwar Jyotirlinga & Narmada River',
    subtitle: 'Divine Island Pilgrimage, Mamleshwar Mahadev & Sacred Boat Ride',
    image: '/hero/slide2.jpg'
  },
  {
    id: 'slide-3',
    title: 'Royal Maheshwar Fort & Sacred Ahilya Ghat',
    subtitle: 'Ahilya Fort, Ahileshwar Mandir, Sahastradhara & Rehwa Handlooms',
    image: '/hero/slide3.jpg'
  },
  {
    id: 'slide-4',
    title: 'Historic Rajwada Palace & Indore City Heritage',
    subtitle: 'Rajwada Palace, Lal Bagh, 56 Dukan & Midnight Sarafa Street Food',
    image: '/hero/slide4.jpg'
  },
  {
    id: 'slide-5',
    title: 'Mandu Jahaz Mahal & Heritage Monuments',
    subtitle: 'Jahaz Mahal, Hindola Mahal, Baz Bahadur & Rani Roopmati Pavilion',
    image: '/hero/slide5.jpg'
  }
];

export const INITIAL_PACKAGES: TourPackage[] = [
  {
    id: 'pkg-1d-ujjain-mahakal-special',
    slug: '1-day-ujjain-mahakal-darshan-day-tour',
    title: '1 Day Complete Ujjain Mahakaleshwar & Local Temples Excursion',
    tagline: 'Ideal for same-day pilgrims starting and returning to Indore or Ujjain with priority temple darshan.',
    duration: '1 Day (12-14 Hours)',
    daysCount: 1,
    nightsCount: 0,
    pricePerPerson: 3499,
    originalPrice: 4500,
    suitableFor: 'Day visitors, corporate travelers, pilgrims with short layover',
    badge: 'Same Day Special',
    featured: false,
    coverImage: '/packages/ujjain_mahakal_mandir.jpg',
    galleryImages: [
      '/packages/ujjain_mahakal_mandir.jpg',
      '/packages/ujjain_harsiddhi_mata.jpg',
      '/packages/ujjain_ram_ghat.jpg',
      '/packages/ujjain_mahakal_main.jpg'
    ],
    overview: 'Short on time? Experience the divine spiritual energy of Shree Mahakaleshwar Jyotirlinga, sacred Kaal Bhairav, Sandipani Ashram, Harsiddhi Mata Shaktipeeth, Bada Ganesh, Bharthari Gufa, and the evening Shipra Aarti at Ram Ghat with our punctual, comfortable dedicated sanitized cab service.',
    highlights: [
      'Dedicated Pickup and Drop from Indore Airport / Railway Station or Ujjain',
      'VIP Darshan guidance at Shree Mahakaleshwar & Kaal Bhairav',
      'Comprehensive Temple Circuit: Harsiddhi Mata, Bada Ganesh, Sandipani Ashram, Gadhkalika & Bharthari Gufa',
      'Evening Shipra River Deep Daan Aarti at Ram Ghat',
      'Authentic Pure Veg Malwi Lunch included',
      'Dedicated sanitized AC cab with experienced chauffeur'
    ],
    inclusions: [
      'Dedicated sanitized Cab for 12-14 hours including fuel & driver allowances',
      'VIP Darshan guidance at temples',
      'Pure Vegetarian Lunch and bottled mineral water',
      'All toll taxes, parking fees, and interstate permits',
      '24/7 telephonic pilgrimage assistance'
    ],
    exclusions: [
      'Special Bhasma Aarti official ticket booking fees (assistance provided)',
      'Personal expenses, donations, or camera tickets'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ujjain Divine Temple Circuit & Evening Shipra Aarti',
        subtitle: 'महाकाल मंदिर, सांदीपनि आश्रम, काल भैरव, गढ़कालिका, राम घाट, हरसिद्धि माता, बड़ा गणेश, भर्तृहरि गुफा',
        places: [
          'महाकाल मंदिर (Shree Mahakaleshwar Jyotirlinga & Mahakal Lok)',
          'शांदीपनि आश्रम (Sandipani Ashram - Sri Krishna Guru Hermitage)',
          'काल भैरव (Kaal Bhairav Temple - Guardian Deity)',
          'गढ़कालिका (Gadhkalika Temple - Revered by Kalidasa)',
          'राम घाट (Ram Ghat - Holy Shipra Snan & Evening Aarti)',
          'हरसिद्धि माता (Harsiddhi Mata Mandir - 51 Shaktipeeth)',
          'बड़ा गणेश मंदिर (Bada Ganesh Mandir - Ancient Astrological Shrine)',
          'भर्तृहरि गुफा (Bharthari Gufa - Ancient Meditation Caves)'
        ],
        description: 'Morning pickup from Indore/Ujjain airport or station. Head directly for holy darshan at Mahakaleshwar Jyotirlinga and explore Mahakal Lok. Visit Sandipani Ashram, Kaal Bhairav, Gadhkalika, Bada Ganesh, and Bharthari Gufa. In the evening, witness the divine Shipra Aarti at Ram Ghat and seek blessings at Harsiddhi Mata Mandir before evening drop.',
        mealsIncluded: 'Lunch',
        stayLocation: 'Same-day tour (No night stay)'
      }
    ],
    cancellationPolicy: 'Full refund if cancelled 24 hours prior to travel date.',
    seoKeywords: ['1 day Ujjain tour from Indore', 'Indore to Ujjain cab tour', 'Same day Mahakal darshan package', 'Ujjain temple tour 3499'],
    metaDescription: '1 Day Ujjain Mahakaleshwar Darshan Package at ₹3,499 per person. Dedicated cab, VIP darshan support, Kaal Bhairav, Harsiddhi Mata, and Ram Ghat Aarti.'
  },
  {
    id: 'pkg-2d1n-ujjain-omkareshwar',
    slug: '2-days-1-night-ujjain-omkareshwar-darshan',
    title: '2 Days 1 Night Divine Ujjain & Omkareshwar Jyotirlinga Darshan',
    tagline: 'Experience sacred Mahakaleshwar Bhasma Aarti, Kaal Bhairav, & Omkareshwar Island on the holy Narmada.',
    duration: '2 Days / 1 Night',
    daysCount: 2,
    nightsCount: 1,
    pricePerPerson: 6499,
    originalPrice: 7999,
    suitableFor: 'Family, Couples, Group of 2 to 6+ Persons',
    badge: 'Most Popular Divine Tour',
    featured: true,
    coverImage: '/packages/omkareshwar_narmada_temple.jpg',
    galleryImages: [
      '/packages/omkareshwar_narmada_temple.jpg',
      '/packages/ujjain_mahakal_mandir.jpg',
      '/packages/ujjain_harsiddhi_mata.jpg',
      '/packages/ujjain_ram_ghat.jpg',
      '/packages/ujjain_mahakal_main.jpg'
    ],
    overview: 'Embark on a sacred 2-day pilgrimage across two revered Jyotirlingas in Madhya Pradesh — Shree Mahakaleshwar in Ujjain and Omkareshwar on the holy Narmada River. Includes VIP Darshan facilitation, dedicated comfortable sanitized cab throughout, super deluxe accommodation, authentic meals, and a scenic holy boat ride.',
    highlights: [
      'VIP Darshan assistance at Shree Mahakaleshwar Jyotirlinga (Ujjain)',
      'VIP Darshan at Omkareshwar Jyotirlinga & Mamleshwar Mahadev',
      'Complete Ujjain Shrines: Sandipani Ashram, Kaal Bhairav, Gadhkalika, Harsiddhi Mata, Bada Ganesh, Bharthari Gufa & Ram Ghat',
      'Dedicated Chauffeur-Driven Cab for 2 Days (Indore/Ujjain pickup to drop)',
      '1 Night Super Deluxe Hotel stay with AC, geyser, & modern amenities',
      'Scenic Omkareshwar Boat Ride touching sacred Narmada sangam',
      'All Meals Included: Pure Veg Breakfast, Lunch, and Dinner'
    ],
    inclusions: [
      'VIP Darshan facilitation at Mahakaleshwar & Omkareshwar',
      '2 Days dedicated sanitized Cab (Sedan / Ertiga / Innova) with fuel & driver allowance',
      '1 Night stay in Super Deluxe Hotel (Double/Triple sharing as per group)',
      'All meals: 1 Breakfast, 2 Lunches, 1 Dinner (100% Pure Vegetarian Sattvik)',
      'Holy Boat ride in Omkareshwar on Narmada River',
      'All toll taxes, parking fees, interstate road permits, and driver charges',
      '24/7 on-ground assistance by local pilgrimage coordinator'
    ],
    exclusions: [
      'Train or flight tickets to Indore/Ujjain (Available on request)',
      'Special Bhasma Aarti official ticket booking fees (Assistance provided)',
      'Personal expenses, laundry, telephone calls, and camera fees',
      'Any extra sightseeing not mentioned in the confirmed itinerary'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Day 1: Ujjain Divine Temple Circuit & Evening Shipra Aarti',
        subtitle: 'महाकाल मंदिर, सांदीपनि आश्रम, काल भैरव, गढ़कालिका, राम घाट, हरसिद्धि माता, बड़ा गणेश, भर्तृहरि गुफा',
        places: [
          'महाकाल मंदिर (Shree Mahakaleshwar Jyotirlinga & Mahakal Lok)',
          'शांदीपनि आश्रम (Sandipani Ashram - Krishna-Sudama Gurukul)',
          'काल भैरव (Kaal Bhairav Temple - Guardian Deity)',
          'गढ़कालिका (Gadhkalika - Ancient Kalidasa Shrine)',
          'राम घाट (Ram Ghat - Shipra Snan & Evening Deep Daan Aarti)',
          'हरसिद्धि माता (Harsiddhi Mata Shaktipeeth with Deepstambhas)',
          'बड़ा गणेश मंदिर (Bada Ganesh Mandir - Huge Elephant-headed Deity)',
          'भर्तृहरि गुफा (Bharthari Gufa - Historic Meditation Caves)'
        ],
        description: 'Morning pickup from Indore/Ujjain airport or railway station. Check-in at hotel. Proceed for darshan at Shree Mahakaleshwar Jyotirlinga and explore Mahakal Lok. Visit Sandipani Ashram, Kaal Bhairav, Gadhkalika, Bada Ganesh, and Bharthari Gufa. In the evening, enjoy the mesmerizing Shipra Aarti at Ram Ghat followed by deep lighting at Harsiddhi Mata Mandir.',
        mealsIncluded: 'Lunch, Dinner',
        stayLocation: 'Super Deluxe Hotel, Ujjain'
      },
      {
        day: 2,
        title: 'Day 2: Omkareshwar & Mamleshwar Jyotirlinga Pilgrimage',
        subtitle: 'ओंकारेश्वर ज्योतिर्लिंग, ममलेश्वर महादेव, शनि मंदिर, नर्मदा बोटिंग',
        places: [
          'ओंकारेश्वर ज्योतिर्लिंग (Omkareshwar Mandhata Island Shrine)',
          'ममलेश्वर महादेव (Mamleshwar Mahadev - Amareshwar Ancient Lingam)',
          'शनि मंदिर (Shani Mandir on Sacred Narmada Banks)',
          'पवित्र नर्मदा नदी बोट सफारी व संगम (Narmada River Holy Boat Ride)'
        ],
        description: 'Early breakfast and check-out. Drive to Omkareshwar on the holy Narmada River. Take a peaceful boat ride to the island temple. Experience darshan at Omkareshwar Jyotirlinga and Mamleshwar Mahadev. Visit Shani Mandir and Sangam. Conclude with comfortable evening drop at Indore or Ujjain.',
        mealsIncluded: 'Breakfast, Lunch',
        stayLocation: 'Tour concludes with drop at Indore/Ujjain'
      }
    ],
    cancellationPolicy: 'Free cancellation up to 48 hours before scheduled pickup. 50% refund within 24-48 hours.',
    seoKeywords: ['Ujjain 2 days tour package', 'Mahakaleshwar Omkareshwar package', 'Ujjain darshan cab price', 'Ujjain temple tour 6499', 'Omkareshwar jyotirlinga from Indore'],
    metaDescription: 'Book 2 Days 1 Night Ujjain & Omkareshwar Darshan Package at ₹6,499 per person. Includes Mahakal VIP Darshan, dedicated Cab, Super Deluxe Hotel, and Meals.'
  },
  {
    id: 'pkg-3d2n-ujjain-omkareshwar-maheshwar',
    slug: '3-days-2-nights-ujjain-omkareshwar-maheshwar-tour',
    title: '3 Days 2 Nights Divine Ujjain, Omkareshwar & Maheshwar Heritage Tour',
    tagline: 'Experience the holy Jyotirlingas, Queen Ahilyabai Maheshwar Fort, Narmada boat ride, Sahastradhara, and scenic Jam Gate pass.',
    duration: '3 Days / 2 Nights',
    daysCount: 3,
    nightsCount: 2,
    pricePerPerson: 8499,
    originalPrice: 10499,
    suitableFor: 'Families, Senior Citizens, Devotees, Cultural Explorers, Groups of 2 to 6+ Persons',
    badge: 'Signature Heritage Circuit',
    featured: true,
    coverImage: '/packages/maheshwar_ahilya_ghat.jpg',
    galleryImages: [
      '/packages/maheshwar_ahilya_ghat.jpg',
      '/packages/ujjain_mahakal_mandir.jpg',
      '/hero/slide2.jpg',
      '/packages/maheshwar_sahastradhara.jpg',
      '/packages/ujjain_harsiddhi_mata.jpg',
      '/packages/ujjain_ram_ghat.jpg'
    ],
    overview: 'Our flagship 3-day royal pilgrimage covers the sacred Jyotirlingas of Shree Mahakaleshwar and Omkareshwar together with Queen Ahilyabai’s historic capital Maheshwar. Experience iconic destinations: Ahilya Fort, Ahileshwar & Raj Rajeshwar Temples, holy Narmada boat ride, Sahastradhara, authentic Rehwa handloom weaving, and scenic Jam Gate with comfortable chauffeur transfers.',
    highlights: [
      'VIP Darshan at Shree Mahakaleshwar & Omkareshwar Jyotirlinga',
      'Complete Ujjain Shrines: Sandipani, Kaal Bhairav, Gadhkalika, Harsiddhi Mata, Bada Ganesh, Bharthari Gufa & Ram Ghat',
      'Ahilya Fort (Maheshwar Fort) & Royal Holkar Heritage',
      'Ahileshwar & Shri Raj Rajeshwar Temples',
      'Scenic Boat ride in Narmada River & River views at Ahilya Ghat',
      'Rehwa Society Handloom Heritage & authentic Maheshwari saree shopping',
      'Majestic Sahastradhara waterfall & scenic Jam Gate panoramic pass',
      '3 Days dedicated chauffeur-driven sanitized cab with fuel and all permits',
      '2 Nights Super Deluxe accommodation with all pure veg meals'
    ],
    inclusions: [
      'VVIP / Special Darshan facilitation at Mahakaleshwar & Omkareshwar',
      'Dedicated sanitized Cab for all 3 days (Pickup from Indore/Ujjain, all transfers, drop)',
      '2 Nights accommodation in Super Deluxe AC room',
      'Daily Breakfast, Lunch, and Dinner during the tour (100% Pure Veg)',
      'Scenic Boat ride in Narmada River at Maheshwar & Omkareshwar',
      'All toll taxes, parking fees, state road taxes, and chauffeur allowances',
      'Sightseeing permits and 24/7 dedicated tour manager guidance'
    ],
    exclusions: [
      'Airfare or train tickets to/from Indore or Ujjain',
      'Official Bhasma Aarti reservation fees (assistance provided)',
      'Personal shopping, camera charges, and laundry'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Day 1: Divine Ujjain Mahakal & Sacred Shrines Circuit',
        subtitle: 'महाकाल मंदिर, सांदीपनि आश्रम, काल भैरव, गढ़कालिका, राम घाट, हरसिद्धि माता, बड़ा गणेश, भर्तृहरि गुफा',
        places: [
          'महाकाल मंदिर (Shree Mahakaleshwar Jyotirlinga & Grand Mahakal Lok)',
          'शांदीपनि आश्रम (Sandipani Ashram - Krishna-Sudama Gurukul)',
          'काल भैरव (Kaal Bhairav Temple - Guardian deity of Ujjain)',
          'गढ़कालिका (Gadhkalika Temple - Shakti shrine of Kalidasa)',
          'राम घाट (Ram Ghat - Shipra holy dip and grand evening Aarti)',
          'हरसिद्धि माता (Harsiddhi Mata Mandir - 51 Shaktipeeth)',
          'बड़ा गणेश मंदिर (Bada Ganesh Mandir)',
          'भर्तृहरि गुफा (Bharthari Gufa - Ancient Meditation Caves)'
        ],
        description: 'Arrival at Indore/Ujjain. Head directly for holy VIP Darshan at Shree Mahakaleshwar Jyotirlinga and stroll across Mahakal Lok. Visit Sandipani Ashram, Kaal Bhairav, Gadhkalika, Bada Ganesh, and Bharthari Gufa. Evening Shipra River Aarti at Ram Ghat and blessings at Harsiddhi Mata Mandir.',
        mealsIncluded: 'Lunch, Dinner',
        stayLocation: 'Super Deluxe Hotel, Ujjain'
      },
      {
        day: 2,
        title: 'Day 2: Sacred Omkareshwar & Mamleshwar Jyotirlinga Pilgrimage',
        subtitle: 'ओंकारेश्वर ज्योतिर्लिंग, ममलेश्वर महादेव, शनि मंदिर, नर्मदा बोट सफारी',
        places: [
          'ओंकारेश्वर ज्योतिर्लिंग (Omkareshwar Island Shrine on Narmada)',
          'ममलेश्वर महादेव (Mamleshwar Mahadev - Amareshwar Ancient Shiva Shrine)',
          'शनि मंदिर (Shani Mandir on Narmada River Bank)',
          'पवित्र नर्मदा नदी बोट सफारी (Scenic Narmada River Cruise)'
        ],
        description: 'Post breakfast, drive across scenic Malwa landscapes to holy Omkareshwar. Board a private boat ride on sacred Narmada. Avail VIP Darshan at Omkareshwar and cross over to Mamleshwar Mahadev. Enjoy riverside lunch and visit Shani Mandir before driving to Maheshwar for night stay.',
        mealsIncluded: 'Breakfast, Lunch, Dinner',
        stayLocation: 'Super Deluxe Hotel, Maheshwar / Omkareshwar'
      },
      {
        day: 3,
        title: 'Day 3: Royal Maheshwar Fort, Ahilya Ghat, Sahastradhara & Jam Gate',
        subtitle: 'अहिल्या किला, अहिल्या घाट, अहिल्येश्वर मंदिर, सहस्त्रधारा, रेहवा हथकरघा, जाम गेट',
        places: [
          'अहिल्या किला (Ahilya Fort - Grand Maratha stone citadel)',
          'अहिल्येश्वर मंदिर (Ahilyeshwar & Shri Raj Rajeshwar Temples)',
          'अहिल्या घाट (Ahilya Ghat - Iconic holy steps and river views)',
          'सहस्त्रधारा (Sahastradhara - Thousand Streams rocky cascade)',
          'रेहवा हथकरघा (Rehwa Society - Authentic Maheshwari handloom weaving)',
          'पवित्र नर्मदा बोटिंग (Narmada River Boat Ride)',
          'जाम गेट (Jam Gate - Historic mountain pass with breathtaking views)'
        ],
        description: 'Explore the majestic Ahilya Fort on the banks of holy Narmada. Pay homage at the intricately carved Ahilyeshwar Temple, stroll along Ahilya Ghat, and take a peaceful boat ride. Visit Sahastradhara and Rehwa Society for handloom shopping. Pass through scenic Jam Gate with comfortable evening drop at Indore Airport / Station.',
        mealsIncluded: 'Breakfast, Lunch',
        stayLocation: 'Tour concludes with evening drop at Indore Airport / Station'
      }
    ],
    cancellationPolicy: 'Free cancellation up to 48 hours prior to journey. Flexible rescheduling without penalty.',
    seoKeywords: ['3 days 2 night Ujjain Maheshwar package', 'Maheshwar Ahilya fort tour', 'Omkareshwar Ujjain Maheshwar cab package', 'Jam Gate Sahastradhara tour'],
    metaDescription: 'Complete 3 Days 2 Nights Tour: Ujjain Mahakal, Omkareshwar, Ahilya Fort Maheshwar, Narmada boat ride, Sahastradhara & Jam Gate. Book with Shiv Shakti Tour & Travels.'
  },
  {
    id: 'pkg-3d2n-ujjain-omkareshwar-indore',
    slug: '3-days-2-nights-ujjain-omkareshwar-indore-city-tour',
    title: '3 Days 2 Nights Divine Ujjain, Omkareshwar & Indore City Tour',
    tagline: 'Experience 2 sacred Jyotirlingas, Ujjain ancient temples, Omkareshwar Narmada island, and royal Indore palaces with food street 56 Dukan.',
    duration: '3 Days / 2 Nights',
    daysCount: 3,
    nightsCount: 2,
    pricePerPerson: 8499,
    originalPrice: 10499,
    suitableFor: 'Families, Devotees, Couples, Food & Culture Enthusiasts (2 to 6+ Persons)',
    badge: 'Spiritual & City Special',
    featured: true,
    coverImage: '/packages/indore_rajwada_palace.jpg',
    galleryImages: [
      '/packages/indore_rajwada_palace.jpg',
      '/packages/ujjain_mahakal_mandir.jpg',
      '/hero/slide2.jpg',
      '/packages/indore_lal_bagh_palace.jpg',
      '/packages/indore_kanch_mandir.jpg',
      '/packages/indore_56_dukan.jpg',
      '/packages/indore_ranjeet_hanuman.jpg',
      '/packages/indore_khajrana_ganesh.jpg',
      '/packages/indore_annapurna_temple.jpg',
      '/packages/ujjain_harsiddhi_mata.jpg',
      '/packages/ujjain_ram_ghat.jpg'
    ],
    overview: 'The ideal 3-day pilgrimage and royal heritage tour connecting Shree Mahakaleshwar Jyotirlinga, holy Omkareshwar island on the Narmada River, and the vibrant clean city of Indore. Discover the sacred temples of Ujjain, seek blessings at Omkareshwar & Mamleshwar, explore royal Rajwada Palace, Lal Bagh Palace Durbar Hall, Kanch Mandir, and savor delicious local delights at the world-famous 56 Dukan (Chappan Dukan).',
    highlights: [
      'VIP Darshan assistance at Shree Mahakaleshwar & Omkareshwar Jyotirlingas',
      'Full Ujjain Temple Circuit: Sandipani Ashram, Kaal Bhairav, Gadhkalika, Ram Ghat, Harsiddhi Mata & Bada Ganesh',
      'Omkareshwar Island & Mamleshwar Mahadev with sacred Narmada boat ride',
      'Indore Sacred Temples: Ranjeet Hanuman Mandir, Annapurna Mata Mandir & Bada Ganesh / Khajrana Ganesh',
      'Indore Royal Palaces: Historic 7-Story Rajwada Palace & Lal Bagh Palace Durbar Hall',
      'Architectural Wonder: Kanch Mandir (Belgian Glass Temple)',
      'Culinary Experience: Evening Food Walk at 56 Dukan (Chappan Dukan) & Rajwada Market',
      '3 Days dedicated chauffeur-driven sanitized cab with all fuel, permits & toll taxes',
      '2 Nights Super Deluxe accommodation with all pure vegetarian meals'
    ],
    inclusions: [
      'VIP Darshan facilitation at Mahakaleshwar & Omkareshwar',
      'Dedicated sanitized Cab for all 3 full days (Pickup, sightseeing, drop)',
      '2 Nights stay in Super Deluxe AC rooms',
      'All pure veg meals: Daily Breakfast, Lunch, and Dinner',
      'Holy Boat ride on Narmada River in Omkareshwar',
      'All toll taxes, parking fees, interstate road permits, and driver charges',
      '24/7 dedicated on-ground pilgrimage assistance'
    ],
    exclusions: [
      'Train or flight tickets to Indore/Ujjain',
      'Official Bhasma Aarti reservation slip fees',
      'Personal shopping, camera tickets, and laundry'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Day 1: Divine Ujjain Mahakal & Sacred Shrines Circuit',
        subtitle: 'महाकाल मंदिर, सांदीपनि आश्रम, काल भैरव, गढ़कालिका, राम घाट, हरसिद्धि माता, बड़ा गणेश, भर्तृहरि गुफा',
        places: [
          'महाकाल मंदिर (Shree Mahakaleshwar Jyotirlinga & Grand Mahakal Lok)',
          'शांदीपनि आश्रम (Sandipani Ashram - Krishna-Sudama Gurukul)',
          'काल भैरव (Kaal Bhairav Temple - Guardian deity of Ujjain)',
          'गढ़कालिका (Gadhkalika Temple - Shakti shrine of Kalidasa)',
          'राम घाट (Ram Ghat - Shipra holy dip and grand evening Aarti)',
          'हरसिद्धि माता (Harsiddhi Mata Mandir - 51 Shaktipeeth)',
          'बड़ा गणेश मंदिर (Bada Ganesh Mandir)',
          'भर्तृहरि गुफा (Bharthari Gufa - Ancient Meditation Caves)'
        ],
        description: 'Morning pickup from Indore/Ujjain. Head directly for holy VIP Darshan at Shree Mahakaleshwar Jyotirlinga and stroll across Mahakal Lok. Visit Sandipani Ashram, Kaal Bhairav, Gadhkalika, Bada Ganesh, and Bharthari Gufa. Evening Shipra River Aarti at Ram Ghat and blessings at Harsiddhi Mata Mandir before check-in and dinner.',
        mealsIncluded: 'Lunch, Dinner',
        stayLocation: 'Super Deluxe Hotel, Ujjain'
      },
      {
        day: 2,
        title: 'Day 2: Sacred Omkareshwar & Mamleshwar Jyotirlinga Pilgrimage',
        subtitle: 'ओंकारेश्वर ज्योतिर्लिंग, ममलेश्वर महादेव, शनि मंदिर, नर्मदा बोट सफारी',
        places: [
          'ओंकारेश्वर ज्योतिर्लिंग (Omkareshwar Island Shrine on Narmada)',
          'ममलेश्वर महादेव (Mamleshwar Mahadev - Ancient Amareshwar Lingam)',
          'शनि मंदिर (Shani Mandir on Narmada River Bank)',
          'पवित्र नर्मदा नदी बोट सफारी (Scenic Narmada River Cruise)'
        ],
        description: 'Post breakfast, drive across scenic landscapes to holy Omkareshwar. Board a private boat ride on sacred Narmada. Avail VIP Darshan at Omkareshwar Jyotirlinga and cross over to Mamleshwar Mahadev. Enjoy riverside lunch, visit Shani Mandir, and drive to Indore for comfortable night stay and dinner.',
        mealsIncluded: 'Breakfast, Lunch, Dinner',
        stayLocation: 'Super Deluxe Hotel, Indore'
      },
      {
        day: 3,
        title: 'Day 3: Indore City Heritage, Sacred Temples & 56 Dukan',
        subtitle: 'रणजीत हनुमान, अन्नपूर्णा माता, बड़े गणेश, राजवाड़ा पैलेस, लाल बाग पैलेस, राजवाड़ा मार्केट, 56 दुकान, कांच वाला मंदिर',
        places: [
          'रणजीत हनुमान मंदिर (Ranjeet Hanuman Mandir - Powerful protector deity)',
          'अनपूर्ण माता मंदिर (Annapurna Mata Mandir - Sacred golden architectural marvel)',
          'बड़े गणेश मंदिर / खजराना गणेश (Bada Ganesh & Khajrana Ganesh Mandir)',
          'राजवाड़ा पैलेस (Rajwada Palace - 7-story Holkar Royal Palace)',
          'लाल बाग पैलेस (Lal Bagh Palace - Opulent Durbar Hall & European gardens)',
          'राजवाड़ा मार्केट (Rajwada Market - Famous cloth & souvenir shopping)',
          '56 दुकान (56 Dukan / Chappan Dukan - Legendary food street)',
          'कांच वाला मंदिर (Kanch Mandir - Historic Glass & Mirror Jain Temple)'
        ],
        description: 'After breakfast, start your spiritual and royal tour of Indore: pray at Ranjeet Hanuman Mandir, Annapurna Mata Mandir, and Bada Ganesh / Khajrana Ganesh. Marvel at the intricate Belgian glass work at Kanch Mandir, tour the royal Durbar Hall of Lal Bagh Palace, and visit the historic 7-story Rajwada Palace. Indulge in culinary treats at the famous 56 Dukan (Chappan Dukan) and shop at Rajwada Market before drop-off at Indore Airport/Station.',
        mealsIncluded: 'Breakfast, Lunch',
        stayLocation: 'Tour concludes with evening drop at Indore Airport / Station'
      }
    ],
    cancellationPolicy: 'Free cancellation up to 48 hours prior to journey. Flexible rescheduling without penalty.',
    seoKeywords: ['3 days 2 nights Ujjain Omkareshwar Indore package', 'Indore Ujjain 3 days cab tour', 'Rajwada Palace 56 Dukan tour', 'Ujjain Omkareshwar Indore itinerary'],
    metaDescription: 'Book 3 Days 2 Nights Ujjain, Omkareshwar & Indore Tour at ₹8,499 per person. Includes Mahakal VIP Darshan, Omkareshwar, Rajwada, Lal Bagh Palace & 56 Dukan.'
  },
  {
    id: 'pkg-4d3n-ujjain-omkareshwar-maheshwar-indore',
    slug: '4-days-3-nights-ujjain-omkareshwar-maheshwar-indore-tour',
    title: '4 Days 3 Nights Complete Madhya Pradesh Golden Circuit (Ujjain, Omkareshwar, Maheshwar & Indore)',
    tagline: 'The definitive 4-day pilgrimage & heritage tour covering 2 Jyotirlingas, Ahilya Fort, Royal Indore Palaces, and iconic food street 56 Dukan.',
    duration: '4 Days / 3 Nights',
    daysCount: 4,
    nightsCount: 3,
    pricePerPerson: 10999,
    originalPrice: 13499,
    suitableFor: 'Families, Senior Citizens, Pilgrims, Heritage Lovers (2 to 6+ Persons)',
    badge: 'Best Selling 4-Day Holiday',
    featured: true,
    coverImage: '/packages/indore_lal_bagh_palace.jpg',
    galleryImages: [
      '/packages/indore_lal_bagh_palace.jpg',
      '/packages/ujjain_mahakal_mandir.jpg',
      '/hero/slide2.jpg',
      '/packages/maheshwar_ahilya_ghat.jpg',
      '/packages/maheshwar_sahastradhara.jpg',
      '/packages/indore_kanch_mandir.jpg',
      '/packages/indore_khajrana_ganesh.jpg',
      '/packages/indore_rajwada_palace.jpg',
      '/packages/indore_ranjeet_hanuman.jpg',
      '/packages/indore_56_dukan.jpg',
      '/packages/indore_annapurna_temple.jpg',
      '/packages/ujjain_harsiddhi_mata.jpg',
      '/packages/ujjain_ram_ghat.jpg'
    ],
    overview: 'Experience Madhya Pradesh\'s most celebrated travel circuit in 4 comprehensive days. Journey from the sacred Bhasma Aarti at Shree Mahakaleshwar to the tranquil island Jyotirlinga of Omkareshwar, the regal riverside Ahilya Fort in Maheshwar, and the royal heritage and culinary capital Indore. Includes dedicated luxury cab, top 3-star hotel stays, all vegetarian meals, and expert pilgrimage assistance.',
    highlights: [
      'VIP Darshan at Shree Mahakaleshwar & Omkareshwar Jyotirlinga',
      'Full Ujjain Temple Circuit: Sandipani, Kaal Bhairav, Gadhkalika, Ram Ghat, Harsiddhi Mata, Bada Ganesh & Bharthari Gufa',
      'Ahilya Fort Maheshwar, Ahilyeshwar Mandir, Ahilya Ghat & Sahastradhara',
      'Scenic Narmada River Boat Rides in Omkareshwar & Maheshwar',
      'Indore City Exploration: Rajwada Palace, Lal Bagh Palace & Kanch Mandir',
      'Indore Sacred Temples: Ranjeet Hanuman, Annapurna Mata & Bada Ganesh / Khajrana',
      'Food Walk at Asia-famous 56 Dukan (Chappan Dukan) & Rajwada Market shopping',
      '4 Days dedicated sanitized Chauffeur-driven cab with all permits & tolls',
      '3 Nights Super Deluxe Hotel stays with daily breakfast, lunch, and dinner'
    ],
    inclusions: [
      'VIP Darshan support at Mahakaleshwar & Omkareshwar',
      'Dedicated sanitized AC Cab (Sedan / Ertiga / Innova) for all 4 full days',
      '3 Nights Super Deluxe Hotel accommodation',
      'All meals: 3 Breakfasts, 4 Lunches, 3 Dinners (100% Pure Vegetarian)',
      'Holy Boat rides on Narmada River in Omkareshwar & Maheshwar',
      'All driver allowances, toll taxes, parking fees, and road taxes',
      '24/7 personalized travel coordinator support'
    ],
    exclusions: [
      'Train or Flight tickets to/from Indore/Ujjain',
      'Official Bhasma Aarti reservation slip fees',
      'Personal shopping and camera entry permits'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Day 1: Divine Ujjain Mahakal & Sacred Shrines Circuit',
        subtitle: 'महाकाल मंदिर, सांदीपनि आश्रम, काल भैरव, गढ़कालिका, राम घाट, हरसिद्धि माता, बड़ा गणेश, भर्तृहरि गुफा',
        places: [
          'महाकाल मंदिर (Shree Mahakaleshwar Jyotirlinga & Grand Mahakal Lok)',
          'शांदीपनि आश्रम (Sandipani Ashram - Krishna-Sudama Gurukul)',
          'काल भैरव (Kaal Bhairav Temple - Guardian deity of Ujjain)',
          'गढ़कालिका (Gadhkalika Temple - Ancient Shakti Shrine)',
          'राम घाट (Ram Ghat - Shipra Snan & Evening Deep Daan Aarti)',
          'हरसिद्धि माता (Harsiddhi Mata Mandir - 51 Shaktipeeth)',
          'बड़ा गणेश मंदिर (Bada Ganesh Mandir)',
          'भर्तृहरि गुफा (Bharthari Gufa - Ancient Meditation Caves)'
        ],
        description: 'Morning pickup from Indore or Ujjain. Check-in at hotel and proceed to Shree Mahakaleshwar Jyotirlinga for sacred VIP Darshan and Mahakal Lok exploration. Visit Sandipani Ashram, Kaal Bhairav, Gadhkalika, Bada Ganesh, and Bharthari Gufa. In the evening, witness the grand Shipra Aarti at Ram Ghat and seek blessings at Harsiddhi Mata Mandir before delicious dinner.',
        mealsIncluded: 'Lunch, Dinner',
        stayLocation: 'Super Deluxe Hotel, Ujjain'
      },
      {
        day: 2,
        title: 'Day 2: Sacred Omkareshwar & Mamleshwar Jyotirlinga Pilgrimage',
        subtitle: 'ओंकारेश्वर ज्योतिर्लिंग, ममलेश्वर महादेव, शनि मंदिर, नर्मदा बोट सफारी',
        places: [
          'ओंकारेश्वर ज्योतिर्लिंग (Omkareshwar Island Jyotirlinga)',
          'ममलेश्वर महादेव (Mamleshwar Mahadev - Amareshwar Temple)',
          'शनि मंदिर (Shani Mandir on Narmada banks)',
          'पवित्र नर्मदा नदी बोट सफारी (Scenic Narmada Boat Ride)'
        ],
        description: 'Post breakfast, drive to Omkareshwar on the sacred Narmada. Board a boat to the island Jyotirlinga. Experience VIP Darshan at Omkareshwar and Mamleshwar Mahadev. After peaceful prayers and lunch, visit Shani Mandir and proceed to Maheshwar for night stay.',
        mealsIncluded: 'Breakfast, Lunch, Dinner',
        stayLocation: 'Super Deluxe Hotel, Maheshwar / Omkareshwar'
      },
      {
        day: 3,
        title: 'Day 3: Royal Maheshwar Fort, Ahilya Ghat & Sahastradhara',
        subtitle: 'अहिल्या किला, अहिल्या घाट, अहिल्येश्वर मंदिर, सहस्त्रधारा, नर्मदा बोटिंग, रेहवा हथकरघा, जाम गेट',
        places: [
          'अहिल्या किला (Ahilya Fort - Maheshwar Fort)',
          'अहिल्येश्वर मंदिर (Ahilyeshwar & Shri Raj Rajeshwar Temples)',
          'अहिल्या घाट (Ahilya Ghat - Holy riverfront)',
          'सहस्त्रधारा (Sahastradhara - Thousand Streams cascade)',
          'रेहवा हथकरघा (Rehwa Society - Authentic Maheshwari handloom)',
          'पवित्र नर्मदा बोटिंग (Narmada River Boat Ride)',
          'जाम गेट (Jam Gate - Scenic Malwa Mountain Pass)'
        ],
        description: 'Morning tour of magnificent Ahilya Fort on the banks of Narmada. Visit Ahilyeshwar Temple, Ahilya Ghat, and enjoy a river boat ride. Marvel at Sahastradhara rocky waterfalls and witness royal handloom weaving at Rehwa Society. Drive across scenic Jam Gate pass to Indore for night stay.',
        mealsIncluded: 'Breakfast, Lunch, Dinner',
        stayLocation: 'Super Deluxe Hotel, Indore'
      },
      {
        day: 4,
        title: 'Day 4: Indore City Heritage, Sacred Temples & Food Paradise',
        subtitle: 'रणजीत हनुमान, अन्नपूर्णा माता, बड़े गणेश, राजवाड़ा पैलेस, लाल बाग पैलेस, राजवाड़ा मार्केट, 56 दुकान, कांच वाला मंदिर',
        places: [
          'रणजीत हनुमान मंदिर (Ranjeet Hanuman Mandir - Powerful protector deity)',
          'अनपूर्ण माता मंदिर (Annapurna Mata Mandir - Sacred golden architectural marvel)',
          'बड़े गणेश मंदिर / खजराना गणेश (Bada Ganesh & Khajrana Ganesh Mandir)',
          'राजवाड़ा पैलेस (Rajwada Palace - 7-story Holkar Royal Palace)',
          'लाल बाग पैलेस (Lal Bagh Palace - Opulent Durbar Hall & European gardens)',
          'राजवाड़ा मार्केट (Rajwada Market - Famous cloth & souvenir shopping)',
          '56 दुकान (56 Dukan / Chappan Dukan - Legendary food street)',
          'कांच वाला मंदिर (Kanch Mandir - Historic Glass & Mirror Jain Temple)'
        ],
        description: 'After breakfast, start your spiritual and royal tour of Indore: pray at Ranjeet Hanuman Mandir, Annapurna Mata Mandir, and Bada Ganesh / Khajrana Ganesh. Marvel at the intricate Belgian glass work at Kanch Mandir, tour the royal Durbar Hall of Lal Bagh Palace, and visit the historic 7-story Rajwada Palace. Indulge in culinary treats at the famous 56 Dukan (Chappan Dukan) and shop at Rajwada Market before drop-off at Indore Airport/Station.',
        mealsIncluded: 'Breakfast, Lunch',
        stayLocation: 'Tour concludes with evening drop at Indore Airport / Station'
      }
    ],
    cancellationPolicy: 'Free cancellation up to 48 hours prior to journey. Flexible rescheduling without penalty.',
    seoKeywords: ['4 days 3 nights Ujjain Omkareshwar Indore tour', 'Indore Ujjain Maheshwar package', 'MP golden triangle tour', 'Lal Bagh Palace 56 Dukan tour'],
    metaDescription: 'Book 4 Days 3 Nights Ujjain, Omkareshwar, Maheshwar & Indore Tour at ₹10,999 per person. Dedicated cab, 3-star hotels, pure veg meals, and all sightseeing.'
  },
  {
    id: 'pkg-5d4n-grand-malwa-pilgrimage',
    slug: '5-days-4-nights-grand-malwa-mandu-ujjain-tour',
    title: '5 Days 4 Nights Grand Malwa Royal Pilgrimage (Ujjain, Omkareshwar, Maheshwar, Indore & Mandu)',
    tagline: 'The ultimate Central India expedition: 2 Sacred Jyotirlingas, Ahilya Fort, Royal Indore Palaces, 56 Dukan, and the medieval hilltop wonderland of Mandu.',
    duration: '5 Days / 4 Nights',
    daysCount: 5,
    nightsCount: 4,
    pricePerPerson: 13999,
    originalPrice: 16999,
    suitableFor: 'Families, Group Tours, Heritage & Devotion Seekers (2 to 6+ Persons)',
    badge: 'Ultimate Grand Malwa Experience',
    featured: true,
    coverImage: '/packages/mandu_roopmati_pavilion.jpg',
    galleryImages: [
      '/packages/mandu_roopmati_pavilion.jpg',
      '/packages/mandu_jahaz_mahal.jpg',
      '/packages/mandu_hoshang_shah_tomb.jpg',
      '/packages/mandu_malik_mughis_mosque.jpg',
      '/packages/mandu_hindola_mahal.jpg',
      '/packages/mandu_nilkanth_mahadev.jpg',
      '/packages/ujjain_mahakal_mandir.jpg',
      '/hero/slide2.jpg',
      '/packages/maheshwar_ahilya_ghat.jpg',
      '/packages/maheshwar_sahastradhara.jpg',
      '/packages/indore_lal_bagh_palace.jpg',
      '/packages/indore_kanch_mandir.jpg',
      '/packages/indore_rajwada_palace.jpg',
      '/packages/indore_ranjeet_hanuman.jpg',
      '/packages/indore_56_dukan.jpg',
      '/packages/indore_khajrana_ganesh.jpg',
      '/packages/ujjain_harsiddhi_mata.jpg',
      '/packages/ujjain_ram_ghat.jpg'
    ],
    overview: 'Embark on the ultimate 5-day voyage across the heart of Madhya Pradesh. Experience the south-facing Shree Mahakaleshwar Jyotirlinga and Omkareshwar on river Narmada, the Maratha river fort of Maheshwar, the royal heritage and culinary wonders of Indore, and the breathtaking Afghan monuments of Mandu (Mandoo) — including the floating Jahaz Mahal, Rani Roopmati Pavilion, and Hoshang Shah\'s marble tomb. Handcrafted for supreme comfort with dedicated sanitized cabs, deluxe hotels, and personalized pilgrimage assistance.',
    highlights: [
      'VIP Darshan at Shree Mahakaleshwar & Omkareshwar Jyotirlingas',
      'Full Ujjain Temple Circuit: Sandipani, Kaal Bhairav, Gadhkalika, Ram Ghat, Harsiddhi Mata, Bada Ganesh & Bharthari Gufa',
      'Ahilya Fort Maheshwar, Ahilyeshwar Temple, Ahilya Ghat & Sahastradhara',
      'Scenic Narmada Boat Safari at Omkareshwar & Maheshwar',
      'Indore City Exploration: Rajwada Palace, Lal Bagh Palace Durbar Hall, Kanch Mandir & 56 Dukan',
      'Indore Sacred Temples: Ranjeet Hanuman, Annapurna Mata & Bada Ganesh / Khajrana',
      'Complete Mandu (Mandoo) Sightseeing: Jahaz Mahal (Ship Palace), Rani Roopmati Pavilion, Hindola Mahal, Hoshang Shah\'s Tomb & Malik Mughis Mosque',
      '5 Days dedicated sanitized chauffeur-driven cab with fuel, tolls & driver allowances',
      '4 Nights Super Deluxe accommodation with all pure vegetarian meals included'
    ],
    inclusions: [
      'VIP Darshan guidance at Mahakaleshwar & Omkareshwar',
      'Dedicated sanitized AC Cab (Sedan / Ertiga / Innova) for all 5 full days',
      '4 Nights Super Deluxe Hotel stays (AC room, WiFi, Geyser)',
      'Daily meals: 4 Breakfasts, 5 Lunches, 4 Dinners (100% Pure Veg)',
      'Scenic Boat rides on holy Narmada River',
      'All toll taxes, parking fees, road permits, and driver charges',
      '24/7 dedicated tour manager on call'
    ],
    exclusions: [
      'Train or Flight tickets to/from Indore/Ujjain',
      'Official Bhasma Aarti reservation slip fees',
      'Personal shopping and camera tickets at ASI monuments'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Day 1: Ujjain Spiritual Shrines & Shipra Aarti',
        subtitle: 'महाकाल मंदिर, सांदीपनि आश्रम, काल भैरव, गढ़कालिका, राम घाट, हरसिद्धि माता, बड़ा गणेश, भर्तृहरि गुफा',
        places: [
          'महाकाल मंदिर (Shree Mahakaleshwar Jyotirlinga & Grand Mahakal Lok)',
          'शांदीपनि आश्रम (Sandipani Ashram - Gurukul of Lord Krishna)',
          'काल भैरव (Kaal Bhairav Temple - Guardian deity of Ujjain)',
          'गढ़कालिका (Gadhkalika Temple - Ancient Shakti Shrine)',
          'राम घाट (Ram Ghat - Shipra Snan & Evening Deep Daan Aarti)',
          'हरसिद्धि माता (Harsiddhi Mata Mandir - 51 Shaktipeeth)',
          'बड़ा गणेश मंदिर (Bada Ganesh Mandir)',
          'भर्तृहरि गुफा (Bharthari Gufa - Historic Meditation Caves)'
        ],
        description: 'Pickup from Indore or Ujjain. Check in at hotel. Experience holy VIP Darshan at Shree Mahakaleshwar Jyotirlinga and explore Mahakal Lok. Visit Sandipani Ashram, Kaal Bhairav, Gadhkalika, Bada Ganesh, and Bharthari Gufa. Attend the divine evening Shipra Aarti at Ram Ghat and seek blessings at Harsiddhi Mata Shaktipeeth.',
        mealsIncluded: 'Lunch, Dinner',
        stayLocation: 'Super Deluxe Hotel, Ujjain'
      },
      {
        day: 2,
        title: 'Day 2: Sacred Omkareshwar & Mamleshwar Jyotirlinga Pilgrimage',
        subtitle: 'ओंकारेश्वर ज्योतिर्लिंग, ममलेश्वर महादेव, शनि मंदिर, नर्मदा बोट सफारी',
        places: [
          'ओंकारेश्वर ज्योतिर्लिंग (Omkareshwar Island Jyotirlinga on Narmada)',
          'ममलेश्वर महादेव (Mamleshwar Mahadev - Ancient Amareshwar Lingam)',
          'शनि मंदिर (Shani Mandir on Sacred Narmada Banks)',
          'पवित्र नर्मदा नदी बोट सफारी व संगम (Narmada River Holy Boat Ride)'
        ],
        description: 'Post breakfast, drive through scenic landscapes to Omkareshwar. Board a private boat across the sacred Narmada. Avail VIP Darshan at Omkareshwar Jyotirlinga and Mamleshwar Mahadev. After peaceful prayers and lunch, visit Shani Mandir and proceed to Maheshwar.',
        mealsIncluded: 'Breakfast, Lunch, Dinner',
        stayLocation: 'Super Deluxe Hotel, Maheshwar / Omkareshwar'
      },
      {
        day: 3,
        title: 'Day 3: Majestic Maheshwar Fort, Ahilya Ghat & Sahastradhara',
        subtitle: 'अहिल्या किला, अहिल्या घाट, अहिल्येश्वर मंदिर, सहस्त्रधारा, नर्मदा बोटिंग, रेहवा हथकरघा, जाम गेट',
        places: [
          'अहिल्या किला (Ahilya Fort - Grand riverside citadel of Queen Ahilyabai)',
          'अहिल्येश्वर मंदिर (Ahilyeshwar & Shri Raj Rajeshwar Temples)',
          'अहिल्या घाट (Ahilya Ghat - Holy steps on sacred Narmada)',
          'सहस्त्रधारा (Sahastradhara - Thousand Streams roaring cascade)',
          'रेहवा हथकरघा (Rehwa Society - Authentic Maheshwari handloom)',
          'पवित्र नर्मदा बोटिंग (Narmada River Holy Boat Safari)',
          'जाम गेट (Jam Gate - Historic mountain pass with panoramic views)'
        ],
        description: 'Explore the breathtaking Ahilya Fort on the banks of Narmada. Pray at Ahilyeshwar Temple, stroll along Ahilya Ghat, and take a holy boat ride. Marvel at Sahastradhara rapids and witness exquisite Maheshwari saree weaving at Rehwa Society. Journey via scenic Jam Gate pass to Indore.',
        mealsIncluded: 'Breakfast, Lunch, Dinner',
        stayLocation: 'Super Deluxe Hotel, Indore'
      },
      {
        day: 4,
        title: 'Day 4: Indore City Heritage, Sacred Temples & 56 Dukan',
        subtitle: 'रणजीत हनुमान, अन्नपूर्णा माता, बड़े गणेश, राजवाड़ा पैलेस, लाल बाग पैलेस, राजवाड़ा मार्केट, 56 दुकान, कांच वाला मंदिर',
        places: [
          'रणजीत हनुमान मंदिर (Ranjeet Hanuman Mandir - Victorious Hanuman Shrine)',
          'अनपूर्ण माता मंदिर (Annapurna Mata Mandir - Sacred golden architectural marvel)',
          'बड़े गणेश मंदिर / खजराना गणेश (Bada Ganesh & Khajrana Ganesh Mandir)',
          'राजवाड़ा पैलेस (Rajwada Palace - Iconic 7-story Holkar Citadel)',
          'लाल बाग पैलेस (Lal Bagh Palace - Durbar Hall & Italian Marble interiors)',
          'राजवाड़ा मार्केट (Rajwada Market - Traditional shopping hub)',
          '56 दुकान (56 Dukan / Chappan Dukan - Street Food Capital)',
          'कांच वाला मंदिर (Kanch Mandir - Exquisite Belgian Glass Temple)'
        ],
        description: 'Spiritual morning in Indore: seek blessings at Ranjeet Hanuman Mandir, Annapurna Mata Mandir, and Bada Ganesh / Khajrana Ganesh. Tour the spectacular Belgian glass interiors of Kanch Mandir, the royal Durbar Hall of Lal Bagh Palace, and the iconic 7-story Rajwada Palace. Savor legendary delicacies at 56 Dukan and shop at Rajwada Market.',
        mealsIncluded: 'Breakfast, Lunch, Dinner',
        stayLocation: 'Super Deluxe Hotel, Indore'
      },
      {
        day: 5,
        title: 'Day 5: Fabled Mandu (Mandoo) City of Joy Monuments & Departure',
        subtitle: 'जहाज महल, रानी रूपमती मंडप, हिंडोला महल, होशंग शाह मकबरा, मलिक मुगीस मस्जिद, बाज बहादुर महल, नीलकंठ महादेव',
        places: [
          'जहाज महल (Jahaz Mahal - The colossal floating Ship Palace)',
          'रानी रूपमती का मंडप (Rani Roopmati Pavilion - Clifftop romantic gazebo with Narmada views)',
          'हिंडोला महल (Hindola Mahal - The sloping Swing Palace)',
          'होशंग शाह का मकबरा (Hoshang Shah Tomb - India’s earliest marble mausoleum, Taj Mahal inspiration)',
          'मलिक मुगीस मस्जिद (Malik Mughis Mosque - 15th-century Afghan stone architecture)',
          'बाज बहादुर महल (Baz Bahadur Palace - Grand courts & royal music halls)',
          'नीलकंठ महादेव मंदिर (Nilkanth Mahadev Mandir - Historic cliffside Shiva shrine)'
        ],
        description: 'Drive to the romantic medieval hilltop plateau of Mandu (Mandoo), the fabled City of Joy. Marvel at Jahaz Mahal floating between two reservoirs, Hindola Mahal, and India’s first marble monument — Hoshang Shah’s Tomb. Visit the historic 15th-century Malik Mughis Mosque, explore Baz Bahadur Palace, and stand atop Rani Roopmati’s Pavilion overlooking the shimmering sacred Narmada River valley. Tour concludes with drop-off at Indore or Ujjain Airport/Railway Station.',
        mealsIncluded: 'Breakfast, Lunch',
        stayLocation: 'Tour concludes with evening drop at Indore / Ujjain'
      }
    ],
    cancellationPolicy: 'Free cancellation up to 48 hours prior to journey. Flexible date change allowed.',
    seoKeywords: ['5 days 4 nights Mandu Ujjain package', 'Grand Malwa tour package', 'Indore Ujjain Maheshwar Mandu cab', 'Jahaz Mahal Roopmati Pavilion tour'],
    metaDescription: 'Book 5 Days 4 Nights Grand Malwa Tour: Ujjain Mahakal, Omkareshwar, Maheshwar, Indore & Mandu Jahaz Mahal at ₹13,999. Dedicated cab, hotels, and meals included.'
  }
];

export const DESTINATIONS_DATA: DestinationInfo[] = [
  {
    id: 'ujjain',
    slug: 'ujjain',
    name: 'Ujjain - The Holy City of Mahakal',
    tagline: 'Ancient Avanti, home to Shree Mahakaleshwar Jyotirlinga & the divine Shipra River.',
    heroImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    description: 'Ujjain is one of Hinduism’s seven sacred Moksha-giving cities (Sapta Puri) and hosts the colossal Simhastha Kumbh Mela every 12 years. Revered for the south-facing Dakshinmukhi Mahakaleshwar Jyotirlinga and the world-famous daily dawn Bhasma Aarti, Ujjain is steeped in Vedic astronomy, classical poetry of Kalidasa, and centuries of spiritual mysticism.',
    topAttractions: [
      {
        name: 'Shree Mahakaleshwar Jyotirlinga & Mahakal Lok',
        description: 'One of the 12 sacred Jyotirlingas, famous for the daily 4:00 AM Bhasma Aarti and the majestic 900-meter Mahakal Lok corridor with grand murals and statues.',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80',
        timings: '04:00 AM to 11:00 PM'
      },
      {
        name: 'Kaal Bhairav Temple',
        description: 'Fierce guardian deity of Ujjain where liquor and holy prasad are offered as centuries-old Tantric rituals.',
        image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=600&q=80',
        timings: '05:00 AM to 10:00 PM'
      },
      {
        name: 'Harsiddhi Mata Mandir',
        description: 'Ancient 51 Shaktipeeth where Goddess Sati’s elbow fell; famed for its dual towering stone Deepstambhas lit with thousands of oil lamps.',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        timings: '05:00 AM to 10:30 PM'
      },
      {
        name: 'Ram Ghat & Shipra River',
        description: 'Venerated riverfront ghat where Lord Rama performed sacred rituals; site of evening Deep Daan aarti and holy snan.',
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
        timings: 'Open 24 hours (Aarti: 07:00 PM)'
      }
    ],
    bestTimeToVisit: 'October to March offers pleasant weather. July-August (Shravan month) is spiritually vibrant.',
    howToReach: 'Direct trains to Ujjain Junction (UJN). Nearest airport is Devi Ahilyabai Holkar Airport in Indore (55 km, 1 hour by cab).',
    travelTips: [
      'Book Bhasma Aarti tickets at least 15-30 days in advance on official temple portals or request our tour guide assistance.',
      'Dress code for Garbhagriha Jalabhishek: Traditional Dhoti-Kurta for men and Saree for women.',
      'Keep 1 full day for local temple visits and evening aarti at Ram Ghat.'
    ]
  },
  {
    id: 'indore',
    slug: 'indore',
    name: 'Indore - The Cleanest City & Food Capital of India',
    tagline: 'Historic capital of the Holkars, architectural marvels, and unmatched culinary street adventures.',
    heroImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    description: 'Awarded India’s cleanest city 7 years in a row, Indore blends royal Maratha heritage under Devi Ahilya Bai Holkar with unmatched modern vibrancy. From the 7-story Rajwada Palace and Lal Bagh Palace to midnight street food at Sarafa Bazaar and culinary thrills at 56 Dukan, Indore captivates every traveler.',
    topAttractions: [
      {
        name: 'Rajwada Palace & Sarafa Bazaar',
        description: 'Iconic 200-year-old seven-story palace of the Holkars; neighboring Sarafa transforms into India’s only midnight street food bazaar.',
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
        timings: 'Palace: 10:00 AM - 05:00 PM; Sarafa Food: 08:30 PM - 02:00 AM'
      },
      {
        name: '56 Dukan (Chappan Dukan)',
        description: 'Renowned culinary lane with 56 legendary specialty food stalls serving Johny Hot Dog, Vijay Chaat, Shreemaya sweets, and coconut crush.',
        image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=80',
        timings: '06:00 AM to 11:30 PM'
      },
      {
        name: 'Lal Bagh Palace',
        description: 'Sprawling European-style royal palace with rose gardens, Belgian mirrors, Italian marble, and Buckingham Palace style gates.',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        timings: '10:00 AM to 05:00 PM (Closed Mondays)'
      },
      {
        name: 'Ranjeet Hanuman & Annapurna Mandir',
        description: 'Two of Central India’s most revered spiritual landmarks attracting thousands of devotees daily.',
        image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=600&q=80',
        timings: '05:00 AM to 10:00 PM'
      }
    ],
    bestTimeToVisit: 'September to March when the climate is cool and evening food strolls are delightful.',
    howToReach: 'Devi Ahilyabai Holkar International Airport (IDR) connects to Mumbai, Delhi, Bengaluru, Dubai, and all major hubs.',
    travelTips: [
      'Never miss early morning Poha-Jalebi at Chappan Dukan and night Garadu / Bhutte ka Kees at Sarafa.',
      'Take our full-day dedicated cab to cover Rajwada, Lal Bagh, Kanch Mandir, and temples comfortably without traffic stress.'
    ]
  },
  {
    id: 'omkareshwar',
    slug: 'omkareshwar',
    name: 'Omkareshwar - The Island Jyotirlinga on Sacred Narmada',
    tagline: 'Revered holy island shaped in the sacred Hindu symbol OM (ॐ), flanked by Mamleshwar Mahadev.',
    heroImage: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80',
    description: 'Located at the confluence of rivers Narmada and Kaveri, Omkareshwar is divided into two major shrines: Omkareshwar on the Mandhata island (Shiva Linga) and Mamleshwar (Amareshwar) on the south mainland bank. Completing darshan of both fulfills the Jyotirlinga pilgrimage.',
    topAttractions: [
      {
        name: 'Omkareshwar Jyotirlinga',
        description: 'Five-story temple complex with intricate carvings on Mandhata Island in the Narmada River.',
        image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=600&q=80',
        timings: '05:00 AM to 09:30 PM'
      },
      {
        name: 'Mamleshwar (Amareshwar) Mahadev',
        description: 'Ancient monolithic stone temple on the southern bank dating back to the Paramara period.',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80',
        timings: '05:30 AM to 09:00 PM'
      },
      {
        name: 'Narmada River Boat Safari & Sangam',
        description: 'Motorized boat ride cruising through river gorges, suspension bridges, and Triveni Sangam.',
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
        timings: '06:00 AM to 06:00 PM'
      }
    ],
    bestTimeToVisit: 'August to March. River water levels and boating conditions are picturesque.',
    howToReach: '78 km from Indore (approx. 2 hours by dedicated cab) via Khandwa road.',
    travelTips: [
      'Take our package boat ride to avoid long walking queues and access the temple directly from the river landing.',
      'Always visit both Omkareshwar and Mamleshwar temples to complete the divine Jyotirlinga fruit (phala).'
    ]
  },
  {
    id: 'maheshwar-mandu',
    slug: 'maheshwar-mandu',
    name: 'Maheshwar & Mandu (Mandoo) - Royal Forts & Ancient Shrines',
    tagline: 'Ahilya Fort, Narmada Ghats, Jam Gate, Jahaz Mahal & Nilkanth Mahadev.',
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    description: 'Explore the grandeur of Maheshwar, the holy riverside capital of Rajmata Ahilyabai Holkar with Ahilya Fort and exquisite ghats, and the medieval hilltop wonderland of Mandu (Mandoo) featuring the floating Jahaz Mahal and the sacred Nilkanth Mahadev temple.',
    topAttractions: [
      {
        name: 'Ahilya Fort & Ghats (Maheshwar)',
        description: '250-year-old riverside fort overlooking holy Narmada with magnificent stone balconies and cenotaphs.',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        timings: '06:00 AM to 07:00 PM'
      },
      {
        name: 'Jahaz Mahal & Hindola Mahal (Mandu)',
        description: 'Fabled Afghan architectural masterwork built like an immense ship floating between two reservoirs.',
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
        timings: '06:00 AM to 06:00 PM'
      },
      {
        name: 'Rani Roopmati Pavilion & Rewa Kund',
        description: 'High vantage pavilion gazing upon the sacred Narmada plains, built for Rani Roopmati.',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80',
        timings: '06:00 AM to 06:30 PM'
      },
      {
        name: 'Nilkanth Mahadev Temple',
        description: 'Historic Shiva temple built inside a grand Mughal stone pavilion with perpetual spring water flowing over the lingam.',
        image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=600&q=80',
        timings: '06:00 AM to 07:00 PM'
      }
    ],
    bestTimeToVisit: 'Monsoon (July-September) turns Mandu into a lush green heaven; October to March is also wonderful.',
    howToReach: 'Directly covered in our 3 Days 2 Nights Tour Package with dedicated pickup and return to Indore/Ujjain.',
    travelTips: [
      'Shop for authentic world-famous handwoven Maheshwari sarees at Rehwa Society inside the fort.',
      'Stop at Jam Gate for photographs of the Malwa plateau.'
    ]
  }
];

export const AGENCY_INFO = {
  name: 'Shiv Shakti Tour & Travels',
  tagline: 'Your Journey, Our Expertise.',
  phone: '7999 353 101',
  phoneRaw: '7999353101',
  whatsapp: '917999353101',
  email: 'shivshaktitourtravels7999@gmail.com',
  address: 'A-5/15 Mahakal Vanijya Kendra, Nanakheda, Ujjain, Madhya Pradesh 456010',
  indoreOffice: '220, Surya Appartment Usha Nagar, Near Ranjeet Hanuman Mandir, Indore, Madhya Pradesh',
  serviceHours: '24 Hours / 7 Days Available',
  rating: 5.0,
  yearsInBusiness: 12,
  completedTrips: '25,000+'
};
