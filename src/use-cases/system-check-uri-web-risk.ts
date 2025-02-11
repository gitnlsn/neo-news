import { z } from "zod";

import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { WebRisk } from "~/resources/web-risk";

const inputSchema = z.object({
  uri: z.string(),
});

export type SystemCheckUriWebRiskInput = z.infer<typeof inputSchema>;

export class SystemCheckUriWebRiskUseCase {
  private input: SystemCheckUriWebRiskInput | null = null;

  constructor(
    private readonly database: PrismaClient,
    private readonly webRisk: WebRisk,
  ) {}

  static get inputSchema() {
    return inputSchema;
  }

  validateInput(input: unknown) {
    const { data, error } = inputSchema.safeParse(input);
    if (error)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: error.errors.flatMap((e) => e.message).join("\n"),
      });
    this.input = data;
    return this.input;
  }

  async execute(input: SystemCheckUriWebRiskInput) {
    const validatedInput = this.validateInput(input);
    // Logic here

    const { uri } = validatedInput;

    const zodParsed = z
      .string()
      .url()
      .transform((url) => url.replace(/\/$/, ""))
      .safeParse(uri);

    if (!zodParsed.success) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Url inválida",
      });
    }

    const url = zodParsed.data;

    let webRiskAnalysis = await this.database.webRishAnalysis.findUnique({
      where: { url },
    });

    if (!webRiskAnalysis) {
      const newAnalysis = await this.webRisk.checkUrl(url);

      webRiskAnalysis = await this.database.webRishAnalysis.create({
        data: {
          url,
          isSafe: newAnalysis.isSafe,
          threatTypes: newAnalysis.threatTypes,
        },
      });
    }

    return webRiskAnalysis;
  }
}
