import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import ResourcesPage from "@/app/resources/page";

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

describe("ResourcesPage", () => {
  it('does not contain "BoosterHub" text in FAQ content', () => {
    const { container } = render(<ResourcesPage />);
    expect(container.textContent).not.toMatch(/boosterhub/i);
  });

  it("does not contain any BoosterHub URL in any link", () => {
    const { container } = render(<ResourcesPage />);
    const allLinks = container.querySelectorAll("a");
    allLinks.forEach((link) => {
      expect(link.getAttribute("href")).not.toMatch(/boosterhub/i);
    });
  });
});
