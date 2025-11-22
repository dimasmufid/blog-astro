import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import rehypeMermaid from "rehype-mermaid";

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
  site: "https://astro-nano-demo.vercel.app",
  markdown: {
    rehypePlugins: [mermaidPlugin],
  },
  integrations: [
    mdx({
      rehypePlugins: [mermaidPlugin],
    }),
    sitemap(),
    tailwind(),
  ],
});
