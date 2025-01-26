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

    const title = await fakeFactory.generateTitleForUniqueSlug();
    const post = await userUpsertPost.execute({
      userId: user.id,
      profileId: profile.id,
      title,
      content: "post content",
    });

    expect(post).toBeDefined();
    expect(post.title).toBe(title);
    expect(post.content).toBe("post content");
  });

  it("should update post", async () => {
    const userUpsertPost = new UserUpsertPostUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile({ userId: user.id });

    const title = await fakeFactory.generateTitleForUniqueSlug();
    const post = await userUpsertPost.execute({
      userId: user.id,
      profileId: profile.id,
      title,
      content: "post content",
    });

    const updatedPost = await userUpsertPost.execute({
      postId: post.id,
      userId: user.id,
      profileId: profile.id,
      title: `${post.title} updated`,
      content: "post content updated",
    });

    expect(updatedPost).toBeDefined();
    expect(updatedPost.title).toBe(`${post.title} updated`);
    expect(updatedPost.content).toBe("post content updated");
  });

  it("should include images in post", async () => {
    const userUpsertPost = new UserUpsertPostUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile({ userId: user.id });

    const image = await fakeFactory.createImage();

    const title = await fakeFactory.generateTitleForUniqueSlug();
    const post = await userUpsertPost.execute({
      userId: user.id,
      profileId: profile.id,
      title,
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

      await expect(async () => {
        const title = await fakeFactory.generateTitleForUniqueSlug();
        await userUpsertPost.execute({
          userId: user.id,
          profileId: otherUserProfile.id,
          title,
          content: "post content",
        });
      }).rejects.toThrow("Perfil não encontrado");
    });

    it("should not update deleted post", async () => {
      const userUpsertPost = new UserUpsertPostUseCase(prisma);
      // Tests here

      const user = await fakeFactory.createUser();
      const profile = await fakeFactory.createProfile({ userId: user.id });

      const post = await fakeFactory.createPost({
        profileId: profile.id,
        deletedAt: new Date(),
      });

      const title = await fakeFactory.generateTitleForUniqueSlug();
      await expect(
        userUpsertPost.execute({
          postId: post.id,
          userId: user.id,
          profileId: profile.id,
          title,
          content: "post content",
        }),
      ).rejects.toThrow("Post não encontrado");
    });

    it("should return error when create post with same slug", async () => {
      const userUpsertPost = new UserUpsertPostUseCase(prisma);
      // Tests here

      const user = await fakeFactory.createUser();
      const profile = await fakeFactory.createProfile({ userId: user.id });

      const title = await fakeFactory.generateTitleForUniqueSlug();
      await userUpsertPost.execute({
        userId: user.id,
        profileId: profile.id,
        title,
        content: "post content",
      });

      const user2 = await fakeFactory.createUser();
      const profile2 = await fakeFactory.createProfile({ userId: user2.id });

      await expect(
        userUpsertPost.execute({
          userId: user2.id,
          profileId: profile2.id,
          title,
          content: "post content",
        }),
      ).rejects.toThrow(
        "Já existe um post com este título. Por favor, escolha outro título.",
      );
    });

    it("should return error when create post with same slug", async () => {
      const userUpsertPost = new UserUpsertPostUseCase(prisma);
      // Tests here

      const user1 = await fakeFactory.createUser();
      const profile1 = await fakeFactory.createProfile({ userId: user1.id });

      const title = await fakeFactory.generateTitleForUniqueSlug();
      const post1 = await userUpsertPost.execute({
        userId: user1.id,
        profileId: profile1.id,
        title,
        content: "post content",
      });

      const user2 = await fakeFactory.createUser();
      const profile2 = await fakeFactory.createProfile({ userId: user2.id });

      const title2 = await fakeFactory.generateTitleForUniqueSlug();
      await userUpsertPost.execute({
        userId: user2.id,
        profileId: profile2.id,
        title: title2,
        content: "post content 2",
      });

      await expect(
        userUpsertPost.execute({
          userId: user1.id,
          profileId: profile1.id,
          postId: post1.id,
          title: title2,
          content: "post content 2",
        }),
      ).rejects.toThrow(
        "Já existe um post com este título. Por favor, escolha outro título.",
      );
    });
  });
});
