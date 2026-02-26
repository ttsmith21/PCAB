# Section 08: Output & Publishing

## Overview

This section implements the final two modules in the content generation pipeline: the MDX writer that persists validated articles to disk, and the Git publisher that creates branches and pull requests for human review. These modules are invoked by the orchestration layer (section 07) after an article passes validation.

The MDX writer is the last step in every successful single-article or batch generation run. The Git publisher is optional, only invoked when the `--publish` CLI flag is set.

## Dependencies

| Section | What It Provides |
|---------|-----------------|
| section-01-setup | Shared types (`ArticleFrontmatter`, `GenerationResult`, `PipelineConfig`), pipeline config, directory structure, `gray-matter` and `path` available as dependencies |
| section-07-orchestration | CLI flags (`--publish`, `--overwrite`), `generateArticle()` calls `writeArticle()` and `publishBranch()`/`publishPR()` |

**Blocks:** section-09-polish.

## Files to Create

| File | Purpose |
|------|---------|
| `scripts/content-pipeline/output/mdx-writer.ts` | Writes validated MDX articles to `content/articles/{category}/{slug}.mdx` |
| `scripts/content-pipeline/output/git-publisher.ts` | Creates Git branches, commits, and PRs via `git` and `gh` CLI tools |
| `__tests__/scripts/content-pipeline/output/mdx-writer.test.ts` | MDX writer unit tests |
| `__tests__/scripts/content-pipeline/output/git-publisher.test.ts` | Git publisher unit tests (mocked child_process) |

---

## Tests (Write First)

### `__tests__/scripts/content-pipeline/output/mdx-writer.test.ts`

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import path from "path";

// Mock fs/promises so no real files are written during tests
vi.mock("fs/promises");

// Test: writeArticle creates correct path: content/articles/{category}/{slug}.mdx
//   Given category "coaching" and slug "building-team-culture-youth",
//   the returned path should end with content/articles/coaching/building-team-culture-youth.mdx
//   and use path.join() (not string concatenation with "/").

// Test: writeArticle creates category directory if it doesn't exist
//   Mock fs.mkdir and verify it is called with { recursive: true }
//   for the category subdirectory before writing.

// Test: writeArticle writes frontmatter + body as file content
//   Verify fs.writeFile is called with the full MDX string (the string
//   passed in, which already contains frontmatter YAML block + body).

// Test: writeArticle returns the written file path
//   The function should return the absolute path to the written file.

// Test: writeArticle uses path.join for cross-platform path construction
//   Verify the output path is constructed via path.join() or path.resolve(),
//   never via string concatenation with "/" literals. The test can spy on
//   path.join calls or simply verify the returned path uses the platform separator.

// Test: writeArticle throws on file system error
//   Mock fs.writeFile to reject with EACCES. Verify the error propagates.
```

### `__tests__/scripts/content-pipeline/output/git-publisher.test.ts`

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock child_process.execFile
vi.mock("child_process");

// Test: createBranch uses execFile (not exec) to run git commands
//   Verify that child_process.execFile is called, not child_process.exec.
//   This is a security requirement -- exec runs through a shell, which
//   opens command injection vectors.

// Test: createBranch generates correct branch name for single: content/{category}/{slug}
//   Given category "coaching" and slug "team-culture", the branch name
//   should be "content/coaching/team-culture".

// Test: createBranch generates correct branch name for batch: content/batch/{batch-id}
//   Given batch_id "coaching-2026-02-26T120000", the branch name
//   should be "content/batch/coaching-2026-02-26T120000".

// Test: createPR calls gh pr create with correct title and body
//   Verify execFile is called with "gh" and arguments including
//   "pr", "create", "--title", "--body". The body should include
//   validation scores.

// Test: createPR includes validation scores in PR description
//   Given RubricScores with known values, verify the PR body string
//   includes the overall score and per-dimension scores.

// Test: publisher passes arguments as arrays, not interpolated strings
//   All calls to execFile should pass command arguments as an array
//   (the second argument to execFile), never as a single string.

// Test: publisher rejects slug that doesn't match /^[a-z0-9-]+$/
//   Given a slug like "my slug!" or "My-Topic" or "topic;rm -rf /",
//   the function should throw before attempting any git operations.

// Test: publisher normalizes file paths for Windows compatibility
//   On Windows, paths may contain backslashes. Verify that file paths
//   passed to git commands use forward slashes (git requires them).

// Test: publisher logs error but doesn't throw on git failure
//   When execFile returns a non-zero exit code or rejects, the publisher
//   should log an error message but NOT throw. The calling code (orchestration)
//   should still succeed -- articles are generated locally even if publishing fails.
```

---

## Implementation Details

### MDX Writer (`scripts/content-pipeline/output/mdx-writer.ts`)

This module receives a validated MDX string (frontmatter YAML block + MDX body already combined) and writes it to the correct location in the content directory.

**Exports:**

