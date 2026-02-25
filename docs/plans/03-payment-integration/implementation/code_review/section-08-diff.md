diff --git a/__tests__/app/resources/page.test.tsx b/__tests__/app/resources/page.test.tsx
new file mode 100644
index 0000000..f65900a
--- /dev/null
+++ b/__tests__/app/resources/page.test.tsx
@@ -0,0 +1,30 @@
+import { describe, it, expect, vi } from "vitest";
+import { render } from "@testing-library/react";
+import ResourcesPage from "@/app/resources/page";
+
+vi.mock("next/link", () => ({
+  default: ({ href, children, ...props }: any) => (
+    <a href={href} {...props}>
+      {children}
+    </a>
+  ),
+}));
+
+vi.mock("@/components/ui/FadeIn", () => ({
+  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
+}));
+
+describe("ResourcesPage", () => {
+  it('does not contain "BoosterHub" text in FAQ content', () => {
+    const { container } = render(<ResourcesPage />);
+    expect(container.textContent).not.toMatch(/boosterhub/i);
+  });
+
+  it("does not contain any BoosterHub URL in any link", () => {
+    const { container } = render(<ResourcesPage />);
+    const allLinks = container.querySelectorAll("a");
+    allLinks.forEach((link) => {
+      expect(link.getAttribute("href")).not.toMatch(/boosterhub/i);
+    });
+  });
+});
diff --git a/__tests__/app/store/page.test.tsx b/__tests__/app/store/page.test.tsx
new file mode 100644
index 0000000..354ab0d
--- /dev/null
+++ b/__tests__/app/store/page.test.tsx
@@ -0,0 +1,37 @@
+import { describe, it, expect, vi } from "vitest";
+import { render, screen } from "@testing-library/react";
+import StorePage from "@/app/store/page";
+
+vi.mock("next/link", () => ({
+  default: ({ href, children, ...props }: any) => (
+    <a href={href} {...props}>
+      {children}
+    </a>
+  ),
+}));
+
+vi.mock("@/components/ui/FadeIn", () => ({
+  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
+}));
+
+describe("StorePage", () => {
+  it("does not link to the BoosterHub store", () => {
+    const { container } = render(<StorePage />);
+    const allLinks = container.querySelectorAll("a");
+    allLinks.forEach((link) => {
+      expect(link.getAttribute("href")).not.toMatch(/boosterhub/i);
+    });
+  });
+
+  it("indicates spirit wear is coming soon", () => {
+    render(<StorePage />);
+    const matches = screen.getAllByText(/coming soon/i);
+    expect(matches.length).toBeGreaterThan(0);
+  });
+
+  it("links to /join or mailing list signup", () => {
+    const { container } = render(<StorePage />);
+    const joinLink = container.querySelector('a[href="/join"]');
+    expect(joinLink).toBeTruthy();
+  });
+});
diff --git a/__tests__/app/volunteer/page.test.tsx b/__tests__/app/volunteer/page.test.tsx
new file mode 100644
index 0000000..24387d6
--- /dev/null
+++ b/__tests__/app/volunteer/page.test.tsx
@@ -0,0 +1,35 @@
+import { describe, it, expect, vi } from "vitest";
+import { render } from "@testing-library/react";
+import { COMMUNITY_URLS } from "@/lib/constants";
+import VolunteerPage from "@/app/volunteer/page";
+
+vi.mock("next/link", () => ({
+  default: ({ href, children, ...props }: any) => (
+    <a href={href} {...props}>
+      {children}
+    </a>
+  ),
+}));
+
+vi.mock("@/components/ui/FadeIn", () => ({
+  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
+}));
+
+describe("VolunteerPage", () => {
+  it("volunteer signup link points to SignUpGenius", () => {
+    const { container } = render(<VolunteerPage />);
+    const allLinks = container.querySelectorAll("a");
+    const signupLink = Array.from(allLinks).find((link) =>
+      link.getAttribute("href")?.includes("signupgenius")
+    );
+    expect(signupLink).toBeTruthy();
+  });
+
+  it("does not contain any BoosterHub URL", () => {
+    const { container } = render(<VolunteerPage />);
+    const allLinks = container.querySelectorAll("a");
+    allLinks.forEach((link) => {
+      expect(link.getAttribute("href")).not.toMatch(/boosterhub/i);
+    });
+  });
+});
diff --git a/__tests__/components/home/ActionCards.test.tsx b/__tests__/components/home/ActionCards.test.tsx
new file mode 100644
index 0000000..cf60ec8
--- /dev/null
+++ b/__tests__/components/home/ActionCards.test.tsx
@@ -0,0 +1,37 @@
+import { describe, it, expect, vi } from "vitest";
+import { render, screen } from "@testing-library/react";
+import ActionCards from "@/components/home/ActionCards";
+
+vi.mock("next/link", () => ({
+  default: ({ href, children, ...props }: any) => (
+    <a href={href} {...props}>
+      {children}
+    </a>
+  ),
+}));
+
+vi.mock("@/components/ui/FadeIn", () => ({
+  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
+}));
+
+describe("ActionCards", () => {
+  it("renders the membership action card with a link to /membership (internal route)", () => {
+    render(<ActionCards />);
+    const joinLink = screen.getByRole("link", { name: /join now/i });
+    expect(joinLink).toHaveAttribute("href", "/membership");
+  });
+
+  it("membership action card is NOT an external link (no target=_blank)", () => {
+    render(<ActionCards />);
+    const joinLink = screen.getByRole("link", { name: /join now/i });
+    expect(joinLink).not.toHaveAttribute("target", "_blank");
+  });
+
+  it("does not contain any BoosterHub URL in any action card link", () => {
+    const { container } = render(<ActionCards />);
+    const allLinks = container.querySelectorAll("a");
+    allLinks.forEach((link) => {
+      expect(link.getAttribute("href")).not.toMatch(/boosterhub/i);
+    });
+  });
+});
diff --git a/app/resources/page.tsx b/app/resources/page.tsx
index 24a23a0..e4df937 100644
--- a/app/resources/page.tsx
+++ b/app/resources/page.tsx
@@ -44,7 +44,7 @@ export default function ResourcesPage() {
     {
       question: "How do I become a member?",
       answer:
-        "Visit our membership page, choose your tier, and complete registration through BoosterHub. Membership is open to anyone who wants to support Port Clinton athletics.",
+        "Visit our membership page, choose your tier, and complete your purchase right on the page. Membership is open to anyone who wants to support Port Clinton athletics.",
     },
     {
       question: "Is my donation tax-deductible?",
diff --git a/app/store/page.tsx b/app/store/page.tsx
index 6332fb1..3cfa93c 100644
--- a/app/store/page.tsx
+++ b/app/store/page.tsx
@@ -4,7 +4,6 @@ import SectionHeading from "@/components/ui/SectionHeading";
 import Card from "@/components/ui/Card";
 import Button from "@/components/ui/Button";
 import FadeIn from "@/components/ui/FadeIn";
-import { BOOSTERHUB_URLS } from "@/lib/constants";
 
 export const metadata: Metadata = {
   title: "Store",
@@ -86,17 +85,15 @@ export default function StorePage() {
         <div className="container mx-auto px-4">
           <FadeIn>
             <h2 className="text-4xl md:text-5xl font-bold mb-4">
-              Ready to Shop?
+              Spirit Wear Coming Soon
             </h2>
             <p className="text-gray-300 mb-8 max-w-xl mx-auto">
-              Browse our full catalog and checkout on our secure store.
+              Our online spirit wear store is coming soon. Join our mailing list
+              to be the first to know when it launches.
             </p>
-            <Button href={BOOSTERHUB_URLS.store} external>
-              Shop Now
+            <Button href="/join">
+              Join Our Mailing List
             </Button>
-            <p className="text-sm text-gray-400 mt-4">
-              You&apos;ll be taken to our online store to browse and purchase.
-            </p>
           </FadeIn>
         </div>
       </section>
diff --git a/components/home/ActionCards.tsx b/components/home/ActionCards.tsx
index f08e265..5e801f0 100644
--- a/components/home/ActionCards.tsx
+++ b/components/home/ActionCards.tsx
@@ -3,7 +3,7 @@
 import { IdCard, HandHeart, Megaphone } from "lucide-react";
 import Button from "@/components/ui/Button";
 import FadeIn from "@/components/ui/FadeIn";
-import { BOOSTERHUB_URLS, COMMUNITY_URLS } from "@/lib/constants";
+import { COMMUNITY_URLS } from "@/lib/constants";
 
 const actions = [
   {
@@ -11,8 +11,8 @@ const actions = [
     title: "Membership",
     description:
       "Join our booster family and support every student-athlete in Port Clinton. Members get exclusive perks and event access.",
-    href: BOOSTERHUB_URLS.membership,
-    external: true,
+    href: "/membership",
+    external: false,
     cta: "Join Now",
     borderColor: "border-pc-red",
     iconBgHover: "group-hover:bg-pc-red",
diff --git a/docs/plans/03-payment-integration/implementation/deep_implement_config.json b/docs/plans/03-payment-integration/implementation/deep_implement_config.json
index bf46866..b4941e9 100644
--- a/docs/plans/03-payment-integration/implementation/deep_implement_config.json
+++ b/docs/plans/03-payment-integration/implementation/deep_implement_config.json
@@ -21,6 +21,30 @@
     "section-01-test-setup": {
       "status": "complete",
       "commit_hash": "cced067"
+    },
+    "section-02-constants": {
+      "status": "complete",
+      "commit_hash": "31a7a5d"
+    },
+    "section-03-buy-button": {
+      "status": "complete",
+      "commit_hash": "4d7be2f"
+    },
+    "section-04-payment-thanks": {
+      "status": "complete",
+      "commit_hash": "7549786"
+    },
+    "section-05-navigation": {
+      "status": "complete",
+      "commit_hash": "f1bd78f"
+    },
+    "section-06-membership": {
+      "status": "complete",
+      "commit_hash": "daadb97"
+    },
+    "section-07-initiatives": {
+      "status": "complete",
+      "commit_hash": "b7476f9"
     }
   },
   "pre_commit": {
