import * as constants from "@/lib/constants";
import { PAYMENT_URLS, COMMUNITY_URLS, STRIPE_CONFIG } from "@/lib/constants";

describe("PAYMENT_URLS", () => {
  it("exports all membership tier keys", () => {
    expect(PAYMENT_URLS).toHaveProperty("membership_rookie");
    expect(PAYMENT_URLS).toHaveProperty("membership_captain");
    expect(PAYMENT_URLS).toHaveProperty("membership_allstar");
    expect(PAYMENT_URLS).toHaveProperty("membership_mvp");
  });

  it("exports all donation keys", () => {
    expect(PAYMENT_URLS).toHaveProperty("donate");
    expect(PAYMENT_URLS).toHaveProperty("donate_monthly_5");
    expect(PAYMENT_URLS).toHaveProperty("donate_monthly_10");
    expect(PAYMENT_URLS).toHaveProperty("donate_monthly_25");
    expect(PAYMENT_URLS).toHaveProperty("donate_monthly_50");
    expect(PAYMENT_URLS).toHaveProperty("donate_monthly_100");
  });

  it("exports a customer_portal key", () => {
    expect(PAYMENT_URLS).toHaveProperty("customer_portal");
  });

  it("has all values as https:// URLs", () => {
    for (const [key, value] of Object.entries(PAYMENT_URLS)) {
      expect(value, `${key} should start with https://`).toMatch(/^https:\/\//);
    }
  });
});

describe("COMMUNITY_URLS", () => {
  it("exports mailchimpPreferences, facebookGroup, and signupGenius keys", () => {
    expect(COMMUNITY_URLS).toHaveProperty("mailchimpPreferences");
    expect(COMMUNITY_URLS).toHaveProperty("facebookGroup");
    expect(COMMUNITY_URLS).toHaveProperty("signupGenius");
  });
});

describe("STRIPE_CONFIG", () => {
  it("exports a publishableKey key", () => {
    expect(STRIPE_CONFIG).toHaveProperty("publishableKey");
  });
});

describe("BoosterHub removal", () => {
  it("does not export BOOSTERHUB_URLS", () => {
    expect(constants).not.toHaveProperty("BOOSTERHUB_URLS");
  });

  it("does not export BOOSTERHUB_BASE", () => {
    expect(constants).not.toHaveProperty("BOOSTERHUB_BASE");
  });
});
