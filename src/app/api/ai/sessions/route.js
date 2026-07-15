import { NextResponse } from 'next/server';
import { authRequired } from '@/lib/apiHelper';
import AIChat from '@/models/AIChat';

export const GET = authRequired(
  async (req) => {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const [sessions, total] = await Promise.all([
      AIChat.find()
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('sessionId messages createdAt updatedAt userId'),
      AIChat.countDocuments(),
    ]);

    return NextResponse.json({
      sessions: sessions.map((s) => ({
        sessionId: s.sessionId,
        messageCount: s.messages.length,
        lastMessage: s.messages[s.messages.length - 1]?.content?.slice(0, 100),
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })),
      pagination: { total, page, limit },
    });
  },
  ['ADMIN', 'SUPERADMIN']
);
