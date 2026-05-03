# NestPH — Project Documentation for Claude Code Sessions

> **Rule #1:** Before building any UI component or page, always call `mcp__stitch__get_screen` to read the relevant Stitch design screen first. Project ID: `9184016236774829405`. Screen IDs listed in the Stitch Reference section below.

---

## Project Overview

**NestPH** is a full-stack real estate listing website for property sales in the Philippines. It is a portfolio project demonstrating modern web development with Next.js 14, Supabase, and production-grade security patterns.

**Tagline:** "Find your place in the Philippines"
**Target market:** Philippine real estate — Cebu City, Mandaue, Lapu-Lapu, Talisay (and beyond)
**Property type:** Sales only — no rentals

**Core features:**
- Public property listings with search, filter, and detail pages
- Agent registration with Super Admin approval flow
- Agent admin dashboard (manage own listings + inquiries)
- Super Admin panel (manage all agents, listings, inquiries)
- Contact/inquiry form with spam protection
- Rule-based chat assistant (no AI API — free)
- Mortgage calculator (client-side, PHP currency)
- Agent public profiles with stats

---

## Tech Stack

| Technology | Version | Why |
|---|---|---|
| **Next.js** | 14 (App Router) | Server components, file-based routing, API routes, SSR/SSG |
| **TypeScript** | 5.x | Type safety across the entire stack |
| **Tailwind CSS** | 3.x | Utility-first styling aligned to design token system |
| **Supabase** | latest | Postgres DB + Auth + Row Level Security + Storage in one |
| **Vercel** | — | Zero-config Next.js deployment, preview URLs |
| **Zod** | 3.x | Schema validation on both client and server |
| **Upstash Redis** | latest | Serverless rate limiting for contact/chat API routes |
| **Google reCAPTCHA v3** | — | Invisible spam scoring on contact form |
| **Resend** | latest | Transactional email (inquiry alerts, agent approval notifications) |
| **Inter** | Google Fonts | Open-source substitute for Airbnb Cereal — clean, professional |

**Not used (intentional):**
- No AI/LLM API — chatbot is rule-based keyword matching against Supabase
- No Prisma — using Supabase JS client directly
- No Redux — React state + URL params sufficient for this scope
- No map library — no map view (Grid + List only)

---

## Stitch Design Reference

**Project:** Modern Property Portal
**Project ID:** `9184016236774829405`

> Always fetch the screen before building its page/components.

| Screen Title | Screen ID | Route | Notes |
|---|---|---|---|
| EstatePro \| Home | `625f309c506e40e4b12d8863914c1b39` | `/` | Hero, featured, locations, agents CTA |
| Property Details | `ae6854472c2847689736f86eecf114ec` | `/properties/[id]` | Gallery, specs, mortgage calc, agent card |
| Property Search | `8ed3039243a64457afcde7590393e320` | `/properties` | Filters, grid/list toggle, results |
| Agent Profile | `6ea52db6c4b3417e86ad9e76f57a1807` | `/agents/[id]` | Stats, bio, active listings |
| My Dashboard | `0f19684d7ef14d1eac1b4c237bbb368d` | `/dashboard` | Agent dashboard reference |

**How to fetch a screen:**
```
mcp__stitch__get_screen({
  name: "projects/9184016236774829405/screens/[SCREEN_ID]",
  projectId: "9184016236774829405",
  screenId: "[SCREEN_ID]"
})
```

Then fetch the `htmlCode.downloadUrl` via WebFetch to read the actual component structure.

---

## Design System

### Colors (CSS Custom Properties in `globals.css`)

