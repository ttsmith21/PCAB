diff --git a/__tests__/app/news/page.test.tsx b/__tests__/app/news/page.test.tsx
new file mode 100644
index 0000000..f5c3dc6
--- /dev/null
+++ b/__tests__/app/news/page.test.tsx
@@ -0,0 +1,62 @@
+import { describe, it, expect, vi } from "vitest";
+import { render, screen } from "@testing-library/react";
+
+vi.mock("framer-motion", () => ({
+  motion: {
+    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
+  },
+}));
+
+vi.mock("@/components/ui/SocialFeedSection", () => ({
+  default: ({ feedId, className }: any) => (
+    <div data-testid="social-feed-section" data-feed-id={feedId} className={className} />
+  ),
+}));
+
+vi.mock("@/components/ui/SocialFollowBanner", () => ({
+  default: () => <div data-testid="social-follow-banner" />,
+}));
+
+vi.mock("@/components/ui/FadeIn", () => ({
+  default: ({ children }: any) => <div>{children}</div>,
+}));
+
+import NewsPage from "@/app/news/page";
+import { CURATOR_CONFIG } from "@/lib/constants";
+
+describe("NewsPage", () => {
+  it("renders SocialFeedSection component", () => {
+    render(<NewsPage />);
+    expect(screen.getByTestId("social-feed-section")).toBeInTheDocument();
+  });
+
+  it("passes correct feedId to SocialFeedSection", () => {
+    render(<NewsPage />);
+    const feed = screen.getByTestId("social-feed-section");
+    expect(feed).toHaveAttribute("data-feed-id", CURATOR_CONFIG.feedId);
+  });
+
+  it("renders SocialFollowBanner component", () => {
+    render(<NewsPage />);
+    expect(screen.getByTestId("social-follow-banner")).toBeInTheDocument();
+  });
+
+  it("renders hero section with page heading", () => {
+    render(<NewsPage />);
+    const heading = screen.getByRole("heading", { level: 1 });
+    expect(heading).toBeInTheDocument();
+  });
+
+  it("does not render FacebookFeed component", () => {
+    const { container } = render(<NewsPage />);
+    const iframe = container.querySelector('iframe[title="Facebook Feed"]');
+    expect(iframe).toBeNull();
+  });
+
+  it("does not render Upcoming Events section", () => {
+    render(<NewsPage />);
+    expect(screen.queryByText("Upcoming Events")).not.toBeInTheDocument();
+    expect(screen.queryByText("Spring Sports Kickoff")).not.toBeInTheDocument();
+    expect(screen.queryByText("Annual Golf Outing")).not.toBeInTheDocument();
+  });
+});
diff --git a/app/news/page.tsx b/app/news/page.tsx
index 7e30857..75b6982 100644
--- a/app/news/page.tsx
+++ b/app/news/page.tsx
@@ -1,38 +1,17 @@
 import type { Metadata } from "next";
-import { Calendar } from "lucide-react";
 import SectionHeading from "@/components/ui/SectionHeading";
-import Card from "@/components/ui/Card";
-import FacebookFeed from "@/components/ui/FacebookFeed";
+import SocialFeedSection from "@/components/ui/SocialFeedSection";
+import SocialFollowBanner from "@/components/ui/SocialFollowBanner";
 import FadeIn from "@/components/ui/FadeIn";
+import { CURATOR_CONFIG } from "@/lib/constants";
 
 export const metadata: Metadata = {
-  title: "News & Events",
+  title: "Latest Updates",
   description:
-    "Stay up to date with the latest news, events, and announcements from the Port Clinton Athletic Boosters.",
+    "Stay up to date with the latest news and announcements from the Port Clinton Athletic Boosters.",
 };
 
 export default function NewsPage() {
-  const events = [
-    {
-      title: "Spring Sports Kickoff",
-      date: "March 2026",
-      description:
-        "Celebrate the start of spring athletics with a community kickoff event featuring team introductions and family fun.",
-    },
-    {
-      title: "Annual Golf Outing",
-      date: "June 2026",
-      description:
-        "Our biggest fundraiser of the year. Gather your foursome and hit the links to support Port Clinton student-athletes.",
-    },
-    {
-      title: "Back-to-School Night",
-      date: "August 2026",
-      description:
-        "Join us for a community event welcoming athletes and families back for the new school year. Meet coaches and sign up to volunteer.",
-    },
-  ];
-
   return (
     <main>
       {/* Hero */}
@@ -40,58 +19,31 @@ export default function NewsPage() {
         <div className="container mx-auto px-4 text-center">
           <FadeIn>
             <h1 className="text-5xl md:text-6xl font-bold mb-4">
-              News &amp; Events
+              Latest Updates
             </h1>
             <p className="text-lg text-gray-300 max-w-2xl mx-auto">
-              Stay up to date with the latest from the Port Clinton Athletic
-              Boosters.
+              Follow along with the latest from PC Boosters across Facebook,
+              Instagram, and YouTube.
             </p>
           </FadeIn>
         </div>
       </section>
 
-      {/* Facebook Feed */}
+      {/* Social Feed */}
       <section className="py-20 bg-white">
         <div className="container mx-auto px-4">
           <SectionHeading
             title="Latest Updates"
-            subtitle="Follow along with our latest news and announcements from Facebook."
+            subtitle="Follow along with the latest from our Facebook, Instagram, and YouTube channels."
           />
           <FadeIn>
-            <FacebookFeed width={500} height={700} />
+            <SocialFeedSection feedId={CURATOR_CONFIG.feedId} />
           </FadeIn>
         </div>
       </section>
 
-      {/* Upcoming Events */}
-      <section className="py-20 bg-gray-50">
-        <div className="container mx-auto px-4">
-          <SectionHeading
-            title="Upcoming Events"
-            subtitle="Mark your calendar for these upcoming booster events."
-          />
-          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
-            {events.map((event, index) => (
-              <FadeIn key={event.title} delay={index * 0.1}>
-                <Card>
-                  <div className="flex flex-col items-center text-center">
-                    <div className="w-16 h-16 bg-pc-red/10 rounded-full flex items-center justify-center mb-4">
-                      <Calendar className="w-8 h-8 text-pc-red" />
-                    </div>
-                    <p className="text-pc-red font-semibold text-sm uppercase tracking-wider mb-1">
-                      {event.date}
-                    </p>
-                    <h3 className="font-oswald text-xl font-bold uppercase mb-2">
-                      {event.title}
-                    </h3>
-                    <p className="text-gray-600">{event.description}</p>
-                  </div>
-                </Card>
-              </FadeIn>
-            ))}
-          </div>
-        </div>
-      </section>
+      {/* Social Follow Banner */}
+      <SocialFollowBanner />
     </main>
   );
 }
diff --git a/docs/plans/04-social-media-news-feed/implementation/deep_implement_config.json b/docs/plans/04-social-media-news-feed/implementation/deep_implement_config.json
index 34b2b2c..e8d81dc 100644
--- a/docs/plans/04-social-media-news-feed/implementation/deep_implement_config.json
+++ b/docs/plans/04-social-media-news-feed/implementation/deep_implement_config.json
@@ -28,6 +28,10 @@
     "section-03-social-feed-section-component": {
       "status": "complete",
       "commit_hash": "b6770a3"
+    },
+    "section-04-social-follow-banner-component": {
+      "status": "complete",
+      "commit_hash": "6de5d55"
     }
   },
   "pre_commit": {
