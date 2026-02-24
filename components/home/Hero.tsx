import Button from "@/components/ui/Button";
import { BOOSTERHUB_URLS } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background — swap the bg-pc-dark for a background image when ready */}
      {/* Example: style={{ backgroundImage: "url('/images/hero.jpg')" }} + bg-cover bg-center */}
      <div className="absolute inset-0 bg-pc-dark" />

      {/* Dark overlay layers for contrast */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold leading-tight tracking-tight">
          <span className="block text-white">ONE TOWN.</span>
          <span className="block text-pc-red">ONE TEAM.</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
          Fueling excellence for Port Clinton athletes — from youth leagues to
          varsity.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href={BOOSTERHUB_URLS.membership} external>
            Become a Member
          </Button>
          <Button
            href={BOOSTERHUB_URLS.donate}
            variant="outline"
            external
            className="border-white text-white hover:bg-white hover:text-pc-dark"
          >
            Make a Donation
          </Button>
        </div>
      </div>
    </section>
  );
}
