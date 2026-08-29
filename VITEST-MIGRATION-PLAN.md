# Migration plan: Jest 30 → Vitest

Status: proposed. Scope: whole monorepo (10 test-bearing packages, e2e/smoke suite, Stryker, CI, lint, docs).

## 1. What we're migrating

| Surface | Today | Count |
|---|---|---|
| Test files | `packages/*/tests/{unit,integration}/**/*.{test,spec}.ts` via ts-jest | 70 |
| E2E specs | `tests/e2e/{cli,docusaurus}/specs/*.spec.mjs`, plain ESM, `transform: {}` | 3 |
| Shared config factory | `packages/tooling-config/jest/{base,unit,integration,root}.mjs` + 4 `.d.mts` | 8 |
| Per-package configs | `packages/*/jest.config.mjs` (9 identical + `cli` with overrides) | 10 |
| Root config | `jest.config.mjs` (multi-project aggregator) | 1 |
| E2E configs | `tests/e2e/{cli,docusaurus}/jest.config.mjs` (hand-written) | 2 |
| TS test configs | `packages/*/tsconfig.test.json` — `module: commonjs`, `types: ["node","@types/jest"]` | 10 |
| Manual mocks | `packages/*/tests/__mocks__/**` (10 dirs, 5 populated) | 9 files |
| Mutation testing | `stryker.conf.mjs` → `@stryker-mutator/jest-runner`, imports the jest factory | 1 |

Jest API usage measured across the suite: **~85 `jest.mock` sites in 28 files**, **257 `jest.spyOn`**, **208 `jest.fn`**, **30 `jest.requireActual`**, **13 `jest.mocked`**, **18 `jest.Mock` type casts**, **94 `toMatchInlineSnapshot`**, **29 `toMatchSnapshot`** (5 `.snap` files), **1 `jest.useFakeTimers`**, **1 `jest.resetModules`**. Zero `@jest/globals` imports — everything relies on injected globals. Zero `expect.extend`, zero setup files, zero global setup/teardown, no automock.

## 2. Key decisions (made up front, they shape everything else)

1. **`globals: true`.** No file imports from `@jest/globals` today. Turning on Vitest globals keeps `describe/it/expect/beforeEach` untouched in all 73 files and reduces the diff to `jest.*` → `vi.*`. Trade-off accepted: less explicit, but a 73-file import churn buys nothing here.
2. **Per-package configs, not a root `projects` array.** Turbo already caches a `test` task per package; a root `projects` config invalidates the whole cache on any change. Rename `jest.config.mjs` → `vitest.config.mts` per package, backed by a shared factory in `packages/tooling-config/vitest/`. (`vitest.workspace.ts` is deprecated since Vitest 3.2 — do not introduce one.)
3. **Coverage provider: `@vitest/coverage-v8`, with `@vitest/coverage-istanbul` as the fallback.** The v8 provider emits Istanbul-shaped `coverage-final.json` and `lcov.info`, so the existing `nyc merge` → SonarCloud chain in `test.yml` survives unchanged. **Risk:** `@vitest/coverage-v8` does not work when the process runs on the Bun runtime (JSC, not V8) — and every CI invocation is `bun test:unit`. This is the single biggest unknown; it gets a dedicated spike in Phase 0.
4. **Unit/integration split via path filter, not `--testPathPatterns`.** Vitest has no regex path-pattern flag; `vitest run tests/unit` positional filtering covers it.
5. **Type-checking is no longer free.** ts-jest type-checked at transform time; Vitest's esbuild transform strips types only. The existing `turbo ts:check` task must be treated as load-bearing and kept in the pre-commit hook and CI (it already is) — nothing to add, but nothing to drop either.

## 3. Phases

### Phase 0 — Spikes (do these before writing any migration code)

Each spike is a throwaway branch, answered empirically, no more than an hour each.

