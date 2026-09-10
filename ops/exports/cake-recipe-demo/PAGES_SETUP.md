# GitHub Pages setup — cake-recipe-demo

## One-time repo settings (founder or PC with admin)

1. Open **Settings → Pages** on `ZionAmar/cake-recipe-demo`.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Private-repo Pages requires a paid GitHub plan (Pro/Team/Enterprise). If Pages is unavailable on a free private repo, either:
   - make the repo public (founder decision — see EMET-165 / Noa gate), or
   - use Docker locally: `docker build -t cake-recipe-demo . && docker run -p 8080:80 cake-recipe-demo`

## After first push with workflow

1. Merge/push `main` including `.github/workflows/pages.yml`.
2. **Actions** tab → confirm **Deploy to GitHub Pages** succeeds.
3. Live URL (project site): `https://zionamar.github.io/cake-recipe-demo/`

## Docker (local preview)

```bash
docker build -t cake-recipe-demo .
docker run --rm -p 8080:80 cake-recipe-demo
# open http://localhost:8080
```
