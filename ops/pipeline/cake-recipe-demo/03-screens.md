# 03-screens — cake-recipe-demo

**Single screen:** `RecipePage` (full viewport scroll)

---

## Screen: RecipePage

**Route:** `/` (index.html only)  
**Purpose:** Present one complete chocolate cake recipe in Hebrew RTL with images.

### Sections (top → bottom)

| # | Section | Content | States |
|---|---------|---------|--------|
| 1 | **Header meta bar** | Servings · Prep · Bake · Difficulty pills | Always visible |
| 2 | **Hero** | Full-width cake image + title "עוגת שוקולד עשירה" + subtitle | Loading: skeleton or progressive image load; Error: show title + muted "תמונה לא נטענה" with recipe still readable |
| 3 | **Intro** | 2–3 sentences about the cake | Static |
| 4 | **Ingredients** | Two sub-lists: "לבלילה" / "לציפוי (אופציונלי)" | Static; optional checkbox styling (visual only, no persistence) |
| 5 | **Steps** | 7 numbered cards, each: number badge, title, body, optional step image | Static |
| 6 | **Tips** | Bulleted tips card | Static |
| 7 | **Footer** | "AZToDev · מתכון לדוגמה" + link to GitHub repo (after repo exists) | Static |

### Fields / elements

| Element | Type | Required | Notes |
|---------|------|----------|-------|
| Title | h1 | yes | `עוגת שוקולד עשירה` |
| Meta pills | spans | yes | icons optional (emoji OK: 🕐 👥) |
| Hero image | img | yes | `object-fit: cover`, max-height ~360px mobile / 420px desktop |
| Ingredient items | li | yes | RTL bullet alignment |
| Step number | badge | yes | Accent color circle |
| Step image | img | per spec | 4 of 7 steps have images; steps 2,3,6 text-only OK |
| Tips | ul/li | yes | 3 items from spec |

### Responsive breakpoints

| Breakpoint | Behavior |
|------------|----------|
| `< 480px` | Single column, hero shorter, step images stack above text |
| `480–768px` | Same, slightly wider padding |
| `> 768px` | Step cards: image ~40% width right (RTL: image on left visually), text ~60% |

### Empty / loading / error

| State | Behavior |
|-------|----------|
| Empty | N/A — all content static baked in |
| Loading | Optional: hero image `loading="lazy"`; no spinner required |
| Error (image) | `alt` text + broken-image fallback color block; recipe text always visible |
| Offline | Works if cached (static); no special offline UI required |

### Visual reference

Match polish level of `products/kids-math-quiz/index.html`: gradient background, white cards, rounded corners, soft shadow, clamp() typography.