```css
--primary:            #1B3A5C;   /* Deep Navy — main brand, CTAs, nav */
--primary-dark:       #002444;   /* Darker navy */
--primary-active:     #152D47;   /* Press/hover state */
--primary-disabled:   #B8C9DC;   /* Disabled CTA */
--ink:                #1a1c1e;   /* Headlines */
--body:               #3f3f3f;   /* Long-form copy */
--muted:              #43474e;   /* Sub-labels, metadata */
--hairline:           #c3c6cf;   /* Borders, dividers */
--outline:            #73777f;   /* Form outlines */
--canvas:             #ffffff;   /* Page background */
--surface:            #faf9fc;   /* Soft page tint */
--surface-soft:       #f4f3f6;   /* Hover/disabled backgrounds */
--surface-card:       #ffffff;   /* Card backgrounds */
--error:              #ba1a1a;   /* Validation errors */
--secondary:          #555f6f;   /* Secondary actions */
--secondary-container:#d6e0f3;   /* Secondary button backgrounds */
```

### Typography (Inter — Google Fonts)

| Token | Size | Weight | Use |
|---|---|---|---|
| `h1` | 40px | 600 | Hero headlines |
| `h2` | 32px | 600 | Section headings |
| `h3` | 24px | 600 | Card titles, subsections |
| `body-lg` | 18px | 400 | Lead paragraphs |
| `body-md` | 16px | 400 | Default body text |
| `body-sm` | 14px | 400 | Card meta, captions |
| `label-bold` | 14px | 600 | Property specs (3 BD \| 2 BA) |
| `caption` | 12px | 400 | Timestamps, fine print |

### Spacing

| Token | Value | Use |
|---|---|---|
| Base unit | 4px | All spacing multiples |
| Section padding | 64px | Vertical between major sections |
| Card gutter | 16px | Between cards in grid |
| Stack XS | 8px | Tight internal spacing |
| Stack MD | 16px | Standard internal padding |
| Stack LG | 24px | Card internal padding |
| Max width | 1280px | Content container |

### Shape

| Element | Radius | Value |
|---|---|---|
| Property cards | `rounded-md` | 14px (`0.75rem`) |
| Buttons, inputs | `rounded-sm` | 8px (`0.5rem`) |
| Search bar | `rounded-full` | 9999px |
| Badges/chips | `rounded-full` | 9999px |

### Elevation

Single shadow tier only — used on hover and elevated cards:
```css
box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
```
Flat state = no shadow. Never use multiple shadow tiers.

---

## Folder Structure

