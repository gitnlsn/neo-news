import { z } from "zod";

import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const inputSchema = z.object({
  userId: z.string(),
  postId: z.string(),
});

export type UserDeletePostInput = z.infer<typeof inputSchema>;

export class UserDeletePostUseCase {
  private input: UserDeletePostInput | null = null;

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

  async execute(input: UserDeletePostInput) {
    const validatedInput = this.validateInput(input);
    // Logic here

    const { userId, postId } = validatedInput;

    const post = await this.database.post.findUnique({
      where: {
        id: postId,
        profile: {
          userId,
        },

        deletedAt: null,
      },

      include: {
        images: true,
      },
    });

    if (!post) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Post não encontrado",
      });
    }

    return await this.database.post.update({
      where: {
        id: postId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
