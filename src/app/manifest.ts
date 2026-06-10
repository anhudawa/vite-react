import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FeeNote",
    short_name: "FeeNote",
    description:
      "Fee management and recovery for barristers — get paid without being the one doing the chasing.",
    start_url: "/",
    display: "standalone",
    background_color: "#f2f1ec",
    theme_color: "#0f2b26",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
