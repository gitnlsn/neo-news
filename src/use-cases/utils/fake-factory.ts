import { faker } from "@faker-js/faker";
import type { Prisma, PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";
export class FakeFactory {
  constructor(private readonly prisma: PrismaClient) {}

  async cleanDatabase() {
    await this.prisma.image.deleteMany();
    await this.prisma.post.deleteMany();
    await this.prisma.profile.deleteMany();

    await this.prisma.session.deleteMany();
    await this.prisma.verificationToken.deleteMany();
    await this.prisma.user.deleteMany();
  }

  async createUser(data?: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data: { ...data },
    });
  }

  async createProfile(
    userId: string,
    data?: Prisma.ProfileCreateInput & { logoId?: string; images?: string[] },
  ) {
    return this.prisma.profile.create({
      data: {
        userId,
        title: data?.title ?? faker.lorem.sentence(),
        description: data?.description ?? faker.lorem.paragraph(),
        logoId: data?.logoId,
        images: {
          connect: data?.images?.map((imageId) => ({ id: imageId })),
        },
      },

      include: {
        logo: true,
        images: true,
      },
    });
  }

  async createImage(data?: Prisma.ImageCreateInput) {
    return this.prisma.image.create({
      data: { ...data },
    });
  }
}
