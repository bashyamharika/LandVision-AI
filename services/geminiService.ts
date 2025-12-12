import { GoogleGenAI, Type } from "@google/genai";
import { Listing, VisualizationRequest } from '../types';

// Simple in-memory cache to store AI responses
const AI_CACHE = new Map<string, any>();

// Helper to generate cache keys
const generateCacheKey = (prefix: string, data: any) => {
  return `${prefix}_${JSON.stringify(data)}`;
};

const getAiClient = () => {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateListingDescription = async (details: Partial<Listing>): Promise<string> => {
  if (!process.env.API_KEY) return "AI Description unavailable (Missing API Key)";
  
  const cacheKey = generateCacheKey('desc', { t: details.type, c: details.location?.city, a: details.area, p: details.price });
  if (AI_CACHE.has(cacheKey)) return AI_CACHE.get(cacheKey);

  const ai = getAiClient();
  try {
    // Optimized prompt for speed
    const prompt = `
      Write a real estate description (max 50 words).
      Type: ${details.type}, ${details.area} sqft, ${details.location?.city}. Price: ${details.price}.
      Features: ${details.features?.join(',')}.
      Tone: Professional.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 75, // Reduced for speed
        systemInstruction: "Copywriter. Concise.",
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for max speed
      }
    });
    
    const result = response.text || "Could not generate description.";
    AI_CACHE.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating description.";
  }
};

export const analyzeRisk = async (listing: Listing): Promise<{ score: number; summary: string; risks: string[] }> => {
  const cacheKey = generateCacheKey('risk', { id: listing.id });
  if (AI_CACHE.has(cacheKey)) return AI_CACHE.get(cacheKey);

  if (!process.env.API_KEY) return { 
    score: 85, // Default fallback
    summary: "AI Analysis Unavailable", 
    risks: ["API Key missing for live analysis"] 
  };

  const ai = getAiClient();
  try {
    const prompt = `
      Risk Analysis. Listing: ${listing.title}, ${listing.type}, Verified: ${listing.verified}.
      Output JSON: { "score": int, "summary": "string", "risks": ["string"] }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 200,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        },
        systemInstruction: "Risk Analyst. JSON.",
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    const result = JSON.parse(text);
    AI_CACHE.set(cacheKey, result);
    return result;

  } catch (error) {
    console.error("Risk Analysis Error:", error);
    return { score: 60, summary: "Analysis Failed", risks: ["System error"] };
  }
};

const getStyleDetails = (style: string) => {
    switch(style) {
        case 'Modern Contemporary': return 'sleek concrete, floor-to-ceiling glass windows, wooden accents, flat roof, minimalist geometry, swimming pool, luxury finish';
        case 'Traditional Kerala': return 'sloping red clay tile roof, intricately carved wooden pillars, veranda, laterite stone walls, open courtyard design, tropical aesthetic';
        case 'Colonial': return 'white plastered walls, arched windows with shutters, high ceilings, roman pillars, symmetrical facade, vintage aesthetic, wrap-around porch';
        case 'Minimalist': return 'clean white lines, boxy shape, large open spaces, industrial metal accents, uncluttered, monochrome palette, glass facade';
        case 'Rustic Farmhouse': return 'exposed brick or stone work, large front porch, timber framing, metal roof, cozy and grounded, chimney, nature-inspired colors';
        case 'Eco-Tropical': return 'bamboo structures, green roof, vertical gardens, open air design, blending with nature, sustainable materials, solar panels, wooden decks';
        default: return 'high quality architectural finishes, premium materials, photorealistic details';
    }
};

