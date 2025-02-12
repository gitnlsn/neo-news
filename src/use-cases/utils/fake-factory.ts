import { randomUUID } from "node:crypto";
import { faker } from "@faker-js/faker";
import type { Prisma, PrismaClient } from "@prisma/client";
import slugify from "slugify";
import type { UserCreateComplaintInput } from "../user-create-complaint";

export class FakeFactory {
  constructor(private readonly prisma: PrismaClient) {}

  async createUser(data?: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data: {
        ...data,
        email: data?.email ?? `${randomUUID()}${faker.internet.email()}`,
      },
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
        description: data?.description ?? this.generateRichText(),
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

  generateRichText(props?: {
    textCount?: number;
    imageCount?: number;
    youtubeCount?: number;
  }) {
    const content: string[] = [];

    for (let i = 0; i < (props?.textCount ?? 3); i++) {
      content.push(faker.lorem.paragraph({ min: 32, max: 64 }));
    }

    const images: string[] = [];

    for (let i = 0; i < (props?.imageCount ?? 2); i++) {
      images.push("https://picsum.photos/200/300");
    }

    const youtube: string[] = [];

    for (let i = 0; i < (props?.youtubeCount ?? 1); i++) {
      youtube.push("https://www.youtube.com/embed/dQw4w9WgXcQ");
    }

    return [
      content.map((paragraph) => `<p>${paragraph}</p>`),
      images.map((image) => `<img src="${image}" />`),
      youtube.map(
        (youtube) =>
          `<div data-youtube-video=""><iframe width="640" height="480" allowfullscreen="true" autoplay="false" disablekbcontrols="false" enableiframeapi="false" endtime="0" ivloadpolicy="0" loop="false" modestbranding="false" origin="" playlist="" src="${youtube}" start="0"></iframe></div>`,
      ),
    ]
      .sort(() => Math.random() - 0.5)
      .sort(() => Math.random() - 0.5)
      .sort(() => Math.random() - 0.5)
      .flat()
      .join("");
  }

  async createPost(
    data: Partial<Omit<Prisma.PostCreateInput, "images">> & {
      profileId: string;
      imageIds?: string[];
      richTextProps?: {
        textCount?: number;
        imageCount?: number;
        youtubeCount?: number;
      };
    },
  ) {
    const title = await this.generateTitleForUniqueSlug();

    return this.prisma.post.create({
      data: {
        title: data?.title ?? title,
        content: data?.content ?? this.generateRichText(data?.richTextProps),
        slug: slugify(data?.slug ?? title, {
          lower: true,
          strict: true,
          trim: true,
        }),
        images: {
          connect: data?.imageIds?.map((imageId) => ({ id: imageId })),
        },
        profileId: data?.profileId ?? "",
        isPublished: data?.isPublished ?? false,
        deletedAt: data?.deletedAt ?? undefined,
      },

      include: {
        images: true,
      },
    });
  }

  async generateTitleForUniqueSlug() {
    const posts = await this.prisma.post.findMany({
      select: {
        title: true,
      },

      distinct: ["title"],
    });

    const titles = posts.map((post) => post.title);

    let possibleTitle = faker.lorem.sentence() + randomUUID();

    while (titles.includes(possibleTitle)) {
      possibleTitle = faker.lorem.sentence() + randomUUID();
    }

    return possibleTitle;
  }

  async createModeration(data?: Partial<Prisma.ModerationCreateInput>) {
    return this.prisma.moderation.create({
      data: {
        text: data?.text ?? `${faker.lorem.sentence()} ${randomUUID()}`,
        isSafe: data?.isSafe ?? true,
        reasons: data?.reasons ?? [`${faker.lorem.sentence()} ${randomUUID()}`],
      },
    });
  }

  async createWebRiskAnalysis(
    data?: Partial<Prisma.WebRishAnalysisCreateInput>,
  ) {
    return this.prisma.webRishAnalysis.create({
      data: {
        url: data?.url ?? `https://${randomUUID()}.com`,
        isSafe: data?.isSafe ?? false,
        threatTypes: data?.threatTypes ?? [faker.lorem.word()],
      },
    });
  }

  async createComplaint(data?: Partial<UserCreateComplaintInput>) {
    return this.prisma.complaint.create({
      data: {
        ...data,
        description: data?.description ?? faker.lorem.sentence(),
      },
    });
  }
}
