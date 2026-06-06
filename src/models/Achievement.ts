import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAchievement extends Document {
  title: string;
  description: string;
  image: string;
  date: Date;
  certificateLink: string;
  order: number;
  createdAt: Date;
}

const AchievementSchema = new Schema<IAchievement>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    date: { type: Date, required: true },
    certificateLink: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Achievement: Model<IAchievement> =
  mongoose.models.Achievement || mongoose.model<IAchievement>('Achievement', AchievementSchema);
export default Achievement;
