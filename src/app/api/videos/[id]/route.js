import { NextResponse } from 'next/server';
import { authRequired } from '@/lib/apiHelper';
import Video from '@/models/Video';

const extractYoutubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// PUT: Admin update video
export const PUT = authRequired(
  async (req, { params }) => {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const { title, description, youtube_url, display_order, is_active } = await req.json();

    const video = await Video.findById(id);
    if (!video) {
      return NextResponse.json({ detail: 'Video profile not found.' }, { status: 404 });
    }

    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (display_order !== undefined) video.display_order = display_order;
    if (is_active !== undefined) video.is_active = is_active;

    if (youtube_url && youtube_url !== video.youtube_url) {
      const youtubeVideoId = extractYoutubeId(youtube_url);
      if (!youtubeVideoId) {
        return NextResponse.json({ detail: 'Invalid YouTube URL structure.' }, { status: 400 });
      }
      video.youtube_url = youtube_url;
      video.youtube_video_id = youtubeVideoId;
    }

    await video.save();
    return NextResponse.json(video);
  },
  ['ADMIN', 'SUPERADMIN']
);

// DELETE: Admin delete video
export const DELETE = authRequired(
  async (req, { params }) => {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const video = await Video.findByIdAndDelete(id);
    if (!video) {
      return NextResponse.json({ detail: 'Video profile not found.' }, { status: 404 });
    }

    return NextResponse.json({ detail: 'Video profile deleted successfully.' });
  },
  ['ADMIN', 'SUPERADMIN']
);
