# Code Review Interview: Section 03 - Join Page and Thank-You Page

**Date:** 2026-02-24

## Interview Items

### 1. Placeholder Facebook Group URL
- **Decision:** Leave as-is — will replace placeholder before deploy

### 2. Relative _redirect path in SignupForm
- **Decision:** Leave relative for now — test when Mailchimp is configured

## Auto-Fixes

### 1. Wrap numbered steps in semantic `<ol>` structure
- **Action:** FIX - Add `<ol>` and `<li>` wrappers for accessibility

## Items Let Go

- Card import not in plan's explicit imports (functional)
- No SectionHeading on thank-you page (Card provides grouping)
- Value prop grid at lg:grid-cols-4 (design taste)
- SignupForm self-wrapping in Card (noted coupling)
