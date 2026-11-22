import { describe, expect, test } from "vitest";

import { dropThanks } from "../../packages/tooling-config/scripts/changelog.mts";

const PULL = "[#1](https://github.com/o/r/pull/1)";
const COMMIT = "[`abc1234`](https://github.com/o/r/commit/abc1234)";
const EDNO = "[@edno](https://github.com/edno)";
const ALICE = "[@alice](https://github.com/alice)";

describe("dropThanks()", () => {
  test("removes the credit when the only author is skipped", () => {
    expect.assertions(1);

    expect(
      dropThanks(`\n\n- ${PULL} ${COMMIT} Thanks ${EDNO}! - Summary\n`, [
        "edno",
      ]),
    ).toBe(`\n\n- ${PULL} ${COMMIT} - Summary\n`);
  });

  test("keeps the credit for an external contributor", () => {
    expect.assertions(1);

    const line = `\n\n- ${PULL} ${COMMIT} Thanks ${ALICE}! - Summary\n`;

    expect(dropThanks(line, ["edno"])).toBe(line);
  });

  test("removes only the skipped users from a shared credit", () => {
    expect.assertions(1);

    expect(
      dropThanks(`\n\n- ${PULL} Thanks ${EDNO}, ${ALICE}! - Summary\n`, [
        "EDNO",
      ]),
    ).toBe(`\n\n- ${PULL} Thanks ${ALICE}! - Summary\n`);
  });

  test("drops the separator when the credit was the only prefix", () => {
    expect.assertions(1);

    expect(dropThanks(`\n\n- Thanks ${EDNO}! - Summary\n`, ["edno"])).toBe(
      "\n\n- Summary\n",
    );
  });

  test("leaves a credit written in the summary text untouched", () => {
    expect.assertions(1);

    const line = `\n\n- ${PULL} - Thanks ${EDNO}! - for the idea\n`;

    expect(dropThanks(line, ["edno"])).toBe(line);
  });

  test("returns the line unchanged without skipped users", () => {
    expect.assertions(1);

    const line = `\n\n- ${PULL} Thanks ${EDNO}! - Summary\n`;

    expect(dropThanks(line, [])).toBe(line);
  });
});
