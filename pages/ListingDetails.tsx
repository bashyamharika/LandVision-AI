
import React from 'react';
import Navbar from '../components/Navbar';
import { Listing } from '../types';
import { MapPin, ArrowLeft, Phone, Calendar, Ruler, Heart, Share2, CreditCard, BadgeCheck } from 'lucide-react';
import RiskIndicator from '../components/RiskIndicator';
import PriceAnalysis from '../components/PriceAnalysis';
import CostEstimator from '../components/CostEstimator';
import AIVisualizer from '../components/AIVisualizer';
import ListingChat from '../components/ListingChat';

interface ListingDetailsProps {
  listing: Listing;
  setPage: (page: string) => void;
  isFavorite?: boolean;
  toggleFavorite?: (e: React.MouseEvent) => void;
  onLogout: () => void;
  user?: { name: string; email: string };
}

const ListingDetails: React.FC<ListingDetailsProps> = ({ listing, setPage, isFavorite, toggleFavorite, onLogout, user }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar setPage={setPage} onLogout={onLogout} user={user} />
      
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button 
            onClick={() => setPage('home')}
            className="flex items-center text-gray-600 hover:text-emerald-600 text-lg font-medium transition"
        >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Listings
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Media & Main Info */}
        <div className="lg:col-span-2 space-y-10">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 h-[500px] relative group">
                <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                <div className="absolute top-6 right-6 flex gap-3">
                    <button className="bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/40 text-white transition">
                        <Share2 className="w-6 h-6" />
                    </button>
                    {toggleFavorite && (
                        <button 
                            onClick={toggleFavorite}
                            className={`bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/40 transition ${isFavorite ? 'text-red-500' : 'text-white'}`}
                        >
                            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                        </button>
                    )}
                </div>
                <div className="absolute bottom-6 right-6 bg-black/60 text-white px-4 py-2 rounded-full text-base backdrop-blur-md">
                    + {listing.images.length - 1} Photos
                </div>
            </div>

            {/* Header Info */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                    <div>
                        <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold uppercase tracking-wide mb-3">
                            {listing.type}
                        </span>
                        <div className="flex items-center mb-3 flex-wrap gap-2">
                            <h1 className="text-4xl font-bold text-gray-900">{listing.title}</h1>
                            {listing.verified && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                    <BadgeCheck className="w-5 h-5 mr-1.5 text-emerald-600 fill-emerald-100" />
                                    Verified
                                </span>
                            )}
                        </div>
                        <div className="flex items-center text-gray-500 text-lg mb-4">
                            <MapPin className="w-6 h-6 mr-2" />
                            {listing.location.address}, {listing.location.city}
                        </div>
                    </div>
                    <div className="text-left md:text-right">
                        <div className="text-4xl font-bold text-emerald-600">₹{(listing.price / 100000).toFixed(2)} Lakhs</div>
                        <div className="text-gray-500 text-lg mt-1">₹{listing.pricePerSqFt} / sqft</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-100">
                    <div>
                        <p className="text-base text-gray-400 mb-2">Plot Area</p>
                        <p className="font-semibold text-lg flex items-center"><Ruler className="w-5 h-5 mr-2 text-gray-400"/> {listing.area.toLocaleString()} sqft</p>
                    </div>
                    <div>
                        <p className="text-base text-gray-400 mb-2">Ownership</p>
                        <p className="font-semibold text-lg">Freehold</p>
                    </div>
                    <div>
                         <p className="text-base text-gray-400 mb-2">Posted</p>
                        <p className="font-semibold text-lg flex items-center"><Calendar className="w-5 h-5 mr-2 text-gray-400"/> {listing.postedDate}</p>
                    </div>
                    <div>
                         <p className="text-base text-gray-400 mb-2">Verified</p>
                        <p className={`font-semibold text-lg flex items-center ${listing.verified ? 'text-emerald-600' : 'text-gray-600'}`}>
                            {listing.verified ? (
                                <><BadgeCheck className="w-5 h-5 mr-2" /> Yes</>
                            ) : 'Pending'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-5">About the Property</h3>
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                    {listing.description}
                </p>
                <div className="mt-8">
                    <h4 className="font-semibold text-xl text-gray-900 mb-4">Features</h4>
                    <div className="flex flex-wrap gap-3">
                        {listing.features.map((f, i) => (
                            <span key={i} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-base">
                                {f}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Location Map (Mock Embed) */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 overflow-hidden">
                <h3 className="text-2xl font-bold text-gray-900 mb-5">Location Map</h3>
                <div className="w-full h-80 bg-gray-200 rounded-xl overflow-hidden relative">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        scrolling="no" 
                        marginHeight={0} 
                        marginWidth={0} 
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(listing.location.city)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    ></iframe>
                    <div className="absolute bottom-3 right-3 bg-white px-3 py-1.5 text-xs shadow-sm rounded">
                        Map data ©2025 Google
                    </div>
                </div>
            </div>

            {/* AI Visualizer */}
            <AIVisualizer listing={listing} />
        </div>

        {/* Right Column: AI Insights & Actions */}
        <div className="space-y-8">
            
            {/* Seller Contact & Buy Action */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-6">Seller Information</h3>
                <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-2xl mr-4">
                        {listing.sellerName.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center">
                            <p className="font-bold text-xl text-gray-900 mr-2">{listing.sellerName}</p>
                            {listing.verified && <BadgeCheck className="w-5 h-5 text-emerald-500 fill-emerald-50" />}
                        </div>
                        <p className="text-sm text-gray-500">Owner • Member since 2023</p>
                    </div>
                </div>
                
                <div className="space-y-3">
                    <button className="w-full bg-white border-2 border-emerald-600 text-emerald-700 py-4 rounded-xl text-lg font-bold hover:bg-emerald-50 transition flex items-center justify-center">
                        <Phone className="w-6 h-6 mr-3" /> Contact Seller
                    </button>
                    
                    <button 
                        onClick={() => setPage('checkout')}
                        className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 rounded-xl text-lg font-bold hover:shadow-lg hover:from-black hover:to-gray-900 transition flex items-center justify-center"
                    >
                        <CreditCard className="w-6 h-6 mr-3" /> Buy Now / Book
                    </button>
                </div>

                <p className="text-sm text-center text-gray-400 mt-4">
                    Zero brokerage fee. Secure payments via LandVision.
                </p>
            </div>

            {/* Risk */}
            <RiskIndicator listing={listing} />

            {/* Price */}
            <PriceAnalysis listing={listing} />

            {/* Cost */}
            <CostEstimator listing={listing} />

        </div>
      </div>
      
      <ListingChat listing={listing} />
    </div>
  );
};

export default ListingDetails;
