import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ActionCards from "@/components/home/ActionCards";

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

describe("ActionCards", () => {
  it("renders the membership action card with a link to /membership (internal route)", () => {
    render(<ActionCards />);
    const joinLink = screen.getByRole("link", { name: /join now/i });
    expect(joinLink).toHaveAttribute("href", "/membership");
  });

  it("membership action card is NOT an external link (no target=_blank)", () => {
    render(<ActionCards />);
    const joinLink = screen.getByRole("link", { name: /join now/i });
    expect(joinLink).not.toHaveAttribute("target", "_blank");
  });

  it("does not contain any BoosterHub URL in any action card link", () => {
    const { container } = render(<ActionCards />);
    const allLinks = container.querySelectorAll("a");
    allLinks.forEach((link) => {
      expect(link.getAttribute("href")).not.toMatch(/boosterhub/i);
    });
  });
});
