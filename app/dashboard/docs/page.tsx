import Link from 'next/link';
import fs from 'fs';

export const dynamic = 'force-dynamic';

const WORKSPACE = '/home/ubuntu/.openclaw/workspace';

const DOC_FILES = [
  { key: 'GOALS.md',    label: 'Goals',    color: 'text-yellow-300 border-yellow-900' },
  { key: 'IDENTITY.md', label: 'Identity', color: 'text-violet-300 border-violet-900' },
  { key: 'SOUL.md',     label: 'Soul',     color: 'text-pink-300 border-pink-900' },
  { key: 'BACKLOG.md',  label: 'Backlog',  color: 'text-green-300 border-green-900' },
  { key: 'LESSONS.md',  label: 'Lessons',  color: 'text-orange-300 border-orange-900' },
  { key: 'AGENTS.md',   label: 'Agents',   color: 'text-blue-300 border-blue-900' },
  { key: 'TOOLS.md',    label: 'Tools',    color: 'text-cyan-300 border-cyan-900' },
  { key: 'USER.md',     label: 'User',     color: 'text-green-300 border-green-900' },
];

interface DocFile {
  key: string;
  label: string;
  color: string;
  content: string;
  lines: number;
  size: number;
}

function readDocs(): DocFile[] {
  return DOC_FILES.map(({ key, label, color }) => {
    try {
      const content = fs.readFileSync(`${WORKSPACE}/${key}`, 'utf-8');
      return { key, label, color, content, lines: content.split('\n').length, size: Buffer.byteLength(content) };
    } catch {
      return { key, label, color, content: '', lines: 0, size: 0 };
    }
  }).filter(d => d.lines > 0);
}

function renderMarkdown(content: string) {
  return content.split('\n').slice(0, 80).map((line, i) => {
    if (line.startsWith('# ')) return { type: 'h1', text: line.slice(2), key: i };
    if (line.startsWith('## ')) return { type: 'h2', text: line.slice(3), key: i };
    if (line.startsWith('### ')) return { type: 'h3', text: line.slice(4), key: i };
    if (line.startsWith('**') && line.endsWith('**')) return { type: 'bold', text: line.replace(/\*\*/g, ''), key: i };
    if (line.startsWith('- ') || line.startsWith('* ')) return { type: 'li', text: line.slice(2), key: i };
    if (line.startsWith('```')) return { type: 'code', text: '', key: i };
    if (line.startsWith('> ')) return { type: 'quote', text: line.slice(2), key: i };
    if (line.trim() === '') return { type: 'blank', text: '', key: i };
    return { type: 'p', text: line, key: i };
  });
}

export default function DocsPage() {
  const docs = readDocs();

  return (
    <main className="min-h-screen bg-black text-green-500 font-mono p-4 md:p-6">
      <header className="border-b border-green-900 pb-4 mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <div className="text-green-900 text-xs tracking-[0.35em] mb-1">MISSION CONTROL</div>
          <h1 className="text-3xl font-black text-green-300">DOCS</h1>
          <div className="flex gap-4 mt-2 text-xs text-green-800">
            <span>{docs.length} documents</span>
            <span>{docs.reduce((s, d) => s + d.lines, 0)} total lines</span>
          </div>
        </div>
        <Link href="/dashboard" className="border border-green-900 px-3 py-1.5 text-green-800 hover:text-green-400 text-xs">← dashboard</Link>
      </header>

      {/* File tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {docs.map(doc => (
          <a key={doc.key} href={`#${doc.key}`}
            className={`border ${doc.color} px-3 py-1 text-xs hover:opacity-80 transition-opacity`}>
            {doc.label}
            <span className="ml-2 text-green-900">{doc.lines}L</span>
          </a>
        ))}
      </div>

      {/* Document panels */}
      <div className="space-y-6">
        {docs.map(doc => {
          const parsed = renderMarkdown(doc.content);
          const totalLines = doc.content.split('\n').length;
          return (
            <section key={doc.key} id={doc.key} className="border border-green-950 bg-zinc-950/40 scroll-mt-6">
              <div className={`border-b border-green-950 px-4 py-2 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <h2 className={`text-sm font-bold ${doc.color.split(' ')[0]}`}>{doc.label}</h2>
                  <span className="text-green-900 text-xs">{doc.key}</span>
                </div>
                <div className="text-green-900 text-[10px]">
                  {doc.lines} lines · {Math.round(doc.size / 1024 * 10) / 10}kb
                </div>
              </div>
              <div className="p-4 space-y-0.5">
                {parsed.map(token => {
                  if (token.type === 'blank') return <div key={token.key} className="h-2" />;
                  if (token.type === 'h1') return <div key={token.key} className="text-green-200 font-black text-base mt-3 mb-1">{token.text}</div>;
                  if (token.type === 'h2') return <div key={token.key} className="text-green-400 font-bold text-xs tracking-widest mt-4 mb-1 border-b border-green-950 pb-1">{token.text}</div>;
                  if (token.type === 'h3') return <div key={token.key} className="text-green-500 font-bold text-xs mt-2 mb-0.5">{token.text}</div>;
                  if (token.type === 'bold') return <div key={token.key} className="text-green-300 text-xs font-bold mt-2">{token.text}</div>;
                  if (token.type === 'li') return <div key={token.key} className="text-green-800 text-xs pl-3 border-l border-green-950 my-0.5 line-clamp-2">{token.text}</div>;
                  if (token.type === 'quote') return <div key={token.key} className="text-green-700 text-xs italic pl-3 border-l-2 border-green-800 my-1">{token.text}</div>;
                  if (token.type === 'code') return <div key={token.key} className="text-green-950 text-[10px]">---</div>;
                  return <div key={token.key} className="text-green-900 text-xs leading-relaxed">{token.text}</div>;
                })}
                {totalLines > 80 && (
                  <div className="text-green-950 text-[10px] mt-3 pt-2 border-t border-green-950">
                    +{totalLines - 80} more lines not shown
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
