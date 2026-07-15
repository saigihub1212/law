import { NextResponse } from 'next/server';
import { authRequired } from '@/lib/apiHelper';
import User from '@/models/User';

export const DELETE = authRequired(
  async (req, { params }) => {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ detail: 'User not found.' }, { status: 404 });
    }
    if (user.role === 'SUPERADMIN') {
      return NextResponse.json({ detail: 'Cannot delete superadmin account.' }, { status: 400 });
    }
    await user.deleteOne();
    return NextResponse.json({ detail: 'User deleted.' });
  },
  ['SUPERADMIN']
);
