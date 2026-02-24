import type { Metadata } from "next";
import { Heart, Clock, Users, UtensilsCrossed, CalendarCheck, Megaphone, UserCheck, Dumbbell, ClipboardList } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import { BOOSTERHUB_URLS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Volunteer",
  description:
    "Get involved with the Port Clinton Athletic Boosters. Find volunteer opportunities from concession stands to committee roles.",
};

export default function VolunteerPage() {
  const reasons = [
    {
      icon: Heart,
      title: "Make an Impact",
      description:
        "Directly support student-athletes in your community by giving your time where it matters most.",
    },
    {
      icon: Clock,
      title: "Flexible Time",
      description:
        "Opportunities for every schedule, from one-time events to ongoing roles throughout the season.",
    },
    {
      icon: Users,
      title: "Build Connections",
      description:
        "Meet other families and community members who share your passion for Port Clinton athletics.",
    },
  ];

  const opportunities = [
    {
      icon: UtensilsCrossed,
      title: "Concession Stand",
      description:
        "Help serve food and drinks at home games to keep fans fueled and funds flowing.",
    },
    {
      icon: CalendarCheck,
      title: "Event Setup & Teardown",
      description:
        "Assist with fundraising events and athletic events before and after game day.",
    },
    {
      icon: Megaphone,
      title: "Committee Member",
      description:
        "Join a planning committee for fundraising, communications, or membership initiatives.",
    },
    {
      icon: UserCheck,
      title: "Team Representative",
      description:
        "Serve as the booster liaison for a specific sport, connecting families and the organization.",
    },
    {
      icon: Dumbbell,
      title: "Youth Coaching Support",
      description:
        "Help with youth athletic programs and clinics that develop the next generation of Redskins.",
    },
    {
      icon: ClipboardList,
      title: "Administrative Support",
      description:
        "Help with data entry, communications, social media, and day-to-day booster operations.",
    },
  ];

  const commitments = [
    {
      role: "Event Volunteers",
      time: "2-4 hours per event",
      detail: "A few times per season, typically during home games and fundraisers.",
    },
    {
      role: "Committee Members",
      time: "2-3 hours per month",
      detail: "Regular meetings plus planning and coordination between sessions.",
    },
    {
      role: "Team Representatives",
      time: "1-2 hours per week",
      detail: "During your sport's season, serving as the link between families and the boosters.",
    },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-pc-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <FadeIn>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Volunteer</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Make a difference for Port Clinton student-athletes. Your time and
              talents help build a stronger athletics community.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Why Volunteer */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Why Volunteer?"
            subtitle="There are plenty of reasons to get involved."
          />
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {reasons.map((reason, index) => (
              <FadeIn key={reason.title} delay={index * 0.1}>
                <Card>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-pc-red/10 rounded-full flex items-center justify-center mb-4">
                      <reason.icon className="w-8 h-8 text-pc-red" />
                    </div>
                    <h3 className="font-oswald text-xl font-bold uppercase mb-2">
                      {reason.title}
                    </h3>
                    <p className="text-gray-600">{reason.description}</p>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Current Opportunities */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Current Opportunities"
            subtitle="Find a role that fits your skills and schedule."
          />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {opportunities.map((opp, index) => (
              <FadeIn key={opp.title} delay={index * 0.1}>
                <Card>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-pc-red/10 rounded-full flex items-center justify-center mb-4">
                      <opp.icon className="w-8 h-8 text-pc-red" />
                    </div>
                    <h3 className="font-oswald text-xl font-bold uppercase mb-2">
                      {opp.title}
                    </h3>
                    <p className="text-gray-600">{opp.description}</p>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Time Commitment */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="What to Expect"
            subtitle="An honest look at the time commitment for each role."
          />
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {commitments.map((item, index) => (
              <FadeIn key={item.role} delay={index * 0.1}>
                <div className="text-center">
                  <h3 className="font-oswald text-lg font-bold uppercase mb-1">
                    {item.role}
                  </h3>
                  <p className="text-pc-red font-semibold text-lg mb-2">
                    {item.time}
                  </p>
                  <p className="text-gray-600 text-sm">{item.detail}</p>
                </div>
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
              Ready to Get Involved?
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Sign up today and start making an impact for Port Clinton athletics.
            </p>
            <Button href={BOOSTERHUB_URLS.volunteer} external>
              Sign Up to Volunteer
            </Button>
            <p className="text-sm text-gray-400 mt-4">
              You&apos;ll be taken to our volunteer portal to sign up.
            </p>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
