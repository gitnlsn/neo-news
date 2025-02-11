import { describe, expect, it } from "vitest";
import { getAnchorUrlsFromHtml } from "./get-anchor-urls-from-html";

describe("getAnchorUrlsFromHtml", () => {
  it("should return the anchor urls from the html", () => {
    const html = "<a href='https://www.google.com'>Google</a>";
    const urls = getAnchorUrlsFromHtml(html);
    expect(urls).toEqual(["https://www.google.com/"]);
  });

  it("should return multiple anchor urls from the html", () => {
    const html =
      "<a href='https://www.google.com'>Google</a><a href='https://www.facebook.com'>Facebook</a>";
    const urls = getAnchorUrlsFromHtml(html);
    expect(urls).toEqual([
      "https://www.google.com/",
      "https://www.facebook.com/",
    ]);
  });
});
