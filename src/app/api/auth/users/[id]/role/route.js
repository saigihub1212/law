import { NextResponse } from 'next/server';
import { authRequired } from '@/lib/apiHelper';
import User from '@/models/User';

export const PATCH = authRequired(
  async (req, { params }) => {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const { role } = await req.json();

    if (!['ADMIN', 'CLIENT'].includes(role)) {
      return NextResponse.json({ detail: 'Invalid role.' }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      return NextResponse.json({ detail: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json(user);
  },
  ['SUPERADMIN']
);
