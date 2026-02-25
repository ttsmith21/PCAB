<!-- PROJECT_CONFIG
runtime: typescript-npm
test_command: npm test
END_PROJECT_CONFIG -->

<!-- SECTION_MANIFEST
section-01-constants-and-dependencies
section-02-curator-feed-component
section-03-social-feed-section-component
section-04-social-follow-banner-component
section-05-news-page-redesign
section-06-homepage-modification
section-07-footer-modification
section-08-cleanup-and-integration
END_MANIFEST -->

# Implementation Sections Index

## Dependency Graph

| Section | Depends On | Blocks | Parallelizable |
|---------|------------|--------|----------------|
| section-01-constants-and-dependencies | - | 02, 03, 04, 05, 06, 07 | Yes |
| section-02-curator-feed-component | 01 | 03, 05, 06 | Yes |
| section-03-social-feed-section-component | 01, 02 | 05, 06 | No |
| section-04-social-follow-banner-component | 01 | 05 | Yes |
| section-05-news-page-redesign | 03, 04 | 08 | No |
| section-06-homepage-modification | 03 | 08 | Yes |
| section-07-footer-modification | 01 | 08 | Yes |
| section-08-cleanup-and-integration | 05, 06, 07 | - | No |

## Execution Order

1. section-01-constants-and-dependencies (no dependencies)
2. section-02-curator-feed-component, section-04-social-follow-banner-component (parallel after 01)
3. section-03-social-feed-section-component (after 01 and 02)
4. section-05-news-page-redesign, section-06-homepage-modification, section-07-footer-modification (parallel after 03/04)
5. section-08-cleanup-and-integration (final, after 05, 06, 07)

## Section Summaries

### section-01-constants-and-dependencies
Add `SOCIAL_URLS` and `CURATOR_CONFIG` constants to `lib/constants.ts`. Install `react-intersection-observer` dependency. Write tests for the new constants.

### section-02-curator-feed-component
Create `components/ui/CuratorFeed.tsx` -- a client component wrapping the Curator.io embed. Uses `next/script` with `strategy="lazyOnload"` and a container `div` with `data-crt-feed-id`. Write unit tests.

### section-03-social-feed-section-component
Create `components/ui/SocialFeedSection.tsx` -- a client component using `react-intersection-observer` for viewport detection, `next/dynamic` with `{ ssr: false }` to import CuratorFeed, and fallback content showing direct social profile links. Write unit tests.

### section-04-social-follow-banner-component
Create `components/ui/SocialFollowBanner.tsx` -- a server component rendering a horizontal banner CTA with "Follow PC Boosters" heading and social icon links (Facebook, Instagram, YouTube using lucide-react). Write unit tests.

### section-05-news-page-redesign
Modify `app/news/page.tsx` to replace `FacebookFeed` with `SocialFeedSection`, remove the "Upcoming Events" section, add `SocialFollowBanner`, and update hero copy. Update existing page tests.

### section-06-homepage-modification
Modify `app/page.tsx` to replace `FacebookFeed` in the "Live From the Field" section with `SocialFeedSection`. Update existing page tests.

### section-07-footer-modification
Modify `components/layout/Footer.tsx` to add Instagram and YouTube icon links alongside the existing Facebook link in the "Connect" column. Update existing Footer tests.

### section-08-cleanup-and-integration
Delete `components/ui/FacebookFeed.tsx` and its test file. Verify no remaining imports. Write integration tests in `__tests__/integration/social-feed.test.tsx`. Run full build and test suite to confirm everything works.
