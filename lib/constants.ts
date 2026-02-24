export const BOOSTERHUB_BASE = "https://pcathleticbooster.boosterhub.com";

export const BOOSTERHUB_URLS = {
  membership: `${BOOSTERHUB_BASE}/membership`,
  volunteer: `${BOOSTERHUB_BASE}/volunteer`,
  store: `${BOOSTERHUB_BASE}/store`,
  login: `${BOOSTERHUB_BASE}/login`,
  donate: `${BOOSTERHUB_BASE}/store`,
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
} as const;
