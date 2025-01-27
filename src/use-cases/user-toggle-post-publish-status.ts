import { z } from "zod";

import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const inputSchema = z.object({
  userId: z.string(),
  postId: z.string(),
});

export type UserTogglePostPublishStatusInput = z.infer<typeof inputSchema>;

export class UserTogglePostPublishStatusUseCase {
  private input: UserTogglePostPublishStatusInput | null = null;

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

  async execute(input: UserTogglePostPublishStatusInput) {
    const validatedInput = this.validateInput(input);
    // Logic here

    const { userId, postId } = validatedInput;

    const post = await this.database.post.findFirst({
      where: { id: postId, profile: { userId } },
    });

    if (!post) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Publicação não encontrada",
      });
    }

    return await this.database.post.update({
      where: { id: post.id },
      data: { isPublished: !post.isPublished },
    });
  }
}
