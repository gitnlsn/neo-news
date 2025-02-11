import { JSDOM } from "jsdom";

export const getAnchorUrlsFromHtml = (html: string): string[] => {
  const dom = new JSDOM(html);
  const images = dom.window.document.querySelectorAll("a");
  const urls = Array.from(images).map((img) => img.href);
  return urls;
};
