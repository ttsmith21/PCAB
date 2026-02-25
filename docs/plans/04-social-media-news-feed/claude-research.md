# Research Findings: Social Media & News Feed

## Part 1: Codebase Analysis

### Project Overview

**Project**: Port Clinton Athletic Boosters Website
**Framework**: Next.js 16.1.6 with App Router
**React Version**: 19.2.3
**Deployment**: Static export (`output: "export"` in next.config)
**Purpose**: Community organization website for athletic boosters - fundraising, membership, volunteer coordination, and news

### Project Structure

```
/app                     - Next.js App Router pages
/components              - React components (organized by domain)
/lib                     - Utilities, constants, data
/__tests__              - Vitest test suite
/public                 - Static assets
/docs                   - Documentation
```

**App Router Pages:**
```
app/
├── layout.tsx           - Root layout with Navbar, Footer
├── page.tsx             - Homepage
├── about/
├── initiatives/
├── join/
├── membership/
├── news/
├── resources/
├── sponsors/
├── store/
├── volunteer/
├── youth/
└── payment/thanks/
```

**Component Organization:**
- `/components/home/` - Homepage sections (Hero, ImpactStats, ActionCards, InitiativePreview, SponsorShowcase)
- `/components/layout/` - Global layout (Navbar, Footer, MobileMenu)
- `/components/ui/` - Reusable UI components (Card, Button, FadeIn, AnimatedCounter, etc.)

### Client vs Server Component Patterns

- **Server Components (Default)**: Layout, pages, most components
- **Client Components (`"use client"`)**: FadeIn.tsx, FacebookFeed.tsx, Navbar.tsx, MobileMenu.tsx, AnimatedCounter.tsx, InitiativePreview.tsx, SignupForm.tsx

### Styling & Branding

- **Tailwind CSS v4** with PostCSS
- **Fonts**: Inter (body), Oswald (headers)
- **Brand Colors**:
  - `--color-pc-red: #CC0033` (Primary)
  - `--color-pc-red-dark: #A30B2B` (Hover)
  - `--color-pc-red-light: #FEF2F2` (Light bg)
  - `--color-pc-dark: #111111` (Dark)
  - `--color-pc-gray: #6B7280` (Neutral)
  - `--shadow-glow: 0 0 20px rgba(204, 0, 51, 0.6)` (Glow effect)

### Existing Social/External Integrations

**FacebookFeed.tsx** (Client Component):
- Embeds Facebook page timeline via iframe
- Configurable width/height (defaults 500x600)
- Uses `SITE_CONFIG.facebookPageUrl`
- Sandbox attributes for security

**Stripe Integration**:
- `StripeBuyButton.tsx` - External third-party component
- Hardcoded payment URLs in constants

**Mailchimp Integration**:
- `SignupForm.tsx` - Direct POST to Mailchimp endpoint

### Reusable UI Components

- **Button.tsx** - Primary/secondary/outline variants with glow effects
- **Card.tsx** - White bg, rounded corners, optional hover lift
- **FadeIn.tsx** - Framer Motion entrance animations (direction, delay, viewport trigger)
- **SectionHeading.tsx** - Reusable title/subtitle pair
- **AnimatedCounter.tsx** - IntersectionObserver-triggered counting animation

### Dependencies

**Core**: next 16.1.6, react 19.2.3, framer-motion 12.34.3, lucide-react 0.575.0
**Dev**: tailwindcss 4, vitest 4.0.18, @testing-library/react 16.3.2, jsdom 28.1.0, typescript 5

### Testing Setup

- **Vitest** 4.0.18 with jsdom environment
- **@testing-library/react** for component rendering
- **Patterns**: Mock Next.js Link/Image globally, mock child components, test accessibility/links
- **Structure**: `__tests__/app/*/page.test.tsx`, `__tests__/components/*/Component.test.tsx`, `__tests__/integration/`

### Key Pages for Integration

**Homepage (app/page.tsx)**: Hero > ImpactStats > ActionCards > InitiativePreview > "Stay Connected" > SponsorShowcase > "Live From the Field" with FacebookFeed

**News Page (app/news/page.tsx)**: Dark hero > "Latest Updates" with FacebookFeed > "Upcoming Events" with event cards

### Established Patterns for Widget Integration

**Section Pattern:**
```tsx
<section className="py-20 bg-gray-50">
  <div className="container mx-auto px-4">
    <FadeIn>
      <SectionHeading title="..." subtitle="..." />
      {/* content */}
    </FadeIn>
  </div>
</section>
```

**Card Grid Pattern:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
  {items.map((item, index) => (
    <FadeIn key={item.id} delay={index * 0.1}>
      <Card>{/* content */}</Card>
    </FadeIn>
  ))}
