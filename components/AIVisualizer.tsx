
import React, { useState } from 'react';
import { Listing, VisualizationRequest } from '../types';
import { visualizeLand } from '../services/geminiService';
import { Eye, Loader2, RefreshCw, Image as ImageIcon, Download, Ruler, Rotate3D, Box, Compass } from 'lucide-react';

const AIVisualizer: React.FC<{ listing: Listing }> = ({ listing }) => {
  const [request, setRequest] = useState<VisualizationRequest>({
    buildingType: 'House',
    style: 'Modern Contemporary',
    floors: 1,
    footprintCoverage: 40,
    setbackDistance: 10,
    viewMode: 'standard'
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleVisualize = async () => {
    if (loading) return;

    setLoading(true);
    try {
        const url = await visualizeLand(listing, request, true);
        if (url) {
            setImageUrl(url);
        } else {
            alert("Could not generate image. Please ensure your API key is valid.");
        }
    } catch (e) {
        console.error("Visualizer Error", e);
    } finally {
        setLoading(false);
    }
  };

  const handleExportGLTF = () => {
      if(!imageUrl) return;
      setExporting(true);
      // Simulate GLTF generation/export delay
      setTimeout(() => {
          const link = document.createElement('a');
          link.href = imageUrl;
          link.download = `landvision_model_${listing.id}_${request.viewMode}.png`; 
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setExporting(false);
          alert("Texture Map Downloaded! Import this as an Environment Texture in 3D software for a full 360 effect.");
      }, 1500);
  };

  const calculatedBuiltArea = Math.round(listing.area * ((request.footprintCoverage || 40) / 100));

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl text-white border border-gray-700">
      <div className="p-6 border-b border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-800/50 gap-4">
        <div className="flex items-center space-x-3">
            <div className="bg-emerald-500/20 p-2.5 rounded-lg">
                <Eye className="text-emerald-400 w-6 h-6" />
            </div>
            <div>
                <h3 className="font-bold text-xl">AI Architect</h3>
                <p className="text-gray-400 text-sm">Visualize constructions instantly</p>
            </div>
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex bg-gray-800 p-1 rounded-lg border border-gray-600 self-end sm:self-auto">
           <button 
              onClick={() => { setRequest({...request, viewMode: 'standard'}); setImageUrl(null); }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${request.viewMode === 'standard' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
           >
              Standard
           </button>
           <button 
              onClick={() => { setRequest({...request, viewMode: 'panorama'}); setImageUrl(null); }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition flex items-center ${request.viewMode === 'panorama' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' : 'text-gray-400 hover:text-white'}`}
           >
              <Rotate3D className="w-4 h-4 mr-1.5" /> 360° View
           </button>
        </div>
      </div>

      <div className="p-8">
         {!imageUrl ? (
           <div 
             onClick={handleVisualize}
             className="bg-gray-800/50 rounded-xl p-10 text-center border-2 border-dashed border-gray-600 h-80 flex flex-col items-center justify-center transition-all hover:bg-gray-800/80 cursor-pointer group"
            >
               {loading ? (
                   <div className="flex flex-col items-center animate-pulse cursor-default">
                       <Loader2 className="w-12 h-12 animate-spin text-emerald-400 mb-5" />
                       <p className="text-lg font-medium text-emerald-400">
                           {request.viewMode === 'panorama' ? 'Creating 360° Environment...' : 'Rendering Architectural Visualization...'}
                       </p>
                       <p className="text-sm text-gray-500 mt-2">
                           Using Gemini 2.5 Flash Image Model
                       </p>
                   </div>
               ) : (
                   <div className="flex flex-col items-center text-gray-500 group-hover:text-gray-300 transition-colors">
                       <div className="relative mb-4">
                          <ImageIcon className="w-16 h-16 opacity-50" />
                          {request.viewMode === 'panorama' && (
                              <div className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">360°</div>
                          )}
                       </div>
                       <p className="font-medium text-gray-300 text-xl group-hover:text-white transition">
                           {request.viewMode === 'panorama' ? 'Generate 360° Panorama' : 'Generate Visualization'}
                       </p>
                       <p className="text-sm max-w-sm mt-3 text-gray-400 group-hover:text-gray-300">
                           {request.viewMode === 'panorama' 
                             ? 'Click to create an immersive spherical view of the potential construction.' 
                             : 'Click to see a photorealistic render of the property.'}
                       </p>
                       <button className="mt-5 bg-gray-700 group-hover:bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-all">
                           Start Rendering
                       </button>
                   </div>
               )}
           </div>
         ) : (
            <div className="relative group">
                {/* Image Container */}
                <div className={`relative w-full rounded-xl bg-gray-800 border border-gray-600 shadow-2xl overflow-hidden ${request.viewMode === 'panorama' ? 'h-96' : 'h-[500px]'}`}>
                    
                    {request.viewMode === 'panorama' ? (
                        <div className="w-full h-full overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing scrollbar-hide relative group/pano">
                            {/* Drag hint overlay */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 opacity-80 pointer-events-none transition duration-500">
                                 <div className="bg-black/60 px-4 py-1.5 rounded-full flex items-center text-white text-xs backdrop-blur-md border border-white/10 shadow-lg">
                                     <Compass className="w-3 h-3 mr-2 animate-spin-slow" /> Drag or Scroll to look around
                                 </div>
                            </div>
                            
                            {/* The Panorama Image - Stretched for fake 360 effect on 2D scroll */}
                            <img 
                                src={imageUrl} 
                                alt="360 AI Concept" 
                                className="h-full max-w-none w-[200%] object-cover" 
                                style={{ minWidth: '200%' }}
                            />
                        </div>
                    ) : (
                        <img src={imageUrl} alt="AI Concept" className="w-full h-full object-cover" />
                    )}
                </div>
                
                {/* Info Overlay (Standard Mode Only) */}
                {request.viewMode !== 'panorama' && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 rounded-xl flex flex-col justify-end p-6 pointer-events-none">
                        <p className="text-white font-bold text-base">AI Concept: {request.style} {request.buildingType}</p>
                        <p className="text-sm text-gray-300">Coverage: {request.footprintCoverage}% | Setback: {request.setbackDistance}ft</p>
                    </div>
                )}

                 {/* Action Buttons */}
                 <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition duration-300 z-30">
                     <button 
                        onClick={handleExportGLTF}
                        disabled={exporting}
                        className="bg-gray-800/90 hover:bg-gray-700 text-white p-2.5 rounded-lg flex items-center shadow-lg cursor-pointer pointer-events-auto border border-gray-600 backdrop-blur-sm"
                     >
                        {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Box className="w-4 h-4 mr-2" />}
                        {exporting ? 'Packing...' : 'Export Texture'}
                     </button>
                     <a href={imageUrl} download={`landvision_${listing.id}.png`} className="bg-emerald-600/90 hover:bg-emerald-500 text-white p-2.5 rounded-lg flex items-center shadow-lg cursor-pointer pointer-events-auto backdrop-blur-sm">
                        <Download className="w-4 h-4 mr-2" /> Save
                    </a>
                </div>
            </div>
         )}

         <div className="mt-8 p-6 bg-gray-800 rounded-xl border border-gray-700">
             
             {/* Type & Style Selectors */}
             <div className="grid grid-cols-2 gap-6 mb-6">
                 <div>
                    <label className="text-xs uppercase tracking-wider font-bold text-gray-400 block mb-2.5">Structure</label>
                    <select 
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg text-base text-gray-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 py-3 px-4 transition"
                        value={request.buildingType}
                        onChange={(e) => setRequest({...request, buildingType: e.target.value as VisualizationRequest['buildingType']})}
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
                    <label className="text-xs uppercase tracking-wider font-bold text-gray-400 block mb-2.5">Architectural Style</label>
                    <select 
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg text-base text-gray-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 py-3 px-4 transition"
                        value={request.style}
                        onChange={(e) => setRequest({...request, style: e.target.value as VisualizationRequest['style']})}
                    >
                        <option value="Modern Contemporary">Modern Contemporary</option>
                        <option value="Traditional Kerala">Traditional Kerala</option>
                        <option value="Colonial">Colonial</option>
                        <option value="Minimalist">Minimalist</option>
                        <option value="Rustic Farmhouse">Rustic Farmhouse</option>
                        <option value="Eco-Tropical">Eco-Tropical</option>
                    </select>
                 </div>
             </div>

             {/* Footprint & Setback Sliders */}
             <div className="grid grid-cols-1 gap-6 mb-6 border-t border-gray-700 pt-6">
                 <div>
                    <div className="flex justify-between items-center mb-3">
                        <label className="text-xs uppercase tracking-wider font-bold text-gray-400 flex items-center">
                            <Ruler className="w-4 h-4 mr-2" /> Building Footprint (Coverage)
                        </label>
                        <span className="text-sm font-mono text-emerald-400 bg-gray-900 px-2 py-1 rounded border border-gray-700">{request.footprintCoverage}% (~{calculatedBuiltArea.toLocaleString()} sqft)</span>
                    </div>
                    <input 
                        type="range" 
                        min="10" 
                        max="90" 
                        step="5"
                        value={request.footprintCoverage} 
                        onChange={(e) => setRequest({...request, footprintCoverage: parseInt(e.target.value)})}
                        className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                 </div>

                 <div>
                    <div className="flex justify-between items-center mb-3">
                         <label className="text-xs uppercase tracking-wider font-bold text-gray-400">
                             Boundary Setback (Front)
                         </label>
                         <span className="text-sm font-mono text-emerald-400 bg-gray-900 px-2 py-1 rounded border border-gray-700">{request.setbackDistance} ft</span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max="50" 
                        step="5"
                        value={request.setbackDistance} 
                        onChange={(e) => setRequest({...request, setbackDistance: parseInt(e.target.value)})}
                        className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                 </div>
             </div>

             <button 
                onClick={handleVisualize}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-900/50 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed text-lg active:scale-[0.98]"
             >
                {loading ? 'Designing...' : (imageUrl ? <><RefreshCw className="w-5 h-5 mr-3"/> Regenerate Variation</> : 'Generate Visualization')}
             </button>
         </div>
         
         <p className="text-xs text-gray-500 mt-5 text-center opacity-70">
            * Generated by Gemini 2.5 Image Model. Conceptual only.
         </p>
      </div>
    </div>
  );
};

export default AIVisualizer;
