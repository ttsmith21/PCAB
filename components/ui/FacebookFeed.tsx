"use client";

import { SITE_CONFIG } from "@/lib/constants";

interface FacebookFeedProps {
  width?: number;
  height?: number;
}

export default function FacebookFeed({ width = 500, height = 600 }: FacebookFeedProps) {
  const encodedUrl = encodeURIComponent(SITE_CONFIG.facebookPageUrl);

  return (
    <div className="flex justify-center">
      <iframe
        src={`https://www.facebook.com/plugins/page.php?href=${encodedUrl}&tabs=timeline&width=${width}&height=${height}&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true`}
        width={width}
        height={height}
        style={{ border: "none", overflow: "hidden" }}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        title="Facebook Feed"
      />
    </div>
  );
}
