import { vi } from "vitest";
import type { WebRisk } from ".";

export const mockedWebRisk = {
  checkUrl: vi.fn().mockResolvedValue({ isSafe: true, threatTypes: [] }),
} satisfies WebRisk;
