export type SponsorTier = "gold" | "silver" | "bronze";

export interface Sponsor {
  name: string;
  tier: SponsorTier;
  logoUrl?: string;
  websiteUrl?: string;
}

export const sponsors: Sponsor[] = [
  { name: "Example Business 1", tier: "gold" },
  { name: "Example Business 2", tier: "gold" },
  { name: "Example Business 3", tier: "silver" },
  { name: "Example Business 4", tier: "silver" },
  { name: "Example Business 5", tier: "bronze" },
  { name: "Example Business 6", tier: "bronze" },
];

export const sponsorshipPackages = [
  {
    tier: "gold" as SponsorTier,
    name: "Gold Partner",
    price: "$1,000",
    benefits: [
      "Logo on homepage",
      "Featured at all events",
      "Social media recognition",
      "Banner at stadium",
    ],
  },
  {
    tier: "silver" as SponsorTier,
    name: "Silver Partner",
    price: "$500",
    benefits: [
      "Logo on sponsors page",
      "Event recognition",
      "Social media mention",
    ],
  },
  {
    tier: "bronze" as SponsorTier,
    name: "Bronze Partner",
    price: "$250",
    benefits: [
      "Name on sponsors page",
      "Newsletter mention",
    ],
  },
];
