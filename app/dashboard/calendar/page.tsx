import Link from 'next/link';
import fs from 'fs';

export const dynamic = 'force-dynamic';

interface CronJob {
  id: string;
  name: string;
  agentId: string;
  enabled: boolean;
  schedule: { kind: string; expr: string; tz: string };
  payload?: { message?: string };
  delivery?: { channel?: string; to?: string };
  createdAtMs?: number;
}

function parseCronExpr(expr: string): string {
  const parts = expr.split(' ');
  if (parts.length !== 5) return expr;
  const [min, hour, dom, month, dow] = parts;
  if (dom === '*' && month === '*' && dow === '*') {
    return `Every day at ${hour.padStart(2,'0')}:${min.padStart(2,'0')}`;
  }
  if (dow !== '*') {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return `Every ${days[Number(dow)]} at ${hour.padStart(2,'0')}:${min.padStart(2,'0')}`;
  }
  return expr;
}

function nextRun(expr: string, tz: string): string {
  try {
    const parts = expr.split(' ');
    const [min, hour] = parts;
    const now = new Date();
    const kyivNow = new Date(now.toLocaleString('en-US', { timeZone: tz }));
    const next = new Date(kyivNow);
    next.setHours(Number(hour), Number(min), 0, 0);
    if (next <= kyivNow) next.setDate(next.getDate() + 1);
    const diff = Math.round((next.getTime() - kyivNow.getTime()) / 60000);
    if (diff < 60) return `in ${diff}m`;
    return `in ${Math.floor(diff / 60)}h ${diff % 60}m`;
  } catch {
    return '—';
  }
}

function getCronJobs(): CronJob[] {
  try {
    const raw = fs.readFileSync('/home/ubuntu/.openclaw/cron/jobs.json', 'utf-8');
    return JSON.parse(raw).jobs ?? [];
  } catch {
    return [];
  }
}

const HOUR_LABELS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2,'0')}:00`);
const AGENT_COLORS: Record<string, string> = {
  finance: 'border-green-500 bg-green-950/40 text-green-300',
  scout:   'border-blue-500 bg-blue-950/40 text-blue-300',
  main:    'border-yellow-500 bg-yellow-950/40 text-yellow-300',
  klepka:  'border-violet-500 bg-violet-950/40 text-violet-300',
  dev:     'border-orange-500 bg-orange-950/40 text-orange-300',
};

export default function CalendarPage() {
  const jobs = getCronJobs();
  const now = new Date();
  const kyivHour = Number(new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Kyiv' })).getHours());

  return (
    <main className="min-h-screen bg-black text-green-500 font-mono p-4 md:p-6">
      <header className="border-b border-green-900 pb-4 mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <div className="text-green-900 text-xs tracking-[0.35em] mb-1">MISSION CONTROL</div>
          <h1 className="text-3xl font-black text-green-300">CRON CALENDAR</h1>
          <div className="flex gap-4 mt-2 text-xs text-green-800">
            <span>{jobs.length} scheduled jobs</span>
            <span>{jobs.filter(j => j.enabled).length} active</span>
          </div>
        </div>
        <Link href="/dashboard" className="border border-green-900 px-3 py-1.5 text-green-800 hover:text-green-400 text-xs">← dashboard</Link>
      </header>

      {/* Timeline */}
      <section className="mb-8">
        <div className="text-xs text-green-900 tracking-widest mb-3">{'// 24H TIMELINE (Kyiv)'}</div>
        <div className="relative border border-green-950 bg-zinc-950/50 overflow-x-auto">
          {/* Hour markers */}
          <div className="flex border-b border-green-950 min-w-[960px]">
            {HOUR_LABELS.map((h, i) => (
              <div key={h} className={`flex-1 text-center text-[9px] py-1 border-r border-green-950 ${i === kyivHour ? 'text-yellow-500 bg-yellow-950/20' : 'text-green-950'}`}>
                {i % 2 === 0 ? h : ''}
              </div>
            ))}
          </div>
          {/* Job bars */}
          <div className="min-w-[960px] relative p-2 space-y-2">
            {jobs.map(job => {
              const hour = Number(job.schedule.expr.split(' ')[1]);
              const left = (hour / 24) * 100;
              const color = AGENT_COLORS[job.agentId] ?? 'border-green-700 bg-green-950/30 text-green-400';
              return (
                <div key={job.id} className="relative h-8">
                  <div
                    className={`absolute border ${color} px-2 flex items-center text-[10px] font-bold h-full rounded`}
                    style={{ left: `${left}%`, width: '8%' }}
                  >
                    {job.name.split(' ').slice(0, 2).join(' ')}
                  </div>
                </div>
              );
            })}
            {/* Now indicator */}
            <div className="absolute top-0 bottom-0 w-px bg-yellow-500/60" style={{ left: `${(kyivHour / 24) * 100}%` }} />
          </div>
        </div>
      </section>

      {/* Job cards */}
      <section>
        <div className="text-xs text-green-900 tracking-widest mb-3">{'// SCHEDULED JOBS'}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map(job => {
            const color = AGENT_COLORS[job.agentId] ?? 'border-green-800';
            const label = parseCronExpr(job.schedule.expr);
            const next = nextRun(job.schedule.expr, job.schedule.tz);
            return (
              <div key={job.id} className={`border ${color.split(' ')[0]} bg-zinc-950/60 p-4`}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="text-green-200 font-bold">{job.name}</div>
                    <div className="text-green-800 text-xs mt-1">agent: {job.agentId}</div>
                  </div>
                  <span className={`text-[10px] border px-2 py-0.5 ${job.enabled ? 'border-green-700 text-green-400' : 'border-red-900 text-red-600'}`}>
                    {job.enabled ? 'ACTIVE' : 'DISABLED'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs border-t border-green-950 pt-3">
                  <div>
                    <div className="text-green-900 text-[10px] mb-0.5">SCHEDULE</div>
                    <div className="text-green-400">{label}</div>
                    <div className="text-green-800 text-[10px] mt-0.5">{job.schedule.expr} ({job.schedule.tz})</div>
                  </div>
                  <div>
                    <div className="text-green-900 text-[10px] mb-0.5">NEXT RUN</div>
                    <div className="text-yellow-400">{next}</div>
                    <div className="text-green-800 text-[10px] mt-0.5">{job.delivery?.channel ?? '—'}</div>
                  </div>
                </div>
                {job.payload?.message && (
                  <div className="mt-3 border-t border-green-950 pt-2">
                    <div className="text-green-900 text-[10px] mb-1">TASK PREVIEW</div>
                    <div className="text-green-700 text-[10px] line-clamp-2 leading-relaxed">
                      {job.payload.message.slice(0, 120)}…
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
