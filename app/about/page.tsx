import type { Metadata } from "next";
import { Trophy, Users, Heart } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import { officers, trustees } from "@/lib/data/board";
import { getSportsBySeason, seasonLabels, type Season } from "@/lib/data/sports";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about the Port Clinton Athletic Boosters mission, leadership board, and the sports we support for student-athletes.",
};

export default function AboutPage() {
  const pillars = [
    {
      icon: Trophy,
      title: "Support Athletes",
      description:
        "Encourage personal growth and development by funding equipment upgrades, facility improvements, and program enhancements that help every student-athlete reach their full potential.",
    },
    {
      icon: Users,
      title: "Build Community",
      description:
        "Foster strong partnerships between families, local businesses, coaches, and schools to create a unified support network that uplifts our athletic programs.",
    },
    {
      icon: Heart,
      title: "Bridge the Gap",
      description:
        "Take ownership of the connection between youth and high school athletics, ensuring resources and opportunities are accessible to all students from every background.",
    },
  ];

  const seasons: Season[] = ["fall", "winter", "spring"];

  return (
    <main>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-pc-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <FadeIn>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">About Us</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Dedicated to supporting and enhancing athletic opportunities for
              students in Port Clinton City Schools, fostering a positive
              environment that encourages participation and personal growth from
              youth to high school levels.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Our Mission"
            subtitle="Three pillars that guide everything we do."
          />
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pillars.map((pillar, index) => (
              <FadeIn key={pillar.title} delay={index * 0.1}>
                <Card>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-pc-red/10 rounded-full flex items-center justify-center mb-4">
                      <pillar.icon className="w-8 h-8 text-pc-red" />
                    </div>
                    <h3 className="font-oswald text-xl font-bold uppercase mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-gray-600">{pillar.description}</p>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Our History */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Our History"
            subtitle="Over four decades of service to student-athletes."
          />
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-gray-700 text-lg leading-relaxed">
                Founded in 1983, the Port Clinton Athletic Boosters is an
                all-volunteer 501(c)(3) nonprofit organization. For over 40
                years, the PCAB has been dedicated to supporting student-athletes
                through community fundraising, facility improvements, and
                program development. Our EIN is 34-1365685.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Leadership Board"
            subtitle="Dedicated volunteers leading our mission forward."
          />

          {/* Officers */}
          <div className="max-w-5xl mx-auto mb-12">
            <FadeIn>
              <h3 className="font-oswald text-2xl font-bold uppercase text-center mb-8 text-gray-800">
                Officers
              </h3>
            </FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {officers.map((member, index) => (
                <FadeIn key={member.name} delay={index * 0.1}>
                  <Card>
                    <div className="flex flex-col items-center text-center">
                      <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl font-bold text-gray-400">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <h3 className="font-oswald text-lg font-bold uppercase">
                        {member.name}
                      </h3>
                      <p className="text-pc-red font-semibold">{member.role}</p>
                    </div>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Trustees */}
          <div className="max-w-5xl mx-auto">
            <FadeIn>
              <h3 className="font-oswald text-2xl font-bold uppercase text-center mb-8 text-gray-800">
                Trustees
              </h3>
            </FadeIn>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {trustees.map((member, index) => (
                <FadeIn key={member.name} delay={index * 0.1}>
                  <Card>
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                        <span className="text-xl font-bold text-gray-400">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <h3 className="font-oswald text-base font-bold uppercase">
                        {member.name}
                      </h3>
                      <p className="text-pc-red text-sm font-semibold">
                        {member.role}
                      </p>
                    </div>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community CTA */}
      <section className="py-16 bg-white text-center">
        <div className="container mx-auto px-4">
          <FadeIn>
            <SectionHeading
              title="Get Involved"
              subtitle="Stay connected with everything happening in PC athletics."
            />
            <div className="max-w-xl mx-auto">
              <p className="text-gray-600 mb-8">
                Sign up for targeted updates about the sports, age groups, and
                activities that matter to your family.
              </p>
              <Button href="/join">Join Our Community</Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Sports We Support */}
      <section className="py-20 bg-pc-dark text-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Sports We Support"
            subtitle="Programs we proudly back across all three seasons."
            light
          />
          <div className="max-w-5xl mx-auto space-y-12">
            {seasons.map((season, seasonIndex) => {
              const seasonSports = getSportsBySeason(season);
              return (
                <FadeIn key={season} delay={seasonIndex * 0.1}>
                  <div>
                    <h3 className="font-oswald text-2xl font-bold uppercase mb-6 text-center">
                      {seasonLabels[season]} Season
                    </h3>
                    <div className="flex flex-wrap justify-center gap-3">
                      {seasonSports.map((sport) => {
                        const label =
                          sport.gender === "coed"
                            ? sport.name
                            : `${sport.name} - ${sport.gender === "boys" ? "Boys" : "Girls"}`;
                        return (
                          <span
                            key={`${sport.name}-${sport.gender}`}
                            className="bg-white/10 rounded-full px-4 py-2 text-sm font-medium"
                          >
                            {label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
