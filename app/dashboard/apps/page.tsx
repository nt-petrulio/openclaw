import Link from 'next/link';
import { getAllProjectData } from '@/lib/projects';
import AppLauncher from './AppLauncher';

export const dynamic = 'force-dynamic';

export default async function AppsPage() {
  const projects = getAllProjectData();

  const pm2Count = projects.filter((p) => p.pm2 !== null).length;
  const onlineCount = projects.filter((p) => p.pm2?.status === 'online').length;

  return (
    <main className="min-h-screen bg-black text-green-500 font-mono p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-green-900 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-widest">⚙️ APP LAUNCHER</h1>
          <p className="text-green-800 text-xs mt-1">
            {pm2Count} PM2 processes · {onlineCount} online
          </p>
        </div>
        <Link
          href="/dashboard"
          className="text-green-800 hover:text-green-500 text-sm transition-colors"
        >
          ← Mission Control
        </Link>
      </div>

      <AppLauncher initialProjects={projects} />

      <footer className="border-t border-green-950 pt-6 mt-12 flex justify-between text-green-900 text-xs">
        <span>APP LAUNCHER · OpenClaw Mission Control</span>
        <span>auto-refresh: 10s</span>
      </footer>
    </main>
  );
}