```ts
/**
 * Write a generated article to the content directory.
 *
 * @param mdxContent - The full MDX string including frontmatter YAML block and body.
 * @param category - The article category (e.g., "coaching"). Used as subdirectory name.
 * @param slug - The article slug (e.g., "building-team-culture-youth"). Used as filename.
 * @param outputDir - Base output directory. Defaults to pipeline config output_dir ("content/articles").
 * @returns The absolute path to the written file.
 * @throws If the file system write fails (e.g., permissions error).
 */
export async function writeArticle(
  mdxContent: string,
  category: string,
  slug: string,
  outputDir?: string,
): Promise<string>;
```

**Internal logic:**

1. Resolve the base output directory. If `outputDir` is not provided, import `getConfig` from `@/scripts/content-pipeline/pipeline.config` and use `config.output_dir`. Resolve it relative to the project root using `path.resolve()`.
2. Build the target directory: `path.join(resolvedOutputDir, category)`.
3. Build the target file path: `path.join(resolvedOutputDir, category, `${slug}.mdx`)`.
4. Create the category directory if it does not exist using `fs.mkdir(targetDir, { recursive: true })`.
5. Write the file using `fs.writeFile(targetFilePath, mdxContent, "utf-8")`.
6. Return the absolute file path.

**Key constraints:**
- Always use `path.join()` or `path.resolve()` for path construction. Never concatenate with `"/"` string literals. This ensures Windows compatibility.
- The function does NOT check for existing files (overwrite protection). That logic lives in the orchestration layer (section 07), which checks for file existence before calling `writeArticle`. The writer is intentionally simple -- it writes unconditionally.
- The MDX content string is written as-is. The writer does not parse, validate, or transform it. Validation has already been completed upstream.

**Dependencies:**
- `fs/promises` (Node built-in) for `mkdir` and `writeFile`
- `path` (Node built-in) for `join` and `resolve`
- `@/scripts/content-pipeline/pipeline.config` for default output directory

---

### Git Publisher (`scripts/content-pipeline/output/git-publisher.ts`)

This module handles Git branch creation, committing, pushing, and PR creation via the `gh` CLI. It is only invoked when the user passes the `--publish` flag. It shells out to `git` and `gh` command-line tools using `child_process.execFile`.

