import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = () => {
  const robotText = `User-agent: *
Allow: /
Sitemap: ${process.env.SITE_URL || "https://persite.vercel.app"}/sitemap.xml
`;

  return new Response(robotText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
