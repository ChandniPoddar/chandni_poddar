import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'general';
    const resourceType = (formData.get('resourceType') as 'image' | 'raw' | 'auto') || 'auto';

    if (!file) return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { url, publicId } = await uploadToCloudinary(buffer, folder, resourceType);

    return NextResponse.json({ success: true, url, publicId });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Upload failed' }, { status: 500 });
  }
}