**Security invariants (critical):**
1. All git/gh commands use `child_process.execFile` (NOT `child_process.exec`). `execFile` does not spawn a shell, so command injection via slug values is impossible.
2. All command arguments are passed as arrays (the second argument to `execFile`), never interpolated into a command string.
3. Slug values are validated against `/^[a-z0-9-]+$/` before being used in any git operation. If validation fails, the function throws immediately.
4. File paths passed to git commands are normalized to use forward slashes (git on Windows requires forward slashes even though Node's `path.join` produces backslashes).

**Exports:**

```ts
import type { RubricScores } from "@/scripts/content-pipeline/types";

/**
 * Validate that a slug is safe for use in branch names and file paths.
 * Throws if the slug does not match /^[a-z0-9-]+$/.
 */
export function validateSlug(slug: string): void;

/**
 * Normalize a file path for git commands (replace backslashes with forward slashes).
 */
export function normalizePathForGit(filePath: string): string;

/**
 * Create a git branch, stage files, commit, and push.
 *
 * @param branchName - The branch name (e.g., "content/coaching/team-culture").
 * @param filePaths - Absolute paths to files to stage.
 * @param commitMessage - The commit message.
 * @throws Never -- logs errors but does not throw, so article generation is not blocked.
 */
export async function createBranchAndCommit(
  branchName: string,
  filePaths: string[],
  commitMessage: string,
): Promise<boolean>;

/**
 * Create a pull request via gh CLI.
 *
 * @param title - PR title.
 * @param body - PR body (markdown).
 * @param branchName - The branch to create the PR from.
 * @returns true if PR was created, false on failure.
 */
export async function createPR(
  title: string,
  body: string,
  branchName: string,
): Promise<boolean>;

/**
 * Publish a single article: create branch, commit, push, create PR.
 * Wraps createBranchAndCommit + createPR with appropriate naming.
 *
 * @param category - Article category.
 * @param slug - Article slug (validated against /^[a-z0-9-]+$/).
 * @param filePath - Absolute path to the MDX file.
 * @param scores - Validation scores to include in the PR description.
 */
export async function publishSingle(
  category: string,
  slug: string,
  filePath: string,
  scores: RubricScores,
): Promise<boolean>;

/**
 * Publish a batch of articles: single branch, single PR with summary table.
 *
 * @param batchId - Batch identifier for branch naming.
 * @param articles - Array of { category, slug, filePath, scores }.
 */
export async function publishBatch(
  batchId: string,
  articles: Array<{
    category: string;
    slug: string;
    filePath: string;
    scores: RubricScores;
  }>,
): Promise<boolean>;
```

**Internal logic for `createBranchAndCommit`:**

1. Run `execFile("git", ["checkout", "-b", branchName])` to create and switch to a new branch.
2. For each file path: normalize with `normalizePathForGit()`, then run `execFile("git", ["add", normalizedPath])`.
3. Run `execFile("git", ["commit", "-m", commitMessage])`.
4. Run `execFile("git", ["push", "-u", "origin", branchName])`.
5. Wrap the entire sequence in a try/catch. On any error, log the error message and return `false`. Never throw.
6. After publishing (success or failure), switch back to the original branch: `execFile("git", ["checkout", "-"])`.

**Internal logic for `createPR`:**

1. Run `execFile("gh", ["pr", "create", "--title", title, "--body", body, "--head", branchName])`.
2. On success, return `true`. On failure, log error and return `false`.

**Branch naming conventions:**
- Single article: `content/{category}/{slug}` (e.g., `content/coaching/building-team-culture-youth`)
- Batch: `content/batch/{batchId}` (e.g., `content/batch/coaching-2026-02-26T120000`)

**PR description format for single articles:**

```markdown
## Generated Article: {title}

**Category:** {category}
**Slug:** {slug}
**Generated by:** AI pipeline

### Validation Scores

| Dimension | Score |
|-----------|-------|
| Factual Accuracy | {factual_accuracy}/4 |
| Values Alignment | {values_alignment}/4 |
| Audience Appropriateness | {audience_appropriateness}/4 |
| Actionability | {actionability}/4 |
| Writing Quality | {writing_quality}/4 |
| **Overall** | **{overall}/4.0** |

**Result:** {pass ? "PASS" : "FAIL"}
```

**PR description format for batch runs:**

```markdown
## Batch Content Generation: {batchId}

Generated {count} articles.

### Article Summary

| Article | Category | Overall Score | Result |
|---------|----------|---------------|--------|
| {title} | {category} | {overall}/4.0 | {pass ? "PASS" : "FAIL"} |
...
```

**`execFile` wrapper:**

Create a small promisified wrapper around `child_process.execFile`:

```ts
import { execFile as execFileCb } from "child_process";
import { promisify } from "util";

const execFile = promisify(execFileCb);
```

**`normalizePathForGit` implementation:**

```ts
export function normalizePathForGit(filePath: string): string {
  return filePath.replace(/\\/g, "/");
}
```

**`validateSlug` implementation:**

```ts
export function validateSlug(slug: string): void {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(
      `Invalid slug "${slug}": must match /^[a-z0-9-]+$/ (lowercase alphanumeric and hyphens only)`
    );
  }
}
```

---

## Integration with Orchestration (Section 07)

**Single mode:**
1. After `generateArticle()` returns success, call `writeArticle()` with the MDX content, category, and slug.
2. If `--publish` is set, call `publishSingle()` with the file path and validation scores.

**Batch mode:**
1. After each article in the batch succeeds, call `writeArticle()`.
2. Collect all successful article paths and scores.
3. After the batch completes, if `--publish` is set, call `publishBatch()` with all articles.

**Overwrite protection** is handled in the orchestration layer, NOT in the writer or publisher:
- Before calling `writeArticle()`, the orchestration checks if the target file exists using `fs.access()`.
- If the file exists and `--overwrite` is not set: abort (single mode) or skip (batch mode).
- If the file exists and `--overwrite` is set: proceed with `writeArticle()` (which writes unconditionally).

---

## Key Design Decisions

1. **`execFile` over `exec`**: The `exec` function spawns a shell, which means slugs or file paths could be interpreted as shell metacharacters. `execFile` bypasses the shell entirely, eliminating command injection as a risk category.

2. **Arguments as arrays**: Even with `execFile`, passing arguments as a proper array (not a joined string) ensures each argument is correctly escaped by the OS.

3. **Slug re-validation**: Even though slugs are validated by the topic loader (section 03), the publisher validates them again. Defense-in-depth prevents a bug in any upstream module from creating a security issue in shell commands.

4. **Non-throwing publisher**: Git/GitHub operations are best-effort. If the `gh` CLI is not installed, if there is no network, or if the remote rejects the push, the articles are still written locally.

5. **Writer is stateless**: The MDX writer has no awareness of overwrite protection, batch state, or publishing. It writes exactly what it is told to write, where it is told to write it. All coordination logic stays in the orchestration layer.

6. **Forward-slash normalization**: Git commands on Windows require forward slashes in file paths. The `normalizePathForGit` helper handles this transparently.

---

## Verification Checklist

After completing this section, verify:

1. `writeArticle()` creates the correct directory structure and writes a file when given valid inputs.
2. All MDX writer tests pass with mocked `fs/promises`.
3. All git publisher tests pass with mocked `child_process`.
4. `validateSlug` correctly rejects slugs with spaces, uppercase, special characters, and semicolons.
5. `normalizePathForGit` converts backslash paths to forward slashes.
6. The publisher functions return `false` (not throw) on git errors.
7. No direct calls to `child_process.exec` exist anywhere in the output module -- only `execFile`.
8. No path construction uses `"/"` string concatenation -- only `path.join()` or `path.resolve()`.
9. `npm test` passes all existing tests plus the new ones (no regressions).
