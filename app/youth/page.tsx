import type { Metadata } from "next";
import { BookOpen, Calendar, Dumbbell } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "Youth & Community",
  description:
    "Bridging the gap between youth leagues and varsity athletics in Port Clinton. Resources, programs, and coaching support for young athletes.",
};

export default function YouthPage() {
  const resources = [
    {
      icon: BookOpen,
      title: "Coaching Resources",
      description:
        "Training materials, certification guidance, and development programs for youth coaches at every level.",
    },
    {
      icon: Calendar,
      title: "Youth Programs",
      description:
        "Links to local youth league information, registration dates, and seasonal schedules for all sports.",
    },
    {
      icon: Dumbbell,
      title: "Training & Development",
      description:
        "Camps, clinics, and skill-building sessions designed to prepare young athletes for the next level.",
    },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-pc-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <FadeIn>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Youth & Community
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Building the pipeline from youth leagues to varsity.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* The Gap */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="The Challenge"
            subtitle="A gap that needs to be bridged."
          />
          <FadeIn>
            <div className="max-w-3xl mx-auto space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                Port Clinton does not have a parks and recreation department.
                Unlike many communities where a central organization coordinates
                youth athletics, our youth sports programs are fragmented across
                independent leagues and volunteer organizations.
              </p>
              <p>
                This means there is limited coordination between youth programs and
                high school athletics. Young athletes often move through unconnected
                systems with different coaching philosophies, training standards, and
                development goals. The result is a disconnect in athletic
                development that affects student-athletes when they arrive at the
                high school level.
              </p>
              <p>
                Without a unified pathway, talented young athletes can fall through
                the cracks, and the high school programs inherit athletes with
                inconsistent preparation.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Our Vision */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Our Vision"
            subtitle="One Town. One Team. From the ground up."
          />
          <FadeIn>
            <div className="max-w-3xl mx-auto space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                <span className="font-oswald font-bold text-pc-dark uppercase">
                  One Town. One Team.
                </span>{" "}
                is not just a tagline for Friday night football. It is a philosophy
                that applies to every age group, every sport, and every family in
                Port Clinton.
              </p>
              <p>
                The Port Clinton Athletic Boosters serve as the connective tissue
                between youth leagues and high school programs. We work to align
                training philosophies, share resources, and create a clear
                development pipeline so that every young athlete in Port Clinton has
                a pathway from their first practice to varsity competition.
              </p>
              <p>
                By bridging this gap, we ensure that our community builds athletes
                who are prepared, confident, and ready to compete at the highest
                level. When youth leagues and high school programs work together,
                everyone wins.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Youth Resources */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Youth Resources"
            subtitle="Tools and programs to support young athletes and their families."
          />
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {resources.map((resource, index) => (
              <FadeIn key={resource.title} delay={index * 0.1}>
                <Card>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-pc-red/10 rounded-full flex items-center justify-center mb-4">
                      <resource.icon className="w-8 h-8 text-pc-red" />
                    </div>
                    <h3 className="font-oswald text-xl font-bold uppercase mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600">{resource.description}</p>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How to Help */}
      <section className="py-16 bg-pc-dark text-white text-center">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="How You Can Help"
            subtitle="Every contribution strengthens the pipeline."
            light
          />
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
            {[
              {
                title: "Volunteer Coaching",
                text: "Share your knowledge and mentor the next generation of Port Clinton athletes.",
              },
              {
                title: "Equipment Donations",
                text: "Help us ensure every young athlete has the gear they need to participate and improve.",
              },
              {
                title: "Sponsor Youth Teams",
                text: "Support a youth team directly and help cover costs for uniforms, travel, and registration.",
              },
            ].map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.1}>
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="font-oswald text-lg font-bold uppercase mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-sm">{item.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <Button href="/volunteer">Get Involved</Button>
        </div>
      </section>
    </main>
  );
}
