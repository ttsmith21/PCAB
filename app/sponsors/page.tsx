import type { Metadata } from "next";
import { Building2, Check, Eye, TrendingUp, Award } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import { sponsors, sponsorshipPackages } from "@/lib/data/sponsors";
import type { SponsorTier } from "@/lib/data/sponsors";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Our Sponsors",
  description:
    "Meet the community partners powering Port Clinton athletics. Explore sponsorship packages and learn how your business can make a difference.",
};

export default function SponsorsPage() {
  const tierConfig: Record<SponsorTier, { label: string; order: number }> = {
    gold: { label: "Gold Partners", order: 1 },
    silver: { label: "Silver Partners", order: 2 },
    bronze: { label: "Bronze Partners", order: 3 },
  };

  const groupedSponsors = (["gold", "silver", "bronze"] as SponsorTier[]).map(
    (tier) => ({
      tier,
      label: tierConfig[tier].label,
      items: sponsors.filter((s) => s.tier === tier),
    })
  );

  const valueProps = [
    {
      icon: Eye,
      title: "Community Visibility",
      description:
        "Your brand seen by thousands of families, fans, and community members at every event throughout the year.",
    },
    {
      icon: TrendingUp,
      title: "Support Local Athletes",
      description:
        "A direct investment in our community and the next generation of Port Clinton leaders.",
    },
    {
      icon: Award,
      title: "Recognition",
      description:
        "Your logo featured on our website, at events, and in print materials reaching the entire community.",
    },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-pc-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <FadeIn>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Sponsors</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Community partnerships that power Port Clinton athletics. Our
              sponsors make it all possible.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Current Sponsors */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Our Partners"
            subtitle="Thank you to the businesses that support our athletes."
          />
          <div className="max-w-5xl mx-auto space-y-12">
            {groupedSponsors.map((group, groupIndex) => (
              <FadeIn key={group.tier} delay={groupIndex * 0.15}>
                <div>
                  <h3 className="font-oswald text-2xl font-bold uppercase text-center mb-6">
                    {group.label}
                  </h3>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {group.items.map((sponsor) => (
                      <Card key={sponsor.name} className="text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <Building2 className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="font-oswald font-bold text-lg">
                            {sponsor.name}
                          </p>
                          <span className="text-sm text-gray-500 capitalize">
                            {sponsor.tier} partner
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship Packages */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Become a Sponsor"
            subtitle="Partner with us and invest in Port Clinton athletics."
          />
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {sponsorshipPackages.map((pkg, index) => (
              <FadeIn key={pkg.tier} delay={index * 0.1}>
                <Card>
                  <div className="text-center">
                    <h3 className="font-oswald text-xl font-bold uppercase mb-2">
                      {pkg.name}
                    </h3>
                    <div className="mb-6">
                      <span className="font-oswald text-5xl font-bold text-pc-dark">
                        {pkg.price}
                      </span>
                      <span className="text-gray-500">/year</span>
                    </div>
                    <ul className="space-y-3 mb-8 text-left">
                      {pkg.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-pc-red flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      href={`mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(`${pkg.name} Sponsorship Inquiry`)}`}
                      external
                    >
                      Get Started
                    </Button>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Why Sponsor */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Why Partner With Us?"
            subtitle="Your sponsorship makes a measurable impact."
          />
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {valueProps.map((prop, index) => (
              <FadeIn key={prop.title} delay={index * 0.1}>
                <Card>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-pc-red/10 rounded-full flex items-center justify-center mb-4">
                      <prop.icon className="w-8 h-8 text-pc-red" />
                    </div>
                    <h3 className="font-oswald text-xl font-bold uppercase mb-2">
                      {prop.title}
                    </h3>
                    <p className="text-gray-600">{prop.description}</p>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-pc-dark text-white text-center">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to Partner?
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Contact us to learn more about sponsorship opportunities and how
              your business can make a difference.
            </p>
            <Button
              href={`mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent("Sponsorship Inquiry")}`}
              external
            >
              Contact Us
            </Button>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
