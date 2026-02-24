import { Building2 } from "lucide-react";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import { sponsors } from "@/lib/data/sponsors";

export default function SponsorShowcase() {
  const goldSponsors = sponsors.filter((s) => s.tier === "gold");

  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="container mx-auto px-4 text-center">
        <FadeIn>
          <h2 className="font-oswald text-2xl text-gray-400 uppercase tracking-widest mb-10">
            Proud Community Partners
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-10 mb-10">
            {goldSponsors.map((sponsor) => (
              <div
                key={sponsor.name}
                className="flex items-center gap-3 text-gray-500 hover:text-pc-dark transition-colors duration-300"
              >
                <Building2 className="w-8 h-8" />
                <span className="font-oswald text-lg uppercase tracking-wide">
                  {sponsor.name}
                </span>
              </div>
            ))}
          </div>

          <Button href="/sponsors" variant="outline">
            View All Partners
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
