# PC Athletic Boosters Site Redesign - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a 10-page Next.js static site for the Port Clinton Athletic Boosters that serves as the brand/marketing engine, funneling transactions to BoosterHub.

**Architecture:** Next.js 14+ App Router with static export. Tailwind CSS v4 for styling with PC brand tokens (Red #EF2B24, Dark #0f172a). Framer Motion for scroll animations. Facebook Page Plugin for social feed. All BoosterHub URLs centralized in a constants file. Deployed to Vercel.

**Tech Stack:** Next.js 14+, React 18, TypeScript, Tailwind CSS v4, Framer Motion, Lucide React, Google Fonts (Inter + Oswald)

**Testing note:** This is a static content site with no business logic. Instead of unit tests, verification is done by running the dev server (`npm run dev`) and confirming pages render correctly. Each task includes a verification step.

**Reference:** See `docs/plans/2026-02-23-pc-boosters-site-redesign-design.md` for full design document.

---

## Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json` (via create-next-app)
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Delete: `index.html` (old static site, preserved in git history)

**Step 1: Scaffold Next.js project**

Run:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```

Note: Say "Yes" to all defaults. This initializes in the current directory. If it prompts about existing files, proceed (index.html will be handled separately).

Expected: Project scaffolded with `app/`, `public/`, `package.json`, etc.

**Step 2: Install additional dependencies**

Run:
```bash
npm install framer-motion lucide-react
```

Expected: Both packages added to `package.json`.

**Step 3: Configure next.config.ts for static export**

Replace `next.config.ts` contents with:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

**Step 4: Configure Tailwind with brand tokens**

Replace `tailwind.config.ts` with:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "pc-red": "#EF2B24",
        "pc-dark": "#0f172a",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        oswald: ["Oswald", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(239, 43, 36, 0.6)",
      },
    },
  },
  plugins: [],
};

export default config;
```

**Step 5: Set up global CSS with fonts**

Replace `app/globals.css` with:

```css
@import "tailwindcss";
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@400;500;600;700&display=swap");

@theme {
  --color-pc-red: #EF2B24;
  --color-pc-dark: #0f172a;
  --font-sans: "Inter", sans-serif;
  --font-oswald: "Oswald", sans-serif;
  --shadow-glow: 0 0 20px rgba(239, 43, 36, 0.6);
}

body {
  font-family: var(--font-sans);
  overflow-x: hidden;
}

h1, h2, h3, h4 {
  font-family: var(--font-oswald);
  text-transform: uppercase;
}

html {
  scroll-behavior: smooth;
}
```

Note: Tailwind v4 uses `@theme` directive instead of a JS config for custom values. The `tailwind.config.ts` may or may not be needed depending on the version installed. Check which version `create-next-app` installs and adapt. If Tailwind v3, use the JS config approach. If Tailwind v4, use the `@theme` approach in CSS.

**Step 6: Create minimal root layout**

Replace `app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Port Clinton Athletic Boosters",
  description:
    "Supporting Port Clinton student-athletes. One Town. One Team.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800 antialiased selection:bg-pc-red selection:text-white">
        {children}
      </body>
    </html>
  );
}
```

**Step 7: Create placeholder homepage**

Replace `app/page.tsx` with:

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-6xl font-bold text-pc-red">
        ONE TOWN. ONE TEAM.
      </h1>
    </main>
  );
}
```

**Step 8: Verify dev server runs**

Run: `npm run dev`
Open: `http://localhost:3000`
Expected: Page shows "ONE TOWN. ONE TEAM." in red (#EF2B24) Oswald font.

**Step 9: Move old index.html to archive**

```bash
mkdir -p archive
mv index.html archive/index-original.html
```

**Step 10: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js project with Tailwind and brand tokens"
```

---

## Task 2: Create Constants and Data Files

**Files:**
- Create: `lib/constants.ts`
- Create: `lib/data/board.ts`
- Create: `lib/data/team-reps.ts`
- Create: `lib/data/sponsors.ts`
- Create: `lib/data/initiatives.ts`
- Create: `lib/data/nav-links.ts`

**Step 1: Create BoosterHub URL constants**

Create `lib/constants.ts`:

```typescript
export const BOOSTERHUB_BASE = "https://pcathleticbooster.boosterhub.com";

export const BOOSTERHUB_URLS = {
  membership: `${BOOSTERHUB_BASE}/membership`,
  volunteer: `${BOOSTERHUB_BASE}/volunteer`,
  store: `${BOOSTERHUB_BASE}/store`,
  login: `${BOOSTERHUB_BASE}/login`,
  donate: `${BOOSTERHUB_BASE}/store`,
} as const;

export const SITE_CONFIG = {
  name: "Port Clinton Athletic Boosters",
  tagline: "One Town. One Team.",
  description: "Supporting Port Clinton student-athletes through community partnerships, fundraising, and volunteerism.",
  logoUrl: "/images/logo.png",
  facebookPageUrl: "https://www.facebook.com/PCathleticboosters",
  email: "info@pcathleticboosters.com",
  taxId: "TODO: Add EIN",
} as const;
```

**Step 2: Create board member data**

Create `lib/data/board.ts`:

```typescript
export interface BoardMember {
  name: string;
  role: string;
  image?: string;
  bio?: string;
}

export const boardMembers: BoardMember[] = [
  { name: "Tyson Smith", role: "President" },
  { name: "Brennan Madison", role: "Vice President" },
  { name: "Terry Dunn", role: "Treasurer" },
  // TODO: Add Secretary and other board members
];
```

**Step 3: Create team representatives data**

Create `lib/data/team-reps.ts`:

```typescript
export interface TeamRep {
  sport: string;
  name: string;
  email: string;
}

export const teamReps: TeamRep[] = [
  { sport: "Football", name: "John Doe", email: "football@example.com" },
  { sport: "Basketball (Boys)", name: "Mike Smith", email: "bball@example.com" },
  { sport: "Basketball (Girls)", name: "Jane Miller", email: "gball@example.com" },
  { sport: "Soccer", name: "Sarah Jones", email: "soccer@example.com" },
  // TODO: Add remaining sports reps with real data
];
```

**Step 4: Create sponsor data**

Create `lib/data/sponsors.ts`:

```typescript
export type SponsorTier = "gold" | "silver" | "bronze";

export interface Sponsor {
  name: string;
  tier: SponsorTier;
  logoUrl?: string;
  websiteUrl?: string;
}

export const sponsors: Sponsor[] = [
  // TODO: Replace with actual sponsor data
  { name: "Example Business 1", tier: "gold" },
  { name: "Example Business 2", tier: "gold" },
  { name: "Example Business 3", tier: "silver" },
  { name: "Example Business 4", tier: "silver" },
  { name: "Example Business 5", tier: "bronze" },
  { name: "Example Business 6", tier: "bronze" },
];

export const sponsorshipPackages = [
  {
    tier: "gold" as SponsorTier,
    name: "Gold Partner",
    price: "$1,000",
    benefits: [
      "Logo on homepage",
      "Featured at all events",
      "Social media recognition",
      "Banner at stadium",
    ],
  },
  {
    tier: "silver" as SponsorTier,
    name: "Silver Partner",
    price: "$500",
    benefits: [
      "Logo on sponsors page",
      "Event recognition",
      "Social media mention",
    ],
  },
  {
    tier: "bronze" as SponsorTier,
    name: "Bronze Partner",
    price: "$250",
    benefits: [
      "Name on sponsors page",
      "Newsletter mention",
    ],
  },
];
```

**Step 5: Create initiatives data**

Create `lib/data/initiatives.ts`:

```typescript
export interface Initiative {
  title: string;
  description: string;
  image: string;
  category: string;
}

export const initiatives: Initiative[] = [
  {
    title: "Stadium Lights",
    description: "Upgraded LED lighting for night games, ensuring safety and broadcast quality for our athletes and community.",
    image: "/images/initiatives/stadium-lights.jpg",
    category: "Facilities",
  },
  {
    title: "Weight Room Renovation",
    description: "New racks, weights, and flooring to build championship strength across all sports programs.",
    image: "/images/initiatives/weight-room.jpg",
    category: "Performance",
  },
  {
    title: "Scholarships",
    description: "Direct financial aid ensuring every student can participate in athletics regardless of family finances.",
    image: "/images/initiatives/scholarships.jpg",
    category: "Future",
  },
  // TODO: Add more initiatives (equipment fund, field maintenance, etc.)
];
```

**Step 6: Create navigation data**

Create `lib/data/nav-links.ts`:

```typescript
export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Membership", href: "/membership" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Initiatives", href: "/initiatives" },
  { label: "Youth", href: "/youth" },
  { label: "Volunteer", href: "/volunteer" },
  { label: "Store", href: "/store" },
  { label: "Resources", href: "/resources" },
  { label: "News", href: "/news" },
];
```

**Step 7: Verify imports work**

Add a temporary import in `app/page.tsx` to confirm TypeScript resolves the paths:

```tsx
import { SITE_CONFIG } from "@/lib/constants";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-6xl font-bold text-pc-red">
        {SITE_CONFIG.tagline.toUpperCase()}
      </h1>
    </main>
  );
}
```

Run: `npm run dev`
Expected: Page still shows "ONE TOWN. ONE TEAM." - confirms path aliases work.

**Step 8: Commit**

```bash
git add lib/ app/page.tsx
git commit -m "feat: add constants and data files for site content"
```

---

## Task 3: Build Shared Layout - Navbar

**Files:**
- Create: `components/layout/Navbar.tsx`
- Create: `components/layout/MobileMenu.tsx`
- Modify: `app/layout.tsx`

**Step 1: Create Navbar component**

Create `components/layout/Navbar.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/data/nav-links";
import { BOOSTERHUB_URLS, SITE_CONFIG } from "@/lib/constants";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="h-full py-3 hover:scale-105 transition-transform">
            <Image
              src={SITE_CONFIG.logoUrl}
              alt={SITE_CONFIG.name}
              width={160}
              height={56}
              className="h-full w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-oswald text-sm font-medium tracking-wide uppercase transition-colors ${
                  scrolled
                    ? "text-gray-700 hover:text-pc-red"
                    : "text-white hover:text-pc-red"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <a
              href={BOOSTERHUB_URLS.login}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden sm:inline-block font-oswald font-medium text-sm tracking-wide uppercase transition-colors ${
                scrolled ? "text-gray-700 hover:text-pc-red" : "text-white hover:text-pc-red"
              }`}
            >
              Member Login
            </a>
            <a
              href={BOOSTERHUB_URLS.donate}
              target="_blank"
              rel="noopener noreferrer"
              className="font-oswald bg-pc-red text-white py-2 px-6 rounded-full font-bold text-sm tracking-wider uppercase hover:bg-red-600 hover:shadow-glow hover:-translate-y-0.5 transition-all shadow-md"
            >
              Donate
            </a>
            <button
              onClick={() => setMobileOpen(true)}
              className={`lg:hidden p-2 ${scrolled ? "text-gray-800" : "text-white"}`}
              aria-label="Open menu"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
```

