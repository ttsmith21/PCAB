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
