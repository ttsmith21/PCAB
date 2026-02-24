import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

vi.mock("@/components/ui/StripeBuyButton", () => ({
  default: ({ buyButtonId, className }: any) => (
    <div
      data-testid="stripe-buy-button"
      data-buy-button-id={buyButtonId}
      className={className}
    />
  ),
}));

// Import after mocks
import MembershipPage from "@/app/membership/page";

describe("MembershipPage", () => {
  it("renders 4 membership tier names (Rookie, Captain, All Star, MVP)", () => {
    render(<MembershipPage />);
    expect(screen.getByText("Rookie")).toBeInTheDocument();
    expect(screen.getByText("Captain")).toBeInTheDocument();
    expect(screen.getByText("All Star")).toBeInTheDocument();
    expect(screen.getByText("MVP")).toBeInTheDocument();
  });

  it("displays updated prices ($25, $50, $100, $250)", () => {
    render(<MembershipPage />);
    expect(screen.getByText("$25")).toBeInTheDocument();
    expect(screen.getByText("$50")).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument();
    expect(screen.getByText("$250")).toBeInTheDocument();
  });

  it("renders a StripeBuyButton for each tier", () => {
    render(<MembershipPage />);
    const buttons = screen.getAllByTestId("stripe-buy-button");
    expect(buttons).toHaveLength(4);
  });

  it("each StripeBuyButton receives a distinct buyButtonId", () => {
    render(<MembershipPage />);
    const buttons = screen.getAllByTestId("stripe-buy-button");
    const ids = buttons.map((btn) => btn.getAttribute("data-buy-button-id"));
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(4);
  });

  it("does not contain any BoosterHub URL", () => {
    const { container } = render(<MembershipPage />);
    expect(container.innerHTML).not.toMatch(/boosterhub/i);
  });

  it("does not contain 'secure member portal' disclaimer text", () => {
    render(<MembershipPage />);
    expect(
      screen.queryByText(/secure member portal/i)
    ).not.toBeInTheDocument();
  });

  it("bottom CTA links to on-page anchor (not external URL)", () => {
    render(<MembershipPage />);
    const ctaLink = screen.getByRole("link", {
      name: /choose your membership/i,
    });
    expect(ctaLink).toHaveAttribute("href", "#tiers");
  });
});
