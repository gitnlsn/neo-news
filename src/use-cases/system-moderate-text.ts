import { z } from "zod";

import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { GeminiActions } from "~/resources/gemini";

const inputSchema = z.object({
  text: z.string(),
});

export type SystemModerateTextInput = z.infer<typeof inputSchema>;

export class SystemModerateTextUseCase {
  private input: SystemModerateTextInput | null = null;

  constructor(
    private readonly prisma: PrismaClient,
    private readonly gemini: GeminiActions,
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

  async execute(input: SystemModerateTextInput) {
    const validatedInput = this.validateInput(input);
    // Logic here

    const { text } = validatedInput;

    const existingModeration = await this.prisma.moderation.findUnique({
      where: {
        text,
      },
    });

    if (existingModeration) return existingModeration;

    try {
      const output = await this.gemini.moderateText(text);

      return await this.prisma.moderation.create({
        data: {
          text,
          isSafe: output.isSafe,
          reasons: output.reasons,
        },
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Falha ao processar a resposta do Gemini",
      });
    }
  }
}