```
nestph/
├── app/
│   ├── (public)/                       # Public routes (no auth required)
│   │   ├── page.tsx                    # Home
│   │   ├── properties/
│   │   │   ├── page.tsx                # Listings search + filter
│   │   │   └── [id]/page.tsx           # Property detail
│   │   ├── agents/
│   │   │   ├── page.tsx                # All approved agents
│   │   │   └── [id]/page.tsx           # Agent public profile
│   │   ├── contact/page.tsx
│   │   ├── about/page.tsx
│   │   ├── become-an-agent/page.tsx    # Marketing → registration CTA
│   │   ├── terms/page.tsx
│   │   └── privacy/page.tsx
│   ├── (admin)/                        # Protected routes
│   │   ├── dashboard/                  # Agent dashboard
│   │   │   ├── page.tsx
│   │   │   ├── listings/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   └── inquiries/page.tsx
│   │   └── admin/                      # Super Admin panel
│   │       ├── page.tsx
│   │       ├── agents/page.tsx
│   │       ├── listings/page.tsx
│   │       └── inquiries/page.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── callback/route.ts
│   ├── api/
│   │   ├── contact/route.ts            # Spam-protected contact form
│   │   ├── chat/route.ts               # Rule-based chatbot
│   │   └── admin/agents/route.ts       # Agent management (super_admin only)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                             # Base primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   └── PriceRangeSlider.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── properties/
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyGrid.tsx
│   │   ├── PropertyList.tsx
│   │   ├── ViewToggle.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── PhotoGallery.tsx
│   │   ├── Lightbox.tsx
│   │   └── MortgageCalculator.tsx
│   ├── agents/
│   │   ├── AgentCard.tsx
│   │   └── AgentStatsGrid.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── FeaturedListings.tsx
│   │   ├── LocationCollections.tsx
│   │   └── MeetOurAgents.tsx
│   ├── contact/
│   │   └── ContactForm.tsx
│   └── chat/
│       └── ChatWidget.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   # Browser client (createBrowserClient)
│   │   └── server.ts                   # Server client (createServerClient + cookies)
│   ├── validations/
│   │   ├── contact.ts                  # Zod schema: contact form
│   │   └── listing.ts                  # Zod schema: listing form
│   ├── rate-limit.ts                   # Upstash Redis rate limiter setup
│   ├── recaptcha.ts                    # reCAPTCHA v3 server verification
│   ├── resend.ts                       # Email sending helpers
│   └── chatbot.ts                      # Keyword intent classifier + Supabase queries
├── middleware.ts                        # Route protection
├── types/
│   └── index.ts                        # Shared TypeScript types
├── CLAUDE.md                           # This file
├── .env.local                          # Environment variables (gitignored)
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Database Schema

### `agents` table
```sql
CREATE TABLE agents (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  bio             TEXT,
  avatar_url      TEXT,
  years_experience INTEGER DEFAULT 0,
  fb_username     TEXT,                        -- optional: m.me/[fb_username]
  status          TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'suspended'
  role            TEXT NOT NULL DEFAULT 'agent',   -- 'agent' | 'super_admin'
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);
```

### `properties` table
```sql
CREATE TABLE properties (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id      UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  price         DECIMAL(12,2) NOT NULL,
  property_type TEXT NOT NULL,             -- 'house' | 'condo' | 'apartment' | 'land' | 'commercial'
  status        TEXT NOT NULL DEFAULT 'for_sale', -- 'for_sale' | 'sold' | 'pending'
  bedrooms      INTEGER,
  bathrooms     INTEGER,
  area_sqft     INTEGER,
  address       TEXT NOT NULL,
  city          TEXT NOT NULL,             -- 'Cebu City' | 'Mandaue' | 'Lapu-Lapu' | 'Talisay' | other
  state         TEXT NOT NULL,
  zip_code      TEXT,
  images        TEXT[] DEFAULT '{}',       -- Supabase Storage URLs (max 10, 5MB each)
  amenities     TEXT[] DEFAULT '{}',
  featured      BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);