export const visualizeLand = async (listing: Listing, request: VisualizationRequest, forceRefresh = false): Promise<string | null> => {
  if (!process.env.API_KEY) return null;
  
  // If forceRefresh is true, we add a random seed to the key to bypass cache
  const uniqueSuffix = forceRefresh ? Date.now() : '';
  const cacheKey = generateCacheKey('img', { id: listing.id, ...request, uniqueSuffix });
  
  if (!forceRefresh && AI_CACHE.has(cacheKey)) return AI_CACHE.get(cacheKey);

  const ai = getAiClient();
  try {
    const coverage = request.footprintCoverage || 40;
    const setback = request.setbackDistance || 10;
    const is360 = request.viewMode === 'panorama';
    const styleDetails = getStyleDetails(request.style);
    
    // Hyper-realistic prompt engineering
    let prompt = "";
    
    if (is360) {
      prompt = `
        Generate a photorealistic seamless 360-degree equirectangular panorama image.
        Subject: A luxurious ${request.style} ${request.buildingType} on a ${listing.area} sqft plot.
        Architecture Details: ${styleDetails}.
        Location Context: ${listing.location.city}, India. Vegetation and terrain must match this specific region (e.g. tropical palms for Kerala, rocky terrain for Deccan, lush green for hills).
        Lighting: Golden hour lighting, warm sun glow casting realistic long shadows, physically based rendering (PBR) of materials.
        View: From the center of the front courtyard looking outwards at the building and surroundings.
        Quality: 8k resolution, Unreal Engine 5, Ray Tracing, highly detailed textures, VR Ready, no stitching artifacts.
        Format: Wide aspect ratio, seamless edges for spherical mapping.
      `;
    } else {
      prompt = `
        High-end architectural photography of a ${request.style} ${request.buildingType} constructed on a ${listing.area} sqft land plot in ${listing.location.city}.
        Architecture Details: ${styleDetails}.
        Viewpoint: Wide-angle eye-level shot capturing the entire building facade, driveway, and landscaping.
        Environment: Realistic terrain data for ${listing.location.city}, accurate local vegetation (trees, shrubs), realistic soil/grass texture.
        Layout: Building footprint takes up ${coverage}% of the land area, with a ${setback}ft wide driveway/setback from the front road.
        Lighting: Natural daylight, soft shadows, global illumination, cinematic composition, physically based rendering.
        Quality: 8k resolution, Unreal Engine 5 render style, photorealistic, 4k material textures.
      `;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: prompt,
      config: {
        imageConfig: {
          aspectRatio: is360 ? "16:9" : "16:9" // Use 16:9 for 360 to get max width available
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
       if (part.inlineData) {
         const url = `data:image/png;base64,${part.inlineData.data}`;
         AI_CACHE.set(cacheKey, url);
         return url;
       }
    }
    return null;

  } catch (error) {
    console.error("Visualization Error:", error);
    return null;
  }
};

export const estimateConstructionCost = async (
    listing: Listing, 
    request: VisualizationRequest, 
    quality: 'Economy' | 'Standard' | 'Premium' = 'Standard',
    forceRefresh = false
): Promise<any> => {
  if (!process.env.API_KEY) return null;

  const cacheKey = generateCacheKey('cost', { area: listing.area, city: listing.location.city, type: request.buildingType, floors: request.floors, q: quality });
  
  if (!forceRefresh && AI_CACHE.has(cacheKey)) return AI_CACHE.get(cacheKey);
  
  const ai = getAiClient();
  try {
     // Explicit instruction to return discrete component costs
     const prompt = `
      Calculate construction cost estimates in INR (Indian Rupees) for a ${listing.area} sqft plot in ${listing.location.city}.
      Project: ${request.floors}-floor ${request.buildingType}. 
      Finish Quality: ${quality}.
      
      Return a JSON object with these exact keys:
      - "construction": { "min": number, "max": number } (Material + Labor cost)
      - "legal": { "min": number, "max": number } (Permissions + Registration)
      - "utility": { "min": number, "max": number } (Water + Electricity + Compound Wall)
      
      Do NOT calculate Total. I will sum it up myself.
      Values should be realistic 2024 market rates for ${listing.location.city}.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 250,
        responseMimeType: "application/json",
        // System instruction ensures we get a strict JSON for parsing
        systemInstruction: `You are a Senior Civil Engineer and Cost Estimator in India. Provide realistic cost ranges based on 2024-2025 market rates. Output JSON only.`,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    
    const text = response.text || "{}";
    const result = JSON.parse(text);
    
    // Cache the result
    AI_CACHE.set(cacheKey, result);
    return result;
  } catch (e) {
    console.error("Cost Estimation Error", e);
    return null;
  }
}

export const chatWithListingAgent = async function* (listing: Listing, history: {role: string, parts: {text: string}[]}[], message: string) {
    if (!process.env.API_KEY) {
        yield "Chat unavailable without API Key.";
        return;
    }

    // Chat is real-time, no caching
    const ai = getAiClient();
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                // maxOutputTokens removed to allow natural streaming flow
                systemInstruction: `Real Estate Agent for LandVision. Listing: ${listing.title}. Concise answers.`,
                thinkingConfig: { thinkingBudget: 0 }
            },
            history: history
        });

        const result = await chat.sendMessageStream({ message });
        for await (const chunk of result) {
            const text = chunk.text;
            if (text) {
                yield text;
            }
        }
    } catch (e) {
        console.error("Chat Error", e);
        yield "Connection error.";
    }
}

export const searchLandWithAI = async (query: string, listings: Listing[]): Promise<string[]> => {
    if (!process.env.API_KEY) return listings.map(l => l.id); 
    
    // Cache search queries
    const cacheKey = generateCacheKey('search', { q: query, listLen: listings.length });
    if (AI_CACHE.has(cacheKey)) return AI_CACHE.get(cacheKey);
  
    const ai = getAiClient();
    try {
      // Minimized payload for speed
      const data = listings.map(l => ({ id: l.id, t: l.title, c: l.location.city, p: l.price, type: l.type }));
  
      const prompt = `
        Search "${query}" in data. Return matching IDs JSON array.
        Data: ${JSON.stringify(data)}
      `;
  
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          maxOutputTokens: 100,
          responseMimeType: "application/json",
           responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
  
      const result = JSON.parse(response.text || "[]");
      AI_CACHE.set(cacheKey, result);
      return result;
    } catch (e) {
      return [];
    }
  };