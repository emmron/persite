import {
  PERSITE_SOURCE_default
} from "/build/_shared/chunk-IJYMBMRR.js";
import {
  createHotContext
} from "/build/_shared/chunk-U65RCIF3.js";

// app/utils/generateMetaTags.ts
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\utils\\generateMetaTags.ts"
  );
  import.meta.hot.lastModified = "1747543677784.9692";
}
function generateMetaTags({
  title,
  description,
  image = "/og",
  type = "website"
}) {
  return [
    { title },
    { name: "description", content: description },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charset: "UTF-8" },
    { name: "author", content: PERSITE_SOURCE_default.seo.twitterUsername },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:locale", content: PERSITE_SOURCE_default.seo.locale },
    // siteName
    // og:title might be "My Blog Post About Coding"
    // og:site_name would be "Marcin Zaremski's Blog"
    { property: "og:site_name", content: PERSITE_SOURCE_default.mainPageTitle },
    ...PERSITE_SOURCE_default.seo.twitterUsername ? [
      { name: "twitter:site", content: `@${PERSITE_SOURCE_default.seo.twitterUsername}` },
      { name: "twitter:creator", content: `@${PERSITE_SOURCE_default.seo.twitterUsername}` }
    ] : [],
    ...image ? [
      { property: "og:image", content: image },
      { name: "twitter:image", content: image },
      { property: "og:image:alt", content: title }
    ] : []
  ];
}

export {
  generateMetaTags
};
//# sourceMappingURL=/build/_shared/chunk-X6TQ4243.js.map
