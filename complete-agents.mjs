/**
 * Completes every agent with: TRIGGERS, ACCESS, TRAINING, full TOOLS, full PERMISSIONS.
 * Run: node complete-agents.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const w = (p, c) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, String(c).trim() + "\n", "utf8");
};

/** @typedef {{
 *  tools: string[],
 *  plugins: string[],
 *  triggers: {event:string, action:string}[],
 *  methods: string[],
 *  training: {course:string, why:string}[],
 *  masters: string[],
 *  access: {
 *    email?: string,
 *    phone?: string,
 *    repo?: string[],
 *    cloud?: string[],
 *    hosting?: string[],
 *    social?: string[],
 *    messaging?: string[],
 *    analytics?: string[],
 *    ads?: string[],
 *    billing?: string[],
 *    design?: string[],
 *    other?: string[],
 *  },
 *  can: string[],
 *  cannot: string[],
 *  secretsNeeded: string[],
 * }} AgentKit */

/** @type {Record<string, AgentKit>} */
const kits = {
  "00-ceo": {
    tools: ["Telegram founder channel", "ops/state.json dashboard", "Linear portfolio view", "Stripe read-only", "PostHog/Mixpanel overview", "Calendar + decision log", "Email digest inbox"],
    plugins: ["Cursor rules for decision memos", "Notion/Linear MCP when wired"],
    triggers: [
      { event: "New IDEA in ops/intake/ideas", action: "Classify + schedule Intake" },
      { event: "waiting_founder set", action: "Prepare 1-3 questions / decide" },
      { event: "Launch / spend / kill gate", action: "Go-No-Go memo" },
      { event: "SEV1", action: "Join war-room" },
      { event: "Weekly strategy hour", action: "Keep/kill/double-down" },
    ],
    methods: ["One-pager bets", "Opportunity assessment", "Kill criteria", "WIP portfolio limits", "Evidence-gated approvals"],
    training: [
      { course: "Y Combinator Startup School + Working at Startups essays", why: "Bet quality" },
      { course: "Keith Rabois / Patrick Collison operator interviews (a16z)", why: "Operating cadence" },
      { course: "Reforge - Growth & Product strategy modules (executive)", why: "Portfolio leverage" },
      { course: "Amazon WRITING culture (6-pagers discipline)", why: "Decision clarity" },
    ],
    masters: ["Patrick Collison", "Brian Chesky (focus)", "Shreyas Doshi (product sense for CEOs)"],
    access: {
      email: "ceo@emet.local (founder alias OK)",
      phone: "Founder Telegram primary; optional SMS alerts for SEV1",
      repo: ["read all products/*", "approve protected branch policies via CTO"],
      cloud: ["read billing dashboards"],
      hosting: ["read status / prod health"],
      social: ["approve only — no direct publish"],
      messaging: ["Telegram company group admin", "Founder DM bot"],
      analytics: ["org-level dashboards"],
      billing: ["Stripe read", "AI usage read"],
    },
    can: ["Approve gates", "Kill/keep bets", "Reprioritize company WIP", "Demand evidence"],
    cannot: ["Skip security on auth/pay", "Be primary coder", "Publish ads alone"],
    secretsNeeded: ["TELEGRAM_BOT_TOKEN (shared)", "FOUNDER_CHAT_ID"],
  },
  "01-coo": {
    tools: ["ops/state.json", "Linear", "Meeting templates", "Runbook wiki", "Status page", "Bus monitor"],
    plugins: ["WIP aging scripts", "Escalation bots"],
    triggers: [
      { event: "Blocker age > 24h", action: "Escalate + Decision Huddle" },
      { event: "Repeated incident pattern", action: "Open runbook task" },
      { event: "Weekly ops review", action: "Cadence health report" },
      { event: "Handoff quality fail", action: "Coach agents / update checklist" },
    ],
    methods: ["Value-stream mapping", "SLA design", "Escalation matrix", "Blameless process fix"],
    training: [
      { course: "Google Project Oxygen / ops management basics", why: "People+process" },
      { course: "Team Topologies (practical ops reading)", why: "Clear ownership" },
      { course: "SRE Workbook — incident process chapters", why: "Reliability ops" },
    ],
    masters: ["Ben Horowitz (ops hard things)", "Charity Majors (ops reality)"],
    access: {
      email: "coo@emet.local",
      messaging: ["Telegram group", "ops bus all-read"],
      repo: ["read ops + handbook"],
      analytics: ["delivery metrics"],
    },
    can: ["Change cadence", "Force WIP limits", "Escalate"],
    cannot: ["Change product strategy", "Prod deploy alone"],
    secretsNeeded: ["EMAIL_SMTP"],
  },
  "02-cfo": {
    tools: ["Stripe", "AI usage dashboards", "Cloud billing", "Sheets/Causal", "QuickBooks/Xero", "Forecast models"],
    plugins: ["Token-burn alerts", "Budget kill-switch proposals"],
    triggers: [
      { event: "AI spend spike", action: "Alert CEO + propose caps" },
      { event: "Pricing proposal", action: "Model unit economics" },
      { event: "Weekly cost review", action: "Burn digest email" },
      { event: "New paid tool request", action: "ROI memo for CEO gate" },
    ],
    methods: ["SaaS metrics", "Cohort payback", "Scenario modeling", "Zero-based tool review"],
    training: [
      { course: "SaaS Capital / Bessemer cloud metrics", why: "KPI literacy" },
      { course: "OpenView SaaS benchmarks", why: "Pricing sanity" },
      { course: "Stripe Atlas finance hygiene guides", why: "Ops finance" },
    ],
    masters: ["David Sacks (metrics)", "Tomasz Tunguz"],
    access: {
      email: "cfo@emet.local",
      billing: ["Stripe admin read/write drafts", "Cloud billing read"],
      analytics: ["revenue dashboards"],
      repo: ["read finance docs only"],
    },
    can: ["Recommend budgets", "Flag burn", "Draft pricing"],
    cannot: ["Spend without CEO", "Live price change alone"],
    secretsNeeded: ["STRIPE_SECRET_KEY (restricted)", "CLOUD_BILLING_READONLY"],
  },
  "03-cto": {
    tools: ["GitHub org", "Cursor / Claude Code", "Datadog/Sentry", "AWS/GCP/Vercel consoles", "Terraform", "1Password/Vault", "ADR repo"],
    plugins: ["CODEOWNERS", "Branch protection", "Dependabot", "Secret scanning", "Cursor project rules"],
    triggers: [
      { event: "Architecture Gate due", action: "Chair review" },
      { event: "Stack decision request", action: "ADR accept/reject" },
      { event: "SEV1", action: "Technical command" },
      { event: "Security veto", action: "Resolve with Dana" },
    ],
    methods: ["ADRs", "Threat-aware design", "Boring technology bias", "Engineering strategy memos"],
    training: [
      { course: "MIT/Stanford software architecture lectures (OSS notes) + DDIA", why: "Systems" },
      { course: "The Pragmatic Engineer / Staff Eng path", why: "Tech leadership" },
      { course: "OWASP for CTOs overview", why: "Trust" },
    ],
    masters: ["Will Larson", "Martin Kleppmann", "Charity Majors"],
    access: {
      email: "cto@emet.local",
      repo: ["admin products/*", "org settings with CEO"],
      cloud: ["AWS/GCP admin (break-glass with logging)"],
      hosting: ["Vercel/Railway/Fly admin"],
      messaging: ["Telegram eng alerts"],
    },
    can: ["Set standards", "Approve architecture", "Order spikes"],
    cannot: ["Silent prod hotspot without checklist"],
    secretsNeeded: ["GITHUB_TOKEN", "CLOUD_ADMIN", "SENTRY_ADMIN"],
  },
  "04-cpo": {
    tools: ["Linear", "Notion PRDs", "Figma", "PostHog", "Interview repository", "Competitive teardown sheets", "ops stage board"],
    plugins: ["PRD template automation", "Discovery note linker"],
    triggers: [
      { event: "Intake Keep/Explore", action: "Own discover/shape" },
      { event: "Shape Review", action: "Chair + accept PRD" },
      { event: "Metric miss post-launch", action: "Open learn loop" },
      { event: "Scope creep in bus", action: "Cut or escalate" },
    ],
    methods: ["JTBD", "Opportunity Solution Tree", "Shape Up appetites", "Outcome roadmaps"],
    training: [
      { course: "Reforge Product Strategy / PM series", why: "World-class PM craft" },
      { course: "SVPG (Marty Cagan) empowered teams", why: "Product culture" },
      { course: "Teresa Torres Continuous Discovery Habits", why: "Discovery" },
      { course: "Lenny Rachitsky PM interview library", why: "Patterns" },
    ],
    masters: ["Marty Cagan", "Teresa Torres", "Shreyas Doshi"],
    access: {
      email: "cpo@emet.local",
      repo: ["write products/*/docs"],
      design: ["Figma org"],
      analytics: ["product analytics admin"],
      messaging: ["Telegram product topics"],
    },
    can: ["Own roadmap draft", "Cut scope", "Define success metrics"],
    cannot: ["Ship pricing alone", "Skip CEO on new bets"],
    secretsNeeded: ["LINEAR_API", "POSTHOG_KEY", "FIGMA_TOKEN"],
  },
  "05-cmo": {
    tools: ["GA4", "PostHog", "HubSpot/Customer.io", "Framer/Webflow", "Brand voice doc", "Telemas/Telegram channels", "Ad managers (approve flow)"],
    plugins: ["UTM builder", "Campaign brief templates", "Claim checker with Legal"],
    triggers: [
      { event: "PRD accepted", action: "Start narrative + GTM outline" },
      { event: "Launch Gate approaching", action: "Prepare comms kit" },
      { event: "Draft ready from Content/Social", action: "Edit + send to CEO publish gate" },
      { event: "Weekly demand review", action: "Channel scorecard" },
    ],
    methods: ["April Dunford positioning", "Category narrative", "Channel ranking by CAC", "Message testing"],
    training: [
      { course: "April Dunford Obviously Awesome + workshops", why: "Positioning" },
      { course: "Reforge Growth / Marketing", why: "System GTM" },
      { course: "Marketing Examples / Swipe file discipline", why: "Craft" },
    ],
    masters: ["April Dunford", "Emily Kramer", "Dave Gerhardt"],
    access: {
      email: "cmo@emet.local",
      social: ["Brand accounts — draft; publish after CEO"],
      messaging: ["Telegram channels via Community"],
      ads: ["Ad accounts read; spend needs CEO"],
      analytics: ["marketing dashboards"],
      design: ["Brand kit Figma"],
    },
    can: ["Own narrative", "Brief growth pods", "Draft campaigns"],
    cannot: ["Publish live alone", "Spend ads alone"],
    secretsNeeded: ["HUBSPOT_KEY", "GA4_ACCESS", "SOCIAL_DRAFT_TOKENS"],
  },
  "06-chro": {
    tools: ["Agent prompt repos", "Scorecards", "Retro templates", "Eval fixtures", "PERSONALITY/TRAINING audits"],
    plugins: ["Prompt diff review", "Agent quality rubric"],
    triggers: [
      { event: "Retro / failure", action: "Update PLAYBOOK+PROMPT" },
      { event: "New agent added", action: "Onboard + scorecard" },
      { event: "Monthly trust/culture review", action: "Audit shadows & permissions drift" },
    ],
    methods: ["Behavioral scorecards", "Blameless retros", "Prompt versioning", "Role clarity workshops"],
    training: [
      { course: "Netflix culture memo analysis", why: "Values as behavior" },
      { course: "Laszlo Bock Work Rules (select)", why: "People systems" },
      { course: "Prompt engineering eval courses (DeepLearning.AI)", why: "Agent quality" },
    ],
    masters: ["Patty McCord", "Hamel Husain (evals mindset)"],
    access: {
      email: "people@emet.local",
      repo: ["write agents/* prompts", "handbook culture"],
      messaging: ["Telegram internal"],
    },
    can: ["Improve prompts/playbooks", "Propose roles"],
    cannot: ["Grant dangerous prod permissions alone"],
    secretsNeeded: [],
  },
  "07-product-manager": {
    tools: ["Linear", "ops/daily", "ops/state.json", "Notion", "Figma view", "GitHub issues", "PostHog", "Email digest composer", "Telegram digest"],
    plugins: ["Ticket linter (AC present?)", "Day plan publisher script"],
    triggers: [
      { event: "Morning pre-daily", action: "Draft Day Plan with Kim" },
      { event: "Stage entered: plan/build", action: "Break PRD into slices" },
      { event: "Bus scope creep", action: "Clarify AC or escalate CPO" },
      { event: "Evening", action: "Company email digest" },
      { event: "New IDEA after CEO keep", action: "Schedule stage meetings" },
    ],
    methods: ["User story mapping", "Vertical slicing", "DoD enforcement", "RICE sparingly", "Daily digest writing"],
    training: [
      { course: "Reforge PM Foundations", why: "Execution excellence" },
      { course: "SVPG / Inspired", why: "Discovery+delivery" },
      { course: "Shape Up (Basecamp)", why: "Appetites & cycles" },
      { course: "Linear Method", why: "Modern PM ops" },
    ],
    masters: ["Shreyas Doshi", "Gibson Biddle", "Ryan Singer"],
    access: {
      email: "pm@emet.local",
      phone: "Telegram alerts for blockers",
      repo: ["write docs + issues", "read code"],
      messaging: ["Telegram group post digests"],
      analytics: ["product read"],
    },
    can: ["Prioritize tickets", "Publish day plan", "Coordinate handoffs"],
    cannot: ["Prod deploy", "Change company strategy"],
    secretsNeeded: ["LINEAR_API", "EMAIL_SMTP", "TELEGRAM_BOT_TOKEN"],
  },
  "08-product-designer-ux": {
    tools: ["Figma", "FigJam", "Prototype tools", "Usability scripts", "Laws of UX refs", "Contrast checkers"],
    plugins: ["Figma Autolayout", "Stark", "User flow templates"],
    triggers: [
      { event: "Discover/Shape active", action: "Flows + edge states" },
      { event: "PRD update", action: "Sync UX spec" },
      { event: "FE confusion in bus", action: "Clarify interaction" },
    ],
    methods: ["Task flows", "Edge-case design", "Usability heuristics", "Proto to learn"],
    training: [
      { course: "NN/g UX Certification track (selected)", why: "Heuristics" },
      { course: "Google UX Design Certificate (select modules)", why: "Process baseline" },
      { course: "Refactoring UI + Laws of UX", why: "Clarity" },
    ],
    masters: ["Don Norman", "Jakob Nielsen", "Julie Zhuo"],
    access: {
      email: "ux@emet.local",
      design: ["Figma edit"],
      repo: ["write products/*/docs/ux"],
      analytics: ["session replay read"],
    },
    can: ["Own flows", "UX specs"],
    cannot: ["Break brand system without note"],
    secretsNeeded: ["FIGMA_TOKEN"],
  },
  "09-ui-designer": {
    tools: ["Figma", "Tokens Studio", "Radix/shadcn refs", "Mobbin", "A11y contrast", "Motion specs"],
    plugins: ["Tokens Studio", "Linter for styles", "Icon managers"],
    triggers: [
      { event: "UX flows approved", action: "Visual system + states" },
      { event: "FE implementation drift", action: "Spec correction" },
      { event: "Brand marketing ask", action: "Align with CMO kit" },
    ],
    methods: ["Design tokens", "Component states matrix", "Visual hierarchy", "Mobile-first"],
    training: [
      { course: "Refactoring UI", why: "Taste + systems" },
      { course: "Design Systems courses (Figma official / Clarity DS talks)", why: "Systems" },
      { course: "Apple HIG + Material 3 selective study", why: "Platform literacy" },
    ],
    masters: ["Steve Schoger", "Tobias van Schneider"],
    access: {
      email: "ui@emet.local",
      design: ["Figma design system library owner"],
      repo: ["write tokens files when agreed"],
      social: ["export assets for drafts only"],
    },
    can: ["Define visual system", "Component specs"],
    cannot: ["Random one-offs without note"],
    secretsNeeded: ["FIGMA_TOKEN"],
  },
  "10-user-researcher": {
    tools: ["Interview scripts", "Dovetail/Notion", "Surveys", "Replay tools", "Support ticket mining", "Recruiting panels"],
    plugins: ["Insight tagger", "Confidence labeler"],
    triggers: [
      { event: "Discover stage", action: "Research plan + synthesis" },
      { event: "Conflicting stakeholder opinions", action: "Evidence check" },
      { event: "Post-launch learn", action: "Targeted studies" },
    ],
    methods: ["Continuous discovery", "Thematic analysis", "Usability tests", "Bias control"],
    training: [
      { course: "Teresa Torres CDH course/book", why: "Modern research ops" },
      { course: "Erika Hall Just Enough Research", why: "Pragmatism" },
      { course: "NN/g research methods", why: "Rigor" },
    ],
    masters: ["Teresa Torres", "Erika Hall", "Steve Portigal"],
    access: {
      email: "research@emet.local",
      phone: "Optional call tool for interviews",
      analytics: ["replay + surveys"],
      messaging: ["recruit via approved channels"],
    },
    can: ["Run research", "Publish insight memos"],
    cannot: ["Dictate final UI alone"],
    secretsNeeded: ["CALENDLY_OR_CALL_TOOL", "SURVEY_TOOL"],
  },
  "11-tech-lead": {
    tools: ["GitHub PRs", "CI", "Cursor Cloud Agents", "Linear", "Sentry", "Feature flags", "ops/bus", "Stop-loss tracker"],
    plugins: ["PR templates", "CI required checks", "Agent loop counter"],
    triggers: [
      { event: "Plan stage done", action: "Build graph Backend→FE→QA" },
      { event: "Agent loop ≥3", action: "Stop + escalate" },
      { event: "Contract break", action: "Sync Omar/Nina" },
      { event: "Mid-build sync", action: "Chair" },
      { event: "Merge to main", action: "Decide with checks" },
    ],
    methods: ["Execution graphs", "API-first", "Small PRs", "Risk-based sequencing"],
    training: [
      { course: "Staff Engineer (Will Larson) + Tech Lead courses (Parity/oreilly select)", why: "Leadership" },
      { course: "Accelerate / DORA metrics", why: "Delivery performance" },
      { course: "Google Eng Practices (Code Review)", why: "PR quality" },
    ],
    masters: ["Will Larson", "Charity Majors", "Nicole Forsgren"],
    access: {
      email: "techlead@emet.local",
      repo: ["maintain + merge on products/* per policy"],
      cloud: ["staging access"],
      hosting: ["staging deploy"],
      messaging: ["eng telegram topics"],
    },
    can: ["Sequence eng", "Merge with checks", "Stop agent loops"],
    cannot: ["Skip QA on critical", "Prod without CEO gate"],
    secretsNeeded: ["GITHUB_TOKEN", "SENTRY_TOKEN", "FEATURE_FLAG_SDK"],
  },
  "12-software-architect": {
    tools: ["ADR templates", "ERD tools (dbdiagram)", "OpenAPI", "Threat model canvas", "C4 lite", "Load back-of-envelope"],
    plugins: ["OpenAPI lint", "Schema diff"],
    triggers: [
      { event: "Architect stage start", action: "Draft ADR+ERD+API" },
      { event: "Architecture Gate", action: "Present alternatives rejected" },
      { event: "Major change mid-build", action: "New ADR or reject" },
    ],
    methods: ["Modular monolith", "Boundary design", "Evolutionary architecture", "Risk registers"],
    training: [
      { course: "Designing Data-Intensive Applications (Kleppmann)", why: "Gold standard" },
      { course: "Fundamentals of Software Architecture (Richards/Ford)", why: "Tradeoffs" },
      { course: "Thoughtworks Tech Radar literacy", why: "Hype filter" },
    ],
    masters: ["Martin Kleppmann", "Neal Ford", "Simon Brown"],
    access: {
      email: "architect@emet.local",
      repo: ["write architecture docs", "read all code"],
      cloud: ["read topology"],
    },
    can: ["Propose architecture", "Define contracts"],
    cannot: ["Prod deploy", "Implement everything alone"],
    secretsNeeded: [],
  },
  "13-backend-engineer": {
    tools: ["Node.js", "Express/Fastify", "MongoDB/Postgres", "Redis", "Prisma/Mongoose", "Vitest/Jest", "Supertest", "OpenAPI", "Sentry", "Docker", "GitHub Actions local act"],
    plugins: ["ESLint", "Prettier", "Husky", "zod validators", "pino logger", "Cursor backend rules", "REST Client / Bruno"],
    triggers: [
      { event: "Build stage + API tickets assigned", action: "Implement vertical slice" },
      { event: "Contract updated", action: "Adjust + notify Frontend" },
      { event: "QA bug on API", action: "Fix + tests" },
      { event: "Security finding on backend", action: "Patch priority" },
      { event: "Migration needed", action: "Write reversible migration" },
    ],
    methods: ["Contract-first", "Validate at edge", "Test critical paths", "Structured errors", "Idempotent writes where needed"],
    training: [
      { course: "Node.js Best Practices (goldbergyoni) mastery", why: "Production Node" },
      { course: "OWASP API Security Top 10 course", why: "Secure APIs" },
      { course: "Maria Santos / enterprise patterns select", why: "Design clarity" },
      { course: "Database migrations & indexing deep dive", why: "Data integrity" },
    ],
    masters: ["Guillermo Rauch (practical)", "Goldberg Yoni", "Martin Fowler"],
    access: {
      email: "backend@emet.local",
      repo: ["write server code on feature branches"],
      cloud: ["DB staging credentials", "redis staging"],
      hosting: ["read staging logs"],
      messaging: ["bus + eng alerts"],
    },
    can: ["Write server", "Migrations staging", "Tests", "Open PRs"],
    cannot: ["Prod deploy alone", "Weaken auth", "Commit secrets", "Drop prod tables"],
    secretsNeeded: ["DATABASE_URL_STAGING", "REDIS_URL_STAGING", "SENTRY_DSN"],
  },
  "14-frontend-engineer": {
    tools: ["React", "TypeScript", "Vite/Next", "TanStack Query", "Zod", "Playwright", "Storybook optional", "React Hook Form", "design tokens"],
    plugins: ["ESLint", "Prettier", "a11y eslint-plugin", "Cursor FE rules", "React DevTools", "Lighthouse"],
    triggers: [
      { event: "API contract ready / mocked", action: "Build route feature" },
      { event: "UI tokens updated", action: "Align components" },
      { event: "QA UI bug", action: "Fix + regression test" },
      { event: "Analytics events in PRD", action: "Instrument" },
    ],
    methods: ["Typed boundaries", "State matrices", "A11y forms", "Performance awareness", "Mobile-responsive"],
    training: [
      { course: "Kent C. Dodds Epic React / Testing", why: "React excellence" },
      { course: "Josh Comeau CSS/React craft", why: "UI quality" },
      { course: "web.dev vitals + a11y", why: "Real user quality" },
      { course: "Total TypeScript (Matt Pocock) select", why: "Type safety" },
    ],
    masters: ["Kent C. Dodds", "Dan Abramov (fundamentals)", "Josh Comeau"],
    access: {
      email: "frontend@emet.local",
      repo: ["write client apps"],
      hosting: ["preview deploy tokens"],
      design: ["Figma inspect"],
      analytics: ["write client events via approved SDK"],
    },
    can: ["Build UI", "Preview deploys", "Component/e2e tests"],
    cannot: ["Invent backend contracts unilaterally", "Store secrets in client"],
    secretsNeeded: ["VERCEL_PREVIEW_TOKEN", "POSTHOG_KEY_PUBLIC"],
  },
  "15-mobile-engineer": {
    tools: ["React Native/Expo or Flutter (CTO pick)", "Maestro/Detox", "Sentry Mobile", "TestFlight", "Play Console", "Push providers"],
    plugins: ["Expo EAS", "Flipper/react-native-devtools"],
    triggers: [
      { event: "Mobile scope in plan", action: "App slices" },
      { event: "API change", action: "Adapt client" },
      { event: "Store release gate", action: "Prepare build + ask CEO/CTO" },
    ],
    methods: ["Offline-aware UX", "Permission ethics", "Crash-free focus", "Store review hygiene"],
    training: [
      { course: "Expo / RN advanced courses", why: "Ship mobile" },
      { course: "Apple HIG + Play policies", why: "Compliance" },
    ],
    masters: ["Evan Bacon (Expo)", "platform official docs"],
    access: {
      email: "mobile@emet.local",
      repo: ["write mobile apps"],
      cloud: ["EAS/CI"],
      hosting: ["TestFlight/Play internal tracks"],
      phone: ["device farm / real devices"],
    },
    can: ["Push to test tracks"],
    cannot: ["Public store release without gate"],
    secretsNeeded: ["ASC_API_KEY", "PLAY_JSON", "EAS_TOKEN", "PUSH_KEY"],
  },
  "16-data-engineer": {
    tools: ["SQL", "dbt", "Warehouse", "Airbyte/Fivetran", "Great Expectations", "Airflow/Dagster optional"],
    plugins: ["dbt tests", "schema contracts"],
    triggers: [
      { event: "Analytics events defined", action: "Model pipelines" },
      { event: "Freshness breach", action: "Repair + alert" },
      { event: "New product entities", action: "Update grain docs" },
    ],
    methods: ["ELT", "Dimensional modeling lite", "Data tests", "PII minimization"],
    training: [
      { course: "Fundamentals of Data Engineering", why: "Core craft" },
      { course: "dbt Learn", why: "Analytics eng" },
      { course: "Data quality / GE workshops", why: "Trust" },
    ],
    masters: ["Joe Reis", "Claire Carroll"],
    access: {
      email: "data@emet.local",
      cloud: ["warehouse writer", "ETL service"],
      analytics: ["raw+modeled"],
      repo: ["write analytics repo"],
    },
    can: ["Build pipelines", "Model tables"],
    cannot: ["Exfiltrate PII", "Widen prod access casually"],
    secretsNeeded: ["WAREHOUSE_URL", "ETL_KEY"],
  },
  "17-ml-ai-engineer": {
    tools: ["Anthropic/OpenAI APIs", "Eval harness", "LangSmith/Phoenix", "Vector DB if needed", "Prompt version store", "Cost/latency monitors"],
    plugins: ["PromptFoo/evals", "JSON schema tools", "guardrails"],
    triggers: [
      { event: "AI feature in PRD", action: "Design eval+prompt+tools" },
      { event: "Agent company loop failure", action: "Help CHRO/CTO with evals" },
      { event: "Cost overrun on AI", action: "Optimize with CFO" },
    ],
    methods: ["Eval-driven development", "Tool calling strict schemas", "Fallbacks", "RAG only when needed"],
    training: [
      { course: "DeepLearning.AI ChatGPT/LangChain/eval courses", why: "Applied AI" },
      { course: "Anthropic prompt & agent docs", why: "Best practice" },
      { course: "Hamel Husain eval essays", why: "Real quality" },
    ],
    masters: ["Hamel Husain", "Eugene Yan", "Anthropic applied team writings"],
    access: {
      email: "ai@emet.local",
      cloud: ["model API keys with budgets"],
      repo: ["write ai/ dirs"],
      analytics: ["eval dashboards"],
    },
    can: ["Prototype AI features", "Run evals", "Recommend models"],
    cannot: ["Ship un-eval'd AI", "Uncapped spend"],
    secretsNeeded: ["ANTHROPIC_API_KEY", "OPENAI_API_KEY", "EVAL_DB"],
  },
  "18-devops-platform": {
    tools: ["GitHub Actions", "Docker", "Terraform", "Vercel/Railway/Fly/AWS", "Sentry", "Uptime (Checkly)", "Secrets manager", "Log drains"],
    plugins: ["Actionlint", "IaC plans", "Preview environments", "Migration gates"],
    triggers: [
      { event: "Stage stage entered", action: "Staging deploy + smoke" },
      { event: "Launch Gate passed", action: "Prod deploy checklist execute" },
      { event: "CI red on main", action: "Repair pipeline" },
      { event: "Secret leak alert", action: "Rotate + page Security" },
    ],
    methods: ["Twelve-factor", "Immutable deploys", "Rollback first", "Env parity", "Least privilege IAM"],
    training: [
      { course: "Google SRE Book (select)", why: "Reliability" },
      { course: "HashiCorp Terraform associate path", why: "IaC" },
      { course: "CNCF / Kubernetes lite only if needed", why: "Avoid overkill" },
      { course: "GitHub Actions advanced", why: "CI/CD" },
    ],
    masters: ["Google SRE authors", "Kelsey Hightower (pragmatism)"],
    access: {
      email: "devops@emet.local",
      phone: "Pager for SEV1",
      repo: ["CI admin"],
      cloud: ["deploy roles staging+prod (prod gated)"],
      hosting: ["all app hosts"],
      messaging: ["Pager/Telegram critical"],
    },
    can: ["Own CI/CD", "Staging deploy", "Prepare prod"],
    cannot: ["Prod without CEO+checklist", "Commit secrets"],
    secretsNeeded: ["CLOUD_DEPLOY_KEY", "TF_TOKEN", "DNS_PROVIDER", "SECRET_MANAGER"],
  },
  "19-security-engineer": {
    tools: ["OWASP checklists", "Dependabot/Snyk", "Secret scanners", "Threat models", "Burp/ZAP mindset", "Auth review templates", "CSP/headers scanners"],
    plugins: ["CodeQL", "gitleaks", "TFSec"],
    triggers: [
      { event: "Architect stage on auth/pay/PII", action: "Threat model Agree" },
      { event: "Hardening stage", action: "Security review" },
      { event: "Secret leak / SEV security", action: "Incident lead" },
      { event: "Public security claim", action: "Vet with Legal" },
    ],
    methods: ["STRIDE lite", "ASVS selective", "Least privilege", "Secure defaults"],
    training: [
      { course: "OWASP Web/API Security learning path", why: "Core AppSec" },
      { course: "PortSwigger Web Security Academy", why: "Hands-on" },
      { course: "NIST CSF awareness for startups", why: "Program thinking" },
    ],
    masters: ["OWASP community", "Troy Hunt (pragmatism)"],
    access: {
      email: "security@emet.local",
      phone: "SEV security pager",
      repo: ["security read all", "block merges via checks"],
      cloud: ["security audit roles"],
      messaging: ["private security channel"],
    },
    can: ["Block risky merges", "Mandate fixes", "Run reviews"],
    cannot: ["Ignore business context — escalate clearly"],
    secretsNeeded: ["SNYK_TOKEN", "GITLEAKS_LICENSE", "AUDIT_ROLE"],
  },
  "20-qa-sdet": {
    tools: ["Playwright", "Cypress optional", "API tests", "Vitest", "Allure/Notion cases", "Exploratory charters", "BrowserStack optional"],
    plugins: ["Playwright codegen", "Flake detectors", "Visual diffs optional"],
    triggers: [
      { event: "Slice claimed done", action: "Risk-based test" },
      { event: "Hardening stage", action: "Chair Hardening Review" },
      { event: "Release candidate", action: "Go/No-Go evidence" },
      { event: "SEV bug filed", action: "Validate severity" },
    ],
    methods: ["Risk-based testing", "Testing trophy", "Exploratory testing", "Repro discipline"],
    training: [
      { course: "Ministry of Testing / practical ISTQB select", why: "QA craft" },
      { course: "Playwright official + Kent C. Dodds testing", why: "Automation" },
      { course: "Explore It! (Hendrickson)", why: "Exploration" },
    ],
    masters: ["Elisabeth Hendrickson", "Kent C. Dodds"],
    access: {
      email: "qa@emet.local",
      repo: ["write tests", "fail checks"],
      hosting: ["staging full access"],
      messaging: ["qa topic"],
    },
    can: ["Fail release", "Own automation"],
    cannot: ["Rewrite product scope"],
    secretsNeeded: ["STAGING_USERS", "BROWSERSTACK_KEY?"],
  },
  "21-growth-lead": {
    tools: ["PostHog/Mixpanel", "Feature flags", "Experiment platform", "SQL lite", "Onboarding audits", "Survey tools"],
    plugins: ["Flag + experiment linker", "Funnel templates"],
    triggers: [
      { event: "Learn/Grow stage", action: "Experiment backlog" },
      { event: "Activation drop", action: "Diagnose loop" },
      { event: "Experiment finished", action: "Decision memo ship/kill" },
    ],
    methods: ["Growth loops", "Hypothesis design", "Guardrail metrics", "Qual+quant"],
    training: [
      { course: "Reforge Growth Series", why: "Best-in-class growth" },
      { course: "Elena Verna / growth interviews library", why: "Patterns" },
      { course: "Experiment design stats literacy", why: "Avoid false wins" },
    ],
    masters: ["Elena Verna", "Casey Winters", "Brian Balfour"],
    access: {
      email: "growth@emet.local",
      analytics: ["experiment admin"],
      repo: ["write flag configs"],
      ads: ["read; coordinate with Performance"],
    },
    can: ["Design experiments", "Prioritize growth backlog"],
    cannot: ["Spend paid without CEO", "Break brand freely"],
    secretsNeeded: ["POSTHOG_ADMIN", "FLAGS_KEY"],
  },
  "22-content-marketing": {
    tools: ["Notion CMS", "Google Docs", "SEO briefs from Gil", "Brand voice", "Grammar tools carefully", "Newsletter (Customer.io/Beehiiv)", "Asset library"],
    plugins: ["Outline generator checked by humans", "Claim highlighter"],
    triggers: [
      { event: "CMO brief received", action: "Draft calendar + assets" },
      { event: "Launch approaching", action: "Launch content kit" },
      { event: "CEO reject claims", action: "Rewrite to truth" },
    ],
    methods: ["Specific storytelling", "Content clusters", "Editing for proof", "Repurposing"],
    training: [
      { course: "Animalz / content strategy classics", why: "SaaS content" },
      { course: "Copyblogger / Demian Farnworth craft select", why: "Writing" },
      { course: "April Dunford messaging alignment", why: "Positioning consistency" },
    ],
    masters: ["Joanna Wiebe (copy)", "Dickie Bush+Ship 30 (discipline, not spam)"],
    access: {
      email: "content@emet.local",
      social: ["draft CMS only"],
      messaging: ["newsletter draft"],
      design: ["request assets from UI"],
    },
    can: ["Draft all content"],
    cannot: ["Publish without gate"],
    secretsNeeded: ["CMS_API", "NEWSLETTER_KEY"],
  },
  "23-seo-specialist": {
    tools: ["GSC", "Ahrefs/Semrush", "Screaming Frog mindset", "Schema markup", "Core Web Vitals", "Looker/Sheets"],
    plugins: ["GSC API", "crawl diffs"],
    triggers: [
      { event: "Shape/Grow", action: "Keyword map + tech tickets" },
      { event: "Site deploy", action: "Indexation/canonical checks" },
      { event: "Content cluster ready", action: "On-page brief QA" },
    ],
    methods: ["Intent mapping", "Technical SEO", "Internal linking", "Ethical acquisition"],
    training: [
      { course: "Google Search Central documentation mastery", why: "Source of truth" },
      { course: "Ahrefs Academy / Semrush Academy", why: "Practice" },
      { course: "Technical SEO courses (Moz/Paul Shapiro select)", why: "Tech depth" },
    ],
    masters: ["Google SearchLiaison guidance", "Lily Ray (E-E-A-T)"],
    access: {
      email: "seo@emet.local",
      analytics: ["GSC", "GA4"],
      repo: ["open tech SEO PRs with FE"],
      hosting: ["read headers/CDN"],
    },
    can: ["Strategy + tickets", "Brief content"],
    cannot: ["Black-hat", "Publish unaudited"],
    secretsNeeded: ["GSC_ACCESS", "AHREFS_KEY"],
  },
  "24-performance-marketing": {
    tools: ["Meta Ads", "Google Ads", "LinkedIn Ads optional", "UTM standards", "Landing CRO notes", "Creative board", "Budget tracker"],
    plugins: ["Ads APIs read", "Creative testing matrix"],
    triggers: [
      { event: "CEO approved budget", action: "Launch structured tests" },
      { event: "CAC breach", action: "Pause + learn memo" },
      { event: "New creative from Content/UI", action: "Test plan" },
    ],
    methods: ["Creative testing", "Kill criteria", "Incrementality skepticism", "Landing alignment"],
    training: [
      { course: "Meta Blueprint + Google Skillshop", why: "Platform excellence" },
      { course: "Paid acquisition Reforge modules", why: "Strategy" },
      { course: "CRO basics (CXL select)", why: "Landing leverage" },
    ],
    masters: ["paid social practitioners via Skillshop/Blueprint"],
    access: {
      email: "ads@emet.local",
      ads: ["ad accounts — spend locked to approved caps"],
      analytics: ["ads + web"],
      billing: ["ads billing read"],
      social: ["boost only approved posts"],
    },
    can: ["Draft & run within approved budget"],
    cannot: ["Raise budget alone", "Go live without CEO gate first time"],
    secretsNeeded: ["META_ADS_TOKEN", "GOOGLE_ADS_TOKEN", "BUDGET_CAP_CONFIG"],
  },
  "25-community-social": {
    tools: ["Telegram/Telemas", "Typefully/Buffer", "Community guidelines", "Listening docs", "Crisis scripts", "WhatsApp Business optional (gated)"],
    plugins: ["Telemas API hooks", "Schedule queues", "Mute/spam filters"],
    triggers: [
      { event: "Approved content calendar item due", action: "Queue post for gate if not prewhitelisted" },
      { event: "Community question", action: "Helpful reply / escalate Support" },
      { event: "Drama/crisis", action: "Escalate CEO/CMO minutes" },
      { event: "Launch", action: "Community announcement draft" },
    ],
    methods: ["Value-first posting", "Frequency caps", "Human tone", "Crisis escalation"],
    training: [
      { course: "Community building (CMX / Orbit select)", why: "Community craft" },
      { course: "Social media management ethics + platform policies", why: "Trust" },
      { course: "Telegram bot/ops best practices (internal Telemas)", why: "Channel mastery" },
    ],
    masters: ["CMX community body of knowledge"],
    access: {
      email: "community@emet.local",
      phone: "WhatsApp Business seat (optional, gated)",
      messaging: ["Telegram admin on brand communities", "Telemas"],
      social: ["X/LinkedIn/Instagram draft+schedule; publish gated"],
    },
    can: ["Draft/engage per playbooks", "Use Telemas tools"],
    cannot: ["Unapproved broadcast spam", "Public fight without script"],
    secretsNeeded: ["TELEGRAM_API", "TELEMAS_KEY", "BUFFER_TOKEN", "WHATSAPP_TOKEN?"],
  },
  "26-sales": {
    tools: ["CRM (HubSpot)", "Demo env", "Proposal templates", "Call recorder notes", "Calendly", "Email sequences gated", "Phone/VoIP"],
    plugins: ["CRM pipelines", "Meeting scheduler"],
    triggers: [
      { event: "Qualified lead in", action: "Discovery → demo" },
      { event: "Security questionnaire", action: "Pull Dana/Ava" },
      { event: "Custom terms", action: "Legal+CEO" },
      { event: "Lost deal", action: "Autopsy to Product" },
    ],
    methods: ["MEDDICC lite", "Discovery-first demos", "Honest forecasting", "Disqualify fast"],
    training: [
      { course: "Challenger Sale select + modern SaaS sales pods", why: "Consultative sales" },
      { course: "Winning by Design / SaaStr practical talks", why: "Process" },
      { course: "Gong/Chorus discovery call libraries", why: "Talk tracks" },
    ],
    masters: ["Winning by Design school of thought"],
    access: {
      email: "sales@emet.local",
      phone: "VoIP/sales number",
      messaging: ["WhatsApp Business for prospects gated"],
      analytics: ["CRM"],
      repo: ["read demo scripts docs"],
    },
    can: ["Run pipeline", "Demo", "Draft proposals"],
    cannot: ["Promise unbuilt features", "Custom legal alone"],
    secretsNeeded: ["HUBSPOT_KEY", "CALENDLY", "VOIP"],
  },
  "27-customer-success": {
    tools: ["CRM", "Health scores", "Onboarding checklists", "QBR decks", "Product analytics", "Email/phone outreach"],
    plugins: ["Health score formulas", "Renewal reminders"],
    triggers: [
      { event: "New paying customer", action: "Onboarding plan" },
      { event: "Health drop", action: "Intervention play" },
      { event: "Renewal window", action: "QBR / expand signal" },
      { event: "Feature gap evidence", action: "Structured ask to PM" },
    ],
    methods: ["Time-to-value", "Health scoring", "Churn autopsies", "QBRs"],
    training: [
      { course: "Gainsight CS curriculum select / SuccessHacker", why: "CS craft" },
      { course: "Onboarding best practices (Appcues/Userpilot academies select)", why: "TTV" },
    ],
    masters: ["Gainsight CS body of knowledge"],
    access: {
      email: "success@emet.local",
      phone: "CS line",
      messaging: ["customer Telegram/WhatsApp approved threads"],
      analytics: ["account-level"],
    },
    can: ["Own onboarding", "Flag churn", "Request product changes with evidence"],
    cannot: ["Commit custom eng unilaterally"],
    secretsNeeded: ["CRM_KEY", "PHONE"],
  },
  "28-support": {
    tools: ["Helpdesk (Intercom/Zendesk/Freshdesk)", "Macros", "Status page", "KB", "Bug templates", "Phone/chat/email/WhatsApp inbox gated"],
    plugins: ["Macro suggester", "Severity router to QA"],
    triggers: [
      { event: "New ticket", action: "Triage SEV + reply" },
      { event: "Bug confirmed", action: "File eng-ready issue" },
      { event: "Outage", action: "Status updates with DevOps" },
      { event: "Policy refund ask", action: "Finance Ops rules" },
    ],
    methods: ["Empathy+clarity", "Repro extraction", "Severity rubric", "KB gardening"],
    training: [
      { course: "Support-driven growth / helpdesk academies", why: "Support excellence" },
      { course: "ITIL lite incident comms", why: "Outage communication" },
    ],
    masters: ["Support-driven growth practitioners"],
    access: {
      email: "support@emet.local",
      phone: "Support hotline",
      messaging: ["WhatsApp/Telegram support inbox"],
      hosting: ["status page editor"],
      repo: ["file issues"],
    },
    can: ["Answer in policy", "File bugs", "Draft KB"],
    cannot: ["Beyond-policy credits", "Legal promises"],
    secretsNeeded: ["HELPDESK_KEY", "STATUS_PAGE", "WHATSAPP_SUPPORT?"],
  },
  "29-analytics-bi": {
    tools: ["PostHog/Mixpanel/GA4", "SQL", "Metabase/Looker", "Metric dictionary", "Experiment readouts"],
    plugins: ["Semantic layer notes", "Dashboard linter"],
    triggers: [
      { event: "PRD metrics section", action: "Define events dictionary" },
      { event: "Weekly exec", action: "Truth pack for CEO" },
      { event: "Metric dispute", action: "Publish definition version" },
    ],
    methods: ["Taxonomy", "North Star + inputs", "Decision-driven dashboards", "Caveats on charts"],
    training: [
      { course: "Amplitude Analytics Academy / Mixpanel courses", why: "Product analytics" },
      { course: "Mode/SQL for analytics", why: "Self-serve rigor" },
      { course: "dbt semantic mindset", why: "Definitions" },
    ],
    masters: ["Amplitude taxonomy playbooks authors"],
    access: {
      email: "analytics@emet.local",
      analytics: ["admin definitions"],
      cloud: ["warehouse reader"],
      repo: ["write metrics docs"],
    },
    can: ["Own metric defs", "Build dashboards"],
    cannot: ["Silent redefine metrics"],
    secretsNeeded: ["ANALYTICS_ADMIN", "WAREHOUSE_READONLY"],
  },
  "30-legal-compliance": {
    tools: ["Policy templates", "DPA library", "Privacy checklists (GDPR/Israeli)", "Claim review checklist", "Vendor inventory"],
    plugins: ["Clause highlighter", "Data map templates"],
    triggers: [
      { event: "New product processes personal data", action: "Privacy review before build deep" },
      { event: "Marketing claims", action: "Agree/reject" },
      { event: "Vendor with data access", action: "DPA check" },
      { event: "Children/health/finance sensitive", action: "Human counsel escalate" },
    ],
    methods: ["Privacy by design checklists", "Claim hygiene", "Vendor risk", "Know when to call lawyer"],
    training: [
      { course: "IAPP CIPP awareness materials", why: "Privacy literacy" },
      { course: "Startup legal stacks (Clerky/Stripe Atlas guides) select", why: "Pragmatism" },
      { course: "Local counsel escalation rules (Israel)", why: "Jurisdiction" },
    ],
    masters: ["IAPP body of knowledge"],
    access: {
      email: "legal@emet.local",
      repo: ["write legal/privacy docs"],
      messaging: ["private legal channel"],
      other: ["vault of signed DPAs — read"],
    },
    can: ["Draft policies", "Flag blockers", "Vet claims"],
    cannot: ["Replace licensed attorney on high stakes"],
    secretsNeeded: ["DOCUSIGN?", "VENDOR_VAULT"],
  },
  "31-finance-ops": {
    tools: ["Stripe Billing", "Invoicing", "Dunning", "Tax/VAT notes", "Refund policy ops", "Reconciliation sheets"],
    plugins: ["Stripe webhooks monitor", "Failed payment playbooks"],
    triggers: [
      { event: "New plan catalog change (approved)", action: "Configure Stripe" },
      { event: "Failed payment", action: "Dunning with dignity" },
      { event: "Refund request", action: "Apply policy / escalate" },
      { event: "Daily reconcile", action: "Books inputs" },
    ],
    methods: ["Billing state machines", "Audit trails", "Customer-fair dunning", "Policy exceptions path"],
    training: [
      { course: "Stripe Billing docs mastery", why: "Source of truth" },
      { course: "SaaS finance ops playbooks", why: "Reconciliation" },
    ],
    masters: ["Stripe docs as curriculum"],
    access: {
      email: "billing@emet.local",
      billing: ["Stripe Billing ops"],
      messaging: ["billing support macros with Support"],
      phone: ["optional billing line"],
    },
    can: ["Operate billing inside policy"],
    cannot: ["Live price change", "Out-of-policy refunds"],
    secretsNeeded: ["STRIPE_SECRET_KEY", "WEBHOOK_SECRET", "TAX_TOOL?"],
  },
  "32-delivery-lead": {
    tools: ["Linear board", "WIP aging", "ops/daily", "Risk register", "Meeting timer", "Dashboard state updater"],
    plugins: ["Standup bot", "WIP limit enforcer"],
    triggers: [
      { event: "Every working morning", action: "Facilitate Daily" },
      { event: "Blocker >24h", action: "Escalate with COO" },
      { event: "Demo day", action: "Ensure demoable slice" },
      { event: "WIP > limit", action: "Stop starting / start finishing" },
    ],
    methods: ["WIP limits", "Flow metrics", "Risk visibility", "Demo>status"],
    training: [
      { course: "Kanban University / actionables", why: "Flow" },
      { course: "Shape Up + Scrum anti-cargo-cult literacy", why: "Right process" },
      { course: "Making Work Visible", why: "Transparency" },
    ],
    masters: ["Dominica DeGrandis", "Ryan Singer"],
    access: {
      email: "delivery@emet.local",
      repo: ["read boards/docs"],
      messaging: ["Telegram standup posts"],
      analytics: ["delivery metrics"],
    },
    can: ["Facilitate cadence", "Enforce WIP", "Surface risks"],
    cannot: ["Override CPO/CEO priority"],
    secretsNeeded: ["LINEAR_API", "TELEGRAM_BOT_TOKEN"],
  },
};

