import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { env } from "~/env";

export interface GeminiActions {
  moderateText: (
    text: string,
  ) => Promise<{ isSafe: boolean; reasons: string[] }>;
}

export class Gemini implements GeminiActions {
  private readonly client: GoogleGenerativeAI;
  constructor() {
    this.client = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  }

  async moderateText(text: string) {
    const model = this.client.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Faça a moderação do texto fornecido. Responda com um JSON no seguinte formato, para que eu possa processar com JSON.parse: {"isSafe": boolean, "reasons": string[]}  Se o texto for considerado seguro, retorne reasons vazio. Se o texto não for considerado seguro, liste o motivos.`;
    const result = await model.generateContent([{ text }, { text: prompt }]);
    const response = result.response.text();

    const parsed = JSON.parse(
      response.replace(/`/g, "").replace(/^json/, "").trim(),
    );
    const output = z
      .object({
        isSafe: z.boolean(),
        reasons: z.array(z.string()),
      })
      .parse(parsed);

    return output;
  }
}
