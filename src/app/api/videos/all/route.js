import { NextResponse } from 'next/server';
import { authRequired } from '@/lib/apiHelper';
import Video from '@/models/Video';

export const GET = authRequired(
  async (req) => {
    const videos = await Video.find().sort({ display_order: 1, createdAt: -1 });
    return NextResponse.json(videos);
  },
  ['ADMIN', 'SUPERADMIN']
);
