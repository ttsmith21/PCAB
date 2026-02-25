import { Facebook, Instagram, Youtube } from "lucide-react";
import { SOCIAL_URLS } from "@/lib/constants";

const socialLinks = [
  { href: SOCIAL_URLS.facebook, icon: Facebook, label: "Follow us on Facebook" },
  { href: SOCIAL_URLS.instagram, icon: Instagram, label: "Follow us on Instagram" },
  { href: SOCIAL_URLS.youtube, icon: Youtube, label: "Follow us on YouTube" },
];

export default function SocialFollowBanner() {
  return (
    <section aria-labelledby="social-follow-heading" className="bg-pc-dark py-16">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2
          id="social-follow-heading"
          className="font-oswald text-3xl uppercase tracking-wide text-white"
        >
          Follow PC Boosters
        </h2>
        <p className="mt-3 text-gray-300">
          Stay connected with game day updates, highlights, and announcements
        </p>
        <div className="mt-8 flex items-center justify-center gap-8">
          {socialLinks.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="rounded text-white opacity-80 transition-all hover:scale-110 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Icon className="h-10 w-10" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
