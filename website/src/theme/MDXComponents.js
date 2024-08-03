// Importing the original mapper + our components according to the Docusaurus doc
import MDXComponents from "@theme-original/MDXComponents";
import ShowcaseCard from "@site/src/components/ShowcaseFeatures/ShowcaseCard";

export default {
  // Reusing the default mapping
  ...MDXComponents,
  ShowcaseCard,
};
