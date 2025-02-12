import { z } from "zod";

import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const inputSchema = z.object({
  profileId: z.string().cuid(),
});

export type PublicUserShowProfileInput = z.infer<typeof inputSchema>;

export class PublicUserShowProfileUseCase {
  private input: PublicUserShowProfileInput | null = null;

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

  async execute(input: PublicUserShowProfileInput) {
    const validatedInput = this.validateInput(input);
    // Logic here

    return await this.database.profile.findUnique({
      where: {
        id: validatedInput.profileId,

        deletedAt: null,
      },
      include: {
        user: true,
      },
    });
  }
}
