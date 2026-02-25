"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { navLinks } from "@/lib/data/nav-links";
import { PAYMENT_URLS, COMMUNITY_URLS } from "@/lib/constants";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-pc-dark/95 backdrop-blur flex flex-col">
      {/* Close button */}
      <div className="flex justify-end p-6">
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="text-white hover:text-pc-red transition-colors"
        >
          <X className="h-8 w-8" />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 flex flex-col items-center justify-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="font-oswald text-2xl text-white uppercase tracking-wide hover:text-pc-red transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Bottom buttons */}
      <div className="p-6 flex flex-col gap-4">
        <p className="font-oswald text-sm uppercase tracking-wide text-gray-400 text-center">
          Manage Membership
        </p>
        <a
          href={PAYMENT_URLS.customer_portal}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="block w-full text-center font-oswald text-lg uppercase tracking-wide text-white border border-white rounded-full py-3 hover:bg-white hover:text-pc-dark transition-colors"
        >
          Billing &amp; Subscription
        </a>
        <a
          href={COMMUNITY_URLS.mailchimpPreferences}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="block w-full text-center font-oswald text-lg uppercase tracking-wide text-white border border-white rounded-full py-3 hover:bg-white hover:text-pc-dark transition-colors"
        >
          Email Preferences
        </a>
        <a
          href={PAYMENT_URLS.donate}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="block w-full text-center font-oswald text-lg uppercase tracking-wide text-white bg-pc-red rounded-full py-3 hover:bg-pc-red-dark transition-colors"
        >
          Donate
        </a>
      </div>
    </div>
  );
}