</div>
```

### Build Configuration

- Static export (no server needed)
- Images unoptimized for static export
- Scripts: `npm run dev`, `npm run build`, `npm run test` (vitest run)

---

## Part 2: Web Research Findings

### 2.1 Curator.io Next.js Integration

**How Curator.io Embeds Work:**
- Does NOT use iframes -- injects content as JS/HTML/CSS directly into DOM
- Two approaches:
  - **Published Feed Script**: Load `https://cdn.curator.io/published/{FEED_ID}.js` into container with `data-crt-feed-id`
  - **Generic CDN + Manual Init**: Load `curator.embed.js` v6.0 and initialize with `new Curator.Widgets.Waterfall({...})`
- Widget types: Waterfall, Carousel, Grid, Panel

**Official React Example** (github.com/curatorio/react-example):
- Class-based React component (outdated)
- Uses `document.createElement('script')` in `componentDidMount`
- No cleanup logic on unmount

**Known Issues for Next.js:**
1. No official Next.js support or documentation
2. Widgets GitHub repo is archived
3. Must use `"use client"` + `useEffect` for DOM manipulation
4. No cleanup = possible duplicate script injection during navigation

**Recommended Pattern for Next.js App Router:**
```tsx
'use client';
import Script from 'next/script';

export default function CuratorFeed({ feedId }: { feedId: string }) {
  return (
    <>
      <div data-crt-feed-id={feedId} />
      <Script
        src={`https://cdn.curator.io/published/${feedId}.js`}
        strategy="lazyOnload"
        id={`curator-${feedId}`}
      />
    </>
  );
}
```

Use `onReady` (not `onLoad`) if using generic CDN approach -- `onReady` re-fires on route navigation.

### 2.2 Next.js Lazy-Loading Third-Party Scripts

**Script Loading Strategies:**

| Strategy | When | Best for |
|---|---|---|
| `beforeInteractive` | Before any Next.js code | Cookie consent, bot detection |
| `afterInteractive` (default) | After some hydration | Analytics, tag managers |
| `lazyOnload` | Browser idle time | Social widgets, chat plugins |
| `worker` (experimental) | Web worker | Non-critical analytics (Pages Router only) |

**`lazyOnload` is explicitly recommended for social widgets by Next.js docs.**

**Performance Impact** (Chrome DevRel):
- ~1 second LCP improvement in commerce app
- FCP from 0.9s to 0.4s in blog app

**Intersection Observer Pattern for Below-Fold Content:**
```tsx
'use client';
import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';

const CuratorFeed = dynamic(() => import('./CuratorFeed'), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded" />,
});

export default function SocialFeedSection() {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '200px 0px' });
  return (
    <section ref={ref}>
      {inView ? <CuratorFeed feedId="..." /> : (
        <div className="h-96 animate-pulse bg-gray-100 rounded" />
      )}
    </section>
  );
}
```

**Hydration Best Practices:**
1. Always use `"use client"` for components with `onLoad`/`onReady`/`onError`
2. Use `next/dynamic` with `{ ssr: false }` for widget wrappers
3. Never manipulate DOM during render -- use `useEffect` or `next/script` callbacks
4. Reserve space for widgets to prevent CLS

### 2.3 Social Media Feed Widget Alternatives

| Feature | Curator.io | Juicer | Taggbox | Elfsight | EmbedSocial | Flockler |
|---|---|---|---|---|---|---|
| **Free plan** | Yes | Yes | Limited | Yes (lite) | Limited | No |
| **Free sources** | 3 sources, 1 feed | 2 sources, 1 feed | Limited | Limited | 1 source | N/A |
| **Paid from** | $25/mo | $15/mo | $19/mo | $5/mo | $29/mo | $129/mo |
| **Embed method** | Direct JS (no iframe) | JS embed | JS embed | JS/iframe | JS embed | JS embed |
| **Custom CSS** | Full control | Yes | Yes | Limited | Yes | Yes |
| **Moderation** | Advanced filtering + manual | Manual only | AI-driven + manual | Basic | Manual | Manual + automated |
| **React support** | Official example (basic) | None | None | None | None | None |

**Curator.io advantages:** Best free tier branding (nearly invisible), no-iframe for full CSS control, REST API for custom UI, 3 sources sufficient for FB+IG+1.

**Juicer backup:** Most affordable paid ($15/mo), has nonprofit support page, similar embed pattern.

### 2.4 Synthesized Architecture Recommendation

```
Page (Server Component)
  --> SocialFeedSection (Client Component)
        uses react-intersection-observer useInView
        conditionally renders:
          --> CuratorFeed (dynamic import, ssr: false)
                uses next/script strategy="lazyOnload"
                renders <div data-crt-feed-id={feedId} />
                loads https://cdn.curator.io/published/{feedId}.js
```

**Key decisions:**
1. Use Curator.io free tier (3 sources: FB + IG + 1 more)
2. Use `next/script` with `strategy="lazyOnload"`
3. Wrap in viewport-triggered loader with `react-intersection-observer`
4. Use `next/dynamic` with `{ ssr: false }` to avoid hydration issues
5. Build modern functional component (not class-based)
6. Reserve explicit height on container to prevent CLS