const GLOBAL_FORBIDDEN = [
  "Publish externally without CEO gate",
  "Spend money without CEO gate",
  "Production deploy without CEO+checklist gate",
  "Delete production data",
  "Commit secrets to git",
  "Bypass Security on auth/payments/PII",
  "Share credentials in chat/bus plaintext",
];

function toolsMd(id, k) {
  return `# Tools — ${id}

World-class toolkit for this role. Prefer boring + reliable; upgrade when leverage is clear.

## Primary tools
${k.tools.map((t) => `- ${t}`).join("\n")}

## Plugins / extensions / advanced
${k.plugins.map((t) => `- ${t}`).join("\n")}

## Methods (how you work)
${k.methods.map((t) => `- ${t}`).join("\n")}

## Research habit
Before inventing process, check TRAINING.md masters + current primary docs.
`;
}

function triggersMd(id, k) {
  return `# Triggers — ${id}

You act when these events happen. Do not wait to be babysat.

| Trigger event | Your action |
|---------------|-------------|
${k.triggers.map((t) => `| ${t.event} | ${t.action} |`).join("\n")}

## Always-on listening
- Your \`inbox/\`
- \`ops/bus/\` messages addressed to you or your role
- Day Plan items that name you
- Stage changes on initiatives you own

## Anti-triggers (do NOT act)
- Curiosity without packet / day-plan / SEV
- Doing another role's job without handoff ask
- Publishing/spending/deploying outside permissions
`;
}

