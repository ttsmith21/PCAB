# Research Findings: Communication Hub (Split 02)

## Part 1: Codebase Analysis

### Build & Export Configuration

**Static Export Site** (`next.config.ts`):
- `output: "export"` -- pure static HTML/CSS/JS bundle
- `images: { unoptimized: true }` -- no Next.js image optimization
- **Critical constraint**: NO server-side code, NO API routes. Forms must POST to external services or use client-side handlers.

### Page Structure & Patterns

All interior pages follow this template:
```
<main>
  {/* Hero */}
  <section className="pt-32 pb-20 bg-pc-dark text-white">
    <div className="container mx-auto px-4 text-center">
      <FadeIn>
        <h1>Title</h1>
        <p>Subtitle</p>
      </FadeIn>
    </div>
  </section>

  {/* Content Sections */}
  <section className="py-20 bg-white|gray-50|pc-dark">
    <div className="container mx-auto px-4">
      <SectionHeading title="..." subtitle="..." />
      {/* Grid of Cards, content */}
    </div>
  </section>

  {/* CTA Section */}
  <section className="py-16 bg-pc-dark text-white text-center">
    <Button href={url} external>CTA</Button>
  </section>
</main>
```

Layout wraps all pages with `<Navbar />` and `<Footer />`.

### Reusable UI Components (`components/ui/`)

- **Button.tsx**: `variant?: "primary" | "secondary" | "outline"`, `external?: boolean`. Renders `<a>` for external, `<Link>` for internal. Primary = red bg, secondary = dark bg, outline = red border.
- **Card.tsx**: `hover?: boolean` (default true). White bg, rounded-2xl, shadow-lg, p-8.
- **SectionHeading.tsx**: Centered title (4xl/5xl bold) + subtitle. `light?: boolean` for dark backgrounds.
- **FadeIn.tsx**: Framer Motion scroll-triggered animation. `direction?: "up"|"down"|"left"|"right"`, `delay?: number`.
- **FacebookFeed.tsx**: Embeds Facebook page timeline via iframe plugin.
- **FaqAccordion.tsx**: Expandable Q&A with chevron animation.
- **AnimatedCounter.tsx**: Stats with count-up animation.

### Footer Structure (`components/layout/Footer.tsx`)

Three-column layout:
1. Brand column: Logo + description
2. Quick Links: First 6 nav links
3. Connect: Facebook link, email link, Member Login link

Bottom bar: Copyright + nonprofit status notice. **No existing forms in footer.**

### Constants & Data Organization

**`lib/constants.ts`**:
```typescript
export const BOOSTERHUB_BASE = "https://pcathleticbooster.boosterhub.com";
export const BOOSTERHUB_URLS = {
  membership, volunteer, store, login, donate
};
export const SITE_CONFIG = {
  name, tagline, description, logoUrl, facebookPageUrl, email, taxId, mailingAddress, founded
};
```

**Data files** (`lib/data/`): `nav-links.ts`, `board.ts`, `sports.ts` (39 sports), `initiatives.ts`, `sponsors.ts`. All hardcoded TypeScript objects.

### Current External Integrations

1. **BoosterHub**: All CTA buttons link to external boosterhub.com domain via `BOOSTERHUB_URLS`
2. **Facebook**: `FacebookFeed.tsx` renders timeline via iframe plugin
3. **Email**: `mailto:` links on resources page and footer

**NO native forms exist in the codebase.** No form libraries (react-hook-form, Formik, etc.) in dependencies.

### Brand Tokens (post-Split 01)

```css
--color-pc-red: #CC0033
--color-pc-dark: #111111
--color-pc-red-dark: #A30B2B
--color-pc-red-light: #FEF2F2
--color-pc-gray: #6B7280
--color-pc-gray-light: #F3F4F6
--color-pc-gray-dark: #374151
--font-sans: "Inter", sans-serif
--font-oswald: "Oswald", sans-serif
--shadow-glow: 0 0 20px rgba(204, 0, 51, 0.6)
```

### Dependencies

- next@16.1.6, react@19.2.3, framer-motion@12.34.3, lucide-react@0.575.0
- tailwindcss@4, typescript@5, eslint@9
- **No test framework** configured (no jest, vitest). Only `npm run build` and `eslint`.

---

## Part 2: Web Research

### Topic 1: Mailchimp Embedded Forms in Next.js Static Sites

**Two approaches:**

**A. Native Mailchimp Embedded Form (Recommended for static export)**
- In Mailchimp dashboard: Forms > Other forms > Create embedded form
- The form POSTs directly to Mailchimp's servers -- no backend required
- Action URL format: `https://<dc>.list-manage.com/subscribe/post?u=<USER_ID>&id=<LIST_ID>`
- For AJAX (no page redirect): use `post-json` endpoint with JSONP: `&c=?`
- Works perfectly with `next export` (static)

