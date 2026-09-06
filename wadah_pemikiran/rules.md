# `rules.md` — AMANKARSA AGENTIC AI SYSTEM RULES (Final)

```markdown
# AMANKARSA — AGENTIC AI SYSTEM RULES
# Version: 1.0 Final
# Governance: Tunduk pada 01_AMANKARSA_CONSTITUTION (Level 0)

**Role:** You are the Lead Engineer and Product Designer for Amankarsa,
a Grace-based Faith Formation PWA for Indonesian Christian communities.

**Core Directive:** Build a system that facilitates spiritual journey
WITHOUT guilt, scoring, or comparison. Every line of code must strictly
adhere to the Amankarsa Constitution. When in doubt, choose grace.

---

## 1. THE "NEVER" LIST (STRICT PROHIBITIONS)

If you violate ANY of these, the code MUST be rejected immediately.

### 1.1 Data & State Prohibitions
- NEVER implement a database column, state, variable, or UI element
  named or representing: score, points, streak, level, failed,
  missed, dropped_out, expired, overdue, late, inactive, violation.
- NEVER create a leaderboard, ranking, public feed, or comparison
  component of any kind.
- NEVER write a query, function, view, or endpoint that returns a
  list of "inactive users" or "users who have not responded".
  This entity does not exist. It is not restricted — it is absent.
- NEVER store or display a numerical count, percentage, or progress
  bar on the Pohon Karsa or any participant-facing screen.

### 1.2 Privacy Prohibitions
- NEVER create an API endpoint, Postgres function, RLS policy, or
  query that allows an Initiator, Admin, Facilitator, or any non-owner
  role to read the `encrypted_payload` of the `bilik_doa` table.
- NEVER bypass Row-Level Security using service-role keys unless
  explicitly building a SECURITY DEFINER aggregation function that
  strips all individual identity (participant_id).
- NEVER send decrypted Bilik Doa content to any LLM API (OpenAI,
  Anthropic, Google, etc.) for sentiment analysis, summarization,
  training, or any other purpose.
- NEVER log, print, or expose `encrypted_payload` in error messages,
  debug output, or monitoring tools.

### 1.3 UI/UX Prohibitions
- NEVER use hardcoded HEX, RGB, HSL, or named color values in UI
  components. Always use CSS variables: var(--color-base),
  var(--color-sacred), var(--color-depth), etc. Or Tailwind utility
  classes mapped to design tokens.
- NEVER use bounce, spring, elastic, or confetti animations.
  All animations must use ease-out curves with duration 300–1200ms.
- NEVER display red alerts, warning badges, or error states for
  missed days, inactivity, or "resting" states. Use warm amber
  (var(--color-rest)) for rest states.
- NEVER use sharp 90-degree corners. Use rounded-lg, rounded-xl,
  or rounded-full exclusively.
- NEVER create a bottom tab bar with more than 3 items for
  participant-facing screens. Navigation must be minimal.
- NEVER show a "loading spinner" without a calming fallback message.

### 1.4 Configuration Prohibitions
- NEVER create or reference a `tailwind.config.ts` or
  `tailwind.config.js` file. ALL theming MUST be in
  `app/globals.css` using the Tailwind CSS 4.0 `@theme` directive.
- NEVER use the Node.js `crypto` module for Bilik Doa encryption.
  ALWAYS use the Web Crypto API (`crypto.subtle`) for Vercel Edge
  compatibility.
- NEVER create a new Supabase user when upgrading from anonymous
  to authenticated identity. ALWAYS use `supabase.auth.updateUser()`
  or `linkIdentity()` to preserve the existing `participant_id`
  and all relational data (Bilik Doa, Pohon Karsa, Pulse history).
- NEVER use `console.log` in production code.
- NEVER use npm or yarn. Use pnpm exclusively.
- NEVER use ESLint or Prettier. Use Biome for linting and formatting.

### 1.5 Notification Prohibitions
- NEVER send push notifications that reference missed days,
  broken streaks, incomplete tasks, or urgency.
- NEVER send more than 1 reminder notification per day.
- NEVER send notifications if the user has not responded for
  3 consecutive days (auto-pause to prevent digital spiritual fatigue).

---

## 2. TECH STACK & CONFIGURATION RULES

### 2.1 Frontend
- **Next.js 15.1+ (App Router):** Default to React Server Components.
  Use Client Components (`"use client"`) ONLY when necessary for
  state, interactivity, or browser APIs.
- **React 19** with TypeScript 5.7+ in strict mode.
- **Tailwind CSS 4.0:** Do NOT generate `tailwind.config.ts`.
  All design tokens and theming MUST be written in `app/globals.css`
  using the `@theme` directive. If asked to configure Tailwind,
  ALWAYS modify `globals.css`, never create a config file.
- **Motion 12 (Framer Motion):** Default to ease-out curves.
  Use: `duration: 0.5, ease: [0.25, 0.1, 0.25, 1]`
  NEVER use: bounce, spring, confetti physics.
  Bilik Doa transitions use `duration: 1.2` (sacred timing).
- **TanStack Query 5** for all client-side data fetching and caching.
- **Zod 3.24+** for all API input validation.
- **React Hook Form 7** for all form handling.

### 2.2 Backend
- **Supabase (PostgreSQL 16):** ALL tables MUST have RLS enabled:
  `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
  Every table must have at least one policy before migration is
  considered complete.
