import type { PrismaClient } from "@prisma/client";

export class FakeFactory {
  constructor(private readonly prisma: PrismaClient) {}

  async cleanDatabase() {
    await this.prisma.post.deleteMany();

    await this.prisma.user.deleteMany();
    await this.prisma.session.deleteMany();
    await this.prisma.verificationToken.deleteMany();
  }
}
