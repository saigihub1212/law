import { NextResponse } from 'next/server';
import { withDb } from '@/lib/apiHelper';
import User from '@/models/User';
import crypto from 'crypto';

export const POST = withDb(async (req, { params }) => {
  const resolvedParams = await params;
  const { token } = resolvedParams;

  const { password, confirm_password } = await req.json();

  if (!password) {
    return NextResponse.json({ detail: 'New password is required.' }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ detail: 'Password must be at least 6 characters.' }, { status: 400 });
  }

  if (password !== confirm_password) {
    return NextResponse.json({ detail: 'Passwords do not match.' }, { status: 400 });
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return NextResponse.json({ detail: 'Password reset token is invalid or has expired.' }, { status: 400 });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return NextResponse.json({ detail: 'Password reset successful.' });
});
