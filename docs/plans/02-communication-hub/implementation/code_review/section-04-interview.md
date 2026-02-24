# Code Review Interview: Section 04 - Site-Wide CTA Integration

**Date:** 2026-02-24

## Interview Items

None — no items needed user input.

## Auto-Fixes

### 1. Add visible bullet styling to homepage value propositions
- **Action:** FIX - Tailwind's CSS reset removes list-style from `<ul>`. Add `list-disc list-inside` to make bullets visible.

## Items Let Go

- Back-to-back bg-gray-50 on homepage (visual alternation is acceptable)
- Outline button on dark background on volunteer page (red text/border has adequate contrast on dark bg)