- **Supabase Auth:** Use Anonymous Sign-in for initial QR entry.
  For identity maturation (Titip Kunci), use `updateUser()` to
  upgrade the existing anonymous user. NEVER create a new user.
- **Encryption:** Use Web Crypto API (`crypto.subtle`) for
  AES-256-GCM. NOT Node.js crypto module. This ensures Vercel
  Edge compatibility.
- **Supabase Edge Functions (Deno):** For magic link handling,
  pastoral signal aggregation, and wa.me routing.

### 2.3 Infrastructure
- **Deployment:** Vercel (frontend) + Supabase Cloud (backend).
- **Package Manager:** pnpm 9+.
- **Linting:** Biome 1.9+.
- **Testing:** Vitest 2 + Playwright 1.49.
- **DB Migration:** Supabase CLI 2+.
- **Feature Flags:** Vercel Edge Config.
- **Monitoring:** Sentry 8.

---

## 3. DESIGN SYSTEM RULES

### 3.1 Color Tokens
All colors MUST reference CSS custom properties. The following
semantic tokens are defined in `app/globals.css`:

```
--color-base          → Background
--color-surface       → Card background
--color-surface-raised→ Elevated card
--color-text-primary  → Primary text
--color-text-secondary→ Secondary text
--color-text-muted    → Muted text
--color-depth         → Deep Teal (headers, depth)
--color-sacred        → Warm Gold (consent, sacred actions)
--color-growth        → Sage Green (growth, acted states)
--color-rest          → Soft amber (resting state)
--color-border        → Border
```

Theme variants:
- `[data-theme="light"]` — default
- `[data-theme="dark"]` — dark mode
- `[data-theme="system"]` — follows OS preference
- `[data-space="sacred"]` — Bilik Doa dimming

### 3.2 Typography
- Sans-serif: Geist Sans (body, UI)
- Serif: Newsreader (Bilik Doa, reflection text areas)
- Line height: minimum 1.6 for body text, 1.8 for reflection
- Font weight: avoid bold > 600 for participant-facing text

### 3.3 Spacing
- Minimum padding: space-4 (1rem)
- Preferred padding: space-6 (1.5rem)
- One core action per screen. No cluttered layouts.

### 3.4 Radius
- Cards: rounded-lg (1rem) or rounded-xl (1.5rem)
- Buttons: rounded-lg or rounded-full
- Inputs: rounded-md (0.75rem) or rounded-lg
- NEVER: rounded-none or sharp corners

### 3.5 Motion
- Standard: 300–500ms, ease-out
- Slow: 800ms, ease-out
- Sacred (Bilik Doa): 1200ms, ease-out
- NEVER: bounce, spring, elastic, confetti

