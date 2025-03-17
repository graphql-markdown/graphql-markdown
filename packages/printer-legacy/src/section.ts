import type {
  GraphQLArgument,
  MDXString,
  PrintTypeOptions,
  SectionLevelValue,
} from "@graphql-markdown/types";

import { isGraphQLFieldType, isDeprecated } from "@graphql-markdown/graphql";

import { printDescription } from "./common";
import { printBadges } from "./badge";
import { hasPrintableDirective, printLink, printParentLink } from "./link";
import { printCustomTags } from "./directive";

import { DEPRECATED, MARKDOWN_EOL, MARKDOWN_EOP } from "./const/strings";
import { SectionLevels } from "./const/options";

export const printSectionItem = <T>(
  type: T,
  options: PrintTypeOptions,
): MDXString | string => {
  const level =
    "level" in options && typeof options.level === "number" ? options.level : 4;

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
  const title = `${SectionLevels.LEVEL.repeat(level)} ${typeNameLink}${parentTypeLink} ${badges} ${tags}${MARKDOWN_EOL}`;

  const description = printDescription(type, options, "")
    .trim()
    .replaceAll("\n", `${MARKDOWN_EOL}`);

  let section = `${title}${description}${MARKDOWN_EOL}`;
  if (isGraphQLFieldType(type)) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    section += printSectionItems(type.args as GraphQLArgument[], {
      ...options,
      level: 5 as SectionLevelValue,
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
    "level" in options && typeof options.level === "number" ? options.level : 4
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
    "level" in options && typeof options.level === "number" ? options.level : 3
  ) as SectionLevelValue;

  const [openSection, closeSection] = ((): MDXString[] | string[] => {
    if (
      typeof options.collapsible?.dataOpen === "string" &&
      typeof options.collapsible.dataClose === "string"
    ) {
      return options.formatMDXDetails!(options.collapsible).split(`\r`);
    }
    return [MARKDOWN_EOP, MARKDOWN_EOP];
  })();

  const items = printSectionItems(values, {
    ...options,
    collapsible: undefined, // do not propagate collapsible
    level:
      level >= 3 && level <= 5 ? ((level + 1) as SectionLevelValue) : undefined,
  });

  if (items === "") {
    return ""; // do not print section is no items printed
  }

  return `${SectionLevels.LEVEL.repeat(level)} ${section}${openSection}${items}${closeSection}` as MDXString;
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
        level: 0 as SectionLevelValue,
        collapsible: {
          dataOpen: DEPRECATED,
          dataClose: DEPRECATED,
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