```

### `inquiries` table
```sql
CREATE TABLE inquiries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID REFERENCES properties(id) ON DELETE SET NULL,
  agent_id        UUID REFERENCES agents(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  message         TEXT NOT NULL,
  recaptcha_score DECIMAL(3,2),
  status          TEXT NOT NULL DEFAULT 'new', -- 'new' | 'read' | 'replied'
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

### Computed values (not stored)
- **Properties Sold per agent:** `SELECT COUNT(*) FROM properties WHERE agent_id = $1 AND status = 'sold'`

### RLS Policy Summary
- `properties` SELECT (public): only where agent `status = 'approved'`
- `properties` INSERT/UPDATE/DELETE: only own rows (`agent_id = auth.uid()`)
- `properties` ALL: unrestricted for `super_admin`
- `agents` SELECT (public): only `status = 'approved'`
- `agents` SELECT: all rows for `super_admin`
- `agents` UPDATE: own row for agent; all rows for `super_admin`
- `inquiries` SELECT: own (`agent_id = auth.uid()`) for agent; all for `super_admin`
- `inquiries` INSERT: service role only (via API route, never direct client)

---

## Role & Auth System

| Role | Assignment | Dashboard Access |
|---|---|---|
| `super_admin` | Hardcoded: `SUPER_ADMIN_EMAIL` env var. DB trigger sets `role = 'super_admin'` on first login. | `/admin/*` + `/dashboard/*` |
| `agent` | Self-register → `status = 'pending'` until Super Admin approves | `/dashboard/*` only when `status = 'approved'` |
| `public` | Unauthenticated | Public pages only |

**Agent registration flow:**
1. Agent registers at `/auth/register`
2. Row inserted in `agents` with `status = 'pending'`, `role = 'agent'`
3. Resend email fires to `SUPER_ADMIN_EMAIL` — "New agent registration: [name]"
4. Agent sees "Pending approval" screen when they log in
5. Super Admin approves in `/admin/agents` → `status = 'approved'`
6. Agent can now access `/dashboard` and create listings

**`middleware.ts` guards:**
- `/dashboard/*` → authenticated + (`role = 'agent'` AND `status = 'approved'`) OR `role = 'super_admin'`
- `/admin/*` → authenticated + `role = 'super_admin'`
- Both redirect to `/auth/login` if not authenticated

---

## Environment Variables

All variables must be set in `.env.local` locally and in Vercel project settings for production.

```env
# Supabase — https://supabase.com/dashboard
NEXT_PUBLIC_SUPABASE_URL=            # Project URL (Settings > API)
NEXT_PUBLIC_SUPABASE_ANON_KEY=       # anon/public key (Settings > API)
SUPABASE_SERVICE_ROLE_KEY=           # service_role key (Settings > API) — SERVER ONLY

# Upstash Redis — https://console.upstash.com
UPSTASH_REDIS_REST_URL=              # REST URL from Upstash console
UPSTASH_REDIS_REST_TOKEN=            # REST token from Upstash console

# Google reCAPTCHA v3 — https://www.google.com/recaptcha/admin
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=      # Site key (public — safe to expose)
RECAPTCHA_SECRET_KEY=                # Secret key — SERVER ONLY

# Resend — https://resend.com/api-keys
RESEND_API_KEY=                      # API key — SERVER ONLY
RESEND_FROM_EMAIL=                   # Verified sender address (e.g. no-reply@nestph.com)
AGENT_NOTIFICATION_EMAIL=            # Where inquiry alerts are sent (agent's email, set per-request)
SUPER_ADMIN_EMAIL=noynay09xavier@gmail.com  # Hardcoded Super Admin — SERVER ONLY

# App
NEXT_PUBLIC_APP_URL=                 # https://nestph.vercel.app (or localhost:3000 for dev)
```

**Security rule:** Variables prefixed `NEXT_PUBLIC_` are exposed to the browser. Never put `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RECAPTCHA_SECRET_KEY`, or `SUPER_ADMIN_EMAIL` in a `NEXT_PUBLIC_` variable.

---

## How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in values
cp .env.example .env.local
# Edit .env.local with your keys

# 3. Start development server
npm run dev
# → http://localhost:3000

# 4. Other commands
npm run build          # Production build
npm run lint           # ESLint check
npm run type-check     # TypeScript check
```

---

## Build Phases

| Phase | Focus | Key Files |
|---|---|---|
| 1 | Project Bootstrap | `package.json`, `tailwind.config.ts`, `globals.css`, `CLAUDE.md` |
| 2 | Supabase Setup | Schema SQL, RLS policies, storage bucket, `lib/supabase/*`, `middleware.ts` |
| 3 | Design System | `components/ui/*`, `Navbar.tsx`, `Footer.tsx` |
| 4 | Public Pages | Home, Properties, Property Detail, Agent pages, static pages |
| 5 | Auth + Agent Dashboard | Login/register, `/dashboard/*`, image upload |
| 6 | Super Admin Panel | `/admin/*`, agent approval, platform-wide views |
| 7 | Contact Form Security | `ContactForm.tsx`, `api/contact/route.ts` |
| 8 | Chat Widget | `lib/chatbot.ts`, `api/chat/route.ts`, `ChatWidget.tsx` |
| 9 | Polish + Deploy | SEO metadata, skeletons, error pages, Vercel |

---

## Security Rules & Conventions

1. **Zod on every API route** — parse and validate before any DB write, even if client already validated
2. **Contact form pipeline:** honeypot empty check → reCAPTCHA score ≥ 0.5 → Upstash rate limit (5 req/hr per IP) → DB insert → Resend email
3. **Image uploads:** server-side only via service role. Validate MIME type (jpeg/png/webp only), max 5MB per image, max 10 images per listing
4. **Route protection:** `middleware.ts` runs before every protected route. Never rely on client-side redirects alone.
5. **RLS is the last line of defense** — always write and test RLS policies even if middleware exists
6. **Super Admin validation:** every `/admin` API route must re-check `role = 'super_admin'` server-side using the service role client. Never trust client-sent role claims.
7. **Chat API:** Upstash rate limit 20 req/min per IP. All Supabase queries use parameterized values — never string concatenation.
8. **Agent visibility:** listings are invisible on public pages until `agent.status = 'approved'`. Enforce via RLS JOIN on agents table.
9. **No secrets in code** — all keys in `.env.local` / Vercel env vars. `.env.local` is gitignored.

---

## Rule-Based Chatbot

File: `lib/chatbot.ts`
Endpoint: `POST /api/chat` → `{ message: string }` → `{ reply: string, listings?: Property[] }`

| Intent | Trigger Keywords | DB Action |
|---|---|---|
| `greeting` | hi, hello, hey, good morning | Static welcome reply |
| `help` | help, what can you do | List bot capabilities |
| `search_city` | cebu, mandaue, lapu-lapu, talisay + any city name | `WHERE city ILIKE '%cebu%'` |
| `price_range` | under ₱X, below X, max X, budget | `WHERE price <= X` |
| `bedrooms` | X bedroom, X bed, X br | `WHERE bedrooms >= X` |
| `featured` | featured, best, top, recommended | `WHERE featured = true` |
| `property_type` | house, condo, apartment, land, commercial | `WHERE property_type = X` |
| `for_sale` | for sale, available, active | `WHERE status = 'for_sale'` |
| `contact` | agent, contact, call, message | Return `/contact` page link |
| `count` | how many, total listings, count | `SELECT COUNT(*)` |
| `fallback` | anything unmatched | "Try asking about price, location, or bedrooms" |

Rate limit: 20 requests/minute per IP. All queries parameterized. Never concatenate user input into SQL.

---

## Important Notes for Future Claude Code Sessions

1. **Read CLAUDE.md first** before making any changes — this file is the single source of truth for this project.

2. **Read Stitch before building UI** — always call `mcp__stitch__get_screen` for the relevant screen, then fetch its `htmlCode.downloadUrl` via WebFetch to read component structure before writing any page or component.

3. **This is sales-only** — no rental features. Do not add `price_type`, `rent`, or rental-related fields.

4. **Philippine context** — city names are Cebu City, Mandaue, Lapu-Lapu, Talisay. Currency is Philippine Peso (₱). Mortgage calculator outputs PHP monthly payments.

5. **Three roles, not two** — `super_admin`, `agent`, `public`. The Super Admin email is hardcoded in `SUPER_ADMIN_EMAIL` env var. Do not create a registration flow for Super Admin.

6. **Agent approval is required** — new agents start as `pending`. Their listings are invisible until Super Admin approves. This is enforced at the RLS level, not just middleware.

7. **No buyer accounts** — only agents and the Super Admin have accounts. Public users browse anonymously.

8. **No map view** — property search is Grid + List only. Do not add map/Mapbox/Google Maps.

9. **No star ratings, no favorites** — property cards are clean. No heart icons, no review scores.

10. **Chatbot is rule-based** — no Claude API, no OpenAI. Keyword detection + Supabase queries only. Keep it free.

11. **Single shadow tier** — `0px 4px 12px rgba(0,0,0,0.05)` on hover only. Do not add multiple shadow levels.

12. **Facebook Messenger** — agents can optionally set `fb_username`. If set, show "Message on Facebook" button on their profile and property detail agent card linking to `https://m.me/[fb_username]`.

13. **Properties Sold is auto-calculated** — never ask agents to input this. Always compute from `COUNT WHERE status='sold'`.

14. **Image upload limits** — max 10 images per listing, max 5MB each, jpeg/png/webp only. Validate server-side.

15. **Footer social icons** — Facebook and Instagram only. No Twitter/X, no LinkedIn.
