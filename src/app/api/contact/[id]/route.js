import { NextResponse } from 'next/server';
import { authRequired } from '@/lib/apiHelper';
import Contact from '@/models/Contact';

// PATCH: Update contact
export const PATCH = authRequired(
  async (req, { params }) => {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const { status, adminNotes } = await req.json();

    const contact = await Contact.findByIdAndUpdate(
      id,
      { ...(status && { status }), ...(adminNotes !== undefined && { adminNotes }) },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return NextResponse.json({ detail: 'Contact not found.' }, { status: 404 });
    }

    return NextResponse.json(contact);
  },
  ['ADMIN', 'SUPERADMIN']
);

// DELETE: Delete contact
export const DELETE = authRequired(
  async (req, { params }) => {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return NextResponse.json({ detail: 'Contact not found.' }, { status: 404 });
    }

    return NextResponse.json({ detail: 'Contact deleted.' });
  },
  ['ADMIN', 'SUPERADMIN']
);
