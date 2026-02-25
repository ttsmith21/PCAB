import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import InitiativesPage from "@/app/initiatives/page";
import { PAYMENT_URLS } from "@/lib/constants";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/ui/FadeIn", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("InitiativesPage", () => {
  it("renders monthly donation options ($5, $10, $25, $50, $100)", () => {
    render(<InitiativesPage />);
    expect(screen.getByText(/\$5\/mo/)).toBeInTheDocument();
    expect(screen.getByText(/\$10\/mo/)).toBeInTheDocument();
    expect(screen.getByText(/\$25\/mo/)).toBeInTheDocument();
    expect(screen.getByText(/\$50\/mo/)).toBeInTheDocument();
    expect(screen.getByText(/\$100\/mo/)).toBeInTheDocument();
  });

  it("renders one-time donation option", () => {
    render(<InitiativesPage />);
    expect(screen.getByText(/give any amount/i)).toBeInTheDocument();
  });

  it("monthly donation links point to correct PAYMENT_URLS keys", () => {
    const { container } = render(<InitiativesPage />);
    const links = container.querySelectorAll("a[href]");
    const hrefMap = new Map<string, string>();
    links.forEach((link) => {
      const text = link.textContent || "";
      const href = link.getAttribute("href") || "";
      if (text.includes("/mo")) hrefMap.set(text.trim(), href);
    });

    expect(hrefMap.get("$5/mo")).toBe(PAYMENT_URLS.donate_monthly_5);
    expect(hrefMap.get("$10/mo")).toBe(PAYMENT_URLS.donate_monthly_10);
    expect(hrefMap.get("$25/mo")).toBe(PAYMENT_URLS.donate_monthly_25);
    expect(hrefMap.get("$50/mo")).toBe(PAYMENT_URLS.donate_monthly_50);
    expect(hrefMap.get("$100/mo")).toBe(PAYMENT_URLS.donate_monthly_100);
  });

  it("one-time donation link points to PAYMENT_URLS.donate", () => {
    render(<InitiativesPage />);
    const link = screen.getByRole("link", { name: /give any amount/i });
    expect(link).toHaveAttribute("href", PAYMENT_URLS.donate);
  });

  it("does not contain any BoosterHub URL", () => {
    const { container } = render(<InitiativesPage />);
    expect(container.innerHTML).not.toMatch(/boosterhub/i);
  });
});
