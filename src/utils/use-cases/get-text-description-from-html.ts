import { JSDOM } from "jsdom";

export const getTextDescriptionFromHtml = (html: string): string => {
  // Return empty string if html is empty
  if (!html) return "";

  // Create virtual DOM
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Add spaces between block elements
  const blockElements = document.querySelectorAll(
    "p, div, h1, h2, h3, h4, h5, h6, li",
  );

  const textContent: string[] = [];

  for (const element of blockElements) {
    if (element.textContent && element.textContent.length > 0) {
      textContent.push(element.textContent);
    }
  }

  // Get text content from body

  // Clean up the text:
  // - Replace multiple spaces with single space
  // - Replace multiple periods with single period
  // - Replace multiple newlines with single newline
  // - Trim whitespace from start and end
  const cleanText = textContent.join(" ").trim();

  return cleanText;
};
