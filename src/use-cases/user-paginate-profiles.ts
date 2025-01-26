import { z } from "zod";

import type { Prisma, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { paginateSchema } from "~/schemas/router-input/search-schema";
import { buildPaginationTakeSkip } from "~/utils/api/build-pagination-take-skip";

const inputSchema = paginateSchema.extend({
  userId: z.string().cuid(),
});

export type UserPaginateProfilesInput = z.infer<typeof inputSchema>;

export class UserPaginateProfilesUseCase {
  private input: UserPaginateProfilesInput | null = null;

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

  async execute(input: UserPaginateProfilesInput) {
    const validatedInput = this.validateInput(input);
    // Logic here

    const { page, perPage, search } = validatedInput;

    const where: Prisma.ProfileWhereInput = {
      userId: validatedInput.userId,

      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [profiles, total] = await Promise.all([
      this.database.profile.findMany({
        where,

        ...buildPaginationTakeSkip({ page, perPage }),
      }),
      this.database.profile.count({
        where,
      }),
    ]);

    return {
      profiles,
      total,
    };
  }
}
