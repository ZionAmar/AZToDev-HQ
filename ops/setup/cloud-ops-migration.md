# Cloud ops migration — צעדים לציון

> **הוחלט:** נועה + רות + תמיר = Cursor Cloud. נדב + HQ טלגרם = PC מקומי. **בלי ChemiCloud HQ.**

## 1) GitHub — repo פרטי ל-HQ

1. צור repo פרטי, למשל `ZionAmar/AZToDev-HQ`
2. דחוף את `my_company` (בלי `.env`, בלי `ops/secrets/`)
3. חבר את הריפו ב-[Cursor Settings → GitHub](https://cursor.com/settings)

## 2) `.env` על PC (HQ דק)

```env
GITHUB_HQ_REPO=https://github.com/ZionAmar/AZToDev-HQ
GITHUB_HQ_REF=main
```

אחרי restart של `hq/index.mjs` — `/health` יראה `"cloudOps": true`.

## 3) Cursor Cloud secrets (לא ב-repo)

הוסף ב-Cursor Cloud → Secrets / Environment:

**רות (Gmail):**
| Secret | מה זה |
|--------|--------|
| `GMAIL_USER` | aztodev@gmail.com |
| `GMAIL_APP_PASS` | app password |
| `GMAIL_USER_AMZION` | amzion account |
| `GMAIL_APP_PASS_AMZION` | app password |
| `GMAIL_USER_ZION` | zion account |
| `GMAIL_APP_PASS_ZION` | app password |

**תמיר (SSH read-only):**
| Secret | מה זה |
|--------|--------|
| `CHEMICLOUD_HOST` | cvps1645.serverhostgroup.com |
| `CHEMICLOUD_USER` | aztodevc |
| `CHEMICLOUD_PORT` | 1988 |
| `CHEMICLOUD_SSH_KEY` | private key (PEM) |

**קשת / לינאר (לוח משימות בנייד):**
| Secret | מה זה |
|--------|--------|
| `LINEAR_API_KEY` | Personal API key מ-Linear → Settings → Security (Write) |
| `LINEAR_TEAM_ID` | אופציונלי — UUID של צוות EMET |

## 4) איך זה עובד

```
[PC דולק]  hq/index.mjs → טלגרם, PIN, DELEGATE relay
[Cloud]    נועה / רות / תמיר — Cursor Cloud על GITHUB_HQ_REPO
[PC דולק]  נדב (34) — דיסק/קבצים בלבד
[PC כבוי]  טלגרם + נדב לא זמינים. Cloud agents — כן (אם secrets מוגדרים).
```

נועה בטלגרם: Cloud brain → שורות `DELEGATE: agentId | task` → HQ מריץ ברקע.

## 5) אימות

1. `GET http://127.0.0.1:8788/health` → `cloudOps: true`
2. בטלגרם: «תבדקי שרת» → תמיר Cloud
3. «מה במייל» → רות Cloud
4. «כמה דיסק פנוי» → נדב local (PC חייב דולק)

---

*Evidence:* `runtime/lib/specialist-runtime.mjs`, `hq/lib/cloud-work.mjs`, `hq/lib/cloud-ceo.mjs`
