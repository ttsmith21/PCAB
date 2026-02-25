"use client";

import { IdCard, HandHeart, Megaphone } from "lucide-react";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import { COMMUNITY_URLS } from "@/lib/constants";

const actions = [
  {
    icon: IdCard,
    title: "Membership",
    description:
      "Join our booster family and support every student-athlete in Port Clinton. Members get exclusive perks and event access.",
    href: "/membership",
    external: false,
    cta: "Join Now",
    borderColor: "border-pc-red",
    iconBgHover: "group-hover:bg-pc-red",
  },
  {
    icon: HandHeart,
    title: "Volunteer",
    description:
      "Give your time at concession stands, events, and fundraisers. Every hour you give goes directly to our kids.",
    href: COMMUNITY_URLS.signupGenius,
    external: true,
    cta: "Sign Up",
    borderColor: "border-pc-dark",
    iconBgHover: "group-hover:bg-pc-dark",
  },
  {
    icon: Megaphone,
    title: "Sponsor",
    description:
      "Put your business in front of the community while funding athletics. Multiple sponsorship tiers available.",
    href: "/sponsors",
    external: false,
    cta: "Learn More",
    borderColor: "border-pc-red",
    iconBgHover: "group-hover:bg-pc-red",
  },
];

export default function ActionCards() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto gap-8">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <FadeIn key={action.title} delay={index * 0.1}>
                <div
                  className={`group bg-white rounded-2xl shadow-xl p-8 border-t-8 ${action.borderColor} hover:shadow-glow hover:-translate-y-2 transition-all duration-300`}
                >
                  <div
                    className={`w-16 h-16 rounded-full bg-gray-100 ${action.iconBgHover} flex items-center justify-center mb-6 transition-colors duration-300`}
                  >
                    <Icon className="w-8 h-8 text-gray-600 group-hover:text-white transition-colors duration-300" />
                  </div>

                  <h3 className="font-oswald text-3xl uppercase mb-3">
                    {action.title}
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {action.description}
                  </p>

                  <Button
                    href={action.href}
                    external={action.external}
                    className="w-full"
                  >
                    {action.cta}
                  </Button>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
