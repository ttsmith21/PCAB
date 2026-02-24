import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Navbar from "@/components/layout/Navbar";
import { PAYMENT_URLS, COMMUNITY_URLS } from "@/lib/constants";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
}));

// Mock MobileMenu to avoid rendering complexity
vi.mock("@/components/layout/MobileMenu", () => ({
  default: () => null,
}));

describe("Navbar", () => {
  it("renders a Donate button linking to PAYMENT_URLS.donate", () => {
    render(<Navbar />);
    const donateLink = screen.getByRole("link", { name: /donate/i });
    expect(donateLink).toHaveAttribute("href", PAYMENT_URLS.donate);
  });

  it("renders the Donate button with target=_blank for external link behavior", () => {
    render(<Navbar />);
    const donateLink = screen.getByRole("link", { name: /donate/i });
    expect(donateLink).toHaveAttribute("target", "_blank");
  });

  it("renders a 'Manage Membership' dropdown trigger with correct label", () => {
    render(<Navbar />);
    expect(screen.getByText(/manage membership/i)).toBeInTheDocument();
  });

  it("dropdown contains 'Billing & Subscription' link pointing to PAYMENT_URLS.customer_portal", () => {
    render(<Navbar />);
    const link = screen.getByRole("link", {
      name: /billing & subscription/i,
    });
    expect(link).toHaveAttribute("href", PAYMENT_URLS.customer_portal);
  });

  it("dropdown contains 'Email Preferences' link pointing to COMMUNITY_URLS.mailchimpPreferences", () => {
    render(<Navbar />);
    const link = screen.getByRole("link", { name: /email preferences/i });
    expect(link).toHaveAttribute(
      "href",
      COMMUNITY_URLS.mailchimpPreferences
    );
  });

  it("does not render 'Member Login' text anywhere", () => {
    render(<Navbar />);
    expect(screen.queryByText(/member login/i)).not.toBeInTheDocument();
  });

  it("does not contain any BoosterHub URL in any link", () => {
    const { container } = render(<Navbar />);
    const links = container.querySelectorAll("a[href]");
    links.forEach((link) => {
      expect(link.getAttribute("href")).not.toMatch(/boosterhub/i);
    });
  });
});
