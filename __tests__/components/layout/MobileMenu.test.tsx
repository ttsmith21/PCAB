import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import MobileMenu from "@/components/layout/MobileMenu";
import { PAYMENT_URLS, COMMUNITY_URLS } from "@/lib/constants";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("MobileMenu", () => {
  const defaultProps = { isOpen: true, onClose: vi.fn() };

  it("renders a Donate button linking to PAYMENT_URLS.donate", () => {
    render(<MobileMenu {...defaultProps} />);
    const donateLink = screen.getByRole("link", { name: /donate/i });
    expect(donateLink).toHaveAttribute("href", PAYMENT_URLS.donate);
  });

  it("renders 'Billing & Subscription' link with correct href", () => {
    render(<MobileMenu {...defaultProps} />);
    const link = screen.getByRole("link", {
      name: /billing & subscription/i,
    });
    expect(link).toHaveAttribute("href", PAYMENT_URLS.customer_portal);
  });

  it("renders 'Email Preferences' link with correct href", () => {
    render(<MobileMenu {...defaultProps} />);
    const link = screen.getByRole("link", { name: /email preferences/i });
    expect(link).toHaveAttribute(
      "href",
      COMMUNITY_URLS.mailchimpPreferences
    );
  });

  it("does not render 'Member Login' text", () => {
    render(<MobileMenu {...defaultProps} />);
    expect(screen.queryByText(/member login/i)).not.toBeInTheDocument();
  });

  it("does not contain any BoosterHub URL in any link", () => {
    const { container } = render(<MobileMenu {...defaultProps} />);
    const links = container.querySelectorAll("a[href]");
    links.forEach((link) => {
      expect(link.getAttribute("href")).not.toMatch(/boosterhub/i);
    });
  });
});
