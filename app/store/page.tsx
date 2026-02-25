import type { Metadata } from "next";
import { ShoppingBag } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "Store",
  description:
    "Official Port Clinton Athletic Boosters spirit wear is coming soon. Join our mailing list to be notified when the store launches.",
};

export default function StorePage() {
  const products = [
    {
      title: "Official T-Shirts",
      description: "Rep your school with our classic tees in a variety of styles and colors.",
    },
    {
      title: "Hoodies & Outerwear",
      description: "Stay warm at those Friday night games with premium Redskin gear.",
    },
    {
      title: "Hats & Accessories",
      description: "Caps, lanyards, stickers, and more to show your school spirit everywhere.",
    },
    {
      title: "Game Day Gear",
      description: "Blankets, chairs, and tailgate essentials to make every game day perfect.",
    },
    {
      title: "Youth Sizes",
      description: "Spirit wear for the littlest fans, because Redskin pride starts early.",
    },
    {
      title: "Custom Orders",
      description: "Need something special? We can help with custom gear for your team or group.",
    },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-pc-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <FadeIn>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Gear Up</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Show your Redskin pride with official PC Athletic Boosters gear.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Merchandise Showcase */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Spirit Wear"
            subtitle="Browse our collection of official Port Clinton Athletic Boosters merchandise."
          />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {products.map((product, index) => (
              <FadeIn key={product.title} delay={index * 0.1}>
                <Card>
                  <div className="flex flex-col items-center text-center">
                    <div className="h-48 w-full bg-gray-200 rounded-xl flex items-center justify-center mb-6">
                      <ShoppingBag className="w-16 h-16 text-gray-400" />
                    </div>
                    <h3 className="font-oswald text-xl font-bold uppercase mb-2">
                      {product.title}
                    </h3>
                    <p className="text-gray-600">{product.description}</p>
                  </div>
                </Card>
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
              Spirit Wear Coming Soon
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Our online spirit wear store is coming soon. Join our mailing list
              to be the first to know when it launches.
            </p>
            <Button href="/join">
              Join Our Mailing List
            </Button>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
