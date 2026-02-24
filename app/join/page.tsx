import type { Metadata } from "next";
import { Bell, Calendar, MessageSquare, Settings } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import Card from "@/components/ui/Card";
import SignupForm from "@/components/ui/SignupForm";

export const metadata: Metadata = {
  title: "Join Our Community",
  description:
    "Sign up for targeted updates about Port Clinton athletics. Choose the sports, age groups, and communication preferences that matter to you.",
};

export default function JoinPage() {
  const benefits = [
    {
      icon: Bell,
      title: "Targeted Announcements",
      description: "Get updates only for the sports your family cares about.",
    },
    {
      icon: Calendar,
      title: "Event Updates",
      description: "Stay on top of schedules, fundraisers, and community events.",
    },
    {
      icon: MessageSquare,
      title: "Volunteer Opportunities",
      description: "Be the first to know when help is needed — matched to your interests.",
    },
    {
      icon: Settings,
      title: "Your Choice",
      description: "Email, SMS, or both — communicate the way that works for you.",
    },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-pc-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <FadeIn>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Join Our Community
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Stay connected with PC athletics — get targeted updates for the
              sports and age groups you care about.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <FadeIn>
              <SignupForm />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Why Join?"
            subtitle="Here's what you'll get as part of our community."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
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
    </main>
  );
}
