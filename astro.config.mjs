import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import rehypeMermaid from "rehype-mermaid";
import rehypeMermaidPrep from "./src/lib/rehype-mermaid-prep.js";

const mermaidPlugin = [
  rehypeMermaid,
  {
    strategy: "inline-svg",
    mermaidConfig: {
      theme: "neutral",
      backgroundColor: "transparent",
    },
  },
];

export default defineConfig({
  site: "https://dimasmufid.com",
  markdown: {
    rehypePlugins: [rehypeMermaidPrep, mermaidPlugin],
  },
  integrations: [
    mdx({
      rehypePlugins: [rehypeMermaidPrep, mermaidPlugin],
    }),
    sitemap(),
    tailwind(),
  ],
});
