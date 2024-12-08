import { NextResponse } from 'next/server';
import { kv } from '@/lib/kv';

// GET all marks
export async function GET() {
  try {
    const marks = await kv.hgetall('marks');
    return NextResponse.json(marks || {});
  } catch {
    return NextResponse.json({ error: 'Failed to fetch marks' }, { status: 500 });
  }
}

// POST new marks
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, marks } = body;
    
    if (!studentId || !marks) {
      return NextResponse.json(
        { error: 'Student ID and marks are required' },
        { status: 400 }
      );
    }

    await kv.hset('marks', { [studentId]: marks });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to save marks' },
      { status: 500 }
    );
  }
}

// PUT (update) marks
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { studentId, marks } = body;
    
    if (!studentId || !marks) {
      return NextResponse.json(
        { error: 'Student ID and marks are required' },
        { status: 400 }
      );
    }

    const exists = await kv.hexists('marks', studentId);
    if (!exists) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    await kv.hset('marks', { [studentId]: marks });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update marks' },
      { status: 500 }
    );
  }
}
