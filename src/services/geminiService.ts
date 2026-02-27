import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface PlantCareInfo {
  name: string;
  scientificName: string;
  description: string;
  watering: string;
  sunlight: string;
  soil: string;
  temperature: string;
  commonIssues: string[];
  funFact: string;
}

export const identifyPlant = async (base64Image: string): Promise<PlantCareInfo> => {
  const model = "gemini-3.1-pro-preview";
  
  const prompt = `Identify this plant and provide detailed care instructions. 
  Return the information in a structured JSON format.`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image.split(",")[1],
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          scientificName: { type: Type.STRING },
          description: { type: Type.STRING },
          watering: { type: Type.STRING },
          sunlight: { type: Type.STRING },
          soil: { type: Type.STRING },
          temperature: { type: Type.STRING },
          commonIssues: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          funFact: { type: Type.STRING },
        },
        required: ["name", "scientificName", "description", "watering", "sunlight", "soil", "temperature", "commonIssues", "funFact"],
      },
    },
  });

  return JSON.parse(response.text || "{}") as PlantCareInfo;
};

export const getChatResponse = async (message: string, history: { role: "user" | "model"; parts: { text: string }[] }[]) => {
  const chat = ai.chats.create({
    model: "gemini-3.1-pro-preview",
    config: {
      systemInstruction: "You are an expert botanist and gardening assistant named Flora. You provide helpful, accurate, and friendly advice about plant care, pest control, and landscaping. Keep your answers concise but informative.",
    },
    history,
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};
