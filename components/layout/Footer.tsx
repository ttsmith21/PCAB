import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Youtube, Mail, Users, UserPlus } from "lucide-react";
import { navLinks } from "@/lib/data/nav-links";
import { SITE_CONFIG, PAYMENT_URLS, COMMUNITY_URLS, SOCIAL_URLS } from "@/lib/constants";

export default function Footer() {
  const quickLinks = navLinks.slice(0, 6);

  return (
    <footer className="bg-pc-dark text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Brand */}
          <div>
            <Image
              src={SITE_CONFIG.logoUrl}
              alt={SITE_CONFIG.name}
              width={48}
              height={48}
              className="h-12 w-auto brightness-0 invert opacity-70 mb-4"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              {SITE_CONFIG.description}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-oswald text-pc-red uppercase text-lg tracking-wide mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Connect */}
          <div>
            <h3 className="font-oswald text-pc-red uppercase text-lg tracking-wide mb-4">
              Connect
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={SOCIAL_URLS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Facebook"
                  className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_URLS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                  className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.xUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on X"
                  className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                  <span>X / Twitter</span>
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_URLS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on YouTube"
                  className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors"
                >
                  <Youtube className="h-5 w-5" />
                  <span>YouTube</span>
                </a>
              </li>
              <li>
                <a
                  href={COMMUNITY_URLS.facebookGroup}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Join our Facebook community group"
                  className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors"
                >
                  <Users className="h-5 w-5" />
                  <span>Community Group</span>
                </a>
              </li>
              <li>
                <Link
                  href="/join"
                  className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Join Our Community</span>
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  <span>{SITE_CONFIG.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={PAYMENT_URLS.customer_portal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Billing &amp; Subscription
                </a>
              </li>
              <li>
                <a
                  href={COMMUNITY_URLS.mailchimpPreferences}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Email Preferences
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-xs">
          <p>
            Port Clinton Athletic Boosters is a registered 501(c)(3) nonprofit
            organization.
          </p>
          <p className="mt-1">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
