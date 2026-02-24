diff --git a/app/join/page.tsx b/app/join/page.tsx
new file mode 100644
index 0000000..9b3bf71
--- /dev/null
+++ b/app/join/page.tsx
@@ -0,0 +1,94 @@
+import type { Metadata } from "next";
+import { Bell, Calendar, MessageSquare, Settings } from "lucide-react";
+import SectionHeading from "@/components/ui/SectionHeading";
+import FadeIn from "@/components/ui/FadeIn";
+import Card from "@/components/ui/Card";
+import SignupForm from "@/components/ui/SignupForm";
+
+export const metadata: Metadata = {
+  title: "Join Our Community",
+  description:
+    "Sign up for targeted updates about Port Clinton athletics. Choose the sports, age groups, and communication preferences that matter to you.",
+};
+
+export default function JoinPage() {
+  const benefits = [
+    {
+      icon: Bell,
+      title: "Targeted Announcements",
+      description: "Get updates only for the sports your family cares about.",
+    },
+    {
+      icon: Calendar,
+      title: "Event Updates",
+      description: "Stay on top of schedules, fundraisers, and community events.",
+    },
+    {
+      icon: MessageSquare,
+      title: "Volunteer Opportunities",
+      description: "Be the first to know when help is needed — matched to your interests.",
+    },
+    {
+      icon: Settings,
+      title: "Your Choice",
+      description: "Email, SMS, or both — communicate the way that works for you.",
+    },
+  ];
+
+  return (
+    <main>
+      {/* Hero */}
+      <section className="pt-32 pb-20 bg-pc-dark text-white">
+        <div className="container mx-auto px-4 text-center">
+          <FadeIn>
+            <h1 className="text-5xl md:text-6xl font-bold mb-4">
+              Join Our Community
+            </h1>
+            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
+              Stay connected with PC athletics — get targeted updates for the
+              sports and age groups you care about.
+            </p>
+          </FadeIn>
+        </div>
+      </section>
+
+      {/* Form */}
+      <section className="py-20 bg-white">
+        <div className="container mx-auto px-4">
+          <div className="max-w-2xl mx-auto">
+            <FadeIn>
+              <SignupForm />
+            </FadeIn>
+          </div>
+        </div>
+      </section>
+
+      {/* Value Proposition */}
+      <section className="py-20 bg-gray-50">
+        <div className="container mx-auto px-4">
+          <SectionHeading
+            title="Why Join?"
+            subtitle="Here's what you'll get as part of our community."
+          />
+          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
+            {benefits.map((benefit, index) => (
+              <FadeIn key={benefit.title} delay={index * 0.1}>
+                <Card>
+                  <div className="flex flex-col items-center text-center">
+                    <div className="w-16 h-16 bg-pc-red/10 rounded-full flex items-center justify-center mb-4">
+                      <benefit.icon className="w-8 h-8 text-pc-red" />
+                    </div>
+                    <h3 className="font-oswald text-xl font-bold uppercase mb-2">
+                      {benefit.title}
+                    </h3>
+                    <p className="text-gray-600">{benefit.description}</p>
+                  </div>
+                </Card>
+              </FadeIn>
+            ))}
+          </div>
+        </div>
+      </section>
+    </main>
+  );
+}
diff --git a/app/join/thanks/page.tsx b/app/join/thanks/page.tsx
new file mode 100644
index 0000000..020be25
--- /dev/null
+++ b/app/join/thanks/page.tsx
@@ -0,0 +1,143 @@
+import type { Metadata } from "next";
+import Link from "next/link";
+import Card from "@/components/ui/Card";
+import Button from "@/components/ui/Button";
+import FadeIn from "@/components/ui/FadeIn";
+import { COMMUNITY_URLS } from "@/lib/constants";
+
+export const metadata: Metadata = {
+  title: "Welcome!",
+  description:
+    "You have successfully joined the PC Athletic Boosters community. Check your email to confirm your subscription.",
+};
+
+export default function ThanksPage() {
+  return (
+    <main>
+      {/* Hero */}
+      <section className="pt-32 pb-20 bg-pc-dark text-white">
+        <div className="container mx-auto px-4 text-center">
+          <FadeIn>
+            <h1 className="text-5xl md:text-6xl font-bold mb-4">
+              You&apos;re In!
+            </h1>
+            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
+              Welcome to the PC Athletic Boosters community.
+            </p>
+          </FadeIn>
+        </div>
+      </section>
+
+      {/* Next Steps */}
+      <section className="py-20 bg-white">
+        <div className="container mx-auto px-4">
+          <div className="max-w-2xl mx-auto">
+            <FadeIn>
+              <Card hover={false}>
+                <div className="space-y-8">
+                  {/* Step 1 */}
+                  <div className="flex gap-4">
+                    <div className="bg-pc-red text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">
+                      1
+                    </div>
+                    <div>
+                      <h3 className="font-oswald text-xl font-bold uppercase mb-1">
+                        Check Your Email
+                      </h3>
+                      <p className="text-gray-600">
+                        We sent a confirmation email to activate your subscription.
+                        Click the link inside to start receiving updates.
+                      </p>
+                      <p className="text-sm text-gray-400 mt-1">
+                        If you were already subscribed, you may not receive a new
+                        confirmation email.
+                      </p>
+                    </div>
+                  </div>
+
+                  {/* Step 2 */}
+                  <div className="flex gap-4">
+                    <div className="bg-pc-red text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">
+                      2
+                    </div>
+                    <div>
+                      <h3 className="font-oswald text-xl font-bold uppercase mb-1">
+                        Follow Us on Facebook
+                      </h3>
+                      <p className="text-gray-600">
+                        <a
+                          href={COMMUNITY_URLS.facebookPage}
+                          target="_blank"
+                          rel="noopener noreferrer"
+                          className="text-pc-red hover:underline font-semibold"
+                        >
+                          PC Athletic Boosters Page
+                        </a>
+                        {" — "}official announcements and updates.
+                      </p>
+                      <p className="text-gray-600 mt-1">
+                        <a
+                          href={COMMUNITY_URLS.facebookGroup}
+                          target="_blank"
+                          rel="noopener noreferrer"
+                          className="text-pc-red hover:underline font-semibold"
+                        >
+                          Community Group
+                        </a>
+                        {" — "}discussion and connecting with other families.
+                      </p>
+                    </div>
+                  </div>
+
+                  {/* Step 3 */}
+                  <div className="flex gap-4">
+                    <div className="bg-pc-red text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">
+                      3
+                    </div>
+                    <div>
+                      <h3 className="font-oswald text-xl font-bold uppercase mb-1">
+                        Explore the Site
+                      </h3>
+                      <p className="text-gray-600">
+                        <Link
+                          href="/initiatives"
+                          className="text-pc-red hover:underline font-semibold"
+                        >
+                          See our current initiatives
+                        </Link>
+                        {", "}
+                        <Link
+                          href="/membership"
+                          className="text-pc-red hover:underline font-semibold"
+                        >
+                          become a member
+                        </Link>
+                        {", or "}
+                        <Link
+                          href="/news"
+                          className="text-pc-red hover:underline font-semibold"
+                        >
+                          read the latest news
+                        </Link>
+                        .
+                      </p>
+                    </div>
+                  </div>
+                </div>
+              </Card>
+            </FadeIn>
+          </div>
+        </div>
+      </section>
+
+      {/* CTA */}
+      <section className="py-16 bg-gray-50 text-center">
+        <div className="container mx-auto px-4">
+          <FadeIn>
+            <Button href="/">Back to Home</Button>
+          </FadeIn>
+        </div>
+      </section>
+    </main>
+  );
+}
