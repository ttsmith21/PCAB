# Split 04: Social Media & News Feed

> **Priority:** P1 (Supporting -- enhances digital presence)
> **Effort:** Medium (2-3 sessions)
> **Dependencies:** 01-brand-color-scheme (for consistent branding in social accounts and feed styling)
> **Blocks:** None

---

## Objective

Establish the PC Athletic Boosters' social media presence from scratch and embed live social content feeds on the website, making the site a dynamic hub rather than a static brochure.

## Background

### The Problem (from interview)
- The booster club has NO social media presence -- no Facebook page, no Instagram, nothing
- Less people are using Facebook, but it's still the primary way PC parents engage
- Youth sports pages are fragmented and change hands constantly
- The site needs live content to stay relevant and drive repeat visits

### The Vision
The booster website becomes the one place to follow for ALL PC athletics announcements. Social media feeds aggregate content from the booster accounts plus potentially youth league pages, creating a unified content stream.

## Tech Stack (decided in interview)

| Component | Tool | Cost |
|-----------|------|------|
| Design & scheduling | **Canva for Nonprofits** | $0 (free Pro for 501(c)(3)) |
| FB/IG management | **Meta Business Suite** | $0 |
| Social feed widget | **Curator.io** (free plan) | $0 (3 sources, 2K views/mo) |
| **Total** | | **$0/yr** |

## Requirements

### Social Account Creation
- [ ] Create Facebook Page for PC Athletic Boosters
- [ ] Create Instagram account for PC Athletic Boosters
- [ ] Evaluate: X/Twitter account? TikTok? (or defer to future)
- [ ] Apply branding: PCHS colors (#CC0033, #111111), logo, cover photos
- [ ] Link Facebook Page to Instagram via Meta Business Suite

### Canva for Nonprofits
- [ ] Apply at https://www.canva.com/canva-for-nonprofits/ (requires 501(c)(3) verification)
- [ ] Set up Brand Kit: PCHS colors, logo, fonts (Inter, Oswald)
- [ ] Create initial templates: announcement post, game day, spirit wear promo, volunteer call
- [ ] Configure scheduling to Facebook + Instagram
- [ ] Add board members as team users (up to 50)

### Meta Business Suite
- [ ] Link Facebook Page and Instagram to Meta Business Suite
- [ ] Configure team roles/permissions for board members
- [ ] Set up unified inbox for FB + IG messages
- [ ] Test scheduling a post

### Curator.io Feed Integration
- [ ] Create Curator.io account (free plan)
- [ ] Connect 3 sources: Facebook Page + Instagram + one more (X? RSS?)
- [ ] Choose layout (grid, waterfall, carousel, or list)
- [ ] Customize CSS to match site branding (#CC0033 accents, dark text)
- [ ] Set up moderation (auto-filter profanity, manual approve/reject)

### Site Integration
- [ ] Build social feed component using `next/script` with `strategy="lazyOnload"`
- [ ] Place feed on News page (primary location)
- [ ] Evaluate: homepage section for feed? (below fold)
- [ ] Add social media follow links (header, footer, or dedicated section)
- [ ] Performance: ensure all widgets are lazy-loaded, don't impact initial page load
- [ ] Mobile-responsive feed display

### RSS Feeds (Optional/Evaluate)
- [ ] Evaluate RSS feeds from Port Clinton News Herald, Sandusky Register sports sections
- [ ] If available: embed via RSS.app or RSS Dog (both free)
- [ ] If not: skip -- social media feed is sufficient

### Documentation
- [ ] Social media posting workflow: design in Canva -> schedule via Canva or Meta Business Suite
- [ ] Content calendar template (what to post, how often)
- [ ] Account credentials and admin access handoff guide
- [ ] Curator.io moderation guide

## Decisions Needed During Planning

1. **Which social platforms to launch on:** Facebook + Instagram are clear. X/Twitter? TikTok? Or start with just FB+IG?
2. **Feed placement:** News page only? Or also a homepage section?
3. **Curator.io layout:** Grid (most common), waterfall (Pinterest-style), carousel (compact), or list (blog-style)?
4. **Third Curator.io source:** X/Twitter feed? RSS from local news? YouTube?
5. **Content strategy:** What types of posts? How often? Who on the board posts?
6. **News page redesign:** Does the current News page accommodate a social feed, or does it need restructuring?

## Technical Integration Details

### Curator.io Embed (from research, Section 7.6)

```tsx
// Recommended approach: next/script with lazyOnload
import Script from "next/script";

export default function SocialFeed() {
  return (
    <>
      <div id="curator-feed-default-feed-layout" />
      <Script
        src="https://cdn.curator.io/published/XXXXXXX.js"
        strategy="lazyOnload"
      />
    </>
  );
}
```

### Performance (from research, Section 7.7)
- Lazy-loaded widget: ~0.5-1.5 seconds for its section, does NOT impact initial page load
- Must use `strategy="lazyOnload"` or Intersection Observer
- Place feed below the fold on any page
- Isolate in its own client component (`"use client"`) to avoid hydration conflicts

### Platform Deprecations (from research, Section 7.1)
- **Instagram Basic Display API:** Dead since Dec 2024. Must use Professional/Business Instagram account (free to convert).
- **Facebook Like/Comment buttons:** Discontinued Feb 2026. But **Facebook Page Plugin still works**.

## Key Files (likely to modify)

- `app/news/page.tsx` -- primary feed location
- New component: `components/SocialFeed.tsx` or similar
- `components/layout/Footer.tsx` -- social follow links
- Potentially `app/page.tsx` (homepage) if adding a feed section

## Constraints

- **Free Curator.io limits:** 3 sources, 2,000 page views/month. Sufficient for a local booster club. If exceeded, upgrade to $25/mo.
- **Instagram requires Professional account:** Free to convert. Must be Business or Creator account for API access.
- **Canva for Nonprofits approval:** May take days/weeks for 501(c)(3) verification. Apply early.
- **No backend:** All widget embeds are client-side JavaScript. Must use `"use client"` in Next.js App Router.
