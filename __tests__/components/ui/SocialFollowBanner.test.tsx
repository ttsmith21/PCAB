import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SocialFollowBanner from "@/components/ui/SocialFollowBanner";
import { SOCIAL_URLS } from "@/lib/constants";

describe("SocialFollowBanner", () => {
  it("renders a section element with appropriate heading", () => {
    render(<SocialFollowBanner />);
    const section = screen.getByRole("region");
    expect(section).toBeInTheDocument();
    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
  });

  it("contains 'Follow PC Boosters' heading text (or similar)", () => {
    render(<SocialFollowBanner />);
    expect(screen.getByRole("heading")).toHaveTextContent(/follow.*pc.*boosters/i);
  });

  it("renders links for Facebook, Instagram, and YouTube", () => {
    render(<SocialFollowBanner />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(3);
  });

  it("links use correct URLs from SOCIAL_URLS", () => {
    render(<SocialFollowBanner />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((link) => link.getAttribute("href"));
    expect(hrefs).toContain(SOCIAL_URLS.facebook);
    expect(hrefs).toContain(SOCIAL_URLS.instagram);
    expect(hrefs).toContain(SOCIAL_URLS.youtube);
  });

  it("all links have target='_blank' and rel='noopener noreferrer'", () => {
    render(<SocialFollowBanner />);
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("all links have accessible aria-label attributes", () => {
    render(<SocialFollowBanner />);
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveAttribute("aria-label");
      expect(link.getAttribute("aria-label")).not.toBe("");
    });
  });

  it("renders social media icons (lucide-react)", () => {
    const { container } = render(<SocialFollowBanner />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(3);
  });
});
