
import { GoogleGenAI, Type } from "@google/genai";
import { ChallengeResponse, PlayerType } from "../types";

export const generateChallenge = async (player: PlayerType, tileId: number, type: string): Promise<ChallengeResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const playerLabel = player === 'MAN' ? 'Homem' : 'Mulher';
  const partnerLabel = player === 'MAN' ? 'Mulher' : 'Homem';
  
  let specificContext = "Crie um desafio romântico, provocativo e divertido para um casal.";
  if (type === 'HE_PEDE') specificContext = "O Homem deve pedir um favor romântico ou provocante para a Mulher.";
  if (type === 'SHE_PEDE') specificContext = "A Mulher deve pedir um favor romântico ou provocante para o Homem.";

  const prompt = `${specificContext} 
  O jogador atual é um(a) ${playerLabel} e o parceiro é um(a) ${partnerLabel}. Estão na casa ${tileId} do 'Jogo da Sedução'.
  O desafio deve ser leve, consensual e adequado para um clima de romance.
  Retorne em JSON com 'challenge' (título curto) e 'instruction' (descrição detalhada do que fazer).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            challenge: { type: Type.STRING },
            instruction: { type: Type.STRING }
          },
          required: ["challenge", "instruction"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      challenge: data.challenge || "Momento a Dois",
      instruction: data.instruction || "Dê um beijo apaixonado no seu parceiro por 10 segundos."
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    return {
      challenge: "Desafio Especial",
      instruction: "Faça um elogio sincero e dê um beijo no pescoço do seu parceiro."
    };
  }
};
