import type { CiProvider } from "@graphql-markdown/types";

/** Vendor table modelled on `ci-info`: env var presence only, never values. */
const VENDORS: readonly (readonly [CiProvider, readonly string[]])[] = [
  ["github-actions", ["GITHUB_ACTIONS"]],
  ["gitlab", ["GITLAB_CI"]],
  ["circleci", ["CIRCLECI"]],
  ["azure-pipelines", ["TF_BUILD"]],
  // BUILD_ID alone is too generic (set by unrelated tooling); ci-info also
  // requires JENKINS_URL, which Jenkins always sets.
  ["jenkins", ["JENKINS_URL"]],
  ["bitbucket", ["BITBUCKET_COMMIT"]],
  ["buildkite", ["BUILDKITE"]],
  ["travis", ["TRAVIS"]],
  ["vercel", ["NOW_BUILDER", "VERCEL"]],
  ["netlify", ["NETLIFY"]],
  ["cloudflare-pages", ["CF_PAGES"]],
  ["aws-codebuild", ["CODEBUILD_BUILD_ARN"]],
  ["teamcity", ["TEAMCITY_VERSION"]],
  ["appveyor", ["APPVEYOR"]],
  ["drone", ["DRONE"]],
  ["render", ["RENDER"]],
];

export interface CiInfo {
  ci: boolean;
  ciProvider?: CiProvider;
}

export const detectCi = (env: NodeJS.ProcessEnv = process.env): CiInfo => {
  if (env.CI === "false" || env.CI === "0") {
    return { ci: false };
  }
  for (const [provider, vars] of VENDORS) {
    if (
      vars.some((name) => {
        return env[name] !== undefined;
      })
    ) {
      return { ci: true, ciProvider: provider };
    }
  }
  if (
    env.CI !== undefined ||
    env.CONTINUOUS_INTEGRATION !== undefined ||
    env.BUILD_NUMBER !== undefined
  ) {
    return { ci: true, ciProvider: "other" };
  }
  return { ci: false };
};
