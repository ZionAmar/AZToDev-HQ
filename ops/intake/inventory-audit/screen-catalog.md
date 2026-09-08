# Rakza — קטalog מסכים (INV-01)

**תאריך:** 2026-09-07  
**Job:** `job-1788788179373-sh3zn`  
**IDEA:** `ops/intake/ideas/IDEA-2026-09-07-inventory-deck.md`  
**מוצר:** `C:\Users\amazi\Desktop\ניהול מלאי\rakza`  
**סביבת צילום:** localhost — client `:5173`, API `:4000`, DB Docker `rakza-mysql:3307`  
**screenshots:** `ops/intake/inventory-audit/screenshots/` (27 קבצים)

## סיכום מודולים

| מודול | תפקידים | מסכים | screenshots |
|-------|---------|-------|-------------|
| ציבורי | — | 2 | 00–01 |
| מנהל (admin) | admin | 12 | 10–21 |
| סוכן (agent) | agent | 4 | 30–33 |
| מחסן (warehouse) | warehouse, admin | 4 | 40–43 |
| נהג (driver) | driver | 1 | 50 |
| Super-admin | SA token | 4 | 60–63 |
| **סה״כ** | | **27** | |

## Credentials (seed / demo)

| תפקיד | אימייל | סיסמה |
|-------|--------|-------|
| מנהל | admin@rakza.local | Admin123! |
| סוכן | agent@rakza.local | Agent123! |
| מנהל מחסן | warehouse@rakza.local | Wh123! |
| מחסנאי | picker@rakza.local | Wh123! |
| נהג | driver@rakza.local | Drv123! |
| Super-admin | super@rakza.local | Super123! |

---

## 1. ציבורי

### 1.1 דף נחיתה — `/`

| | |
|---|---|
| **קובץ** | `client/src/pages/LandingPage.jsx` |
| **Screenshot** | `screenshots/00-public-landing.png` |
| **תיאור** | דף שיווקי RTL: hero עם דמו דשבורד, יכולות (מלאי בזמן אמת, מפת מחסן, SMS), תמחור, שותפים, FAQ. CTA לכניסה. |
| **סטטוס** | ✅ עובד |

### 1.2 התחברות — `/login`

| | |
|---|---|
| **קובץ** | `client/src/pages/LoginPage.jsx` |
| **Screenshot** | `screenshots/01-public-login.png` |
| **תיאור** | כרטיס התחברות עם לוגו חברה, אימייל+סיסמה, כפתורי demo (dev). Super-admin נכנס מאותו מסך. |
| **סטטוס** | ✅ עובד |

---

## 2. מנהל (admin)

**ניווט:** תובנות · הזמנות · מוצרים · לקוחות · מחסן · צוות · הגדרות (`Layout.jsx`)

### 2.1 תובנות (דשבורד) — `/`

| | |
|---|---|
| **קובץ** | `client/src/pages/DashboardPage.jsx` |
| **Screenshot** | `screenshots/10-admin-dashboard.png` |
| **תיאור** | KPIs חודשיים (הזמנות, מחזור, רווח, מרווח), סרגל סטטוס (פתוחות, מלאי נמוך, בדרך), גרפים יומיים/שנתיים, לקוחות מובילים, סוכנים, מוצרים אוזלים, bestsellers. |
| **סטטוס** | ✅ עובד — נתוני seed/demo |

### 2.2 הזמנות — `/orders`

| | |
|---|---|
| **קובץ** | `client/src/pages/OrdersPage.jsx` |
| **Screenshot** | `screenshots/11-admin-orders.png` |
| **תיאור** | רשימת הזמנות עם סינון סטטוס, תאריכים, חיפוש. pipeline: pending → submitted → picking → ready → out_for_delivery. |
| **סטטוס** | ✅ עובד |

### 2.3 פרטי הזמנה — `/orders/:id`

| | |
|---|---|
| **קובץ** | `client/src/pages/OrderDetailPage.jsx` |
| **Screenshot** | `screenshots/12-admin-order-detail.png` |
| **תיאור** | פירוט הזמנה: לקוח, פריטים, מחירים, סטטוס, הערות מחסן, הקצאת נהג, היסטוריה. |
| **סטטוס** | ✅ עובד |

### 2.4 מוצרים (מלאי) — `/products`

| | |
|---|---|
| **קובץ** | `client/src/pages/ProductsPage.jsx` |
| **Screenshot** | `screenshots/13-admin-products.png` |
| **תיאור** | קטalog מוצרים: SKU, ברקוד, קטגוריה, מלאי, מחירי יעד/רצפה, סימון מלאי נמוך. |
| **סטטוס** | ✅ עובד — ~39 מוצרים ב-DB |

### 2.5 עריכת מוצר — `/products/:id`

