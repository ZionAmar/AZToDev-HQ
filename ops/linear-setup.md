# Linear setup — EMET

Status: **OAuth green in Cursor UI** — but **0 issues published** (2026-09-07 01:16 UTC+3). Linear MCP namespace **not loaded** in agent sessions; `LINEAR_API_KEY` commented out in `.env`.

See unblock guide: `ops/linear-founder-unblock.md`

## Repo config
- `.cursor/mcp.json` — Linear MCP `https://mcp.linear.app/mcp`
- Remote visibility policy: `ops/founder-prefs.json` → `linear.enabled: true`

## PM setup (Yonatan) — pending
1. Team/project **EMET**
2. Labels: intake, discover, shape, architect, plan, build, harden, stage, launch, learn, grow, blocked, waiting-founder, sev1, sev2
3. Seed issues from `ops/state.json` today focus
4. Day Plan issues published daily to cycle «Today»

## Founder phone
1. Install Linear app (iOS/Android)
2. Login — **same account** as Cursor OAuth
3. View: Issues → filter label `waiting-founder` for gates

## Optional later (runtime auto-sync)
Add to `.env` on machine (not Telegram):
- `LINEAR_API_KEY`
- `LINEAR_TEAM_ID`

## KidNest audit publish
- **At:** 2026-09-07T05:51:19.176Z
- **Workspace:** https://linear.app/my-company1460
- **Team:** EMET
- **Project:** KidNest / NesTube
- **Issues:** 25/25

