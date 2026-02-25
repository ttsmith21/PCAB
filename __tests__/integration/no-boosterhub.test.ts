import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import path from "path";

describe("BoosterHub removal verification", () => {
  const rootDir = path.resolve(__dirname, "../..");

  /** Normalize Windows backslashes to forward slashes for consistent matching. */
  function normalizePath(p: string): string {
    return p.replace(/\\/g, "/");
  }

  function grepSourceFiles(pattern: string): string[] {
    try {
      const result = execSync(
        `grep -r -i -l "${pattern}" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=out "${rootDir}"`,
        { encoding: "utf-8" }
      );
      return result
        .trim()
        .split("\n")
        .filter((line) => line.length > 0)
        .map(normalizePath)
        .filter((line) => !line.includes("docs/plans/"))
        .filter((line) => !line.includes("__tests__/integration/"));
    } catch (error: any) {
      // grep exit code 1 = no matches = success
      if (error.status === 1) return [];
      // Any other error (command not found, permission denied) should fail the test
      throw error;
    }
  }

  it("has zero case-insensitive 'boosterhub' matches in source files (excluding tests)", () => {
    const matches = grepSourceFiles("boosterhub").filter(
      (line) => !line.includes("__tests__/")
    );
    expect(matches).toEqual([]);
  });

  it("has zero 'BOOSTERHUB_BASE' references in source files", () => {
    const matches = grepSourceFiles("BOOSTERHUB_BASE").filter(
      (line) => !line.includes("__tests__/")
    );
    expect(matches).toEqual([]);
  });

  it("has zero 'BOOSTERHUB_URLS' references in source files", () => {
    const matches = grepSourceFiles("BOOSTERHUB_URLS").filter(
      (line) => !line.includes("__tests__/")
    );
    expect(matches).toEqual([]);
  });

  it("has zero references to the old BoosterHub domain", () => {
    const matches = grepSourceFiles("pcathleticbooster.boosterhub.com");
    expect(matches).toEqual([]);
  });
});
