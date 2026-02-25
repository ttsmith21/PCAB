import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/layout/Footer";
import { PAYMENT_URLS, COMMUNITY_URLS, SOCIAL_URLS } from "@/lib/constants";

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

describe("Footer", () => {
  it("renders 'Billing & Subscription' link with correct href", () => {
    render(<Footer />);
    const link = screen.getByRole("link", {
      name: /billing & subscription/i,
    });
    expect(link).toHaveAttribute("href", PAYMENT_URLS.customer_portal);
  });

  it("renders 'Email Preferences' link with correct href", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: /email preferences/i });
    expect(link).toHaveAttribute(
      "href",
      COMMUNITY_URLS.mailchimpPreferences
    );
  });

  it("does not render 'Member Login' text", () => {
    render(<Footer />);
    expect(screen.queryByText(/member login/i)).not.toBeInTheDocument();
  });

  it("does not contain any BoosterHub URL in any link", () => {
    const { container } = render(<Footer />);
    const links = container.querySelectorAll("a[href]");
    links.forEach((link) => {
      expect(link.getAttribute("href")).not.toMatch(/boosterhub/i);
    });
  });

  it("renders Facebook link with correct URL from SOCIAL_URLS", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: /follow us on facebook/i });
    expect(link).toHaveAttribute("href", SOCIAL_URLS.facebook);
  });

  it("renders Instagram link with correct URL from SOCIAL_URLS", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: /follow us on instagram/i });
    expect(link).toHaveAttribute("href", SOCIAL_URLS.instagram);
  });

  it("renders YouTube link with correct URL from SOCIAL_URLS", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: /follow us on youtube/i });
    expect(link).toHaveAttribute("href", SOCIAL_URLS.youtube);
  });

  it("social links have target='_blank' and rel='noopener noreferrer'", () => {
    render(<Footer />);
    const links = [
      screen.getByRole("link", { name: /follow us on facebook/i }),
      screen.getByRole("link", { name: /follow us on instagram/i }),
      screen.getByRole("link", { name: /follow us on youtube/i }),
    ];
    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("social links have accessible aria-label attributes", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /follow us on facebook/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /follow us on instagram/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /follow us on youtube/i })).toBeInTheDocument();
  });
});
