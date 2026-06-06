import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import HeroConfig from '@/models/HeroConfig';
import Skill from '@/models/Skill';

// Seed endpoint — only works if no admin exists (run once)
export async function POST(req: NextRequest) {
  try {
    const { secret } = await req.json();
    if (secret !== process.env.NEXTAUTH_SECRET) {
      return NextResponse.json({ success: false, message: 'Invalid secret' }, { status: 401 });
    }

    await connectDB();

    // Create admin user if not exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      await User.create({
        name: 'Chandni Poddar',
        email: process.env.ADMIN_EMAIL || 'admin@chandni.dev',
        password: process.env.ADMIN_PASSWORD || 'Admin@1234',
        role: 'admin',
      });
    }

    // Create default hero config if not exists
    const existingHero = await HeroConfig.findOne();
    if (!existingHero) {
      await HeroConfig.create({
        name: 'Chandni Poddar',
        designation: 'Full Stack Developer',
        taglines: ['Full Stack Developer', 'Flutter Developer', 'AI/ML Enthusiast', 'Open Source Contributor'],
        bio: 'Passionate about building elegant, scalable web and mobile applications.',
        socialLinks: [
          { platform: 'GitHub', url: 'https://github.com/', icon: 'github' },
          { platform: 'LinkedIn', url: 'https://linkedin.com/in/', icon: 'linkedin' },
          { platform: 'Twitter', url: 'https://twitter.com/', icon: 'twitter' },
        ],
      });
    }

    // Seed default skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      const defaultSkills = [
        { name: 'C++', category: 'Programming Languages', color: '#00599C', order: 1 },
        { name: 'Java', category: 'Programming Languages', color: '#ED8B00', order: 2 },
        { name: 'Python', category: 'Programming Languages', color: '#3776AB', order: 3 },
        { name: 'JavaScript', category: 'Programming Languages', color: '#F7DF1E', order: 4 },
        { name: 'Dart', category: 'Programming Languages', color: '#0175C2', order: 5 },
        { name: 'HTML', category: 'Frontend', color: '#E34F26', order: 1 },
        { name: 'CSS', category: 'Frontend', color: '#1572B6', order: 2 },
        { name: 'React', category: 'Frontend', color: '#61DAFB', order: 3 },
        { name: 'Next.js', category: 'Frontend', color: '#000000', order: 4 },
        { name: 'Tailwind CSS', category: 'Frontend', color: '#06B6D4', order: 5 },
        { name: 'Node.js', category: 'Backend', color: '#339933', order: 1 },
        { name: 'Express.js', category: 'Backend', color: '#000000', order: 2 },
        { name: 'PHP', category: 'Backend', color: '#777BB4', order: 3 },
        { name: 'MongoDB', category: 'Database', color: '#47A248', order: 1 },
        { name: 'MySQL', category: 'Database', color: '#4479A1', order: 2 },
        { name: 'Git', category: 'Tools', color: '#F05032', order: 1 },
        { name: 'GitHub', category: 'Tools', color: '#181717', order: 2 },
        { name: 'VS Code', category: 'Tools', color: '#007ACC', order: 3 },
        { name: 'Android Studio', category: 'Tools', color: '#3DDC84', order: 4 },
        { name: 'Machine Learning', category: 'AI & Cloud', color: '#FF6F00', order: 1 },
        { name: 'Generative AI', category: 'AI & Cloud', color: '#4285F4', order: 2 },
        { name: 'AWS', category: 'AI & Cloud', color: '#FF9900', order: 3 },
        { name: 'Google Cloud', category: 'AI & Cloud', color: '#4285F4', order: 4 },
        { name: 'Flutter', category: 'Mobile', color: '#02569B', order: 1 },
      ];
      await Skill.insertMany(defaultSkills);
    }

    return NextResponse.json({ success: true, message: 'Seed completed successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, message: 'Seed failed', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
