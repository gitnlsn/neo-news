import { z } from "zod";

import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const inputSchema = z.object({
  userId: z.string().cuid(),

  title: z.string().min(1),
  description: z.string().min(1),
  logoId: z.string().uuid().optional(),
  images: z.array(z.string().uuid()).optional(),
});

export type UserUpsertProfileInput = z.infer<typeof inputSchema>;

export class UserUpsertProfileUseCase {
  private input: UserUpsertProfileInput | null = null;

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

  async execute(input: UserUpsertProfileInput) {
    const validatedInput = this.validateInput(input);
    // Logic here

    const { userId, title, description, logoId, images } = validatedInput;

    const profile = await this.database.profile.upsert({
      where: {
        userId,
      },
      update: {
        title,
        description,
        logoId,
        images: {
          connect: images?.map((imageId) => ({ id: imageId })),
        },
      },
      create: {
        userId,
        title,
        description,
        logoId,
        images: {
          connect: images?.map((imageId) => ({ id: imageId })),
        },
      },
    });

    return profile;
  }
}
