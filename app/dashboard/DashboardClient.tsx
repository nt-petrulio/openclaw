'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ProjectData } from '@/lib/project-types';

export type ProjectWithDate = ProjectData & { lastCommitDate: string | null };

type ViewMode = 'grid' | 'kanban';
type StatusKey = 'IN DEV' | 'READY' | 'LIVE' | 'DONE';

const STATUS_ORDER: StatusKey[] = ['IN DEV', 'READY', 'LIVE', 'DONE'];

const STATUS_COLORS: Record<StatusKey, { border: string; text: string; badge: string; header: string }> = {
  'IN DEV': {
    border: 'border-yellow-700',
    text: 'text-yellow-500',
    badge: 'bg-yellow-950 text-yellow-400 border-yellow-700',
    header: 'text-yellow-500',
  },
  READY: {
    border: 'border-green-700',
    text: 'text-green-400',
    badge: 'bg-green-950 text-green-400 border-green-700',
    header: 'text-green-400',
  },
  LIVE: {
    border: 'border-green-500',
    text: 'text-green-300',
    badge: 'bg-green-900 text-green-300 border-green-500',
    header: 'text-green-300',
  },
  DONE: {
    border: 'border-blue-800',
    text: 'text-blue-400',
    badge: 'bg-blue-950 text-blue-400 border-blue-800',
    header: 'text-blue-400',
  },
};

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

// ─── Project Card (shared between views) ────────────────────────────────────

function ProjectCard({
  project,
  draggable = false,
  onDragStart,
  onDragEnd,
  isDragging = false,
}: {
  project: ProjectWithDate;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  isDragging?: boolean;
}) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`border border-green-900 hover:border-green-600 p-4 transition-colors group cursor-pointer select-none
        ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}
        ${isDragging ? 'opacity-40 scale-95' : 'opacity-100'}
      `}
    >
      {/* Card header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{project.emoji}</span>
          <span className="font-bold group-hover:text-green-300 transition-colors text-sm leading-tight">
            {project.name}
          </span>
        </div>
        {project.pm2 && (
          <span
            className={`inline-block w-2 h-2 rounded-full shrink-0 mt-1 ${
              project.pm2.status === 'online' ? 'bg-green-400 animate-pulse' : 'bg-red-600'
            }`}
            title={`pm2: ${project.pm2.status}`}
          />
        )}
      </div>

      {/* Footer meta */}
      <div className="flex items-center justify-between text-xs text-green-900 border-t border-green-950 pt-2 mt-2">
        <span>
          {project.commits.length > 0
            ? formatDate(project.lastCommitDate)
            : 'no commits'}
        </span>
        {project.localPort && (
          <span className="text-green-800 text-xs">:{project.localPort}</span>
        )}
      </div>
    </div>
  );
}

// ─── Grid View ───────────────────────────────────────────────────────────────

