import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { UserShowProfileUseCase } from "./user-show-profile";

import { PrismaClient } from "@prisma/client";
import { FakeFactory } from "./utils/fake-factory";

describe("User Show Profile", () => {
  const prisma = new PrismaClient();
  const fakeFactory = new FakeFactory(prisma);

  it("should show profile", async () => {
    const userShowProfile = new UserShowProfileUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile(user.id);

    const result = await userShowProfile.execute({
      userId: user.id,
      profileId: profile.id,
    });

    expect(result).toEqual(profile);
  });
});
