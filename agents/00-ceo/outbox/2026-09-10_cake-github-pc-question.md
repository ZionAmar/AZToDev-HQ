# Founder Q: רגע מה הבעיה? פשוט צריך את המחשב פתוח?

**Date:** 2026-09-10  
**Founder:** ציון עמר  
**Context:** cake-recipe-demo — דפנה סיימה דף סטטי; העלאה לגיטהאב נתקעה

## Answer (Telegram — Hebrew)

כן — **בגדול זה בדיוק זה**, אבל חשוב לפרק:

**מה כבר מוכן:** דף המתכון (עוגת שוקולד, עברית מימין לשמאל) נבנה ונבדק בענן. אין בעיה בדף עצמו.

**מה חסר:** ליצור פרויקט חדש בגיטהאב תחת החשבון האישי שלך, ולהעלות אליו את הקוד. רק אז אפשר להמשיך לדוקר וללינק שתפתח בדפדפן.

**למה לא מהענן:** החיבור של הענן לגיטהאב מוגבל למשרד החברה — הוא לא יכול ליצור פרויקטים חדשים בחשבון שלך. זו אותה מגבלה שכבר ראינו בשינויי פרטי/ציבורי.

**מה קורה עכשיו:** נדב בתור — ברגע שהמחשב יתחיל לרוץ, הוא ייצור את הפרויקט ויעלה את הקוד. אחרי זה פז ממשיך בענן עם דוקר והלינק החי, ואורי בודק לפני שזה מגיע אליך.

**אם תרצה לזרז:** אפשר ליצור בעצמך עכשיו פרויקט ריק ופרטי בשם cake-recipe-demo באתר גיטהאב — נדב יצטרך רק להעלות את הקוד כשהמחשב יעלה.

## Evidence

- Thread: 14-frontend-engineer reported static page ready; repo ZionAmar/cake-recipe-demo does not exist; push blocked on personal-account scope
- `agents/00-ceo/outbox/2026-09-10_why-pc-for-github-visibility.md` — Cloud App scoped to AZToDev-HQ only; owner mutations need PC session
- `agents/00-ceo/outbox/2026-09-10_github-via-nadav-not-cloud.md` — company path for GitHub account mutations is Nadav or founder self-service on github.com
- Queued: `agents/34-pc-ops/inbox/2026-09-10_pci-14-cake-recipe-repo-create.md`

DELEGATE: 34-pc-ops | PCI-14: Create private repo ZionAmar/cake-recipe-demo on GitHub via PC gh session; pull/push static RTL cake recipe bundle from 14-frontend-engineer cloud artifact; verify repo live. Then DELEGATE 16-devops-engineer for Docker + GitHub Pages live link.

HANDOFF:
- done: Explained to founder — page ready in cloud; GitHub repo create+push is the blocker; queued Nadav
- next: Nadav PCI-14 when PC heartbeat online; then Paz Docker+Pages; Uri QA
- files: agents/34-pc-ops/inbox/2026-09-10_pci-14-cake-recipe-repo-create.md

LEARNING:
- do: On «פשוט צריך מחשב פתוח?» — yes for GitHub repo step; separate what's ready (page in cloud) from what's blocked (personal-account repo); queue Nadav without asking if PC is on
- dont: Imply the whole project waits on PC — Docker/link/QA continue in cloud after upload
- note: Founder asked if PC-on is the only blocker for cake demo GitHub; answered yes for repo step, queued PCI-14
