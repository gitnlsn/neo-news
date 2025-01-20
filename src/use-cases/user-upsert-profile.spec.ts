import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { UserUpsertProfileUseCase } from "./user-upsert-profile";

import { PrismaClient } from "@prisma/client";
import { FakeFactory } from "./utils/fake-factory";
describe("User Upsert Profile", () => {
  const prisma = new PrismaClient();
  const fakeFactory = new FakeFactory(prisma);

  beforeAll(async () => {
    await fakeFactory.cleanDatabase();
  });

  afterEach(async () => {
    await fakeFactory.cleanDatabase();
  });

  it("should create user profile", async () => {
    const userUpsertProfile = new UserUpsertProfileUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();

    const input = {
      userId: user.id,
      title: "Test",
      description: "Test",
    };

    const profile = await userUpsertProfile.execute(input);

    expect(profile?.title).toEqual(input.title);
    expect(profile?.description).toEqual(input.description);
  });

  it("should update user profile", async () => {
    const userUpsertProfile = new UserUpsertProfileUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();
    const profile = await fakeFactory.createProfile(user.id);

    const input = {
      userId: user.id,
      title: "new title",
      description: "new description",
    };

    const updatedProfile = await userUpsertProfile.execute(input);

    expect(updatedProfile?.title).toEqual(input.title);
    expect(updatedProfile?.description).toEqual(input.description);
  });
});