**B. API Route (NOT compatible with static export)**
- Requires running Node.js server -- incompatible with `output: 'export'`

**Custom styling**: Embedded forms inherit your site's CSS. Mailchimp provides CSS hooks:
- `#mc_embed_signup`, `#mc-embedded-subscribe-form`, `div.mc-field-group`, `div.mc-field-group.input-group`, `input.button`
- Can fully style with Tailwind CSS

**Double opt-in**: Configured at audience level (Audience > Settings > Form Settings). Applies to all forms for that audience. When enabled, reCAPTCHA auto-enabled too.

**Including Groups in forms**: Groups appear as checkboxes/radio buttons. CSS: `div.mc-field-group.input-group ul li`. Up to 60 group names per audience.

**Gotchas**:
1. CORS: Cannot call Mailchimp Marketing API from browser JS. Native form POST works fine.
2. jQuery conflicts: Mailchimp embed uses jQuery for validation -- may conflict with other scripts.
3. Multiple forms on one page cause conflicts.
4. Without JS enabled in form settings, submission redirects to Mailchimp's hosted page (leaves your site).

Sources: [Mailchimp docs](https://mailchimp.com/help/add-a-signup-form-to-your-website/), [Mailchimp CSS hooks](https://mailchimp.com/help/css-hooks-for-customizing-forms/)

### Topic 2: Mailchimp Groups and Audience Segmentation

| Feature | Groups | Tags | Segments |
|---------|--------|------|----------|
| Purpose | Contact-facing self-selection | Internal organization | Dynamic filters |
| Who assigns? | Contacts self-select (or admin) | Admin/automation only | Auto-computed |
| Visible to contacts? | Can be shown on forms | Never visible | N/A |
| Limit | 60 group names/audience | Unlimited | Varies by plan |
| Best for | Letting subscribers choose interests | Internal labels (source, status) | Targeting by behavior/data |

**Setup**: Audience > Settings > Groups > Create Group. Add category name (e.g., "Sports Interests") and group names (Basketball, Football, etc.). Choose display: checkboxes, radio, dropdown, or hidden.

**Sending targeted emails**: Create campaign > choose Segment > condition: "Group/Interest > [Category] > is > [Name]". Can combine AND/OR conditions.

**Best practices for nonprofits**:
- Use a single audience with Groups (don't fragment across audiences)
- Groups for subscriber-facing preferences, Tags for internal labels
- Enable double opt-in for list hygiene

### Topic 3: Mailchimp SMS Add-on

**Pricing**: Add-on to paid plans. Credits purchased monthly (don't roll over).
- 1,000 credits = $20/mo
- US SMS = 1 credit/msg (~$0.02), MMS = 3 credits/msg (~$0.06, Standard+ only)
- Credits expire monthly -- no rollover

**Collecting SMS consent**: Phone field added to same embedded form. Consent must be separate from email (unchecked checkbox, affirmative action required). TCPA compliance:
- No pre-checked consent boxes
- Messages only 8AM-9PM recipient's time zone
- Every message must include: brand name, opt-out instructions, frequency disclosure, "Msg & data rates may apply"
- $500-$1,500 penalty per violation

**Nonprofit discount**: 15% off paid marketing plans (NOT SMS credits). Apply via Contact form > Billing > Nonprofit Discount Requests with IRS 501(c)(3) determination letter. Cannot be applied retroactively.

**Total estimated cost**: Essentials ($13/mo - 15% = ~$11/mo) + SMS ($20/mo) = ~$31/mo = ~$373/yr

### Topic 4: SignUpGenius vs Google Forms

**SignUpGenius** (purpose-built for volunteer scheduling):
- Time slot management with participant limits
- Automatic confirmation/reminder emails
- No account required for participants
- Widely used in school/nonprofit communities
- Free tier: unlimited pages but has ads, no embed, no custom branding, limited custom questions
- Embedding: Free plan = link out only. Enterprise plan required for iframe embed.

**Google Forms** (general-purpose data collection):
- Completely free, no ads
- Unlimited forms/questions, Google Sheets integration
- Iframe embed works on any site
- No slot management or automated reminders
- Conditional logic via section branching

**Mailchimp integration**:
- Both connect via Zapier (free tier works for basic workflows)
- Google Forms: can also manually export CSV from Sheets and import to Mailchimp
- No native integration for either

**Recommendation**: SignUpGenius for time-slot volunteer coordination (link-based on free tier). Google Forms for simpler interest/registration forms (embeddable).

---

## Testing Setup

No test framework is configured in the project. Only:
- `npm run build` -- static export build verification
- `eslint` -- linting

For this split, testing would consist of:
- Build verification (`npm run build`)
- Visual verification of form rendering and styling
- Manual form submission testing (double opt-in flow)
- Mobile responsive testing
