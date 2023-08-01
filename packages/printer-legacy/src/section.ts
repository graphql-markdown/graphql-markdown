import {
  isParametrizedField,
  hasDirective,
  isDeprecated,
} from "@graphql-markdown/utils";

import { printDescription } from "./common";
import { printBadges } from "./badge";
import { Link } from "./link";
import { printCustomTags } from "./directive";

import {
  HIDE_DEPRECATED,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
  SHOW_DEPRECATED,
} from "./const/strings";
import { Options, SectionLevel, DeprecatedOption } from "./const/options";
import { MDXString } from "./const/mdx";

export const sectionLevels: (SectionLevel | string)[] = [
  SectionLevel.LEVEL_3,
  SectionLevel.LEVEL_4,
  SectionLevel.LEVEL_5,
];

export const printMetadataSection = (
  type: unknown,
  values: unknown,
  section: string,
  options: Options,
): string | MDXString => {
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
    case DeprecatedOption.GROUP: {
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
        level: SectionLevel.NONE,
        collapsible: {
          dataOpen: HIDE_DEPRECATED,
          dataClose: SHOW_DEPRECATED,
        },
      });

      return `${meta}${deprecatedMeta}`;
    }

    case DeprecatedOption.DEFAULT:
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
  options: Options,
): string | MDXString => {
  if (!Array.isArray(values) || values.length === 0) {
    return "";
  }

  const level =
    "level" in options && typeof options.level !== "undefined"
      ? options.level
      : SectionLevel.LEVEL_3;

  const levelPosition = sectionLevels.indexOf(level);

  const [openSection, closeSection] = (() => {
    if (
      "collapsible" in options &&
      typeof options.collapsible !== "undefined" &&
      "dataOpen" in options.collapsible &&
      "dataClose" in options.collapsible
    ) {
      return [
        `${MARKDOWN_EOP}<Details dataOpen={${options.collapsible.dataOpen}} dataClose={${options.collapsible.dataClose}}>${MARKDOWN_EOP}`,
        `${MARKDOWN_EOP}</Details>${MARKDOWN_EOP}`,
      ];
    }
    return [MARKDOWN_EOP, MARKDOWN_EOP];
  })();

  const items = printSectionItems(values, {
    ...options,
    collapsible: undefined, // do not propagate collapsible
    level: levelPosition > -1 ? sectionLevels[levelPosition + 1] : undefined,
  });

  if (items === "") {
    return ""; // do not print section is no items printed
  }

  return `${level} ${section}${openSection}${items}${closeSection}` as MDXString;
};

export const printSectionItems = (
  values: unknown,
  options: Options,
): string | MDXString => {
  if (!Array.isArray(values) || values.length === 0) {
    return "";
  }

  const level =
    "level" in options && typeof options.level !== "undefined"
      ? options.level
      : SectionLevel.LEVEL_4;

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
  options: Options,
): string | MDXString => {
  const level =
    "level" in options && typeof options.level !== "undefined"
      ? options.level
      : SectionLevel.LEVEL_4;

  const skipDirective =
    "skipDocDirective" in options &&
    hasDirective(type, options.skipDocDirective) === true;
  const skipDeprecated =
    "deprecated" in options &&
    options.deprecated === DeprecatedOption.SKIP &&
    isDeprecated(type) === true;

  if (
    typeof type === "undefined" ||
    type === null ||
    skipDirective === true ||
    skipDeprecated === true
  ) {
    return "";
  }

  const typeNameLink = Link.printLink(type, {
    ...options,
    withAttributes: false,
  });
  const description = printDescription(type, options, "").replaceAll(
    "\n",
    `${MARKDOWN_EOL}> `,
  );
  const badges = printBadges(type, options);
  const tags = printCustomTags(type, options);
  const parentTypeLink = Link.printParentLink(type, options);

  let section = `${level} ${typeNameLink}${parentTypeLink} ${badges} ${tags}${MARKDOWN_EOL}> ${description}${MARKDOWN_EOL}> `;
  if (isParametrizedField(type)) {
    section += printSectionItems(type.args, {
      ...options,
      level: SectionLevel.LEVEL_5,
      parentType:
        typeof options.parentType === "undefined"
          ? type.name
          : `${options.parentType}.${type.name}`,
    });
  }

  return section as MDXString;
};