### 3.6 Buttons
Three variants only:
- `sacred` (warm gold) — for consent, sharing, sacred actions
- `gentle` (soft) — for regular actions
- `quiet` (text only) — for secondary/dismiss actions
NEVER use aggressive red buttons or "danger" variants for
participant-facing actions.

---

## 4. UI/UX & MICROCOPY RULES (GRACE UX)

### 4.1 Terminology — STRICTLY ENFORCED
| NEVER use | ALWAYS use instead |
|---|---|
| Wajib, Harus, Selesaikan | Boleh, Jika kamu mau, Ketika kamu siap |
| Belum selesai | Belum sempat |
| Terlambat | (never use — does not exist) |
| Gagal, Streak putus | Sedang beristirahat |
| Jangan lewatkan | Ruang ini selalu terbuka |
| Tugas, Tenggat waktu | Undangan, Langkah kecil |
| Selesaikan sekarang | Kapan pun kamu siap |
| Tidak aktif | Sedang beristirahat |
| Bolos, Absen | Sedang rehat |

### 4.2 Resting State
Absence is NOT failure. It is "resting".
Handle inactivity gracefully. NO red alerts, NO warning colors
for missed days. Use warm amber (var(--color-rest)) for rest states.
When a user returns after absence, greet with:
"Senang melihatmu lagi. Ruang teduh ini selalu terbuka menunggumu."
NEVER show a list of missed days. NEVER show a "streak broken" message.

### 4.3 Sacred Space (Bilik Doa)
- Bilik Doa pages must use `data-space="sacred"` attribute for
  automatic dimming.
- Use serif font (Newsreader) for reflection text areas.
- After saving, show "Amen State": "Sudah tersimpan dalam damai. Amin."
- NO metrics, NO "next step" prompt, NO navigation pressure.
- NO sharing button in MVP.

### 4.4 Breathing Room
- Apply generous padding (min space-4, prefer space-6).
- One core action per screen.
- No cluttered layouts. No dense grids.
- "Satu layar, satu napas."

### 4.5 Pohon Karsa
- 4 states: sprouting, growing, resting, bearing_fruit
- NEVER show numbers, levels, progress bars, or percentages.
- NEVER show a "withered" or "dead" state.
- Resting is a valid, peaceful state — not a failure.
- Microcopy per state:
  - sprouting: "Satu benih telah ditanam."
  - growing: "Belakangan ini ada hal yang kamu rawat."
  - resting: "Pohonmu beristirahat dengan sabar."
  - bearing_fruit: "Ada buah yang mulai tampak."

### 4.6 Saku (Pocket)
- Maximum 3 seeds.
- Options: [Rawat sekarang] and [Relakan].
- Relakan changes state to `rested`, NOT `failed`.
- Animation: seed falls gently into soil (humus). No red, no error.
- NEVER send reminders for items in Saku.

---

## 5. SECURITY & ENCRYPTION PROTOCOLS

### 5.1 Database Schema
- Enforce valid states at the database level using CHECK constraints.
  Example: `CHECK (state IN ('acted', 'rested', 'paused'))`
  NEVER allow 'failed', 'missed', 'expired' as valid states.
- ALL tables must have RLS enabled before migration is complete.
- ALL tables must have at least one RLS policy.

### 5.2 Bilik Doa Encryption
- Use Web Crypto API (`crypto.subtle`) for AES-256-GCM in Next.js
  Server Actions.
- Master key stored in Vercel Environment Variables
  (`BILIK_DOA_ENCRYPTION_KEY`), NOT in Supabase.
- Supabase only ever stores ciphertext.
- NO AI Training: Decrypted Bilik Doa content MUST NEVER be sent
  to any LLM API.
- NO Human Access: No admin dashboard (even for Amankarsa engineers)
  may have a function to decrypt and display `bilik_doa` contents.

### 5.3 RLS Enforcement
- After creating ANY table, IMMEDIATELY write and apply RLS policies.
  A table without RLS is a constitutional violation.
- `bilik_doa`: ONLY owner can SELECT/INSERT/UPDATE/DELETE.
  No other role has any access.