**Step 2: Create MobileMenu component**

Create `components/layout/MobileMenu.tsx`:

```tsx
"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { navLinks } from "@/lib/data/nav-links";
import { BOOSTERHUB_URLS } from "@/lib/constants";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-pc-dark/95 backdrop-blur-md flex flex-col">
      <div className="flex justify-end p-6">
        <button onClick={onClose} className="text-white p-2" aria-label="Close menu">
          <X size={32} />
        </button>
      </div>
      <nav className="flex flex-col items-center gap-6 mt-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="font-oswald text-2xl font-bold text-white uppercase tracking-wider hover:text-pc-red transition-colors"
          >
            {link.label}
          </Link>
        ))}
        <div className="mt-8 flex flex-col gap-4 w-64">
          <a
            href={BOOSTERHUB_URLS.login}
            target="_blank"
            rel="noopener noreferrer"
            className="font-oswald text-center text-white border border-white/30 py-3 rounded-full uppercase tracking-wider hover:bg-white/10 transition-colors"
          >
            Member Login
          </a>
          <a
            href={BOOSTERHUB_URLS.donate}
            target="_blank"
            rel="noopener noreferrer"
            className="font-oswald text-center bg-pc-red text-white py-3 rounded-full font-bold uppercase tracking-wider hover:bg-red-600 transition-colors"
          >
            Donate
          </a>
        </div>
      </nav>
    </div>
  );
}
```

