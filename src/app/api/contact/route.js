import { NextResponse } from 'next/server';
import { withDb, authRequired } from '@/lib/apiHelper';
import Contact from '@/models/Contact';
import { sendContactNotification } from '@/lib/email';

// POST: Public submission (contact form)
export const POST = withDb(async (req) => {
  const {
    name, email, phone, subject, message, type,
    consultationDate, consultationTime, serviceArea, company,
  } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ detail: 'Name, email, and message are required.' }, { status: 400 });
  }

  const contact = await Contact.create({
    name, email, phone, subject, message,
    type: type || 'CONTACT',
    consultationDate, consultationTime, serviceArea, company,
  });

  // Send email notifications asynchronously
  sendContactNotification(contact).catch((err) => {
    console.error('[Notification error]', err);
  });

  return NextResponse.json({
    detail: 'Your message has been received. We will be in touch shortly.',
    id: contact._id,
  }, { status: 201 });
});

// GET: Admin only list contacts
export const GET = authRequired(
  async (req) => {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const [contacts, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(filter),
    ]);

    return NextResponse.json({
      contacts,
      pagination: { total, page, limit },
    });
  },
  ['ADMIN', 'SUPERADMIN']
);
