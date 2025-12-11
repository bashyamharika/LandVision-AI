import { LandType, Listing } from '../types';

export const MOCK_LISTINGS: Listing[] = [
  {
    id: '3',
    title: 'Agricultural Farm Land',
    description: 'Spacious half-acre agricultural land in Round Rock. Fertile soil, scenic views, and peaceful surroundings. Great for hobby farming or investment.',
    price: 2500000,
    area: 21780, // ~0.5 Acre
    pricePerSqFt: 114,
    type: LandType.AGRICULTURAL,
    location: {
      address: 'County Road 122',
      city: 'Round Rock',
      lat: 30.5083,
      lng: -97.6789
    },
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://picsum.photos/800/600?random=3'
    ],
    features: ['Fertile Soil', 'Scenic Views', 'Low Property Tax'],
    sellerId: 's3',
    sellerName: 'Sarah Jenkins',
    verified: true,
    postedDate: '2023-10-25',
    riskScore: 95,
    legalStatus: 'Clear'
  },
  {
    id: '4',
    title: 'Premium Lakeview Plot in Ooty',
    description: 'A beautiful 2400 sqft plot overlooking the lake. Perfect for a vacation villa or a small resort. Clear title and immediate registration available.',
    price: 4500000,
    area: 2400,
    pricePerSqFt: 1875,
    type: LandType.RESIDENTIAL,
    location: {
      address: 'Plot 45, Lake Road, Ketti Valley',
      city: 'Ooty',
      lat: 11.38,
      lng: 76.71
    },
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://picsum.photos/800/600?random=4'
    ],
    features: ['Lake View', 'Corner Plot', 'Electricity Available'],
    sellerId: 's4',
    sellerName: 'Rajesh Kumar',
    verified: true,
    postedDate: '2023-10-15',
    riskScore: 85,
    legalStatus: 'Clear'
  },
  {
    id: '5',
    title: 'Commercial Land on Highway NH44',
    description: 'Strategic commercial land suitable for warehouse or fuel station. 1 Acre. High traffic zone. Currently agricultural conversion pending.',
    price: 25000000,
    area: 43560,
    pricePerSqFt: 573,
    type: LandType.COMMERCIAL,
    location: {
      address: 'NH44 Near Toll Plaza',
      city: 'Bangalore',
      lat: 12.97,
      lng: 77.59
    },
    images: [
      'https://images.unsplash.com/photo-1542361345-89e58247f2d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://picsum.photos/800/600?random=5'
    ],
    features: ['Highway Access', 'Water Connection'],
    sellerId: 's5',
    sellerName: 'Global Infra P Ltd',
    verified: false,
    postedDate: '2023-10-20',
    riskScore: 60,
    legalStatus: 'Pending'
  },
  {
    id: '6',
    title: 'Organic Farm Land near River',
    description: 'Fertile soil, active borewell. Ideal for organic farming or weekend getaway. Surrounded by greenery. No direct tar road access, mud road for last 500m.',
    price: 1200000,
    area: 10000,
    pricePerSqFt: 120,
    type: LandType.AGRICULTURAL,
    location: {
      address: 'Village Green, Sector 4',
      city: 'Coorg',
      lat: 12.33,
      lng: 75.80
    },
    images: [
      'https://images.unsplash.com/photo-1500076656116-558758c991c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://picsum.photos/800/600?random=6'
    ],
    features: ['Borewell', 'Fenced', 'River nearby'],
    sellerId: 's6',
    sellerName: 'Kaveri Estate',
    verified: true,
    postedDate: '2023-10-25',
    riskScore: 75,
    legalStatus: 'Clear'
  }
];