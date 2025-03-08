import type { SectionLevelValue } from "@graphql-markdown/types";

import {
  GraphQLNonNull,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLDirective,
} from "graphql/type";
import { Kind, DirectiveLocation } from "graphql/language";

import {
  printSection,
  printSectionItem,
  printSectionItems,
} from "../../src/section";

import { DEPRECATED } from "../../src/const/strings";

import { DEFAULT_OPTIONS, SectionLevels } from "../../src/const/options";

describe("section", () => {
  describe("printSection()", () => {
    test("returns Markdown ### section by default", () => {
      expect.hasAssertions();

      const title = "section title";
      const content = ["section content"];

      const section = printSection(content, title, DEFAULT_OPTIONS);

      expect(section).toMatchInlineSnapshot(`
"### section title

####   



"
`);
    });

    test("returns Markdown ### section with collapsible content", () => {
      expect.hasAssertions();

      const content = ["section content"];

      const section = printSection(content, "", {
        ...DEFAULT_OPTIONS,
        level: SectionLevels.NONE as SectionLevelValue,
        collapsible: {
          dataOpen: DEPRECATED,
          dataClose: DEPRECATED,
        },
      });

      expect(section).toMatchInlineSnapshot(`
" 

<details class="gqlmd-mdx-details">
<summary class="gqlmd-mdx-details-summary"><span className="gqlmd-mdx-details-summary-open">DEPRECATED</span></summary>

####   



</details>

"
`);
    });

    test("returns Markdown custom section level", () => {
      expect.hasAssertions();

      const title = "section title";
      const content = ["section content"];

      const section = printSection(content, title, {
        ...DEFAULT_OPTIONS,
        level: "#" as SectionLevelValue,
      });

      expect(section).toMatchInlineSnapshot(`
"# section title

####   



"
`);
    });

    test("returns empty string if content is empty", () => {
      expect.hasAssertions();

      const title = "section title";
      const content: unknown[] = [];

      const section = printSection(content, title, DEFAULT_OPTIONS);

      expect(section).toBe("");
    });
  });

  describe("printSectionItems()", () => {
    test("returns Markdown one line per item", () => {
      expect.hasAssertions();

      const itemList = ["one", "two", "three"];

      const section = printSectionItems(itemList, DEFAULT_OPTIONS);

      expect(section).toMatchInlineSnapshot(`
"####   



####   



####   

"
`);
    });

    test("returns empty text if not a list", () => {
      expect.hasAssertions();

      const itemList = "list";

      const section = printSectionItems(itemList, DEFAULT_OPTIONS);

      expect(section).toMatch("");
    });
  });

  describe("printSectionItem()", () => {
    const noDoc = new GraphQLDirective({
      name: "noDoc",
      locations: [DirectiveLocation.FIELD],
    });

    test("returns Markdown #### link section with description", () => {
      expect.hasAssertions();

      const type = new GraphQLObjectType({
        name: "EntityTypeName",
        description: "Lorem ipsum",
        fields: {},
      });

      const section = printSectionItem(type, DEFAULT_OPTIONS);

      expect(section).toMatchInlineSnapshot(`
"#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">EntityTypeName</code></span>](/types/objects/entity-type-name.mdx) <mark class="gqlmd-mdx-badge">object</mark> 
Lorem ipsum
"
`);
    });

    test("returns Markdown #### link section with multi-lines description", () => {
      expect.hasAssertions();

      const type = new GraphQLObjectType({
        name: "EntityTypeName",
        description: `Lorem ipsum dolor sit amet, 
consectetur adipiscing elit, 
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 

Ut enim ad minim veniam, 
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat non proident, 
sunt in culpa qui officia deserunt mollit anim id est laborum.`,
        fields: {},
      });

      const section = printSectionItem(type, DEFAULT_OPTIONS);

      expect(section).toMatchInlineSnapshot(`
"#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">EntityTypeName</code></span>](/types/objects/entity-type-name.mdx) <mark class="gqlmd-mdx-badge">object</mark> 
Lorem ipsum dolor sit amet, 
consectetur adipiscing elit, 
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 

Ut enim ad minim veniam, 
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat non proident, 
sunt in culpa qui officia deserunt mollit anim id est laborum.
"
`);
    });

    test("returns Markdown #### link section with sub type is non-nullable", () => {
      expect.hasAssertions();

      const type = {
        name: "EntityTypeName",
        type: new GraphQLNonNull(
          new GraphQLObjectType({
            name: "NonNullableObjectType",
            fields: {},
          }),
        ),
      };

      const section = printSectionItem(type, DEFAULT_OPTIONS);

      expect(section).toMatchInlineSnapshot(`
"#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">EntityTypeName</code></span>](#)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">NonNullableObjectType!</code></span>](/types/objects/non-nullable-object-type.mdx) <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">object</mark> 

"
`);
    });

    test("returns Markdown #### link section with sub type list and non-nullable", () => {
      expect.hasAssertions();

      const type = {
        name: "EntityTypeName",
        type: new GraphQLNonNull(
          new GraphQLList(
            new GraphQLObjectType({
              name: "NonNullableObjectType",
              fields: {},
            }),
          ),
        ),
      };

      const section = printSectionItem(type, DEFAULT_OPTIONS);

      expect(section).toMatchInlineSnapshot(`
"#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">EntityTypeName</code></span>](#)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">[NonNullableObjectType]!</code></span>](/types/objects/non-nullable-object-type.mdx) <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">object</mark> 

"
`);
    });

    test("returns Markdown #### link section with parent type prefix", () => {
      expect.hasAssertions();

      const type = {
        name: "EntityTypeName",
      };

      const section = printSectionItem(type, {
        ...DEFAULT_OPTIONS,
        parentType: "parentTypePrefix",
      });

      expect(section).toMatchInlineSnapshot(`
"#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">parentTypePrefix.</code><code class="gqlmd-mdx-entity-name">EntityTypeName</code></span>](#)  

"
`);
    });

    test("returns Markdown #### link section with field parameters", () => {
      expect.hasAssertions();

      const type = {
        name: "EntityTypeName",
        args: [
          {
            name: "ParameterTypeName",
            type: GraphQLString,
          },
        ],
      };
      const section = printSectionItem(type, DEFAULT_OPTIONS);

      expect(section).toMatchInlineSnapshot(`
"#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">EntityTypeName</code></span>](#)  

##### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">EntityTypeName.</code><code class="gqlmd-mdx-entity-name">ParameterTypeName</code></span>](#)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">String</code></span>](/types/scalars/string.mdx) <mark class="gqlmd-mdx-badge">scalar</mark> 

"
`);
    });

    test("returns Markdown #### link section with non empty nullable list [!]", () => {
      expect.hasAssertions();

      const type = {
        name: "EntityTypeNameList",
        type: new GraphQLList(new GraphQLNonNull(GraphQLInt)),
      };

      const section = printSectionItem(type, DEFAULT_OPTIONS);

      expect(section).toMatchInlineSnapshot(`
"#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">EntityTypeNameList</code></span>](#)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">[Int!]</code></span>](/types/scalars/int.mdx) <mark class="gqlmd-mdx-badge">list</mark> <mark class="gqlmd-mdx-badge">scalar</mark> 

"
`);
    });

    test("returns Markdown #### link section with non empty no nullable list [!]!", () => {
      expect.hasAssertions();

      const type = {
        name: "EntityTypeNameList",
        type: new GraphQLNonNull(
          new GraphQLList(new GraphQLNonNull(GraphQLInt)),
        ),
      };

      const section = printSectionItem(type, DEFAULT_OPTIONS);

      expect(section).toMatchInlineSnapshot(`
"#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">EntityTypeNameList</code></span>](#)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">[Int!]!</code></span>](/types/scalars/int.mdx) <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">scalar</mark> 

"
`);
    });

    test("returns no section if item matches skipDocDirective", () => {
      expect.hasAssertions();

      const type = {
        name: "EntityTypeNameList",
        astNode: {
          kind: Kind.FIELD,
          directives: [{ name: { value: "noDoc", appliedTo: [Kind.FIELD] } }],
        },
      };

      const section = printSectionItem(type, {
        ...DEFAULT_OPTIONS,
        skipDocDirectives: [noDoc],
      });

      expect(section).toBe("");
    });

    test("returns no section if item deprecated and SKIP", () => {
      expect.hasAssertions();

      const type = {
        name: "EntityTypeNameList",
        isDeprecated: true,
        astNode: {
          kind: Kind.FIELD,
          directives: [{ name: { value: "@noDoc" }, appliedTo: [Kind.FIELD] }],
        },
      };

      const section = printSectionItem(type, {
        ...DEFAULT_OPTIONS,
        skipDocDirectives: [noDoc],
        deprecated: "skip",
      });

      expect(section).toBe("");
    });

    test("returns Markdown #### link section without field parameters matching skipDocDirective", () => {
      expect.hasAssertions();

      const type = {
        name: "EntityTypeName",
        isDeprecated: true,
        args: [
          {
            name: "ParameterTypeName",
            type: GraphQLString,
            astNode: {
              kind: Kind.FIELD,
              directives: [{ name: { value: "doc", appliedTo: [Kind.FIELD] } }],
            },
          },
          {
            name: "ParameterSkipDoc",
            type: GraphQLString,
            astNode: {
              kind: Kind.FIELD,
              directives: [
                { name: { value: "noDoc" }, appliedTo: [Kind.FIELD] },
              ],
            },
          },
        ],
      };

      const section = printSectionItem(type, {
        ...DEFAULT_OPTIONS,
        skipDocDirectives: [noDoc],
      });

      expect(section).toMatchInlineSnapshot(`
"#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">EntityTypeName</code></span>](#) <mark class="gqlmd-mdx-badge">deprecated</mark> 
<fieldset class="gqlmd-mdx-admonition-fieldset">
<legend class="gqlmd-mdx-admonition-legend"><span class="gqlmd-mdx-admonition-legend-type gqlmd-mdx-admonition-legend-type-warning">⚠️</span> **DEPRECATED**</legend>
<span>

</span>
</fieldset>
##### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">EntityTypeName.</code><code class="gqlmd-mdx-entity-name">ParameterTypeName</code></span>](#)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">String</code></span>](/types/scalars/string.mdx) <mark class="gqlmd-mdx-badge">scalar</mark> 



"
`);
    });
  });
});
