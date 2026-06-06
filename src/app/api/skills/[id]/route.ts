import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Skill from '@/models/Skill';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await connectDB();
    const body = await req.json();
    const skill = await Skill.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!skill) return NextResponse.json({ success: false, message: 'Skill not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: skill });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to update skill' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await connectDB();
    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) return NextResponse.json({ success: false, message: 'Skill not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Skill deleted' });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to delete skill' }, { status: 500 });
  }
}
