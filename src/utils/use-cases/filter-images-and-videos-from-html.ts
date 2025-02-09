import DOMPurify, { type UponSanitizeElementHook } from "dompurify";
import { JSDOM } from "jsdom";

export const filterImagesAndVideosFromHtml = (html: string) => {
  const window = new JSDOM("").window;
  const purify = DOMPurify(window);

  const removeMediaElements: UponSanitizeElementHook = (node, data) => {
    // Remove img tags
    if (data.tagName === "img") {
      node.parentNode?.removeChild(node);
      return;
    }

    // Remove video tags
    if (data.tagName === "video") {
      node.parentNode?.removeChild(node);
      return;
    }

    // Remove iframe tags
    if (data.tagName === "iframe") {
      node.parentNode?.removeChild(node);
      return;
    }

    // Remove div tags that contain youtube videos
    if (data.tagName === "div" && node instanceof window.Element) {
      if (node.hasAttribute("data-youtube-video")) {
        node.parentNode?.removeChild(node);
        return;
      }
    }
  };

  purify.addHook("uponSanitizeElement", removeMediaElements);

  // Keep all HTML tags except those handled in the hook
  return purify.sanitize(html, {
    FORBID_TAGS: [], // Don't forbid any tags by default
    FORBID_ATTR: [], // Don't forbid any attributes by default
  });
};
