import type { Metadata } from "next";
import { FileText, Mail } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import FaqAccordion from "@/components/ui/FaqAccordion";
import FadeIn from "@/components/ui/FadeIn";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Access Port Clinton Athletic Boosters documents, FAQs, and contact information. Find bylaws, meeting minutes, and financial reports.",
};

export default function ResourcesPage() {
  const documents = [
    {
      title: "Bylaws",
      description: "Our governing documents and organizational rules.",
      href: "#",
      label: "View",
    },
    {
      title: "Meeting Minutes",
      description: "Records from our board meetings.",
      href: "#",
      label: "View",
    },
    {
      title: "Financial Reports",
      description: "Annual reports and financial statements.",
      href: "#",
      label: "Download",
    },
    {
      title: "Volunteer Handbook",
      description: "Everything you need to know as a volunteer.",
      href: "#",
      label: "Download",
    },
  ];

  const faqs = [
    {
      question: "How do I become a member?",
      answer:
        "Visit our membership page, choose your tier, and complete registration through BoosterHub. Membership is open to anyone who wants to support Port Clinton athletics.",
    },
    {
      question: "Is my donation tax-deductible?",
      answer:
        "Yes! We are a registered 501(c)(3) non-profit organization. You will receive a receipt for your records that can be used for tax purposes.",
    },
    {
      question: "How can I volunteer?",
      answer:
        "Check our volunteer page for current opportunities, or contact us directly to discuss how you can help. We have roles for every schedule and skill set.",
    },
    {
      question: "Who do I contact about sponsorship?",
      answer:
        "Email us at info@pcathleticboosters.com or visit our sponsors page for package details and pricing information.",
    },
    {
      question: "How are funds allocated?",
      answer:
        "Our board reviews all funding requests. Priorities include equipment, facilities, scholarships, and youth programs. Financial reports are available in our documents section above.",
    },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-pc-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <FadeIn>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Resources</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Find important documents, answers to common questions, and ways to
              get in touch.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Documents */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Documents & Downloads"
            subtitle="Access our official documents and organizational resources."
          />
          <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {documents.map((doc, index) => (
              <FadeIn key={doc.title} delay={index * 0.1}>
                <Card>
                  <a
                    href={doc.href}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-12 h-12 bg-pc-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-pc-red" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-oswald text-lg font-bold uppercase mb-1 group-hover:text-pc-red transition-colors">
                        {doc.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {doc.description}
                      </p>
                      <span className="text-pc-red text-sm font-semibold uppercase tracking-wider">
                        {doc.label}
                      </span>
                    </div>
                  </a>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Quick answers to the most common questions we receive."
          />
          <FadeIn>
            <FaqAccordion items={faqs} />
          </FadeIn>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Contact Us"
            subtitle="Have a question that is not answered above? Reach out directly."
          />
          <FadeIn>
            <Card className="max-w-lg mx-auto">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-pc-red/10 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-pc-red" />
                </div>
                <h3 className="font-oswald text-xl font-bold uppercase mb-2">
                  General Inquiries
                </h3>
                <p className="text-gray-600 mb-4">
                  For questions, feedback, or partnership inquiries, email us at:
                </p>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-pc-red font-semibold text-lg hover:text-red-600 transition-colors"
                >
                  {SITE_CONFIG.email}
                </a>
              </div>
            </Card>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
