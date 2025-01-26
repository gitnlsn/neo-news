import { z } from "zod";

import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import type { File as UploadedFile } from "@prisma/client";
import { getUrlsFromHtml } from "~/utils/use-cases/get-urls-from-html";

const inputSchema = z.object({
  userId: z.string().cuid(),
  profileId: z.string().cuid().optional(),

  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  logo: z.custom<UploadedFile>().optional(),
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

    const { userId, title, description, logo, images, profileId } =
      validatedInput;

    if (!profileId) {
      return await this.database.profile.create({
        data: {
          userId,
          title,
          description,
          logo: {
            connect: logo ? { id: logo.id } : undefined,
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

        include: {
          logo: true,
          images: true,
        },
      });
    }

    const existingProfile = await this.database.profile.findFirst({
      where: {
        id: profileId,
        userId,
      },
    });

    if (!existingProfile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Perfil não encontrado",
      });
    }

    return await this.database.profile.update({
      where: { id: existingProfile.id },
      data: {
        title,
        description,
        logo: {
          connect: logo ? { id: logo.id } : undefined,
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

      include: {
        logo: true,
        images: true,
      },
    });
  }
}
