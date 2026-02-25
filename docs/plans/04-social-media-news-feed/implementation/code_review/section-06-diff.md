diff --git a/__tests__/app/page.test.tsx b/__tests__/app/page.test.tsx
new file mode 100644
index 0000000..3d0b627
--- /dev/null
+++ b/__tests__/app/page.test.tsx
@@ -0,0 +1,68 @@
+import { describe, it, expect, vi } from "vitest";
+import { render, screen } from "@testing-library/react";
+
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
+vi.mock("@/components/ui/FadeIn", () => ({
+  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
+}));
+vi.mock("@/components/ui/SectionHeading", () => ({
+  default: ({ title, subtitle }: { title: string; subtitle?: string }) => (
+    <div data-testid="section-heading"><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
+  ),
+}));
+vi.mock("@/components/ui/Button", () => ({
+  default: ({ children, href }: { children: React.ReactNode; href?: string }) => (
+    <a href={href}>{children}</a>
+  ),
+}));
+vi.mock("@/components/ui/SocialFeedSection", () => ({
+  default: ({ feedId, className }: { feedId: string; className?: string }) => (
+    <div data-testid="social-feed-section" data-feed-id={feedId} className={className}>SocialFeedSection</div>
+  ),
+}));
+
+import Home from "@/app/page";
+import { CURATOR_CONFIG } from "@/lib/constants";
+
+describe("Homepage", () => {
+  it("renders SocialFeedSection in the Live From the Field section", () => {
+    render(<Home />);
+    expect(screen.getByTestId("social-feed-section")).toBeInTheDocument();
+  });
+
+  it("does NOT render FacebookFeed component", () => {
+    const { container } = render(<Home />);
+    expect(container.querySelector('iframe[title="Facebook Feed"]')).toBeNull();
+  });
+
+  it("SocialFeedSection receives correct feedId from CURATOR_CONFIG", () => {
+    render(<Home />);
+    const feed = screen.getByTestId("social-feed-section");
+    expect(feed).toHaveAttribute("data-feed-id", CURATOR_CONFIG.feedId);
+  });
+
+  it("all other homepage sections remain present", () => {
+    render(<Home />);
+    expect(screen.getByTestId("hero")).toBeInTheDocument();
+    expect(screen.getByTestId("impact-stats")).toBeInTheDocument();
+    expect(screen.getByTestId("action-cards")).toBeInTheDocument();
+    expect(screen.getByTestId("initiative-preview")).toBeInTheDocument();
+    expect(screen.getByTestId("sponsor-showcase")).toBeInTheDocument();
+    expect(screen.getByText("Stay Connected")).toBeInTheDocument();
+    expect(screen.getByText("Live From the Field")).toBeInTheDocument();
+  });
+});
diff --git a/app/page.tsx b/app/page.tsx
index 144730f..e3a622b 100644
--- a/app/page.tsx
+++ b/app/page.tsx
@@ -6,7 +6,8 @@ import SponsorShowcase from "@/components/home/SponsorShowcase";
 import SectionHeading from "@/components/ui/SectionHeading";
 import Button from "@/components/ui/Button";
 import FadeIn from "@/components/ui/FadeIn";
-import FacebookFeed from "@/components/ui/FacebookFeed";
+import SocialFeedSection from "@/components/ui/SocialFeedSection";
+import { CURATOR_CONFIG } from "@/lib/constants";
 
 export default function Home() {
   return (
@@ -42,9 +43,9 @@ export default function Home() {
           <FadeIn>
             <SectionHeading
               title="Live From the Field"
-              subtitle="Follow us on Facebook for the latest updates, photos, and game results."
+              subtitle="Follow us on Facebook, Instagram, and YouTube for the latest updates, photos, and game results."
             />
-            <FacebookFeed width={500} height={600} />
+            <SocialFeedSection feedId={CURATOR_CONFIG.feedId} />
           </FadeIn>
         </div>
       </section>
diff --git a/docs/plans/04-social-media-news-feed/implementation/deep_implement_config.json b/docs/plans/04-social-media-news-feed/implementation/deep_implement_config.json
index e8d81dc..d848f87 100644
--- a/docs/plans/04-social-media-news-feed/implementation/deep_implement_config.json
+++ b/docs/plans/04-social-media-news-feed/implementation/deep_implement_config.json
@@ -32,6 +32,10 @@
     "section-04-social-follow-banner-component": {
       "status": "complete",
       "commit_hash": "6de5d55"
+    },
+    "section-05-news-page-redesign": {
+      "status": "complete",
+      "commit_hash": "db5dbf5"
     }
   },
   "pre_commit": {
