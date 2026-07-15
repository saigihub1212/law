import { NextResponse } from 'next/server';
import { authRequired } from '@/lib/apiHelper';
import ConsultationSettings from '@/models/ConsultationSettings';

// GET: Retrieve settings
export const GET = authRequired(
  async (req) => {
    const settings = await ConsultationSettings.getSingleton();
    return NextResponse.json({
      dailyLimit: settings.dailyLimit,
    });
  },
  ['ADMIN', 'SUPERADMIN']
);

// PATCH: Update settings
export const PATCH = authRequired(
  async (req) => {
    const { dailyLimit } = await req.json();
    const nextDailyLimit = Number(dailyLimit);

    if (!Number.isInteger(nextDailyLimit) || nextDailyLimit < 1) {
      return NextResponse.json(
        { detail: 'Daily consultation limit must be a whole number greater than 0.' },
        { status: 400 }
      );
    }

    const settings = await ConsultationSettings.getSingleton();
    settings.dailyLimit = nextDailyLimit;
    await settings.save();

    return NextResponse.json({ dailyLimit: settings.dailyLimit });
  },
  ['ADMIN', 'SUPERADMIN']
);
