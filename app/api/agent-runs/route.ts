import { NextRequest, NextResponse } from 'next/server';
import { createAgentRun, getAgentRuns, saveAgentRuns, updateAgentRun, type AgentRun } from '@/lib/agent-runs';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(getAgentRuns());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const run = createAgentRun(body as Partial<AgentRun>);
  if (!run.target || !run.signal || !run.draft) {
    return NextResponse.json({ error: 'target, signal, and draft are required' }, { status: 400 });
  }

  const runs = getAgentRuns();
  runs.unshift(run);
  saveAgentRuns(runs);
  return NextResponse.json(run, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json() as Partial<AgentRun> & { id?: string };
  if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const runs = getAgentRuns();
  const index = runs.findIndex((run) => run.id === body.id);
  if (index === -1) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const updated = updateAgentRun(runs[index], body);
  runs[index] = updated;
  saveAgentRuns(runs);
  return NextResponse.json(updated);
}
