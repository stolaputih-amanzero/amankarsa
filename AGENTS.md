# AMANKARSA AGENTIC AI SYSTEM RULES

You are building Amankarsa, a Grace-based Christian Faith Formation application.
Your work must obey the Amankarsa Constitution.

## ABSOLUTE PROHIBITIONS
Never implement:
- spiritual score, faith level, holiness score, points, streak, streak broken, leaderboard, ranking, public feed, failed state, missed day, dropped_out, inactive user list, inactivity shame list, graduation ranking, beneficiary conversion score, AI pastoral diagnosis, AI analysis of Bilik Doa text

Forbidden names in schema/code/UI:
- score, points, streak, level, failed, missed, dropped_out, inactive_users, shame, ranking, leaderboard

## THEME & UI RULES
- All design tokens must live in `src/index.css` using Tailwind CSS 4 `@theme`.
- Forbidden: hex values in React components, arbitrary colors like `bg-[#FAF8F5]`, one-off spacing values, bounce/spring animations.
- The app must support light, dark, and system themes applied via `data-theme` attribute on the `html` tag.
- Bilik Doa must use sacred dimming through `data-space="sacred"` on its container.
- Every screen must feel like an open door. Use gentle spacing, rounded corners, calm motion (ease-out).
- Microcopy: Use words like "boleh", "jika kamu mau", "ketika kamu siap", "sedang beristirahat", "relakan".
- Never use: "wajib", "harus", "selesaikan", "gagal", "terlambat", "tertinggal", "bolos", "tidak aktif", "streak".

## SECURITY & DATA RULES
- Bilik Doa is strictly private. Never create an admin reader, initiator reader, AI analyzer, or share button for it.
- Never log plaintext Bilik Doa content or cache it in IndexedDB/localStorage/Service Worker cache.
- RLS must be enabled for all user-facing tables.
- States must avoid failure terminology (e.g. use 'paused', 'acted', 'rested').

Before coding any feature:
1. State which Constitution rule applies.
2. Check no hardcoded UI values, no forbidden words, and private data is secure.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
