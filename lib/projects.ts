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
