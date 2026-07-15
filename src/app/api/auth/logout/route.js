import { NextResponse } from 'next/server';
import { authRequired } from '@/lib/apiHelper';
import User from '@/models/User';

export const POST = authRequired(async (req) => {
  // Clear refresh token from DB
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  return NextResponse.json({ detail: 'Logout successful.' });
});
