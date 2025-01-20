import { z } from "zod";

import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const inputSchema = z.object({
  userId: z.string().cuid(),
});

export type UserShowProfileInput = z.infer<typeof inputSchema>;

export class UserShowProfileUseCase {
  private input: UserShowProfileInput | null = null;

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

  async execute(input: UserShowProfileInput) {
    const validatedInput = this.validateInput(input);
    // Logic here

    const profile = await this.database.profile.findUnique({
      where: {
        userId: validatedInput.userId,
      },
      include: {
        logo: true,
        images: true,
      },
    });

    if (!profile)
      throw new TRPCError({ code: "NOT_FOUND", message: "Profile not found" });

    return profile;
  }
}
