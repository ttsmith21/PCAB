diff --git a/__tests__/components/layout/Footer.test.tsx b/__tests__/components/layout/Footer.test.tsx
new file mode 100644
index 0000000..2083d3b
--- /dev/null
+++ b/__tests__/components/layout/Footer.test.tsx
@@ -0,0 +1,48 @@
+import { describe, it, expect, vi } from "vitest";
+import { render, screen } from "@testing-library/react";
+import Footer from "@/components/layout/Footer";
+import { PAYMENT_URLS, COMMUNITY_URLS } from "@/lib/constants";
+
+vi.mock("next/link", () => ({
+  default: ({ href, children, ...props }: any) => (
+    <a href={href} {...props}>
+      {children}
+    </a>
+  ),
+}));
+
+vi.mock("next/image", () => ({
+  default: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
+}));
+
+describe("Footer", () => {
+  it("renders 'Billing & Subscription' link with correct href", () => {
+    render(<Footer />);
+    const link = screen.getByRole("link", {
+      name: /billing & subscription/i,
+    });
+    expect(link).toHaveAttribute("href", PAYMENT_URLS.customer_portal);
+  });
+
+  it("renders 'Email Preferences' link with correct href", () => {
+    render(<Footer />);
+    const link = screen.getByRole("link", { name: /email preferences/i });
+    expect(link).toHaveAttribute(
+      "href",
+      COMMUNITY_URLS.mailchimpPreferences
+    );
+  });
+
+  it("does not render 'Member Login' text", () => {
+    render(<Footer />);
+    expect(screen.queryByText(/member login/i)).not.toBeInTheDocument();
+  });
+
+  it("does not contain any BoosterHub URL in any link", () => {
+    const { container } = render(<Footer />);
+    const links = container.querySelectorAll("a[href]");
+    links.forEach((link) => {
+      expect(link.getAttribute("href")).not.toMatch(/boosterhub/i);
+    });
+  });
+});
diff --git a/__tests__/components/layout/MobileMenu.test.tsx b/__tests__/components/layout/MobileMenu.test.tsx
new file mode 100644
index 0000000..1836ed2
--- /dev/null
+++ b/__tests__/components/layout/MobileMenu.test.tsx
@@ -0,0 +1,52 @@
+import { describe, it, expect, vi } from "vitest";
+import { render, screen } from "@testing-library/react";
+import MobileMenu from "@/components/layout/MobileMenu";
+import { PAYMENT_URLS, COMMUNITY_URLS } from "@/lib/constants";
+
+vi.mock("next/link", () => ({
+  default: ({ href, children, ...props }: any) => (
+    <a href={href} {...props}>
+      {children}
+    </a>
+  ),
+}));
+
+describe("MobileMenu", () => {
+  const defaultProps = { isOpen: true, onClose: vi.fn() };
+
+  it("renders a Donate button linking to PAYMENT_URLS.donate", () => {
+    render(<MobileMenu {...defaultProps} />);
+    const donateLink = screen.getByRole("link", { name: /donate/i });
+    expect(donateLink).toHaveAttribute("href", PAYMENT_URLS.donate);
+  });
+
+  it("renders 'Billing & Subscription' link with correct href", () => {
+    render(<MobileMenu {...defaultProps} />);
+    const link = screen.getByRole("link", {
+      name: /billing & subscription/i,
+    });
+    expect(link).toHaveAttribute("href", PAYMENT_URLS.customer_portal);
+  });
+
+  it("renders 'Email Preferences' link with correct href", () => {
+    render(<MobileMenu {...defaultProps} />);
+    const link = screen.getByRole("link", { name: /email preferences/i });
+    expect(link).toHaveAttribute(
+      "href",
+      COMMUNITY_URLS.mailchimpPreferences
+    );
+  });
+
+  it("does not render 'Member Login' text", () => {
+    render(<MobileMenu {...defaultProps} />);
+    expect(screen.queryByText(/member login/i)).not.toBeInTheDocument();
+  });
+
+  it("does not contain any BoosterHub URL in any link", () => {
+    const { container } = render(<MobileMenu {...defaultProps} />);
+    const links = container.querySelectorAll("a[href]");
+    links.forEach((link) => {
+      expect(link.getAttribute("href")).not.toMatch(/boosterhub/i);
+    });
+  });
+});
diff --git a/__tests__/components/layout/Navbar.test.tsx b/__tests__/components/layout/Navbar.test.tsx
new file mode 100644
index 0000000..e8b9b32
--- /dev/null
+++ b/__tests__/components/layout/Navbar.test.tsx
@@ -0,0 +1,70 @@
+import { describe, it, expect, vi } from "vitest";
+import { render, screen } from "@testing-library/react";
+import Navbar from "@/components/layout/Navbar";
+import { PAYMENT_URLS, COMMUNITY_URLS } from "@/lib/constants";
+
+vi.mock("next/link", () => ({
+  default: ({ href, children, ...props }: any) => (
+    <a href={href} {...props}>
+      {children}
+    </a>
+  ),
+}));
+
+vi.mock("next/image", () => ({
+  default: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
+}));
+
+// Mock MobileMenu to avoid rendering complexity
+vi.mock("@/components/layout/MobileMenu", () => ({
+  default: () => null,
+}));
+
+describe("Navbar", () => {
+  it("renders a Donate button linking to PAYMENT_URLS.donate", () => {
+    render(<Navbar />);
+    const donateLink = screen.getByRole("link", { name: /donate/i });
+    expect(donateLink).toHaveAttribute("href", PAYMENT_URLS.donate);
+  });
+
+  it("renders the Donate button with target=_blank for external link behavior", () => {
+    render(<Navbar />);
+    const donateLink = screen.getByRole("link", { name: /donate/i });
+    expect(donateLink).toHaveAttribute("target", "_blank");
+  });
+
+  it("renders a 'Manage Membership' dropdown trigger with correct label", () => {
+    render(<Navbar />);
+    expect(screen.getByText(/manage membership/i)).toBeInTheDocument();
+  });
+
+  it("dropdown contains 'Billing & Subscription' link pointing to PAYMENT_URLS.customer_portal", () => {
+    render(<Navbar />);
+    const link = screen.getByRole("link", {
+      name: /billing & subscription/i,
+    });
+    expect(link).toHaveAttribute("href", PAYMENT_URLS.customer_portal);
+  });
+
+  it("dropdown contains 'Email Preferences' link pointing to COMMUNITY_URLS.mailchimpPreferences", () => {
+    render(<Navbar />);
+    const link = screen.getByRole("link", { name: /email preferences/i });
+    expect(link).toHaveAttribute(
+      "href",
+      COMMUNITY_URLS.mailchimpPreferences
+    );
+  });
+
+  it("does not render 'Member Login' text anywhere", () => {
+    render(<Navbar />);
+    expect(screen.queryByText(/member login/i)).not.toBeInTheDocument();
+  });
+
+  it("does not contain any BoosterHub URL in any link", () => {
+    const { container } = render(<Navbar />);
+    const links = container.querySelectorAll("a[href]");
+    links.forEach((link) => {
+      expect(link.getAttribute("href")).not.toMatch(/boosterhub/i);
+    });
+  });
+});
diff --git a/components/layout/Footer.tsx b/components/layout/Footer.tsx
index a8c8a8e..e681dae 100644
--- a/components/layout/Footer.tsx
+++ b/components/layout/Footer.tsx
@@ -2,7 +2,7 @@ import Link from "next/link";
 import Image from "next/image";
 import { Facebook, Mail, Users, UserPlus } from "lucide-react";
 import { navLinks } from "@/lib/data/nav-links";
