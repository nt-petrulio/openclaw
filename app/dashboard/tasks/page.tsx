import Link from 'next/link';
import { getAllProjectData } from '@/lib/projects';

export const dynamic = 'force-dynamic';

function priorityFor(todo: string, status: string) {
  const text = todo.toLowerCase();
  if (text.includes('deploy') || text.includes('payment') || text.includes('wayforpay') || text.includes('submit')) return 'P1🔥';
  if (status === 'IN DEV' || text.includes('test') || text.includes('validate')) return 'P2';
  if (text.includes('analytics') || text.includes('seo') || text.includes('polish')) return 'P3';
  return 'P4';
}

function tone(priority: string) {
  if (priority.startsWith('P1')) return 'border-red-900 text-red-300';
  if (priority === 'P2') return 'border-yellow-900 text-yellow-300';
  if (priority === 'P3') return 'border-green-900 text-green-400';
  return 'border-green-950 text-green-800';
}

export default async function TasksPage() {
  const projects = getAllProjectData();
  const tasks = projects.flatMap((project) =>
    project.todos.map((todo, index) => ({
      id: `${project.slug}-${index}`,
      todo,
      project,
      priority: priorityFor(todo, project.status),
    }))
  ).sort((a, b) => a.priority.localeCompare(b.priority));

  const oneThing = tasks.find((t) => t.priority.startsWith('P1')) ?? tasks[0];

  return (
    <main className="min-h-screen bg-black text-green-500 font-mono p-6 md:p-8">
      <header className="border-b border-green-900 pb-5 mb-7 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-green-900 text-xs tracking-[0.35em] mb-2">MISSION CONTROL</div>
          <h1 className="text-4xl font-black text-green-300">TASKS</h1>
          <p className="text-green-800 text-sm mt-2">{tasks.length} tasks extracted from project configs</p>
        </div>
        <Link href="/dashboard" className="text-green-800 hover:text-green-400">← dashboard</Link>
      </header>

      {oneThing && (
        <section className="border border-yellow-800 bg-yellow-950/10 p-4 mb-6">
          <h2 className="text-xs text-yellow-500 tracking-widest mb-2">{"// ONE THING TODAY"}</h2>
          <Link href={`/dashboard/${oneThing.project.slug}`} className="block hover:text-yellow-200">
            <div className="text-yellow-300 font-bold">{oneThing.project.emoji} {oneThing.project.name}</div>
            <p className="text-sm text-yellow-100 mt-1">[ ] {oneThing.todo}</p>
          </Link>
        </section>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {tasks.map((task) => (
          <Link key={task.id} href={`/dashboard/${task.project.slug}`} className="border border-green-950 hover:border-green-600 bg-zinc-950/60 p-4 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-green-300 font-bold text-sm">{task.project.emoji} {task.project.name}</div>
                <p className="text-green-700 text-sm mt-2 leading-relaxed">[ ] {task.todo}</p>
              </div>
              <span className={`border px-2 py-0.5 text-[10px] shrink-0 ${tone(task.priority)}`}>{task.priority}</span>
            </div>
            <div className="text-green-900 text-xs mt-3 border-t border-green-950 pt-2">
              {task.project.status} · {task.project.proxyPath ?? (task.project.localPort ? `:${task.project.localPort}` : 'repo only')}
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
