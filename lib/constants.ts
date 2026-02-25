export const PAYMENT_URLS = {
  membership_rookie: "https://buy.stripe.com/test_fZu4gzgVOdd0eg756m4wM00",
  membership_captain: "https://buy.stripe.com/test_bJecN5eNG3Cqgof3Ua4wM01",
  membership_allstar: "https://buy.stripe.com/test_3cIdR97le2ymgofbmC4wM02",
  membership_mvp: "https://buy.stripe.com/test_fZufZhdJC0qe7RJbmC4wM03",
  donate: "https://donate.stripe.com/test_14AfZhfRKfl88VNgGW4wM04",
  donate_monthly_5: "https://buy.stripe.com/test_9B68wP8pi6OCgof1M24wM05",
  donate_monthly_10: "https://buy.stripe.com/test_fZu3cv6ha1ui1tl1M24wM08",
  donate_monthly_25: "https://buy.stripe.com/test_5kQ3cvdJCeh49ZRbmC4wM07",
  donate_monthly_50: "https://buy.stripe.com/test_aFa00jaxqgpc1tl8aq4wM09",
  donate_monthly_100: "https://buy.stripe.com/test_eVq4gzgVOdd0b3V2Q64wM0a",
  customer_portal: "https://billing.stripe.com/p/login/test_fZu4gzgVOdd0eg776m4wM00",
} as const;

export const STRIPE_CONFIG = {
  publishableKey: "pk_test_51T4VgEHSqrjFUVpy6AkdYNaCqRVkzzJgstY8lOZ0CADooNuRD2X24DUZTdulfZBipS1q39iJiPGVFJEIqCKvHfnZ00auS18Ddl",
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
