import { isEnabled } from "../../src/enabled";

const endpoint = { GRAPHQL_MARKDOWN_TELEMETRY_ENDPOINT: "https://t.test/v1" };
const on = { enabled: true, noticeVersion: 1, lastSentConfigs: [] };

describe("isEnabled", () => {
  test("trigger enables", () => {
    expect(isEnabled({ trigger: "cli", env: endpoint })).toEqual({
      enabled: true,
      trigger: "cli",
    });
  });

  test("no trigger and no option is disabled", () => {
    expect(isEnabled({ env: endpoint })).toEqual({ enabled: false });
  });

  test("telemetry:true without trigger is programmatic", () => {
    expect(isEnabled({ option: true, env: endpoint })).toEqual({
      enabled: true,
      trigger: "programmatic",
    });
  });

  test("telemetry:true keeps an explicit trigger", () => {
    expect(isEnabled({ option: true, trigger: "nuxt", env: endpoint })).toEqual(
      { enabled: true, trigger: "nuxt" },
    );
  });

  test.each([
    ["DO_NOT_TRACK", { DO_NOT_TRACK: "1" }],
    [
      "GRAPHQL_MARKDOWN_TELEMETRY_DISABLED",
      { GRAPHQL_MARKDOWN_TELEMETRY_DISABLED: "1" },
    ],
    ["VITEST", { VITEST: "true" }],
    ["JEST_WORKER_ID", { JEST_WORKER_ID: "1" }],
    ["NODE_TEST_CONTEXT", { NODE_TEST_CONTEXT: "child" }],
    ["NODE_ENV=test", { NODE_ENV: "test" }],
  ])("%s beats trigger and telemetry:true", (_name, extra) => {
    const env = { ...endpoint, ...extra };
    expect(isEnabled({ trigger: "cli", option: true, env })).toEqual({
      enabled: false,
    });
  });

  test("option false disables", () => {
    expect(isEnabled({ trigger: "cli", option: false, env: endpoint })).toEqual(
      { enabled: false },
    );
  });

  test("disabled state disables, even with telemetry:true", () => {
    expect(
      isEnabled({
        trigger: "cli",
        option: true,
        state: { ...on, enabled: false },
        env: endpoint,
      }),
    ).toEqual({ enabled: false });
  });

  test("sunset state disables", () => {
    expect(
      isEnabled({
        trigger: "cli",
        state: { ...on, reason: "sunset" },
        env: endpoint,
      }),
    ).toEqual({ enabled: false });
  });

  test("corrupt state disables", () => {
    expect(isEnabled({ trigger: "cli", state: null, env: endpoint })).toEqual({
      enabled: false,
    });
  });

  test("enabled state allows", () => {
    expect(
      isEnabled({ trigger: "cli", state: on, env: endpoint }).enabled,
    ).toBe(true);
  });

  test("empty endpoint kill-gate disables", () => {
    expect(isEnabled({ trigger: "cli", env: {} })).toEqual({ enabled: false });
  });

  test("DEBUG bypasses the kill-gate", () => {
    expect(
      isEnabled({
        trigger: "cli",
        env: { GRAPHQL_MARKDOWN_TELEMETRY_DEBUG: "1" },
      }).enabled,
    ).toBe(true);
  });
});
