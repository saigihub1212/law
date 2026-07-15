import { NextResponse } from 'next/server';
import { withDb, authRequired } from '@/lib/apiHelper';
import Contact from '@/models/Contact';
import ConsultationSettings from '@/models/ConsultationSettings';
import { sendContactNotification } from '@/lib/email';

const ACTIVE_CONSULTATION_STATUSES = ['NEW', 'PENDING', 'CONTACTED', 'COMPLETED'];
const isValidDateString = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value || '');

const getDailyLimit = async () => {
  const settings = await ConsultationSettings.getSingleton();
  return Math.max(Number(settings.dailyLimit) || 1, 1);
};

const mapConsultation = (doc) => {
  if (!doc) return null;
  return {
    id: doc._id,
    _id: doc._id,
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    company: doc.company,
    date: doc.consultationDate,
    time: doc.consultationTime,
    service: doc.serviceArea,
    message: doc.message,
    status: doc.status,
    assigned_lawyer: doc.assigned_lawyer,
    notes: doc.notes,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

// POST: Public consultation creation
export const POST = withDb(async (req) => {
  const {
    name, email, phone, company, date, time, service, message,
  } = await req.json();

  if (!name || !email || !date || !time || !message) {
    return NextResponse.json({ detail: 'Name, email, date, time, and message are required.' }, { status: 400 });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return NextResponse.json({ detail: 'Please enter a valid email address.' }, { status: 400 });
  }

  if (!isValidDateString(date)) {
    return NextResponse.json({ detail: 'Please select a valid consultation date.' }, { status: 400 });
  }
  const selectedDate = new Date(`${date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return NextResponse.json({ detail: 'Consultation date must be in the future.' }, { status: 400 });
  }

  const [dailyLimit, duplicateBooking, activeBookingCount] = await Promise.all([
    getDailyLimit(),
    Contact.findOne({
      type: 'CONSULTATION',
      email: normalizedEmail,
      consultationDate: date,
      consultationTime: time,
      status: { $ne: 'CLOSED' },
    }),
    Contact.countDocuments({
      type: 'CONSULTATION',
      consultationDate: date,
      status: { $in: ACTIVE_CONSULTATION_STATUSES },
    }),
  ]);

  if (duplicateBooking) {
    return NextResponse.json({ detail: 'You already booked this date and time.' }, { status: 409 });
  }

  if (activeBookingCount >= dailyLimit) {
    return NextResponse.json({
      detail: 'This date is fully booked. Please choose another date.',
      dailyLimit,
      bookedCount: activeBookingCount,
    }, { status: 409 });
  }

  const consultation = await Contact.create({
    name,
    email: normalizedEmail,
    phone,
    company,
    consultationDate: date,
    consultationTime: time,
    serviceArea: service,
    message,
    type: 'CONSULTATION',
    status: 'PENDING',
  });

  // Send email notifications
  sendContactNotification(consultation).catch(() => {});

  return NextResponse.json(mapConsultation(consultation), { status: 201 });
});

// GET: Admin listing consultations
export const GET = authRequired(
  async (req) => {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    const filter = { type: 'CONSULTATION' };
    if (date) {
      filter.consultationDate = date;
    }

    const list = await Contact.find(filter).sort({ createdAt: -1 });
    const mapped = list.map(mapConsultation);

    return NextResponse.json(mapped);
  },
  ['ADMIN', 'SUPERADMIN']
);
