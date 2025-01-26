import { describe, expect, it } from "vitest";

import { UserDeleteProfileUseCase } from "./user-delete-profile";

import { PrismaClient } from "@prisma/client";
import { FakeFactory } from "./utils/fake-factory";

describe("User Delete Profile", () => {
  const prisma = new PrismaClient();
  const fakeFactory = new FakeFactory(prisma);

  it("should set deletedAt to the current date", async () => {
    const userDeleteProfile = new UserDeleteProfileUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile({ userId: user.id });

    const deletedProfile = await userDeleteProfile.execute({
      userId: profile.userId,
      profileId: profile.id,
    });

    expect(deletedProfile.deletedAt).toBeDefined();
  });

  it("should not delete profile from another user", async () => {
    const userDeleteProfile = new UserDeleteProfileUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();
    const otherUser = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile({ userId: otherUser.id });

    await expect(
      userDeleteProfile.execute({
        userId: user.id,
        profileId: profile.id,
      }),
    ).rejects.toThrow("Perfil não encontrado");
  });

  it("should throw an error if the profile is not found", async () => {
    const userDeleteProfile = new UserDeleteProfileUseCase(prisma);

    const user = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile({
      userId: user.id,
      deletedAt: new Date(),
    });

    await expect(
      userDeleteProfile.execute({ userId: user.id, profileId: profile.id }),
    ).rejects.toThrow("Perfil não encontrado");
  });

  it("should delete all posts from the profile", async () => {
    const userDeleteProfile = new UserDeleteProfileUseCase(prisma);

    const user = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile({ userId: user.id });
    const post = await fakeFactory.createPost({ profileId: profile.id });

    await userDeleteProfile.execute({
      userId: profile.userId,
      profileId: profile.id,
    });

    const posts = await prisma.post.findMany({
      where: { profileId: profile.id },
    });

    expect(posts.length).toBe(1);
    expect(posts[0]?.id).toBe(post.id);
    expect(posts[0]?.deletedAt).toBeDefined();
    expect(posts[0]?.isPublished).toBe(false);
  });
});
