export type IdeaStatus = 'IDEA' | 'RESEARCHED' | 'BUILDING' | 'LIVE' | 'PAUSED' | 'DROPPED';
export type IdeaCategory = 'SaaS' | 'Tool' | 'iOS' | 'Extension' | 'Absurdist' | 'Service' | 'Content';

export interface Idea {
  id: string;
  name: string;
  emoji: string;
  category: IdeaCategory;
  status: IdeaStatus;
  oneLiner: string;
  mrrPotential: number;   // 1-10: how much MRR this can realistically generate
  effort: number;         // 1-10: 1 = weekend, 10 = 6 months
  goalFit: number;        // 1-10: alignment with $50k MRR goal
  marketSize: number;     // 1-10: size of addressable market
  monetization: string;
  notes?: string;
  github?: string;
  addedDate: string;
}

// Score = weighted average. Goal fit weighted highest.
export function scoreIdea(idea: Idea): number {
  const score =
    idea.mrrPotential * 0.35 +
    (11 - idea.effort) * 0.15 + // lower effort = higher score
    idea.goalFit * 0.35 +
    idea.marketSize * 0.15;
  return Math.round(score * 10) / 10;
}

export const IDEAS: Idea[] = [
  {
    id: 'ratemy-excuse',
    name: 'ratemy.excuse',
    emoji: '🎭',
    category: 'Tool',
    status: 'LIVE',
    oneLiner: 'AI rates your excuse A-F. Shareable grade card. Premium fixer.',
    mrrPotential: 5,
    effort: 2,
    goalFit: 4,
    marketSize: 7,
    monetization: '$1.29/mo Premium + ads',
    notes: 'Built & deployed locally. Ready for Vercel. Viral potential high, MRR ceiling low.',
    github: 'https://github.com/nt-petrulio/ratemy-excuse',
    addedDate: '2026-02-17',
  },
  {
    id: 'dental-passport',
    name: 'Dental Passport iOS',
    emoji: '🦷',
    category: 'iOS',
    status: 'BUILDING',
    oneLiner: 'Personal dental records app — photos, timeline, insurance, travel guide.',
    mrrPotential: 7,
    effort: 8,
    goalFit: 7,
    marketSize: 6,
    monetization: '$4.99/mo Premium or $29.99 one-time',
    notes: 'Core built. Emergency Guide + Insurance Tracker confirmed next. HealthKit integration planned.',
    github: 'https://github.com/nt-petrulio/dental-passport-ios',
    addedDate: '2026-01-26',
  },
  {
    id: 'finpassport-web',
    name: 'FinPassport Web',
    emoji: '💰',
    category: 'SaaS',
    status: 'BUILDING',
    oneLiner: 'Personal finance tracker — multi-currency, Monobank sync, analytics.',
    mrrPotential: 8,
    effort: 7,
    goalFit: 8,
    marketSize: 8,
    monetization: '$7.99/mo Pro',
    notes: 'Web dashboard built. Needs Supabase config + real device testing.',
    github: 'https://github.com/nt-petrulio/finpassport-web',
    addedDate: '2026-02-14',
  },
  {
    id: 'grant-tracker-ua',
    name: 'Grant Tracker UA',
    emoji: '🇺🇦',
    category: 'SaaS',
    status: 'BUILDING',
    oneLiner: 'Ukrainian grant database with search, filters, and email alerts.',
    mrrPotential: 6,
    effort: 5,
    goalFit: 6,
    marketSize: 5,
    monetization: '$15/mo Pro',
    notes: 'Landing done. n8n + Airtable stack would be fast MVP. Validate demand first.',
    github: 'https://github.com/nt-petrulio/grant-tracker-ua',
    addedDate: '2026-02-15',
  },
  {
    id: 'linkedin-ai',
    name: 'LinkedIn AI Extension',
    emoji: '🤝',
    category: 'Extension',
    status: 'BUILDING',
    oneLiner: 'Chrome extension that generates personalized outreach messages from profiles.',
    mrrPotential: 7,
    effort: 4,
    goalFit: 7,
    marketSize: 8,
    monetization: '$9.99/mo — B2B sales/recruiting niche',
    notes: 'MVP built. Needs Chrome DevMode testing. High-value B2B niche.',
    github: 'https://github.com/nt-petrulio/linkedin-ai-extension',
    addedDate: '2026-02-15',
  },
  {
    id: 'football-analytics',
    name: 'Football Stats App',
    emoji: '⚽',
    category: 'SaaS',
    status: 'RESEARCHED',
    oneLiner: 'League tables with playoff probability bars + AI "what does this mean for my team?"',
    mrrPotential: 7,
    effort: 6,
    goalFit: 6,
    marketSize: 9,
    monetization: '$4.99/mo Premium (more leagues, push notifications)',
    notes: 'FiveThirtyEight soccer died 2023 — gap unfilled. football-data.org free API. Mass market.',
    addedDate: '2026-02-17',
  },
  {
    id: 'n8n-airtable-grants',
    name: 'n8n + Airtable Grant CRM',
    emoji: '⚡',
    category: 'Tool',
    status: 'IDEA',
    oneLiner: 'n8n scrapes grants → Airtable CRM → team reviews → email alerts to subscribers.',
    mrrPotential: 6,
    effort: 3,
    goalFit: 6,
    marketSize: 5,
    monetization: 'Part of Grant Tracker UA offering',
    notes: 'Fast way to launch Grant Tracker without writing backend. Weekend project.',
    addedDate: '2026-02-17',
  },
  {
    id: 'scenichna-mova',
    name: 'Сценічна мова — інфопродукт',
    emoji: '🎤',
    category: 'Content',
    status: 'IDEA',
    oneLiner: 'Онлайн-курс публічного мовлення від викладача сценічної мови та режисерської майстерності.',
    mrrPotential: 7,
    effort: 4,
    goalFit: 6,
    marketSize: 6,
    monetization: 'Free вебінар → міні-курс $29 → повний курс $149 → VIP $50/год',
    notes: 'Мама — реальна експертиза (режисерська майстерність + сценічна мова). Унікальний кут vs generic public speaking. Трафік: TikTok студенти + Instagram фахівці.',
    addedDate: '2026-02-17',
  },
  {
    id: 'professional-silence',
    name: 'professionalsilence.io',
    emoji: '🤫',
    category: 'Absurdist',
    status: 'IDEA',
    oneLiner: '$29/hr certified professional sits silently on your Zoom call.',
    mrrPotential: 3,
    effort: 1,
    goalFit: 2,
    marketSize: 4,
    monetization: '$29/hr one-time bookings',
    notes: 'Viral stunt potential. Low MRR ceiling. Fun project.',
    addedDate: '2026-02-17',
  },
  {
    id: 'yt-staging',
    name: 'YT Video Staging',
    emoji: '📹',
    category: 'Tool',
    status: 'BUILDING',
    oneLiner: 'Dashboard for staging, reviewing and approving YouTube videos before publish.',
    mrrPotential: 5,
    effort: 5,
    goalFit: 5,
    marketSize: 5,
    monetization: '$9.99/mo per channel',
    notes: 'MVP built. Needs Supabase + Google OAuth setup.',
    github: 'https://github.com/nt-petrulio/yt-video-staging',
    addedDate: '2026-02-11',
  },
];

export function getRankedIdeas(): (Idea & { score: number })[] {
  return IDEAS
    .map((idea) => ({ ...idea, score: scoreIdea(idea) }))
    .sort((a, b) => b.score - a.score);
}
