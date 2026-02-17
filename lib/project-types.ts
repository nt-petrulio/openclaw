// Pure types and utility functions — safe to import in client components

export type ProjectStatus = 'IN DEV' | 'READY' | 'LIVE' | 'DONE';

export interface Competitor {
  name: string;
  url: string;
  extension: boolean;
  freePlan: string | null;  // null = no free plan
  pricing: string;
  gap: string;              // what they're missing / our advantage
}

export interface ProjectWiki {
  features: string[];
  risks: string[];
  marketing: string[];
  seo: string[];
  competitors?: Competitor[];
}

export interface ProjectConfig {
  slug: string;
  name: string;
  emoji: string;
  repo: string;
  github: string;
  status: ProjectStatus;
  localPort: number | null;
  proxyPath: string | null;  // gateway proxy path e.g. /excuse/ or /mc/
  backlogFile: string | null;
  whatsnext: string;
  todos: string[];
  wiki?: ProjectWiki;
}

export interface GitCommit {
  hash: string;
  message: string;
}

export interface PM2Process {
  name: string;
  pm_id: number;
  status: string;
  uptime: number | null;
  pid: number | null;
  restarts: number;
  cpu: number;
  memory: number;
}

export interface ProjectData extends ProjectConfig {
  commits: GitCommit[];
  pm2: PM2Process | null;
  backlogContent: string | null;
}

export function formatUptime(uptimeMs: number | null): string {
  if (uptimeMs === null) return '—';
  const now = Date.now();
  const diff = now - uptimeMs;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(1)} MB`;
}
