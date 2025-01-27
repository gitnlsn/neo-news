import DOMPurify, { type UponSanitizeElementHook } from "dompurify";
import { JSDOM } from "jsdom";

export function sanitizeHtml(html: string) {
  const window = new JSDOM("").window;
  const purify = DOMPurify(window);

  const allowYoutubeIframes: UponSanitizeElementHook = (node, data) => {
    if (data.tagName === "iframe") {
      // @ts-expect-error expected node to have src
      const src = node.src;
      if (!src.includes("www.youtube.com")) {
        node.parentElement?.removeChild(node);
        node.parentNode?.removeChild(node);
      }
    }
  };

  purify.addHook("uponSanitizeElement", allowYoutubeIframes);

  return purify.sanitize(html, { ADD_TAGS: ["iframe"] });
}
