import axios from "axios";
import { z } from "zod";
import { env } from "~/env";

interface WebRiskChecker {
  checkUrl: (
    url: string,
  ) => Promise<{ isSafe: boolean; threatTypes: string[] }>;
}

export class WebRisk implements WebRiskChecker {
  async checkUrl(url: string) {
    const schema = z.object({
      threat: z
        .object({
          threatTypes: z.array(z.string()),
          expireTime: z.coerce.date(),
        })
        .optional(),
    });

    const response = await axios.get(
      `https://webrisk.googleapis.com/v1/uris:search?threatTypes=MALWARE&uri=${url}&key=${env.WEB_RISK_API_KEY}`,
    );

    const parsed = schema.safeParse(response.data);

    if (!parsed.success) {
      throw new Error(
        `Erro ao validar o resultado da WebRisk: ${JSON.stringify(parsed.error.issues)}`,
      );
    }

    if (!parsed.data.threat) {
      return { isSafe: true, threatTypes: [] };
    }

    return { isSafe: false, threatTypes: parsed.data.threat.threatTypes };
  }
}
