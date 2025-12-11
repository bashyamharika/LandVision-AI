
import React, { useState, useRef, useEffect } from 'react';
import { PlusCircle, Search, User, Heart, LogOut, Settings, List, ChevronDown } from 'lucide-react';

interface NavbarProps {
    setPage: (page: string) => void;
    favoritesCount?: number;
    onToggleFavorites?: () => void;
    showingFavorites?: boolean;
    onLogout?: () => void;
    user?: { name: string; email: string };
}

const Navbar: React.FC<NavbarProps> = ({ setPage, favoritesCount = 0, onToggleFavorites, showingFavorites, onLogout, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  // Generate initials
  const initials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
    : 'JD';

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center cursor-pointer group" onClick={() => setPage('home')}>
            {/* Logo: White Map Pin on Emerald Background with distinct circle */}
            <div className="bg-emerald-600 p-2.5 rounded-full shadow-sm group-hover:bg-emerald-700 transition shrink-0">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  className="h-6 w-6 text-white"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="currentColor" />
                  <circle cx="12" cy="10" r="3" fill="#059669" />
                </svg>
            </div>
            <span className="ml-3 text-xl md:text-2xl font-bold text-gray-900 tracking-tight hidden xs:block">LandVision</span>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-6">
            
            {onToggleFavorites && (
                 <button 
                    onClick={onToggleFavorites}
                    className={`p-2.5 rounded-full md:rounded-lg flex items-center relative transition hover:bg-gray-100 ${showingFavorites ? 'text-red-500 font-medium' : 'text-gray-500 hover:text-red-500'}`}
                    title="Saved Listings"
                 >
                    <Heart className={`h-6 w-6 md:mr-1 ${showingFavorites ? 'fill-current' : ''}`} />
                    <span className="hidden md:inline text-base">Saved</span>
                    {favoritesCount > 0 && (
                        <span className="absolute top-1 right-1 md:top-0 md:right-auto md:left-full md:ml-1 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 shadow-sm border border-white">
                            {favoritesCount}
                        </span>
                    )}
                </button>
            )}

            <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

            <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setPage('home');
                    if(showingFavorites && onToggleFavorites && showingFavorites) onToggleFavorites();
                  }}
                  className="px-3 md:px-5 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition flex items-center"
                  title="Buy Land"
                >
                  <Search className="h-5 w-5 md:mr-2" />
                  <span className="hidden md:inline">Buy Land</span>
                </button>

                <button 
                  onClick={() => setPage('sell')}
                  className="bg-emerald-600 text-white px-3 md:px-5 py-2.5 rounded-lg text-base font-medium hover:bg-emerald-700 transition flex items-center shadow-sm"
                  title="Sell Land"
                >
                  <PlusCircle className="h-5 w-5 md:mr-2" />
                  <span className="hidden md:inline">Sell Land</span>
                  <span className="inline md:hidden">Sell</span>
                </button>
            </div>
            
            {/* User Profile Dropdown */}
            <div className="relative ml-1" ref={menuRef}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none transition-all"
                >
                  <div className={`flex items-center gap-2 p-1 pr-1 md:pr-2 rounded-full border transition-all ${isMenuOpen ? 'bg-emerald-50 border-emerald-200 ring-2 ring-emerald-100' : 'bg-white border-gray-200 hover:border-emerald-200'}`}>
                     <div className="w-8 h-8 md:w-9 md:h-9 bg-gray-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">
                        {initials}
                     </div>
                     <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform hidden md:block ${isMenuOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {isMenuOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 origin-top-right">
                        <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                            <p className="text-base font-bold text-gray-900 truncate">{user?.name || 'Guest User'}</p>
                            <p className="text-sm text-gray-500 truncate">{user?.email || 'guest@landvision.com'}</p>
                        </div>
                        
                        <div className="py-2">
                            <button onClick={() => { setIsMenuOpen(false); setPage('profile'); }} className="w-full text-left px-5 py-3 text-base text-gray-700 hover:bg-gray-50 hover:text-emerald-600 flex items-center transition-colors">
                                <User className="w-5 h-5 mr-3 text-gray-400" /> My Profile
                            </button>
                             <button onClick={() => { setIsMenuOpen(false); setPage('my-listings'); }} className="w-full text-left px-5 py-3 text-base text-gray-700 hover:bg-gray-50 hover:text-emerald-600 flex items-center transition-colors">
                                <List className="w-5 h-5 mr-3 text-gray-400" /> My Listings
                            </button>
                             <button onClick={() => { setIsMenuOpen(false); setPage('settings'); }} className="w-full text-left px-5 py-3 text-base text-gray-700 hover:bg-gray-50 hover:text-emerald-600 flex items-center transition-colors">
                                <Settings className="w-5 h-5 mr-3 text-gray-400" /> Settings
                            </button>
                        </div>
                        
                        <div className="border-t border-gray-100 mt-1 pt-1">
                             <button 
                                onClick={() => { setIsMenuOpen(false); if(onLogout) onLogout(); }} 
                                className="w-full text-left px-5 py-3 text-base text-red-600 hover:bg-red-50 flex items-center transition-colors"
                            >
                                <LogOut className="w-5 h-5 mr-3" /> Sign out
                            </button>
                        </div>
                    </div>
                )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
