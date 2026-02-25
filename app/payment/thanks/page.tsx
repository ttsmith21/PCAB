import type { Metadata } from "next";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import { COMMUNITY_URLS, PAYMENT_URLS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Thank You!",
  description:
    "Thank you for your support of PC Athletic Boosters. Your payment was successful.",
};

export default function ThanksPage() {
  return (
    <main>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-pc-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <FadeIn>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Thank You!
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Your support makes a difference for PC student-athletes.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <FadeIn>
              <Card hover={false}>
                <ol className="space-y-8 list-none p-0 m-0">
                  {/* Step 1 */}
                  <li className="flex gap-4">
                    <div className="bg-pc-red text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-oswald text-xl font-bold uppercase mb-1">
                        Check Your Email
                      </h3>
                      <p className="text-gray-600">
                        Stripe will send you an email receipt for your
                        transaction. For subscription memberships, the receipt
                        confirms your recurring plan details.
                      </p>
                    </div>
                  </li>

                  {/* Step 2 */}
                  <li className="flex gap-4">
                    <div className="bg-pc-red text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-oswald text-xl font-bold uppercase mb-1">
                        Join Our Mailing List
                      </h3>
                      <p className="text-gray-600">
                        Stay up to date with Booster news, events, and
                        volunteer opportunities.{" "}
                        <Link
                          href="/join"
                          className="text-pc-red hover:underline font-semibold"
                        >
                          Join here
                        </Link>
                        .
                      </p>
                    </div>
                  </li>

                  {/* Step 3 */}
                  <li className="flex gap-4">
                    <div className="bg-pc-red text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-oswald text-xl font-bold uppercase mb-1">
                        Follow Us on Facebook
                      </h3>
                      <p className="text-gray-600">
                        <a
                          href={COMMUNITY_URLS.facebookPage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pc-red hover:underline font-semibold"
                        >
                          PC Athletic Boosters Page
                        </a>
                        {" — "}official announcements and updates.
                      </p>
                      <p className="text-gray-600 mt-1">
                        <a
                          href={COMMUNITY_URLS.facebookGroup}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pc-red hover:underline font-semibold"
                        >
                          Community Group
                        </a>
                        {" — "}discussion and connecting with other families.
                      </p>
                    </div>
                  </li>

                  {/* Step 4 */}
                  <li className="flex gap-4">
                    <div className="bg-pc-red text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">
                      4
                    </div>
                    <div>
                      <h3 className="font-oswald text-xl font-bold uppercase mb-1">
                        Manage Your Membership
                      </h3>
                      <p className="text-gray-600">
                        You can manage your billing, update payment methods, or
                        cancel anytime via the{" "}
                        <a
                          href={PAYMENT_URLS.customer_portal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pc-red hover:underline font-semibold"
                        >
                          Stripe Customer Portal
                        </a>
                        .
                      </p>
                    </div>
                  </li>
                </ol>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50 text-center">
        <div className="container mx-auto px-4">
          <FadeIn>
            <Button href="/">Back to Home</Button>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
