import { NextResponse } from 'next/server';
import { getFinanceAgentStatus } from '@/lib/projects';

export const dynamic = 'force-dynamic';

export async function GET() {
  const status = getFinanceAgentStatus();
  if (!status) {
    return NextResponse.json(
      {
        id: 'finance-agent',
        status: 'blocked',
        blocker: 'finance status unavailable',
        safeForMissionControl: true,
        rawBalancesIncluded: false,
      },
      { status: 503 }
    );
  }

  return NextResponse.json(status);
}
