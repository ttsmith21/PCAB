import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import StorePage from "@/app/store/page";

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

describe("StorePage", () => {
  it("does not link to the BoosterHub store", () => {
    const { container } = render(<StorePage />);
    const allLinks = container.querySelectorAll("a");
    allLinks.forEach((link) => {
      expect(link.getAttribute("href")).not.toMatch(/boosterhub/i);
    });
  });

  it("indicates spirit wear is coming soon", () => {
    render(<StorePage />);
    const matches = screen.getAllByText(/coming soon/i);
    expect(matches.length).toBeGreaterThan(0);
  });

  it("links to /join or mailing list signup", () => {
    const { container } = render(<StorePage />);
    const joinLink = container.querySelector('a[href="/join"]');
    expect(joinLink).toBeTruthy();
  });
});
