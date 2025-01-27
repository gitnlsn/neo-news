import { vi } from "vitest";
import type { GeminiActions } from ".";

export const mockedGemini = {
  moderateText: vi.fn().mockResolvedValue({ isSafe: true, reasons: [] }),
} satisfies GeminiActions;
