import Hero from "@/components/home/Hero";
import ImpactStats from "@/components/home/ImpactStats";
import ActionCards from "@/components/home/ActionCards";
import InitiativePreview from "@/components/home/InitiativePreview";
import SponsorShowcase from "@/components/home/SponsorShowcase";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import SocialFeedSection from "@/components/ui/SocialFeedSection";
import { CURATOR_CONFIG } from "@/lib/constants";

export default function Home() {
  return (
    <main>
      <Hero />
      <ImpactStats />
      <ActionCards />
      <InitiativePreview />

      {/* Stay Connected CTA */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <FadeIn>
            <SectionHeading
              title="Stay Connected"
              subtitle="Get targeted updates for the sports and age groups you care about."
            />
            <div className="max-w-2xl mx-auto text-center">
              <ul className="text-gray-600 space-y-2 mb-8 list-disc list-inside">
                <li>Targeted announcements for your kid&apos;s sports</li>
                <li>Volunteer opportunities and event updates</li>
                <li>Choose email, SMS, or both</li>
              </ul>
              <Button href="/join">Join Our Community</Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <SponsorShowcase />
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <FadeIn>
            <SectionHeading
              title="Live From the Field"
              subtitle="Follow us on Facebook, Instagram, and YouTube for the latest updates, photos, and game results."
            />
            <SocialFeedSection feedId={CURATOR_CONFIG.feedId} />
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
