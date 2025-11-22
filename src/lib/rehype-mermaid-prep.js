// Normalize Astro's Shiki/Prism output for Mermaid code fences so rehype-mermaid can detect them.
function getLanguage(properties = {}) {
  const dataLang = properties["data-language"] || properties.dataLanguage;
  if (typeof dataLang === "string") return dataLang.toLowerCase();

  const className = properties.className;
  if (Array.isArray(className)) {
    for (const cls of className) {
      if (typeof cls === "string" && cls.startsWith("language-")) {
        return cls.replace("language-", "").toLowerCase();
      }
    }
  } else if (typeof className === "string" && className.startsWith("language-")) {
    return className.replace("language-", "").toLowerCase();
  }
}

function extractText(node) {
  if (!node) return "";
  if (node.type === "text" && typeof node.value === "string") {
    return node.value;
  }
  if (Array.isArray(node.children)) {
    return node.children.map(extractText).join("");
  }
  return "";
}

export default function rehypeMermaidPrep() {
  return (tree) => {
    if (!tree || !Array.isArray(tree.children)) return;

    const visit = (node, parent) => {
      if (node?.type !== "element") {
        if (Array.isArray(node?.children)) {
          node.children.forEach((child) => visit(child, node));
        }
        return;
      }

      if (node.tagName === "pre" && parent) {
        const lang = getLanguage(node.properties);
        if (lang === "mermaid") {
          const diagram = extractText(node).replace(/\u00A0/g, " ");
          parent.children[parent.children.indexOf(node)] = {
            type: "element",
            tagName: "pre",
            properties: { className: ["mermaid"] },
            children: [{ type: "text", value: diagram }],
          };
          return; // Replaced node, no need to go deeper.
        }
      }

      if (Array.isArray(node.children)) {
        node.children.forEach((child) => visit(child, node));
      }
    };

    tree.children.forEach((child) => visit(child, tree));
  };
}
