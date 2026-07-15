import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: { type: String, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    // For consultation requests (from BookConsultation page)
    type: {
      type: String,
      enum: ['CONTACT', 'CONSULTATION'],
      default: 'CONTACT',
    },
    consultationDate: { type: String },
    consultationTime: { type: String },
    serviceArea: { type: String },
    company: { type: String, trim: true },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'RESOLVED', 'PENDING', 'COMPLETED', 'CLOSED'],
      default: 'NEW',
    },
    adminNotes: { type: String },
    assigned_lawyer: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
export default Contact;
