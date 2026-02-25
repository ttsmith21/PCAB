import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

describe("FacebookFeed removal verification", () => {
  const rootDir = path.resolve(__dirname, "../..");

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
      if (error.status === 1) return [];
      throw error;
    }
  }

  it("has zero 'FacebookFeed' references in source files", () => {
    const matches = grepSourceFiles("FacebookFeed").filter(
      (line) => !line.includes("__tests__/")
    );
    expect(matches).toEqual([]);
  });

  it("FacebookFeed.tsx file does not exist", () => {
    const filePath = path.resolve(rootDir, "components/ui/FacebookFeed.tsx");
    expect(fs.existsSync(filePath)).toBe(false);
  });
});
