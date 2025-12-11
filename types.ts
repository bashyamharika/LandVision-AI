
export enum LandType {
  RESIDENTIAL = 'Residential',
  AGRICULTURAL = 'Agricultural',
  COMMERCIAL = 'Commercial',
  INDUSTRIAL = 'Industrial',
  MIXED = 'Mixed Use'
}

export enum TransactionType {
  SALE = 'Sale',
  LEASE = 'Lease'
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  area: number; // in sq ft
  pricePerSqFt: number;
  type: LandType;
  location: {
    address: string;
    city: string;
    lat: number;
    lng: number;
  };
  images: string[];
  features: string[];
  sellerId: string;
  sellerName: string;
  verified: boolean;
  postedDate: string;
  // Mock risk data for MVP display (real app would calculate this via AI)
  riskScore?: number; // 0-100, higher is safer
  legalStatus?: 'Clear' | 'Dispute' | 'Pending' | 'Unknown';
}

export interface VisualizationRequest {
  buildingType: 'House' | 'Villa' | 'Apartment' | 'Commercial Complex' | 'Farmhouse' | 'Resort Cottage';
  style: 'Modern Contemporary' | 'Traditional Kerala' | 'Colonial' | 'Minimalist' | 'Rustic Farmhouse' | 'Eco-Tropical';
  floors: number;
  footprintCoverage?: number; // Percentage 1-100
  setbackDistance?: number; // In feet
  viewMode?: 'standard' | 'panorama'; // New field for 360 support
}

export interface CostEstimate {
  construction: { min: number; max: number };
  legal: { min: number; max: number };
  utility: { min: number; max: number };
  total: { min: number; max: number };
}
