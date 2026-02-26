# Integration Notes: Opus Review Feedback

## Suggestions Being Integrated

### Critical (all 5 accepted)

1. **Shared schema definition file** — Create `lib/content-schema.ts` as a Zod schema shared between split 01 (pipeline validation) and split 03 (Velite config). This is the most important cross-split contract. Owned by split 01 initially, consumed by split 03.

2. **Gemini API instability note** — Add explicit note that the model identifier `deep-research-pro-preview-12-2025` is a preview API and must be verified at implementation time. Make `research_model` a config value and add a fallback path to standard Gemini generation if the Interactions API is unavailable.

3. **Add `tsx` to dev dependencies** — Correct the "no additional dev dependencies" claim. tsx is required.

4. **Move topic YAML out of `content/`** — Relocate topic definitions to `scripts/content-pipeline/topics/`. Reserve `content/` exclusively for Velite-renderable MDX output. This prevents Velite from trying to parse YAML files and avoids cross-split directory conflicts.

5. **Shell injection prevention in git publisher** — Use `child_process.execFile` or `spawn` with argument arrays. Validate topic slugs against `/^[a-z0-9-]+$/`. Never interpolate into shell command strings.

### Architectural (6 items)

6. **Batch concurrency model** — Specify default concurrency of 1 (sequential), configurable up to N. Document expected wall-clock time (~3-8 hours for 100 articles). Sequential is safest for v1.

7. **`--overwrite` protection** — Default false for single-article mode. Warn and abort if file exists without `--overwrite`.

8. **`--dry-run` flag** — Run pipeline to a specified stage, print output to stdout. Critical for prompt iteration workflow.

9. **Make git publishing opt-in** — Add `--publish` flag. Default: write locally only. Prevents accidental branch/PR proliferation during prompt development.

10. **Windows path handling** — All file path construction uses `path.join()`/`path.resolve()`. No string concatenation with `/`. Normalize paths in git publisher.

11. **`.content-pipeline-state/` to `.gitignore`** — Add it explicitly.

### Quality & Testing (4 items)

12. **Concrete model defaults** — Write with `claude-sonnet-4-6`, validate with `claude-sonnet-4-6` (different system prompt). Cross-model validation is not justified for v1 — a well-crafted rubric prompt is sufficient.

13. **Prompt snapshot tests** — Add snapshot tests for interpolated prompts. Template changes require intentional snapshot updates.

14. **`.env.example`** — Commit a template with placeholder values.

15. **Cost logging** — Log estimated token usage per article to console. No budget-limit CLI flag for v1.

### Clarifications (5 items)

16. **Truncation detection** — Specify `stop_reason === "max_tokens"` as the detection mechanism.

17. **Content matrix targets** — Clarify: target = count of topics defined in YAML; actual = count of existing MDX files; gap = difference.

18. **`outline_notes` usage** — Injected into both research prompt (focus Gemini's search) and outline prompt (guide Claude's structure).

19. **Use `js-yaml`** instead of the generic `yaml` package. More established, one YAML parser for topic files.

20. **Move `chalk` to dev dependencies** — Pipeline scripts are developer tools, not production code. Also: `tsx` moves to dev deps.

### Build Sequence Reorder

21. **Merge content matrix into topic management** — The matrix is fundamentally about topics and coverage. Build it alongside topic management, not as a separate late step. The orchestrator's matrix mode is just a CLI wrapper.

22. **Bidirectional prompt variable validation** — All `{{variables}}` in templates must have values AND all provided values must match a template variable. Catches typos and stale templates.

---

## Suggestions NOT Being Integrated

### Deferred to post-v1

- **Anthropic Batch API for validation** — Over-engineering for v1. Sequential validation is fine for initial use. Note as future optimization only.
- **Separate vitest config for pipeline tests** — jsdom environment works fine. Not worth the configuration complexity for v1.
- **Budget-limit CLI flag** — Too much infrastructure. Cost logging (integrated above) is sufficient awareness for a developer tool.
- **URL/citation verification** — Important but not core pipeline. Can be added as a post-generation linting step later. The human review PR workflow already serves as a catch.

### Disagreed with

- **Research-quality-based threshold elevation** — The rubric already handles this naturally. If an article lacks research backing, factual accuracy scores will be low and it will fail validation. Adding special threshold logic per-dimension based on research availability adds complexity without meaningful benefit.
- **Rate limit tiers per provider** — The exponential backoff with `Retry-After` header respect already handles this generically. Provider-specific configuration is premature optimization. If rate limiting becomes a problem during batch runs, the sequential default (integrated above) plus existing retry logic handles it.
