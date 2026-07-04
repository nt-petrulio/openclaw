'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import type { Task, TaskStatus, CronJob } from '@/lib/tasks';

interface Column { id: TaskStatus; label: string; color: string; }

const PRIORITY_COLORS: Record<string, string> = {
  P1: 'border-red-800 text-red-400 bg-red-950/20',
  P2: 'border-yellow-800 text-yellow-400 bg-yellow-950/20',
  P3: 'border-green-800 text-green-400 bg-green-950/20',
  P4: 'border-green-950 text-green-700 bg-black/20',
};

function TaskCard({ task, onMove, onDelete }: {
  task: Task;
  onMove: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}) {
  const STATUSES: TaskStatus[] = ['backlog', 'todo', 'doing', 'done'];
  const currentIdx = STATUSES.indexOf(task.status);

  return (
    <div className={`border ${PRIORITY_COLORS[task.priority]} p-3 mb-2 group relative`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-1 border ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>
            {task.source === 'cron' && <span className="text-xs text-green-800">⏱ cron</span>}
            {task.source === 'manual' && <span className="text-xs text-green-800">✍ manual</span>}
            {task.source === 'backlog' && <span className="text-xs text-green-800">📋 backlog</span>}
          </div>
          <div className="text-green-200 text-sm font-bold leading-tight">{task.title}</div>
          {task.project && <div className="text-green-800 text-xs mt-1">{task.project}</div>}
          {task.notes && <div className="text-green-700 text-xs mt-1 truncate">{task.notes}</div>}
          {task.href && (
            <Link
              href={task.href}
              className="inline-block mt-2 text-xs border border-yellow-900 px-2 py-0.5 text-yellow-500 hover:text-yellow-200 hover:border-yellow-500"
            >
              {task.actionLabel ?? 'open'}
            </Link>
          )}
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 text-red-800 hover:text-red-500 text-xs px-1 transition-opacity"
        >×</button>
      </div>
      <div className="flex gap-1 mt-2">
        {currentIdx > 0 && (
          <button
            onClick={() => onMove(task.id, STATUSES[currentIdx - 1])}
            className="text-xs border border-green-900 px-2 py-0.5 text-green-700 hover:text-green-400 hover:border-green-600"
          >← back</button>
        )}
        {currentIdx < STATUSES.length - 1 && (
          <button
            onClick={() => onMove(task.id, STATUSES[currentIdx + 1])}
            className="text-xs border border-green-700 px-2 py-0.5 text-green-400 hover:text-green-200 hover:border-green-400"
          >forward →</button>
        )}
      </div>
    </div>
  );
}

function AddTaskForm({ onAdd }: { onAdd: (t: Partial<Task>) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('P3');
  const [project, setProject] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), priority, project, notes, status });
    setTitle(''); setPriority('P3'); setProject(''); setNotes('');
    setOpen(false);
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} className="w-full border border-dashed border-green-900 text-green-800 hover:text-green-500 hover:border-green-700 py-2 text-xs text-center mt-2">
      + add task
    </button>
  );

  return (
    <form onSubmit={submit} className="border border-green-800 p-3 mt-2 bg-black/40">
      <input
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Task title..."
        className="w-full bg-transparent border-b border-green-900 text-green-200 text-sm pb-1 mb-2 outline-none placeholder:text-green-900"
      />
      <div className="flex gap-2 mb-2 flex-wrap">
        <select value={priority} onChange={e => setPriority(e.target.value as Task['priority'])}
          className="bg-black border border-green-900 text-green-500 text-xs px-2 py-1">
          {['P1', 'P2', 'P3', 'P4'].map(p => <option key={p}>{p}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value as TaskStatus)}
          className="bg-black border border-green-900 text-green-500 text-xs px-2 py-1">
          {(['backlog','todo','doing','done'] as TaskStatus[]).map(s => <option key={s}>{s}</option>)}
        </select>
        <input value={project} onChange={e => setProject(e.target.value)}
          placeholder="project tag"
          className="bg-transparent border-b border-green-900 text-green-500 text-xs px-1 outline-none placeholder:text-green-900 w-24" />
      </div>
      <input value={notes} onChange={e => setNotes(e.target.value)}
        placeholder="notes (optional)"
        className="w-full bg-transparent border-b border-green-900 text-green-700 text-xs pb-1 mb-3 outline-none placeholder:text-green-900" />
      <div className="flex gap-2">
        <button type="submit" className="border border-green-700 px-3 py-1 text-green-400 hover:text-green-200 text-xs">add</button>
        <button type="button" onClick={() => setOpen(false)} className="text-green-800 hover:text-green-500 text-xs px-2">cancel</button>
      </div>
    </form>
  );
}

function CronPanel({ crons }: { crons: CronJob[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-6 border border-green-950 bg-black/30">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-4 py-2 text-xs text-green-700 hover:text-green-400">
        <span>⏱ SCHEDULED CRONS ({crons.length})</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-4 pb-3 grid gap-2">
          {crons.map(c => (
            <div key={c.id} className="flex items-center gap-3 text-xs border-t border-green-950 pt-2">
              <span className={`w-2 h-2 rounded-full ${c.enabled ? 'bg-green-400' : 'bg-red-700'}`} />
              <span className="text-green-300 font-bold">{c.name}</span>
              <span className="text-green-800">{c.agentId}</span>
              <span className="text-green-700 font-mono ml-auto">{c.schedule} ({c.tz})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TaskBoardClient({
  initialTasks,
  columns,
  crons,
}: {
  initialTasks: Task[];
  columns: Column[];
  crons: CronJob[];
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [, startTransition] = useTransition();

  function moveTask(id: string, status: TaskStatus) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t));
    startTransition(async () => {
      await fetch('/mc/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
    });
  }

  function deleteTask(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id));
    startTransition(async () => {
      await fetch(`/mc/api/tasks?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    });
  }

  function addTask(partial: Partial<Task>) {
    startTransition(async () => {
      const res = await fetch('/mc/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partial),
      });
      const newTask = await res.json();
      setTasks(prev => [newTask, ...prev]);
    });
  }

  const byStatus = (status: TaskStatus) => tasks.filter(t => t.status === status)
    .sort((a, b) => a.priority.localeCompare(b.priority));

  return (
    <>
      <CronPanel crons={crons} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {columns.map(col => {
          const colTasks = byStatus(col.id);
          return (
            <div key={col.id} className="flex flex-col">
              <div className={`border-b ${col.color} pb-2 mb-3 flex items-center justify-between`}>
                <span className="text-xs tracking-[0.25em] font-bold">{col.label}</span>
                <span className="text-xs">{colTasks.length}</span>
              </div>
              <div className="flex-1">
                {colTasks.map(task => (
                  <TaskCard key={task.id} task={task} onMove={moveTask} onDelete={deleteTask} />
                ))}
              </div>
              {col.id !== 'done' && <AddTaskForm onAdd={addTask} />}
            </div>
          );
        })}
      </div>
    </>
  );
}
