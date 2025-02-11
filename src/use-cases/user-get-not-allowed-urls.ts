import { z } from "zod";

import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const inputSchema = z.object({});

export type UserGetNotAllowedUrlsInput = z.infer<typeof inputSchema>;

export class UserGetNotAllowedUrlsUseCase {
  private input: UserGetNotAllowedUrlsInput | null = null;

  constructor(private readonly database: PrismaClient) {}

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

  async execute(input: UserGetNotAllowedUrlsInput) {
    const validatedInput = this.validateInput(input);
    // Logic here

    const notAllowedUrls = await this.database.webRishAnalysis.findMany({
      select: {
        url: true,
      },

      where: {
        isSafe: false,
      },

      orderBy: {
        inspectedAt: "desc",
      },

      take: 100,
    });

    return notAllowedUrls.map((url) => url.url);
  }
}
