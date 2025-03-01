/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  AdmonitionType,
  Badge,
  Maybe,
  MDXString,
  MetaOptions,
} from "@graphql-markdown/types";
import { toString } from "@graphql-markdown/utils";

import { MARKDOWN_EOP } from "../const/strings";

export const formatMDXBadge = ({ text, classname }: Badge): MDXString => {
  return `==${toString(text)}==` as MDXString;
};

export const formatMDXAdmonition = (
  { text, title, type }: AdmonitionType,
  meta: Maybe<MetaOptions>,
): MDXString => {
  return `${MARKDOWN_EOP}<fieldset><legend>${type}::${title}</legend>${text}</fieldset> ` as MDXString;
};

export const formatMDXBullet = (text: string = ""): MDXString => {
  return `&nbsp;●&nbsp;${text}` as MDXString;
};

export const formatMDXDetails = ({
  dataOpen,
  dataClose,
}: {
  dataOpen: Maybe<string>;
  dataClose: Maybe<string>;
}): MDXString => {
  return `${MARKDOWN_EOP}<details>${MARKDOWN_EOP}\r${MARKDOWN_EOP}</details>${MARKDOWN_EOP}` as MDXString;
};
