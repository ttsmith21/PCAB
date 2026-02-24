import type { Metadata } from "next";
import { Star, Shield, Users, Check } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import { BOOSTERHUB_URLS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Membership",
  description:
    "Join the Port Clinton Athletic Boosters. Choose from Bronze, Silver, or Gold membership tiers and directly support student-athletes.",
};

export default function MembershipPage() {
  const benefits = [
    {
      icon: Star,
      title: "Exclusive Benefits",
      description:
        "Reserved seating sections, VIP parking at events, and merchandise discounts at the booster store.",
    },
    {
      icon: Shield,
      title: "Support Athletes",
      description:
        "Every dollar goes toward funding equipment, facility upgrades, and opportunities for student-athletes.",
    },
    {
      icon: Users,
      title: "Join the Community",
      description:
        "Connect with fellow supporters, attend exclusive events, and be part of something bigger.",
    },
  ];

  const tiers = [
    {
      name: "Bronze Supporter",
      price: "$50",
      period: "/year",
      highlighted: false,
      badge: null,
      perks: [
        "Name in booster newsletter",
        "Booster decal",
        "Voting rights at meetings",
      ],
    },
    {
      name: "Silver Champion",
      price: "$100",
      period: "/year",
      highlighted: true,
      badge: "Most Popular",
      perks: [
        "All Bronze benefits",
        "Reserved seating section",
        "10% store discount",
      ],
    },
    {
      name: "Gold MVP",
      price: "$250",
      period: "/year",
      highlighted: false,
      badge: null,
      perks: [
        "All Silver benefits",
        "VIP parking at events",
        "Exclusive member events",
        "Recognition on website",
      ],
    },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-pc-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <FadeIn>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Membership</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Join the team behind the teams. Your membership directly fuels
              excellence for Port Clinton student-athletes.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Why Join?"
            subtitle="Membership is more than a donation — it is a commitment to our athletes."
          />
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <FadeIn key={benefit.title} delay={index * 0.1}>
                <Card>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-pc-red/10 rounded-full flex items-center justify-center mb-4">
                      <benefit.icon className="w-8 h-8 text-pc-red" />
                    </div>
                    <h3 className="font-oswald text-xl font-bold uppercase mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Tier Comparison */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Choose Your Level"
            subtitle="Every level makes a real impact."
          />
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {tiers.map((tier, index) => (
              <FadeIn key={tier.name} delay={index * 0.1}>
                <Card
                  className={
                    tier.highlighted
                      ? "border-2 border-pc-red relative"
                      : ""
                  }
                >
                  {tier.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-pc-red text-white text-xs font-oswald font-bold uppercase tracking-wider py-1 px-4 rounded-full">
                        {tier.badge}
                      </span>
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="font-oswald text-xl font-bold uppercase mb-2">
                      {tier.name}
                    </h3>
                    <div className="mb-6">
                      <span className="font-oswald text-5xl font-bold text-pc-dark">
                        {tier.price}
                      </span>
                      <span className="text-gray-500">{tier.period}</span>
                    </div>
                    <ul className="space-y-3 mb-8 text-left">
                      {tier.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-pc-red flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{perk}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      href={BOOSTERHUB_URLS.membership}
                      external
                      variant={tier.highlighted ? "primary" : "outline"}
                    >
                      Join Now
                    </Button>
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
              Ready to Join?
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Become a member today and help us support every student-athlete in
              Port Clinton.
            </p>
            <Button href={BOOSTERHUB_URLS.membership} external>
              Become a Member
            </Button>
            <p className="text-sm text-gray-400 mt-4">
              You&apos;ll be taken to our secure member portal to complete
              registration.
            </p>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
