diff --git a/__tests__/app/initiatives/page.test.tsx b/__tests__/app/initiatives/page.test.tsx
new file mode 100644
index 0000000..5a2bf27
--- /dev/null
+++ b/__tests__/app/initiatives/page.test.tsx
@@ -0,0 +1,60 @@
+import { describe, it, expect, vi } from "vitest";
+import { render, screen } from "@testing-library/react";
+import InitiativesPage from "@/app/initiatives/page";
+import { PAYMENT_URLS } from "@/lib/constants";
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
+describe("InitiativesPage", () => {
+  it("renders monthly donation options ($5, $10, $25, $50, $100)", () => {
+    render(<InitiativesPage />);
+    expect(screen.getByText(/\$5\/mo/)).toBeInTheDocument();
+    expect(screen.getByText(/\$10\/mo/)).toBeInTheDocument();
+    expect(screen.getByText(/\$25\/mo/)).toBeInTheDocument();
+    expect(screen.getByText(/\$50\/mo/)).toBeInTheDocument();
+    expect(screen.getByText(/\$100\/mo/)).toBeInTheDocument();
+  });
+
+  it("renders one-time donation option", () => {
+    render(<InitiativesPage />);
+    expect(screen.getByText(/give any amount/i)).toBeInTheDocument();
+  });
+
+  it("monthly donation links point to correct PAYMENT_URLS keys", () => {
+    const { container } = render(<InitiativesPage />);
+    const links = container.querySelectorAll("a[href]");
+    const hrefMap = new Map<string, string>();
+    links.forEach((link) => {
+      const text = link.textContent || "";
+      const href = link.getAttribute("href") || "";
+      if (text.includes("/mo")) hrefMap.set(text.trim(), href);
+    });
+
+    expect(hrefMap.get("$5/mo")).toBe(PAYMENT_URLS.donate_monthly_5);
+    expect(hrefMap.get("$10/mo")).toBe(PAYMENT_URLS.donate_monthly_10);
+    expect(hrefMap.get("$25/mo")).toBe(PAYMENT_URLS.donate_monthly_25);
+    expect(hrefMap.get("$50/mo")).toBe(PAYMENT_URLS.donate_monthly_50);
+    expect(hrefMap.get("$100/mo")).toBe(PAYMENT_URLS.donate_monthly_100);
+  });
+
+  it("one-time donation link points to PAYMENT_URLS.donate", () => {
+    render(<InitiativesPage />);
+    const link = screen.getByRole("link", { name: /give any amount/i });
+    expect(link).toHaveAttribute("href", PAYMENT_URLS.donate);
+  });
+
+  it("does not contain any BoosterHub URL", () => {
+    const { container } = render(<InitiativesPage />);
+    expect(container.innerHTML).not.toMatch(/boosterhub/i);
+  });
+});
diff --git a/app/initiatives/page.tsx b/app/initiatives/page.tsx
index d08b495..86dc6fa 100644
--- a/app/initiatives/page.tsx
+++ b/app/initiatives/page.tsx
@@ -3,7 +3,7 @@ import SectionHeading from "@/components/ui/SectionHeading";
 import Button from "@/components/ui/Button";
 import FadeIn from "@/components/ui/FadeIn";
 import { initiatives } from "@/lib/data/initiatives";
-import { BOOSTERHUB_URLS } from "@/lib/constants";
+import { PAYMENT_URLS } from "@/lib/constants";
 
 export const metadata: Metadata = {
   title: "Initiatives",
@@ -113,7 +113,7 @@ export default function InitiativesPage() {
         </div>
       </section>
 
-      {/* CTA */}
+      {/* Donate */}
       <section className="py-16 bg-pc-dark text-white text-center">
         <div className="container mx-auto px-4">
           <FadeIn>
@@ -124,8 +124,27 @@ export default function InitiativesPage() {
               Your donation directly funds the programs and facilities that make a
               difference for Port Clinton athletes.
             </p>
-            <Button href={BOOSTERHUB_URLS.donate} external>
-              Make a Donation
+            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 max-w-2xl mx-auto mb-8">
+              {[
+                { amount: 5, label: "$5/mo", url: PAYMENT_URLS.donate_monthly_5 },
+                { amount: 10, label: "$10/mo", url: PAYMENT_URLS.donate_monthly_10 },
+                { amount: 25, label: "$25/mo", url: PAYMENT_URLS.donate_monthly_25 },
+                { amount: 50, label: "$50/mo", url: PAYMENT_URLS.donate_monthly_50 },
+                { amount: 100, label: "$100/mo", url: PAYMENT_URLS.donate_monthly_100 },
+              ].map((tier) => (
+                <Button
+                  key={tier.amount}
+                  href={tier.url}
+                  variant="outline"
+                  external
+                >
+                  {tier.label}
+                </Button>
+              ))}
+            </div>
+            <p className="text-gray-400 mb-6">or</p>
+            <Button href={PAYMENT_URLS.donate} external>
+              Give Any Amount
             </Button>
           </FadeIn>
         </div>