- **S1 — Bun + v8 coverage.** Run `bun run vitest run --coverage` in one package. If v8 coverage fails or reports zeros under Bun, decide between (a) `@vitest/coverage-istanbul`, or (b) invoking Vitest under Node in CI. Blocks the Phase 4 CI work.
- **S2 — `node:fs/promises` manual mocks.** The 5 `__mocks__/node:fs/promises.ts` files use a literal colon in the directory name and `export = vol.promises` (CJS). Vitest does **not** auto-load `__mocks__`; each consumer must call `vi.mock('node:fs/promises')`. Confirm Vitest's official memfs recipe (`__mocks__/fs.cjs` / `__mocks__/fs/promises.cjs` returning `memfs`) resolves for `node:`-prefixed specifiers, and whether the colon-named directory still works or must be restructured.
- **S3 — `unionfs` overlay.** `packages/core/tests/__mocks__/fs.ts` builds a real-fs + memfs union via `ufs.use(fs).use(vol)` and exports with `module.exports`. Confirm the equivalent under Vitest ESM, or replace with a pure-memfs mock if the union is no longer needed.
- **S4 — Snapshot drift.** Point Vitest at one package with `.snap` files (`graphql`, `printer-legacy`) and run without `-u`. Vitest and Jest 30 should agree (both default `printBasicPrototype: false`), but the `:` → `>` snapshot-hint separator differs. Measure how many of the 5 `.snap` files and 94 inline snapshots actually drift — this sets the review burden for Phase 3.
- **S5 — `cli` package / Commander.** `packages/cli/jest.config.mjs` carries a `transformIgnorePatterns` + custom ts-jest transform purely to CJS-ify ESM-only Commander v15. Vite handles ESM deps natively, so this is expected to delete outright — verify, don't assume.
- **S6 — Stryker `@stryker-mutator/vitest-runner`.** Version 9.1.1 exists. Confirm it works with per-package `vitest.config.mts`; note its hard constraints: coverage analysis forced to `perTest`, `threads: true` pool only, and `related: true` may need disabling for the cross-package integration specs.

**Gate:** if S1 or S6 fails, adjust decisions 3 and the Phase 5 scope before proceeding.

### Phase 1 — Config foundation (1 PR, no test files touched)

`🔧 conf: add vitest config factory alongside jest`

- Add `packages/tooling-config/vitest/{base,unit,integration}.mts` exporting `createPackageConfig` / `createUnitConfig` / `createIntegrationConfig` built on `defineConfig`/`mergeConfig` from `vitest/config`.
- Port the option surface:

  | Jest | Vitest |
  |---|---|
  | `displayName` | `test.name` |
  | `rootDir` / `roots` | `root` + `test.include` (no multi-root concept) |
  | `testMatch` | `test.include` |
  | `testPathIgnorePatterns` (regex) | `test.exclude` (**globs** — must be rewritten, not copied) |
  | `moduleNameMapper` (3 entries) | `resolve.alias` — keep the two `@graphql-markdown/formatters/*` entries **ordered before** the generic catch-all |
  | `transform` (ts-jest) | dropped, native esbuild |
  | `testEnvironment: node` | `test.environment: "node"` |
  | `testTimeout` | `test.testTimeout` (5000 unit / 30000 integration) |
  | `cacheDirectory` | `cacheDir` |
  | `collectCoverageFrom` | `test.coverage.include` |
  | `coverageReporters: ["json","lcov"]` | `test.coverage.reporter: ["json","lcov"]` + `provider` |
  | `testEnvironmentOptions.globalsCleanup: "on"` | **no equivalent** — closest is `test.isolate`/pool isolation; validate empirically |
  | `workerIdleMemoryLimit: "512M"` | **no equivalent** — closest is `poolOptions.forks.execArgv: ["--max-old-space-size=…"]` |

- Add `./vitest/*` subpaths to `packages/tooling-config/package.json` `exports`, mirroring the existing `./jest/*` entries.
- Add devDeps: `vitest`, `@vitest/coverage-v8` (version-locked to `vitest`), `@vitest/eslint-plugin`.
- **Nothing is switched over yet** — Jest still runs everything. This PR is purely additive and reviewable in isolation.

### Phase 2 — Pilot one package (1 PR)

`♻️ refactor: migrate @graphql-markdown/logger to vitest`

Pick **`logger`**: it has no `__mocks__`, no snapshots, and heavy `expect.hasAssertions()` usage — it exercises the config without the mocking hazards.

