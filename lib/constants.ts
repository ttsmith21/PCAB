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

export const MAILCHIMP_CONFIG = {
  formAction: "https://pcathleticboosters.us12.list-manage.com/subscribe/post",
  userId: "48989a20796192c7b515dbcb3",
  audienceId: "2414e05025",
  honeypotFieldName: "b_48989a20796192c7b515dbcb3_2414e05025",
} as const;

export const MAILCHIMP_GROUPS = {
  sports: {
    groupId: "61844",
    options: {
      "Football": "1",
      "Basketball": "2",
      "Baseball": "4",
      "Softball": "8",
      "Soccer": "16",
      "Volleyball": "32",
      "Track & Field": "64",
      "Wrestling": "128",
      "Swimming": "256",
      "Tennis": "512",
      "Golf": "1024",
      "Cross Country": "2048",
    } as Record<string, string>,
  },
  graduationYear: {
    groupId: "61847",
    options: {
      "2026": "4096",
      "2027": "8192",
      "2028": "16384",
      "2029": "32768",
    } as Record<string, string>,
  },
  role: {
    groupId: "61846",
    options: {
      "Parent": "65536",
      "Student-Athlete": "131072",
      "Coach": "262144",
      "Community Member": "524288",
      "Alumni": "1048576",
    } as Record<string, string>,
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
