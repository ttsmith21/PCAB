# Code Review Interview: Section 02 - Signup Form Component

**Date:** 2026-02-24

## Interview Items

### 1. Progressive enhancement vs controlled inputs
- **Decision:** Keep controlled inputs (user chose this)
- **Rationale:** JS is always available in Next.js app, controlled inputs provide better UX

## Auto-Fixes

### 1. Fix `&amp;` JSX bug in TCPA text
- **Action:** FIX - Change `&amp;` to `&` in TCPA consent paragraph

### 2. Remove dead validation code for commPref
- **Action:** FIX - Remove unreachable `!commPref` check since it's always initialized to "email"

### 3. Clear field errors on input change
- **Action:** FIX - Clear individual field error when user types in that field

### 4. Align level options keys with sports pattern
- **Action:** FIX - Use display labels as keys for level options (matching sports approach)

### 5. Add COMM_PREF hidden fallback for phoneless submissions
- **Action:** FIX - Add hidden input defaulting to "email" when phone is empty

## Items Let Go

- No `aria-invalid` attribute (low priority, aria-describedby is present)
- commPref-error not associated with radios (minor a11y gap)
- Extra h3 for Sports Interests (helpful for structure)
- Spring Tennis data observation (data layer, not form issue)
