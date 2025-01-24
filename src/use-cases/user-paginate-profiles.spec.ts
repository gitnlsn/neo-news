import { describe, expect, it } from "vitest";

import { UserPaginateProfilesUseCase } from "./user-paginate-profiles";

import { PrismaClient } from "@prisma/client";
import { FakeFactory } from "./utils/fake-factory";

describe("User Paginate Profiles", () => {
  const prisma = new PrismaClient();
  const fakeFactory = new FakeFactory(prisma);

  it("should list profiles", async () => {
    const userPaginateProfiles = new UserPaginateProfilesUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();

    const profile1 = await fakeFactory.createProfile(user.id);
    const profile2 = await fakeFactory.createProfile(user.id);

    const { profiles, total } = await userPaginateProfiles.execute({
      userId: user.id,
    });

    expect(profiles.length).toBe(2);
    expect(total).toBe(2);

    expect(profiles[0]?.id).toBe(profile1.id);
    expect(profiles[1]?.id).toBe(profile2.id);
  });

  it("should paginate profiles", async () => {
    const userPaginateProfiles = new UserPaginateProfilesUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();

    const profile1 = await fakeFactory.createProfile(user.id);
    const profile2 = await fakeFactory.createProfile(user.id);

    const { profiles, total } = await userPaginateProfiles.execute({
      userId: user.id,

      page: 1,
      perPage: 1,
    });

    expect(profiles.length).toBe(1);
    expect(total).toBe(2);

    expect(profiles[0]?.id).toBe(profile1.id);
  });

  it("should filter profiles by title", async () => {
    const userPaginateProfiles = new UserPaginateProfilesUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();

    const profile1 = await fakeFactory.createProfile(user.id, { title: "t1" });
    const profile2 = await fakeFactory.createProfile(user.id, { title: "t2" });

    const { profiles, total } = await userPaginateProfiles.execute({
      userId: user.id,

      search: "t1",
    });

    expect(profiles.length).toBe(1);
    expect(total).toBe(1);

    expect(profiles[0]?.id).toBe(profile1.id);
  });

  it("should filter profiles by description", async () => {
    const userPaginateProfiles = new UserPaginateProfilesUseCase(prisma);
    // Tests here

    const user = await fakeFactory.createUser();

    const profile1 = await fakeFactory.createProfile(user.id, {
      description: "t1",
    });
    const profile2 = await fakeFactory.createProfile(user.id, {
      description: "t2",
    });

    const { profiles, total } = await userPaginateProfiles.execute({
      userId: user.id,

      search: "t1",
    });

    expect(profiles.length).toBe(1);
    expect(total).toBe(1);

    expect(profiles[0]?.id).toBe(profile1.id);
  });
});
