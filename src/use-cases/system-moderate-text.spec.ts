import { afterEach, describe, expect, it, vi } from "vitest";

import { SystemModerateTextUseCase } from "./system-moderate-text";

import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { Gemini } from "~/resources/gemini";
import { mockedGemini } from "~/resources/gemini/mocked-gemini";
import { FakeFactory } from "./utils/fake-factory";

describe("System Moderate Text", () => {
  const prisma = new PrismaClient();
  const gemini = new Gemini();
  const fakeFactory = new FakeFactory(prisma);

  afterEach(() => {
    vi.clearAllMocks();
  });

  it.skip("should not allow bad words", async () => {
    /*
      This test is skipped because it consumes the Gemini API
    */
    const systemModerateText = new SystemModerateTextUseCase(prisma, gemini);
    const result = await systemModerateText.execute({
      text: `Vamos todos bater nele, pois gostamos muito dele. ${randomUUID()}`,
    });
    expect(result.id).toBeDefined();
    expect(result.isSafe).toBe(false);
  });

  it("should not call gemini if existing moderation", async () => {
    const existingModeration = await fakeFactory.createModeration();
    const systemModerateText = new SystemModerateTextUseCase(
      prisma,
      mockedGemini,
    );
    await systemModerateText.execute({
      text: existingModeration.text,
    });

    expect(mockedGemini.moderateText).not.toHaveBeenCalled();
  });
});
