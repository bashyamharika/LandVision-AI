
import React, { useState } from 'react';
import { Listing, VisualizationRequest, CostEstimate } from '../types';
import { estimateConstructionCost } from '../services/geminiService';
import { Calculator, Loader2, IndianRupee, Layers, RefreshCw } from 'lucide-react';

const CostEstimator: React.FC<{ listing: Listing }> = ({ listing }) => {
  const [request, setRequest] = useState<VisualizationRequest>({
    buildingType: 'House',
    style: 'Modern Contemporary', // Default valid style
    floors: 1,
    footprintCoverage: 40,
    setbackDistance: 10
  });
  const [quality, setQuality] = useState<'Economy' | 'Standard' | 'Premium'>('Standard');
  const [estimate, setEstimate] = useState<CostEstimate | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEstimate = async () => {
    setLoading(true);
    try {
        // Pass forceRefresh=true to ensure we get a fresh calculation if the user clicks again
        const result = await estimateConstructionCost(listing, request, quality, true);
        
        if (result && result.construction) {
            // STRICT MATH: Calculate Total on Client Side to avoid AI arithmetic hallucinations
            // Total = Land Price + Construction + Legal + Utility
            const totalMin = listing.price + result.construction.min + result.legal.min + result.utility.min;
            const totalMax = listing.price + result.construction.max + result.legal.max + result.utility.max;

            const safeEstimate: CostEstimate = {
                construction: result.construction,
                legal: result.legal,
                utility: result.utility,
                total: { min: totalMin, max: totalMax }
            };
            setEstimate(safeEstimate);
        } else {
             // Fallback if AI fails (Safety net)
             setEstimate(null);
             alert("Could not generate estimate. Please try again.");
        }
    } catch (e) {
        console.error(e);
    }
    setLoading(false);
  };

  const formatLakhs = (val: number) => `₹${(val / 100000).toFixed(1)} L`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center mb-8">
        <div className="bg-indigo-100 p-3 rounded-lg mr-4">
          <Calculator className="w-8 h-8 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-xl leading-tight">Project Budgeting</h3>
          <p className="text-base text-gray-500">AI-powered construction estimate</p>
        </div>
      </div>

      <div className="space-y-6 mb-8">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-bold text-gray-700 mb-2 uppercase tracking-wide">Type</label>
            <select 
              className="w-full bg-gray-50 border-gray-200 text-gray-800 rounded-lg text-lg focus:ring-emerald-500 focus:border-emerald-500 border p-3.5 transition"
              value={request.buildingType}
              onChange={(e) => setRequest({...request, buildingType: e.target.value as any})}
            >
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Apartment">Apartment</option>
              <option value="Commercial Complex">Commercial Complex</option>
              <option value="Farmhouse">Farmhouse</option>
              <option value="Resort Cottage">Resort Cottage</option>
            </select>
          </div>
          <div>
            <label className="block text-base font-bold text-gray-700 mb-2 uppercase tracking-wide">Floors</label>
            <select 
               className="w-full bg-gray-50 border-gray-200 text-gray-800 rounded-lg text-lg focus:ring-emerald-500 focus:border-emerald-500 border p-3.5 transition"
               value={request.floors}
               onChange={(e) => setRequest({...request, floors: parseInt(e.target.value)})}
            >
              <option value={1}>G (1 Floor)</option>
              <option value={2}>G+1 (2 Floors)</option>
              <option value={3}>G+2 (3 Floors)</option>
              <option value={4}>G+3 (4 Floors)</option>
            </select>
          </div>
        </div>

        <div>
           <label className="block text-base font-bold text-gray-700 mb-3 uppercase tracking-wide">Finish Quality</label>
           <div className="grid grid-cols-3 gap-3">
              {(['Economy', 'Standard', 'Premium'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={`text-base py-4 rounded-lg font-medium transition-all ${
                    quality === q 
                    ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {q}
                </button>
              ))}
           </div>
        </div>
      </div>

      <button
        onClick={handleEstimate}
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-5 rounded-xl text-xl font-bold hover:shadow-lg hover:from-indigo-700 hover:to-violet-700 transition flex justify-center items-center mb-8 disabled:opacity-70 active:scale-[0.98]"
      >
        {loading ? (
            <span className="flex items-center"><Loader2 className="w-6 h-6 animate-spin mr-3" /> Calculating...</span>
        ) : (
            <span className="flex items-center">
                {estimate ? <RefreshCw className="w-6 h-6 mr-3" /> : <IndianRupee className="w-6 h-6 mr-3" />} 
                {estimate ? 'Recalculate Estimate' : 'Calculate Total Budget'}
            </span>
        )}
      </button>

      {estimate && (
        <div className="space-y-5 animate-fade-in bg-gray-50 p-6 rounded-xl border border-gray-100">
          <div className="space-y-4">
             <div className="flex justify-between text-lg border-b border-gray-200 pb-2">
                <span className="text-gray-600">Land Price (Fixed)</span>
                <span className="font-semibold text-gray-900">{formatLakhs(listing.price)}</span>
             </div>
             <div className="flex justify-between text-lg border-b border-gray-200 pb-2">
                <span className="text-gray-600">Construction ({quality})</span>
                <span className="font-semibold text-gray-900">{formatLakhs(estimate.construction.min)} - {formatLakhs(estimate.construction.max)}</span>
             </div>
             <div className="flex justify-between text-lg border-b border-gray-200 pb-2">
                <span className="text-gray-600">Legal & Registration</span>
                <span className="font-semibold text-gray-900">{formatLakhs(estimate.legal.min)} - {formatLakhs(estimate.legal.max)}</span>
             </div>
             <div className="flex justify-between text-lg pb-2">
                <span className="text-gray-600">Utilities & Infra</span>
                <span className="font-semibold text-gray-900">{formatLakhs(estimate.utility.min)} - {formatLakhs(estimate.utility.max)}</span>
             </div>
          </div>
          
          <div className="pt-5 border-t-2 border-dashed border-gray-300 mt-2">
             <div className="flex items-center justify-between mb-2">
                <span className="text-base font-bold text-indigo-900 uppercase tracking-wider">Estimated Total Investment</span>
                <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-bold border border-indigo-100">Range</span>
             </div>
             <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                {formatLakhs(estimate.total.min)} - {formatLakhs(estimate.total.max)}
             </p>
             <p className="text-sm text-gray-400 mt-2 italic text-right">*Includes land cost, construction, and estimated fees.</p>
          </div>
        </div>
      )}
      
      {!estimate && !loading && (
          <p className="text-base text-gray-400 text-center italic mt-2">
            Select options above to get a tailored estimate.
          </p>
      )}
    </div>
  );
};

export default CostEstimator;
