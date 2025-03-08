import type {
  AdmonitionType,
  Badge,
  Maybe,
  MDXString,
  MetaOptions,
} from "@graphql-markdown/types";

const MARKDOWN_EOL = "\n" as const;
const MARKDOWN_EOP = `${MARKDOWN_EOL.repeat(2)}` as const;

export { mdxDeclaration } from "./components";

export const formatMDXBadge = ({ text, classname }: Badge): MDXString => {
  return `<Badge class="badge ${classname}" text="${text as string}"/>` as MDXString;
};

export const formatMDXAdmonition = (
  { text, title, type }: AdmonitionType,
  meta: Maybe<MetaOptions>,
): MDXString => {
  const isDocusaurus = meta?.generatorFrameworkName === "docusaurus";
  if (isDocusaurus && meta.generatorFrameworkVersion?.startsWith("2")) {
    const oldType = type === "warning" ? "caution" : type;
    return `${MARKDOWN_EOP}:::${oldType} ${title}${text}:::` as MDXString;
  }
  return `${MARKDOWN_EOP}:::${type}[${title}]${text}:::` as MDXString;
};

export const formatMDXBullet = (text: string = ""): MDXString => {
  return `<Bullet />${text}` as MDXString;
};

export const formatMDXDetails = ({
  dataOpen,
  dataClose,
}: {
  dataOpen: Maybe<string>;
  dataClose: Maybe<string>;
}): MDXString => {
  return `${MARKDOWN_EOP}<Details dataOpen={${"Hide " + dataOpen}} dataClose={${"Show " + dataClose}}>${MARKDOWN_EOP}\r${MARKDOWN_EOP}</Details>${MARKDOWN_EOP}` as MDXString;
};

export const formatMDXSpecifiedByLink = (url: string): MDXString => {
  return `<SpecifiedBy url="${url}"/>` as MDXString;
};

export const formatMDXNameEntity = (
  name: string,
  parentType?: Maybe<string>,
): MDXString => {
  const parentName = parentType ? `${parentType}.` : "";
  return `<code style={{ fontWeight: 'normal' }}>${parentName}<b>${name}</b></code>` as MDXString;
};
