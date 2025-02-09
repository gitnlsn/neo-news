import { describe, expect, it } from "vitest";
import { getTextDescriptionFromHtml } from "./get-text-description-from-html";

describe("getTextDescriptionFromHtml", () => {
  it("should return the text description from the html", () => {
    const html = "<p>Hello, world!</p>";
    const text = getTextDescriptionFromHtml(html);
    expect(text).toBe("Hello, world!");
  });

  it("should return an empty string if the html is empty", () => {
    const html = "";
    const text = getTextDescriptionFromHtml(html);
    expect(text).toBe("");
  });

  it("should return an empty string if the html is null", () => {
    const html = `<p>nelson</p><p></p><div data-youtube-video=""><iframe width="640" height="480" allowfullscreen="true" autoplay="false" disablekbcontrols="false" enableiframeapi="false" endtime="0" ivloadpolicy="0" loop="false" modestbranding="false" origin="" playlist="" src="https://www.youtube.com/embed/UEwfaElBnZk" start="0"></iframe></div><img src="https://picsum.photos/200"><p><s>fdsafsda</s></p><p></p><h2>fdsafsdafsa</h2><h3><s>ffsdafdas</s></h3><p></p><p style="text-align: center"><s>fsdafdsa</s></p><p style="text-align: center"></p><p style="text-align: center"></p><ol><li><p style="text-align: center"><s>fdsa</s></p></li></ol><ul><li><p style="text-align: center">fsdafasf</p></li></ul>`;
    const text = getTextDescriptionFromHtml(html);
    expect(text).toBe(
      "nelson fdsafsda fdsafsdafsa ffsdafdas fsdafdsa fdsa fdsa fsdafasf fsdafasf",
    );
  });
});
