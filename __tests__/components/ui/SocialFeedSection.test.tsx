import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// --- Mocks ---

// Mock react-intersection-observer. The mockInView variable controls
// whether the component believes it is in the viewport.
let mockInView = false;
vi.mock("react-intersection-observer", () => ({
  useInView: () => ({
    ref: vi.fn(),
    inView: mockInView,
  }),
}));

// Mock next/dynamic to return a simple stand-in component that renders
// a data attribute so tests can detect when CuratorFeed would appear.
vi.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => {
    const MockCuratorFeed = (props: Record<string, unknown>) => (
      <div data-testid="curator-feed" data-feed-id={props.feedId as string} />
    );
    MockCuratorFeed.displayName = "MockCuratorFeed";
    return MockCuratorFeed;
  },
}));

import SocialFeedSection from "@/components/ui/SocialFeedSection";
import { SOCIAL_URLS } from "@/lib/constants";

describe("SocialFeedSection", () => {
  beforeEach(() => {
    mockInView = false;
  });

  it("renders fallback social links when not in viewport (initial state)", () => {
    mockInView = false;
    render(<SocialFeedSection feedId="test-feed-123" />);
    expect(screen.getByText(/follow us on social media/i)).toBeInTheDocument();
  });

  it("fallback contains links to Facebook, Instagram, and YouTube profiles", () => {
    mockInView = false;
    render(<SocialFeedSection feedId="test-feed-123" />);
    const facebookLink = screen.getByRole("link", { name: /facebook/i });
    const instagramLink = screen.getByRole("link", { name: /instagram/i });
    const youtubeLink = screen.getByRole("link", { name: /youtube/i });
    expect(facebookLink).toBeInTheDocument();
    expect(instagramLink).toBeInTheDocument();
    expect(youtubeLink).toBeInTheDocument();
  });

  it("fallback links use URLs from SOCIAL_URLS constants", () => {
    mockInView = false;
    render(<SocialFeedSection feedId="test-feed-123" />);
    const facebookLink = screen.getByRole("link", { name: /facebook/i });
    const instagramLink = screen.getByRole("link", { name: /instagram/i });
    const youtubeLink = screen.getByRole("link", { name: /youtube/i });
    expect(facebookLink).toHaveAttribute("href", SOCIAL_URLS.facebook);
    expect(instagramLink).toHaveAttribute("href", SOCIAL_URLS.instagram);
    expect(youtubeLink).toHaveAttribute("href", SOCIAL_URLS.youtube);
  });

  it("all fallback links have target=_blank and rel=noopener noreferrer", () => {
    mockInView = false;
    render(<SocialFeedSection feedId="test-feed-123" />);
    const links = [
      screen.getByRole("link", { name: /facebook/i }),
      screen.getByRole("link", { name: /instagram/i }),
      screen.getByRole("link", { name: /youtube/i }),
    ];
    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("all fallback links have descriptive aria-label attributes", () => {
    mockInView = false;
    render(<SocialFeedSection feedId="test-feed-123" />);
    const facebookLink = screen.getByRole("link", { name: /follow us on facebook/i });
    const instagramLink = screen.getByRole("link", { name: /follow us on instagram/i });
    const youtubeLink = screen.getByRole("link", { name: /follow us on youtube/i });
    expect(facebookLink).toBeInTheDocument();
    expect(instagramLink).toBeInTheDocument();
    expect(youtubeLink).toBeInTheDocument();
  });

  it("when in viewport, renders the CuratorFeed component", () => {
    mockInView = true;
    render(<SocialFeedSection feedId="test-feed-123" />);
    const curatorFeed = screen.getByTestId("curator-feed");
    expect(curatorFeed).toBeInTheDocument();
    expect(curatorFeed).toHaveAttribute("data-feed-id", "test-feed-123");
  });

  it("applies optional className to root element", () => {
    mockInView = false;
    const { container } = render(
      <SocialFeedSection feedId="test-feed-123" className="my-custom-class" />
    );
    expect(container.firstElementChild?.className).toContain("my-custom-class");
  });
});
