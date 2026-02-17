import { NextResponse } from 'next/server';
import { getAllProjectData } from '@/lib/projects';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const projects = getAllProjectData();
    return NextResponse.json(projects);
  } catch (err) {
    console.error('Failed to get project data:', err);
    return NextResponse.json({ error: 'Failed to load project data' }, { status: 500 });
  }
}
