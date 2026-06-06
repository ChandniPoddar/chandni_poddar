import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const filter: Record<string, unknown> = {};
    if (category && category !== 'all') filter.category = category;
    if (featured === 'true') filter.featured = true;
    const projects = await Project.find(filter).sort({ featured: -1, order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: projects });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const body = await req.json();
    if (!body.slug) body.slug = slugify(body.title);
    const project = await Project.create(body);
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create project', error }, { status: 500 });
  }
}
