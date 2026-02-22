import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export async function getKijijiListings() {
  const ai = getAI();
  if (!ai) return [];

  const prompt = `Extract all current active listings from this specific Kijiji profile page: https://www.kijiji.ca/o-profile/1046257614/listings/1

  For each listing found on that page, extract:
  1. The full title of the item.
  2. The listed price (e.g., "$50.00", "Please Contact", or "Free").
  3. A concise summary of the item based on its title and any visible snippet.
  4. The absolute URL to the individual listing page.
  5. The URL of the primary image associated with the listing.
  6. A detailed visual description prompt for generating a representative image of this item.

  Only return items that are actually listed on the provided URL. If no items are found, return an empty array.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ urlContext: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "The exact title of the Kijiji listing.",
              },
              price: {
                type: Type.STRING,
                description: "The price as displayed on Kijiji.",
              },
              description: {
                type: Type.STRING,
                description: "A professional summary of the item.",
              },
              url: {
                type: Type.STRING,
                description: "The direct link to the listing.",
              },
              imageUrl: {
                type: Type.STRING,
                description: "The URL of the primary image for the listing.",
              },
              imagePrompt: {
                type: Type.STRING,
                description: "A prompt for an image generator to visualize this specific item.",
              },
            },
            required: ["title", "price", "description", "url", "imageUrl", "imagePrompt"],
          },
        },
      },
    });

    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("Error fetching Kijiji listings:", error);
    return [];
  }
}
