import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Skill from '@/models/Skill';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const skills = await Skill.find().sort({ category: 1, order: 1 });
    return NextResponse.json({ success: true, data: skills });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const skill = await Skill.create(body);
    return NextResponse.json({ success: true, data: skill }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create skill', error }, { status: 500 });
  }
}
