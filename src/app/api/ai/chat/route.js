import { NextResponse } from 'next/server';
import { withDb, getAuthenticatedUser } from '@/lib/apiHelper';
import AIChat from '@/models/AIChat';
import { callAI } from '@/lib/ai/groq.service';
import { v4 as uuidv4 } from 'uuid';

export const POST = withDb(async (req) => {
  const { message, sessionId } = await req.json();

  if (!message || !message.trim()) {
    return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
  }

  const user = await getAuthenticatedUser(req);
  const sid = sessionId || uuidv4();

  // Load existing conversation from DB
  let chatSession = await AIChat.findOne({ sessionId: sid });
  const history = chatSession ? chatSession.messages : [];

  // Call AI (Groq or rule-engine)
  const { response, method } = await callAI(message.trim(), history);

  // Save messages to DB
  if (!chatSession) {
    const userAgent = req.headers.get('user-agent') || 'unknown';
    // Access IP address: Next.js standard is checking headers or req.ip
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

    chatSession = new AIChat({
      sessionId: sid,
      userId: user?._id || null,
      metadata: {
        ipAddress: ip,
        userAgent: userAgent,
      },
      messages: [],
    });
  }

  chatSession.messages.push({ role: 'user', content: message.trim() });
  chatSession.messages.push({ role: 'assistant', content: response, method });
  await chatSession.save();

  return NextResponse.json({
    response,
    method,
    sessionId: sid,
  });
});
