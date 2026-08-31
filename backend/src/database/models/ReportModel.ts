import mongoose, { Schema, Document } from 'mongoose';

export interface IReportDocument extends Omit<Document, 'model'> {
  vehicleId: mongoose.Types.ObjectId;
  reporterId: mongoose.Types.ObjectId;
  reason: string;
  description?: string;
  status: 'Pending' | 'Reviewed' | 'Dismissed';
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema: Schema = new Schema(
  {
    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true, index: true },
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['Pending', 'Reviewed', 'Dismissed'], default: 'Pending' }
  },
  { timestamps: true }
);

export const ReportModel = mongoose.model<IReportDocument>('Report', ReportSchema);