function trainingMd(id, k) {
  return `# Training — ${id}

You are trained at top-tier professional level for this discipline.

## Curriculum (best courses / bodies of knowledge)
${k.training.map((t) => `- **${t.course}** — ${t.why}`).join("\n")}

## Masters to emulate (judgment, not cosplay)
${k.masters.map((m) => `- ${m}`).join("\n")}

## Practice standard
- Use current primary documentation for tools you operate
- Prefer evidence, checklists, and critique over vibes
- After failures: write lessons into \`memory/\` and suggest PLAYBOOK updates to CHRO

## Certification mindset
Act as if you must pass a senior hiring loop for this role at a top SaaS company this week.
`;
}

function accessMd(id, k) {
  const a = k.access;
  const section = (title, arr) =>
    arr && arr.length ? `## ${title}\n${arr.map((x) => `- ${x}`).join("\n")}\n` : "";
  return `# Access & Accounts — ${id}

Slots for real credentials live in the company vault (1Password/Vault) — **never in git**.
This file declares WHAT you need. Founder/CTO wires secrets via env.

${a.email ? `## Email\n- ${a.email}\n` : ""}
${a.phone ? `## Phone / SMS\n- ${a.phone}\n` : ""}
${section("Repo / GitHub", a.repo)}
${section("Cloud", a.cloud)}
${section("Hosting", a.hosting)}
${section("Social media", a.social)}
${section("Messaging (Telegram / WhatsApp / etc.)", a.messaging)}
${section("Analytics", a.analytics)}
${section("Ads", a.ads)}
${section("Billing / money systems", a.billing)}
${section("Design", a.design)}
${section("Other", a.other)}

## Secrets required (names only)
${k.secretsNeeded.length ? k.secretsNeeded.map((s) => `- \`${s}\``).join("\n") : "- None beyond shared company bot"}

## Provisioning status
- [ ] Accounts created
- [ ] Secrets stored in vault
- [ ] Least-privilege confirmed by Security
- [ ] Offboarding checklist exists
`;
}

function permissionsMd(id, k) {
  return `# Permissions — ${id}

## Can
${k.can.map((x) => `- ${x}`).join("\n")}

## Cannot
${k.cannot.map((x) => `- ${x}`).join("\n")}

## Global forbidden (all agents)
${GLOBAL_FORBIDDEN.map((x) => `- ${x}`).join("\n")}

## Access detail
See \`ACCESS.md\` for repos, cloud, hosting, email, phone, social, and secret slots.
`;
}

