import { describe, expect, it } from "vitest";

import { UserTogglePostPublishStatusUseCase } from "./user-toggle-post-publish-status";

import { PrismaClient } from "@prisma/client";
import { FakeFactory } from "./utils/fake-factory";

describe("User Toggle Post Publish Status", () => {
  const prisma = new PrismaClient();
  const fakeFactory = new FakeFactory(prisma);

  it("should toggle post publish status", async () => {
    const userTogglePostPublishStatus = new UserTogglePostPublishStatusUseCase(
      prisma,
    );

    const user = await fakeFactory.createUser();

    const profile = await fakeFactory.createProfile({ userId: user.id });

    const post = await fakeFactory.createPost({
      profileId: profile.id,
      isPublished: false,
    });

    const result = await userTogglePostPublishStatus.execute({
      userId: user.id,
      postId: post.id,
    });

    expect(result.isPublished).toBe(true);

    const result2 = await userTogglePostPublishStatus.execute({
      userId: user.id,
      postId: post.id,
    });

    expect(result2.isPublished).toBe(false);
  });
});
