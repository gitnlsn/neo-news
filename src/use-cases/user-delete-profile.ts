import { z } from "zod";

import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const inputSchema = z.object({
  userId: z.string(),
  profileId: z.string(),
});

export type UserDeleteProfileInput = z.infer<typeof inputSchema>;

export class UserDeleteProfileUseCase {
  private input: UserDeleteProfileInput | null = null;

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

  async execute(input: UserDeleteProfileInput) {
    const validatedInput = this.validateInput(input);
    // Logic here

    const { userId, profileId } = validatedInput;

    const profile = await this.database.profile.findUnique({
      where: {
        id: profileId,
        userId,

        deletedAt: null,
      },

      include: {
        posts: true,
      },
    });

    if (!profile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Perfil não encontrado",
      });
    }

    return await this.database.profile.update({
      where: {
        id: profileId,
      },
      data: {
        deletedAt: new Date(),
        posts: {
          updateMany: {
            where: {
              profileId,
            },
            data: {
              deletedAt: new Date(),
              isPublished: false,
            },
          },
        },
      },
    });
  }
}
