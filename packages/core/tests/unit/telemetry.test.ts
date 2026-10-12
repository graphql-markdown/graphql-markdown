import { buildConfig } from "../../src/config";
import * as graphqlConfigModule from "../../src/graphql-config";

vi.mock("@graphql-markdown/telemetry", () => {
  return { track: vi.fn() };
});

import { track } from "@graphql-markdown/telemetry";

const flush = async (): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(resolve, 50);
  });
};

describe("buildConfig telemetry", () => {
  const saved = { ...process.env };

  beforeEach(() => {
    delete process.env.VITEST;
    delete process.env.JEST_WORKER_ID;
    delete process.env.NODE_TEST_CONTEXT;
    delete process.env.DO_NOT_TRACK;
    delete process.env.GRAPHQL_MARKDOWN_TELEMETRY_DISABLED;
    process.env.NODE_ENV = "production";
    vi.mocked(track).mockReset();
    vi.spyOn(graphqlConfigModule, "loadConfiguration").mockResolvedValue(
      undefined,
    );
  });

  afterEach(() => {
    process.env = { ...saved };
    vi.restoreAllMocks();
  });

  test("sends a given config once per process", async () => {
    const opts = { baseURL: "same-config" };
    await buildConfig(opts, {}, "default", { trigger: "cli" });
    await buildConfig(opts, {}, "default", { trigger: "cli" });
    await flush();
    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith(
      expect.objectContaining({ trigger: "cli", config: opts }),
    );
  });

  test("sends each distinct config", async () => {
    await buildConfig({ baseURL: "one" }, {}, "default", { trigger: "cli" });
    await flush();
    await buildConfig({ baseURL: "two" }, {}, "default", { trigger: "cli" });
    await flush();
    expect(track).toHaveBeenCalledTimes(2);
  });

  test("sends nothing without a trigger", async () => {
    await buildConfig({ baseURL: "no-trigger" });
    await flush();
    expect(track).not.toHaveBeenCalled();
  });

  test("sends as programmatic with telemetry: true and no trigger", async () => {
    await buildConfig({ baseURL: "programmatic", telemetry: true });
    await flush();
    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith(
      expect.objectContaining({ trigger: "programmatic", option: true }),
    );
  });

  test("honours telemetry: false and DO_NOT_TRACK", async () => {
    await buildConfig({ baseURL: "opt-out", telemetry: false }, {}, "default", {
      trigger: "cli",
    });
    process.env.DO_NOT_TRACK = "1";
    await buildConfig({ baseURL: "dnt" }, {}, "default", { trigger: "cli" });
    await flush();
    expect(track).not.toHaveBeenCalled();
  });

  test("sends nothing when buildConfig throws", async () => {
    vi.spyOn(graphqlConfigModule, "loadConfiguration").mockRejectedValue(
      new Error("boom"),
    );
    await expect(
      buildConfig({ baseURL: "throws" }, {}, "default", { trigger: "cli" }),
    ).rejects.toThrow("boom");
    await flush();
    expect(track).not.toHaveBeenCalled();
  });

  test("buildConfig still resolves when telemetry throws", async () => {
    vi.mocked(track).mockRejectedValue(new Error("telemetry down"));
    await expect(
      buildConfig({ baseURL: "tele-throws" }, {}, "default", {
        trigger: "cli",
      }),
    ).resolves.toMatchObject({ baseURL: "tele-throws" });
    await flush();
    expect(track).toHaveBeenCalledTimes(1);
  });
});
