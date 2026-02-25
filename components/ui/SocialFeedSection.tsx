"use client";

import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { SOCIAL_URLS } from "@/lib/constants";

interface SocialFeedSectionProps {
  feedId: string;
  className?: string;
}

const socialLinks = [
  { label: "Facebook", href: SOCIAL_URLS.facebook, icon: Facebook, ariaLabel: "Follow us on Facebook" },
  { label: "Instagram", href: SOCIAL_URLS.instagram, icon: Instagram, ariaLabel: "Follow us on Instagram" },
  { label: "YouTube", href: SOCIAL_URLS.youtube, icon: Youtube, ariaLabel: "Follow us on YouTube" },
];

function SocialFallbackLinks() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <p className="text-lg text-gray-600">Follow us on social media for the latest updates</p>
      <div className="flex gap-6">
        {socialLinks.map(({ label, href, icon: Icon, ariaLabel }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
            className="text-gray-600 hover:text-pc-red transition-colors"
          >
            <Icon className="h-8 w-8" />
          </a>
        ))}
      </div>
    </div>
  );
}

const CuratorFeedDynamic = dynamic(
  () => import("@/components/ui/CuratorFeed"),
  {
    ssr: false,
    loading: () => <SocialFallbackLinks />,
  }
);

export default function SocialFeedSection({ feedId, className }: SocialFeedSectionProps) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "200px 0px" });

  return (
    <div ref={ref} className={["min-h-[400px]", className].filter(Boolean).join(" ")}>
      {inView ? <CuratorFeedDynamic feedId={feedId} /> : <SocialFallbackLinks />}
    </div>
  );
}
