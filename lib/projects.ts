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
    localPort: null,
    backlogFile: '/home/molt/clawd/projects/dental-passport-ios/FEATURE_BACKLOG.md',
    whatsnext: 'Build Emergency Travel Guide feature (offline-first, confirmed by Nazartsio)',
    todos: [
      '🏥 Emergency Travel Guide — tooth knocked out offline flow',
      '🛡️ Insurance Tracker — claim status + reimbursement log',
      '🤖 AI Triage — "Should I Go Today?" symptom checker',
      '⌚ HealthKit integration — toothbrushingEvent + Clinical Records',
      '🍎 App Clip — scan QR at dentist, instant record view',
      '📋 FEATURE_BACKLOG.md has 33+ ideas rated by impact',
      '🧪 Awaiting Xcode testing on real device (Nazartsio)',
    ],
    wiki: {
      features: [
        'Google Sign-In authentication',
        'Dental photo sync + timeline view',
        'Swift 6 concurrency + SwiftData',
        'Doppler integration for secrets',
        'SPM fix scripts (fix-packages.sh + Makefile)',
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
        'Pricing: freemium → $4.99/mo or $29.99 one-time',
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
    status: 'READY',
    localPort: null,
    backlogFile: null,
    whatsnext: 'Configure Supabase + test locally, then deploy to Vercel',
    todos: [
      '🗄️ Set up Supabase project + run schema migrations',
      '🔑 Add NEXT_PUBLIC_SUPABASE_URL + ANON_KEY to .env.local',
      '🧪 Test Account CRUD + Transaction CRUD locally',
      '🚀 Deploy to Vercel',
      '💳 Monobank API integration (real bank sync)',
      '📊 Add charts — spending by category, monthly trends',
    ],
  },
  {
    slug: 'linkedin-ai',
    name: 'LinkedIn AI Extension',
    emoji: '🤝',
    repo: '/home/molt/clawd/projects/linkedin-ai-extension',
    github: 'https://github.com/nt-petrulio/linkedin-ai-extension',
    status: 'READY',
    localPort: null,
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
    slug: 'yt-video-staging',
    name: 'YT Video Staging',
    emoji: '📹',
    repo: '/home/molt/clawd/projects/yt-video-staging',
    github: 'https://github.com/nt-petrulio/yt-video-staging',
    status: 'READY',
    localPort: null,
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