| | |
|---|---|
| **קובץ** | `client/src/pages/ProductFormPage.jsx` |
| **Screenshot** | `screenshots/14-admin-product-edit.png` |
| **תיאור** | טופס מוצר: יחידות/קרtons/משטח, מחירים, price breaks, bin ברירת מחדל, תמונה. |
| **סטטוס** | ✅ עובד |

### 2.6 מוצר חדש — `/products/new`

| | |
|---|---|
| **Screenshot** | `screenshots/15-admin-product-new.png` |
| **תיאור** | אותו טופס ריק ליצירת SKU חדש. |
| **סטטוס** | ✅ עובד |

### 2.7 לקוחות — `/customers`

| | |
|---|---|
| **קובץ** | `client/src/pages/CustomersPage.jsx` |
| **Screenshot** | `screenshots/16-admin-customers.png` |
| **תיאור** | רשימת לקוחות סיטונאיים: שם, עיר, איש קשר, טלפון, הוספה/עריכה. |
| **סטטוס** | ✅ עובד |

### 2.8 מפת מחסן — `/warehouse`

| | |
|---|---|
| **קובץ** | `client/src/pages/WarehouseMapPage.jsx` |
| **Screenshot** | `screenshots/17-admin-warehouse-map.png` |
| **תיאור** | מפת שורות A–G עם bins צבעוניים (ריק/מלאי/אוזל/מלא), חיפוש מוצר, מקרא, קיצורי מקלדת. |
| **סטטוס** | ✅ עובד |

### 2.9 שורת מחסן — `/warehouse/rows/:id`

| | |
|---|---|
| **קובץ** | `client/src/pages/WarehouseRowPage.jsx` |
| **Screenshot** | `screenshots/18-admin-warehouse-row.png` |
| **תיאור** | תצוגת שורה: מדפים ימין/שמאל, תוויות, סטטוס מלא. |
| **סטטוס** | ✅ עובד |

### 2.10 תא (bin) — `/warehouse/bins/:id`

| | |
|---|---|
| **קובץ** | `client/src/pages/WarehouseBinPage.jsx` |
| **Screenshot** | `screenshots/19-admin-warehouse-bin.png` |
| **תיאור** | מלאי בתא: מוצרים, כמויות, העברה/הוספה. |
| **סטטוס** | ✅ עובד |

### 2.11 צוות — `/users`

| | |
|---|---|
| **קובץ** | `client/src/pages/UsersPage.jsx` |
| **Screenshot** | `screenshots/20-admin-users.png` |
| **תיאור** | ניהול משתמשים: admin/agent/warehouse/driver, הפעלה/השבתה, מנהל מחסן. |
| **סטטוס** | ✅ עובד |

### 2.12 הגדרות — `/settings`

| | |
|---|---|
| **קובץ** | `client/src/pages/SettingsPage.jsx` |
| **Screenshot** | `screenshots/21-admin-settings.png` |
| **תיאור** | שם חברה, לוגו, מטבע, סף מלאי נמוך, הגדרות SMS/התראות. |
| **סטטוס** | ✅ עובד |

---

## 3. סוכן (agent)

**ניווט:** מכירה · הזמנות · לקוחות (tabbar mobile)

### 3.1 מכירה (הזמנה חדשה) — `/`

| | |
|---|---|
| **קובץ** | `client/src/pages/AgentOrderPage.jsx` |
| **Screenshot** | `screenshots/30-agent-sales.png` |
| **תיאור** | wizard 3 שלבים: בחירת לקוח → מוצרים → סיכום. חיפוש לקוח, «לקוח חדש». |
| **סטטוס** | ✅ עובד |

### 3.2 הזמנה חדשה (ישיר) — `/orders/new`

| | |
|---|---|
| **Screenshot** | `screenshots/31-agent-new-order.png` |
| **תיאור** | אותו wizard — route חלופי. |
| **סטטוס** | ✅ עובד |

### 3.3 ההזמנות שלי — `/my-orders`

| | |
|---|---|
| **קובץ** | `client/src/pages/AgentOrdersPage.jsx` |
| **Screenshot** | `screenshots/32-agent-my-orders.png` |
| **תיאור** | הזמנות שהסוכן יצר — סטטוס, סכום, תאריך. |
| **סטטוס** | ✅ עובד |

### 3.4 לקוחות (סוכן) — `/customers`

| | |
|---|---|
| **Screenshot** | `screenshots/33-agent-customers.png` |
| **תיאור** | צפייה/הוספת לקוחות מהשטח. |
| **סטטוס** | ✅ עובד |

---

## 4. מחסן (warehouse)

**ניווט:** ליקוט · מחסן

### 4.1 רשימת ליקוט — `/orders`

