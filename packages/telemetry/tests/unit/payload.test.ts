import { buildPayload, fingerprint } from "../../src/payload";
import { ALLOWLIST } from "../../src/schema";
import type { TelemetryPayload } from "@graphql-markdown/types";

const base = {
  trigger: "cli",
  pkg: "x",
  pkgVersion: "1.0.0",
  env: {},
} as const;

const SECRETS = [
  "/Users/alice/secret-project",
  "C:\\Users\\bob\\proj",
  "https://internal.corp.example/graphql",
  "db.internal.corp",
  "SecretTypeName",
  "sk_live_abcdef123456",
  "alice@example.com",
];

const collectStrings = (value: unknown, out: string[] = []): string[] => {
  if (typeof value === "string") {
    out.push(value);
  } else if (Array.isArray(value)) {
    value.forEach((v) => {
      return collectStrings(v, out);
    });
  } else if (typeof value === "object" && value !== null) {
    for (const [k, v] of Object.entries(value)) {
      out.push(k);
      collectStrings(v, out);
    }
  }
  return out;
};

const collectKeys = (value: unknown, out: string[] = []): string[] => {
  if (Array.isArray(value)) {
    value.forEach((v) => {
      return collectKeys(v, out);
    });
  } else if (typeof value === "object" && value !== null) {
    for (const [k, v] of Object.entries(value)) {
      out.push(k);
      collectKeys(v, out);
    }
  }
  return out;
};

const buildPlantedInputs = () => {
  const planted = (i: number) => {
    return SECRETS[i % SECRETS.length];
  };
  const config = {
    baseURL: planted(0),
    customDirective: { [planted(1)]: { descriptor: planted(2) } },
    decorators: { [planted(3)]: planted(4) },
    diffMethod: planted(5),
    docOptions: {
      frontMatter: { [planted(6)]: planted(0) },
      generatorFrameworkName: planted(1),
      generatorFrameworkVersion: planted(2),
      categorySort: planted(3),
    },
    groupByDirective: {
      directive: planted(4),
      field: planted(5),
      fallback: planted(6),
      [planted(0)]: planted(1),
    },
    homepage: planted(2),
    id: planted(3),
    linkRoot: planted(4),
    loaders: {
      [planted(5)]: {
        module: planted(6),
        options: { [planted(0)]: planted(1) },
      },
      Another: planted(2),
    },
    formatter: planted(3),
    mdxParser: planted(4),
    metatags: [{ [planted(5)]: planted(6) }],
    onlyDocDirective: [planted(0), planted(1)],
    skipDocDirective: planted(2),
    printTypeOptions: {
      deprecated: planted(3),
      exampleSection: { [planted(4)]: planted(5) },
      hierarchy: planted(6),
    },
    rootPath: planted(0),
    schema: [
      planted(1),
      `git:main:${planted(2)}.graphql`,
      `github:${planted(3)}/repo:schema.graphql`,
      {
        [`https://${planted(4)}.test/graphql`]: {
          headers: { Authorization: planted(5) },
        },
      },
    ],
    tmpDir: planted(3),
    [planted(4)]: planted(5),
  };
  const cli = {
    base: planted(0),
    deprecated: planted(1),
    diff: planted(2),
    groupByDirective: planted(3),
    homepage: planted(4),
    link: planted(5),
    hierarchy: planted(6),
    formatter: planted(0),
    mdxParser: planted(1),
    root: planted(2),
    schema: planted(3),
    skip: [planted(4)],
    only: planted(5),
    tmp: planted(6),
  };
  return { config, cli };
};

const expectNoSecrets = (json: string) => {
  for (const secret of SECRETS) {
    expect(json).not.toContain(secret);
    expect(json).not.toContain(JSON.stringify(secret).slice(1, -1));
  }
};

const expectAllowlistedStrings = (p: ReturnType<typeof buildPayload>) => {
  const allowed = new Set<string>([
    ...ALLOWLIST.maskTokens,
    ...ALLOWLIST.loaderKinds,
    ...ALLOWLIST.knownLoaders,
    "unknown",
  ]);
  const keyToken = new RegExp(ALLOWLIST.keyTokenPattern);
  for (const s of collectStrings({
    config: p.config,
    cli: p.cli,
    loader: p.loader,
  })) {
    const ok = allowed.has(s) || keyToken.test(s) || /^[A-Za-z]+$/.test(s);
    expect(ok, s).toBe(true);
    expect(s).not.toMatch(/[/\\]/);
  }
};

