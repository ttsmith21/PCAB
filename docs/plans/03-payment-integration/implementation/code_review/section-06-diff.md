diff --git a/__tests__/app/membership/page.test.tsx b/__tests__/app/membership/page.test.tsx
new file mode 100644
index 0000000..49982f8
--- /dev/null
+++ b/__tests__/app/membership/page.test.tsx
@@ -0,0 +1,81 @@
+import { describe, it, expect, vi } from "vitest";
+import { render, screen } from "@testing-library/react";
+
+vi.mock("next/link", () => ({
+  default: ({ href, children, ...props }: any) => (
+    <a href={href} {...props}>
+      {children}
+    </a>
+  ),
+}));
+
+vi.mock("framer-motion", () => ({
+  motion: {
+    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
+  },
+}));
+
+vi.mock("@/components/ui/StripeBuyButton", () => ({
+  default: ({ buyButtonId, className }: any) => (
+    <div
+      data-testid="stripe-buy-button"
+      data-buy-button-id={buyButtonId}
+      className={className}
+    />
+  ),
+}));
+
+// Import after mocks
+import MembershipPage from "@/app/membership/page";
+
+describe("MembershipPage", () => {
+  it("renders 4 membership tier names (Rookie, Captain, All Star, MVP)", () => {
+    render(<MembershipPage />);
+    expect(screen.getByText("Rookie")).toBeInTheDocument();
+    expect(screen.getByText("Captain")).toBeInTheDocument();
+    expect(screen.getByText("All Star")).toBeInTheDocument();
+    expect(screen.getByText("MVP")).toBeInTheDocument();
+  });
+
+  it("displays updated prices ($25, $50, $100, $250)", () => {
+    render(<MembershipPage />);
+    expect(screen.getByText("$25")).toBeInTheDocument();
+    expect(screen.getByText("$50")).toBeInTheDocument();
+    expect(screen.getByText("$100")).toBeInTheDocument();
+    expect(screen.getByText("$250")).toBeInTheDocument();
+  });
+
+  it("renders a StripeBuyButton for each tier", () => {
+    render(<MembershipPage />);
+    const buttons = screen.getAllByTestId("stripe-buy-button");
+    expect(buttons).toHaveLength(4);
+  });
+
+  it("each StripeBuyButton receives a distinct buyButtonId", () => {
+    render(<MembershipPage />);
+    const buttons = screen.getAllByTestId("stripe-buy-button");
+    const ids = buttons.map((btn) => btn.getAttribute("data-buy-button-id"));
+    const uniqueIds = new Set(ids);
+    expect(uniqueIds.size).toBe(4);
+  });
+
+  it("does not contain any BoosterHub URL", () => {
+    const { container } = render(<MembershipPage />);
+    expect(container.innerHTML).not.toMatch(/boosterhub/i);
+  });
+
+  it("does not contain 'secure member portal' disclaimer text", () => {
+    render(<MembershipPage />);
+    expect(
+      screen.queryByText(/secure member portal/i)
+    ).not.toBeInTheDocument();
+  });
+
+  it("bottom CTA links to on-page anchor (not external URL)", () => {
+    render(<MembershipPage />);
+    const ctaLink = screen.getByRole("link", {
+      name: /choose your membership/i,
+    });
+    expect(ctaLink).toHaveAttribute("href", "#tiers");
+  });
+});
diff --git a/app/membership/page.tsx b/app/membership/page.tsx
index 8da8bf8..cefdfc0 100644
--- a/app/membership/page.tsx
+++ b/app/membership/page.tsx
@@ -4,7 +4,7 @@ import SectionHeading from "@/components/ui/SectionHeading";
 import Card from "@/components/ui/Card";
 import Button from "@/components/ui/Button";
 import FadeIn from "@/components/ui/FadeIn";
-import { BOOSTERHUB_URLS } from "@/lib/constants";
+import StripeBuyButton from "@/components/ui/StripeBuyButton";
 
 export const metadata: Metadata = {
   title: "Membership",
@@ -37,10 +37,11 @@ export default function MembershipPage() {
   const tiers = [
     {
       name: "Rookie",
-      price: "$15",
+      price: "$25",
       period: "/year",
       highlighted: false,
       badge: null,
+      buyButtonId: "buy_btn_rookie_placeholder",
       perks: [
         "Official member recognition",
         "Booster decal",
@@ -49,10 +50,11 @@ export default function MembershipPage() {
     },
     {
       name: "Captain",
-      price: "$25",
+      price: "$50",
       period: "/year",
       highlighted: false,
       badge: null,
+      buyButtonId: "buy_btn_captain_placeholder",
       perks: [
         "All Rookie benefits",
         "Booster t-shirt",
@@ -61,10 +63,11 @@ export default function MembershipPage() {
     },
     {
       name: "All Star",
-      price: "$50",
+      price: "$100",
       period: "/year",
       highlighted: true,
       badge: "Most Popular",
+      buyButtonId: "buy_btn_allstar_placeholder",
       perks: [
         "All Captain benefits",
         "Reserved seating section",
@@ -73,10 +76,11 @@ export default function MembershipPage() {
     },
     {
       name: "MVP",
-      price: "$100+",
+      price: "$250",
       period: "/year",
       highlighted: false,
       badge: null,
+      buyButtonId: "buy_btn_mvp_placeholder",
       perks: [
         "All All Star benefits",
         "VIP parking at events",
@@ -129,7 +133,7 @@ export default function MembershipPage() {
       </section>
 
       {/* Tier Comparison */}
-      <section className="py-20 bg-gray-50">
+      <section id="tiers" className="py-20 bg-gray-50">
         <div className="container mx-auto px-4">
           <SectionHeading
             title="Choose Your Level"
@@ -170,13 +174,10 @@ export default function MembershipPage() {
                         </li>
                       ))}
                     </ul>
-                    <Button
-                      href={BOOSTERHUB_URLS.membership}
-                      external
-                      variant={tier.highlighted ? "primary" : "outline"}
-                    >
-                      Join Now
-                    </Button>
+                    <StripeBuyButton
+                      buyButtonId={tier.buyButtonId}
+                      className="mt-4"
+                    />
                   </div>
                 </Card>
               </FadeIn>
@@ -214,13 +215,7 @@ export default function MembershipPage() {
               Become a member today and help us support every student-athlete in
               Port Clinton.
             </p>
-            <Button href={BOOSTERHUB_URLS.membership} external>
-              Become a Member
-            </Button>
-            <p className="text-sm text-gray-400 mt-4">
-              You&apos;ll be taken to our secure member portal to complete
-              registration.
-            </p>
+            <Button href="#tiers">Choose Your Membership</Button>
           </FadeIn>
         </div>
       </section>
