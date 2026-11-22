/**
 * Changesets changelog generator: `@changesets/changelog-github` without the
 * "Thanks @user!" credit for the users listed in the `skipThanks` option
 * (the maintainers), so external contributors are still thanked.
 *
 * Configured in `.changeset/config.json`:
 * `["../packages/tooling-config/scripts/changelog.mts", { "repo": "…", "skipThanks": ["edno"] }]`
 */
import github from "@changesets/changelog-github";
import type { ChangelogFunctions } from "@changesets/types";

// The credit sits in the line prefix, after the PR and commit links and
// before the " - " that starts the summary; anything later is summary text.
const THANKS_REGEX =
  /^(\s*-(?: \[[^\]]+\]\([^)]+\))*) Thanks ((?:\[@[^\]]+\]\([^)]+\)(?:, )?)+)! -/;
const USER_LINK_REGEX = /\[@([^\]]+)\]\([^)]+\)/g;

/**
 * Removes the skipped users from the "Thanks …!" credit of a release line,
 * and the whole credit when nobody is left.
 */
export const dropThanks = (line: string, skipThanks: readonly string[]) => {
  if (skipThanks.length === 0) {
    return line;
  }
  const skipped = new Set(
    skipThanks.map((user) => {
      return user.toLowerCase();
    }),
  );
  return line.replace(THANKS_REGEX, (_match, prefix: string, users: string) => {
    const kept = [...users.matchAll(USER_LINK_REGEX)]
      .filter(([, user]) => {
        return !skipped.has(user.toLowerCase());
      })
      .map(([link]) => {
        return link;
      });
    const credit = kept.length === 0 ? "" : ` Thanks ${kept.join(", ")}!`;
    // A bare "-" prefix means the credit was all there was before the summary.
    return /^\s*-$/.test(prefix) && credit === ""
      ? prefix
      : `${prefix}${credit} -`;
  });
};

const getSkipThanks = (options: Record<string, unknown> | null) => {
  const value = options?.skipThanks;
  return Array.isArray(value)
    ? value.filter((user): user is string => {
        return typeof user === "string";
      })
    : [];
};

const changelogFunctions: ChangelogFunctions = {
  getDependencyReleaseLine: github.getDependencyReleaseLine,
  getReleaseLine: async (changeset, type, options) => {
    const line = await github.getReleaseLine(changeset, type, options);
    return dropThanks(line, getSkipThanks(options));
  },
};

export default changelogFunctions;
