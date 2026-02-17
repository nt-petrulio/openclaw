import Link from 'next/link';

const projects = [
  {
    name: 'Mission Control',
    desc: 'Personal command center — stocks, tasks, goals',
    href: '/dashboard',
    status: 'LIVE',
    emoji: '🎯',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-green-500 font-mono p-8">
      <header className="border-b border-green-500 pb-4 mb-8">
        <h1 className="text-5xl font-bold tracking-tight">OPENCLAW</h1>
        <p className="text-green-700 mt-1 text-sm">Nazartsio&apos;s personal ops hub · Built by Petrulio 🚀</p>
      </header>

      <section className="mb-8">
        <h2 className="text-xs text-green-700 mb-4 tracking-widest">// APPS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(p => (
            <Link
              key={p.name}
              href={p.href}
              className="border border-green-800 hover:border-green-500 p-4 block transition-colors group"
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl">{p.emoji}</span>
                <span className="text-xs border border-green-500 px-1 text-green-400">{p.status}</span>
              </div>
              <h3 className="mt-2 text-lg font-bold group-hover:text-green-300">{p.name}</h3>
              <p className="text-green-700 text-sm mt-1">{p.desc}</p>
            </Link>
          ))}

          {/* Placeholder slots */}
          <div className="border border-green-900 p-4 opacity-40">
            <span className="text-2xl">🔜</span>
            <h3 className="mt-2 text-lg font-bold">Coming soon...</h3>
            <p className="text-green-700 text-sm mt-1">Next project goes here</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-green-900 pt-4 text-green-800 text-xs">
        <p>OPENCLAW v0.1 · {new Date().getFullYear()} · localhost</p>
      </footer>
    </main>
  );
}
