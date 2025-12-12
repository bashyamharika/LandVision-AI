import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import ListingDetails from './pages/ListingDetails';
import SellerDashboard from './pages/SellerDashboard';
import Checkout from './pages/Checkout';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import AuthPage from './components/AuthPage';
import { Listing } from './types';
import { MOCK_LISTINGS } from './services/mockData';
import { CheckCircle, XCircle } from 'lucide-react';

// Toast Notification Component
const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 text-white transform transition-all duration-300 z-[60] ${type === 'success' ? 'bg-emerald-600' : 'bg-red-500'}`}>
      {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      <span className="font-medium">{message}</span>
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  
  // Persistence Layer: Load from LocalStorage or fallback to Mock Data
  const [listings, setListings] = useState<Listing[]>(() => {
    try {
      const saved = localStorage.getItem('landvision_listings');
      return saved ? JSON.parse(saved) : MOCK_LISTINGS;
    } catch (e) {
      return MOCK_LISTINGS;
    }
  });

  const [favorites, setFavorites] = useState<Set<string>>(() => {
     try {
       const saved = localStorage.getItem('landvision_favorites');
       return saved ? new Set(JSON.parse(saved)) : new Set();
     } catch(e) {
       return new Set();
     }
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Sync with LocalStorage whenever listings change
  useEffect(() => {
    localStorage.setItem('landvision_listings', JSON.stringify(listings));
  }, [listings]);

  // Sync favorites
  useEffect(() => {
    localStorage.setItem('landvision_favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleAddListing = (newListing: Listing) => {
    // Add to top of list
    setListings(prev => [newListing, ...prev]);
    showToast("Listing posted successfully!");
    // Navigate to home to see the new listing
    setCurrentPage('home');
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast("Removed from favorites");
      } else {
        next.add(id);
        showToast("Added to favorites");
      }
      return next;
    });
  };

  // Helper to safely check API key
  const hasApiKey = () => {
    return !!process.env.API_KEY;
  };

  // Login handler
  const handleLogin = (userData: { name: string; email: string }) => {
    setIsAuthenticated(true);
    setUser(userData);
    showToast(`Welcome back, ${userData.name}!`);
  };
  
  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    showToast("Signed out successfully", 'success');
    setCurrentPage('home');
  };

  // Simple router
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home 
            setPage={setCurrentPage} 
            setSelectedListing={setSelectedListing} 
            listings={listings}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            showFavoritesOnly={showFavoritesOnly}
            setShowFavoritesOnly={setShowFavoritesOnly}
            onLogout={handleLogout}
            user={user || undefined}
          />
        );
      case 'my-listings':
         const myListings = listings.filter(l => l.sellerId === 'user-current');
         return (
            <Home
                setPage={setCurrentPage}
                setSelectedListing={setSelectedListing}
                listings={myListings}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                showFavoritesOnly={false}
                setShowFavoritesOnly={setShowFavoritesOnly}
                onLogout={handleLogout}
                user={user || undefined}
                title="My Listings"
                subtitle="Manage properties you are selling."
            />
         );
      case 'listing':
        if (!selectedListing) return <Home setPage={setCurrentPage} setSelectedListing={setSelectedListing} listings={listings} favorites={favorites} toggleFavorite={toggleFavorite} showFavoritesOnly={showFavoritesOnly} setShowFavoritesOnly={setShowFavoritesOnly} onLogout={handleLogout} user={user || undefined} />;
        return (
          <ListingDetails 
            listing={selectedListing} 
            setPage={setCurrentPage} 
            isFavorite={favorites.has(selectedListing.id)}
            toggleFavorite={(e) => toggleFavorite(selectedListing.id, e)}
            onLogout={handleLogout}
            user={user || undefined}
          />
        );
      case 'sell':
        return <SellerDashboard setPage={setCurrentPage} addListing={handleAddListing} onLogout={handleLogout} user={user || undefined} />;
      case 'settings':
         if (!user) return null;
         return <Settings user={user} setPage={setCurrentPage} onUpdateUser={setUser} onLogout={handleLogout} />;
      case 'profile':
         if (!user) return null;
         return <Profile user={user} setPage={setCurrentPage} onLogout={handleLogout} />;
      case 'checkout':
        if (!selectedListing) return <Home setPage={setCurrentPage} setSelectedListing={setSelectedListing} listings={listings} favorites={favorites} toggleFavorite={toggleFavorite} showFavoritesOnly={showFavoritesOnly} setShowFavoritesOnly={setShowFavoritesOnly} onLogout={handleLogout} user={user || undefined} />;
        return (
           <Checkout 
              listing={selectedListing} 
              setPage={setCurrentPage} 
              onSuccess={() => showToast("Booking confirmed successfully!")}
              onLogout={handleLogout}
              user={user || undefined}
           />
        );
      default:
        return (
          <Home 
            setPage={setCurrentPage} 
            setSelectedListing={setSelectedListing} 
            listings={listings}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            showFavoritesOnly={showFavoritesOnly}
            setShowFavoritesOnly={setShowFavoritesOnly}
            onLogout={handleLogout}
            user={user || undefined}
          />
        );
    }
  };

  // If not authenticated, show Auth Page
  if (!isAuthenticated) {
    return (
      <div className="font-sans antialiased text-gray-900">
        <AuthPage onLogin={handleLogin} />
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </div>
    );
  }

  return (
    <div className="font-sans antialiased text-gray-900">
      {renderPage()}
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Disclaimer for Demo */}
      {!hasApiKey() && (
          <div className="fixed bottom-0 left-0 right-0 bg-indigo-900 text-white text-xs p-2 text-center z-50 opacity-90">
             Demo Mode: AI Features (Visualization, Chat, Estimator) require a Gemini API Key. 
             Ensure <code>API_KEY</code> is configured.
          </div>
      )}
    </div>
  );
};

export default App;