import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

vi.mock("@/components/ui/SocialFeedSection", () => ({
  default: ({ feedId, className }: any) => (
    <div data-testid="social-feed-section" data-feed-id={feedId} className={className} />
  ),
}));

vi.mock("@/components/ui/SocialFollowBanner", () => ({
  default: () => <div data-testid="social-follow-banner" />,
}));

vi.mock("@/components/ui/FadeIn", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

import NewsPage from "@/app/news/page";
import { CURATOR_CONFIG } from "@/lib/constants";

describe("NewsPage", () => {
  it("renders SocialFeedSection component", () => {
    render(<NewsPage />);
    expect(screen.getByTestId("social-feed-section")).toBeInTheDocument();
  });

  it("passes correct feedId to SocialFeedSection", () => {
    render(<NewsPage />);
    const feed = screen.getByTestId("social-feed-section");
    expect(feed).toHaveAttribute("data-feed-id", CURATOR_CONFIG.feedId);
  });

  it("renders SocialFollowBanner component", () => {
    render(<NewsPage />);
    expect(screen.getByTestId("social-follow-banner")).toBeInTheDocument();
  });

  it("renders hero section with page heading", () => {
    render(<NewsPage />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it("does not render FacebookFeed component", () => {
    const { container } = render(<NewsPage />);
    const iframe = container.querySelector('iframe[title="Facebook Feed"]');
    expect(iframe).toBeNull();
  });

  it("does not render Upcoming Events section", () => {
    render(<NewsPage />);
    expect(screen.queryByText("Upcoming Events")).not.toBeInTheDocument();
    expect(screen.queryByText("Spring Sports Kickoff")).not.toBeInTheDocument();
    expect(screen.queryByText("Annual Golf Outing")).not.toBeInTheDocument();
    expect(screen.queryByText("Back-to-School Night")).not.toBeInTheDocument();
  });
});
