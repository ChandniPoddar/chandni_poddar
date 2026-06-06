import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Experience from '@/models/Experience';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const experiences = await Experience.find().sort({ order: 1, startDate: -1 });
    return NextResponse.json({ success: true, data: experiences });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch experience' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const body = await req.json();
    const experience = await Experience.create(body);
    return NextResponse.json({ success: true, data: experience }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create experience', error }, { status: 500 });
  }
}