**Step 3: Add Navbar to root layout**

Update `app/layout.tsx` to import and render Navbar:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Port Clinton Athletic Boosters",
  description:
    "Supporting Port Clinton student-athletes. One Town. One Team.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800 antialiased selection:bg-pc-red selection:text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
```

**Step 4: Add a placeholder logo image**

Download or copy the PC Boosters logo to `public/images/logo.png`. If unavailable, create a placeholder:

```bash
mkdir -p public/images
```

Note: The logo currently lives at `https://pcathleticboosters.com/wp-content/uploads/2025/04/PORT-CLINTON.png`. Download it and save as `public/images/logo.png`. For initial development, a placeholder image is fine.

**Step 5: Verify**

Run: `npm run dev`
Expected: Navbar renders at top of page. On desktop: logo left, nav links center, Member Login + Donate right. On mobile (<1024px): hamburger icon that opens fullscreen menu. Scrolling changes navbar background from transparent to white.

**Step 6: Commit**

```bash
git add components/layout/ app/layout.tsx public/images/
git commit -m "feat: add responsive Navbar with mobile menu"
```

---

## Task 4: Build Shared Layout - Footer

**Files:**
- Create: `components/layout/Footer.tsx`
- Modify: `app/layout.tsx`

**Step 1: Create Footer component**

Create `components/layout/Footer.tsx`:

```tsx
import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/lib/data/nav-links";
import { BOOSTERHUB_URLS, SITE_CONFIG } from "@/lib/constants";
import { Facebook, Instagram, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-pc-dark text-white py-16 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Image
              src={SITE_CONFIG.logoUrl}
              alt={SITE_CONFIG.name}
              width={160}
              height={56}
              className="h-12 w-auto brightness-0 invert opacity-70 mb-4"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              {SITE_CONFIG.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-oswald text-lg font-bold text-pc-red mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {navLinks.slice(0, 6).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-oswald text-lg font-bold text-pc-red mb-4 uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex gap-4 mb-6">
              <a
                href={SITE_CONFIG.facebookPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail size={24} />
              </a>
            </div>
            <a
              href={BOOSTERHUB_URLS.login}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              Member Login &rarr;
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500 text-sm mb-2">
            Port Clinton Athletic Boosters is a 501(c)(3) non-profit organization.
          </p>
          <p className="text-gray-600 text-xs">
            &copy; {currentYear} Port Clinton Athletic Boosters. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

**Step 2: Add Footer to root layout**

Update `app/layout.tsx` to include Footer below `{children}`:

```tsx
import Footer from "@/components/layout/Footer";
// ... existing imports

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800 antialiased selection:bg-pc-red selection:text-white">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

