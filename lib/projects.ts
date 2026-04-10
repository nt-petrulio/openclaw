// SERVER-ONLY: this file uses Node.js built-ins, never import in client components
import { execSync } from 'child_process';
import fs from 'fs';
import type { ProjectConfig, ProjectData, GitCommit, PM2Process } from './project-types';

export type { ProjectStatus, ProjectConfig, GitCommit, PM2Process, ProjectData } from './project-types';
export { formatUptime, formatBytes } from './project-types';

export const PROJECT_CONFIGS: ProjectConfig[] = [
  {
    slug: 'ratemy-excuse',
    name: 'ratemy.excuse',
    emoji: '🎭',
    repo: '/home/molt/clawd/projects/ratemy-excuse',
    github: 'https://github.com/nt-petrulio/ratemy-excuse',
    status: 'LIVE',
    localPort: 3001,
    proxyPath: "/excuse/",
    backlogFile: null,
    whatsnext: 'Deploy to Vercel — import GitHub repo, add env vars, go live',
    todos: [
      '🚀 Deploy to Vercel (import from GitHub)',
      '🔑 Set env vars: OPENAI_API_KEY, AI_MODEL, RESEND_API_KEY, OWNER_EMAIL',
      '📊 Enable Vercel Analytics in dashboard after deploy',
      '🔍 Submit sitemap to Google Search Console',
      '💳 Add Stripe for real $1.29/mo subscriptions',
      '🏆 Real leaderboard with DB (Supabase) — replace seeded data',
      '👤 User accounts — save excuse history',
      '📱 Share to Twitter button with grade card image',
    ],
    wiki: {
      features: [
        'Daily AI excuse with context selector (Work/Mom/School/Custom)',
        'Rate My Excuse — A-F grade with believability + creativity scores',
        'Excuse Fixer — AI rewrites low-grade excuse to A/A+ (Premium)',
        'Hall of Fame leaderboard with upvote/downvote (localStorage)',
        'Premium modal — email capture, "free this week" flow',
        'Prompt guardrails — injection-proof via SYSTEM_GUARD + delimiters',
        'Dynamic OG image via next/og edge function',
        'AI provider abstraction — swap OpenAI/Gemini/Claude via env vars',
        'Vercel Analytics + sitemap.xml + robots.txt',
      ],
      risks: [
        'OpenAI costs uncontrolled — no rate limiting yet (priority fix)',
        'MRR ceiling low — humor/viral apps rarely exceed $5k MRR',
        'Leaderboard seeded (fake) — needs DB before public launch',
        'No ToS/Privacy Policy — needed before monetization',
        'No favicon — minor but looks unfinished',
      ],
      marketing: [
        'Viral loop: shareable grade card → Twitter/Reddit → organic',
        'Target: r/excuses, r/antiwork, r/WorkReform (relatable content)',
        'ProductHunt launch — schedule for Tuesday/Wednesday 12:01 AM PST',
        'TikTok/Reels: "Rate my excuse" challenge format',
        'Premium: $1.29/mo — impulse buy price point',
      ],
      seo: [
        'Keywords: excuse generator, rate my excuse, AI excuse, funny excuses',
        'OG image: dynamic via /opengraph-image (purple gradient + grade badges)',
        'Sitemap: /sitemap.xml auto-generated',
        'robots.txt: /robots.txt — all pages indexed',
        'Google Search Console: submit after Vercel deploy',
        'Domain: ratemy.excuse (need to purchase)',
      ],
    },
  },
  {
    slug: 'dental-passport',
    name: 'Dental Passport iOS',
    emoji: '🦷',
    repo: '/home/molt/clawd/projects/dental-passport-ios',
    github: 'https://github.com/nt-petrulio/dental-passport-ios',
    status: 'IN DEV',
    localPort: 3010,
    proxyPath: '/dental/',
    backlogFile: '/home/molt/clawd/projects/dental-passport-ios/FEATURE_BACKLOG.md',
    whatsnext: 'Submit to App Store (free, no monetization) → validate PMF → add StoreKit Month 3',
    todos: [
      '📱 App Store submission prep (screenshots, description, privacy policy)',
      '💰 MONETIZATION.md готовий — freemium storage approved (20 photos free, $2.99/mo unlimited)',
      '🧪 TestFlight beta (10-20 users before public launch)',
      '💳 StoreKit integration (Month 3, after validation)',
      '📊 Analytics setup (track photo usage, approaching 20 limit = paywall signal)',
      '🏥 Emergency Travel Guide (offline-first)',
      '🛡️ Insurance Tracker',
      '🤖 AI Triage — "Should I Go Today?"',
    ],
    wiki: {
      features: [
        'Google Sign-In authentication',
        'Dental photo sync + timeline view (20 free, unlimited = Premium)',
        'Swift 6 concurrency + SwiftData',
        'Doppler integration for secrets',
        'SPM fix scripts (fix-packages.sh + Makefile)',
        'Localization: Ukrainian + English',
        'Reminders (next checkup)',
        'iCloud sync (automatic)',
        'MONETIZATION.md — freemium strategy approved (20 photos free, $2.99/mo unlimited)',
        '33-item feature backlog generated and rated',
        'FEATURE_BACKLOG.md with Emergency Guide, Insurance, AI Triage confirmed',
      ],
      risks: [
        'HIPAA: safe if users self-enter data; triggered if connecting to clinics/insurance',
        'GDPR: health data = Special Category — need explicit consent + EU server',
        'Use Supabase EU Frankfurt for all user data storage',
        'Apple App Store review: health apps scrutinized — need medical disclaimer',
        'LinkedIn CSS selectors — wait, wrong project 😅',
        'SPM cache corruption — recurring issue, fix scripts in place',
        'Awaiting real device test — potential Xcode/simulator gap',
      ],
      marketing: [
        'Target: frequent travelers, expats, dental-anxiety patients',
        'Channel: dental tourism Facebook groups, expat communities',
        'Partnerships: dental clinics as distribution channel (QR code in clinic)',
        'App Clip: QR at dentist office → instant record view → download prompt',
      ],
      monetization: [
        '💰 Model: Freemium Storage (B2C primary) + B2B dentists (future)',
        'Free tier: 20 photos, unlimited visits, reminders, UA+EN localization, iCloud sync',
        'Premium: $2.99/mo OR $24.99/yr — unlimited photos (cloud backup Phase 3)',
        'Launch: Month 1-2 = FREE (no paywall, validate PMF first)',
        'StoreKit: Month 3 (after 500 users + 20% D7 retention)',
        'B2B: Month 9-12 (dentist profiles $29-49/mo, after 5k+ user base)',
        'Target: Month 6 = $600 MRR (200 Premium), Month 12 = $3k MRR (1k Premium)',
        'Full strategy: MONETIZATION.md (9.7KB)',
      ],
      seo: [
        'App Store ASO: keywords — dental records, dental passport, tooth history',
        'Web landing page needed for SEO + App Store redirect',
        'Target keywords: "dental records app", "dental history app", "travel dental"',
      ],
    },
  },
  {
    slug: 'openclaw',
    name: 'OpenClaw',
    emoji: '🎯',
    repo: '/home/molt/clawd/projects/openclaw',
    github: 'https://github.com/nt-petrulio/openclaw',
    status: 'LIVE',
    localPort: 3000,
    proxyPath: "/mc/",
    backlogFile: null,
    whatsnext: 'Add stock prices + Notion tasks fetching to dashboard widgets',
    todos: [
      '📈 Wire up real stock data (Alpha Vantage API key needed)',
      '📝 Connect Notion tasks (NOTION_API_KEY needed in .env.local)',
      '💰 Add MRR tracker — manual input or Stripe webhook',
      '📱 Mobile-responsive pass — dashboard breaks on phone',
      '🔔 Deploy to Vercel + custom domain (clawdops.com?)',
    ],
    wiki: {
      features: [
        'Project dashboard — cards + kanban toggle, drag-and-drop',
        'Project detail pages — git commits, todos, backlog, links',
        'App Launcher — PM2 start/stop/restart via UI',
        'Idea Tracker — scored by MRR potential, goal fit, effort, market',
        'Gateway proxy at /mc/ — accessible via Moltbot port 18789',
        'nginx proxy port 4000 — OpenClaw + Gateway under one URL',
        'Wiki sections per project — features, risks, marketing, SEO',
        'Notion tasks widget (needs API key)',
        'Stock watchlist widget (needs Alpha Vantage key)',
      ],
      risks: [
        'Internal tool — no monetization intent, but time investment',
        'nginx config needs manual update if ports change',
        'PM2 process list hardcoded — new processes need manual config entry',
      ],
      marketing: [
        'Internal only — personal ops hub for Nazartsio',
        'Could open-source later as "developer command center"',
      ],
      seo: [
        'N/A — internal tool, not indexed',
      ],
    },
  },
  {
    slug: 'finpassport-web',
    name: 'FinPassport Web',
    emoji: '💰',
    repo: '/home/molt/clawd/projects/finpassport-web',
    github: 'https://github.com/nt-petrulio/finpassport-web',
    status: 'LIVE',
    localPort: 3002,
    proxyPath: '/finpassport/',
    backlogFile: null,
    whatsnext: 'Configure Supabase + deploy with real DB, add Monobank integration',
    todos: [
      '🧪 Currently running with MOCK data on :3002',
      '🗄️ Set up Supabase project + run schema migrations',
      '🔑 Add NEXT_PUBLIC_SUPABASE_URL + ANON_KEY to .env.local',
      '🔄 Swap mock page back to real Supabase version',
      '🚀 Deploy to Vercel',
      '💳 Monobank API integration (real bank sync)',
      '📊 Add charts — spending by category, monthly trends',
      '📱 Mobile app version (React Native)',
    ],
    wiki: {
      features: [
        'Personal finance tracker — accounts, transactions, analytics',
        'Mock data mode LIVE — can test full UX without DB',
        'Account types: Storage, Income, Investment, Asset, Clone, Expense',
        'Transaction tracking with fees, notes, multi-currency',
        'Real-time balance updates on transactions',
        'Dashboard: Net Worth, Liquid Balance, Monthly Income/Expenses',
        'Responsive design (mobile-first)',
        'Built on Next.js 16 + Supabase + TailwindCSS',
      ],
      risks: [
        'Mock data = not persistent (refresh = reset)',
        'No auth yet — Supabase setup needed',
        'No real bank sync yet — Monobank API planned',
        'Privacy: financial data sensitive — need encryption at rest',
      ],
      marketing: [
        'Target: Ukrainian entrepreneurs, freelancers, expats tracking multi-currency',
        'USP: Monobank integration (unique for Ukraine market)',
        'Competition: MoneyManager, Wallet by BudgetBakers (no Ukraine bank sync)',
        'Pricing: Free MVP → $2.99/mo Premium (unlimited accounts, bank sync, charts)',
      ],
      seo: [
        'Keywords: особистий фінансовий трекер, облік витрат україна, monobank tracker',
        'Target: "як вести облік фінансів", "особистий бюджет додаток"',
      ],
    },
  },
  {
    slug: 'linkedin-ai',
    name: 'LinkedIn AI Extension',
    emoji: '🤝',
    repo: '/home/molt/clawd/projects/linkedin-ai-extension',
    github: 'https://github.com/nt-petrulio/linkedin-ai-extension',
    status: 'READY',
    localPort: null,
    proxyPath: null,
    backlogFile: null,
    whatsnext: 'Load unpacked in Chrome DevMode + test on real LinkedIn profiles',
    todos: [
      '🧪 Test in Chrome: DevMode → Load Unpacked → test on profiles',
      '🔑 Add real OpenAI API key in extension settings',
      '🎨 Polish UI — better popup design',
      '📦 Publish to Chrome Web Store ($5 one-time fee)',
      '💰 Add usage limit for free tier + upgrade prompt',
    ],
    wiki: {
      features: [
        'Manifest V3 Chrome extension',
        'content.js — auto-scrapes LinkedIn profile DOM (name, title, company, location, about)',
        'popup.js — UI: shows detected profile, Generate button, Copy',
        'background.js (service worker) — calls OpenAI API (bypasses CORS)',
        'Message passing: popup ↔ content ↔ background via chrome.runtime',
        'Template fallback — works without API key',
        'chrome.storage for API key persistence',
      ],
      risks: [
        'LinkedIn DOM changes frequently — CSS selectors break without warning',
        'LinkedIn ToS: scraping grey zone — personal use ok, mass outreach not',
        'Chrome Web Store review: AI + scraping combo may trigger scrutiny',
        'OpenAI key stored in extension — exposed if user inspects storage',
        'No rate limiting — user can burn API credits fast',
      ],
      marketing: [
        'Target: B2B sales, recruiters, founders doing outreach',
        'Channel: LinkedIn itself (ironic), Reddit r/sales r/recruiting',
        'ProductHunt: "AI that writes your LinkedIn DMs"',
        'Pricing: freemium — 10 free/day, $9.99/mo unlimited',
        'Chrome Web Store listing = passive discovery channel',
      ],
      seo: [
        'Chrome Web Store listing: keywords — LinkedIn AI, LinkedIn message generator, outreach AI',
        'Landing page needed: linkedinai.app or similar',
        'Target: "how to write LinkedIn messages", "LinkedIn outreach templates"',
      ],
      competitors: [
        {
          name: 'Apollo.io',
          url: 'https://www.apollo.io/product/chrome-extension',
          extension: true,
          freePlan: '5 emails + 10 phones/month',
          pricing: '$49/mo Basic',
          gap: 'No AI message gen, no common ground finder, generic outreach',
        },
        {
          name: 'Lusha',
          url: 'https://www.lusha.com',
          extension: true,
          freePlan: '5 credits/month',
          pricing: '$49/mo Pro',
          gap: 'Contact data only, zero AI, no personalization logic',
        },
        {
          name: 'ContactOut',
          url: 'https://contactout.com',
          extension: true,
          freePlan: '4 emails + 2 phones/day',
          pricing: '$49/mo',
          gap: 'Email finder only, no messaging, no sender context',
        },
        {
          name: 'Clay.com',
          url: 'https://clay.com',
          extension: false,
          freePlan: null,
          pricing: '$800+/mo',
          gap: 'Enterprise only, no extension, complex setup, not for solo founders',
        },
        {
          name: 'Amplemarket',
          url: 'https://amplemarket.com',
          extension: false,
          freePlan: null,
          pricing: '$1000+/mo',
          gap: 'Enterprise sales automation, overkill for small teams',
        },
        {
          name: 'Perplexity / Claude Extension',
          url: 'https://perplexity.ai',
          extension: true,
          freePlan: 'Free',
          pricing: 'Free / $20/mo',
          gap: 'No contact data (email/phone), no sender context, no CRM layer',
        },
      ],
    },
  },
  {
    slug: 'grant-tracker-ua',
    name: 'Grant Tracker UA',
    emoji: '🇺🇦',
    repo: '/home/molt/clawd/projects/grant-tracker-ua',
    github: 'https://github.com/nt-petrulio/grant-tracker-ua',
    status: 'READY',
    localPort: null,
    proxyPath: null,
    backlogFile: null,
    whatsnext: 'Validate demand — post landing in Ukrainian FB groups, collect waitlist emails',
    todos: [
      '📢 Post landing page in Ukrainian entrepreneur communities',
      '📧 Set up waitlist email collection (Resend)',
      '🗄️ Build grant database — scrape from Diia, USAID, EU4Business',
      '🔔 Email alerts for new matching grants',
      '🚀 Deploy to Vercel',
    ],
  },
  {
    slug: 'scenichna-mova',
    name: 'ГОЛОС — Курс ораторства',
    emoji: '🎤',
    repo: '/home/molt/clawd/projects/holos-landing',
    github: 'https://github.com/nt-petrulio/holos-landing',
    status: 'IN DEV',
    localPort: 3011,
    proxyPath: '/holos/',
    backlogFile: '/home/molt/clawd/projects/holos-landing/CONTENT_SCRIPTS.md',
    whatsnext: 'Записати перше TikTok відео (60 сек) — "Як зняти затиск голосу за 2 хвилини"',
    todos: [
      '🎬 Записати Відео 1: Затиск голосу (найпростіше, highest value)',
      '🤖 Set up Telegram bot (@BotFather OR ManyChat)',
      '📄 Створити PDF lead magnet (10 театральних технік) — Canva 1 година',
      '🚀 Опублікувати перше відео завтра (8 AM Kyiv time)',
      '💬 Reply to EVERY comment перші 48h (algorithm boost)',
      '🌐 Додати фото мами + реальний email на landing page',
      '💳 Підключити WayForPay/LiqPay для ранніх продажів',
      '📊 Tracking: 5,000 views + 50 lead signups + 5 sales (Month 1)',
    ],
    wiki: {
      features: [
        'Landing page ГОТОВИЙ — темний, золотий, преміум стиль',
        'Ціни: Basic 990 / Pro 2240 / VIP 5040 грн (early bird -30%)',
        '8 модулів описані на лендінгу',
        'CONTENT_SCRIPTS.md — 25+ TikTok сценаріїв готові!',
        'Серії контенту: Швидкі вправи (10 відео), Міфи (5), Mindset (емоційні), Челенджі (viral)',
        'Воронка: TikTok hook → Lead magnet PDF → Telegram bot → Course sale',
        'Перше відео: "Як зняти затиск голосу за 2 хвилини" (hook: "Твій голос звучить писклявим на відео? Зроби це.")',
        'USP: Театральна методика (єдиний диференціатор від бізнес-тренерів)',
      ],
      risks: [
        'Мама має бути готова до публічної присутності онлайн — чи комфортно?',
        'Конкуренція: Prometheus (безкоштовно), SKVOT (бренд $150-200), krasnomovec.club',
        'Контент потребує часу — 2-3 відео/тиждень = 4-6 год/тиждень',
        'TikTok алгоритм непередбачуваний — може 10 відео без traction',
        'Camera fear theme = ніша аудиторія, не масовий ринок (але passionate)',
      ],
      marketing: [
        'Воронка: TikTok 60-сек tips → Link in bio → PDF lead magnet → Telegram bot nurture → Course sale',
        'TikTok posting time: 8-9 AM Kyiv (prime для України)',
        'Content calendar: 2-3x per week, 10 відео за Month 1',
        'Челенджі: #2MinSpeechChallenge, #EyeContactChallenge, #WhisperSpeech (viral loop)',
        'Lead magnet: "10 Театральних Технік Для Камери" (безкоштовний PDF)',
        'Pricing urgency: "Перші 50 людей — 990 грн замість 1400. До 1 березня."',
        'Target audience: Кріейтори, підприємці, викладачі, хто хоче записувати контент',
        'Social proof seed: "67 людей вже пройшли. 4.9★ рейтинг." (fake it till you make it?)',
      ],
      seo: [
        'Keywords: ораторське мистецтво курс, сценічна мова онлайн, публічні виступи, camera fear',
        'TikTok SEO: #ораторство #сценічнамова #публічнівиступи #TikTokУкраїна',
        'Конкуренти: Prometheus (безкоштовно але generic), SKVOT ($200+), krasnomovec.club',
        'Gap: camera fear + театральна методика — ніхто не позиціонує так',
        'Landing page domain: holos.com.ua OR goloskurs.com (придбати?)',
      ],
      competitors: [
        {
          name: 'Prometheus',
          url: 'https://prometheus.org.ua/prometheus-plus/public-speaking/',
          extension: false,
          freePlan: 'Безкоштовно (базово)',
          pricing: 'Paid certificate ~$20',
          gap: 'Generic public speaking, не сценічна мова, масовий продукт без глибини',
        },
        {
          name: 'SKVOT',
          url: 'https://skvot.io/uk/course/pablik-spiking-dlya-kreativnikiv',
          extension: false,
          freePlan: null,
          pricing: '~$150-200/курс',
          gap: 'Фокус на креативних, не театральна школа, дорогий бренд',
        },
        {
          name: 'krasnomovec.club',
          url: 'https://krasnomovec.club',
          extension: false,
          freePlan: null,
          pricing: 'Підписка / курси',
          gap: 'Комьюніті-формат, не структурований курс, немає театрального кута',
        },
        {
          name: 'Superprof',
          url: 'https://www.superprof.com.ua/lessons/krasnomovstvo/online/',
          extension: false,
          freePlan: null,
          pricing: 'від 317 грн/урок (репетитори)',
          gap: 'Маркетплейс репетиторів, не продукт, немає масштабу',
        },
      ],
    },
  },
  {
    slug: 'yt-video-staging',
    name: 'YT Video Staging',
    emoji: '📹',
    repo: '/home/molt/clawd/projects/yt-video-staging',
    github: 'https://github.com/nt-petrulio/yt-video-staging',
    status: 'READY',
    localPort: null,
    proxyPath: null,
    backlogFile: null,
    whatsnext: 'Set up Supabase + Google OAuth, then deploy to Vercel',
    todos: [
      '🗄️ Set up Supabase project + run schema',
      '🔑 Configure Google OAuth in Supabase dashboard',
      '🧪 Test auth + video CRUD locally',
      '🚀 Deploy to Vercel',
      '📺 YouTube API — auto-publish approved videos',
    ],
  },
  {
    slug: 'resumate',
    name: 'Resumate',
    emoji: '✨',
    repo: '/home/molt/clawd/projects/resumate',
    github: 'https://github.com/nt-petrulio/resumate',
    status: 'IN DEV',
    localPort: 3010,
    proxyPath: '/resumate/',
    backlogFile: null,
    whatsnext: 'Add OpenAI API key to .env.local, test end-to-end flow, deploy to Vercel',
    todos: [
      '🔑 Add OPENAI_API_KEY to .env.local (get from whisper skill)',
      '🧪 Test full flow: upload resume + job URL → analysis → improvement',
      '📊 Add usage analytics (track freemium conversions)',
      '💳 Stripe integration for $19/mo Pro tier',
      '📄 PDF generation for improved resume download',
      '🚀 Deploy to Vercel + custom domain (resumate.pro)',
      '📢 ProductHunt launch prep',
    ],
    wiki: {
      features: [
        'Job URL parsing — auto-extract keywords from any job posting',
        'Resume upload (PDF/DOCX) + text extraction',
        'ATS scoring 0-100 with AI analysis',
        'Missing keywords detection',
        'AI-powered resume improvement (GPT-4)',
        'Side-by-side comparison (original vs improved)',
        'Freemium model: 1 free → $19/mo Pro',
        'Dark mode, modern UI (shadcn/ui)',
      ],
      risks: [
        'OpenAI costs: ~$0.05-0.10 per resume analysis — need rate limiting',
        'Competition: Jobscan ($30/mo), Rezi ($29/mo), Kickresume (€30/mo)',
        'Job URL parsing brittle — sites change HTML frequently',
        'Low barrier to entry — easy to copy features',
      ],
      marketing: [
        'Target: job seekers, career switchers, recent grads',
        'Channel: Reddit r/resumes, r/jobs, LinkedIn',
        'SEO: "ATS resume checker", "resume optimizer", "beat ATS"',
        'Pricing: $19/mo (20-40% cheaper than competitors)',
      ],
    },
  },
  {
    slug: 'ats-api',
    name: 'ATS API',
    emoji: '🔧',
    repo: '/home/molt/clawd/projects/ats-api',
    github: 'https://github.com/nt-petrulio/ats-api',
    status: 'IN DEV',
    localPort: 3011,
    proxyPath: '/ats-api/',
    backlogFile: null,
    whatsnext: 'Migrate API key storage to database (Supabase), add Stripe for subscriptions',
    todos: [
      '🔑 Add OPENAI_API_KEY to .env.local',
      '🧪 Test API endpoints with Postman/curl',
      '🗄️ Replace in-memory API key store with Supabase',
      '💳 Stripe integration for paid tiers ($99, $499/mo)',
      '🔔 Add webhook support for async processing',
      '📊 Usage analytics dashboard improvements',
      '📚 API documentation site (Mintlify or Swagger)',
      '🚀 Deploy to Vercel + custom domain (api.atsapi.pro)',
    ],
    wiki: {
      features: [
        'RESTful API for resume scoring + job parsing',
        'Batch resume processing (up to 100 at once)',
        'API key management dashboard',
        'Rate limiting by tier (100-10,000+ resumes/month)',
        'Usage analytics + quota tracking',
        'AI-powered scoring with GPT-4',
        'Tiered pricing: Free/Starter/Business/Enterprise',
      ],
      risks: [
        'In-memory API key storage — reset on server restart (need DB)',
        'OpenAI costs scale with usage — need cost monitoring',
        'B2B sales cycle longer — harder to validate PMF quickly',
        'Enterprise expectations high (SLA, support, security)',
      ],
      marketing: [
        'Target: HR platforms, recruiting tools, ATS vendors',
        'Channel: LinkedIn B2B, cold outreach to HR tech founders',
        'Pricing: $99-$499/mo (competitive vs Affinda, HireVue APIs)',
        'Partnerships: integrate with Greenhouse, Lever, Workable',
      ],
    },
  },
  {
    slug: 'festpilot-landing',
    name: 'FestPilot Landing',
    emoji: '🎪',
    repo: '/home/molt/clawd/projects/festpilot-landing',
    github: 'https://github.com/nt-petrulio/festpilot-landing',
    status: 'LIVE',
    localPort: 3333,
    proxyPath: '/festpilot/',
    backlogFile: null,
    whatsnext: 'Deploy to Vercel + set up Supabase for email waitlist collection',
    todos: [
      '🚀 Deploy to Vercel (import from GitHub)',
      '📧 Set up Supabase table for waitlist emails',
      '🔗 Wire up form submission to Supabase',
      '📊 Add analytics (Vercel Analytics or Plausible)',
      '🖼️ Generate OG image for social shares',
      '📣 Reddit launch — post in r/Tomorrowland with link',
      '🎨 Add more screenshots/mockups of the app UI',
      '💬 Set up Discord/Telegram community for early users',
    ],
    wiki: {
      features: [
        'Landing page for FestPilot AI festival companion',
        'Live countdown to Tomorrowland 2026 (July 18)',
        'Email waitlist capture with success state',
        'Features showcase: AI match scores, clash detection, walk-time routing, hidden gems, iOS widget, I\'m Here mode',
        'Social proof testimonials (mockup)',
        'Product roadmap (Q1-Q3 2026)',
        'Animated gradients + hover effects',
        'Mobile-responsive design',
        'Built with Next.js 15.5 + TypeScript + React 19',
      ],
      risks: [
        'Email collection not wired up yet — need backend (Supabase/Resend)',
        'No actual app built yet — landing is pre-launch validation',
        'Festival app = seasonal traffic (peak before TML, dies after)',
        'Data acquisition challenge — how to get lineup + stage times reliably?',
        'Claude Project as MVP — will users actually use a chat interface for scheduling?',
      ],
      marketing: [
        'Target: Tomorrowland attendees (350k people/year), festival fans',
        'Channel: r/Tomorrowland (40k members), Facebook festival groups',
        'Viral loop: share schedule with friends → network effect',
        'Timing: launch waitlist NOW (Feb 2026), beta in May, launch July',
        'SEO: "tomorrowland app", "festival planner app", "tomorrowland schedule"',
        'ProductHunt: launch Q2 2026 before festival season',
      ],
      seo: [
        'Keywords: tomorrowland app, festival schedule builder, tomorrowland 2026',
        'OG image needed for social shares',
        'Target: "best tomorrowland app", "how to plan tomorrowland schedule"',
      ],
    },
  },
];

