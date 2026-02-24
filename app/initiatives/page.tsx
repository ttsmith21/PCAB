import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import { initiatives } from "@/lib/data/initiatives";
import { BOOSTERHUB_URLS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Initiatives",
  description:
    "See where your money goes. The Port Clinton Athletic Boosters fund equipment, facilities, scholarships, and youth programs.",
};

export default function InitiativesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-pc-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <FadeIn>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Where Your Money Goes
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Every dollar is invested transparently into programs and facilities
              that directly impact our student-athletes.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Initiatives Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Our Initiatives"
            subtitle="See exactly how your contributions are making a difference."
          />
          <div className="max-w-5xl mx-auto space-y-8">
            {initiatives.map((initiative, index) => (
              <FadeIn key={initiative.title} delay={index * 0.1}>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 border-pc-red hover:shadow-xl transition-all duration-300">
                  <div className="md:flex">
                    {/* Photo placeholder */}
                    <div className="md:w-80 h-56 bg-gray-200 flex-shrink-0 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">
                        Photo Coming Soon
                      </span>
                    </div>
                    {/* Content */}
                    <div className="p-8 flex flex-col justify-center">
                      <span className="inline-block bg-pc-red/10 text-pc-red text-xs font-oswald font-bold uppercase tracking-wider py-1 px-3 rounded-full mb-3 w-fit">
                        {initiative.category}
                      </span>
                      <h3 className="font-oswald text-2xl font-bold uppercase mb-3">
                        {initiative.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {initiative.description}
                      </p>
                    </div>
                  </div>
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
              Support Our Initiatives
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Your donation directly funds the programs and facilities that make a
              difference for Port Clinton athletes.
            </p>
            <Button href={BOOSTERHUB_URLS.donate} external>
              Make a Donation
            </Button>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