describe("buildPayload", () => {
  test("envelope", () => {
    const p = buildPayload({ ...base, graphqlMajor: 16, noStateBefore: true });
    expect(p).toMatchObject({
      v: 1,
      event: "config",
      pkg: "x",
      graphqlMajor: 16,
      ci: false,
      firstRun: true,
      trigger: "cli",
      container: expect.any(Boolean),
      wsl: expect.any(Boolean),
    });
  });

  test("graphqlMajor other than a small integer is unknown", () => {
    for (const bad of ["16.1", 1.5, -1, 1000, undefined, {}]) {
      expect(buildPayload({ ...base, graphqlMajor: bad }).graphqlMajor).toBe(
        "unknown",
      );
    }
  });

  test("firstRun only when no state existed", () => {
    expect(buildPayload({ ...base }).firstRun).toBe(false);
    expect(buildPayload({ ...base, noStateBefore: false }).firstRun).toBe(
      false,
    );
  });

  test("firstRun is always false in CI", () => {
    const p = buildPayload({
      ...base,
      env: { GITHUB_ACTIONS: "true" },
      noStateBefore: true,
    });
    expect(p).toMatchObject({
      ci: true,
      ciProvider: "github-actions",
      firstRun: false,
    });
  });

  test("package manager from user agent", () => {
    expect(
      buildPayload({
        ...base,
        env: { npm_config_user_agent: "pnpm/9.0.0 node/v22" },
      }).pm,
    ).toBe("pnpm");
  });

  test("wsl from env", () => {
    expect(
      buildPayload({ ...base, env: { WSL_DISTRO_NAME: "Ubuntu" } }).wsl,
    ).toBe(true);
  });

  test("container from env", () => {
    expect(
      buildPayload({ ...base, env: { CODESPACES: "true" } }).container,
    ).toBe(true);
  });

  test("counts unknown keys from both sources", () => {
    const p = buildPayload({
      ...base,
      config: { force: true, nope: 1 } as never,
      cli: { force: true, nope2: 1 } as never,
    });
    expect(p.unknownKeys).toBe(2);
  });

  test("no identifier-like keys", () => {
    const p = buildPayload({
      ...base,
      config: { baseURL: "https://a.test", schema: "x.graphql" },
      cli: { force: true },
    });
    const keys = collectKeys(p);
    expect(
      keys.filter((k) => {
        return /id|uuid|hash|ip|host|user|email/i.test(k);
      }),
    ).toEqual([]);
  });

  test("fuzz: planted secrets never appear", () => {
    const { config, cli } = buildPlantedInputs();
    const p = buildPayload({
      ...base,
      config: config as never,
      cli: cli as never,
      target: undefined,
    });
    expectNoSecrets(JSON.stringify(p));
  });

  test("every emitted string is allowlisted", () => {
    const { config, cli } = buildPlantedInputs();
    const p = buildPayload({
      ...base,
      config: config as never,
      cli: cli as never,
      target: undefined,
    });
    expectAllowlistedStrings(p);
  });
});

describe("pkgVersion truncation", () => {
  test.each([
    ["1.2.3", "1.2"],
    ["1.41.0", "1.41"],
    ["1.2", "1.2"],
    ["1.2.3-rc.1", "1.2"],
    ["1.2.3-beta.4-my-branch", "1.2"],
    ["1.2.3-secret.1", "unknown"],
    ["1.2.3+build", "unknown"],
    ["latest", "unknown"],
    ["1", "unknown"],
  ])("%s -> %s", (input, expected) => {
    expect(buildPayload({ ...base, pkgVersion: input }).pkgVersion).toBe(
      expected,
    );
  });
});

describe("fingerprint", () => {
  const p = (extra: Partial<TelemetryPayload> = {}) => {
    return {
      ...buildPayload({ ...base, config: { force: true, pretty: true } }),
      ...extra,
    };
  };

  test("is a SHA-256 hex", () => {
    expect(fingerprint(p())).toMatch(/^[0-9a-f]{64}$/);
  });

  test("ignores firstRun", () => {
    expect(fingerprint(p({ firstRun: true }))).toBe(
      fingerprint(p({ firstRun: false })),
    );
  });

  test("ignores key order", () => {
    const a = p();
    const b = Object.fromEntries(
      Object.entries(a).reverse(),
    ) as unknown as TelemetryPayload;
    expect(fingerprint(a)).toBe(fingerprint(b));
  });

  test("changes with content", () => {
    expect(fingerprint(p({ pkgVersion: "2.0.0" }))).not.toBe(fingerprint(p()));
  });

  test("is stable across patch versions", () => {
    const a = buildPayload({ ...base, pkgVersion: "1.0.1" });
    const b = buildPayload({ ...base, pkgVersion: "1.0.0" });
    expect(fingerprint(a)).toBe(fingerprint(b));
  });
});

describe("buildPayload generate fields", () => {
  test("rounds duration to 100 ms and keeps pages and errorType", () => {
    const payload = buildPayload({
      ...base,
      event: "generate",
      pages: 12,
      durationMs: 1234,
      errorType: "Error:ENOENT",
    });
    expect(payload).toMatchObject({
      event: "generate",
      pages: 12,
      durationMs: 1200,
      errorType: "Error:ENOENT",
    });
  });

  test("drops invalid values", () => {
    const payload = buildPayload({
      ...base,
      event: "generate",
      pages: 1.5,
      durationMs: Number.NaN,
      errorType: "",
    });
    expect(payload).not.toHaveProperty("pages");
    expect(payload).not.toHaveProperty("durationMs");
    expect(payload).not.toHaveProperty("errorType");
    expect(buildPayload({ ...base, pages: -1 })).not.toHaveProperty("pages");
  });
});
