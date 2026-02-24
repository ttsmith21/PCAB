# Split 02: Communication Hub

> **Priority:** P0 (Core -- highest value split)
> **Effort:** Large (3-5 sessions)
> **Dependencies:** 01-brand-color-scheme (for correct colors in templates/forms)
> **Blocks:** None (but has light coupling with 03-payment-integration for success page cross-promotion)

---

## Objective

Build the self-registration and targeted communication system that makes the PC Athletic Boosters the central hub for Port Clinton athletics families -- youth through varsity.

This is THE core of the project. The booster club currently has zero digital presence (no social, no page, no communication platform). This split establishes the primary way families connect with PC athletics.

## Background

### The Problem (from interview)
- Youth sports communication in Port Clinton is fragmented across dozens of Facebook pages and apps
- Each youth club has its own Facebook page that changes when parent volunteers rotate
- There's no unified platform for announcements, signups, or coordination
- High school uses TeamSnap for team comms; youth has nothing centralized
- Parents want targeted announcements (their kid's sport/age only), not blanket blasts
- Booster club members ARE many of the youth league leaders -- buy-in is a conversation, not a sales pitch

### The Vision
The booster club website becomes the single front door where parents:
1. Self-select which sports/age groups they care about
2. Receive targeted announcements via their preferred channel (email or SMS)
3. Sign up to volunteer
4. Connect with the broader PC athletics community

## Tech Stack (decided in interview)

| Component | Tool | Cost |
|-----------|------|------|
| Email marketing + targeting | **Mailchimp Essentials** | ~$133/yr (15% nonprofit) |
| SMS blasts | **Mailchimp SMS add-on** | ~$240/yr ($20/mo, 1,000 credits) |
| Real-time discussion | **Facebook Group** | $0 |
| Volunteer signups | **Google Form** or **SignUpGenius** | $0 |
| **Total** | | **~$373/yr** |

### Why Mailchimp (from interview)
- **Groups feature** is purpose-built for self-select interests (checkboxes on signup form)
- Better known than Brevo -- future volunteer board members more likely to know it
- 15% nonprofit discount
- SMS add-on keeps email+SMS in one dashboard
- Embedded forms work on static sites (no backend needed)

### Why NOT GroupMe (dropped in interview)
- One more app for parents to download
- Mailchimp handles all broadcast communication (email + SMS)
- Facebook Group handles real-time discussion (they need FB anyway for social presence)
- Simplifies to fewer tools

## Requirements

### Mailchimp Setup
- [ ] Create Mailchimp account, apply for 15% nonprofit discount
- [ ] Enable SMS add-on ($20/mo)
- [ ] Configure Mailchimp Groups for self-selection:
  - **Sports:** Football, Basketball (Boys), Basketball (Girls), Baseball, Softball, Track & Field, Cross Country, Wrestling, Golf, Tennis, Swimming, Volleyball, Soccer, Cheerleading, etc.
  - **Level:** Youth (K-6), Middle School (7-8), High School (9-12)
  - **Role:** Parent, Coach, Volunteer, Community Supporter
- [ ] Configure contact fields: Name, Email, Phone (for SMS), Communication Preference (email/SMS/both)
- [ ] Set up segmentation: tags for membership tier, volunteer status
- [ ] Create email template matching PCHS branding (#CC0033 red, #111111 dark, Inter/Oswald fonts)
- [ ] Test double opt-in flow

### Signup Form
- [ ] Design signup form UX (see "Decisions Needed" below)
- [ ] Build form with fields: Name, Email, Phone (optional for SMS), Sports (multi-select), Level (multi-select), Role, Communication Preference
- [ ] Embed on the Next.js site (Mailchimp embed or custom form)
- [ ] Add "Join Our Community" CTAs to: homepage, membership page, footer, about page
- [ ] Mobile-responsive form design
- [ ] Success confirmation with next steps ("Check your email", "Follow us on Facebook")

### Volunteer Signup
- [ ] Create Google Form or SignUpGenius for volunteer signups
- [ ] Fields: Name, Email, Phone, Available Dates, Preferred Role (concessions, events, coaching, fundraising)
- [ ] Embed or link on `app/volunteer/page.tsx`
- [ ] Add "volunteer" tag in Mailchimp for form respondents (manual import or Zapier)

### Facebook Group
- [ ] Create "PC Athletic Boosters Community" Facebook Group
- [ ] Set group rules and moderation guidelines
- [ ] Add link to site (footer, about page, signup confirmation)
- [ ] Invite initial members (board, known families)

### Admin Documentation
- [ ] Mailchimp admin guide: how to send targeted email, how to send SMS blast, how to view/manage contacts
- [ ] Volunteer signup management: how to review responses, add to Mailchimp
- [ ] Facebook Group moderation guide
- [ ] Annual handoff notes: account ownership transfer, billing

## Decisions Needed During Planning

1. **Embedded Mailchimp form vs. custom Next.js form:**
   - Mailchimp embed: simpler, no backend needed, but limited styling
   - Custom form: full design control, matches site UX, but needs Mailchimp form-action endpoint
   - The form submits directly to Mailchimp servers either way -- no backend code required

2. **Which sports/age groups to list:** Need to enumerate all PC youth and high school sports

3. **Signup flow location:** Standalone `/join` page? Modal? Section on existing pages? All three?

4. **Communication preferences page:** Should existing members be able to update their sport selections and email/SMS preference? (Mailchimp has a "manage preferences" link in every email)

5. **Youth vs. HS sections:** Should the signup form distinguish between "I'm a youth sports family" and "I'm a high school family"? Or just list all sports/levels and let parents pick?

6. **Volunteer tool:** Google Forms (simplest, free) vs. SignUpGenius (purpose-built for volunteer scheduling, free tier, well-known in school communities)

## Integration Points

- **From 01-brand-color-scheme:** Email template uses PCHS colors from the updated palette
- **To 03-payment-integration:** Stripe success pages should prompt users to sign up for Mailchimp list if they haven't already. Plan the CTA but implement after Split 03.

## Key Files (likely to modify)

- New page or component for signup form
- `app/volunteer/page.tsx` -- embed volunteer signup
- `components/layout/Footer.tsx` -- add community join CTA
- Various pages for "Join" CTAs

## Constraints

- **Static site:** No server-side code. Mailchimp embedded forms submit directly to Mailchimp servers. Custom forms use Mailchimp's form-action POST endpoint.
- **501(c)(3) required** for nonprofit discount -- verify status before applying
- **Mailchimp Essentials limits:** 500 contacts, 5,000 emails/month. Budget for upgrade to 1,000 contacts ($20/mo = $240/yr) when needed.
- **SMS credits:** 1 SMS = 1 credit, 1 MMS = 3 credits. 1,000/month should cover early needs.
