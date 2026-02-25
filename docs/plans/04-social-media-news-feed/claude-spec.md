# Complete Specification: Social Media & News Feed Integration

## 1. Overview

Replace the existing Facebook iframe embed (`FacebookFeed.tsx`) across the PC Athletic Boosters website with a Curator.io aggregated social media feed widget. The widget pulls content from Facebook, Instagram, and YouTube into a unified waterfall (masonry) layout. The News page is simplified to focus on the social feed as its primary content (removing hardcoded event cards). Social follow links are added to the Footer and as a dedicated banner-style CTA section.

## 2. Background

### Current State
- The website uses a `FacebookFeed.tsx` client component that renders a Facebook Page Plugin iframe on both the homepage ("Live From the Field" section) and the News page ("Latest Updates" section)
- The News page also has hardcoded "Upcoming Events" cards
- The site has no Instagram, YouTube, or other social media integration
- The booster club currently has NO social media presence beyond a Facebook page

### Target State
- Curator.io widget replaces the Facebook iframe on both pages
- Aggregated feed from 3 sources: Facebook Page + Instagram + YouTube
- Waterfall (Pinterest-style masonry) layout for visual, mixed-content display
- News page streamlined to focus on the social feed
- Social follow links in Footer and a dedicated banner CTA
- Zero impact on initial page load (lazy-loaded, SSR-disabled)

## 3. Technical Decisions

### Widget: Curator.io Free Plan
- **3 sources**: Facebook Page, Instagram (Business account), YouTube
- **Layout**: Waterfall (masonry grid)
- **Limits**: 2,000 page views/month, 24-hour content refresh
- **Embed method**: Direct JS injection (no iframe), full CSS customization
- **Branding**: Small text at bottom of feed (acceptable for free tier)

### Architecture
```
Page (Server Component)
  --> SocialFeedSection (Client Component, "use client")
        uses react-intersection-observer for viewport detection
        conditionally renders:
          --> CuratorFeed (next/dynamic import, ssr: false)
                uses next/script with strategy="lazyOnload"
                renders <div data-crt-feed-id={feedId} />
                loads published feed script from Curator.io CDN
        fallback:
          --> SocialFallbackLinks (direct links to FB/IG/YT profiles)
```

### Performance Requirements
- Use `next/script` with `strategy="lazyOnload"` -- defers until browser idle
- Use `next/dynamic` with `{ ssr: false }` -- prevents hydration mismatches
- Use `react-intersection-observer` with `triggerOnce: true` and `rootMargin: '200px 0px'` -- loads only when near viewport
- Reserve explicit height on container to prevent CLS (Cumulative Layout Shift)
- Feed must NOT impact initial page load metrics (LCP, FCP, TBT)

### New Dependency
- `react-intersection-observer` -- lightweight IntersectionObserver hook for React

## 4. Component Design

### 4.1 CuratorFeed Component
**Path**: `components/ui/CuratorFeed.tsx`
**Type**: Client component (`"use client"`)
**Props**:
- `feedId: string` -- Curator.io published feed ID
- `className?: string` -- Optional styling override

**Behavior**:
- Renders a container `div` with `data-crt-feed-id` attribute
- Loads the published Curator.io script via `next/script` with `strategy="lazyOnload"`
- Provides unique `id` on the Script element to prevent duplicate loading

### 4.2 SocialFeedSection Component
**Path**: `components/ui/SocialFeedSection.tsx`
**Type**: Client component (`"use client"`)
**Props**:
- `feedId: string` -- Curator.io feed ID
- `className?: string` -- Optional styling override

**Behavior**:
- Uses `react-intersection-observer` to detect when section is near viewport
- Dynamically imports `CuratorFeed` with `next/dynamic` + `{ ssr: false }`
- Shows fallback content (direct social profile links) until feed loads
- If feed fails or takes too long, the fallback links remain visible and useful

### 4.3 SocialFollowBanner Component
**Path**: `components/ui/SocialFollowBanner.tsx`
**Type**: Server component (no interactivity needed)
**Design**: Horizontal banner with brand colors, "Follow PC Boosters" message, and icon links to Facebook, Instagram, YouTube
**Placement**: On News page and optionally homepage

### 4.4 Footer Social Icons
**Modification to**: `components/layout/Footer.tsx`
**Change**: Add Facebook, Instagram, YouTube icon links to the "Connect" column
**Icons**: Use `lucide-react` (Facebook, Instagram, Youtube icons)

