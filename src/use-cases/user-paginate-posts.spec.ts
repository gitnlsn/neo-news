import { describe, expect, it } from "vitest";

import { UserPaginatePostsUseCase } from "./user-paginate-posts";

import { PrismaClient } from "@prisma/client";
import { FakeFactory } from "./utils/fake-factory";

describe("User Paginate Posts", () => {
  const prisma = new PrismaClient();
  const fakeFactory = new FakeFactory(prisma);

  it("should list posts", async () => {
    const userPaginatePosts = new UserPaginatePostsUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile({ userId: user.id });

    const post1 = await fakeFactory.createPost({ profileId: profile.id });
    const post2 = await fakeFactory.createPost({ profileId: profile.id });

    const { posts, total } = await userPaginatePosts.execute({
      userId: user.id,
    });

    expect(posts.length).toBe(2);
    expect(total).toBe(2);

    expect(posts[0]?.id).toBe(post2.id);
    expect(posts[1]?.id).toBe(post1.id);
  });

  it("should paginate posts", async () => {
    const userPaginatePosts = new UserPaginatePostsUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile({ userId: user.id });

    const post1 = await fakeFactory.createPost({ profileId: profile.id });
    const post2 = await fakeFactory.createPost({ profileId: profile.id });

    const { posts, total } = await userPaginatePosts.execute({
      userId: user.id,

      page: 1,
      perPage: 1,
    });

    expect(posts.length).toBe(1);
    expect(total).toBe(2);

    expect(posts[0]?.id).toBe(post2.id);
  });

  it("should filter posts by title", async () => {
    const userPaginatePosts = new UserPaginatePostsUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile({ userId: user.id });

    const post1 = await fakeFactory.createPost({
      profileId: profile.id,
      title: "t1",
    });
    const post2 = await fakeFactory.createPost({
      profileId: profile.id,
      title: "t2",
    });

    const { posts, total } = await userPaginatePosts.execute({
      userId: user.id,

      search: "t1",
    });

    expect(posts.length).toBe(1);
    expect(total).toBe(1);

    expect(posts[0]?.id).toBe(post1.id);
  });

  it("should filter posts by content", async () => {
    const userPaginatePosts = new UserPaginatePostsUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile({ userId: user.id });

    const post1 = await fakeFactory.createPost({
      profileId: profile.id,
      content: "t1",
    });
    const post2 = await fakeFactory.createPost({
      profileId: profile.id,
      content: "t2",
    });

    const { posts, total } = await userPaginatePosts.execute({
      userId: user.id,

      search: "t1",
    });

    expect(posts.length).toBe(1);
    expect(total).toBe(1);

    expect(posts[0]?.id).toBe(post1.id);
  });

  it("should not list deleted posts", async () => {
    const userPaginatePosts = new UserPaginatePostsUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile({ userId: user.id });

    const post1 = await fakeFactory.createPost({ profileId: profile.id });
    const post2 = await fakeFactory.createPost({
      profileId: profile.id,
      deletedAt: new Date(),
    });

    const { posts, total } = await userPaginatePosts.execute({
      userId: user.id,
    });

    expect(posts.length).toBe(1);
    expect(total).toBe(1);

    expect(posts[0]?.id).toBe(post1.id);
  });
});
