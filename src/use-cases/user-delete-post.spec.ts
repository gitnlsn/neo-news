import { describe, expect, it } from "vitest";

import { UserDeletePostUseCase } from "./user-delete-post";

import { PrismaClient } from "@prisma/client";
import { FakeFactory } from "./utils/fake-factory";

describe("User Delete Post", () => {
  const prisma = new PrismaClient();
  const fakeFactory = new FakeFactory(prisma);

  it("should set deletedAt to the current date", async () => {
    const userDeletePost = new UserDeletePostUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile({ userId: user.id });

    const post = await fakeFactory.createPost({
      profileId: profile.id,
    });

    const deletedPost = await userDeletePost.execute({
      postId: post.id,
      userId: user.id,
    });

    expect(deletedPost.deletedAt).toBeDefined();
  });

  it("should not delete post from other user", async () => {
    const userDeletePost = new UserDeletePostUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();
    const otherUser = await fakeFactory.createUser();

    const profile = await fakeFactory.createProfile({ userId: otherUser.id });
    const post = await fakeFactory.createPost({
      profileId: profile.id,
    });

    await expect(async () => {
      await userDeletePost.execute({
        postId: post.id,
        userId: user.id,
      });
    }).rejects.toThrow("Post não encontrado");
  });

  it("should not delete post if it is already deleted", async () => {
    const userDeletePost = new UserDeletePostUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile({ userId: user.id });

    const post = await fakeFactory.createPost({
      profileId: profile.id,
      deletedAt: new Date(),
    });

    await expect(async () => {
      await userDeletePost.execute({
        postId: post.id,
        userId: user.id,
      });
    }).rejects.toThrow("Post não encontrado");
  });
});
