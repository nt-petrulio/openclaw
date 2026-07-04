// SERVER-ONLY: uses Node.js fs/path
import fs from 'fs';
import path from 'path';

export type TaskStatus = 'backlog' | 'todo' | 'doing' | 'done';
export type TaskPriority = 'P1' | 'P2' | 'P3' | 'P4';
export type TaskSource = 'backlog' | 'cron' | 'manual';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  source: TaskSource;
  project?: string;
  notes?: string;
  href?: string;
  actionLabel?: string;
  deleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CronJob {
  id: string;
  name: string;
  agentId: string;
  schedule: string;
  tz: string;
  enabled: boolean;
  nextRun?: string;
}

const TASKS_FILE = '/home/ubuntu/.openclaw/workspace/tasks.json';
const BACKLOG_FILE = '/home/ubuntu/.openclaw/workspace/BACKLOG.md';
const CRON_FILE = '/home/ubuntu/.openclaw/cron/jobs.json';

function priorityFromLabel(label: string): TaskPriority {
  const l = label.toUpperCase();
  if (l === 'H') return 'P1';
  if (l === 'M') return 'P2';
  if (l === 'L') return 'P3';
  return 'P4';
}

export function parseBacklogTasks(): Task[] {
  if (!fs.existsSync(BACKLOG_FILE)) return [];
  const content = fs.readFileSync(BACKLOG_FILE, 'utf8');
  const tasks: Task[] = [];

  const lineRe = /^-\s*\[( |x)\]\s*\*\*([^*]+)\*\*\s*[—-]?\s*([^|]+?)(?:\s*\|\s*P:\s*([HML]))?(?:\s*\|\s*(.+))?$/;

  for (const line of content.split('\n')) {
    const m = line.match(lineRe);
    if (!m) continue;
    const done = m[1] === 'x';
    const title = m[2].trim();
    const notes = m[3]?.trim() || '';
    const priority = priorityFromLabel(m[4] || 'L');
    const project = m[5]?.trim() || '';

    tasks.push({
      id: `backlog-${Buffer.from(title).toString('hex').slice(0, 12)}`,
      title,
      status: done ? 'done' : 'backlog',
      priority,
      source: 'backlog',
      project,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return tasks;
}

export function getCronJobs(): CronJob[] {
  if (!fs.existsSync(CRON_FILE)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(CRON_FILE, 'utf8'));
    return (data.jobs || []).map((j: Record<string, unknown>) => ({
      id: j.id as string,
      name: j.name as string,
      agentId: j.agentId as string,
      schedule: (j.schedule as { expr: string }).expr,
      tz: (j.schedule as { tz: string }).tz,
      enabled: j.enabled as boolean,
    }));
  } catch {
    return [];
  }
}

export function getManualTasks(): Task[] {
  if (!fs.existsSync(TASKS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8')) as Task[];
  } catch {
    return [];
  }
}

export function saveManualTasks(tasks: Task[]): void {
  fs.mkdirSync(path.dirname(TASKS_FILE), { recursive: true });
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

export function getAllTasks(): Task[] {
  const manual = getManualTasks();
  const backlog = parseBacklogTasks();

  // Merge: manual tasks override backlog status if same id
  const manualIds = new Set(manual.map((t) => t.id));
  const filteredBacklog = backlog.filter((t) => !manualIds.has(t.id));

  return [...manual.filter((t) => !t.deleted), ...filteredBacklog];
}
