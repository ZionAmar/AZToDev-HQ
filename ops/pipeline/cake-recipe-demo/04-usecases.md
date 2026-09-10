# 04-usecases — cake-recipe-demo

Minimal set for a static content page (Final_project style, compressed).

---

## UC-01: View recipe

| Field | Value |
|-------|-------|
| **Actor** | Visitor (founder / anyone with link) |
| **Precondition** | Page deployed and URL reachable |
| **Main flow** | 1. Visitor opens URL · 2. Browser loads index.html · 3. Visitor scrolls hero → ingredients → steps → tips · 4. Visitor reads recipe |
| **Postcondition** | None (no server state) |
| **Alternate** | Slow network → images lazy-load; text readable immediately |
| **Exception** | Host down → browser error (out of app scope; Paz/Ori verify URL) |

---

## UC-02: Print / save (optional enhancement)

| Field | Value |
|-------|-------|
| **Actor** | Visitor |
| **Precondition** | Page loaded |
| **Main flow** | 1. Visitor uses browser Print (Ctrl+P) · 2. Print CSS hides hero gradient noise, keeps ingredients + steps |
| **Postcondition** | PDF or paper copy |
| **Alternate** | No print CSS → browser default print still works |
| **Exception** | — |

*No login, no edit, no search — reject scope creep.*
