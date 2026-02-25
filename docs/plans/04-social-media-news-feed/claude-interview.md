# Interview Transcript: Social Media & News Feed

## Q1: News Page Feed Integration Strategy

**Question:** The News page currently has a FacebookFeed iframe embed and hardcoded event cards. Should the Curator.io social feed replace the existing FacebookFeed component entirely, or sit alongside it as a separate section?

**Answer:** Replace FacebookFeed -- Remove the existing Facebook iframe and replace with Curator.io aggregated feed (FB + IG + more).

## Q2: Homepage Feed Placement

**Question:** For the homepage, the 'Live From the Field' section currently shows the FacebookFeed. Should we add the Curator.io feed there too, or keep the homepage focused and only put the full feed on the News page?

**Answer:** Replace homepage FacebookFeed with Curator.io -- Show the aggregated social feed on the homepage too.

## Q3: Social Follow Links Placement

**Question:** The spec mentions adding social follow links to header, footer, or a dedicated section. Where should the social media follow buttons (Facebook, Instagram) go?

**Answer:** Footer + dedicated section -- Footer icons plus a 'Follow Us' section on the News or homepage.

## Q4: Curator.io Layout Style

**Question:** Which Curator.io layout style do you prefer for the social feed?

**Answer:** Waterfall (Pinterest-style) -- Masonry grid with varied card heights, visual and modern, great for mixed content (photos + text).

## Q5: Third Curator.io Source

**Question:** The free Curator.io plan supports 3 sources. The spec says Facebook + Instagram + one more. What should the third source be?

**Answer:** YouTube -- For game highlights or event videos.

## Q6: Events Section Handling

**Question:** For the News page event cards section ('Upcoming Events'), should we keep the hardcoded events, or is there a plan to make events dynamic?

**Answer:** Remove events section -- Let the social feed serve as the primary content; drop the events cards.

## Q7: Follow Section Design

**Question:** Should the 'Follow Us' dedicated section include just icon links to the social profiles, or a richer design?

**Answer:** Banner-style CTA -- A single horizontal banner with all icons and a unified 'Follow PC Boosters' message.

## Q8: Loading/Fallback Behavior

**Question:** When Curator.io is loading or unavailable (slow connection, free tier limit hit), what should users see?

**Answer:** Direct links to social profiles -- Show 'Follow us on Facebook/Instagram/YouTube' links as fallback content.

---

## Summary of Decisions

| Decision | Choice |
|----------|--------|
| Feed widget | Curator.io (free tier, 3 sources) |
| Layout style | Waterfall (masonry) |
| Sources | Facebook + Instagram + YouTube |
| News page | Replace FacebookFeed + remove events section |
| Homepage | Replace FacebookFeed with Curator.io |
| Follow links | Footer icons + banner-style CTA section |
| Fallback | Direct links to social profiles |
| Performance | Lazy-loaded, SSR-disabled, intersection observer |
