import { JSDOM } from "jsdom";

export const getUrlsFromHtml = (html: string): string[] => {
  const dom = new JSDOM(html);
  const images = dom.window.document.querySelectorAll("img");
  // @ts-expect-error - jsdom missing types
  const urls = Array.from(images).map((img) => img.src);
  return urls;
};
