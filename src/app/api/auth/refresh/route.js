import { NextResponse } from 'next/server';
import { withDb } from '@/lib/apiHelper';
import User from '@/models/User';
import { generateAccessToken, verifyRefreshToken } from '@/utils/token';

export const POST = withDb(async (req) => {
  const { refresh } = await req.json();

  if (!refresh) {
    return NextResponse.json({ detail: 'Refresh token is required.' }, { status: 400 });
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refresh);
  } catch {
    return NextResponse.json({ detail: 'Invalid or expired refresh token.' }, { status: 401 });
  }

  const user = await User.findById(decoded.userId).select('+refreshToken');

  if (!user || user.refreshToken !== refresh) {
    return NextResponse.json({ detail: 'Refresh token is invalid or has been revoked.' }, { status: 401 });
  }

  const access = generateAccessToken(user._id, user.role);

  return NextResponse.json({ access });
});