- Add `packages/logger/vitest.config.mts`, delete `jest.config.mjs`.
- Swap scripts to `vitest run` / `vitest run tests/unit` / `vitest run tests/integration` / `vitest run --silent --sequence.shuffle --no-file-parallelism` (the `test:ci` equivalent of `--ci --silent --randomize --runInBand`) / `vitest --watch`.
- `tsconfig.test.json`: `types: ["node","@types/jest"]` → `["node","vitest/globals"]`; `module: "commonjs"` → `"esnext"`.
- Update `turbo.json` `inputs` arrays (lines currently naming `jest.config.mjs`) to accept both file names during the transition.
- **Gate:** green locally and in CI, coverage lands in `coverage/lcov.info` as before.

### Phase 3 — Migrate remaining 9 packages (grouped PRs, tests included per commit)

Order by ascending risk:

1. **Low** — `helpers`, `diff`, `docusaurus`, `formatters`: mostly mechanical.
2. **Medium** — `graphql`, `printer-legacy`: snapshot-heavy (all 5 `.snap` files and most of the 94 inline snapshots live here), plus the `jest.mocked(x, { shallow: true })` sites in `printer-legacy/tests/unit/{common,link,relation}.test.ts` — **`vi.mocked()` has no `shallow` option**, these need hand rework.
3. **High** — `utils`, `cli`, `core`: `core` has the unionfs mock, the `@graphql-markdown/diff` manual mock, the only `useFakeTimers` call (at module top level in `generator.test.ts`, outside any hook), and the biggest `jest.mock` fan-out; `utils` and `core/tests/integration/generator.spec.ts` both use inline `jest.mock("node:fs/promises", …)` with `require("memfs")` inside the factory, explicitly relying on Jest hoisting.

`types` has no tests — only its `tsconfig.test.json` `types` array needs the swap.

Mechanical transforms (safe to codemod, then review every hunk):
- `jest.fn` → `vi.fn`, `jest.spyOn` → `vi.spyOn`, `jest.mocked` → `vi.mocked`, `jest.resetModules` → `vi.resetModules`, `jest.useFakeTimers` → `vi.useFakeTimers`, `jest.Mock` type → `Mock` from `vitest`.

Non-mechanical, requires per-site judgement (~15 files):
- **`jest.requireActual` inside a `jest.mock` factory** (30 sites) → the factory must become `async (importOriginal) => ({ ...(await importOriginal()), … })`. Sync → async factory conversion.
- **Vitest factories must return every named export explicitly** — Jest's "factory return value becomes the module" shortcut silently produces a broken module under Vitest.
- **Hoisting strictness:** any factory referencing an outer variable needs `vi.hoisted()`.
- **`__mocks__` are not auto-loaded** — every mocked module needs an explicit `vi.mock(...)` call, per S2/S3 findings.
- **`vi.stubGlobal` does not auto-reset** unless `test.unstubGlobals` is set.

Community codemods exist (`Namchee/j2v`, `gaibianshiji/jest-to-vitest`, Codemod Registry) — usable as a **first pass only**; every `vi.mock` factory and every `__mocks__` file gets hand-reviewed regardless.

### Phase 4 — E2E, smoke, CI (1–2 PRs)

`👷 ci: run e2e smoke tests with vitest`

- `tests/e2e/{cli,docusaurus}/jest.config.mjs` → `vitest.config.mts`. The `globals: { __ROOT_DIR__, __CLI_COMMAND__ }` block has **no Vitest equivalent** — replace with `define` (compile-time constants) or, preferred, read `process.env.PROJECT_DIR` directly in `tests/e2e/helpers/cli.mjs`. This is a code change, not a config rename, and `.github/actions/prepare-scaffold/action.yml:22` documents the `PROJECT_DIR` → `__ROOT_DIR__` contract that changes with it.
- `.github/scripts/e2e/smoke-test.sh:18,20` — change the copied config filename and the invocation; **delete `NODE_OPTIONS=--experimental-vm-modules`** (a Jest-ESM-only requirement).
- Verify the `?(*.)+(spec|test).mjs` extglob under Vitest's `tinyglobby` matcher (Jest used micromatch).
- `.github/workflows/test.yml:66-91` — reporter flags: `--reporters="github-actions"` maps to Vitest's built-in `--reporter=github-actions`; **`--reporters="summary"` has no Vitest equivalent** and gets dropped or replaced with `default`. Confirm `coverage-final.json` still merges through `nyc` (decision 3 / spike S1).
- `.husky/pre-commit:5` runs `bun run test:unit` — should keep working via turbo, verify timing doesn't regress.

### Phase 5 — Mutation testing (1 PR, gated on S6)

