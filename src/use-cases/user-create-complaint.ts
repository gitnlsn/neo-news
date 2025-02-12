import { z } from "zod";

import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const inputSchema = z.object({
  description: z.string(),

  postId: z.string().optional(),
  profileId: z.string().optional(),
});

export type UserCreateComplaintInput = z.infer<typeof inputSchema>;

export class UserCreateComplaintUseCase {
  private input: UserCreateComplaintInput | null = null;

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

  async execute(input: UserCreateComplaintInput) {
    const validatedInput = this.validateInput(input);
    // Logic here

    const { ...rest } = validatedInput;

    return await this.database.complaint.create({
      data: {
        ...rest,
      },

      include: {
        post: true,
        profile: true,
      },
    });
  }
}
