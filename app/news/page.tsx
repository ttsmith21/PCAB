import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import SocialFeedSection from "@/components/ui/SocialFeedSection";
import SocialFollowBanner from "@/components/ui/SocialFollowBanner";
import FadeIn from "@/components/ui/FadeIn";
import { CURATOR_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Latest Updates",
  description:
    "Stay up to date with the latest news and announcements from the Port Clinton Athletic Boosters.",
};

export default function NewsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-pc-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <FadeIn>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              News
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Follow along with the latest from PC Boosters across Facebook,
              Instagram, and YouTube.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Social Feed */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Latest Updates"
            subtitle="Follow along with the latest from our Facebook, Instagram, and YouTube channels."
          />
          <FadeIn>
            <SocialFeedSection feedId={CURATOR_CONFIG.feedId} />
          </FadeIn>
        </div>
      </section>

      {/* Social Follow Banner */}
      <SocialFollowBanner />
    </main>
  );
}
