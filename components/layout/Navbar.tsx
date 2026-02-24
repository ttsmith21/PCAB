"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { navLinks } from "@/lib/data/nav-links";
import { SITE_CONFIG, BOOSTERHUB_URLS } from "@/lib/constants";
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
              <a
                href={BOOSTERHUB_URLS.login}
                target="_blank"
                rel="noopener noreferrer"
                className={`hidden lg:inline-block font-oswald text-sm uppercase tracking-wide transition-colors hover:text-pc-red ${
                  scrolled ? "text-gray-700" : "text-white"
                }`}
              >
                Member Login
              </a>
              <a
                href={BOOSTERHUB_URLS.donate}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-oswald text-sm uppercase tracking-wide text-white bg-pc-red rounded-full px-5 py-2 hover:bg-red-700 transition-colors"
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
