import { describe, expect, it } from "vitest";

import { SystemSanitizeHtmlUseCase } from "./system-sanitize-html";

import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { mockedWebRisk } from "~/resources/web-risk/mocked-web-risk";
import { FakeFactory } from "./utils/fake-factory";

describe("System Sanitize Html", () => {
  const prisma = new PrismaClient();
  const fakeFactory = new FakeFactory(prisma);

  it("should sanitize html", async () => {
    const maliciousAnalysis = await fakeFactory.createWebRiskAnalysis({
      isSafe: false,
    });

    const systemSanitizeHtml = new SystemSanitizeHtmlUseCase(
      prisma,
      mockedWebRisk,
    );

    const sanitized = await systemSanitizeHtml.execute({
      html: `<a href="${maliciousAnalysis.url}">${maliciousAnalysis.url}</a>`,
    });

    expect(sanitized).toBe("");
  });

  it("should sanitize html with multiple urls", async () => {
    const maliciousAnalysis = await fakeFactory.createWebRiskAnalysis({
      isSafe: false,
    });

    const maliciousAnalysis2 = await fakeFactory.createWebRiskAnalysis({
      isSafe: false,
    });

    const systemSanitizeHtml = new SystemSanitizeHtmlUseCase(
      prisma,
      mockedWebRisk,
    );

    const sanitized = await systemSanitizeHtml.execute({
      html: `<a href="${maliciousAnalysis.url}">${maliciousAnalysis.url}</a><a href="${maliciousAnalysis2.url}">${maliciousAnalysis2.url}</a>`,
    });

    expect(sanitized).toBe("");
  });
});