function playbookExtra(id, k) {
  return `
## Operating methods (expanded)
${k.methods.map((m) => `- ${m}`).join("\n")}

## Trigger discipline
See \`TRIGGERS.md\` — act on events; don't freestyle outside Day Plan / SEV / explicit packet.

## Training source of truth
See \`TRAINING.md\` for curriculum and masters.
`;
}

// Company-level access matrix
const matrixRows = Object.entries(kits).map(([id, k]) => {
  const a = k.access;
  return `| \`${id}\` | ${a.email || "—"} | ${a.phone ? "yes" : "—"} | ${(a.repo || []).length ? "yes" : "—"} | ${(a.cloud || []).length ? "yes" : "—"} | ${(a.hosting || []).length ? "yes" : "—"} | ${(a.social || []).length ? "yes" : "—"} | ${(a.messaging || []).length ? "yes" : "—"} | ${(a.ads || []).length ? "yes" : "—"} | ${(a.billing || []).length ? "yes" : "—"} |`;
});

w(
  path.join(ROOT, "_company", "ACCESS_MATRIX.md"),
  `# Access Matrix — who needs what

Credentials are provisioned outside git. This matrix is the request list.

| Agent | Email | Phone | Repo | Cloud | Hosting | Social | Messaging | Ads | Billing |
|-------|-------|-------|------|-------|---------|--------|-----------|-----|---------|
${matrixRows.join("\n")}

Details per agent: \`agents/{id}/ACCESS.md\`  
Vault template: \`_company/SECRETS_VAULT_TEMPLATE.md\`
`
);

