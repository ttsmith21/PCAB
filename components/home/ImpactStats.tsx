"use client";

import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function ImpactStats() {
  return (
    <section className="bg-white py-16 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <AnimatedCounter end={50} suffix="+" label="Scholarships Awarded" />
          <AnimatedCounter end={15} label="Sports Supported" />
          <AnimatedCounter end={200} suffix="+" label="Active Members" />
          <AnimatedCounter end={100} prefix="$" suffix="K+" label="Raised Annually" />
        </div>
      </div>
    </section>
  );
}
