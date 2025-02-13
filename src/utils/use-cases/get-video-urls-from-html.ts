import { JSDOM } from "jsdom";

export const getVideoUrlsFromHtml = (html: string): string[] => {
  const dom = new JSDOM(html);
  const iframes = dom.window.document.querySelectorAll(
    'iframe[src*="youtube.com/embed"]',
  );
  const urls = Array.from(iframes)
    // @ts-expect-error - jsdom missing types
    .map((iframe) => iframe.getAttribute("src") || "")
    .filter(Boolean);
  return urls;
};
