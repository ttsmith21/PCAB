import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import StripeBuyButton from "@/components/ui/StripeBuyButton";
import { STRIPE_CONFIG } from "@/lib/constants";

// Mock next/script since it is a Next.js-specific component that does not
// render in a plain jsdom environment. The mock renders a <script> tag
// so we can assert the correct src is used.
vi.mock("next/script", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    return <script data-testid="stripe-script" src={props.src as string} />;
  },
}));

describe("StripeBuyButton", () => {
  it("renders a stripe-buy-button element with the correct buy-button-id attribute", () => {
    const { container } = render(
      <StripeBuyButton buyButtonId="buy_btn_test123" />
    );
    const el = container.querySelector("stripe-buy-button");
    expect(el).not.toBeNull();
    expect(el?.getAttribute("buy-button-id")).toBe("buy_btn_test123");
  });

  it("renders a stripe-buy-button element with the correct publishable-key attribute", () => {
    const { container } = render(
      <StripeBuyButton
        buyButtonId="buy_btn_test123"
        publishableKey="pk_test_custom"
      />
    );
    const el = container.querySelector("stripe-buy-button");
    expect(el?.getAttribute("publishable-key")).toBe("pk_test_custom");
  });

  it("uses the default publishable key from STRIPE_CONFIG when not explicitly provided", () => {
    const { container } = render(
      <StripeBuyButton buyButtonId="buy_btn_test123" />
    );
    const el = container.querySelector("stripe-buy-button");
    expect(el?.getAttribute("publishable-key")).toBe(
      STRIPE_CONFIG.publishableKey
    );
  });

  it("renders a Script element with the correct Stripe JS URL", () => {
    const { getByTestId } = render(
      <StripeBuyButton buyButtonId="buy_btn_test123" />
    );
    const script = getByTestId("stripe-script");
    expect(script.getAttribute("src")).toBe(
      "https://js.stripe.com/v3/buy-button.js"
    );
  });

  it("applies an optional className to the wrapper element", () => {
    const { container } = render(
      <StripeBuyButton buyButtonId="buy_btn_test123" className="mt-4 w-full" />
    );
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain("mt-4 w-full");
  });

  it("does not crash when rendered without optional props", () => {
    const { container } = render(
      <StripeBuyButton buyButtonId="buy_btn_test123" />
    );
    expect(container.querySelector("stripe-buy-button")).not.toBeNull();
  });
});
