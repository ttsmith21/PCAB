"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { navLinks } from "@/lib/data/nav-links";
import { SITE_CONFIG, PAYMENT_URLS, COMMUNITY_URLS } from "@/lib/constants";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src={SITE_CONFIG.logoUrl}
                alt={SITE_CONFIG.name}
                width={48}
                height={48}
                className="h-10 w-auto lg:h-12"
                priority
              />
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-oswald text-sm uppercase tracking-wide transition-colors hover:text-pc-red ${
                    scrolled ? "text-gray-700" : "text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side: Login, Donate, Hamburger */}
            <div className="flex items-center gap-4">
              {/* Manage Membership dropdown (desktop only) */}
              <div className="hidden lg:block relative group">
                <span
                  className={`font-oswald text-sm uppercase tracking-wide transition-colors cursor-pointer hover:text-pc-red ${
                    scrolled ? "text-gray-700" : "text-white"
                  }`}
                >
                  Manage Membership
                </span>
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-white rounded-lg shadow-lg py-2 min-w-[220px]">
                    <a
                      href={PAYMENT_URLS.customer_portal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-pc-red transition-colors"
                    >
                      Billing &amp; Subscription
                    </a>
                    <a
                      href={COMMUNITY_URLS.mailchimpPreferences}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-pc-red transition-colors"
                    >
                      Email Preferences
                    </a>
                  </div>
                </div>
              </div>
              <a
                href={PAYMENT_URLS.donate}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-oswald text-sm uppercase tracking-wide text-white bg-pc-red rounded-full px-5 py-2 hover:bg-pc-red-dark transition-colors"
              >
                Donate
              </a>
              <button
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                className={`lg:hidden transition-colors hover:text-pc-red ${
                  scrolled ? "text-gray-700" : "text-white"
                }`}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
