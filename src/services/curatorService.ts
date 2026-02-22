import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export async function analyzeItem(description: string, currentListings: any[]) {
  const ai = getAI();
  if (!ai) return "I apologize, but the AI analysis service is currently unavailable. Please ensure the API key is configured.";

  const listingsContext = currentListings.map(item => `- ${item.title}: ${item.url}`).join('\n');

  const prompt = `You are a world-class antiquarian book expert and rare collectibles specialist for Whiteharmar Books. 
  A user has provided the following description of an item (could be a book, manuscript, toy, or other collectible):
  "${description}"
  
  **Your Task:**
  1. **Internal Inventory Check**: First, check if this item matches any of the items currently in our collection:
  ${listingsContext}
  If it matches an item we have, you MUST explicitly mention it and provide the direct link to our listing on Whiteharmar Books.
  
  2. **External Research**: Use Google Search to find deep bibliographic or manufacturing information about this specific edition or item. Look for historical context, recent auction results, and specific rarity markers (e.g., "point of issue" for books, or "series/packaging variations" for collectibles).
  
  3. **Comprehensive Analysis**:
     - **Historical & Cultural Significance**: Why does this item matter? (e.g., literary impact for books, or cultural nostalgia/innovation for collectibles).
     - **Rarity & Authenticity Markers**: What specific physical details (edition markers, binding, manufacturer stamps, serial numbers, packaging condition) should the user verify?
     - **Market Sentiment**: What is the current collector demand and estimated value range for this piece?
  
  **Tone**: Professional, authoritative, and sophisticated. Use markdown for a beautiful, structured response.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error analyzing item:", error);
    return "I apologize, but I am unable to analyze this piece at the moment. Please try again later.";
  }
}
