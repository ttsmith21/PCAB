import Hero from "@/components/home/Hero";
import ImpactStats from "@/components/home/ImpactStats";
import ActionCards from "@/components/home/ActionCards";
import InitiativePreview from "@/components/home/InitiativePreview";
import SponsorShowcase from "@/components/home/SponsorShowcase";
import SectionHeading from "@/components/ui/SectionHeading";
import FacebookFeed from "@/components/ui/FacebookFeed";

export default function Home() {
  return (
    <main>
      <Hero />
      <ImpactStats />
      <ActionCards />
      <InitiativePreview />
      <SponsorShowcase />
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Live From the Field"
            subtitle="Follow us on Facebook for the latest updates, photos, and game results."
          />
          <FacebookFeed width={500} height={600} />
        </div>
      </section>
    </main>
  );
}
