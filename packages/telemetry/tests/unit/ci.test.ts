import { detectCi } from "../../src/ci";

describe("detectCi", () => {
  test.each([
    [{ GITHUB_ACTIONS: "true" }, "github-actions"],
    [{ GITLAB_CI: "true" }, "gitlab"],
    [{ CIRCLECI: "true" }, "circleci"],
    [{ TF_BUILD: "True" }, "azure-pipelines"],
    [{ JENKINS_URL: "http://j" }, "jenkins"],
    [{ BITBUCKET_COMMIT: "abc" }, "bitbucket"],
    [{ BUILDKITE: "true" }, "buildkite"],
    [{ TRAVIS: "true" }, "travis"],
    [{ VERCEL: "1" }, "vercel"],
    [{ NETLIFY: "true" }, "netlify"],
    [{ CF_PAGES: "1" }, "cloudflare-pages"],
    [{ CODEBUILD_BUILD_ARN: "arn" }, "aws-codebuild"],
    [{ CI: "true" }, "other"],
  ])("%j -> %s", (env, provider) => {
    expect(detectCi(env)).toEqual({ ci: true, ciProvider: provider });
  });

  test("no variables means not CI", () => {
    expect(detectCi({})).toEqual({ ci: false });
  });

  test("a stray BUILD_ID alone is not Jenkins", () => {
    expect(detectCi({ BUILD_ID: "42" })).toEqual({ ci: false });
  });

  test.each(["false", "0"])("CI=%s means not CI", (value) => {
    expect(detectCi({ CI: value, GITHUB_ACTIONS: "true" })).toEqual({
      ci: false,
    });
  });
});
