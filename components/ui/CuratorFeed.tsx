"use client";

import Script from "next/script";

interface CuratorFeedProps {
  feedId: string;
  className?: string;
}

export default function CuratorFeed({ feedId, className }: CuratorFeedProps) {
  return (
    <>
      <div data-crt-feed-id={feedId} className={className} />
      <Script
        src={`https://cdn.curator.io/published/${feedId}.js`}
        strategy="lazyOnload"
        id={`curator-${feedId}`}
      />
    </>
  );
}
