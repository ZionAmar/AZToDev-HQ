# Founder ask — תוכנית לאופציה 1 (הרחבת הרשאות Cursor בגיטהאב)

**Date:** 2026-09-10T11:00Z  
**Founder:** ציון עמר  
**Type:** PLAN (no execution until «אשר»)

## Context

After visibility day (PCI-11–15), founder asked whether Cloud can change repo visibility when PC is off. Noa offered three paths; founder chose **Option 1 — expand Cursor GitHub App access**.

**Today:** Cursor GitHub App is installed with `repository_selection: selected` — **one repo only** (`AZToDev-HQ`). Cloud can read public repos but cannot mutate visibility on personal repos (403). Nadav on PC uses personal ZionAmar session.

## Plan delivered to founder (Telegram)

See Hebrew body in run output. Summary of steps:

1. Founder expands Cursor app access on github.com (2–3 min, phone OK)
2. Choose: all repos OR hand-picked list
3. Founder sends «אשר» — Noa verifies from Cloud (read + one safe test flip with PIN)
4. If green: future visibility changes work from Cloud even when PC off; still PIN-gated; Nadav stays backup

## After approval — internal steps

| Step | Owner | Action |
|------|-------|--------|
| V1 | Noa (Cloud) | `gh api /installation/repositories` — confirm scope expanded |
| V2 | Noa (Cloud) | `gh repo list ZionAmar` — confirm private repos visible (kidnest, Work_clock, etc.) |
| V3 | Noa (Cloud) | Live mutation test on agreed test repo with PIN — flip + revert |
| V4 | Keshet | Update PCI board note; optional Linear hygiene |
| V5 | Noa | Update factory.json `cursorGithubRepoCountNote` when reconciled |

## Security notes (internal)

- Broader App scope = Cursor integration can act on more repos; company still requires PIN for mutations
- Prefer «selected repositories» if founder wants minimum exposure; «all repositories» is simplest operationally
- No secrets stored; uses existing GitHub App OAuth — no personal access token needed for Option 1

## Status

**Waiting:** founder completes GitHub settings step + sends «אשר» for verification run.

LEARNING:
- do: Option 1 plan = founder-side GitHub settings (2 min) + Cloud verification checklist + PIN still required for mutations
- dont: Start verification or delegate before founder expands App scope and approves
- note: Founder chose Cursor expand path after Nadav-only visibility day; plan only, no delegate
