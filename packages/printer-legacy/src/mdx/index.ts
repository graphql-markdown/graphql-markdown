import type {
  Badge,
  Maybe,
  MDXString,
  MetaOptions,
} from "@graphql-markdown/types";
import { MARKDOWN_EOP } from "../const/strings";

export const formatMDXBadge = ({ text, classname }: Badge): MDXString => {
  return `<Badge class="badge ${classname}" text="${text as string}"/>` as MDXString;
};

interface AdmonitionType {
  title: Maybe<string>;
  text: string;
  type: string;
}
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
  return `${MARKDOWN_EOP}<Details dataOpen={${dataOpen}} dataClose={${dataClose}}>${MARKDOWN_EOP}\r${MARKDOWN_EOP}</Details>${MARKDOWN_EOP}` as MDXString;
};
