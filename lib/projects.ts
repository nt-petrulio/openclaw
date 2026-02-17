// SERVER-ONLY: this file uses Node.js built-ins, never import in client components
import { execSync } from 'child_process';
import fs from 'fs';
import type { ProjectConfig, ProjectData, GitCommit, PM2Process } from './project-types';

export type { ProjectStatus, ProjectConfig, GitCommit, PM2Process, ProjectData } from './project-types';
export { formatUptime, formatBytes } from './project-types';

export const PROJECT_CONFIGS: ProjectConfig[] = [
  {
    slug: 'dental-passport',
    name: 'Dental Passport iOS',
    emoji: '🦷',
    repo: '/home/molt/clawd/projects/dental-passport-ios',
    github: 'https://github.com/nt-petrulio/dental-passport-ios',
    status: 'IN DEV',
    localPort: null,
    backlogFile: '/home/molt/clawd/projects/dental-passport-ios/FEATURE_BACKLOG.md',
    whatsnext: 'Implement Emergency Travel Guide + Insurance Tracker features',
    todos: [
      'Build offline Emergency Travel Guide (tooth knocked out flow)',
      'Implement Insurance Tracker with claim status tracking',
      'Add AI Triage: "Should I Go Today?" symptom checker',
      'Dental tourism price comparison map',
    ],
  },
  {
    slug: 'mission-control',
    name: 'OpenClaw',
    emoji: '🎯',
    repo: '/home/molt/clawd/projects/openclaw',
    github: 'https://github.com/nt-petrulio/openclaw',
    status: 'LIVE',
    localPort: 3000,
    backlogFile: null,
    whatsnext: 'Mission Control v2 — project ops dashboard',
    todos: [
      'Add real-time uptime monitoring widget',
      'Connect Notion tasks to project cards',
      'Add MRR tracker with Stripe integration',
      'Mobile-responsive layout pass',
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
    whatsnext: 'Launch MVP — personal finance tracker with multi-currency support',
    todos: [
      'Set up Next.js project scaffold',
      'Design transaction input UI',
      'Add currency conversion API integration',
      'Implement budget categories and charts',
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
    whatsnext: 'Build AI-powered outreach message generator Chrome extension',
    todos: [
      'Set up Chrome extension manifest v3 scaffold',
      'Design side panel UI for message generation',
      'Integrate OpenAI/Claude API for message drafting',
      'Add profile scraping to personalize messages',
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
    whatsnext: 'Launch Ukrainian grant database with search and filters',
    todos: [
      'Scrape and normalize grant data from official sources',
      'Build search + filter UI',
      'Add email alerts for new grants',
      'Deploy to production',
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
    whatsnext: 'Build YouTube video staging and review workflow tool',
    todos: [
      'Set up video upload and preview interface',
      'Add title/description/thumbnail editor',
      'Implement review and approval workflow',
      'YouTube API integration for publishing',
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
    return list.map((p: any) => ({
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
          (config.slug === 'mission-control' && p.name === 'openclaw')
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
