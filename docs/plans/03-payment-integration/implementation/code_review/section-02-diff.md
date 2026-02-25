diff --git a/__tests__/lib/constants.test.ts b/__tests__/lib/constants.test.ts
new file mode 100644
index 0000000..84bee4e
--- /dev/null
+++ b/__tests__/lib/constants.test.ts
@@ -0,0 +1,54 @@
+import * as constants from "@/lib/constants";
+import { PAYMENT_URLS, COMMUNITY_URLS, STRIPE_CONFIG } from "@/lib/constants";
+
+describe("PAYMENT_URLS", () => {
+  it("exports all membership tier keys", () => {
+    expect(PAYMENT_URLS).toHaveProperty("membership_rookie");
+    expect(PAYMENT_URLS).toHaveProperty("membership_captain");
+    expect(PAYMENT_URLS).toHaveProperty("membership_allstar");
+    expect(PAYMENT_URLS).toHaveProperty("membership_mvp");
+  });
+
+  it("exports all donation keys", () => {
+    expect(PAYMENT_URLS).toHaveProperty("donate");
+    expect(PAYMENT_URLS).toHaveProperty("donate_monthly_5");
+    expect(PAYMENT_URLS).toHaveProperty("donate_monthly_10");
+    expect(PAYMENT_URLS).toHaveProperty("donate_monthly_25");
+    expect(PAYMENT_URLS).toHaveProperty("donate_monthly_50");
+    expect(PAYMENT_URLS).toHaveProperty("donate_monthly_100");
+  });
+
+  it("exports a customer_portal key", () => {
+    expect(PAYMENT_URLS).toHaveProperty("customer_portal");
+  });
+
+  it("has all values as https:// URLs", () => {
+    for (const [key, value] of Object.entries(PAYMENT_URLS)) {
+      expect(value, `${key} should start with https://`).toMatch(/^https:\/\//);
+    }
+  });
+});
+
+describe("COMMUNITY_URLS", () => {
+  it("exports mailchimpPreferences, facebookGroup, and signupGenius keys", () => {
+    expect(COMMUNITY_URLS).toHaveProperty("mailchimpPreferences");
+    expect(COMMUNITY_URLS).toHaveProperty("facebookGroup");
+    expect(COMMUNITY_URLS).toHaveProperty("signupGenius");
+  });
+});
+
+describe("STRIPE_CONFIG", () => {
+  it("exports a publishableKey key", () => {
+    expect(STRIPE_CONFIG).toHaveProperty("publishableKey");
+  });
+});
+
+describe("BoosterHub removal", () => {
+  it("does not export BOOSTERHUB_URLS", () => {
+    expect(constants).not.toHaveProperty("BOOSTERHUB_URLS");
+  });
+
+  it("does not export BOOSTERHUB_BASE", () => {
+    expect(constants).not.toHaveProperty("BOOSTERHUB_BASE");
+  });
+});
diff --git a/docs/plans/03-payment-integration/implementation/deep_implement_config.json b/docs/plans/03-payment-integration/implementation/deep_implement_config.json
index 918d25b..bf46866 100644
--- a/docs/plans/03-payment-integration/implementation/deep_implement_config.json
+++ b/docs/plans/03-payment-integration/implementation/deep_implement_config.json
@@ -17,7 +17,12 @@
     "section-08-other-pages",
     "section-09-cleanup"
   ],
-  "sections_state": {},
+  "sections_state": {
+    "section-01-test-setup": {
+      "status": "complete",
+      "commit_hash": "cced067"
+    }
+  },
   "pre_commit": {
     "present": false,
     "type": "none",
diff --git a/lib/constants.ts b/lib/constants.ts
index 2799d36..b5b39a8 100644
--- a/lib/constants.ts
+++ b/lib/constants.ts
@@ -1,11 +1,23 @@
-export const BOOSTERHUB_BASE = "https://pcathleticbooster.boosterhub.com";
+// TODO: Replace placeholder URLs with real Stripe Payment Links
+// from the Stripe Dashboard after products are created.
+export const PAYMENT_URLS = {
+  membership_rookie: "https://buy.stripe.com/placeholder_membership_rookie",
+  membership_captain: "https://buy.stripe.com/placeholder_membership_captain",
+  membership_allstar: "https://buy.stripe.com/placeholder_membership_allstar",
+  membership_mvp: "https://buy.stripe.com/placeholder_membership_mvp",
+  donate: "https://buy.stripe.com/placeholder_donate",
+  donate_monthly_5: "https://buy.stripe.com/placeholder_donate_monthly_5",
+  donate_monthly_10: "https://buy.stripe.com/placeholder_donate_monthly_10",
+  donate_monthly_25: "https://buy.stripe.com/placeholder_donate_monthly_25",
+  donate_monthly_50: "https://buy.stripe.com/placeholder_donate_monthly_50",
+  donate_monthly_100: "https://buy.stripe.com/placeholder_donate_monthly_100",
+  customer_portal: "https://billing.stripe.com/p/login/placeholder",
+} as const;
 
-export const BOOSTERHUB_URLS = {
-  membership: `${BOOSTERHUB_BASE}/membership`,
-  volunteer: `${BOOSTERHUB_BASE}/volunteer`,
-  store: `${BOOSTERHUB_BASE}/store`,
-  login: `${BOOSTERHUB_BASE}/login`,
-  donate: `${BOOSTERHUB_BASE}/store`,
+// TODO: Replace placeholder with real Stripe publishable key
+// from Stripe Dashboard > Developers > API keys.
+export const STRIPE_CONFIG = {
+  publishableKey: "pk_test_placeholder",
 } as const;
 
 export const SITE_CONFIG = {
@@ -53,4 +65,5 @@ export const COMMUNITY_URLS = {
   facebookPage: "https://www.facebook.com/PCathleticboosters",
   facebookGroup: "https://facebook.com/groups/<GROUP_SLUG>",
   signupGenius: "https://www.signupgenius.com/<SIGNUP_SLUG>",
+  mailchimpPreferences: "https://mailchimp.com/preferences/placeholder",
 } as const;
