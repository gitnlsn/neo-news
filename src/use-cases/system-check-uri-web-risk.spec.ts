import { describe, expect, it } from "vitest";

import { SystemCheckUriWebRiskUseCase } from "./system-check-uri-web-risk";

import { PrismaClient } from "@prisma/client";
import { WebRisk } from "~/resources/web-risk";
import { mockedWebRisk } from "~/resources/web-risk/mocked-web-risk";
import { FakeFactory } from "./utils/fake-factory";

describe("System Check Uri Web Risk", () => {
  const prisma = new PrismaClient();
  const fakeFactory = new FakeFactory(prisma);

  it.skip("should return a safe analysis", async () => {
    const webRisk = new WebRisk();
    const systemCheckUriWebRisk = new SystemCheckUriWebRiskUseCase(
      prisma,
      webRisk,
    );

    const analysis = await systemCheckUriWebRisk.execute({
      uri: "http://testsafebrowsing.appspot.com/s/malware.html",
    });

    expect(analysis.isSafe).toBe(false);
    expect(analysis.threatTypes).toHaveLength(1);
  });

  it("should return a safe analysis", async () => {
    const existingAnalysis = await fakeFactory.createWebRiskAnalysis();

    const systemCheckUriWebRisk = new SystemCheckUriWebRiskUseCase(
      prisma,
      mockedWebRisk,
    );

    const analysis = await systemCheckUriWebRisk.execute({
      uri: existingAnalysis.url,
    });

    expect(analysis.isSafe).toBeDefined();
    expect(mockedWebRisk.checkUrl).toBeCalledTimes(0);
  });
});
