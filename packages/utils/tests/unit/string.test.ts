import t from "tap";

import {
  toSlug,
  escapeMDX,
  stringCaseBuilder,
  prune,
  capitalize,
} from "../../src/string";

t.test("stringCaseBuilder()", async () => {
  t.test("applies transformation if one is given", async () => {
    const text = "TO LOWERCASE";
    const expected = "to lowercase";
    t.equal(
      stringCaseBuilder(text, (input: any) => String(input).toLowerCase(), " "),
      expected
    );
  });

  t.end();
});

t.test("prune()", async () => {
  t.test("Removes dash from beginning and/or end", async () => {
    const data: [string, string][] = [
      [
        "-string-that-begins-and-ends-with-dash-",
        "string-that-begins-and-ends-with-dash",
      ],
      ["-string-that-begins-with-dash", "string-that-begins-with-dash"],
      ["string-that-ends-with-dash-", "string-that-ends-with-dash"],
      [
        "string-with-no-dashes-in-beginning-or-end",
        "string-with-no-dashes-in-beginning-or-end",
      ],
    ];
    data.forEach(([text, expected]) => {
      t.equal(prune(text, "-"), expected);
    });
  });

  t.end();
});

t.test("toSlug()", async () => {
  t.test("returns kebab style slug", async () => {
    const text = "This is not a slug, but you can use toSlug() function.";
    const expected = "this-is-not-a-slug-but-you-can-use-to-slug-function";
    t.equal(toSlug(text), expected);
  });

  t.end();
});

t.test("escapeMDX()", async () => {
  t.test(
    "returns string with HTML &#x0000; format for MDX special characters",
    async () => {
      t.equal(
        escapeMDX("{MDX} <special> characters"),
        "&#x007B;MDX&#x007D; &#x003C;special&#x003E; characters"
      );
    }
  );

  t.test("leaves input the same if it's not a string", async () => {
    t.equal(escapeMDX(5), 5);
    t.same(escapeMDX({ five: 5 }), { five: 5 });
  });

  t.end();
});

t.test("capitalize()", async () => {
  const data: [string, string][] = [
    ["A", "A"],
    ["foobar", "Foobar"],
    [
      "the quick brown fox jumps over the lazy dog",
      "The quick brown fox jumps over the lazy dog",
    ],
    ["42 dollars", "42 dollars"],
    ["fooBar", "Foobar"],
  ];
  data.forEach(([input, expected]) =>
    t.test(
      "returns capitalized string: first letter uppercase, rest lowercase",
      async () => {
        t.equal(capitalize(input), expected);
      }
    )
  );

  t.end();
});
