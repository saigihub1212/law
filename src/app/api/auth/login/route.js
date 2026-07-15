import { NextResponse } from 'next/server';
import { withDb } from '@/lib/apiHelper';
import User from '@/models/User';
import { generateAccessToken, generateRefreshToken } from '@/utils/token';

export const POST = withDb(async (req) => {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ detail: 'Email and password are required.' }, { status: 400 });
  }

  // Explicitly select password (it is excluded by default)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return NextResponse.json({ detail: 'Invalid email or password.' }, { status: 401 });
  }

  const access = generateAccessToken(user._id, user.role);
  const refresh = generateRefreshToken(user._id);

  // Store refresh token in DB
  user.refreshToken = refresh;
  await user.save({ validateBeforeSave: false });

  return NextResponse.json({
    access,
    refresh,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
});