function GridView({ projects }: { projects: ProjectWithDate[] }) {
  const byStatus: Record<string, ProjectWithDate[]> = {
    LIVE: projects.filter((p) => p.status === 'LIVE'),
    'IN DEV': projects.filter((p) => p.status === 'IN DEV'),
    READY: projects.filter((p) => p.status === 'READY'),
    DONE: projects.filter((p) => p.status === 'DONE'),
  };

  return (
    <>
      {Object.entries(byStatus).map(([status, list]) =>
        list.length === 0 ? null : (
          <div key={status} className="mb-8">
            <h2 className="text-xs text-green-800 tracking-widest mb-3">// {status}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map((project) => (
                <Link key={project.slug} href="/dashboard/apps" className="block">
                  <div className="border border-green-900 hover:border-green-600 p-4 transition-colors group">
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
                    <p className="text-green-700 text-xs mb-3 leading-relaxed">→ {project.whatsnext}</p>
                    <div className="flex items-center justify-between text-xs text-green-900 border-t border-green-950 pt-2 mt-2">
                      <span>
                        {project.commits.length > 0
                          ? `last commit: ${formatDate(project.lastCommitDate)}`
                          : 'no commits'}
                      </span>
                      <div className="flex items-center gap-2">
                        {project.proxyPath && (
                          <a
                            href={project.proxyPath}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="border border-green-600 bg-green-950 text-green-400 hover:bg-green-900 hover:text-green-200 hover:border-green-400 transition-colors px-2 py-0.5 text-xs font-bold"
                          >
                            🚀 Open App
                          </a>
                        )}
                        {!project.proxyPath && project.localPort && (
                          <a
                            href={`http://localhost:${project.localPort}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-green-600 hover:text-green-400 transition-colors"
                          >
                            ↗ :{project.localPort}
                          </a>
                        )}
                        {!project.proxyPath && !project.localPort && (
                          <span className="text-green-900">view →</span>
                        )}
                      </div>
                    </div>
                    {project.pm2 && (
                      <div className="mt-2 flex items-center gap-1 text-xs">
                        <span
                          className={`inline-block w-1.5 h-1.5 rounded-full ${
                            project.pm2.status === 'online' ? 'bg-green-400' : 'bg-red-600'
                          }`}
                        />
                        <span className="text-green-800">pm2: {project.pm2.status}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )
      )}
    </>
  );
}

// ─── Kanban Board ─────────────────────────────────────────────────────────────

type KanbanColumns = Record<StatusKey, string[]>; // slug[]

function KanbanBoard({ projects }: { projects: ProjectWithDate[] }) {
  const router = useRouter();

  // Build initial column slugs from project statuses
  const buildInitialColumns = useCallback((): KanbanColumns => {
    const cols: KanbanColumns = { 'IN DEV': [], READY: [], LIVE: [], DONE: [] };
    for (const p of projects) {
      const s = p.status as StatusKey;
      if (cols[s]) cols[s].push(p.slug);
    }
    return cols;
  }, [projects]);

  const [columns, setColumns] = useState<KanbanColumns>(buildInitialColumns);
  const [draggingSlug, setDraggingSlug] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<StatusKey | null>(null);
  const [dragOverSlug, setDragOverSlug] = useState<string | null>(null);
  const dragSlugRef = useRef<string | null>(null);

  // Load column overrides from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kanban-columns');
      if (saved) {
        const parsed: KanbanColumns = JSON.parse(saved);
        // Merge: add any new projects not in saved state, remove deleted slugs
        const allSlugs = new Set(projects.map((p) => p.slug));
        const savedSlugs = new Set(Object.values(parsed).flat());

        // Remove slugs that no longer exist
        const cleaned: KanbanColumns = { 'IN DEV': [], READY: [], LIVE: [], DONE: [] };
        for (const col of STATUS_ORDER) {
          cleaned[col] = (parsed[col] || []).filter((s) => allSlugs.has(s));
        }

        // Add new slugs to their original column
        for (const p of projects) {
          if (!savedSlugs.has(p.slug)) {
            const col = p.status as StatusKey;
            if (cleaned[col]) cleaned[col].push(p.slug);
          }
        }

        setColumns(cleaned);
      }
    } catch {
      // ignore
    }
  }, [projects]);

  // Save to localStorage on change
  const saveColumns = useCallback((cols: KanbanColumns) => {
    try {
      localStorage.setItem('kanban-columns', JSON.stringify(cols));
    } catch {}
  }, []);

  const projectBySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));

  // ── Drag handlers ──
  const handleDragStart = (e: React.DragEvent, slug: string) => {
    dragSlugRef.current = slug;
    setDraggingSlug(slug);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', slug);
  };

  const handleDragEnd = () => {
    setDraggingSlug(null);
    setDragOverCol(null);
    setDragOverSlug(null);
    dragSlugRef.current = null;
  };

  const handleDragOver = (e: React.DragEvent, col: StatusKey, overSlug?: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCol(col);
    setDragOverSlug(overSlug ?? null);
  };

  const handleDrop = (e: React.DragEvent, targetCol: StatusKey, beforeSlug?: string) => {
    e.preventDefault();
    const slug = dragSlugRef.current ?? e.dataTransfer.getData('text/plain');
    if (!slug) return;

    setColumns((prev) => {
      // Remove from current column
      const next: KanbanColumns = { 'IN DEV': [], READY: [], LIVE: [], DONE: [] };
      for (const col of STATUS_ORDER) {
        next[col] = prev[col].filter((s) => s !== slug);
      }

      // Insert into target column
      if (beforeSlug) {
        const idx = next[targetCol].indexOf(beforeSlug);
        if (idx === -1) {
          next[targetCol].push(slug);
        } else {
          next[targetCol].splice(idx, 0, slug);
        }
      } else {
        next[targetCol].push(slug);
      }

      saveColumns(next);
      return next;
    });

    setDraggingSlug(null);
    setDragOverCol(null);
    setDragOverSlug(null);
  };

  const handleCardClick = (slug: string) => {
    if (draggingSlug) return; // don't navigate while dragging
    router.push('/dashboard/apps');
  };

  return (
    <div className="flex gap-0 overflow-x-auto pb-4" style={{ minHeight: '60vh' }}>
      {STATUS_ORDER.map((col, colIdx) => {
        const colors = STATUS_COLORS[col];
        const slugs = columns[col];
        const isOver = dragOverCol === col;

        return (
          <div
            key={col}
            className={`flex-1 min-w-[200px] border-r ${colors.border} last:border-r-0 flex flex-col`}
            onDragOver={(e) => handleDragOver(e, col)}
            onDrop={(e) => handleDrop(e, col)}
          >
            {/* Column header */}
            <div className={`px-4 py-3 border-b ${colors.border} flex items-center justify-between shrink-0`}>
              <span className={`text-xs font-bold tracking-widest ${colors.header}`}>
                {col === 'IN DEV' ? '⚙ IN DEV' : col === 'READY' ? '▶ READY' : col === 'LIVE' ? '● LIVE' : '✓ DONE'}
              </span>
              <span className={`text-xs border px-1.5 py-0.5 ${colors.badge}`}>
                {slugs.length}
              </span>
            </div>

            {/* Cards */}
            <div
              className={`flex-1 p-3 flex flex-col gap-3 transition-colors ${
                isOver && dragOverSlug === null ? 'bg-green-950/20' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, col)}
              onDrop={(e) => handleDrop(e, col)}
            >
              {slugs.map((slug) => {
                const project = projectBySlug[slug];
                if (!project) return null;
                const isBeingDragged = draggingSlug === slug;
                const showDropIndicator = dragOverCol === col && dragOverSlug === slug;

                return (
                  <div key={slug}>
                    {/* Drop-before indicator */}
                    {showDropIndicator && (
                      <div className="h-0.5 bg-green-400 mb-2 mx-1 rounded" />
                    )}
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, slug)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDragOver(e, col, slug);
                      }}
                      onDrop={(e) => {
                        e.stopPropagation();
                        handleDrop(e, col, slug);
                      }}
                      onClick={() => handleCardClick(slug)}
                      className={`border border-green-900 hover:border-green-600 p-3 transition-all group
                        cursor-grab active:cursor-grabbing select-none
                        ${isBeingDragged ? 'opacity-30 scale-95 border-green-700' : 'opacity-100'}
                        ${isOver && dragOverSlug === slug ? 'border-t-green-400' : ''}
                      `}
                    >
                      {/* Card header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-lg shrink-0">{project.emoji}</span>
                          <span className="font-bold group-hover:text-green-300 transition-colors text-xs leading-tight truncate">
                            {project.name}
                          </span>
                        </div>
                        {project.pm2 && (
                          <span
                            className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 mt-0.5 ${
                              project.pm2.status === 'online' ? 'bg-green-400' : 'bg-red-600'
                            }`}
                            title={`pm2: ${project.pm2.status}`}
                          />
                        )}
                      </div>

                      {/* Commit age + Open App */}
                      <div className="text-xs text-green-900 border-t border-green-950 pt-1.5 mt-1.5 flex items-center justify-between gap-1">
                        <span>
                          {project.commits.length > 0
                            ? formatDate(project.lastCommitDate)
                            : 'no commits'}
                        </span>
                        {project.proxyPath && (
                          <a
                            href={project.proxyPath}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="border border-green-700 bg-green-950 text-green-500 hover:bg-green-900 hover:text-green-300 transition-colors px-1.5 py-0.5 text-xs font-bold shrink-0"
                          >
                            🚀
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Empty column drop zone */}
              {slugs.length === 0 && (
                <div
                  className={`flex-1 border border-dashed border-green-950 flex items-center justify-center text-green-950 text-xs transition-colors ${
                    isOver ? 'border-green-700 text-green-800 bg-green-950/10' : ''
                  }`}
                  style={{ minHeight: 80 }}
                >
                  drop here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main DashboardClient ─────────────────────────────────────────────────────

interface DashboardClientProps {
  projects: ProjectWithDate[];
  projectCount: number;
}

export default function DashboardClient({
  projects,
  projectCount,
}: DashboardClientProps) {
  const [view, setView] = useState<ViewMode>('grid');
  const [mounted, setMounted] = useState(false);
  const [kyivTime, setKyivTime] = useState('');
  const [isoTime, setIsoTime] = useState('');

  // Load view from localStorage on mount + generate time
  useEffect(() => {
    setMounted(true);
    setKyivTime(new Date().toLocaleString('en-US', { timeZone: 'Europe/Kyiv' }));
    setIsoTime(new Date().toISOString());
    try {
      const saved = localStorage.getItem('dashboard-view') as ViewMode | null;
      if (saved === 'kanban' || saved === 'grid') setView(saved);
    } catch {}
  }, []);

  const toggleView = () => {
    setView((v) => {
      const next = v === 'grid' ? 'kanban' : 'grid';
      try {
        localStorage.setItem('dashboard-view', next);
      } catch {}
      return next;
    });
  };

  const byStatus = {
    LIVE: projects.filter((p) => p.status === 'LIVE'),
    'IN DEV': projects.filter((p) => p.status === 'IN DEV'),
    READY: projects.filter((p) => p.status === 'READY'),
    DONE: projects.filter((p) => p.status === 'DONE'),
  };

  return (
    <main className="min-h-screen bg-black text-green-500 font-mono p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-green-900 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-widest">MISSION CONTROL v2.0</h1>
          <p className="text-green-800 text-xs mt-1">
            {projectCount} projects · {kyivTime} Kyiv
          </p>
        </div>
        <div className="flex gap-4 text-sm items-center">
          {/* View toggle */}
          {mounted && (
            <button
              onClick={toggleView}
              className="border border-green-700 px-3 py-1 hover:border-green-400 hover:text-green-300 transition-colors text-xs flex items-center gap-2"
              title={view === 'grid' ? 'Switch to Kanban view' : 'Switch to Grid view'}
            >
              {view === 'grid' ? (
                <>
                  <span>▦</span>
                  <span>kanban</span>
                </>
              ) : (
                <>
                  <span>⊞</span>
                  <span>grid</span>
                </>
              )}
            </button>
          )}
          <Link
            href="/dashboard/ideas"
            className="border border-violet-700 text-violet-400 px-3 py-1 hover:border-violet-400 hover:text-violet-300 transition-colors"
          >
            💡 Ideas
          </Link>
          <Link
            href="/dashboard/apps"
            className="border border-green-700 px-3 py-1 hover:border-green-400 hover:text-green-300 transition-colors"
          >
            ⚙️ App Launcher
          </Link>
          <Link
            href="/dashboard/legacy"
            className="text-green-900 hover:text-green-700 px-3 py-1 transition-colors text-xs"
          >
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
          { label: 'TOTAL', value: projectCount, color: 'text-green-400' },
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

      {/* View label */}
      {mounted && (
        <div className="text-xs text-green-900 tracking-widest mb-4">
          // {view === 'grid' ? 'CARD VIEW' : 'KANBAN BOARD'}
        </div>
      )}

      {/* Content */}
      {!mounted ? (
        // SSR placeholder — matches grid view
        <div className="text-green-900 text-xs">loading...</div>
      ) : view === 'grid' ? (
        <GridView projects={projects} />
      ) : (
        <KanbanBoard projects={projects} />
      )}

      <footer className="border-t border-green-950 pt-6 mt-8 flex justify-between text-green-900 text-xs">
        <span>MISSION CONTROL v2.0 · OpenClaw</span>
        <span>{isoTime}</span>
      </footer>
    </main>
  );
}
