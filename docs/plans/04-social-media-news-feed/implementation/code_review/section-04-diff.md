diff --git a/__tests__/components/ui/SocialFollowBanner.test.tsx b/__tests__/components/ui/SocialFollowBanner.test.tsx
new file mode 100644
index 0000000..5e1ba5c
--- /dev/null
+++ b/__tests__/components/ui/SocialFollowBanner.test.tsx
@@ -0,0 +1,58 @@
+import { describe, it, expect } from "vitest";
+import { render, screen } from "@testing-library/react";
+import SocialFollowBanner from "@/components/ui/SocialFollowBanner";
+import { SOCIAL_URLS } from "@/lib/constants";
+
+describe("SocialFollowBanner", () => {
+  it("renders a section element with appropriate heading", () => {
+    render(<SocialFollowBanner />);
+    const section = screen.getByRole("region");
+    expect(section).toBeInTheDocument();
+    const heading = screen.getByRole("heading");
+    expect(heading).toBeInTheDocument();
+  });
+
+  it("contains 'Follow PC Boosters' heading text (or similar)", () => {
+    render(<SocialFollowBanner />);
+    expect(screen.getByRole("heading")).toHaveTextContent(/follow.*pc.*boosters/i);
+  });
+
+  it("renders links for Facebook, Instagram, and YouTube", () => {
+    render(<SocialFollowBanner />);
+    const links = screen.getAllByRole("link");
+    expect(links.length).toBeGreaterThanOrEqual(3);
+  });
+
+  it("links use correct URLs from SOCIAL_URLS", () => {
+    render(<SocialFollowBanner />);
+    const links = screen.getAllByRole("link");
+    const hrefs = links.map((link) => link.getAttribute("href"));
+    expect(hrefs).toContain(SOCIAL_URLS.facebook);
+    expect(hrefs).toContain(SOCIAL_URLS.instagram);
+    expect(hrefs).toContain(SOCIAL_URLS.youtube);
+  });
+
+  it("all links have target='_blank' and rel='noopener noreferrer'", () => {
+    render(<SocialFollowBanner />);
+    const links = screen.getAllByRole("link");
+    links.forEach((link) => {
+      expect(link).toHaveAttribute("target", "_blank");
+      expect(link).toHaveAttribute("rel", "noopener noreferrer");
+    });
+  });
+
+  it("all links have accessible aria-label attributes", () => {
+    render(<SocialFollowBanner />);
+    const links = screen.getAllByRole("link");
+    links.forEach((link) => {
+      expect(link).toHaveAttribute("aria-label");
+      expect(link.getAttribute("aria-label")).not.toBe("");
+    });
+  });
+
+  it("renders social media icons (lucide-react)", () => {
+    const { container } = render(<SocialFollowBanner />);
+    const svgs = container.querySelectorAll("svg");
+    expect(svgs.length).toBeGreaterThanOrEqual(3);
+  });
+});
diff --git a/components/ui/SocialFollowBanner.tsx b/components/ui/SocialFollowBanner.tsx
new file mode 100644
index 0000000..4bd1ff2
--- /dev/null
+++ b/components/ui/SocialFollowBanner.tsx
@@ -0,0 +1,40 @@
+import { Facebook, Instagram, Youtube } from "lucide-react";
+import { SOCIAL_URLS } from "@/lib/constants";
+
+const socialLinks = [
+  { href: SOCIAL_URLS.facebook, icon: Facebook, label: "Follow us on Facebook" },
+  { href: SOCIAL_URLS.instagram, icon: Instagram, label: "Follow us on Instagram" },
+  { href: SOCIAL_URLS.youtube, icon: Youtube, label: "Follow us on YouTube" },
+];
+
+export default function SocialFollowBanner() {
+  return (
+    <section aria-labelledby="social-follow-heading" className="bg-pc-dark py-16">
+      <div className="mx-auto max-w-4xl px-4 text-center">
+        <h2
+          id="social-follow-heading"
+          className="font-oswald text-3xl uppercase tracking-wide text-white"
+        >
+          Follow PC Boosters
+        </h2>
+        <p className="mt-3 text-gray-300">
+          Stay connected with game day updates, highlights, and announcements
+        </p>
+        <div className="mt-8 flex items-center justify-center gap-8">
+          {socialLinks.map(({ href, icon: Icon, label }) => (
+            <a
+              key={label}
+              href={href}
+              target="_blank"
+              rel="noopener noreferrer"
+              aria-label={label}
+              className="text-white opacity-80 transition-all hover:scale-110 hover:opacity-100"
+            >
+              <Icon className="h-10 w-10" />
+            </a>
+          ))}
+        </div>
+      </div>
+    </section>
+  );
+}
