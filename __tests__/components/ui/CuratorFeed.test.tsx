import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import CuratorFeed from "@/components/ui/CuratorFeed";

// Mock next/script -- same pattern used in StripeBuyButton.test.tsx.
// Renders a plain <script> tag so we can assert src, strategy, and id.
vi.mock("next/script", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    return (
      <script
        data-testid="curator-script"
        src={props.src as string}
        data-strategy={props.strategy as string}
        id={props.id as string}
      />
    );
  },
}));

describe("CuratorFeed", () => {
  it("renders a container div with data-crt-feed-id matching the feedId prop", () => {
    const { container } = render(<CuratorFeed feedId="abc123" />);
    const div = container.querySelector("[data-crt-feed-id]");
    expect(div).not.toBeNull();
    expect(div?.getAttribute("data-crt-feed-id")).toBe("abc123");
  });

  it("renders a Script element with src pointing to the published feed URL", () => {
    const { getByTestId } = render(<CuratorFeed feedId="abc123" />);
    const script = getByTestId("curator-script");
    expect(script.getAttribute("src")).toBe(
      "https://cdn.curator.io/published/abc123.js"
    );
  });

  it("sets the Script strategy to lazyOnload", () => {
    const { getByTestId } = render(<CuratorFeed feedId="abc123" />);
    const script = getByTestId("curator-script");
    expect(script.getAttribute("data-strategy")).toBe("lazyOnload");
  });

  it("sets a unique Script id containing the feedId", () => {
    const { getByTestId } = render(<CuratorFeed feedId="abc123" />);
    const script = getByTestId("curator-script");
    expect(script.getAttribute("id")).toContain("abc123");
  });

  it("applies optional className to the container div", () => {
    const { container } = render(
      <CuratorFeed feedId="abc123" className="mt-4 w-full" />
    );
    const div = container.querySelector("[data-crt-feed-id]");
    expect(div?.className).toContain("mt-4 w-full");
  });

  it("renders the container div without className when the prop is omitted", () => {
    const { container } = render(<CuratorFeed feedId="abc123" />);
    const div = container.querySelector("[data-crt-feed-id]");
    expect(div?.hasAttribute("class")).toBe(false);
  });
});
