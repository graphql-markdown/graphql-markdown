import type {
  GraphQLField,
  MDXString,
  PrintTypeOptions,
  SectionLevel,
  SectionLevelValue,
} from "@graphql-markdown/types";

import {
  isGraphQLFieldType,
  hasDirective,
  isDeprecated,
} from "@graphql-markdown/graphql";

import { printDescription } from "./common";
import { printBadges } from "./badge";
import { printLink, printParentLink } from "./link";
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

export const printMetadataSection = (
  type: unknown,
  values: unknown,
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
          isDeprecated(arg) ? res.deprecated.push(arg) : res.fields.push(arg);
          return res;
        },
        { fields: [] as unknown[], deprecated: [] as unknown[] },
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

export const printSection = (
  values: unknown,
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

export const printSectionItems = (
  values: unknown,
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
    .map(
      (v) =>
        v &&
        printSectionItem(v, {
          ...options,
          level,
        }),
    )
    .join(MARKDOWN_EOP) as MDXString;
};

export const printSectionItem = (
  type: unknown,
  options: PrintTypeOptions,
): MDXString | string => {
  const level =
    "level" in options && typeof options.level === "string"
      ? options.level
      : SectionLevels.LEVEL_4;

  const skipDirective = hasDirective(type, options.skipDocDirective);
  const skipDeprecated = options.deprecated === "skip" && isDeprecated(type);

  if (!type || skipDirective || skipDeprecated) {
    return "";
  }

  const typeNameLink = printLink(type, {
    ...options,
    withAttributes: false,
  });
  const description = printDescription(type, options, "").replaceAll(
    "\n",
    `${MARKDOWN_EOL}> `,
  );
  const badges = printBadges(type, options);
  const tags = printCustomTags(type, options);
  const parentTypeLink = printParentLink(type, options);

  let section = `${level} ${typeNameLink}${parentTypeLink} ${badges} ${tags}${MARKDOWN_EOL}> ${description}${MARKDOWN_EOL}> `;
  if (isGraphQLFieldType(type)) {
    section += printSectionItems(
      (type as GraphQLField<unknown, unknown, unknown>).args,
      {
        ...options,
        level: SectionLevels.LEVEL_5 as SectionLevelValue,
        parentType:
          typeof options.parentType === "undefined"
            ? (type as GraphQLField<unknown, unknown, unknown>).name
            : `${options.parentType}.${
                (type as GraphQLField<unknown, unknown, unknown>).name
              }`,
      },
    );
  }

  return section as MDXString;
};
