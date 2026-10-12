import * as telemetry from "@graphql-markdown/telemetry";

import { getTelemetryCommand } from "../../src/telemetry-command";

vi.mock("@graphql-markdown/telemetry", () => {
  return {
    detectCi: vi.fn().mockReturnValue({ ci: false }),
    getStatePath: vi.fn().mockReturnValue("/cfg/telemetry.json"),
    readState: vi.fn(),
    resolveConfigDir: vi.fn().mockReturnValue("/cfg"),
    writeState: vi.fn(),
  };
});

describe("telemetry command", () => {
  let output: string;

  beforeEach(() => {
    output = "";
    vi.clearAllMocks();
    vi.mocked(telemetry.detectCi).mockReturnValue({ ci: false });
    vi.spyOn(process.stderr, "write").mockImplementation((chunk) => {
      output += String(chunk);
      return true;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.exitCode = undefined;
  });

  const run = async (
    action: string,
    env: NodeJS.ProcessEnv = {},
  ): Promise<void> => {
    await getTelemetryCommand(env).parseAsync(["node", "telemetry", action], {
      from: "node",
    });
  };

  test("enable writes enabled: true", async () => {
    await run("enable");

    expect(telemetry.writeState).toHaveBeenCalledWith({
      enabled: true,
      reason: undefined,
    });
    expect(output).toContain("enabled");
  });

  test("disable writes enabled: false", async () => {
    await run("disable");

    expect(telemetry.writeState).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false }),
    );
    expect(output).toContain("disabled");
  });

  test("status reports enabled, CI provider and config dir on stderr", async () => {
    vi.mocked(telemetry.readState).mockReturnValue(undefined);
    vi.mocked(telemetry.detectCi).mockReturnValue({
      ci: true,
      ciProvider: "github-actions",
    });

    await run("status");

    expect(output).toContain("Telemetry: enabled");
    expect(output).toContain("CI provider: github-actions");
    expect(output).toContain("Config dir: /cfg");
  });

  test("status reports the source that disabled telemetry", async () => {
    vi.mocked(telemetry.readState).mockReturnValue(undefined);

    await run("status", { DO_NOT_TRACK: "1" });

    expect(output).toContain("Telemetry: disabled");
    expect(output).toContain("Disabled by: env (DO_NOT_TRACK)");
  });

  test("unknown action sets a failing exit code", async () => {
    await run("nope");

    expect(output).toContain("Unknown action");
    expect(process.exitCode).toBe(1);
  });

  describe("status disabled source", () => {
    const state = { enabled: true, noticeVersion: 1, lastSentConfigs: [] };

    test.each([
      [{ GRAPHQL_MARKDOWN_TELEMETRY_DISABLED: "1" }, state, "env"],
      [{}, null, "unreadable"],
      [{}, { ...state, enabled: false, reason: "sunset" }, "sunset"],
      [{}, { ...state, enabled: false }, "disable"],
    ])("%j / %j is disabled by %s", async (env, st, expected) => {
      vi.mocked(telemetry.readState).mockReturnValue(st);

      await run("status", env);

      expect(output).toContain("Telemetry: disabled");
      expect(output).toContain(expected);
    });

    test("is enabled when nothing disables it", async () => {
      vi.mocked(telemetry.readState).mockReturnValue(state);

      await run("status");

      expect(output).toContain("Disabled by: -");
    });
  });
});
