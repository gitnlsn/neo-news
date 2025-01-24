import { z } from "zod";

import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import type { File as UploadedFile } from "@prisma/client";
import { getUrlsFromHtml } from "~/utils/use-cases/get-urls-from-html";

const inputSchema = z.object({
  userId: z.string().cuid(),
  profileId: z.string().cuid().optional(),

  title: z.string().min(1),
  description: z.string().min(1),
  logoId: z.string().uuid().optional(),
  images: z.array(z.custom<UploadedFile>()).optional(),
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

  private filterUsedImages(props: {
    description: string;
    uploadedImages: UploadedFile[];
  }) {
    const { description, uploadedImages } = props;

    const urls = getUrlsFromHtml(description);
    return uploadedImages.filter((image) => urls.includes(image.url));
  }

  async execute(input: UserUpsertProfileInput) {
    const validatedInput = this.validateInput(input);
    // Logic here

    const { userId, title, description, logoId, images, profileId } =
      validatedInput;

    const existingProfile = await this.database.profile.findFirst({
      where: {
        id: profileId,
      },
    });

    if (existingProfile) {
      return await this.database.profile.update({
        where: { id: existingProfile.id },
        data: {
          title,
          description,
          logo: {
            connect: logoId ? { id: logoId } : undefined,
          },
          images: {
            connect: images
              ? this.filterUsedImages({
                  description,
                  uploadedImages: images,
                }).map((image) => ({ id: image.id }))
              : undefined,
          },
        },
      });
    }

    const profile = await this.database.profile.create({
      data: {
        userId,
        title,
        description,
        logo: {
          connect: logoId ? { id: logoId } : undefined,
        },
        images: {
          connect: images
            ? this.filterUsedImages({
                description,
                uploadedImages: images,
              }).map((image) => ({ id: image.id }))
            : undefined,
        },
      },
    });

    return profile;
  }
}
