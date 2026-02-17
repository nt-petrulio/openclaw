import { getStockPrice } from '@/lib/stocks';
import { getNotionTasks } from '@/lib/notion';
import Link from 'next/link';

export default async function Dashboard() {
  const symbols = ['MSFT', 'AMZN', 'DUOL', 'FICO'];
  const stocks = await Promise.all(symbols.map(s => getStockPrice(s)));
  const tasks = await getNotionTasks();

  return (
    <main className="min-h-screen bg-black text-green-500 p-8 font-mono">
      <div className="flex items-center justify-between mb-8 border-b border-green-500 pb-2">
        <h1 className="text-4xl font-bold">MISSION CONTROL v1.0</h1>
        <Link href="/" className="text-green-700 hover:text-green-400 text-sm">← back to openclaw</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Market Widget */}
        <section className="border border-green-500 p-4">
          <h2 className="text-xl mb-4 border-b border-green-500">📈 MARKET WATCHLIST</h2>
          <div className="space-y-2">
            {stocks.map(s => (
              <div key={s.symbol} className="flex justify-between">
                <span>{s.symbol}</span>
                <span className={parseFloat(s.change) >= 0 ? 'text-green-400' : 'text-red-500'}>
                  ${parseFloat(s.price).toFixed(2)} ({s.percentChange})
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Tasks Widget */}
        <section className="border border-green-500 p-4">
          <h2 className="text-xl mb-4 border-b border-green-500">📌 NOTION TASKS</h2>
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-green-800 text-sm">Set NOTION_API_KEY to load tasks</p>
            ) : (
              tasks.map((t: any) => (
                <div key={t.id} className="flex justify-between text-sm">
                  <span className="truncate w-2/3">[{t.priority}] {t.title}</span>
                  <span className="text-xs border border-green-800 px-1">{t.status}</span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Goals Widget */}
        <section className="border border-green-500 p-4">
          <h2 className="text-xl mb-4 border-b border-green-500">🎯 GOALS</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>MRR Progress</span>
                <span>$0 / $50,000</span>
              </div>
              <div className="w-full bg-green-900 h-4 border border-green-500">
                <div className="bg-green-500 h-full w-0"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Net Worth</span>
                <span>$53k / $1M</span>
              </div>
              <div className="w-full bg-green-900 h-4 border border-green-500">
                <div className="bg-green-500 h-full" style={{ width: '5.3%' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* System Status */}
        <section className="border border-green-500 p-4">
          <h2 className="text-xl mb-4 border-b border-green-500">⚙️ SYSTEM STATUS</h2>
          <div className="text-xs space-y-1">
            <p>LOCATION: UKRAINE 🇺🇦</p>
            <p>LOCAL TIME: {new Date().toLocaleTimeString('uk-UA', { timeZone: 'Europe/Kyiv' })}</p>
            <p>UPTIME: 100%</p>
            <p>AGENT: PETRULIO 🚀</p>
            <p className="text-blue-400 mt-2 animate-pulse">STATUS: ALL SYSTEMS OPERATIONAL</p>
          </div>
        </section>
      </div>
    </main>
  );
}
