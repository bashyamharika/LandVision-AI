import { GoogleGenAI, Type } from "@google/genai";
import { Listing, VisualizationRequest } from '../types';

// Simple in-memory cache to store AI responses
const AI_CACHE = new Map<string, any>();

// Helper to generate cache keys
const generateCacheKey = (prefix: string, data: any) => {
  return `${prefix}_${JSON.stringify(data)}`;
};

const getAiClient = () => {
    // Use standard process.env.API_KEY as per guidelines
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateListingDescription = async (details: Partial<Listing>): Promise<string> => {
  if (!process.env.API_KEY) return "AI Description unavailable (Missing API Key)";
  
  const cacheKey = generateCacheKey('desc', { t: details.type, c: details.location?.city, a: details.area, p: details.price });
  if (AI_CACHE.has(cacheKey)) return AI_CACHE.get(cacheKey);

  const ai = getAiClient();
  try {
    // Optimized prompt for MAXIMUM speed: Short, direct instructions.
    const prompt = `
      Act as a real estate copywriter. Write a 30-word selling description.
      Listing: ${details.type}, ${details.area} sqft, ${details.location?.city}. Price: ${details.price}.
      Features: ${details.features?.join(',')}.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 60, // Reduced for speed
        systemInstruction: "Concise. Professional.",
        thinkingConfig: { thinkingBudget: 0 } 
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
      Analyze risk for land listing: ${listing.title}, ${listing.type}, Verified: ${listing.verified}.
      Return JSON: { "score": int, "summary": "1 sentence", "risks": ["short point 1", "short point 2"] }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 150, // Reduced for speed
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        },
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
        case 'Modern Contemporary': return 'concrete, glass windows, flat roof';
        case 'Traditional Kerala': return 'sloping red tile roof, pillars';
        case 'Colonial': return 'white walls, arched windows';
        case 'Minimalist': return 'clean white boxy shape';
        case 'Rustic Farmhouse': return 'stone work, porch';
        case 'Eco-Tropical': return 'bamboo, green roof';
        default: return 'modern architecture';
    }
};

export const visualizeLand = async (listing: Listing, request: VisualizationRequest, forceRefresh = false): Promise<string | null> => {
  if (!process.env.API_KEY) return null;
  
  const uniqueSuffix = forceRefresh ? Date.now() : '';
  const cacheKey = generateCacheKey('img', { id: listing.id, ...request, uniqueSuffix });
  
  if (!forceRefresh && AI_CACHE.has(cacheKey)) return AI_CACHE.get(cacheKey);

  const ai = getAiClient();
  try {
    const styleDetails = getStyleDetails(request.style);
    
    // Shortened prompt for faster token processing while maintaining quality instructions
    const prompt = request.viewMode === 'panorama' 
      ? `Photorealistic 360-degree equirectangular panorama. ${request.style} house, ${listing.location.city} landscape. ${styleDetails}. Golden hour.`
      : `Photorealistic architectural shot. ${request.style} house on empty plot. ${listing.location.city} landscape. ${styleDetails}. Cinematic lighting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: prompt,
      config: {
        imageConfig: {
          aspectRatio: "16:9"
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
     // Extremely direct prompt to reduce processing time
     const prompt = `
      Estimate construction cost INR. ${listing.area} sqft plot, ${listing.location.city}.
      ${request.floors}-floor ${request.buildingType}. Quality: ${quality}.
      Return JSON only:
      { "construction": { "min": int, "max": int }, "legal": { "min": int, "max": int }, "utility": { "min": int, "max": int } }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 150, // Reduced for speed
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    
    const text = response.text || "{}";
    const result = JSON.parse(text);
    
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

    const ai = getAiClient();
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `Agent for ${listing.title}. Be concise.`,
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
    
    const cacheKey = generateCacheKey('search', { q: query, listLen: listings.length });
    if (AI_CACHE.has(cacheKey)) return AI_CACHE.get(cacheKey);
  
    const ai = getAiClient();
    try {
      const data = listings.map(l => ({ id: l.id, t: l.title, c: l.location.city, p: l.price, type: l.type }));
  
      const prompt = `
        Find matches for "${query}" in Data. Return JSON IDs array.
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