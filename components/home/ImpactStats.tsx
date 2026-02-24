"use client";

import AnimatedCounter from "@/components/ui/AnimatedCounter";
import FadeIn from "@/components/ui/FadeIn";

const stats = [
  { end: 40, suffix: "+", label: "Years Serving PC" },
  { end: 146, prefix: "$", suffix: "K+", label: "Raised in 2024" },
  { end: 26, label: "Teams Supported" },
  { end: 400, prefix: "$", suffix: "K", label: "Fieldhouse Investment" },
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
