import Link from 'next/link';
import { getAllTasks, getCronJobs, type Task, type TaskStatus } from '@/lib/tasks';
import TaskBoardClient from './TaskBoardClient';

export const dynamic = 'force-dynamic';

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'backlog', label: 'BACKLOG', color: 'border-green-950 text-green-900' },
  { id: 'todo', label: 'TODO', color: 'border-green-800 text-green-700' },
  { id: 'doing', label: 'DOING', color: 'border-yellow-800 text-yellow-600' },
  { id: 'done', label: 'DONE', color: 'border-green-700 text-green-500' },
];

export default async function TaskBoardPage() {
  const tasks = getAllTasks();
  const crons = getCronJobs();

  const byStatus: Record<TaskStatus, Task[]> = {
    backlog: [],
    todo: [],
    doing: [],
    done: [],
  };
  for (const t of tasks) {
    byStatus[t.status]?.push(t);
  }

  // Sort each column by priority
  for (const col of Object.keys(byStatus) as TaskStatus[]) {
    byStatus[col].sort((a, b) => a.priority.localeCompare(b.priority));
  }

  const totalActive = tasks.filter((t) => t.status !== 'done').length;
  const totalDone = tasks.filter((t) => t.status === 'done').length;
  const p1Count = tasks.filter((t) => t.priority === 'P1' && t.status !== 'done').length;

  return (
    <main className="min-h-screen bg-black text-green-500 font-mono p-4 md:p-6">
      <header className="border-b border-green-900 pb-4 mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <div className="text-green-900 text-xs tracking-[0.35em] mb-1">MISSION CONTROL</div>
          <h1 className="text-3xl font-black text-green-300">TASK BOARD</h1>
          <div className="flex gap-4 mt-2 text-xs text-green-800">
            <span>{totalActive} active</span>
            <span className={p1Count > 0 ? 'text-red-400' : ''}>{p1Count} P1🔥</span>
            <span>{totalDone} done</span>
            <span>{crons.length} crons scheduled</span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link href="/dashboard" className="border border-green-900 px-3 py-1.5 text-green-800 hover:text-green-400 text-xs">← dashboard</Link>
        </div>
      </header>

      <TaskBoardClient initialTasks={tasks} columns={COLUMNS} crons={crons} />
    </main>
  );
}
