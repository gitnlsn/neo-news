import { z } from "zod";

import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { WebRisk } from "~/resources/web-risk";
import { getAnchorUrlsFromHtml } from "~/utils/use-cases/get-anchor-urls-from-html";
import { sanitizeHtml } from "~/utils/use-cases/sanitize-html";
import { SystemCheckUriWebRiskUseCase } from "./system-check-uri-web-risk";

const inputSchema = z.object({
  html: z.string(),
});

export type SystemSanitizeHtmlInput = z.infer<typeof inputSchema>;

export class SystemSanitizeHtmlUseCase {
  private input: SystemSanitizeHtmlInput | null = null;

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

  async execute(input: SystemSanitizeHtmlInput) {
    const validatedInput = this.validateInput(input);
    // Logic here

    const { html } = validatedInput;

    const anchorUrls = getAnchorUrlsFromHtml(html);

    const systemCheckUriWebRiskUseCase = new SystemCheckUriWebRiskUseCase(
      this.database,
      this.webRisk,
    );

    const analysis = await Promise.all(
      anchorUrls.map((url) => {
        return systemCheckUriWebRiskUseCase.execute({
          uri: url,
        });
      }),
    );

    const sanitized = sanitizeHtml({
      html,
      isUrlSafe: (url) => {
        const existingAnalysis = analysis.find(
          (a) => a.url.replace(/\/$/, "") === url.replace(/\/$/, ""),
        );
        return existingAnalysis?.isSafe ?? false;
      },
    });

    return sanitized;
  }
}
