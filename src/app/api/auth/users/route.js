import { NextResponse } from 'next/server';
import { authRequired } from '@/lib/apiHelper';
import User from '@/models/User';

export const GET = authRequired(
  async (req) => {
    const users = await User.find().sort({ createdAt: -1 });
    return NextResponse.json(users);
  },
  ['ADMIN', 'SUPERADMIN']
);
