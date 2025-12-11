
import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { generateListingDescription } from '../services/geminiService';
import { Sparkles, Loader2, Upload, MapPin, Check, X, Image as ImageIcon } from 'lucide-react';
import { LandType, Listing } from '../types';

interface SellerDashboardProps {
  setPage: (page: string) => void;
  addListing: (listing: Listing) => void;
  onLogout: () => void;
  user?: { name: string; email: string };
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ setPage, addListing, onLogout, user }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: LandType.RESIDENTIAL,
    area: '',
    price: '',
    city: '',
    address: '',
    description: '',
    features: ''
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAIWrite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.city) {
      alert("Please enter a City and Land Type first so AI can write a relevant description.");
      return;
    }
    
    setGenerating(true);
    const desc = await generateListingDescription({
        type: formData.type,
        area: Number(formData.area) || 0,
        price: Number(formData.price) || 0,
        location: { city: formData.city, address: formData.address } as any,
        features: formData.features ? formData.features.split(',') : []
    });
    setFormData(prev => ({ ...prev, description: desc }));
    setGenerating(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 5000000) { // 5MB limit
            alert("File is too large. Please upload an image under 5MB.");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict validation
    if (!formData.title || !formData.price || !formData.area || !formData.city) {
      alert("Please fill in all required fields marked with *");
      return;
    }

    setSubmitting(true);
    
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    const newListing: Listing = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description || `A premium ${formData.type} plot located in ${formData.city}. Great investment opportunity.`,
      price: Number(formData.price),
      area: Number(formData.area),
      pricePerSqFt: Math.round(Number(formData.price) / Number(formData.area)),
      type: formData.type,
      location: {
        address: formData.address || `${formData.city} Area`,
        city: formData.city,
        lat: 12.97 + (Math.random() * 0.1), // Mock variance
        lng: 77.59 + (Math.random() * 0.1)
      },
      // Use uploaded image or high-quality fallback based on type
      images: previewImage ? [previewImage] : [
        `https://source.unsplash.com/800x600/?land,${formData.type.toLowerCase()},landscape`,
        'https://picsum.photos/800/600?random=10'
      ],
      features: formData.features ? formData.features.split(',').map(f => f.trim()) : ['Verified Owner', 'Clear Title', 'Immediate Registration'],
      sellerId: 'user-current',
      sellerName: user?.name || 'You (Owner)',
      verified: true,
      postedDate: new Date().toISOString().split('T')[0],
      riskScore: 92,
      legalStatus: 'Clear'
    };

    addListing(newListing);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Navbar setPage={setPage} onLogout={onLogout} user={user} />
      
      <main className="max-w-4xl mx-auto py-8 md:py-12 px-4 sm:px-6">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Sell Your Land</h1>
          <p className="text-gray-500 mt-2 text-lg">List in seconds. <span className="text-emerald-600 font-medium hidden sm:inline">AI writes the details for you.</span></p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">
            
            {/* Section 1: Core Details */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-emerald-100 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm shrink-0">1</span>
                Property Basics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="col-span-1 md:col-span-2">
                   <label className="block text-sm font-bold text-gray-700 mb-2">Listing Title <span className="text-red-500">*</span></label>
                   <input 
                      type="text" 
                      className="block w-full bg-white text-gray-900 border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 border p-3.5 text-base" 
                      placeholder="e.g. 1 Acre Fertile Farm Land near Highway"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      required
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">City <span className="text-red-500">*</span></label>
                   <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                      <input 
                          type="text" 
                          className="pl-10 block w-full bg-white text-gray-900 border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 border p-3.5 text-base" 
                          placeholder="e.g. Hyderabad"
                          value={formData.city}
                          onChange={e => setFormData({...formData, city: e.target.value})}
                          required
                      />
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Land Type <span className="text-red-500">*</span></label>
                   <select 
                      className="block w-full bg-white text-gray-900 border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 border p-3.5 text-base"
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value as LandType})}
                   >
                     {Object.values(LandType).map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                 </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Section 2: Numbers */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-emerald-100 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm shrink-0">2</span>
                Price & Size
              </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Plot Area (sqft) <span className="text-red-500">*</span></label>
                   <input 
                      type="number" 
                      min="1"
                      className="block w-full bg-white text-gray-900 border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 border p-3.5 text-base" 
                      placeholder="2400"
                      value={formData.area}
                      onChange={e => setFormData({...formData, area: e.target.value})}
                      required
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Total Price (₹) <span className="text-red-500">*</span></label>
                   <input 
                      type="number"
                      min="1" 
                      className="block w-full bg-white text-gray-900 border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 border p-3.5 text-base" 
                      placeholder="5000000"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      required
                   />
                 </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Section 3: AI Description */}
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 border border-indigo-100 relative overflow-hidden shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 relative z-10 gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-indigo-900 flex items-center">
                        <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
                        AI Description Writer
                    </h3>
                  </div>
                  <button 
                      onClick={handleAIWrite}
                      className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center hover:bg-indigo-700 transition w-full sm:w-auto justify-center"
                      disabled={generating}
                      type="button"
                  >
                      {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : null}
                      {generating ? 'Writing...' : 'Auto-Generate'}
                  </button>
              </div>

              <div className="relative z-10">
                  <textarea 
                      rows={5}
                      className="block w-full bg-white text-gray-900 border-indigo-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border p-3.5 text-base resize-none"
                      placeholder="AI will write the description here..."
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                  />
              </div>
            </div>
          
            {/* Section 4: Images */}
            <div>
               <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-emerald-100 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm shrink-0">3</span>
                Photos
               </h3>
               
               <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                />

               {!previewImage ? (
                   <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 cursor-pointer transition group flex flex-col items-center justify-center h-48"
                    >
                      <div className="bg-gray-100 w-14 h-14 rounded-full flex items-center justify-center mb-3 group-hover:bg-emerald-100 transition">
                        <Upload className="h-7 w-7 text-gray-400 group-hover:text-emerald-600" />
                      </div>
                      <p className="text-base font-medium text-gray-900">Upload Property Image</p>
                      <p className="text-sm text-gray-500 mt-1">Click to browse (Max 5MB)</p>
                   </div>
               ) : (
                   <div className="relative rounded-xl overflow-hidden border border-gray-200 h-64 group bg-gray-100">
                       <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                           <button 
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100"
                            >
                                Change
                            </button>
                            <button 
                                type="button"
                                onClick={() => setPreviewImage(null)}
                                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                       </div>
                   </div>
               )}
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-6 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-end gap-3">
             <button 
                type="button"
                onClick={() => setPage('home')}
                className="w-full sm:w-auto py-3.5 px-6 border border-gray-300 rounded-lg text-lg font-medium text-gray-700 hover:bg-white transition"
            >
                Cancel
            </button>
            <button 
                type="submit" 
                disabled={submitting}
                className="w-full sm:w-auto flex justify-center py-3.5 px-8 border border-transparent rounded-lg shadow-lg text-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {submitting ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Check className="w-5 h-5 mr-2" />}
                {submitting ? 'Publishing...' : 'Post Listing'}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
};

export default SellerDashboard;
