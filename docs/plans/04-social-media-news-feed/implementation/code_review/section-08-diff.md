diff --git a/__tests__/integration/no-facebook-feed.test.ts b/__tests__/integration/no-facebook-feed.test.ts
new file mode 100644
index 0000000..449daac
--- /dev/null
+++ b/__tests__/integration/no-facebook-feed.test.ts
@@ -0,0 +1,43 @@
+import { describe, it, expect } from "vitest";
+import { execSync } from "child_process";
+import fs from "fs";
+import path from "path";
+
+describe("FacebookFeed removal verification", () => {
+  const rootDir = path.resolve(__dirname, "../..");
+
+  function normalizePath(p: string): string {
+    return p.replace(/\\/g, "/");
+  }
+
+  function grepSourceFiles(pattern: string): string[] {
+    try {
+      const result = execSync(
+        `grep -r -i -l "${pattern}" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=out "${rootDir}"`,
+        { encoding: "utf-8" }
+      );
+      return result
+        .trim()
+        .split("\n")
+        .filter((line) => line.length > 0)
+        .map(normalizePath)
+        .filter((line) => !line.includes("docs/plans/"))
+        .filter((line) => !line.includes("__tests__/integration/"));
+    } catch (error: any) {
+      if (error.status === 1) return [];
+      throw error;
+    }
+  }
+
+  it("has zero 'FacebookFeed' references in source files", () => {
+    const matches = grepSourceFiles("FacebookFeed").filter(
+      (line) => !line.includes("__tests__/")
+    );
+    expect(matches).toEqual([]);
+  });
+
+  it("FacebookFeed.tsx file does not exist", () => {
+    const filePath = path.resolve(rootDir, "components/ui/FacebookFeed.tsx");
+    expect(fs.existsSync(filePath)).toBe(false);
+  });
+});
diff --git a/__tests__/integration/social-feed.test.tsx b/__tests__/integration/social-feed.test.tsx
new file mode 100644
index 0000000..3669353
--- /dev/null
+++ b/__tests__/integration/social-feed.test.tsx
@@ -0,0 +1,95 @@
+import { describe, it, expect, vi } from "vitest";
+import { render, screen } from "@testing-library/react";
+
+// Mock SocialFeedSection so we can verify it receives correct props
+vi.mock("@/components/ui/SocialFeedSection", () => ({
+  default: ({ feedId, className }: any) => (
+    <div data-testid="social-feed-section" data-feed-id={feedId} className={className} />
+  ),
+}));
+
+// Mock SocialFollowBanner
+vi.mock("@/components/ui/SocialFollowBanner", () => ({
+  default: () => <div data-testid="social-follow-banner" />,
+}));
+
+// Mock heavy child components to keep tests focused
+vi.mock("framer-motion", () => ({
+  motion: {
+    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
+  },
+}));
+vi.mock("@/components/ui/FadeIn", () => ({
+  default: ({ children }: any) => <div>{children}</div>,
+}));
+vi.mock("@/components/home/Hero", () => ({
+  default: () => <div data-testid="hero">Hero</div>,
+}));
+vi.mock("@/components/home/ImpactStats", () => ({
+  default: () => <div data-testid="impact-stats">ImpactStats</div>,
+}));
+vi.mock("@/components/home/ActionCards", () => ({
+  default: () => <div data-testid="action-cards">ActionCards</div>,
+}));
+vi.mock("@/components/home/InitiativePreview", () => ({
+  default: () => <div data-testid="initiative-preview">InitiativePreview</div>,
+}));
+vi.mock("@/components/home/SponsorShowcase", () => ({
+  default: () => <div data-testid="sponsor-showcase">SponsorShowcase</div>,
+}));
+vi.mock("@/components/ui/Button", () => ({
+  default: ({ children, href }: any) => <a href={href}>{children}</a>,
+}));
+vi.mock("next/link", () => ({
+  default: ({ href, children, ...props }: any) => (
+    <a href={href} {...props}>{children}</a>
+  ),
+}));
+vi.mock("next/image", () => ({
+  default: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
+}));
+
+import NewsPage from "@/app/news/page";
+import Home from "@/app/page";
+import Footer from "@/components/layout/Footer";
+import { CURATOR_CONFIG, SOCIAL_URLS } from "@/lib/constants";
+
+describe("Social feed integration", () => {
+  it("News page renders SocialFeedSection with correct Curator.io feedId", () => {
+    render(<NewsPage />);
+    const feed = screen.getByTestId("social-feed-section");
+    expect(feed).toBeInTheDocument();
+    expect(feed).toHaveAttribute("data-feed-id", CURATOR_CONFIG.feedId);
+  });
+
+  it("Homepage renders SocialFeedSection with correct Curator.io feedId", () => {
+    render(<Home />);
+    const feed = screen.getByTestId("social-feed-section");
+    expect(feed).toBeInTheDocument();
+    expect(feed).toHaveAttribute("data-feed-id", CURATOR_CONFIG.feedId);
+  });
+
+  it("Footer contains all three social media links (Facebook, Instagram, YouTube)", () => {
+    render(<Footer />);
+    const links = screen.getAllByRole("link");
+    const hrefs = links.map((link) => link.getAttribute("href"));
+    expect(hrefs).toContain(SOCIAL_URLS.facebook);
+    expect(hrefs).toContain(SOCIAL_URLS.instagram);
+    expect(hrefs).toContain(SOCIAL_URLS.youtube);
+  });
+
+  it("All social URLs across components are consistent with SOCIAL_URLS constants", () => {
+    render(<Footer />);
+    const fbLink = screen.getByRole("link", { name: /follow us on facebook/i });
+    const igLink = screen.getByRole("link", { name: /follow us on instagram/i });
+    const ytLink = screen.getByRole("link", { name: /follow us on youtube/i });
+    expect(fbLink).toHaveAttribute("href", SOCIAL_URLS.facebook);
+    expect(igLink).toHaveAttribute("href", SOCIAL_URLS.instagram);
+    expect(ytLink).toHaveAttribute("href", SOCIAL_URLS.youtube);
+  });
+
+  it("SocialFollowBanner renders on the News page", () => {
+    render(<NewsPage />);
+    expect(screen.getByTestId("social-follow-banner")).toBeInTheDocument();
+  });
+});
diff --git a/components/ui/FacebookFeed.tsx b/components/ui/FacebookFeed.tsx
deleted file mode 100644
index 3870806..0000000
--- a/components/ui/FacebookFeed.tsx
+++ /dev/null
@@ -1,25 +0,0 @@
-"use client";
-
-import { SITE_CONFIG } from "@/lib/constants";
-
-interface FacebookFeedProps {
-  width?: number;
-  height?: number;
-}
-
-export default function FacebookFeed({ width = 500, height = 600 }: FacebookFeedProps) {
-  const encodedUrl = encodeURIComponent(SITE_CONFIG.facebookPageUrl);
-
-  return (
-    <div className="flex justify-center">
-      <iframe
-        src={`https://www.facebook.com/plugins/page.php?href=${encodedUrl}&tabs=timeline&width=${width}&height=${height}&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true`}
-        width={width}
-        height={height}
-        style={{ border: "none", overflow: "hidden" }}
-        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
-        title="Facebook Feed"
-      />
-    </div>
-  );
-}
diff --git a/docs/plans/04-social-media-news-feed/implementation/deep_implement_config.json b/docs/plans/04-social-media-news-feed/implementation/deep_implement_config.json
index 01e7176..f157c29 100644
--- a/docs/plans/04-social-media-news-feed/implementation/deep_implement_config.json
+++ b/docs/plans/04-social-media-news-feed/implementation/deep_implement_config.json
@@ -40,6 +40,10 @@
     "section-06-homepage-modification": {
       "status": "complete",
       "commit_hash": "a8256db"
+    },
+    "section-07-footer-modification": {
+      "status": "complete",
+      "commit_hash": "b14bbbd"
     }
   },
   "pre_commit": {
