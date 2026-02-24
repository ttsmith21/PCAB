diff --git a/app/about/page.tsx b/app/about/page.tsx
index 39c7b20..4847980 100644
--- a/app/about/page.tsx
+++ b/app/about/page.tsx
@@ -2,6 +2,7 @@ import type { Metadata } from "next";
 import { Trophy, Users, Heart } from "lucide-react";
 import SectionHeading from "@/components/ui/SectionHeading";
 import Card from "@/components/ui/Card";
+import Button from "@/components/ui/Button";
 import FadeIn from "@/components/ui/FadeIn";
 import { officers, trustees } from "@/lib/data/board";
 import { getSportsBySeason, seasonLabels, type Season } from "@/lib/data/sports";
@@ -175,6 +176,25 @@ export default function AboutPage() {
         </div>
       </section>
 
+      {/* Community CTA */}
+      <section className="py-16 bg-white text-center">
+        <div className="container mx-auto px-4">
+          <FadeIn>
+            <SectionHeading
+              title="Get Involved"
+              subtitle="Stay connected with everything happening in PC athletics."
+            />
+            <div className="max-w-xl mx-auto">
+              <p className="text-gray-600 mb-8">
+                Sign up for targeted updates about the sports, age groups, and
+                activities that matter to your family.
+              </p>
+              <Button href="/join">Join Our Community</Button>
+            </div>
+          </FadeIn>
+        </div>
+      </section>
+
       {/* Sports We Support */}
       <section className="py-20 bg-pc-dark text-white">
         <div className="container mx-auto px-4">
diff --git a/app/membership/page.tsx b/app/membership/page.tsx
index d408cc8..8da8bf8 100644
--- a/app/membership/page.tsx
+++ b/app/membership/page.tsx
@@ -185,6 +185,24 @@ export default function MembershipPage() {
         </div>
       </section>
 
+      {/* Stay Connected CTA */}
+      <section className="py-16 bg-white text-center">
+        <div className="container mx-auto px-4">
+          <FadeIn>
+            <h2 className="text-3xl md:text-4xl font-bold mb-4">
+              Not Ready to Become a Member?
+            </h2>
+            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
+              Stay connected with PC athletics — get targeted updates for
+              the sports and age groups you care about.
+            </p>
+            <Button href="/join" variant="outline">
+              Join Our Community
+            </Button>
+          </FadeIn>
+        </div>
+      </section>
+
       {/* CTA */}
       <section className="py-16 bg-pc-dark text-white text-center">
         <div className="container mx-auto px-4">
diff --git a/app/page.tsx b/app/page.tsx
index 6143fde..d72a760 100644
--- a/app/page.tsx
+++ b/app/page.tsx
@@ -4,6 +4,7 @@ import ActionCards from "@/components/home/ActionCards";
 import InitiativePreview from "@/components/home/InitiativePreview";
 import SponsorShowcase from "@/components/home/SponsorShowcase";
 import SectionHeading from "@/components/ui/SectionHeading";
+import Button from "@/components/ui/Button";
 import FadeIn from "@/components/ui/FadeIn";
 import FacebookFeed from "@/components/ui/FacebookFeed";
 
@@ -14,6 +15,27 @@ export default function Home() {
       <ImpactStats />
       <ActionCards />
       <InitiativePreview />
+
+      {/* Stay Connected CTA */}
+      <section className="py-20 bg-gray-50">
+        <div className="container mx-auto px-4">
+          <FadeIn>
+            <SectionHeading
+              title="Stay Connected"
+              subtitle="Get targeted updates for the sports and age groups you care about."
+            />
+            <div className="max-w-2xl mx-auto text-center">
+              <ul className="text-gray-600 space-y-2 mb-8">
+                <li>Targeted announcements for your kid&apos;s sports</li>
+                <li>Volunteer opportunities and event updates</li>
+                <li>Choose email, SMS, or both</li>
+              </ul>
+              <Button href="/join">Join Our Community</Button>
+            </div>
+          </FadeIn>
+        </div>
+      </section>
+
       <SponsorShowcase />
       <section className="py-20 bg-gray-50">
         <div className="container mx-auto px-4">
diff --git a/app/volunteer/page.tsx b/app/volunteer/page.tsx
index 2c63e1c..47fce09 100644
--- a/app/volunteer/page.tsx
+++ b/app/volunteer/page.tsx
@@ -4,7 +4,7 @@ import SectionHeading from "@/components/ui/SectionHeading";
 import Card from "@/components/ui/Card";
 import Button from "@/components/ui/Button";
 import FadeIn from "@/components/ui/FadeIn";
-import { BOOSTERHUB_URLS } from "@/lib/constants";
+import { COMMUNITY_URLS } from "@/lib/constants";
 
 export const metadata: Metadata = {
   title: "Volunteer",
@@ -195,12 +195,17 @@ export default function VolunteerPage() {
             <p className="text-gray-300 mb-8 max-w-xl mx-auto">
               Sign up today and start making an impact for Port Clinton athletics.
             </p>
-            <Button href={BOOSTERHUB_URLS.volunteer} external>
+            <Button href={COMMUNITY_URLS.signupGenius} external>
               Sign Up to Volunteer
             </Button>
             <p className="text-sm text-gray-400 mt-4">
-              You&apos;ll be taken to our volunteer portal to sign up.
+              You&apos;ll be taken to SignUpGenius to choose your volunteer role.
             </p>
+            <div className="mt-6">
+              <Button href="/join" variant="outline">
+                Join Our Community
+              </Button>
+            </div>
           </FadeIn>
         </div>
       </section>
diff --git a/components/home/ActionCards.tsx b/components/home/ActionCards.tsx
index 30cbcfc..f08e265 100644
--- a/components/home/ActionCards.tsx
+++ b/components/home/ActionCards.tsx
@@ -3,7 +3,7 @@
 import { IdCard, HandHeart, Megaphone } from "lucide-react";
 import Button from "@/components/ui/Button";
 import FadeIn from "@/components/ui/FadeIn";
-import { BOOSTERHUB_URLS } from "@/lib/constants";
+import { BOOSTERHUB_URLS, COMMUNITY_URLS } from "@/lib/constants";
 
 const actions = [
   {
@@ -22,7 +22,7 @@ const actions = [
     title: "Volunteer",
     description:
       "Give your time at concession stands, events, and fundraisers. Every hour you give goes directly to our kids.",
-    href: BOOSTERHUB_URLS.volunteer,
+    href: COMMUNITY_URLS.signupGenius,
     external: true,
     cta: "Sign Up",
     borderColor: "border-pc-dark",
diff --git a/components/layout/Footer.tsx b/components/layout/Footer.tsx
index 9b9d6b2..a8c8a8e 100644
--- a/components/layout/Footer.tsx
+++ b/components/layout/Footer.tsx
@@ -1,8 +1,8 @@
 import Link from "next/link";
 import Image from "next/image";
-import { Facebook, Mail } from "lucide-react";
+import { Facebook, Mail, Users, UserPlus } from "lucide-react";
 import { navLinks } from "@/lib/data/nav-links";
-import { SITE_CONFIG, BOOSTERHUB_URLS } from "@/lib/constants";
+import { SITE_CONFIG, BOOSTERHUB_URLS, COMMUNITY_URLS } from "@/lib/constants";
 
 export default function Footer() {
   const quickLinks = navLinks.slice(0, 6);
@@ -58,9 +58,29 @@ export default function Footer() {
                   className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors"
                 >
                   <Facebook className="h-5 w-5" />
-                  <span>Facebook</span>
+                  <span>Facebook Page</span>
                 </a>
               </li>
+              <li>
+                <a
+                  href={COMMUNITY_URLS.facebookGroup}
+                  target="_blank"
+                  rel="noopener noreferrer"
+                  className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors"
+                >
+                  <Users className="h-5 w-5" />
+                  <span>Community Group</span>
+                </a>
+              </li>
+              <li>
+                <Link
+                  href="/join"
+                  className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors"
+                >
+                  <UserPlus className="h-5 w-5" />
+                  <span>Join Our Community</span>
+                </Link>
+              </li>
               <li>
                 <a
                   href={`mailto:${SITE_CONFIG.email}`}