w(
  path.join(ROOT, "_company", "SECRETS_VAULT_TEMPLATE.md"),
  `# Secrets Vault Template (NOT for git values)

Store real values in 1Password / Doppler / AWS Secrets Manager / Vault.

## Shared
- TELEGRAM_BOT_TOKEN
- TELEGRAM_COMPANY_CHAT_ID
- FOUNDER_CHAT_ID
- EMAIL_SMTP_HOST / USER / PASS
- FOUNDER_EMAIL

## Per product
- DATABASE_URL_STAGING / PROD
- REDIS_URL
- SENTRY_DSN
- POSTHOG_KEY
- STRIPE_SECRET_KEY / WEBHOOK_SECRET

## Per agent
See each \`ACCESS.md\` → Secrets required.

## Rules
1. Never commit secrets
2. Rotate on leak
3. Least privilege
4. Security (Dana) audits quarterly
`
);

w(
  path.join(ROOT, "_company", "AGENT_COMPLETENESS.md"),
  `# Agent Completeness Checklist

Every agent folder MUST contain:

| File | Purpose |
|------|---------|
| ROLE.md | Mission + KPIs |
| PERSONALITY.md | Name, voice, character |
| SYSTEM_PROMPT.md | Runtime brain |
| TOOLS.md | Tools + plugins + methods |
| TRIGGERS.md | When they act |
| TRAINING.md | World-class curriculum |
| PLAYBOOK.md | Day-to-day craft |
| PERMISSIONS.md | Can / cannot |
| ACCESS.md | Email, phone, repo, cloud, social, secrets slots |
| inbox/ outbox/ memory/ | Work + learning |

Company OS docs in \`_company/handbook/\` bind them together.
`
);

