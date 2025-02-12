import { z } from "zod";

import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const inputSchema = z.object({
  postSlug: z.string(),
});

export type UserShowPostBySlugInput = z.infer<typeof inputSchema>;

export class UserShowPostBySlugUseCase {
  private input: UserShowPostBySlugInput | null = null;

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

  async execute(input: UserShowPostBySlugInput) {
    const validatedInput = this.validateInput(input);
    // Logic here

    const { postSlug } = validatedInput;

    return await this.database.post.findFirst({
      where: {
        slug: postSlug,
        deletedAt: null,
      },

      include: {
        profile: {
          include: {
            user: true,
          },
        },
      },
    });
  }
}
