import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ThanksPage from "@/app/payment/thanks/page";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe("Payment Thanks Page", () => {
  it("renders a thank you heading/message", () => {
    render(<ThanksPage />);
    expect(
      screen.getByRole("heading", { level: 1 })
    ).toHaveTextContent(/thank you/i);
  });

  it("contains Mailchimp signup prompt (link to /join)", () => {
    render(<ThanksPage />);
    const joinLink = screen.getByRole("link", { name: /join/i });
    expect(joinLink).toHaveAttribute("href", "/join");
  });

  it("contains social media links (Facebook group)", () => {
    render(<ThanksPage />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((link) => link.getAttribute("href"));
    expect(hrefs.some((href) => href?.includes("facebook.com"))).toBe(true);
  });

  it("mentions email receipt from Stripe", () => {
    render(<ThanksPage />);
    expect(screen.getByText(/email receipt/i)).toBeInTheDocument();
  });

  it("mentions Customer Portal for subscription management", () => {
    render(<ThanksPage />);
    const links = screen.getAllByRole("link");
    const portalLink = links.find((link) =>
      link.getAttribute("href")?.includes("billing.stripe.com")
    );
    expect(portalLink).toBeDefined();
  });
});
