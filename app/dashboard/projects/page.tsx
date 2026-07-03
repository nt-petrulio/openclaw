import Link from 'next/link';
import { getAllProjectData, getGitLastCommitDate } from '@/lib/projects';

export const dynamic = 'force-dynamic';

const STATUS_STYLES: Record<string, string> = {
  LIVE:     'border-emerald-500 text-emerald-300 bg-emerald-950/50',
  READY:    'border-lime-700 text-lime-300 bg-lime-950/30',
  'IN DEV': 'border-yellow-600 text-yellow-300 bg-yellow-950/30',
  DONE:     'border-blue-700 text-blue-300 bg-blue-950/30',
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'no commits';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '—';
  const diff = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (diff <= 0) return 'today';
  if (diff === 1) return 'yesterday';
  if (diff < 7) return `${diff}d ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  return `${Math.floor(diff / 30)}mo ago`;
}

export default function ProjectsPage() {
  const projects = getAllProjectData().map(p => ({
    ...p,
    lastCommitDate: getGitLastCommitDate(p.repo),
  }));
  const byStatus = {
    'IN DEV': projects.filter(p => p.status === 'IN DEV'),
    'LIVE':   projects.filter(p => p.status === 'LIVE'),
    'READY':  projects.filter(p => p.status === 'READY'),
    'DONE':   projects.filter(p => p.status === 'DONE'),
  };

  return (
    <main className="min-h-screen bg-black text-green-500 font-mono p-4 md:p-6">
      <header className="border-b border-green-900 pb-4 mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <div className="text-green-900 text-xs tracking-[0.35em] mb-1">MISSION CONTROL</div>
          <h1 className="text-3xl font-black text-green-300">PROJECTS</h1>
          <div className="flex gap-4 mt-2 text-xs text-green-800">
            <span>{projects.length} total</span>
            <span>{byStatus['IN DEV'].length} in dev</span>
            <span>{byStatus['LIVE'].length} live</span>
          </div>
        </div>
        <Link href="/dashboard" className="border border-green-900 px-3 py-1.5 text-green-800 hover:text-green-400 text-xs">← dashboard</Link>
      </header>

      {(['IN DEV', 'LIVE', 'READY', 'DONE'] as const).map(status => {
        const group = byStatus[status];
        if (!group.length) return null;
        return (
          <section key={status} className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs text-green-900 tracking-widest">{`// ${status}`}</span>
              <span className="text-xs border border-green-950 px-2 py-0.5 text-green-800">{group.length}</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {group.map(p => {
                const pm2Online = p.pm2?.status === 'online';
                return (
                  <Link key={p.slug} href={`/dashboard/${p.slug}`}
                    className="block border border-green-950 hover:border-green-700 bg-zinc-950/60 p-4 transition-colors group">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-2xl">{p.emoji}</span>
                        <div className="min-w-0">
                          <h3 className="font-bold text-green-300 group-hover:text-green-100 truncate">{p.name}</h3>
                          {p.github && (
                            <div className="text-green-900 text-[10px] truncate">{p.github.replace('https://github.com/', '')}</div>
                          )}
                        </div>
                      </div>
                      <span className={`shrink-0 border px-2 py-0.5 text-[10px] ${STATUS_STYLES[p.status] ?? 'border-green-900 text-green-700'}`}>
                        {p.status}
                      </span>
                    </div>

                    <p className="text-green-800 text-xs mb-3 line-clamp-1">→ {p.whatsnext}</p>

                    {p.todos.length > 0 && (
                      <div className="mb-3 space-y-1">
                        {p.todos.slice(0, 3).map((t, i) => (
                          <div key={i} className="text-[11px] text-green-900 flex gap-2">
                            <span className="text-green-950">[ ]</span>
                            <span className="line-clamp-1">{t}</span>
                          </div>
                        ))}
                        {p.todos.length > 3 && (
                          <div className="text-[10px] text-green-950">+{p.todos.length - 3} more</div>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-2 text-[11px] text-green-900 border-t border-green-950 pt-3">
                      <span>{formatDate(p.lastCommitDate)}</span>
                      <span>{p.localPort ? `:${p.localPort}` : 'no port'}</span>
                      <span className={p.pm2 ? (pm2Online ? 'text-green-400' : 'text-red-500') : ''}>
                        {p.pm2 ? `pm2 ${p.pm2.status}` : 'no pm2'}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </main>
  );
}