**Step 3: Verify**

Run: `npm run dev`
Expected: Footer renders at bottom with 3-column layout on desktop, stacked on mobile. Logo, quick links, social icons, and copyright visible.

**Step 4: Commit**

```bash
git add components/layout/Footer.tsx app/layout.tsx
git commit -m "feat: add Footer component with quick links and social"
```

---

## Task 5: Build Reusable UI Components

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/SectionHeading.tsx`
- Create: `components/ui/Card.tsx`
- Create: `components/ui/AnimatedCounter.tsx`
- Create: `components/ui/FacebookFeed.tsx`

**Step 1: Create Button component**

Create `components/ui/Button.tsx`:

```tsx
import Link from "next/link";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  external?: boolean;
  className?: string;
}

export default function Button({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: ButtonProps) {
  const base =
    "font-oswald inline-block font-bold text-sm tracking-wider uppercase py-3 px-8 rounded-full transition-all duration-300 text-center";

  const variants = {
    primary: "bg-pc-red text-white hover:bg-red-600 hover:shadow-glow hover:-translate-y-0.5 shadow-md",
    secondary: "bg-pc-dark text-white hover:bg-black hover:shadow-lg hover:-translate-y-0.5",
    outline: "border-2 border-pc-red text-pc-red hover:bg-pc-red hover:text-white",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
```

**Step 2: Create SectionHeading component**

Create `components/ui/SectionHeading.tsx`:

```tsx
interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  light?: boolean;
}

export default function SectionHeading({ title, subtitle, light = false }: SectionHeadingProps) {
  return (
    <div className="max-w-4xl mx-auto text-center mb-12">
      <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${light ? "text-white" : "text-gray-900"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg ${light ? "text-gray-300" : "text-gray-600"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
```

**Step 3: Create Card component**

Create `components/ui/Card.tsx`:

```tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = true }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg p-8 ${
        hover ? "hover:shadow-xl hover:-translate-y-1 transition-all duration-300" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
```

**Step 4: Create AnimatedCounter component**

Create `components/ui/AnimatedCounter.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  end: number;
  label: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export default function AnimatedCounter({
  end,
  label,
  prefix = "",
  suffix = "",
  duration = 2000,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold font-oswald text-pc-red">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-gray-500 uppercase tracking-wider mt-2 font-oswald">
        {label}
      </div>
    </div>
  );
}
```

**Step 5: Create FacebookFeed component**

Create `components/ui/FacebookFeed.tsx`:

```tsx
"use client";

import { SITE_CONFIG } from "@/lib/constants";

interface FacebookFeedProps {
  width?: number;
  height?: number;
}

export default function FacebookFeed({ width = 500, height = 600 }: FacebookFeedProps) {
  const encodedUrl = encodeURIComponent(SITE_CONFIG.facebookPageUrl);

  return (
    <div className="flex justify-center">
      <iframe
        src={`https://www.facebook.com/plugins/page.php?href=${encodedUrl}&tabs=timeline&width=${width}&height=${height}&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true`}
        width={width}
        height={height}
        style={{ border: "none", overflow: "hidden" }}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        title="Facebook Feed"
      />
    </div>
  );
}
```

**Step 6: Verify**

Temporarily import and render Button and SectionHeading on the homepage to confirm they work.

Run: `npm run dev`
Expected: Components render with correct styling.

**Step 7: Commit**

```bash
git add components/ui/
git commit -m "feat: add reusable UI components (Button, Card, SectionHeading, AnimatedCounter, FacebookFeed)"
```

---

## Task 6: Build Homepage

**Files:**
- Create: `components/home/Hero.tsx`
- Create: `components/home/ImpactStats.tsx`
- Create: `components/home/ActionCards.tsx`
- Create: `components/home/InitiativePreview.tsx`
- Create: `components/home/SponsorShowcase.tsx`
- Modify: `app/page.tsx`

**Step 1: Create Hero section**

Create `components/home/Hero.tsx`:

```tsx
import Button from "@/components/ui/Button";
import { BOOSTERHUB_URLS } from "@/lib/constants";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
    >
      {/* Overlays */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-black/30" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 -mt-20">
        <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-4 leading-none">
          ONE TOWN.
          <br />
          <span className="text-pc-red">ONE TEAM.</span>
        </h1>
        <p className="text-lg md:text-2xl font-light text-gray-200 max-w-2xl mx-auto mb-10 tracking-wide">
          Fueling excellence for Port Clinton athletes &mdash; from youth leagues to varsity.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href={BOOSTERHUB_URLS.membership} external>
            Become a Member
          </Button>
          <Button href={BOOSTERHUB_URLS.donate} variant="outline" external className="border-white text-white hover:bg-white hover:text-pc-dark">
            Make a Donation
          </Button>
        </div>
      </div>
    </section>
  );
}
```

Note: You'll need a hero background image at `public/images/hero-bg.jpg`. Use a high-energy sports photo. The current site uses an image from pcathleticboosters.com - download that or use a suitable alternative.

**Step 2: Create ImpactStats section**

Create `components/home/ImpactStats.tsx`:

```tsx
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function ImpactStats() {
  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <AnimatedCounter end={50} suffix="+" label="Scholarships Awarded" />
          <AnimatedCounter end={15} label="Sports Supported" />
          <AnimatedCounter end={200} suffix="+" label="Active Members" />
          <AnimatedCounter end={100} prefix="$" suffix="K+" label="Raised Annually" />
        </div>
      </div>
    </section>
  );
}
```

**Step 3: Create ActionCards section**

Create `components/home/ActionCards.tsx`:

```tsx
import { IdCard, HandHeart, Megaphone } from "lucide-react";
import { BOOSTERHUB_URLS } from "@/lib/constants";
import Button from "@/components/ui/Button";

const actions = [
  {
    icon: IdCard,
    title: "Membership",
    description: "Join the club. Fuel the team. Get exclusive benefits and support our athletes.",
    cta: "Join Now",
    href: BOOSTERHUB_URLS.membership,
    accent: "border-pc-red",
  },
  {
    icon: HandHeart,
    title: "Volunteer",
    description: "Your time makes the difference. Help at events, concessions, and more.",
    cta: "Get Involved",
    href: BOOSTERHUB_URLS.volunteer,
    accent: "border-pc-dark",
  },
  {
    icon: Megaphone,
    title: "Sponsor",
    description: "Partner with us for greatness. Put your brand in front of our community.",
    cta: "Become a Partner",
    href: "/sponsors",
    accent: "border-pc-red",
  },
];

export default function ActionCards() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {actions.map((action) => (
            <div
              key={action.title}
              className={`bg-white rounded-2xl shadow-xl p-8 border-t-8 ${action.accent} text-center group hover:shadow-glow hover:-translate-y-2 transition-all duration-300`}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-pc-red group-hover:text-white transition-colors">
                <action.icon size={28} className="text-gray-700 group-hover:text-white" />
              </div>
              <h3 className="font-oswald text-3xl font-bold mb-2 text-gray-900 uppercase">
                {action.title}
              </h3>
              <p className="text-gray-600 mb-8">{action.description}</p>
              <Button
                href={action.href}
                external={action.href.startsWith("http")}
                className="w-full"
              >
                {action.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 4: Create InitiativePreview section**

Create `components/home/InitiativePreview.tsx`:

```tsx
import Image from "next/image";
import { initiatives } from "@/lib/data/initiatives";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export default function InitiativePreview() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Where Your Money Goes"
          subtitle="Your support translates directly into equipment, facilities, and opportunities for student athletes."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {initiatives.slice(0, 3).map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-pc-red hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gray-200 relative">
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <span className="text-white font-oswald text-xl uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-oswald text-xl font-bold mb-2 uppercase">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button href="/initiatives" variant="outline">
            See All Initiatives
          </Button>
        </div>
      </div>
    </section>
  );
}
```

**Step 5: Create SponsorShowcase section**

Create `components/home/SponsorShowcase.tsx`:

```tsx
import { sponsors } from "@/lib/data/sponsors";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { Building2 } from "lucide-react";

export default function SponsorShowcase() {
  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-oswald text-2xl font-bold text-gray-400 mb-8 uppercase tracking-widest">
          Proud Community Partners
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 mb-8">
          {sponsors.filter((s) => s.tier === "gold").map((sponsor) => (
            <div key={sponsor.name} className="text-gray-300 hover:text-gray-800 transition-colors">
              {sponsor.logoUrl ? (
                <img src={sponsor.logoUrl} alt={sponsor.name} className="h-12 grayscale hover:grayscale-0 transition-all" />
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Building2 size={48} />
                  <span className="text-xs">{sponsor.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <Button href="/sponsors" variant="outline">
          View All Partners
        </Button>
      </div>
    </section>
  );
}
```

**Step 6: Assemble Homepage**

Replace `app/page.tsx` with:

```tsx
import Hero from "@/components/home/Hero";
import ImpactStats from "@/components/home/ImpactStats";
import ActionCards from "@/components/home/ActionCards";
import InitiativePreview from "@/components/home/InitiativePreview";
import SponsorShowcase from "@/components/home/SponsorShowcase";
import SectionHeading from "@/components/ui/SectionHeading";
import FacebookFeed from "@/components/ui/FacebookFeed";

export default function Home() {
  return (
    <main>
      <Hero />
      <ImpactStats />
      <ActionCards />
      <InitiativePreview />
      <SponsorShowcase />

      {/* Live From the Field */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Live From the Field"
            subtitle="Follow us on Facebook for the latest updates, photos, and game results."
          />
          <FacebookFeed width={500} height={600} />
        </div>
      </section>
    </main>
  );
}
```

**Step 7: Verify**

Run: `npm run dev`
Expected: Full homepage renders with all sections in order: Hero -> Stats -> Action Cards -> Initiatives -> Sponsors -> Facebook Feed. Footer renders below.

**Step 8: Commit**

```bash
git add components/home/ app/page.tsx
git commit -m "feat: build complete Homepage with all sections"
```

---

## Task 7: Build About Page

**Files:**
- Create: `app/about/page.tsx`

**Step 1: Create About page**

Create `app/about/page.tsx`:

```tsx
import { boardMembers } from "@/lib/data/board";
import { teamReps } from "@/lib/data/team-reps";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import { Mail, Users, Trophy, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-pc-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">About Us</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The Port Clinton Athletic Boosters is a 501(c)(3) non-profit
            dedicated to supporting student-athletes from youth leagues through
            varsity competition.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <SectionHeading title="Our Mission" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Trophy className="mx-auto mb-4 text-pc-red" size={40} />
              <h3 className="font-oswald text-xl font-bold uppercase mb-2">Support Athletes</h3>
              <p className="text-gray-600 text-sm">
                Fund equipment, facilities, and scholarships so every student can compete.
              </p>
            </div>
            <div className="text-center">
              <Users className="mx-auto mb-4 text-pc-red" size={40} />
              <h3 className="font-oswald text-xl font-bold uppercase mb-2">Build Community</h3>
              <p className="text-gray-600 text-sm">
                Connect families, businesses, and fans through the shared experience of athletics.
              </p>
            </div>
            <div className="text-center">
              <Heart className="mx-auto mb-4 text-pc-red" size={40} />
              <h3 className="font-oswald text-xl font-bold uppercase mb-2">Bridge the Gap</h3>
              <p className="text-gray-600 text-sm">
                Coordinate between youth programs and high school athletics in a community without parks &amp; rec.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Leadership Board"
            subtitle="Meet the volunteers who make it all happen."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {boardMembers.map((member) => (
              <Card key={member.name} className="text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="text-gray-400" size={32} />
                </div>
                <h3 className="font-oswald text-xl font-bold uppercase">{member.name}</h3>
                <p className="text-pc-red font-oswald text-sm uppercase tracking-wider">{member.role}</p>
                {member.bio && <p className="text-gray-600 text-sm mt-2">{member.bio}</p>}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Representatives */}
      <section className="py-20 bg-pc-dark text-white">
        <div className="container mx-auto px-4">
          <SectionHeading title="Team Representatives" light />
          <div className="max-w-3xl mx-auto overflow-x-auto">
            <table className="w-full text-left text-gray-300">
              <thead>
                <tr className="text-gray-500 border-b border-gray-700">
                  <th className="pb-3 font-oswald uppercase tracking-wider text-sm">Sport</th>
                  <th className="pb-3 font-oswald uppercase tracking-wider text-sm">Representative</th>
                  <th className="pb-3 font-oswald uppercase tracking-wider text-sm text-right">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {teamReps.map((rep) => (
                  <tr key={rep.sport} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-4 font-medium text-white">{rep.sport}</td>
                    <td className="py-4">{rep.name}</td>
                    <td className="py-4 text-right">
                      <a href={`mailto:${rep.email}`} className="text-pc-red hover:text-white transition-colors">
                        <Mail size={18} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
```

**Step 2: Verify**

Run: `npm run dev`, navigate to `/about`
Expected: Full About page renders with mission pillars, board members, and team reps table.

**Step 3: Commit**

```bash
git add app/about/
git commit -m "feat: add About page with mission, board, and team reps"
```

---

## Task 8: Build Membership Page

**Files:**
- Create: `app/membership/page.tsx`

**Step 1: Create Membership page**

Create `app/membership/page.tsx` with:
- Hero section with emotional pitch
- Tier comparison cards (placeholder tiers until real data is provided)
- Benefits breakdown
- CTA to BoosterHub membership

The page should have 2-3 membership tier cards with pricing, a bulleted benefits list for each tier, and a recommended tier visually highlighted. Use the `Card` component and `Button` component. Include a note at the bottom: "You'll be taken to our secure member portal to complete registration."

**Step 2: Verify**

Run: `npm run dev`, navigate to `/membership`
Expected: Full Membership page renders.

**Step 3: Commit**

```bash
git add app/membership/
git commit -m "feat: add Membership page with tier comparison"
```

---

## Task 9: Build Sponsors Page

**Files:**
- Create: `app/sponsors/page.tsx`

**Step 1: Create Sponsors page**

Create `app/sponsors/page.tsx` with:
- Current sponsors organized by tier (gold/silver/bronze)
- Sponsorship package cards with pricing and benefits from `lib/data/sponsors.ts`
- "Why Sponsor" value proposition section
- CTA to become a sponsor (link to BoosterHub or mailto)

**Step 2: Verify**

Run: `npm run dev`, navigate to `/sponsors`
Expected: Full Sponsors page renders.

**Step 3: Commit**

```bash
git add app/sponsors/
git commit -m "feat: add Sponsors page with packages and partner showcase"
```

---

## Task 10: Build Initiatives Page

**Files:**
- Create: `app/initiatives/page.tsx`

**Step 1: Create Initiatives page**

Create `app/initiatives/page.tsx` with:
- Hero: "Where Your Money Goes"
- Full initiative cards from `lib/data/initiatives.ts` (larger versions of the homepage preview)
- Each card: photo area, title, category badge, full description
- CTA: "Support Our Initiatives" linking to BoosterHub donate

**Step 2: Verify**

Run: `npm run dev`, navigate to `/initiatives`
Expected: Full Initiatives page renders.

**Step 3: Commit**

```bash
git add app/initiatives/
git commit -m "feat: add Initiatives page showing impact areas"
```

---

## Task 11: Build Youth & Community Page

**Files:**
- Create: `app/youth/page.tsx`

**Step 1: Create Youth & Community page**

Create `app/youth/page.tsx` with:
- Hero with "Building the Pipeline" or similar headline
- "The Gap" section - honest framing of the challenge (no parks & rec, fragmented youth sports)
- "Our Vision" section - how boosters bridge the gap from youth to varsity. "ONE TOWN. ONE TEAM." applies to the whole community
- "Youth Resources" section - placeholder cards for coaching resources, training info, league links
- "How to Help" section - volunteer coaching, equipment donations, sponsoring youth teams
- CTA to volunteer page

**Step 2: Verify**

Run: `npm run dev`, navigate to `/youth`
Expected: Full Youth & Community page renders.

**Step 3: Commit**

```bash
git add app/youth/
git commit -m "feat: add Youth & Community page bridging the pipeline gap"
```

---

## Task 12: Build Volunteer Page

**Files:**
- Create: `app/volunteer/page.tsx`

**Step 1: Create Volunteer page**

Create `app/volunteer/page.tsx` with:
- Hero with volunteer impact messaging
- "Why Volunteer" section with icons/stats
- Current opportunities as cards (concessions, events, committees, coaching, etc.)
- Time commitment section with honest breakdown
- CTA: "Sign Up to Volunteer" linking to BoosterHub volunteer (new tab)

**Step 2: Verify**

Run: `npm run dev`, navigate to `/volunteer`
Expected: Full Volunteer page renders.

**Step 3: Commit**

```bash
git add app/volunteer/
git commit -m "feat: add Volunteer page with opportunities and CTAs"
```

---

## Task 13: Build Store Page

**Files:**
- Create: `app/store/page.tsx`

**Step 1: Create Store page**

Create `app/store/page.tsx` with:
- Hero: "Gear Up. Show Your Pride."
- Spirit wear photo grid (placeholder images for now)
- Brief description of available merchandise
- Prominent CTA: "Shop Now on BoosterHub" (new tab link to BoosterHub store)
- Note: "Browse our full catalog and checkout on our secure store."

This is intentionally a teaser page since the actual store is on BoosterHub.

**Step 2: Verify**

Run: `npm run dev`, navigate to `/store`
Expected: Store page renders with merchandise showcase and BoosterHub link.

**Step 3: Commit**

```bash
git add app/store/
git commit -m "feat: add Store page with spirit wear showcase"
```

---

## Task 14: Build Resources Page

**Files:**
- Create: `app/resources/page.tsx`

**Step 1: Create Resources page**

Create `app/resources/page.tsx` with:
- Hero: "Resources & Information"
- Documents section with link cards for: Bylaws, Meeting Minutes, Financial Reports (placeholder links/PDFs for now)
- FAQ accordion section with common questions:
  - How do I become a member?
  - Is my donation tax-deductible?
  - How can I volunteer?
  - Who do I contact about sponsorship?
  - How are funds allocated?
- Contact section with board email and general inquiry info

The FAQ accordion should be a client component that toggles open/closed on click.

**Step 2: Verify**

Run: `npm run dev`, navigate to `/resources`
Expected: Resources page renders with documents, clickable FAQ accordion, and contact info.

**Step 3: Commit**

```bash
git add app/resources/
git commit -m "feat: add Resources page with FAQs and documents"
```

---

## Task 15: Build News/Calendar Page

**Files:**
- Create: `app/news/page.tsx`

**Step 1: Create News/Calendar page**

Create `app/news/page.tsx` with:
- Hero: "News & Events"
- Full-width Facebook Feed embed (larger than homepage version)
- Upcoming Events section with placeholder event cards (manually maintained)
- Each event card: date, title, location, brief description

**Step 2: Verify**

Run: `npm run dev`, navigate to `/news`
Expected: News page renders with Facebook feed and event cards.

**Step 3: Commit**

```bash
git add app/news/
git commit -m "feat: add News/Calendar page with Facebook feed and events"
```

---

## Task 16: Add Framer Motion Scroll Animations

**Files:**
- Create: `components/ui/FadeIn.tsx`
- Modify: all page files and homepage sections to wrap content in FadeIn

**Step 1: Create FadeIn wrapper component**

Create `components/ui/FadeIn.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";

interface FadeInProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  className?: string;
}

export default function FadeIn({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: FadeInProps) {
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

**Step 2: Add FadeIn to homepage sections**

Wrap key elements in each homepage section component with `<FadeIn>`. For example, wrap each action card, each initiative card, the stats bar, etc. Add staggered delays (0, 0.1, 0.2) for items in a grid.

**Step 3: Add FadeIn to interior page sections**

Add FadeIn wrapping to the main content blocks on each interior page for consistent scroll-reveal animations.

**Step 4: Verify**

Run: `npm run dev`
Expected: Sections fade in smoothly as you scroll down the page. Animations trigger once and don't replay.

**Step 5: Commit**

```bash
git add components/ui/FadeIn.tsx components/home/ app/
git commit -m "feat: add Framer Motion scroll animations across all pages"
```

---

## Task 17: Add SEO Metadata

**Files:**
- Modify: each `app/*/page.tsx` to export metadata

**Step 1: Add metadata to each page**

Add a `metadata` export to each page file. Example for About:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Port Clinton Athletic Boosters",
  description: "Learn about our mission, meet our leadership board, and find team representatives.",
};
```

Do this for all 10 pages with appropriate title and description.

**Step 2: Add Open Graph image**

Place a social sharing image at `public/images/og-image.jpg` (1200x630px recommended). Update `app/layout.tsx` metadata:

```tsx
export const metadata: Metadata = {
  title: {
    default: "Port Clinton Athletic Boosters",
    template: "%s | Port Clinton Athletic Boosters",
  },
  description: "Supporting Port Clinton student-athletes. One Town. One Team.",
  openGraph: {
    images: ["/images/og-image.jpg"],
    siteName: "Port Clinton Athletic Boosters",
  },
};
```

**Step 3: Verify**

Run: `npm run build`
Expected: Build succeeds with static export. Check that all pages generate HTML files in `out/` directory.

**Step 4: Commit**

```bash
git add app/ public/images/
git commit -m "feat: add SEO metadata and Open Graph images for all pages"
```

---

## Task 18: Final Polish and Build Verification

**Files:**
- Create: `.gitignore` updates (if needed)
- Create: `vercel.json` (if needed for config)
- Modify: various files for visual polish

**Step 1: Test full static build**

```bash
npm run build
```

Expected: Build succeeds. `out/` directory contains static HTML for all 10 pages plus the homepage.

**Step 2: Test the static build locally**

```bash
npx serve out
```

Expected: All pages load, navigation works between pages, external links open in new tabs, images display, Facebook embed loads.

**Step 3: Review responsive design**

Check each page at mobile (375px), tablet (768px), and desktop (1280px) widths. Fix any layout issues.

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete site build with all 10 pages and static export"
```

---

## Summary

| Task | Description | Pages/Components |
|------|-------------|------------------|
| 1 | Initialize Next.js project | Project scaffold |
| 2 | Create constants and data files | lib/ data layer |
| 3 | Build Navbar | Navbar, MobileMenu |
| 4 | Build Footer | Footer |
| 5 | Build reusable UI components | Button, Card, SectionHeading, AnimatedCounter, FacebookFeed |
| 6 | Build Homepage | Hero, ImpactStats, ActionCards, InitiativePreview, SponsorShowcase |
| 7 | Build About page | About |
| 8 | Build Membership page | Membership |
| 9 | Build Sponsors page | Sponsors |
| 10 | Build Initiatives page | Initiatives |
| 11 | Build Youth & Community page | Youth |
| 12 | Build Volunteer page | Volunteer |
| 13 | Build Store page | Store |
| 14 | Build Resources page | Resources |
| 15 | Build News/Calendar page | News |
| 16 | Add Framer Motion animations | FadeIn wrapper |
| 17 | Add SEO metadata | All pages |
| 18 | Final polish and build verification | Build + test |

**Total: 18 tasks, building from foundation (scaffold) through shared components to individual pages to polish.**

**Content note:** Many pages use placeholder content (TODO markers). After the site is built, the user will need to provide:
- Real hero/initiative photos
- Actual board member photos and bios
- Real team representative names and emails
- Actual sponsor logos and names
- Real sponsorship package pricing
- Organization history for the About page
- Actual membership tier details and pricing
- Real initiative descriptions and funding goals
- Youth program specific resources and links
- Upcoming event details
- Organization EIN for tax deduction info
