import Link from 'next/link';
import { getAllProjectData } from '@/lib/projects';
import { getAllTasks } from '@/lib/tasks';

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

function statusTone(status: string) {
  if (status.toLowerCase() === 'todo') return 'text-yellow-400 border-yellow-950';
  if (status.toLowerCase() === 'doing') return 'text-green-300 border-green-900';
  if (status.toLowerCase().includes('blocked')) return 'text-red-300 border-red-950';
  return 'text-green-800 border-green-950';
}

function formatDue(dueAt?: string) {
  if (!dueAt) return '';
  const due = new Date(`${dueAt}T23:59:59+03:00`);
  if (Number.isNaN(due.getTime())) return dueAt;

  const now = new Date();
  const days = Math.ceil((due.getTime() - now.getTime()) / 86_400_000);
  if (days < 0) return `overdue ${Math.abs(days)}d`;
  if (days === 0) return 'due today';
  if (days === 1) return 'due tomorrow';
  return `due in ${days}d`;
}

export default async function TasksPage() {
  const projects = getAllProjectData();
  const missionTasks = getAllTasks()
    .filter((task) => task.status.toLowerCase() !== 'done')
    .sort((a, b) => a.priority.localeCompare(b.priority));
  const projectTasks = projects.flatMap((project) =>
    project.todos.map((todo, index) => ({
      id: `${project.slug}-${index}`,
      todo,
      project,
      priority: priorityFor(todo, project.status),
    }))
  ).sort((a, b) => a.priority.localeCompare(b.priority));

  const oneThing = missionTasks.find((t) => t.priority.startsWith('P1'));
  const fallbackThing = projectTasks.find((t) => t.priority.startsWith('P1')) ?? projectTasks[0];
  const totalTasks = missionTasks.length + projectTasks.length;

  return (
    <main className="min-h-screen bg-black text-green-500 font-mono p-6 md:p-8">
      <header className="border-b border-green-900 pb-5 mb-7 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-green-900 text-xs tracking-[0.35em] mb-2">MISSION CONTROL</div>
          <h1 className="text-4xl font-black text-green-300">TASKS</h1>
          <p className="text-green-800 text-sm mt-2">
            {totalTasks} active tasks · {missionTasks.length} mission queue · {projectTasks.length} project todos
          </p>
        </div>
        <Link href="/dashboard" className="text-green-800 hover:text-green-400">← dashboard</Link>
      </header>

      {oneThing && (
        <section className="border border-yellow-800 bg-yellow-950/10 p-4 mb-6">
          <h2 className="text-xs text-yellow-500 tracking-widest mb-2">{"// ONE THING TODAY"}</h2>
          <div className="text-yellow-300 font-bold">{oneThing.project ?? 'Manual Queue'}</div>
          <p className="text-sm text-yellow-100 mt-1">[ ] {oneThing.title}</p>
          {oneThing.notes && <p className="text-xs text-yellow-700 mt-2 leading-relaxed">{oneThing.notes}</p>}
        </section>
      )}

      {!oneThing && fallbackThing && (
        <section className="border border-yellow-800 bg-yellow-950/10 p-4 mb-6">
          <h2 className="text-xs text-yellow-500 tracking-widest mb-2">{"// ONE THING TODAY"}</h2>
          <Link href={`/dashboard/${fallbackThing.project.slug}`} className="block hover:text-yellow-200">
            <div className="text-yellow-300 font-bold">{fallbackThing.project.emoji} {fallbackThing.project.name}</div>
            <p className="text-sm text-yellow-100 mt-1">[ ] {fallbackThing.todo}</p>
          </Link>
        </section>
      )}

      {missionTasks.length > 0 && (
        <section className="mb-7">
          <div className="flex items-center justify-between border-b border-green-950 pb-2 mb-3">
            <h2 className="text-xs text-green-700 tracking-widest">{"// MISSION QUEUE"}</h2>
            <Link href="/dashboard/taskboard" className="text-xs text-green-900 hover:text-green-500">open taskboard →</Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {missionTasks.map((task) => (
              <article key={task.id} className="border border-green-950 bg-zinc-950/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-green-300 font-bold text-sm">{task.project ?? 'Manual Queue'}</div>
                    <p className="text-green-600 text-sm mt-2 leading-relaxed">[ ] {task.title}</p>
                  </div>
                  <span className={`border px-2 py-0.5 text-[10px] shrink-0 ${tone(task.priority)}`}>{task.priority}</span>
                </div>
                {task.notes && <p className="text-green-800 text-xs mt-3 leading-relaxed">{task.notes}</p>}
                <div className="flex flex-wrap gap-2 text-[10px] mt-3 border-t border-green-950 pt-2">
                  <span className={`border px-2 py-0.5 ${statusTone(task.status)}`}>{task.status}</span>
                  {task.dueAt && <span className="border border-orange-900 px-2 py-0.5 text-orange-400">{formatDue(task.dueAt)}</span>}
                  {task.source && <span className="border border-green-950 px-2 py-0.5 text-green-900">{task.source}</span>}
                  {task.href && (
                    <Link href={task.href} className="border border-yellow-900 px-2 py-0.5 text-yellow-500 hover:text-yellow-200 hover:border-yellow-500">
                      {task.actionLabel ?? 'open'}
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {projectTasks.map((task) => (
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