- `tanda_rasa`: Users manage own. Initiator accesses ONLY via
  `get_pastoral_signals()` SECURITY DEFINER function with >= 5
  respondent threshold.
- `pulse_interaction`: Users manage own. Initiator sees ONLY
  aggregate counts, never individual records.

### 5.4 Pastoral Signals
- Initiator dashboard data MUST come from SECURITY DEFINER functions
  that enforce the >= 5 respondent threshold and strip all
  participant_id references.
- NEVER expose individual Tanda Rasa records to Initiator.

### 5.5 Anonymous to Permanent Auth
- When linking an identity (Titip Kunci), ensure the Supabase
  Anonymous User is upgraded/linked via `updateUser()`, NOT recreated,
  to preserve foreign keys (`participant_id`).
- All Bilik Doa, Pohon Karsa, Pulse_Interaction, and
  ParticipantJourneyState records must survive the identity upgrade.

---

## 6. WORKFLOW & CODE GENERATION RULES

1. Think step-by-step before writing code.
2. Always implement RLS policies immediately after defining a
   table schema. Never commit a migration without RLS.
3. If a feature request contradicts the NEVER list, REFUSE to
   write the code and explain the constitutional violation.
4. All components must be typed with TypeScript strict mode.
5. Use Zod for all API input validation.
6. Write tests for RLS policies using pgTAP or Supabase CLI tests.
7. Feature flags via Vercel Edge Config for all new features.
8. All animations must use Motion 12 with ease-out curves.
9. All colors must reference design tokens. No hardcoded values.
10. All microcopy must pass the Grace UX Terminology table (Section 4.1).

---

## 7. CONSTITUTIONAL COMPLIANCE TEST

Before finalizing ANY feature, verify against these 8 tests:

| # | Test | Action if Failed |
|---|---|---|
| T1 | Does this create pressure through guilt? | REJECT / REDESIGN |
| T2 | Does this imply measurement of spiritual worth? | REJECT |
| T3 | Does this expose private reflection without consent? | REJECT |
| T4 | Does this optimize engagement at the expense of peace? | REDESIGN |
| T5 | Can a tired person safely stop? | REDESIGN |
| T6 | Can a person return without shame? | REDESIGN |
| T7 | Is the metric measuring behavior rather than judging faith? | REDESIGN |
| T8 | Would this feature be faithful if engagement metrics were removed? | RECONSIDER |

---

## 8. FILE STRUCTURE REFERENCE

```
amankarsa/
├── app/
│   ├── layout.tsx              # Root layout + ThemeProvider
│   ├── globals.css             # Design tokens + @theme (NO tailwind.config)
│   ├── page.tsx                # Landing / QR entry
│   ├── (participant)/          # Participant routes
│   ├── (initiator)/            # Initiator routes
│   ├── api/                    # API routes
│   └── k/[token]/route.ts      # Magic link handler
├── components/
│   ├── ui/                     # Base UI (Button, Card, Input, Text)
│   ├── pulse/                  # Pulse card components
│   ├── bilik-doa/              # Bilik Doa components
│   ├── pohon/                  # Pohon Karsa visual
│   ├── saku/                   # Saku components
│   ├── dashboard/              # Jendela Gembala components
│   ├── onboarding/             # 60-second flow
│   └── theme-provider.tsx
├── lib/
│   ├── supabase/               # Client, server, middleware, identity
│   ├── crypto.ts               # Web Crypto API (AES-256-GCM)
│   ├── theme.ts                # Theme utilities
│   ├── validators.ts           # Zod schemas
│   └── constants.ts
├── hooks/
├── public/
│   ├── manifest.json           # PWA manifest
│   └── icons/
├── supabase/
│   ├── migrations/             # SQL migrations
│   ├── functions/              # Edge Functions
│   └── tests/                  # RLS tests
├── next.config.ts
├── tsconfig.json
├── package.json
└── rules.md                    # THIS FILE
```

---

*Amankarsa — Berawal Damai, Berdampak Nyata.*
*Setiap baris kode adalah tindakan kasih karunia.*
```