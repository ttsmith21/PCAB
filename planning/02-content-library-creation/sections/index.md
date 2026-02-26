<!-- PROJECT_CONFIG
runtime: typescript-npm
test_command: npm test
END_PROJECT_CONFIG -->

<!-- SECTION_MANIFEST
section-01-foundation
section-02-vocabulary-schema
section-03-voice-alignment
section-04-port-clinton-way
section-05-development-frameworks
section-06-health-safety
section-07-parent-guides
section-08-coach-resources
section-09-community-building
section-10-curated-resources
section-11-cross-references-qa
END_MANIFEST -->

# Implementation Sections Index

## Dependency Graph

| Section | Depends On | Blocks | Parallelizable |
|---------|------------|--------|----------------|
| section-01-foundation | - | all | Yes |
| section-02-vocabulary-schema | 01 | 03, 04-10 | No |
| section-03-voice-alignment | 01, 02 | 04-10 | No |
| section-04-port-clinton-way | 01, 02, 03 | 05, 06, 07, 08, 09 | No |
| section-05-development-frameworks | 04 | 07, 08, 09 | Yes |
| section-06-health-safety | 04 | 07, 08, 09 | Yes |
| section-07-parent-guides | 04, 05, 06 | 09 | Yes |
| section-08-coach-resources | 04, 05, 06 | 09 | Yes |
| section-09-community-building | 04 | 10 | No |
| section-10-curated-resources | 04-09 | 11 | No |
| section-11-cross-references-qa | all above | - | No |

## Execution Order

1. **section-01-foundation** (no dependencies — directory structure, config files, progress manifest)
2. **section-02-vocabulary-schema** (after 01 — controlled vocabulary and frontmatter schema validation)
3. **section-03-voice-alignment** (after 02 — voice guide, alignment principles, calibration articles, alignment checker)
4. **section-04-port-clinton-way** (after 03 — first content category: 5 Pillars + philosophy foundation, 8-10 articles)
5. **section-05-development-frameworks, section-06-health-safety** (parallel after 04 — evidence-base and safety content, ~10-15 articles each)
6. **section-07-parent-guides, section-08-coach-resources** (parallel after 05+06 — audience-specific content, ~15-20 articles each)
7. **section-09-community-building** (after 04 — program-level content, ~8-12 articles)
8. **section-10-curated-resources** (after all content categories — compiled resource page)
9. **section-11-cross-references-qa** (final — cross-reference pass, completeness checks, coherence review, technical validation)

## Section Summaries

### section-01-foundation
Create the `/content` directory structure with all category subdirectories. Create the progress manifest file (`_progress.yaml`) with initial empty structure. Set up the article body template as a reference document. This section establishes the physical directory layout that all subsequent sections write into.

**Tests:** Directory structure exists, progress manifest parses as valid YAML, category directories match vocabulary.

### section-02-vocabulary-schema
Create the controlled vocabulary file (`_vocabulary.yaml`) with all enumerated field values: categories, subcategories, tags, audiences, age groups, LTAD stages, content types, pillars, difficulty levels, sport relevance. Implement the frontmatter schema validation (Zod or equivalent) that validates any MDX file's frontmatter against the vocabulary. Include the age-group-to-LTAD mapping and pillar name-to-slug mapping.

**Tests:** Vocabulary file loads and parses, schema validation catches invalid values, all controlled field types are covered, pillar slug mapping is complete.

### section-03-voice-alignment
Create the voice guide (`_voice-guide.md`), alignment principles (`_alignment-principles.md`), and three calibration articles (score 1, 3, and 5 examples). Implement the alignment checker as a prompt-based tool that scores articles against the principles document using the calibration anchors. Implement the deterministic checks (frontmatter validation, terminology matching).

**Tests:** Voice guide and alignment principles files exist with required sections, calibration articles score correctly, alignment checker returns structured reports, red-flag patterns are detected.

### section-04-port-clinton-way
Write 8-10 articles for the Port Clinton Way category: one article per pillar (5), plus overview, age-appropriate character milestones, identity-based motivation, and multi-sport philosophy. These are the philosophical foundation. All pillar articles get "critical" AD placeholder tier. Run alignment check on each. Update progress manifest.

**Tests:** 5 pillar articles exist, each references its own pillar, articles cite 4 source frameworks, AD placeholders have "critical" priority, all pass alignment (score 4+).

### section-05-development-frameworks
Write 10-15 articles covering LTAD model, multi-sport evidence, age-appropriate skill windows, physical literacy progression, periodization basics, injury prevention, and the specialization trap. Articles reference Port Clinton Way pillars and cite specific research. Update progress manifest and cross-references.

**Tests:** Minimum 10 articles, all age groups represented, LTAD stages covered, multi-sport content balanced, all pass alignment.

### section-06-health-safety
Write 10-12 articles covering nutrition/recovery by age, concussion protocols, training load guidelines, injury prevention, rest requirements, and return-to-play. All articles include medical disclaimer. Reference AAP guidelines specifically. Update progress manifest.

**Tests:** Medical disclaimer present in all articles, training loads respect AAP guidelines, concussion content defers to NFHS/state protocols, all pass alignment.

### section-07-parent-guides
Write 15-20 articles targeting parents: supporting youth athletes by age, development expectations, mental health, being a supportive sports parent, understanding what coaches want, nutrition basics. Reference earlier development frameworks and safety content. Update progress manifest.

**Tests:** Audience includes "parent", never prescriptive about coaching, all age groups covered, cross-references to framework/safety articles, all pass alignment.

### section-08-coach-resources
Write 12-18 articles targeting volunteer coaches: onboarding guide, practice planning, age-appropriate coaching methods, season structure, managing parents, building team culture, connecting to the athletic pipeline. Reference frameworks and philosophy. Update progress manifest.

**Tests:** Audience includes "coach", respects coach autonomy (no plays/drills/schemes), practical/actionable takeaways, cross-references to framework articles, all pass alignment.

### section-09-community-building
Write 8-12 articles on volunteer recruitment, program health metrics, building multi-sport culture, fundraising, measuring success beyond wins, coordinating across sports. Reference the 5 Pillars for program evaluation. Update progress manifest.

**Tests:** Audience includes "administrator", 5 Pillars used as program evaluation framework, practical volunteer/fundraising guidance, all pass alignment.

### section-10-curated-resources
Compile the curated external resources page from all sources cited across articles. Organize by category (Organizations, Research, Tools, Reading). Write editorial context: 150-250 words for key resources, 2-3 sentences for standard resources. Verify selection criteria (established, evidence-based, freely accessible).

**Tests:** Resources file exists, key resources have long-form editorial, standard resources have annotations, organized by category, URLs verified where possible.

### section-11-cross-references-qa
Final quality assurance pass: run cross-reference updates across all articles (add `relatedArticles` for newly created content), run completeness checks (all subcategories, audiences, age groups covered), run coherence review (no contradictions, consistent pillar descriptions), run technical validation (schema, slug resolution, no cycles). Generate orphan report. Verify progress manifest matches file inventory. Confirm stopping criteria are met.

**Tests:** All articles have at least one cross-reference, no broken slugs, no prerequisite cycles, all subcategories covered, 5 Pillars span 4+ categories, stopping criteria met, manifest matches files.
