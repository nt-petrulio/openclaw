import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectData, formatUptime } from '@/lib/projects';

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectData(slug);
  if (!project) notFound();

  const statusColor =
    project.status === 'LIVE'
      ? 'border-green-500 text-green-400'
      : project.status === 'IN DEV'
      ? 'border-yellow-600 text-yellow-500'
      : 'border-green-900 text-green-800';

  // Parse backlog into sections
  let backlogSections: { title: string; items: string[] }[] = [];
  if (project.backlogContent) {
    const lines = project.backlogContent.split('\n');
    let current: { title: string; items: string[] } | null = null;
    for (const line of lines) {
      if (line.startsWith('### ')) {
        if (current) backlogSections.push(current);
        current = { title: line.replace(/^###\s+/, ''), items: [] };
      } else if (line.startsWith('- ') && current) {
        const item = line.replace(/^-\s+/, '').trim();
        if (item) current.items.push(item);
      }
    }
    if (current) backlogSections.push(current);
    backlogSections = backlogSections.slice(0, 4); // cap at 4 sections
  }

  return (
    <main className="min-h-screen bg-black text-green-500 font-mono p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-green-900 pb-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-green-800 hover:text-green-500 text-sm transition-colors">
            ← MISSION CONTROL
          </Link>
          <span className="text-green-900">/</span>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{project.emoji}</span>
            <h1 className="text-2xl font-bold">{project.name.toUpperCase()}</h1>
            <span className={`text-xs border px-2 py-0.5 ${statusColor}`}>
              {project.status}
            </span>
          </div>
        </div>
        <div className="flex gap-3 text-sm">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="border border-green-900 hover:border-green-600 px-3 py-1 text-green-700 hover:text-green-400 transition-colors"
          >
            GitHub ↗
          </a>
          {project.proxyPath && (
            <a
              href={project.proxyPath}
              target="_blank"
              rel="noreferrer"
              className="border border-green-500 bg-green-950 hover:bg-green-900 hover:border-green-300 px-3 py-1 text-green-400 hover:text-green-200 transition-colors font-bold"
            >
              🚀 Open App
            </a>
          )}
          {!project.proxyPath && project.localPort && (
            <a
              href={`http://localhost:${project.localPort}`}
              target="_blank"
              rel="noreferrer"
              className="border border-green-500 hover:border-green-300 px-3 py-1 text-green-400 hover:text-green-200 transition-colors"
            >
              localhost:{project.localPort} ↗
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* What's been done — git commits */}
          <section className="border border-green-900 p-4">
            <h2 className="text-sm text-green-700 tracking-widest mb-4 border-b border-green-950 pb-2">
              // WHAT&apos;S BEEN DONE
            </h2>
            {project.commits.length > 0 ? (
              <div className="space-y-2">
                {project.commits.map((commit, i) => (
                  <div key={commit.hash} className="flex gap-3 text-sm">
                    <span className="text-green-900 shrink-0 w-4">{i === 0 ? '●' : '○'}</span>
                    <span className="text-green-900 font-mono text-xs shrink-0 w-16">{commit.hash}</span>
                    <span className={i === 0 ? 'text-green-400' : 'text-green-700'}>
                      {commit.message}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-green-900 text-sm">No commits found — repo may be empty or path incorrect.</p>
            )}
          </section>

          {/* What needs to be done */}
          <section className="border border-green-900 p-4">
            <h2 className="text-sm text-green-700 tracking-widest mb-4 border-b border-green-950 pb-2">
              // WHAT NEEDS TO BE DONE
            </h2>
            <div className="space-y-2">
              {project.todos.map((todo, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="text-green-900 shrink-0">[ ]</span>
                  <span className="text-green-600">{todo}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Backlog / Ideas */}
          {backlogSections.length > 0 && (
            <section className="border border-green-900 p-4">
              <h2 className="text-sm text-green-700 tracking-widest mb-4 border-b border-green-950 pb-2">
                // IDEAS & FEATURE BACKLOG
              </h2>
              <div className="space-y-4">
                {backlogSections.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-xs text-green-600 mb-2">{section.title}</h3>
                    <div className="space-y-1 pl-2">
                      {section.items.slice(0, 4).map((item, j) => (
                        <div key={j} className="text-xs text-green-800 flex gap-2">
                          <span className="text-green-900">·</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* No backlog — show static ideas placeholder */}
          {backlogSections.length === 0 && !project.backlogContent && (
            <section className="border border-green-900 p-4">
              <h2 className="text-sm text-green-700 tracking-widest mb-4 border-b border-green-950 pb-2">
                // IDEAS
              </h2>
              <p className="text-green-900 text-xs">
                No backlog file configured. Add a FEATURE_BACKLOG.md to the repo to see ideas here.
              </p>
            </section>
          )}
        </div>

        {/* Right column — meta */}
        <div className="space-y-6">
          {/* What's next */}
          <section className="border border-green-700 p-4">
            <h2 className="text-xs text-green-700 tracking-widest mb-3">// NEXT UP</h2>
            <p className="text-green-400 text-sm leading-relaxed">→ {project.whatsnext}</p>
          </section>

          {/* Links */}
          <section className="border border-green-900 p-4">
            <h2 className="text-xs text-green-700 tracking-widest mb-3">// LINKS</h2>
            <div className="space-y-2 text-xs">
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="flex justify-between text-green-700 hover:text-green-400 transition-colors group"
              >
                <span>GitHub</span>
                <span className="text-green-900 group-hover:text-green-700">↗</span>
              </a>
              {project.proxyPath && (
                <a
                  href={project.proxyPath}
                  target="_blank"
                  rel="noreferrer"
                  className="flex justify-between text-green-400 hover:text-green-200 transition-colors group font-bold"
                >
                  <span>🚀 Open App</span>
                  <span className="text-green-600 group-hover:text-green-400">↗</span>
                </a>
              )}
              {!project.proxyPath && project.localPort && (
                <a
                  href={`http://localhost:${project.localPort}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex justify-between text-green-500 hover:text-green-300 transition-colors group"
                >
                  <span>localhost:{project.localPort}</span>
                  <span className="text-green-700 group-hover:text-green-500">↗</span>
                </a>
              )}
              <Link
                href="/dashboard/apps"
                className="flex justify-between text-green-800 hover:text-green-600 transition-colors group"
              >
                <span>App Launcher</span>
                <span className="text-green-900 group-hover:text-green-700">→</span>
              </Link>
            </div>
          </section>

          {/* PM2 status */}
          {project.pm2 && (
            <section className="border border-green-900 p-4">
              <h2 className="text-xs text-green-700 tracking-widest mb-3">// PM2 STATUS</h2>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-green-900">status</span>
                  <span
                    className={
                      project.pm2.status === 'online' ? 'text-green-400' : 'text-red-500'
                    }
                  >
                    {project.pm2.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-900">uptime</span>
                  <span className="text-green-700">{formatUptime(project.pm2.uptime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-900">restarts</span>
                  <span className="text-green-700">{project.pm2.restarts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-900">cpu</span>
                  <span className="text-green-700">{project.pm2.cpu}%</span>
                </div>
              </div>
            </section>
          )}

          {/* Project meta */}
          <section className="border border-green-900 p-4">
            <h2 className="text-xs text-green-700 tracking-widest mb-3">// META</h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-green-900">slug</span>
                <span className="text-green-800">{project.slug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-900">commits</span>
                <span className="text-green-700">{project.commits.length} loaded</span>
              </div>
              <div>
                <span className="text-green-900">repo</span>
                <p className="text-green-900 mt-1 break-all">{project.repo}</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Wiki Section */}
      {project.wiki && (
        <div className="mt-8 border-t border-green-900 pt-8">
          <h2 className="text-xs text-green-600 tracking-widest mb-6">// PROJECT WIKI</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Features */}
            <section className="border border-green-900 p-4">
              <h3 className="text-xs text-green-600 tracking-widest mb-3">✅ FEATURES BUILT</h3>
              <ul className="space-y-1.5">
                {project.wiki.features.map((f, i) => (
                  <li key={i} className="text-xs text-green-800 flex gap-2">
                    <span className="text-green-900 flex-shrink-0">›</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Risks */}
            <section className="border border-red-950 p-4">
              <h3 className="text-xs text-red-700 tracking-widest mb-3">⚠️ RISKS</h3>
              <ul className="space-y-1.5">
                {project.wiki.risks.map((r, i) => (
                  <li key={i} className="text-xs text-red-900 flex gap-2">
                    <span className="text-red-900 flex-shrink-0">›</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Marketing */}
            <section className="border border-violet-950 p-4">
              <h3 className="text-xs text-violet-700 tracking-widest mb-3">📣 MARKETING</h3>
              <ul className="space-y-1.5">
                {project.wiki.marketing.map((m, i) => (
                  <li key={i} className="text-xs text-violet-900 flex gap-2">
                    <span className="text-violet-900 flex-shrink-0">›</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* SEO */}
            <section className="border border-cyan-950 p-4">
              <h3 className="text-xs text-cyan-700 tracking-widest mb-3">🔍 SEO</h3>
              <ul className="space-y-1.5">
                {project.wiki.seo.map((s, i) => (
                  <li key={i} className="text-xs text-cyan-900 flex gap-2">
                    <span className="text-cyan-900 flex-shrink-0">›</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </section>

          </div>

          {/* Competitors */}
          {project.wiki.competitors && project.wiki.competitors.length > 0 && (
            <section className="mt-6 border border-yellow-950 p-4">
              <h3 className="text-xs text-yellow-700 tracking-widest mb-4">🥊 COMPETITORS</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-yellow-900 border-b border-yellow-950">
                      <th className="text-left pb-2 pr-4">Product</th>
                      <th className="text-left pb-2 pr-4">Extension</th>
                      <th className="text-left pb-2 pr-4">Free Plan</th>
                      <th className="text-left pb-2 pr-4">Pricing</th>
                      <th className="text-left pb-2">Our Advantage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.wiki.competitors.map((c) => (
                      <tr key={c.name} className="border-b border-yellow-950/30 hover:bg-yellow-950/10 transition-colors">
                        <td className="py-2 pr-4">
                          <a href={c.url} target="_blank" rel="noopener noreferrer"
                            className="text-yellow-600 hover:text-yellow-400 font-bold transition-colors">
                            {c.name} →
                          </a>
                        </td>
                        <td className="py-2 pr-4">
                          <span className={c.extension ? 'text-green-600' : 'text-red-900'}>
                            {c.extension ? '✅ Yes' : '❌ No'}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-green-800">
                          {c.freePlan ?? <span className="text-red-900">None</span>}
                        </td>
                        <td className="py-2 pr-4 text-green-900">{c.pricing}</td>
                        <td className="py-2 text-green-800">{c.gap}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <p className="text-green-900 text-xs mt-4 text-center">
            Edit wiki → /home/molt/clawd/projects/openclaw/lib/projects.ts
          </p>
        </div>
      )}
    </main>
  );
}
