import { randomUUID } from "node:crypto";
import { faker } from "@faker-js/faker";
import type { Prisma, PrismaClient } from "@prisma/client";

export class FakeFactory {
  constructor(private readonly prisma: PrismaClient) {}

  async createUser(data?: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data: { ...data },
    });
  }

  async createProfile(
    data: Partial<Prisma.ProfileCreateInput> & {
      userId: string;
      logoId?: string;
      images?: string[];
    },
  ) {
    return this.prisma.profile.create({
      data: {
        userId: data.userId,
        title: data?.title ?? faker.lorem.sentence(),
        description: data?.description ?? faker.lorem.paragraph(),
        logo: {
          connect: data?.logoId ? { id: data.logoId } : undefined,
        },
        images: {
          connect: data?.images?.map((imageId) => ({ id: imageId })),
        },
        deletedAt: data?.deletedAt ?? undefined,
      },

      include: {
        logo: true,
        images: true,
      },
    });
  }

  async createImage(data?: Partial<Prisma.FileCreateInput>) {
    return this.prisma.file.create({
      data: {
        originalName: data?.originalName ?? "",
        generatedName: data?.generatedName ?? "",
        sizeInBytes: data?.sizeInBytes ?? 0,
        mimeType: data?.mimeType ?? "",
        url: `https://fake.com/${randomUUID()}`,
        storageProvider: data?.storageProvider ?? "fake",
      },
    });
  }

  async createPost(
    data: Partial<Omit<Prisma.PostCreateInput, "images">> & {
      profileId: string;
      imageIds?: string[];
    },
  ) {
    return this.prisma.post.create({
      data: {
        title: data?.title ?? faker.lorem.sentence(),
        content: data?.content ?? faker.lorem.paragraph(),
        images: {
          connect: data?.imageIds?.map((imageId) => ({ id: imageId })),
        },
        profileId: data?.profileId ?? "",
        deletedAt: data?.deletedAt ?? undefined,
      },

      include: {
        images: true,
      },
    });
  }
}
