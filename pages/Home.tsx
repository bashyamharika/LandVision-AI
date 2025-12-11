
import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ListingCard from '../components/ListingCard';
import { Listing, LandType } from '../types';
import { Search, Filter, SlidersHorizontal, Sparkles, X, Loader2 } from 'lucide-react';
import { searchLandWithAI } from '../services/geminiService';

interface HomeProps {
  setPage: (page: string) => void;
  setSelectedListing: (listing: Listing) => void;
  listings: Listing[];
  favorites: Set<string>;
  toggleFavorite: (id: string, e: React.MouseEvent) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (show: boolean) => void;
  onLogout: () => void;
  user?: { name: string; email: string };
  title?: string;
  subtitle?: string;
}

const Home: React.FC<HomeProps> = ({ 
  setPage, 
  setSelectedListing, 
  listings, 
  favorites,
  toggleFavorite,
  showFavoritesOnly,
  setShowFavoritesOnly,
  onLogout,
  user,
  title,
  subtitle
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter States
  const [selectedType, setSelectedType] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]); // in Lakhs
  const [priceLabel, setPriceLabel] = useState('Any Price');

  // AI Search States
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiFilteredIds, setAiFilteredIds] = useState<Set<string> | null>(null);
  
  const handleListingClick = (listing: Listing) => {
    setSelectedListing(listing);
    setPage('listing');
  };

  const handlePriceChange = (label: string) => {
    setPriceLabel(label);
    switch (label) {
      case 'Under ₹10 Lakhs': setPriceRange([0, 10]); break;
      case '₹10L - ₹50 Lakhs': setPriceRange([10, 50]); break;
      case '₹50L - ₹1 Crore': setPriceRange([50, 100]); break;
      case '₹1 Crore+': setPriceRange([100, 10000]); break;
      default: setPriceRange([0, 10000]);
    }
  };

  const triggerAiSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsAiSearching(true);
    const ids = await searchLandWithAI(searchTerm, listings);
    setAiFilteredIds(new Set(ids));
    setIsAiSearching(false);
  };

  const clearAiSearch = () => {
    setAiFilteredIds(null);
    setSearchTerm('');
  };

  const filteredListings = useMemo(() => {
    return listings.filter(l => {
      // 1. AI Search Filter (Priority)
      // If AI filter is active, only show listings returned by AI.
      if (aiFilteredIds && !aiFilteredIds.has(l.id)) {
        return false;
      }

      // 2. Standard Search (Fallback if AI filter is NOT active)
      // If AI filter IS active, we assume the AI handled the query intent, so we skip basic string matching.
      if (!aiFilteredIds) {
          const lowerTerm = searchTerm.toLowerCase();
          const matchesSearch = l.title.toLowerCase().includes(lowerTerm) || 
                                l.location.city.toLowerCase().includes(lowerTerm) ||
                                l.location.address.toLowerCase().includes(lowerTerm);
          if (!matchesSearch) return false;
      }
      
      // 3. Dropdown Filters (Always apply as refinement)
      // Type
      const matchesType = selectedType === 'All' || l.type === selectedType;
      
      // Price (convert price to lakhs for comparison)
      const priceInLakhs = l.price / 100000;
      const matchesPrice = priceInLakhs >= priceRange[0] && priceInLakhs <= priceRange[1];

      // Favorites
      const matchesFav = showFavoritesOnly ? favorites.has(l.id) : true;

      return matchesType && matchesPrice && matchesFav;
    });
  }, [listings, searchTerm, aiFilteredIds, selectedType, priceRange, showFavoritesOnly, favorites]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        setPage={setPage} 
        favoritesCount={favorites.size} 
        onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
        showingFavorites={showFavoritesOnly}
        onLogout={onLogout}
        user={user}
      />
      {!showFavoritesOnly && !title && <Hero />}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header Section */}
        {showFavoritesOnly ? (
           <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900">Your Saved Lands</h2>
              <p className="text-gray-500 text-lg">Properties you have marked as favorites.</p>
           </div>
        ) : (
          <div className="mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">{title || 'Discover Land'}</h1>
            <p className="text-gray-500 text-lg mb-8">{subtitle || 'Find the perfect plot for your dream project.'}</p>

            {/* Styled Search Bar Container */}
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 relative">
              
              {/* Search Input */}
              <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  <input 
                      type="text" 
                      placeholder="Search by city, or ask AI (e.g. 'Farmhouse near lake')" 
                      className="block w-full pl-12 pr-32 py-4 rounded-xl bg-gray-800 border-transparent text-white placeholder-gray-400 focus:outline-none focus:bg-gray-700 focus:ring-0 text-base transition duration-200"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                          if (e.key === 'Enter') triggerAiSearch();
                      }}
                  />
                  
                  {/* AI Search Button inside Input */}
                  <div className="absolute inset-y-0 right-2 flex items-center">
                    {aiFilteredIds ? (
                         <button 
                            onClick={clearAiSearch}
                            className="bg-gray-600 hover:bg-gray-500 text-white text-sm px-4 py-2 rounded-lg flex items-center transition"
                         >
                            <X className="w-4 h-4 mr-1" /> Clear
                         </button>
                    ) : (
                        <button 
                            onClick={triggerAiSearch}
                            disabled={isAiSearching || !searchTerm}
                            className={`bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center transition shadow-sm ${isAiSearching ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isAiSearching ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                            ) : (
                                <Sparkles className="w-4 h-4 mr-1.5" />
                            )}
                            {isAiSearching ? 'Thinking...' : 'Ask AI'}
                        </button>
                    )}
                  </div>
              </div>

              {/* Filters */}
              <div className="flex gap-3 w-full md:w-auto overflow-x-auto">
                 <div className="relative min-w-[160px] flex-1 md:flex-none">
                    <select 
                        className="block w-full pl-4 pr-10 py-4 text-base border-gray-200 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 rounded-xl bg-white border text-gray-700 hover:bg-gray-50 cursor-pointer appearance-none"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        {Object.values(LandType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                 </div>

                 <div className="relative min-w-[180px] flex-1 md:flex-none">
                    <select 
                        className="block w-full pl-4 pr-10 py-4 text-base border-gray-200 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 rounded-xl bg-white border text-gray-700 hover:bg-gray-50 cursor-pointer appearance-none"
                        value={priceLabel}
                        onChange={(e) => handlePriceChange(e.target.value)}
                    >
                        <option>Any Price</option>
                        <option>Under ₹10 Lakhs</option>
                        <option>₹10L - ₹50 Lakhs</option>
                        <option>₹50L - ₹1 Crore</option>
                        <option>₹1 Crore+</option>
                    </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                 </div>
              </div>
            </div>
            
            {/* AI Search Feedback */}
            {aiFilteredIds && (
                <div className="mt-5 flex items-center">
                    <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-base flex items-center border border-indigo-100">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Showing AI results for: <span className="font-semibold ml-1">"{searchTerm}"</span>
                    </div>
                    <button 
                        onClick={clearAiSearch}
                        className="ml-4 text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                        Return to all listings
                    </button>
                </div>
            )}
          </div>
        )}

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredListings.map(listing => (
            <ListingCard 
              key={listing.id} 
              listing={listing} 
              onClick={handleListingClick} 
              isFavorite={favorites.has(listing.id)}
              onToggleFavorite={(e) => toggleFavorite(listing.id, e)}
            />
          ))}
        </div>
        
        {filteredListings.length === 0 && (
            <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-300">
                <Filter className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-medium text-gray-900">No listings found</h3>
                <p className="text-gray-500 text-lg mt-2">
                    {aiFilteredIds 
                        ? "AI couldn't find matches for your specific query. Try a broader search." 
                        : "Try adjusting your filters or search term."}
                </p>
                <button 
                  onClick={() => { 
                      setSelectedType('All'); 
                      handlePriceChange('Any Price'); 
                      setSearchTerm(''); 
                      setAiFilteredIds(null);
                  }}
                  className="mt-6 text-emerald-600 font-medium hover:text-emerald-700 text-lg"
                >
                  Clear all filters
                </button>
            </div>
        )}
      </main>
    </div>
  );
};

export default Home;
