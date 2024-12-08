import { NextResponse } from 'next/server';
import { kv, type StudentMarks } from '@/lib/kv';

// GET all marks
export async function GET() {
  try {
    console.log('GET /api/marks - Fetching all marks');
    const marks = await kv.hgetall('marks');
    console.log('GET /api/marks - Fetched marks:', marks);
    return NextResponse.json(marks || {});
  } catch (error) {
    console.error('GET /api/marks - Error:', error);
    return NextResponse.json({ error: 'Failed to fetch marks' }, { status: 500 });
  }
}

// POST new marks
export async function POST(request: Request) {
  try {
    console.log('POST /api/marks - Received request');
    const body = await request.json();
    console.log('POST /api/marks - Request body:', body);
    const { studentId, marks }: { studentId: string, marks: StudentMarks } = body;
    
    if (!studentId || !marks) {
      console.error('POST /api/marks - Missing required fields');
      return NextResponse.json(
        { error: 'Student ID and marks are required' },
        { status: 400 }
      );
    }

    console.log('POST /api/marks - Saving marks for student:', studentId);
    await kv.hset('marks', studentId, JSON.stringify(marks));
    console.log('POST /api/marks - Successfully saved marks');
    
    // Verify the save
    const savedData = await kv.hgetall('marks');
    console.log('POST /api/marks - Verification - Saved data:', savedData);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/marks - Error:', error);
    return NextResponse.json(
      { error: 'Failed to save marks' },
      { status: 500 }
    );
  }
}

// PUT (update) marks
export async function PUT(request: Request) {
  try {
    console.log('PUT /api/marks - Received request');
    const body = await request.json();
    console.log('PUT /api/marks - Request body:', body);
    const { studentId, marks }: { studentId: string, marks: StudentMarks } = body;
    
    if (!studentId || !marks) {
      console.error('PUT /api/marks - Missing required fields');
      return NextResponse.json(
        { error: 'Student ID and marks are required' },
        { status: 400 }
      );
    }

    // For PUT, we'll save regardless of whether it exists
    console.log('PUT /api/marks - Updating marks for student:', studentId);
    await kv.hset('marks', studentId, JSON.stringify(marks));
    console.log('PUT /api/marks - Successfully updated marks');
    
    // Verify the save
    const savedData = await kv.hgetall('marks');
    console.log('PUT /api/marks - Verification - Saved data:', savedData);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT /api/marks - Error:', error);
    return NextResponse.json(
      { error: 'Failed to update marks' },
      { status: 500 }
    );
  }
}
