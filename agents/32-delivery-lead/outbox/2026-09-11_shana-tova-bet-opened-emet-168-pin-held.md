# EMET-168 נפתח — הימור "שנה טובה", פייפליין מוכן, מהנדסים מוחזקים עד PIN

**מאת:** קשת (32-delivery-lead) · **תאריך:** 2026-09-11T12:31Z
**טריגר:** נועה (00-ceo) — "Open Shana Tova one-pager bet (EMET-167 closed). Linear ticket + cake-style pipeline: 14-frontend-engineer → 18-devops-platform → 20-qa-sdet → live URL. Hold engineer mutations until founder PIN for this bet unless PIN window already open."

## תנאי 1 — EMET-167 סגור? בדקתי חי, לא הסתפקתי בהצהרה

שאילתה חיה ל-Linear GraphQL API (לא cache, לא קובץ):

```
query { issues(filter: {number: {eq: 167}}) { nodes { id identifier title state { name } url } } }
```

**תוצאה:** `state.name: "Done"`. ✅ מאומת עצמאית — התנאי מתקיים.

## תנאי 2 — «יאללה»/PIN מפורש להימור הזה?

חיפוש מלא ב-`ops/founder-channel/ledger.jsonl` (כל ההיסטוריה, לא רק השורות האחרונות) — **אין** אזכור של אישור/PIN מפורש להימור שנה טובה. הבקשה המקורית של ציון היא **מפרט** (תמונות מתגלגלות, ברכה, EaseToDev בלבד), לא הרשאת-בנייה. אין קובץ מצב PIN בכל ה-repo (`ops/founder-channel/`, אין `pending-pin-actions.json` וכו').

**מסקנה: שער 2 עדיין לא מתקיים.** לפי ההוראה המפורשת של נועה בתור הזה — פותחים את הטיקט והפייפליין, **לא** מפעילים מהנדסים.

## מה עשיתי בפועל (מוטציות אמיתיות)

1. **בדיקה שאין כפילות:** שאילתת Linear חיה לפני יצירה — `issues(filter: {or: [{title contains "shana"}, {title contains "טובה"}, {title contains "greeting"}]})` → 0 תוצאות. לא נוצר טיקט כפול.
2. **נוצר EMET-168** (`issueCreate` GraphQL אמיתי, לא רק קובץ תכנון): "Shana Tova greeting one-pager — RTL carousel + Pages publish", פרויקט `פיתוח מוצר — EMET` (=`AZToDev Product — Keshet`, אותו slug `938f19d950dd`), State=**Todo**.
   קישור: https://linear.app/my-company1460/issue/EMET-168/shana-tova-greeting-one-pager-rtl-carousel-pages-publish
3. **תגובת ראיות** נוספה לטיקט (gate status, פייפליין, אין תלות בנדב).
4. **`ops/config/factory.json`** — `pendingWork.shana-tova-greeting-page` עודכן: `linearIssue: EMET-168`, `status: bet_opened_pipeline_planned_pin_gate_held`, גייט מפורט לשני התנאים.
5. **`ops/founder-channel/ledger.jsonl`** — רשומה חדשה מתעדת את הפתיחה.

## פייפליין מוכן להפעלה (cake-style), רק ברגע שה-PIN מגיע

1. **14-frontend-engineer (דפנה):** דף RTL חד-עמודי — קרוסלת תמונות גלילה אוטומטית, ברכת שנה טובה בעברית (בריאות/הצלחה/שלום), footer = EaseToDev בלבד, מובייל-פרנדלי.
2. **18-devops-platform (פז):** פרסום דרך גשר ה-desk ל-GitHub Pages (אותו נתיב כמו cake-recipe-demo/kids-math-quiz — **אין** תלות בנדב/PC).
3. **20-qa-sdet (אורי):** QA חי מלא (RTL, רספונסיביות, נגישות/console, restart).
4. **קשת (אני):** אימות עצמאי חי + סגירת EMET-168 + לינק חי לציון.

ריפו מוצע: `ZionAmar/shana-tova-greeting` → `https://zionamar.github.io/shana-tova-greeting/`

## מה לא עשיתי (במכוון)

- **לא** פתחתי DELEGATE ל-14-frontend-engineer — זו מוטציית מהנדס, חסומה עד PIN.
- **לא** נגעתי בהימור cake-recipe-demo (עדיין ממתין ל-QA של אורי, שלב נפרד).
- **לא** בדקתי/געתי ב-productWorkEnabled — נשאר `true` כמו שהוא; זה לא השער הרלוונטי כאן, השער הוא PIN מפורש להימור הספציפי הזה (לפי ההוראה המפורשת בתור הזה).

---

## הבקשה הברורה לציון (למה שנועה תעביר)

EMET-167 (משחק מתמטיקה) סגור וחי: https://zionamar.github.io/kids-math-quiz/
הימור שנה טובה **מוכן להתחיל** — הטיקט (EMET-168) והתוכנית פתוחים. כדי שהצוות יתחיל בפועל לבנות, לפרסם ולבדוק — צריך ממך **«יאללה» + PIN** על ההימור הזה במפורש. ברגע שזה מגיע, קשת מפעילה את השרשרת (דפנה → פז → אורי) בלי עיכוב נוסף.

---

HANDOFF:
- done: EMET-167 re-verified Done (live Linear GraphQL query). EMET-168 opened for real (Linear issueCreate + evidence comment), no duplicate. factory.json + ledger updated with real gate status.
- next: 00-ceo (Noa) relays to ציון in Hebrew: math quiz done + live link; Shana Tova ticket ready; ask explicitly for «יאללה»+PIN for THIS bet. The moment PIN lands, 32-delivery-lead activates DELEGATE 14-frontend-engineer → 18-devops-platform → 20-qa-sdet in the same flow as cake-recipe-demo.
- files: `ops/config/factory.json` (pendingWork.shana-tova-greeting-page), `ops/founder-channel/ledger.jsonl`, Linear `EMET-168` (created + comment), this outbox file.

DELEGATE: 00-ceo | Relay to ציון (Hebrew): EMET-167 done + live link https://zionamar.github.io/kids-math-quiz/. Shana Tova bet is opened and ready (EMET-168, https://linear.app/my-company1460/issue/EMET-168/shana-tova-greeting-one-pager-rtl-carousel-pages-publish) — ask for explicit «יאללה»+PIN for this specific bet so Keshet can start the build→publish→QA chain immediately.

LEARNING:
- do: When told to "open the bet but hold engineer mutations until PIN," treat that literally as two separable actions — create the real Linear ticket + pipeline plan now (that's planning, always allowed), but do not emit any DELEGATE to 14-frontend-engineer/18-devops-platform until the PIN condition is independently re-verified as met in the ledger.
- dont: Don't reuse a stale "gate not met" conclusion from an earlier turn without re-querying Linear live for the specific condition that just changed (EMET-167 state) — the two gate conditions can resolve at different times, so re-check each one independently rather than treating the pair as one atomic status.
- note: EMET-167 independently reconfirmed Done via live Linear GraphQL. Opened EMET-168 for Shana Tova with full pipeline spec and evidence comment; PIN gate for this specific bet still open, so no engineer was activated — correct per explicit dispatch instruction, not theater.
