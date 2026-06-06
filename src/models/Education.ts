import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEducation extends Document {
  institute: string;
  degree: string;
  field: string;
  cgpa: string;
  percentage: string;
  startYear: string;
  endYear: string;
  description: string;
  order: number;
  createdAt: Date;
}

const EducationSchema = new Schema<IEducation>(
  {
    institute: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    field: { type: String, default: '' },
    cgpa: { type: String, default: '' },
    percentage: { type: String, default: '' },
    startYear: { type: String, required: true },
    endYear: { type: String, required: true },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Education: Model<IEducation> =
  mongoose.models.Education || mongoose.model<IEducation>('Education', EducationSchema);
export default Education;
