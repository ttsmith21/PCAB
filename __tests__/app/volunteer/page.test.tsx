import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import VolunteerPage from "@/app/volunteer/page";

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

describe("VolunteerPage", () => {
  it("volunteer signup link points to SignUpGenius", () => {
    const { container } = render(<VolunteerPage />);
    const allLinks = container.querySelectorAll("a");
    const signupLink = Array.from(allLinks).find((link) =>
      link.getAttribute("href")?.includes("signupgenius")
    );
    expect(signupLink).toBeTruthy();
  });

  it("does not contain any BoosterHub URL", () => {
    const { container } = render(<VolunteerPage />);
    const allLinks = container.querySelectorAll("a");
    allLinks.forEach((link) => {
      expect(link.getAttribute("href")).not.toMatch(/boosterhub/i);
    });
  });
});
