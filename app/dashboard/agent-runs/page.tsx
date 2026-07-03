import Link from 'next/link';
import { getAgentRuns, type AgentRun } from '@/lib/agent-runs';
import AgentRunForm from './AgentRunForm';

export const dynamic = 'force-dynamic';

const APPROVAL_STYLES: Record<string, string> = {
  draft: 'border-yellow-900 text-yellow-300 bg-yellow-950/20',
  approved: 'border-blue-900 text-blue-300 bg-blue-950/20',
  rejected: 'border-red-900 text-red-300 bg-red-950/20',
  sent: 'border-emerald-900 text-emerald-300 bg-emerald-950/20',
};

const OUTCOME_STYLES: Record<string, string> = {
  not_sent: 'border-green-950 text-green-800',
  sent: 'border-blue-950 text-blue-400',
  reply: 'border-cyan-900 text-cyan-300',
  meeting: 'border-violet-900 text-violet-300',
  sale: 'border-emerald-900 text-emerald-300',
  bad_fit: 'border-orange-900 text-orange-300',
  no_reply: 'border-zinc-800 text-zinc-400',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return 'unknown';
  return date.toLocaleString('en-GB', {
    timeZone: 'Europe/Kyiv',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function fitTone(score: number): string {
  if (score >= 80) return 'text-emerald-300 border-emerald-900';
  if (score >= 60) return 'text-yellow-300 border-yellow-900';
  return 'text-green-800 border-green-950';
}

function RunCard({ run }: { run: AgentRun }) {
  return (
    <article className="border border-green-950 bg-zinc-950/60 p-4">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div className="min-w-0">
          <div className="text-green-900 text-[10px] tracking-widest uppercase">
            {run.ownerAgent} · {run.channel} · {formatDate(run.updatedAt)} Kyiv
          </div>
          <h2 className="text-green-300 font-bold mt-1 truncate">{run.target}</h2>
          {run.product && <div className="text-green-800 text-xs mt-1">product: {run.product}</div>}
        </div>
        <div className="flex gap-2 shrink-0">
          <span className={`border px-2 py-1 text-[10px] ${fitTone(run.fitScore)}`}>{run.fitScore}/100</span>
          <span className={`border px-2 py-1 text-[10px] ${APPROVAL_STYLES[run.approvalStatus] ?? APPROVAL_STYLES.draft}`}>
            {run.approvalStatus}
          </span>
          <span className={`border px-2 py-1 text-[10px] ${OUTCOME_STYLES[run.outcome] ?? OUTCOME_STYLES.not_sent}`}>
            {run.outcome.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
        <div className="border border-green-950 p-3">
          <div className="text-green-950 text-[10px] uppercase mb-1">signal</div>
          <p className="text-green-700 text-sm leading-relaxed">{run.signal}</p>
        </div>
        <div className="border border-green-950 p-3">
          <div className="text-green-950 text-[10px] uppercase mb-1">offer angle</div>
          <p className="text-green-700 text-sm leading-relaxed">{run.offerAngle || 'not set'}</p>
        </div>
      </div>

      <div className="border border-green-950 p-3 mt-3">
        <div className="text-green-950 text-[10px] uppercase mb-1">draft for approval</div>
        <p className="text-green-500 text-sm leading-relaxed whitespace-pre-wrap">{run.draft}</p>
      </div>

      {run.notes && (
        <div className="text-green-900 text-xs mt-3 border-t border-green-950 pt-3">
          notes: {run.notes}
        </div>
      )}
    </article>
  );
}

export default function AgentRunsPage() {
  const runs = getAgentRuns();
  const drafts = runs.filter((run) => run.approvalStatus === 'draft');
  const approved = runs.filter((run) => run.approvalStatus === 'approved');
  const wins = runs.filter((run) => run.outcome === 'meeting' || run.outcome === 'sale');

  return (
    <main className="min-h-screen bg-black text-green-500 font-mono p-6 md:p-8">
      <header className="border-b border-green-900 pb-5 mb-7 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-green-900 text-xs tracking-[0.35em] mb-2">MISSION CONTROL</div>
          <h1 className="text-4xl font-black text-green-300">AGENT RUNS</h1>
          <p className="text-green-800 text-sm mt-2">Approval-first records for Pipeline Scout and future revenue agents.</p>
        </div>
        <Link href="/dashboard" className="text-green-800 hover:text-green-400">← dashboard</Link>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
        <div className="border border-green-950 p-4 bg-zinc-950/50">
          <div className="text-3xl font-black text-green-300">{runs.length}</div>
          <div className="text-green-900 text-xs mt-1">total runs</div>
        </div>
        <div className="border border-yellow-950 p-4 bg-yellow-950/10">
          <div className="text-3xl font-black text-yellow-300">{drafts.length}</div>
          <div className="text-yellow-900 text-xs mt-1">awaiting approval</div>
        </div>
        <div className="border border-blue-950 p-4 bg-blue-950/10">
          <div className="text-3xl font-black text-blue-300">{approved.length}</div>
          <div className="text-blue-900 text-xs mt-1">approved</div>
        </div>
        <div className="border border-emerald-950 p-4 bg-emerald-950/10">
          <div className="text-3xl font-black text-emerald-300">{wins.length}</div>
          <div className="text-emerald-900 text-xs mt-1">meetings or sales</div>
        </div>
      </section>

      <section className="border border-yellow-950 bg-yellow-950/5 p-4 mb-6 text-sm text-yellow-200">
        <span className="text-yellow-600">Rule:</span> this page only creates and reviews approval drafts. No message can be sent and no CRM can be touched from here.
      </section>

      <AgentRunForm />

      <section className="space-y-4">
        {runs.map((run) => <RunCard key={run.id} run={run} />)}
        {runs.length === 0 && (
          <div className="border border-green-950 bg-zinc-950/50 p-8 text-center">
            <div className="text-green-800">No agent runs yet.</div>
            <p className="text-green-950 text-xs mt-2">POST to /mc/api/agent-runs when Pipeline Scout has the first approved draft candidate.</p>
          </div>
        )}
      </section>
    </main>
  );
}
