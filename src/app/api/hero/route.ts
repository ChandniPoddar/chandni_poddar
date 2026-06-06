import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import connectDB from '@/lib/mongodb';
import HeroConfig from '@/models/HeroConfig';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    let hero = await HeroConfig.findOne();
    if (!hero) {
      hero = await HeroConfig.create({});
    }
    return NextResponse.json({ success: true, data: hero });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch hero config' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const body = await req.json();
    let hero = await HeroConfig.findOne();
    if (!hero) {
      hero = await HeroConfig.create(body);
    } else {
      hero = await HeroConfig.findOneAndUpdate({}, body, { new: true, runValidators: true });
    }
    return NextResponse.json({ success: true, data: hero });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to update hero config' }, { status: 500 });
  }
}
