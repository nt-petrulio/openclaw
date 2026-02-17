import { getRankedIdeas, type Idea } from '@/lib/ideas';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  LIVE:       'bg-green-900 text-green-300 border-green-700',
  BUILDING:   'bg-blue-900 text-blue-300 border-blue-700',
  RESEARCHED: 'bg-yellow-900 text-yellow-300 border-yellow-700',
  IDEA:       'bg-gray-800 text-gray-400 border-gray-600',
  PAUSED:     'bg-orange-900 text-orange-300 border-orange-700',
  DROPPED:    'bg-red-900 text-red-400 border-red-700',
};

const CATEGORY_COLORS: Record<string, string> = {
  SaaS:       'text-violet-400',
  Tool:       'text-cyan-400',
  iOS:        'text-blue-400',
  Extension:  'text-pink-400',
  Absurdist:  'text-orange-400',
  Service:    'text-yellow-400',
  Content:    'text-green-400',
};

function ScoreBar({ value, max = 10, color }: { value: number; max?: number; color: string }) {
  const pct = (value / max) * 100;
  return (
    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden w-full">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 7 ? 'text-green-400 border-green-500' :
    score >= 5 ? 'text-yellow-400 border-yellow-500' :
    'text-red-400 border-red-500';
  return (
    <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-black text-xl flex-shrink-0 ${color}`}>
      {score.toFixed(1)}
    </div>
  );
}

function IdeaCard({ idea }: { idea: Idea & { score: number } }) {
  const statusStyle = STATUS_COLORS[idea.status] ?? STATUS_COLORS.IDEA;
  const catColor = CATEGORY_COLORS[idea.category] ?? 'text-gray-400';

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-green-800 transition-colors">
      <div className="flex items-start gap-4">
        <ScoreRing score={idea.score} />

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-lg">{idea.emoji}</span>
            <span className="font-black text-white text-base">{idea.name}</span>
            <span className={`text-xs font-bold border px-2 py-0.5 rounded-full ${statusStyle}`}>
              {idea.status}
            </span>
            <span className={`text-xs font-bold ${catColor}`}>{idea.category}</span>
          </div>

          {/* One-liner */}
          <p className="text-gray-400 text-sm mb-3">{idea.oneLiner}</p>

          {/* Score bars */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">MRR Potential</span>
                <span className="text-green-400 font-bold">{idea.mrrPotential}/10</span>
              </div>
              <ScoreBar value={idea.mrrPotential} color="bg-green-500" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Goal Fit</span>
                <span className="text-violet-400 font-bold">{idea.goalFit}/10</span>
              </div>
              <ScoreBar value={idea.goalFit} color="bg-violet-500" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Effort</span>
                <span className="text-orange-400 font-bold">{idea.effort}/10</span>
              </div>
              <ScoreBar value={idea.effort} color="bg-orange-500" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Market Size</span>
                <span className="text-cyan-400 font-bold">{idea.marketSize}/10</span>
              </div>
              <ScoreBar value={idea.marketSize} color="bg-cyan-500" />
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-gray-500">
              💰 <span className="text-gray-300">{idea.monetization}</span>
            </span>
            <div className="flex gap-2">
              {idea.github && (
                <a
                  href={idea.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-green-400 transition"
                >
                  GitHub →
                </a>
              )}
            </div>
          </div>

          {/* Notes */}
          {idea.notes && (
            <p className="text-xs text-gray-600 mt-2 italic">{idea.notes}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function IdeasPage() {
  const ideas = getRankedIdeas();
  const avgScore = ideas.reduce((s, i) => s + i.score, 0) / ideas.length;
  const topIdea = ideas[0];
  const liveCount = ideas.filter((i) => i.status === 'LIVE').length;
  const buildingCount = ideas.filter((i) => i.status === 'BUILDING').length;

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/dashboard" className="text-gray-600 hover:text-green-400 text-sm transition">
            ← Dashboard
          </Link>
          <h1 className="text-2xl font-black text-green-400 mt-1">💡 Idea Tracker</h1>
          <p className="text-gray-500 text-sm">Ranked by weighted score · Goal: $50k MRR</p>
        </div>
        <div className="flex gap-4 text-center">
          <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2">
            <div className="text-2xl font-black text-green-400">{ideas.length}</div>
            <div className="text-xs text-gray-500">Total Ideas</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2">
            <div className="text-2xl font-black text-green-400">{liveCount}</div>
            <div className="text-xs text-gray-500">Live</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2">
            <div className="text-2xl font-black text-blue-400">{buildingCount}</div>
            <div className="text-xs text-gray-500">Building</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2">
            <div className="text-2xl font-black text-yellow-400">{avgScore.toFixed(1)}</div>
            <div className="text-xs text-gray-500">Avg Score</div>
          </div>
        </div>
      </div>

      {/* Top Pick */}
      <div className="bg-gray-900 border border-green-800 rounded-xl p-4 mb-6 flex items-center gap-4">
        <span className="text-3xl">{topIdea.emoji}</span>
        <div>
          <div className="text-xs text-green-600 font-bold uppercase tracking-wide mb-0.5">🏆 Highest Score — Focus Here</div>
          <div className="text-white font-black">{topIdea.name}</div>
          <div className="text-gray-400 text-sm">{topIdea.notes}</div>
        </div>
        <div className="ml-auto text-3xl font-black text-green-400">{topIdea.score.toFixed(1)}</div>
      </div>

      {/* Score legend */}
      <div className="flex gap-4 text-xs text-gray-600 mb-4 flex-wrap">
        <span>Score formula:</span>
        <span className="text-green-500">MRR Potential ×35%</span>
        <span className="text-violet-500">Goal Fit ×35%</span>
        <span className="text-orange-500">Low Effort ×15%</span>
        <span className="text-cyan-500">Market Size ×15%</span>
      </div>

      {/* Ideas list */}
      <div className="space-y-4">
        {ideas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </div>

      <p className="text-center text-gray-700 text-xs mt-8">
        Add ideas → edit /home/molt/clawd/projects/openclaw/lib/ideas.ts
      </p>
    </div>
  );
}
