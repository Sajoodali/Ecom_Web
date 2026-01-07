
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "../constants";

// Corrected initialization to use process.env.API_KEY directly as a named parameter
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getShoppingAdvice = async (userPrompt: string) => {
  const productContext = JSON.stringify(PRODUCTS.map(p => ({
    name: p.name,
    category: p.category,
    price: p.price,
    description: p.description
  })));

  try {
    // Corrected to use simplified contents parameter and access response.text property
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a helpful shopping assistant for "Aura MiniStore". 
            Here is our current inventory: ${productContext}. 
            The user is asking: "${userPrompt}". 
            Give a concise, friendly recommendation. If no product fits, politely say so. 
            Keep it professional and helpful.`,
      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again!";
  }
};
