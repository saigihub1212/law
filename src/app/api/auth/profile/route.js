import { NextResponse } from 'next/server';
import { authRequired } from '@/lib/apiHelper';

export const GET = authRequired(async (req) => {
  const user = req.user;
  return NextResponse.json({
    id: user._id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    createdAt: user.createdAt,
  });
});
