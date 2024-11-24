import type {
  GraphQLArgument,
  MDXString,
  PrintTypeOptions,
  SectionLevel,
  SectionLevelValue,
} from "@graphql-markdown/types";

import { isGraphQLFieldType, isDeprecated } from "@graphql-markdown/graphql";

import { printDescription } from "./common";
import { printBadges } from "./badge";
import { hasPrintableDirective, printLink, printParentLink } from "./link";
import { printCustomTags } from "./directive";

import {
  HIDE_DEPRECATED,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
  SHOW_DEPRECATED,
} from "./const/strings";
import { SectionLevels } from "./const/options";

export const sectionLevels: SectionLevel[] = [
  SectionLevels.LEVEL_3 as SectionLevelValue,
  SectionLevels.LEVEL_4 as SectionLevelValue,
  SectionLevels.LEVEL_5 as SectionLevelValue,
];

export const printSectionItem = <T>(
  type: T,
  options: PrintTypeOptions,
): MDXString | string => {
  const level =
    "level" in options && typeof options.level === "string"
      ? options.level
      : SectionLevels.LEVEL_4;

  if (!hasPrintableDirective(type, options)) {
    return "";
  }

  const typeNameLink = printLink(type, {
    ...options,
    withAttributes: false,
  });

  const badges = printBadges(type, options);
  const tags = printCustomTags(type, options);
  const parentTypeLink = printParentLink(type, options);
  const title = `${level} ${typeNameLink}${parentTypeLink} ${badges} ${tags}${MARKDOWN_EOL}`;

  const description = printDescription(type, options, "")
    .trim()
    .replaceAll("\n", `${MARKDOWN_EOL}`);

  let section = `${title}${description}${MARKDOWN_EOL}`;
  if (isGraphQLFieldType(type)) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    section += printSectionItems(type.args as GraphQLArgument[], {
      ...options,
      level: SectionLevels.LEVEL_5 as SectionLevelValue,
      parentType:
        typeof options.parentType === "undefined"
          ? type.name
          : `${options.parentType}.${type.name}`,
    });
  }

  return section as MDXString;
};

export const printSectionItems = <V>(
  values: V | V[],
  options: PrintTypeOptions,
): MDXString | string => {
  if (!Array.isArray(values) || values.length === 0) {
    return "";
  }

  const level = (
    "level" in options && typeof options.level === "string"
      ? options.level
      : SectionLevels.LEVEL_4
  ) as SectionLevelValue;

  return values
    .map((v: V): MDXString => {
      return (
        v &&
        (printSectionItem(v, {
          ...options,
          level,
        }) as MDXString)
      );
    })
    .join(MARKDOWN_EOP) as MDXString;
};

export const printSection = <V>(
  values: V[] | readonly V[],
  section: string,
  options: PrintTypeOptions,
): MDXString | string => {
  if (!Array.isArray(values) || values.length === 0) {
    return "";
  }

  const level = (
    "level" in options && typeof options.level === "string"
      ? options.level
      : SectionLevels.LEVEL_3
  ) as SectionLevelValue;

  const levelPosition = sectionLevels.indexOf(level);

  const [openSection, closeSection] = ((): MDXString[] | string[] => {
    if (
      typeof options.collapsible?.dataOpen === "string" &&
      typeof options.collapsible.dataClose === "string"
    ) {
      return [
        `${MARKDOWN_EOP}<Details dataOpen={${options.collapsible.dataOpen}} dataClose={${options.collapsible.dataClose}}>${MARKDOWN_EOP}` as MDXString,
        `${MARKDOWN_EOP}</Details>${MARKDOWN_EOP}` as MDXString,
      ];
    }
    return [MARKDOWN_EOP, MARKDOWN_EOP];
  })();

  const items = printSectionItems(values, {
    ...options,
    collapsible: undefined, // do not propagate collapsible
    level: (levelPosition > -1
      ? sectionLevels[levelPosition + 1]
      : undefined) as SectionLevelValue,
  });

  if (items === "") {
    return ""; // do not print section is no items printed
  }

  return `${level} ${section}${openSection}${items}${closeSection}` as MDXString;
};

export const printMetadataSection = <T, V>(
  type: T,
  values: V | V[] | readonly V[],
  section: string,
  options: PrintTypeOptions,
): MDXString | string => {
  if (
    typeof type !== "object" ||
    type === null ||
    !("name" in type) ||
    !Array.isArray(values) ||
    values.length === 0
  ) {
    return "";
  }

  switch (options.deprecated) {
    case "group": {
      const { fields, deprecated } = values.reduce(
        (res, arg) => {
          if (isDeprecated(arg)) {
            res.deprecated.push(arg);
          } else {
            res.fields.push(arg);
          }
          return res;
        },
        { fields: [] as V[], deprecated: [] as V[] },
      );

      const meta = printSection(fields, section, {
        ...options,
        parentType: type.name as string,
      });
      const deprecatedMeta = printSection(deprecated, "", {
        ...options,
        parentType: type.name as string,
        level: SectionLevels.NONE as SectionLevelValue,
        collapsible: {
          dataOpen: HIDE_DEPRECATED,
          dataClose: SHOW_DEPRECATED,
        },
      });

      return `${meta}${deprecatedMeta}`;
    }

    case "default":
    default:
      return printSection(values, section, {
        ...options,
        parentType: type.name as string,
      });
  }
};
