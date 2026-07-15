import { NextResponse } from 'next/server';
import { withDb } from '@/lib/apiHelper';
import AIChat from '@/models/AIChat';

export const GET = withDb(async (req, { params }) => {
  const resolvedParams = await params;
  const { sessionId } = resolvedParams;

  const chatSession = await AIChat.findOne({ sessionId });

  if (!chatSession) {
    return NextResponse.json({ detail: 'Session not found.' }, { status: 404 });
  }

  return NextResponse.json({
    sessionId: chatSession.sessionId,
    messages: chatSession.messages,
    createdAt: chatSession.createdAt,
  });
});
