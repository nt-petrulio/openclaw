'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProjectData, formatUptime, formatBytes } from '@/lib/project-types';

interface AppLauncherProps {
  initialProjects: ProjectData[];
}

export default function AppLauncher({ initialProjects }: AppLauncherProps) {
  const [projects, setProjects] = useState<ProjectData[]>(initialProjects);
  const [loading, setLoading] = useState<Record<string, string>>({}); // slug -> action
  const [error, setError] = useState<Record<string, string>>({});
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/projects', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
        setLastRefresh(new Date());
      }
    } catch {
      // silent fail — show stale data
    }
  }, []);

  // Auto-refresh every 10s
  useEffect(() => {
    const interval = setInterval(refresh, 10000);
    return () => clearInterval(interval);
  }, [refresh]);

  async function doAction(slug: string, action: 'start' | 'stop' | 'restart') {
    setLoading((prev) => ({ ...prev, [slug]: action }));
    setError((prev) => ({ ...prev, [slug]: '' }));
    try {
      const res = await fetch(`/api/projects/${slug}/${action}`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setError((prev) => ({ ...prev, [slug]: data.error ?? 'Unknown error' }));
      } else {
        // Refresh after action
        setTimeout(refresh, 1500);
      }
    } catch (err: any) {
      setError((prev) => ({ ...prev, [slug]: err.message }));
    } finally {
      setLoading((prev) => {
        const next = { ...prev };
        delete next[slug];
        return next;
      });
    }
  }

  const pm2Projects = projects.filter((p) => p.pm2 !== null);
  const noPm2Projects = projects.filter((p) => p.pm2 === null);

  return (
    <div className="space-y-8">
      {/* PM2 controlled apps */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs text-green-700 tracking-widest">// PM2 PROCESSES</h2>
          <div className="flex items-center gap-4 text-xs text-green-900">
            <span>last refresh: {lastRefresh.toLocaleTimeString()}</span>
            <button
              onClick={refresh}
              className="border border-green-900 hover:border-green-700 px-2 py-0.5 text-green-800 hover:text-green-600 transition-colors"
            >
              ↻ refresh
            </button>
          </div>
        </div>

        {pm2Projects.length === 0 ? (
          <div className="border border-green-900 p-6 text-center text-green-900 text-sm">
            No PM2 processes found. Start a process with <code>pm2 start</code>
          </div>
        ) : (
          <div className="space-y-3">
            {pm2Projects.map((project) => {
              const pm2 = project.pm2!;
              const isOnline = pm2.status === 'online';
              const isLoading = !!loading[project.slug];

              return (
                <div
                  key={project.slug}
                  className={`border p-4 transition-colors ${
                    isOnline ? 'border-green-900' : 'border-red-950'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {/* Left: name + status */}
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{project.emoji}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">{project.name}</span>
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              isOnline
                                ? 'bg-green-400 animate-pulse'
                                : pm2.status === 'stopped'
                                ? 'bg-red-800'
                                : 'bg-yellow-600'
                            }`}
                          />
                          <span
                            className={`text-xs ${
                              isOnline
                                ? 'text-green-500'
                                : pm2.status === 'stopped'
                                ? 'text-red-700'
                                : 'text-yellow-600'
                            }`}
                          >
                            {pm2.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex gap-4 text-xs text-green-900 mt-1">
                          <span>id: {pm2.pm_id}</span>
                          <span>uptime: {formatUptime(pm2.uptime)}</span>
                          <span>restarts: {pm2.restarts}</span>
                          <span>cpu: {pm2.cpu}%</span>
                          <span>mem: {formatBytes(pm2.memory)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: controls */}
                    <div className="flex items-center gap-2">
                      {project.localPort && isOnline && (
                        <a
                          href={`http://localhost:${project.localPort}`}
                          target="_blank"
                          rel="noreferrer"
                          className="border border-green-700 hover:border-green-500 px-2 py-1 text-xs text-green-600 hover:text-green-400 transition-colors"
                        >
                          :{project.localPort} ↗
                        </a>
                      )}
                      <button
                        disabled={isLoading || isOnline}
                        onClick={() => doAction(project.slug, 'start')}
                        className="border border-green-900 hover:border-green-600 disabled:opacity-30 disabled:cursor-not-allowed px-3 py-1 text-xs text-green-800 hover:text-green-500 transition-colors"
                      >
                        {loading[project.slug] === 'start' ? '...' : 'START'}
                      </button>
                      <button
                        disabled={isLoading || !isOnline}
                        onClick={() => doAction(project.slug, 'stop')}
                        className="border border-red-950 hover:border-red-800 disabled:opacity-30 disabled:cursor-not-allowed px-3 py-1 text-xs text-red-900 hover:text-red-700 transition-colors"
                      >
                        {loading[project.slug] === 'stop' ? '...' : 'STOP'}
                      </button>
                      <button
                        disabled={isLoading}
                        onClick={() => doAction(project.slug, 'restart')}
                        className="border border-yellow-950 hover:border-yellow-800 disabled:opacity-30 disabled:cursor-not-allowed px-3 py-1 text-xs text-yellow-900 hover:text-yellow-600 transition-colors"
                      >
                        {loading[project.slug] === 'restart' ? '...' : 'RESTART'}
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  {error[project.slug] && (
                    <div className="mt-2 text-xs text-red-600 border-t border-red-950 pt-2">
                      ✗ {error[project.slug]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Not-yet-PM2 projects */}
      {noPm2Projects.length > 0 && (
        <section>
          <h2 className="text-xs text-green-900 tracking-widest mb-4">
            // OTHER PROJECTS (not in PM2)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {noPm2Projects.map((project) => (
              <div key={project.slug} className="border border-green-950 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span>{project.emoji}</span>
                  <span className="text-sm text-green-800">{project.name}</span>
                </div>
                <div className="text-xs text-green-900">{project.status}</div>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-green-900 hover:text-green-700 mt-1 block transition-colors"
                >
                  GitHub ↗
                </a>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
