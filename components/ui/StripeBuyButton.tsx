"use client";

import Script from "next/script";
import { STRIPE_CONFIG } from "@/lib/constants";

interface StripeBuyButtonProps {
  buyButtonId: string;
  publishableKey?: string;
  className?: string;
}

export default function StripeBuyButton({
  buyButtonId,
  publishableKey = STRIPE_CONFIG.publishableKey,
  className,
}: StripeBuyButtonProps) {
  return (
    <div className={className}>
      <Script
        src="https://js.stripe.com/v3/buy-button.js"
        strategy="afterInteractive"
      />
      {/* @ts-expect-error Stripe Buy Button is a web component loaded via external script */}
      <stripe-buy-button
        buy-button-id={buyButtonId}
        publishable-key={publishableKey}
      />
    </div>
  );
}
