import { z } from "zod";

import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import type { WebRisk } from "~/resources/web-risk";
import type { UploadedFile } from "~/types/UploadedFile";
import { getUrlsFromHtml } from "~/utils/use-cases/get-urls-from-html";
import { SystemSanitizeHtmlUseCase } from "./system-sanitize-html";

const tagSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
});

const inputSchema = z.object({
  userId: z.string().cuid(),
  profileId: z.string().cuid(),
  postId: z.string().cuid().optional(),

  title: z.string().min(1, "Título é obrigatório"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  images: z.array(z.custom<UploadedFile>()).optional(),
  tags: z.array(tagSchema).optional(),

  isPublished: z.boolean().optional(),
});

export type UserUpsertPostInput = z.infer<typeof inputSchema>;

export class UserUpsertPostUseCase {
  private input: UserUpsertPostInput | null = null;

  constructor(
    private readonly database: PrismaClient,
    private readonly webRisk: WebRisk,
  ) {}

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

    const urls = getUrlsFromHtml(description).map((url) =>
      url.replace(/\/$/, ""),
    );
    return uploadedImages.filter((image) =>
      urls.includes(image.url.replace(/\/$/, "")),
    );
  }

  async execute(input: UserUpsertPostInput) {
    const validatedInput = this.validateInput(input);
    // Logic here

    const {
      userId,
      profileId,
      title,
      content,
      images,
      isPublished,
      postId,
      tags,
    } = validatedInput;

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

    const newSlug = slugify(title, { lower: true, trim: true, strict: true });

    const systemSanitizeHtmlUseCase = new SystemSanitizeHtmlUseCase(
      this.database,
      this.webRisk,
    );

    const sanitizedContent = await systemSanitizeHtmlUseCase.execute({
      html: content,
    });

    // Prepare tag connections
    const tagConnections =
      tags && tags.length > 0
        ? {
            connectOrCreate: tags.map((tag) => ({
              where: { name: tag.name },
              create: { name: tag.name },
            })),
          }
        : undefined;

    if (!postId) {
      const existingPostWithSameSlug = await this.database.post.findUnique({
        where: {
          slug: newSlug,
        },
      });

      if (existingPostWithSameSlug) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "Já existe um post com este título. Por favor, escolha outro título.",
        });
      }

      return await this.database.post.create({
        data: {
          profileId: existingProfile.id,

          title,
          content: sanitizedContent,
          slug: newSlug,

          isPublished,

          images: {
            connect:
              images && images.length > 0
                ? this.filterUsedImages({
                    description: sanitizedContent,
                    uploadedImages: images,
                  }).map((image) => ({ id: image.id }))
                : undefined,
          },
          tags: tagConnections,
        },

        include: {
          images: true,
          tags: true,
        },
      });
    }

    /*
      Update post
    */
    const existingPost = await this.database.post.findUnique({
      where: {
        id: postId,
        profileId: existingProfile.id,

        deletedAt: null,
      },
      include: {
        tags: true,
      },
    });

    if (!existingPost) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Post não encontrado",
      });
    }

    if (existingPost.slug !== newSlug) {
      const existingPostWithSameSlug = await this.database.post.findUnique({
        where: {
          slug: newSlug,
        },
      });

      if (existingPostWithSameSlug) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "Já existe um post com este título. Por favor, escolha outro título.",
        });
      }
    }

    return await this.database.post.update({
      where: { id: existingPost.id },
      data: {
        title,
        content: sanitizedContent,

        isPublished,
        slug: newSlug,

        images: {
          connect:
            images && images.length > 0
              ? this.filterUsedImages({
                  description: sanitizedContent,
                  uploadedImages: images,
                }).map((image) => ({ id: image.id }))
              : undefined,
        },
        tags: {
          set: [], // First disconnect all existing tags
          ...tagConnections, // Then connect new ones
        },
      },
      include: {
        images: true,
        tags: true,
      },
    });
  }
}
