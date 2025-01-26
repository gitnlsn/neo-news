import { describe, expect, it } from "vitest";

import { UserUpsertPostUseCase } from "./user-upsert-post";

import { PrismaClient } from "@prisma/client";
import { FakeFactory } from "./utils/fake-factory";

describe("User Upsert Post", () => {
  const prisma = new PrismaClient();
  const fakeFactory = new FakeFactory(prisma);

  it("should create post", async () => {
    const userUpsertPost = new UserUpsertPostUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile({ userId: user.id });

    const post = await userUpsertPost.execute({
      userId: user.id,
      profileId: profile.id,
      title: "post title",
      content: "post content",
    });

    expect(post).toBeDefined();
    expect(post.title).toBe("post title");
    expect(post.content).toBe("post content");
  });

  it("should update post", async () => {
    const userUpsertPost = new UserUpsertPostUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile({ userId: user.id });

    const post = await userUpsertPost.execute({
      userId: user.id,
      profileId: profile.id,
      title: "post title",
      content: "post content",
    });

    const updatedPost = await userUpsertPost.execute({
      postId: post.id,
      userId: user.id,
      profileId: profile.id,
      title: "post title updated",
      content: "post content updated",
    });

    expect(updatedPost).toBeDefined();
    expect(updatedPost.title).toBe("post title updated");
    expect(updatedPost.content).toBe("post content updated");
  });

  it("should include images in post", async () => {
    const userUpsertPost = new UserUpsertPostUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile({ userId: user.id });

    const image = await fakeFactory.createImage();

    const post = await userUpsertPost.execute({
      userId: user.id,
      profileId: profile.id,
      title: "post title",
      content: `<img src="${image.url}" alt="image" />`,
      images: [image],
    });

    expect(post.images).toHaveLength(1);
    expect(post.images[0]?.id).toBe(image.id);
  });

  describe("exceptions", () => {
    it("should not update profile from another user", async () => {
      const userUpsertPost = new UserUpsertPostUseCase(prisma);
      // Tests here

      const user = await fakeFactory.createUser();
      const otherUser = await fakeFactory.createUser();

      const otherUserProfile = await fakeFactory.createProfile({
        userId: otherUser.id,
      });

      expect(async () => {
        await userUpsertPost.execute({
          userId: user.id,
          profileId: otherUserProfile.id,
          title: "post title",
          content: "post content",
        });
      }).rejects.toThrow("Perfil não encontrado");
    });
  });
});
