import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICertificate extends Document {
  title: string;
  issuer: string;
  issueDate: Date;
  credentialUrl: string;
  image: string;
  order: number;
  createdAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    issueDate: { type: Date, required: true },
    credentialUrl: { type: String, default: '' },
    image: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Certificate: Model<ICertificate> =
  mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema);
export default Certificate;
