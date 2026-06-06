import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const messages = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: messages });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, subject, message } = body;
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }
    const contact = await Contact.create({ name, email, subject, message });
    return NextResponse.json({ success: true, data: contact, message: "Message sent successfully!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to send message', error }, { status: 500 });
  }
}
