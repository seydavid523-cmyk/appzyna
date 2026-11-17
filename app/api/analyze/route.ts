import { NextResponse } from 'next/server';
import { analyzeWebsite } from '@/lib/analyzer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { url?: unknown };
    if (typeof body.url !== 'string' || !body.url.trim()) {
      return NextResponse.json({ error: 'Enter a website URL to analyze.' }, { status: 400 });
    }
    const result = await analyzeWebsite(body.url);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We could not read that website.';
    return NextResponse.json({ error: `We could not analyze this website: ${message}` }, { status: 422 });
  }
}
