import { beforeEach, describe, expect, it } from "vitest";

import { UserPaginateComplaintsUseCase } from "./user-paginate-complaints";

import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { FakeFactory } from "./utils/fake-factory";

describe("User Paginate Complaints", () => {
  const prisma = new PrismaClient();
  const fakeFactory = new FakeFactory(prisma);
  let userPaginateComplaints: UserPaginateComplaintsUseCase;

  beforeEach(() => {
    userPaginateComplaints = new UserPaginateComplaintsUseCase(prisma);
  });

  // Test complaint fetching
  describe("Complaint Fetching", () => {
    it("should fetch complaints where user is the post author", async () => {
      // Create test data
      const user = await fakeFactory.createUser();
      const profile = await fakeFactory.createProfile({ userId: user.id });
      const post = await fakeFactory.createPost({ profileId: profile.id });

      const complaint = await fakeFactory.createComplaint({
        postId: post.id,
      });

      const { complaints, total } = await userPaginateComplaints.execute({
        userId: user.id,
      });

      expect(complaints).toHaveLength(1);
      expect(complaints[0]?.id).toBe(complaint.id);

      expect(total).toBe(1);
    });

    it("should fetch complaints where user profile is the complainant", async () => {
      // Create test data
      const user = await fakeFactory.createUser();
      const profile = await fakeFactory.createProfile({
        userId: user.id,
      });

      const complaint = await fakeFactory.createComplaint({
        profileId: profile.id,
      });

      const { complaints, total } = await userPaginateComplaints.execute({
        userId: user.id,
      });

      expect(complaints).toHaveLength(1);
      expect(complaints[0]?.id).toBe(complaint.id);

      expect(total).toBe(1);
    });

    it("should return empty array when user has no complaints", async () => {
      const user = await fakeFactory.createUser();

      const { complaints, total } = await userPaginateComplaints.execute({
        userId: user.id,
      });

      expect(complaints).toHaveLength(0);

      expect(total).toBe(0);
    });
  });

  // Test pagination
  describe("Pagination", () => {
    it("should respect page and perPage parameters", async () => {
      // Create test data
      const user = await fakeFactory.createUser();
      const profile = await fakeFactory.createProfile({ userId: user.id });

      // Create 15 complaints
      for (let i = 0; i < 15; i++) {
        const post = await fakeFactory.createPost({ profileId: profile.id });

        await fakeFactory.createComplaint({
          postId: post.id,
          profileId: profile.id,
        });
      }

      const { complaints, total } = await userPaginateComplaints.execute({
        userId: user.id,
        page: 2,
        perPage: 10,
      });

      expect(complaints).toHaveLength(5); // Should return remaining 5 items

      expect(total).toBe(15);
    });
  });
});
