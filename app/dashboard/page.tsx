import Link from 'next/link';
import { getAllProjectData, getGitLastCommitDate, ProjectData } from '@/lib/projects';

function statusStyle(status: string) {
  switch (status) {
    case 'LIVE':
      return 'border-green-500 text-green-400';
    case 'IN DEV':
      return 'border-yellow-600 text-yellow-500';
    case 'DONE':
      return 'border-blue-600 text-blue-400';
    default:
      return 'border-green-900 text-green-800';
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'no commits';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000 / 60 / 60 / 24);
    if (diff === 0) return 'today';
    if (diff === 1) return 'yesterday';
    if (diff < 7) return `${diff}d ago`;
    if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
    return `${Math.floor(diff / 30)}mo ago`;
  } catch {
    return 'unknown';
  }
}

export default async function Dashboard() {
  const projects = getAllProjectData();

  const projectsWithDate = projects.map((p: ProjectData) => ({
    ...p,
    lastCommitDate: getGitLastCommitDate(p.repo),
  }));

  const byStatus: Record<string, typeof projectsWithDate> = {
    LIVE: projectsWithDate.filter((p) => p.status === 'LIVE'),
    'IN DEV': projectsWithDate.filter((p) => p.status === 'IN DEV'),
    READY: projectsWithDate.filter((p) => p.status === 'READY'),
    DONE: projectsWithDate.filter((p) => p.status === 'DONE'),
  };

  return (
    <main className="min-h-screen bg-black text-green-500 font-mono p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-green-900 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-widest">MISSION CONTROL v2.0</h1>
          <p className="text-green-800 text-xs mt-1">
            {projects.length} projects · {new Date().toLocaleString('en-US', { timeZone: 'Europe/Kyiv' })} Kyiv
          </p>
        </div>
        <div className="flex gap-4 text-sm">
          <Link href="/dashboard/apps" className="border border-green-700 px-3 py-1 hover:border-green-400 hover:text-green-300 transition-colors">
            ⚙️ App Launcher
          </Link>
          <Link href="/dashboard/legacy" className="text-green-900 hover:text-green-700 px-3 py-1 transition-colors text-xs">
            legacy →
          </Link>
          <Link href="/" className="text-green-800 hover:text-green-500 px-3 py-1 transition-colors text-xs">
            ← openclaw
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'TOTAL', value: projects.length, color: 'text-green-400' },
          { label: 'LIVE', value: byStatus['LIVE'].length, color: 'text-green-400' },
          { label: 'IN DEV', value: byStatus['IN DEV'].length, color: 'text-yellow-500' },
          { label: 'READY', value: byStatus['READY'].length, color: 'text-green-700' },
        ].map((s) => (
          <div key={s.label} className="border border-green-900 p-3">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-green-900 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Project cards */}
      {Object.entries(byStatus).map(([status, list]) =>
        list.length === 0 ? null : (
          <div key={status} className="mb-8">
            <h2 className="text-xs text-green-800 tracking-widest mb-3">
              // {status}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map((project) => (
                <Link
                  key={project.slug}
                  href={`/dashboard/${project.slug}`}
                  className="border border-green-900 hover:border-green-600 p-4 block transition-colors group"
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{project.emoji}</span>
                      <span className="font-bold group-hover:text-green-300 transition-colors">
                        {project.name}
                      </span>
                    </div>
                    <span className={`text-xs border px-2 py-0.5 shrink-0 ${statusStyle(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  {/* What's next */}
                  <p className="text-green-700 text-xs mb-3 leading-relaxed">
                    → {project.whatsnext}
                  </p>

                  {/* Footer meta */}
                  <div className="flex items-center justify-between text-xs text-green-900 border-t border-green-950 pt-2 mt-2">
                    <span>
                      {project.commits.length > 0
                        ? `last commit: ${formatDate(project.lastCommitDate)}`
                        : 'no commits'}
                    </span>
                    <span className="text-green-800 group-hover:text-green-600 transition-colors">
                      {project.localPort ? `localhost:${project.localPort}` : 'view →'}
                    </span>
                  </div>

                  {/* PM2 indicator */}
                  {project.pm2 && (
                    <div className="mt-2 flex items-center gap-1 text-xs">
                      <span
                        className={`inline-block w-1.5 h-1.5 rounded-full ${
                          project.pm2.status === 'online'
                            ? 'bg-green-400'
                            : 'bg-red-600'
                        }`}
                      />
                      <span className="text-green-800">
                        pm2: {project.pm2.status}
                      </span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )
      )}

      <footer className="border-t border-green-950 pt-6 mt-8 flex justify-between text-green-900 text-xs">
        <span>MISSION CONTROL v2.0 · OpenClaw</span>
        <span>{new Date().toISOString()}</span>
      </footer>
    </main>
  );
}
