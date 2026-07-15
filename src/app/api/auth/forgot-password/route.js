import { NextResponse } from 'next/server';
import { withDb } from '@/lib/apiHelper';
import User from '@/models/User';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email';

export const POST = withDb(async (req) => {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ detail: 'Email is required.' }, { status: 400 });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  const genericResponse = { detail: 'If that email address is registered, a password reset link has been sent.' };

  if (!user) {
    return NextResponse.json(genericResponse);
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

  await user.save({ validateBeforeSave: false });

  const host = req.headers.get('origin') || 'http://localhost:3000';
  const resetUrl = `${host}/reset-password/${resetToken}`;
  const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.\n`;

  await sendEmail({
    to: user.email,
    subject: 'SR4IPR Partners - Password Reset',
    text: message,
  });

  return NextResponse.json(genericResponse);
});
