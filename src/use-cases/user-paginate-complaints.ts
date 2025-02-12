import { z } from "zod";

import type { Prisma, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { buildPaginationTakeSkip } from "~/utils/api/build-pagination-take-skip";

const inputSchema = z.object({
  userId: z.string(),

  page: z.number().optional(),
  perPage: z.number().optional(),
});

export type UserPaginateComplaintsInput = z.infer<typeof inputSchema>;

export class UserPaginateComplaintsUseCase {
  private input: UserPaginateComplaintsInput | null = null;

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

  async execute(input: UserPaginateComplaintsInput) {
    const validatedInput = this.validateInput(input);
    // Logic here

    const { userId, page, perPage } = validatedInput;

    const where: Prisma.ComplaintWhereInput = {
      OR: [
        { post: { profile: { userId: userId } } },
        { profile: { userId: userId } },
      ],
    };

    const [complaints, total] = await Promise.all([
      this.database.complaint.findMany({
        where,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          post: {
            select: {
              title: true,
            },
          },

          profile: {
            select: {
              title: true,
            },
          },
        },

        ...buildPaginationTakeSkip({ page, perPage }),
      }),
      this.database.complaint.count({
        where,
      }),
    ]);

    return { complaints, total };
  }
}
