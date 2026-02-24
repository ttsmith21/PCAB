"use client";

import AnimatedCounter from "@/components/ui/AnimatedCounter";
import FadeIn from "@/components/ui/FadeIn";

const stats = [
  { end: 50, suffix: "+", label: "Scholarships Awarded" },
  { end: 15, label: "Sports Supported" },
  { end: 200, suffix: "+", label: "Active Members" },
  { end: 100, prefix: "$", suffix: "K+", label: "Raised Annually" },
];

export default function ImpactStats() {
  return (
    <section className="bg-white py-16 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <FadeIn key={stat.label} delay={index * 0.1}>
              <AnimatedCounter
                end={stat.end}
                prefix={stat.prefix}
                suffix={stat.suffix}
                label={stat.label}
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
