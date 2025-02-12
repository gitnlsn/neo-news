import { PrismaClient } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { UserCreateComplaintUseCase } from "./user-create-complaint";
import { FakeFactory } from "./utils/fake-factory";

describe("User Create Complaint", () => {
  const prisma = new PrismaClient();
  const fakeFactory = new FakeFactory(prisma);
  let userCreateComplaint: UserCreateComplaintUseCase;

  beforeEach(() => {
    userCreateComplaint = new UserCreateComplaintUseCase(prisma);
  });

  it("should create a complaint successfully", async () => {
    const complaintData = {
      description: "This is a test complaint description",
    };

    const result = await userCreateComplaint.execute(complaintData);

    expect(result).toBeDefined();
    expect(result.description).toBe(complaintData.description);
  });

  it("should create a complaint with postId", async () => {
    const user = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile({ userId: user.id });
    const post = await fakeFactory.createPost({ profileId: profile.id });

    const complaintData = {
      userId: user.id,
      description: "Complaint about a post",
      postId: post.id,
    };

    const result = await userCreateComplaint.execute(complaintData);

    expect(result).toBeDefined();
    expect(result.postId).toBe(post.id);
    expect(result.post).toBeDefined();
    expect(result.post?.id).toBe(post.id);
  });

  it("should create a complaint with optional profileId", async () => {
    const user = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile({ userId: user.id });

    const complaintData = {
      userId: user.id,
      description: "Complaint about a profile",
      profileId: profile.id,
    };

    const result = await userCreateComplaint.execute(complaintData);

    expect(result).toBeDefined();
    expect(result.profileId).toBe(profile.id);
    expect(result.profile).toBeDefined();
    expect(result.profile?.id).toBe(profile.id);
  });
});
