import { describe, expect, it } from "vitest";
import { filterImagesAndVideosFromHtml } from "./filter-images-and-videos-from-html";

describe("filterImagesAndVideosFromHtml", () => {
  it("should filter images", () => {
    const html = "<img src='https://picsum.photos/200/300' />";
    const result = filterImagesAndVideosFromHtml(html);
    expect(result).toBe("");
  });

  it("should filter videos", () => {
    const html = `<div data-youtube-video=""><iframe width="640" height="480" allowfullscreen="true" autoplay="false" disablekbcontrols="false" enableiframeapi="false" endtime="0" ivloadpolicy="0" loop="false" modestbranding="false" origin="" playlist="" src="https://www.youtube.com/embed/UEwfaElBnZk" start="0"></iframe></div>`;
    const result = filterImagesAndVideosFromHtml(html);
    expect(result).toBe("");
  });
});
