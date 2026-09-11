# PCI-KMG-01 — REPUBLISH: kids-math-quiz Q10 fix

**Date:** 2026-09-11 · **Owner:** 34-pc-ops (נדב) · **Priority:** High — Q10 crash on live site
**Linear:** [EMET-167](https://linear.app/my-company1460/issue/EMET-167)
**From:** 14-frontend-engineer (דפנה)

## Task — `GITHUB_STATIC_PUBLISH` (republish, repo already exists)

```
REPO:       ZionAmar/kids-math-quiz
SOURCE:     agents/14-frontend-engineer/outbox/kids-math-quiz-bundle
VISIBILITY: public (unchanged)
```

Repo exists, Pages enabled. **Replace** root-level built files on `main`:

- `index.html` (now references `index-D5JqcgtH.js`)
- `assets/index-D5JqcgtH.js` (new)
- `assets/index-BqF1Ss2t.css` (unchanged)
- Remove old `assets/index-mKCXMWMT.js` if present

**Do not** push `source/` as site content.

## Expected post-publish verification

```bash
curl -s https://zionamar.github.io/kids-math-quiz/index.html | grep index-D5JqcgtH
curl -s https://zionamar.github.io/kids-math-quiz/assets/index-D5JqcgtH.js | sha256sum
# expect: e10ba05a544d64418bc5b31b9ad1fc5a2d871e7e2d9e12f411ea1b309b00cccc
curl -I https://zionamar.github.io/kids-math-quiz/  # 200
```

## Definition of done

- [ ] `main` updated with new bundle
- [ ] Live JS SHA-256 = `e10ba05a544d64418bc5b31b9ad1fc5a2d871e7e2d9e12f411ea1b309b00cccc`
- [ ] Outbox: `agents/34-pc-ops/outbox/2026-09-11_kids-math-quiz-q10-republished.md`
- [ ] Notify `20-qa-sdet` for re-QA (Q10 no longer crashes)

Fix evidence: `agents/14-frontend-engineer/outbox/2026-09-11_kids-math-quiz-q10-fix.md`
