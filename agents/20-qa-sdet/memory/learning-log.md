# Learning log — אורי (`20-qa-sdet`)

Bench until there is something to break. Then repro + Playwright. WIP=1 with engineering.

## Never again
- Do not run while `productWorkEnabled` is false.
- Do not mark Done without evidence.

## Iteration log
### 2026-09-09
- Company armed. Not building.

### 2026-09-11
- cake-recipe-demo live QA: RTL + mobile PASS; images FAIL (0 img tags).
- do: curl 200 + img count + spec cross-check before pass/fail.
- dont: Mark images OK without HTML evidence.
