// SERVER-ONLY: file-backed agent run records for approval-first workflows.
import fs from 'fs';
import path from 'path';

export type AgentRunChannel = 'linkedin' | 'email' | 'telegram' | 'instagram' | 'other';
export type AgentRunApprovalStatus = 'draft' | 'approved' | 'rejected' | 'sent';
export type AgentRunOutcome = 'not_sent' | 'sent' | 'reply' | 'meeting' | 'sale' | 'bad_fit' | 'no_reply';

export interface AgentRun {
  id: string;
  target: string;
  channel: AgentRunChannel;
  signal: string;
  fitScore: number;
  offerAngle: string;
  draft: string;
  approvalStatus: AgentRunApprovalStatus;
  outcome: AgentRunOutcome;
  ownerAgent: string;
  product?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const AGENT_RUNS_FILE = '/home/ubuntu/.openclaw/workspace/agent-runs.json';

function clampFitScore(value: unknown): number {
  const score = Number(value);
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function normalizeChannel(value: unknown): AgentRunChannel {
  const channel = String(value || 'other').toLowerCase();
  if (['linkedin', 'email', 'telegram', 'instagram', 'other'].includes(channel)) {
    return channel as AgentRunChannel;
  }
  return 'other';
}

function normalizeApprovalStatus(value: unknown): AgentRunApprovalStatus {
  const status = String(value || 'draft').toLowerCase();
  if (['draft', 'approved', 'rejected', 'sent'].includes(status)) {
    return status as AgentRunApprovalStatus;
  }
  return 'draft';
}

function normalizeOutcome(value: unknown): AgentRunOutcome {
  const outcome = String(value || 'not_sent').toLowerCase();
  if (['not_sent', 'sent', 'reply', 'meeting', 'sale', 'bad_fit', 'no_reply'].includes(outcome)) {
    return outcome as AgentRunOutcome;
  }
  return 'not_sent';
}

export function getAgentRuns(): AgentRun[] {
  if (!fs.existsSync(AGENT_RUNS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(AGENT_RUNS_FILE, 'utf8')) as AgentRun[];
  } catch {
    return [];
  }
}

export function saveAgentRuns(runs: AgentRun[]): void {
  fs.mkdirSync(path.dirname(AGENT_RUNS_FILE), { recursive: true });
  fs.writeFileSync(AGENT_RUNS_FILE, JSON.stringify(runs, null, 2));
}

export function createAgentRun(input: Partial<AgentRun>): AgentRun {
  const now = new Date().toISOString();
  return {
    id: input.id || `agent-run-${Date.now()}`,
    target: String(input.target || '').trim(),
    channel: normalizeChannel(input.channel),
    signal: String(input.signal || '').trim(),
    fitScore: clampFitScore(input.fitScore),
    offerAngle: String(input.offerAngle || '').trim(),
    draft: String(input.draft || '').trim(),
    approvalStatus: normalizeApprovalStatus(input.approvalStatus),
    outcome: normalizeOutcome(input.outcome),
    ownerAgent: String(input.ownerAgent || 'Pipeline Scout').trim(),
    product: input.product ? String(input.product).trim() : undefined,
    notes: input.notes ? String(input.notes).trim() : undefined,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateAgentRun(existing: AgentRun, input: Partial<AgentRun>): AgentRun {
  return {
    ...existing,
    target: input.target !== undefined ? String(input.target).trim() : existing.target,
    channel: input.channel !== undefined ? normalizeChannel(input.channel) : existing.channel,
    signal: input.signal !== undefined ? String(input.signal).trim() : existing.signal,
    fitScore: input.fitScore !== undefined ? clampFitScore(input.fitScore) : existing.fitScore,
    offerAngle: input.offerAngle !== undefined ? String(input.offerAngle).trim() : existing.offerAngle,
    draft: input.draft !== undefined ? String(input.draft).trim() : existing.draft,
    approvalStatus: input.approvalStatus !== undefined ? normalizeApprovalStatus(input.approvalStatus) : existing.approvalStatus,
    outcome: input.outcome !== undefined ? normalizeOutcome(input.outcome) : existing.outcome,
    ownerAgent: input.ownerAgent !== undefined ? String(input.ownerAgent).trim() : existing.ownerAgent,
    product: input.product !== undefined ? String(input.product).trim() : existing.product,
    notes: input.notes !== undefined ? String(input.notes).trim() : existing.notes,
    updatedAt: new Date().toISOString(),
  };
}
