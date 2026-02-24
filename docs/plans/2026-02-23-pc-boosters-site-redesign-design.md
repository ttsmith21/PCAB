# PC Athletic Boosters Website Redesign - Design Document

**Date:** 2026-02-23
**Status:** Approved

---

## Summary

Rebuild the Port Clinton Athletic Boosters website as a modern, content-rich, 10-page Next.js site that serves as the public-facing brand and marketing engine for the organization. BoosterHub remains the backend platform for membership processing, payments, member lists, and communication. The custom site is the "showroom" that inspires and persuades; BoosterHub is the "cash register" where transactions happen.

## Context

- **Organization:** Port Clinton Athletic Boosters, 501(c)(3) non-profit
- **Current state:** Single-page static HTML file with Tailwind CSS via CDN. Thin on content. All CTAs link to BoosterHub.
- **Prior attempt:** Tried building with Antigravity, did not succeed
- **Key differentiator:** PC lacks a parks & rec department. The boosters are working to bridge the gap between youth programs and high school athletics, serving as the connective tissue for the entire community's athletic pipeline.

## Strategic Model

**Independent Brand + BoosterHub Backend** (the "St. Edward model")

| Custom Site (Brand) | BoosterHub (Operations) |
|---|---|
| Marketing, storytelling, community building | Membership registration and payment processing |
| Compelling membership pitch and tier comparison | Member database and lists |
| Sponsor showcase and package details | Communication app (SMS/push) |
| Initiative stories and impact | Volunteer signup tracking |
| Youth & community resources | Store checkout and e-commerce |
| Visual spirit wear showcase | Donation processing |

**Handoff strategy:** Users spend time on the beautiful custom site. BoosterHub links open in new tabs for transactions only. Transitions are framed clearly (e.g., "You'll be taken to our secure member portal").

## Tech Stack

| Component | Choice | Rationale |
|---|---|---|
| Framework | Next.js 14+ (App Router, static export) | Multi-page, SEO-friendly, Vercel-native |
| Styling | Tailwind CSS v4 | Fast development, existing brand tokens |
| Animations | Framer Motion | Smooth scroll reveals and page transitions |
| Icons | Lucide React | Tree-shakeable, modern |
| Fonts | Inter (body) + Oswald (headings) | Proven pairing from current site |
| Social Feed | Facebook Page Plugin | Free, zero maintenance, auto-updates |
| Images | Next.js Image, local assets | Optimized, no external dependencies |
| Deployment | Vercel + GitHub | Auto-deploy on push, CDN-backed |

**Brand tokens:**
- PC Red: `#EF2B24`
- PC Dark: `#0f172a`
- Design direction: Modern sports brand (Nike/Under Armour energy - dynamic, bold, refined)

## Project Structure

```
pc-boosters-web/
├── app/
│   ├── layout.tsx              # Root layout (nav + footer)
│   ├── page.tsx                # Homepage
│   ├── about/page.tsx          # About Us
│   ├── membership/page.tsx     # Membership
│   ├── sponsors/page.tsx       # Sponsorship
│   ├── initiatives/page.tsx    # Initiatives
│   ├── youth/page.tsx          # Youth & Community
│   ├── volunteer/page.tsx      # Volunteer Hub
│   ├── store/page.tsx          # Store
│   ├── resources/page.tsx      # Resources
│   └── news/page.tsx           # News & Calendar
├── components/
│   ├── layout/                 # Navbar, Footer, MobileMenu
│   ├── ui/                     # Buttons, Cards, Section wrappers
│   └── home/                   # Homepage-specific sections
├── lib/
│   └── constants.ts            # BoosterHub URLs, team data, board members
├── public/
│   └── images/                 # Optimized local images
├── tailwind.config.ts
└── next.config.ts
```

## Pages

### 1. Homepage
The 30-second elevator pitch. Every section answers one question and drives one action.

