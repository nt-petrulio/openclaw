import Link from 'next/link';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const MEMORY_DIR = '/home/ubuntu/.openclaw/workspace/memory';
const MAIN_MEMORY = '/home/ubuntu/.openclaw/workspace/MEMORY.md';

interface MemoryFile {
  filename: string;
  title: string;
  preview: string;
  size: number;
  mtime: Date;
}

function readMemoryFiles(): MemoryFile[] {
  try {
    const files = fs.readdirSync(MEMORY_DIR).filter(f => f.endsWith('.md'));
    return files.map(filename => {
      const filepath = path.join(MEMORY_DIR, filename);
      const stat = fs.statSync(filepath);
      const content = fs.readFileSync(filepath, 'utf-8');
      const lines = content.split('\n').filter(l => l.trim());
      // Extract title from frontmatter or first heading
      const titleLine = lines.find(l => l.startsWith('name:')) ?? lines.find(l => l.startsWith('#')) ?? filename;
      const title = titleLine.replace(/^name:\s*["']?/, '').replace(/["']?\s*$/, '').replace(/^#+\s*/, '');
      const preview = lines.filter(l => !l.startsWith('---') && !l.startsWith('name:') && !l.startsWith('description:') && !l.startsWith('metadata:') && !l.startsWith('type:') && l.trim()).slice(0, 2).join(' ').slice(0, 140);
      return { filename, title, preview, size: stat.size, mtime: stat.mtime };
    }).sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
  } catch {
    return [];
  }
}

function readMainMemory(): string {
  try {
    return fs.readFileSync(MAIN_MEMORY, 'utf-8');
  } catch {
    return '';
  }
}

function countMemoryEntries(content: string): number {
  return content.split('\n').filter(l => l.startsWith('## ') || l.startsWith('**')).length;
}

function parseMainMemorySections(content: string): { title: string; lines: string[] }[] {
  const sections: { title: string; lines: string[] }[] = [];
  let current: { title: string; lines: string[] } | null = null;
  for (const line of content.split('\n')) {
    if (line.startsWith('## ')) {
      if (current) sections.push(current);
      current = { title: line.replace('## ', ''), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);
  return sections;
}

export default function MemoryPage() {
  const memoryFiles = readMemoryFiles();
  const mainMemory = readMainMemory();
  const sections = parseMainMemorySections(mainMemory);

  return (
    <main className="min-h-screen bg-black text-green-500 font-mono p-4 md:p-6">
      <header className="border-b border-green-900 pb-4 mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <div className="text-green-900 text-xs tracking-[0.35em] mb-1">MISSION CONTROL</div>
          <h1 className="text-3xl font-black text-green-300">MEMORY</h1>
          <div className="flex gap-4 mt-2 text-xs text-green-800">
            <span>{memoryFiles.length} memory files</span>
            <span>{countMemoryEntries(mainMemory)} entries in MEMORY.md</span>
          </div>
        </div>
        <Link href="/dashboard" className="border border-green-900 px-3 py-1.5 text-green-800 hover:text-green-400 text-xs">← dashboard</Link>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Memory files */}
        <div className="xl:col-span-1">
          <div className="text-xs text-green-900 tracking-widest mb-3">{'// MEMORY FILES'}</div>
          <div className="space-y-2">
            {memoryFiles.map(file => (
              <div key={file.filename} className="border border-green-950 bg-zinc-950/50 p-3 hover:border-green-800 transition-colors">
                <div className="text-green-300 text-sm font-bold truncate">{file.title}</div>
                <div className="text-green-900 text-[10px] mt-0.5">{file.filename}</div>
                {file.preview && (
                  <div className="text-green-800 text-[11px] mt-2 line-clamp-2 leading-relaxed">{file.preview}</div>
                )}
                <div className="text-green-950 text-[10px] mt-2">
                  {Math.round(file.size / 1024 * 10) / 10}kb · {file.mtime.toLocaleDateString('uk-UA')}
                </div>
              </div>
            ))}
            {memoryFiles.length === 0 && (
              <div className="text-green-900 text-xs p-4 border border-green-950">no memory files</div>
            )}
          </div>
        </div>

        {/* Main MEMORY.md sections */}
        <div className="xl:col-span-2">
          <div className="text-xs text-green-900 tracking-widest mb-3">{'// MEMORY.md CONTENTS'}</div>
          <div className="space-y-4">
            {sections.map(section => (
              <div key={section.title} className="border border-green-950 bg-zinc-950/40">
                <div className="border-b border-green-950 px-4 py-2 flex items-center justify-between">
                  <h2 className="text-xs text-green-600 tracking-widest font-bold">{section.title}</h2>
                </div>
                <div className="p-4">
                  {section.lines
                    .filter(l => l.trim())
                    .slice(0, 12)
                    .map((line, i) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <div key={i} className="text-green-300 text-xs font-bold mt-2 mb-1">{line.replace(/\*\*/g, '')}</div>;
                      }
                      if (line.startsWith('- ') || line.startsWith('* ')) {
                        return <div key={i} className="text-green-800 text-xs pl-2 border-l border-green-950 my-0.5 line-clamp-1">{line.slice(2)}</div>;
                      }
                      if (line.startsWith('### ')) {
                        return <div key={i} className="text-green-500 text-xs font-bold mt-2">{line.replace('### ', '')}</div>;
                      }
                      return <div key={i} className="text-green-900 text-xs my-0.5 line-clamp-1">{line}</div>;
                    })}
                  {section.lines.filter(l => l.trim()).length > 12 && (
                    <div className="text-green-950 text-[10px] mt-2">+{section.lines.filter(l => l.trim()).length - 12} more lines</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
