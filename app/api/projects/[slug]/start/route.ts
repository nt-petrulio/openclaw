import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import { PROJECT_CONFIGS } from '@/lib/projects';

export const dynamic = 'force-dynamic';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const project = PROJECT_CONFIGS.find((p) => p.slug === slug);
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  try {
    // Try pm2 start first, then fallback
    const pm2Name = slug === 'mission-control' ? 'openclaw' : slug;
    execSync(`pm2 start ${pm2Name}`, { timeout: 10000 });
    return NextResponse.json({ success: true, action: 'start', name: pm2Name });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