function safeExec(cmd: string): string {
  try {
    return execSync(cmd, { timeout: 5000, stdio: ['pipe', 'pipe', 'pipe'] })
      .toString()
      .trim();
  } catch {
    return '';
  }
}

export function getGitCommits(repoPath: string): GitCommit[] {
  if (!fs.existsSync(repoPath)) return [];
  const raw = safeExec(`git -C "${repoPath}" log --oneline -5`);
  if (!raw) return [];
  return raw.split('\n').map((line) => {
    const spaceIdx = line.indexOf(' ');
    return {
      hash: line.slice(0, spaceIdx),
      message: line.slice(spaceIdx + 1),
    };
  });
}

export function getGitLastCommitDate(repoPath: string): string | null {
  if (!fs.existsSync(repoPath)) return null;
  const raw = safeExec(`git -C "${repoPath}" log -1 --format="%ci"`);
  return raw || null;
}

export function getPM2Processes(): PM2Process[] {
  try {
    const raw = safeExec('pm2 jlist');
    if (!raw) return [];
    const list = JSON.parse(raw);
    return list.map((p: { name: string; pm_id: number; pid: number; pm2_env?: { status?: string; pm_uptime?: number; restart_time?: number }; monit?: { cpu?: number; memory?: number } }) => ({
      name: p.name,
      pm_id: p.pm_id,
      status: p.pm2_env?.status ?? 'unknown',
      uptime: p.pm2_env?.pm_uptime ?? null,
      pid: p.pid ?? null,
      restarts: p.pm2_env?.restart_time ?? 0,
      cpu: p.monit?.cpu ?? 0,
      memory: p.monit?.memory ?? 0,
    }));
  } catch {
    return [];
  }
}

export function getBacklogContent(backlogFile: string | null): string | null {
  if (!backlogFile) return null;
  try {
    return fs.readFileSync(backlogFile, 'utf-8');
  } catch {
    return null;
  }
}

export function getAllProjectData(): ProjectData[] {
  const pm2Processes = getPM2Processes();

  return PROJECT_CONFIGS.map((config) => {
    const commits = getGitCommits(config.repo);
    const pm2 =
      pm2Processes.find(
        (p) =>
          p.name === config.slug ||
          p.name === config.name.toLowerCase().replace(/\s+/g, '-') ||
          (config.slug === 'openclaw' && p.name === 'openclaw')
      ) ?? null;
    const backlogContent = getBacklogContent(config.backlogFile);

    return {
      ...config,
      commits,
      pm2,
      backlogContent,
    };
  });
}

export function getProjectData(slug: string): ProjectData | null {
  const all = getAllProjectData();
  return all.find((p) => p.slug === slug) ?? null;
}
