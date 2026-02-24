# Deep Project Interview Transcript

> **Date:** 2026-02-24
> **Project:** PC Athletic Boosters Website & Platform Integration
> **Requirements File:** `docs/plans/boosterhub-integration.md`

---

## Interview Summary

The requirements document contains thorough research on platform options (BoosterHub, BoosterSpark, Membership Toolkit, Stripe, GroupMe, Mailchimp) and recommends Option D (Best-in-Class Hybrid: Stripe + BoosterHub backend + communication platform). However, the interview revealed that the document was solving the wrong problem.

### Key Discoveries That Changed the Project Direction

1. **BoosterHub has NOT launched.** The user got stuck integrating BoosterHub's pre-canned pages into the custom site. There is zero migration cost -- they can walk away.

2. **Transaction volume is under 200/year.** BoosterHub at $850/yr = $4+/transaction in platform fees alone. Massively poor value.

3. **The booster club has $700K in the bank** from pull tab fundraising. Payment UX / fundraising is a LOW priority.

4. **Communication fragmentation is the #1 problem.** Each youth sports club has its own Facebook page/app. Pages change when parent volunteers rotate out. There's no unified platform for announcements, signups, or coordination across the PC athletics community.

5. **The booster club wants to be the BRIDGE** between fragmented youth sports and high school athletics -- a central hub for all PC families.

6. **High school is already somewhat solved** (school website + TeamSnap for team comms). Youth is where it's broken.

7. **Booster parents ARE the youth league leaders** -- there's overlap. Buy-in for unification is a conversation, not a sales pitch.

8. **Board members are comfortable with apps** -- tech literacy isn't a blocker.

9. **Self-select targeting is the model** -- parents pick which sports/age groups to follow at signup.

### Original Problem (from requirements doc)
> "BoosterHub's customer-facing transaction pages are ugly and can't be integrated into our custom site."

### Actual Problem (from interview)
> "Youth sports communication in Port Clinton is fragmented across dozens of Facebook pages and apps. There's no central hub for parents. The booster club should be that hub -- connecting youth families to high school athletics with targeted, relevant communication."

---

## Finalized Tech Stack

### Approved Stack

| Component | Tool | Annual Cost | Purpose |
|-----------|------|-------------|---------|
| Website | **Next.js site** (existing) | $0 (hosting) | Front door, signup forms, content, social feed |
| Email Marketing | **Mailchimp Essentials** | ~$133/yr (15% nonprofit) | Self-registration with Groups, targeted email by sport/age |
| Payments | **Stripe Payment Links + Buy Buttons** | $0 platform (2.9% + $0.30/txn) | Memberships (annual recurring), donations (monthly recurring), spirit wear |
| Real-time Chat | **GroupMe** | $0 | Game-day coordination, volunteer reminders, sport-specific groups |
| Social Media Design | **Canva for Nonprofits** | $0 | Design + scheduling to all platforms, up to 50 users |
| Social Media Mgmt | **Meta Business Suite** | $0 | Facebook + Instagram scheduling, inbox, analytics |
| Social Feed Widget | **Curator.io** (free plan) | $0 | Aggregate FB + IG + 1 more into a feed on the site |
| SMS Blasts | **EZ Texting** (add later) | ~$240/yr when needed | Mass SMS to parents who prefer text over email |

### Dropped

| Tool | Why Dropped |
|------|-------------|
| **BoosterHub** ($850/yr) | Never launched, $4+/txn at <200 volume, terrible web UX, no API, overkill for this scale |
| **BoosterSpark** ($1,068/yr) | More expensive, no POS, no app, no SMS, virtually no reviews |
| **Membership Toolkit** ($550-850/yr) | Walled garden, no API, designed for PTAs |

### Annual Cost Projection

| Item | Cost |
|------|------|
| Mailchimp Essentials (500 contacts, 15% nonprofit) | ~$133 |
| Stripe transaction fees (~200 txn, ~$50 avg) | ~$320 |
| Everything else | $0 |
| **Total** | **~$453/yr** |

vs. BoosterHub Pro alone: $850/yr + Usio transaction fees

---

## Detailed Interview Q&A

### Q1: Has the board approved Option D from the requirements doc?

**A:** "I did a lot of research, but I'm not sure on the proper tech stack. We need to make sure whatever we do gets used by the intended audience and is manageable by boosters - current and future members. I want a simple, all in one solution, but that doesn't seem to work - maybe. I really need help weighing the options and picking and building the integration that will work best and drive the most value to the kids and families in PC."

**Key insight:** Decision not made. User wants help choosing, not just implementing.

### Q2: How tech-savvy is the typical booster board member?

**A:** Comfortable with apps. Most board members use Facebook, shop online, comfortable signing up for new tools, can follow written instructions.