`🔧 conf: switch stryker to the vitest runner`

- `packages/tooling-config/stryker/stryker.conf.mjs` is a **rewrite, not a rename**: it currently imports `createProjectConfig` from `jest/base.mjs`, destructures `{ roots, testEnvironment, transform, collectCoverageFrom, moduleNameMapper }`, and hand-builds an inline Jest config with a depth-adjusted `moduleNameMapper`. Replace with `testRunner: "vitest"` + `vitest: { configFile, dir, related }`.
- Swap `@stryker-mutator/jest-runner` → `@stryker-mutator/vitest-runner`.
- Accept the runner's constraints: `perTest` coverage forced, `threads: true` only. Set `related: false` for the integration specs that don't directly import the mutated source.
- `checkers: ["typescript"]` and `buildCommand: "tsgo --build"` are unaffected.

### Phase 6 — Cleanup (1 PR)

`📦️ build: drop jest toolchain`

- Delete `packages/tooling-config/jest/**` (8 files), root `jest.config.mjs`.
- Remove devDeps: `jest`, `jest-environment-node`, `ts-jest`, `@types/jest`, `eslint-plugin-jest`, `@stryker-mutator/jest-runner`.
- `packages/tooling-config/eslint/config.ts` — replace `eslint-plugin-jest` (registered at `:53` and `:199`) with `@vitest/eslint-plugin`; replace `...globals.jest` (`:183`, `:223`) with the vitest globals set. Note: no jest rule *set* is applied today, only plugin registration + globals, so this is lighter than it looks. (`eslint-plugin-vitest` is abandoned — use `@vitest/eslint-plugin`.)
- `.knip.json` — `entry` arrays naming `jest.config.mjs` (`:11,23,27,31`), tooling-config entries `:38-41`, the `"jest"` plugin block `:80-83` → knip's Vitest plugin, and drop `eslint-plugin-jest` (`:63`) / `jest-environment-node` (`:78`) from `ignoreDependencies`.
- `turbo.json` — finish the `inputs` rename started in Phase 2 (stale inputs silently break cache invalidation).
- `dangerfile.js:12,80-98` — `.snap` rules still apply (Vitest uses the same extension); re-check the `rule-jest-snapshot-*` rule names/wording.
- Docs: `CONTRIBUTING.md:108,165,168,169,172,191,195,322`; `packages/core/docs/event-emitter.md:95` (`jest.restoreAllMocks()` in a code sample). `CHANGELOG.md:2188` is historical — leave it.

## 4. Risk register

| Risk | Impact | Mitigation |
|---|---|---|
| v8 coverage broken under Bun runtime | CI coverage → SonarCloud breaks | Spike S1; fall back to istanbul provider or run Vitest under Node |
| `vi.mock` factory shape / hoisting divergence | Silent wrong-module mocks, tests pass for the wrong reason | Hand-review all ~85 sites; never trust codemod output on factories |
| `__mocks__` not auto-loaded | Manual mocks silently ignored, real fs hit in tests | Explicit `vi.mock()` per consumer, or centralize in `setupFiles` |
| Snapshot drift across 99 snapshot assertions | Large noisy diff, real regressions hidden in it | Spike S4 first; regenerate per package in its own commit, review the diff separately from the code change |
| Loss of ts-jest type-checking at test time | Type errors reach main | `turbo ts:check` stays mandatory in pre-commit + CI |
| Stale `turbo.json` inputs | Wrong cache hits, tests appear to pass without running | Update `inputs` in the same PR as each config rename |
| `globalsCleanup` / `workerIdleMemoryLimit` have no equivalent | Cross-test state leaks, worker OOM | Validate isolation empirically; tune `poolOptions` if memory regresses |

## 5. Sequencing summary

```
Phase 0  spikes S1–S6                  (throwaway branches)
Phase 1  vitest factory, additive       1 PR   — no behavior change
Phase 2  pilot: logger                  1 PR   — gate
Phase 3  9 packages, low→high risk      3–4 PRs
Phase 4  e2e + CI                       1–2 PRs
Phase 5  stryker                        1 PR   — gated on S6
Phase 6  remove jest, docs, knip, lint  1 PR
```

Jest and Vitest coexist from Phase 1 through Phase 5, so `main` is green at every commit and any phase can be reverted independently.
