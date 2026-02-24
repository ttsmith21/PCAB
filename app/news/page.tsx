import { Calendar } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import FacebookFeed from "@/components/ui/FacebookFeed";

export default function NewsPage() {
  const events = [
    {
      title: "Spring Sports Kickoff",
      date: "March 2026",
      description:
        "Celebrate the start of spring athletics with a community kickoff event featuring team introductions and family fun.",
    },
    {
      title: "Annual Golf Outing",
      date: "June 2026",
      description:
        "Our biggest fundraiser of the year. Gather your foursome and hit the links to support Port Clinton student-athletes.",
    },
    {
      title: "Back-to-School Night",
      date: "August 2026",
      description:
        "Join us for a community event welcoming athletes and families back for the new school year. Meet coaches and sign up to volunteer.",
    },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-pc-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            News &amp; Events
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Stay up to date with the latest from the Port Clinton Athletic
            Boosters.
          </p>
        </div>
      </section>

      {/* Facebook Feed */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Latest Updates"
            subtitle="Follow along with our latest news and announcements from Facebook."
          />
          <FacebookFeed width={500} height={700} />
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Upcoming Events"
            subtitle="Mark your calendar for these upcoming booster events."
          />
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {events.map((event) => (
              <Card key={event.title}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-pc-red/10 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8 text-pc-red" />
                  </div>
                  <p className="text-pc-red font-semibold text-sm uppercase tracking-wider mb-1">
                    {event.date}
                  </p>
                  <h3 className="font-oswald text-xl font-bold uppercase mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600">{event.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
