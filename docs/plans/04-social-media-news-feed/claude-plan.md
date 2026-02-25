# Implementation Plan: Social Media & News Feed Integration

## 1. Context & Goals

The PC Athletic Boosters website currently embeds a Facebook Page Plugin iframe (`FacebookFeed.tsx`) on the homepage and News page. This provides a single-source view of the club's Facebook content. The goal is to replace this with a Curator.io aggregated social media feed that pulls content from Facebook, Instagram, and YouTube into a unified waterfall (masonry) display -- making the site a dynamic content hub rather than a static brochure.

**Key outcomes:**
- Replace `FacebookFeed.tsx` with a Curator.io-powered `CuratorFeed` component on both the homepage and News page
- Simplify the News page by removing hardcoded event cards, letting the social feed be the primary content
- Add social follow links (Facebook, Instagram, YouTube) to the Footer and a dedicated banner-style CTA section
- Ensure zero impact on initial page load through lazy loading and SSR exclusion

**Tech stack decisions:**
- **Curator.io free plan** (3 sources, 2K views/month, waterfall layout)
- **Sources**: Facebook Page + Instagram (Business) + YouTube
- **New dependency**: `react-intersection-observer` for viewport-triggered loading

---

## 2. Architecture

### Component Hierarchy

```
Server Component (Page)
  └── SocialFeedSection ("use client")
        ├── Uses react-intersection-observer (useInView)
        ├── Before viewport: renders SocialFallbackLinks
        └── In viewport: dynamically imports CuratorFeed (next/dynamic, ssr: false)
              ├── Renders <div data-crt-feed-id={feedId} />
              └── Loads Curator.io script via next/script (strategy="lazyOnload")
```

### Why This Architecture

1. **No SSR for the widget**: Curator.io injects HTML/CSS/JS directly into the DOM. This cannot run during server-side rendering. Using `next/dynamic` with `{ ssr: false }` isolates the widget to client-only execution.

2. **Viewport-triggered loading**: The feed is typically below the fold on both pages. Using `react-intersection-observer` with `triggerOnce: true` and `rootMargin: '200px 0px'` starts loading 200px before the section scrolls into view. This prevents the ~1MB Curator.io script from loading on pages where the user never scrolls down.

3. **`lazyOnload` strategy**: `next/script` with `strategy="lazyOnload"` defers the script until browser idle time, protecting LCP and FCP metrics.