### Q3: What communication reaches parents today?

**A:** "Today is terrible. It's fragmented. Each youth club has its own Facebook or apps. The Facebook changes when the parents who run it change. Less people are using Facebook. The high school has Final Forms, but some communications don't get through that channel. This is the key thing we want to fix or be part of fixing."

**Key insight:** Communication fragmentation is the #1 pain point, not payment UX.

### Q4: Biggest frustration with current setup?

**A:** "We haven't launched BoosterHub. I got to the integration and their pre-canned pages were so bad and seemingly impossible to integrate into our site seamlessly."

**Key insight:** BoosterHub never went live. Zero sunk cost in terms of member data or active workflows.

### Q5: Are you locked into BoosterHub financially?

**A:** Paid but could cancel. No long-term contract.

### Q6: Is Athletic Boosters the umbrella for all youth sports or just high school?

**A:** "High school has a good website through the school, and is using TeamSnap for team communications. Youth is where it's broken and fragmented. Besides having multiple apps and pages and no unified coordination, if my son is on a flag football team with one coach, there isn't a unified app to communicate with all parents about next year's football signups - just that team's coach, not the organization. The pain point is youth, but boosters primarily supports high school."

**Key insight:** The vision is "boosters as the bridge" -- youth to varsity pipeline.

### Q7: Transaction volume expectation?

**A:** Under 200 transactions per year.

### Q8: What should the website primarily DO?

**A:** "This is a huge question I need help with. 1) Boosters has no presence - no social, no page, nothing. 2) We used to be primarily about raising money, but then pull tabs became a fundraising method and we have $700K in the bank with no plans. We should be fundraising, but no mission = no spending. 3) Youth sports is a pain point - coaches, coordination, alignment and involvement with varsity as a whole 'program' and funnel. I imagine: A) Social media to help parents find signups and be a single platform to follow, B) Sign up for membership lets you get on announcement lists for your kid's age and sex specific, C) Membership gets you booster communications so you can be involved, D) Volunteers for events or coaching, E) Maybe message boards? I want to put the right pressure on the school to strive for excellence... We need to have some standards!"

**Key insight:** The website is a community engagement platform, not primarily a fundraising tool.

### Q9: How does the booster club connect to youth sports?

**A:** "Boosters as the bridge." Many booster parents also coach/run youth leagues. There's overlap.

### Q10: No app concerns?

**A:** "This might be OK - who needs another app. I wish people could pick SMS or email or preferred communications."

### Q11: Brevo vs. Mailchimp?

After detailed comparison, user chose **Mailchimp Essentials** for better self-registration (Groups feature), brand trust, and community support. SMS to be handled separately (EZ Texting or similar) when needed.

### Q12: Recurring payments / subscriptions?

**A:** User confirmed interest in annual recurring memberships and monthly recurring donations via Stripe. Stripe handles this automatically including Customer Portal for self-service management.

---

## Decisions Made During Interview

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Keep BoosterHub? | **No -- cancel** | Never launched, <200 txn, $850/yr wasted, no API |
| Email platform | **Mailchimp Essentials** | Best self-registration (Groups), well-known, $133/yr |
| Payment platform | **Stripe** | $0 platform fee, subscriptions, Buy Buttons, professional UX |
| Real-time comms | **GroupMe** | Free, SMS fallback for onboarding, easy |
| Social media | **Canva for Nonprofits + Meta Business Suite** | Both free, covers design + scheduling |
| Social feed on site | **Curator.io** (free) | 3 sources, 2K views/mo, custom CSS |
| SMS blasts | **EZ Texting** (deferred) | Add when needed, ~$240/yr |
| Membership model | **Annual recurring** | Set-and-forget, auto-renew via Stripe |
| Donation model | **Monthly recurring option** | $5/mo > $60 one-time psychologically |
| Targeting model | **Self-select at signup** | Parents choose sports/ages via Mailchimp Groups |
| Color scheme | **#CC0033 + #111111** | Matches BSN/school, passes WCAG AA |

---

## Constraints & Context for Implementation

1. **Next.js App Router** -- static site, no backend server. All integrations must work client-side or via embedded forms/scripts.
2. **Volunteer turnover** -- everything must be documented in a runbook. Annual handoff is reality.
3. **Board tech level** -- comfortable with apps, can follow instructions. Tools must have good UX.
4. **501(c)(3) status** -- enables nonprofit discounts (Canva free, Mailchimp 15%, etc.)
5. **Existing site is polished** -- the custom Next.js site already has good design, just needs correct colors and integration points.
6. **No backend** -- Stripe Buy Buttons, Mailchimp embedded forms, Curator.io scripts all work without server code.
7. **Youth-to-varsity vision** -- the site should feel welcoming to ALL PC sports families, not just HS boosters.
