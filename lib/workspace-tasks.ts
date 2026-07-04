// SERVER-ONLY: reads the workspace task file from disk.
import fs from 'fs';
import path from 'path';

export type WorkspaceTask = {
  id: string;
  title: string;
  status: string;
  priority: string;
  source?: string;
  project?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

const workspaceDir = process.env.OPENCLAW_WORKSPACE_DIR ?? path.resolve(process.cwd(), '..', '..');
const tasksFile = path.join(workspaceDir, 'tasks.json');

function isWorkspaceTask(value: unknown): value is WorkspaceTask {
  if (!value || typeof value !== 'object') return false;
  const task = value as Record<string, unknown>;
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.status === 'string' &&
    typeof task.priority === 'string'
  );
}

export function getWorkspaceTasks(): WorkspaceTask[] {
  try {
    const raw = fs.readFileSync(tasksFile, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isWorkspaceTask);
  } catch {
    return [];
  }
}
