# Section 06: Alignment Validation

## Overview

This section implements the alignment validation subsystem. It consists of two modules:

1. **Rubric definition** (`scripts/content-pipeline/validation/rubric.ts`) -- A TypeScript constant defining the 5-dimension scoring rubric with weights, score criteria, and pass/fail logic.
2. **Validator** (`scripts/content-pipeline/validation/validator.ts`) -- An orchestrator that sends a generated article through LLM-as-judge evaluation, parses the JSON result, and generates feedback for failed validations.

## Dependencies

- **section-01-setup**: Shared Zod schema, TypeScript types, pipeline config.
- **section-02-prompts**: Prompt loader and `scripts/prompts/alignment-check.md` template.
- **section-05-claude**: Claude client for sending validation requests.

**Blocks:** section-07-orchestration.

## Files to Create

| File | Purpose |
|------|---------|
| `scripts/content-pipeline/validation/rubric.ts` | Rubric constant, `calculateOverallScore()`, `isPass()` |
| `scripts/content-pipeline/validation/validator.ts` | `validateArticle()`, `generateFeedback()` |
| `__tests__/scripts/content-pipeline/validation/rubric.test.ts` | Pure scoring/pass-fail unit tests |
| `__tests__/scripts/content-pipeline/validation/validator.test.ts` | Validator orchestration tests (mocked Claude + prompt loader) |

## Tests (Write First)

### `__tests__/scripts/content-pipeline/validation/rubric.test.ts`

```ts
// Test: RUBRIC_DIMENSIONS defines 5 dimensions
// Test: RUBRIC_DIMENSIONS has correct weights summing to 1.0
// Test: calculateOverallScore returns correct weighted sum
// Test: calculateOverallScore with all 4s returns 4.0
// Test: calculateOverallScore with all 1s returns 1.0
// Test: calculateOverallScore with mixed scores returns correct weighted value
//   Example: factual=3, values=4, audience=2, actionability=3, writing=4
//   Expected: 3*0.25 + 4*0.25 + 2*0.20 + 3*0.15 + 4*0.15 = 3.20
// Test: isPass returns true when overall >= 3.0 and no dimension is 1
// Test: isPass returns false when overall < 3.0
// Test: isPass returns false when any single dimension scores 1 (auto-fail)
// Test: isPass returns false when dimension is 1 even if overall >= 3.0
```

### `__tests__/scripts/content-pipeline/validation/validator.test.ts`

```ts
vi.mock('@/scripts/content-pipeline/writing/claude-client');
vi.mock('@/scripts/content-pipeline/prompts/prompt-loader');

// Test: validateArticle loads alignment check prompt template
// Test: validateArticle interpolates article, rubric, and PC Way principles
// Test: validateArticle parses JSON response into RubricScores
// Test: validateArticle calculates pass/fail correctly
// Test: validateArticle returns per-dimension reasoning
// Test: validateArticle returns recommendations array
// Test: validateArticle retries on JSON parse failure
// Test: validateArticle fails article after retry limit on parse errors
// Test: generateFeedback extracts failing dimensions and reasoning
// Test: generateFeedback creates regeneration prompt with specific feedback
```

## Implementation Details

### Rubric Definition (`scripts/content-pipeline/validation/rubric.ts`)

Export a `RUBRIC_DIMENSIONS` array with 5 dimensions:

1. **Factual Accuracy** (weight: 0.25) -- Claims supported, no misinformation
2. **Values Alignment** (weight: 0.25) -- Consistent with PC Way principles
3. **Audience Appropriateness** (weight: 0.20) -- Matches declared audience, correct tone
4. **Actionability** (weight: 0.15) -- Concrete, implementable advice
5. **Writing Quality** (weight: 0.15) -- Clear structure, engaging, accessible

Each dimension has explicit `criteria` for score levels 1-4.

**`calculateOverallScore(scores)`**: Weighted sum of all dimension scores.

**`isPass(scores, threshold?)`**: Returns `true` only if overall >= threshold (default 3.0) AND no dimension scores 1.

### Validator (`scripts/content-pipeline/validation/validator.ts`)

**`validateArticle(article, frontmatter)`**:
1. Load alignment-check prompt template.
2. Build rubric text from `RUBRIC_DIMENSIONS`.
3. Build PC Way principles text.
4. Interpolate prompt with `{{article}}`, `{{rubric}}`, `{{pc_way_principles}}`, `{{audience}}`, `{{category}}`.
5. Call Claude (default model: `claude-sonnet-4-6`).
6. Parse JSON response. Strip markdown code fences if present. Retry up to 3 times on parse failure.
7. Recompute `overall` and `pass` server-side (never trust the LLM's calculation).
8. Return complete `RubricScores`.

**`generateFeedback(scores)`**: Identifies failing dimensions (score 1 or 2), extracts reasoning, includes recommendations. Returns formatted feedback string for the retry prompt.

### PC Way Principles

- Character-first development
- Process over outcomes
- Multi-sport participation encouraged
- Age-appropriate progression
- No early specialization pressure
- Voluntary hardship and earned confidence

### Type Reference: `RubricScores`

```ts
interface RubricScores {
  factual_accuracy: 1 | 2 | 3 | 4;
  values_alignment: 1 | 2 | 3 | 4;
  audience_appropriateness: 1 | 2 | 3 | 4;
  actionability: 1 | 2 | 3 | 4;
  writing_quality: 1 | 2 | 3 | 4;
  overall: number;
  pass: boolean;
  reasoning: { [dimension: string]: string };
  recommendations: string[];
}
```
