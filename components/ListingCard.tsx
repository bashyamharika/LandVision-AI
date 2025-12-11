
import React from 'react';
import { Listing } from '../types';
import { MapPin, ArrowRight, Heart, BadgeCheck, Clock } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onClick: (listing: Listing) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick, isFavorite, onToggleFavorite }) => {
  // Check if listing was posted today (simple date string comparison YYYY-MM-DD)
  const isNew = listing.postedDate === new Date().toISOString().split('T')[0];

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer group flex flex-col h-full"
      onClick={() => onClick(listing)}
    >
      <div className="relative h-60 bg-gray-200 overflow-hidden">
        <img 
          src={listing.images && listing.images.length > 0 ? listing.images[0] : 'https://source.unsplash.com/800x600/?land'} 
          alt={listing.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
        />
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
             {isNew && (
                <div className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow-md flex items-center animate-pulse">
                    NEW
                </div>
            )}
            <div className="bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded shadow-sm">
                {listing.type}
            </div>
        </div>

        <div className="absolute top-3 right-3">
            {onToggleFavorite && (
                <button 
                    onClick={onToggleFavorite}
                    className={`p-2 rounded-full shadow-sm backdrop-blur-md transition-all active:scale-90 ${isFavorite ? 'bg-white text-red-500' : 'bg-black/30 text-white hover:bg-white hover:text-red-500'}`}
                >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
            )}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
           <div className="flex-1">
                <div className="flex items-center gap-1 mb-1">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition">
                        {listing.title}
                    </h3>
                    {listing.verified && (
                        <BadgeCheck className="w-5 h-5 text-emerald-500 shrink-0 fill-emerald-50" />
                    )}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  {listing.location.city}
                </div>
           </div>
        </div>
        
        <div className="my-4">
             <p className="text-2xl font-bold text-emerald-700">₹{(listing.price / 100000).toFixed(1)} <span className="text-sm font-medium text-emerald-600">Lakhs</span></p>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-sm text-gray-500">
           <div className="flex items-center gap-3">
              <span className="font-medium bg-gray-50 px-2 py-1 rounded">{listing.area.toLocaleString()} sqft</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>₹{listing.pricePerSqFt}/sqft</span>
           </div>
           
           <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                <ArrowRight className="w-4 h-4" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