| | |
|---|---|
| **Screenshot** | `screenshots/40-warehouse-pick-list.png` |
| **תיאור** | הזמנות לליקוט — סינון לפי סטטוס picking/submitted. |
| **סטטוס** | ✅ עובד |

### 4.2 ליקוט הזמנה — `/orders/:id`

| | |
|---|---|
| **Screenshot** | `screenshots/41-warehouse-order-pick.png` |
| **תיאור** | צ'קליסט פריטים, סימון ליקוט, הערות, השלמת ליקוט, הקצאת נהג. |
| **סטטוס** | ✅ עובד |

### 4.3 מפת מחסן (מחסנאי) — `/warehouse`

| | |
|---|---|
| **Screenshot** | `screenshots/42-warehouse-map.png` |
| **תיאור** | אותה מפה — גישה read/update לפי הרשאות. |
| **סטטוס** | ✅ עובד |

### 4.4 תא (מחסנאי) — `/warehouse/bins/:id`

| | |
|---|---|
| **Screenshot** | `screenshots/43-warehouse-bin.png` |
| **תיאור** | צפייה/עדכון מלאי בתא. |
| **סטטוס** | ✅ עובד |

---

## 5. נהג (driver)

### 5.1 משלוחים — `/` / `/driver`

| | |
|---|---|
| **קובץ** | `client/src/pages/DriverTodayPage.jsx` |
| **Screenshot** | `screenshots/50-driver-deliveries.png` |
| **תיאור** | לוח שנה, «המסלול להיום», עצירות פתוחות, סימון מסירה. |
| **סטטוס** | ✅ עובד — empty state אם אין משלוחים ליום |

---

## 6. Super-admin

**ניווט:** חברות במערכת · ניתוח שימוש · מנוי ותעריפים · לוגים חיים (`SuperAdminLayout.jsx`)

### 6.1 חברות — `/super-admin/dashboard`

| | |
|---|---|
| **קובץ** | `client/src/pages/SuperAdminDashboard.jsx` |
| **Screenshot** | `screenshots/60-sa-companies.png` |
| **תיאור** | טבלת tenants: משתמשים, מוצרים, הזמנות 30 יום, מחזור, מנוי, «ניהול» + impersonate. |
| **סטטוס** | ✅ עובד — 1 חברה (איציק סיטונאות) |

### 6.2 ניתוח שימוש — `/super-admin/analytics`

| | |
|---|---|
| **קובץ** | `client/src/pages/SuperAdminAnalytics.jsx` |
| **Screenshot** | `screenshots/61-sa-analytics.png` |
| **תיאור** | KPIs פלטפורמה, גrafים שימוש cross-tenant. |
| **סטטוס** | ✅ עובד |

### 6.3 מנוי ותעריפים — `/super-admin/settings`

| | |
|---|---|
| **קובץ** | `client/src/pages/SuperAdminSettings.jsx` |
| **Screenshot** | `screenshots/62-sa-billing.png` |
| **תיאור** | הגדרות billing, trial, תעריפים. |
| **סטטוס** | ✅ עובד |

### 6.4 לוגים חיים — `/super-admin/logs`

| | |
|---|---|
| **קובץ** | `client/src/pages/SuperAdminLogs.jsx` |
| **Screenshot** | `screenshots/63-sa-logs.png` |
| **תיאור** | טרמינל live — stream של בקשות API (WebSocket). |
| **סטטוס** | ✅ עובד |

---

## 7. מסכים שלא צולמו (משניים)

| Route | קובץ | הערה |
|-------|------|------|
| `/a/:token` | `CustomerApprovePage.jsx` | אישור הזמנה ב-SMS — דורש token חי |
| `/driver/:id` | `DriverTodayPage.jsx` | פרטי משלוח בודד — אין משלוח פתוח ב-seed |

---

## 8. המלצות ל-INV-02 (מצגת PPT — רוני)

**סדר שקפים מוצע (~7 דק'):**

1. שער + UVP (landing hero)
2. הבעיה — Excel/WhatsApp/מלאי שבור
3. 4 תפקידים — admin / agent / warehouse / driver
4. דשבורד מנהל (`10`)
5. מוצרים + מלאי (`13`, `14`)
6. הזמנות + pipeline (`11`, `12`)
7. מפת מחסן (`17`)
8. סוכן בשטח (`30`, `32`)
9. ליקוט (`41`)
10. נהג (`50`)
11. Super-admin multi-tenant (`60`)
12. CTA + pricing (מ-landing)

**קובץ capture לרענון:** `ops/intake/inventory-audit/_capture.mjs`

---

## Linear

**INV-01** — screen catalog: **blocked** (Linear MCP/API לא זמין בסשן agent — ר' `ops/linear-founder-unblock.md`). Board JSON מעודכן locally.
