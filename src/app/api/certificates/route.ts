import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Certificate from '@/models/Certificate';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const certificates = await Certificate.find().sort({ order: 1, issueDate: -1 });
    return NextResponse.json({ success: true, data: certificates });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const body = await req.json();
    const certificate = await Certificate.create(body);
    return NextResponse.json({ success: true, data: certificate }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create', error }, { status: 500 });
  }
}
