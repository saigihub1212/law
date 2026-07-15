import { NextResponse } from 'next/server';
import { authRequired } from '@/lib/apiHelper';
import AIChat from '@/models/AIChat';

export const DELETE = authRequired(
  async (req, { params }) => {
    const resolvedParams = await params;
    const { sessionId } = resolvedParams;

    await AIChat.findOneAndDelete({ sessionId });
    return NextResponse.json({ detail: 'Session deleted.' });
  },
  ['ADMIN', 'SUPERADMIN']
);
