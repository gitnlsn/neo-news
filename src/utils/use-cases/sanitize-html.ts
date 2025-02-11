import DOMPurify, { type UponSanitizeElementHook } from "dompurify";
import { JSDOM } from "jsdom";

type UrlValidatorFn = (url: string) => boolean;

interface SanitizeHtmlParams {
  html: string;
  isUrlSafe?: UrlValidatorFn;
}

export function sanitizeHtml({ html, isUrlSafe }: SanitizeHtmlParams) {
  const window = new JSDOM("").window;
  const purify = DOMPurify(window);

  const validateElements: UponSanitizeElementHook = (node, data) => {
    // Validação de iframes do YouTube
    if (data.tagName === "iframe") {
      // @ts-expect-error expected node to have src
      const src = node.src;
      if (!src.includes("www.youtube.com")) {
        node.parentElement?.removeChild(node);
        node.parentNode?.removeChild(node);
      }
    }

    // Validação de links
    if (data.tagName === "a" && isUrlSafe) {
      // @ts-expect-error expected node to have href
      const href = node.getAttribute("href");

      if (href) {
        const isSafe = isUrlSafe(href);
        if (!isSafe) {
          node.parentElement?.removeChild(node);
          node.parentNode?.removeChild(node);
        }
      }
    }
  };

  purify.addHook("uponSanitizeElement", validateElements);

  return purify.sanitize(html, { ADD_TAGS: ["iframe"] });
}