4. **Meaningful fallback**: Instead of a skeleton shimmer, the fallback shows direct links to the social profiles. This is useful content even if the feed never loads (e.g., if the free tier's 2K view limit is exceeded).

### File Map

**New files:**
```
components/
  ui/
    CuratorFeed.tsx          # Core widget wrapper (client component)
    SocialFeedSection.tsx    # Viewport-triggered feed loader (client component)
    SocialFollowBanner.tsx   # Banner CTA with follow links (server component)
```

**Modified files:**
```
app/news/page.tsx            # Replace FacebookFeed, remove events section
app/page.tsx                 # Replace FacebookFeed in "Live From the Field"
components/layout/Footer.tsx # Add social media icon links
lib/constants.ts             # Add SOCIAL_URLS and CURATOR_CONFIG
```

**Deleted files:**
```
components/ui/FacebookFeed.tsx  # Replaced by CuratorFeed
```

---

## 3. Section: Constants & Configuration

### What to Add

Add two new constant objects to `lib/constants.ts`:

**`SOCIAL_URLS`** -- Central location for all social profile URLs:
- `facebook`: Facebook Page URL (reuse existing `SITE_CONFIG.facebookPageUrl`)
- `instagram`: Instagram profile URL
- `youtube`: YouTube channel URL

**`CURATOR_CONFIG`** -- Widget configuration:
- `feedId`: The published feed ID from the Curator.io dashboard (string)

### Design Notes

- The feed ID is public (it's in the published script URL), so no environment variable is needed
- During development before the Curator.io account is created, use a placeholder string like `"placeholder"` -- the component will render the fallback links when the script fails to load
- `SOCIAL_URLS` consolidates the existing `SITE_CONFIG.facebookPageUrl` and new profile URLs into one object for consistency

---

## 4. Section: CuratorFeed Component

### Purpose

Thin wrapper around the Curator.io embed. Renders the container `div` and loads the published script.

### Interface

```tsx
interface CuratorFeedProps {
  feedId: string;
  className?: string;
}
```

### Behavior

1. Mark as `"use client"` (uses `next/script`)
2. Render a `div` with the `data-crt-feed-id` attribute set to `feedId`
3. Render a `next/script` element pointing to `https://cdn.curator.io/published/{feedId}.js`
4. Script strategy: `"lazyOnload"`
5. Script `id`: `curator-{feedId}` (prevents duplicate loading if multiple instances exist)
6. Apply `className` to the container `div` for layout control

### Why Not the Generic CDN Approach

The published feed script is simpler -- one script per feed with all configuration baked in by the Curator.io dashboard. The generic CDN approach (`curator.embed.js` + manual `new Curator.Widgets.Waterfall(...)`) offers more control but requires managing the `onReady` lifecycle and global `window.Curator` object. For this project, the published script approach is sufficient and less error-prone.

---

## 5. Section: SocialFeedSection Component

### Purpose

Orchestrates viewport detection, dynamic import, and fallback rendering. This is the component that pages import.

### Interface

```tsx
interface SocialFeedSectionProps {
  feedId: string;
  className?: string;
}
```

### Behavior

1. Mark as `"use client"` (uses hooks and dynamic import)
2. Use `react-intersection-observer`'s `useInView` hook:
   - `triggerOnce: true` -- load once, don't unload
   - `rootMargin: '200px 0px'` -- start loading 200px before visible
3. When NOT in view: render fallback content (see below)
4. When in view: render `CuratorFeed` via `next/dynamic` with `{ ssr: false }`
5. The dynamic import includes a `loading` component that also shows the fallback

### Fallback Content

The fallback is not a skeleton/shimmer. It's a styled block with:
- A brief message: "Follow us on social media for the latest updates"
- Icon links to Facebook, Instagram, and YouTube (pulled from `SOCIAL_URLS`)
- Uses `lucide-react` icons for consistency
- Styled to match the site's brand (pc-red accents, Inter/Oswald fonts)

This fallback serves double duty: it's the loading state AND the error state. If Curator.io fails to load (network error, free tier limit exceeded), the user still sees useful links.

### Container Sizing

The container `div` should have a minimum height (`min-h-[400px]` or similar) to prevent CLS when the feed loads and injects content. The exact height can be tuned after seeing the feed in action.

---

## 6. Section: SocialFollowBanner Component

### Purpose

A horizontal banner CTA encouraging visitors to follow the boosters on social media. Placed on the News page below the feed and optionally on the homepage.

### Design

- Full-width section with `bg-pc-dark` or `bg-pc-red` background
- Centered content with "Follow PC Boosters" heading (Oswald font, uppercase)
- Brief tagline: "Stay connected with game day updates, highlights, and announcements"
- Row of social icon buttons (Facebook, Instagram, YouTube) using `lucide-react`
- Each icon links to the corresponding URL from `SOCIAL_URLS`
- Links open in new tab (`target="_blank"`, `rel="noopener noreferrer"`)
- Icons should have hover effects consistent with the site's patterns (scale, opacity, or glow)

### Server Component

This component has no interactivity -- it's static links and text. It can be a server component (no `"use client"` needed), which keeps it out of the client JS bundle.

### Accessibility

- Each social link needs an `aria-label` (e.g., "Follow us on Facebook")
- Icons are decorative, but the link needs accessible text
- Use semantic HTML: `<section>` with appropriate heading level

---

## 7. Section: Footer Modification

### Current State

The Footer's "Connect" column currently has links for:
- Facebook (links to `COMMUNITY_URLS.facebook`)
- Community Group (links to `COMMUNITY_URLS.facebookGroup`)
- Join the Club (internal link)
- Contact Us (mailto)
- Manage Billing
- Email Preferences

### Changes

1. Add Instagram and YouTube icon links alongside the existing Facebook link
2. Use `lucide-react` icons (Facebook, Instagram, Youtube) placed before the text labels
3. Use URLs from the new `SOCIAL_URLS` constant (which consolidates with the existing `COMMUNITY_URLS.facebook`)
4. Links open in new tab with `rel="noopener noreferrer"`

### Design Consistency

The existing Footer links are plain text in `text-gray-400` with `hover:text-white` transitions. The social links should follow this same pattern -- they're not special icon buttons, just regular links with an icon prefix.

---

## 8. Section: News Page Redesign

### Current Structure
1. Dark hero section (title: "News & Events", subtitle about latest updates)
2. "Latest Updates" section with `FacebookFeed` component
3. "Upcoming Events" section with 3 hardcoded event cards

### New Structure
1. Dark hero section (updated copy -- remove "Events" from title since events section is being removed, or keep if appropriate)
2. Social feed section using `SocialFeedSection` component
3. `SocialFollowBanner` component

### Changes

1. **Remove** the `FacebookFeed` import and component usage
2. **Remove** the entire "Upcoming Events" section (the `events` array, the grid, the event cards)
3. **Replace** the "Latest Updates" section content with `<SocialFeedSection feedId={CURATOR_CONFIG.feedId} />`
4. **Add** `<SocialFollowBanner />` below the feed section
5. **Update** the hero title/subtitle to reflect the new content focus (e.g., "Latest Updates" or "News & Social")
6. **Update** section headings -- the "Latest Updates" `SectionHeading` should have updated subtitle text reflecting aggregated social content

### Layout Notes

The `SocialFeedSection` should be wrapped in the standard section pattern used throughout the site:
```
<section className="py-20 bg-white">
  <div className="container mx-auto px-4">
    <FadeIn>
      <SectionHeading title="..." subtitle="..." />
      <SocialFeedSection ... />
    </FadeIn>
  </div>
</section>
```

---

## 9. Section: Homepage Modification

### Current Structure

The homepage has a "Live From the Field" section near the bottom that contains:
- A `SectionHeading` with title "Live From the Field" and a subtitle
- A `FacebookFeed` component wrapped in a container

### Changes

1. **Replace** `FacebookFeed` with `<SocialFeedSection feedId={CURATOR_CONFIG.feedId} />`
2. **Remove** the `FacebookFeed` import
3. **Keep** the section heading and overall structure
4. **Optionally update** the subtitle to mention the aggregated feed (Facebook, Instagram, YouTube)

### Minimal Change

This is a surgical replacement -- swap one component for another within the existing section structure. No layout redesign needed.

---

## 10. Section: Cleanup

### Delete FacebookFeed

After replacing all usages on the News page and homepage:
1. Delete `components/ui/FacebookFeed.tsx`
2. Remove any test files for `FacebookFeed` (check `__tests__/components/ui/FacebookFeed.test.tsx`)
3. Verify no other files import `FacebookFeed` (grep for it)

### Update SITE_CONFIG

If `SITE_CONFIG.facebookPageUrl` is only used by `FacebookFeed.tsx`, consider whether to keep it or move it to `SOCIAL_URLS.facebook`. If other components reference it, keep both with a note.

---

## 11. Section: Install Dependencies

### New Package

Install `react-intersection-observer`:
- Lightweight (~2KB gzipped)
- Provides `useInView` hook for viewport detection
- Well-maintained, widely used in React/Next.js projects

### No Other Dependencies

- `next/script` and `next/dynamic` are built into Next.js
- `lucide-react` is already installed (for social icons)
- No Curator.io npm package needed -- it's loaded via CDN script

---

## 12. Edge Cases & Error Handling

### Curator.io Script Fails to Load
- The `SocialFeedSection` fallback (direct social links) remains visible
- No error boundary needed -- the dynamic import's `loading` component handles this naturally
- The feed container `div` stays empty; the fallback links provide utility

### Free Tier View Limit Exceeded
- Curator.io may stop serving the script or show a "limit exceeded" message
- The fallback links ensure the section is never completely empty
- Monitor via Curator.io dashboard; upgrade to $25/mo if consistently hitting limits

### Curator.io Account Not Yet Created
- During development, use a placeholder `feedId`
- The script will 404, and the fallback links will display
- This allows developing and testing the component structure before the account exists

### Static Export Compatibility
- All components are client-side only
- `next/script` with `lazyOnload` works in static exports
- `next/dynamic` with `ssr: false` works in static exports
- No server-side data fetching required

### Mobile Responsiveness
- Curator.io's waterfall layout is responsive by default
- The container should use full width on mobile (`w-full`)
- The `SocialFollowBanner` should stack icons vertically on small screens or keep them in a row with wrapping

---

## 13. Implementation Order

The recommended build sequence:

1. **Constants & config** -- Add `SOCIAL_URLS` and `CURATOR_CONFIG` to `lib/constants.ts`
2. **Install dependency** -- Add `react-intersection-observer`
3. **CuratorFeed component** -- Build the core widget wrapper
4. **SocialFeedSection component** -- Build the viewport-triggered loader with fallback
5. **SocialFollowBanner component** -- Build the banner CTA
6. **News page** -- Replace FacebookFeed, remove events, add new components
7. **Homepage** -- Replace FacebookFeed with SocialFeedSection
8. **Footer** -- Add social media icon links
9. **Cleanup** -- Delete FacebookFeed, update any remaining references
10. **Testing** -- Write unit and integration tests for all new/modified components

Each step is independently testable. Steps 3-5 (new components) can be built in parallel. Steps 6-8 (page modifications) depend on steps 3-5.
