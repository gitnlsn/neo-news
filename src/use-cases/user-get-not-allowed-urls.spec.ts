import { describe, expect, it } from "vitest";

import { UserGetNotAllowedUrlsUseCase } from "./user-get-not-allowed-urls";

import { PrismaClient } from "@prisma/client";
import { FakeFactory } from "./utils/fake-factory";

describe("User Get Not Allowed Urls", () => {
  const prisma = new PrismaClient();
  const fakeFactory = new FakeFactory(prisma);

  it("should get not allowed urls", async () => {
    const notAllowedUrl = await fakeFactory.createWebRiskAnalysis({
      isSafe: false,
    });

    const userGetNotAllowedUrls = new UserGetNotAllowedUrlsUseCase(prisma);
    // Tests here

    const notAllowedUrls = await userGetNotAllowedUrls.execute({});

    expect(notAllowedUrls).toContain(notAllowedUrl.url);
  });
});
