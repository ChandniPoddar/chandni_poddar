import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface IHeroConfig extends Document {
  name: string;
  designation: string;
  taglines: string[];
  bio: string;
  profileImage: string;
  resumeUrl: string;
  socialLinks: ISocialLink[];
  ctaText: string;
  updatedAt: Date;
}

const HeroConfigSchema = new Schema<IHeroConfig>(
  {
    name: { type: String, required: true, default: 'Chandni Poddar' },
    designation: { type: String, required: true, default: 'Full Stack Developer' },
    taglines: { type: [String], default: ['Full Stack Developer', 'Flutter Developer', 'AI/ML Enthusiast', 'Open Source Contributor'] },
    bio: { type: String, default: 'Passionate about building elegant, scalable web and mobile applications.' },
    profileImage: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    socialLinks: [
      {
        platform: { type: String },
        url: { type: String },
        icon: { type: String },
      },
    ],
    ctaText: { type: String, default: "Let's Work Together" },
  },
  { timestamps: true }
);

const HeroConfig: Model<IHeroConfig> =
  mongoose.models.HeroConfig || mongoose.model<IHeroConfig>('HeroConfig', HeroConfigSchema);
export default HeroConfig;
