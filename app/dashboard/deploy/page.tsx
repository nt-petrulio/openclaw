import Link from 'next/link';
import { getAllProjectData, formatUptime, formatBytes } from '@/lib/projects';

export const dynamic = 'force-dynamic';

export default async function DeployPage() {
  const projects = getAllProjectData();
  const deployable = projects.filter((p) => p.proxyPath || p.localPort || p.pm2);
  const online = deployable.filter((p) => p.pm2?.status === 'online');

  return (
    <main className="min-h-screen bg-black text-green-500 font-mono p-6 md:p-8">
      <header className="border-b border-green-900 pb-5 mb-7 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-green-900 text-xs tracking-[0.35em] mb-2">MISSION CONTROL</div>
          <h1 className="text-4xl font-black text-green-300">DEPLOY</h1>
          <p className="text-green-800 text-sm mt-2">{online.length}/{deployable.length} deployable apps online via PM2/proxy metadata</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/apps" className="border border-green-800 px-3 py-2 hover:border-green-400">App Launcher</Link>
          <Link href="/dashboard" className="text-green-800 hover:text-green-400 px-3 py-2">← dashboard</Link>
        </div>
      </header>

      <section className="space-y-3">
        {deployable.map((project) => {
          const online = project.pm2?.status === 'online';
          return (
            <div key={project.slug} className="border border-green-950 bg-zinc-950/60 p-4">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 lg:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{project.emoji}</span>
                    <Link href={`/dashboard/${project.slug}`} className="font-bold text-green-300 hover:text-green-100">{project.name}</Link>
                    <span className={`inline-block w-2 h-2 rounded-full ${online ? 'bg-green-400 animate-pulse' : project.pm2 ? 'bg-red-600' : 'bg-green-950'}`} />
                  </div>
                  <p className="text-green-800 text-xs mt-2">{project.whatsnext}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {project.proxyPath && <a href={project.proxyPath} target="_blank" rel="noreferrer" className="border border-green-700 px-3 py-1 text-green-400 hover:border-green-300">open {project.proxyPath} ↗</a>}
                  {project.localPort && <span className="border border-green-950 px-3 py-1 text-green-800">localhost:{project.localPort}</span>}
                  <a href={project.github} target="_blank" rel="noreferrer" className="border border-green-950 px-3 py-1 text-green-800 hover:text-green-400">github ↗</a>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs mt-4 border-t border-green-950 pt-3">
                <div><span className="text-green-900">status</span><br/><span className={online ? 'text-green-400' : 'text-red-500'}>{project.pm2?.status ?? 'not in pm2'}</span></div>
                <div><span className="text-green-900">uptime</span><br/><span className="text-green-700">{formatUptime(project.pm2?.uptime ?? null)}</span></div>
                <div><span className="text-green-900">restarts</span><br/><span className="text-green-700">{project.pm2?.restarts ?? '—'}</span></div>
                <div><span className="text-green-900">cpu</span><br/><span className="text-green-700">{project.pm2 ? `${project.pm2.cpu}%` : '—'}</span></div>
                <div><span className="text-green-900">memory</span><br/><span className="text-green-700">{project.pm2 ? formatBytes(project.pm2.memory) : '—'}</span></div>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