## 5. Page Modifications

### 5.1 News Page (`app/news/page.tsx`)
**Changes**:
1. Remove the existing `FacebookFeed` import and usage
2. Remove the "Upcoming Events" section entirely (hardcoded event cards)
3. Replace "Latest Updates" section with `SocialFeedSection` component
4. Add `SocialFollowBanner` component below the feed
5. Keep the dark hero section (title/subtitle may need updated copy)

**Resulting structure**:
1. Hero section (dark bg, updated title/subtitle)
2. Social Feed section (Curator.io waterfall)
3. Social Follow Banner ("Follow PC Boosters")

### 5.2 Homepage (`app/page.tsx`)
**Changes**:
1. Replace the "Live From the Field" section's `FacebookFeed` with `SocialFeedSection`
2. Update section heading/subtitle copy if needed
3. Keep all other homepage sections unchanged

### 5.3 Footer (`components/layout/Footer.tsx`)
**Changes**:
1. Add social media icon links (Facebook, Instagram, YouTube) to the "Connect" column
2. Use lucide-react icons for consistency with rest of site

## 6. Configuration

### New Constants (in `lib/constants.ts`)
```
SOCIAL_URLS:
  facebook: URL to Facebook Page
  instagram: URL to Instagram profile
  youtube: URL to YouTube channel

CURATOR_CONFIG:
  feedId: Published feed ID from Curator.io dashboard
```

### Environment/Build Notes
- No environment variables needed -- Curator.io feed ID is public (published script URL)
- No API keys -- free tier uses published feed script
- Static export compatible -- all client-side JS, no server requirements

## 7. Files to Create

| File | Type | Purpose |
|------|------|---------|
| `components/ui/CuratorFeed.tsx` | Client component | Core Curator.io widget wrapper |
| `components/ui/SocialFeedSection.tsx` | Client component | Viewport-triggered feed loader with fallback |
| `components/ui/SocialFollowBanner.tsx` | Server component | Banner CTA with social follow links |

## 8. Files to Modify

| File | Change |
|------|--------|
| `app/news/page.tsx` | Replace FacebookFeed, remove events, add SocialFeedSection + SocialFollowBanner |
| `app/page.tsx` | Replace FacebookFeed in "Live From the Field" with SocialFeedSection |
| `components/layout/Footer.tsx` | Add social media icon links to Connect column |
| `lib/constants.ts` | Add SOCIAL_URLS and CURATOR_CONFIG constants |
| `package.json` | Add `react-intersection-observer` dependency |

## 9. Files to Delete/Deprecate

| File | Action |
|------|--------|
| `components/ui/FacebookFeed.tsx` | Delete -- replaced by CuratorFeed |

## 10. Testing Strategy

### Unit Tests
- `CuratorFeed`: Renders container div with correct `data-crt-feed-id`, renders Script with correct src and strategy
- `SocialFeedSection`: Renders fallback links initially, shows feed when in view (mock intersection observer)
- `SocialFollowBanner`: Renders all social links with correct URLs, links open in new tab
- Footer: Social icons present with correct hrefs

### Integration Tests
- News page renders SocialFeedSection instead of FacebookFeed
- Homepage renders SocialFeedSection in "Live From the Field"
- News page does NOT render events section
- All social URLs use constants from `lib/constants.ts`

### Performance Tests (manual)
- Verify feed script does not load on initial page render (check Network tab)
- Verify no hydration warnings in console
- Verify CLS is minimal (explicit container height)

## 11. Constraints

- **Curator.io free tier**: 3 sources, 2,000 page views/month, 24-hour refresh
- **Instagram requirement**: Must be Business or Creator account (free to convert)
- **Static export**: All components must be client-side only; no server-side rendering for the feed
- **Curator.io account needed**: Must create account and configure feed before the feedId is available -- development can use a placeholder ID
- **No Curator.io Next.js docs**: Official React example is outdated class-based; our implementation modernizes it

## 12. Out of Scope

- Creating actual Facebook/Instagram/YouTube accounts (separate task)
- Canva for Nonprofits setup (separate task)
- Meta Business Suite configuration (separate task)
- Content calendar/posting workflow (documentation task)
- RSS feed integration (deferred)
- Curator.io moderation setup (done in Curator.io dashboard, not in code)
