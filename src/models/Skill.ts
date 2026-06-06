import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category: string;
  icon: string;
  color: string;
  order: number;
  createdAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Programming Languages', 'Frontend', 'Backend', 'Database', 'Tools', 'AI & Cloud', 'Mobile'],
    },
    icon: { type: String, default: '' },
    color: { type: String, default: '#2563EB' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Skill: Model<ISkill> = mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);
export default Skill;
