"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import { initiatives } from "@/lib/data/initiatives";

export default function InitiativePreview() {
  const featured = initiatives.slice(0, 3);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Where Your Money Goes"
          subtitle="Every dollar of support translates directly into opportunities for Port Clinton student-athletes."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featured.map((initiative, index) => (
            <FadeIn key={initiative.title} delay={index * 0.1}>
              <div className="bg-white rounded-xl shadow-md border-l-4 border-pc-red overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Photo placeholder */}
                <div className="relative h-48 bg-gray-200">
                  <span className="absolute top-3 left-3 bg-pc-red text-white text-xs font-oswald uppercase tracking-wider px-3 py-1 rounded-full">
                    {initiative.category}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="font-oswald text-xl font-bold uppercase mb-2">
                    {initiative.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {initiative.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button href="/initiatives" variant="outline">
            See All Initiatives
          </Button>
        </div>
      </div>
    </section>
  );
}
