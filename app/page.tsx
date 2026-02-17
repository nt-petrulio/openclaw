import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-green-500 font-mono">

      {/* Nav */}
      <nav className="border-b border-green-900 px-8 py-4 flex items-center justify-between">
        <span className="text-xl font-bold tracking-widest">OPENCLAW</span>
        <div className="flex gap-6 text-sm text-green-700">
          <Link href="#how" className="hover:text-green-400">How it works</Link>
          <Link href="#tools" className="hover:text-green-400">Tools</Link>
          <Link href="/dashboard" className="hover:text-green-400">Dashboard</Link>
          <Link href="/chat" className="border border-green-500 px-3 py-1 text-green-400 hover:bg-green-950">Chat →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 py-20 max-w-3xl">
        <p className="text-green-700 text-sm tracking-widest mb-4">// YOUR AI AGENT</p>
        <h1 className="text-6xl font-bold leading-tight mb-6">
          Meet<br />
          <span className="text-green-400">Petrulio</span> 🚀
        </h1>
        <p className="text-green-300 text-lg mb-8 leading-relaxed">
          Personal AI agent for Nazartsio. Builds projects, monitors markets,
          ships code while you sleep. Runs 24/7 on your server.
        </p>
        <div className="flex gap-4">
          <Link href="/chat" className="border border-green-500 px-6 py-3 hover:bg-green-950 transition-colors">
            Open Chat →
          </Link>
          <Link href="/dashboard" className="text-green-700 px-6 py-3 hover:text-green-400 transition-colors">
            Mission Control
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-b border-green-900 px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: 'Projects shipped', value: '8+' },
          { label: 'Running since', value: 'Jan 26' },
          { label: 'Active 24/7', value: '✓' },
          { label: 'MRR target', value: '$50k' },
        ].map(s => (
          <div key={s.label}>
            <div className="text-3xl font-bold text-green-400">{s.value}</div>
            <div className="text-green-800 text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section id="how" className="px-8 py-16 max-w-3xl">
        <h2 className="text-xs text-green-700 tracking-widest mb-8">// HOW IT WORKS</h2>
        <div className="space-y-6">
          {[
            { step: '01', title: 'Always on', desc: 'Petrulio runs on your server 24/7 via Moltbot. Heartbeats every 30 min. Checks GitHub, markets, news while you sleep.' },
            { step: '02', title: 'You talk, it ships', desc: 'Send a message on Telegram → Petrulio builds the feature, creates the PR, pushes to GitHub. You just review.' },
            { step: '03', title: 'Memory across sessions', desc: 'MEMORY.md, daily logs, project backlogs. Petrulio remembers everything — your goals, preferences, projects.' },
            { step: '04', title: 'Mission Control', desc: 'Real-time dashboard: stock watchlist, Notion tasks, MRR progress, system status. All in one terminal UI.' },
          ].map(item => (
            <div key={item.step} className="flex gap-6 group">
              <span className="text-green-800 text-4xl font-bold shrink-0">{item.step}</span>
              <div className="border-l border-green-900 pl-6">
                <h3 className="text-green-300 font-bold mb-1">{item.title}</h3>
                <p className="text-green-700 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="border-t border-green-900 px-8 py-16">
        <h2 className="text-xs text-green-700 tracking-widest mb-8">// TOOLS & PROJECTS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { emoji: '🎯', name: 'Mission Control', desc: 'Stocks, tasks, goals dashboard', href: '/dashboard', status: 'LIVE' },
            { emoji: '🦷', name: 'Dental Passport', desc: 'iOS dental health tracker', href: 'https://github.com/nt-petrulio/dental-passport-ios', status: 'IN DEV' },
            { emoji: '💰', name: 'FinPassport', desc: 'Personal finance web + iOS', href: 'https://github.com/nt-petrulio/finpassport-web', status: 'READY' },
            { emoji: '🤝', name: 'LinkedIn AI', desc: 'Chrome extension for outreach', href: 'https://github.com/nt-petrulio/linkedin-ai-extension', status: 'READY' },
            { emoji: '🇺🇦', name: 'Grant Tracker UA', desc: 'Ukrainian grant database', href: 'https://github.com/nt-petrulio/grant-tracker-ua', status: 'READY' },
            { emoji: '🔜', name: 'Next project', desc: 'Building soon...', href: '#', status: 'SOON' },
          ].map(t => (
            <a
              key={t.name}
              href={t.href}
              target={t.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="border border-green-900 hover:border-green-500 p-4 block transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{t.emoji}</span>
                <span className={`text-xs px-1 border ${t.status === 'LIVE' ? 'border-green-500 text-green-400' : t.status === 'IN DEV' ? 'border-yellow-700 text-yellow-600' : 'border-green-900 text-green-800'}`}>
                  {t.status}
                </span>
              </div>
              <h3 className="font-bold group-hover:text-green-300">{t.name}</h3>
              <p className="text-green-800 text-sm mt-1">{t.desc}</p>
            </a>
          ))}
        </div>
      </section>

      <footer className="border-t border-green-900 px-8 py-6 flex justify-between text-green-900 text-xs">
        <span>OPENCLAW · Built by Petrulio for Nazartsio</span>
        <span>localhost:3000</span>
      </footer>
    </main>
  );
}
