import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  return {
    track: vi.fn(),
    detect: vi.fn(),
    getUserAgent: vi.fn(),
    prompts: {
      intro: vi.fn(),
      outro: vi.fn(),
      cancel: vi.fn(),
      select: vi.fn(),
      text: vi.fn(),
      confirm: vi.fn(),
      note: vi.fn(),
      spinner: vi.fn(() => {
        return { start: vi.fn(), stop: vi.fn() };
      }),
      isCancel: vi.fn(() => {
        return false;
      }),
      log: {
        info: vi.fn(),
        success: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
      },
    },
  };
});

vi.mock("package-manager-detector", () => {
  return { detect: mocks.detect, getUserAgent: mocks.getUserAgent };
});
vi.mock("@clack/prompts", () => {
  return mocks.prompts;
});
vi.mock("@graphql-markdown/telemetry", () => {
  return { track: mocks.track };
});

import { main } from "../../lib/create.mjs";

const { isEnabled } = (await vi.importActual(
  "@graphql-markdown/telemetry",
)) as {
  isEnabled: (ctx: {
    trigger: "create";
    option?: boolean;
    env: NodeJS.ProcessEnv;
  }) => { enabled: boolean };
};

/** Stand-in for track that "sends" only when the real enablement rules allow it. */
const sent = vi.fn();
const trackLikeReal = (input: { trigger: "create"; option?: boolean }) => {
  const decision = isEnabled({
    trigger: input.trigger,
    option: input.option,
    env: process.env,
  });
  if (decision.enabled) sent();
};

let work: string;
const quiet = ["--no-install", "--no-git"];

const wireArgs = (dir: string): string[] => {
  const schema = path.join(dir, "s.graphql");
  fs.writeFileSync(schema, "type Query { a: String }\n");
  return [
    "--dir",
    dir,
    "--yes",
    "--framework",
    "generic",
    "--schema",
    schema,
    "--output",
    "docs/api",
  ];
};

const seedProject = (name: string): string => {
  const dir = path.join(work, name);
  fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, "README.md"), "# Hello\n");
  return dir;
};

beforeEach(() => {
  work = fs.mkdtempSync(path.join(os.tmpdir(), "telemetry-test-"));
  mocks.detect.mockResolvedValue({ name: "pnpm" });
  mocks.getUserAgent.mockReturnValue(null);
  mocks.track.mockReset();
  sent.mockReset();
  vi.stubEnv("VITEST", undefined);
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("GRAPHQL_MARKDOWN_TELEMETRY_ENDPOINT", "https://t.test/v1/event");
  vi.stubEnv("DO_NOT_TRACK", undefined);
  vi.stubEnv("GRAPHQL_MARKDOWN_TELEMETRY_DISABLED", undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
  mocks.detect.mockReset();
  mocks.getUserAgent.mockReset();
  fs.rmSync(work, { recursive: true, force: true });
});

describe("create telemetry", () => {
  it("scaffold reports create_scaffold before any file is written", async () => {
    const dir = path.join(work, "new");
    let existedAtTrack: boolean | undefined;
    mocks.track.mockImplementation(() => {
      existedAtTrack = fs.existsSync(dir);
    });
    expect(await main(["--dir", dir, "--yes", "--example", ...quiet])).toBe(0);
    expect(mocks.track).toHaveBeenCalledTimes(1);
    expect(existedAtTrack).toBe(false);
    const input = mocks.track.mock.calls[0][0];
    expect(input).toMatchObject({
      event: "create_scaffold",
      trigger: "create",
      pkg: "create-graphql-markdown-docs",
      mode: "scaffold",
    });
    expect(input.target).toBeTruthy();
    expect(input.option).toBeUndefined();
    input.onFullNotice("notice");
    expect(mocks.prompts.note).toHaveBeenCalledWith("notice", "Telemetry", {
      output: process.stderr,
    });
  });

  it("writes nothing telemetry-related to stdout", async () => {
    const write = vi.spyOn(process.stdout, "write");
    const dir = path.join(work, "stdout");
    expect(await main(["--dir", dir, "--yes", "--example", ...quiet])).toBe(0);
    mocks.track.mock.calls[0][0].onFullNotice("notice");
    const out = write.mock.calls
      .map((c) => {
        return String(c[0]);
      })
      .join("");
    write.mockRestore();
    expect(out).not.toMatch(/telemetry/i);
    expect(mocks.prompts.note.mock.calls.at(-1)?.[2]).toEqual({
      output: process.stderr,
    });
  });

  it("wire reports create_wire before the configuration is written", async () => {
    const dir = seedProject("wire");
    let rcAtTrack: boolean | undefined;
    mocks.track.mockImplementation(() => {
      rcAtTrack = fs.existsSync(path.join(dir, ".graphqlrc"));
    });
    expect(await main(wireArgs(dir))).toBe(0);
    expect(mocks.track).toHaveBeenCalledTimes(1);
    expect(rcAtTrack).toBe(false);
    expect(mocks.track.mock.calls[0][0]).toMatchObject({
      event: "create_wire",
      trigger: "create",
      mode: "wire",
      target: "generic",
    });
    expect(fs.existsSync(path.join(dir, ".graphqlrc"))).toBe(true);
  });

  it("wire --dry-run does not report", async () => {
    const dir = seedProject("wire-dry");
    expect(await main([...wireArgs(dir), "--dry-run"])).toBe(0);
    expect(mocks.track).not.toHaveBeenCalled();
  });

  it("a normal wire run reports once", async () => {
    const dir = seedProject("wire-once");
    expect(await main(wireArgs(dir))).toBe(0);
    expect(mocks.track).toHaveBeenCalledTimes(1);
  });

  it("sends when nothing opts out", async () => {
    mocks.track.mockImplementation(trackLikeReal);
    const dir = path.join(work, "optin");
    expect(await main(["--dir", dir, "--yes", "--example", ...quiet])).toBe(0);
    expect(sent).toHaveBeenCalledTimes(1);
  });

  it("--no-telemetry sends nothing", async () => {
    mocks.track.mockImplementation(trackLikeReal);
    const dir = path.join(work, "optout");
    expect(
      await main([
        "--dir",
        dir,
        "--yes",
        "--example",
        "--no-telemetry",
        ...quiet,
      ]),
    ).toBe(0);
    expect(mocks.track.mock.calls[0][0].option).toBe(false);
    expect(sent).not.toHaveBeenCalled();
  });

  it("DO_NOT_TRACK=1 sends nothing", async () => {
    vi.stubEnv("DO_NOT_TRACK", "1");
    mocks.track.mockImplementation(trackLikeReal);
    const dir = path.join(work, "dnt");
    expect(await main(["--dir", dir, "--yes", "--example", ...quiet])).toBe(0);
    expect(sent).not.toHaveBeenCalled();
  });

  it("a rejecting track does not stop the run", async () => {
    mocks.track.mockRejectedValue(new Error("boom"));
    const dir = path.join(work, "boom");
    expect(await main(["--dir", dir, "--yes", "--example", ...quiet])).toBe(0);
    expect(fs.existsSync(path.join(dir, "package.json"))).toBe(true);
  });

  it("a throwing track does not stop the run", async () => {
    mocks.track.mockImplementation(() => {
      throw new Error("boom");
    });
    const dir = seedProject("throws");
    expect(await main(wireArgs(dir))).toBe(0);
    expect(fs.existsSync(path.join(dir, ".graphqlrc"))).toBe(true);
  });
});
