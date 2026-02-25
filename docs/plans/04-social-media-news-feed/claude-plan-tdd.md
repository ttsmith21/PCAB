# TDD Plan: Social Media & News Feed Integration

**Testing Framework**: Vitest 4.0.18 with @testing-library/react 16.3.2, jsdom environment
**Test Location**: `__tests__/` mirroring source structure
**Conventions**: Mock Next.js Link/Image globally (in setup.ts), mock child components to isolate, use `vi.mock()` for module mocking

---

## 3. Section: Constants & Configuration

**Test file**: `__tests__/lib/constants.test.ts`

### Tests to Write Before Implementing

- Test: SOCIAL_URLS object exists and has `facebook`, `instagram`, `youtube` keys
- Test: All SOCIAL_URLS values are valid URL strings (start with `https://`)
- Test: CURATOR_CONFIG object exists and has `feedId` key
- Test: CURATOR_CONFIG.feedId is a non-empty string

---

## 4. Section: CuratorFeed Component

**Test file**: `__tests__/components/ui/CuratorFeed.test.tsx`

### Tests to Write Before Implementing

- Test: Renders a container div with `data-crt-feed-id` attribute matching the provided feedId prop
- Test: Renders a Script element with src pointing to `https://cdn.curator.io/published/{feedId}.js`
- Test: Script element has `strategy="lazyOnload"` attribute
- Test: Script element has a unique `id` attribute containing the feedId
- Test: Applies optional className to the container div
- Test: Container div renders without className when prop is omitted

**Mocking notes**: Mock `next/script` as a simple component that renders its props (similar to existing Next.js mocking pattern in the project).

---

## 5. Section: SocialFeedSection Component

**Test file**: `__tests__/components/ui/SocialFeedSection.test.tsx`

### Tests to Write Before Implementing

- Test: Renders fallback social links when not in viewport (initial state)
- Test: Fallback contains links to Facebook, Instagram, and YouTube profiles
- Test: Fallback links use URLs from SOCIAL_URLS constants
- Test: All fallback links have `target="_blank"` and `rel="noopener noreferrer"`
- Test: All fallback links have descriptive `aria-label` attributes
- Test: When in viewport, renders the CuratorFeed component (mock intersection observer to simulate inView)
- Test: Applies optional className to root element

**Mocking notes**: Mock `react-intersection-observer` to control `inView` state. Mock `CuratorFeed` via `next/dynamic` to avoid loading the actual Curator.io script. Mock `SOCIAL_URLS` and `CURATOR_CONFIG` from constants.

---

## 6. Section: SocialFollowBanner Component

**Test file**: `__tests__/components/ui/SocialFollowBanner.test.tsx`

### Tests to Write Before Implementing

- Test: Renders a section element with appropriate heading
- Test: Contains "Follow PC Boosters" heading text (or similar)
- Test: Renders links for Facebook, Instagram, and YouTube
- Test: Links use correct URLs from SOCIAL_URLS
- Test: All links have `target="_blank"` and `rel="noopener noreferrer"`
- Test: All links have accessible `aria-label` attributes
- Test: Renders social media icons (lucide-react)

---

## 7. Section: Footer Modification

**Test file**: `__tests__/components/layout/Footer.test.tsx` (modify existing)

### Tests to Write Before Implementing

- Test: Footer renders Instagram link with correct URL
- Test: Footer renders YouTube link with correct URL
- Test: Footer social links have `target="_blank"` and `rel="noopener noreferrer"`
- Test: Footer social links have accessible `aria-label` attributes

**Note**: The existing Footer test file likely already tests for the Facebook link. Add tests for the new Instagram and YouTube links.

---

## 8. Section: News Page Redesign

**Test file**: `__tests__/app/news/page.test.tsx` (modify existing)

### Tests to Write Before Implementing

- Test: News page renders SocialFeedSection component
- Test: News page does NOT render FacebookFeed component
- Test: News page does NOT render "Upcoming Events" section or event cards
- Test: News page renders SocialFollowBanner component
- Test: News page renders hero section with appropriate heading
- Test: SocialFeedSection receives correct feedId from CURATOR_CONFIG

**Mocking notes**: Mock `SocialFeedSection` and `SocialFollowBanner` as simple components to isolate page-level testing. Verify they are rendered with correct props.

---

## 9. Section: Homepage Modification

**Test file**: `__tests__/app/home/page.test.tsx` or `__tests__/app/page.test.tsx` (modify existing)

### Tests to Write Before Implementing

- Test: Homepage renders SocialFeedSection component (in "Live From the Field" section)
- Test: Homepage does NOT render FacebookFeed component
- Test: SocialFeedSection receives correct feedId from CURATOR_CONFIG
- Test: All other homepage sections remain unchanged (Hero, ImpactStats, ActionCards, etc.)

**Mocking notes**: Mock `SocialFeedSection` to verify it's rendered. Existing mocks for other homepage components should remain unchanged.

---

## 10. Section: Cleanup

### Tests to Write Before Implementing

- Test: No imports of `FacebookFeed` exist anywhere in the codebase (verify via grep/search, not a unit test)
- Test: `components/ui/FacebookFeed.tsx` file does not exist
- Test: Build completes without errors after deletion (`npm run build`)
- Test: All existing tests pass after deletion (`npm run test`)

**Note**: These are verification steps rather than traditional unit tests. Run them as part of the cleanup validation.

---

## 11. Section: Install Dependencies

### Tests to Write Before Implementing

- Test: `react-intersection-observer` is listed in `package.json` dependencies
- Test: `npm run build` succeeds with the new dependency

**Note**: These are build verification checks, not unit tests.

---

## 12. Integration Tests

**Test file**: `__tests__/integration/social-feed.test.tsx` (new)

### Tests to Write After All Components Are Built

- Test: News page integrates SocialFeedSection with correct Curator.io configuration
- Test: Homepage integrates SocialFeedSection with correct Curator.io configuration
- Test: Footer contains all three social media links (Facebook, Instagram, YouTube)
- Test: All social URLs across all components are consistent (pulled from same constants)
- Test: SocialFollowBanner renders on News page