### Issue URLs
- [EMET-2](https://linear.app/my-company1460/issue/EMET-2/kn-001-מיפוי-api-routes-מסכי-adminmobiletv) — KN-001: מיפוי API routes → מסכי admin/mobile/tv
- [EMET-3](https://linear.app/my-company1460/issue/EMET-3/kn-002-תיעוד-monorepo-installrun-matrix-workspaces-vs-expo-apps) — KN-002: תיעוד monorepo — install/run matrix (workspaces vs Expo apps)
- [EMET-4](https://linear.app/my-company1460/issue/EMET-4/kn-003-inventory-db-migrations-seed-scripts-bootstrap-sequence-ל-prod) — KN-003: Inventory DB migrations + seed scripts — bootstrap sequence ל-prod
- [EMET-5](https://linear.app/my-company1460/issue/EMET-5/kn-004-catalog-audit-27-channels-ללא-category-933-videos) — KN-004: Catalog audit — 27 channels ללא category (933 videos)
- [EMET-6](https://linear.app/my-company1460/issue/EMET-6/kn-005-trace-auth-flows-parent-child-google-oauth-pinbedtime) — KN-005: Trace auth flows — parent, child, Google OAuth, PIN/bedtime
- [EMET-7](https://linear.app/my-company1460/issue/EMET-7/kn-006-map-code-sharing-mobile-tv-home-tv-duplication-risk) — KN-006: Map code sharing mobile ↔ tv-home ↔ tv — duplication risk
- [EMET-8](https://linear.app/my-company1460/issue/EMET-8/kn-007-עדכון-readme-tv-tv-home-packdeploy-smart-tv-routing) — KN-007: עדכון README — tv, tv-home, pack:deploy, smart-TV routing
- [EMET-9](https://linear.app/my-company1460/issue/EMET-9/kn-008-player-regression-youtubequeueplayer-vs-watch-recover-snapshot) — KN-008: Player regression — YoutubeQueuePlayer vs watch-recover snapshot
- [EMET-10](https://linear.app/my-company1460/issue/EMET-10/kn-009-reproduce-admin-pwa-sw-collision-על-app-ו-tv) — KN-009: Reproduce admin PWA SW collision על /app ו-/tv
- [EMET-11](https://linear.app/my-company1460/issue/EMET-11/kn-010-local-xampp-e2e-migrate-seed-demo-smoke) — KN-010: Local XAMPP E2E — migrate, seed, demo, smoke
- [EMET-12](https://linear.app/my-company1460/issue/EMET-12/kn-011-tv-home-metro-cross-app-imports-fresh-clone-build-test) — KN-011: tv-home metro cross-app imports — fresh clone build test
- [EMET-13](https://linear.app/my-company1460/issue/EMET-13/kn-012-tv-focus-flicker-focusablepressable-watchscreen-review) — KN-012: TV focus flicker — FocusablePressable / WatchScreen review
- [EMET-14](https://linear.app/my-company1460/issue/EMET-14/kn-013-packdeploy-locally-verify-dist-deploy-structure) — KN-013: pack:deploy locally — verify dist-deploy structure
- [EMET-15](https://linear.app/my-company1460/issue/EMET-15/kn-014-production-env-audit-youtube-google-smtp-jwt-port) — KN-014: Production .env audit — YouTube, Google, SMTP, JWT, PORT
- [EMET-16](https://linear.app/my-company1460/issue/EMET-16/kn-015-live-health-apihealth-admin-login-channel-sync-apk-page) — KN-015: Live health — /api/health, admin login, channel sync, APK page
- [EMET-17](https://linear.app/my-company1460/issue/EMET-17/kn-016-smart-tv-redirect-app-tv-ua-test-desktop1-escape) — KN-016: Smart-TV redirect — /app → /tv UA test + ?desktop=1 escape
- [EMET-18](https://linear.app/my-company1460/issue/EMET-18/kn-017-redis-off-behavior-chemicloud-inline-jobs-vs-local-docker) — KN-017: Redis-off behavior — ChemiCloud inline jobs vs local Docker
- [EMET-19](https://linear.app/my-company1460/issue/EMET-19/kn-018-eas-status-last-buildupdate-mobile-tv-tv-home) — KN-018: EAS status — last build/update mobile, tv, tv-home
- [EMET-20](https://linear.app/my-company1460/issue/EMET-20/kn-019-resolve-deploy-doc-conflict-chemicloudmd-vs-docsdeploy) — KN-019: Resolve deploy doc conflict — CHEMICLOUD.md vs docs/DEPLOY-CHEMICLOUD.md
- [EMET-21](https://linear.app/my-company1460/issue/EMET-21/kn-020-content-policy-pipeline-review-modestyshorts-blocking) — KN-020: Content policy pipeline review — modesty/shorts blocking
- [EMET-22](https://linear.app/my-company1460/issue/EMET-22/kn-021-watchidjsx-complexity-refactor-candidates-1800-lines) — KN-021: watch/[id].jsx complexity — refactor candidates (~1800 lines)
- [EMET-23](https://linear.app/my-company1460/issue/EMET-23/kn-022-security-audit-jwt-cors-csp-secrets-in-templates) — KN-022: Security audit — JWT, CORS, CSP, secrets in templates
- [EMET-24](https://linear.app/my-company1460/issue/EMET-24/kn-023-statusmd-prod-health-blockers-last-deploy-regressions) — KN-023: STATUS.md — prod health, blockers, last deploy, regressions
- [EMET-25](https://linear.app/my-company1460/issue/EMET-25/kn-024-runbook-local-pack-chemicloud-eas-post-deploy-db) — KN-024: Runbook — local, pack, ChemiCloud, EAS, post-deploy db:*
- [EMET-26](https://linear.app/my-company1460/issue/EMET-26/kn-025-דוח-תובנות-לציון-מה-הפרויקט-עושה-המלצות-עדיפות) — KN-025: דוח תובנות לציון — מה הפרויקט עושה + המלצות עדיפות## KidNest GitHub upload publish
- **At:** 2026-09-09T09:49:44.650Z
- **Workspace:** https://linear.app/my-company1460
- **Team:** EMET
- **Project:** KidNest — העלאה לגיטהאב
- **Issues:** 4/4
- **EMET-66:** [EMET-66](https://linear.app/my-company1460/issue/EMET-66/armed-wait-for-founder-build-order) (already canceled)
### Issue URLs
- [EMET-129](https://linear.app/my-company1460/issue/EMET-129/kng-01-תכנית-מבנה-ריפו-monorepo-gitignore-factoryjson) — KNG-01: תכנית מבנה ריפו — monorepo, .gitignore, factory.json
- [EMET-130](https://linear.app/my-company1460/issue/EMET-130/kng-02-הכנת-pc-מלאי-תיקייה-git-status-scrub-סודות) — KNG-02: הכנת PC — מלאי תיקייה, git status, scrub סודות
- [EMET-131](https://linear.app/my-company1460/issue/EMET-131/kng-03-יצירת-ריפו-פרטי-zionamarkidnest) — KNG-03: יצירת ריפו פרטי ZionAmar/KidNest
- [EMET-132](https://linear.app/my-company1460/issue/EMET-132/kng-04-push-ראשון-monorepo-נקי-בלי-סודות) — KNG-04: Push ראשון — monorepo נקי, בלי סודות