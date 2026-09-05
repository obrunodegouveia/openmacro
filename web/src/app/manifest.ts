import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/** Web app manifest — installability, and the correct name/colour on mobile. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — ${SITE.tagline}`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#070c16",
    theme_color: "#070c16",
    categories: ["education", "finance"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
