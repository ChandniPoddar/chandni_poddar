import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string;
  images: string[];
  githubUrl: string;
  liveUrl: string;
  category: string;
  technologies: string[];
  featured: boolean;
  status: 'completed' | 'in-progress' | 'archived';
  order: number;
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    shortDescription: { type: String, required: true, maxlength: 200 },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    images: { type: [String], default: [] },
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    category: {
      type: String,
      required: true,
      enum: ['Web Development', 'Mobile Applications', 'AI/ML', 'IoT', 'Full Stack', 'Academic Projects'],
    },
    technologies: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['completed', 'in-progress', 'archived'], default: 'completed' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
export default Project;
