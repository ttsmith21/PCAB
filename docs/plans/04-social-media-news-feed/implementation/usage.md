# Usage Guide: Social Media News Feed

## Quick Start

The social media news feed integration replaces the old Facebook-only iframe embed with a multi-platform social feed powered by Curator.io. The feed aggregates content from Facebook, Instagram, and YouTube into a single unified view.

### Configuration

All social media configuration lives in `lib/constants.ts`:

```ts
// Social profile URLs used in fallback links and Footer
export const SOCIAL_URLS = {
  facebook: "https://www.facebook.com/PortClintonAthleticBoosters",
  instagram: "https://www.instagram.com/portclintonathleticboosters/",
  youtube: "https://www.youtube.com/@PCAthleticBoosters",
};

// Curator.io feed configuration
export const CURATOR_CONFIG = {
  feedId: "placeholder", // Replace with real Curator.io feed ID
};
```

### Activating the Feed

1. Create a Curator.io account and configure a Waterfall feed
2. Add your Facebook, Instagram, and YouTube sources
3. Replace `"placeholder"` in `CURATOR_CONFIG.feedId` with your real feed ID
4. The feed will automatically load on the News page and Homepage

### While feedId is "placeholder"

The Curator.io script will 404, and users will see fallback content with direct links to your Facebook, Instagram, and YouTube profiles. This is intentional -- the fallback is useful content, not an error state.

## Components Created

### `CuratorFeed` (`components/ui/CuratorFeed.tsx`)
Low-level client component that renders the Curator.io embed. Not used directly by pages.

```tsx
<CuratorFeed feedId="your-feed-id" className="optional-class" />
```

### `SocialFeedSection` (`components/ui/SocialFeedSection.tsx`)
High-level client component used on pages. Handles:
- Viewport detection (loads feed only when scrolled near)
- Dynamic import with SSR disabled
- Fallback social links while loading

```tsx
<SocialFeedSection feedId={CURATOR_CONFIG.feedId} className="optional-class" />
```

### `SocialFollowBanner` (`components/ui/SocialFollowBanner.tsx`)
Server component CTA banner. No props needed.

```tsx
<SocialFollowBanner />
```

## Pages Modified

| Page | Change |
|------|--------|
| `/news` | Replaced FacebookFeed with SocialFeedSection + SocialFollowBanner. Removed Upcoming Events section. |
| `/` (Homepage) | Replaced FacebookFeed in "Live From the Field" section with SocialFeedSection. |
| Footer | Updated social links to use `SOCIAL_URLS` constant. Added `aria-label` attributes. |

## Files Deleted

| File | Reason |
|------|--------|
| `components/ui/FacebookFeed.tsx` | Replaced by CuratorFeed + SocialFeedSection |

## Test Coverage

- **108 total tests** across 21 test files
- 6 tests for CuratorFeed component
- 7 tests for SocialFeedSection component
- 7 tests for SocialFollowBanner component
- 6 tests for News page
- 4 tests for Homepage
- 9 tests for Footer (4 existing + 5 new)
- 2 cleanup verification tests (no FacebookFeed references)
- 5 integration tests (cross-page social feed consistency)

## Architecture

```
Pages (server components)
  └── SocialFeedSection (client, viewport-triggered)
        └── CuratorFeed (client, dynamic import, ssr:false)
              ├── div[data-crt-feed-id] (Curator.io injection point)
              └── Script (cdn.curator.io/published/{feedId}.js, lazyOnload)
```

Performance layers:
1. `react-intersection-observer` -- defers loading until near viewport
2. `next/dynamic` with `ssr: false` -- no server-side rendering
3. `next/script` with `strategy="lazyOnload"` -- loads during browser idle
