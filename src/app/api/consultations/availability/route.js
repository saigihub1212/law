import { NextResponse } from 'next/server';
import { withDb } from '@/lib/apiHelper';
import Contact from '@/models/Contact';
import ConsultationSettings from '@/models/ConsultationSettings';

const ACTIVE_CONSULTATION_STATUSES = ['NEW', 'PENDING', 'CONTACTED', 'COMPLETED'];
const isValidDateString = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value || '');

const getDailyLimit = async () => {
  const settings = await ConsultationSettings.getSingleton();
  return Math.max(Number(settings.dailyLimit) || 1, 1);
};

export const GET = withDb(async (req) => {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');

  if (!date || !isValidDateString(date)) {
    return NextResponse.json({ detail: 'Please provide a valid date.' }, { status: 400 });
  }

  const dailyLimit = await getDailyLimit();
  const consultations = await Contact.find({
    type: 'CONSULTATION',
    consultationDate: date,
    status: { $in: ACTIVE_CONSULTATION_STATUSES },
  }).select('consultationTime status');

  const bookedSlots = consultations.map((consultation) => consultation.consultationTime);
  const bookedCount = consultations.length;

  return NextResponse.json({
    date,
    dailyLimit,
    bookedCount,
    remainingSlots: Math.max(dailyLimit - bookedCount, 0),
    isAvailable: bookedCount < dailyLimit,
    bookedSlots,
  });
});
