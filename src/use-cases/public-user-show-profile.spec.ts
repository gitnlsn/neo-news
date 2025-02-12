import { describe, expect, it } from "vitest";

import { PublicUserShowProfileUseCase } from "./public-user-show-profile";

import { PrismaClient } from "@prisma/client";
import { FakeFactory } from "./utils/fake-factory";

describe("Public User Show Profile", () => {
  const prisma = new PrismaClient();
  const fakeFactory = new FakeFactory(prisma);

  it("should show profile", async () => {
    const publicUserShowProfile = new PublicUserShowProfileUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile({ userId: user.id });

    const result = await publicUserShowProfile.execute({
      profileId: profile.id,
    });

    expect(result?.id).toEqual(profile.id);
    expect(result?.user.id).toEqual(user.id);
  });

  it("should not show deleted profile", async () => {
    const publicUserShowProfile = new PublicUserShowProfileUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile({
      userId: user.id,
      deletedAt: new Date(),
    });

    const publicProfile = await publicUserShowProfile.execute({
      profileId: profile.id,
    });

    expect(publicProfile).toBeNull();
  });
});
