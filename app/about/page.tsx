import { Trophy, Users, Heart, Mail } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import { boardMembers } from "@/lib/data/board";
import { teamReps } from "@/lib/data/team-reps";

export default function AboutPage() {
  const pillars = [
    {
      icon: Trophy,
      title: "Support Athletes",
      description:
        "Fund equipment upgrades, facility improvements, and scholarships so every student-athlete can compete at the highest level.",
    },
    {
      icon: Users,
      title: "Build Community",
      description:
        "Connect families, local businesses, and fans into a unified support network that celebrates our athletes.",
    },
    {
      icon: Heart,
      title: "Bridge the Gap",
      description:
        "Coordinate youth programs and high school athletics to build a seamless development pipeline for Port Clinton.",
    },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-pc-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">About Us</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            The Port Clinton Athletic Boosters is a 501(c)(3) nonprofit
            dedicated to fueling excellence for every student-athlete in our
            community.
          </p>
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
            {pillars.map((pillar) => (
              <Card key={pillar.title}>
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
            ))}
          </div>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Leadership Board"
            subtitle="Dedicated volunteers leading our mission forward."
          />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {boardMembers.map((member) => (
              <Card key={member.name}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-gray-400">
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
            ))}
          </div>
        </div>
      </section>

      {/* Team Representatives */}
      <section className="py-20 bg-pc-dark text-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Team Representatives"
            subtitle="Your point of contact for each sport."
            light
          />
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="font-oswald uppercase tracking-wider py-4 px-4 text-gray-300">
                    Sport
                  </th>
                  <th className="font-oswald uppercase tracking-wider py-4 px-4 text-gray-300">
                    Representative
                  </th>
                  <th className="font-oswald uppercase tracking-wider py-4 px-4 text-gray-300">
                    Contact
                  </th>
                </tr>
              </thead>
              <tbody>
                {teamReps.map((rep) => (
                  <tr
                    key={rep.sport}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4 font-semibold">{rep.sport}</td>
                    <td className="py-4 px-4">{rep.name}</td>
                    <td className="py-4 px-4">
                      <a
                        href={`mailto:${rep.email}`}
                        className="inline-flex items-center gap-2 text-pc-red hover:text-red-400 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        <span className="hidden sm:inline">{rep.email}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
