import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

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
vi.mock("@/components/ui/FadeIn", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("@/components/ui/SectionHeading", () => ({
  default: ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div data-testid="section-heading"><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
  ),
}));
vi.mock("@/components/ui/Button", () => ({
  default: ({ children, href }: { children: React.ReactNode; href?: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("@/components/ui/SocialFeedSection", () => ({
  default: ({ feedId, className }: { feedId: string; className?: string }) => (
    <div data-testid="social-feed-section" data-feed-id={feedId} className={className}>SocialFeedSection</div>
  ),
}));

import Home from "@/app/page";
import { CURATOR_CONFIG } from "@/lib/constants";

describe("Homepage", () => {
  it("renders SocialFeedSection in the Live From the Field section", () => {
    render(<Home />);
    expect(screen.getByTestId("social-feed-section")).toBeInTheDocument();
  });

  it("does NOT render FacebookFeed component", () => {
    const { container } = render(<Home />);
    expect(container.querySelector('iframe[title="Facebook Feed"]')).toBeNull();
  });

  it("SocialFeedSection receives correct feedId from CURATOR_CONFIG", () => {
    render(<Home />);
    const feed = screen.getByTestId("social-feed-section");
    expect(feed).toHaveAttribute("data-feed-id", CURATOR_CONFIG.feedId);
  });

  it("all other homepage sections remain present", () => {
    render(<Home />);
    expect(screen.getByTestId("hero")).toBeInTheDocument();
    expect(screen.getByTestId("impact-stats")).toBeInTheDocument();
    expect(screen.getByTestId("action-cards")).toBeInTheDocument();
    expect(screen.getByTestId("initiative-preview")).toBeInTheDocument();
    expect(screen.getByTestId("sponsor-showcase")).toBeInTheDocument();
    expect(screen.getByText("Stay Connected")).toBeInTheDocument();
    expect(screen.getByText("Live From the Field")).toBeInTheDocument();
  });
});
