// TODO: Replace placeholder URLs with real Stripe Payment Links
// from the Stripe Dashboard after products are created.
export const PAYMENT_URLS = {
  membership_rookie: "https://buy.stripe.com/placeholder_membership_rookie",
  membership_captain: "https://buy.stripe.com/placeholder_membership_captain",
  membership_allstar: "https://buy.stripe.com/placeholder_membership_allstar",
  membership_mvp: "https://buy.stripe.com/placeholder_membership_mvp",
  donate: "https://buy.stripe.com/placeholder_donate",
  donate_monthly_5: "https://buy.stripe.com/placeholder_donate_monthly_5",
  donate_monthly_10: "https://buy.stripe.com/placeholder_donate_monthly_10",
  donate_monthly_25: "https://buy.stripe.com/placeholder_donate_monthly_25",
  donate_monthly_50: "https://buy.stripe.com/placeholder_donate_monthly_50",
  donate_monthly_100: "https://buy.stripe.com/placeholder_donate_monthly_100",
  customer_portal: "https://billing.stripe.com/p/login/placeholder",
} as const;

// TODO: Replace placeholder with real Stripe publishable key
// from Stripe Dashboard > Developers > API keys.
export const STRIPE_CONFIG = {
  publishableKey: "pk_test_placeholder",
} as const;

export const SITE_CONFIG = {
  name: "Port Clinton Athletic Boosters",
  tagline: "One Town. One Team.",
  description: "Supporting Port Clinton student-athletes through community partnerships, fundraising, and volunteerism.",
  logoUrl: "/images/logo.png",
  facebookPageUrl: "https://www.facebook.com/PCathleticboosters",
  email: "info@pcathleticboosters.com",
  taxId: "34-1365685",
  mailingAddress: "P.O. Box 3, Port Clinton, Ohio 43452",
  founded: 1983,
} as const;

// TODO: Replace placeholder values with real Mailchimp credentials from
// Audience > Settings > Audience name and defaults after account setup.
export const MAILCHIMP_CONFIG = {
  formAction: "https://<dc>.list-manage.com/subscribe/post",
  userId: "<USER_ID>",
  audienceId: "<LIST_ID>",
  honeypotFieldName: "b_<USER_ID>_<LIST_ID>",
} as const;

// TODO: Replace <GROUP_ID> values and populate options from Mailchimp
// Forms > Form builder > field settings after audience groups are configured.
export const MAILCHIMP_GROUPS = {
  sports: {
    groupId: "<GROUP_ID>",
    options: {} as Record<string, string>,
  },
  level: {
    groupId: "<GROUP_ID>",
    options: {} as Record<string, string>,
  },
  role: {
    groupId: "<GROUP_ID>",
    options: {} as Record<string, string>,
  },
} as const;

// TODO: Replace <GROUP_SLUG> and <SIGNUP_SLUG> with real values
// after Facebook Group and SignUpGenius pages are created.
export const COMMUNITY_URLS = {
  join: "/join",
  facebookPage: "https://www.facebook.com/PCathleticboosters",
  facebookGroup: "https://facebook.com/groups/<GROUP_SLUG>",
  signupGenius: "https://www.signupgenius.com/<SIGNUP_SLUG>",
  mailchimpPreferences: "https://mailchimp.com/preferences/placeholder",
} as const;
