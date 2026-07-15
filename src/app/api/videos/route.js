import { NextResponse } from 'next/server';
import { withDb, authRequired } from '@/lib/apiHelper';
import Video from '@/models/Video';

const extractYoutubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// GET: Public list active videos
export const GET = withDb(async () => {
  const videos = await Video.find({ is_active: true }).sort({ display_order: 1, createdAt: -1 });
  return NextResponse.json(videos);
});

// POST: Admin create video
export const POST = authRequired(
  async (req) => {
    const { title, description, youtube_url, display_order, is_active } = await req.json();

    if (!title || !youtube_url) {
      return NextResponse.json({ detail: 'Title and YouTube URL are required.' }, { status: 400 });
    }

    const youtubeVideoId = extractYoutubeId(youtube_url);
    if (!youtubeVideoId) {
      return NextResponse.json({ detail: 'Invalid YouTube URL structure. Please provide a valid link.' }, { status: 400 });
    }

    const video = await Video.create({
      title,
      description,
      youtube_url,
      youtube_video_id: youtubeVideoId,
      display_order: display_order || 0,
      is_active: is_active !== undefined ? is_active : true,
    });

    return NextResponse.json(video, { status: 201 });
  },
  ['ADMIN', 'SUPERADMIN']
);
