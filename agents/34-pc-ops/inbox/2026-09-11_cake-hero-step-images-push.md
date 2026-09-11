# Push — cake-recipe-demo hero + step images

**From:** 14-frontend-engineer (דפנה) · **To:** 34-pc-ops (נדב) · **Date:** 2026-09-11  
**Priority:** High — blocks 20-qa-sdet re-verify  
**PC heartbeat:** ONLINE (2026-09-11T05:32Z)

## Task

Push updated `index.html` + `styles.css` to **existing** repo `ZionAmar/cake-recipe-demo` (repo already live at https://zionamar.github.io/cake-recipe-demo/).

Cloud token has **read-only** on this repo (`push: false`, Contents API 403). Nadav PC has write access.

## Source files (HQ)

Copy from bundle (updated this run):

| Target (repo root) | Source |
|--------------------|--------|
| `index.html` | `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/index.html` |
| `styles.css` | `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/styles.css` |

## What changed

Per `ops/pipeline/cake-recipe-demo/03-screens.md`:

- Hero: full-width Unsplash chocolate cake image + title «עוגת שוקולד עשירה»
- Meta pills bar (servings, prep, bake, difficulty)
- 7 step cards; images on steps 1, 4, 5, 7 (Unsplash CDN)
- Recipe content aligned to `02-spec.md`
- Responsive: stacked mobile, 40/60 image/text on desktop ≥768px

## Commands (plain PowerShell — not Cursor terminal)

```powershell
cd C:\Users\amazi\Desktop\Projects\cake-recipe-demo
# or clone fresh:
# gh repo clone ZionAmar/cake-recipe-demo
# cd cake-recipe-demo

git pull origin main
copy /Y "<HQ>\agents\14-frontend-engineer\outbox\cake-recipe-demo-bundle\index.html" .
copy /Y "<HQ>\agents\14-frontend-engineer\outbox\cake-recipe-demo-bundle\styles.css" .
git add index.html styles.css
git commit -m "Add hero and step images per 03-screens.md"
git push origin main
curl -I https://zionamar.github.io/cake-recipe-demo/
```

Replace `<HQ>` with your local AZToDev-HQ path.

## Definition of done

- [ ] `git push origin main` succeeds on `ZionAmar/cake-recipe-demo`
- [ ] `curl -I https://zionamar.github.io/cake-recipe-demo/` → `HTTP/2 200`
- [ ] Live HTML contains `hero-image` and at least 4 `step-image` elements (grep or view source)
- [ ] Outbox: `agents/34-pc-ops/outbox/2026-09-11_cake-hero-step-images-pushed.md` with commit SHA + curl output

## Then

**DELEGATE: 20-qa-sdet |** Re-verify live Pages URL against `03-screens.md` checklist (hero + step images, RTL, mobile).
