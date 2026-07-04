import { NextRequest, NextResponse } from 'next/server';
import { getAllTasks, getManualTasks, saveManualTasks, parseBacklogTasks, type Task, type TaskStatus } from '@/lib/tasks';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(getAllTasks());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const tasks = getManualTasks();
  const now = new Date().toISOString();

  const newTask: Task = {
    id: `manual-${Date.now()}`,
    title: body.title,
    status: body.status ?? 'todo',
    priority: body.priority ?? 'P3',
    source: 'manual',
    project: body.project ?? '',
    notes: body.notes ?? '',
    href: body.href,
    actionLabel: body.actionLabel,
    dueAt: body.dueAt,
    createdAt: now,
    updatedAt: now,
  };

  tasks.push(newTask);
  saveManualTasks(tasks);
  return NextResponse.json(newTask, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, status, priority, title, notes, href, actionLabel, dueAt } = body as {
    id: string;
    status?: TaskStatus;
    priority?: Task['priority'];
    title?: string;
    notes?: string;
    href?: string;
    actionLabel?: string;
    dueAt?: string;
  };

  const tasks = getManualTasks();
  const now = new Date().toISOString();

  // Find existing or create from backlog
  let task = tasks.find((t) => t.id === id);
  if (!task) {
    const backlog = parseBacklogTasks();
    const fromBacklog = backlog.find((t) => t.id === id);
    if (!fromBacklog) return NextResponse.json({ error: 'not found' }, { status: 404 });
    task = { ...fromBacklog };
    tasks.push(task);
  }

  if (status !== undefined) task.status = status;
  if (priority !== undefined) task.priority = priority;
  if (title !== undefined) task.title = title;
  if (notes !== undefined) task.notes = notes;
  if (href !== undefined) task.href = href;
  if (actionLabel !== undefined) task.actionLabel = actionLabel;
  if (dueAt !== undefined) task.dueAt = dueAt;
  task.updatedAt = now;

  saveManualTasks(tasks);
  return NextResponse.json(task);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const tasks = getManualTasks();
  const now = new Date().toISOString();
  let task = tasks.find((t) => t.id === id);

  if (!task) {
    const fromBacklog = parseBacklogTasks().find((t) => t.id === id);
    task = fromBacklog ?? {
      id,
      title: id,
      status: 'done',
      priority: 'P4',
      source: 'manual',
      createdAt: now,
      updatedAt: now,
    };
    tasks.push(task);
  }

  task.deleted = true;
  task.updatedAt = now;
  saveManualTasks(tasks);
  return NextResponse.json({ ok: true });
}