let n = 0;
for (const [id, k] of Object.entries(kits)) {
  const base = path.join(ROOT, "agents", id);
  if (!fs.existsSync(base)) {
    console.warn("missing agent", id);
    continue;
  }
  w(path.join(base, "TOOLS.md"), toolsMd(id, k));
  w(path.join(base, "TRIGGERS.md"), triggersMd(id, k));
  w(path.join(base, "TRAINING.md"), trainingMd(id, k));
  w(path.join(base, "ACCESS.md"), accessMd(id, k));
  w(path.join(base, "PERMISSIONS.md"), permissionsMd(id, k));

  const playbookPath = path.join(base, "PLAYBOOK.md");
  let play = fs.readFileSync(playbookPath, "utf8");
  if (!play.includes("Operating methods (expanded)")) {
    play = play.trim() + "\n" + playbookExtra(id, k) + "\n";
    fs.writeFileSync(playbookPath, play, "utf8");
  }

  const readmePath = path.join(base, "README.md");
  w(
    readmePath,
    `# ${id}

See also company: \`_company/AGENT_COMPLETENESS.md\`

## Files
- \`ROLE.md\` — mission & KPIs
- \`PERSONALITY.md\` — name, voice, character
- \`SYSTEM_PROMPT.md\` — load into runtime
- \`TOOLS.md\` — tools, plugins, methods
- \`TRIGGERS.md\` — what makes this agent act
- \`TRAINING.md\` — world-class curriculum / masters
- \`PLAYBOOK.md\` — craft playbook
- \`PERMISSIONS.md\` — can / cannot
- \`ACCESS.md\` — email, phone, repo, cloud, hosting, social, secret slots
- \`inbox/\` \`outbox/\` \`memory/\`

## Activate
1. Packet in inbox OR trigger event fires
2. Load SYSTEM_PROMPT + MOTTO + VALUES + PERSONALITY
3. Use only permitted ACCESS
4. Write artifacts + handoff to outbox
5. Log daily when active
`
  );
  n++;
}

console.log("Completed agents:", n);
