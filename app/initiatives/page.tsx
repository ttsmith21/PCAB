import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import { initiatives } from "@/lib/data/initiatives";
import { PAYMENT_URLS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Initiatives",
  description:
    "See where your money goes. The Port Clinton Athletic Boosters fund equipment, facilities, scholarships, and youth programs.",
};

export default function InitiativesPage() {
  const featuredInitiative = initiatives.find((i) => i.featured);
  const regularInitiatives = initiatives.filter((i) => !i.featured);

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

      {/* Featured Initiative */}
      {featuredInitiative && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <FadeIn>
              <p className="text-center text-sm font-oswald font-bold uppercase tracking-widest text-pc-red mb-2">
                Our Flagship Project
              </p>
              <h2 className="text-center text-4xl md:text-5xl font-bold mb-12">
                {featuredInitiative.title}
              </h2>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="md:flex">
                  {/* Photo placeholder — larger for featured */}
                  <div className="w-full md:w-1/2 h-72 md:h-auto min-h-[320px] bg-gray-200 flex-shrink-0 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">
                      Photo Coming Soon
                    </span>
                  </div>
                  {/* Content */}
                  <div className="w-full md:w-1/2 p-10 md:p-12 flex flex-col justify-center">
                    <span className="inline-block bg-pc-red/10 text-pc-red text-xs font-oswald font-bold uppercase tracking-wider py-1 px-3 rounded-full mb-4 w-fit">
                      {featuredInitiative.category}
                    </span>
                    <h3 className="font-oswald text-3xl md:text-4xl font-bold uppercase mb-4">
                      {featuredInitiative.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg mb-6">
                      {featuredInitiative.description}
                    </p>
                    <p className="text-xs font-oswald uppercase tracking-widest text-gray-400">
                      Opened 2021 &bull; 407 Short Street
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Initiatives Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Our Initiatives"
            subtitle="See exactly how your contributions are making a difference."
          />
          <div className="max-w-5xl mx-auto space-y-8">
            {regularInitiatives.map((initiative, index) => (
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

      {/* Donate */}
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
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 max-w-2xl mx-auto mb-8">
              {[
                { amount: 5, label: "$5/mo", url: PAYMENT_URLS.donate_monthly_5 },
                { amount: 10, label: "$10/mo", url: PAYMENT_URLS.donate_monthly_10 },
                { amount: 25, label: "$25/mo", url: PAYMENT_URLS.donate_monthly_25 },
                { amount: 50, label: "$50/mo", url: PAYMENT_URLS.donate_monthly_50 },
                { amount: 100, label: "$100/mo", url: PAYMENT_URLS.donate_monthly_100 },
              ].map((tier) => (
                <Button
                  key={tier.amount}
                  href={tier.url}
                  variant="outline"
                  external
                >
                  {tier.label}
                </Button>
              ))}
            </div>
            <p className="text-gray-400 mb-6">or</p>
            <Button href={PAYMENT_URLS.donate} variant="primary" external>
              Give Any Amount
            </Button>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
