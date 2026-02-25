diff --git a/__tests__/components/layout/Footer.test.tsx b/__tests__/components/layout/Footer.test.tsx
index 2083d3b..f186301 100644
--- a/__tests__/components/layout/Footer.test.tsx
+++ b/__tests__/components/layout/Footer.test.tsx
@@ -1,7 +1,7 @@
 import { describe, it, expect, vi } from "vitest";
 import { render, screen } from "@testing-library/react";
 import Footer from "@/components/layout/Footer";
-import { PAYMENT_URLS, COMMUNITY_URLS } from "@/lib/constants";
+import { PAYMENT_URLS, COMMUNITY_URLS, SOCIAL_URLS } from "@/lib/constants";
 
 vi.mock("next/link", () => ({
   default: ({ href, children, ...props }: any) => (
@@ -45,4 +45,42 @@ describe("Footer", () => {
       expect(link.getAttribute("href")).not.toMatch(/boosterhub/i);
     });
   });
+
+  it("renders Facebook link with correct URL from SOCIAL_URLS", () => {
+    render(<Footer />);
+    const link = screen.getByRole("link", { name: /follow us on facebook/i });
+    expect(link).toHaveAttribute("href", SOCIAL_URLS.facebook);
+  });
+
+  it("renders Instagram link with correct URL from SOCIAL_URLS", () => {
+    render(<Footer />);
+    const link = screen.getByRole("link", { name: /follow us on instagram/i });
+    expect(link).toHaveAttribute("href", SOCIAL_URLS.instagram);
+  });
+
+  it("renders YouTube link with correct URL from SOCIAL_URLS", () => {
+    render(<Footer />);
+    const link = screen.getByRole("link", { name: /follow us on youtube/i });
+    expect(link).toHaveAttribute("href", SOCIAL_URLS.youtube);
+  });
+
+  it("social links have target='_blank' and rel='noopener noreferrer'", () => {
+    render(<Footer />);
+    const links = [
+      screen.getByRole("link", { name: /follow us on facebook/i }),
+      screen.getByRole("link", { name: /follow us on instagram/i }),
+      screen.getByRole("link", { name: /follow us on youtube/i }),
+    ];
+    links.forEach((link) => {
+      expect(link).toHaveAttribute("target", "_blank");
+      expect(link).toHaveAttribute("rel", "noopener noreferrer");
+    });
+  });
+
+  it("social links have accessible aria-label attributes", () => {
+    render(<Footer />);
+    expect(screen.getByRole("link", { name: /follow us on facebook/i })).toBeInTheDocument();
+    expect(screen.getByRole("link", { name: /follow us on instagram/i })).toBeInTheDocument();
+    expect(screen.getByRole("link", { name: /follow us on youtube/i })).toBeInTheDocument();
+  });
 });
diff --git a/components/layout/Footer.tsx b/components/layout/Footer.tsx
index c6bab1e..728c3cd 100644
--- a/components/layout/Footer.tsx
+++ b/components/layout/Footer.tsx
@@ -2,7 +2,7 @@ import Link from "next/link";
 import Image from "next/image";
 import { Facebook, Instagram, Twitter, Youtube, Mail, Users, UserPlus } from "lucide-react";
 import { navLinks } from "@/lib/data/nav-links";
-import { SITE_CONFIG, PAYMENT_URLS, COMMUNITY_URLS } from "@/lib/constants";
+import { SITE_CONFIG, PAYMENT_URLS, COMMUNITY_URLS, SOCIAL_URLS } from "@/lib/constants";
 
 export default function Footer() {
   const quickLinks = navLinks.slice(0, 6);
@@ -52,9 +52,10 @@ export default function Footer() {
             <ul className="space-y-3">
               <li>
                 <a
-                  href={SITE_CONFIG.facebookPageUrl}
+                  href={SOCIAL_URLS.facebook}
                   target="_blank"
                   rel="noopener noreferrer"
+                  aria-label="Follow us on Facebook"
                   className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors"
                 >
                   <Facebook className="h-5 w-5" />
@@ -63,9 +64,10 @@ export default function Footer() {
               </li>
               <li>
                 <a
-                  href={SITE_CONFIG.instagramUrl}
+                  href={SOCIAL_URLS.instagram}
                   target="_blank"
                   rel="noopener noreferrer"
+                  aria-label="Follow us on Instagram"
                   className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors"
                 >
                   <Instagram className="h-5 w-5" />
@@ -77,6 +79,7 @@ export default function Footer() {
                   href={SITE_CONFIG.xUrl}
                   target="_blank"
                   rel="noopener noreferrer"
+                  aria-label="Follow us on X"
                   className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors"
                 >
                   <Twitter className="h-5 w-5" />
@@ -85,9 +88,10 @@ export default function Footer() {
               </li>
               <li>
                 <a
-                  href={SITE_CONFIG.youtubeUrl}
+                  href={SOCIAL_URLS.youtube}
                   target="_blank"
                   rel="noopener noreferrer"
+                  aria-label="Follow us on YouTube"
                   className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors"
                 >
                   <Youtube className="h-5 w-5" />
@@ -99,6 +103,7 @@ export default function Footer() {
                   href={COMMUNITY_URLS.facebookGroup}
                   target="_blank"
                   rel="noopener noreferrer"
+                  aria-label="Join our Facebook community group"
                   className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors"
                 >
                   <Users className="h-5 w-5" />
diff --git a/docs/plans/04-social-media-news-feed/implementation/deep_implement_config.json b/docs/plans/04-social-media-news-feed/implementation/deep_implement_config.json
index d848f87..01e7176 100644
--- a/docs/plans/04-social-media-news-feed/implementation/deep_implement_config.json
+++ b/docs/plans/04-social-media-news-feed/implementation/deep_implement_config.json
@@ -36,6 +36,10 @@
     "section-05-news-page-redesign": {
       "status": "complete",
       "commit_hash": "db5dbf5"
+    },
+    "section-06-homepage-modification": {
+      "status": "complete",
+      "commit_hash": "a8256db"
     }
   },
   "pre_commit": {
