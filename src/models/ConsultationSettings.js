import mongoose from 'mongoose';

const consultationSettingsSchema = new mongoose.Schema(
  {
    dailyLimit: {
      type: Number,
      default: 3,
      min: [1, 'Daily consultation limit must be at least 1'],
    },
  },
  { timestamps: true }
);

consultationSettingsSchema.statics.getSingleton = async function () {
  let settings = await this.findOne();

  if (!settings) {
    settings = await this.create({});
  }

  return settings;
};

const ConsultationSettings = mongoose.models.ConsultationSettings || mongoose.model('ConsultationSettings', consultationSettingsSchema);
export default ConsultationSettings;
