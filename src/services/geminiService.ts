import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  const apiKey = localStorage.getItem('flora_api_key') || import.meta.env.VITE_GEMINI_API_KEY || "";
  if (!apiKey) throw new Error("API_KEY_MISSING");
  return new GoogleGenAI({ apiKey });
};

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
  const ai = getAIClient();
  const model = "gemini-3.1-pro-preview";
  const prompt = `Identify this plant and provide detailed care instructions. Return in JSON format.`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [{ inlineData: { mimeType: "image/jpeg", data: base64Image.split(",")[1] } }, { text: prompt }],
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
          commonIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
          funFact: { type: Type.STRING },
        },
        required: ["name", "scientificName", "description", "watering", "sunlight", "soil", "temperature", "commonIssues", "funFact"],
      },
    },
  });

  return JSON.parse(response.text || "{}") as PlantCareInfo;
};

export const getChatResponse = async (message: string, history: any[]) => {
  const ai = getAIClient();
  const chat = ai.chats.create({
    model: "gemini-3.1-pro-preview",
    config: { systemInstruction: "You are Flora, a gardening expert." },
    history,
  });
  const response = await chat.sendMessage({ message });
  return response.text;
};
