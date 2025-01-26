import { describe, expect, it } from "vitest";

import { UserShowPostUseCase } from "./user-show-post";

import { PrismaClient } from "@prisma/client";
import { FakeFactory } from "./utils/fake-factory";

describe("User Show Post", () => {
  const prisma = new PrismaClient();
  const fakeFactory = new FakeFactory(prisma);

  it("should show user post", async () => {
    const userShowPost = new UserShowPostUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile({ userId: user.id });

    const image = await fakeFactory.createImage();

    const post = await fakeFactory.createPost({
      profileId: profile.id,
      imageIds: [image.id],
    });

    const result = await userShowPost.execute({
      userId: user.id,
      postId: post.id,
    });

    expect(result?.title).toEqual(post.title);
    expect(result?.content).toEqual(post.content);
    expect(result?.images.length).toEqual(post.images.length);
  });

  it("should not show deleted post", async () => {
    const userShowPost = new UserShowPostUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile({ userId: user.id });

    const post = await fakeFactory.createPost({
      profileId: profile.id,
      deletedAt: new Date(),
    });

    const result = await userShowPost.execute({
      userId: user.id,
      postId: post.id,
    });

    expect(result).toBeNull();
  });
});
