import { NextResponse } from 'next/server';
import { authRequired } from '@/lib/apiHelper';
import User from '@/models/User';

export const POST = authRequired(async (req) => {
  const { old_password, new_password } = await req.json();

  if (!old_password || !new_password) {
    return NextResponse.json({ detail: 'Both old and new password are required.' }, { status: 400 });
  }
  if (new_password.length < 6) {
    return NextResponse.json({ detail: 'New password must be at least 6 characters.' }, { status: 400 });
  }

  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(old_password))) {
    return NextResponse.json({ old_password: ['Wrong password.'] }, { status: 400 });
  }

  user.password = new_password;
  await user.save();

  return NextResponse.json({ detail: 'Password updated successfully.' });
});
