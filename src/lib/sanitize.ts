import sanitize from "sanitize-html";

const SANITIZE_OPTIONS: sanitize.IOptions = {
  allowedTags: sanitize.defaults.allowedTags.concat([
    "img", "figure", "figcaption", "picture", "source",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "details", "summary", "mark", "sub", "sup",
  ]),
  allowedAttributes: {
    ...sanitize.defaults.allowedAttributes,
    img: ["src", "alt", "title", "width", "height", "loading"],
    a: ["href", "title", "target", "rel"],
    source: ["srcset", "media", "type"],
    "*": ["class", "id"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  disallowedTagsMode: "discard",
};

export function sanitizeHtml(dirty: string): string {
  return sanitize(dirty, SANITIZE_OPTIONS);
}
