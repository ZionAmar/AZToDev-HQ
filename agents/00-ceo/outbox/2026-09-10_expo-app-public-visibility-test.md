# expo-app public visibility test — Cloud capability check

**Date:** 2026-09-10T08:36Z  
**Founder ask:** Test whether Cloud can flip `ZionAmar/expo-app` from private → public.

## Live checks (this Cloud session)

| Check | Result |
|-------|--------|
| Public API `GET /repos/ZionAmar/expo-app` | **404** (repo is private — not publicly visible) |
| `expo-app` in ZionAmar public repo list | **false** |
| Cloud `gh repo view ZionAmar/expo-app` | **404** — GraphQL: Could not resolve repository |
| Cloud `PATCH /repos/ZionAmar/expo-app` visibility=public | **404** Not Found |
| Cloud `GET /user` (integration token) | **403** Resource not accessible by integration |

## Conclusion

Cloud GitHub App integration **cannot** read or mutate `expo-app` visibility. Same root cause as prior private-flip work: integration scoped to AZToDev-HQ office repo, not founder personal account repos.

To actually make `expo-app` public: Nadav on PC (personal `gh` session) or founder self-service on github.com. Mutating action requires fresh **אשר + PIN**.

## Founder Telegram draft

ציון, הרצתי עכשיו את הטסט על **expo-app**.

**מצב נוכחי:** הפרויקט **פרטי** — לא נגיש לציבור.

**מה ניסיתי מהענן:** לשנות אותו לציבורי ישירות בגיטהאב. **גיטהאב דחה** — אנחנו בכלל לא רואים את הפרויקט מהחיבור של הענן, ולא יכולים לשנות לו הגדרות.

**מסקנה:** אותה מגבלה כמו קודם — שינוי נראות (פרטי/ציבורי) לא עובר דרך הענן, רק דרך החשבון האישי שלך (נדב על המחשב, או אתה בגיטהאב).

אם תרצה שבאמת **נחזיר אותו לציבורי** כחלק מהטסט — שלח **«אשר» + PIN** ונדב יבצע ויחזיר דוח לפני/אחרי.

LEARNING:
- do: Run live PATCH + public API 404 when founder asks "can you do visibility" — proves scope limit without claiming Nadav
- dont: Delegate Nadav for actual flip without PIN even on a "test" ask
- note: expo-app PRIVATE; Cloud PATCH 404; founder visibility test answered from live evidence
