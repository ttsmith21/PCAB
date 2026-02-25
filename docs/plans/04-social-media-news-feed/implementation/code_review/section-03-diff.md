diff --git a/__tests__/components/ui/SocialFeedSection.test.tsx b/__tests__/components/ui/SocialFeedSection.test.tsx
new file mode 100644
index 0000000..b5b2373
--- /dev/null
+++ b/__tests__/components/ui/SocialFeedSection.test.tsx
@@ -0,0 +1,105 @@
+import { describe, it, expect, vi, beforeEach } from "vitest";
+import { render, screen } from "@testing-library/react";
+
+// --- Mocks ---
+
+// Mock react-intersection-observer. The mockInView variable controls
+// whether the component believes it is in the viewport.
+let mockInView = false;
+vi.mock("react-intersection-observer", () => ({
+  useInView: () => ({
+    ref: vi.fn(),
+    inView: mockInView,
+  }),
+}));
+
+// Mock next/dynamic to return a simple stand-in component that renders
+// a data attribute so tests can detect when CuratorFeed would appear.
+vi.mock("next/dynamic", () => ({
+  __esModule: true,
+  default: () => {
+    const MockCuratorFeed = (props: Record<string, unknown>) => (
+      <div data-testid="curator-feed" data-feed-id={props.feedId as string} />
+    );
+    MockCuratorFeed.displayName = "MockCuratorFeed";
+    return MockCuratorFeed;
+  },
+}));
+
+import SocialFeedSection from "@/components/ui/SocialFeedSection";
+import { SOCIAL_URLS } from "@/lib/constants";
+
+describe("SocialFeedSection", () => {
+  beforeEach(() => {
+    mockInView = false;
+  });
+
+  it("renders fallback social links when not in viewport (initial state)", () => {
+    mockInView = false;
+    render(<SocialFeedSection feedId="test-feed-123" />);
+    expect(screen.getByText(/follow us on social media/i)).toBeInTheDocument();
+  });
+
+  it("fallback contains links to Facebook, Instagram, and YouTube profiles", () => {
+    mockInView = false;
+    render(<SocialFeedSection feedId="test-feed-123" />);
+    const facebookLink = screen.getByRole("link", { name: /facebook/i });
+    const instagramLink = screen.getByRole("link", { name: /instagram/i });
+    const youtubeLink = screen.getByRole("link", { name: /youtube/i });
+    expect(facebookLink).toBeInTheDocument();
+    expect(instagramLink).toBeInTheDocument();
+    expect(youtubeLink).toBeInTheDocument();
+  });
+
+  it("fallback links use URLs from SOCIAL_URLS constants", () => {
+    mockInView = false;
+    render(<SocialFeedSection feedId="test-feed-123" />);
+    const facebookLink = screen.getByRole("link", { name: /facebook/i });
+    const instagramLink = screen.getByRole("link", { name: /instagram/i });
+    const youtubeLink = screen.getByRole("link", { name: /youtube/i });
+    expect(facebookLink).toHaveAttribute("href", SOCIAL_URLS.facebook);
+    expect(instagramLink).toHaveAttribute("href", SOCIAL_URLS.instagram);
+    expect(youtubeLink).toHaveAttribute("href", SOCIAL_URLS.youtube);
+  });
+
+  it("all fallback links have target=_blank and rel=noopener noreferrer", () => {
+    mockInView = false;
+    render(<SocialFeedSection feedId="test-feed-123" />);
+    const links = [
+      screen.getByRole("link", { name: /facebook/i }),
+      screen.getByRole("link", { name: /instagram/i }),
+      screen.getByRole("link", { name: /youtube/i }),
+    ];
+    links.forEach((link) => {
+      expect(link).toHaveAttribute("target", "_blank");
+      expect(link).toHaveAttribute("rel", "noopener noreferrer");
+    });
+  });
+
+  it("all fallback links have descriptive aria-label attributes", () => {
+    mockInView = false;
+    render(<SocialFeedSection feedId="test-feed-123" />);
+    const facebookLink = screen.getByRole("link", { name: /follow us on facebook/i });
+    const instagramLink = screen.getByRole("link", { name: /follow us on instagram/i });
+    const youtubeLink = screen.getByRole("link", { name: /follow us on youtube/i });
+    expect(facebookLink).toBeInTheDocument();
+    expect(instagramLink).toBeInTheDocument();
+    expect(youtubeLink).toBeInTheDocument();
+  });
+
+  it("when in viewport, renders the CuratorFeed component", () => {
+    mockInView = true;
+    render(<SocialFeedSection feedId="test-feed-123" />);
+    const curatorFeed = screen.getByTestId("curator-feed");
+    expect(curatorFeed).toBeInTheDocument();
+    expect(curatorFeed).toHaveAttribute("data-feed-id", "test-feed-123");
+  });
+
+  it("applies optional className to root element", () => {
+    mockInView = false;
+    const { container } = render(
+      <SocialFeedSection feedId="test-feed-123" className="my-custom-class" />
+    );
+    expect(container.firstElementChild?.className).toContain("my-custom-class");
+  });
+});
diff --git a/components/ui/SocialFeedSection.tsx b/components/ui/SocialFeedSection.tsx
new file mode 100644
index 0000000..bcc5689
--- /dev/null
+++ b/components/ui/SocialFeedSection.tsx
@@ -0,0 +1,57 @@
+"use client";
+
+import dynamic from "next/dynamic";
+import { useInView } from "react-intersection-observer";
+import { Facebook, Instagram, Youtube } from "lucide-react";
+import { SOCIAL_URLS } from "@/lib/constants";
+
+interface SocialFeedSectionProps {
+  feedId: string;
+  className?: string;
+}
+
+const socialLinks = [
+  { label: "Facebook", href: SOCIAL_URLS.facebook, icon: Facebook, ariaLabel: "Follow us on Facebook" },
+  { label: "Instagram", href: SOCIAL_URLS.instagram, icon: Instagram, ariaLabel: "Follow us on Instagram" },
+  { label: "YouTube", href: SOCIAL_URLS.youtube, icon: Youtube, ariaLabel: "Follow us on YouTube" },
+];
+
+function SocialFallbackLinks() {
+  return (
+    <div className="flex flex-col items-center justify-center gap-4 py-12">
+      <p className="text-lg text-gray-600">Follow us on social media for the latest updates</p>
+      <div className="flex gap-6">
+        {socialLinks.map(({ label, href, icon: Icon, ariaLabel }) => (
+          <a
+            key={label}
+            href={href}
+            target="_blank"
+            rel="noopener noreferrer"
+            aria-label={ariaLabel}
+            className="text-gray-600 hover:text-pc-red transition-colors"
+          >
+            <Icon className="h-8 w-8" />
+          </a>
+        ))}
+      </div>
+    </div>
+  );
+}
+
+const CuratorFeedDynamic = dynamic(
+  () => import("@/components/ui/CuratorFeed"),
+  {
+    ssr: false,
+    loading: () => <SocialFallbackLinks />,
+  }
+);
+
+export default function SocialFeedSection({ feedId, className }: SocialFeedSectionProps) {
+  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "200px 0px" });
+
+  return (
+    <div ref={ref} className={`min-h-[400px] ${className ?? ""}`}>
+      {inView ? <CuratorFeedDynamic feedId={feedId} /> : <SocialFallbackLinks />}
+    </div>
+  );
+}
diff --git a/docs/plans/04-social-media-news-feed/implementation/deep_implement_config.json b/docs/plans/04-social-media-news-feed/implementation/deep_implement_config.json
index d0c71d9..04dfc2a 100644
--- a/docs/plans/04-social-media-news-feed/implementation/deep_implement_config.json
+++ b/docs/plans/04-social-media-news-feed/implementation/deep_implement_config.json
@@ -20,6 +20,10 @@
     "section-01-constants-and-dependencies": {
       "status": "complete",
       "commit_hash": "9d8d71e"
+    },
+    "section-02-curator-feed-component": {
+      "status": "complete",
+      "commit_hash": "27c9f84"
     }
   },
   "pre_commit": {
