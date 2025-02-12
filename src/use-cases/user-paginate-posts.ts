import { z } from "zod";

import type { Prisma, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { paginateSchema } from "~/schemas/router-input/search-schema";
import { buildPaginationTakeSkip } from "~/utils/api/build-pagination-take-skip";

const inputSchema = paginateSchema.extend({
  userId: z.string().cuid(),

  profileId: z.string().cuid().optional(),
});

export type UserPaginatePostsInput = z.infer<typeof inputSchema>;

export class UserPaginatePostsUseCase {
  private input: UserPaginatePostsInput | null = null;

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

  async execute(input: UserPaginatePostsInput) {
    const validatedInput = this.validateInput(input);
    // Logic here

    const { page, perPage, search, profileId } = validatedInput;

    const where: Prisma.PostWhereInput = {
      profile: profileId
        ? { id: profileId }
        : {
            userId: validatedInput.userId,
          },

      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const [posts, total] = await Promise.all([
      this.database.post.findMany({
        where,

        orderBy: {
          createdAt: "desc",
        },

        ...buildPaginationTakeSkip({ page, perPage }),

        include: {
          profile: true,
        },
      }),
      this.database.post.count({ where }),
    ]);

    return {
      posts,
      total,
    };
  }
}