-import { SITE_CONFIG, BOOSTERHUB_URLS, COMMUNITY_URLS } from "@/lib/constants";
+import { SITE_CONFIG, PAYMENT_URLS, COMMUNITY_URLS } from "@/lib/constants";
 
 export default function Footer() {
   const quickLinks = navLinks.slice(0, 6);
@@ -92,12 +92,22 @@ export default function Footer() {
               </li>
               <li>
                 <a
-                  href={BOOSTERHUB_URLS.login}
+                  href={PAYMENT_URLS.customer_portal}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-gray-400 text-sm hover:text-white transition-colors"
                 >
-                  Member Login
+                  Billing &amp; Subscription
+                </a>
+              </li>
+              <li>
+                <a
+                  href={COMMUNITY_URLS.mailchimpPreferences}
+                  target="_blank"
+                  rel="noopener noreferrer"
+                  className="text-gray-400 text-sm hover:text-white transition-colors"
+                >
+                  Email Preferences
                 </a>
               </li>
             </ul>
diff --git a/components/layout/MobileMenu.tsx b/components/layout/MobileMenu.tsx
index 34e1f1a..f4d26a8 100644
--- a/components/layout/MobileMenu.tsx
+++ b/components/layout/MobileMenu.tsx
@@ -3,7 +3,7 @@
 import { X } from "lucide-react";
 import Link from "next/link";
 import { navLinks } from "@/lib/data/nav-links";
-import { BOOSTERHUB_URLS } from "@/lib/constants";
+import { PAYMENT_URLS, COMMUNITY_URLS } from "@/lib/constants";
 
 interface MobileMenuProps {
   isOpen: boolean;
@@ -42,17 +42,29 @@ export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
 
       {/* Bottom buttons */}
       <div className="p-6 flex flex-col gap-4">
+        <p className="font-oswald text-sm uppercase tracking-wide text-gray-400 text-center">
+          Manage Membership
+        </p>
         <a
-          href={BOOSTERHUB_URLS.login}
+          href={PAYMENT_URLS.customer_portal}
           target="_blank"
           rel="noopener noreferrer"
           onClick={onClose}
           className="block w-full text-center font-oswald text-lg uppercase tracking-wide text-white border border-white rounded-full py-3 hover:bg-white hover:text-pc-dark transition-colors"
         >
-          Member Login
+          Billing &amp; Subscription
         </a>
         <a
-          href={BOOSTERHUB_URLS.donate}
+          href={COMMUNITY_URLS.mailchimpPreferences}
+          target="_blank"
+          rel="noopener noreferrer"
+          onClick={onClose}
+          className="block w-full text-center font-oswald text-lg uppercase tracking-wide text-white border border-white rounded-full py-3 hover:bg-white hover:text-pc-dark transition-colors"
+        >
+          Email Preferences
+        </a>
+        <a
+          href={PAYMENT_URLS.donate}
           target="_blank"
           rel="noopener noreferrer"
           onClick={onClose}
diff --git a/components/layout/Navbar.tsx b/components/layout/Navbar.tsx
index 5ecbc2a..7cd64eb 100644
--- a/components/layout/Navbar.tsx
+++ b/components/layout/Navbar.tsx
@@ -5,7 +5,7 @@ import Link from "next/link";
 import Image from "next/image";
 import { Menu } from "lucide-react";
 import { navLinks } from "@/lib/data/nav-links";
-import { SITE_CONFIG, BOOSTERHUB_URLS } from "@/lib/constants";
+import { SITE_CONFIG, PAYMENT_URLS, COMMUNITY_URLS } from "@/lib/constants";
 import MobileMenu from "./MobileMenu";
 
 export default function Navbar() {
@@ -76,18 +76,38 @@ export default function Navbar() {
 
             {/* Right side: Login, Donate, Hamburger */}
             <div className="flex items-center gap-4">
+              {/* Manage Membership dropdown (desktop only) */}
+              <div className="hidden lg:block relative group">
+                <span
+                  className={`font-oswald text-sm uppercase tracking-wide transition-colors cursor-pointer hover:text-pc-red ${
+                    scrolled ? "text-gray-700" : "text-white"
+                  }`}
+                >
+                  Manage Membership
+                </span>
+                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
+                  <div className="bg-white rounded-lg shadow-lg py-2 min-w-[220px]">
+                    <a
+                      href={PAYMENT_URLS.customer_portal}
+                      target="_blank"
+                      rel="noopener noreferrer"
+                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-pc-red transition-colors"
+                    >
+                      Billing &amp; Subscription
+                    </a>
+                    <a
+                      href={COMMUNITY_URLS.mailchimpPreferences}
+                      target="_blank"
+                      rel="noopener noreferrer"
+                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-pc-red transition-colors"
+                    >
+                      Email Preferences
+                    </a>
+                  </div>
+                </div>
+              </div>
               <a
-                href={BOOSTERHUB_URLS.login}
-                target="_blank"
-                rel="noopener noreferrer"
-                className={`hidden lg:inline-block font-oswald text-sm uppercase tracking-wide transition-colors hover:text-pc-red ${
-                  scrolled ? "text-gray-700" : "text-white"
-                }`}
-              >
-                Member Login
-              </a>
-              <a
-                href={BOOSTERHUB_URLS.donate}
+                href={PAYMENT_URLS.donate}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-block font-oswald text-sm uppercase tracking-wide text-white bg-pc-red rounded-full px-5 py-2 hover:bg-pc-red-dark transition-colors"