1. **Navbar** - Fixed, transparent on hero, solid on scroll. Logo left, nav links center, "Donate" CTA right. Mobile hamburger.
2. **Hero** - Full-viewport, high-energy game night photo. "ONE TOWN. ONE TEAM." headline. Two CTAs: "Become a Member" + "Make a Donation".
3. **Impact Stats Bar** - Animated counters: Scholarships, Amount Raised, Sports Supported, Active Members.
4. **Three Action Cards** - Membership, Volunteer, Sponsor. Icon, pitch, CTA.
5. **Where Your Money Goes** - 3 initiative highlight cards with photos. Links to Initiatives page.
6. **Sponsor Showcase** - Tiered logo grid. Links to Sponsors page + "Become a Sponsor" CTA.
7. **Live From the Field** - Embedded Facebook Page Plugin.
8. **Footer** - Quick links, BoosterHub login, social icons, 501(c)(3) notice.

### 2. About
- Mission statement
- Our story / history
- Board of Directors (photo grid: Tyson Smith, Brennan Madison, Terry Dunn, others)
- Team Representatives (organized by sport with contact emails)
- 501(c)(3) information

### 3. Membership
- Why Join (emotional pitch with community photos)
- Tier Comparison (side-by-side cards with prices and benefits, recommended tier highlighted)
- What Members Get (detailed benefits breakdown)
- CTA: "Join Now" -> BoosterHub membership (new tab)

### 4. Sponsors
- Current Sponsors (tiered logo showcase)
- Sponsorship Packages (cards with pricing, benefits, visibility metrics)
- Why Sponsor (value proposition for local businesses)
- CTA: "Become a Sponsor" -> BoosterHub or contact form

### 5. Initiatives
- Hero: "Where Your Money Goes"
- Initiative Cards: stadium lights, weight room, scholarships, equipment fund, etc. Each with photo, description, impact, and optional funding goal
- CTA: "Support Our Initiatives" -> BoosterHub donate

### 6. Youth & Community
- The Gap: No parks & rec, fragmented youth sports, limited coordination
- Our Vision: Boosters as the connective tissue for the youth-to-varsity pipeline. "ONE TOWN. ONE TEAM." applies to the entire community.
- Youth Resources: Coaching resources, training info, youth league links, equipment programs
- Communication Hub: Central place for youth announcements and coordination
- How to Help: Volunteer coaching, equipment donations, sponsoring youth teams

### 7. Volunteer
- Why Volunteer (impact stories)
- Current Opportunities (cards: concessions, events, committees, etc.)
- Time Commitment (honest breakdown)
- CTA: "Sign Up" -> BoosterHub volunteer (new tab)

### 8. Store
- Spirit Wear Showcase (photo grid with lifestyle shots)
- CTA: "Shop Now" -> BoosterHub store (new tab)

### 9. Resources
- Documents (bylaws, meeting minutes, financial reports)
- FAQs (accordion: How to join, tax deductions, etc.)
- Contact (board contacts, general email)

### 10. News/Calendar
- Facebook Feed (full-width embedded)
- Upcoming Events (manually maintained cards or pulled from Facebook)

## Content Strategy

- **Evergreen pages** are static. Content changes require a code push.
- **Dynamic content** comes from the Facebook feed on Homepage and News pages.
- **No CMS** - the org updates social media, which automatically appears on the site.
- All BoosterHub URLs centralized in `lib/constants.ts` for easy updates.

## BoosterHub Integration Points

| User Action | Custom Site | BoosterHub |
|---|---|---|
| Join as member | Read pitch, compare tiers | Complete registration + payment |
| Donate | See impact and initiatives | Process donation |
| Become sponsor | Review packages and benefits | Submit inquiry or payment |
| Volunteer | Browse opportunities | Sign up and track |
| Shop | Browse product photos | Add to cart and checkout |
| Login | N/A (link in nav) | Member portal |

All BoosterHub links open in new tabs to preserve the brand experience.

## Design Direction

**Modern sports brand aesthetic:**
- Bold typography (Oswald headings, Inter body)
- High-contrast: dark backgrounds with PC Red accents
- Full-bleed photography and hero images
- Smooth Framer Motion animations on scroll
- Clean whitespace, intentional layout hierarchy
- Mobile-first responsive design
- Subtle hover effects on interactive elements (card lifts, button glows)

## Key Decisions

1. **No CMS** - Social media is the dynamic content engine
2. **Static export** - No server needed, CDN-backed, fast globally
3. **BoosterHub for all transactions** - Don't rebuild what already works
4. **New tab for BoosterHub** - Preserve brand experience
5. **Youth & Community page** - Differentiator that tells the bigger story
6. **10 pages total** - Comprehensive but manageable for a volunteer org
