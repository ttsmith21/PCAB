import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock SocialFeedSection so we can verify it receives correct props
vi.mock("@/components/ui/SocialFeedSection", () => ({
  default: ({ feedId, className }: any) => (
    <div data-testid="social-feed-section" data-feed-id={feedId} className={className} />
  ),
}));

// Mock SocialFollowBanner
vi.mock("@/components/ui/SocialFollowBanner", () => ({
  default: () => <div data-testid="social-follow-banner" />,
}));

// Mock heavy child components to keep tests focused
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));
vi.mock("@/components/ui/FadeIn", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));
vi.mock("@/components/home/Hero", () => ({
  default: () => <div data-testid="hero">Hero</div>,
}));
vi.mock("@/components/home/ImpactStats", () => ({
  default: () => <div data-testid="impact-stats">ImpactStats</div>,
}));
vi.mock("@/components/home/ActionCards", () => ({
  default: () => <div data-testid="action-cards">ActionCards</div>,
}));
vi.mock("@/components/home/InitiativePreview", () => ({
  default: () => <div data-testid="initiative-preview">InitiativePreview</div>,
}));
vi.mock("@/components/home/SponsorShowcase", () => ({
  default: () => <div data-testid="sponsor-showcase">SponsorShowcase</div>,
}));
vi.mock("@/components/ui/Button", () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));
vi.mock("next/image", () => ({
  default: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
}));

import NewsPage from "@/app/news/page";
import Home from "@/app/page";
import Footer from "@/components/layout/Footer";
import { CURATOR_CONFIG, SOCIAL_URLS } from "@/lib/constants";

describe("Social feed integration", () => {
  it("News page renders SocialFeedSection with correct Curator.io feedId", () => {
    render(<NewsPage />);
    const feed = screen.getByTestId("social-feed-section");
    expect(feed).toBeInTheDocument();
    expect(feed).toHaveAttribute("data-feed-id", CURATOR_CONFIG.feedId);
  });

  it("Homepage renders SocialFeedSection with correct Curator.io feedId", () => {
    render(<Home />);
    const feed = screen.getByTestId("social-feed-section");
    expect(feed).toBeInTheDocument();
    expect(feed).toHaveAttribute("data-feed-id", CURATOR_CONFIG.feedId);
  });

  it("Footer contains all three social media links (Facebook, Instagram, YouTube)", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((link) => link.getAttribute("href"));
    expect(hrefs).toContain(SOCIAL_URLS.facebook);
    expect(hrefs).toContain(SOCIAL_URLS.instagram);
    expect(hrefs).toContain(SOCIAL_URLS.youtube);
  });

  it("All social URLs across components are consistent with SOCIAL_URLS constants", () => {
    render(<Footer />);
    const fbLink = screen.getByRole("link", { name: /follow us on facebook/i });
    const igLink = screen.getByRole("link", { name: /follow us on instagram/i });
    const ytLink = screen.getByRole("link", { name: /follow us on youtube/i });
    expect(fbLink).toHaveAttribute("href", SOCIAL_URLS.facebook);
    expect(igLink).toHaveAttribute("href", SOCIAL_URLS.instagram);
    expect(ytLink).toHaveAttribute("href", SOCIAL_URLS.youtube);
  });

  it("SocialFollowBanner renders on the News page", () => {
    render(<NewsPage />);
    expect(screen.getByTestId("social-follow-banner")).toBeInTheDocument();
  });
});
