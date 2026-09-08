document.addEventListener('DOMContentLoaded', () => {
    const sessionPageLoadMs = Date.now();

    // =======================================================
    // ============== מילון תרגומים (עברית ואנגלית) ==========
    // =======================================================
    const translations = {
        he: {
            // --- הגדרות כלליות (SEO: שמור עקביות עם about_p1 + about_p2 כדי שלא ישתנה הסניפט בגוגל) ---
            meta_title: "ציון עמר | פיתוח תוכנה, יזמות והוראה",
            meta_description: "שמי ציון עמר, והגישה שלי לפיתוח תוכנה נבנתה מהיסודות. במשך עשור עבדתי כשיפוצניק ומנהל אחזקה במוסדות חינוך ובבסיסי צה\"ל — עבודה שבה כל יום הוא אתגר חדש. למדתי לפתור בעיות, להבין איך מערכות עובדות לעומק, ולתקן דברים עם הידיים. למדתי את החשיבות של עבודה יסודית – כי כשאתה בונה משהו, אתה רוצה שהוא יחזיק מעמד. את התשוקה הזו לבנייה ופתרון בעיות לקחתי לעולם התוכנה. כבוגר הנדסאי תוכנה בהצטיינות וכיום כמרצה לפיתוח תוכנה במגוון שפות, אני משלב את הראייה הפרקטית מהשטח עם עומק טכנולוגי. אני לא רק כותב קוד, אני בונה פתרונות – עם אותה מסירות, יצירתיות, ואותה שאיפה למצוינות שהנחו אותי תמיד.",
            lang_toggle_text: "English",

            // --- ניווט ---
            nav_about: "מי אני",
            nav_resume: "ניסיון תעסוקתי",
            nav_tech: "שפות וטכנולוגיות",
            nav_services: "מה אני בונה",
            nav_projects: "פרויקטים שביצעתי",
            nav_youtube: "קורסים",
            nav_testimonials: "חוות דעת של לקוחות",
            nav_achievements: "הישגים",
            nav_contact: "יצירת קשר",

            // --- Hero Section ---
            hero_brand_name: "AZToDev",
            hero_brand_tagline: "פיתוח תוכנה, אפליקציות ואתרים — לצורך אישי או לעסק. יזמות והוראה.",
            hero_slogan: "«הדרך הטובה ביותר לחזות את העתיד היא ליצור אותו»",
            hero_quote_lead: "מחפשים פתרון מקצועי במחיר הוגן? שלחו הצעת מחיר קיימת או תיאור קצר — אחזור עם הצעה ברורה, לרוב תחרותית יותר — בלי לוותר על איכות.",
            hero_btn_quote: "בקשת הצעת מחיר",
            btn_view_work: "לפרויקטים שביצעתי",
            btn_resume_short: "ניסיון מקצועי",
            btn_contact_project: "יצירת קשר",
            hero_cv_short: "קו״ח PDF",
            btn_download_cv: '<i class="fas fa-download"></i> הורדת קו״ח',

            vcard_brand: "AZToDev",
            vcard_name: "ציון עמר",
            vcard_degree: "הנדסאי תוכנה — סיום בהצטיינות, מכללת כנרת",
            vcard_role: "מפתח מוצרי SaaS ומערכות Web לעסקים · יזם עצמאי · מרצה לפיתוח תוכנה",
            vcard_li_1: "פתרונות end-to-end — מאפיון ועד פריסה, תחזוקה וליווי לקוח",
            vcard_li_2: "מוצרים חיים בפרודקשן: אוטומציה, ניהול, SaaS וכלים לעסק",
            vcard_li_3: "הוראה והכשרה במגוון שפות וטכנולוגיות — ברור, מסודר ומעשי",
            vcard_phone_html: "054-977-4827",
            vcard_btn_cv: '<i class="fas fa-download"></i> הורדת קו״ח (PDF)',
            vcard_btn_share: '<i class="fas fa-share-alt"></i> שיתוף',
            vcard_share_title: "ציון עמר — כרטיס ביקור · AZToDev",
            vcard_share_text: "ציון עמר | הנדסאי תוכנה (בהצטיינות). מפתח SaaS ומערכות לעסקים, יזם ומרצה. טל׳ 054-977-4827 · amzion24@gmail.com",
            vcard_share_copied: "הועתק ללוח — אפשר להדביק בכל אפליקציה.",
            vcard_fab_aria: "פתיחת כרטיס ביקור",
            vcard_close_aria: "סגור",
            scroll_back_aria: "חזרה למקום בדף שבו הייתי לפני הקפיצה",

            pill_about: "מי אני",
            pill_projects: "פרויקטים שביצעתי",
            pill_resume: "ניסיון תעסוקתי",
            pill_tech: "שפות וטכנולוגיות",
            pill_learning: "קורסים",
            pill_testimonials: "חוות דעת של לקוחות",
            pill_contact: "יצירת קשר",

            testimonials_title: "מה לקוחות אומרים",
            testimonials_subtitle: "משובים אמיתיים מלקוחות על מערכות שבניתי, ומשובים ממרצים על ההוראה.",
            testimonial_1_quote: "״תוכנה פגז — עונה בדיוק על הצרכים שלנו.״",
            testimonial_1_role: "אפעה אבטה וכ״א בע״מ · WorkClock Pro",
            testimonial_2_quote: "״מאוד שמח שבסוף בחרתי לקחת אותך.״",
            testimonial_2_role: "לקוח מרוצה · Telemust",
            testimonial_3_quote: "״בחור מקסים, כיף ללמוד אצלו.״",
            testimonial_3_role: "משוב מרצים",
            testimonial_4_quote: "״אחלה מרצה, מסביר כל פרט ופרט.״",
            testimonial_4_role: "משוב מרצים",

            trial_title: "ניסיון חינם לכל התוכנות שלי",
            trial_lead: "ברוב המוצרים והמערכות שאני מציע — אפשר להתחיל בניסיון חינם: בלי התחייבות ארוכה ובלי הזנת פרטי אשראי.",
            trial_point_1: "בדיקה אמיתית במערכת לפני החלטה — בלי אותיות קטנות מיותרות.",
            trial_point_2: "ללא כרטיס אשראי בשלב הניסיון — רק אם נרצה להמשיך, נגדיר יחד את המסלול.",
            trial_point_3: "ליווי והסברים ברורים — כדי שתדעו בדיוק מה אתם מקבלים.",
            trial_cta: "רוצים להתחיל בניסיון? דברו איתי",
            trial_cta_secondary: "לפרויקטים",

            // --- אודות (הטקסט המקורי) — שמור about_p1+about_p2 זהים ל-meta_description בעברית ליציבות סניפט גוגל ---
            about_title: "מי אני — בקצרה",
            about_photo_alt: "ציון עמר",
            portrait_thumb_hint: "הצגת תמונת פרופיל בגודל מלא",
            portrait_modal_title: "ציון עמר",
            portrait_modal_subtitle: "תמונת פרופיל",
            portrait_modal_close_aria: "סגור",
            about_p1: "שמי ציון עמר, והגישה שלי לפיתוח תוכנה נבנתה מהיסודות. במשך עשור עבדתי כשיפוצניק ומנהל אחזקה במוסדות חינוך ובבסיסי צה\"ל — עבודה שבה כל יום הוא אתגר חדש. למדתי לפתור בעיות, להבין איך מערכות עובדות לעומק, ולתקן דברים עם הידיים. למדתי את החשיבות של עבודה יסודית – כי כשאתה בונה משהו, אתה רוצה שהוא יחזיק מעמד.",
            about_p2: "את התשוקה הזו לבנייה ופתרון בעיות לקחתי לעולם התוכנה. כבוגר הנדסאי תוכנה בהצטיינות וכיום כמרצה לפיתוח תוכנה במגוון שפות, אני משלב את הראייה הפרקטית מהשטח עם עומק טכנולוגי. אני לא רק כותב קוד, אני בונה פתרונות – עם אותה מסירות, יצירתיות, ואותה שאיפה למצוינות שהנחו אותי תמיד.",
            stat1_desc: "שנות ניסיון בעבודת שטח ופתרון בעיות",
            stat2_desc: "שנות ניסיון בפיתוח תוכנה",
            stat3_desc: "זכיות בהאקתונים",

            // --- טכנולוגיות ---
            tech_title: "טכנולוגיות",
            tech_subtitle: "חלוקה לשכבות — צד שרת, צד לקוח וסביבת עבודה.",
            tech_backend_title: "פיתוח צד-שרת (Backend)",
            tech_frontend_title: "פיתוח צד-לקוח (Frontend)",
            tech_tools_title: "כלים, אוטומציה וסביבת עבודה",

            // --- שירותים ---
            services_title: "מה אני בונה",
            services_subtitle: "שלושה כיוונים שחוזרים בפרויקטים אמיתיים — והיקף שמתאים לכם.",
            services_intro_1: "בין אם אתם צריכים פתרון ברמת חברה — דשבורדים, הרשאות, דוחות ותהליכים מורכבים — ובין אם מדובר במשהו קטן, אישי או לעסק מכל סוג וגודל: כדאי לפנות אליי. נגדיר יחד את ההיקף הנכון ונבנה אותו בצורה מסודרת.",
            services_intro_2: "כיום אני נותן ערך שוטף ללקוחות משלמים במגוון פרויקטים חיים — למשל Telemust, מערכות ניהול תורים, אוטומציות לפרסום חדשות, שעון נוכחות לעובדים ועוד. הלקוחות מרוצים, ואני מתמקד בלחסוך להם זמן וכסף — בצורה מקצועית, מסודרת ונעימה לעבודה מולה.",

            service_automation_title: "אוטומציה ובוטים",
            service_automation_desc: "טלגרם, וואטסאפ, תזמונים ואינטגרציות בין מערכות.",

            service_web_title: "אתרים ודפי נחיתה",
            service_web_desc: "מהירים, נקיים ומותאמים למובייל.",

            service_app_title: "אפליקציות ומערכות",
            service_app_desc: "ממשקי ניהול, SaaS, דשבורדים וסנכרון בזמן אמת.",

            // --- קו״ח וניסיון ---
            resume_title: "ניסיון מקצועי",
            resume_subtitle: "השכלה, סטאק, ציר זמן — וקו״ח להורדה.",
            btn_linkedin_profile: '<i class="fab fa-linkedin"></i> LinkedIn',
            resume_education_title: "השכלה",
            resume_degree_summary: "הנדסאי תוכנה, בהצטיינות · מכללה טכנולוגית כנרת",
            resume_stack_title: "שפות וטכנולוגיות",
            resume_stack_hint: "הסטאק שאני עובד איתו בפועל בפרויקטים ומוצרים חיים.",
            resume_summary_title: "תקציר",
            resume_summary_p: "מפתח Full-Stack ויזם עצמאי; מלמד פיתוח תוכנה; בונה ומתחזק מוצרי SaaS ומערכות בפרודקשן, כולל ליווי לקוחות משלמים בפרויקטים חיים.",
            resume_experience_title: "ציר זמן",
            exp_entrepreneur_dates: "2023 — היום",
            exp_entrepreneur_role: "יזם ומפתח עצמאי — מוצרי SaaS וכלים",
            exp_entrepreneur_desc: "אפיון, פיתוח מקצה לקצה, פריסה ותמיכה במוצרים כמו Telemust, FiTime, My Tor, WorkClock Pro ועוד.",
            exp_lecturer_kinneret_dates: "2024 — 2026",
            exp_lecturer_kinneret_role: "מרצה לפיתוח תוכנה — מכללת כנרת",
            exp_lecturer_kinneret_desc: "הוראה במגוון שפות ונושאים בפיתוח תוכנה, בהתאם לסילבוס המכללה.",
            exp_army_dates: "2025",
            exp_army_role: "מרצה לשפת C — צה״ל, מחנה שמשון (צפת)",
            exp_army_desc: "הכשרת חיילים ביסודות פיתוח תוכנה.",
            exp_cyber_dates: "2024",
            exp_cyber_role: "מדריך תכנות — המרכז לחינוך סייבר",
            exp_cyber_desc: "לימוד C# לתלמידי כיתה ט׳.",
            exp_ta_dates: "קיץ 2023",
            exp_ta_role: "מרצה מתגבר — מכללת כנרת",
            exp_ta_desc: "קורס ׳יסודות התכנות׳ — מינוי כבר בשנה הראשונה ללימודים.",
            exp_tutor_dates: "2023 — 2026",
            exp_tutor_role: "מורה פרטי לפיתוח תוכנה",
            exp_tutor_desc: "ליווי אישי ושיעורים פרטיים למידה מעשית.",
            exp_field_dates: "~עשור",
            exp_field_role: "שיפוצניק ומנהל אחזקה (בעבר)",
            exp_field_desc: "ניסיון מעשי בפתרון בעיות, עמידה בלוחות זמנים ועבודה מול לקוחות — בסיס לשיטת עבודה מסודרת ואחראית.",

            // --- פרויקטים ---
            projects_title: "פרויקטים נבחרים",
            projects_subtitle: "לחצו לפרטים",
            proj_textrescuer: "Text Rescuer",
            proj_fitime: "FiTime",
            proj_fitime_tag: "SaaS · ניהול עסקי",
            proj_mytor: "My Tor",
            proj_mytor_tag: "SaaS · ניהול תורים",
            proj_workclock: "WorkClock Pro",
            proj_workclock_tag: "נוכחות · HR",
            proj_tasks: "חוזה אונליין",
            proj_telemust: "Telemust",
            proj_telemust_tag: "אוטומציה · טלגרם",
            proj_tehilim: "תהילים בקליק",
            proj_tehilim_tag: "קהילה · תפילה",

            telemust_card_title: "Telemust - אוטומציה לטלגרם",
            telemust_card_summary: "מערכת End-to-End שבניתי מאפס, המשרתת כיום לקוחות משלמים ומהווה פתרון מוביל לניהול קהילות בטלגרם.",

            fitime_card_title: "Fitime - ניהול סטודיו חכם",
            fitime_card_summary: "מערכת מקיפה לניהול סטודיו לפילאטיס וכושר, המספקת מענה לצרכי השוק וכוללת ניהול תורים חכם, רישום והתראות.",

            tasks_card_title: "חוזה אונליין - חתימת חוזים",
            tasks_card_summary: "מערכת לחתימת חוזים דיגיטלית — שליחת מסמכים לחתימה אונליין ומעקב סטטוס בזמן אמת.",
            tehilim_card_title: "תהילים בקליק - קריאה משותפת",
            tehilim_card_summary: "פלטפורמת Web לקריאת תהילים משותפת. סנכרון בזמן אמת לחלוקת פרקים מהירה לקבוצות.",

            btn_case_study: 'לסיפור המלא <i class="fas fa-arrow-left"></i>',

            // --- יוטיוב ---
            youtube_title: "יוטיוב",
            youtube_description: "סרטונים ושיעורים בפיתוח תוכנה — עומק, סדר והסבר ברור, באותה גישה שאני מלמד איתה במכללה.",
            youtube_lesson6_title: "שיעור 6 - Node.js",
            youtube_lesson4_title: "שיעור 4 - Node.js",
            youtube_lesson1_title: "שיעור 1 - Node.js",
            btn_all_youtube: 'מעבר לערוץ YouTube המלא <i class="fab fa-youtube"></i>',

            // --- הישגים ---
            achievements_title: "הישגים והסמכות",
            achievements_hackathon_title: "זכיות בהאקתונים",
            adspire_award_rank: "מקום ראשון",
            adspire_award_project: "| פרויקט AdSpire - זיהוי מיומנויות רכות באמצעות AI.",
            btn_read_article: "(קראו את הכתבה)",
            aquastia_award_rank: "מקום שני",
            aquastia_award_project: "| פרויקט Aquastia - מערכת ניטור חכמה לצנרת מים.",
            achievements_teaching_title: "הוראה והדרכה",

            diploma_honors_badge: "בהצטיינות",
            diploma_thumb_hint: "הצגת דיפלומה בגודל מלא",
            diploma_modal_title: "דיפלומת הנדסאי",
            diploma_modal_subtitle: "הנדסת תוכנה · ציון עמר",
            diploma_modal_close_aria: "סגור",
            diploma_img_alt_he: "דיפלומת הנדסאי תוכנה בעברית — ציון עמר",
            diploma_img_alt_en: "Software Engineering diploma — Zion Amar",

            // תפקיד צבאי
            army_lecturer_role: "מרצה לשפת C (צה\"ל)",
            army_lecturer_desc: "| מחנה שמשון, צפת (2025): הכשרת חיילים בפיתוח תוכנה.",

            lecturer_role: "מרצה לפיתוח תוכנה",
            lecturer_desc: "| מכללת כנרת (2024 — 2026): מלמד פיתוח תוכנה במגוון שפות.",
            instructor_role: "מדריך תכנות",
            instructor_desc: "| המרכז לחינוך סייבר (2024): לימדתי C# לתלמידי כיתה ט'.",
            ta_role: "מרצה מתגבר",
            ta_desc: "| מכללת כנרת (קיץ 2023): נבחרתי לשמש כמרצה בקורס 'יסודות התכנות' כבר בסוף השנה הראשונה ללימודיי.",
            tutor_role: "מורה פרטי לפיתוח",
            tutor_desc: "| (2023 — 2026): מעביר שיעורים פרטיים בפיתוח תוכנה.",

            // --- Hero ---
            skip_to_content: "דלג לתוכן",
            availability_text: "פנוי לפרויקטים חדשים",

            // --- יצירת קשר ופוטר ---
            contact_title: "יצירת קשר",
            contact_description: "ספרו בקצרה מה צריך לקרות, שלחו מסמך דרישות או צרפו הצעת מחיר קיימת — אחזור אליכם בגובה העיניים, עם המשך דרך והצעה מסודרת.",
            contact_secondary: "אם הפרויקט בכיוון שלי, אתן ערך אמיתי ומחיר הוגן — כולל התחייבות למחיר תחרותי כשזה מתאים.",
            btn_whatsapp: 'שלח הודעה בווטסאפ <i class="fab fa-whatsapp"></i>',
            btn_email: 'שלח אימייל <i class="fas fa-envelope"></i>',
            form_name_label: "שם מלא",
            form_name_placeholder: "השם שלך",
            form_email_label: "אימייל",
            form_email_placeholder: "your@email.com",
            form_message_label: "הודעה",
            form_message_placeholder: "ספר לי על הפרויקט שלך...",
            form_submit: "שלח הודעה",
            form_success: "✅ ההודעה נשלחה! אחזור אליך בהקדם.",
            form_error_general: "משהו השתבש. נסה שוב או שלח ישירות למייל.",
            form_err_name: "נא להזין שם תקין",
            form_err_email: "נא להזין אימייל תקין",
            form_err_message: "ההודעה קצרה מדי",
            email_copied: "האימייל הועתק! ✓",
            footer_copyright: `&copy; ${new Date().getFullYear()} AZToDev · ציון עמר. כל הזכויות שמורות.`
        },
        en: {
            // --- General (keep meta_description aligned with about_p1 + about_p2) ---
            meta_title: "Zion Amar | Software development, entrepreneurship & teaching · AZToDev",
            meta_description: "My name is Zion Amar, and my approach to software development was built from the ground up. For a decade, I worked as a renovator and maintenance manager in educational institutions and at IDF bases—a job where every day is a new challenge. I learned to solve problems, understand how systems work deeply, and fix things with my own hands. I learned the importance of thorough work—because when you build something, you want it to last. I took this passion for building and problem-solving into the world of software. As a graduate of Software Engineering with honors and now as a lecturer for software development in various languages, I combine a practical, hands-on perspective with technological depth. I don't just write lines of code; I engineer solutions from the foundation up, with the same dedication, creativity, and pursuit of excellence that have always guided me.",
            lang_toggle_text: "עברית",

            // --- Nav ---
            nav_about: "About me",
            nav_resume: "Work experience",
            nav_tech: "Languages & technologies",
            nav_services: "What I build",
            nav_projects: "Projects I’ve built",
            nav_youtube: "Courses",
            nav_testimonials: "Client reviews",
            nav_achievements: "Achievements",
            nav_contact: "Contact",

            // --- Hero ---
            hero_brand_name: "AZToDev",
            hero_brand_tagline: "Software development, apps, and websites — for personal projects or businesses. Entrepreneurship and teaching.",
            hero_slogan: "“The best way to predict the future is to create it.”",
            hero_quote_lead: "Need a professional solution at a fair price? Send a short brief or an existing quote — I’ll reply with a clear proposal, often more competitive — without cutting corners on quality.",
            hero_btn_quote: "Request a quote",
            btn_view_work: "See shipped work",
            btn_resume_short: "Experience",
            btn_contact_project: "Contact",
            hero_cv_short: "Resume PDF",
            btn_download_cv: '<i class="fas fa-download"></i> Download resume',

            vcard_brand: "AZToDev",
            vcard_name: "Zion Amar",
            vcard_degree: "Software Engineering diploma — with honors, Kinneret College",
            vcard_role: "SaaS & web systems for businesses · independent builder · software development lecturer",
            vcard_li_1: "End-to-end delivery — from spec to deployment, maintenance, and client support",
            vcard_li_2: "Live production products: automation, operations, SaaS, and business tools",
            vcard_li_3: "Teaching & training across languages and stacks — clear, structured, hands-on",
            vcard_phone_html: "+972-54-977-4827",
            vcard_btn_cv: '<i class="fas fa-download"></i> Download resume (PDF)',
            vcard_btn_share: '<i class="fas fa-share-alt"></i> Share card',
            vcard_share_title: "Zion Amar — digital business card · AZToDev",
            vcard_share_text: "Zion Amar | Software Engineering (Honors). SaaS & systems for businesses, builder & lecturer. +972-54-977-4827 · amzion24@gmail.com",
            vcard_share_copied: "Copied to clipboard — paste anywhere you like.",
            vcard_fab_aria: "Open digital business card",
            vcard_close_aria: "Close",
            scroll_back_aria: "Return to where you were before this jump",

            pill_about: "About me",
            pill_projects: "Projects I’ve built",
            pill_resume: "Work experience",
            pill_tech: "Languages & technologies",
            pill_learning: "Courses",
            pill_testimonials: "Client reviews",
            pill_contact: "Contact",

            testimonials_title: "What clients say",
            testimonials_subtitle: "Real client notes on products I’ve built, plus lecturer feedback on teaching.",
            testimonial_1_quote: "“Killer software — it fits our needs exactly.”",
            testimonial_1_role: "Afaa Avta & Co. Ltd · WorkClock Pro",
            testimonial_2_quote: "“Really glad I ended up choosing you.”",
            testimonial_2_role: "Happy client · Telemust",
            testimonial_3_quote: "“Great guy — fun to learn with him.”",
            testimonial_3_role: "Lecturer feedback",
            testimonial_4_quote: "“Excellent lecturer — explains every little detail.”",
            testimonial_4_role: "Lecturer feedback",

            trial_title: "Free trial on my software offerings",
            trial_lead: "For most products and systems I offer, you can start with a free trial: no long-term lock-in and no credit card required for the trial phase.",
            trial_point_1: "A real in-product evaluation before you commit — without hidden fine print.",
            trial_point_2: "No credit card during the trial — if we continue, we’ll define the plan together.",
            trial_point_3: "Clear guidance — so you know exactly what you’re getting.",
            trial_cta: "Want to start a trial? Talk to me",
            trial_cta_secondary: "View projects",

            // --- About — keep about_p1+about_p2 in sync with meta_description (en) ---
            about_title: "About me — at a glance",
            about_photo_alt: "Zion Amar",
            portrait_thumb_hint: "View profile photo full size",
            portrait_modal_title: "Zion Amar",
            portrait_modal_subtitle: "Profile photo",
            portrait_modal_close_aria: "Close",
            about_p1: "My name is Zion Amar, and my approach to software development was built from the ground up. For a decade, I worked as a renovator and maintenance manager in educational institutions and at IDF bases—a job where every day is a new challenge. I learned to solve problems, understand how systems work deeply, and fix things with my own hands. I learned the importance of thorough work—because when you build something, you want it to last.",
            about_p2: "I took this passion for building and problem-solving into the world of software. As a graduate of Software Engineering with honors and now as a lecturer for software development in various languages, I combine a practical, hands-on perspective with technological depth. I don't just write lines of code; I engineer solutions from the foundation up, with the same dedication, creativity, and pursuit of excellence that have always guided me.",
            stat1_desc: "Years of hands-on & problem-solving experience",
            stat2_desc: "Years of software development experience",
            stat3_desc: "Hackathon Wins",

            // --- Tech ---
            tech_title: "Technologies",
            tech_subtitle: "Grouped by layer — backend, frontend, and tooling.",
            tech_backend_title: "Backend Development",
            tech_frontend_title: "Frontend Development",
            tech_tools_title: "Tools, Automation & Environment",

            // --- Services ---
            services_title: "What I build",
            services_subtitle: "Three directions that show up in real projects — scoped to what you actually need.",
            services_intro_1: "Whether you need an enterprise-style solution — dashboards, permissions, reporting, and complex flows — or something small, personal, or for any type of business, you can reach out. We’ll define the right scope and ship it in a structured way.",
            services_intro_2: "Today I deliver ongoing value to paying customers across live products — for example Telemust, appointment and queue systems, automations for publishing news, employee attendance tools, and more. Clients are happy; I focus on saving them time and money — professionally, clearly, and in a way that’s easy to work with.",

            service_automation_title: "Automation & bots",
            service_automation_desc: "Telegram, WhatsApp, scheduling, and system integrations.",

            service_web_title: "Websites & landing pages",
            service_web_desc: "Fast, clean, and mobile-friendly.",

            service_app_title: "Apps & internal tools",
            service_app_desc: "Admin UIs, SaaS, dashboards, and real-time workflows.",

            // --- Resume ---
            resume_title: "Experience",
            resume_subtitle: "Education, stack, timeline — plus a PDF resume.",
            btn_linkedin_profile: '<i class="fab fa-linkedin"></i> LinkedIn',
            resume_education_title: "Education",
            resume_degree_summary: "Software Engineering diploma, with honors · Kinneret Technological College",
            resume_stack_title: "Languages & technologies",
            resume_stack_hint: "The stack I use day to day in shipped products.",
            resume_summary_title: "Summary",
            resume_summary_p: "Full-stack developer and independent builder; teaches software development; builds and maintains SaaS products and production systems, including ongoing work for paying customers on live projects.",
            resume_experience_title: "Timeline",
            exp_entrepreneur_dates: "2023 — Present",
            exp_entrepreneur_role: "Entrepreneur & developer — SaaS products & tools",
            exp_entrepreneur_desc: "End-to-end product work: spec, build, deploy, and support for Telemust, FiTime, My Tor, WorkClock Pro, and more.",
            exp_lecturer_kinneret_dates: "2024 — 2026",
            exp_lecturer_kinneret_role: "Software development lecturer — Kinneret College",
            exp_lecturer_kinneret_desc: "Teaching multiple languages and topics according to the college curriculum.",
            exp_army_dates: "2025",
            exp_army_role: "C programming lecturer — IDF, Shimshon camp (Zefat)",
            exp_army_desc: "Training soldiers in software development fundamentals.",
            exp_cyber_dates: "2024",
            exp_cyber_role: "Programming instructor — National Cyber Education Center",
            exp_cyber_desc: "Taught C# to 9th-grade students.",
            exp_ta_dates: "Summer 2023",
            exp_ta_role: "Teaching assistant — Kinneret College",
            exp_ta_desc: "“Programming Foundations” course — appointed in my first year of studies.",
            exp_tutor_dates: "2023 — 2026",
            exp_tutor_role: "Private software tutor",
            exp_tutor_desc: "One-on-one mentoring and practical learning.",
            exp_field_dates: "~A decade",
            exp_field_role: "Renovator & maintenance lead (earlier career)",
            exp_field_desc: "Hands-on problem solving, deadlines, and client communication — the foundation for how I work today.",

            // --- Projects ---
            projects_title: "Selected projects",
            projects_subtitle: "Click for details",
            proj_textrescuer: "Text Rescuer",
            proj_fitime: "FiTime",
            proj_fitime_tag: "SaaS · Business",
            proj_mytor: "My Tor",
            proj_mytor_tag: "SaaS · Appointments",
            proj_workclock: "WorkClock Pro",
            proj_workclock_tag: "Attendance · HR",
            proj_tasks: "Online Contracts",
            proj_telemust: "Telemust",
            proj_telemust_tag: "Automation · Telegram",
            proj_tehilim: "Tehillim Click",
            proj_tehilim_tag: "Community · Prayer",

            telemust_card_title: "Telemust - Telegram Automation",
            telemust_card_summary: "An end-to-end system I built from scratch, currently serving paying customers and providing a leading solution for managing Telegram communities.",

            fitime_card_title: "Fitime - Smart Studio Management",
            fitime_card_summary: "A comprehensive system for managing fitness studios, addressing market needs with smart scheduling, registration, and notifications.",

            tasks_card_title: "Online Contracts - E-Signature",
            tasks_card_summary: "Online contract signing system — send documents for digital signature and track status in real time.",

            tehilim_card_title: "Tehillim Click - Social Reading",
            tehilim_card_summary: "Social platform for communal Psalm reading. Smart real-time chapter distribution allowing groups to complete books efficiently.",

            btn_case_study: 'View Case Study <i class="fas fa-arrow-right"></i>',

            // --- YouTube ---
            youtube_title: "YouTube",
            youtube_description: "Videos and lessons on software development — depth, structure, and clear explanations, in the same approach I use when teaching at college.",
            youtube_lesson6_title: "Lesson 6 - Node.js",
            youtube_lesson4_title: "Lesson 4 - Node.js",
            youtube_lesson1_title: "Lesson 1 - Node.js",
            btn_all_youtube: 'Open the full YouTube channel <i class="fab fa-youtube"></i>',

            // --- Achievements ---
            achievements_title: "Achievements & Credentials",
            achievements_hackathon_title: "Hackathon Wins",
            adspire_award_rank: "1st Place",
            adspire_award_project: "| AdSpire Project - Identifying soft skills using AI.",
            btn_read_article: "(Read the article)",
            aquastia_award_rank: "2nd Place",
            aquastia_award_project: "| Aquastia Project - Smart water pipe monitoring system.",
            achievements_teaching_title: "Teaching & Mentoring",

            diploma_honors_badge: "With honors",
            diploma_thumb_hint: "View diploma full size",
            diploma_modal_title: "Engineering Diploma",
            diploma_modal_subtitle: "Software Engineering · Zion Amar",
            diploma_modal_close_aria: "Close",
            diploma_img_alt_he: "Software Engineering diploma in Hebrew — Zion Amar",
            diploma_img_alt_en: "Software Engineering diploma in English — Zion Amar",

            army_lecturer_role: "C Lecturer (IDF)",
            army_lecturer_desc: "| Shimshon camp, Zefat (2025): Training soldiers in software development.",

            lecturer_role: "Software Development Lecturer",
            lecturer_desc: "| Kinneret College (2024 — 2026): Teaching software development in various languages.",
            instructor_role: "Programming Instructor",
            instructor_desc: "| Cyber Education Center (2024): Taught C# to 9th-grade students.",
            ta_role: "Teaching Assistant",
            ta_desc: "| Kinneret College (Summer 2023): Chosen as a TA for 'Programming Foundations' course in my first year.",
            tutor_role: "Private Development Tutor",
            tutor_desc: "| (2023 — 2026): Providing private tutoring in software development.",

            // --- Hero ---
            skip_to_content: "Skip to content",
            availability_text: "Available for new projects",

            // --- Contact ---
            contact_title: "Contact",
            contact_description: "Share a short brief, a requirements doc, or attach an existing quote — I’ll respond at eye level with next steps and a clear proposal.",
            contact_secondary: "If the project fits what I do best, I’ll deliver real value and fair pricing — including a competitive commitment when it makes sense.",
            btn_whatsapp: 'Send a WhatsApp Message <i class="fab fa-whatsapp"></i>',
            btn_email: 'Send Email <i class="fas fa-envelope"></i>',
            form_name_label: "Full Name",
            form_name_placeholder: "Your name",
            form_email_label: "Email",
            form_email_placeholder: "your@email.com",
            form_message_label: "Message",
            form_message_placeholder: "Tell me about your project...",
            form_submit: "Send Message",
            form_success: "✅ Message sent! I'll get back to you soon.",
            form_error_general: "Something went wrong. Try again or email directly.",
            form_err_name: "Please enter a valid name",
            form_err_email: "Please enter a valid email",
            form_err_message: "Message is too short",
            email_copied: "Email copied! ✓",
            footer_copyright: `&copy; ${new Date().getFullYear()} AZToDev · Zion Amar. All rights reserved.`
        }
    };

    // --- מידע למודאלים (פירוט פרויקטים) ---
    const MYTOR_MOCK_HTML = `
<div class="mytor-mock-wide" aria-hidden="true">
    <div class="mytor-mock-chrome">
        <span class="mytor-mock-chrome-dots" aria-hidden="true"></span>
        <span class="mytor-mock-chrome-title">My Tor · יומן תורים</span>
        <span class="mytor-mock-chrome-url">mytor.pro</span>
    </div>
    <div class="mytor-mock-panel">
        <aside class="mytor-mock-aside">
            <div class="mytor-mock-brand"><span class="mytor-mock-logo" aria-hidden="true"></span><span>לוגו העסק</span></div>
            <p class="mytor-mock-aside-label">יום ג׳ · 12 בחודש</p>
            <div class="mytor-mock-mini-cal">
                <span class="mytor-mc-h">א</span><span class="mytor-mc-h">ב</span><span class="mytor-mc-h">ג</span><span class="mytor-mc-h">ד</span><span class="mytor-mc-h">ה</span><span class="mytor-mc-h">ו</span><span class="mytor-mc-h">ש</span>
                <span class="mytor-mc-d"></span><span class="mytor-mc-d">10</span><span class="mytor-mc-d mytor-mc-d--on">12</span><span class="mytor-mc-d">13</span><span class="mytor-mc-d">14</span><span class="mytor-mc-d">15</span><span class="mytor-mc-d">16</span>
            </div>
        </aside>
        <div class="mytor-mock-main">
            <div class="mytor-mock-timeline">
                <div class="mytor-mock-col"><span class="mytor-mock-time">09:00</span><div class="mytor-mock-cell mytor-mock-cell--free">פנוי</div></div>
                <div class="mytor-mock-col"><span class="mytor-mock-time">10:30</span><div class="mytor-mock-cell mytor-mock-cell--busy">תספורת<br>דנה</div></div>
                <div class="mytor-mock-col"><span class="mytor-mock-time">12:00</span><div class="mytor-mock-cell mytor-mock-cell--busy">טיפול פנים</div></div>
                <div class="mytor-mock-col"><span class="mytor-mock-time">14:00</span><div class="mytor-mock-cell mytor-mock-cell--free">פנוי</div></div>
                <div class="mytor-mock-col"><span class="mytor-mock-time">16:00</span><div class="mytor-mock-cell mytor-mock-cell--busy">ייעוץ</div></div>
            </div>
            <div class="mytor-mock-footer"><i class="fas fa-bell" aria-hidden="true"></i> תזכורת SMS + מייל נשלחה ללקוח לפני התור</div>
        </div>
    </div>
</div>`;

    const projectCaseStudies = {
        he: {
            textrescuer: {
                title: "Text Rescuer - תוסף Chrome",
                content: `<h3>על התוסף</h3><p>Text Rescuer שומר אוטומטית את כל מה שאתה מקליד בשדות טקסט, טפסים ותיבות תוכן. אם הדף נסגר, הדפדפן קורס, או שלחצת בטעות "חזור" — פותחים את התוסף ומשחזרים את הטקסט בלחיצה אחת.</p><h3>מחיר ותכונות</h3><p>חודש ראשון חינם עם כל התכונות. לאחר מכן: תשלום חד־פעמי של $5. בגרסה החינמית: שמירה ל־24 שעות; בגרסת Pro: שמירה ל־30 יום + Time Machine.</p><h3>פרטיות</h3><p>עובד בכל אתר; לא שומר סיסמאות או מספרי כרטיסים. כל הנתונים נשארים במכשיר שלך.</p><div style="margin-top:20px;"><a href="https://chromewebstore.google.com/detail/text-rescuer/fabhaiagejicfjmklneglamgeenpeiln" target="_blank" rel="noopener" class="button button-primary">התקנה מחנות Chrome</a></div>`
            },
            fitime: {
                title: "FiTime - מערכת ניהול סטודיו",
                content: `<img src="assets/fitime_app.jpg" alt="FiTime"><h3>הפתרון העסקי</h3><p>FiTime מאפשרת לבעלי סטודיו פילאטיס וכושר לנהל יומן שיעורים, רישום מתאמנים לשיעורים ומעקב מנויים. שליחת תזכורות והתראות ב־SMS.</p><h3>תכונות עיקריות</h3><p>ניהול לוח שיעורים, הרשמת מתאמנים לשיעורים, מעקב מנויים. <strong>רשימת המתנה חכמה</strong> — כשמתפנה מקום בשיעור מלא, נשלח SMS אוטומטי למחכה הראשון בתור.</p><h3>טכנולוגיות</h3><p>נבנה ב-Node.js ו-React לסנכרון בזמן אמת.</p><div style="margin-top:20px; display:flex; gap:15px; flex-wrap:wrap;"><a href="https://fitime.co.il" target="_blank" class="button button-primary">לאתר הפרויקט</a><a href="https://github.com/ZionAmar/EasyFit" target="_blank" class="button">לצפייה בקוד ב-GitHub</a></div>`
            },
            mytor: {
                title: "My Tor — ניהול תורים חכם",
                content: `${MYTOR_MOCK_HTML}<h3>הפתרון העסקי</h3><p>My Tor היא מערכת SaaS לעסקים שחיים מתורים — מספרות וסטודיואים, קליניקות, מטפלים, מאמנים, קוסמטיקה ופרילנסרים. הלקוחות קובעים תור 24/7 גם כשהעסק סגור; בעל העסק מנהל יומן, לקוחות והודעות במקום אחד — בלי אקסלים וקבוצות וואטסאפ.</p><h3>תכונות עיקריות</h3><ul><li><strong>אפליקציה ממותגת לכל עסק</strong> — לכל בעל עסק ממשק ייעודי ללקוחותיו: לוגו, צבעים וקישור אישי; הלקוח מזמין מהנייד כאילו זה האפליקציה של העסק (PWA, בלי חנות אפליקציות).</li><li><strong>תזכורות SMS ומייל</strong> — התראות אוטומטיות לפני התור ללקוח, כדי להפחית ביטולים ואי־הגעות.</li><li><strong>יומן חכם</strong> — מספר מטפלים, חסימות, חופשות ושעות פתיחה; הלקוח רואה רק מה שפנוי.</li><li><strong>כרטיסיות, הודעות ודוחות</strong> — מעקב יתרה וטיפולים, תקשורת עם לקוחות וצוות, רשימת המתנה וסיכומים למילוי היומן.</li></ul><div style="margin-top:20px;"><a href="https://mytor.pro" target="_blank" rel="noopener" class="button button-primary">לאתר My Tor</a></div>`
            },
            workclock: {
                title: "WorkClock Pro - שעון נוכחות",
                content: `<h3>על המערכת</h3><p>WorkClock Pro היא מערכת לשעון נוכחות וניהול עובדים. העובדים נרשמים לכניסה ויציאה, והמנהלים מקבלים דוחות נוכחות, שעות ועוד.</p><h3>תכונות עיקריות</h3><p>שעון נוכחות דיגיטלי, חתימת כניסה ויציאה, ניהול עובדים, דוחות שעות ונוכחות, אימות מיקום (Geolocation) לנוכחות בשטח.</p><h3>יתרונות</h3><p>עובד מהנייד ומהמחשב, אין צורך בציוד ייעודי, הנתונים מאובטחים.</p><div style="margin-top:20px;"><a href="https://workclock.pro" target="_blank" class="button button-primary">למעבר למערכת</a></div>`
            },
            tasks: {
                title: "חוזה אונליין - חתימת חוזים",
                content: `<h3>על הפרויקט</h3><p>חוזה אונליין — מערכת חתימת חוזים אונליין. מאפשר לשלוח מסמכים לחתימה דיגיטלית ולעקוב אחרי הסטטוס.</p><h3>שימוש</h3><p>מתאים לחתימה על חוזים והסכמים באינטרנט בלי צורך בהדפסה או משלוח פיזי.</p><div style="margin-top:20px;"><a href="https://tasks.aztodev.com" target="_blank" class="button button-primary">ביקור במערכת</a></div>`
            },
            telemust: {
                title: "Telemust - אוטומציה וניהול קהילות טלגרם",
                content: `<img src="assets/telemust_dashboard.jpg" alt="Telemust Dashboard"><h3>האתגר העסקי</h3><p>בעלי עסקים ומנהלי קהילות בטלגרם נאלצו להשקיע שעות רבות ביום על משימות ידניות וחוזרות: העברת תכנים, הוספת חברים, ופיקוח על קבוצות מרובות. חוסר באוטומציה הוביל לבזבוז זמן יקר וקושי בצמיחה.</p><h3>הפתרון שלי: מערכת End-to-End</h3><p>פיתחתי באופן עצמאי מערכת מקיפה שמספקת פתרון 360 לניהול קהילות. המערכת כוללת תוכנת דסקטופ (Python עם Telethon) לניהול חברים, ומערכת צד-שרת (Node.js) עם דשבורד ניהול אינטרנטי לשליטה מלאה באוטומציות.</p><h3>התפקיד שלי בפרויקט</h3><p>הייתי המפתח היחיד שאחראי על הפרויקט כולו, מאפס ועד למוצר פעיל. זה כלל ארכיטקטורה, פיתוח Back-end, פיתוח אפליקציית Desktop, ופיתוח ה-Front-end.</p><h3>התוצאה וההשפעה</h3><p>Telemust פעילה כיום ומשרתת בהצלחה לקוחות משלמים, חוסכת להם בממוצע כ-10 שעות עבודה בשבוע ומאפשרת להם להגדיל את הקהילות שלהם ביעילות. פרויקט זה מהווה הוכחה ליכולתי להפוך רעיון למוצר טכנולוגי רווחי.</p><a href="https://telemust.com" target="_blank" class="button button-primary" style="margin-top:20px;">לאתר הפרויקט</a>`
            },
            // חדש
            chatflow: {
                title: "ChatFlow - אוטומציה חכמה ל-WhatsApp",
                content: `<h3>על הפרויקט</h3><p>ChatFlow היא אפליקציית Desktop ל-Windows שפיתחתי לאוטומציה של WhatsApp לעסקים. שליחת הודעות המוניות מותאמות אישית, ניהול קבוצות, תזמון חכם ומערכת Anti-Ban מתקדמת שמגנה על החשבון.</p><h3>תכונות עיקריות</h3><p>הודעות המוניות לאלפי אנשי קשר, ניהול קבוצות אוטומטי, תזמון שליחות, ריבוי פרופילים ודוחות ביצועים.</p><div style="margin-top:20px;"><a href="https://chatflow.aztodev.com" target="_blank" class="button button-primary">ביקור באתר</a></div>`
            },
            tehilim: {
                title: "תהילים בקליק - פלטפורמה חברתית",
                content: `<h3>החזון</h3><p>לאפשר לקבוצות גדולות של אנשים לקרוא יחד ספר תהילים שלם בזמן קצר, כאשר כל אחד מקבל פרק אקראי או לפי סדר, והמערכת מסנכרנת את ההתקדמות בזמן אמת.</p><h3>הפתרון הטכנולוגי</h3><p>פיתחתי Web Application מהיר ורספונסיבי שמתעדכן בזמן אמת (Real-time). המערכת יודעת אילו פרקים נקראו ואילו פנויים, ומציגה לכל המשתמשים מד התקדמות משותף.</p><h3>השפעה</h3><p>הפרויקט משמש קהילות וקבוצות לתפילה משותפת, בממשק נקי, מזמין וקל לשימוש ללא צורך בהורדת אפליקציה.</p><div style="margin-top:20px; display:flex; gap:15px; flex-direction: column;"><a href="https://tehilim.aztodev.com" target="_blank" class="button button-primary">למעבר לאתר</a></div>`
            }
        },
        en: {
            textrescuer: {
                title: "Text Rescuer - Chrome Extension",
                content: `<h3>About the Extension</h3><p>Text Rescuer automatically saves everything you type in text fields, forms, and content boxes. If the page closes, the browser crashes, or you hit Back by mistake — open the extension and restore with one click.</p><h3>Pricing & Features</h3><p>First month free. Then: one-time $5. Free: 24-hour save; Pro: 30-day save + Time Machine.</p><h3>Privacy</h3><p>Works on any site; never saves passwords or card numbers. All data stays on your device.</p><div style="margin-top:20px;"><a href="https://chromewebstore.google.com/detail/text-rescuer/fabhaiagejicfjmklneglamgeenpeiln" target="_blank" rel="noopener" class="button button-primary">Get it on Chrome Web Store</a></div>`
            },
            fitime: {
                title: "FiTime - Studio Management System",
                content: `<img src="assets/fitime_app.jpg" alt="FiTime"><h3>Business Solution</h3><p>FiTime enables Pilates and fitness studio owners to manage class schedules, member registration and subscription tracking. Sends reminders and notifications via SMS.</p><h3>Key Features</h3><p>Class schedule management, member registration, subscription tracking. <strong>Smart waitlist</strong> — when a spot opens in a full class, an automatic SMS is sent to the first person waiting in line.</p><h3>Tech</h3><p>Built with Node.js and React for real-time sync.</p><div style="margin-top:20px; display:flex; gap:15px; flex-wrap:wrap;"><a href="https://fitime.co.il" target="_blank" class="button button-primary">Visit Project Website</a><a href="https://github.com/ZionAmar/EasyFit" target="_blank" class="button">View Code on GitHub</a></div>`
            },
            mytor: {
                title: "My Tor — Smart Appointment Management",
                content: `${MYTOR_MOCK_HTML}<h3>Business Solution</h3><p>My Tor is a SaaS platform for appointment-based businesses: salons and studios, clinics, therapists, coaches, beauty, and freelancers. Clients book 24/7 even when you’re closed; owners run calendar, customers, and messaging in one place — no spreadsheets or WhatsApp groups.</p><h3>Key Features</h3><ul><li><strong>Branded app per business</strong> — each owner gets a dedicated client experience: their logo, colors, and personal link; customers book from mobile as if it’s the business’s own app (PWA, no app store required).</li><li><strong>SMS & email reminders</strong> — automatic notifications before appointments to reduce last-minute cancellations and no-shows.</li><li><strong>Smart calendar</strong> — multiple staff, blocks, holidays, and opening hours; clients only see what’s available.</li><li><strong>Packages, messaging & reports</strong> — balance and treatment tracking, client and team communication, waitlists, and summaries to fill the calendar.</li></ul><div style="margin-top:20px;"><a href="https://mytor.pro" target="_blank" rel="noopener" class="button button-primary">Visit My Tor</a></div>`
            },
            workclock: {
                title: "WorkClock Pro - Attendance & Workforce",
                content: `<h3>About the System</h3><p>WorkClock Pro is an attendance and workforce management system. Employees clock in and out; managers get attendance and hour reports.</p><h3>Key Features</h3><p>Digital attendance clock, clock in/out, employee management, reports, Geolocation verification for field workers.</p><h3>Benefits</h3><p>Works on mobile and desktop, no dedicated hardware needed, secure data.</p><div style="margin-top:20px;"><a href="https://workclock.pro" target="_blank" class="button button-primary">Visit Live System</a></div>`
            },
            tasks: {
                title: "Online Contracts - E-signature",
                content: `<h3>About the Project</h3><p>Online contract signing system. Send documents for digital signature and track status.</p><h3>Use Case</h3><p>Sign contracts and agreements online without printing or physical delivery.</p><div style="margin-top:20px;"><a href="https://tasks.aztodev.com" target="_blank" class="button button-primary">Open system</a></div>`
            },
            telemust: {
                title: "Telemust - Telegram Automation & Community Management",
                content: `<img src="assets/telemust_dashboard.jpg" alt="Telemust Dashboard"><h3>The Business Challenge</h3><p>Business owners and community managers on Telegram had to spend many hours a day on manual, repetitive tasks: content forwarding, adding members, and supervising multiple groups. This lack of automation led to wasted time and difficulty in scaling.</p><h3>My Solution: An End-to-End System</h3><p>I independently developed a comprehensive system that provides a 360-degree solution for community management. The system includes a desktop application (Python with Telethon) for member management and a server-side system (Node.js) with a web dashboard for full control over automations.</p><h3>My Role in the Project</h3><p>I was the sole developer responsible for the entire project, from scratch to a live product. This included architecture, Back-end development, Desktop app development, and Front-end development.</p><h3>Result & Impact</h3><p>Telemust is currently live and successfully serves paying customers, saving them an average of 10 hours of work per week and allowing them to grow their communities efficiently. This project is proof of my ability to turn an idea into a profitable tech product.</p><a href="https://telemust.com" target="_blank" class="button button-primary" style="margin-top:20px;">Visit Project Website</a>`
            },
            // New
            chatflow: {
                title: "ChatFlow - Smart WhatsApp Automation",
                content: `<h3>About the Project</h3><p>ChatFlow is a Windows Desktop app I built for WhatsApp business automation. Bulk personalized messaging, group management, smart scheduling and an advanced Anti-Ban system that protects the account.</p><h3>Key Features</h3><p>Bulk messaging to thousands of contacts, automatic group management, scheduled sends, multi-profile support and performance reports.</p><div style="margin-top:20px;"><a href="https://chatflow.aztodev.com" target="_blank" class="button button-primary">Visit Website</a></div>`
            },
            tehilim: {
                title: "Tehillim Click - Social Platform",
                content: `<h3>The Vision</h3><p>To enable large groups of people to read an entire Book of Psalms together in a short time, with real-time synchronization of progress.</p><h3>The Tech Solution</h3><p>I developed a fast, responsive Web Application with real-time updates. The system tracks which chapters are read and which are available, displaying a shared progress bar.</p><h3>Impact</h3><p>The project serves communities for collective prayer with a clean, inviting interface that requires no app download.</p><div style="margin-top:20px; display:flex; gap:15px; flex-direction: column;"><a href="https://tehilim.aztodev.com" target="_blank" class="button button-primary">Visit Website</a></div>`
            }
        }
    };

    let currentLang = 'he';
    let heroTaglineTypeTimer = null;

    const clearHeroTaglineTypewriter = () => {
        if (heroTaglineTypeTimer !== null) {
            window.clearInterval(heroTaglineTypeTimer);
            heroTaglineTypeTimer = null;
        }
    };

    const runHeroTaglineTypewriter = (el, fullText) => {
        if (!el || !fullText) return;
        const typeSpan = el.querySelector('.hero-tagline-type');
        if (!typeSpan) return;

        el.setAttribute('aria-label', fullText);
        clearHeroTaglineTypewriter();

        const cursor = el.querySelector('.hero-tagline-cursor');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reducedMotion) {
            typeSpan.textContent = fullText;
            if (cursor) cursor.classList.add('hero-tagline-cursor--off');
            return;
        }

        typeSpan.textContent = '';
        if (cursor) cursor.classList.remove('hero-tagline-cursor--off');

        const chars = Array.from(fullText);
        let i = 0;
        heroTaglineTypeTimer = window.setInterval(() => {
            if (i >= chars.length) {
                clearHeroTaglineTypewriter();
                return;
            }
            typeSpan.textContent += chars[i];
            i++;
        }, 34);
    };

    const setLanguage = (lang) => {
        currentLang = lang;
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';

        const langData = translations[lang];

        clearHeroTaglineTypewriter();

        // החלפת טקסט רגיל (HTML)
        document.querySelectorAll('[data-lang-key]').forEach(element => {
            if (element.id === 'hero-brand-tagline') return;
            const key = element.getAttribute('data-lang-key');
            if (langData[key]) {
                element.innerHTML = langData[key];
            }
        });

        // החלפת ALT לתמונות
        document.querySelectorAll('[data-lang-alt]').forEach(element => {
            const key = element.getAttribute('data-lang-alt');
            if (langData[key]) {
                element.setAttribute('alt', langData[key]);
            }
        });

        document.querySelectorAll('[data-lang-aria]').forEach(element => {
            const key = element.getAttribute('data-lang-aria');
            if (langData[key]) {
                element.setAttribute('aria-label', langData[key]);
            }
        });

        // עדכון כותרת העמוד והתיאור במטא + OG/Twitter (עקביות מול גוגל ורשתות)
        document.title = langData.meta_title;
        const setMetaContent = (selector, content) => {
            const el = document.querySelector(selector);
            if (el && content) el.setAttribute('content', content);
        };
        setMetaContent('meta[name="description"]', langData.meta_description);
        setMetaContent('meta[property="og:title"]', langData.meta_title);
        setMetaContent('meta[property="og:description"]', langData.meta_description);
        setMetaContent('meta[name="twitter:title"]', langData.meta_title);
        setMetaContent('meta[name="twitter:description"]', langData.meta_description);

        // עדכון קובץ קורות החיים (PDF)
        const cvHref = lang === 'he' ? 'assets/CV-HE.pdf' : 'assets/CV-EN.pdf';
        document.querySelectorAll('#download-cv-button, #download-cv-button-2, #vcard-cv-link').forEach((el) => {
            el.href = cvHref;
        });

        // עדכון placeholder לשדות טופס
        document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
            const key = el.getAttribute('data-lang-placeholder');
            if (langData[key]) el.placeholder = langData[key];
        });

        const heroTagline = document.getElementById('hero-brand-tagline');
        if (heroTagline && langData.hero_brand_tagline) {
            runHeroTaglineTypewriter(heroTagline, langData.hero_brand_tagline);
        }

        updateDiplomaImages();
        updatePortraitImages();
    };

    // --- לוגיקת המודאל (חלון קופץ) עם Focus Trap ---
    const modal = document.getElementById('project-modal');
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        const modalBody = document.getElementById('modal-body');
        const closeModalBtn = modal.querySelector('.close-modal');
        let lastFocusedElement = null;

        const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

        function trapFocus(e) {
            const focusable = Array.from(modalContent.querySelectorAll(FOCUSABLE));
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }

        function openModal(projectId) {
            const project = projectCaseStudies[currentLang][projectId];
            if (!project) return;
            lastFocusedElement = document.activeElement;
            modalBody.innerHTML = `<h2>${project.title}</h2>${project.content}`;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            modal.setAttribute('aria-label', project.title);
            // Focus the close button after render
            requestAnimationFrame(() => closeModalBtn && closeModalBtn.focus());
            document.addEventListener('keydown', trapFocus);
        }

        function closeModal() {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            document.removeEventListener('keydown', trapFocus);
            if (lastFocusedElement) lastFocusedElement.focus();
        }

        const projectsGrid = document.querySelector('.projects-grid, .projects-grid-compact');
        if (projectsGrid) {
            projectsGrid.addEventListener('click', (e) => {
                const card = e.target.closest('[data-project]');
                if (card && card.dataset.project) {
                    e.preventDefault();
                    openModal(card.dataset.project);
                }
            });
            // Keyboard support for project cards
            projectsGrid.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    const card = e.target.closest('[data-project]');
                    if (card && card.dataset.project) {
                        e.preventDefault();
                        openModal(card.dataset.project);
                    }
                }
            });
        }

        closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
        });
    }

    // --- תמונת פרופיל (לחיצה להגדלה) ---
    const portraitModal = document.getElementById('portrait-modal');
    const portraitModalImg = document.getElementById('portrait-modal-img');
    const portraitModalClose = portraitModal && portraitModal.querySelector('.diploma-modal-close');
    let portraitReturnFocus = null;

    function updatePortraitImages() {
        const L = translations[currentLang];
        if (portraitModalImg && L.about_photo_alt) {
            portraitModalImg.alt = L.about_photo_alt;
        }
    }

    function openPortraitModal() {
        if (!portraitModal) return;
        updatePortraitImages();
        portraitReturnFocus = document.activeElement;
        portraitModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => portraitModalClose && portraitModalClose.focus());
    }

    function closePortraitModal() {
        if (!portraitModal || !portraitModal.classList.contains('show')) return;
        portraitModal.classList.remove('show');
        document.body.style.overflow = isAnyModalOpen() ? 'hidden' : '';
        if (portraitReturnFocus && typeof portraitReturnFocus.focus === 'function') portraitReturnFocus.focus();
    }

    document.querySelectorAll('[data-open-portrait]').forEach((btn) => {
        btn.addEventListener('click', openPortraitModal);
    });

    if (portraitModalClose) portraitModalClose.addEventListener('click', closePortraitModal);
    if (portraitModal) {
        portraitModal.addEventListener('click', (e) => {
            if (e.target === portraitModal) closePortraitModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && portraitModal && portraitModal.classList.contains('show')) closePortraitModal();
    });

    // --- דיפלומה (תמונה קטנה לפי שפת האתר, לחיצה להגדלה) ---
    const DIPLOMA_SRC = { he: 'assets/diploma-he.png', en: 'assets/diploma-en.png' };
    const diplomaModal = document.getElementById('diploma-modal');
    const diplomaModalImg = document.getElementById('diploma-modal-img');
    const diplomaInlineImg = document.getElementById('diploma-inline-img');
    const diplomaModalClose = diplomaModal && diplomaModal.querySelector('.diploma-modal-close');
    let diplomaReturnFocus = null;

    function updateDiplomaImages() {
        const src = DIPLOMA_SRC[currentLang] || DIPLOMA_SRC.he;
        const L = translations[currentLang];
        const alt = currentLang === 'en' ? L.diploma_img_alt_en : L.diploma_img_alt_he;
        if (diplomaInlineImg) {
            diplomaInlineImg.src = src;
            diplomaInlineImg.alt = alt;
        }
        if (diplomaModalImg) {
            diplomaModalImg.src = src;
            diplomaModalImg.alt = alt;
        }
    }

    function isAnyModalOpen() {
        const projectModal = document.getElementById('project-modal');
        return (projectModal && projectModal.classList.contains('show'))
            || (portraitModal && portraitModal.classList.contains('show'))
            || (diplomaModal && diplomaModal.classList.contains('show'))
            || (document.getElementById('vcard-modal') && document.getElementById('vcard-modal').classList.contains('show'));
    }

    function openDiplomaModal() {
        if (!diplomaModal) return;
        updateDiplomaImages();
        diplomaReturnFocus = document.activeElement;
        diplomaModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => diplomaModalClose && diplomaModalClose.focus());
    }

    function closeDiplomaModal() {
        if (!diplomaModal || !diplomaModal.classList.contains('show')) return;
        diplomaModal.classList.remove('show');
        document.body.style.overflow = isAnyModalOpen() ? 'hidden' : '';
        if (diplomaReturnFocus && typeof diplomaReturnFocus.focus === 'function') diplomaReturnFocus.focus();
    }

    document.querySelectorAll('[data-open-diploma]').forEach((btn) => {
        btn.addEventListener('click', openDiplomaModal);
    });

    if (diplomaModalClose) diplomaModalClose.addEventListener('click', closeDiplomaModal);
    if (diplomaModal) {
        diplomaModal.addEventListener('click', (e) => {
            if (e.target === diplomaModal) closeDiplomaModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && diplomaModal && diplomaModal.classList.contains('show')) closeDiplomaModal();
    });

    const vcardModal = document.getElementById('vcard-modal');
    const vcardFab = document.getElementById('vcard-fab');
    const vcardCloseBtn = document.getElementById('vcard-modal-close');
    const vcardShareBtn = document.getElementById('vcard-share-btn');
    const vcardToast = document.getElementById('vcard-share-toast');
    let vcardReturnFocus = null;

    function closeVcardModal() {
        if (!vcardModal || !vcardModal.classList.contains('show')) return;
        vcardModal.classList.remove('show');
        if (vcardToast) vcardToast.hidden = true;
        document.body.style.overflow = isAnyModalOpen() ? 'hidden' : '';
        if (vcardReturnFocus && typeof vcardReturnFocus.focus === 'function') vcardReturnFocus.focus();
    }

    function openVcardModal() {
        if (!vcardModal) return;
        vcardReturnFocus = document.activeElement;
        vcardModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => vcardCloseBtn && vcardCloseBtn.focus());
    }

    if (vcardFab) vcardFab.addEventListener('click', openVcardModal);
    if (vcardCloseBtn) vcardCloseBtn.addEventListener('click', closeVcardModal);
    if (vcardModal) {
        vcardModal.addEventListener('click', (e) => {
            if (e.target === vcardModal) closeVcardModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && vcardModal && vcardModal.classList.contains('show')) closeVcardModal();
    });

    if (vcardShareBtn) {
        vcardShareBtn.addEventListener('click', async () => {
            const L = translations[currentLang];
            const url = window.location.href.split(/#/)[0];
            const plain = `${L.vcard_share_text}\n${url}`;
            try {
                if (navigator.share) {
                    await navigator.share({ title: L.vcard_share_title, text: L.vcard_share_text, url });
                } else if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(plain);
                    if (vcardToast) {
                        vcardToast.hidden = false;
                        setTimeout(() => { vcardToast.hidden = true; }, 3500);
                    }
                } else {
                    window.prompt(L.vcard_share_copied, plain);
                }
            } catch (err) {
                if (err && err.name === 'AbortError') return;
                try {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(plain);
                        if (vcardToast) {
                            vcardToast.hidden = false;
                            setTimeout(() => { vcardToast.hidden = true; }, 3500);
                        }
                    }
                } catch (_) { /* ignore */ }
            }
        });
    }

    // --- אנימציות בגלילה (AOS) ---
    AOS.init({ duration: 900, once: true, mirror: false });

    // --- ספירת נתונים ---
    const stats = document.querySelectorAll('.stat-number');
    const animateNumbers = () => {
        stats.forEach(stat => {
            const target = +stat.dataset.target;
            let current = 0;
            const duration = 2000;
            const stepTime = Math.abs(Math.floor(duration / target));

            const updateCount = () => {
                current++;
                stat.textContent = current;
                if (current < target) {
                    setTimeout(updateCount, stepTime);
                } else {
                    stat.textContent = target;
                }
            };
            updateCount();
        });
    };
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        observer.observe(aboutSection);
    }

    // --- מובייל: לוגו בהדר (אייקון + AZToDev) רק אחרי גלילה מעבר לכותרת בדף ---
    const headerBrandMq = window.matchMedia('(max-width: 992px)');
    const mainHeader = document.getElementById('main-header');
    const heroBrandRow = document.querySelector('.hero-brand-row');
    let headerBrandTicking = false;

    const updateHeaderBrandVisibility = () => {
        if (!mainHeader || !heroBrandRow) return;
        if (!headerBrandMq.matches) {
            mainHeader.classList.remove('header-show-brand-text');
            return;
        }
        const navH = mainHeader.offsetHeight || 60;
        const rect = heroBrandRow.getBoundingClientRect();
        const scrolledPastBrand = rect.bottom < navH + 2;
        const brandFullyBelowViewport = rect.top > window.innerHeight - 4;
        if (scrolledPastBrand || brandFullyBelowViewport) {
            mainHeader.classList.add('header-show-brand-text');
        } else {
            mainHeader.classList.remove('header-show-brand-text');
        }
    };

    const scheduleHeaderBrandUpdate = () => {
        if (!mainHeader || !heroBrandRow) return;
        if (headerBrandTicking) return;
        headerBrandTicking = true;
        requestAnimationFrame(() => {
            headerBrandTicking = false;
            updateHeaderBrandVisibility();
        });
    };

    if (mainHeader && heroBrandRow) {
        updateHeaderBrandVisibility();
        window.addEventListener('scroll', scheduleHeaderBrandUpdate, { passive: true });
        window.addEventListener('resize', scheduleHeaderBrandUpdate, { passive: true });
        headerBrandMq.addEventListener('change', scheduleHeaderBrandUpdate);
    }

    // --- גלילה חלקה + כפתור חזרה למיקום קודם ---
    const scrollBackFab = document.getElementById('scroll-back-fab');
    const SCROLL_BACK_MIN_DELTA = 100;
    let scrollRestoreY = null;
    let scrollBackArmProximity = false;

    function hideScrollBackFab() {
        if (!scrollBackFab) return;
        scrollBackFab.classList.remove('visible');
        scrollBackFab.setAttribute('aria-hidden', 'true');
        scrollRestoreY = null;
        scrollBackArmProximity = false;
    }

    function showScrollBackFab() {
        if (!scrollBackFab || scrollRestoreY === null) return;
        scrollBackFab.classList.add('visible');
        scrollBackFab.setAttribute('aria-hidden', 'false');
        scrollBackArmProximity = false;
        window.setTimeout(() => {
            scrollBackArmProximity = true;
        }, 450);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const targetSection = document.querySelector(targetId);
            if (!targetSection) return;

            e.preventDefault();

            const beforeY = window.scrollY;
            if (scrollBackFab) {
                scrollBackFab.classList.remove('visible');
                scrollBackFab.setAttribute('aria-hidden', 'true');
            }
            scrollBackArmProximity = false;

            const header = document.getElementById('main-header');
            const navH = header ? header.offsetHeight : 72;
            const rect = targetSection.getBoundingClientRect();
            const destY = Math.max(0, rect.top + window.scrollY - navH - 8);

            if (Math.abs(destY - beforeY) < SCROLL_BACK_MIN_DELTA) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                return;
            }

            scrollRestoreY = beforeY;
            targetSection.scrollIntoView({ behavior: 'smooth' });
            window.setTimeout(() => {
                if (scrollRestoreY !== null) showScrollBackFab();
            }, 560);
        });
    });

    if (scrollBackFab) {
        scrollBackFab.addEventListener('click', () => {
            if (scrollRestoreY === null) return;
            const y = scrollRestoreY;
            hideScrollBackFab();
            window.scrollTo({ top: y, behavior: 'smooth' });
        });
    }

    let scrollBackProximityLock = false;
    window.addEventListener('scroll', () => {
        if (scrollRestoreY === null || !scrollBackArmProximity) return;
        if (scrollBackProximityLock) return;
        scrollBackProximityLock = true;
        requestAnimationFrame(() => {
            scrollBackProximityLock = false;
            if (scrollRestoreY === null || !scrollBackArmProximity) return;
            if (Math.abs(window.scrollY - scrollRestoreY) < 72) {
                hideScrollBackFab();
            }
        });
    }, { passive: true });

    // --- הדגשת הניווט בגלילה + Scroll Progress + Floating CTA ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.desktop-nav a');
    const scrollProgressBar = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Scroll progress bar
        if (scrollProgressBar) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
            scrollProgressBar.style.width = pct + '%';
        }

        // Active nav highlight
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (window.scrollY >= sectionTop - 150 && window.scrollY < sectionBottom - 150) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${currentSectionId}`) {
                a.classList.add('active');
            }
        });
    });

    // --- החלפת שפה ---
    const langToggles = document.querySelectorAll('#lang-toggle, #mobile-lang-toggle');

    langToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const newLang = currentLang === 'he' ? 'en' : 'he';
            const url = new URL(window.location);
            url.searchParams.set('lang', newLang);
            window.history.pushState({}, '', url);
            setLanguage(newLang);

            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // --- תפריט נייד ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMobileMenu = document.getElementById('close-mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeMobileMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- תצוגת מקום עבודה בריחוף (ציר זמן) ---
    const WORKPLACES = {
        aztodev: {
            img: 'assets/workplaces/aztodev.png',
            logo: true,
            altHe: 'AZToDev — יזמות ופיתוח',
            altEn: 'AZToDev — entrepreneurship & development'
        },
        kinneret: {
            img: 'assets/workplaces/kinneret.png',
            logo: true,
            altHe: 'המכללה הטכנולוגית כנרת',
            altEn: 'Kinneret Technological College'
        },
        zefat: {
            img: 'assets/workplaces/zefat.png',
            logo: true,
            altHe: 'צפת · מחנה שמשון',
            altEn: 'Zefat · Shimshon camp'
        },
        idf: {
            img: 'assets/workplaces/idf.jpg',
            logo: false,
            altHe: 'צה״ל — מחנה שמשון',
            altEn: 'IDF — Shimshon camp'
        },
        cyber: {
            img: 'assets/workplaces/cyber.png',
            logo: true,
            altHe: 'המרכז לחינוך סייבר',
            altEn: 'Cyber Education Center'
        },
        tutor: {
            img: 'assets/workplaces/tutor.jpg',
            logo: false,
            altHe: 'הוראה פרטית בפיתוח תוכנה',
            altEn: 'Private software tutoring'
        },
        field: {
            img: 'assets/workplaces/field.jpg',
            logo: false,
            altHe: 'שיפוץ ואחזקה',
            altEn: 'Renovation & maintenance'
        }
    };

    const workplacePreview = document.getElementById('workplace-preview');
    const workplacePreviewImg = document.getElementById('workplace-preview-img');

    if (workplacePreview && workplacePreviewImg && window.matchMedia('(hover: hover)').matches) {
        let workplaceHideTimer = null;

        const positionWorkplacePreview = (clientX, clientY) => {
            const pad = 18;
            const rect = workplacePreview.getBoundingClientRect();
            const w = rect.width || 248;
            const h = rect.height || 170;
            let x = clientX + pad;
            let y = clientY + pad;
            if (x + w > window.innerWidth - pad) x = clientX - w - pad;
            if (y + h > window.innerHeight - pad) y = clientY - h - pad;
            x = Math.max(pad, Math.min(x, window.innerWidth - w - pad));
            y = Math.max(pad, Math.min(y, window.innerHeight - h - pad));
            workplacePreview.style.left = `${x}px`;
            workplacePreview.style.top = `${y}px`;
        };

        const showWorkplacePreview = (id, clientX, clientY) => {
            const wp = WORKPLACES[id];
            if (!wp) return;
            clearTimeout(workplaceHideTimer);
            const L = translations[currentLang];
            workplacePreviewImg.src = wp.img;
            workplacePreviewImg.alt = currentLang === 'en' ? wp.altEn : wp.altHe;
            workplacePreview.classList.toggle('is-logo', !!wp.logo);
            workplacePreview.classList.toggle('is-logo-dark', !!wp.logoDark);
            workplacePreview.hidden = false;
            workplacePreview.setAttribute('aria-hidden', 'false');
            requestAnimationFrame(() => {
                workplacePreview.classList.add('is-visible');
                positionWorkplacePreview(clientX, clientY);
            });
        };

        const hideWorkplacePreview = () => {
            workplaceHideTimer = setTimeout(() => {
                workplacePreview.classList.remove('is-visible');
                workplacePreview.hidden = true;
                workplacePreview.setAttribute('aria-hidden', 'true');
            }, 60);
        };

        document.querySelectorAll('.timeline-item[data-workplace]').forEach((item) => {
            item.addEventListener('mouseenter', (e) => {
                showWorkplacePreview(item.dataset.workplace, e.clientX, e.clientY);
            });
            item.addEventListener('mousemove', (e) => {
                if (workplacePreview.classList.contains('is-visible')) {
                    positionWorkplacePreview(e.clientX, e.clientY);
                }
            });
            item.addEventListener('mouseleave', hideWorkplacePreview);
        });
    }

    // --- אתחול שפה ---
    const urlParams = new URLSearchParams(window.location.search);
    const initialLang = urlParams.get('lang') === 'en' ? 'en' : 'he';
    setLanguage(initialLang);

    // --- Contact Form ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const submitBtn = document.getElementById('form-submit-btn');
        const successMsg = document.getElementById('form-success');
        const errorGeneral = document.getElementById('form-error-general');

        function setFieldError(fieldId, errorId, msg) {
            const field = document.getElementById(fieldId);
            const errEl = document.getElementById(errorId);
            if (field) field.classList.toggle('invalid', !!msg);
            if (errEl) errEl.textContent = msg || '';
        }

        function validateForm(name, email, message) {
            const L = translations[currentLang];
            let valid = true;
            if (!name || name.trim().length < 2) {
                setFieldError('contact-name', 'error-name', L.form_err_name);
                valid = false;
            } else { setFieldError('contact-name', 'error-name', ''); }

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setFieldError('contact-email', 'error-email', L.form_err_email);
                valid = false;
            } else { setFieldError('contact-email', 'error-email', ''); }

            if (!message || message.trim().length < 5) {
                setFieldError('contact-message', 'error-message', L.form_err_message);
                valid = false;
            } else { setFieldError('contact-message', 'error-message', ''); }

            return valid;
        }

        const submitIcon = document.getElementById('form-submit-icon');
        const submitSpinner = document.getElementById('form-submit-spinner');

        function setSubmitLoading(loading) {
            submitBtn.disabled = loading;
            if (submitIcon) submitIcon.hidden = loading;
            if (submitSpinner) submitSpinner.hidden = !loading;
        }

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Honeypot check — if filled, silently reject
            const honeypot = document.getElementById('contact-honeypot');
            if (honeypot && honeypot.value) return;

            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;

            if (!validateForm(name, email, message)) return;

            setSubmitLoading(true);
            successMsg.hidden = true;
            errorGeneral.hidden = true;

            try {
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                });
                if (res.ok) {
                    successMsg.hidden = false;
                    contactForm.reset();
                    // Scroll success message into view
                    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    errorGeneral.hidden = false;
                }
            } catch {
                errorGeneral.hidden = false;
            } finally {
                setSubmitLoading(false);
            }
        });
    }

    // ========================================================
    // ============== סיכום ביקור בעזיבת הדף (מייל) ============
    // ========================================================
    const sessionClicks = [];
    let sessionReportSent = false;

    function sessionLinkZone(el) {
        if (!el || !el.closest) return 'בדף';
        if (el.closest('#mobile-menu')) return 'תפריט מובייל';
        if (el.closest('#main-header')) return 'הדר';
        if (el.closest('.hero-pills')) return 'קפסולות Hero';
        if (el.closest('footer')) return 'פוטר';
        if (el.closest('#hero')) return 'אזור Hero';
        if (el.closest('#contact-form')) return 'טופס יצירת קשר';
        if (el.closest('#vcard-modal')) return 'כרטיס ביקור (חלון)';
        if (el.closest('#project-modal')) return 'מודאל פרויקט';
        return 'תוכן ראשי';
    }

    function pushSessionClick(what, where, label) {
        sessionClicks.push({
            sec: Math.round((Date.now() - sessionPageLoadMs) / 1000),
            what: String(what).slice(0, 80),
            where: String(where).slice(0, 220),
            label: String(label).slice(0, 160)
        });
    }

    document.addEventListener('click', (e) => {
        const proj = e.target.closest('[data-project]');
        if (proj && proj.dataset.project) {
            pushSessionClick('פתיחת פרויקט (מודאל)', proj.dataset.project, proj.getAttribute('aria-label') || proj.dataset.project);
            return;
        }

        if (e.target.closest('#vcard-fab')) {
            pushSessionClick('כפתור', '#vcard-fab', 'כרטיס ביקור');
            return;
        }

        const scrollBack = e.target.closest('#scroll-back-fab');
        if (scrollBack && scrollBack.getAttribute('aria-hidden') !== 'true') {
            pushSessionClick('כפתור', '#scroll-back-fab', 'חזרה בגלילה');
            return;
        }

        if (e.target.closest('#lang-toggle, #mobile-lang-toggle')) {
            const el = e.target.closest('#lang-toggle, #mobile-lang-toggle');
            pushSessionClick('כפתור', `#${el.id}`, 'החלפת שפה');
            return;
        }

        if (e.target.closest('#mobile-menu-toggle')) {
            pushSessionClick('כפתור', '#mobile-menu-toggle', 'פתיחת תפריט מובייל');
            return;
        }

        if (e.target.closest('#close-mobile-menu')) {
            pushSessionClick('כפתור', '#close-mobile-menu', 'סגירת תפריט מובייל');
            return;
        }

        if (e.target.closest('#vcard-share-btn')) {
            pushSessionClick('כפתור', '#vcard-share-btn', 'שיתוף כרטיס ביקור');
            return;
        }

        const a = e.target.closest('a[href]');
        if (!a) return;
        const href = a.getAttribute('href') || '';
        if (!href || href === '#' || href.toLowerCase().startsWith('javascript:')) return;

        const zone = sessionLinkZone(a);
        const label = (a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100)
            || a.getAttribute('aria-label') || '';

        if (a.hasAttribute('download')) {
            pushSessionClick(`הורדה · ${zone}`, href, label || 'הורדת קובץ');
            return;
        }
        if (href.startsWith('#')) {
            pushSessionClick(`לינק פנימי · ${zone}`, href, label || href);
            return;
        }
        if (href.startsWith('mailto:') || href.startsWith('tel:')) {
            pushSessionClick(`יצירת קשר · ${zone}`, href, label || href);
            return;
        }
        pushSessionClick(`לינק חיצוני · ${zone}`, href, label || href);
    }, true);

    const contactFormForSession = document.getElementById('contact-form');
    if (contactFormForSession) {
        contactFormForSession.addEventListener('submit', () => {
            pushSessionClick('טופס יצירת קשר', '#contact-form', 'שליחת טופס');
        });
    }

    function flushSessionReport(leaveTrigger) {
        if (sessionReportSent) return;
        sessionReportSent = true;
        const trigger = leaveTrigger === 'visibility' ? 'visibility' : 'pagehide';
        const payload = {
            lang: document.documentElement.lang || 'he',
            page: `${window.location.pathname || ''}`.slice(0, 100),
            sessionSec: Math.round((Date.now() - sessionPageLoadMs) / 1000),
            clicks: sessionClicks.slice(0, 80),
            leaveTrigger: trigger,
            clientMeta: {
                pathname: `${window.location.pathname || ''}${window.location.search || ''}`.slice(0, 220),
                referrer: (document.referrer || '').slice(0, 450),
                timezone: (Intl.DateTimeFormat().resolvedOptions().timeZone || '').slice(0, 90),
                screen: `${window.screen.width}x${window.screen.height}`,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                pixelRatio: window.devicePixelRatio || 1,
                hwConcurrency: typeof navigator.hardwareConcurrency === 'number' ? navigator.hardwareConcurrency : '',
                deviceMemory: typeof navigator.deviceMemory === 'number' ? navigator.deviceMemory : '',
                touch: 'ontouchstart' in window,
                online: navigator.onLine
            }
        };
        const body = JSON.stringify(payload);
        try {
            const blob = new Blob([body], { type: 'application/json' });
            const sent = typeof navigator.sendBeacon === 'function'
                && navigator.sendBeacon('/api/session-analytics', blob);
            if (!sent) {
                fetch('/api/session-analytics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body,
                    keepalive: true
                }).catch(() => { });
            }
        } catch {
            fetch('/api/session-analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body,
                keepalive: true
            }).catch(() => { });
        }
    }

    window.addEventListener('pagehide', () => flushSessionReport('pagehide'));
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') flushSessionReport('visibility');
    });
});