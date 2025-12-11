
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Listing } from '../types';
import { ArrowLeft, ShieldCheck, CreditCard, Lock, CheckCircle } from 'lucide-react';

interface CheckoutProps {
  listing: Listing;
  setPage: (page: string) => void;
  onSuccess: () => void;
  onLogout: () => void;
  user?: { name: string; email: string };
}

const Checkout: React.FC<CheckoutProps> = ({ listing, setPage, onSuccess, onLogout, user }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar setPage={setPage} onLogout={onLogout} user={user} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <button 
            onClick={() => setPage('listing')}
            className="flex items-center text-gray-600 hover:text-emerald-600 text-lg font-medium transition mb-6"
        >
            <ArrowLeft className="w-5 h-5 mr-2" /> Cancel & Return
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 flex flex-col md:flex-row">
          
          {/* Left: Summary */}
          <div className="w-full md:w-1/3 bg-gray-100 p-8 border-r border-gray-200">
             <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
             
             <div className="aspect-video w-full rounded-lg overflow-hidden mb-4 shadow-sm">
               <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
             </div>
             
             <h4 className="font-bold text-lg text-gray-900 mb-1">{listing.title}</h4>
             <p className="text-gray-500 text-sm mb-4">{listing.location.city}</p>
             
             <div className="border-t border-gray-200 py-4 space-y-3">
               <div className="flex justify-between text-gray-600">
                 <span>Land Price</span>
                 <span>₹{(listing.price / 100000).toFixed(2)} L</span>
               </div>
               <div className="flex justify-between text-gray-600">
                 <span>Booking Token</span>
                 <span>₹10,000</span>
               </div>
               <div className="flex justify-between text-gray-600">
                 <span>Platform Fee</span>
                 <span>₹0</span>
               </div>
             </div>
             
             <div className="border-t border-gray-200 pt-4 mt-2">
               <div className="flex justify-between font-bold text-xl text-gray-900">
                 <span>Total Payable</span>
                 <span>₹10,000</span>
               </div>
               <p className="text-xs text-gray-500 mt-2">Fully refundable within 7 days.</p>
             </div>
          </div>

          {/* Right: Action */}
          <div className="w-full md:w-2/3 p-10 relative">
             
             {step === 1 ? (
               <div className="animate-fade-in">
                 <div className="flex items-center mb-8">
                    <div className="bg-emerald-100 p-3 rounded-full mr-4">
                      <CreditCard className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Secure Your Booking</h2>
                      <p className="text-gray-500">Pay a token amount to freeze this price.</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start">
                       <ShieldCheck className="w-6 h-6 text-blue-600 mr-3 shrink-0 mt-0.5" />
                       <div>
                         <h4 className="font-bold text-blue-900 text-sm">LandVision Guarantee</h4>
                         <p className="text-sm text-blue-700 mt-1">Your money is held in an escrow account until you verify documents. 100% Refundable.</p>
                       </div>
                    </div>

                    <form className="space-y-4">
                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Card Number</label>
                          <div className="relative">
                             <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-4 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none text-lg" />
                             <Lock className="w-5 h-5 text-gray-400 absolute right-4 top-4.5" />
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Expiry</label>
                            <input type="text" placeholder="MM/YY" className="w-full p-4 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none text-lg" />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">CVC</label>
                            <input type="text" placeholder="123" className="w-full p-4 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none text-lg" />
                          </div>
                       </div>
                    </form>

                    <button 
                      onClick={handlePayment}
                      disabled={loading}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-xl text-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex justify-center items-center mt-6"
                    >
                      {loading ? 'Processing...' : 'Pay ₹10,000 Now'}
                    </button>
                    
                    <div className="flex justify-center space-x-4 mt-4 opacity-50">
                       <div className="h-8 bg-gray-200 w-12 rounded"></div>
                       <div className="h-8 bg-gray-200 w-12 rounded"></div>
                       <div className="h-8 bg-gray-200 w-12 rounded"></div>
                    </div>
                 </div>
               </div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in py-10">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                  <p className="text-gray-500 text-lg max-w-md mb-8">
                    You have successfully reserved <strong>{listing.title}</strong>. The seller has been notified and will contact you shortly.
                  </p>
                  <div className="flex gap-4">
                    <button 
                       onClick={() => setPage('home')}
                       className="px-6 py-3 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition"
                    >
                       Return Home
                    </button>
                    <button className="px-6 py-3 bg-emerald-600 rounded-xl font-bold text-white hover:bg-emerald-700 transition shadow-md">
                       View Receipt
                    </button>
                  </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
