# GitHub Pages setup — aztodev-company-system

## One-time repo settings (founder or PC with admin)

1. Open **Settings → Pages** on `ZionAmar/aztodev-company-system`.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Private-repo Pages requires a paid GitHub plan (Pro/Team/Enterprise). If Pages is unavailable on a free private repo, either:
   - make the repo public (founder decision), or
   - use Docker locally: `docker build -t aztodev-company-system . && docker run -p 8080:80 aztodev-company-system`

## After first push with workflow

1. Merge/push `main` including `.github/workflows/pages.yml`.
2. **Actions** tab → confirm **Deploy to GitHub Pages** succeeds.
3. Live URL (project site): `https://zionamar.github.io/aztodev-company-system/`

## Docker (local preview)

```bash
docker build -t aztodev-company-system .
docker run --rm -p 8080:80 aztodev-company-system
# open http://localhost:8080
```
