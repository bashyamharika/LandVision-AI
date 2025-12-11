
import React, { useMemo } from 'react';
import { Listing } from '../types';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

const PriceAnalysis: React.FC<{ listing: Listing }> = ({ listing }) => {
  
  // Stabilize the calculation so it doesn't jump on every render
  const analysis = useMemo(() => {
    // Simulate city average based on city name hash to be consistent but "fake" for MVP
    const cityHash = listing.location.city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseRate = (cityHash % 500) + 1000; // Random stable base rate between 1000 and 1500
    
    // Locality adjustment
    const localityAvg = baseRate * 1.1; 
    
    const diff = ((listing.pricePerSqFt - localityAvg) / localityAvg) * 100;
    
    let status = 'Fair Price';
    let color = 'text-blue-600';
    let bgColor = 'bg-blue-600';
    let Icon = Minus;

    if (diff > 15) {
      status = 'Above Market';
      color = 'text-red-500';
      bgColor = 'bg-red-500';
      Icon = TrendingUp;
    } else if (diff < -10) {
      status = 'Great Value';
      color = 'text-emerald-600';
      bgColor = 'bg-emerald-600';
      Icon = TrendingDown;
    }

    return {
      cityAvg: baseRate,
      localityAvg: localityAvg,
      status,
      color,
      bgColor,
      Icon,
      maxVal: Math.max(listing.pricePerSqFt, localityAvg, baseRate) * 1.2
    };
  }, [listing.id, listing.pricePerSqFt, listing.location.city]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start mb-8">
        <div>
           <h3 className="font-bold text-gray-900 text-xl">Price Intelligence</h3>
           <p className="text-sm text-gray-500 flex items-center mt-1">
             <Info className="w-4 h-4 mr-1.5" /> Compared to {listing.location.city} trends
           </p>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-sm font-bold text-white ${analysis.bgColor}`}>
            {analysis.status}
        </div>
      </div>
      
      <div className="flex items-center mb-10">
        <div className={`p-4 rounded-full bg-opacity-10 mr-5 ${analysis.color.replace('text-', 'bg-')}`}>
          <analysis.Icon className={`w-10 h-10 ${analysis.color}`} />
        </div>
        <div>
          <p className="text-base text-gray-500">Asking Price</p>
          <p className="font-bold text-3xl text-gray-900">₹{listing.pricePerSqFt}<span className="text-base text-gray-400 font-normal">/sqft</span></p>
        </div>
      </div>

      <div className="space-y-6">
        {[
          { name: 'City Average', price: analysis.cityAvg, color: 'bg-gray-300' },
          { name: 'Locality Avg', price: analysis.localityAvg, color: 'bg-gray-400' },
          { name: 'This Listing', price: listing.pricePerSqFt, color: analysis.bgColor.replace('bg-', 'bg-') }, // solid color
        ].map((item) => (
          <div key={item.name} className="relative group">
            <div className="flex justify-between text-sm text-gray-600 mb-2 font-medium">
              <span>{item.name}</span>
              <span>₹{item.price.toFixed(0)}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full rounded-full ${item.color} shadow-sm relative group-hover:opacity-80 transition`}
                style={{ width: `${(item.price / analysis.maxVal) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
         <p className="text-sm text-blue-900 leading-relaxed">
           <strong>Insight:</strong> Properties in {listing.location.city} have seen a <span className="font-bold text-green-600">↑ 12%</span> appreciation over the last year. This listing is positioned {analysis.status.toLowerCase()}.
         </p>
      </div>
    </div>
  );
};

export default PriceAnalysis;
