import { NextResponse } from 'next/server';
import { authRequired } from '@/lib/apiHelper';
import Contact from '@/models/Contact';

export const GET = authRequired(
  async (req) => {
    const [total, newCount, consultations] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'NEW' }),
      Contact.countDocuments({ type: 'CONSULTATION' }),
    ]);

    return NextResponse.json({ total, new: newCount, consultations });
  },
  ['ADMIN', 'SUPERADMIN']
);
