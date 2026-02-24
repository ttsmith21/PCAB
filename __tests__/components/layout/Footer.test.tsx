import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/layout/Footer";
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
});
