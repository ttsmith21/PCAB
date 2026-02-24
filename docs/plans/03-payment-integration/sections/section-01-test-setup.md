# Section 01: Test Setup

## Overview

This section establishes the test infrastructure for the entire Stripe Payment Integration project. The project currently has **no test framework** -- there are no test files, no Vitest configuration, and no testing libraries installed. This section installs all dependencies, creates the Vitest configuration file, adds a test script to `package.json`, and verifies the setup with a trivial passing test.

Every subsequent section depends on this one being completed first.

---

## Background

The project is a statically-exported Next.js 16 site using:
- **React 19.2.3** / **React DOM 19.2.3**
- **TypeScript 5.x** with `"jsx": "react-jsx"` in `tsconfig.json`
- **Path alias** `@/*` mapped to the project root (e.g., `@/lib/constants` resolves to `./lib/constants`)
- **Tailwind CSS 4** for styling
- **No existing test framework** -- the `scripts` in `package.json` only define `dev`, `build`, `start`, and `lint`

The file `/tsconfig.json` uses `"moduleResolution": "bundler"` and `"module": "esnext"`. The Vitest config must replicate the `@/*` path alias so that test imports like `import { PAYMENT_URLS } from '@/lib/constants'` resolve correctly.

---

## Dependencies to Install

Install the following as **dev dependencies**:

| Package | Purpose |
|---------|---------|
| `vitest` | Test runner (Vite-native, fast, ESM-first) |
| `@vitejs/plugin-react` | Vite plugin enabling JSX transform for React components in tests |
| `jsdom` | Browser-like DOM environment for component rendering tests |
| `@testing-library/react` | React component testing utilities (render, screen, queries) |
| `@testing-library/jest-dom` | Custom matchers like `toBeInTheDocument()`, `toHaveAttribute()` |

Run:

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

**Note on React 19 compatibility:** `@testing-library/react` v16+ supports React 19. If the install warns about peer dependency conflicts, verify that v16.x or later is being installed. If npm refuses due to a peer dep mismatch, use `--legacy-peer-deps` as a last resort.

---

## Files to Create

### 1. `/vitest.config.ts`

Create this file at the project root, alongside the existing `tsconfig.json` and `next.config.ts`.

This configuration must:
- Import `defineConfig` from `vitest/config` and `react` from `@vitejs/plugin-react`
- Set the test environment to `"jsdom"` so DOM APIs are available
- Add a setup file pointing to a test setup module (for `@testing-library/jest-dom` matchers)
- Configure the `@/*` path alias under `resolve.alias` so that imports like `@/lib/constants` resolve to `./lib/constants` (use `path.resolve(__dirname, './')` to build the alias)
- Register the `react()` Vite plugin so JSX is transformed correctly
- Set `globals: true` so `describe`, `it`, `expect` are available without explicit imports
- Set `include` to match test files in `__tests__/**/*.{test,spec}.{ts,tsx}` (keeping tests in a top-level `__tests__` directory, mirroring the source tree structure)

The key configuration values:

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./__tests__/setup.ts"],
    include: ["__tests__/**/*.{test,spec}.{ts,tsx}"],
  },
});
```

### 2. `/__tests__/setup.ts`

Create the directory `__tests__/` at the project root, then create `setup.ts` inside it. This file imports `@testing-library/jest-dom/vitest` which automatically extends Vitest's `expect` with custom DOM matchers (e.g., `toBeInTheDocument()`, `toHaveAttribute()`, `toHaveTextContent()`).

```ts
// __tests__/setup.ts
/// <reference types="vitest/globals" />
import "@testing-library/jest-dom/vitest";
```

The triple-slash directive gives TypeScript type-checking support for the global `describe`, `it`, `expect` in test files without modifying the main `tsconfig.json`.

### 3. `/__tests__/sanity.test.ts`

A trivial test to verify the entire toolchain works end-to-end: Vitest discovers the file, runs it, and reports a pass.

```ts
// __tests__/sanity.test.ts
describe("test setup", () => {
  it("vitest runs successfully", () => {
    expect(1 + 1).toBe(2);
  });
});
```

---

## Files to Modify

### 4. `/package.json` -- add `test` script

Add a `"test"` entry to the `"scripts"` object. The current scripts block is:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

After modification:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run"
}
```

The `vitest run` command executes all tests once and exits (non-watch mode), which is appropriate for CI and for the `npx vitest run` invocation specified in the project config. Developers can also use `npx vitest` (without `run`) for watch mode during development.

---

## Verification Steps

After completing all the above, verify the setup:

1. Run `npx vitest run` from the project root. It should discover `__tests__/sanity.test.ts`, execute it, and report 1 test passed.
2. Confirm the output shows the jsdom environment is being used.
3. Confirm no errors about path resolution or missing modules.

If the sanity test passes, the test infrastructure is ready for all subsequent sections to add their tests.

---

## File Summary

| File | Action | Purpose |
|------|--------|---------|
| `/vitest.config.ts` | Create | Vitest configuration with jsdom, React plugin, and `@/*` alias |
| `/__tests__/setup.ts` | Create | Test setup importing jest-dom matchers and vitest global types |
| `/__tests__/sanity.test.ts` | Create | Trivial test verifying the toolchain works |
| `/package.json` | Modify | Add `"test": "vitest run"` script |

---

## Checklist

- [ ] Install dev dependencies: `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`
- [ ] Create `/vitest.config.ts` with jsdom environment, React plugin, `@/*` path alias, `globals: true`, and setup file reference
- [ ] Create `/__tests__/setup.ts` with `@testing-library/jest-dom/vitest` import and `vitest/globals` type reference
- [ ] Create `/__tests__/sanity.test.ts` with one trivial test
- [ ] Add `"test": "vitest run"` to `package.json` scripts
- [ ] Run `npx vitest run` and confirm 1 test passes with no errors
