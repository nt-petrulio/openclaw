'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import type { ProjectData } from '@/lib/project-types';

export type ProjectWithDate = ProjectData & { lastCommitDate: string | null };

type Lane = 'Now' | 'Next' | 'Watch';

const statusStyles: Record<string, string> = {
  LIVE: 'border-emerald-500 text-emerald-300 bg-emerald-950/50',
  READY: 'border-lime-700 text-lime-300 bg-lime-950/30',
  'IN DEV': 'border-yellow-600 text-yellow-300 bg-yellow-950/30',
  DONE: 'border-blue-700 text-blue-300 bg-blue-950/30',
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'no commits';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return 'unknown';
  const diffDays = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (diffDays <= 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

function laneFor(project: ProjectWithDate): Lane {
  if (project.status === 'IN DEV' || project.name.includes('ГОЛОС')) return 'Now';
  if (project.status === 'READY') return 'Next';
  return 'Watch';
}

function firstTodo(project: ProjectWithDate): string {
  return project.todos[0] ?? project.whatsnext;
}

function StatCard({ label, value, hint, tone = 'green' }: { label: string; value: string | number; hint: string; tone?: 'green' | 'yellow' | 'violet' | 'red' }) {
  const colors = {
    green: 'border-green-900 text-green-300',
    yellow: 'border-yellow-900 text-yellow-300',
    violet: 'border-violet-900 text-violet-300',
    red: 'border-red-950 text-red-300',
  }[tone];
  return (
    <div className={`border ${colors} bg-black/40 p-4`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-green-900 text-xs tracking-widest mt-1">{label}</div>
      <div className="text-green-800 text-xs mt-2 leading-relaxed">{hint}</div>
    </div>
  );
}

function ProjectCard({ project }: { project: ProjectWithDate }) {
  const pm2Online = project.pm2?.status === 'online';
  return (
    <Link
      href={`/dashboard/${project.slug}`}
      className="group block border border-green-950 hover:border-green-500 bg-zinc-950/70 p-4 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{project.emoji}</span>
            <h3 className="font-bold text-green-300 group-hover:text-green-100 truncate">{project.name}</h3>
          </div>
          <p className="text-green-800 text-xs mt-2 line-clamp-2">→ {project.whatsnext}</p>
        </div>
        <span className={`shrink-0 border px-2 py-0.5 text-[10px] ${statusStyles[project.status] ?? 'border-green-900 text-green-700'}`}>
          {project.status}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-green-900 border-t border-green-950 pt-3">
        <span>{formatDate(project.lastCommitDate)}</span>
        <span>{project.localPort ? `:${project.localPort}` : 'no port'}</span>
        <span className={project.pm2 ? (pm2Online ? 'text-green-400' : 'text-red-500') : 'text-green-900'}>
          {project.pm2 ? `pm2 ${project.pm2.status}` : 'no pm2'}
        </span>
      </div>
    </Link>
  );
}

export default function DashboardClient({ projects, projectCount }: { projects: ProjectWithDate[]; projectCount: number }) {
  const [kyivTime, setKyivTime] = useState('');

  useEffect(() => {
    const update = () => setKyivTime(new Date().toLocaleString('en-GB', { timeZone: 'Europe/Kyiv', hour12: false }));
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  const live = projects.filter((p) => p.status === 'LIVE');
  const inDev = projects.filter((p) => p.status === 'IN DEV');
  const pm2 = projects.filter((p) => p.pm2);
  const online = projects.filter((p) => p.pm2?.status === 'online');
  const todoCount = projects.reduce((sum, p) => sum + p.todos.length, 0);

  const lanes = useMemo(() => {
    const base: Record<Lane, ProjectWithDate[]> = { Now: [], Next: [], Watch: [] };
    projects.forEach((p) => base[laneFor(p)].push(p));
    return base;
  }, [projects]);

  const topTasks = projects
    .filter((p) => p.status !== 'DONE')
    .slice()
    .sort((a, b) => (laneFor(a) === 'Now' ? -1 : 1) - (laneFor(b) === 'Now' ? -1 : 1))
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-black text-green-500 font-mono p-6 md:p-8">
      <header className="border-b border-green-900 pb-5 mb-7">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div>
            <div className="text-green-900 text-xs tracking-[0.35em] mb-2">OPENCLAW OPS</div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-green-300">MISSION CONTROL</h1>
            <p className="text-green-800 text-sm mt-2">
              projects · tasks · deploy · signals · {kyivTime || 'Kyiv time loading'} Kyiv
            </p>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm">
            <Link href="/dashboard/tasks" className="border border-green-800 px-3 py-2 hover:border-green-400 hover:text-green-200">✓ Tasks</Link>
            <Link href="/dashboard/deploy" className="border border-green-800 px-3 py-2 hover:border-green-400 hover:text-green-200">🚀 Deploy</Link>
            <Link href="/dashboard/apps" className="border border-green-800 px-3 py-2 hover:border-green-400 hover:text-green-200">⚙ Apps</Link>
            <Link href="/dashboard/ideas" className="border border-violet-800 text-violet-300 px-3 py-2 hover:border-violet-400">💡 Ideas</Link>
            <Link href="/" className="text-green-900 hover:text-green-600 px-3 py-2">← home</Link>
          </nav>
        </div>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard label="PROJECTS" value={projectCount} hint={`${live.length} live · ${inDev.length} in dev`} />
        <StatCard label="TASKS" value={todoCount} hint="from project todos/backlogs" tone="yellow" />
        <StatCard label="DEPLOY" value={`${online.length}/${pm2.length}`} hint="PM2 apps online" tone={online.length === pm2.length ? 'green' : 'red'} />
        <StatCard label="FOCUS" value="1" hint="ship the next visible thing" tone="violet" />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-8">
        {(['Now', 'Next', 'Watch'] as Lane[]).map((lane) => (
          <div key={lane} className="border border-green-950 bg-zinc-950/40">
            <div className="border-b border-green-950 px-4 py-3 flex items-center justify-between">
              <h2 className="text-xs text-green-700 tracking-widest">{`// ${lane.toUpperCase()}`}</h2>
              <span className="text-xs border border-green-900 px-2 py-0.5 text-green-800">{lanes[lane].length}</span>
            </div>
            <div className="p-3 space-y-3">
              {lanes[lane].slice(0, 5).map((project) => <ProjectCard key={project.slug} project={project} />)}
              {lanes[lane].length === 0 && <div className="text-green-900 text-xs p-4">empty lane</div>}
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="border border-yellow-950 bg-yellow-950/5 p-4">
          <div className="flex items-center justify-between border-b border-yellow-950 pb-3 mb-3">
            <h2 className="text-xs text-yellow-700 tracking-widest">{"// NEXT TASKS"}</h2>
            <Link href="/dashboard/tasks" className="text-xs text-yellow-700 hover:text-yellow-300">open tasks →</Link>
          </div>
          <div className="space-y-3">
            {topTasks.map((project) => (
              <Link key={project.slug} href={`/dashboard/${project.slug}`} className="block border border-green-950 hover:border-yellow-700 p-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm text-green-300">{project.emoji} {project.name}</span>
                  <span className="text-[10px] text-green-900">{laneFor(project)}</span>
                </div>
                <p className="text-xs text-green-800 mt-1">[ ] {firstTodo(project)}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="border border-green-950 bg-zinc-950/50 p-4">
          <div className="flex items-center justify-between border-b border-green-950 pb-3 mb-3">
            <h2 className="text-xs text-green-700 tracking-widest">{"// DEPLOY BOARD"}</h2>
            <Link href="/dashboard/deploy" className="text-xs text-green-700 hover:text-green-300">open deploy →</Link>
          </div>
          <div className="space-y-2">
            {projects.filter((p) => p.proxyPath || p.localPort).slice(0, 7).map((p) => (
              <div key={p.slug} className="grid grid-cols-[1fr_auto_auto] gap-3 items-center border-b border-green-950 py-2 text-xs">
                <span className="text-green-400 truncate">{p.emoji} {p.name}</span>
                <span className="text-green-900">{p.proxyPath ?? `:${p.localPort}`}</span>
                {p.proxyPath ? (
                  <a href={p.proxyPath} target="_blank" rel="noreferrer" className="text-green-700 hover:text-green-300">open ↗</a>
                ) : (
                  <span className="text-green-950">local</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-green-950 mt-8 pt-5 flex justify-between text-green-900 text-xs">
        <span>MISSION CONTROL · rebuilt for OpenClaw</span>
        <span>no direct deploys without review</span>
      </footer>
    </main>
  );
}
