import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyAccessToken } from '@/utils/token';

export function withDb(handler) {
  return async (req, ...args) => {
    try {
      await connectDB();
      return await handler(req, ...args);
    } catch (error) {
      console.error('[API Error]', error);
      return new Response(JSON.stringify({ detail: error.message || 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  };
}

export async function getAuthenticatedUser(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId);
    return user;
  } catch (err) {
    return null;
  }
}

export function authRequired(handler, roles = []) {
  return withDb(async (req, ...args) => {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return new Response(JSON.stringify({ detail: 'Authentication credentials were not provided.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (roles.length > 0 && !roles.includes(user.role)) {
      return new Response(JSON.stringify({ detail: 'You do not have permission to perform this action.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    req.user = user;
    return await handler(req, ...args);
  });
}
