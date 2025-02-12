import { describe, expect, it } from "vitest";

import { UserUpsertPostUseCase } from "./user-upsert-post";

import { PrismaClient } from "@prisma/client";
import { mockedWebRisk } from "~/resources/web-risk/mocked-web-risk";
import { FakeFactory } from "./utils/fake-factory";

describe("User Upsert Post", () => {
  const prisma = new PrismaClient();
  const fakeFactory = new FakeFactory(prisma);

  it("should create post", async () => {
    const userUpsertPost = new UserUpsertPostUseCase(prisma, mockedWebRisk);
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
    const userUpsertPost = new UserUpsertPostUseCase(prisma, mockedWebRisk);
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
    const userUpsertPost = new UserUpsertPostUseCase(prisma, mockedWebRisk);
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

  describe("tags", () => {
    it("should create post with tags", async () => {
      const userUpsertPost = new UserUpsertPostUseCase(prisma, mockedWebRisk);

      const user = await fakeFactory.createUser();
      const profile = await fakeFactory.createProfile({ userId: user.id });

      const title = await fakeFactory.generateTitleForUniqueSlug();
      const post = await userUpsertPost.execute({
        userId: user.id,
        profileId: profile.id,
        title,
        content: "post content",
        tags: [{ name: "tag1" }, { name: "tag2" }],
      });

      expect(post.tags).toHaveLength(2);
      expect(post.tags.map((tag) => tag.name)).toContain("tag1");
      expect(post.tags.map((tag) => tag.name)).toContain("tag2");
    });

    it("should update post tags", async () => {
      const userUpsertPost = new UserUpsertPostUseCase(prisma, mockedWebRisk);

      const user = await fakeFactory.createUser();
      const profile = await fakeFactory.createProfile({ userId: user.id });

      const title = await fakeFactory.generateTitleForUniqueSlug();
      const post = await userUpsertPost.execute({
        userId: user.id,
        profileId: profile.id,
        title,
        content: "post content",
        tags: [{ name: "tag1" }, { name: "tag2" }],
      });

      const updatedPost = await userUpsertPost.execute({
        postId: post.id,
        userId: user.id,
        profileId: profile.id,
        title,
        content: "post content",
        tags: [{ name: "tag2" }, { name: "tag3" }],
      });

      expect(updatedPost.tags).toHaveLength(2);
      expect(updatedPost.tags.map((tag) => tag.name)).not.toContain("tag1");
      expect(updatedPost.tags.map((tag) => tag.name)).toContain("tag2");
      expect(updatedPost.tags.map((tag) => tag.name)).toContain("tag3");
    });

    it("should reuse existing tags", async () => {
      const userUpsertPost = new UserUpsertPostUseCase(prisma, mockedWebRisk);

      const user = await fakeFactory.createUser();
      const profile = await fakeFactory.createProfile({ userId: user.id });

      // Create first post with tag1
      const title1 = await fakeFactory.generateTitleForUniqueSlug();
      await userUpsertPost.execute({
        userId: user.id,
        profileId: profile.id,
        title: title1,
        content: "post content",
        tags: [{ name: "tag1" }],
      });

      // Create second post with same tag
      const title2 = await fakeFactory.generateTitleForUniqueSlug();
      const post2 = await userUpsertPost.execute({
        userId: user.id,
        profileId: profile.id,
        title: title2,
        content: "post content",
        tags: [{ name: "tag1" }],
      });

      // Get all tags from database
      const allTags = await prisma.postTag.findMany({
        where: { name: "tag1" },
      });

      // Should have only one tag in database
      expect(allTags).toHaveLength(1);
      expect(post2.tags).toHaveLength(1);
      expect(post2.tags[0]?.name).toBe("tag1");
    });

    it("should remove all tags from post", async () => {
      const userUpsertPost = new UserUpsertPostUseCase(prisma, mockedWebRisk);

      const user = await fakeFactory.createUser();
      const profile = await fakeFactory.createProfile({ userId: user.id });

      const title = await fakeFactory.generateTitleForUniqueSlug();
      const post = await userUpsertPost.execute({
        userId: user.id,
        profileId: profile.id,
        title,
        content: "post content",
        tags: [{ name: "tag1" }, { name: "tag2" }],
      });

      const updatedPost = await userUpsertPost.execute({
        postId: post.id,
        userId: user.id,
        profileId: profile.id,
        title,
        content: "post content",
        tags: [], // Remove all tags
      });

      expect(updatedPost.tags).toHaveLength(0);

      // Original tags should still exist in database
      const existingTags = await prisma.postTag.findMany({
        where: {
          name: {
            in: ["tag1", "tag2"],
          },
        },
      });
      expect(existingTags).toHaveLength(2);
    });
  });

  describe("exceptions", () => {
    it("should not update profile from another user", async () => {
      const userUpsertPost = new UserUpsertPostUseCase(prisma, mockedWebRisk);
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
      const userUpsertPost = new UserUpsertPostUseCase(prisma, mockedWebRisk);
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
      const userUpsertPost = new UserUpsertPostUseCase(prisma, mockedWebRisk);
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
      const userUpsertPost = new UserUpsertPostUseCase(prisma, mockedWebRisk);
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
