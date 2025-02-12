import { describe, expect, it } from "vitest";

import { UserShowPostBySlugUseCase } from "./user-show-post-by-slug";

import { PrismaClient } from "@prisma/client";
import { FakeFactory } from "./utils/fake-factory";

describe("User Show Post by Slug", () => {
  const prisma = new PrismaClient();
  const fakeFactory = new FakeFactory(prisma);

  it("should show user post", async () => {
    const userShowPost = new UserShowPostBySlugUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile({ userId: user.id });

    const image = await fakeFactory.createImage();

    const post = await fakeFactory.createPost({
      profileId: profile.id,
      imageIds: [image.id],
    });

    const result = await userShowPost.execute({
      postSlug: post.slug,
    });

    expect(result?.title).toEqual(post.title);
    expect(result?.content).toEqual(post.content);
  });

  it("should not show deleted post", async () => {
    const userShowPost = new UserShowPostBySlugUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile({ userId: user.id });

    const post = await fakeFactory.createPost({
      profileId: profile.id,
      deletedAt: new Date(),
    });

    const result = await userShowPost.execute({
      postSlug: post.slug,
    });

    expect(result).toBeNull();
  });
});
