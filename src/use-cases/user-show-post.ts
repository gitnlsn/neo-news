import { z } from "zod";

import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const inputSchema = z.object({
  userId: z.string(),
  postId: z.string(),
});

export type UserShowPostInput = z.infer<typeof inputSchema>;

export class UserShowPostUseCase {
  private input: UserShowPostInput | null = null;

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

  async execute(input: UserShowPostInput) {
    const validatedInput = this.validateInput(input);
    // Logic here

    const { userId, postId } = validatedInput;

    return await this.database.post.findFirst({
      where: {
        id: postId,
        profile: {
          userId,
        },

        deletedAt: null,
      },

      include: {
        images: true,
        tags: true,
      },
    });
  }
}
